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
Routes::prefix('ip')->group(function () {
    Route::get('/', function () {
        /**
         * Get IP addresses from IP Management Service and return the response as
         * JSON with appropriate status code
         */
        $response = Http::get('http://ip_management_service:8003/api/ip');
        return response()->json($response->json(), $response->status());
    });

    /**
     * Create a new IP address by sending a POST request to the IP Management Service with the request
     * data and return the response as JSON with appropriate status code
     */
    Route::post('/', function (Request $request) {
        $response = Http::post('http://ip_management_service:8003/api/ip', $request->all());
        return response()->json($response->json(), $response->status());
    });
});