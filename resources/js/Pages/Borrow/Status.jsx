import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Status({ auth, transactions }) {
    const user = auth?.user;

    // ================= STATES INTERAKTIVITAS DROPDOWN =================
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    // Menutup dropdown profil jika user klik di luar area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fungsi untuk memberi warna pada badge status
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'menunggu':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'disetujui':
            case 'dipinjam':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ditolak':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'selesai':
            case 'dikembalikan':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'terlambat':
                return 'bg-rose-100 text-rose-700 border-rose-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Helper Inisial Nama
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <>
            <Head title="Status Peminjaman" />

            <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 text-gray-800 selection:bg-[#21409A] selection:text-white">

                {/* ================= NAVBAR TRANSPARAN (SEPERTI BERANDA) ================= */}
                <nav className="w-full max-w-[1536px] mx-auto flex items-center justify-between px-6 lg:px-12 xl:px-20 py-8 z-50 bg-transparent">

                    {/* ZONA 1: Logo Kiri */}
                    <div className="flex items-center group cursor-pointer w-full lg:w-1/4 shrink-0">
                        <img
                            src="/images/pertamina-logo (1).png"
                            alt="Pertamina Geothermal Energy"
                            className="h-10 lg:h-12 object-contain transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/200x50?text=Logo+PGE"; }}
                        />
                    </div>

                    {/* ZONA 2: Navigasi (Tengah) */}
                    <div className="hidden lg:flex flex-1 items-center justify-center gap-8 xl:gap-12 text-[14px] font-bold text-gray-600">
                        <Link
                            href={auth?.user?.role === 'admin' ? route('dashboard') : '/'}
                            className="relative group py-2 hover:text-[#21409A] transition-colors duration-300"
                        >
                            {auth?.user?.role === 'admin' ? 'Dashboard' : 'Beranda'}
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#21409A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                        </Link>

                        <Link href={route('borrow.create')} className="relative group py-2 hover:text-[#21409A] transition-colors duration-300">
                            Ajukan Peminjaman
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#21409A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                        </Link>

                        <Link href={route('borrow.status')} className="relative group py-2 hover:text-[#21409A] transition-colors duration-300">
                            Status
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#21409A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                        </Link>

                        <a href="#contact" className="relative group py-2 hover:text-[#21409A] transition-colors duration-300">
                            Contact Us
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#21409A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                        </a>
                    </div>

                    {/* ZONA 3: Profil & Login (Kanan) */}
                    <div className="flex items-center justify-end w-full lg:w-1/4 shrink-0">
                        {auth?.user ? (
                            <div className="relative shrink-0" ref={profileMenuRef}>
                                <div
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className={`flex items-center space-x-3 cursor-pointer p-1.5 rounded-xl transition-all duration-200 border ${isProfileMenuOpen ? 'bg-white border-gray-200 shadow-sm' : 'border-transparent hover:bg-white/60 hover:border-gray-200'}`}
                                >
                                    <div className="relative">
                                        <div className="h-10 w-10 rounded-full bg-[#00A651] flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm overflow-hidden">
                                            {user?.photo ? (
                                                <img
                                                    src={`/storage/${user.photo}`}
                                                    alt={user?.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <span className={`w-full h-full flex items-center justify-center ${user?.photo ? 'hidden' : ''}`}>
                                                {getInitials(user?.name)}
                                            </span>
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    <div className="hidden md:flex flex-col text-left">
                                        <span className="text-[14px] font-bold text-gray-800 leading-tight">{user?.name || 'HSSE'}</span>
                                        <span className="text-[11px] text-[#21409A] font-semibold capitalize leading-tight">{user?.department || 'Departemen'}</span>
                                    </div>
                                    <svg className={`w-4 h-4 text-gray-500 ml-1 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>

                                {/* Isi Dropdown Profil */}
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Masuk sebagai</p>
                                            <p className="text-sm font-bold text-gray-900 truncate">{user?.email || 'user@pertamina.com'}</p>
                                        </div>

                                        <div className="py-2">
                                            <Link href={route('profile.edit')} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#21409A] transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                Edit Profil
                                            </Link>

                                            {/* Tombol Dashboard khusus Admin */}
                                            {user?.role === 'admin' && (
                                                <Link href={route('dashboard')} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#21409A] transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                                    Dashboard Admin
                                                </Link>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-50 pt-1 mt-1">
                                            <Link href={route('logout')} method="post" as="button" className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                                Keluar (Logout)
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href={route('login')}
                                className="relative inline-flex items-center justify-center px-8 py-2.5 rounded-xl border border-[#21409A] bg-transparent font-medium text-[#21409A] overflow-hidden group hover:border-[#21409A] hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
                            >
                                <span className="absolute inset-0 w-full h-full bg-[#21409A] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                                <span className="relative group-hover:text-white transition-colors duration-300">Login</span>
                            </Link>
                        )}
                    </div>
                </nav>

                {/* ================= KONTEN UTAMA ================= */}
                <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-10">

                    <div className="mb-8 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#21409A] text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            MONITORING
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Riwayat & Status Peminjaman</h1>
                        <p className="text-sm text-gray-500 leading-relaxed">Pantau status pengajuan APD Anda di sini. Pengajuan yang disetujui dapat segera diambil di ruang admin HSSE.</p>
                    </div>

                    <div className="space-y-4">
                        {transactions && transactions.length > 0 ? (
                            transactions.map((trx, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">

                                    <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
                                                <span className="text-xs font-extrabold text-gray-700">TRX-{new Date(trx.created_at || new Date()).getFullYear()}{String(trx.id || trx.raw_id || 0).padStart(3, '0')}</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                {trx.start_date || (trx.dates ? trx.dates.split(' - ')[0] : '-')}
                                            </span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider text-center ${getStatusStyle(trx.status)}`}>
                                            {trx.status}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-4">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Barang yang dipinjam:</h4>
                                            <p className="text-sm font-bold text-gray-800 leading-relaxed">
                                                {trx.items || (trx.details ? trx.details.map(d => `${d.itemSize?.item?.name || 'Barang'} (x${d.quantity})`).join(', ') : 'Tidak ada detail barang')}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Tujuan Peminjaman:</h4>
                                            <p className="text-sm font-medium text-gray-600">{trx.purpose}</p>
                                        </div>

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
                            <div className="bg-white rounded-[24px] shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center animate-in fade-in duration-500">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                                    <svg className="w-10 h-10 text-[#21409A]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">Belum Ada Pengajuan</h3>
                                <p className="text-sm text-gray-500 mb-6">Anda belum pernah melakukan pengajuan peminjaman barang HSSE ke sistem.</p>
                                <Link href={route('borrow.create')} className="bg-[#21409A] hover:bg-[#1a3380] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
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