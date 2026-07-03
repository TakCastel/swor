<?php

namespace App\Http\Controllers\Api\V1\Forum;

use App\Http\Controllers\Controller;
use App\Models\Forum;
use App\Models\Post;
use App\Models\Topic;
use App\Services\ForumActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TopicController extends Controller
{
    public function show(Topic $topic): JsonResponse
    {
        $topic->load([
            'forum:id,name,parent_id,category_id',
            'forum.category:id,name,era',
            'posts' => fn ($q) => $q->orderBy('created_at'),
            'posts.author:id,username,avatar_url,role,title_hrp',
            'posts.character:id,name,avatar,class,main_group_id',
            'posts.character.mainGroup:id,name,color',
        ]);

        return response()->json([
            'topic' => $topic,
            'ancestors' => $topic->forum
                ? collect($topic->forum->ancestors())
                    ->map(fn (Forum $f) => $f->only(['id', 'name', 'parent_id']))
                    ->values()
                : [],
        ]);
    }

    public function store(Request $request, Forum $forum): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'character_id' => [
                'nullable',
                'uuid',
                Rule::exists('characters', 'id')->where('user_id', $user->id),
            ],
        ]);

        $topic = DB::transaction(function () use ($forum, $user, $data) {
            $topic = Topic::create([
                'forum_id' => $forum->id,
                'author_id' => $user->id,
                'character_id' => $data['character_id'] ?? null,
                'title' => trim($data['title']),
            ]);

            $post = Post::create([
                'topic_id' => $topic->id,
                'author_id' => $user->id,
                'character_id' => $data['character_id'] ?? null,
                'content' => trim($data['content']),
            ]);

            $topic->update(['last_post_id' => $post->id]);

            ForumActivity::record($forum, $post, isNewTopic: true);

            return $topic;
        });

        return response()->json($topic->load('author:id,username', 'character:id,name'), 201);
    }

    public function incrementViews(Topic $topic): Response
    {
        $topic->increment('views_count');

        return response()->noContent();
    }
}
