<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\ScreeningQuestion;
use Illuminate\Database\Seeder;

class ScreeningQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $jobs = Job::all();

        foreach ($jobs as $job) {
            $templates = $this->templatesForJob($job->title ?? '', $job->track ?? '');

            foreach ($templates as $index => $template) {
                ScreeningQuestion::updateOrCreate(
                    [
                        'job_id' => $job->id,
                        'question_text' => $template['question_text'],
                    ],
                    [
                        'question_type' => $template['question_type'],
                        'options' => $template['options'] ?? null,
                        'required' => $template['required'] ?? true,
                        'order' => $index + 1,
                    ]
                );
            }
        }
    }

    private function templatesForJob(string $title, string $track): array
    {
        $titleLc = strtolower($title);
        $trackLc = strtolower($track);

        if (str_contains($titleLc, 'backend') || str_contains($trackLc, 'software')) {
            return [
                [
                    'question_text' => 'How many years of backend development experience do you have with PHP/Laravel?',
                    'question_type' => 'multiple_choice',
                    'options' => ['0-1 years', '1-2 years', '2-4 years', '5+ years'],
                ],
                [
                    'question_text' => 'Describe one API performance optimization you implemented in a real or academic project.',
                    'question_type' => 'text',
                ],
                [
                    'question_text' => 'Are you comfortable working with MySQL query optimization and indexing?',
                    'question_type' => 'yes_no',
                ],
            ];
        }

        if (str_contains($titleLc, 'frontend') || str_contains($titleLc, 'ui/ux')) {
            return [
                [
                    'question_text' => 'How confident are you in modern frontend frameworks (React/Vue/Angular)?',
                    'question_type' => 'multiple_choice',
                    'options' => ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                ],
                [
                    'question_text' => 'Share one project where you improved user experience significantly.',
                    'question_type' => 'text',
                ],
                [
                    'question_text' => 'Can you convert Figma designs into responsive layouts independently?',
                    'question_type' => 'yes_no',
                ],
            ];
        }

        if (str_contains($titleLc, 'data') || str_contains($titleLc, 'machine learning')) {
            return [
                [
                    'question_text' => 'How many data analysis or ML projects have you completed?',
                    'question_type' => 'multiple_choice',
                    'options' => ['0-1', '2-3', '4-6', '7+'],
                ],
                [
                    'question_text' => 'What tools and libraries do you usually use for data analysis/modeling?',
                    'question_type' => 'text',
                ],
                [
                    'question_text' => 'Are you comfortable explaining model results to non-technical stakeholders?',
                    'question_type' => 'yes_no',
                ],
            ];
        }

        return [
            [
                'question_text' => 'Why are you interested in this position at our company?',
                'question_type' => 'text',
            ],
            [
                'question_text' => 'How many years of relevant experience do you have for this role?',
                'question_type' => 'multiple_choice',
                'options' => ['Fresher', '1-2 years', '3-5 years', '5+ years'],
            ],
            [
                'question_text' => 'Are you available to join within the next 30 days?',
                'question_type' => 'yes_no',
            ],
        ];
    }
}
