<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Year;

class YearPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Admin y Docente pueden ver todos los años
        // Alumno solo puede ver su año (se filtra en el controlador)
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Year $year): bool
    {
        // Admin y Docente pueden ver cualquier año
        if ($user->isAdmin() || $user->isDocente()) {
            return true;
        }
        
        // Alumno solo puede ver su año (se valida en el controlador)
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Year $year): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Year $year): bool
    {
        return $user->isAdmin();
    }
}
