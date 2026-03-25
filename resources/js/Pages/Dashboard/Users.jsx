import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Users({ auth, users }) {

    // Dummy Data dengan kolom yang sesuai gambar (ditambah foto dummy untuk profil)
    const dummyUsers = users && users.length > 0 ? users : [
        { id: 1, name: 'Eneh Mercy', nip: '703703', email: 'michelle.rivera@example.com', department: 'Operasional', phone: '0812-3456-7890', photo: 'https://i.pravatar.cc/150?img=1', role: 'Staff Lapangan', about: 'Staff lapangan di bagian Operasional Panas Bumi. Bertanggung jawab atas inspeksi harian.', area: 'Site Lahendong', status: 'Aktif' },
        { id: 2, name: 'Marvin McKinney', nip: '877037', email: 'kenzi.lawson@example.com', department: 'HSSE', phone: '0857-9876-5432', photo: 'https://i.pravatar.cc/150?img=11', role: 'Safety Inspector', about: 'Mengawasi kepatuhan standar keselamatan kerja di area pembangkit listrik.', area: 'Site Kamojang', status: 'Aktif' },
        { id: 3, name: 'Brooklyn Simmons', nip: '370357', email: 'nathan.roberts@example.com', department: 'Teknik', phone: '0811-2345-6789', photo: 'https://i.pravatar.cc/150?img=5', role: 'Mechanical Engineer', about: 'Fokus pada perawatan turbin dan komponen mekanis utama.', area: 'Site Ulubelu', status: 'Aktif' },
        { id: 4, name: 'Dianne Russell', nip: '870316', email: 'felicia.reid@example.com', department: 'Operasional', phone: '0821-8765-4321', photo: 'https://i.pravatar.cc/150?img=9', role: 'Operator Shift', about: 'Memastikan operasional pembangkit berjalan mulus pada shift malam.', area: 'Site Lahendong', status: 'Cuti' },
        { id: 5, name: 'Cody Fisher', nip: '547030', email: 'tim.jennings@example.com', department: 'HSSE', phone: '0813-5678-9012', photo: 'https://i.pravatar.cc/150?img=33', role: 'HSSE Admin', about: 'Staff lapangan di bagian Operasional Panas Bumi. Bertanggung jawab atas inspeksi harian dan berkomitmen penuh pada budaya Safety First.', area: 'Site Lahendong', status: 'Aktif' },
        { id: 6, name: 'Guy Hawkins', nip: '270374', email: 'alma.lawson@example.com', department: 'Operasional', phone: '0878-1098-7654', photo: 'https://i.pravatar.cc/150?img=12', role: 'Logistik', about: 'Mengatur pasokan APD dan spare part mesin.', area: 'Kantor Pusat', status: 'Aktif' },
        { id: 7, name: 'Devon Lane', nip: '970322', email: 'debra.holt@example.com', department: 'Operasional', phone: '0896-4321-0987', photo: 'https://i.pravatar.cc/150?img=4', role: 'Operator', about: 'Operator lapangan junior.', area: 'Site Kamojang', status: 'Nonaktif' },
    ];

    // State untuk menyimpan user mana yang sedang diklik (default ke Cody Fisher / index 4)
    const [selectedUser, setSelectedUser] = useState(dummyUsers[4] || dummyUsers[0]);

    return (
        <AdminLayout user={auth?.user}>
            <Head title="Data Pengguna" />

            {/* Layout Flex untuk membagi layar Kiri (Tabel) dan Kanan (Profil) */}
            <div className="w-full flex flex-col xl:flex-row gap-8 pb-10">

                {/* ================= AREA KIRI: TABEL DATA PENGGUNA ================= */}
                <div className="flex-1 min-w-0 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">

                    <h1 className="text-[28px] font-bold text-gray-800 tracking-tight mb-6">Data Pengguna</h1>

                    {/* Pembungkus Tabel & Toolbar yang berwarna putih */}
                    <div className="bg-transparent border-t border-b sm:border border-gray-100 sm:bg-white sm:rounded-[24px] sm:shadow-sm overflow-hidden flex-1 flex flex-col">

                        {/* Toolbar (Filter & Search) */}
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 bg-white border-b border-gray-100">
                            {/* Tombol Add Filter */}
                            <button className="flex items-center gap-2 text-sm text-gray-500 font-medium hover:text-gray-800 transition-colors w-full sm:w-auto">
                                Add filter
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>

                            {/* Garis Pemisah Vertikal (Hanya di Desktop) */}
                            <div className="hidden sm:block h-6 w-px bg-gray-200 mx-2"></div>

                            {/* Search Input */}
                            <div className="relative w-full flex-1">
                                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari karyawan"
                                    className="w-full bg-transparent border-none pl-8 pr-4 py-2 text-sm text-gray-700 outline-none placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Area Tabel */}
                        <div className="overflow-x-auto bg-white flex-1 custom-scrollbar">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead>
                                    <tr className="text-gray-500 text-[11px] font-bold tracking-widest uppercase border-b border-gray-100">
                                        <th className="px-5 sm:px-6 py-4">Nama Karyawan</th>
                                        <th className="px-5 sm:px-6 py-4">ID Pekerja</th>
                                        <th className="px-5 sm:px-6 py-4">Email address</th>
                                        <th className="px-5 sm:px-6 py-4">Departemen</th>
                                        <th className="px-5 sm:px-6 py-4">No. HP/Telepon</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {dummyUsers.map((u) => {
                                        const isSelected = selectedUser?.id === u.id;
                                        return (
                                            <tr
                                                key={u.id}
                                                onClick={() => setSelectedUser(u)}
                                                className={`cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-[#3b82f6] hover:bg-[#3b82f6]' : 'hover:bg-gray-50 bg-white'}`}
                                            >
                                                {/* Kolom Nama & Avatar */}
                                                <td className="px-5 sm:px-6 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <img src={u.photo} alt={u.name} className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-200" />
                                                        <span className={`text-[13px] font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                                                            {u.name}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Kolom NIP / ID Pekerja */}
                                                <td className="px-5 sm:px-6 py-3.5">
                                                    <span className={`text-[13px] ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                                                        {u.nip}
                                                    </span>
                                                </td>

                                                {/* Kolom Email */}
                                                <td className="px-5 sm:px-6 py-3.5">
                                                    <span className={`text-[13px] ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                                                        {u.email}
                                                    </span>
                                                </td>

                                                {/* Kolom Departemen */}
                                                <td className="px-5 sm:px-6 py-3.5">
                                                    <span className={`text-[13px] ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                                                        {u.department}
                                                    </span>
                                                </td>

                                                {/* Kolom Telepon */}
                                                <td className="px-5 sm:px-6 py-3.5">
                                                    <span className={`text-[13px] ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                                                        {u.phone}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ================= AREA KANAN: KARTU PROFIL ================= */}
                {/* Menggunakan fixed width agar tidak menyusut saat layar mengecil (Responsive) */}
                <div className="w-full xl:w-[320px] shrink-0 animate-in fade-in slide-in-from-right-8 duration-500 delay-150 fill-mode-both">

                    {/* Spacer Kosong agar sejajar dengan tinggi H1 "Data Pengguna" di sisi kiri */}
                    <div className="h-0 xl:h-[56px]"></div>

                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 flex flex-col items-center sticky top-24">

                        {/* ID Pekerja Profil */}
                        <p className="text-sm font-semibold text-gray-500 mb-4">{selectedUser?.nip}</p>

                        {/* Foto Profil Melingkar Besar */}
                        <div className="w-36 h-36 rounded-full p-1 bg-white border border-gray-200 shadow-sm mb-5 overflow-hidden">
                            <img src={selectedUser?.photo} alt={selectedUser?.name} className="w-full h-full rounded-full object-cover" />
                        </div>

                        {/* Nama & Departemen Profil */}
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{selectedUser?.name}</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 mb-6">{selectedUser?.department}</p>

                        {/* Tombol Kontak (Telepon & Email) */}
                        <div className="flex gap-3 mb-8 w-full justify-center">
                            <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#4B70F5] hover:bg-blue-50 transition-colors shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            </button>
                        </div>

                        {/* Garis Pemisah */}
                        <div className="w-full h-px bg-gray-100 mb-6"></div>

                        {/* Bagian About Me */}
                        <div className="w-full text-left mb-6">
                            <h4 className="text-xs font-extrabold text-gray-800 mb-2">About Me</h4>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                {selectedUser?.about || 'Belum ada deskripsi profil untuk pengguna ini.'}
                            </p>
                        </div>

                        {/* Bagian Area Kerja & Status */}
                        <div className="w-full flex justify-between text-left">
                            <div>
                                <h4 className="text-[11px] font-bold text-gray-800 mb-1">Area Kerja</h4>
                                <p className="text-xs text-gray-400 font-medium">{selectedUser?.area || '-'}</p>
                            </div>
                            <div className="text-right">
                                <h4 className="text-[11px] font-bold text-gray-800 mb-1">Status Akun</h4>
                                <p className={`text-xs font-bold ${selectedUser?.status === 'Aktif' ? 'text-gray-400' : 'text-red-400'}`}>{selectedUser?.status || '-'}</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}