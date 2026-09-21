<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use App\Models\UserSession;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CompanyAuthController extends Controller
{
    public function __construct(private readonly JwtService $jwtService)
    {
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

        return $issued;
    }

    private function companyPayload(User $user): array
    {
        $company = $user->company;

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'company' => $company,
        ];
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'contact_name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'industry' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:2048',
            'phone' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'company_size' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'The given data was invalid.', 'errors' => $validator->errors()], 422);
        }

        $result = DB::transaction(function () use ($request) {
            $email = strtolower(trim((string) $request->email));
            $user = User::create([
                'name' => trim((string) $request->contact_name),
                'email' => $email,
                'password' => Hash::make((string) $request->password),
                'role' => 'company',
                'email_verified_at' => now(),
                'profile_completed' => true,
            ]);

            $baseSlug = Str::slug((string) $request->company_name) ?: 'company';
            $slug = $baseSlug;
            $counter = 1;
            while (Company::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }

            Company::create([
                'user_id' => $user->id,
                'name' => trim((string) $request->company_name),
                'slug' => $slug,
                'industry' => $request->industry,
                'website' => $request->website,
                'phone' => $request->phone,
                'email' => $email,
                'location' => $request->location,
                'company_size' => $request->company_size,
                'description' => $request->description,
                'status' => 'active',
            ]);

            return $user->fresh('company');
        });

        $issued = $this->issueTokenForUser($result, $request);

        return response()->json([
            'message' => 'Company account created successfully.',
            ...$this->companyPayload($result),
            'token' => $issued['token'],
            'token_expires_at' => $issued['expires_at'],
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'The given data was invalid.', 'errors' => $validator->errors()], 422);
        }

        $user = User::where('email', strtolower(trim((string) $request->email)))
            ->where('role', 'company')
            ->with('company')
            ->first();

        if (!$user || !Hash::check((string) $request->password, (string) $user->password)) {
            return response()->json(['message' => 'The provided company credentials are incorrect.'], 422);
        }

        if (!$user->company || $user->company->status !== 'active') {
            return response()->json(['message' => 'This company account is not active.'], 403);
        }

        $issued = $this->issueTokenForUser($user, $request);

        return response()->json([
            'message' => 'Company login successful.',
            ...$this->companyPayload($user),
            'token' => $issued['token'],
            'token_expires_at' => $issued['expires_at'],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('company');
        return response()->json($this->companyPayload($user));
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

        return response()->json(['message' => 'Company logged out successfully.']);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $company = $user->company;

        $validator = Validator::make($request->all(), [
            'contact_name' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:users,email,' . $user->id,
            'industry' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:2048',
            'phone' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'company_size' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:5000',
            'logo_url' => 'nullable|url|max:2048',
            'founded_year' => 'nullable|integer|min:1800|max:' . (int) date('Y'),
            'current_password' => 'nullable|required_with:new_password|string',
            'new_password' => 'nullable|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'The given data was invalid.', 'errors' => $validator->errors()], 422);
        }

        if ($request->filled('new_password') && !Hash::check((string) $request->current_password, (string) $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        DB::transaction(function () use ($request, $user, $company) {
            if ($request->filled('contact_name')) $user->name = trim((string) $request->contact_name);
            if ($request->filled('email')) $user->email = strtolower(trim((string) $request->email));
            if ($request->filled('new_password')) $user->password = Hash::make((string) $request->new_password);
            $user->save();

            $updates = [];
            foreach (['industry', 'website', 'phone', 'location', 'company_size', 'description', 'logo_url', 'founded_year'] as $field) {
                if ($request->exists($field)) $updates[$field] = $request->input($field);
            }
            if ($request->filled('company_name')) $updates['name'] = trim((string) $request->company_name);
            if ($request->filled('email')) $updates['email'] = strtolower(trim((string) $request->email));
            if ($updates) $company->update($updates);

            if (array_key_exists('name', $updates)) {
                $company->jobs()->update(['company' => $updates['name']]);
            }
        });

        // Public job cards cache the display company name; keep it synchronized after profile changes.
        Cache::forget('jobs:index:v2');

        return response()->json([
            'message' => 'Company profile updated successfully.',
            ...$this->companyPayload($user->fresh('company')),
        ]);
    }
}
