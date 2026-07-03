<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UploadController extends Controller
{
    private const FOLDERS = ['forum-icons', 'forum-headers', 'avatars'];

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'file' => ['required', 'image', 'max:4096'],
            'folder' => ['required', Rule::in(self::FOLDERS)],
        ]);

        $path = $data['file']->store($data['folder'], 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
        ], 201);
    }
}
