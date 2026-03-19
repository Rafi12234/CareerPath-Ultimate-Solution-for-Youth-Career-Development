<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule as ValidationRule;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json(['user' => $user]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['required', 'string', 'max:30'],
            'date_of_birth' => ['required', 'date'],
            'gender' => ['required', 'string', 'max:20'],
            'marital_status' => ['required', 'string', 'max:30'],
            'nationality' => ['required', 'string', 'max:100'],
            'present_address' => ['required', 'string', 'max:1000'],
            'permanent_address' => ['required', 'string', 'max:1000'],
            'school_name' => ['required', 'string', 'max:255'],
            'ssc_year' => ['required', 'integer', 'min:1950', 'max:2100'],
            'ssc_result' => ['required', 'string', 'max:100'],
            'ssc_group' => ['required', 'string', 'max:50'],
            'ssc_board' => ['required', 'string', 'max:50'],
            'college_name' => ['required', 'string', 'max:255'],
            'hsc_year' => ['required', 'integer', 'min:1950', 'max:2100'],
            'hsc_result' => ['required', 'string', 'max:100'],
            'hsc_group' => ['required', 'string', 'max:50'],
            'hsc_board' => ['required', 'string', 'max:50'],
            'university_name' => ['required', 'string', 'max:255'],
            'university_status' => ['required', 'string', ValidationRule::in(['studying', 'graduated'])],
            'current_study_year' => ['nullable', 'integer', 'min:1', 'max:8', 'required_if:university_status,studying'],
            'current_study_semester' => ['nullable', 'integer', 'min:1', 'max:16', 'required_if:university_status,studying'],
            'university_graduation_year' => ['nullable', 'integer', 'min:1950', 'max:2100', 'required_if:university_status,graduated'],
            'university_cgpa' => ['required', 'numeric', 'min:0', 'max:4'],
            'is_fresher' => ['required', 'boolean'],
            'years_of_experience' => ['required', 'integer', 'min:0', 'max:60'],
            'current_job_title' => ['nullable', 'string', 'max:255'],
            'current_company' => ['nullable', 'string', 'max:255'],
            'previous_job_title' => ['nullable', 'string', 'max:255', 'required_if:is_fresher,false'],
            'previous_company' => ['nullable', 'string', 'max:255', 'required_if:is_fresher,false'],
            'previous_job_start' => ['nullable', 'date', 'required_if:is_fresher,false'],
            'previous_job_end' => ['nullable', 'date', 'after_or_equal:previous_job_start', 'required_if:is_fresher,false'],
            'previous_job_description' => ['nullable', 'string', 'max:3000', 'required_if:is_fresher,false'],
        ]);

        if (($validated['is_fresher'] ?? false) === true) {
            $validated['years_of_experience'] = 0;
            $validated['previous_job_title'] = null;
            $validated['previous_company'] = null;
            $validated['previous_job_start'] = null;
            $validated['previous_job_end'] = null;
            $validated['previous_job_description'] = null;
            $validated['current_job_title'] = null;
            $validated['current_company'] = null;
        }

        $user->fill($validated);
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh(),
        ]);
    }
}
