<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CompanyAuthenticate
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || ($user->role ?? null) !== 'company') {
            return response()->json(['message' => 'Company portal access denied.'], 403);
        }

        $company = $user->company;
        if (!$company) {
            return response()->json(['message' => 'Company profile not found.'], 403);
        }

        if (($company->status ?? 'active') !== 'active') {
            return response()->json(['message' => 'This company account is not active.'], 403);
        }

        $request->attributes->set('company', $company);

        return $next($request);
    }
}
