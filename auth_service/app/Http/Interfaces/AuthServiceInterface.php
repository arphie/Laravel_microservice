<?php

namespace App\Http\Interfaces;

interface AuthServiceInterface
{
    /**
     * Login user and return access token and refresh token
     */
    public function login(Request $request): ?array;

    /**
     * Refresh access token using refresh token
     */
    public function refresh(Request $request): ?array;

    /**
     * Reset user password
     */
    public function forgotPassword(Request $request): bool;

    /**
     * Logout user and invalidate tokens
     */
    public function logout(): void;
}