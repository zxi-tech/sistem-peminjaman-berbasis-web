<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Http; // <-- Tambahan untuk hit API Fonnte nanti
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        $user = $request->user();

        // Cek Role: Jika admin, arahkan ke EditAdmin. Jika bukan, ke EditUser.
        $viewName = $user->role === 'admin' ? 'Profile/EditAdmin' : 'Profile/EditUser';

        // HITUNG STATISTIK ASLI DARI DATABASE
        $stats = [
            [
                'label' => 'Barang Dipinjam',
                'value' => $user->transactions()->whereIn('status', ['dipinjam', 'disetujui'])->count()
            ],
            [
                'label' => 'Menunggu Persetujuan',
                'value' => $user->transactions()->where('status', 'menunggu')->count()
            ],
            [
                'label' => 'Riwayat Peminjaman',
                'value' => $user->transactions()->count()
            ],
        ];

        return Inertia::render($viewName, [
            'mustVerifyEmail' => $user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
            'stats' => $stats,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();

        // 1. Ambil data yang divalidasi, KECUALI 'photo'
        // Kita tangani 'photo' secara terpisah
        $validatedData = $request->safe()->except('photo');
        $user->fill($validatedData);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($user->isDirty('phone')) {
            $user->phone_verified_at = now();
            $user->phone_otp = null;
        }

        // 2. 👇 LOGIKA UPLOAD FOTO YANG BENAR 👇
        // Cek apakah ada file foto yang DIKIRIM dalam request ini
        if ($request->hasFile('photo')) {
            // Hapus foto lama jika ada
            if ($user->photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->photo);
            }

            // Simpan foto baru
            $path = $request->file('photo')->store('profiles', 'public');
            $user->photo = $path;
        }
        // JIKA TIDAK ADA FILE FOTO YANG DIKIRIM, KOLOM $user->photo TIDAK DIUBAH SAMA SEKALI

        $user->save();

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

    // =========================================================================
    // 🚀 BLUEPRINT API WHATSAPP SUNGGUHAN (UNTUK DIGUNAKAN NANTI)
    // =========================================================================

    /**
     * Endpoint untuk mengirim OTP ke WhatsApp (Contoh pakai Fonnte)
     */
    public function sendWaOtp(Request $request)
    {
        $request->validate(['phone' => 'required|string|max:20']);
        $user = $request->user();

        // 1. Generate 6 digit angka random
        $otp = rand(100000, 999999);

        // 2. Simpan OTP ke database user ini
        $user->phone_otp = $otp;
        $user->save();

        // 3. Kirim ke WhatsApp via Fonnte (Buka komentar di bawah jika token sudah ada)
        /*
        Http::withHeaders([
            'Authorization' => 'TOKEN_FONNTE_ANDA_DISINI'
        ])->post('https://api.fonnte.com/send', [
            'target' => $request->phone,
            'message' => "*PGE HSSE System*\n\nKode OTP Anda adalah: *{$otp}*.\nJangan berikan kode ini kepada siapapun demi keamanan akun Anda."
        ]);
        */

        return response()->json(['message' => 'OTP berhasil dikirim ke WhatsApp Anda.']);
    }

    /**
     * Endpoint untuk memverifikasi OTP dari Frontend
     */
    public function verifyWaOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|string|size:6'
        ]);

        $user = $request->user();

        // Cek apakah OTP cocok dengan yang ada di database
        if ($user->phone_otp === $request->otp) {
            $user->phone_otp = null; // Reset agar tidak bisa dipakai 2x
            $user->save();

            return response()->json(['message' => 'OTP Valid', 'status' => true]);
        }

        return response()->json(['message' => 'Kode OTP Salah!', 'status' => false], 400);
    }
}
