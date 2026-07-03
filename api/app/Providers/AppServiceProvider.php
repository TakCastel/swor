<?php

namespace App\Providers;

use App\Models\Profile;
use App\Models\User;
use App\Policies\ProfilePolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        Gate::policy(Profile::class, ProfilePolicy::class);

        Gate::define('moderate', fn (User $user): bool => $user->isModerator());

        Gate::define('admin', fn (User $user): bool => $user->isAdmin());

        ResetPassword::createUrlUsing(function (User $user, string $token): string {
            return config('app.frontend_url').'/auth/reset-password?'.http_build_query([
                'token' => $token,
                'email' => $user->email,
            ]);
        });

        VerifyEmail::createUrlUsing(function (User $user): string {
            return URL::temporarySignedRoute(
                'verification.verify',
                Carbon::now()->addMinutes(60),
                [
                    'id' => $user->id,
                    'hash' => sha1($user->getEmailForVerification()),
                ],
            );
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
