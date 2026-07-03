<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Faction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $groups = Faction::withCount('characters')
            ->when($request->filled('era'), fn ($q) => $q->where('era', $request->string('era')))
            ->orderBy('name')
            ->get();

        return response()->json($groups);
    }

    public function show(Faction $group): JsonResponse
    {
        $group->load(['characters' => fn ($q) => $q->withCount('posts')]);

        return response()->json($group);
    }
}
