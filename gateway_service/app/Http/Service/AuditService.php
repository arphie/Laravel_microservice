<?php

namespace App\Http\Service;

use App\Http\Interfaces\AuditInterface;
use App\Models\AuditLog;
use Illuminate\Contracts\Pagination\Paginator;

class AuditService implements AuditInterface
{
    // Implement audit-related business logic here
    public function index(int $limit, int $page): ?array
    {
        $audit = AuditLog::query()->orderBy('created_at', 'desc')->simplePaginate($limit);
        return [
            'current_page' => $audit->currentPage(),
            'per_page' => $audit->perPage(),
            'data' => $audit->items(), // This returns just the array of models
        ];
    }
}