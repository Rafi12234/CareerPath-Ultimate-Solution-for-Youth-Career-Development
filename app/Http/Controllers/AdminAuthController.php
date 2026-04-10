<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserSession;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Throwable;

class AdminAuthController extends Controller
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

    /**
     * Admin login using the database-backed admin account.
     */
    public function login(Request $request)
    {
        $emailInput = is_string($request->input('email')) ? (string) $request->input('email') : '';
        $password = is_string($request->input('password')) ? (string) $request->input('password') : '';

        $payload = [
            'email' => $this->normalizeEmail($emailInput),
            'password' => $password,
        ];

        $validator = Validator::make($payload, [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $admin = User::where('email', $payload['email'])
                ->where('role', 'admin')
                ->first();

            if (!$admin || !Hash::check($payload['password'], $admin->password)) {
                return response()->json([
                    'message' => 'The provided credentials are invalid for admin login.',
                    'errors' => [
                        'email' => ['The provided credentials are invalid for admin login.'],
                    ],
                ], 422);
            }

            $issued = $this->issueTokenForUser($admin, $request);

            return response()->json([
                'message' => 'Admin login successful',
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'role' => $admin->role,
                ],
                'token' => $issued['token'],
                'token_expires_at' => $issued['expires_at'],
                'type' => 'bearer',
            ], 200);
        } catch (Throwable $e) {
            Log::error('Admin login endpoint failed', [
                'email' => $payload['email'] ?? null,
                'exception' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Admin login failed. Please try again.',
            ], 422);
        }
    }

    /**
     * Admin logout
     */
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

        return response()->json([
            'message' => 'Admin logged out successfully',
        ], 200);
    }

    /**
     * Get current admin info
     */
    public function me(Request $request)
    {
        return response()->json([
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
            'role' => $request->user()->role,
        ], 200);
    }

    /**
     * Update admin email and/or password.
     */
    public function updateCredentials(Request $request)
    {
        $admin = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string|min:6',
            'email' => 'nullable|email|unique:users,email,' . $admin->id,
            'new_password' => 'nullable|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        if (!$request->filled('email') && !$request->filled('new_password')) {
            return response()->json([
                'message' => 'Please provide a new email and/or new password.',
            ], 422);
        }

        if (!Hash::check((string) $request->input('current_password'), (string) $admin->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
                'errors' => [
                    'current_password' => ['Current password is incorrect.'],
                ],
            ], 422);
        }

        if ($request->filled('email')) {
            $admin->email = $this->normalizeEmail((string) $request->input('email'));
        }

        if ($request->filled('new_password')) {
            $admin->password = Hash::make((string) $request->input('new_password'));
        }

        $admin->save();

        return response()->json([
            'message' => 'Admin account updated successfully.',
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
            ],
        ], 200);
    }
}
