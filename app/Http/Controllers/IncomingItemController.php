<?php

namespace App\Http\Controllers;

use App\Models\IncomingItem;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class IncomingItemController extends Controller
{
    // Menampilkan halaman riwayat barang masuk
    public function index()
    {
        // Ambil data riwayat dari yang terbaru, bawa juga data relasi nama barang dan nama adminnya
        $incomingItems = IncomingItem::with(['item', 'user'])->latest()->get();

        // Ambil data semua barang untuk pilihan dropdown saat admin mau input barang masuk
        $items = Item::all();

        // Ubah 'Admin' menjadi 'Dashboard'
        return Inertia::render('Dashboard/IncomingItems', [
            'incomingItems' => $incomingItems,
            'items' => $items
        ]);
    }

    // Menyimpan data saat admin klik "Simpan Barang Masuk"
    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'received_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        // 1. Simpan ke tabel log riwayat (incoming_items)
        IncomingItem::create([
            'item_id' => $request->item_id,
            'user_id' => Auth::id(), // Otomatis ambil ID Admin yang sedang login
            'quantity' => $request->quantity,
            'received_date' => $request->received_date,
            'notes' => $request->notes,
        ]);

        // 2. UPDATE STOK UTAMA DI TABEL ITEMS 
        $item = Item::findOrFail($request->item_id);
        // CATATAN: Ganti 'stock' dengan nama kolom jumlah barang di tabel items Anda (misal: quantity, total_stock, dll)
        $item->increment('stock', $request->quantity);

        // Kembali ke halaman sebelumnya dengan pesan sukses
        return redirect()->back()->with('message', 'Riwayat barang masuk berhasil dicatat dan stok bertambah!');
    }
}
