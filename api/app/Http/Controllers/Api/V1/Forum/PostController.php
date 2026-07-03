<?php

namespace App\Http\Controllers\Api\V1\Forum;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Topic;
use App\Services\ForumActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PostController extends Controller
{
    public function store(Request $request, Topic $topic): JsonResponse
    {
        $user = $request->user();

        if ($topic->is_locked && ! $user->isModerator()) {
            return response()->json(['message' => 'Ce sujet est verrouillé.'], 403);
        }

        $data = $request->validate([
            'content' => ['required', 'string'],
            'character_id' => [
                'nullable',
                'uuid',
                Rule::exists('characters', 'id')->where('user_id', $user->id),
            ],
        ]);

        $post = DB::transaction(function () use ($topic, $user, $data) {
            $post = Post::create([
                'topic_id' => $topic->id,
                'author_id' => $user->id,
                'character_id' => $data['character_id'] ?? null,
                'content' => trim($data['content']),
            ]);

            $topic->update([
                'replies_count' => $topic->replies_count + 1,
                'last_post_id' => $post->id,
            ]);

            ForumActivity::record($topic->forum, $post, isNewTopic: false);

            return $post;
        });

        return response()->json(
            $post->load('author:id,username', 'character:id,name'),
            201
        );
    }
}
