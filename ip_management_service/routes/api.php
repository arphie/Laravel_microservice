<?php

use Illuminate\Http\Request;
use App\Http\Controllers\IpController;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ips', [IpController::class, 'index']);
Route::post('/ips', [IpController::class, 'store']);
Route::patch('/ips/{id}', [IpController::class, 'update']);