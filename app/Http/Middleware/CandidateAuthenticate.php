<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CandidateAuthenticate
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || ($user->role ?? 'user') !== 'user') {
            return response()->json(['message' => 'Candidate account access required.'], 403);
        }

        return $next($request);
    }
}
