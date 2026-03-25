import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Create({ auth, items }) {
    const { flash } = usePage().props;

    const displayItems = items && items.length > 0 ? items : [
        {
            id: 1, name: 'Safety Helmet', type: 'asset', photo_path: null,
            sizes: [{ id: 11, size_name: 'All Size', stock: 10 }]
        },
        {
            id: 2, name: 'Coverall Onshore', type: 'asset', photo_path: null,
            sizes: [{ id: 21, size_name: 'M', stock: 5 }, { id: 22, size_name: 'L', stock: 12 }, { id: 23, size_name: 'XL', stock: 8 }]
        }
    ];

    // 1. TAMBAHKAN 'errors' DI SINI
    const { data, setData, post, processing, reset, errors } = useForm({
        start_date: '',
        end_date: '',
        purpose: '',
        selected_items: {}
    });

    const [expandedItems, setExpandedItems] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (flash?.success) {
            reset();
            setExpandedItems({});
        }
    }, [flash?.success]);

    const filteredItems = useMemo(() => {
        return displayItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [displayItems, searchTerm]);

    const selectedSummary = useMemo(() => {
        let summary = [];
        let totalItems = 0;

        Object.keys(data.selected_items).forEach(itemId => {
            const item = displayItems.find(i => i.id === parseInt(itemId));
            if (!item) return;

            let itemTotalQty = 0;
            let sizesSelected = [];

            Object.keys(data.selected_items[itemId]).forEach(sizeId => {
                const qty = data.selected_items[itemId][sizeId];
                if (qty > 0) {
                    const sizeInfo = item.sizes.find(s => s.id === parseInt(sizeId));
                    itemTotalQty += qty;
                    totalItems += qty;
                    sizesSelected.push(`${sizeInfo.size_name} (${qty})`);
                }
            });

            if (itemTotalQty > 0) {
                summary.push({
                    name: item.name,
                    details: sizesSelected.join(', '),
                    total: itemTotalQty
                });
            }
        });

        return { summary, totalItems };
    }, [data.selected_items, displayItems]);

    // 2. PERBARUI HANDLESUBMIT UNTUK MENANGKAP ERROR
    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedSummary.totalItems === 0) {
            alert('Silakan pilih minimal satu barang terlebih dahulu.');
            return;
        }

        post(route('borrow.store'), {
            preserveScroll: false, // <--- UBAH JADI FALSE AGAR LAYAR LANGSUNG NAIK KE ATAS!
            onError: (err) => {
                // Munculkan Pop-up di tengah layar jika gagal
                alert("GAGAL MENGAJUKAN!\n\n" + (err.selected_items || "Silakan cek kembali tanggal dan keperluan Anda."));
            }
        });
    };

    const toggleItemExpansion = (itemId) => {
        setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    const handleQuantityChange = (itemId, sizeId, qty) => {
        const parsedQty = parseInt(qty) || 0;
        setData(prev => ({
            ...prev,
            selected_items: {
                ...prev.selected_items,
                [itemId]: {
                    ...prev.selected_items[itemId],
                    [sizeId]: parsedQty
                }
            }
        }));
    };

    const isItemSelected = (itemId) => {
        const itemSizes = data.selected_items[itemId];
        if (!itemSizes) return false;
        return Object.values(itemSizes).some(qty => qty > 0);
    };

    return (
        <>
            <Head title="Ajukan Peminjaman" />

            <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 text-gray-800 selection:bg-[#00A651] selection:text-white">

                {/* NAVBAR (SAMA SEPERTI SEBELUMNYA) */}
                <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <img src="/images/logo-pertamina-pge.png" alt="Logo PGE" className="h-8 object-contain" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150x40/ffffff/00A651?text=Logo+PGE"; }} />
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
                            {auth?.user?.role === 'admin' && (
                                <Link href={route('dashboard')} className="hover:text-[#00A651] transition-colors">Dashboard Admin</Link>
                            )}
                            <Link href="#" className="text-[#00A651] border-b-2 border-[#00A651] pb-1">Ajukan Peminjaman</Link>
                            <Link href={route('borrow.status')} className="hover:text-[#00A651] transition-colors">Status Peminjaman</Link>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                                <div className="w-8 h-8 rounded-full bg-[#00A651] flex items-center justify-center text-white font-bold text-xs shadow-inner">
                                    {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="text-sm font-bold text-gray-700 hidden sm:block pr-2">{auth?.user?.name || 'User Pekerja'}</span>
                            </div>
                            <Link href={route('logout')} method="post" as="button" className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-colors border border-transparent hover:border-red-100">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                <span className="hidden sm:block">Keluar</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">

                    {flash?.success && (
                        <div className="mb-8 p-4 rounded-2xl bg-green-50 border border-green-200 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="bg-[#00A651] text-white p-2 rounded-full shrink-0 shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-green-900">Pengajuan Berhasil!</h3>
                                <p className="text-sm text-green-700 mt-0.5">{flash.success}</p>
                                <Link href={route('borrow.status')} className="inline-block mt-2 text-xs font-bold text-[#00A651] hover:underline">Lihat Status Peminjaman →</Link>
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold shadow-sm">
                            ⚠️ {flash.error}
                        </div>
                    )}

                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 bg-[#E6F6ED] text-[#00A651] text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            FORMULIR HSSE
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Ajukan Peminjaman APD</h1>
                        <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">Lengkapi detail peminjaman dan pilih perlengkapan yang Anda butuhkan.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8" noValidate>

                        <div className="lg:col-span-8 space-y-8">

                            {/* 3. TAMPILAN ERROR DI INPUT FORM */}
                            <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Detail Peminjam</h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Nama Pekerja</label>
                                        <input type="text" disabled value={auth?.user?.name || "Nama (Otomatis)"} className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-2.5 text-sm font-medium outline-none cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Departemen</label>
                                        <input type="text" disabled value={auth?.user?.department || "Operasional"} className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-xl px-4 py-2.5 text-sm font-medium outline-none cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Tanggal Pinjam <span className="text-red-500">*</span></label>
                                        <input type="date" required value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} className={`w-full bg-white border ${errors.start_date ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-all`} />
                                        {errors.start_date && <p className="text-red-500 text-[10px] mt-1">{errors.start_date}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Tanggal Kembali <span className="text-red-500">*</span></label>
                                        <input type="date" required value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} className={`w-full bg-white border ${errors.end_date ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-all`} />
                                        {errors.end_date && <p className="text-red-500 text-[10px] mt-1">{errors.end_date}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Tujuan Keperluan <span className="text-red-500">*</span></label>
                                        <textarea rows="3" required value={data.purpose} onChange={(e) => setData('purpose', e.target.value)} className={`w-full bg-white border ${errors.purpose ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-xl px-4 py-3 text-sm font-medium outline-none resize-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-all`} placeholder="Jelaskan secara singkat untuk keperluan apa APD ini dipinjam..."></textarea>
                                        {errors.purpose && <p className="text-red-500 text-[10px] mt-1">{errors.purpose}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* CARD 2: PILIH BARANG (KODE SAMA) */}
                            <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                                <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-[#00A651]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>
                                        <h2 className="text-lg font-bold text-gray-900">Pilih Barang</h2>
                                    </div>
                                    <div className="relative w-full sm:max-w-xs">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-gray-300 rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-all placeholder-gray-400 font-medium" placeholder="Cari nama perlengkapan..." />
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6 space-y-3">
                                    {errors.selected_items && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg mb-3">⚠️ {errors.selected_items}</div>}
                                    {filteredItems.length === 0 ? (
                                        <div className="text-center py-10"><p className="text-gray-500 font-medium text-sm">Barang "{searchTerm}" tidak ditemukan.</p></div>
                                    ) : (
                                        filteredItems.map((item) => {
                                            const isSelected = isItemSelected(item.id);
                                            return (
                                                <div key={item.id} className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isSelected ? 'border-[#00A651] ring-1 ring-[#00A651]/20 bg-green-50/10' : 'border-gray-200 bg-white hover:border-[#00A651]/50'}`}>
                                                    <div className="flex items-center justify-between p-4 cursor-pointer select-none" onClick={() => toggleItemExpansion(item.id)}>
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 p-1.5">
                                                                {item.photo_path ? (<img src={`/storage/${item.photo_path}`} className="w-full h-full object-contain" alt={item.name} />) : (<svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>)}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                                                                    {isSelected && <span className="bg-[#00A651] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Terpilih</span>}
                                                                </div>
                                                                <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                                                                    <span className={`px-2 py-0.5 rounded uppercase ${item.type === 'asset' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>{item.type}</span>
                                                                    <span>• Total Stok: <strong className="text-gray-700">{item.sizes.reduce((sum, size) => sum + size.stock, 0)}</strong></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-transform duration-300 ${expandedItems[item.id] ? 'rotate-180 bg-[#00A651] border-[#00A651] text-white' : 'bg-white border-gray-200 text-gray-400'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div>
                                                    </div>
                                                    <div className={`transition-all duration-300 ease-in-out ${expandedItems[item.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                        <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50/50">
                                                            <p className="text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-wider mt-3">Tentukan Jumlah Pinjam per Ukuran</p>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                                {item.sizes.map(size => {
                                                                    const isOutOfStock = size.stock === 0;
                                                                    const currentVal = data.selected_items[item.id]?.[size.id] || '';
                                                                    return (
                                                                        <div key={size.id} className={`bg-white border p-3 rounded-xl flex items-center justify-between shadow-sm transition-colors ${currentVal > 0 ? 'border-[#00A651]' : 'border-gray-200'}`}>
                                                                            <div className="flex flex-col"><span className="text-sm font-bold text-gray-800">{size.size_name}</span><span className={`text-[10px] font-bold ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>Sisa: {size.stock}</span></div>
                                                                            <div className="w-20"><input type="number" min="0" max={size.stock} disabled={isOutOfStock} placeholder="0" value={currentVal} onChange={(e) => handleQuantityChange(item.id, size.id, e.target.value)} className={`w-full text-center border rounded-lg py-1.5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-all ${isOutOfStock ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : currentVal > 0 ? 'border-[#00A651] text-[#00A651] bg-green-50/30' : 'border-gray-300 text-gray-900'}`} /></div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN (SAMA SEPERTI SEBELUMNYA) */}
                        <div className="lg:col-span-4 relative">
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-white rounded-[20px] shadow-sm border border-[#00A651]/20 overflow-hidden flex flex-col">
                                    <div className="bg-[#00A651] px-6 py-4 flex items-center gap-3">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                        <h3 className="text-white font-bold text-lg">Ringkasan</h3>
                                    </div>
                                    <div className="p-6">
                                        {selectedSummary.totalItems === 0 ? (
                                            <div className="text-center py-6 flex flex-col items-center">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3"><svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>
                                                <p className="text-sm font-medium text-gray-500">Belum ada barang dipilih.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 mb-6">
                                                {selectedSummary.summary.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-start pb-4 border-b border-dashed border-gray-200 last:border-0 last:pb-0">
                                                        <div className="pr-4">
                                                            <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                                            <p className="text-xs font-medium text-gray-500 mt-0.5">{item.details}</p>
                                                        </div>
                                                        <div className="font-extrabold text-[#00A651] bg-green-50 px-2 py-1 rounded text-sm shrink-0">{item.total} item</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
                                            <span className="text-sm font-bold text-gray-600">Total Pinjaman</span>
                                            <span className="text-xl font-black text-gray-900">{selectedSummary.totalItems} <span className="text-sm font-bold text-gray-500">Pcs</span></span>
                                        </div>
                                        <button type="submit" disabled={processing || selectedSummary.totalItems === 0} className={`w-full py-3.5 rounded-full text-sm font-extrabold shadow-md transition-all flex justify-center items-center gap-2 transform hover:-translate-y-0.5 ${processing || selectedSummary.totalItems === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#00A651] hover:bg-[#008c44] text-white hover:shadow-lg'}`}>
                                            {processing ? 'MEMPROSES...' : 'AJUKAN SEKARANG'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}