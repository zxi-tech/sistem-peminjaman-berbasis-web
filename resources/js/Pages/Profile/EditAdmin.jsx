import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function EditAdmin({ auth, mustVerifyEmail, status }) {
    const user = auth?.user;

    // State untuk preview foto sebelum di-save
    const [photoPreview, setPhotoPreview] = useState(null);

    const profileForm = useForm({
        name: user?.name || '',
        email: user?.email || '',
        photo: null, // Siapkan tempat untuk file foto
        _method: 'PATCH', // Wajib ada untuk upload file di Inertia
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Fungsi untuk menangani saat admin memilih foto dari komputernya
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            profileForm.setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file)); // Buat URL sementara untuk preview
        }
    };

    const submitProfile = (e) => {
        e.preventDefault();
        // Ubah jadi POST (karena ada _method: PATCH di atas) dan tambahkan forceFormData
        profileForm.post(route('profile.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('password.update'), { preserveScroll: true, onSuccess: () => passwordForm.reset() });
    };

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

    // Logika prioritas gambar: 1. Preview (jika baru milih), 2. Foto Database, 3. Kosong (null)
    const currentDisplayPhoto = photoPreview || (user?.photo ? `/storage/${user.photo}` : null);

    return (
        <AdminLayout user={user}>
            <Head title="Profil Admin" />

            <div className="max-w-[1100px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                {status === 'profile-updated' && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 text-sm font-bold text-center shadow-sm">✅ Profil Admin berhasil diperbarui!</div>}
                {status === 'password-updated' && <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 text-sm font-bold text-center shadow-sm">🔐 Password Admin berhasil diubah!</div>}

                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden">

                    {/* BAGIAN KIRI: KARTU PROFIL ADMIN */}
                    <div className="w-full md:w-[35%] lg:w-[30%] border-r border-gray-100 p-8 flex flex-col items-center bg-white relative">
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight mb-8">Profile Admin</h2>

                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-full p-1 bg-white border-[3px] border-[#00A651] shadow-sm overflow-hidden flex items-center justify-center">
                                {currentDisplayPhoto ? (
                                    <img src={currentDisplayPhoto} alt={user?.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#00A651] to-green-400 flex items-center justify-center text-white font-extrabold text-4xl shadow-inner">
                                        {getInitials(user?.name)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide text-center">{profileForm.data.name || user?.name}</h3>
                        <p className="text-xs font-bold text-gray-400 tracking-widest mt-1 mb-8">{user?.nip || 'NIP: ADMIN-PGE'}</p>

                        {/* TOMBOL UPLOAD FOTO AKTIF */}
                        <label className={`w-full text-center hover:bg-[#008c44] text-white text-sm font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-sm mt-auto ${profileForm.errors.photo ? 'bg-red-500' : 'bg-[#00A651]'}`}>
                            {photoPreview ? 'Ganti Foto Pilihan' : 'Upload Foto Profil'}
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                        </label>
                        {profileForm.errors.photo && <p className="text-red-500 text-[10px] mt-2 font-bold text-center">{profileForm.errors.photo}</p>}

                        <div className="mt-8 flex flex-col items-center text-center w-full">
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">{user?.department || 'HSSE Department'}</p>
                            <p className="text-[10px] text-gray-400">PT Pertamina Geothermal Energy</p>
                        </div>
                    </div>

                    {/* BAGIAN KANAN: FORMULIR ADMIN */}
                    <div className="w-full md:w-[65%] lg:w-[70%] p-8 lg:p-12 bg-gray-50/30">
                        {/* Form Informasi Umum */}
                        <form id="profile-form" onSubmit={submitProfile} className="mb-12">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                                <h2 className="text-[15px] font-extrabold text-gray-800 uppercase tracking-widest">Informasi Admin</h2>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            profileForm.reset();
                                            setPhotoPreview(null); // Reset preview foto juga
                                        }}
                                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-500 text-xs font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={profileForm.processing} className="px-8 py-2 rounded-lg bg-[#00A651] hover:bg-[#008c44] text-white text-xs font-bold uppercase tracking-wide transition-colors shadow-sm disabled:bg-gray-400">Save</button>
                                </div>
                            </div>
                            <div className="space-y-5 max-w-2xl">
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Nama Lengkap Admin</label>
                                    <input type="text" value={profileForm.data.name} onChange={e => profileForm.setData('name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 font-medium focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] outline-none" />
                                    {profileForm.errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold">{profileForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Email Admin</label>
                                    <input type="email" value={profileForm.data.email} onChange={e => profileForm.setData('email', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 font-medium focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] outline-none" />
                                    {profileForm.errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{profileForm.errors.email}</p>}
                                </div>
                            </div>
                        </form>

                        <div className="w-full h-px bg-gray-200 mb-12"></div>

                        {/* Form Update Password */}
                        <form onSubmit={submitPassword}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                                <h2 className="text-[15px] font-extrabold text-gray-800 uppercase tracking-widest">Ubah Password Admin</h2>
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => passwordForm.reset()} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-500 text-xs font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors">Cancel</button>
                                    <button type="submit" disabled={passwordForm.processing} className="px-8 py-2 rounded-lg bg-[#00A651] hover:bg-[#008c44] text-white text-xs font-bold uppercase tracking-wide transition-colors shadow-sm disabled:bg-gray-400">Update</button>
                                </div>
                            </div>
                            <div className="space-y-5 max-w-2xl">
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Password Saat Ini</label>
                                    <input type="password" value={passwordForm.data.current_password} onChange={e => passwordForm.setData('current_password', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 font-medium focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] outline-none" />
                                    {passwordForm.errors.current_password && <p className="text-red-500 text-[10px] mt-1 font-bold">{passwordForm.errors.current_password}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Password Baru</label>
                                    <input type="password" value={passwordForm.data.password} onChange={e => passwordForm.setData('password', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 font-medium focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] outline-none" />
                                    {passwordForm.errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold">{passwordForm.errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Konfirmasi Password Baru</label>
                                    <input type="password" value={passwordForm.data.password_confirmation} onChange={e => passwordForm.setData('password_confirmation', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 font-medium focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] outline-none" />
                                    {passwordForm.errors.password_confirmation && <p className="text-red-500 text-[10px] mt-1 font-bold">{passwordForm.errors.password_confirmation}</p>}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}