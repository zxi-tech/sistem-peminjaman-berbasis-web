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
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // Wajib Foto
            'sizes' => 'required|array|min:1',
            'sizes.*.size_name' => 'required|string|max:50',
            'sizes.*.stock' => 'required|integer|min:0',
        ]);

        DB::beginTransaction();

        try {
            // 2. Upload Foto 
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('items', 'public');
            }

            // 3. Simpan ke tabel `items`
            $item = Item::create([
                'name' => $validated['name'],
                'type' => $validated['type'],
                'description' => $validated['description'],
                'photo_path' => $photoPath,
            ]);

            // 4. Looping & Simpan varian ukuran
            foreach ($validated['sizes'] as $size) {
                ItemSize::create([
                    'item_id' => $item->id,
                    'size_name' => $size['size_name'],
                    'stock' => $size['stock'],
                ]);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Barang dan stok berhasil ditambahkan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    }

    /**
     * Mengupdate data barang yang sudah ada
     */
    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);

        // 1. Validasi Data (Perhatikan: photo sekarang nullable/opsional)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:asset,consumable',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Opsional saat edit
            'sizes' => 'required|array|min:1',
            'sizes.*.id' => 'nullable|integer', // ID opsional karena bisa jadi ada ukuran baru
            'sizes.*.size_name' => 'required|string|max:50',
            'sizes.*.stock' => 'required|integer|min:0',
        ]);

        DB::beginTransaction();

        try {
            // 2. Cek apakah Admin mengupload foto baru
            if ($request->hasFile('photo')) {
                // Hapus foto lama dari storage agar tidak menjadi sampah
                if ($item->photo_path) {
                    Storage::disk('public')->delete($item->photo_path);
                }
                // Simpan foto baru
                $item->photo_path = $request->file('photo')->store('items', 'public');
            }

            // 3. Update data dasar barang
            $item->name = $validated['name'];
            $item->type = $validated['type'];
            $item->description = $validated['description'];
            $item->save();

            // 4. Kelola Varian Ukuran & Stok (Sistem Cerdas)
            // Kumpulkan ID dari ukuran-ukuran yang dikirim oleh form React
            $submittedSizeIds = collect($validated['sizes'])->pluck('id')->filter()->toArray();

            // Hapus ukuran di Database yang tidak dikirim lagi oleh form (artinya Admin menekan tombol hapus di Modal)
            $item->sizes()->whereNotIn('id', $submittedSizeIds)->delete();

            // Loop data ukuran dari React: Update yang lama, dan Create yang baru
            foreach ($validated['sizes'] as $sizeData) {
                if (isset($sizeData['id'])) {
                    // Jika ada ID-nya, berarti ini ukuran lama yang diubah stok/namanya
                    ItemSize::where('id', $sizeData['id'])->update([
                        'size_name' => $sizeData['size_name'],
                        'stock' => $sizeData['stock'],
                    ]);
                } else {
                    // Jika tidak ada ID-nya, berarti Admin menekan "+ Tambah Ukuran" saat proses edit
                    ItemSize::create([
                        'item_id' => $item->id,
                        'size_name' => $sizeData['size_name'],
                        'stock' => $sizeData['stock'],
                    ]);
                }
            }

            DB::commit();
            return redirect()->back()->with('success', 'Data barang berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal mengupdate data: ' . $e->getMessage()]);
        }
    }

    /**
     * Menghapus data barang beserta foto dan varian ukurannya
     */
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $item = Item::findOrFail($id);

            // 1. Hapus foto dari folder storage agar tidak jadi sampah
            if ($item->photo_path) {
                Storage::disk('public')->delete($item->photo_path);
            }

            // 2. Hapus semua ukuran/stok yang berelasi dengan barang ini
            $item->sizes()->delete();

            // 3. Hapus data utama barang
            $item->delete();

            DB::commit();
            return redirect()->back()->with('success', 'Data barang berhasil dihapus permanen!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus data: ' . $e->getMessage()]);
        }
    }
}
