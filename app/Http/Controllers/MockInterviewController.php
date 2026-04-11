<?php

namespace App\Http\Controllers;

use App\Models\MockInterviewTurn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MockInterviewController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json(['error' => 'Gemini API key is not configured.'], 500);
        }

        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $apiKey;

        try {
            $response = Http::timeout(30)->post($url, [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $request->input('message')],
                        ],
                    ],
                ],
            ]);

            if ($response->failed()) {
                return response()->json([
                    'error' => 'Failed to get response from Gemini.',
                ], $response->status());
            }

            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'No response generated.';

            return response()->json(['reply' => $text]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong. Please try again.'], 500);
        }
    }

    public function storeTurn(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'topic' => 'nullable|string|max:255',
            'turn_number' => 'nullable|integer|min:1',
            'question' => 'required|string',
            'answer' => 'required|string',
            'feedback' => 'nullable|string',
        ]);

        $turn = MockInterviewTurn::create([
            'user_id' => $user->id,
            'topic' => $request->input('topic', 'General interview'),
            'turn_number' => $request->input('turn_number', 1),
            'question' => $request->input('question'),
            'answer' => $request->input('answer'),
            'feedback' => $request->input('feedback'),
        ]);

        return response()->json([
            'success' => true,
            'turn' => $turn,
        ], 201);
    }

    public function history(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => true, 'history' => []]);
        }

        $history = MockInterviewTurn::where('user_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'history' => $history,
        ]);
    }
}