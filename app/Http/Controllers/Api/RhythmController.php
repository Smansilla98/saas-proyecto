<?php

namespace App\Http\Controllers\Api;

use App\DTOs\RhythmDTO;
use App\Http\Controllers\Controller;
use App\Models\Rhythm;
use App\Models\Year;
use App\Services\RhythmService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RhythmController extends Controller
{
    public function __construct(
        private RhythmService $rhythmService
    ) {}

    /**
     * Display a listing of rhythms for a year.
     */
    public function index(Request $request, Year $year): JsonResponse
    {
        $this->authorize('viewAny', Rhythm::class);
        $this->authorize('view', $year);

        $rhythms = $this->rhythmService->getByYear($year);

        return response()->json($rhythms);
    }

    /**
     * Store a newly created rhythm.
     */
    public function store(Request $request, Year $year): JsonResponse
    {
        $this->authorize('create', Rhythm::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'adaptation' => 'nullable|string|max:255',
            'optional' => 'boolean',
        ]);

        $validated['year_id'] = $year->id;
        $dto = RhythmDTO::fromArray($validated);
        $rhythm = $this->rhythmService->create($dto);

        return response()->json($rhythm->load('year'), 201);
    }

    /**
     * Display the specified rhythm with media.
     */
    public function show(Rhythm $rhythm): JsonResponse
    {
        $this->authorize('view', $rhythm);

        $rhythm->load('year');
        
        return response()->json([
            'rhythm' => $rhythm,
            'videos' => $rhythm->getVideos(),
            'audios' => $rhythm->getAudios(),
            'pdfs' => $rhythm->getPdfs(),
        ]);
    }

    /**
     * Update the specified rhythm.
     */
    public function update(Request $request, Rhythm $rhythm): JsonResponse
    {
        $this->authorize('update', $rhythm);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'adaptation' => 'nullable|string|max:255',
            'optional' => 'boolean',
        ]);

        $dto = RhythmDTO::fromArray(array_merge($validated, ['year_id' => $rhythm->year_id]));
        $rhythm = $this->rhythmService->update($rhythm, $dto);

        return response()->json($rhythm->load('year'));
    }

    /**
     * Remove the specified rhythm.
     */
    public function destroy(Rhythm $rhythm): JsonResponse
    {
        $this->authorize('delete', $rhythm);

        $this->rhythmService->delete($rhythm);

        return response()->json(['message' => 'Rhythm deleted successfully']);
    }
}
