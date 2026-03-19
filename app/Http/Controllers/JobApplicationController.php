<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\ScreeningQuestion;
use App\Models\ScreeningResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class JobApplicationController extends Controller
{
    /**
     * List applications — optionally filter by user_id.
     */
    public function index(Request $request)
    {
        $userId = $request->query('user_id');

        if ($userId) {
            return response()->json(
                JobApplication::where('user_id', $userId)
                    ->with('job', 'screeningResponses.screeningQuestion')
                    ->latest()
                    ->get()
            );
        }

        return response()->json(JobApplication::with('job', 'screeningResponses.screeningQuestion')->latest()->get());
    }

    /**
     * Get application form initialization data (pre-filled from user profile + screening questions)
     */
    public function initializeApplication($jobId)
    {
        $job = \App\Models\Job::with('screeningQuestions')->findOrFail($jobId);
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Check if user has already applied to this job
        $existingApplication = JobApplication::where('user_id', $user->id)
            ->where('job_id', $jobId)
            ->first();

        if ($existingApplication) {
            return response()->json([
                'message' => 'You have already applied for this position.',
                'already_applied' => true,
                'application_id' => $existingApplication->id,
            ], 403);
        }

        // Build pre-filled personal info from user profile
        $personalInfo = [
            'full_name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '',
            'address' => $user->present_address ?? '',
            'date_of_birth' => $this->normalizeDateForInput($user->date_of_birth),
            'nationality' => $user->nationality ?? '',
        ];

        // Build work experience snapshot
        $workExperience = $user->is_fresher ? [] : [
            [
                'job_title' => $user->current_job_title ?? '',
                'company' => $user->current_company ?? '',
                'employment_dates' => 'Currently employed',
                'description' => '',
            ],
            ...$user->previous_job_title ? [[
                'job_title' => $user->previous_job_title,
                'company' => $user->previous_company ?? '',
                'employment_dates' => ($user->previous_job_start ?? 'N/A') . ' to ' . ($user->previous_job_end ?? 'N/A'),
                'description' => $user->previous_job_description ?? '',
            ]] : [],
        ];

        // Build education snapshot
        $educationInfo = [
            'ssc' => [
                'school_name' => $user->school_name ?? '',
                'year' => $user->ssc_year ?? '',
                'result' => $user->ssc_result ?? '',
                'group' => $user->ssc_group ?? '',
                'board' => $user->ssc_board ?? '',
            ],
            'hsc' => [
                'college_name' => $user->college_name ?? '',
                'year' => $user->hsc_year ?? '',
                'result' => $user->hsc_result ?? '',
                'group' => $user->hsc_group ?? '',
                'board' => $user->hsc_board ?? '',
            ],
            'university' => [
                'name' => $user->university_name ?? '',
                'status' => $user->university_status ?? '',
                'current_year' => $user->current_study_year ?? '',
                'current_semester' => $user->current_study_semester ?? '',
                'graduation_year' => $user->university_graduation_year ?? '',
                'cgpa' => $user->university_cgpa ?? '',
            ],
        ];

        // Fetch user skills
        $skills = $user->skills()->pluck('skill_name')->toArray();

        return response()->json([
            'job' => $job,
            'pre_filled' => [
                'personal_info' => $personalInfo,
                'work_experience' => $workExperience,
                'education_info' => $educationInfo,
                'skills' => $skills,
            ],
            'screening_questions' => $job->screeningQuestions,
            'is_fresher' => $user->is_fresher,
        ]);
    }

    /**
     * Store comprehensive job application with all details
     */
    public function store(Request $request)
    {
        try {
            $this->normalizeJsonArrayFields($request, [
                'personal_info',
                'work_experience',
                'education_info',
                'skills',
                'references',
                'online_profiles',
                'work_eligibility',
                'additional_documents',
                'screening_responses',
            ]);

            $request->validate([
                'user_id' => 'required|exists:users,id',
                'job_id' => 'required|exists:jobs,id',
                'personal_info' => 'required|array',
                'cover_letter' => 'required|string',
                'work_experience' => 'nullable|array',
                'education_info' => 'nullable|array',
                'skills' => 'nullable|array',
                'references' => 'nullable|array',
                'online_profiles' => 'nullable|array',
                'work_eligibility' => 'nullable|array',
                'additional_documents' => 'nullable|array',
                'screening_responses' => 'nullable|array',
                'resume' => 'nullable|file|mimes:pdf,doc,docx|max:10240', // 10MB
            ]);

            $user = \App\Models\User::findOrFail($request->user_id);

            // Check if already applied
            $existing = JobApplication::where('user_id', $request->user_id)
                ->where('job_id', $request->job_id)
                ->first();

            if ($existing) {
                return response()->json(['message' => 'Already applied to this job'], 409);
            }

            // Handle resume upload to Filestack
            $resumePath = null;
            if ($request->hasFile('resume')) {
                try {
                    $resumePath = $this->uploadResumeToFilestack($request->file('resume'), $request->user_id);
                } catch (\Exception $e) {
                    return response()->json([
                        'message' => 'Failed to upload resume to Filestack: ' . $e->getMessage(),
                        'error' => $e->getMessage(),
                    ], 500);
                }
            }

            // Create application
            $application = JobApplication::create([
                'user_id' => $request->user_id,
                'job_id' => $request->job_id,
                'status' => 'Pending',
                'applied_at' => now(),
                'submitted_at' => now(),
                'personal_info' => $request->personal_info,
                'resume_path' => $resumePath,
                'work_experience' => $request->work_experience,
                'education_info' => $request->education_info,
                'skills' => $request->skills,
                'cover_letter' => $request->cover_letter,
                'additional_documents' => $request->additional_documents,
                'work_eligibility' => $request->work_eligibility,
                'references' => $request->references,
                'online_profiles' => $request->online_profiles,
            ]);

            // Store screening responses
            if ($request->has('screening_responses') && is_array($request->screening_responses)) {
                foreach ($request->screening_responses as $response) {
                    ScreeningResponse::create([
                        'job_application_id' => $application->id,
                        'screening_question_id' => $response['question_id'],
                        'response_text' => $response['response'],
                    ]);
                }
            }

            return response()->json($application->load('job', 'screeningResponses.screeningQuestion'), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Job application submission error', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json([
                'message' => 'Failed to submit application',
                'error' => config('app.debug') ? $e->getMessage() : 'An unexpected error occurred',
            ], 500);
        }
    }

    /**
     * Get single application with all details
     */
    public function show($id)
    {
        $application = JobApplication::with('job', 'user', 'screeningResponses.screeningQuestion')
            ->findOrFail($id);
        return response()->json($application);
    }

    /**
     * Update application (for saving draft)
     */
    public function update(Request $request, $id)
    {
        $application = JobApplication::findOrFail($id);

        $this->normalizeJsonArrayFields($request, [
            'personal_info',
            'work_experience',
            'education_info',
            'skills',
            'references',
            'online_profiles',
            'work_eligibility',
            'additional_documents',
        ]);

        $request->validate([
            'personal_info' => 'nullable|array',
            'cover_letter' => 'nullable|string',
            'work_experience' => 'nullable|array',
            'education_info' => 'nullable|array',
            'skills' => 'nullable|array',
            'references' => 'nullable|array',
            'online_profiles' => 'nullable|array',
            'work_eligibility' => 'nullable|array',
            'additional_documents' => 'nullable|array',
        ]);

        $application->update($request->only([
            'personal_info',
            'cover_letter',
            'work_experience',
            'education_info',
            'skills',
            'references',
            'online_profiles',
            'work_eligibility',
            'additional_documents',
        ]));

        return response()->json($application);
    }

    /**
     * Withdraw / delete an application
     */
    public function destroy($id)
    {
        JobApplication::findOrFail($id)->delete();
        return response()->json(['message' => 'Application withdrawn']);
    }

    /**
     * Generate AI cover letter
     */
    public function generateCoverLetterAI(Request $request)
    {
        $request->validate([
            'job_id' => 'required|exists:jobs,id',
            'user_profile' => 'required|array',
        ]);

        $job = \App\Models\Job::findOrFail($request->job_id);
        $userProfile = $request->user_profile;

        // Build prompt for GPT/AI
        $prompt = $this->buildCoverLetterPrompt($job, $userProfile);

        // Call AI service (OpenAI or similar)
        try {
            $aiResponse = $this->callAIService($prompt);
            if (!is_string($aiResponse) || trim($aiResponse) === '') {
                throw new \Exception('AI returned an empty response');
            }
            return response()->json(['cover_letter' => $aiResponse]);
        } catch (\Exception $e) {
            \Log::warning('AI cover letter generation failed, using fallback.', [
                'job_id' => $job->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'cover_letter' => $this->generateFallbackCoverLetter($job, $userProfile),
                'source' => 'fallback',
            ]);
        }
    }

    /**
     * Build prompt for AI cover letter generation
     */
    private function buildCoverLetterPrompt($job, $userProfile)
    {
        $skills = implode(', ', $userProfile['skills'] ?? []);
        $jobSkills = implode(', ', $job->skills ?? []);
        $experience = $userProfile['years_of_experience'] ?? 0;
        $candidateName = $userProfile['name'] ?? 'Candidate';
        $education = $userProfile['education'] ?? 'Not specified';

        return <<<PROMPT
You are a professional career coach. Generate a professional, humanly-written cover letter (3-4 paragraphs) for the following job application:

**Job Details:**
- Position: {$job->title}
- Company: {$job->company}
- Location: {$job->location}
- Job Description: {$job->description}
- Required Skills: {$jobSkills}

**Candidate Profile:**
- Name: {$candidateName}
- Skills: {$skills}
- Years of Experience: {$experience}
- Education: {$education}

Write a compelling, concise cover letter that:
1. Opens with enthusiasm for the position
2. Highlights relevant skills and experience
3. Explains why they're interested in the company
4. Closes with a call to action

Make it personal, professional, and authentic. Mention the job title and company name naturally in the opening paragraph.
PROMPT;
    }

    /**
     * Call AI service (OpenAI first, Gemini fallback)
     */
    private function callAIService($prompt)
    {
        $openAiKey = config('services.openai.api_key');
        if ($openAiKey) {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$openAiKey}",
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a professional career coach writing cover letters.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.7,
                'max_tokens' => 800,
            ]);

            if ($response->ok()) {
                return $response->json()['choices'][0]['message']['content'] ?? '';
            }
        }

        $geminiKey = config('services.gemini.api_key') ?: env('GEMINI_API_KEY');
        if ($geminiKey) {
            $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $geminiKey;
            $response = Http::timeout(30)->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt],
                        ],
                    ],
                ],
            ]);

            if ($response->ok()) {
                return $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? '';
            }
        }

        throw new \Exception('No AI provider available or provider call failed. Configure OPENAI_API_KEY or GEMINI_API_KEY.');
    }

    /**
     * Upload resume/CV to Filestack and return the direct URL.
     */
    private function uploadResumeToFilestack($file, $userId)
    {
        $fileContent = null;
        try {
            $apiKey = config('services.filestack.api_key') ?: getenv('FILESTACK_API_KEY');

            if (!$apiKey) {
                throw new \Exception('Filestack API key is not configured');
            }

            $filePath = $file->getRealPath();
            if (!$filePath || !file_exists($filePath)) {
                throw new \Exception('Resume file not found on server');
            }

            $fileContent = fopen($filePath, 'r');
            if (!$fileContent) {
                throw new \Exception('Cannot read resume file');
            }

            $endpoints = [
                'https://upload.filestackapi.com/api/store/S3',
                'https://www.filestackapi.com/api/store/S3',
                'https://process.filestackapi.com/store/S3',
            ];

            $response = null;
            $lastErrorBody = null;

            foreach ($endpoints as $endpoint) {
                $response = Http::withQueryParameters([
                    'key' => $apiKey,
                ])->attach(
                    'fileUpload',
                    $fileContent,
                    $file->getClientOriginalName()
                )->timeout(60)->post($endpoint);

                if ($response->successful()) {
                    break;
                }

                $lastErrorBody = $response->body();
                \Log::warning('Filestack upload endpoint failed, trying next endpoint', [
                    'endpoint' => $endpoint,
                    'status' => $response->status(),
                    'response' => $lastErrorBody,
                ]);

                // Reset stream pointer for next upload attempt.
                if (is_resource($fileContent)) {
                    rewind($fileContent);
                }
            }

            if (!$response || $response->failed()) {
                $errorBody = $response ? $response->body() : ($lastErrorBody ?? 'No response from Filestack');
                \Log::error('Filestack API error', [
                    'status' => $response ? $response->status() : 'unknown',
                    'response' => $errorBody,
                ]);
                $status = $response ? $response->status() : 'unknown';
                throw new \Exception("Filestack upload failed (HTTP {$status}): {$errorBody}");
            }

            $result = $response->json();
            if (!is_array($result)) {
                $result = [];
            }

            $handle = $result['handle'] ?? null;
            $directUrl = $result['url'] ?? null;

            // Some Filestack store responses include key/path instead of url.
            if (!$handle && !empty($result['key'])) {
                $handle = $result['key'];
            }

            if (!$directUrl && $handle) {
                $directUrl = 'https://cdn.filestackcontent.com/' . ltrim($handle, '/');
            }

            if (!$directUrl) {
                \Log::error('Filestack response missing direct URL', ['response' => $result]);
                throw new \Exception('Filestack did not return a direct file URL');
            }

            \Log::info('Resume uploaded to Filestack', [
                'user_id' => $userId,
                'handle' => $handle ?? 'unknown',
                'url' => $directUrl,
                'file_size' => $result['bytes'] ?? 'unknown',
            ]);

            return $directUrl;
        } catch (\Exception $e) {
            \Log::error('Filestack upload error', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'file' => $file->getClientOriginalName(),
            ]);
            throw $e;
        } finally {
            if (is_resource($fileContent)) {
                @fclose($fileContent);
            }
        }
    }

    /**
     * Generate a personalized fallback cover letter when AI providers are unavailable.
     */
    private function generateFallbackCoverLetter($job, array $userProfile): string
    {
        $name = $userProfile['name'] ?? 'Applicant';
        $experience = $userProfile['years_of_experience'] ?? 0;
        $skills = implode(', ', $userProfile['skills'] ?? []);
        $education = $userProfile['education'] ?? 'my academic background';

        return "Dear Hiring Manager at {$job->company},\n\n"
            . "I am excited to apply for the {$job->title} position at {$job->company}. "
            . "Your focus on {$job->track} and the opportunity to contribute in {$job->location} strongly align with my career goals.\n\n"
            . "I am {$name}, and I bring {$experience} year(s) of relevant experience with skills in {$skills}. "
            . "Through my projects and practical work, I have developed a strong foundation in problem-solving, collaboration, and delivering reliable results.\n\n"
            . "In addition, my education ({$education}) has strengthened my technical and analytical capabilities. "
            . "I am particularly interested in this role because the responsibilities match both my current strengths and my long-term growth direction.\n\n"
            . "Thank you for considering my application. I would welcome the opportunity to discuss how I can contribute to {$job->company}.\n\n"
            . "Sincerely,\n"
            . "{$name}";
    }

    /**
     * Normalize date-like values for HTML date input (YYYY-MM-DD).
     */
    private function normalizeDateForInput($value): string
    {
        if (!$value) {
            return '';
        }

        try {
            return \Carbon\Carbon::parse($value)->format('Y-m-d');
        } catch (\Throwable $e) {
            return substr((string) $value, 0, 10);
        }
    }

    /**
     * Convert JSON strings from multipart payload into arrays for validation.
     */
    private function normalizeJsonArrayFields(Request $request, array $fields): void
    {
        $merged = [];

        foreach ($fields as $field) {
            $value = $request->input($field);

            if (!is_string($value)) {
                continue;
            }

            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $merged[$field] = $decoded;
            }
        }

        if (!empty($merged)) {
            $request->merge($merged);
        }
    }
}
