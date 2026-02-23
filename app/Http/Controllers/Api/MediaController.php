<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rhythm;
use App\Services\RhythmService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function __construct(
        private RhythmService $rhythmService
    ) {}

    /**
     * Upload video to rhythm.
     */
    public function uploadVideo(Request $request, Rhythm $rhythm): JsonResponse
    {
        $this->authorize('update', $rhythm);

        $request->validate([
            'file' => 'required|file|mimes:mp4,webm,ogg,m3u8|max:204800', // 200MB
        ]);

        $media = $this->rhythmService->addVideo($rhythm, $request->file('file'));

        return response()->json($media, 201);
    }

    /**
     * Upload audio to rhythm.
     */
    public function uploadAudio(Request $request, Rhythm $rhythm): JsonResponse
    {
        $this->authorize('update', $rhythm);

        $request->validate([
            'file' => 'required|file|mimes:mp3,wav,ogg,mpeg|max:102400', // 100MB
        ]);

        $media = $this->rhythmService->addAudio($rhythm, $request->file('file'));

        return response()->json($media, 201);
    }

    /**
     * Upload PDF to rhythm.
     */
    public function uploadPdf(Request $request, Rhythm $rhythm): JsonResponse
    {
        $this->authorize('update', $rhythm);

        $request->validate([
            'file' => 'required|file|mimes:pdf|max:102400', // 100MB
        ]);

        $media = $this->rhythmService->addPdf($rhythm, $request->file('file'));

        return response()->json($media, 201);
    }

    /**
     * Delete media from rhythm.
     */
    public function deleteMedia(Request $request, Rhythm $rhythm, int $mediaId): JsonResponse
    {
        $this->authorize('update', $rhythm);

        $media = $rhythm->getMedia()->find($mediaId);
        
        if (!$media) {
            return response()->json(['message' => 'Media not found'], 404);
        }

        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }
}
