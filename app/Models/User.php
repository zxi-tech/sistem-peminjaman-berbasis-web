<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // Kolom yang boleh diisi
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'nip',          // <-- Tambahan baru
        'phone',        // <-- Tambahan baru
        'department',   // <-- Tambahan baru
        'role',         // <-- Tambahan baru
        'area',         // <-- Tambahan baru
        'about',        // <-- Tambahan baru
        'photo',        // <-- Tambahan baru
        'status',       // <-- Tambahan baru
        'email_otp',         // <-- Tambahkan ini
        'phone_otp',         // <-- Tambahkan ini
        'email_verified_at',
        'phone_verified_at', // <-- Tambahkan ini
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'wa_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relasi: Satu User punya Satu data OTP aktif
    public function otp()
    {
        return $this->hasOne(Otp::class);
    }

    // Relasi: Satu User bisa melakukan Banyak Transaksi peminjaman
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}