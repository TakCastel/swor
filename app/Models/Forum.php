<?php

namespace App\Models;

use App\Enums\ForumType;
use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Forum extends Model
{
    protected $fillable = [
        'category_id',
        'parent_id',
        'name',
        'description',
        'type',
        'coordinates',
        'image_url',
        'header_image_url',
        'required_role',
        'display_order',
        'topics_count',
        'posts_count',
    ];

    protected function casts(): array
    {
        return [
            'type' => ForumType::class,
            'required_role' => UserRole::class,
            'coordinates' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ForumCategory::class, 'category_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Forum::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Forum::class, 'parent_id');
    }

    public function topics(): HasMany
    {
        return $this->hasMany(Topic::class, 'forum_id');
    }

    public function charactersHere(): HasMany
    {
        return $this->hasMany(Character::class, 'current_location_id');
    }
}
