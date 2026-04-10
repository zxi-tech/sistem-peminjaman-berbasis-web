import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ user, children }) {
    // ================= STATES INTERAKTIVITAS =================
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    // 👇 TANGKAP DATA GLOBAL DARI LARAVEL DI SINI 👇
    const { unread_messages_count } = usePage().props;

    // Fungsi untuk mengecek halaman yang sedang aktif
    const isRouteActive = (pattern) => route().current(pattern);

    // Fungsi untuk menutup dropdown profil jika user klik di luar area dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fungsi untuk fitur yang belum jadi (Dummy)
    const handleComingSoon = (featureName) => {
        alert(`Fitur ${featureName} saat ini sedang dalam tahap pengembangan. Segera Hadir! 🚀`);
    };

    return (
        <div className="flex h-screen bg-[#F4F5FA] font-sans text-gray-800 overflow-hidden">

            {/* ================= SIDEBAR (KIRI) ================= */}
            <aside className={`${isSidebarCollapsed ? 'w-[80px]' : 'w-[260px]'} bg-white border-r border-gray-100 flex flex-col z-20 flex-shrink-0 transition-all duration-300 ease-in-out`}>

                {/* Area Logo & Toggle Icon */}
                <div className="h-[72px] flex items-center justify-between px-4 border-b border-transparent overflow-hidden">
                    <img
                        src="/images/pertamina-logo (1).png"
                        alt="PGE Logo"
                        className={`h-12 object-contain transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/120x30?text=Logo+PGE"; }}
                    />

                    {/* Ikon Collapse yang kini BERFUNGSI */}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className={`text-gray-400 hover:text-[#00A651] transition-all p-2 rounded-lg hover:bg-gray-50 flex-shrink-0 ${isSidebarCollapsed ? 'mx-auto rotate-180' : ''}`}
                        title={isSidebarCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                    </button>
                </div>

                {/* Navigasi Menu */}
                <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">

                    {/* Kategori Menu (Sembunyi saat dilipat) */}
                    <div className={`px-3 pt-4 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest transition-opacity duration-300 ${isSidebarCollapsed ? 'opacity-0 h-0 p-0 overflow-hidden' : 'opacity-100'}`}>
                        Main Menu
                    </div>

                    <Link
                        href={route('dashboard')}
                        title="Dashboard"
                        className={`flex items-center gap-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3'} ${isRouteActive('dashboard') ? 'bg-[#00A651] text-white shadow-md shadow-[#00A651]/30' : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        {!isSidebarCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
                    </Link>

                    <Link
                        href={route('users.index')}
                        title="Manajemen User"
                        className={`flex items-center gap-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3'} ${isRouteActive('users.*') ? 'bg-[#00A651] text-white shadow-md shadow-[#00A651]/30' : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        {!isSidebarCollapsed && <span className="whitespace-nowrap">Manajemen User</span>}
                    </Link>

                    <Link
                        href={route('items.index')}
                        title="Manajemen Barang"
                        className={`flex items-center gap-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3'} ${isRouteActive('items.*') ? 'bg-[#00A651] text-white shadow-md shadow-[#00A651]/30' : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        {!isSidebarCollapsed && <span className="whitespace-nowrap">Manajemen Barang</span>}
                    </Link>

                    <Link
                        href={route('transactions.index')}
                        title="Daftar Peminjaman"
                        className={`flex items-center gap-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3'} ${isRouteActive('transactions.*') ? 'bg-[#00A651] text-white shadow-md shadow-[#00A651]/30' : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        {!isSidebarCollapsed && <span className="whitespace-nowrap">Daftar Peminjaman</span>}
                    </Link>

                    <Link
                        href={route('history.index')}
                        title="Riwayat"
                        className={`flex items-center gap-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3'} ${isRouteActive('history.*') ? 'bg-[#00A651] text-white shadow-md shadow-[#00A651]/30' : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {!isSidebarCollapsed && <span className="whitespace-nowrap">Riwayat</span>}
                    </Link>

                    {/* 👇 MENU PESAN MASUK DENGAN NOTIFIKASI DINAMIS 👇 */}
                    <Link
                        href={route('messages.index')}
                        title="Pesan Masuk"
                        // DIPERBAIKI: justify-between hanya aktif saat sidebar TERBUKA (px-3), berubah jadi justify-center saat DILIPAT (px-0)
                        className={`flex items-center py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3'} ${isRouteActive('messages.*') ? 'bg-[#00A651] text-white shadow-md shadow-[#00A651]/30' : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative shrink-0 flex items-center justify-center">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>

                                {/* Badge Notifikasi ketika Sidebar dilipat (Collapsed) */}
                                {isSidebarCollapsed && unread_messages_count > 0 && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </div>
                            {!isSidebarCollapsed && <span className="whitespace-nowrap">Pesan Masuk</span>}
                        </div>

                        {/* Angka Notifikasi ketika Sidebar terbuka lebar */}
                        {!isSidebarCollapsed && unread_messages_count > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                {unread_messages_count > 99 ? '99+' : unread_messages_count}
                            </span>
                        )}
                    </Link>
                    {/* 👆 ======================= 👆 */}

                </nav>

                {/* Area Logout */}
                <div className={`p-4 border-t border-gray-100 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        title="Logout"
                        className={`flex items-center gap-3 w-full text-left py-2.5 rounded-lg text-[14px] font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        {!isSidebarCollapsed && <span className="whitespace-nowrap">Logout</span>}
                    </Link>
                </div>
            </aside>

            {/* ================= AREA KANAN (HEADER + KONTEN + FOOTER) ================= */}
            <div className="flex-1 flex flex-col overflow-hidden relative">

                {/* Header Top Ala Template Premium */}
                <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10 flex-shrink-0">

                    {/* Kiri: Mockup Search Bar */}
                    <div
                        onClick={() => handleComingSoon("Pencarian Global (Ctrl+/)")}
                        className="flex items-center text-gray-400 hover:text-[#00A651] cursor-pointer transition-colors p-2 -ml-2 rounded-lg"
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <span className="text-[15px] font-medium">Search (Ctrl+/)</span>
                    </div>

                    {/* Kanan: Icons & Profile */}
                    <div className="flex items-center space-x-6">

                        {/* Kumpulan Ikon Mockup */}
                        <div className="hidden sm:flex items-center space-x-4 text-gray-500">
                            <button onClick={() => handleComingSoon("Terjemahan (Translate)")} className="hover:text-[#00A651] transition-colors p-1.5 rounded-lg hover:bg-green-50" title="Translate">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                            </button>
                            <button onClick={() => handleComingSoon("Mode Gelap (Dark Mode)")} className="hover:text-[#00A651] transition-colors p-1.5 rounded-lg hover:bg-green-50" title="Dark Mode">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                            </button>

                            {/* Ikon Lonceng Notifikasi yang juga menyala kalau ada pesan masuk */}
                            <button onClick={() => router.get(route('messages.index'))} className="hover:text-[#00A651] transition-colors relative p-1.5 rounded-lg hover:bg-green-50" title="Notifikasi Pesan">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                {unread_messages_count > 0 && (
                                    <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>
                        </div>

                        {/* Garis Pembatas Vertikal */}
                        <div className="hidden sm:block w-px h-6 bg-gray-200"></div>

                        {/* ================= DROPDOWN PROFIL AKTIF ================= */}
                        <div className="relative" ref={profileMenuRef}>
                            <div
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className={`flex items-center space-x-3 cursor-pointer p-1.5 rounded-lg transition-colors ${isProfileMenuOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            >
                                <div className="relative">
                                    <div className="h-9 w-9 rounded-full bg-[#00A651] flex items-center justify-center text-white font-bold text-xs border border-gray-200 overflow-hidden shadow-sm">
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
                                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div className="hidden md:flex flex-col text-left">
                                    <span className="text-[13px] font-bold text-gray-800 leading-tight">{user?.name || 'HSSE'}</span>
                                    <span className="text-[11px] text-gray-500 capitalize leading-tight">{user?.role || 'Admin'}</span>
                                </div>
                                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>

                            {/* Isi Dropdown Profil */}
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-50">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Masuk sebagai</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{user?.email || 'admin@pge.com'}</p>
                                    </div>

                                    <div className="py-1">
                                        <Link href={route('profile.edit')} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#00A651] transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            Edit Profil
                                        </Link>
                                    </div>

                                    <div className="border-t border-gray-50 pt-1 mt-1">
                                        <Link href={route('logout')} method="post" as="button" className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                            Keluar (Logout)
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F4F5FA] flex flex-col">
                    <div className="flex-1 p-6 lg:p-8">
                        {children}
                    </div>

                    {/* ================= FOOTER AREA ================= */}
                    <footer className="mt-auto flex-shrink-0 bg-[#F4F5FA]">
                        <div className="px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center text-[13px] text-gray-500 font-medium">
                            <div>
                                © 2026, Sistem Peminjaman HSSE - PT Pertamina Geothermal Energy Tbk.
                            </div>
                            <div className="flex space-x-4 mt-2 md:mt-0 text-[#21409A]">
                                <a href="#" onClick={(e) => { e.preventDefault(); handleComingSoon("Lisensi"); }} className="hover:underline">License</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleComingSoon("Dokumentasi"); }} className="hover:underline">Documentation</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); handleComingSoon("Bantuan Support"); }} className="hover:underline">Support</a>
                            </div>
                        </div>

                        <div className="h-1.5 flex w-full">
                            <div className="bg-[#21409A] flex-1"></div>
                            <div className="bg-[#ED1C24] flex-1"></div>
                            <div className="bg-[#FBBF24] flex-1"></div>
                        </div>
                    </footer>
                </main>

            </div>
        </div>
    );
}