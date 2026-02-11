<?php

use Illuminate\Http\Request;
use App\Http\Controllers\IpController;
use Illuminate\Support\Facades\Route;

/**
 * get all IPs
 */
Route::get('/ips', [IpController::class, 'index']);

/**
 * create new IP
 */
Route::post('/ips', [IpController::class, 'store']);

/**
 * update existing IP
 */
Route::patch('/ips/{id}', [IpController::class, 'update']);

/**
 * delete IP
 */
Route::delete('/ips/{id}', [IpController::class, 'destroy']);