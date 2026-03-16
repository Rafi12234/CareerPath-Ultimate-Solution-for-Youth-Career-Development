<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseVideo;
use App\Models\VideoCompletion;
use Illuminate\Http\Request;

class CourseVideoController extends Controller
{
    /**
     * Get all videos for a user's enrolled course
     */
    public function getVideosByEnrollment($courseId)
    {
        $user = auth()->user();

        // Check if user is enrolled
        $enrollment = $user->enrollments()
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            return response()->json(['error' => 'Not enrolled in this course'], 403);
        }

        $course = Course::find($courseId);
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        $videos = $course->videos()->get();

        // Add completion status for each video
        $videos = $videos->map(function ($video) use ($user) {
            return [
                'id' => $video->id,
                'course_id' => $video->course_id,
                'title' => $video->title,
                'url' => $video->url,
                'duration' => $video->duration,
                'sequence' => $video->sequence,
                'description' => $video->description,
                'completed' => $video->isCompletedBy($user->id),
                'created_at' => $video->created_at,
            ];
        });

        return response()->json([
            'course' => [
                'id' => $course->id,
                'name' => $course->name,
                'description' => $course->description,
            ],
            'videos' => $videos,
        ]);
    }

    /**
     * Mark a video as completed
     */
    public function markVideoComplete(Request $request, $videoId)
    {
        $user = auth()->user();
        $video = CourseVideo::find($videoId);

        if (!$video) {
            return response()->json(['error' => 'Video not found'], 404);
        }

        // Check enrollment
        $enrollment = $user->enrollments()
            ->where('course_id', $video->course_id)
            ->first();

        if (!$enrollment) {
            return response()->json(['error' => 'Not enrolled in this course'], 403);
        }

        // Create or update completion
        VideoCompletion::firstOrCreate(
            [
                'user_id' => $user->id,
                'course_video_id' => $videoId,
            ],
            [
                'completed_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Video marked as completed',
            'video_id' => $videoId,
        ]);
    }

    /**
     * Get course progress (videos completed)
     */
    public function getCourseProgress($courseId)
    {
        $user = auth()->user();

        // Check enrollment
        $enrollment = $user->enrollments()
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            return response()->json(['error' => 'Not enrolled in this course'], 403);
        }

        $course = Course::find($courseId);
        $totalVideos = $course->videos()->count();
        
        $completedVideos = VideoCompletion::whereHas('video', function ($query) use ($courseId) {
            $query->where('course_id', $courseId);
        })
        ->where('user_id', $user->id)
        ->count();

        $lastCompletedAt = VideoCompletion::whereHas('video', function ($query) use ($courseId) {
            $query->where('course_id', $courseId);
        })
        ->where('user_id', $user->id)
        ->orderByDesc('completed_at')
        ->value('completed_at');

        $nextVideo = $course->videos()
            ->whereDoesntHave('completions', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->orderBy('sequence')
            ->first();

        return response()->json([
            'course_id' => $courseId,
            'total_videos' => $totalVideos,
            'completed_videos' => $completedVideos,
            'progress_percentage' => $totalVideos > 0 ? ($completedVideos / $totalVideos) * 100 : 0,
            'next_video' => $nextVideo,
            'completed_at' => $lastCompletedAt,
        ]);
    }

    /**
     * Get next available video for a course
     */
    public function getNextVideo($courseId)
    {
        $user = auth()->user();

        // Check enrollment
        $enrollment = $user->enrollments()
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            return response()->json(['error' => 'Not enrolled in this course'], 403);
        }

        $course = Course::find($courseId);
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        // Find first incomplete video
        $nextVideo = $course->videos()
            ->whereDoesntHave('completions', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->orderBy('sequence')
            ->first();

        if (!$nextVideo) {
            return response()->json(['message' => 'All videos completed!']);
        }

        return response()->json($nextVideo);
    }
}
