<?php

namespace App\Http\Interfaces;

use Illuminate\Contracts\Pagination\Paginator;

interface AuditInterface
{
    /**
     * Login user and return access token and refresh token
     */
    public function index(int $limit, int $page): ?array;
}