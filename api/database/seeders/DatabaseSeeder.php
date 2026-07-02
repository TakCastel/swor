<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ForumCategorySeeder::class,
            ForumHrpSeeder::class,
            ForumAtlasSeeder::class,
        ]);
    }
}
