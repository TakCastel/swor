<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WikiSubCategory extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'category_id',
        'title',
        'display_order',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(WikiCategory::class, 'category_id');
    }

    public function articles(): HasMany
    {
        return $this->hasMany(WikiArticle::class, 'sub_category_id');
    }
}
