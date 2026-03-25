import React from 'react';
import { Link } from '@inertiajs/react';

export default function AdminLayout({ user, children }) {

    // Fungsi untuk mengecek halaman yang sedang aktif
    const isRouteActive = (pattern) => route().current(pattern);

    return (
        <div className="flex h-screen bg-[#F4F5FA] font-sans text-gray-800 overflow-hidden">

            {/* ================= SIDEBAR (KIRI) ================= */}
            <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col z-20 flex-shrink-0 transition-all duration-300">

                {/* Area Logo & Toggle Icon */}
                <div className="h-[72px] flex items-center justify-between px-6 border-b border-transparent">
                    <img
                        src="/images/logo-pertamina-pge.png"
                        alt="PGE Logo"
                        className="h-8 object-contain"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/120x30?text=Logo+PGE"; }}
                    />
                    {/* Ikon Collapse (<<) seperti di template */}
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                    </button>
                </div>

                {/* Navigasi Menu */}
                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">

                    {/* Kategori Menu (APPS & PAGES) */}
                    <div className="px-3 pt-4 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Main Menu
                    </div>

                    <Link
                        href={route('dashboard')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isRouteActive('dashboard') ? 'bg-[#00A651] text-white shadow-md shadow-[#00A651]/30' : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        Dashboard
                    </Link>

                    <Link
                        href={route('users.index')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-all duration-200"
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        Manajemen User
                    </Link>

                    <Link
                        href={route('items.index')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isRouteActive('items.*') ? 'bg-[#00A651] text-white shadow-md shadow-[#00A651]/30' : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        Manajemen Barang
                    </Link>

                    <Link
                        href={route('transactions.index')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isRouteActive('transactions.*') ? 'bg-[#00A651] text-white shadow-md shadow-[#00A651]/30' : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        Daftar Peminjaman
                    </Link>

                    <Link
                        href={route('history.index')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 ${isRouteActive('history.*') ? 'bg-[#00A651] text-white shadow-md shadow-[#00A651]/30' : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}`}
                    >
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Riwayat
                    </Link>

                </nav>

                {/* Area Logout */}
                <div className="p-4 border-t border-gray-100">
                    <Link href={route('logout')} method="post" as="button" className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-[14px] font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Logout
                    </Link>
                </div>
            </aside>

            {/* ================= AREA KANAN (HEADER + KONTEN + FOOTER) ================= */}
            <div className="flex-1 flex flex-col overflow-hidden relative">

                {/* Header Top Ala Template Premium */}
                <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10 flex-shrink-0">

                    {/* Kiri: Mockup Search Bar */}
                    <div className="flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <span className="text-[15px] font-medium">Search (Ctrl+/)</span>
                    </div>

                    {/* Kanan: Icons & Profile */}
                    <div className="flex items-center space-x-6">

                        {/* Kumpulan Ikon Mockup (Translate, Dark Mode, Notification) */}
                        <div className="hidden sm:flex items-center space-x-4 text-gray-500">
                            <button className="hover:text-gray-800 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg></button>
                            <button className="hover:text-gray-800 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg></button>
                            <button className="hover:text-gray-800 transition-colors relative">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                        </div>

                        {/* Garis Pembatas Vertikal */}
                        <div className="hidden sm:block w-px h-6 bg-gray-200"></div>

                        {/* Profil */}
                        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                            <div className="relative">
                                <img src="https://ui-avatars.com/api/?name=HSSE+Admin&background=F3F4F6&color=374151" alt="Profile" className="h-9 w-9 rounded-full object-cover border border-gray-200" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div className="hidden md:flex flex-col text-left">
                                <span className="text-[13px] font-bold text-gray-800 leading-tight">{user?.name || 'HSSE'}</span>
                                <span className="text-[11px] text-gray-500 capitalize leading-tight">{user?.role || 'Admin'}</span>
                            </div>
                        </div>

                    </div>
                </header>

                {/* Main Content Area: Diubah menjadi flex-col agar footer selalu di bawah */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F4F5FA] flex flex-col">

                    {/* Wadah Konten Utama */}
                    <div className="flex-1 p-6 lg:p-8">
                        {children}
                    </div>

                    {/* ================= FOOTER AREA ================= */}
                    <footer className="mt-auto flex-shrink-0 bg-[#F4F5FA]">

                        {/* Teks Copyright & Link */}
                        <div className="px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center text-[13px] text-gray-500 font-medium">
                            <div>
                                © 2026, Sistem Peminjaman HSSE - PT Pertamina Geothermal Energy Tbk.
                            </div>
                            <div className="flex space-x-4 mt-2 md:mt-0 text-[#21409A]">
                                <a href="#" className="hover:underline">License</a>
                                <a href="#" className="hover:underline">Documentation</a>
                                <a href="#" className="hover:underline">Support</a>
                            </div>
                        </div>

                        {/* Garis Multi-Warna di Ujung Bawah */}
                        <div className="h-1.5 flex w-full">
                            <div className="bg-[#21409A] flex-1"></div> {/* Biru Pertamina */}
                            <div className="bg-[#ED1C24] flex-1"></div> {/* Merah Pertamina */}
                            <div className="bg-[#FBBF24] flex-1"></div> {/* Kuning / Gold */}
                        </div>
                    </footer>
                </main>

            </div>
        </div>
    );
}