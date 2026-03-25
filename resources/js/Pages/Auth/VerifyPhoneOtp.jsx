import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function VerifyPhoneOtp({ phone, testing_otp }) {
    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

    // State untuk mengelola 6 kotak input secara terpisah
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    // Menggabungkan array otpValues menjadi satu string ke form Inertia setiap kali ada perubahan
    useEffect(() => {
        setData('otp', otpValues.join(''));
    }, [otpValues]);

    // Handler ketika user mengetik angka
    const handleChange = (index, e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Hanya izinkan angka
        if (!value) return;

        const newOtpValues = [...otpValues];
        // Ambil karakter terakhir jika user mengetik cepat
        newOtpValues[index] = value.substring(value.length - 1);
        setOtpValues(newOtpValues);

        // Otomatis pindah fokus ke kotak berikutnya jika belum di kotak terakhir
        if (index < 5 && value) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Handler untuk tombol Backspace (hapus & mundur)
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            const newOtpValues = [...otpValues];

            // Jika kotak kosong dan ditekan backspace, mundur ke kotak sebelumnya
            if (!otpValues[index] && index > 0) {
                inputRefs.current[index - 1].focus();
            }

            newOtpValues[index] = '';
            setOtpValues(newOtpValues);
        }
    };

    // Handler untuk Paste OTP langsung
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);

        if (pastedData) {
            const newOtpValues = [...otpValues];
            for (let i = 0; i < pastedData.length; i++) {
                newOtpValues[i] = pastedData[i];
            }
            setOtpValues(newOtpValues);

            // Fokus ke kotak terakhir yang terisi
            const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
            inputRefs.current[focusIndex].focus();
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('otp.phone.verify'));
    };

    return (
        <div className="min-h-screen bg-white md:bg-gray-50 flex items-center justify-center p-4 font-sans selection:bg-[#00A651] selection:text-white">
            <Head title="Verifikasi WhatsApp" />

            <div className="w-full max-w-[480px] bg-white rounded-[24px] shadow-xl p-10 flex flex-col isolation-auto">

                {/* Bagian Logo Pertamina */}
                <img
                    src="/images/logo-pertamina-pge.png"
                    alt="PGE Logo"
                    className="h-10 mx-auto mb-6 object-contain"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150x40/ffffff/00A651?text=Logo+PGE"; }}
                />

                {/* Bagian Header Teks */}
                <div className="flex items-center justify-start gap-2 mb-3">
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Verifikasi WhatsApp</h1>
                    {/* SVG WhatsApp/Chat Icon */}
                    <svg className="h-6 w-6 text-[#00A651]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                </div>

                {/* Deskripsi disesuaikan dengan format gambar */}
                <p className="text-sm text-gray-600 font-medium leading-relaxed mb-8">
                    Kami telah mengirimkan pesan berisi kode verifikasi ke nomor WhatsApp Anda. Masukkan kode tersebut pada kolom di bawah ini. <strong className="text-gray-900">{phone}</strong>
                </p>

                {/* INFO TESTING DEV */}
                {testing_otp && (
                    <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-xs font-bold font-mono text-center">
                        [MODE DEV] Kode OTP WA Anda: {testing_otp}
                    </div>
                )}

                <form onSubmit={submit} className="flex flex-col">

                    {/* Kotak-kotak Input OTP */}
                    <div className="flex justify-between items-center gap-2 sm:gap-4 mb-8" onPaste={handlePaste}>
                        {otpValues.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength="1" // Dibatasi 1 agar konsisten dengan handling script
                                ref={(el) => (inputRefs.current[index] = el)}
                                value={value}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-xl font-bold text-gray-900 bg-white border border-gray-300 rounded-[14px] outline-none transition-all focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651] shadow-sm"
                            />
                        ))}
                    </div>
                    {errors.otp && <p className="text-red-500 text-xs font-medium text-center mb-4">{errors.otp}</p>}

                    {/* Tombol Verifikasi (Bentuk memanjang (pill) dengan ikon panah seperti gambar) */}
                    <button
                        type="submit"
                        disabled={processing || data.otp.length < 6}
                        className={`w-full py-3.5 rounded-full text-sm font-bold shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${processing || data.otp.length < 6
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#00A651] text-white hover:bg-[#008c44] hover:shadow-lg transform hover:-translate-y-0.5'
                            }`}
                    >
                        {processing ? 'MEMVERIFIKASI...' : 'VERIFIKASI WHATSAPP'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </button>

                    {/* Teks Resend di bagian paling bawah */}
                    <p className="text-sm text-gray-600 font-medium text-center mt-8">
                        Belum menerima pesan WhatsApp? <Link href="#" method="post" as="button" className="text-[#00A651] hover:underline font-bold cursor-pointer">Kirim Ulang</Link>
                    </p>

                </form>

            </div>
        </div>
    );
}