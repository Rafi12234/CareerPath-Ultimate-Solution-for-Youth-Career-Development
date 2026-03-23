<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->string('cover_image', 2048)->nullable()->after('level');
        });

        $defaultImages = [
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=700&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=700&fit=crop',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=700&fit=crop',
            'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=700&fit=crop',
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=700&fit=crop',
        ];

        $courses = DB::table('courses')->select('id', 'cover_image')->orderBy('id')->get();

        foreach ($courses as $index => $course) {
            if (!empty($course->cover_image)) {
                continue;
            }

            DB::table('courses')
                ->where('id', $course->id)
                ->update(['cover_image' => $defaultImages[$index % count($defaultImages)]]);
        }
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn('cover_image');
        });
    }
};
