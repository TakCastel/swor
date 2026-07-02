<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Adresse email déjà vérifiée.',
            ]);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Un nouveau lien de vérification a été envoyé.',
        ]);
    }
}
