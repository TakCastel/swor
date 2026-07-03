<?php

namespace App\Services;

use App\Models\Forum;
use App\Models\Post;

class ForumActivity
{
    /**
     * Met à jour les compteurs et le dernier message du forum
     * et de toute sa chaîne d'ancêtres (agrégation récursive).
     */
    public static function record(Forum $forum, Post $post, bool $isNewTopic): void
    {
        $current = $forum;

        while ($current !== null) {
            $current->posts_count += 1;

            if ($isNewTopic) {
                $current->topics_count += 1;
            }

            $current->last_post_id = $post->id;
            $current->save();

            $current = $current->parent;
        }
    }
}
