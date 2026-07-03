<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreign('id')->references('id')->on('users')->cascadeOnDelete();
            $table->string('username')->unique()->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('title_hrp')->nullable();
            $table->string('role')->default('user');
            $table->uuid('active_character_id')->nullable();
            $table->timestamp('last_seen')->useCurrent();
            $table->timestamps();
        });

        Schema::create('forum_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('era')->nullable();
            $table->string('required_role')->nullable();
            $table->integer('display_order')->default(0);
            $table->string('image_url')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('forums', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('forum_categories')->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('forums')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type');
            $table->json('coordinates')->nullable();
            $table->string('image_url')->nullable();
            $table->string('header_image_url')->nullable();
            $table->string('required_role')->nullable();
            $table->integer('display_order')->default(0);
            $table->unsignedInteger('topics_count')->default(0);
            $table->unsignedInteger('posts_count')->default(0);
            $table->timestamps();
        });

        Schema::create('groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('color')->nullable();
            $table->string('era')->nullable();
            $table->boolean('is_official')->default(false);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('characters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('profiles')->cascadeOnDelete();
            $table->string('name');
            $table->string('title')->nullable();
            $table->string('class');
            $table->string('faction');
            $table->string('species')->default('Humain');
            $table->string('era')->default('Guerre Civile');
            $table->string('occupation_category')->default('Civil');
            $table->string('avatar')->nullable();
            $table->unsignedInteger('credits')->default(2000);
            $table->foreignUuid('main_group_id')->nullable()->constrained('groups')->nullOnDelete();
            $table->foreignId('current_location_id')->nullable()->constrained('forums')->nullOnDelete();
            $table->boolean('is_traveling')->default(false);
            $table->timestamp('travel_start_time')->nullable();
            $table->timestamp('travel_end_time')->nullable();
            $table->foreignId('travel_origin_id')->nullable()->constrained('forums')->nullOnDelete();
            $table->foreignId('travel_destination_id')->nullable()->constrained('forums')->nullOnDelete();
            $table->text('physical_description')->nullable();
            $table->text('personality')->nullable();
            $table->text('background_history')->nullable();
            $table->text('likes')->nullable();
            $table->text('dislikes')->nullable();
            $table->json('skills')->default('[]');
            $table->string('starting_item')->nullable();
            $table->text('hrp_notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::table('profiles', function (Blueprint $table) {
            $table->foreign('active_character_id')->references('id')->on('characters')->nullOnDelete();
        });

        Schema::create('group_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('group_id')->constrained('groups')->cascadeOnDelete();
            $table->foreignUuid('character_id')->constrained('characters')->cascadeOnDelete();
            $table->string('role')->default('member');
            $table->timestamp('joined_at')->useCurrent();
            $table->unique(['group_id', 'character_id']);
        });

        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('forum_id')->constrained('forums')->cascadeOnDelete();
            $table->foreignUuid('author_id')->constrained('profiles')->cascadeOnDelete();
            $table->foreignUuid('character_id')->nullable()->constrained('characters')->nullOnDelete();
            $table->string('title');
            $table->unsignedInteger('replies_count')->default(0);
            $table->unsignedInteger('views_count')->default(0);
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->unsignedBigInteger('last_post_id')->nullable();
            $table->timestamps();
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
            $table->foreignUuid('author_id')->constrained('profiles')->cascadeOnDelete();
            $table->foreignUuid('character_id')->nullable()->constrained('characters')->nullOnDelete();
            $table->text('content');
            $table->timestamps();
        });

        Schema::table('topics', function (Blueprint $table) {
            $table->foreign('last_post_id')->references('id')->on('posts')->nullOnDelete();
        });

        Schema::create('chat_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('profiles')->cascadeOnDelete();
            $table->foreignUuid('character_id')->nullable()->constrained('characters')->nullOnDelete();
            $table->text('text');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('items_catalog', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('weight', 10, 2);
            $table->string('type');
            $table->string('rarity');
            $table->unsignedInteger('base_price')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('character_inventory', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('character_id')->constrained('characters')->cascadeOnDelete();
            $table->foreignUuid('item_id')->constrained('items_catalog')->cascadeOnDelete();
            $table->unsignedInteger('quantity')->default(1);
            $table->timestamp('acquired_at')->useCurrent();
            $table->unique(['character_id', 'item_id']);
        });

        Schema::create('economy_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('character_id')->constrained('characters')->cascadeOnDelete();
            $table->date('date');
            $table->string('description');
            $table->integer('amount');
            $table->string('type');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('ships', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('character_id')->unique()->constrained('characters')->cascadeOnDelete();
            $table->string('name');
            $table->string('model');
            $table->unsignedInteger('cargo_capacity');
            $table->unsignedInteger('current_cargo_weight')->default(0);
            $table->timestamps();
        });

        Schema::create('ship_modules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('ship_id')->constrained('ships')->cascadeOnDelete();
            $table->string('name');
            $table->string('type');
            $table->string('status')->default('active');
            $table->json('stats')->default('{}');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('wiki_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('icon')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('wiki_sub_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->constrained('wiki_categories')->cascadeOnDelete();
            $table->string('title');
            $table->integer('display_order')->default(0);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('wiki_articles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('sub_category_id')->nullable()->constrained('wiki_sub_categories')->nullOnDelete();
            $table->string('title');
            $table->text('excerpt')->nullable();
            $table->text('content');
            $table->json('metadata')->default('{}');
            $table->string('category')->nullable();
            $table->string('image')->nullable();
            $table->json('related_articles')->default('[]');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wiki_articles');
        Schema::dropIfExists('wiki_sub_categories');
        Schema::dropIfExists('wiki_categories');
        Schema::dropIfExists('ship_modules');
        Schema::dropIfExists('ships');
        Schema::dropIfExists('economy_history');
        Schema::dropIfExists('character_inventory');
        Schema::dropIfExists('items_catalog');
        Schema::dropIfExists('chat_messages');
        Schema::table('topics', function (Blueprint $table) {
            $table->dropForeign(['last_post_id']);
        });
        Schema::dropIfExists('posts');
        Schema::dropIfExists('topics');
        Schema::dropIfExists('group_members');
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropForeign(['active_character_id']);
        });
        Schema::dropIfExists('characters');
        Schema::dropIfExists('groups');
        Schema::dropIfExists('forums');
        Schema::dropIfExists('forum_categories');
        Schema::dropIfExists('profiles');
    }
};
