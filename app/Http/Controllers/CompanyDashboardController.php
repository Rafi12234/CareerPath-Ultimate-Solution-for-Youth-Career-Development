<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Http\Request;

class CompanyDashboardController extends Controller
{
    public function index(Request $request)
    {
        $company = $request->attributes->get('company') ?: $request->user()->company;
        $jobs = $company->jobs();
        $applications = JobApplication::whereHas('job', fn ($q) => $q->where('company_id', $company->id));

        $jobStats = [
            'total' => (clone $jobs)->count(),
            'published' => (clone $jobs)->where('status', 'published')->count(),
            'draft' => (clone $jobs)->where('status', 'draft')->count(),
            'closed' => (clone $jobs)->where('status', 'closed')->count(),
        ];

        $applicationStats = [
            'total' => (clone $applications)->count(),
            'pending' => (clone $applications)->where('status', 'Pending')->count(),
            'reviewed' => (clone $applications)->where('status', 'Reviewed')->count(),
            'shortlisted' => (clone $applications)->where('status', 'Shortlisted')->count(),
            'accepted' => (clone $applications)->where('status', 'Accepted')->count(),
            'rejected' => (clone $applications)->where('status', 'Rejected')->count(),
        ];

        $recentApplications = (clone $applications)
            ->with(['user:id,name,email,avatar', 'job:id,title,company,company_id'])
            ->orderByDesc('applied_at')
            ->limit(6)
            ->get();

        $topJobs = $company->jobs()
            ->withCount('applications')
            ->orderByDesc('applications_count')
            ->limit(5)
            ->get(['id', 'title', 'status', 'location', 'created_at']);

        return response()->json([
            'company' => $company,
            'jobs' => $jobStats,
            'applications' => $applicationStats,
            'recent_applications' => $recentApplications,
            'top_jobs' => $topJobs,
        ]);
    }
}
