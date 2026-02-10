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
    public function register($credentials): ?array
    {
        // --- IGNORE ---
        return true;
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