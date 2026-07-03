<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WikiCategory extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'title',
        'icon',
        'display_order',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function subCategories(): HasMany
    {
        return $this->hasMany(WikiSubCategory::class, 'category_id');
    }
}
