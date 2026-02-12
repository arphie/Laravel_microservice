<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/**
 * Auth routes
 */
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh-token', [AuthController::class, 'refresh']);


/**
 * IP Management Routes
 */
Route::middleware(['auth.jwt', 'ip.access'])->group(function () {

    // Forwarding logic for IP Management
    Route::match(['get', 'post', 'patch', 'delete'], '/ip-management/{path}', function (Request $request, $path) {
        
        // Internal URL of the microservice (Docker service name)
        $url = "http://ip_management_service:8000/api/$path";

        // Forward the request with the User ID header
        // Use ->withBody() or pass the array to the method call
            $response = Http::withHeaders([
                'X-User-Id' => $request->header('X-User-Id'),
                'Accept'    => 'application/json',
            ])
            ->send($request->method(), $url, [
                'query' => $request->query(), // Passes ?page=1 etc.
                'json'  => $request->json()->all(), // Passes the actual body
            ]);

        return response()->json($response->json(), $response->status());

    })->where('path', '.*');

});