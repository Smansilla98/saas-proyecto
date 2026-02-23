<?php

namespace App\Services;

use App\DTOs\RhythmDTO;
use App\Models\Rhythm;
use App\Models\Year;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class RhythmService
{
    public function getByYear(Year $year): Collection
    {
        return Rhythm::where('year_id', $year->id)->get();
    }

    public function getById(int $id): ?Rhythm
    {
        return Rhythm::with('year')->find($id);
    }

    public function create(RhythmDTO $dto): Rhythm
    {
        return Rhythm::create($dto->toArray());
    }

    public function update(Rhythm $rhythm, RhythmDTO $dto): Rhythm
    {
        $rhythm->update($dto->toArray());
        return $rhythm->fresh();
    }

    public function delete(Rhythm $rhythm): bool
    {
        // Delete all media associated with this rhythm
        $rhythm->clearMediaCollection('videos');
        $rhythm->clearMediaCollection('audios');
        $rhythm->clearMediaCollection('pdfs');
        
        return $rhythm->delete();
    }

    public function addVideo(Rhythm $rhythm, UploadedFile $file): \Spatie\MediaLibrary\MediaCollections\Models\Media
    {
        return $rhythm->addMedia($file)
            ->usingName($file->getClientOriginalName())
            ->toMediaCollection('videos');
    }

    public function addAudio(Rhythm $rhythm, UploadedFile $file): \Spatie\MediaLibrary\MediaCollections\Models\Media
    {
        return $rhythm->addMedia($file)
            ->usingName($file->getClientOriginalName())
            ->toMediaCollection('audios');
    }

    public function addPdf(Rhythm $rhythm, UploadedFile $file): \Spatie\MediaLibrary\MediaCollections\Models\Media
    {
        return $rhythm->addMedia($file)
            ->usingName($file->getClientOriginalName())
            ->toMediaCollection('pdfs');
    }
}

