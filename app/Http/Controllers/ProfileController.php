<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        // Cek Role: Jika admin, arahkan ke EditAdmin. Jika bukan, ke EditUser.
        $viewName = $request->user()->role === 'admin' ? 'Profile/EditAdmin' : 'Profile/EditUser';

        return Inertia::render($viewName, [
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        // 👇 TAMBAHKAN LOGIKA UPLOAD FOTO INI 👇
        if ($request->hasFile('photo')) {
            // Hapus foto lama jika ada, agar storage tidak penuh
            if ($request->user()->photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($request->user()->photo);
            }

            // Simpan foto baru ke folder 'profiles'
            $path = $request->file('photo')->store('profiles', 'public');
            $request->user()->photo = $path;
        }
        // 👆 SAMPAI SINI 👆

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
