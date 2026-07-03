<?php

namespace App\Policies;

use App\Models\Profile;
use App\Models\User;

class ProfilePolicy
{
    public function view(User $user, Profile $profile): bool
    {
        return $user->id === $profile->id || $user->isModerator();
    }

    public function update(User $user, Profile $profile): bool
    {
        return $user->id === $profile->id || $user->isAdmin();
    }
}
