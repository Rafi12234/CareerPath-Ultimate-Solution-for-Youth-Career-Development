<?php

namespace App\Http\Controllers;

use App\Models\CareerRoadmap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CareerRoadmapController extends Controller
{
    public function history(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $items = CareerRoadmap::where('user_id', $user->id)
            ->latest()
            ->get([
                'id',
                'target_job_title',
                'skills_snapshot',
                'guidance_text',
                'ai_response',
                'roadmap_json',
                'created_at',
            ]);

        return response()->json([
            'success' => true,
            'history' => $items,
        ]);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'target_role' => 'required|string|max:255',
            'user_skills' => 'nullable|array',
        ]);

        $geminiKey = env('GEMINI_API_KEY');
        if (!$geminiKey) {
            return response()->json(['message' => 'Gemini API not configured'], 500);
        }

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $targetRole = trim($request->input('target_role'));
        $userSkills = $request->input('user_skills', []);

        $systemPrompt = <<<'EOT'
You are an expert career strategist.

Given a target job role and current user skills (with proficiency), create a realistic and actionable roadmap.

Return ONLY valid JSON with this exact shape:
{
  "target_role": "string",
  "match_score": 0,
  "summary": "2-3 sentence assessment",
  "current_strengths": ["..."],
  "missing_skills": ["..."],
  "learning_path": [
    {
      "phase": "0-30 days",
      "focus": "...",
      "actions": ["..."],
      "milestone": "..."
    }
  ],
  "projects": ["..."],
  "certifications": ["..."],
  "interview_prep": ["..."],
  "weekly_plan": {
    "hours_per_week": 0,
    "breakdown": ["..."]
  }
}

Rules:
- All score values are 0-100 integers.
- Keep the roadmap practical and job-specific.
- Be concise but concrete.
EOT;

        try {
            $geminiResponse = Http::withHeader('Content-Type', 'application/json')
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$geminiKey}", [
                    'system_instruction' => [
                        'parts' => [
                            ['text' => $systemPrompt],
                        ],
                    ],
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => "Target role: {$targetRole}",
                                ],
                                [
                                    'text' => 'Current user skills with proficiency: ' . json_encode($userSkills, JSON_PRETTY_PRINT),
                                ],
                            ],
                        ],
                    ],
                ]);

            if (!$geminiResponse->successful()) {
                return response()->json([
                    'message' => 'Roadmap generation failed',
                    'error' => $geminiResponse->json('error.message') ?? 'Unknown error',
                ], 500);
            }

            $aiResponse = $geminiResponse->json('candidates.0.content.parts.0.text', '');
            $roadmap = $this->parseRoadmap($aiResponse);

            $guidanceText = $roadmap['summary']
                ?? ($roadmap['guidance'] ?? null);

            $record = CareerRoadmap::create([
                'user_id' => $user->id,
                'target_job_title' => $targetRole,
                'skills_snapshot' => $userSkills,
                'guidance_text' => $guidanceText,
                'ai_response' => $aiResponse,
                'roadmap_json' => $roadmap,
            ]);

            return response()->json([
                'success' => true,
                'roadmap_id' => $record->id,
                'target_role' => $targetRole,
                'roadmap' => $roadmap,
                'ai_response' => $aiResponse,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Roadmap generation error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function parseRoadmap(string $text): array
    {
        if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
            $json = json_decode($matches[0], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
                return $json;
            }
        }

        return [
            'target_role' => '',
            'match_score' => 0,
            'summary' => 'Unable to parse structured roadmap from AI response.',
            'current_strengths' => [],
            'missing_skills' => [],
            'learning_path' => [],
            'projects' => [],
            'certifications' => [],
            'interview_prep' => [],
            'weekly_plan' => [
                'hours_per_week' => 0,
                'breakdown' => [],
            ],
        ];
    }
}
