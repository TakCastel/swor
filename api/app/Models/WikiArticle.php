<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WikiArticle extends Model
{
    use HasUuids;

    protected $fillable = [
        'sub_category_id',
        'title',
        'excerpt',
        'content',
        'metadata',
        'category',
        'image',
        'related_articles',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'related_articles' => 'array',
        ];
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(WikiSubCategory::class, 'sub_category_id');
    }
}
