<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class GlobalAuditLogger
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // We only log successful or attempted changes and logins
        if (in_array($request->method(), ['POST', 'PATCH', 'PUT', 'DELETE'])) {
            
            // Extract IP ID if present in URL (e.g., /ips/5)
            $pathParts = explode('/', $request->path());
            $ipId = is_numeric(end($pathParts)) ? end($pathParts) : null;

            AuditLog::create([
                'user_id'      => $request->header('X-User-Id'),
                'user_role'    => $request->header('X-User-Role'),
                'session_id'   => session()->getId() ?? 'API_TOKEN_SESSION', 
                'ip_address_id'=> $ipId,
                'action'       => $this->determineAction($request),
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