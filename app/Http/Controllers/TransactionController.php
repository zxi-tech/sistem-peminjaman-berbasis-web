<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TransactionController extends Controller
{
    // 1. Menampilkan Halaman Daftar Peminjaman Aktif
    public function index()
    {
        $transactions = Transaction::with(['user', 'details.itemSize.item'])
            ->whereIn('status', ['menunggu', 'dipinjam', 'terlambat'])
            ->latest()
            ->get()
            ->map(function ($trx) {
                
                // MENGGABUNGKAN NAMA BARANG, UKURAN, DAN JUMLAH
                // Hasil: "Safety Helmet (All Size) x2, Sepatu Safety (40) x1"
                $itemsList = $trx->details->map(function ($detail) {
                    $itemName = $detail->itemSize->item->name;
                    $sizeName = $detail->itemSize->size_name;
                    $qty = $detail->quantity;
                    return "{$itemName} ({$sizeName}) x{$qty}";
                })->join(', ');

                return [
                    'raw_id' => $trx->id,
                    'id' => 'TRX-' . Carbon::parse($trx->created_at)->format('Y') . str_pad($trx->id, 3, '0', STR_PAD_LEFT),
                    'name' => $trx->user->name ?? 'User Dihapus',
                    'nip' => $trx->user->nip ?? '-', // <-- NIP ditambahkan di sini
                    'department' => $trx->user->department ?? '-', // <-- Ambil departemen asli
                    'items' => $itemsList, // <-- Gunakan list yang sudah ada jumlahnya
                    'dates' => Carbon::parse($trx->start_date)->format('d M') . ' - ' . Carbon::parse($trx->end_date)->format('d M Y'),
                    'status' => $trx->status,
                    'purpose' => $trx->purpose,
                ];
            });

        return Inertia::render('Dashboard/Transactions', [
            'transactions' => $transactions
        ]);
    }

    // 2. Mengeksekusi Persetujuan / Pengembalian
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'action' => 'required|in:approve,reject,return',
            'notes' => 'nullable|string'
        ]);

        DB::beginTransaction();

        try {
            $transaction = Transaction::with('details.itemSize')->findOrFail($id);

            if ($validated['action'] === 'approve') {
                $transaction->update(['status' => 'dipinjam']);
            } 
            elseif ($validated['action'] === 'reject') {
                $transaction->update(['status' => 'ditolak']);
                foreach ($transaction->details as $detail) {
                    $detail->itemSize->increment('stock', $detail->quantity);
                }
            } 
            elseif ($validated['action'] === 'return') {
                $transaction->update(['status' => 'selesai']);
                foreach ($transaction->details as $detail) {
                    $detail->itemSize->increment('stock', $detail->quantity);
                }
            }

            DB::commit();
            return back()->with('success', 'Status transaksi berhasil diperbarui!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    // 3. Menampilkan Halaman Riwayat (History)
    public function history()
    {
        $transactions = Transaction::with(['user', 'details.itemSize.item'])
            ->whereIn('status', ['selesai', 'ditolak'])
            ->latest()
            ->get()
            ->map(function ($trx) {
                
                // PERBAIKAN FORMAT DI HALAMAN HISTORY
                $itemsList = $trx->details->map(function ($detail) {
                    $itemName = $detail->itemSize->item->name;
                    $sizeName = $detail->itemSize->size_name;
                    $qty = $detail->quantity;
                    return "{$itemName} ({$sizeName}) x{$qty}";
                })->join(', ');

                return [
                    'raw_id' => $trx->id,
                    'id' => 'TRX-' . Carbon::parse($trx->created_at)->format('Y') . str_pad($trx->id, 3, '0', STR_PAD_LEFT),
                    'name' => $trx->user->name ?? 'User Dihapus',
                    'nip' => $trx->user->nip ?? '-',
                    'department' => $trx->user->department ?? '-',
                    'items' => $itemsList,
                    'dates' => Carbon::parse($trx->start_date)->format('d M') . ' - ' . Carbon::parse($trx->end_date)->format('d M Y'),
                    'status' => $trx->status,
                    'purpose' => $trx->purpose,
                ];
            });

        return Inertia::render('Dashboard/History', [
            'transactions' => $transactions
        ]);
    }
}