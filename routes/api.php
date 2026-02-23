<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\RhythmController;
use App\Http\Controllers\Api\YearController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Years routes
    Route::apiResource('years', YearController::class);

    // Rhythms routes (nested under years)
    Route::prefix('years/{year}')->group(function () {
        Route::get('/rhythms', [RhythmController::class, 'index']);
        Route::post('/rhythms', [RhythmController::class, 'store']);
    });

    // Rhythm routes
    Route::apiResource('rhythms', RhythmController::class)->except(['index', 'store']);

    // Media routes (nested under rhythms)
    Route::prefix('rhythms/{rhythm}')->group(function () {
        Route::post('/media/video', [MediaController::class, 'uploadVideo']);
        Route::post('/media/audio', [MediaController::class, 'uploadAudio']);
        Route::post('/media/pdf', [MediaController::class, 'uploadPdf']);
        Route::delete('/media/{mediaId}', [MediaController::class, 'deleteMedia']);
    });
});

