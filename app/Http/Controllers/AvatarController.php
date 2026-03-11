<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AvatarController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $file = $request->file('avatar');
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        if (!$cloudName || !$apiKey || !$apiSecret) {
            return response()->json(['message' => 'Cloudinary not configured'], 500);
        }

        $timestamp = time();
        $params = [
            'folder' => 'careerpath_avatars',
            'timestamp' => $timestamp,
        ];

        // Build signature string
        ksort($params);
        $signatureString = collect($params)
            ->map(fn($v, $k) => "{$k}={$v}")
            ->implode('&');
        $signatureString .= $apiSecret;
        $signature = sha1($signatureString);

        $response = Http::attach(
            'file', file_get_contents($file->getRealPath()), $file->getClientOriginalName()
        )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
            'api_key' => $apiKey,
            'timestamp' => $timestamp,
            'signature' => $signature,
            'folder' => 'careerpath_avatars',
        ]);

        if (!$response->successful()) {
            return response()->json(['message' => 'Failed to upload image'], 500);
        }

        $imageUrl = $response->json('secure_url');

        $user = User::findOrFail($request->user_id);
        $user->avatar = $imageUrl;
        $user->save();

        return response()->json([
            'avatar' => $imageUrl,
            'user' => $user,
        ]);
    }
}
