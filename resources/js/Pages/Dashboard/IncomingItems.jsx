import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function IncomingItems({ incomingItems, items }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Menambahkan field 'warehouse' untuk Gudang
    const { data, setData, post, processing, errors, reset } = useForm({
        item_id: '',
        quantity: '',
        received_date: '',
        warehouse: 'Gudang HSSE Utama', // Default value
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.incoming-items.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 w-full pb-12">
            <Head title="Riwayat Barang Masuk" />

            {/* Header Area Full Width */}
            <div className="bg-white border-b border-gray-200 px-6 py-6 sm:px-10 lg:px-12 mb-6 w-full shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Riwayat Barang Masuk</h2>
                        <p className="text-gray-500 text-sm mt-1">Log penambahan stok dan *update* varian alat HSSE.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('items.index')}
                            className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-bold shadow-sm transition-all"
                        >
                            &larr; KEMBALI
                        </Link>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#00A651] hover:bg-[#008c44] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all"
                        >
                            + CATAT MANUAL
                        </button>
                    </div>
                </div>
            </div>

            {/* Konten Tabel Full Page */}
            <div className="px-6 sm:px-10 lg:px-12 w-full">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-[#21409A] text-white">
                                <tr className="text-xs uppercase tracking-wider">
                                    <th className="p-4 font-bold border-r border-blue-800 text-center w-12">No</th>
                                    <th className="p-4 font-bold border-r border-blue-800">Nama Barang</th>
                                    <th className="p-4 font-bold border-r border-blue-800 text-center">ID Barang</th>
                                    <th className="p-4 font-bold border-r border-blue-800">Tanggal</th>
                                    <th className="p-4 font-bold border-r border-blue-800">Gudang</th>
                                    <th className="p-4 font-bold border-r border-blue-800 text-center">Jumlah Masuk</th>
                                    <th className="p-4 font-bold border-r border-blue-800">Dicatat Oleh</th>
                                    <th className="p-4 font-bold">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomingItems.length > 0 ? (
                                    incomingItems.map((log, index) => (
                                        <tr key={log.id} className="hover:bg-blue-50 border-b border-gray-100 text-gray-700 text-sm transition-colors">
                                            <td className="p-4 text-center font-medium text-gray-500">{index + 1}</td>
                                            <td className="p-4 font-bold text-gray-900">{log.item?.name || 'Barang Terhapus'}</td>
                                            <td className="p-4 text-center font-mono text-xs text-gray-500 bg-gray-50">
                                                #{log.item_id}
                                            </td>
                                            <td className="p-4">{log.received_date}</td>
                                            <td className="p-4 font-medium text-[#21409A]">
                                                {/* Asumsi gudang default jika belum ada di database */}
                                                {log.warehouse || 'Gudang HSSE Utama'}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="bg-green-100 text-[#00A651] px-3 py-1 rounded-md font-extrabold text-base border border-green-200">
                                                    +{log.quantity}
                                                </span>
                                            </td>
                                            <td className="p-4 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {log.user?.name ? log.user.name.charAt(0).toUpperCase() : 'A'}
                                                </div>
                                                {log.user?.name || 'Sistem Otomatis'}
                                            </td>
                                            <td className="p-4 text-gray-500 italic max-w-xs truncate" title={log.notes}>
                                                {log.notes || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="p-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <span className="text-4xl mb-3">🗄️</span>
                                                <p className="font-bold text-lg">Belum Ada Riwayat Logistik</p>
                                                <p className="text-sm">Log barang masuk atau penambahan stok otomatis akan muncul di sini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* POP-UP MODAL FORM (Tetap Sama, hanya ditambah Gudang) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all">
                        <div className="flex justify-between items-center mb-5 border-b pb-3">
                            <h3 className="text-lg font-bold text-gray-900">Catat Manual Barang Masuk</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl leading-none">&times;</button>
                        </div>

                        <form onSubmit={submit}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="col-span-2">
                                    <label className="block text-gray-700 text-xs font-bold uppercase mb-1">Pilih Barang</label>
                                    <select
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#00A651] focus:ring focus:ring-[#00A651] focus:ring-opacity-20 text-sm p-2.5"
                                        value={data.item_id}
                                        onChange={e => setData('item_id', e.target.value)}
                                    >
                                        <option value="">-- Pilih Barang di Sistem --</option>
                                        {items.map(item => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase mb-1">Jumlah</label>
                                    <input
                                        type="number" min="1"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#00A651] text-sm p-2.5"
                                        value={data.quantity}
                                        onChange={e => setData('quantity', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-xs font-bold uppercase mb-1">Tanggal</label>
                                    <input
                                        type="date"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#00A651] text-sm p-2.5"
                                        value={data.received_date}
                                        onChange={e => setData('received_date', e.target.value)}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-gray-700 text-xs font-bold uppercase mb-1">Lokasi Gudang</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#00A651] text-sm p-2.5"
                                        value={data.warehouse}
                                        onChange={e => setData('warehouse', e.target.value)}
                                    />
                                </div>

                                <div className="col-span-2 mb-2">
                                    <label className="block text-gray-700 text-xs font-bold uppercase mb-1">Keterangan</label>
                                    <textarea
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#00A651] text-sm p-2.5"
                                        rows="2"
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Batal</button>
                                <button type="submit" disabled={processing} className="px-5 py-2 text-sm font-bold text-white bg-[#00A651] hover:bg-[#008c44] rounded-lg transition-colors shadow-sm disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}