<?php

namespace App\Models;

use App\Enums\ItemRarity;
use App\Enums\ItemType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemsCatalog extends Model
{
    use HasUuids;

    protected $table = 'items_catalog';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'weight',
        'type',
        'rarity',
        'base_price',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => ItemType::class,
            'rarity' => ItemRarity::class,
            'weight' => 'decimal:2',
            'created_at' => 'datetime',
        ];
    }

    public function inventoryEntries(): HasMany
    {
        return $this->hasMany(CharacterInventory::class, 'item_id');
    }
}
