<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class GlobalAuditLogger
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Let the login attempt happen first
        $response = $next($request);

        // 2. Only log "writing" actions (POST, PATCH, DELETE)
        if (in_array($request->method(), ['POST', 'PATCH', 'PUT', 'DELETE'])) {
            
            $userId = $request->header('X-User-Id'); // Normal forwarded requests
            $userRole = $request->header('X-User-Role');

            // 3. Capture User ID from Login Response
            if ($request->is('*/login') && $response->getStatusCode() === 200) {
                $content = json_decode($response->getContent(), true);
                
                // Pluck the ID and Role from your Auth service's JSON response
                $userId = $content['data']['user']['id'] ?? null;
                $userRole = $content['data']['user']['role'] ?? 'user';
            }

            // 4. Save the log
            \App\Models\AuditLog::create([
                'user_id'      => $userId,
                'user_role'    => $userRole,
                'session_id'   => session()->getId(),
                'action'       => $request->is('*/login') ? 'LOGIN' : 'DATA_CHANGE',
                'request_data' => $request->except(['password', 'password_confirmation']),
                'url'          => $request->fullUrl(),
                'method'       => $request->method(),
                'ip_origin'    => $request->ip(),
            ]);
        }

        return $response;
    }

    private function determineAction(Request $request): string
    {
        if ($request->is('*/login')) return 'LOGIN';
        if ($request->is('*/logout')) return 'LOGOUT';
        return 'DATA_CHANGE';
    }
}