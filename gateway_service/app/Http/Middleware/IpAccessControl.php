<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IpAccessControl
{
    public function handle(Request $request, Closure $next): Response
    {
        $role = $request->header('X-User-Role'); // Passed from your GatewayAuth middleware
        $method = $request->method();

        // Rule 5: Everyone can view (GET)
        if ($method === 'GET') {
            return $next($request);
        }

        // Rule 3 & 4: Both 'user' and 'admin' can modify (PATCH/POST)
        if (in_array($method, ['POST', 'PATCH', 'PUT'])) {
            if (in_array($role, ['user', 'admin'])) {
                return $next($request);
            }
        }

        // Rule 4: Only 'admin' can delete (DELETE)
        if ($method === 'DELETE') {
            if ($role === 'admin') {
                return $next($request);
            }
            
            return response()->json([
                'status' => 403,
                'message' => 'Access Denied: Only admins can delete IP addresses.'
            ], 403);
        }

        // Default Deny for unknown roles or restricted methods
        return response()->json(['status' => 403, 'message' => 'Unauthorized action.'], 403);
    }
}