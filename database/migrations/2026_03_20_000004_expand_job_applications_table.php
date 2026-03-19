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
        Schema::table('job_applications', function (Blueprint $table) {
            // Personal Information JSON
            $table->json('personal_info')->nullable()->after('applied_at');

            // Resume/CV upload path
            $table->string('resume_path')->nullable()->after('personal_info');

            // Work Experience from profile (snapshot)
            $table->json('work_experience')->nullable()->after('resume_path');

            // Education from profile (snapshot)
            $table->json('education_info')->nullable()->after('work_experience');

            // Skills from profile (snapshot)
            $table->json('skills')->nullable()->after('education_info');

            // Cover Letter
            $table->longText('cover_letter')->nullable()->after('skills');

            // Additional Documents (URLs/paths)
            $table->json('additional_documents')->nullable()->after('cover_letter'); // portfolio_url, certificates, etc.

            // Work Eligibility Information
            $table->json('work_eligibility')->nullable()->after('additional_documents');

            // References
            $table->json('references')->nullable()->after('work_eligibility');

            // Online Profiles
            $table->json('online_profiles')->nullable()->after('references'); // linkedin, portfolio, github

            // Overall Application Notes/Comments
            $table->text('application_notes')->nullable()->after('online_profiles');

            // Submitted timestamp (completed_at)
            $table->timestamp('submitted_at')->nullable()->after('application_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn([
                'personal_info',
                'resume_path',
                'work_experience',
                'education_info',
                'skills',
                'cover_letter',
                'additional_documents',
                'work_eligibility',
                'references',
                'online_profiles',
                'application_notes',
                'submitted_at',
            ]);
        });
    }
};
