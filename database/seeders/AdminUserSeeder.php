<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Administrator',
                'role' => 'admin',
                'password' => Hash::make('123456'),
                'email_verified_at' => now(),
                'profile_completed' => true,
            ]
        );
    }
}