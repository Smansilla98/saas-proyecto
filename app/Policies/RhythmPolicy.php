<?php

namespace App\Policies;

use App\Models\Rhythm;
use App\Models\User;

class RhythmPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Todos pueden ver ritmos (filtrados por año en el controlador)
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Rhythm $rhythm): bool
    {
        // Admin y Docente pueden ver cualquier ritmo
        if ($user->isAdmin() || $user->isDocente()) {
            return true;
        }
        
        // Alumno solo puede ver ritmos de su año (se valida en el controlador)
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isDocente();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Rhythm $rhythm): bool
    {
        return $user->isAdmin() || $user->isDocente();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Rhythm $rhythm): bool
    {
        return $user->isAdmin();
    }
}
