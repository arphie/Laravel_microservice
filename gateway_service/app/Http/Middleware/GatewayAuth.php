<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class GatewayAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // 1. Verify the token is valid and not expired
            $user = JWTAuth::parseToken()->getPayload();

            $userId = $user->get('sub');
            $userRole = $user->get('role'); // Assuming you added 'role' to the token

            if (!$userId) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // 3. Attach info to headers for the next microservice
            $request->headers->set('X-User-Id', $userId);
            $request->headers->set('X-User-Role', $userRole);

        } catch (Exception $e) {
            if ($e instanceof \PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException) {
                return response()->json(['status' => 'Token is Invalid'], 401);
            } else if ($e instanceof \PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException) {
                return response()->json(['status' => 'Token is Expired'], 401);
            } else {
                return response()->json(['status' => 'Authorization Token not found'], 401);
            }
        }

        return $next($request);
    }
}