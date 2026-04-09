<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    // 1. UNTUK USER: Menyimpan pesan yang dikirim dari halaman Contact Us
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        ContactMessage::create($request->all());

        // Kembalikan ke halaman sebelumnya dengan notifikasi sukses
        return back()->with('success', 'Pesan Anda berhasil dikirim! Tim Admin HSSE akan segera meninjaunya.');
    }

    // 2. UNTUK ADMIN: Menampilkan daftar pesan di Dashboard
    public function index()
    {
        // Ambil semua pesan, urutkan dari yang paling baru, dan potong 10 per halaman
        $messages = ContactMessage::latest()->paginate(10);

        return Inertia::render('Dashboard/Messages', [
            'messages' => $messages
        ]);
    }

    // 3. UNTUK ADMIN: Mengubah status pesan menjadi "Sudah Dibaca"
    public function markAsRead($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['is_read' => true]);

        return back();
    }

    // 4. UNTUK ADMIN: Menghapus Pesan secara permanen
    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return back()->with('success', 'Pesan berhasil dihapus.');
    }
}
