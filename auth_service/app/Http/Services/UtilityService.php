<?php 

namespace App\Http\Services;

use Illuminate\Http\JsonResponse;

class UtilityService
{
    /**
     * handle api response
     */
    public static function apiResponse(array|null $data = null, string $message = '', int $status = 200): JsonResponse
    {
        return response()->json([
            'data' => $data,
            'message' => $message,
        ], $status);
    }
}