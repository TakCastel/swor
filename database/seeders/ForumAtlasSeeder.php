<?php

namespace Database\Seeders;

use Database\Seeders\Concerns\RunsSqlSeeds;
use Illuminate\Database\Seeder;

class ForumAtlasSeeder extends Seeder
{
    use RunsSqlSeeds;

    public function run(): void
    {
        $this->runSqlSeed('03_atlas_clone_wars.sql');
        $this->runSqlSeed('04_atlas_civil_war.sql');
        $this->runSqlSeed('05_atlas_new_republic.sql');
    }
}
