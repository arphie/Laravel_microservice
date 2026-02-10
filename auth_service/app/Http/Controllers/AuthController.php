<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
    public function login(Request $request, UtilityService $utilityService)
    {
        /**
         * Validate on Gateway first (optional but recommended)
         */
        $loginRequest = $this->authService->login($request);

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
    public function refresh(Request $request, UtilityService $utilityService)
    {
        $refreshRequest = $this->authService->refresh($request);

        return $utilityService->apiResponse($refreshRequest['data'] ?? null, $refreshRequest['message'] ?? '', $refreshRequest['status'] ?? 200);
    }
}
