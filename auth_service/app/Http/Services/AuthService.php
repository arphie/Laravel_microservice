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
    public function login(string $email, string $password): ?array
    {

        $token = auth('api')->attempt(['email' => $email, 'password' => $password]);

        if (! $token) {
            return ['status' => 401, 'message' => 'Unauthorized', 'data' => null];
        }
        /**
         * get user data
         */
        $user = auth('api')->user();

        $refreshToken = $this->createRefreshToken();

        return [
            'status' => 200, 
            'message' => 'Login successful', 
            'data' => [
                'token_info' => $this->respondWithToken($token, $refreshToken),
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role, // Since we added roles earlier
                ]
            ]
        ];
    }

    /**
     * Refresh access token using refresh token
     */
    public function refresh($refreshToken): ?array
    {
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
            // $response = response()->json([
            //     'status' => 200, 
            //     'message' => 'Token refreshed', 
            //     'data' => ['access_token' => $newAccessToken]
            // ]);

            // To this:
            return [
                'status' => 200,
                'message' => 'Token refreshed',
                'data' => [
                    'access_token' => $newAccessToken,
                    'refresh_token' => $newRefreshToken
                ]
            ];

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