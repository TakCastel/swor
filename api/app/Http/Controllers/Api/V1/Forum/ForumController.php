<?php

namespace App\Http\Controllers\Api\V1\Forum;

use App\Enums\ForumType;
use App\Http\Controllers\Controller;
use App\Models\Forum;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ForumController extends Controller
{
    /**
     * Relations chargées pour afficher le "dernier message" d'un forum.
     */
    private const LAST_POST_RELATIONS = [
        'lastPost:id,topic_id,author_id,character_id,created_at',
        'lastPost.topic:id,title',
        'lastPost.author:id,username',
        'lastPost.character:id,name,main_group_id',
        'lastPost.character.mainGroup:id,color',
    ];

    public function index(Request $request): JsonResponse
    {
        $forums = Forum::with(self::LAST_POST_RELATIONS)
            ->when($request->filled('category_id'), fn ($q) => $q->where('category_id', $request->integer('category_id')))
            ->when($request->boolean('root'), fn ($q) => $q->whereNull('parent_id'))
            ->orderBy('display_order')
            ->get();

        return response()->json($forums);
    }

    public function show(Forum $forum): JsonResponse
    {
        $forum->load([
            'category:id,name,era',
            'children' => fn ($q) => $q->orderBy('display_order'),
            'children.lastPost:id,topic_id,author_id,character_id,created_at',
            'children.lastPost.topic:id,title',
            'children.lastPost.author:id,username',
            'children.lastPost.character:id,name,main_group_id',
            'children.lastPost.character.mainGroup:id,color',
        ]);

        $topics = Topic::where('forum_id', $forum->id)
            ->with([
                'author:id,username,avatar_url',
                'character:id,name,avatar,main_group_id',
                'character.mainGroup:id,name,color',
                'lastPost:id,topic_id,author_id,character_id,created_at',
                'lastPost.author:id,username',
                'lastPost.character:id,name,main_group_id',
                'lastPost.character.mainGroup:id,color',
            ])
            ->orderByDesc('is_pinned')
            ->orderByDesc('updated_at')
            ->get();

        return response()->json([
            'forum' => $forum,
            'ancestors' => collect($forum->ancestors())
                ->map(fn (Forum $f) => $f->only(['id', 'name', 'parent_id']))
                ->values(),
            'topics' => $topics,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'integer', 'exists:forum_categories,id'],
            'parent_id' => ['nullable', 'integer', 'exists:forums,id'],
            'type' => ['required', Rule::enum(ForumType::class)],
            'display_order' => ['nullable', 'integer'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'header_image_url' => ['nullable', 'string', 'max:2048'],
        ]);

        $forum = Forum::create($data);

        return response()->json($forum, 201);
    }

    public function update(Request $request, Forum $forum): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['sometimes', 'integer', 'exists:forum_categories,id'],
            'parent_id' => ['nullable', 'integer', 'exists:forums,id', Rule::notIn([$forum->id])],
            'type' => ['sometimes', Rule::enum(ForumType::class)],
            'display_order' => ['sometimes', 'integer'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'header_image_url' => ['nullable', 'string', 'max:2048'],
        ]);

        $forum->update($data);

        return response()->json($forum);
    }

    /**
     * Supprime un forum (et ses descendants, en cascade) après avoir
     * déplacé leurs sujets vers le forum indiqué par move_topics_to.
     */
    public function destroy(Request $request, Forum $forum): JsonResponse
    {
        $data = $request->validate([
            'move_topics_to' => ['required', 'integer', 'exists:forums,id'],
        ]);

        $subtreeIds = $this->subtreeIds($forum);

        if (in_array((int) $data['move_topics_to'], $subtreeIds, true)) {
            return response()->json([
                'message' => 'Le forum de destination ne peut pas faire partie des forums supprimés.',
            ], 422);
        }

        DB::transaction(function () use ($forum, $subtreeIds, $data) {
            Topic::whereIn('forum_id', $subtreeIds)->update(['forum_id' => $data['move_topics_to']]);
            $forum->delete();
        });

        return response()->json(null, 204);
    }

    /**
     * @return array<int, int>
     */
    private function subtreeIds(Forum $forum): array
    {
        $ids = [$forum->id];
        $frontier = [$forum->id];

        while ($frontier !== []) {
            $frontier = Forum::whereIn('parent_id', $frontier)->pluck('id')->all();
            $ids = array_merge($ids, $frontier);
        }

        return $ids;
    }
}
