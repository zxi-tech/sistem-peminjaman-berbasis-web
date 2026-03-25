<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // Ambil semua data user, urutkan dari yang terbaru mendaftar
        $users = User::latest()->get();

        return Inertia::render('Dashboard/Users', [
            'users' => $users
        ]);
    }
}