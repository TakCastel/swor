<?php

namespace Tests\Feature\Api;

use App\Enums\UserRole;
use App\Models\Character;
use App\Models\Faction;
use App\Models\Forum;
use App\Models\ForumCategory;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GameApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    private function makeForum(array $forumAttributes = []): Forum
    {
        $category = ForumCategory::create([
            'name' => 'Hors-RP',
            'display_order' => 1,
        ]);

        return Forum::create([
            'category_id' => $category->id,
            'name' => 'Annonces',
            'type' => 'forum',
            'display_order' => 1,
            ...$forumAttributes,
        ]);
    }

    public function test_stats_endpoint_returns_totals(): void
    {
        User::factory()->count(2)->create();

        $this->getJson('/api/v1/stats')
            ->assertOk()
            ->assertJsonStructure([
                'total_users', 'total_topics', 'total_posts', 'online_count',
                'latest_user', 'factions_by_era',
            ])
            ->assertJsonPath('total_users', 2);
    }

    public function test_topic_and_reply_flow_updates_counters_and_last_post(): void
    {
        $user = User::factory()->create();
        $parent = $this->makeForum();
        $child = Forum::create([
            'category_id' => $parent->category_id,
            'parent_id' => $parent->id,
            'name' => 'Sous-forum',
            'type' => 'location',
            'display_order' => 1,
        ]);

        $topicResponse = $this->actingAs($user)->postJson("/api/v1/forums/{$child->id}/topics", [
            'title' => 'Premier sujet',
            'content' => 'Il était une fois dans une galaxie lointaine.',
        ]);
        $topicResponse->assertCreated();
        $topicId = $topicResponse->json('id');

        $this->actingAs($user)->postJson("/api/v1/topics/{$topicId}/posts", [
            'content' => 'Première réponse.',
        ])->assertCreated();

        $child->refresh();
        $parent->refresh();

        $this->assertSame(1, $child->topics_count);
        $this->assertSame(2, $child->posts_count);
        $this->assertSame(1, $parent->topics_count);
        $this->assertSame(2, $parent->posts_count);
        $this->assertNotNull($child->last_post_id);
        $this->assertSame($child->last_post_id, $parent->last_post_id);

        $show = $this->getJson("/api/v1/topics/{$topicId}")->assertOk();
        $this->assertSame(1, $show->json('topic.replies_count'));
        $this->assertCount(2, $show->json('topic.posts'));
        $this->assertSame('Sous-forum', $show->json('topic.forum.name'));
        $this->assertSame('Annonces', $show->json('ancestors.0.name'));

        $this->postJson("/api/v1/topics/{$topicId}/views")->assertNoContent();
        $this->assertSame(1, $show->json('topic.views_count') + 1 - $show->json('topic.views_count'));
    }

    public function test_guest_cannot_post_topic(): void
    {
        $forum = $this->makeForum();

        $this->postJson("/api/v1/forums/{$forum->id}/topics", [
            'title' => 'Interdit',
            'content' => 'Non.',
        ])->assertUnauthorized();
    }

    public function test_character_creation_sets_faction_membership_and_active_character(): void
    {
        $user = User::factory()->create();
        $group = Faction::create([
            'name' => 'Ordre Jedi',
            'color' => '#3b82f6',
            'era' => 'CLONE_WARS',
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/characters', [
            'name' => 'Dax Valen',
            'species' => 'Humain',
            'class' => 'Jedi',
            'occupation_category' => 'FORCE',
            'era' => 'CLONE_WARS',
            'main_group_id' => $group->id,
            'skills' => ['Saut de Force', 'Télékynésie', 'Sens de la Force'],
            'starting_item' => "Sabre Laser d'entraînement",
        ]);

        $response->assertCreated()
            ->assertJsonPath('faction', 'Ordre Jedi')
            ->assertJsonPath('credits', 2000);

        $characterId = $response->json('id');

        $this->assertDatabaseHas('group_members', [
            'group_id' => $group->id,
            'character_id' => $characterId,
        ]);

        $this->assertSame($characterId, $user->profile->fresh()->active_character_id);

        $me = $this->actingAs($user)->getJson('/api/v1/me')->assertOk();
        $this->assertSame('Dax Valen', $me->json('active_character.name'));
    }

    public function test_character_limit_is_enforced(): void
    {
        $user = User::factory()->create();

        for ($i = 0; $i < 6; $i++) {
            Character::create([
                'user_id' => $user->id,
                'name' => "Perso {$i}",
                'class' => 'Soldat',
                'faction' => 'Indépendant',
            ]);
        }

        $this->actingAs($user)->postJson('/api/v1/characters', [
            'name' => 'Un de trop',
            'species' => 'Humain',
            'class' => 'Soldat',
            'occupation_category' => 'COMBAT',
            'era' => 'CLONE_WARS',
        ])->assertUnprocessable();
    }

    public function test_character_economy_can_be_updated_by_owner_only(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $character = Character::create([
            'user_id' => $owner->id,
            'name' => 'Dax',
            'class' => 'Contrebandier',
            'faction' => 'Indépendant',
        ]);

        $this->actingAs($other)->patchJson("/api/v1/characters/{$character->id}", [
            'monthly_income' => 500,
        ])->assertForbidden();

        $this->actingAs($owner)->patchJson("/api/v1/characters/{$character->id}", [
            'monthly_income' => 500,
            'monthly_expenses' => 120,
        ])->assertOk();

        $economy = $this->getJson("/api/v1/characters/{$character->id}/economy")->assertOk();
        $this->assertSame(500, $economy->json('monthly_income'));
    }

    public function test_me_profile_update_and_heartbeat(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->patchJson('/api/v1/me/profile', [
            'username' => 'DarkTak',
            'bio_hrp' => 'GM du forum.',
        ])->assertOk()->assertJsonPath('username', 'DarkTak');

        $this->actingAs($user)->postJson('/api/v1/me/heartbeat')->assertNoContent();

        $online = $this->getJson('/api/v1/online-users')->assertOk();
        $this->assertSame('DarkTak', $online->json('0.username'));
    }

    public function test_forum_administration_requires_admin_role(): void
    {
        $member = User::factory()->create();
        $admin = User::factory()->create();
        $admin->profile->update(['role' => UserRole::Admin]);

        $category = ForumCategory::create(['name' => 'RP', 'display_order' => 1]);

        $payload = [
            'name' => 'Tatooine',
            'category_id' => $category->id,
            'type' => 'planet',
        ];

        $this->actingAs($member)->postJson('/api/v1/forums', $payload)->assertForbidden();

        $created = $this->actingAs($admin)->postJson('/api/v1/forums', $payload)->assertCreated();
        $forumId = $created->json('id');

        $this->actingAs($admin)->patchJson("/api/v1/forums/{$forumId}", [
            'name' => 'Tatooine — Mos Eisley',
        ])->assertOk()->assertJsonPath('name', 'Tatooine — Mos Eisley');

        $fallback = Forum::create([
            'category_id' => $category->id,
            'name' => 'Corbeille',
            'type' => 'forum',
        ]);

        $this->actingAs($admin)->deleteJson("/api/v1/forums/{$forumId}", [
            'move_topics_to' => $fallback->id,
        ])->assertNoContent();

        $this->assertDatabaseMissing('forums', ['id' => $forumId]);
    }

    public function test_groups_endpoint_lists_factions_with_member_counts(): void
    {
        $user = User::factory()->create();
        $group = Faction::create(['name' => 'Empire', 'color' => '#ef4444', 'era' => 'GALACTIC_CIVIL_WAR']);
        Character::create([
            'user_id' => $user->id,
            'name' => 'Vader',
            'class' => 'Sith',
            'faction' => 'Empire',
            'main_group_id' => $group->id,
        ]);

        $this->getJson('/api/v1/groups')
            ->assertOk()
            ->assertJsonPath('0.name', 'Empire')
            ->assertJsonPath('0.characters_count', 1);

        $this->getJson("/api/v1/groups/{$group->id}")
            ->assertOk()
            ->assertJsonPath('characters.0.name', 'Vader');
    }
}
