<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('avatar');
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->string('gender', 20)->nullable()->after('date_of_birth');
            $table->string('marital_status', 30)->nullable()->after('gender');
            $table->string('nationality')->nullable()->after('marital_status');
            $table->text('present_address')->nullable()->after('nationality');
            $table->text('permanent_address')->nullable()->after('present_address');
            $table->string('highest_education')->nullable()->after('permanent_address');
            $table->string('institution_name')->nullable()->after('highest_education');
            $table->string('field_of_study')->nullable()->after('institution_name');
            $table->unsignedSmallInteger('graduation_year')->nullable()->after('field_of_study');
            $table->string('result_grade', 100)->nullable()->after('graduation_year');
            $table->unsignedTinyInteger('years_of_experience')->nullable()->after('result_grade');
            $table->string('current_job_title')->nullable()->after('years_of_experience');
            $table->string('current_company')->nullable()->after('current_job_title');
            $table->string('previous_job_title')->nullable()->after('current_company');
            $table->string('previous_company')->nullable()->after('previous_job_title');
            $table->date('previous_job_start')->nullable()->after('previous_company');
            $table->date('previous_job_end')->nullable()->after('previous_job_start');
            $table->text('previous_job_description')->nullable()->after('previous_job_end');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'date_of_birth',
                'gender',
                'marital_status',
                'nationality',
                'present_address',
                'permanent_address',
                'highest_education',
                'institution_name',
                'field_of_study',
                'graduation_year',
                'result_grade',
                'years_of_experience',
                'current_job_title',
                'current_company',
                'previous_job_title',
                'previous_company',
                'previous_job_start',
                'previous_job_end',
                'previous_job_description',
            ]);
        });
    }
};
