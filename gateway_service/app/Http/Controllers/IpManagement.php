<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class IpManagement extends Controller
{
    /**
     * Add IP address by sending a POST request to the IP Management Service with the request
     * data and return the response as JSON with appropriate status code
     */
    public function addIp(Request $request)
    {
        $response = Http::post('http://ip_management_service:8003/api/ip', $request->all());
        return response()->json($response->json(), $response->status());
    }

    /**
     * edit IP address by sending a PUT request to the IP Management Service with the request
     * data and return the response as JSON with appropriate status code
     */
    public function editIp(Request $request, $id)
    {
        $response = Http::put("http://ip_management_service:8003/api/ip/{$id}", $request->all());
        return response()->json($response->json(), $response->status());
    }

    /**
     * remove IP address by sending a DELETE request to the IP Management Service with the request
     * data and return the response as JSON with appropriate status code
     */
    public function removeIp($id)
    {
        $response = Http::delete("http://ip_management_service:8003/api/ip/{$id}");
        return response()->json($response->json(), $response->status());
    }

    /**
     * get IP addresses from IP Management Service and return the response as JSON with appropriate status code
     */
    public function getIps()
    {
        $response = Http::get('http://ip_management_service:8003/api/ip');
        return response()->json($response->json(), $response->status());
    }
}
