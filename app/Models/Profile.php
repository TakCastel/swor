<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Profile extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'username',
        'avatar_url',
        'title_hrp',
        'role',
        'active_character_id',
        'last_seen',
    ];

    protected function casts(): array
    {
        return [
            'role' => UserRole::class,
            'last_seen' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id');
    }

    public function activeCharacter(): BelongsTo
    {
        return $this->belongsTo(Character::class, 'active_character_id');
    }

    public function characters(): HasMany
    {
        return $this->hasMany(Character::class, 'user_id');
    }

    public function topics(): HasMany
    {
        return $this->hasMany(Topic::class, 'author_id');
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    public function chatMessages(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'user_id');
    }
}
