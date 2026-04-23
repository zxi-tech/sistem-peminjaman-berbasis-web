import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function IncomingItems({ incomingItems, items }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Inertia useForm untuk menghandle inputan
    const { data, setData, post, processing, errors, reset } = useForm({
        item_id: '',
        quantity: '',
        received_date: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.incoming-items.store'), {
            onSuccess: () => {
                setIsModalOpen(false); // Tutup modal jika sukses
                reset(); // Kosongkan form
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <Head title="Riwayat Barang Masuk" />

            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Riwayat Barang Masuk</h2>
                        <p className="text-gray-500 text-sm mt-1">Log pencatatan penambahan stok barang HSSE.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Tombol Kembali ke Manajemen Barang */}
                        <Link
                            href={route('items.index')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-full text-[11px] font-bold shadow-sm hover:shadow-md transition-all uppercase tracking-wider"
                        >
                            &larr; Kembali
                        </Link>
                        {/* Tombol Buka Pop-up */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#00A651] hover:bg-[#008c44] text-white px-5 py-2 rounded-full text-[11px] font-bold shadow-sm hover:shadow-md transition-all uppercase tracking-wider"
                        >
                            + Catat Barang Masuk
                        </button>
                    </div>
                </div>

                {/* Tabel Riwayat */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100">
                            <tr className="text-gray-600 text-[11px] uppercase tracking-wider">
                                <th className="p-4 border-b font-bold">Tanggal Masuk</th>
                                <th className="p-4 border-b font-bold">Nama Barang</th>
                                <th className="p-4 border-b font-bold">Jumlah</th>
                                <th className="p-4 border-b font-bold">Dicatat Oleh</th>
                                <th className="p-4 border-b font-bold">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomingItems.length > 0 ? (
                                incomingItems.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 border-b text-gray-700 text-sm transition-colors">
                                        <td className="p-4 whitespace-nowrap">{log.received_date}</td>
                                        <td className="p-4 font-semibold text-gray-900">{log.item?.name || 'Barang Terhapus'}</td>
                                        <td className="p-4 text-[#00A651] font-bold text-base">+{log.quantity}</td>
                                        <td className="p-4 whitespace-nowrap">{log.user?.name || 'Admin'}</td>
                                        <td className="p-4 text-gray-500 italic max-w-xs truncate">{log.notes || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 text-sm">
                                        Belum ada riwayat pencatatan barang masuk.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* POP-UP MODAL (FORM TAMBAH BARANG MASAK) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
                        <div className="flex justify-between items-center mb-5 border-b pb-3">
                            <h3 className="text-lg font-bold text-gray-800">Form Barang Masuk</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl leading-none">&times;</button>
                        </div>

                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">Pilih Barang</label>
                                <select
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#00A651] focus:ring focus:ring-[#00A651] focus:ring-opacity-50 text-sm"
                                    value={data.item_id}
                                    onChange={e => setData('item_id', e.target.value)}
                                >
                                    <option value="">-- Pilih Barang di Sistem --</option>
                                    {items.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                                {errors.item_id && <span className="text-red-500 text-xs mt-1 block">{errors.item_id}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">Jumlah</label>
                                    <input
                                        type="number" min="1"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#00A651] focus:ring focus:ring-[#00A651] focus:ring-opacity-50 text-sm"
                                        value={data.quantity}
                                        onChange={e => setData('quantity', e.target.value)}
                                    />
                                    {errors.quantity && <span className="text-red-500 text-xs mt-1 block">{errors.quantity}</span>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">Tgl Diterima</label>
                                    <input
                                        type="date"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#00A651] focus:ring focus:ring-[#00A651] focus:ring-opacity-50 text-sm"
                                        value={data.received_date}
                                        onChange={e => setData('received_date', e.target.value)}
                                    />
                                    {errors.received_date && <span className="text-red-500 text-xs mt-1 block">{errors.received_date}</span>}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">Keterangan Tambahan</label>
                                <textarea
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#00A651] focus:ring focus:ring-[#00A651] focus:ring-opacity-50 text-sm"
                                    placeholder="Opsional: Misal asal vendor, kondisi barang..."
                                    rows="3"
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                ></textarea>
                                {errors.notes && <span className="text-red-500 text-xs mt-1 block">{errors.notes}</span>}
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Batal</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-bold text-white bg-[#21409A] hover:bg-[#1a3380] rounded-lg transition-colors shadow-sm disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan Log'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}