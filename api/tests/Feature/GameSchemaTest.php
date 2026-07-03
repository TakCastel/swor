<?php

namespace Tests\Feature;

use App\Models\Forum;
use App\Models\ForumCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GameSchemaTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeders_populate_forum_categories_and_hrp_forums(): void
    {
        $this->seed();

        $this->assertSame(7, ForumCategory::count());
        $this->assertSame(9, Forum::where('type', 'forum')->count());
    }

    public function test_user_factory_creates_matching_profile(): void
    {
        $user = User::factory()->create();

        $this->assertNotNull($user->profile);
        $this->assertSame($user->id, $user->profile->id);
    }
}
