<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Models\UserSession;
use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class JwtAuthenticate
{
    public function __construct(private readonly JwtService $jwtService)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $decoded = $this->jwtService->validateAndDecode($token);

        if (!$decoded) {
            return response()->json(['message' => 'Invalid or expired token'], 401);
        }

        $session = UserSession::query()
            ->where('user_id', $decoded['uid'])
            ->where('jti', $decoded['jti'])
            ->whereNull('revoked_at')
            ->where('expires_at', '>', now())
            ->first();

        if (!$session) {
            return response()->json(['message' => 'Session is no longer active'], 401);
        }

        $user = User::find($decoded['uid']);

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        Auth::setUser($user);
        $request->setUserResolver(static fn () => $user);
        $request->attributes->set('jwt_jti', $decoded['jti']);

        return $next($request);
    }
}
