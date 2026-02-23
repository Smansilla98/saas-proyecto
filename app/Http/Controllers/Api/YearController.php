<?php

namespace App\Http\Controllers\Api;

use App\DTOs\YearDTO;
use App\Http\Controllers\Controller;
use App\Models\Year;
use App\Services\YearService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class YearController extends Controller
{
    public function __construct(
        private YearService $yearService
    ) {}

    /**
     * Display a listing of years.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Year::class);

        $years = $this->yearService->getAll();

        // Si es alumno, filtrar por su año (se implementará cuando tengamos la relación user-year)
        if ($request->user()->isAlumno()) {
            // TODO: Filtrar por año del alumno cuando se implemente
        }

        return response()->json($years);
    }

    /**
     * Store a newly created year.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Year::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'required|integer|unique:years,order',
        ]);

        $dto = YearDTO::fromArray($validated);
        $year = $this->yearService->create($dto);

        return response()->json($year, 201);
    }

    /**
     * Display the specified year.
     */
    public function show(Year $year): JsonResponse
    {
        $this->authorize('view', $year);

        return response()->json($year->load('rhythms'));
    }

    /**
     * Update the specified year.
     */
    public function update(Request $request, Year $year): JsonResponse
    {
        $this->authorize('update', $year);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'order' => 'sometimes|required|integer|unique:years,order,' . $year->id,
        ]);

        $dto = YearDTO::fromArray($validated);
        $year = $this->yearService->update($year, $dto);

        return response()->json($year);
    }

    /**
     * Remove the specified year.
     */
    public function destroy(Year $year): JsonResponse
    {
        $this->authorize('delete', $year);

        $this->yearService->delete($year);

        return response()->json(['message' => 'Year deleted successfully']);
    }
}
