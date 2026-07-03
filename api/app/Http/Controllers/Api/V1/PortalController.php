<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Forum;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;

class PortalController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $latestTopics = Topic::with([
            'author:id,username',
            'forum:id,category_id',
            'forum.category:id,era',
        ])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'title', 'created_at', 'author_id', 'forum_id']);

        $newsForum = Forum::where('name', 'Annonces')->first(['id', 'name']);

        $news = $newsForum
            ? Topic::where('forum_id', $newsForum->id)
                ->with([
                    'author:id,username',
                    'posts' => fn ($q) => $q->orderBy('created_at')->limit(1),
                ])
                ->orderByDesc('created_at')
                ->limit(3)
                ->get(['id', 'title', 'created_at', 'author_id', 'forum_id'])
            : collect();

        return response()->json([
            'latest_topics' => $latestTopics,
            'news' => $news,
            'news_forum_id' => $newsForum?->id,
        ]);
    }
}
