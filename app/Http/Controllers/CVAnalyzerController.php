<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class CVAnalyzerController extends Controller
{
    private const QUOTA_COOLDOWN_SECONDS = 90;
    private const ANALYZE_LOCK_SECONDS = 15;
    private const HIGH_DEMAND_RETRY_DELAY = 3; // seconds
    private const MAX_HIGH_DEMAND_RETRIES = 2;

    private function isQuotaError(?string $errorMessage): bool
    {
        if (!$errorMessage) {
            return false;
        }

        $message = strtolower($errorMessage);
        return str_contains($message, 'quota exceeded')
            || str_contains($message, 'resource_exhausted')
            || str_contains($message, 'request limit per minute')
            || str_contains($message, 'rate limit');
    }

    private function isHighDemandError(?string $errorMessage): bool
    {
        if (!$errorMessage) {
            return false;
        }

        $message = strtolower($errorMessage);
        return str_contains($message, 'high demand')
            || str_contains($message, 'service unavailable')
            || str_contains($message, 'temporarily unavailable');
    }

    public function analyze(Request $request)
    {
        $request->validate([
            'cv_file' => 'required|file|mimes:pdf,jpeg,png,jpg,gif,webp|max:10240', // 10MB
        ]);

        $file = $request->file('cv_file');
        $geminiKey = env('GEMINI_API_KEY');

        if (!$geminiKey) {
            return response()->json(['message' => 'Gemini API not configured'], 500);
        }

        $cooldownKey = 'gemini:cv:quota:cooldown';
        $cooldownUntil = Cache::get($cooldownKey);
        if ($cooldownUntil && now()->timestamp < (int) $cooldownUntil) {
            $retryAfter = max(1, (int) $cooldownUntil - now()->timestamp);
            return response()->json([
                'message' => 'CV analysis temporarily unavailable due to Gemini quota limits. Please try again shortly.',
                'error' => 'Gemini quota cooldown is active.',
                'retry_after_seconds' => $retryAfter,
            ], 429);
        }

        $requestOwner = $request->user() ? ('user:' . $request->user()->id) : ('ip:' . $request->ip());
        $inFlightKey = 'gemini:cv:inflight:' . $requestOwner;
        if (!Cache::add($inFlightKey, true, self::ANALYZE_LOCK_SECONDS)) {
            return response()->json([
                'message' => 'CV analysis already in progress. Please wait a few seconds before trying again.',
                'error' => 'Duplicate analysis request blocked.',
                'retry_after_seconds' => self::ANALYZE_LOCK_SECONDS,
            ], 429);
        }

        try {
            // Read file content
            $fileContent = file_get_contents($file->getRealPath());
            $fileName = $file->getClientOriginalName();
            $mimeType = $file->getMimeType();

            // Prepare Gemini request based on file type
            $geminiPayload = $this->buildGeminiPayload($fileContent, $mimeType, $fileName);

            // Some Gemini models reject PDF inline_data. Try model fallbacks for file analysis.
            $modelsToTry = $mimeType === 'application/pdf'
                ? ['gemini-1.5-flash', 'gemini-2.5-flash']
                : ['gemini-2.5-flash', 'gemini-1.5-flash'];

            $analysisText = null;
            $lastError = 'Unknown error';
            $lastHighDemandError = null;

            foreach ($modelsToTry as $model) {
                $retryCount = 0;
                $modelSuccess = false;

                while ($retryCount <= self::MAX_HIGH_DEMAND_RETRIES && !$modelSuccess) {
                    $geminiResponse = Http::withHeader('Content-Type', 'application/json')
                        ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$geminiKey}", $geminiPayload);

                    if ($geminiResponse->successful()) {
                        $candidateText = $geminiResponse->json('candidates.0.content.parts.0.text');
                        if (is_string($candidateText) && trim($candidateText) !== '') {
                            $analysisText = $candidateText;
                            $modelSuccess = true;
                            break;
                        }
                        $lastError = "Model {$model} returned empty analysis text";
                        break;
                    } else {
                        $apiError = $geminiResponse->json('error.message')
                            ?? $geminiResponse->json('error.status')
                            ?? 'Unknown error';
                        $lastError = "Model {$model} failed: {$apiError}";

                        // Quota error: stop immediately
                        if ($this->isQuotaError($apiError)) {
                            $cooldownUntilTs = now()->addSeconds(self::QUOTA_COOLDOWN_SECONDS)->timestamp;
                            Cache::put($cooldownKey, $cooldownUntilTs, now()->addSeconds(self::QUOTA_COOLDOWN_SECONDS));
                            return response()->json([
                                'message' => 'CV analysis temporarily unavailable due to Gemini quota limits. Please try again in 1-2 minutes.',
                                'error' => $lastError,
                                'retry_after_seconds' => self::QUOTA_COOLDOWN_SECONDS,
                            ], 429);
                        }

                        // High demand error: retry up to MAX_HIGH_DEMAND_RETRIES times
                        if ($this->isHighDemandError($apiError)) {
                            $lastHighDemandError = $apiError;
                            if ($retryCount < self::MAX_HIGH_DEMAND_RETRIES) {
                                $retryCount++;
                                sleep(self::HIGH_DEMAND_RETRY_DELAY);
                                continue; // Retry same model
                            }
                            // Max retries reached, fall through to next model
                            break;
                        }

                        // Other error: move to next model
                        break;
                    }
                }

                // If analysis succeeded, break out of model loop
                if ($analysisText) {
                    break;
                }
            }

            if (!$analysisText) {
                // If we encountered high demand errors, return 503
                if ($lastHighDemandError) {
                    return response()->json([
                        'message' => 'AI models are currently experiencing high demand. Please try again in a few seconds.',
                        'error' => $lastHighDemandError,
                        'retry_after_seconds' => self::HIGH_DEMAND_RETRY_DELAY * 2,
                    ], 503); // 503 Service Unavailable
                }

                return response()->json([
                    'message' => 'CV analysis failed',
                    'error' => $lastError,
                ], 500);
            }

            // Parse Gemini response
            $analysis = $this->parseAnalysis($analysisText);

            return response()->json([
                'success' => true,
                'analysis' => $analysis,
                'raw_response' => $analysisText,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'CV analysis error',
                'error' => $e->getMessage()
            ], 500);
        } finally {
            Cache::forget($inFlightKey);
        }
    }

    public function jobMatch(Request $request)
    {
        $request->validate([
            'cv_analysis' => 'required|array',
            'job_id' => 'nullable|integer|exists:jobs,id',
            'job' => 'nullable|array',
        ]);

        $geminiKey = env('GEMINI_API_KEY');
        if (!$geminiKey) {
            return response()->json(['message' => 'Gemini API not configured'], 500);
        }

        $job = null;
        if ($request->filled('job_id')) {
            $job = Job::find($request->job_id);
        } elseif ($request->filled('job')) {
            $job = (object) $request->job;
        }

        if (!$job) {
            return response()->json(['message' => 'Job not found for matching'], 422);
        }

        $cvAnalysis = $request->input('cv_analysis', []);

        $systemPrompt = <<<'EOT'
You are an expert career coach and hiring advisor.

Analyze how well a candidate CV matches a specific job description.

Return ONLY valid JSON in this exact shape:
{
  "overall_match": 0,
  "skills_match": 0,
  "experience_match": 0,
  "education_match": 0,
  "matching_skills": [""],
  "missing_skills": [""],
  "guidance": "2-4 sentences on how the candidate can become more suitable for this job.",
  "recommendations": ["", "", ""]
}

Scoring rules:
- All score fields are integers from 0 to 100.
- Be strict and realistic.
- Use job requirements and CV evidence only.
EOT;

        $jobPayload = [
            'title' => $job->title ?? null,
            'company' => $job->company ?? null,
            'location' => $job->location ?? null,
            'level' => $job->level ?? null,
            'type' => $job->type ?? null,
            'track' => $job->track ?? null,
            'skills' => $job->skills ?? [],
            'description' => $job->description ?? null,
        ];

        try {
            $geminiResponse = Http::withHeader('Content-Type', 'application/json')
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$geminiKey}", [
                    'system_instruction' => [
                        'parts' => [
                            ['text' => $systemPrompt]
                        ]
                    ],
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => "CV analysis data:\n" . json_encode($cvAnalysis, JSON_PRETTY_PRINT)
                                ],
                                [
                                    'text' => "Job data:\n" . json_encode($jobPayload, JSON_PRETTY_PRINT)
                                ],
                            ]
                        ]
                    ]
                ]);

            if (!$geminiResponse->successful()) {
                return response()->json([
                    'message' => 'Job match analysis failed',
                    'error' => $geminiResponse->json('error.message') ?? 'Unknown error'
                ], 500);
            }

            $matchText = $geminiResponse->json('candidates.0.content.parts.0.text', '');
            $matchScore = $this->parseMatchScore($matchText);

            return response()->json([
                'success' => true,
                'match_score' => $matchScore,
                'raw_response' => $matchText,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'CV-job matching error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function buildGeminiPayload($fileContent, $mimeType, $fileName)
    {
        $systemPrompt = <<<'EOT'
You are an expert career advisor and CV analyst. Analyze the provided CV and provide detailed professional insights.

IMPORTANT: Return your response in the following JSON format ONLY (no other text):
{
  "name": "Extracted full name or 'Not found'",
  "email": "Extracted email or 'Not found'",
  "phone": "Extracted phone or 'Not found'",
  "location": "Extracted location or 'Not found'",
  "professional_summary": "1-2 sentence summary of their career",
  "years_of_experience": "Total years estimated",
  "extracted_skills": ["Skill1", "Skill2", "Skill3"],
  "extracted_experience": [
    {"job_title": "...", "company": "...", "duration": "..."}
  ],
  "extracted_education": [
    {"degree": "...", "field": "...", "institution": "..."}
  ],
  "quality_score": {
    "overall": 75,
    "formatting": 80,
    "content": 70,
    "professionalism": 75
  },
  "strengths": [
    "Clear job titles and responsibilities",
    "Good skill variety"
  ],
  "weaknesses": [
    "Missing quantifiable achievements",
    "No clear career progression"
  ],
  "improvement_tips": [
    "Add metrics and numbers to achievements",
    "Include a professional summary at the top",
    "Use action verbs (led, designed, implemented)"
  ],
  "skills_to_develop": [
    {"skill": "Project Management", "reason": "Frequently required for senior roles"},
    {"skill": "Cloud Technologies", "reason": "Growing demand in industry"}
  ],
  "career_guidance": "2-3 sentences of personalized career advice based on the CV",
  "next_steps": [
    "Consider obtaining AWS certification",
    "Build portfolio projects showcasing your skills"
  ]
}
EOT;

        // Base64 encode file content for Gemini
        $base64Data = base64_encode($fileContent);

        // Determine media type
        $mediaTypeMap = [
            'application/pdf' => 'application/pdf',
            'image/jpeg' => 'image/jpeg',
            'image/jpg' => 'image/jpeg',
            'image/png' => 'image/png',
            'image/gif' => 'image/gif',
            'image/webp' => 'image/webp',
        ];

        $mediaType = $mediaTypeMap[$mimeType] ?? 'application/octet-stream';

        return [
            'system_instruction' => [
                'parts' => [
                    ['text' => $systemPrompt]
                ]
            ],
            'contents' => [
                [
                    'parts' => [
                        [
                            'inline_data' => [
                                'mime_type' => $mediaType,
                                'data' => $base64Data,
                            ]
                        ],
                        [
                            'text' => 'Please analyze this CV and provide detailed professional insights in the JSON format specified in the system prompt.'
                        ]
                    ]
                ]
            ]
        ];
    }

    private function parseAnalysis($jsonText)
    {
        // Try to extract JSON from the response
        if (preg_match('/\{[\s\S]*\}/', $jsonText, $matches)) {
            $json = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $json;
            }
        }

        // Fallback if parsing fails
        return [
            'error' => 'Could not parse analysis',
            'raw_text' => $jsonText
        ];
    }

    private function parseMatchScore($jsonText)
    {
        if (preg_match('/\{[\s\S]*\}/', $jsonText, $matches)) {
            $json = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return [
                    'overall_match' => (int) ($json['overall_match'] ?? 0),
                    'skills_match' => (int) ($json['skills_match'] ?? 0),
                    'experience_match' => (int) ($json['experience_match'] ?? 0),
                    'education_match' => (int) ($json['education_match'] ?? 0),
                    'matching_skills' => array_values($json['matching_skills'] ?? []),
                    'missing_skills' => array_values($json['missing_skills'] ?? []),
                    'guidance' => $json['guidance'] ?? '',
                    'recommendations' => array_values($json['recommendations'] ?? []),
                ];
            }
        }

        return [
            'overall_match' => 0,
            'skills_match' => 0,
            'experience_match' => 0,
            'education_match' => 0,
            'matching_skills' => [],
            'missing_skills' => [],
            'guidance' => 'Unable to generate match guidance at the moment.',
            'recommendations' => [],
        ];
    }
}
