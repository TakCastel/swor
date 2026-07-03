<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function show(Profile $profile): JsonResponse
    {
        $profile->loadCount('posts');

        return response()->json($profile);
    }

    public function characters(Profile $profile): JsonResponse
    {
        return response()->json(
            $profile->characters()->with('mainGroup')->get()
        );
    }
}
