import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function History({ auth, transactions }) {

    // Dummy Data khusus arsip
    const displayTransactions = transactions && transactions.length > 0 ? transactions : [
        { id: 'TRX-2026001', name: 'Budi Santoso', nip: '82910023', items: 'Helm Safety (1), Sepatu Boots (1)', dates: '11 Mar - 13 Mar 2026', status: 'selesai', purpose: 'Inspeksi rutin sumur panas bumi area utara.' },
        { id: 'TRX-2026003', name: 'Siti Aminah', nip: '82910045', items: 'Ear Plug (2), Goggles (1)', dates: '12 Mar - 12 Mar 2026', status: 'ditolak', purpose: 'Pengajuan ditolak karena stok Ear Plug sedang kosong di gudang utama.' },
        { id: 'TRX-2026012', name: 'Hizkia Santoso', nip: '82910088', items: 'Coverall Onshore (1)', dates: '05 Mar - 08 Mar 2026', status: 'selesai', purpose: 'Perbaikan turbin uap sektor B.' },
        { id: 'TRX-2026015', name: 'Andi Wijaya', nip: '82910012', items: 'Safety Shoes (1), Safety Gloves (2)', dates: '01 Mar - 02 Mar 2026', status: 'selesai', purpose: 'Pemindahan barang berat di gudang.' },
        { id: 'TRX-2026018', name: 'Rian Hidayat', nip: '82910067', items: 'Gas Detector (1)', dates: '28 Feb - 28 Feb 2026', status: 'ditolak', purpose: 'Alat sedang dalam masa kalibrasi bulanan.' },
    ];

    const [activeTab, setActiveTab] = useState('semua');
    const [selectedTrx, setSelectedTrx] = useState(null);

    // State khusus untuk Animasi React
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Fungsi buka modal dengan animasi ringan
    const openModal = (trx) => {
        setSelectedTrx(trx);
        setIsModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
    };

    // Fungsi tutup modal (dipercepat jadi 200ms)
    const closeModal = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsModalOpen(false);
            setSelectedTrx(null);
        }, 200);
    };

    const filteredTransactions = displayTransactions.filter(trx => {
        if (activeTab === 'semua') return true;
        return trx.status === activeTab;
    });

    const getStatusBadge = (status) => {
        const statusMap = {
            'selesai': { bg: 'bg-[#00A651]', text: 'text-white', shadow: 'shadow-[#00A651]/40', icon: '✅' },
            'ditolak': { bg: 'bg-[#ED1C24]', text: 'text-white', shadow: 'shadow-[#ED1C24]/40', icon: '❌' }
        };
        const config = statusMap[status.toLowerCase()] || { bg: 'bg-gray-200', text: 'text-gray-700', shadow: '', icon: '📌' };
        const label = status.charAt(0).toUpperCase() + status.slice(1);
        return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide shadow-md ${config.bg} ${config.text} ${config.shadow}`}>
                <span className="text-[10px]">{config.icon}</span>{label}
            </div>
        );
    };

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Riwayat Transaksi" />

            <div className="w-full pb-12 relative animate-in fade-in duration-300">

                {/* Header Halaman & Tombol Export */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Riwayat Peminjaman</h1>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Arsip seluruh transaksi yang telah selesai dikembalikan atau ditolak.</p>
                    </div>

                    <button className="bg-[#107C41] hover:bg-[#0c6132] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform hover:-translate-y-1 duration-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Export to Excel
                    </button>
                </div>

                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-4 bg-gray-50/50">
                        <div className="flex gap-2 bg-gray-100/80 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto custom-scrollbar relative">
                            {['semua', 'selesai', 'ditolak'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative z-10 px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all duration-300 whitespace-nowrap ${activeTab === tab ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'}`}
                                >
                                    {activeTab === tab && (
                                        <div className={`absolute inset-0 -z-10 rounded-lg transition-all duration-300 ${tab === 'selesai' ? 'bg-[#00A651]' : tab === 'ditolak' ? 'bg-[#ED1C24]' : 'bg-[#21409A]'}`}></div>
                                    )}
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                            <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 hover:border-gray-300 flex items-center justify-between gap-3 w-full sm:w-48 transition-all">
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    Pilih Periode
                                </span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>

                            <div className="relative w-full sm:w-72 group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400 group-focus-within:text-[#21409A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <input type="text" className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#21409A] focus:ring-4 focus:ring-[#21409A]/10 transition-all duration-300" placeholder="Cari arsip transaksi..." />
                            </div>
                        </div>
                    </div>

                    {/* Tabel Data */}
                    <div className="overflow-x-auto custom-scrollbar min-h-[300px]">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-gray-100 bg-white text-gray-400 text-[11px] font-extrabold uppercase tracking-widest">
                                    <th className="px-6 py-5">ID Transaksi</th>
                                    <th className="px-6 py-5">Peminjam</th>
                                    <th className="px-6 py-5">Item Transaksi</th>
                                    <th className="px-6 py-5">Tanggal</th>
                                    <th className="px-6 py-5 text-center">Status Akhir</th>
                                    <th className="px-6 py-5 text-center">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredTransactions.length > 0 ? filteredTransactions.map((trx, index) => (
                                    <tr key={index} className="hover:bg-[#F4F5FA] transition-colors duration-200 group cursor-pointer" onClick={() => openModal(trx)}>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-500 font-bold px-3 py-1.5 rounded-lg text-xs font-mono border border-gray-200 group-hover:border-[#21409A]/30 group-hover:text-[#21409A] transition-colors duration-300">{trx.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 border border-gray-200 flex items-center justify-center font-bold text-xs shrink-0 group-hover:from-[#21409A]/10 group-hover:to-[#21409A]/20 group-hover:text-[#21409A] transition-all duration-300">{getInitials(trx.name)}</div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-800">{trx.name}</span>
                                                    <span className="text-[11px] text-gray-400 font-medium font-mono tracking-wide">NIP: {trx.nip || '-'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            <div className="truncate max-w-[200px]">{trx.items}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {trx.dates}
                                        </td>
                                        <td className="px-6 py-4 text-center">{getStatusBadge(trx.status)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openModal(trx); }}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-white hover:bg-[#21409A] hover:border-[#21409A] transition-all duration-300 shadow-sm transform hover:scale-110"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                                                </div>
                                                <p className="text-sm font-medium">Tidak ada arsip transaksi yang cocok.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ================= MODAL DETAIL ARSIP (ANIMASI RINGAN & CEPAT) ================= */}
            {isModalOpen && selectedTrx && (
                <div
                    // Latar belakang diubah jadi gray-900 biasa tanpa blur, transisi opacity 200ms
                    className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 transition-opacity duration-200 ease-in-out ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                    onClick={closeModal}
                >
                    <div
                        // Modal content dengan scale sangat tipis (95% ke 100%) tanpa translate-y yang berat
                        className={`bg-white rounded-[24px] shadow-2xl w-full max-w-xl flex flex-col overflow-hidden transform transition-all duration-200 ease-out ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Aksen 4 Warna Pertamina */}
                        <div className="h-1.5 w-full flex">
                            <div className="bg-[#21409A] flex-1"></div> {/* Biru */}
                            <div className="bg-[#00A651] flex-1"></div> {/* Hijau */}
                            <div className="bg-[#FBBF24] flex-1"></div> {/* Kuning */}
                            <div className="bg-[#ED1C24] flex-1"></div> {/* Merah */}
                        </div>

                        {/* Header Modal */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                            <div>
                                <h2 className="text-lg font-bold text-[#21409A] tracking-tight">Detail Arsip Transaksi</h2>
                                <p className="text-[10px] text-gray-500 font-mono mt-1 px-2 py-0.5 bg-gray-100 rounded-md inline-block border border-gray-200">{selectedTrx.id}</p>
                            </div>
                            <div>
                                {getStatusBadge(selectedTrx.status)}
                            </div>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 overflow-y-auto bg-gray-50 flex-1 custom-scrollbar max-h-[70vh]">

                            {/* Profil Peminjam */}
                            <div className="flex items-center gap-3 mb-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#21409A]/10 to-[#00A651]/10 text-[#21409A] border border-[#21409A]/20 flex items-center justify-center font-black text-lg">{getInitials(selectedTrx.name)}</div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">{selectedTrx.name}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[11px] text-gray-500 font-medium font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                            🆔 NIP: {selectedTrx.nip || '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Peminjaman */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <span className="w-4 h-4 rounded bg-amber-50 text-amber-500 flex items-center justify-center"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></span>
                                        Periode
                                    </p>
                                    <p className="text-xs font-bold text-gray-800">{selectedTrx.dates}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <span className="w-4 h-4 rounded bg-blue-50 text-blue-500 flex items-center justify-center"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></span>
                                        Item Dipinjam
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedTrx.items ? selectedTrx.items.split(',').map((item, i) => (
                                            <span key={i} className="text-[11px] font-bold text-[#21409A] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded flex items-center">{item.trim()}</span>
                                        )) : '-'}
                                    </div>
                                </div>
                            </div>

                            {/* Alasan / Keperluan */}
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${selectedTrx.status === 'ditolak' ? 'bg-[#ED1C24]' : 'bg-[#00A651]'}`}></div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 pl-2">
                                    <span className={`w-4 h-4 rounded flex items-center justify-center ${selectedTrx.status === 'ditolak' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    </span>
                                    {selectedTrx.status === 'ditolak' ? 'Alasan Penolakan' : 'Keperluan Peminjaman'}
                                </p>
                                <p className={`text-xs font-medium leading-relaxed pl-2 ${selectedTrx.status === 'ditolak' ? 'text-[#ED1C24]' : 'text-gray-700'}`}>
                                    {selectedTrx.purpose || '-'}
                                </p>
                            </div>

                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors shadow-sm"
                            >
                                Tutup Arsip
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}