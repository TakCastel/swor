<?php

namespace Tests\Feature\Api;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(ValidateCsrfToken::class);
    }

    /**
     * @return array<string, string>
     */
    protected function statefulHeaders(): array
    {
        return [
            'Origin' => config('app.frontend_url'),
            'Referer' => config('app.frontend_url'),
        ];
    }

    public function test_user_can_register_with_profile(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Luke Skywalker',
            'username' => 'luke_skywalker',
            'email' => 'luke@swor.test',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertCreated()
            ->assertJsonPath('user.email', 'luke@swor.test')
            ->assertJsonPath('user.profile.username', 'luke_skywalker');

        $this->assertDatabaseHas('users', ['email' => 'luke@swor.test']);
        $this->assertDatabaseHas('profiles', ['username' => 'luke_skywalker']);
    }

    public function test_user_can_login_and_fetch_profile(): void
    {
        $user = User::factory()->create([
            'email' => 'han@swor.test',
            'password' => Hash::make('password'),
        ]);

        $this->withHeaders($this->statefulHeaders())
            ->postJson('/api/v1/auth/login', [
                'email' => 'han@swor.test',
                'password' => 'password',
            ])->assertOk()
            ->assertJsonPath('user.id', $user->id);

        $this->actingAs($user, 'web')
            ->getJson('/api/v1/auth/user')
            ->assertOk()
            ->assertJsonPath('profile.username', $user->fresh()->profile->username);
    }

    public function test_login_is_throttled_after_failed_attempts(): void
    {
        User::factory()->create([
            'email' => 'leia@swor.test',
            'password' => Hash::make('password'),
        ]);

        for ($i = 0; $i < 5; $i++) {
            $this->withHeaders($this->statefulHeaders())
                ->postJson('/api/v1/auth/login', [
                    'email' => 'leia@swor.test',
                    'password' => 'wrong-password',
                ])->assertUnprocessable();
        }

        $this->withHeaders($this->statefulHeaders())
            ->postJson('/api/v1/auth/login', [
                'email' => 'leia@swor.test',
                'password' => 'wrong-password',
            ])->assertStatus(429);
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/auth/logout')
            ->assertNoContent();
    }

    public function test_user_can_request_password_reset_link(): void
    {
        Notification::fake();

        $user = User::factory()->create(['email' => 'reset@swor.test']);

        $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'reset@swor.test',
        ])->assertOk();

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_user_can_reset_password_with_token(): void
    {
        $user = User::factory()->create(['email' => 'reset@swor.test']);
        $token = app('auth.password.broker')->createToken($user);

        $this->postJson('/api/v1/auth/reset-password', [
            'email' => 'reset@swor.test',
            'token' => $token,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])->assertOk();

        $user->refresh();
        $this->assertTrue(Hash::check('new-password', $user->password));
    }

    public function test_user_can_delete_account_with_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $this->actingAs($user)
            ->deleteJson('/api/v1/auth/user', [
                'password' => 'password',
            ])
            ->assertNoContent();

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseMissing('profiles', ['id' => $user->id]);
    }

    public function test_email_verification_link_marks_user_as_verified(): void
    {
        $user = User::factory()->unverified()->create();

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->getEmailForVerification()),
            ],
        );

        $this->get($url)->assertRedirect(config('app.frontend_url').'/auth/login?verified=1');

        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_moderator_gate_allows_moderators(): void
    {
        $user = User::factory()->create();
        Profile::query()->whereKey($user->id)->update(['role' => 'moderator']);

        $this->actingAs($user->fresh());

        $this->assertTrue($user->fresh()->isModerator());
        $this->assertTrue(auth()->user()->can('moderate'));
    }
}
