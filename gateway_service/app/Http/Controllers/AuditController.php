<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Interfaces\AuditInterface;

class AuditController extends Controller
{
    public function __construct(
        protected AuditInterface $auditService
    ) {}

    public function index(Request $request)
    {
        $data = $request->all();

        $audit_logs = $this->auditService->index((int)$data['limit'], (int)$data['page']);

        return response()->json($audit_logs);
    }
}
