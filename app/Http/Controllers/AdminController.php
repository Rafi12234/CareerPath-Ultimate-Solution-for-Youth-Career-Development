<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\CourseVideo;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    // ============================================================
    // USERS MANAGEMENT
    // ============================================================

    /**
     * Get all users with their profiles
     */
    public function getAllUsers(Request $request)
    {
        $search = $request->query('search', '');
        $perPage = $request->query('per_page', 15);

        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->with(['skills', 'applications'])
            ->paginate($perPage);

        return response()->json([
            'message' => 'Users retrieved successfully',
            'data' => $users,
        ], 200);
    }

    /**
     * Get single user profile
     */
    public function getUserProfile($userId)
    {
        $user = User::with(['skills', 'applications.job', 'enrollments.course'])->find($userId);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json([
            'message' => 'User profile retrieved',
            'data' => $user,
        ], 200);
    }

    // ============================================================
    // COURSES MANAGEMENT
    // ============================================================

    /**
     * Get all courses
     */
    public function getAllCourses(Request $request)
    {
        $search = $request->query('search', '');
        $level = $request->query('level', '');
        $perPage = $request->query('per_page', 15);

        $courses = Course::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($level, function ($query, $level) {
                $query->where('level', $level);
            })
            ->with('videos')
            ->withCount('enrollments')
            ->paginate($perPage);

        return response()->json([
            'message' => 'Courses retrieved successfully',
            'data' => $courses,
        ], 200);
    }

    /**
     * Create new course
     */
    public function createCourse(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'topic' => 'required|string|max:255',
            'instructor' => 'required|string|max:255',
            'duration' => 'required|string|max:255',
            'level' => 'required|in:Beginner,Intermediate,Advanced',
            'cover_image' => 'nullable|url|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course = Course::create($validator->validated());

        return response()->json([
            'message' => 'Course created successfully',
            'data' => $course,
        ], 201);
    }

    /**
     * Update course
     */
    public function updateCourse(Request $request, $courseId)
    {
        $course = Course::find($courseId);
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'description' => 'string',
            'topic' => 'string|max:255',
            'instructor' => 'string|max:255',
            'duration' => 'string|max:255',
            'level' => 'in:Beginner,Intermediate,Advanced',
            'cover_image' => 'nullable|url|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course->update($validator->validated());

        return response()->json([
            'message' => 'Course updated successfully',
            'data' => $course,
        ], 200);
    }

    /**
     * Delete course
     */
    public function deleteCourse($courseId)
    {
        $course = Course::find($courseId);
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully',
        ], 200);
    }

    /**
     * Get course with all its videos/modules
     */
    public function getCourseDetails($courseId)
    {
        $course = Course::with('videos')->find($courseId);

        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        return response()->json([
            'message' => 'Course details retrieved',
            'data' => $course,
        ], 200);
    }

    /**
     * Upload/update course cover image to Cloudinary and persist URL.
     */
    public function uploadCourseCoverImage(Request $request, $courseId)
    {
        $course = Course::find($courseId);
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'cover_image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('cover_image');
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        if (!$cloudName || !$apiKey || !$apiSecret) {
            return response()->json(['message' => 'Cloudinary not configured'], 500);
        }

        $timestamp = time();
        $params = [
            'folder' => 'careerpath_course_covers',
            'timestamp' => $timestamp,
        ];

        ksort($params);
        $signatureString = collect($params)
            ->map(fn($v, $k) => "{$k}={$v}")
            ->implode('&');
        $signatureString .= $apiSecret;
        $signature = sha1($signatureString);

        $response = Http::attach(
            'file',
            file_get_contents($file->getRealPath()),
            $file->getClientOriginalName()
        )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
            'api_key' => $apiKey,
            'timestamp' => $timestamp,
            'signature' => $signature,
            'folder' => 'careerpath_course_covers',
        ]);

        if (!$response->successful()) {
            return response()->json(['message' => 'Failed to upload course cover image'], 500);
        }

        $imageUrl = $response->json('secure_url');
        $course->cover_image = $imageUrl;
        $course->save();

        return response()->json([
            'message' => 'Course cover image uploaded successfully',
            'data' => $course,
        ], 200);
    }

    // ============================================================
    // COURSE VIDEOS/MODULES MANAGEMENT
    // ============================================================

    /**
     * Add video/module to course
     */
    public function addVideoToModule(Request $request, $courseId)
    {
        $course = Course::find($courseId);
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'url' => 'required|url',
            'duration' => 'required|string|max:50',
            'sequence' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $video = CourseVideo::create([
            'course_id' => $courseId,
            'title' => $request->title,
            'url' => $request->url,
            'duration' => $request->duration,
            'sequence' => $request->sequence,
            'description' => $request->description ?? null,
        ]);

        return response()->json([
            'message' => 'Video added to course successfully',
            'data' => $video,
        ], 201);
    }

    /**
     * Upload video/module to Cloudinary and persist URL to database
     */
    public function uploadCourseVideo(Request $request, $courseId)
    {
        $course = Course::find($courseId);
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'video_file' => 'required|file|mimes:mp4,avi,mov,mkv,webm|max:512000', // 500MB max
            'title' => 'required|string|max:255',
            'duration' => 'required|string|max:50',
            'sequence' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('video_file');
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        if (!$cloudName || !$apiKey || !$apiSecret) {
            return response()->json(['message' => 'Cloudinary not configured'], 500);
        }

        $timestamp = time();
        $params = [
            'folder' => 'careerpath_course_videos',
            'timestamp' => $timestamp,
        ];

        ksort($params);
        $signatureString = collect($params)
            ->map(fn($v, $k) => "{$k}={$v}")
            ->implode('&');
        $signatureString .= $apiSecret;
        $signature = sha1($signatureString);

        $response = Http::timeout(180)->attach(
            'file',
            file_get_contents($file->getRealPath()),
            $file->getClientOriginalName()
        )->post("https://api.cloudinary.com/v1_1/{$cloudName}/video/upload", [
            'api_key' => $apiKey,
            'timestamp' => $timestamp,
            'signature' => $signature,
            'folder' => 'careerpath_course_videos',
        ]);

        if (!$response->successful()) {
            $cloudinaryMessage = $response->json('error.message') ?: $response->body();
            Log::error('Cloudinary upload failed', [
                'status' => $response->status(),
                'message' => $cloudinaryMessage,
            ]);
            return response()->json([
                'message' => 'Failed to upload video to Cloudinary',
                'details' => $cloudinaryMessage,
            ], 500);
        }

        $videoUrl = $response->json('secure_url');

        // Get the highest sequence for this course
        $maxSequence = CourseVideo::where('course_id', $courseId)->max('sequence') ?? 0;
        $newSequence = $request->sequence > $maxSequence ? $request->sequence : $maxSequence + 1;

        $video = CourseVideo::create([
            'course_id' => $courseId,
            'title' => $request->title,
            'url' => $videoUrl,
            'duration' => $request->duration,
            'sequence' => $newSequence,
            'description' => $request->description ?? null,
        ]);

        return response()->json([
            'message' => 'Video uploaded to Cloudinary and added to course successfully',
            'data' => $video,
        ], 201);
    }

    /**
     * Replace existing module video file in Cloudinary and update URL in same DB row
     */
    public function replaceVideoFile(Request $request, $videoId)
    {
        $video = CourseVideo::find($videoId);
        if (!$video) {
            return response()->json(['error' => 'Video not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'video_file' => 'required|file|mimes:mp4,avi,mov,mkv,webm|max:512000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('video_file');
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        if (!$cloudName || !$apiKey || !$apiSecret) {
            return response()->json(['message' => 'Cloudinary not configured'], 500);
        }

        $timestamp = time();
        $params = [
            'folder' => 'careerpath_course_videos',
            'timestamp' => $timestamp,
        ];

        ksort($params);
        $signatureString = collect($params)
            ->map(fn($v, $k) => "{$k}={$v}")
            ->implode('&');
        $signatureString .= $apiSecret;
        $signature = sha1($signatureString);

        $response = Http::timeout(180)->attach(
            'file',
            file_get_contents($file->getRealPath()),
            $file->getClientOriginalName()
        )->post("https://api.cloudinary.com/v1_1/{$cloudName}/video/upload", [
            'api_key' => $apiKey,
            'timestamp' => $timestamp,
            'signature' => $signature,
            'folder' => 'careerpath_course_videos',
        ]);

        if (!$response->successful()) {
            $cloudinaryMessage = $response->json('error.message') ?: $response->body();
            Log::error('Cloudinary replace upload failed', [
                'status' => $response->status(),
                'message' => $cloudinaryMessage,
            ]);
            return response()->json([
                'message' => 'Failed to upload video to Cloudinary',
                'details' => $cloudinaryMessage,
            ], 500);
        }

        $video->update([
            'url' => $response->json('secure_url'),
        ]);

        return response()->json([
            'message' => 'Video replaced successfully',
            'data' => $video,
        ], 200);
    }

    /**
     * Update video/module
     */
    public function updateVideo(Request $request, $videoId)
    {
        $video = CourseVideo::find($videoId);
        if (!$video) {
            return response()->json(['error' => 'Video not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'url' => 'nullable|url',
            'duration' => 'nullable|string|max:50',
            'sequence' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        if ($request->exists('url') && $request->input('url') === null) {
            $data['url'] = null;
        }

        $video->update($data);

        return response()->json([
            'message' => 'Video updated successfully',
            'data' => $video,
        ], 200);
    }

    /**
     * Remove only the video URL from a module row (keeps title/description/sequence)
     */
    public function removeVideoLink($videoId)
    {
        $video = CourseVideo::find($videoId);
        if (!$video) {
            return response()->json(['error' => 'Video not found'], 404);
        }

        $video->update(['url' => null]);

        return response()->json([
            'message' => 'Video link removed successfully',
            'data' => $video,
        ], 200);
    }

    /**
     * Delete video/module
     */
    public function deleteVideo($videoId)
    {
        $video = CourseVideo::find($videoId);
        if (!$video) {
            return response()->json(['error' => 'Video not found'], 404);
        }

        $video->delete();

        return response()->json([
            'message' => 'Video deleted successfully',
        ], 200);
    }

    // ============================================================
    // JOBS MANAGEMENT
    // ============================================================

    /**
     * Get all jobs
     */
    public function getAllJobs(Request $request)
    {
        $search = $request->query('search', '');
        $level = $request->query('level', '');
        $track = $request->query('track', '');
        $perPage = $request->query('per_page', 15);

        $jobs = Job::query()
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($level, function ($query, $level) {
                $query->where('level', $level);
            })
            ->when($track, function ($query, $track) {
                $query->where('track', $track);
            })
            ->with('applications')
            ->withCount('applications')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'message' => 'Jobs retrieved successfully',
            'data' => $jobs,
        ], 200);
    }

    /**
     * Create new job
     */
    public function createJob(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'type' => 'required|in:Full-time,Part-time,Internship,Contract,Remote',
            'level' => 'required|in:Entry Level,Mid Level,Senior',
            'description' => 'required|string',
            'salary_min' => 'required|integer',
            'salary_max' => 'required|integer|gte:salary_min',
            'track' => 'required|string|max:255',
            'skills' => 'nullable|array', // Array of skills
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $jobData = $request->validated();
        $jobData['skills'] = json_encode($request->skills ?? []);

        $job = Job::create($jobData);

        return response()->json([
            'message' => 'Job created successfully',
            'data' => $job,
        ], 201);
    }

    /**
     * Update job
     */
    public function updateJob(Request $request, $jobId)
    {
        $job = Job::find($jobId);
        if (!$job) {
            return response()->json(['error' => 'Job not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'company' => 'string|max:255',
            'location' => 'string|max:255',
            'type' => 'in:Full-time,Part-time,Internship,Contract,Remote',
            'level' => 'in:Entry Level,Mid Level,Senior',
            'description' => 'string',
            'salary_min' => 'integer',
            'salary_max' => 'integer',
            'track' => 'string|max:255',
            'skills' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $jobData = $request->validated();
        if (isset($jobData['skills'])) {
            $jobData['skills'] = json_encode($jobData['skills']);
        }

        $job->update($jobData);

        return response()->json([
            'message' => 'Job updated successfully',
            'data' => $job,
        ], 200);
    }

    /**
     * Delete job
     */
    public function deleteJob($jobId)
    {
        $job = Job::find($jobId);
        if (!$job) {
            return response()->json(['error' => 'Job not found'], 404);
        }

        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully',
        ], 200);
    }

    // ============================================================
    // JOB APPLICATIONS MANAGEMENT
    // ============================================================

    /**
     * Get all job applications
     */
    public function getAllApplications(Request $request)
    {
        $status = $request->query('status', '');
        $jobId = $request->query('job_id', '');
        $perPage = $request->query('per_page', 15);

        $applications = JobApplication::query()
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($jobId, function ($query, $jobId) {
                $query->where('job_id', $jobId);
            })
            ->with([
                'user',
                'job.screeningQuestions',
                'screeningResponses.screeningQuestion',
            ])
            ->orderBy('applied_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'message' => 'Applications retrieved successfully',
            'data' => $applications,
        ], 200);
    }

    /**
     * Get applications for specific job
     */
    public function getJobApplications($jobId)
    {
        $job = Job::find($jobId);
        if (!$job) {
            return response()->json(['error' => 'Job not found'], 404);
        }

        $applications = JobApplication::where('job_id', $jobId)
            ->with([
                'user',
                'job.screeningQuestions',
                'screeningResponses.screeningQuestion',
            ])
            ->orderBy('applied_at', 'desc')
            ->get();

        return response()->json([
            'message' => 'Job applications retrieved',
            'data' => $applications,
        ], 200);
    }

    /**
     * Update application status
     */
    public function updateApplicationStatus(Request $request, $applicationId)
    {
        $application = JobApplication::find($applicationId);
        if (!$application) {
            return response()->json(['error' => 'Application not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:Pending,Reviewed,Shortlisted,Accepted,Rejected',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $application->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Application status updated successfully',
            'data' => $application,
        ], 200);
    }

    /**
     * Get applications by status
     */
    public function getApplicationsByStatus($status)
    {
        $validStatuses = ['Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected'];
        
        if (!in_array($status, $validStatuses)) {
            return response()->json(['error' => 'Invalid status'], 400);
        }

        $applications = JobApplication::where('status', $status)
            ->with([
                'user',
                'job.screeningQuestions',
                'screeningResponses.screeningQuestion',
            ])
            ->orderBy('applied_at', 'desc')
            ->get();

        return response()->json([
            'message' => "Applications with status '$status' retrieved",
            'data' => $applications,
            'count' => count($applications),
        ], 200);
    }

    /**
     * Analyze an application with Gemini AI
     */
    public function analyzeApplicationWithAI($applicationId)
    {
        $application = JobApplication::with([
            'user',
            'job',
            'screeningResponses.screeningQuestion',
        ])->find($applicationId);

        if (!$application) {
            return response()->json(['error' => 'Application not found'], 404);
        }

        $geminiKey = env('GEMINI_API_KEY');
        if (!$geminiKey) {
            return response()->json(['message' => 'Gemini API not configured'], 500);
        }

        $jobData = [
            'title' => $application->job?->title,
            'company' => $application->job?->company,
            'location' => $application->job?->location,
            'type' => $application->job?->type,
            'level' => $application->job?->level,
            'track' => $application->job?->track,
            'description' => $application->job?->description,
            'skills' => $application->job?->skills ?? [],
        ];

        $candidateData = [
            'full_name' => $application->personal_info['full_name'] ?? $application->user?->name,
            'email' => $application->personal_info['email'] ?? $application->user?->email,
            'cover_letter' => $application->cover_letter,
            'skills' => $application->skills ?? [],
            'work_experience' => $application->work_experience ?? [],
            'education_info' => $application->education_info ?? [],
            'screening_responses' => $application->screeningResponses
                ->map(fn ($response) => [
                    'question' => $response->screeningQuestion?->question_text,
                    'answer' => $response->response_text,
                ])
                ->values()
                ->all(),
        ];

        $systemPrompt = <<<'EOT'
You are a senior hiring analyst.

Task order:
1) Analyze the job description and expected candidate profile first.
2) Analyze the submitted cover letter.
3) Analyze the submitted CV/resume content.
4) Estimate AI-authorship likelihood percentages.

Return ONLY valid JSON in this exact structure:
{
  "cover_letter_ai_likelihood_percent": 0,
  "cv_ai_likelihood_percent": 0,
  "overall_assessment": "",
  "job_fit_summary": "",
  "strengths": [""],
  "concerns": [""],
  "evidence": [""],
  "confidence": "low|medium|high",
  "notes": ""
}

Rules:
- Percent values must be integers from 0 to 100.
- Be strict and evidence-based; avoid guesses without evidence.
- If CV text is missing or unreadable, still provide output and mention this limitation in notes.
EOT;

        try {
            $parts = [
                [
                    'text' => "Job data:\n" . json_encode($jobData, JSON_PRETTY_PRINT),
                ],
                [
                    'text' => "Candidate application data:\n" . json_encode($candidateData, JSON_PRETTY_PRINT),
                ],
            ];

            $resumeMeta = [
                'resume_attached' => false,
                'resume_source' => $application->resume_path,
                'resume_mime_type' => null,
                'resume_fetch_error' => null,
            ];

            if (!empty($application->resume_path)) {
                $resumeAsset = $this->fetchResumeAssetForGemini($application->resume_path);
                if (!empty($resumeAsset['inline_data'])) {
                    $parts[] = ['inline_data' => $resumeAsset['inline_data']];
                    $parts[] = [
                        'text' => 'The attached file is the candidate CV/resume. Use it as primary evidence for CV analysis.',
                    ];
                    $resumeMeta['resume_attached'] = true;
                    $resumeMeta['resume_mime_type'] = $resumeAsset['inline_data']['mime_type'] ?? null;
                } else {
                    $resumeMeta['resume_fetch_error'] = $resumeAsset['error'] ?? 'Resume could not be attached for analysis.';
                    $parts[] = [
                        'text' => "Resume attachment issue: {$resumeMeta['resume_fetch_error']}",
                    ];
                }
            }

            $geminiResponse = $this->requestApplicationAnalysisFromGemini($geminiKey, $systemPrompt, $parts);

            if (!$geminiResponse['ok']) {
                Log::warning('Application AI analysis Gemini request failed', [
                    'application_id' => $applicationId,
                    'error' => $geminiResponse['error'],
                ]);

                $fallback = $this->generateFallbackApplicationAiAnalysis(
                    $jobData,
                    $candidateData,
                    (string) $geminiResponse['error']
                );

                return response()->json([
                    'message' => 'Application analyzed with fallback (AI provider unavailable)',
                    'data' => [
                        'application_id' => (int) $application->id,
                        'analysis' => $fallback,
                        'resume' => $resumeMeta,
                        'source' => 'fallback',
                    ],
                ], 200);
            }

            $analysisText = (string) data_get($geminiResponse, 'response.candidates.0.content.parts.0.text', '');
            $analysisJson = $this->parseGeminiJsonObject($analysisText);
            $analysis = $this->normalizeApplicationAiAnalysis($analysisJson, $analysisText);

            return response()->json([
                'message' => 'Application analyzed successfully',
                'data' => [
                    'application_id' => (int) $application->id,
                    'analysis' => $analysis,
                    'resume' => $resumeMeta,
                ],
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Application AI analysis error', [
                'application_id' => $applicationId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Application AI analysis error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function fetchResumeAssetForGemini(string $resumeUrl): array
    {
        try {
            $response = Http::timeout(25)->get($resumeUrl);
            if (!$response->successful()) {
                return ['error' => 'Could not download resume file'];
            }

            $mimeType = $response->header('Content-Type');
            if (is_string($mimeType) && str_contains($mimeType, ';')) {
                $mimeType = trim(explode(';', $mimeType)[0]);
            }

            $allowedMimeTypes = [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'image/webp',
            ];

            if (!in_array($mimeType, $allowedMimeTypes, true)) {
                return ['error' => 'Resume format is not supported for direct AI attachment'];
            }

            $binary = $response->body();
            if (empty($binary)) {
                return ['error' => 'Resume file is empty'];
            }

            // Keep payload size manageable for Gemini inline_data.
            if (strlen($binary) > 10 * 1024 * 1024) {
                return ['error' => 'Resume file is too large for inline analysis'];
            }

            return [
                'inline_data' => [
                    'mime_type' => $mimeType,
                    'data' => base64_encode($binary),
                ],
            ];
        } catch (\Throwable $e) {
            return ['error' => 'Failed to fetch resume for AI analysis'];
        }
    }

    private function requestApplicationAnalysisFromGemini(string $geminiKey, string $systemPrompt, array $parts): array
    {
        $basePayload = [
            'system_instruction' => [
                'parts' => [
                    ['text' => $systemPrompt],
                ],
            ],
        ];

        $variants = [
            [
                'model' => 'gemini-2.5-flash',
                'parts' => $parts,
                'reason' => 'full_payload',
            ],
            [
                'model' => 'gemini-2.5-flash',
                'parts' => array_values(array_filter($parts, fn ($part) => !isset($part['inline_data']))),
                'reason' => 'without_resume_attachment',
            ],
            [
                'model' => 'gemini-1.5-flash',
                'parts' => array_values(array_filter($parts, fn ($part) => !isset($part['inline_data']))),
                'reason' => 'fallback_model_without_resume',
            ],
        ];

        $errors = [];

        foreach ($variants as $variant) {
            $payload = $basePayload;
            $payload['contents'] = [[
                'parts' => $variant['parts'],
            ]];

            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$variant['model']}:generateContent?key={$geminiKey}";

            try {
                $response = Http::withHeader('Content-Type', 'application/json')
                    ->timeout(60)
                    ->post($url, $payload);

                if ($response->successful()) {
                    return [
                        'ok' => true,
                        'response' => $response->json(),
                    ];
                }

                $errorMessage = $response->json('error.message')
                    ?? $response->json('message')
                    ?? ('Gemini HTTP ' . $response->status());

                $errors[] = "{$variant['reason']}: {$errorMessage}";
            } catch (\Throwable $e) {
                $errors[] = "{$variant['reason']}: {$e->getMessage()}";
            }
        }

        return [
            'ok' => false,
            'error' => implode(' | ', $errors),
        ];
    }

    private function parseGeminiJsonObject(string $text): array
    {
        if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
            $decoded = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }
        }

        return [];
    }

    private function normalizeApplicationAiAnalysis(array $analysisJson, string $rawText): array
    {
        return [
            'cover_letter_ai_likelihood_percent' => max(0, min(100, (int) ($analysisJson['cover_letter_ai_likelihood_percent'] ?? 0))),
            'cv_ai_likelihood_percent' => max(0, min(100, (int) ($analysisJson['cv_ai_likelihood_percent'] ?? 0))),
            'overall_assessment' => (string) ($analysisJson['overall_assessment'] ?? 'Analysis generated with limited structured output.'),
            'job_fit_summary' => (string) ($analysisJson['job_fit_summary'] ?? ''),
            'strengths' => array_values(array_filter((array) ($analysisJson['strengths'] ?? []))),
            'concerns' => array_values(array_filter((array) ($analysisJson['concerns'] ?? []))),
            'evidence' => array_values(array_filter((array) ($analysisJson['evidence'] ?? []))),
            'confidence' => (string) ($analysisJson['confidence'] ?? 'medium'),
            'notes' => (string) ($analysisJson['notes'] ?? ''),
            'raw_response' => $rawText,
        ];
    }

    private function generateFallbackApplicationAiAnalysis(array $jobData, array $candidateData, string $providerError): array
    {
        $jobSkills = array_values(array_filter((array) ($jobData['skills'] ?? []), fn ($item) => is_string($item)));
        $candidateSkills = array_values(array_filter((array) ($candidateData['skills'] ?? []), fn ($item) => is_string($item)));

        $jobSkillSet = collect($jobSkills)
            ->map(fn ($item) => strtolower(trim($item)))
            ->filter()
            ->unique()
            ->values();

        $candidateSkillSet = collect($candidateSkills)
            ->map(fn ($item) => strtolower(trim($item)))
            ->filter()
            ->unique()
            ->values();

        $matchingSkills = $jobSkillSet
            ->filter(fn ($skill) => $candidateSkillSet->contains($skill))
            ->values();

        $skillMatchPercent = $jobSkillSet->count() > 0
            ? (int) round(($matchingSkills->count() / $jobSkillSet->count()) * 100)
            : 0;

        $coverLetterLength = mb_strlen((string) ($candidateData['cover_letter'] ?? ''));
        $coverScore = $coverLetterLength >= 600
            ? 22
            : ($coverLetterLength >= 300 ? 30 : 38);

        $cvScore = $skillMatchPercent >= 70
            ? 25
            : ($skillMatchPercent >= 40 ? 35 : 45);

        return [
            'cover_letter_ai_likelihood_percent' => max(0, min(100, $coverScore)),
            'cv_ai_likelihood_percent' => max(0, min(100, $cvScore)),
            'overall_assessment' => 'Fallback analysis generated because AI provider request failed. Scores are heuristic and should be reviewed manually.',
            'job_fit_summary' => $skillMatchPercent > 0
                ? "Estimated skill overlap with job requirements is {$skillMatchPercent}% based on submitted skill lists."
                : 'Could not estimate strong skill overlap from the submitted structured data.',
            'strengths' => $matchingSkills->take(4)->map(fn ($skill) => 'Relevant skill match: ' . $skill)->values()->all(),
            'concerns' => [
                'Primary AI provider request failed, so deep linguistic AI-authorship detection was unavailable.',
                'Resume text may not have been fully parsed for semantic analysis.',
            ],
            'evidence' => [
                "Job skills submitted: {$jobSkillSet->count()}",
                "Candidate skills submitted: {$candidateSkillSet->count()}",
                "Matched skills: {$matchingSkills->count()}",
            ],
            'confidence' => 'low',
            'notes' => 'Provider error: ' . $providerError,
            'raw_response' => '',
        ];
    }

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats()
    {
        $now = Carbon::now();

        $totalUsers = User::count();
        $totalCourses = Course::count();
        $totalJobs = Job::count();
        $totalApplications = JobApplication::count();

        $applicationsByStatus = [
            'pending' => JobApplication::where('status', 'Pending')->count(),
            'reviewed' => JobApplication::where('status', 'Reviewed')->count(),
            'shortlisted' => JobApplication::where('status', 'Shortlisted')->count(),
            'accepted' => JobApplication::where('status', 'Accepted')->count(),
            'rejected' => JobApplication::where('status', 'Rejected')->count(),
        ];

        $enrollmentsByLevel = [
            'beginner' => Course::where('level', 'Beginner')->count(),
            'intermediate' => Course::where('level', 'Intermediate')->count(),
            'advanced' => Course::where('level', 'Advanced')->count(),
        ];

        $last12Days = collect(range(11, 0))
            ->map(fn ($i) => $now->copy()->subDays($i)->toDateString());

        $buildSeries = function (string $table, string $column = 'created_at') use ($last12Days) {
            $rows = DB::table($table)
                ->selectRaw("DATE({$column}) as day, COUNT(*) as total")
                ->whereNotNull($column)
                ->whereDate($column, '>=', Carbon::now()->subDays(11)->toDateString())
                ->groupBy('day')
                ->pluck('total', 'day');

            return $last12Days->map(fn ($day) => (int) ($rows[$day] ?? 0))->values()->all();
        };

        $buildTrend = function (string $table, string $column = 'created_at', ?callable $scope = null) use ($now) {
            $currentStart = $now->copy()->subDays(29)->startOfDay();
            $previousStart = $now->copy()->subDays(59)->startOfDay();
            $previousEnd = $now->copy()->subDays(30)->endOfDay();

            $currentQuery = DB::table($table)->whereNotNull($column)->whereBetween($column, [$currentStart, $now]);
            $previousQuery = DB::table($table)->whereNotNull($column)->whereBetween($column, [$previousStart, $previousEnd]);

            if ($scope) {
                $scope($currentQuery);
                $scope($previousQuery);
            }

            $current = (int) $currentQuery->count();
            $previous = (int) $previousQuery->count();
            $change = $previous > 0
                ? round((($current - $previous) / $previous) * 100)
                : ($current > 0 ? 100 : 0);

            if ($change > 0) {
                return ['direction' => 'up', 'value' => "+{$change}%"];
            }

            if ($change < 0) {
                return ['direction' => 'down', 'value' => "{$change}%"];
            }

            return ['direction' => 'flat', 'value' => '0%'];
        };

        $userActivities = User::query()
            ->select(['id', 'name', 'created_at'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($user) => [
                'type' => 'user',
                'title' => 'New user registered',
                'description' => "{$user->name} created an account",
                'timestamp' => optional($user->created_at)->toIso8601String(),
            ]);

        $courseActivities = Course::query()
            ->select(['id', 'name', 'created_at'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($course) => [
                'type' => 'course',
                'title' => 'New course published',
                'description' => $course->name,
                'timestamp' => optional($course->created_at)->toIso8601String(),
            ]);

        $jobActivities = Job::query()
            ->select(['id', 'title', 'created_at'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($job) => [
                'type' => 'job',
                'title' => 'New job posted',
                'description' => $job->title,
                'timestamp' => optional($job->created_at)->toIso8601String(),
            ]);

        $applicationActivities = JobApplication::query()
            ->with(['user:id,name', 'job:id,title'])
            ->orderByDesc('applied_at')
            ->limit(8)
            ->get()
            ->map(function ($app) {
                $userName = $app->user?->name ?? 'A user';
                $jobTitle = $app->job?->title ?? 'a job';
                $status = strtolower((string) $app->status);

                $title = 'Application submitted';
                if ($status === 'accepted') {
                    $title = 'Application accepted';
                } elseif ($status === 'rejected') {
                    $title = 'Application rejected';
                } elseif ($status === 'shortlisted') {
                    $title = 'Application shortlisted';
                } elseif ($status === 'reviewed') {
                    $title = 'Application reviewed';
                }

                return [
                    'type' => 'application',
                    'status' => $status,
                    'title' => $title,
                    'description' => "{$userName} • {$jobTitle}",
                    'timestamp' => optional($app->applied_at ?? $app->created_at)->toIso8601String(),
                ];
            });

        $recentActivity = $userActivities
            ->concat($courseActivities)
            ->concat($jobActivities)
            ->concat($applicationActivities)
            ->sortByDesc('timestamp')
            ->take(10)
            ->values();

        $acceptedRate = $totalApplications > 0
            ? round(($applicationsByStatus['accepted'] / $totalApplications) * 100, 1)
            : 0;

        $pendingRate = $totalApplications > 0
            ? round(($applicationsByStatus['pending'] / $totalApplications) * 100, 1)
            : 0;

        $avgApplicationsPerJob = $totalJobs > 0
            ? round($totalApplications / $totalJobs, 2)
            : 0;

        $newUsersLast7Days = User::where('created_at', '>=', $now->copy()->subDays(7)->startOfDay())->count();
        $newApplicationsLast7Days = JobApplication::where('applied_at', '>=', $now->copy()->subDays(7)->startOfDay())->count();

        return response()->json([
            'message' => 'Dashboard statistics',
            'data' => [
                'generated_at' => $now->toIso8601String(),
                'total_users' => $totalUsers,
                'total_courses' => $totalCourses,
                'total_jobs' => $totalJobs,
                'total_applications' => $totalApplications,
                'applications_by_status' => $applicationsByStatus,
                'enrollments_by_level' => $enrollmentsByLevel,
                'trends' => [
                    'users' => [
                        'series' => $buildSeries('users', 'created_at'),
                        'growth' => $buildTrend('users', 'created_at'),
                    ],
                    'courses' => [
                        'series' => $buildSeries('courses', 'created_at'),
                        'growth' => $buildTrend('courses', 'created_at'),
                    ],
                    'jobs' => [
                        'series' => $buildSeries('jobs', 'created_at'),
                        'growth' => $buildTrend('jobs', 'created_at'),
                    ],
                    'applications' => [
                        'series' => $buildSeries('job_applications', 'applied_at'),
                        'growth' => $buildTrend('job_applications', 'applied_at'),
                    ],
                    'pending_applications' => [
                        'growth' => $buildTrend('job_applications', 'applied_at', function ($query) {
                            $query->where('status', 'Pending');
                        }),
                    ],
                ],
                'platform_overview' => [
                    'accepted_rate' => $acceptedRate,
                    'pending_rate' => $pendingRate,
                    'avg_applications_per_job' => $avgApplicationsPerJob,
                    'new_users_last_7_days' => $newUsersLast7Days,
                    'new_applications_last_7_days' => $newApplicationsLast7Days,
                ],
                'recent_activity' => $recentActivity,
            ],
        ], 200);
    }
}
