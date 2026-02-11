<?php

namespace App\Http\Interfaces;

interface IpManagementInterface
{
    public function getAllIps(): array;
    
    public function addIp(array $data, int $userId): object;
    
    public function updateLabel(int $id, string $newLabel): bool;
}