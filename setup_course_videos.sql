-- Create course_videos table
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
);

-- Create video_completions table
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
);

-- Insert all 27 videos
INSERT INTO course_videos (course_id, title, url, duration, sequence, description, created_at, updated_at) VALUES
-- Course 1: Complete Web Development Bootcamp (3 videos)
(1, 'Module 1: HTML & CSS Fundamentals', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616083/1_ddeqox.gif', '15 min', 1, 'Learn the basics of HTML structure and CSS styling', NOW(), NOW()),
(1, 'Module 2: JavaScript Essentials', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616122/22_kkhxw7.gif', '20 min', 2, 'Master JavaScript fundamentals and DOM manipulation', NOW(), NOW()),
(1, 'Module 3: React Introduction', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616115/20_xxg3kp.gif', '25 min', 3, 'Build your first React components', NOW(), NOW()),

-- Course 2: Python for Data Science & AI (3 videos)
(2, 'Lesson 1: Python Basics', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616115/18_spns1n.gif', '18 min', 1, 'Introduction to Python programming', NOW(), NOW()),
(2, 'Lesson 2: Data Analysis with Pandas', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616115/19_q7pgyo.gif', '22 min', 2, 'Data manipulation and analysis', NOW(), NOW()),
(2, 'Lesson 3: ML Fundamentals', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616108/21_bcfoxs.gif', '28 min', 3, 'Introduction to Machine Learning concepts', NOW(), NOW()),

-- Course 3: Mobile App Development with React Native (3 videos)
(3, 'Chapter 1: React Native Setup', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616108/16_i1oh17.gif', '16 min', 1, 'Set up your React Native environment', NOW(), NOW()),
(3, 'Chapter 2: Components & Navigation', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616107/17_buw7zh.gif', '20 min', 2, 'Build mobile UI components', NOW(), NOW()),
(3, 'Chapter 3: API Integration', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616106/15_jdinpn.gif', '24 min', 3, 'Connect your app to backend APIs', NOW(), NOW()),

-- Course 4: Cloud Computing & AWS Fundamentals (3 videos)
(4, 'Section 1: Cloud Basics', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616101/27_sia76d.gif', '19 min', 1, 'Understanding cloud computing', NOW(), NOW()),
(4, 'Section 2: AWS Services Overview', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616100/5_tklf74.gif', '23 min', 2, 'Explore EC2, S3, Lambda services', NOW(), NOW()),
(4, 'Section 3: Deploying Applications', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616098/14_c9o5fw.gif', '26 min', 3, 'Deploy applications on AWS', NOW(), NOW()),

-- Course 5: Advanced Laravel API Development (3 videos)
(5, 'Part 1: REST API Design', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616100/11_yvnscp.gif', '21 min', 1, 'Design scalable REST APIs', NOW(), NOW()),
(5, 'Part 2: Authentication & Authorization', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616098/12_upv5q0.gif', '25 min', 2, 'Secure your APIs with auth', NOW(), NOW()),
(5, 'Part 3: Testing & Deployment', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616098/9_fnfimt.gif', '28 min', 3, 'Test and deploy Laravel APIs', NOW(), NOW()),

-- Course 6: UI/UX Design Masterclass (3 videos)
(6, 'Week 1: Design Principles', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616097/13_ynjjhx.gif', '17 min', 1, 'Learn fundamental design principles', NOW(), NOW()),
(6, 'Week 2: Wireframing & Prototyping', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616094/8_qydu8n.gif', '22 min', 2, 'Create wireframes with Figma', NOW(), NOW()),
(6, 'Week 3: User Testing', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616096/10_relyck.gif', '20 min', 3, 'Conduct user testing sessions', NOW(), NOW()),

-- Course 7: Cybersecurity Essentials (3 videos)
(7, 'Topic 1: Network Security', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616091/4_ibpedn.gif', '24 min', 1, 'Protect network infrastructure', NOW(), NOW()),
(7, 'Topic 2: Ethical Hacking Basics', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616092/23_gatjtt.gif', '27 min', 2, 'Penetration testing fundamentals', NOW(), NOW()),
(7, 'Topic 3: Security Best Practices', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616092/7_iobsew.gif', '21 min', 3, 'Implement security policies', NOW(), NOW()),

-- Course 8: Machine Learning A-Z (3 videos)
(8, 'Lecture 1: Supervised Learning', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616091/6_iij53c.gif', '26 min', 1, 'Classification and regression', NOW(), NOW()),
(8, 'Lecture 2: Unsupervised Learning', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616090/3_pl33xs.gif', '23 min', 2, 'Clustering and dimensionality reduction', NOW(), NOW()),
(8, 'Lecture 3: Neural Networks', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616088/26_kj4o6e.gif', '30 min', 3, 'Deep learning fundamentals', NOW(), NOW()),

-- Course 9: Digital Marketing for Tech Products (3 videos)
(9, 'Strategy 1: SEO Masterclass', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616084/2_gewusx.gif', '19 min', 1, 'Search engine optimization techniques', NOW(), NOW()),
(9, 'Strategy 2: Social Media Marketing', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616085/24_urtiwu.gif', '21 min', 2, 'Build your social media presence', NOW(), NOW()),
(9, 'Strategy 3: Analytics & Metrics', 'https://res.cloudinary.com/dnzjg9lq8/image/upload/v1773616083/25_iz59bl.gif', '18 min', 3, 'Measure marketing success', NOW(), NOW());