<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    /**
     * Forward the login request to the Auth Service
     */
    public function login(Request $request)
    {
        // Validate on Gateway first (optional but recommended)
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        
        $response = Http::post('http://auth_service:8000/api/login', $request->all());

        return response()->json($response->json(), $response->status());
    }

    /**
     * get a new token using the refresh token
     */
    public function refresh(Request $request)
    {
        $response = Http::post('http://auth_service:8000/api/refresh', $request->all());

        return response()->json($response->json(), $response->status());
    }
}
