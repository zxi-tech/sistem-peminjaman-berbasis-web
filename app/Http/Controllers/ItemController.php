<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemSize;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    /**
     * Menampilkan halaman Manajemen Barang (Dashboard/Items.jsx)
     */
    public function index()
    {
        // Ambil semua barang beserta relasi ukuran dan stoknya, urutkan dari yang terbaru
        $items = Item::with('sizes')->latest()->get();

        return Inertia::render('Dashboard/Items', [
            'items' => $items
        ]);
    }

    /**
     * Menyimpan data barang baru ke database beserta foto dan varian ukurannya
     */
    public function store(Request $request)
    {
        // 1. Validasi Data dari React
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:asset,consumable',
            'description' => 'nullable|string',
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // Wajib Foto, max 2MB
            'sizes' => 'required|array|min:1', // Minimal ada 1 ukuran
            'sizes.*.size_name' => 'required|string|max:50',
            'sizes.*.stock' => 'required|integer|min:0',
        ]);

        // 2. Gunakan DB Transaction agar data aman
        DB::beginTransaction();

        try {
            // 3. Upload Foto ke folder storage/app/public/items
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('items', 'public');
            }

            // 4. Simpan ke tabel `items`
            $item = Item::create([
                'name' => $validated['name'],
                'type' => $validated['type'],
                'description' => $validated['description'],
                'photo_path' => $photoPath,
            ]);

            // 5. Looping & Simpan varian ukuran ke tabel `item_sizes`
            foreach ($validated['sizes'] as $size) {
                ItemSize::create([
                    'item_id' => $item->id,
                    'size_name' => $size['size_name'],
                    'stock' => $size['stock'],
                ]);
            }

            // Jika semua lancar, komit (sahkan) penyimpanan database
            DB::commit();

            // 6. Kembalikan ke halaman sebelumnya
            return redirect()->back()->with('success', 'Barang dan stok berhasil ditambahkan!');

        } catch (\Exception $e) {
            // Jika ada error (misal database mati), batalkan semua simpanan
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    }
}