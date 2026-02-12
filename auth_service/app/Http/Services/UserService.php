<?php

namespace App\Http\Services;

use App\Http\Interfaces\UserServiceInterface;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class UserService implements UserServiceInterface
{
    
    /**
     * Register a new user and return access token and refresh token
     */
    public function register(string $name, string $email, string $password): ?array
    {
        // create a new user
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
        ]);

        return $user;
    }

    /**
     * Update user profile information
     */
    public function updateProfile($userId, $data): ?array
    {
        // --- IGNORE ---
        return true;
    }
}