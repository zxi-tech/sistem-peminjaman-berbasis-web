<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'name',
        'type',
        'warehouse',
        'description',
        'photo_path',
        'model_3d_path'
    ];

    // Relasi: Satu Barang bisa punya Banyak Ukuran (dan stoknya)
    public function sizes()
    {
        return $this->hasMany(ItemSize::class);
    }
}
