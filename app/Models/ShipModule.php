<?php

namespace App\Models;

use App\Enums\ShipModuleStatus;
use App\Enums\ShipModuleType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShipModule extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'ship_id',
        'name',
        'type',
        'status',
        'stats',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => ShipModuleType::class,
            'status' => ShipModuleStatus::class,
            'stats' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function ship(): BelongsTo
    {
        return $this->belongsTo(Ship::class, 'ship_id');
    }
}
