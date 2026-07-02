<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    protected $fillable = [
        'topic_id',
        'author_id',
        'character_id',
        'content',
    ];

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class, 'topic_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'author_id');
    }

    public function character(): BelongsTo
    {
        return $this->belongsTo(Character::class, 'character_id');
    }
}
