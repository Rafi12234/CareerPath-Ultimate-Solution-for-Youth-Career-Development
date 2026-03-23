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
            $keptIds = [];

            foreach ($templates as $index => $template) {
                $question = ScreeningQuestion::updateOrCreate(
                    [
                        'job_id' => $job->id,
                        'order' => $index + 1,
                    ],
                    [
                        'question_text' => $template['question_text'],
                        'question_type' => $template['question_type'],
                        'options' => $template['options'] ?? null,
                        'required' => $template['required'] ?? true,
                    ]
                );

                $keptIds[] = $question->id;
            }

            // Keep each job capped to the 3 generated screening questions.
            ScreeningQuestion::where('job_id', $job->id)
                ->whereNotIn('id', $keptIds)
                ->delete();
        }
    }

    private function templatesForJob(string $title, string $track): array
    {
        $titleLc = strtolower($title);
        $trackLc = strtolower($track);

        $isFullStack = str_contains($titleLc, 'full stack');
        $isFrontend = str_contains($titleLc, 'frontend') || str_contains($titleLc, 'ui/ux') || str_contains($titleLc, 'ui ux');
        $isMobile = str_contains($titleLc, 'mobile');
        $isDevops = str_contains($titleLc, 'devops');
        $isBackend = str_contains($titleLc, 'backend');
        $isSecurity = str_contains($titleLc, 'cybersecurity') || str_contains($titleLc, 'security') || str_contains($trackLc, 'cybersecurity');
        $isDataOrMl = str_contains($titleLc, 'data') || str_contains($titleLc, 'machine learning') || str_contains($trackLc, 'data science');
        $isWriter = str_contains($titleLc, 'content writer') || str_contains($titleLc, 'writer') || str_contains($trackLc, 'content');

        if ($isFullStack) {
            return [
                [
                    'question_text' => 'Which stack have you used most recently in production or major projects?',
                    'question_type' => 'multiple_choice',
                    'options' => ['MERN', 'Laravel + React/Vue', '.NET + Angular/React', 'Other'],
                ],
                [
                    'question_text' => 'Describe one feature where you implemented both backend API and frontend UI.',
                    'question_type' => 'text',
                ],
                [
                    'question_text' => 'Can you independently debug issues across frontend, backend, and database layers?',
                    'question_type' => 'yes_no',
                ],
            ];
        }

        if ($isFrontend) {
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

        if ($isMobile) {
            return [
                [
                    'question_text' => 'Which mobile framework are you strongest in?',
                    'question_type' => 'multiple_choice',
                    'options' => ['Flutter', 'React Native', 'Native Android/iOS', 'I am still learning'],
                ],
                [
                    'question_text' => 'Share a mobile app feature you built and how you handled performance or state management.',
                    'question_type' => 'text',
                ],
                [
                    'question_text' => 'Are you comfortable publishing builds and handling app store deployment steps?',
                    'question_type' => 'yes_no',
                ],
            ];
        }

        if ($isDevops) {
            return [
                [
                    'question_text' => 'How experienced are you with CI/CD pipeline setup and maintenance?',
                    'question_type' => 'multiple_choice',
                    'options' => ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                ],
                [
                    'question_text' => 'Describe one deployment or infrastructure issue you resolved and the steps you took.',
                    'question_type' => 'text',
                ],
                [
                    'question_text' => 'Can you manage Docker-based environments and basic cloud service configuration?',
                    'question_type' => 'yes_no',
                ],
            ];
        }

        if ($isSecurity) {
            return [
                [
                    'question_text' => 'How would you rate your hands-on experience with vulnerability assessment tools?',
                    'question_type' => 'multiple_choice',
                    'options' => ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                ],
                [
                    'question_text' => 'Briefly explain a security risk you identified in a system and how you mitigated it.',
                    'question_type' => 'text',
                ],
                [
                    'question_text' => 'Are you familiar with OWASP Top 10 and common web application attack vectors?',
                    'question_type' => 'yes_no',
                ],
            ];
        }

        if ($isDataOrMl) {
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

        if ($isWriter) {
            return [
                [
                    'question_text' => 'How comfortable are you writing technical content for developer and non-developer audiences?',
                    'question_type' => 'multiple_choice',
                    'options' => ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                ],
                [
                    'question_text' => 'Share one example of a technical topic you explained clearly for a broad audience.',
                    'question_type' => 'text',
                ],
                [
                    'question_text' => 'Can you deliver SEO-friendly articles with proper structure, citations, and editing standards?',
                    'question_type' => 'yes_no',
                ],
            ];
        }

        if ($isBackend || str_contains($trackLc, 'software')) {
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
