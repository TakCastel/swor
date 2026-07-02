<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class, 'id');
    }

    public function hasRole(UserRole ...$roles): bool
    {
        $role = $this->profile?->role;

        return $role !== null && in_array($role, $roles, true);
    }

    public function isModerator(): bool
    {
        return $this->hasRole(UserRole::Moderator, UserRole::Admin, UserRole::GameMaster);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(UserRole::Admin);
    }
}
