<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class OtpController extends Controller
{
    // === 1. FASE EMAIL ===
    public function verifyEmailView()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Cegah masuk jika email sudah terverifikasi
        if ($user->email_verified_at) {
            return redirect()->route('otp.phone.view');
        }

        return Inertia::render('Auth/VerifyEmailOtp', [
            'email' => $user->email,
            'testing_otp' => $user->email_otp
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $request->validate(['otp' => 'required|numeric|digits:6']);

        /** @var \App\Models\User $user */
        $user = $request->user();

        if ($request->otp == $user->email_otp) {
            // Berhasil! Hapus OTP dan catat jam verifikasi
            $user->update([
                'email_verified_at' => now(),
                'email_otp' => null
            ]);
            // Arahkan ke fase 2 (WhatsApp)
            return redirect()->route('otp.phone.view');
        }

        return back()->withErrors(['otp' => 'Kode OTP Email salah atau tidak valid.']);
    }

    // === 2. FASE WHATSAPP ===
    public function verifyPhoneView()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Pastikan email sudah beres dulu
        if (!$user->email_verified_at) {
            return redirect()->route('otp.email.view');
        }

        return Inertia::render('Auth/VerifyPhoneOtp', [
            'phone' => $user->phone,
            'testing_otp' => $user->phone_otp // Hapus ini di produksi
        ]);
    }

    public function verifyPhone(Request $request)
    {
        $request->validate(['otp' => 'required|numeric|digits:6']);

        /** @var \App\Models\User $user */
        $user = $request->user();

        if ($request->otp == $user->phone_otp) {
            // 1. Berhasil! Hapus OTP dan catat waktu verifikasi
            $user->update([
                'phone_verified_at' => now(),
                'phone_otp' => null
            ]);

            // 2. Logout akun secara paksa (Sesuai skenario Anda)
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // 3. Arahkan ke halaman Login dengan pesan sukses
            return redirect()->route('login')->with('status', 'Verifikasi berhasil! Silakan login menggunakan kredensial Anda.');
        }

        return back()->withErrors(['otp' => 'Kode OTP WhatsApp salah atau tidak valid.']);
    }
}
