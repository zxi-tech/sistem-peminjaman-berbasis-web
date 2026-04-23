<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Kode Verifikasi HSSE</title>
    <style>
        /* Outlook sering butuh CSS inline, tapi kita sediakan basic styling di sini */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f5fa;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
        }

        .header {
            background-color: #ffffff;
            padding: 25px 30px;
            border-bottom: 2px solid #f3f4f6;
            text-align: center;
        }

        .header img {
            max-height: 45px;
        }

        .content {
            padding: 30px;
            color: #374151;
            line-height: 1.6;
            font-size: 15px;
        }

        .otp-box {
            background: linear-gradient(135deg, #21409A 0%, #1a3380 100%);
            color: #ffffff;
            text-align: center;
            padding: 20px;
            margin: 25px 0;
            border-radius: 12px;
            letter-spacing: 8px;
            font-size: 32px;
            font-weight: bold;
        }

        .warning {
            background-color: #FEF2F2;
            border-left: 4px solid #ED1C24;
            padding: 15px;
            margin-top: 25px;
            font-size: 13px;
            color: #991B1B;
            border-radius: 4px;
        }

        .footer {
            background-color: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }

        .footer-logo {
            font-weight: bold;
            color: #21409A;
            margin-bottom: 5px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <img src="https://via.placeholder.com/200x50/ffffff/21409A?text=PERTAMINA+GEOTHERMAL+ENERGY" alt="Pertamina Geothermal Energy">
        </div>

        <div class="content">
            <p>Yth. <strong>Bapak/Ibu Pendaftar</strong>,</p>
            <p>Terima kasih telah melakukan registrasi pada <strong>Sistem Peminjaman Barang & APD HSSE</strong>. Untuk melanjutkan proses registrasi dan memverifikasi alamat email Anda, silakan masukkan kode <i>One-Time Password</i> (OTP) berikut:</p>

            <div class="otp-box">
                {{ $otp }}
            </div>

            <p>Kode ini hanya berlaku selama <strong>5 menit</strong>. Jika Anda tidak merasa melakukan registrasi di sistem HSSE, silakan abaikan email ini.</p>

            <div class="warning">
                <strong>⚠️ PERINGATAN KEAMANAN:</strong> Jangan pernah memberikan kode OTP ini kepada siapa pun, termasuk kepada pihak yang mengaku sebagai Admin HSSE atau IT Support.
            </div>
        </div>

        <div class="footer">
            <div class="footer-logo">HSSE Department - PT Pertamina Geothermal Energy</div>
            <p>Email ini dikirim secara otomatis oleh sistem. Harap tidak membalas email ini.</p>
            <p>&copy; {{ date('Y') }} Hak Cipta Dilindungi.</p>
        </div>
    </div>
</body>

</html>