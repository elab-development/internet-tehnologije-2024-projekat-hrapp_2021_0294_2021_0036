<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\JsonResponse;

class RolesController extends Controller
{
    /**
     * GET /api/roles
     * Vraća sve uloge.
     */
    public function index(): JsonResponse
    {
        $roles = Role::all(['id', 'name']);
        return response()->json($roles);
    }
}
