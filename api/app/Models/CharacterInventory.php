<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CharacterInventory extends Model
{
    use HasUuids;

    protected $table = 'character_inventory';

    public $timestamps = false;

    protected $fillable = [
        'character_id',
        'item_id',
        'quantity',
        'acquired_at',
    ];

    protected function casts(): array
    {
        return [
            'acquired_at' => 'datetime',
        ];
    }

    public function character(): BelongsTo
    {
        return $this->belongsTo(Character::class, 'character_id');
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(ItemsCatalog::class, 'item_id');
    }
}
