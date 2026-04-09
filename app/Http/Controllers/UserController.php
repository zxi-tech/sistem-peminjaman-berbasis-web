<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // 1. MUNCULKAN HALAMAN DAFTAR USER (DENGAN PAGINASI & FILTER)
    public function index(Request $request)
    {
        // Siapkan kerangka query dasar
        $query = User::withCount('transactions')
            ->withCount(['transactions as on_time_count' => function ($q) {
                $q->where('status', 'selesai')->whereNull('notes');
            }])
            ->withCount(['transactions as late_count' => function ($q) {
                $q->where('status', 'terlambat')->orWhere('notes', 'LIKE', '%terlambat%');
            }]);

        // FITUR PENCARIAN (Cari Nama, NIP, atau Email)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nip', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // FITUR FILTER STATUS
        if ($request->filled('status') && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        // EKSEKUSI: Ambil data, potong 7 per halaman, lalu format datanya
        $users = $query->latest()
            ->paginate(7)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'nip' => $user->nip,
                    'email' => $user->email,
                    'department' => $user->department,
                    'phone' => $user->phone,
                    'photo' => $user->photo,
                    'status' => $user->status ?? 'Aktif',
                    'about' => $user->about ?? 'Belum ada deskripsi profil untuk pengguna ini.',
                    'area' => $user->area ?? 'Site Lahendong',

                    'total_borrow' => $user->transactions_count,
                    'on_time' => $user->on_time_count,
                    'late' => $user->late_count,
                ];
            })
            ->withQueryString(); // Memastikan saat pindah halaman, kata kunci pencarian tidak hilang

        // Kirim data pengguna dan parameter filter yang sedang aktif ke React
        return Inertia::render('Dashboard/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    // 2. PROSES UPDATE DATA (STATUS & EMAIL VIA OTP)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validasi dasar
        $validated = $request->validate([
            'status' => 'required|in:Aktif,Nonaktif,Cuti',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
                'ends_with:@pertamina.com,@mitrakerja.pertamina.com'
            ],
            'otp' => 'sometimes|required|digits:6'
        ]);

        // Skenario 1: Jika yang diubah hanya status (Tidak perlu OTP)
        if (!isset($validated['email']) || $validated['email'] === $user->email) {
            $user->update(['status' => $validated['status']]);
            return back()->with('success', 'Status akun berhasil diperbarui!');
        }

        // Skenario 2: Jika Email Diubah, periksa OTP-nya!
        if (isset($validated['email']) && $validated['email'] !== $user->email) {

            // CEK OTP: Bandingkan kode yang diketik admin dengan yang ada di database (email_otp)
            // Asumsi: Admin juga dikirimi OTP ke nomornya, atau menggunakan OTP Master "123456" untuk sementara
            $isValidOtp = ($request->otp === $user->email_otp || $request->otp === '123456');

            if (!$isValidOtp) {
                // Jika salah, lemparkan error kembali ke React
                return back()->withErrors(['otp' => 'Kode OTP tidak valid! Akses ditolak.']);
            }

            // Jika OTP Benar, simpan email dan status baru, lalu hapus OTP lamanya
            $user->update([
                'email' => $validated['email'],
                'status' => $validated['status'],
                'email_otp' => null // Kosongkan OTP setelah berhasil dipakai
            ]);

            return back()->with('success', 'Email dan Status berhasil diperbarui melalui verifikasi OTP!');
        }
    }
}
