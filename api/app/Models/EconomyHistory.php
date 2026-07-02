<?php

namespace App\Models;

use App\Enums\EconomyType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EconomyHistory extends Model
{
    use HasUuids;

    protected $table = 'economy_history';

    public $timestamps = false;

    protected $fillable = [
        'character_id',
        'date',
        'description',
        'amount',
        'type',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'type' => EconomyType::class,
            'created_at' => 'datetime',
        ];
    }

    public function character(): BelongsTo
    {
        return $this->belongsTo(Character::class, 'character_id');
    }
}
