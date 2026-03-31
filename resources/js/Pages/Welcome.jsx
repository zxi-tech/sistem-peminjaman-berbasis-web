import React from 'react';
import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Sistem Peminjaman HSSE - PGE" />

            {/* Container */}
            <div className="min-h-screen bg-[#F4F7FF] font-sans text-gray-900 overflow-x-hidden flex flex-col selection:bg-[#21409A] selection:text-white antialiased">

                {/* Navbar */}
                <nav className="w-full max-w-[1536px] mx-auto flex items-center justify-between px-6 lg:px-12 xl:px-20 py-8 z-50">
                    {/* Logo Kiri */}
                    <div className="flex items-center">
                        <img
                            src="/images/logo-pertamina-pge.png"
                            alt="Pertamina Geothermal Energy"
                            className="h-10 lg:h-12 object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/200x50?text=Logo+PGE"; }}
                        />
                    </div>

                    {/* Navigasi Kanan (Menu + Login) */}
                    <div className="hidden lg:flex items-center gap-8 xl:gap-12 text-[16px] font-medium text-gray-800">
                        <Link href={route('dashboard')} className="hover:text-[#21409A] transition-colors">Dashboard</Link>
                        <Link href={route('borrow.create')} className="hover:text-[#21409A] transition-colors">Ajukan Peminjaman</Link>
                        <Link href={route('borrow.status')} className="hover:text-[#21409A] transition-colors">Status</Link>
                        <a href="#contact" className="hover:text-[#21409A] transition-colors">Contact Us</a>

                        {/* Tombol Login */}
                        <div className="ml-2">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-8 py-2.5 rounded-xl border border-gray-400 bg-transparent font-medium hover:bg-gray-100 transition-all duration-300"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="px-8 py-2.5 rounded-xl border border-gray-400 bg-transparent font-medium hover:bg-white transition-all duration-300"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="flex-1 w-full max-w-[1536px] mx-auto px-6 lg:px-12 xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-between pb-16 z-10">

                    {/* Kolom Kiri: Teks */}
                    <div className="flex flex-col items-start justify-center h-full pt-4 lg:pt-0">
                        <h1 className="text-[44px] md:text-[56px] xl:text-[68px] font-semibold text-[#111827] leading-[1.15] tracking-tight">
                            Sistem Manajemen <br className="hidden md:block" />
                            Peminjaman Barang <br className="hidden md:block" />
                            <span className="font-bold block mt-2 tracking-normal">
                                <span className="text-[#1D7044]">H</span>
                                <span className="text-[#21409A]">S</span>
                                <span className="text-[#F37021]">S</span>
                                <span className="text-[#005B4E]">E</span>
                            </span>
                        </h1>

                        <p className="mt-8 text-gray-600 text-[17px] xl:text-[19px] max-w-[560px] leading-relaxed">
                            Platform digital terpadu untuk mempermudah pengajuan, persetujuan, dan monitoring peminjaman barang HSSE guna meningkatkan efisiensi dan transparansi pengelolaan aset keselamatan kerja.
                        </p>

                        <div className="mt-10 lg:mt-12">
                            <Link
                                href={auth?.user ? route('borrow.create') : route('login')}
                                className="inline-flex items-center justify-center px-10 py-3.5 bg-[#254294] hover:bg-[#1a2d6b] text-white rounded-xl text-[18px] font-medium shadow-md shadow-blue-900/20 transition-transform duration-300 transform hover:-translate-y-1"
                            >
                                Ajukan Peminjaman
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:block relative w-full h-full">
                        <img
                            src="/images/hero-workers.png"
                            alt="Pekerja HSSE Pertamina"
                            className="absolute bottom-0 right-0 
                                        w-[1200px] xl:w-[1350px] 2xl:w-[1500px]
                                        object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/800x600/E2E8F0/64748B?text=Hero+Image";
                            }}
                        />
                    </div>
                </main>
            </div>
        </>
    );
}