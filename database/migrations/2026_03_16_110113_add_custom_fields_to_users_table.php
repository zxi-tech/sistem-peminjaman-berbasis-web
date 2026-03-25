<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan kolom baru ke tabel users dengan pengecekan.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Cek satu per satu, jika belum ada baru ditambahkan
            if (!Schema::hasColumn('users', 'nip')) {
                $table->string('nip')->unique()->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->unique()->nullable()->after('nip');
            }
            if (!Schema::hasColumn('users', 'department')) {
                $table->string('department')->nullable()->after('phone');
            }
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('user')->after('department');
            }
            if (!Schema::hasColumn('users', 'area')) {
                $table->string('area')->nullable()->after('role');
            }
            if (!Schema::hasColumn('users', 'about')) {
                $table->text('about')->nullable()->after('area');
            }
            if (!Schema::hasColumn('users', 'photo')) {
                $table->string('photo')->nullable()->after('about');
            }
            if (!Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('Aktif')->after('photo');
            }
        });
    }

    /**
     * Membatalkan penambahan kolom (jika di-rollback).
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Hapus kolom hanya jika kolom tersebut ada
            $columnsToDrop = [];
            
            $customColumns = ['nip', 'phone', 'department', 'role', 'area', 'about', 'photo', 'status'];
            foreach ($customColumns as $col) {
                if (Schema::hasColumn('users', $col)) {
                    $columnsToDrop[] = $col;
                }
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};