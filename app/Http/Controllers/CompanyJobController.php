<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

class CompanyJobController extends Controller
{
    private function company(Request $request)
    {
        return $request->attributes->get('company') ?: $request->user()->company;
    }

    private function rules(bool $partial = false): array
    {
        $req = $partial ? 'sometimes' : 'required';
        return [
            'title' => "$req|string|max:255",
            'location' => "$req|string|max:255",
            'type' => "$req|in:Full-time,Part-time,Internship,Contract,Remote",
            'level' => "$req|in:Entry Level,Mid Level,Senior",
            'description' => "$req|string|max:15000",
            'salary_min' => 'nullable|integer|min:0',
            'salary_max' => 'nullable|integer|min:0|gte:salary_min',
            'track' => "$req|string|max:255",
            'skills' => 'nullable|array|max:30',
            'skills.*' => 'string|max:100',
            'status' => 'nullable|in:draft,published,closed',
            'application_deadline' => 'nullable|date',
            'vacancies' => 'nullable|integer|min:1|max:1000',
            'screening_questions' => 'nullable|array|max:20',
            'screening_questions.*.question_text' => 'required_with:screening_questions|string|max:2000',
            'screening_questions.*.question_type' => 'required_with:screening_questions|in:text,yes_no,multiple_choice',
            'screening_questions.*.options' => 'nullable|array|max:20',
            'screening_questions.*.options.*' => 'string|max:255',
            'screening_questions.*.required' => 'nullable|boolean',
        ];
    }

    private function findOwnedJob(Request $request, $jobId): Job
    {
        return Job::where('company_id', $this->company($request)->id)->findOrFail($jobId);
    }

    private function addJobValidationChecks($validator, Request $request, ?Job $existingJob = null): void
    {
        $validator->after(function ($validator) use ($request, $existingJob) {
            foreach ($request->input('screening_questions', []) as $index => $question) {
                if (!is_array($question) || ($question['question_type'] ?? null) !== 'multiple_choice') continue;

                $options = array_values(array_filter(array_map(
                    fn ($option) => is_string($option) ? trim($option) : '',
                    $question['options'] ?? []
                )));

                if (count($options) < 2) {
                    $validator->errors()->add(
                        "screening_questions.{$index}.options",
                        'A multiple-choice screening question needs at least two options.'
                    );
                }
            }

            $effectiveStatus = $request->input('status', $existingJob?->status ?? 'published');
            $effectiveDeadline = $request->exists('application_deadline')
                ? $request->input('application_deadline')
                : $existingJob?->application_deadline;

            if ($effectiveStatus === 'published' && $effectiveDeadline) {
                try {
                    if (Carbon::parse($effectiveDeadline)->startOfDay()->lt(today())) {
                        $validator->errors()->add(
                            'application_deadline',
                            'A published job cannot have an application deadline in the past.'
                        );
                    }
                } catch (\Throwable $e) {
                    // The normal `date` validation rule reports malformed dates.
                }
            }
        });
    }


    public function index(Request $request)
    {
        $company = $this->company($request);
        $query = Job::where('company_id', $company->id)
            ->withCount('applications')
            ->with('screeningQuestions');

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $search = trim((string) $request->search);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('track', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->get());
    }

