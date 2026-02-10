<?php 

namespace App\Http\Services;

class UtilityService
{
    /**
     * handle api response
     */
    public static function apiResponse($data = null, $message = '', $status = 200)
    {
        return response()->json([
            'data' => $data,
            'message' => $message,
        ], $status);
    }
}