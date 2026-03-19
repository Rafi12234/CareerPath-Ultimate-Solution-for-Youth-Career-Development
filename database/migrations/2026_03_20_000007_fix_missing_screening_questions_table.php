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
        if (!Schema::hasTable('screening_questions')) {
            Schema::create('screening_questions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('job_id')->constrained('jobs')->onDelete('cascade');
                $table->text('question_text');
                $table->enum('question_type', ['text', 'yes_no', 'multiple_choice'])->default('text');
                $table->json('options')->nullable();
                $table->boolean('required')->default(true);
                $table->integer('order')->default(0);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('screening_questions')) {
            Schema::dropIfExists('screening_questions');
        }
    }
};
