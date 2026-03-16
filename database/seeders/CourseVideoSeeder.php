<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CourseVideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $urlBySequence = [
            1 => 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4',
            2 => 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4',
            3 => 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4',
        ];

        $videos = [
            // Course 1: Complete Web Development Bootcamp (3 videos)
            [
                'course_id' => 1,
                'title' => 'Module 1: HTML & CSS Fundamentals',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616083/1_ddeqox.gif',
                'duration' => '15 min',
                'sequence' => 1,
                'description' => 'Learn the basics of HTML structure and CSS styling',
            ],
            [
                'course_id' => 1,
                'title' => 'Module 2: JavaScript Essentials',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616122/22_kkhxw7.gif',
                'duration' => '20 min',
                'sequence' => 2,
                'description' => 'Master JavaScript fundamentals and DOM manipulation',
            ],
            [
                'course_id' => 1,
                'title' => 'Module 3: React Introduction',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616115/20_xxg3kp.gif',
                'duration' => '25 min',
                'sequence' => 3,
                'description' => 'Build your first React components',
            ],
            
            // Course 2: Python for Data Science & AI (3 videos)
            [
                'course_id' => 2,
                'title' => 'Lesson 1: Python Basics',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616115/18_spns1n.gif',
                'duration' => '18 min',
                'sequence' => 1,
                'description' => 'Introduction to Python programming',
            ],
            [
                'course_id' => 2,
                'title' => 'Lesson 2: Data Analysis with Pandas',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616115/19_q7pgyo.gif',
                'duration' => '22 min',
                'sequence' => 2,
                'description' => 'Data manipulation and analysis',
            ],
            [
                'course_id' => 2,
                'title' => 'Lesson 3: ML Fundamentals',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616108/21_bcfoxs.gif',
                'duration' => '28 min',
                'sequence' => 3,
                'description' => 'Introduction to Machine Learning concepts',
            ],
            
            // Course 3: Mobile App Development with React Native (3 videos)
            [
                'course_id' => 3,
                'title' => 'Chapter 1: React Native Setup',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616108/16_i1oh17.gif',
                'duration' => '16 min',
                'sequence' => 1,
                'description' => 'Set up your React Native environment',
            ],
            [
                'course_id' => 3,
                'title' => 'Chapter 2: Components & Navigation',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616107/17_buw7zh.gif',
                'duration' => '20 min',
                'sequence' => 2,
                'description' => 'Build mobile UI components',
            ],
            [
                'course_id' => 3,
                'title' => 'Chapter 3: API Integration',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616106/15_jdinpn.gif',
                'duration' => '24 min',
                'sequence' => 3,
                'description' => 'Connect your app to backend APIs',
            ],
            
            // Course 4: Cloud Computing & AWS Fundamentals (3 videos)
            [
                'course_id' => 4,
                'title' => 'Section 1: Cloud Basics',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616101/27_sia76d.gif',
                'duration' => '19 min',
                'sequence' => 1,
                'description' => 'Understanding cloud computing',
            ],
            [
                'course_id' => 4,
                'title' => 'Section 2: AWS Services Overview',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616100/5_tklf74.gif',
                'duration' => '23 min',
                'sequence' => 2,
                'description' => 'Explore EC2, S3, Lambda services',
            ],
            [
                'course_id' => 4,
                'title' => 'Section 3: Deploying Applications',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616098/14_c9o5fw.gif',
                'duration' => '26 min',
                'sequence' => 3,
                'description' => 'Deploy applications on AWS',
            ],
            
            // Course 5: Advanced Laravel API Development (3 videos)
            [
                'course_id' => 5,
                'title' => 'Part 1: REST API Design',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616100/11_yvnscp.gif',
                'duration' => '21 min',
                'sequence' => 1,
                'description' => 'Design scalable REST APIs',
            ],
            [
                'course_id' => 5,
                'title' => 'Part 2: Authentication & Authorization',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616098/12_upv5q0.gif',
                'duration' => '25 min',
                'sequence' => 2,
                'description' => 'Secure your APIs with auth',
            ],
            [
                'course_id' => 5,
                'title' => 'Part 3: Testing & Deployment',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616098/9_fnfimt.gif',
                'duration' => '28 min',
                'sequence' => 3,
                'description' => 'Test and deploy Laravel APIs',
            ],
            
            // Course 6: UI/UX Design Masterclass (3 videos)
            [
                'course_id' => 6,
                'title' => 'Week 1: Design Principles',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616097/13_ynjjhx.gif',
                'duration' => '17 min',
                'sequence' => 1,
                'description' => 'Learn fundamental design principles',
            ],
            [
                'course_id' => 6,
                'title' => 'Week 2: Wireframing & Prototyping',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616094/8_qydu8n.gif',
                'duration' => '22 min',
                'sequence' => 2,
                'description' => 'Create wireframes with Figma',
            ],
            [
                'course_id' => 6,
                'title' => 'Week 3: User Testing',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616096/10_relyck.gif',
                'duration' => '20 min',
                'sequence' => 3,
                'description' => 'Conduct user testing sessions',
            ],
            
            // Course 7: Cybersecurity Essentials (3 videos)
            [
                'course_id' => 7,
                'title' => 'Topic 1: Network Security',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616091/4_ibpedn.gif',
                'duration' => '24 min',
                'sequence' => 1,
                'description' => 'Protect network infrastructure',
            ],
            [
                'course_id' => 7,
                'title' => 'Topic 2: Ethical Hacking Basics',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616092/23_gatjtt.gif',
                'duration' => '27 min',
                'sequence' => 2,
                'description' => 'Penetration testing fundamentals',
            ],
            [
                'course_id' => 7,
                'title' => 'Topic 3: Security Best Practices',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616092/7_iobsew.gif',
                'duration' => '21 min',
                'sequence' => 3,
                'description' => 'Implement security policies',
            ],
            
            // Course 8: Machine Learning A-Z (3 videos)
            [
                'course_id' => 8,
                'title' => 'Lecture 1: Supervised Learning',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616091/6_iij53c.gif',
                'duration' => '26 min',
                'sequence' => 1,
                'description' => 'Classification and regression',
            ],
            [
                'course_id' => 8,
                'title' => 'Lecture 2: Unsupervised Learning',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616090/3_pl33xs.gif',
                'duration' => '23 min',
                'sequence' => 2,
                'description' => 'Clustering and dimensionality reduction',
            ],
            [
                'course_id' => 8,
                'title' => 'Lecture 3: Neural Networks',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616088/26_kj4o6e.gif',
                'duration' => '30 min',
                'sequence' => 3,
                'description' => 'Deep learning fundamentals',
            ],
            
            // Course 9: Digital Marketing for Tech Products (3 videos)
            [
                'course_id' => 9,
                'title' => 'Strategy 1: SEO Masterclass',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616084/2_gewusx.gif',
                'duration' => '19 min',
                'sequence' => 1,
                'description' => 'Search engine optimization techniques',
            ],
            [
                'course_id' => 9,
                'title' => 'Strategy 2: Social Media Marketing',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616085/24_urtiwu.gif',
                'duration' => '21 min',
                'sequence' => 2,
                'description' => 'Build your social media presence',
            ],
            [
                'course_id' => 9,
                'title' => 'Strategy 3: Analytics & Metrics',
                'url' => 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616083/25_iz59bl.gif',
                'duration' => '18 min',
                'sequence' => 3,
                'description' => 'Measure marketing success',
            ],
        ];

        foreach ($videos as &$video) {
            $seq = (int) ($video['sequence'] ?? 0);
            if (isset($urlBySequence[$seq])) {
                $video['url'] = $urlBySequence[$seq];
            }
        }
        unset($video);

        foreach ($videos as $video) {
            DB::table('course_videos')->insert(array_merge($video, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
