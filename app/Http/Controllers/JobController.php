<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class JobController extends Controller
{
private function publicQuery()
{
    return Job::query()
        ->where('status', 'published')
        ->where(function ($q) {
            $q->whereNull('application_deadline')
                ->orWhereDate('application_deadline', '>=', now()->toDateString());
        })
        ->with([
            'employerCompany:id,name,logo_url,industry,website'
        ]);
}

    public function index(Request $request)
    {
        $hasFilters =
            (($request->has('search') && trim((string) $request->search) !== '') ||
            ($request->has('level') && $request->level !== 'all') ||
            ($request->has('type') && $request->type !== 'all') ||
            ($request->has('track') && $request->track !== 'all'));

        if (!$hasFilters) {
            $jobs = Cache::remember('jobs:index:v2', now()->addMinutes(3), function () {
                return $this->publicQuery()->latest()->get();
            });
            return response()->json($jobs);
        }

        $query = $this->publicQuery();

        if ($request->filled('search')) {
            $search = trim((string) $request->search);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('track', 'like', "%{$search}%");
            });
        }
        if ($request->has('level') && $request->level !== 'all') $query->where('level', $request->level);
        if ($request->has('type') && $request->type !== 'all') $query->where('type', $request->type);
        if ($request->has('track') && $request->track !== 'all') $query->where('track', $request->track);

        return response()->json($query->latest()->get());
    }

    public function show($id)
    {
        return response()->json($this->publicQuery()->findOrFail($id));
    }
}
