<?php

namespace App\Http\Interfaces;

interface IpManagementInterface
{
    public function getAllIps(): array;
    
    public function addIp(array $data, int $userId): object;
    
    public function updateIp(int $id, array $data): bool;

    public function deleteIp(int $id): bool;
}