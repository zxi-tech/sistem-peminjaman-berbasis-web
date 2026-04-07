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
                    <div className="flex items-center group cursor-pointer">
                        <img
                            src="/images/pertamina-logo (1).png"
                            alt="Pertamina Geothermal Energy"
                            className="h-10 lg:h-12 object-contain transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/200x50?text=Logo+PGE"; }}
                        />
                    </div>

                    {/* Navigasi Kanan (Menu + Login) */}
                    <div className="hidden lg:flex items-center gap-8 xl:gap-12 text-[16px] font-medium text-gray-800">
                        <Link href={route('dashboard')} className="relative group py-2 text-gray-800 hover:text-[#21409A] transition-colors duration-300">
                            Dashboard
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#21409A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                        </Link>
                        <Link href={route('borrow.create')} className="relative group py-2 text-gray-800 hover:text-[#21409A] transition-colors duration-300">
                            Ajukan Peminjaman
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#21409A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                        </Link>
                        <Link href={route('borrow.status')} className="relative group py-2 text-gray-800 hover:text-[#21409A] transition-colors duration-300">
                            Status
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#21409A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                        </Link>
                        <a href="#contact" className="relative group py-2 text-gray-800 hover:text-[#21409A] transition-colors duration-300">
                            Contact Us
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#21409A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                        </a>

                        {/* Tombol Login */}
                        <div className="ml-2">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="relative inline-flex items-center justify-center px-8 py-2.5 rounded-xl border border-gray-400 bg-transparent font-medium text-gray-800 overflow-hidden group hover:border-[#21409A] hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-[#21409A] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                                    <span className="relative group-hover:text-white transition-colors duration-300">Dashboard</span>
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="relative inline-flex items-center justify-center px-8 py-2.5 rounded-xl border border-gray-400 bg-transparent font-medium text-gray-800 overflow-hidden group hover:border-[#21409A] hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-[#21409A] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                                    <span className="relative group-hover:text-white transition-colors duration-300">Login</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ================= HERO SECTION ================= */}
                <main className="flex-1 w-full max-w-[1536px] mx-auto px-6 lg:px-12 xl:px-20 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center justify-between pb-10 z-10 min-h-[calc(100vh-100px)]">

                    {/* Kolom Kiri: Teks */}
                    <div className="flex flex-col items-start justify-center pb-12 lg:pb-24 z-20 pt-4 lg:pt-0">
                        <h1 className="text-[36px] md:text-[48px] xl:text-[54px] font-semibold text-[#111827] leading-[1.15] tracking-tight">
                            Sistem Manajemen <br className="hidden md:block" />
                            Peminjaman Barang <br className="hidden md:block" />
                            <span className="font-bold block mt-1 md:mt-2 tracking-normal">
                                <span className="text-[#1D7044]">H</span>
                                <span className="text-[#21409A]">S</span>
                                <span className="text-[#F37021]">S</span>
                                <span className="text-[#005B4E]">E</span>
                            </span>
                        </h1>

                        <p className="mt-5 md:mt-6 text-gray-600 text-[15px] xl:text-[16px] max-w-[500px] leading-relaxed">
                            Platform digital terpadu untuk mempermudah pengajuan, persetujuan, dan monitoring peminjaman barang HSSE guna meningkatkan efisiensi dan transparansi pengelolaan aset keselamatan kerja.
                        </p>

                        <div className="mt-8 md:mt-10">
                            <Link
                                href={auth?.user ? route('borrow.create') : route('login')}
                                className="inline-flex items-center justify-center px-8 py-3 bg-[#254294] hover:bg-[#1a2d6b] text-white rounded-xl text-[16px] font-medium shadow-lg shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Ajukan Peminjaman
                            </Link>
                        </div>
                    </div>

                    {/* Kolom Kanan: Gambar & Orbit */}
                    <div className="w-full flex justify-end items-center mt-12 lg:mt-0 relative z-10 overflow-visible">

                        {/* Orbit */}
                        <div className="absolute top-[40%] right-[-19%] w-[130%] opacity-25 z-0 pointer-events-none -translate-y-1/2">
                            <svg viewBox="0 0 600 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                                <ellipse cx="300" cy="175" rx="260" ry="65" transform="rotate(-15 300 175)" stroke="#111827" strokeWidth="2" />
                                <ellipse cx="300" cy="175" rx="260" ry="65" transform="rotate(15 300 175)" stroke="#111827" strokeWidth="2" />
                            </svg>
                        </div>

                        {/* GAMBAR PEKERJA */}
                        <img
                            src="/images/hero-workers.png"
                            alt="Pekerja HSSE Pertamina"
                            className="relative z-10 w-[750px] lg:w-[900px] xl:w-[1000px] max-w-none h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.3)] -translate-y-6 lg:-translate-y-12"
                        />
                    </div>
                </main>
            </div>
        </>
    );
}