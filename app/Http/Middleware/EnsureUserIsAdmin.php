<?php

namespace App\Http\Middleware;

use Closure;

class EnsureUserIsAdmin
{
    public function handle($request, Closure $next)
    {
        if (auth()->user() && auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}
