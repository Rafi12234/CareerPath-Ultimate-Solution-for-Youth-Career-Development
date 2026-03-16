<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\CourseVideo;

class SetupCourseVideos extends Command
{
    protected $signature = 'setup:course-videos';
    protected $description = 'Create course videos tables and seed data';

    public function handle()
    {
        try {
            $this->info('Creating course_videos table...');
            DB::statement("
                CREATE TABLE IF NOT EXISTS course_videos (
                    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    course_id BIGINT UNSIGNED NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    url TEXT NOT NULL,
                    duration VARCHAR(50) NULL,
                    sequence INT NOT NULL,
                    description TEXT NULL,
                    created_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL,
                    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
                    INDEX idx_course_videos (course_id, sequence)
                )
            ");
            $this->comment('✓ course_videos table created');

            $this->info('Creating video_completions table...');
            DB::statement("
                CREATE TABLE IF NOT EXISTS video_completions (
                    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    user_id BIGINT UNSIGNED NOT NULL,
                    course_video_id BIGINT UNSIGNED NOT NULL,
                    completed_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL,
                    UNIQUE KEY unique_video_completion (user_id, course_video_id),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (course_video_id) REFERENCES course_videos(id) ON DELETE CASCADE
                )
            ");
            $this->comment('✓ video_completions table created');

            $this->info('Seeding videos...');
            $videos = [
                [1, 'Module 1: HTML & CSS Fundamentals', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616083/1_ddeqox.gif', '15 min', 1],
                [1, 'Module 2: JavaScript Essentials', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616122/22_kkhxw7.gif', '20 min', 2],
                [1, 'Module 3: React Introduction', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616115/20_xxg3kp.gif', '25 min', 3],
                [2, 'Lesson 1: Python Basics', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616115/18_spns1n.gif', '18 min', 1],
                [2, 'Lesson 2: Data Analysis with Pandas', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616115/19_q7pgyo.gif', '22 min', 2],
                [2, 'Lesson 3: ML Fundamentals', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616108/21_bcfoxs.gif', '28 min', 3],
                [3, 'Chapter 1: React Native Setup', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616108/16_i1oh17.gif', '16 min', 1],
                [3, 'Chapter 2: Components & Navigation', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616107/17_buw7zh.gif', '20 min', 2],
                [3, 'Chapter 3: API Integration', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616106/15_jdinpn.gif', '24 min', 3],
                [4, 'Section 1: Cloud Basics', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616101/27_sia76d.gif', '19 min', 1],
                [4, 'Section 2: AWS Services Overview', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616100/5_tklf74.gif', '23 min', 2],
                [4, 'Section 3: Deploying Applications', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616098/14_c9o5fw.gif', '26 min', 3],
                [5, 'Part 1: REST API Design', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616100/11_yvnscp.gif', '21 min', 1],
                [5, 'Part 2: Authentication & Authorization', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616098/12_upv5q0.gif', '25 min', 2],
                [5, 'Part 3: Testing & Deployment', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616098/9_fnfimt.gif', '28 min', 3],
                [6, 'Week 1: Design Principles', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616097/13_ynjjhx.gif', '17 min', 1],
                [6, 'Week 2: Wireframing & Prototyping', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616094/8_qydu8n.gif', '22 min', 2],
                [6, 'Week 3: User Testing', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616096/10_relyck.gif', '20 min', 3],
                [7, 'Topic 1: Network Security', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616091/4_ibpedn.gif', '24 min', 1],
                [7, 'Topic 2: Ethical Hacking Basics', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616092/23_gatjtt.gif', '27 min', 2],
                [7, 'Topic 3: Security Best Practices', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616092/7_iobsew.gif', '21 min', 3],
                [8, 'Lecture 1: Supervised Learning', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616091/6_iij53c.gif', '26 min', 1],
                [8, 'Lecture 2: Unsupervised Learning', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616090/3_pl33xs.gif', '23 min', 2],
                [8, 'Lecture 3: Neural Networks', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616088/26_kj4o6e.gif', '30 min', 3],
                [9, 'Strategy 1: SEO Masterclass', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616084/2_gewusx.gif', '19 min', 1],
                [9, 'Strategy 2: Social Media Marketing', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616085/24_urtiwu.gif', '21 min', 2],
                [9, 'Strategy 3: Analytics & Metrics', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616083/25_iz59bl.gif', '18 min', 3],
            ];

            $count = 0;
            foreach ($videos as $video) {
                DB::table('course_videos')->insert([
                    'course_id' => $video[0],
                    'title' => $video[1],
                    'url' => $video[2],
                    'duration' => $video[3],
                    'sequence' => $video[4],
                    'description' => 'Learn and master this course topic',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $count++;
            }
            
            $this->comment("✓ Seeded {$count} videos");
            $this->info('✅ Setup complete! Course video system is ready.');
            
        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            return 1;
        }
    }
}
