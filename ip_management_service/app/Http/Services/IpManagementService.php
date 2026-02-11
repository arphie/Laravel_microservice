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

    public function updateIp(int $id, array $data): bool
    {
        $ip = IpAddress::findOrFail($id);
        // Eloquent's update() ignores keys that aren't in $fillable 
        // and only changes values that are actually different.
        return $ip->update($data);
    }

    public function deleteIp(int $id): bool
    {
        $ip = IpAddress::findOrFail($id);
        return $ip->delete();
    }
}