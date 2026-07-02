<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class RegisterController extends Controller
{
    public function __invoke(Request $request, CreatesNewUsers $creator): JsonResponse
    {
        $user = $creator->create($request->all());

        event(new Registered($user));

        Auth::login($user);

        return response()->json([
            'user' => new UserResource($user->load('profile')),
            'message' => 'Inscription réussie. Veuillez vérifier votre adresse email.',
        ], 201);
    }
}
