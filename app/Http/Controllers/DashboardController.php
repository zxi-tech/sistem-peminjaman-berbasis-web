<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ItemSize;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Hitung total pekerja (selain admin)
        $totalUsers = User::where('role', 'user')->count();

        // 2. Hitung total seluruh stok barang APD yang ada
        $totalItems = ItemSize::sum('stock');

        // Asumsi jumlah peminjaman aktif (kasar)
        $borrowedItems = Transaction::where('status', 'dipinjam')->count();

        // 3. Hitung pengajuan yang berstatus 'menunggu'
        $pendingTransactions = Transaction::where('status', 'menunggu')->count();

        // 4. Hitung peminjaman yang terlambat (status dipinjam, tapi end_date sudah lewat)
        $lateTransactions = Transaction::where('status', 'dipinjam')
            ->where('end_date', '<', Carbon::today())
            ->count();

        // 5. Ambil 5 transaksi terbaru beserta data User dan Detail Barangnya
        $recentTransactions = Transaction::with(['user', 'details.itemSize.item'])
            ->latest()
            ->take(5)
            ->get();

        // =================================================================
        // 6. LOGIKA CHART: Ambil data 6 bulan terakhir untuk grafik
        // =================================================================
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            // Mundur dari 5 bulan yang lalu hingga bulan ini
            $date = Carbon::now()->subMonths($i);

            // Hitung transaksi normal/tepat waktu bulan ini
            $tepatWaktu = Transaction::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->whereIn('status', ['selesai', 'dipinjam', 'menunggu'])
                ->count();

            // Hitung transaksi terlambat bulan ini
            $terlambat = Transaction::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->where('status', 'terlambat')
                ->count();

            // Masukkan ke array sesuai format yang dibaca Recharts React
            $chartData[] = [
                'name' => $date->translatedFormat('M'), // Menghasilkan 'Jan', 'Feb', dll.
                'tepatWaktu' => $tepatWaktu,
                'terlambat' => $terlambat,
            ];
        }

        // Lempar semua data ini ke React
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalItems' => $totalItems,
                'borrowedItems' => $borrowedItems,
                'pendingTransactions' => $pendingTransactions,
                'lateTransactions' => $lateTransactions,
            ],
            'recentTransactions' => $recentTransactions,
            'chartData' => $chartData // <--- Variabel chart dikirim ke React di sini!
        ]);
    }
}
