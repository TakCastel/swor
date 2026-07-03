<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->text('bio_hrp')->nullable()->after('title_hrp');
        });

        Schema::table('characters', function (Blueprint $table) {
            $table->integer('monthly_income')->default(0)->after('credits');
            $table->integer('monthly_expenses')->default(0)->after('monthly_income');
        });

        Schema::table('forums', function (Blueprint $table) {
            $table->unsignedBigInteger('last_post_id')->nullable()->after('posts_count');
            $table->foreign('last_post_id')->references('id')->on('posts')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('forums', function (Blueprint $table) {
            $table->dropForeign(['last_post_id']);
            $table->dropColumn('last_post_id');
        });

        Schema::table('characters', function (Blueprint $table) {
            $table->dropColumn(['monthly_income', 'monthly_expenses']);
        });

        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('bio_hrp');
        });
    }
};
