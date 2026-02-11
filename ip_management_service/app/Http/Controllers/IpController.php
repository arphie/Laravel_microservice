<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\IpManagementInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class IpController extends Controller
{
    public function __construct(
        protected IpManagementInterface $ipService
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->ipService->getAllIps());
    }

    public function store(Request $request): JsonResponse
    { 
        $validated = $request->validate([
            'address' => 'required|ip', // Laravel handles IPv4 and IPv6 automatically
            'label'   => 'required|string|max:255',
            'comment' => 'nullable|string'
        ]);

        // Get user_id passed from Gateway header
        $userId = $request->header('X-User-Id'); 

        $ip = $this->ipService->addIp($validated, (int)$userId);
        return response()->json($ip, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'address' => 'sometimes|ip',
            'label'   => 'sometimes|string|max:255',
            'comment' => 'sometimes|nullable|string',
        ]);

        if (empty($validated)) {
            return response()->json(['message' => 'No data provided for update'], 422);
        }

        $this->ipService->updateIp($id, $validated);

        return response()->json([
            'status' => 200,
            'message' => 'IP record updated successfully'
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->ipService->deleteIp($id);

        return response()->json(['message' => 'IP address deleted successfully']);
    }
}
