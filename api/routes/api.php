<?php

use App\Http\Controllers\Api\V1\Auth\DeleteAccountController;
use App\Http\Controllers\Api\V1\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Api\V1\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\V1\Auth\ResetPasswordController;
use App\Http\Controllers\Api\V1\Auth\UserController;
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
});
