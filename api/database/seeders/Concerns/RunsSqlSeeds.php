<?php

namespace Database\Seeders\Concerns;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

trait RunsSqlSeeds
{
    protected function runSqlSeed(string $filename): void
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            return;
        }

        $path = database_path('seeders/sql/'.$filename);

        if (! File::exists($path)) {
            return;
        }

        DB::unprepared(File::get($path));
    }
}
