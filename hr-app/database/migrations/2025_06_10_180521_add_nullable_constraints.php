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
        // Allow reviews to exist before feedback & reviewer assignment
        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->unsignedBigInteger('reviewer_id')->nullable()->change();
            $table->longText('feedback')->nullable()->change();
        });

        // Allow leave requests before an HR worker picks them up
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->unsignedBigInteger('hr_worker_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->unsignedBigInteger('hr_worker_id')->nullable(false)->change();
        });

        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->unsignedBigInteger('reviewer_id')->nullable(false)->change();
            $table->longText('feedback')->nullable(false)->change();
        });
    }
};
