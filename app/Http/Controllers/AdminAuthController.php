<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Throwable;

class AdminAuthController extends Controller
{
    private function normalizeEmail(string $email): string
    {
        $normalized = strtolower(trim($email));

        if (str_ends_with($normalized, '@gamil.com')) {
            return str_replace('@gamil.com', '@gmail.com', $normalized);
        }

        return $normalized;
    }

    /**
     * Admin login - with hardcoded credentials for now
     * Email: admin123@gmail.com
     * Password: 123456
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
            // Hardcoded admin credentials
            $adminEmail = 'admin123@gmail.com';
            $adminPassword = '123456';

            // Check if provided credentials match admin credentials
            if ($payload['email'] === $adminEmail && $payload['password'] === $adminPassword) {
                // Create a token for the admin
                // In production, you should use a proper admin table/model
                $token = \Illuminate\Support\Str::random(80);
                
                // Return admin response with token
                return response()->json([
                    'message' => 'Admin login successful',
                    'admin' => [
                        'id' => 'admin_001',
                        'name' => 'Administrator',
                        'email' => $adminEmail,
                        'role' => 'admin',
                    ],
                    'token' => base64_encode($adminEmail . ':' . $token),
                    'type' => 'bearer',
                ], 200);
            }

            return response()->json([
                'message' => 'The provided credentials are invalid for admin login.',
                'errors' => [
                    'email' => ['The provided credentials are invalid for admin login.'],
                ],
            ], 422);
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
        return response()->json([
            'message' => 'Admin logged out successfully',
        ], 200);
    }

    /**
     * Get current admin info
     */
    public function me(Request $request)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'id' => 'admin_001',
            'name' => 'Administrator',
            'email' => 'admin123@gmail.com',
            'role' => 'admin',
        ], 200);
    }
}
