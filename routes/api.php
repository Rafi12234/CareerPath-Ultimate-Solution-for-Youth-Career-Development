<?php

use App\Http\Controllers\UsersController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\UserSkillController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\MockInterviewController;
use App\Http\Controllers\AvatarController;
use App\Http\Controllers\CVAnalyzerController;
use App\Http\Controllers\CareerRoadmapController;
use App\Http\Controllers\CourseVideoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Courses
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::post('/courses', [CourseController::class, 'store']);
Route::put('/courses/{id}', [CourseController::class, 'update']);
Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

// Jobs
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::post('/jobs', [JobController::class, 'store']);
Route::put('/jobs/{id}', [JobController::class, 'update']);
Route::delete('/jobs/{id}', [JobController::class, 'destroy']);

// Enrollments
Route::get('/enrollments', [EnrollmentController::class, 'index']);
Route::post('/enrollments', [EnrollmentController::class, 'store']);
Route::delete('/enrollments/{id}', [EnrollmentController::class, 'destroy']);

// Course Videos (protected routes - require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/course-videos/{courseId}', [CourseVideoController::class, 'getVideosByEnrollment']);
    Route::get('/course-progress/{courseId}', [CourseVideoController::class, 'getCourseProgress']);
    Route::get('/next-video/{courseId}', [CourseVideoController::class, 'getNextVideo']);
    Route::post('/mark-video-complete/{videoId}', [CourseVideoController::class, 'markVideoComplete']);
});

// User Skills
Route::get('/user-skills', [UserSkillController::class, 'index']);
Route::post('/user-skills', [UserSkillController::class, 'store']);
Route::put('/user-skills/{id}', [UserSkillController::class, 'update']);
Route::delete('/user-skills/{id}', [UserSkillController::class, 'destroy']);

// Job Applications
Route::middleware('auth:sanctum')->get('/job-applications/init/{jobId}', [JobApplicationController::class, 'initializeApplication']);
Route::middleware('auth:sanctum')->post('/job-applications/generate-cover-letter', [JobApplicationController::class, 'generateCoverLetterAI']);
Route::get('/job-applications', [JobApplicationController::class, 'index']);
Route::post('/job-applications', [JobApplicationController::class, 'store']);
Route::get('/job-applications/{id}', [JobApplicationController::class, 'show']);
Route::put('/job-applications/{id}', [JobApplicationController::class, 'update']);
Route::delete('/job-applications/{id}', [JobApplicationController::class, 'destroy']);

// Contacts
Route::get('/contacts', [ContactController::class, 'index']);
Route::post('/contacts', [ContactController::class, 'store']);

// Chatbot
Route::post('/chatbot', [ChatbotController::class, 'chat']);
Route::get('/chatbot/history', [ChatbotController::class, 'history']);

// Mock Interview
Route::middleware('auth:sanctum')->post('/mock-interview/chat', [MockInterviewController::class, 'chat']);
Route::middleware('auth:sanctum')->post('/mock-interview/turns', [MockInterviewController::class, 'storeTurn']);
Route::middleware('auth:sanctum')->get('/mock-interview/history', [MockInterviewController::class, 'history']);

// Avatar upload
Route::post('/upload-avatar', [AvatarController::class, 'upload']);

// User profile
Route::middleware('auth:sanctum')->get('/profile', [ProfileController::class, 'show']);
Route::middleware('auth:sanctum')->put('/profile', [ProfileController::class, 'update']);

// CV Analyzer
Route::post('/cv-analyze', [CVAnalyzerController::class, 'analyze']);
Route::post('/cv-job-match', [CVAnalyzerController::class, 'jobMatch']);

// AI Career Roadmap
Route::middleware('auth:sanctum')->post('/career-roadmap/generate', [CareerRoadmapController::class, 'generate']);
Route::middleware('auth:sanctum')->get('/career-roadmap/history', [CareerRoadmapController::class, 'history']);

// Original item routes (keep for backward compatibility)
Route::get('/items', [UsersController::class, 'index']);
Route::get('/items/{id}', [UsersController::class, 'show']);
Route::post('/items', [UsersController::class, 'store']);
Route::put('/items/{id}', [UsersController::class, 'update']);
Route::patch('/items/{id}', [UsersController::class, 'patch']);
Route::delete('/items/{id}', [UsersController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

// Admin Authentication
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// Admin Protected Routes (middleware will be added in production)
Route::group([], function () {
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    Route::get('/admin/me', [AdminAuthController::class, 'me']);

    // Users Management
    Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
    Route::get('/admin/users/{userId}', [AdminController::class, 'getUserProfile']);

    // Courses Management
    Route::get('/admin/courses', [AdminController::class, 'getAllCourses']);
    Route::post('/admin/courses', [AdminController::class, 'createCourse']);
    Route::get('/admin/courses/{courseId}', [AdminController::class, 'getCourseDetails']);
    Route::put('/admin/courses/{courseId}', [AdminController::class, 'updateCourse']);
    Route::post('/admin/courses/{courseId}/cover-image', [AdminController::class, 'uploadCourseCoverImage']);
    Route::delete('/admin/courses/{courseId}', [AdminController::class, 'deleteCourse']);

    // Course Videos/Modules
    Route::post('/admin/courses/{courseId}/videos', [AdminController::class, 'addVideoToModule']);
    Route::post('/admin/courses/{courseId}/upload-video', [AdminController::class, 'uploadCourseVideo']);
    Route::post('/admin/videos/{videoId}/replace-video', [AdminController::class, 'replaceVideoFile']);
    Route::delete('/admin/videos/{videoId}/video-link', [AdminController::class, 'removeVideoLink']);
    Route::put('/admin/videos/{videoId}', [AdminController::class, 'updateVideo']);
    Route::delete('/admin/videos/{videoId}', [AdminController::class, 'deleteVideo']);

    // Jobs Management
    Route::get('/admin/jobs', [AdminController::class, 'getAllJobs']);
    Route::post('/admin/jobs', [AdminController::class, 'createJob']);
    Route::get('/admin/jobs/{jobId}', [AdminController::class, 'getJobApplications']);
    Route::put('/admin/jobs/{jobId}', [AdminController::class, 'updateJob']);
    Route::delete('/admin/jobs/{jobId}', [AdminController::class, 'deleteJob']);

    // Job Applications Management
    Route::get('/admin/applications', [AdminController::class, 'getAllApplications']);
    Route::get('/admin/applications/status/{status}', [AdminController::class, 'getApplicationsByStatus']);
    Route::post('/admin/applications/{applicationId}/ai-analysis', [AdminController::class, 'analyzeApplicationWithAI']);
    Route::put('/admin/applications/{applicationId}', [AdminController::class, 'updateApplicationStatus']);

    // Dashboard Stats
    Route::get('/admin/dashboard/stats', [AdminController::class, 'getDashboardStats']);
});
