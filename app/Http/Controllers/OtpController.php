<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OtpController extends Controller
{
    // === 1. FASE EMAIL ===
    public function verifyEmailView()
    {
        // Cegah masuk jika email sudah terverifikasi
        if (auth()->user()->email_verified_at) {
            return redirect()->route('otp.phone.view');
        }
        
        return Inertia::render('Auth/VerifyEmailOtp', [
            'email' => auth()->user()->email,
            // HANYA UNTUK TESTING: Kita kirim kodenya ke frontend agar Anda mudah mengujinya. 
            // Di produksi nyata, baris ini HARUS dihapus!
            'testing_otp' => auth()->user()->email_otp 
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $request->validate(['otp' => 'required|numeric|digits:6']);
        $user = auth()->user();

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
        // Pastikan email sudah beres dulu
        if (!auth()->user()->email_verified_at) {
            return redirect()->route('otp.email.view');
        }

        return Inertia::render('Auth/VerifyPhoneOtp', [
            'phone' => auth()->user()->phone,
            'testing_otp' => auth()->user()->phone_otp // Hapus ini di produksi
        ]);
    }

    public function verifyPhone(Request $request)
    {
        $request->validate(['otp' => 'required|numeric|digits:6']);
        $user = auth()->user();

        if ($request->otp == $user->phone_otp) {
            // 1. Berhasil! Hapus OTP dan catat waktu verifikasi
            $user->update([
                'phone_verified_at' => now(),
                'phone_otp' => null
            ]);

            // 2. Logout akun secara paksa (Sesuai skenario Anda)
            \Illuminate\Support\Facades\Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // 3. Arahkan ke halaman Login dengan pesan sukses
            return redirect()->route('login')->with('status', 'Verifikasi berhasil! Silakan login menggunakan kredensial Anda.');
        }

        return back()->withErrors(['otp' => 'Kode OTP WhatsApp salah atau tidak valid.']);
    }
}