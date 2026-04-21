<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        // 👇 1. MODIFIKASI VALIDASI DENGAN PEMBATASAN DOMAIN 👇
        $request->validate([
            'nip' => 'required|string|max:255|unique:users,nip',
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:users,email',
                'ends_with:@pertamina.com,@mitrakerja.pertamina.com'
            ],
            'phone' => 'required|string|max:255|unique:users,phone',
            'department' => 'required|string|max:255',
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ], [
            // Pesan error agar React bisa menampilkannya dengan bahasa Indonesia
            'email.ends_with' => 'Pendaftaran gagal! Anda wajib menggunakan email @pertamina.com atau @mitrakerja.pertamina.com.',
        ]);

        // 2. Generate 6 Digit Kode Acak untuk OTP
        $emailOtp = rand(100000, 999999);
        $phoneOtp = rand(100000, 999999);

        // 3. Simpan Data beserta OTP-nya
        $user = \App\Models\User::create([
            'nip' => $request->nip,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'department' => $request->department,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'email_otp' => $emailOtp,
            'phone_otp' => $phoneOtp,
        ]);

        // (Di kehidupan nyata, di sini Anda men-trigger API Email & WhatsApp untuk mengirim $emailOtp dan $phoneOtp ke user)
        // Untuk testing, Laravel otomatis mencatat kode ini di database Anda.

        // 4. Login user (agar sistem tahu siapa yang sedang diverifikasi)
        \Illuminate\Support\Facades\Auth::login($user);

        // 5. JANGAN KE DASHBOARD! Arahkan paksa ke Halaman Verifikasi Email
        return redirect()->route('verification.notice');
    }
}
