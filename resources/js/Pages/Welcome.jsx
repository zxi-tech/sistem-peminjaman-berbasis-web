import React from 'react';
import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Sistem Peminjaman HSSE - PGE" />

            {/* Background utama menggunakan warna biru sangat muda seperti di desain */}
            <div className="min-h-screen bg-[#F4F7FF] font-sans overflow-x-hidden selection:bg-[#21409A] selection:text-white">

                {/* ================= NAVBAR ================= */}
                <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">

                    {/* Logo Kiri */}
                    <div className="flex items-center">
                        <img
                            src="/images/logo-pertamina-pge.png"
                            alt="Pertamina Geothermal Energy"
                            className="h-10 object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150x40?text=Logo+PGE"; }}
                        />
                    </div>

                    {/* Menu Navigasi Tengah */}
                    <div className="hidden lg:flex items-center space-x-10 text-[15px] font-medium text-gray-800">
                        {/* Jika admin, tampilkan link dashboard */}
                        {auth?.user?.role === 'admin' && (
                            <Link href={route('dashboard')} className="hover:text-[#21409A] transition-colors">Dashboard Admin</Link>
                        )}
                        <Link href={route('borrow.create')} className="hover:text-[#21409A] transition-colors">Ajukan Peminjaman</Link>
                        <Link href={route('borrow.status')} className="hover:text-[#21409A] transition-colors">Status</Link>
                    </div>

                    {/* Tombol Kanan (Login / Dashboard) */}
                    <div className="flex items-center">
                        {auth?.user ? (
                            // Jika SUDAH LOGIN, cek apakah dia Admin atau Pekerja
                            auth.user.role === 'admin' ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-7 py-2.5 bg-[#00A651] text-white rounded-[12px] text-sm font-bold hover:bg-[#008c44] shadow-md transition-all duration-300"
                                >
                                    Ruang Admin
                                </Link>
                            ) : (
                                <Link
                                    href={route('borrow.create')}
                                    className="px-7 py-2.5 bg-[#21409A] text-white rounded-[12px] text-sm font-bold hover:bg-[#1a3380] shadow-md transition-all duration-300"
                                >
                                    Mulai Pinjam
                                </Link>
                            )
                        ) : (
                            // Jika BELUM LOGIN, tampilkan tombol Login
                            <Link
                                href={route('login')}
                                className="px-8 py-2.5 border border-gray-800 rounded-[12px] text-[15px] font-bold hover:bg-gray-900 hover:text-white transition-all duration-300"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </nav>

                {/* ================= HERO SECTION ================= */}
                <main className="max-w-7xl mx-auto px-8 pt-12 pb-24 lg:pt-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

                    {/* Kolom Kiri: Teks & Tombol Action */}
                    <div className="flex-1 text-center lg:text-left z-10">
                        <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-gray-900 leading-[1.15] tracking-tight">
                            Sistem Manajemen <br className="hidden lg:block" />
                            Peminjaman Barang <br className="hidden lg:block" />
                            {/* Mewarnai huruf HSSE sesuai panduan identitas */}
                            <span className="text-[#1D7044]">H</span>
                            <span className="text-[#F37021]">S</span>
                            <span className="text-[#21409A]">S</span>
                            <span className="text-[#005B4E]">E</span>
                        </h1>

                        <p className="mt-6 text-gray-600 text-lg sm:text-[17px] max-w-lg leading-relaxed mx-auto lg:mx-0 font-medium">
                            Platform digital terpadu untuk mempermudah pengajuan, persetujuan, dan monitoring peminjaman barang HSSE guna meningkatkan efisiensi dan transparansi pengelolaan aset keselamatan kerja.
                        </p>

                        <div className="mt-10">
                            {/* Tombol Utama Hero */}
                            <Link
                                href={auth?.user ? route('borrow.create') : route('login')}
                                className="inline-block px-8 py-4 bg-[#243A88] hover:bg-[#1a2b6b] text-white rounded-xl text-[15px] font-bold shadow-xl shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {auth?.user ? 'Buat Pengajuan Baru' : 'Login untuk Mengajukan'}
                            </Link>
                        </div>
                    </div>

                    {/* Kolom Kanan: Gambar Ilustrasi Pekerja */}
                    <div className="flex-1 relative w-full flex justify-center lg:justify-end mt-10 lg:mt-0">
                        <img
                            src="/images/hero-workers.png"
                            alt="Pekerja HSSE Pertamina Geothermal Energy"
                            className="w-full max-w-[600px] object-contain relative z-10 drop-shadow-2xl"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/600x500/E2E8F0/64748B?text=Export+Gambar+Pekerja+dari+Figma+(PNG+Transparan)";
                            }}
                        />
                    </div>

                </main>
            </div>
        </>
    );
}