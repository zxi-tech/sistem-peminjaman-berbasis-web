<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;

    // 👇 INI DIA KUNCI JAWABANNYA 👇
    // Beri tahu Laravel bahwa kolom-kolom ini AMAN untuk diisi dari form
    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'is_read',
    ];
}
