<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use App\Http\Services\UtilityService;
use App\Http\Interfaces\AuthServiceInterface;

class AuthController extends Controller
{
    public function __construct(
        protected AuthServiceInterface $authService
    ) {}

    /**
     * Get a JWT via given credentials.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request, UtilityService $utilityService): JsonResponse
    {
        $data = $request->all();

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
        
        if ($validator->fails()) {
            return $utilityService->apiResponse(null, 'Validation error', 422);
        }

        $credentials = $validator->validated();

        /**
         * Validate on Gateway first (optional but recommended)
         */
        $loginRequest = $this->authService->login($credentials['email'], $credentials['password']);

        
        /**
         * return with JWT token and refresh token if login is successful, otherwise return error message with appropriate status code
         */
        return $utilityService->apiResponse($loginRequest['data'] ?? null, $loginRequest['message'] ?? '', $loginRequest['status'] ?? 200);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh(Request $request, UtilityService $utilityService): JsonResponse
    {
        $refreshToken = $request->cookie('refresh_token') ?? $request->input('refresh_token');

        if (!$refreshToken) {
            return $utilityService->apiResponse(null, 'Refresh token missing', 401);
        }

        $refreshRequest = $this->authService->refresh($refreshToken);

        return $utilityService->apiResponse($refreshRequest['data'] ?? null, $refreshRequest['message'] ?? '', $refreshRequest['status'] ?? 200);
    }
}
