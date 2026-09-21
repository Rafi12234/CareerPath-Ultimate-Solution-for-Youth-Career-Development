<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompanyApplicationController extends Controller
{
    private function company(Request $request)
    {
        return $request->attributes->get('company') ?: $request->user()->company;
    }

    private function baseQuery(Request $request)
    {
        $companyId = $this->company($request)->id;
        return JobApplication::query()
            ->whereHas('job', fn ($q) => $q->where('company_id', $companyId))
            ->with([
                'user:id,name,email,avatar',
                'job:id,company_id,title,company,location,type,level,track,status',
                'screeningResponses.screeningQuestion',
            ]);
    }

    public function index(Request $request)
    {
        $query = $this->baseQuery($request);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->filled('job_id')) {
            $query->where('job_id', $request->job_id);
        }
        if ($request->filled('search')) {
            $search = trim((string) $request->search);
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
                    ->orWhere('personal_info->full_name', 'like', "%{$search}%")
                    ->orWhere('personal_info->email', 'like', "%{$search}%");
            });
        }

        $applications = $query->orderByDesc('applied_at')->get();
        $applications->each->makeVisible('company_notes');
        return response()->json($applications);
    }

    public function show(Request $request, $applicationId)
    {
        $application = $this->baseQuery($request)->findOrFail($applicationId);
        $application->makeVisible('company_notes');
        return response()->json($application);
    }

    public function update(Request $request, $applicationId)
    {
        $application = $this->baseQuery($request)->findOrFail($applicationId);
        $validator = Validator::make($request->all(), [
            'status' => 'nullable|in:Pending,Reviewed,Shortlisted,Accepted,Rejected',
            'company_notes' => 'nullable|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'The given data was invalid.', 'errors' => $validator->errors()], 422);
        }

        $updates = [];
        if ($request->filled('status')) {
            $updates['status'] = $request->status;
            $updates['reviewed_at'] = $request->status === 'Pending' ? null : now();
        }
        if ($request->exists('company_notes')) {
            $updates['company_notes'] = $request->company_notes;
        }
        if ($updates) $application->update($updates);

        $fresh = $application->fresh()->load(['user:id,name,email,avatar', 'job', 'screeningResponses.screeningQuestion']);
        $fresh->makeVisible('company_notes');

        return response()->json([
            'message' => 'Application updated successfully.',
            'application' => $fresh,
        ]);
    }
}
