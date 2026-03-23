<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('location')->nullable()->after('nationality');
            $table->text('bio')->nullable()->after('location');
            $table->string('headline')->nullable()->after('bio');
            $table->string('education_board', 50)->nullable()->after('ssc_board');
            $table->string('education_group', 50)->nullable()->after('education_board');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'location',
                'bio',
                'headline',
                'education_board',
                'education_group',
            ]);
        });
    }
};
