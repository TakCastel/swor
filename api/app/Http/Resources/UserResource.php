<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'profile' => $this->whenLoaded('profile', fn () => [
                'username' => $this->profile->username,
                'avatar_url' => $this->profile->avatar_url,
                'title_hrp' => $this->profile->title_hrp,
                'role' => $this->profile->role,
            ]),
        ];
    }
}
