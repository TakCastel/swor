<?php

namespace App\Http\Controllers\Api\V1\Forum;

use App\Http\Controllers\Controller;
use App\Models\ForumCategory;
use Illuminate\Http\JsonResponse;

class ForumCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            ForumCategory::orderBy('display_order')->get()
        );
    }

    public function show(ForumCategory $category): JsonResponse
    {
        return response()->json($category);
    }
}
