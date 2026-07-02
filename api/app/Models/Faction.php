<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Faction extends Model
{
    use HasUuids;

    protected $table = 'groups';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'color',
        'era',
        'is_official',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'is_official' => 'boolean',
            'created_at' => 'datetime',
        ];
    }

    public function members(): HasMany
    {
        return $this->hasMany(GroupMember::class, 'group_id');
    }

    public function characters(): HasMany
    {
        return $this->hasMany(Character::class, 'main_group_id');
    }
}
