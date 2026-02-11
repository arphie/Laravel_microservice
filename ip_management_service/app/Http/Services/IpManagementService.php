<?php

namespace App\Http\Services;

use App\Http\Interfaces\IpManagementInterface;
use App\Models\IpAddress;

class IpManagementService implements IpManagementInterface
{
    public function getAllIps(): array
    {
        return IpAddress::all()->toArray();
    }

    public function addIp(array $data, int $userId): object
    {
        return IpAddress::create([
            'address' => $data['address'],
            'label'   => $data['label'],
            'comment' => $data['comment'] ?? null,
            'user_id' => $userId
        ]);
    }

    public function updateLabel(int $id, string $newLabel): bool
    {
        $ip = IpAddress::findOrFail($id);
        return $ip->update(['label' => $newLabel]);
    }
}