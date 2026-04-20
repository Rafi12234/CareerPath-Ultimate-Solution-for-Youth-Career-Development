<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $hasFilters =
            (($request->has('search') && trim((string) $request->search) !== '') ||
            ($request->has('level') && $request->level !== 'all') ||
            ($request->has('type') && $request->type !== 'all') ||
            ($request->has('track') && $request->track !== 'all'));

        if (!$hasFilters) {
            $jobs = Cache::remember('jobs:index:v1', now()->addMinutes(5), function () {
                return Job::query()->latest()->get();
            });

            return response()->json($jobs);
        }

        $query = Job::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('track', 'like', "%{$search}%");
            });
        }

        if ($request->has('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('track') && $request->track !== 'all') {
            $query->where('track', $request->track);
        }

        return response()->json($query->latest()->get());
    }

    public function show($id)
    {
        $job = Job::findOrFail($id);
        return response()->json($job);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
        ]);

        $job = Job::create($request->all());
        Cache::forget('jobs:index:v1');
        return response()->json($job, 201);
    }

    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        $job->update($request->all());
        Cache::forget('jobs:index:v1');
        return response()->json($job);
    }

    public function destroy($id)
    {
        Job::findOrFail($id)->delete();
        Cache::forget('jobs:index:v1');
        return response()->json(['message' => 'Job deleted']);
    }
}
