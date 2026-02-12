<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('user_role');
            $table->string('session_id'); // For Req 2 & 3 (Session tracking)
            $table->string('ip_address_id')->nullable(); // Extracted from URL for Req 2
            $table->string('action');     // e.g., 'LOGIN', 'UPDATE_IP', 'DELETE_IP'
            $table->json('request_data')->nullable(); // The "Change Request" payload
            $table->string('url');
            $table->string('method');
            $table->string('ip_origin');  // The physical IP of the requester
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
