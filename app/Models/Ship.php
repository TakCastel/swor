<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ship extends Model
{
    use HasUuids;

    protected $fillable = [
        'character_id',
        'name',
        'model',
        'cargo_capacity',
        'current_cargo_weight',
    ];

    public function character(): BelongsTo
    {
        return $this->belongsTo(Character::class, 'character_id');
    }

    public function modules(): HasMany
    {
        return $this->hasMany(ShipModule::class, 'ship_id');
    }
}
