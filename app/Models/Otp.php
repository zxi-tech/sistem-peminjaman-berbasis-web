<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    protected $fillable = [
        'user_id',
        'email_otp',
        'wa_otp',
        'expires_at',
        'is_verified'
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'is_verified' => 'boolean',
        ];
    }

    // Relasi: OTP ini milik Satu User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}