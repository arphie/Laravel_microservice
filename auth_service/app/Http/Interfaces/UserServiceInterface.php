<?php

namespace App\Http\Interfaces;

interface UserServiceInterface
{
    /**
     * Register a new user and return access token and refresh token
     */
    public function register(string $name, string $email, string $password): ?array;

    /**
     * Update user profile information
     */
    public function updateProfile(int $userId, array $data): ?array;
}