<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BorrowController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OtpController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// ========================================================
// 1. AREA UMUM (Bisa diakses Pekerja & Admin yang sudah login)
// ========================================================
Route::middleware('auth')->group(function () {
    // Profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // FITUR PEKERJA (Peminjaman & Status) - Ditaruh di sini agar Pekerja bisa masuk
    Route::get('/borrow/create', [BorrowController::class, 'create'])->name('borrow.create');
    Route::post('/borrow', [BorrowController::class, 'store'])->name('borrow.store');
    Route::get('/borrow/status', [BorrowController::class, 'index'])->name('borrow.status');

    // Proses Verifikasi OTP
    Route::get('/verify-email-otp', [OtpController::class, 'verifyEmailView'])->name('otp.email.view');
    Route::post('/verify-email-otp', [OtpController::class, 'verifyEmail'])->name('otp.email.verify');
    Route::get('/verify-whatsapp-otp', [OtpController::class, 'verifyPhoneView'])->name('otp.phone.view');
    Route::post('/verify-whatsapp-otp', [OtpController::class, 'verifyPhone'])->name('otp.phone.verify');
});


// ========================================================
// 2. AREA KHUSUS ADMIN HSSE (Dilindungi gembok 'admin')
// ========================================================
Route::middleware(['auth', 'verified', 'admin'])->group(function () {

    // Dashboard Admin
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Manajemen Barang (Admin)
    Route::get('/items', [ItemController::class, 'index'])->name('items.index');
    Route::post('/items', [ItemController::class, 'store'])->name('items.store');
    Route::put('/items/{id}', [ItemController::class, 'update'])->name('items.update');

    Route::delete('/items/{id}', [ItemController::class, 'destroy'])->name('items.destroy');

    // Manajemen Peminjaman (Persetujuan Admin)
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::put('/transactions/{id}', [TransactionController::class, 'update'])->name('transactions.update');

    // Riwayat Transaksi (Admin)
    Route::get('/history', [TransactionController::class, 'history'])->name('history.index');

    // Manajemen User (Admin)
    Route::get('/users', [UserController::class, 'index'])->name('users.index');

    Route::put('/users/{id}', [\App\Http\Controllers\UserController::class, 'update'])->name('users.update');

    // Pesan Masuk (Admin)
    Route::get('/messages', [\App\Http\Controllers\ContactMessageController::class, 'index'])->name('messages.index');
    Route::put('/messages/{id}/read', [\App\Http\Controllers\ContactMessageController::class, 'markAsRead'])->name('messages.read');
    Route::delete('/messages/{id}', [\App\Http\Controllers\ContactMessageController::class, 'destroy'])->name('messages.destroy');
});

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

// Tambahkan baris ini di routes/web.php
Route::get('/admin/transactions/export', [\App\Http\Controllers\TransactionController::class, 'exportExcel'])->name('transactions.export');

// Rute untuk memproses form Contact Us
Route::post('/contact-message', [\App\Http\Controllers\ContactMessageController::class, 'store'])->name('contact.store');

require __DIR__ . '/auth.php';
