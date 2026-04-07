<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Gunakan $request->user() alih-alih auth()->user()
        /** @var \App\Models\User|null $user */
        $user = $request->user();

        // Cek apakah user sudah login, dan apakah role-nya BUKAN 'admin'
        if ($user && $user->role !== 'admin') {

            // Jika BUKAN admin, tendang ke halaman Form Peminjaman Pekerja
            return redirect()->route('borrow.create')->with('error', 'Akses ditolak. Anda tidak memiliki hak akses Admin HSSE.');
        }

        // Jika dia Admin, silakan lewat!
        return $next($request);
    }
}