    public function show(Request $request, $jobId)
    {
        return response()->json($this->findOwnedJob($request, $jobId)->load('screeningQuestions')->loadCount('applications'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->rules());
        $this->addJobValidationChecks($validator, $request);
        if ($validator->fails()) {
            return response()->json(['message' => 'The given data was invalid.', 'errors' => $validator->errors()], 422);
        }

        $company = $this->company($request);
        $job = DB::transaction(function () use ($request, $company) {
            $job = Job::create([
                'company_id' => $company->id,
                'company' => $company->name,
                'title' => $request->title,
                'location' => $request->location,
                'type' => $request->type,
                'level' => $request->level,
                'description' => $request->description,
                'salary_min' => $request->salary_min,
                'salary_max' => $request->salary_max,
                'track' => $request->track,
                'skills' => array_values(array_filter($request->skills ?? [])),
                'status' => $request->input('status', 'published'),
                'application_deadline' => $request->application_deadline,
                'vacancies' => $request->input('vacancies', 1),
            ]);

            $this->replaceScreeningQuestions($job, $request->input('screening_questions', []));
            return $job;
        });

        Cache::forget('jobs:index:v2');
        return response()->json(['message' => 'Job created successfully.', 'job' => $job->load('screeningQuestions')], 201);
    }

    public function update(Request $request, $jobId)
    {
        $job = $this->findOwnedJob($request, $jobId);
        $validator = Validator::make($request->all(), $this->rules(true));
        $this->addJobValidationChecks($validator, $request, $job);
        if ($validator->fails()) {
            return response()->json(['message' => 'The given data was invalid.', 'errors' => $validator->errors()], 422);
        }

        if ($request->exists('screening_questions') && $job->applications()->exists()
            && !$this->screeningQuestionsMatch($job, $request->input('screening_questions', []))) {
            return response()->json([
                'message' => 'Screening questions are locked because this job already has applications. You can still edit the job details and status.',
            ], 409);
        }

        $company = $this->company($request);
        DB::transaction(function () use ($request, $job, $company) {
            $data = $request->only([
                'title', 'location', 'type', 'level', 'description', 'salary_min', 'salary_max',
                'track', 'skills', 'status', 'application_deadline', 'vacancies',
            ]);
            $data['company'] = $company->name;
            if (array_key_exists('skills', $data) && is_array($data['skills'])) {
                $data['skills'] = array_values(array_filter($data['skills']));
            }
            $job->update($data);

            // Screening responses reference question IDs. Once applications exist the
            // question set is kept intact so submitted candidate answers cannot be deleted.
            if ($request->exists('screening_questions') && !$job->applications()->exists()) {
                $this->replaceScreeningQuestions($job, $request->input('screening_questions', []));
            }
        });

        Cache::forget('jobs:index:v2');
        return response()->json(['message' => 'Job updated successfully.', 'job' => $job->fresh()->load('screeningQuestions')->loadCount('applications')]);
    }

    public function destroy(Request $request, $jobId)
    {
        $job = $this->findOwnedJob($request, $jobId);
        if ($job->applications()->exists()) {
            return response()->json([
                'message' => 'This job already has applications. Close the job instead of deleting it so candidate records are preserved.',
            ], 409);
        }

        $job->delete();
        Cache::forget('jobs:index:v2');
        return response()->json(['message' => 'Job deleted successfully.']);
    }

    private function screeningQuestionsMatch(Job $job, array $questions): bool
    {
        $existing = $job->screeningQuestions()->get()->map(function ($question) {
            return [
                'question_text' => trim((string) $question->question_text),
                'question_type' => (string) $question->question_type,
                'options' => $question->question_type === 'multiple_choice' ? array_values(array_filter(array_map(fn ($option) => trim((string) $option), $question->options ?? []))) : [],
                'required' => (bool) $question->required,
            ];
        })->values()->all();

        $incoming = collect(array_values($questions))->map(function ($question) {
            $type = (string) ($question['question_type'] ?? 'text');
            return [
                'question_text' => trim((string) ($question['question_text'] ?? '')),
                'question_type' => $type,
                'options' => $type === 'multiple_choice' ? array_values(array_filter(array_map(fn ($option) => trim((string) $option), $question['options'] ?? []))) : [],
                'required' => (bool) ($question['required'] ?? true),
            ];
        })->all();

        return $existing === $incoming;
    }

    private function replaceScreeningQuestions(Job $job, array $questions): void
    {
        $job->screeningQuestions()->delete();
        foreach (array_values($questions) as $index => $question) {
            if (!is_array($question) || trim((string) ($question['question_text'] ?? '')) === '') continue;
            $job->screeningQuestions()->create([
                'question_text' => trim((string) $question['question_text']),
                'question_type' => $question['question_type'] ?? 'text',
                'options' => ($question['question_type'] ?? 'text') === 'multiple_choice'
                    ? array_values(array_filter(array_map(fn ($option) => trim((string) $option), $question['options'] ?? [])))
                    : null,
                'required' => (bool) ($question['required'] ?? true),
                'order' => $index,
            ]);
        }
    }
}
