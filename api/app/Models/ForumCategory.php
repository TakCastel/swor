<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumCategory extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'era',
        'required_role',
        'display_order',
        'image_url',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'required_role' => UserRole::class,
            'created_at' => 'datetime',
        ];
    }

    public function forums(): HasMany
    {
        return $this->hasMany(Forum::class, 'category_id');
    }
}
