<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Character;
use App\Models\Faction;
use App\Models\GroupMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CharacterController extends Controller
{
    public const MAX_CHARACTERS_PER_USER = 6;

    public function show(Character $character): JsonResponse
    {
        return response()->json($character->load('mainGroup'));
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'species' => ['required', 'string', 'max:255'],
            'class' => ['required', 'string', 'max:255'],
            'occupation_category' => ['required', 'string', 'max:255'],
            'era' => ['required', 'string', 'max:255'],
            'main_group_id' => ['nullable', 'uuid', 'exists:groups,id'],
            'physical_description' => ['nullable', 'string'],
            'personality' => ['nullable', 'string'],
            'background_history' => ['nullable', 'string'],
            'likes' => ['nullable', 'string'],
            'dislikes' => ['nullable', 'string'],
            'skills' => ['nullable', 'array', 'max:3'],
            'skills.*' => ['string', 'max:255'],
            'starting_item' => ['nullable', 'string', 'max:255'],
        ]);

        if (Character::where('user_id', $user->id)->count() >= self::MAX_CHARACTERS_PER_USER) {
            return response()->json([
                'message' => 'Limite de '.self::MAX_CHARACTERS_PER_USER.' personnages atteinte.',
            ], 422);
        }

        $group = isset($data['main_group_id'])
            ? Faction::find($data['main_group_id'])
            : null;

        $character = DB::transaction(function () use ($user, $data, $group) {
            $character = Character::create([
                ...$data,
                'user_id' => $user->id,
                'faction' => $group?->name ?? 'Indépendant',
                'credits' => 2000,
                'skills' => $data['skills'] ?? [],
            ]);

            if ($group !== null) {
                GroupMember::create([
                    'group_id' => $group->id,
                    'character_id' => $character->id,
                    'role' => 'member',
                ]);
            }

            $user->profile()->update(['active_character_id' => $character->id]);

            return $character;
        });

        return response()->json($character->load('mainGroup'), 201);
    }

    public function update(Request $request, Character $character): JsonResponse
    {
        $user = $request->user();

        if ($character->user_id !== $user->id && ! $user->isAdmin()) {
            return response()->json(['message' => 'Ce personnage ne vous appartient pas.'], 403);
        }

        $data = $request->validate([
            'monthly_income' => ['sometimes', 'integer', 'min:0'],
            'monthly_expenses' => ['sometimes', 'integer', 'min:0'],
            'avatar' => ['nullable', 'string', 'max:2048'],
            'physical_description' => ['nullable', 'string'],
            'personality' => ['nullable', 'string'],
            'background_history' => ['nullable', 'string'],
            'likes' => ['nullable', 'string'],
            'dislikes' => ['nullable', 'string'],
        ]);

        $character->update($data);

        return response()->json($character->load('mainGroup'));
    }

    public function inventory(Character $character): JsonResponse
    {
        return response()->json([
            'starting_item' => $character->starting_item,
            'items' => $character->inventory()->with('item')->get(),
        ]);
    }

    public function ship(Character $character): JsonResponse
    {
        $ship = $character->ship()->with('modules')->first();

        return response()->json(['ship' => $ship]);
    }

    public function economy(Character $character): JsonResponse
    {
        return response()->json([
            'credits' => $character->credits,
            'monthly_income' => $character->monthly_income,
            'monthly_expenses' => $character->monthly_expenses,
            'history' => $character->economyHistory()
                ->orderByDesc('date')
                ->orderByDesc('created_at')
                ->get(),
        ]);
    }
}
