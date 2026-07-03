<?php

use App\Http\Controllers\Api\V1\Auth\DeleteAccountController;
use App\Http\Controllers\Api\V1\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Api\V1\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\V1\Auth\ResetPasswordController;
use App\Http\Controllers\Api\V1\Auth\UserController;
use App\Http\Controllers\Api\V1\CharacterController;
use App\Http\Controllers\Api\V1\CommunityController;
use App\Http\Controllers\Api\V1\Forum\ForumCategoryController;
use App\Http\Controllers\Api\V1\Forum\ForumController;
use App\Http\Controllers\Api\V1\Forum\PostController;
use App\Http\Controllers\Api\V1\Forum\TopicController;
use App\Http\Controllers\Api\V1\GroupController;
use App\Http\Controllers\Api\V1\MeController;
use App\Http\Controllers\Api\V1\PortalController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\StatsController;
use App\Http\Controllers\Api\V1\UploadController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('register', RegisterController::class)->middleware('guest');
        Route::post('login', LoginController::class)->middleware(['guest', 'throttle:login']);
        Route::post('forgot-password', ForgotPasswordController::class)->middleware('guest');
        Route::post('reset-password', ResetPasswordController::class)->middleware('guest');

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('user', UserController::class);
            Route::post('logout', LogoutController::class);
            Route::post('email/verification-notification', EmailVerificationNotificationController::class)
                ->middleware('throttle:6,1');
            Route::delete('user', DeleteAccountController::class);
        });
    });

    // Lecture publique
    Route::get('stats', StatsController::class);
    Route::get('portal', PortalController::class);
    Route::get('staff', [CommunityController::class, 'staff']);
    Route::get('online-users', [CommunityController::class, 'online']);

    Route::get('forum/categories', [ForumCategoryController::class, 'index']);
    Route::get('forum/categories/{category}', [ForumCategoryController::class, 'show']);
    Route::get('forums', [ForumController::class, 'index']);
    Route::get('forums/{forum}', [ForumController::class, 'show']);
    Route::get('topics/{topic}', [TopicController::class, 'show']);
    Route::post('topics/{topic}/views', [TopicController::class, 'incrementViews']);

    Route::get('groups', [GroupController::class, 'index']);
    Route::get('groups/{group}', [GroupController::class, 'show']);

    Route::get('profiles/{profile}', [ProfileController::class, 'show']);
    Route::get('profiles/{profile}/characters', [ProfileController::class, 'characters']);

    Route::get('characters/{character}', [CharacterController::class, 'show']);
    Route::get('characters/{character}/inventory', [CharacterController::class, 'inventory']);
    Route::get('characters/{character}/ship', [CharacterController::class, 'ship']);
    Route::get('characters/{character}/economy', [CharacterController::class, 'economy']);

    // Actions authentifiées (session Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [MeController::class, 'show']);
        Route::patch('me/profile', [MeController::class, 'updateProfile']);
        Route::put('me/active-character', [MeController::class, 'setActiveCharacter']);
        Route::post('me/heartbeat', [MeController::class, 'heartbeat']);

        Route::post('forums/{forum}/topics', [TopicController::class, 'store']);
        Route::post('topics/{topic}/posts', [PostController::class, 'store']);

        Route::post('characters', [CharacterController::class, 'store']);
        Route::patch('characters/{character}', [CharacterController::class, 'update']);

        // Administration
        Route::middleware('can:admin')->group(function () {
            Route::post('forums', [ForumController::class, 'store']);
            Route::patch('forums/{forum}', [ForumController::class, 'update']);
            Route::delete('forums/{forum}', [ForumController::class, 'destroy']);
            Route::post('uploads', [UploadController::class, 'store']);
        });
    });
});
