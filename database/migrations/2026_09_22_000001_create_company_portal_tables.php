<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('industry')->nullable();
            $table->string('website', 2048)->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('email')->nullable();
            $table->string('location')->nullable();
            $table->string('company_size', 100)->nullable();
            $table->text('description')->nullable();
            $table->string('logo_url', 2048)->nullable();
            $table->unsignedSmallInteger('founded_year')->nullable();
            $table->enum('status', ['active', 'suspended'])->default('active');
            $table->timestamps();
        });

        Schema::table('jobs', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->after('id')->constrained('companies')->nullOnDelete();
            $table->enum('status', ['draft', 'published', 'closed'])->default('published')->after('skills');
            $table->date('application_deadline')->nullable()->after('status');
            $table->unsignedInteger('vacancies')->default(1)->after('application_deadline');
            $table->index(['company_id', 'status']);
            $table->index('application_deadline');
        });

        Schema::table('job_applications', function (Blueprint $table) {
            $table->text('company_notes')->nullable()->after('application_notes');
            $table->timestamp('reviewed_at')->nullable()->after('submitted_at');
        });
    }

    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn(['company_notes', 'reviewed_at']);
        });
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropIndex(['company_id', 'status']);
            $table->dropIndex(['application_deadline']);
            $table->dropColumn(['company_id', 'status', 'application_deadline', 'vacancies']);
        });
        Schema::dropIfExists('companies');
    }
};
