import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function VerifyEmailOtp({ email }) {
    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    useEffect(() => {
        setData('otp', otpValues.join(''));
    }, [otpValues]);

    const handleChange = (index, e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (!value) return;

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value.substring(value.length - 1);
        setOtpValues(newOtpValues);

        if (index < 5 && value) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            const newOtpValues = [...otpValues];

            if (!otpValues[index] && index > 0) {
                inputRefs.current[index - 1].focus();
            }

            newOtpValues[index] = '';
            setOtpValues(newOtpValues);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);

        if (pastedData) {
            const newOtpValues = [...otpValues];
            for (let i = 0; i < pastedData.length; i++) {
                newOtpValues[i] = pastedData[i];
            }
            setOtpValues(newOtpValues);

            const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
            inputRefs.current[focusIndex].focus();
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('otp.email.verify'));
    };

    return (
        <div className="min-h-screen bg-white md:bg-gray-50 flex items-center justify-center p-4 font-sans selection:bg-[#21409A] selection:text-white">
            <Head title="Verifikasi Email" />

            <div className="w-full max-w-[480px] bg-white rounded-[24px] shadow-xl p-10 flex flex-col isolation-auto">

                {/* Bagian Logo Pertamina */}
                <img
                    src="/images/logo-pertamina-pge.png"
                    alt="PGE Logo"
                    className="h-10 mx-auto mb-6 object-contain"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150x40/ffffff/21409A?text=Logo+PGE"; }}
                />

                {/* Bagian Header Teks */}
                <div className="flex items-center justify-start gap-2 mb-3">
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Two Step Verification</h1>
                    {/* SVG Bubble Icon */}
                    <svg className="h-6 w-6 text-[#21409A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium leading-relaxed mb-8">
                    Kami telah mengirimkan kode verifikasi ke email Anda. Masukkan kode tersebut pada kolom di bawah ini. <br />
                    <strong className="text-gray-900 mt-1 inline-block">{email}</strong>
                </p>

                <form onSubmit={submit} className="flex flex-col">

                    {/* Kotak-kotak Input OTP */}
                    <div className="flex justify-between items-center gap-2 sm:gap-4 mb-8" onPaste={handlePaste}>
                        {otpValues.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                ref={(el) => (inputRefs.current[index] = el)}
                                value={value}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-xl font-bold text-gray-900 bg-white border border-gray-300 rounded-[14px] outline-none transition-all focus:border-[#B1DF41] focus:ring-1 focus:ring-[#B1DF41] shadow-sm"
                            />
                        ))}
                    </div>
                    {errors.otp && <p className="text-red-500 text-xs font-medium text-center mb-4">{errors.otp}</p>}

                    {/* Tombol Verifikasi */}
                    <button
                        type="submit"
                        disabled={processing || data.otp.length < 6}
                        className={`w-full py-3.5 rounded-full text-sm font-bold text-gray-900 shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${processing || data.otp.length < 6
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-[#B1DF41] hover:bg-[#A5D13D] hover:shadow-lg transform hover:-translate-y-0.5'
                            }`}
                    >
                        {processing ? 'Memverifikasi...' : 'VERIFIKASI EMAIL'}
                        {/* SVG Arrow Icon */}
                        {!processing && data.otp.length === 6 && (
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        )}
                    </button>

                    {/* Teks Resend */}
                    <p className="text-sm text-gray-600 font-medium text-center mt-8">
                        Belum menerima kode? <Link href="#" method="post" as="button" className="text-[#21409A] hover:underline font-bold cursor-pointer">Kirim Ulang</Link>
                    </p>

                </form>

            </div>
        </div>
    );
}