<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'start_date',
        'end_date',
        'purpose',
        'status',
        'notes'
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'last_reminder_sent_at' => 'date',
        ];
    }

    // Relasi: Transaksi ini dilakukan oleh Satu User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: Satu Transaksi bisa meminjam Banyak Barang (Detail)
    public function details()
    {
        return $this->hasMany(TransactionDetail::class);
    }
}