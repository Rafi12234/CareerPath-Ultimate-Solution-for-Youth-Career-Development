<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('career_roadmaps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('target_job_title');
            $table->json('skills_snapshot')->nullable();
            $table->text('guidance_text')->nullable();
            $table->longText('ai_response');
            $table->json('roadmap_json')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('career_roadmaps');
    }
};
