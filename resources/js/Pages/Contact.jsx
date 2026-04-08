import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Contact({ auth }) {
    const user = auth?.user;

    // ================= STATES INTERAKTIVITAS DROPDOWN =================
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Helper Inisial Nama
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // ================= FORM LOGIC =================
    const { data, setData, post, processing, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: '',
    });

    const [isSent, setIsSent] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        // Simulasi pengiriman pesan (Nanti bisa disambungkan ke controller Laravel)
        setIsSent(true);
        reset('subject', 'message');
        setTimeout(() => setIsSent(false), 5000);
    };

    return (
        <>
            <Head title="Contact Us" />

            <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-gray-800 selection:bg-[#21409A] selection:text-white">

                {/* ================= NAVBAR ================= */}
                <nav className="w-full max-w-[1536px] mx-auto flex items-center justify-between px-6 lg:px-12 xl:px-20 py-8 z-40 bg-transparent shrink-0">
                    <div className="flex items-center group cursor-pointer w-full lg:w-1/4 shrink-0">
                        <img src="/images/pertamina-logo (1).png" alt="PGE" className="h-10 lg:h-12 object-contain transition-all duration-500 ease-out group-hover:scale-105" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/200x50?text=Logo+PGE"; }} />
                    </div>

                    <div className="hidden lg:flex flex-1 items-center justify-center gap-8 xl:gap-12 text-[14px] font-bold text-gray-600">
                        <Link href={auth?.user?.role === 'admin' ? route('dashboard') : '/'} className="relative group py-2 hover:text-[#21409A] transition-colors duration-300">
                            {auth?.user?.role === 'admin' ? 'Dashboard' : 'Beranda'}
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#21409A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                        </Link>
                        <Link href={route('borrow.create')} className="relative group py-2 hover:text-[#21409A] transition-colors duration-300">Ajukan Peminjaman<span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#21409A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span></Link>
                        <Link href={route('borrow.status')} className="relative group py-2 hover:text-[#21409A] transition-colors duration-300">Status<span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#21409A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span></Link>

                        {/* 👇 CONTACT US (AKTIF) 👇 */}
                        <Link href={route('contact')} className="relative group py-2 text-[#21409A] hover:text-[#21409A] transition-colors duration-300">
                            Contact Us
                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#21409A] scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                        </Link>
                    </div>

                    <div className="flex items-center justify-end w-full lg:w-1/4 shrink-0">
                        {auth?.user ? (
                            <div className="relative shrink-0" ref={profileMenuRef}>
                                <div onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className={`flex items-center space-x-3 cursor-pointer p-1.5 rounded-xl transition-all duration-200 border ${isProfileMenuOpen ? 'bg-white border-gray-200 shadow-sm' : 'border-transparent hover:bg-white hover:shadow-sm hover:border-gray-200'}`}>
                                    <div className="relative">
                                        <div className="h-10 w-10 rounded-full bg-[#00A651] flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm overflow-hidden">
                                            {user?.photo ? (<img src={`/storage/${user.photo}`} alt={user?.name} className="w-full h-full object-cover" />) : (<span>{getInitials(user?.name)}</span>)}
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    <div className="hidden md:flex flex-col text-left">
                                        <span className="text-[14px] font-bold text-gray-800 leading-tight">{user?.name || 'HSSE'}</span>
                                        <span className="text-[11px] text-[#21409A] font-semibold capitalize leading-tight">{user?.department || 'Departemen'}</span>
                                    </div>
                                    <svg className={`w-4 h-4 text-gray-500 ml-1 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Masuk sebagai</p>
                                            <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link href={route('profile.edit')} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#21409A]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>Edit Profil</Link>
                                        </div>
                                        <div className="border-t border-gray-50 pt-1 mt-1">
                                            <Link href={route('logout')} method="post" as="button" className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>Keluar</Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href={route('login')} className="relative inline-flex items-center justify-center px-8 py-2.5 rounded-xl border border-[#21409A] bg-transparent font-medium text-[#21409A] overflow-hidden group hover:border-[#21409A] hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
                                <span className="absolute inset-0 w-full h-full bg-[#21409A] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                                <span className="relative group-hover:text-white transition-colors duration-300">Login</span>
                            </Link>
                        )}
                    </div>
                </nav>

                {/* ================= KONTEN UTAMA ================= */}
                <main className="flex-grow max-w-[1440px] mx-auto px-6 lg:px-12 xl:px-20 mt-6 mb-20 w-full">

                    {/* Header Text */}
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 mb-3 tracking-tight">Hubungi Kami</h1>
                        <p className="text-sm text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
                            Punya pertanyaan seputar peminjaman APD atau kendala pada sistem HSSE? Jangan ragu untuk menghubungi tim admin kami.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

                        {/* Area Kiri: Info Kontak */}
                        <div className="lg:col-span-5 space-y-6">

                            {/* Kartu Alamat Utama */}
                            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:border-blue-100 transition-colors group">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#21409A] transition-colors">
                                    <svg className="w-6 h-6 text-[#21409A] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-2">Kantor Pusat</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    Grha Pertamina, Gedung Pertamax Lt. 10<br />
                                    Jl. Medan Merdeka Timur No. 11-13<br />
                                    Jakarta Pusat 10110, Indonesia
                                </p>
                            </div>

                            {/* GRID 2x2 UNTUK WA & EMAIL */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* WA 1 - Operasional */}
                                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm hover:border-green-300 hover:shadow-md transition-all group block">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#00A651] transition-colors">
                                        <svg className="w-5 h-5 text-[#00A651] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    </div>
                                    <h3 className="text-[13px] font-bold text-gray-900 mb-1">WA HSSE (Admin)</h3>
                                    <p className="text-xs text-gray-500 font-medium">+62 812-3456-7890</p>
                                </a>

                                {/* Email 1 - Operasional */}
                                <a href="mailto:hsse.support@pge.com" className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm hover:border-red-300 hover:shadow-md transition-all group block">
                                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#ED1C24] transition-colors">
                                        <svg className="w-5 h-5 text-[#ED1C24] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <h3 className="text-[13px] font-bold text-gray-900 mb-1">Email Bantuan</h3>
                                    <p className="text-[11px] text-gray-500 font-medium truncate">hsse.support@pge.com</p>
                                </a>

                                {/* WA 2 - Sistem/IT */}
                                <a href="https://wa.me/6289876543210" target="_blank" rel="noreferrer" className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm hover:border-green-300 hover:shadow-md transition-all group block">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#00A651] transition-colors">
                                        <svg className="w-5 h-5 text-[#00A651] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    </div>
                                    <h3 className="text-[13px] font-bold text-gray-900 mb-1">WA IT (Sistem)</h3>
                                    <p className="text-xs text-gray-500 font-medium">+62 898-7654-3210</p>
                                </a>

                                {/* Email 2 - Keluhan Umum */}
                                <a href="mailto:complaint@pge.com" className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm hover:border-red-300 hover:shadow-md transition-all group block">
                                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#ED1C24] transition-colors">
                                        <svg className="w-5 h-5 text-[#ED1C24] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <h3 className="text-[13px] font-bold text-gray-900 mb-1">Email Layanan</h3>
                                    <p className="text-[11px] text-gray-500 font-medium truncate">layanan@pge.com</p>
                                </a>

                            </div>
                        </div>

                        {/* Area Kanan: Form Pesan */}
                        <div className="lg:col-span-7">
                            <div className="bg-white p-8 lg:p-10 rounded-[24px] border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
                                <h2 className="text-xl font-extrabold text-gray-900 mb-6">Kirim Pesan</h2>

                                {isSent && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm font-bold text-[#00A651] flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Pesan Anda berhasil terkirim. Admin kami akan segera merespon!
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                        {/* INPUT NAMA (TERKUNCI / BACA SAJA) */}
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Nama Lengkap</label>
                                            <div className="relative">
                                                <input type="text" value={data.name} readOnly className="w-full bg-[#F4F5F9] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-500 cursor-not-allowed outline-none" />
                                                <svg className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                            </div>
                                        </div>

                                        {/* INPUT EMAIL (TERKUNCI / BACA SAJA) */}
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                                            <div className="relative">
                                                <input type="email" value={data.email} readOnly className="w-full bg-[#F4F5F9] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-500 cursor-not-allowed outline-none" />
                                                <svg className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input Subjek dan Pesan tetap bisa diedit */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Subjek Pesan *</label>
                                        <input type="text" value={data.subject} onChange={e => setData('subject', e.target.value)} required className="w-full bg-[#F8FAFC] border-transparent focus:bg-white focus:border-[#21409A]/30 focus:ring-4 focus:ring-[#21409A]/10 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 transition-all outline-none" placeholder="Contoh: Kendala Peminjaman Sepatu Safety..." />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Pesan Anda *</label>
                                        <textarea value={data.message} onChange={e => setData('message', e.target.value)} required rows="5" className="w-full bg-[#F8FAFC] border-transparent focus:bg-white focus:border-[#21409A]/30 focus:ring-4 focus:ring-[#21409A]/10 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 transition-all outline-none resize-none" placeholder="Ceritakan detail pertanyaan atau kendala Anda di sini..."></textarea>
                                    </div>

                                    <button type="submit" disabled={processing} className="w-full py-4 bg-[#21409A] hover:bg-[#1a3380] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2">
                                        {processing ? 'Mengirim...' : (
                                            <>
                                                Kirim Pesan Sekarang
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>

                {/* ================= FOOTER AREA ================= */}
                <footer className="mt-auto shrink-0 bg-[#F4F5FA]">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 xl:px-20 py-4 flex flex-col md:flex-row justify-between items-center text-[13px] text-gray-500 font-medium">
                        <div>© 2026, Sistem Peminjaman HSSE - PT Pertamina Geothermal Energy Tbk.</div>
                        <div className="flex space-x-4 mt-2 md:mt-0 text-[#21409A]">
                            <a href="#" className="hover:underline">License</a>
                            <a href="#" className="hover:underline">Documentation</a>
                            <a href="#" className="hover:underline">Support</a>
                        </div>
                    </div>
                    <div className="h-1.5 flex w-full">
                        <div className="bg-[#21409A] flex-1"></div>
                        <div className="bg-[#ED1C24] flex-1"></div>
                        <div className="bg-[#FBBF24] flex-1"></div>
                    </div>
                </footer>

            </div>
        </>
    );
}