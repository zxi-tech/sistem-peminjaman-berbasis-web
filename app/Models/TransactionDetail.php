<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    protected $fillable = [
        'transaction_id',
        'item_size_id',
        'quantity'
    ];

    // Relasi: Detail ini masuk ke dalam Satu Transaksi
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    // Relasi: Detail ini mengarah ke Satu Ukuran Barang spesifik
    public function itemSize()
    {
        return $this->belongsTo(ItemSize::class);
    }
}