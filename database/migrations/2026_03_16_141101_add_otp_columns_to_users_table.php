<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('email_otp')->nullable()->after('email_verified_at');
            $table->string('phone_otp')->nullable()->after('phone');
            $table->timestamp('phone_verified_at')->nullable()->after('phone_otp');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['email_otp', 'phone_otp', 'phone_verified_at']);
        });
    }
};