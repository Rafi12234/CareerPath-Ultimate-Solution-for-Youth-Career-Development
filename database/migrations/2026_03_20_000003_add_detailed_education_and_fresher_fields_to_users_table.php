<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('school_name')->nullable()->after('previous_job_description');
            $table->unsignedSmallInteger('ssc_year')->nullable()->after('school_name');
            $table->string('ssc_result', 100)->nullable()->after('ssc_year');
            $table->string('ssc_group', 50)->nullable()->after('ssc_result');
            $table->string('ssc_board', 50)->nullable()->after('ssc_group');

            $table->string('college_name')->nullable()->after('ssc_board');
            $table->unsignedSmallInteger('hsc_year')->nullable()->after('college_name');
            $table->string('hsc_result', 100)->nullable()->after('hsc_year');
            $table->string('hsc_group', 50)->nullable()->after('hsc_result');
            $table->string('hsc_board', 50)->nullable()->after('hsc_group');

            $table->string('university_name')->nullable()->after('hsc_board');
            $table->string('university_status', 20)->nullable()->after('university_name');
            $table->unsignedTinyInteger('current_study_year')->nullable()->after('university_status');
            $table->unsignedTinyInteger('current_study_semester')->nullable()->after('current_study_year');
            $table->unsignedSmallInteger('university_graduation_year')->nullable()->after('current_study_semester');
            $table->decimal('university_cgpa', 3, 2)->nullable()->after('university_graduation_year');

            $table->boolean('is_fresher')->default(true)->after('university_cgpa');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'school_name',
                'ssc_year',
                'ssc_result',
                'ssc_group',
                'ssc_board',
                'college_name',
                'hsc_year',
                'hsc_result',
                'hsc_group',
                'hsc_board',
                'university_name',
                'university_status',
                'current_study_year',
                'current_study_semester',
                'university_graduation_year',
                'university_cgpa',
                'is_fresher',
            ]);
        });
    }
};
