<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::withCount('enrollments');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('topic', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->get()->map(function ($course) {
            $course->enrollment_count = $course->enrollments_count;
            return $course;
        }));
    }

    public function show($id)
    {
        $course = Course::withCount('enrollments')->findOrFail($id);
        $course->enrollment_count = $course->enrollments_count;
        return response()->json($course);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $course = Course::create($request->all());
        return response()->json($course, 201);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $course->update($request->all());
        return response()->json($course);
    }

    public function destroy($id)
    {
        Course::findOrFail($id)->delete();
        return response()->json(['message' => 'Course deleted']);
    }
}
