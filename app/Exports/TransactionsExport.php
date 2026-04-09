<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection; // <-- Kita ubah jadi Collection
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TransactionsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;

    protected $transactions;

    // Menangkap data matang dari Controller
    public function __construct($transactions)
    {
        $this->transactions = $transactions;
    }

    // 1. Berikan datanya ke Excel
    public function collection()
    {
        return $this->transactions;
    }

    // 2. Buat Baris Judul Paling Atas
    public function headings(): array
    {
        return [
            'ID Transaksi',
            'Nama Peminjam',
            'NIP',
            'Item Transaksi',
            'Tanggal Pinjam',
            'Tanggal Kembali',
            'Status Akhir'
        ];
    }

    // 3. Masukkan Data ke Setiap Kolom
    public function map($trx): array
    {
        $idTrx = 'HSSE-' . Carbon::parse($trx->created_at)->format('Y') . str_pad($trx->id, 3, '0', STR_PAD_LEFT);
        $peminjam = $trx->user->name ?? 'User Dihapus';
        $nip = $trx->user->nip ?? '-';

        $itemsList = $trx->details ? $trx->details->map(function ($detail) {
            $itemName = $detail->itemSize->item->name ?? 'Barang Dihapus';
            return "{$itemName} (x{$detail->quantity})";
        })->join(', ') : '-';

        return [
            $idTrx,
            $peminjam,
            $nip,
            $itemsList,
            Carbon::parse($trx->start_date)->format('d M Y'),
            Carbon::parse($trx->end_date)->format('d M Y'),
            strtoupper($trx->status),
        ];
    }

    // 4. Percantik Tabel (Judul Kolom Jadi Bold)
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 12]],
        ];
    }
}
