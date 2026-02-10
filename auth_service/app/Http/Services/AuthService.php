<?php

namespace App\Http\Services;

use App\Http\Interfaces\AuthServiceInterface;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class AuthService implements AuthServiceInterface
{
    /**
     * Login user and return access token and refresh token
     */
    public function login($request): ?array
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        
        if ($validator->fails()) {
            return ['status' => 422, 'message' => 'Validation error', 'data' => $validator->errors()];
        }

        $credentials = $validator->validated();

        if (! $token = auth('api')->attempt($credentials)) {
            return ['status' => 401, 'message' => 'Unauthorized', 'data' => null];
        }

        $refreshToken = $this->createRefreshToken();

        return ['status' => 200, 'message' => 'Login successful', 'data' => $token ? $this->respondWithToken($token, $refreshToken) : null];
    }

    /**
     * Refresh access token using refresh token
     */
    public function refresh($request): ?array
    {
        // 1. Get the token from the 'refresh_token' cookie instead of the header
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return ['status' => 401, 'message' => 'Refresh token missing', 'data' => null];
        }

        try {
            // 2. Set the token manually into the JWT Auth manager
            $decoded = auth('api_refresh')->setToken($refreshToken)->check(true);
            
            if (!$decoded) {
                return ['status' => 401, 'message' => 'Unauthorized', 'data' => null];
            }

            $user = auth('api_refresh')->user();
            if (!$user) {
                return ['status' => 404, 'message' => 'User not found', 'data' => null];
            }

            // Invalidate old refresh token (Token Rotation)
            auth('api_refresh')->invalidate();

            // Create new pair
            $newAccessToken = auth('api')->login($user);
            $newRefreshToken = $this->createRefreshToken(); // Ensure this generates a new JWT string

            // 3. Prepare response with a NEW cookie
            $response = response()->json([
                'status' => 200, 
                'message' => 'Token refreshed', 
                'data' => ['access_token' => $newAccessToken]
            ]);

            // Attach the new refresh token as a cookie
            return $response->withCookie(cookie(
                'refresh_token', 
                $newRefreshToken, 
                60 * 24 * 7, // 1 week
                '/', 
                null, 
                true, // Secure
                true, // HttpOnly
                false, 
                'Lax'
            ));

        } catch (\PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException $e) {
            return ['status' => 401, 'message' => 'Invalid refresh token', 'data' => null];
        }
    }

    /**
     * Reset user password
     */
    public function forgotPassword($request): bool
    {
        // --- IGNORE ---
        return true;
    }

    /**
     * Logout user and invalidate tokens
     */
    public function logout(): void
    {
        // --- IGNORE ---
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     * @param  string $refreshToken
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token, $refreshToken = null)
    {
        $response = [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
        ];

        if ($refreshToken) {
            $response['refresh_token'] = $refreshToken;
            $response['refresh_expires_in'] = auth('api_refresh')->factory()->getTTL() * 60;
        }

        return response()->json($response);
    }

    /**
     * Create a new refresh token.
     *
     * @return string
     */
    protected function createRefreshToken()
    {
        return auth('api_refresh')->fromUser(auth('api')->user());
    }
}