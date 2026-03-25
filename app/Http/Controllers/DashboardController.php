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

        // Lempar semua data ini ke React
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalItems' => $totalItems,
                'borrowedItems' => $borrowedItems,
                'pendingTransactions' => $pendingTransactions,
                'lateTransactions' => $lateTransactions,
            ],
            'recentTransactions' => $recentTransactions
        ]);
    }
}