<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Rhythm extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'description',
        'author',
        'adaptation',
        'year_id',
        'optional',
    ];

    protected $casts = [
        'optional' => 'boolean',
    ];

    /**
     * Get the year that owns the rhythm.
     */
    public function year(): BelongsTo
    {
        return $this->belongsTo(Year::class);
    }

    /**
     * Register media collections for videos, audios, and PDFs.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('videos')
            ->acceptsMimeTypes(['video/mp4', 'video/webm', 'video/ogg', 'application/x-mpegURL']);

        $this->addMediaCollection('audios')
            ->acceptsMimeTypes(['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']);

        $this->addMediaCollection('pdfs')
            ->acceptsMimeTypes(['application/pdf']);
    }

    /**
     * Get all videos for this rhythm.
     */
    public function getVideos()
    {
        return $this->getMedia('videos');
    }

    /**
     * Get all audios for this rhythm.
     */
    public function getAudios()
    {
        return $this->getMedia('audios');
    }

    /**
     * Get all PDFs for this rhythm.
     */
    public function getPdfs()
    {
        return $this->getMedia('pdfs');
    }
}
