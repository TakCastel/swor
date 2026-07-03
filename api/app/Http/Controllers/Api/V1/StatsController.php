<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Character;
use App\Models\Faction;
use App\Models\Post;
use App\Models\Profile;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $latestUser = Profile::whereNotNull('username')
            ->orderByDesc('created_at')
            ->first(['id', 'username']);

        $memberCounts = Character::whereNotNull('main_group_id')
            ->selectRaw('main_group_id, count(*) as member_count')
            ->groupBy('main_group_id')
            ->pluck('member_count', 'main_group_id');

        $factionsByEra = Faction::orderBy('name')
            ->get(['id', 'name', 'color', 'era'])
            ->groupBy(fn (Faction $g) => $g->era ?? 'Général')
            ->map(fn ($groups) => $groups->map(fn (Faction $g) => [
                'id' => $g->id,
                'name' => $g->name,
                'color' => $g->color,
                'member_count' => (int) ($memberCounts[$g->id] ?? 0),
            ])->values());

        return response()->json([
            'total_users' => Profile::count(),
            'total_topics' => Topic::count(),
            'total_posts' => Post::count(),
            'online_count' => Profile::where('last_seen', '>', now()->subMinutes(15))->count(),
            'guests_count' => 0,
            'online_record' => null,
            'latest_user' => $latestUser,
            'birthdays_today' => [],
            'birthdays_week' => [],
            'factions_by_era' => $factionsByEra,
        ]);
    }
}
