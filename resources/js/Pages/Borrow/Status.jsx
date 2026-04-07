import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Status({ auth, transactions }) {

    // Fungsi untuk memberi warna pada badge status
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'menunggu':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'disetujui':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ditolak':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'selesai':
            case 'dikembalikan':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <>
            <Head title="Status Peminjaman" />

            <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 text-gray-800 selection:bg-[#00A651] selection:text-white">

                {/* ================= NAVBAR ================= */}
                <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <img
                                src="/images/logo-pertamina-pge.png"
                                alt="Logo PGE"
                                className="h-8 object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/150x40/ffffff/00A651?text=Logo+PGE";
                                }}
                            />
                        </div>

                        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
                            {auth?.user?.role === 'admin' && (
                                <Link href={route('dashboard')} className="hover:text-[#00A651] transition-colors">
                                    Dashboard Admin
                                </Link>
                            )}
                            <Link href={route('borrow.create')} className="hover:text-[#00A651] transition-colors">
                                Ajukan Peminjaman
                            </Link>
                            <Link href={route('borrow.status')} className="text-[#00A651] border-b-2 border-[#00A651] pb-1">
                                Status Peminjaman
                            </Link>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            {auth?.user ? (
                                <>
                                    <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                                        <div className="w-8 h-8 rounded-full bg-[#00A651] flex items-center justify-center text-white font-bold text-xs shadow-inner">
                                            {auth.user.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 hidden sm:block pr-2">
                                            {auth.user.name}
                                        </span>
                                    </div>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-colors border border-transparent hover:border-red-100"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span className="hidden sm:block">Keluar</span>
                                    </Link>
                                </>
                            ) : (
                                <Link href={route('login')} className="text-sm font-semibold text-[#00A651] border border-[#00A651] px-4 py-2 rounded-full hover:bg-[#00A651] hover:text-white transition-colors">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ================= KONTEN UTAMA ================= */}
                <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-10">

                    <div className="mb-8 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 bg-[#E6F6ED] text-[#00A651] text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            MONITORING
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Riwayat & Status Peminjaman</h1>
                        <p className="text-sm text-gray-500 leading-relaxed">Pantau status pengajuan APD Anda di sini. Pengajuan yang disetujui dapat segera diambil di ruang admin HSSE.</p>
                    </div>

                    <div className="space-y-4">
                        {transactions && transactions.length > 0 ? (
                            transactions.map((trx, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Header Card */}
                                    <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
                                                <span className="text-xs font-extrabold text-gray-700">{trx.id}</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                {trx.dates}
                                            </span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider text-center ${getStatusStyle(trx.status)}`}>
                                            {trx.status}
                                        </div>
                                    </div>

                                    {/* Body Card */}
                                    <div className="p-6">
                                        <div className="mb-4">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Barang yang dipinjam:</h4>
                                            <p className="text-sm font-bold text-gray-800 leading-relaxed">{trx.items || 'Tidak ada detail barang'}</p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Tujuan Peminjaman:</h4>
                                            <p className="text-sm font-medium text-gray-600">{trx.purpose}</p>
                                        </div>

                                        {/* Jika ditolak dan ada catatan dari admin */}
                                        {trx.status === 'ditolak' && trx.notes && (
                                            <div className="mt-4 bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                                                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                <div>
                                                    <h4 className="text-xs font-bold text-red-800 uppercase tracking-wide mb-0.5">Alasan Penolakan:</h4>
                                                    <p className="text-sm font-medium text-red-600">{trx.notes}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">Belum Ada Pengajuan</h3>
                                <p className="text-sm text-gray-500 mb-6">Anda belum pernah melakukan pengajuan peminjaman barang HSSE.</p>
                                <Link href={route('borrow.create')} className="bg-[#00A651] hover:bg-[#008c44] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all">
                                    Ajukan Peminjaman Baru
                                </Link>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </>
    );
}