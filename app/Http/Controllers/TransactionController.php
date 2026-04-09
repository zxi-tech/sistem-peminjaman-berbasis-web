<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Exports\TransactionsExport;
use Maatwebsite\Excel\Facades\Excel;

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

                $itemsList = $trx->details->map(function ($detail) {
                    $itemName = $detail->itemSize->item->name;
                    $sizeName = $detail->itemSize->size_name;
                    $qty = $detail->quantity;
                    return "{$itemName} ({$sizeName}) x{$qty}";
                })->join(', ');

                return [
                    'raw_id' => $trx->id,
                    'id' => 'HSSE-' . Carbon::parse($trx->created_at)->format('Y') . str_pad($trx->id, 3, '0', STR_PAD_LEFT),
                    'name' => $trx->user->name ?? 'User Dihapus',
                    'nip' => $trx->user->nip ?? '-',
                    'department' => $trx->user->department ?? '-',
                    'items' => $itemsList,
                    'dates' => Carbon::parse($trx->start_date)->format('d M') . ' - ' . Carbon::parse($trx->end_date)->format('d M Y'),
                    'status' => $trx->status,
                    'purpose' => $trx->purpose,
                    'notes' => $trx->notes, // 👇 PERBAIKAN 1: Kirim notes ke React
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

            // 👇 PERBAIKAN 2: Simpan 'notes' ke database saat di-update 👇
            if ($validated['action'] === 'approve') {
                $transaction->update([
                    'status' => 'dipinjam',
                    'notes' => $validated['notes']
                ]);
            } elseif ($validated['action'] === 'reject') {
                $transaction->update([
                    'status' => 'ditolak',
                    'notes' => $validated['notes']
                ]);
                foreach ($transaction->details as $detail) {
                    $detail->itemSize->increment('stock', $detail->quantity);
                }
            } elseif ($validated['action'] === 'return') {
                $transaction->update([
                    'status' => 'selesai',
                    'notes' => $validated['notes']
                ]);
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

                $itemsList = $trx->details->map(function ($detail) {
                    $itemName = $detail->itemSize->item->name;
                    $sizeName = $detail->itemSize->size_name;
                    $qty = $detail->quantity;
                    return "{$itemName} ({$sizeName}) x{$qty}";
                })->join(', ');

                return [
                    'raw_id' => $trx->id,
                    'id' => 'HSSE-' . Carbon::parse($trx->created_at)->format('Y') . str_pad($trx->id, 3, '0', STR_PAD_LEFT),
                    'name' => $trx->user->name ?? 'User Dihapus',
                    'nip' => $trx->user->nip ?? '-',
                    'department' => $trx->user->department ?? '-',
                    'items' => $itemsList,
                    'dates' => Carbon::parse($trx->start_date)->format('d M') . ' - ' . Carbon::parse($trx->end_date)->format('d M Y'),
                    'status' => $trx->status,
                    'purpose' => $trx->purpose,
                    'notes' => $trx->notes, // 👇 PERBAIKAN 3: Kirim notes ke React History
                ];
            });

        return Inertia::render('Dashboard/History', [
            'transactions' => $transactions
        ]);
    }

    // =========================================================================
    // 4. EXPORT DATA KE EXCEL (.XLSX ASLI)
    // =========================================================================
    public function exportExcel(Request $request)
    {
        $query = \App\Models\Transaction::with(['user', 'details.itemSize.item'])
            ->whereIn('status', ['selesai', 'ditolak']);

        $type = $request->query('type', 'semua');

        if ($type === 'bulan_ini') {
            $query->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year);
        } elseif ($type === 'tahun_ini') {
            $query->whereYear('created_at', now()->year);
        } elseif ($type === 'custom' && $request->start_date && $request->end_date) {
            $query->whereBetween('created_at', [
                $request->start_date . ' 00:00:00',
                $request->end_date . ' 23:59:59'
            ]);
        }

        $transactions = $query->latest()->get();

        $fileName = 'Riwayat_Peminjaman_HSSE_' . date('Y-m-d_H-i') . '.xlsx';
        return Excel::download(new TransactionsExport($transactions), $fileName);
    }
}
