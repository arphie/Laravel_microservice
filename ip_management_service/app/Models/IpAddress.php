<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IpAddress extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * * @var string
     */
    protected $table = 'ip_addresses';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'address',
        'label',
        'comment',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     * * Laravel 12 style for type safety.
     */
    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'created_at' => 'datetime:M d, Y H:i',
            'updated_at' => 'datetime:M d, Y H:i',
        ];
    }

    /**
     * Scope a query to search by IP address.
     * Useful if you want to find a specific IP later.
     */
    public function scopeByAddress($query, $address)
    {
        return $query->where('address', $address);
    }
}