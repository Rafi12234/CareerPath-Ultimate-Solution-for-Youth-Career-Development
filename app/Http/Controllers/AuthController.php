<?php

namespace App\Http\Controllers;

use App\Models\UserSession;
use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Throwable;

class AuthController extends Controller
{
    public function __construct(private readonly JwtService $jwtService)
    {
    }

    private function normalizeEmail(string $email): string
    {
        $normalized = strtolower(trim($email));

        if (str_ends_with($normalized, '@gamil.com')) {
            return str_replace('@gamil.com', '@gmail.com', $normalized);
        }

        return $normalized;
    }

    private function issueTokenForUser(User $user, Request $request): array
    {
        $jti = (string) Str::uuid();
        $issued = $this->jwtService->createToken((int) $user->id, $jti);

        UserSession::create([
            'user_id' => $user->id,
            'jti' => $jti,
            'device_name' => (string) $request->userAgent(),
            'issued_at' => now(),
            'expires_at' => $issued['expires_at'],
        ]);

        UserSession::where('expires_at', '<=', now())->delete();

        return [
            'token' => $issued['token'],
            'expires_at' => $issued['expires_at'],
        ];
    }

    public function register(Request $request)
    {
        $name = is_string($request->input('name')) ? trim((string) $request->input('name')) : '';
        $emailInput = is_string($request->input('email')) ? (string) $request->input('email') : '';
        $password = is_string($request->input('password')) ? (string) $request->input('password') : '';
        $passwordConfirmation = is_string($request->input('password_confirmation')) ? (string) $request->input('password_confirmation') : '';

        $payload = [
            'name' => $name,
            'email' => $this->normalizeEmail($emailInput),
            'password' => $password,
            'password_confirmation' => $passwordConfirmation,
        ];

        $validator = Validator::make($payload, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $payload['name'],
                'email' => $payload['email'],
                'password' => Hash::make($payload['password']),
                'email_verified_at' => now(),
                'profile_completed' => false,
            ]);

            $issued = $this->issueTokenForUser($user, $request);

            return response()->json([
                'user' => $user,
                'token' => $issued['token'],
                'token_expires_at' => $issued['expires_at'],
            ], 201);
        } catch (Throwable $e) {
            Log::error('Register endpoint failed', [
                'email' => $payload['email'] ?? null,
                'exception' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Registration failed. Please try again.',
            ], 422);
        }
    }

    public function login(Request $request)
    {
        $emailInput = is_string($request->input('email')) ? (string) $request->input('email') : '';
        $password = is_string($request->input('password')) ? (string) $request->input('password') : '';

        $payload = [
            'email' => $this->normalizeEmail($emailInput),
            'password' => $password,
        ];

        $validator = Validator::make($payload, [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::where('email', $payload['email'])->first();

            if (!$user || !Hash::check($payload['password'], $user->password)) {
                return response()->json([
                    'message' => 'The provided credentials are incorrect.',
                    'errors' => [
                        'email' => ['The provided credentials are incorrect.'],
                    ],
                ], 422);
            }

            $issued = $this->issueTokenForUser($user, $request);

            return response()->json([
                'user' => $user,
                'token' => $issued['token'],
                'token_expires_at' => $issued['expires_at'],
            ]);
        } catch (Throwable $e) {
            Log::error('Login endpoint failed', [
                'email' => $payload['email'] ?? null,
                'exception' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Login failed. Please try again.',
            ], 422);
        }
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $jti = $request->attributes->get('jwt_jti');

        if ($user && is_string($jti)) {
            UserSession::where('user_id', $user->id)
                ->where('jti', $jti)
                ->whereNull('revoked_at')
                ->update(['revoked_at' => now()]);
        }

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
