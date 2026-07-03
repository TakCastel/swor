<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;

class CommunityController extends Controller
{
    public function staff(): JsonResponse
    {
        $staff = Profile::whereIn('role', [
            UserRole::Admin,
            UserRole::Moderator,
            UserRole::GameMaster,
        ])
            ->orderBy('role')
            ->get(['id', 'username', 'role', 'avatar_url']);

        return response()->json($staff);
    }

    public function online(): JsonResponse
    {
        $profiles = Profile::where('last_seen', '>', now()->subMinutes(15))
            ->with('activeCharacter:id,main_group_id', 'activeCharacter.mainGroup:id,color')
            ->limit(50)
            ->get(['id', 'username', 'role', 'active_character_id', 'last_seen']);

        return response()->json($profiles);
    }
}
