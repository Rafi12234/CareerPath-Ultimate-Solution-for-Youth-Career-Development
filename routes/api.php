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
use App\Http\Controllers\AvatarController;
use App\Http\Controllers\CVAnalyzerController;
use App\Http\Controllers\CourseVideoController;
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
Route::get('/job-applications', [JobApplicationController::class, 'index']);
Route::post('/job-applications', [JobApplicationController::class, 'store']);
Route::delete('/job-applications/{id}', [JobApplicationController::class, 'destroy']);

// Contacts
Route::get('/contacts', [ContactController::class, 'index']);
Route::post('/contacts', [ContactController::class, 'store']);

// Chatbot
Route::post('/chatbot', [ChatbotController::class, 'chat']);
Route::get('/chatbot/history', [ChatbotController::class, 'history']);

// Avatar upload
Route::post('/upload-avatar', [AvatarController::class, 'upload']);

// CV Analyzer
Route::post('/cv-analyze', [CVAnalyzerController::class, 'analyze']);

// Original item routes (keep for backward compatibility)
Route::get('/items', [UsersController::class, 'index']);
Route::get('/items/{id}', [UsersController::class, 'show']);
Route::post('/items', [UsersController::class, 'store']);
Route::put('/items/{id}', [UsersController::class, 'update']);
Route::patch('/items/{id}', [UsersController::class, 'patch']);
Route::delete('/items/{id}', [UsersController::class, 'destroy']);
