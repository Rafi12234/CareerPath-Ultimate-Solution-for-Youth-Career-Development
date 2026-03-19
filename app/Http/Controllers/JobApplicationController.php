<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\ScreeningQuestion;
use App\Models\ScreeningResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

        // Build pre-filled personal info from user profile
        $personalInfo = [
            'full_name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? '',
            'address' => $user->present_address ?? '',
            'date_of_birth' => $user->date_of_birth ?? '',
            'nationality' => $user->nationality ?? '',
        ];

        // Build work experience snapshot
        $workExperience = $user->is_fresher ? [] : [
            [
                'job_title' => $user->current_job_title ?? '',
                'company' => $user->current_company ?? '',
                'employment_dates' => 'Currently employed',
                'description' => $user->current_job_description ?? '',
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

        // Fetch screening questions for this job
        $screeningQuestions = $job->screeningQuestions;

        return response()->json([
            'job' => $job,
            'pre_filled' => [
                'personal_info' => $personalInfo,
                'work_experience' => $workExperience,
                'education_info' => $educationInfo,
                'skills' => $skills,
            ],
            'screening_questions' => $screeningQuestions,
            'is_fresher' => $user->is_fresher,
        ]);
    }

    /**
     * Store comprehensive job application with all details
     */
    public function store(Request $request)
    {
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
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // 5MB
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);

        // Check if already applied
        $existing = JobApplication::where('user_id', $request->user_id)
            ->where('job_id', $request->job_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already applied to this job'], 409);
        }

        // Handle resume upload
        $resumePath = null;
        if ($request->hasFile('resume')) {
            $file = $request->file('resume');
            $path = "applications/{$request->user_id}/resumes";
            $resumePath = $file->store($path, 'public');
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
            return response()->json(['cover_letter' => $aiResponse]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate cover letter',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Build prompt for AI cover letter generation
     */
    private function buildCoverLetterPrompt($job, $userProfile)
    {
        $skills = implode(', ', $userProfile['skills'] ?? []);
        $experience = $userProfile['years_of_experience'] ?? 0;

        return <<<PROMPT
You are a professional career coach. Generate a professional, humanly-written cover letter (3-4 paragraphs) for the following job application:

**Job Details:**
- Position: {$job->title}
- Company: {$job->company}
- Location: {$job->location}
- Job Description: {$job->description}
- Required Skills: {implode(', ', $job->skills ?? [])}

**Candidate Profile:**
- Name: {$userProfile['name']}
- Skills: {$skills}
- Years of Experience: {$experience}
- Education: {$userProfile['education']}

Write a compelling, concise cover letter that:
1. Opens with enthusiasm for the position
2. Highlights relevant skills and experience
3. Explains why they're interested in the company
4. Closes with a call to action

Make it personal, professional, and authentic.
PROMPT;
    }

    /**
     * Call AI service (OpenAI API)
     */
    private function callAIService($prompt)
    {
        $apiKey = config('services.openai.api_key');
        
        if (!$apiKey) {
            throw new \Exception('OpenAI API key not configured');
        }

        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a professional career coach writing cover letters.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0.7,
            'max_tokens' => 800,
        ]);

        if ($response->failed()) {
            throw new \Exception('AI API call failed: ' . $response->body());
        }

        return $response->json()['choices'][0]['message']['content'];
    }
}
