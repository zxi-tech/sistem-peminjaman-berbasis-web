import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        nip: '',
        name: '',
        email: '',
        phone: '',
        department: '',
        password: '',
        password_confirmation: '',
    });

    // State untuk fitur intip password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    // Handler khusus untuk memastikan Nomor Telepon hanya berisi angka
    const handlePhoneChange = (e) => {
        const numericValue = e.target.value.replace(/\D/g, '');
        setData('phone', numericValue);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans selection:bg-[#21409A] selection:text-white overflow-hidden">
            <Head title="Registrasi Akun" />

            <div className="w-full max-w-[900px] bg-white rounded-[24px] shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* ================= KOLOM KIRI: FOTO ================= */}
                <div className="hidden md:block md:w-5/12 p-3">
                    <div className="w-full h-full rounded-[20px] overflow-hidden relative bg-gray-100">
                        <img
                            src="/images/pekerja-pertamina.jpg"
                            alt="Pekerja Pertamina"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#21409A]/30 to-transparent"></div>
                    </div>
                </div>

                {/* ================= KOLOM KANAN: FORM REGISTRASI COMPACT ================= */}
                <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-center">

                    <div className="mb-5">
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            Buat Akun Baru <span className="animate-wave origin-bottom-right">👋</span>
                        </h1>
                        <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                            Daftarkan diri Anda untuk mengakses sistem peminjaman barang dan APD.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">

                        {/* Baris 1: NIP & Nama Lengkap */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-[#4B5563] font-extrabold uppercase tracking-widest">
                                    Nomor Pekerja (NIP)
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400 group-focus-within:text-[#00A651] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                                    </div>
                                    <input type="text" value={data.nip} onChange={(e) => setData('nip', e.target.value)} required className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 rounded-lg pl-10 pr-3.5 py-2 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-all placeholder-gray-400 font-medium" placeholder="Contoh: 703703" />
                                </div>
                                {errors.nip && <p className="text-red-500 text-[10px]">{errors.nip}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-[#4B5563] font-extrabold uppercase tracking-widest">
                                    Nama Lengkap
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400 group-focus-within:text-[#00A651] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 rounded-lg pl-10 pr-3.5 py-2 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-all placeholder-gray-400 font-medium" placeholder="Sesuai ID Card" />
                                </div>
                                {errors.name && <p className="text-red-500 text-[10px]">{errors.name}</p>}
                            </div>
                        </div>

                        {/* Baris 2: Email & Nomor Telepon */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-[#4B5563] font-extrabold uppercase tracking-widest">
                                    Alamat Email
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400 group-focus-within:text-[#00A651] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 rounded-lg pl-10 pr-3.5 py-2 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-all placeholder-gray-400 font-medium" placeholder="nama@pertamina.com" />
                                </div>
                                {errors.email && <p className="text-red-500 text-[10px]">{errors.email}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] text-[#4B5563] font-extrabold uppercase tracking-widest">
                                    Nomor Telepon
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400 group-focus-within:text-[#00A651] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    </div>
                                    <input type="tel" value={data.phone} onChange={handlePhoneChange} required className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 rounded-lg pl-10 pr-3.5 py-2 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-all placeholder-gray-400 font-medium" placeholder="0812..." />
                                </div>
                                {errors.phone && <p className="text-red-500 text-[10px]">{errors.phone}</p>}
                            </div>
                        </div>

                        {/* Baris 3: Departemen */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-[#4B5563] font-extrabold uppercase tracking-widest">
                                Departemen
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400 group-focus-within:text-[#00A651] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <select value={data.department} onChange={(e) => setData('department', e.target.value)} required className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-600 rounded-lg pl-10 pr-10 py-2 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-all cursor-pointer font-medium appearance-none">
                                    <option value="" disabled>-- Pilih Departemen --</option>
                                    <option value="Operasional">Operasional Panas Bumi</option>
                                    <option value="Teknik">Teknik & Pemeliharaan</option>
                                    <option value="HSSE">HSSE / K3</option>
                                    <option value="Logistik">Logistik & SCM</option>
                                </select>
                                {/* Ikon panah bawah buatan sendiri karena appearance-none */}
                                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            {errors.department && <p className="text-red-500 text-[10px]">{errors.department}</p>}
                        </div>

                        {/* Baris 4: Kata Sandi & Konfirmasi */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 relative">
                                <label className="text-[10px] text-[#4B5563] font-extrabold uppercase tracking-widest">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400 group-focus-within:text-[#00A651] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 rounded-lg pl-10 pr-10 py-2 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-all placeholder-gray-400 font-medium tracking-widest"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        tabIndex="-1"
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0l1.414 1.414M15 15l1.414 1.414M21 21l-3.29-3.29m-3.532-3.532l-1.414-1.414m-4.242 0L9.88 9.88M21.543 12c-1.274 4.057-5.065 7-9.543 7m0 0l.002.002"></path></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-[10px]">{errors.password}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5 relative">
                                <label className="text-[10px] text-[#4B5563] font-extrabold uppercase tracking-widest">
                                    Konfirmasi Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400 group-focus-within:text-[#00A651] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-800 rounded-lg pl-10 pr-10 py-2 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-all placeholder-gray-400 font-medium tracking-widest"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        tabIndex="-1"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0l1.414 1.414M15 15l1.414 1.414M21 21l-3.29-3.29m-3.532-3.532l-1.414-1.414m-4.242 0L9.88 9.88M21.543 12c-1.274 4.057-5.065 7-9.543 7m0 0l.002.002"></path></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && <p className="text-red-500 text-[10px]">{errors.password_confirmation}</p>}
                            </div>
                        </div>

                        {/* Tombol Submit & Teks Bawah */}
                        <div className="pt-3 flex flex-col gap-3">
                            <button type="submit" disabled={processing} className={`w-full py-2.5 rounded-lg text-sm font-bold text-white shadow-md transition-all duration-300 ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#21409A] hover:bg-[#1a3380] hover:shadow-lg transform hover:-translate-y-0.5'}`}>
                                {processing ? 'Memproses...' : 'Daftar'}
                            </button>

                            <p className="text-center text-xs text-gray-600 font-medium">
                                Sudah punya akun?{' '}
                                <Link href={route('login')} className="text-[#21409A] font-bold hover:underline">
                                    Masuk
                                </Link>
                            </p>
                        </div>

                    </form>
                </div>
            </div>

            {/* Animasi Kustom untuk tangan melambai */}
            <style jsx="true">{`
                @keyframes wave {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(20deg); }
                    50% { transform: rotate(-10deg); }
                    75% { transform: rotate(10deg); }
                }
                .animate-wave {
                    display: inline-block;
                    animation: wave 1.5s infinite;
                }
            `}</style>
        </div>
    );
}