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
        Schema::table('course_videos', function (Blueprint $table) {
            // Ensure course_id foreign key exists
            if (!Schema::hasColumn('course_videos', 'course_id')) {
                $table->unsignedBigInteger('course_id')->after('id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This is a seeding migration, no rollback needed
    }
};
