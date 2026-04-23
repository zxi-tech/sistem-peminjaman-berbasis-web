<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('incoming_items', function (Blueprint $table) {
            $table->id();

            // Relasi ke tabel items (Barang apa yang masuk?)
            // (Pastikan tabel barang Anda bernama 'items')
            $table->foreignId('item_id')->constrained('items')->onDelete('cascade');

            // Relasi ke tabel users (Siapa Admin yang mencatat?)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Jumlah barang yang masuk
            $table->integer('quantity');

            // Tanggal barang diterima dari vendor/supplier
            $table->date('received_date');

            // Catatan tambahan (misal: "Barang dari Vendor A", atau "Kondisi kardus agak penyok")
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incoming_items');
    }
};
