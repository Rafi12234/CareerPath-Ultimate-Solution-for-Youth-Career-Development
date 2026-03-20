<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    /**
     * Admin login - with hardcoded credentials for now
     * Email: admin123@gmail.com
     * Password: 123456
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        // Hardcoded admin credentials
        $adminEmail = 'admin123@gmail.com';
        $adminPassword = '123456';

        // Check if provided credentials match admin credentials
        if ($request->email === $adminEmail && $request->password === $adminPassword) {
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

        // Invalid credentials
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are invalid for admin login.'],
        ]);
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
