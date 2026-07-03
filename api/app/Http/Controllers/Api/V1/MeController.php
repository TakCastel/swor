<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class MeController extends Controller
{
    /**
     * Profil du joueur connecté + personnage actif (contexte global du front).
     */
    public function show(Request $request): JsonResponse
    {
        $profile = $this->profile($request)->load([
            'activeCharacter:id,name,avatar,era,faction,credits,main_group_id',
            'activeCharacter.mainGroup:id,name,color',
        ]);
        $profile->loadCount('posts');

        return response()->json($profile);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $profile = $this->profile($request);

        $data = $request->validate([
            'username' => [
                'sometimes', 'required', 'string', 'max:255',
                Rule::unique('profiles', 'username')->ignore($profile->id),
            ],
            'avatar_url' => ['nullable', 'string', 'max:2048'],
            'bio_hrp' => ['nullable', 'string', 'max:5000'],
        ]);

        $profile->update($data);

        return response()->json($profile);
    }

    public function setActiveCharacter(Request $request): JsonResponse
    {
        $profile = $this->profile($request);

        $data = $request->validate([
            'character_id' => [
                'nullable',
                'uuid',
                Rule::exists('characters', 'id')->where('user_id', $profile->id),
            ],
        ]);

        $profile->update(['active_character_id' => $data['character_id'] ?? null]);

        return $this->show($request);
    }

    public function heartbeat(Request $request): Response
    {
        $this->profile($request)->update(['last_seen' => now()]);

        return response()->noContent();
    }

    private function profile(Request $request): Profile
    {
        return $request->user()->profile()->firstOrFail();
    }
}
