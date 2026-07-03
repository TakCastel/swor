<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Character extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'title',
        'class',
        'faction',
        'species',
        'era',
        'occupation_category',
        'avatar',
        'credits',
        'monthly_income',
        'monthly_expenses',
        'main_group_id',
        'current_location_id',
        'is_traveling',
        'travel_start_time',
        'travel_end_time',
        'travel_origin_id',
        'travel_destination_id',
        'physical_description',
        'personality',
        'background_history',
        'likes',
        'dislikes',
        'skills',
        'starting_item',
        'hrp_notes',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'is_traveling' => 'boolean',
            'is_active' => 'boolean',
            'travel_start_time' => 'datetime',
            'travel_end_time' => 'datetime',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'user_id');
    }

    public function mainGroup(): BelongsTo
    {
        return $this->belongsTo(Faction::class, 'main_group_id');
    }

    public function currentLocation(): BelongsTo
    {
        return $this->belongsTo(Forum::class, 'current_location_id');
    }

    public function groupMemberships(): HasMany
    {
        return $this->hasMany(GroupMember::class, 'character_id');
    }

    public function topics(): HasMany
    {
        return $this->hasMany(Topic::class, 'character_id');
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'character_id');
    }

    public function inventory(): HasMany
    {
        return $this->hasMany(CharacterInventory::class, 'character_id');
    }

    public function economyHistory(): HasMany
    {
        return $this->hasMany(EconomyHistory::class, 'character_id');
    }

    public function ship(): HasOne
    {
        return $this->hasOne(Ship::class, 'character_id');
    }
}
