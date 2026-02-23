<?php

namespace App\Services;

use App\DTOs\YearDTO;
use App\Models\Year;
use Illuminate\Database\Eloquent\Collection;

class YearService
{
    public function getAll(): Collection
    {
        return Year::ordered()->get();
    }

    public function getById(int $id): ?Year
    {
        return Year::find($id);
    }

    public function create(YearDTO $dto): Year
    {
        return Year::create($dto->toArray());
    }

    public function update(Year $year, YearDTO $dto): Year
    {
        $year->update($dto->toArray());
        return $year->fresh();
    }

    public function delete(Year $year): bool
    {
        return $year->delete();
    }
}

