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
    {   return response()->json(['message' => $request->all()]);
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
        $request->validate(['label' => 'required|string']);
        
        $this->ipService->updateLabel($id, $request->label);
        return response()->json(['message' => 'Label updated successfully']);
    }
}
