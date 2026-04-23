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
use Illuminate\Support\Facades\Mail; // Pastikan ini ada
use App\Mail\OtpMail; // Pastikan ini ada

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
        // 1. Validasi
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
            'email.ends_with' => 'Pendaftaran gagal! Anda wajib menggunakan email @pertamina.com atau @mitrakerja.pertamina.com.',
        ]);

        // 2. Generate OTP
        $emailOtp = rand(100000, 999999);
        $phoneOtp = rand(100000, 999999);

        // 3. Simpan Data ke Database (Hanya 1 Kali!)
        $user = User::create([
            'nip' => $request->nip,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'department' => $request->department,
            'password' => Hash::make($request->password),
            'email_otp' => $emailOtp,
            'phone_otp' => $phoneOtp,
        ]);

        // 4. Panggil Kurir Email
        Mail::to($user->email)->send(new OtpMail($emailOtp));

        // 5. Login otomatis
        Auth::login($user);

        // 6. Arahkan ke halaman verifikasi
        return redirect()->route('verification.notice');
    }
}
