<?php

namespace App\Http\Interfaces;

interface UserServiceInterface
{
    /**
     * Register a new user and return access token and refresh token
     */
    public function register(array $credentials): ?array;

    /**
     * Update user profile information
     */
    public function updateProfile(int $userId, array $data): ?array;
}