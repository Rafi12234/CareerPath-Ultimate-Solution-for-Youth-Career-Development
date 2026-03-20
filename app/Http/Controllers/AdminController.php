<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\CourseVideo;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Http\Request;
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
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course = Course::create($request->validated());

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
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course->update($request->validated());

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
     * Update video/module
     */
    public function updateVideo(Request $request, $videoId)
    {
        $video = CourseVideo::find($videoId);
        if (!$video) {
            return response()->json(['error' => 'Video not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'url' => 'url',
            'duration' => 'string|max:50',
            'sequence' => 'integer|min:1',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $video->update($request->validated());

        return response()->json([
            'message' => 'Video updated successfully',
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
            ->with(['user', 'job'])
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
            ->with('user')
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
            ->with(['user', 'job'])
            ->orderBy('applied_at', 'desc')
            ->get();

        return response()->json([
            'message' => "Applications with status '$status' retrieved",
            'data' => $applications,
            'count' => count($applications),
        ], 200);
    }

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats()
    {
        return response()->json([
            'message' => 'Dashboard statistics',
            'data' => [
                'total_users' => User::count(),
                'total_courses' => Course::count(),
                'total_jobs' => Job::count(),
                'total_applications' => JobApplication::count(),
                'applications_by_status' => [
                    'pending' => JobApplication::where('status', 'Pending')->count(),
                    'reviewed' => JobApplication::where('status', 'Reviewed')->count(),
                    'shortlisted' => JobApplication::where('status', 'Shortlisted')->count(),
                    'accepted' => JobApplication::where('status', 'Accepted')->count(),
                    'rejected' => JobApplication::where('status', 'Rejected')->count(),
                ],
                'enrollments_by_level' => [
                    'beginner' => Course::where('level', 'Beginner')->count(),
                    'intermediate' => Course::where('level', 'Intermediate')->count(),
                    'advanced' => Course::where('level', 'Advanced')->count(),
                ],
            ],
        ], 200);
    }
}
