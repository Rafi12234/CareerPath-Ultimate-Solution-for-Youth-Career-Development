-- ============================================================
-- CareerPath — Complete Database Setup
-- ============================================================
-- This single file creates the database, ALL tables,
-- foreign keys, and seed data from scratch.
-- Run this once in MySQL Workbench and everything will work.
-- ============================================================

-- Create database (if not exists) and switch to it
CREATE DATABASE IF NOT EXISTS cse3100_testA1;
USE cse3100_testA1;

-- Disable safe-update mode and FK checks for clean setup
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- DROP existing tables (clean slate)
-- ============================================================
DROP TABLE IF EXISTS video_completions;
DROP TABLE IF EXISTS course_videos;
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS personal_access_tokens;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS failed_jobs;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. users
-- ============================================================
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500) NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- ============================================================
-- 2. password_reset_tokens
-- ============================================================
CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL
);

-- ============================================================
-- 3. failed_jobs  (Laravel queue system)
-- ============================================================
CREATE TABLE failed_jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload LONGTEXT NOT NULL,
    exception LONGTEXT NOT NULL,
    failed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. personal_access_tokens  (Laravel Sanctum)
-- ============================================================
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX personal_access_tokens_tokenable_type_tokenable_id_index (tokenable_type, tokenable_id)
);

-- ============================================================
-- 5. posts  (user blog posts)
-- ============================================================
CREATE TABLE posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 6. jobs  (job listings)
-- ============================================================
CREATE TABLE jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) DEFAULT 'Remote',
    type VARCHAR(255) DEFAULT 'Full-time',
    level VARCHAR(255) DEFAULT 'Entry Level',
    description TEXT NULL,
    salary_min INT NULL,
    salary_max INT NULL,
    track VARCHAR(255) NULL,
    skills JSON NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- ============================================================
-- 7. courses
-- ============================================================
CREATE TABLE courses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    topic VARCHAR(255) NULL,
    instructor VARCHAR(255) NULL,
    duration VARCHAR(255) NULL,
    level VARCHAR(255) DEFAULT 'Beginner',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- ============================================================
-- 8. enrollments  (user ↔ course)
-- ============================================================
CREATE TABLE enrollments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    course_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY unique_enrollment (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ============================================================
-- 9. user_skills  (user profile skills)
-- ============================================================
CREATE TABLE user_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    proficiency ENUM('Beginner', 'Intermediate', 'Expert', 'Professional') DEFAULT 'Beginner',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_skill (user_id, skill_name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 10. job_applications  (user ↔ job)
-- ============================================================
CREATE TABLE job_applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    job_id BIGINT UNSIGNED NOT NULL,
    status ENUM('Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected') DEFAULT 'Pending',
    applied_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_application (user_id, job_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- ============================================================
-- 11. contacts  (contact-us form messages)
-- ============================================================
CREATE TABLE contacts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- ============================================================
-- 12. chat_messages  (AI chatbot conversation history)
-- ============================================================
CREATE TABLE chat_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    user_message TEXT NOT NULL,
    bot_reply TEXT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_chat_user (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 13. course_videos  (videos for each course)
-- ============================================================
CREATE TABLE course_videos (
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

-- ============================================================
-- 14. video_completions  (track user progress)
-- ============================================================
CREATE TABLE video_completions (
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


-- ############################################################
--                     SEED DATA
-- ############################################################

-- ============================================================
-- Seed: users
-- Password for all seeded users is: password123
-- (bcrypt hash of "password123")
-- ============================================================
INSERT INTO users (name, email, password, created_at, updated_at) VALUES
('Alice Johnson', 'alice@example.com', '$2y$12$B/67T1Tqi5E1GZS8diwCF.qfwRL4A/9REmU3q1q1Nobio9Zv2SGPa', NOW(), NOW()),
('Bob Rahman', 'bob@example.com', '$2y$12$B/67T1Tqi5E1GZS8diwCF.qfwRL4A/9REmU3q1q1Nobio9Zv2SGPa', NOW(), NOW()),
('Fatema Akter', 'fatema@example.com', '$2y$12$B/67T1Tqi5E1GZS8diwCF.qfwRL4A/9REmU3q1q1Nobio9Zv2SGPa', NOW(), NOW());

-- ============================================================
-- Seed: posts
-- ============================================================
INSERT INTO posts (user_id, title, content, created_at, updated_at) VALUES
(1, 'My First Post', 'This is the content of my first post.', NOW(), NOW()),
(1, 'Getting Started with React', 'React is a JavaScript library for building user interfaces. Here are my thoughts after learning it...', NOW(), NOW()),
(2, 'Laravel Tips & Tricks', 'Some useful Laravel patterns I have discovered while building APIs.', NOW(), NOW());

-- ============================================================
-- Seed: jobs  (10 jobs)
-- ============================================================
INSERT INTO jobs (title, company, location, type, level, description, salary_min, salary_max, track, skills, created_at, updated_at) VALUES
('Junior Frontend Developer', 'TechBD Solutions', 'Dhaka, Bangladesh', 'Full-time', 'Entry Level', 'Build responsive UIs using React and modern CSS frameworks. Work with our design team to implement pixel-perfect interfaces.', 25000, 45000, 'Software Engineering', '["React", "JavaScript", "CSS", "HTML", "Tailwind CSS"]', NOW(), NOW()),
('Backend Developer', 'DataSoft Systems', 'Chittagong, Bangladesh', 'Full-time', 'Mid Level', 'Design and implement RESTful APIs using Laravel. Optimize database queries and manage deployment pipelines.', 50000, 80000, 'Software Engineering', '["PHP", "Laravel", "MySQL", "REST API", "Docker"]', NOW(), NOW()),
('Data Analyst Intern', 'Grameenphone', 'Dhaka, Bangladesh', 'Internship', 'Entry Level', 'Analyze customer data patterns, create dashboards, and support data-driven business decisions.', 15000, 25000, 'Data Science', '["Python", "SQL", "Excel", "Power BI", "Statistics"]', NOW(), NOW()),
('Machine Learning Engineer', 'Pathao', 'Dhaka, Bangladesh', 'Full-time', 'Senior', 'Build and deploy ML models for route optimization and demand forecasting. Lead a team of data scientists.', 100000, 150000, 'Data Science', '["Python", "TensorFlow", "PyTorch", "MLOps", "AWS"]', NOW(), NOW()),
('UI/UX Designer', 'Sheba.xyz', 'Remote', 'Remote', 'Mid Level', 'Create user-centered designs for mobile and web applications. Conduct user research and usability testing.', 40000, 70000, 'Design', '["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"]', NOW(), NOW()),
('DevOps Engineer', 'bKash', 'Dhaka, Bangladesh', 'Full-time', 'Mid Level', 'Manage CI/CD pipelines, containerized deployments, and cloud infrastructure for high-traffic fintech applications.', 70000, 120000, 'Software Engineering', '["Docker", "Kubernetes", "AWS", "Jenkins", "Linux"]', NOW(), NOW()),
('Mobile App Developer', 'Chaldal', 'Dhaka, Bangladesh', 'Full-time', 'Entry Level', 'Develop cross-platform mobile applications using React Native. Collaborate with backend team for API integration.', 30000, 55000, 'Software Engineering', '["React Native", "JavaScript", "TypeScript", "REST API", "Git"]', NOW(), NOW()),
('Cybersecurity Analyst', 'BRAC IT', 'Dhaka, Bangladesh', 'Full-time', 'Mid Level', 'Monitor security threats, conduct vulnerability assessments, and implement security best practices across the organization.', 60000, 95000, 'Cybersecurity', '["Network Security", "SIEM", "Penetration Testing", "Linux", "Python"]', NOW(), NOW()),
('Full Stack Developer', 'Selise Digital Platforms', 'Remote', 'Remote', 'Senior', 'Lead full-stack development projects using modern frameworks. Mentor junior developers and conduct code reviews.', 90000, 140000, 'Software Engineering', '["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"]', NOW(), NOW()),
('Content Writer - Tech', 'Bohubrihi', 'Remote', 'Part-time', 'Entry Level', 'Write engaging technical content for online courses and blog posts. Research trending technologies and create learning materials.', 15000, 30000, 'Content & Marketing', '["Technical Writing", "SEO", "Research", "Content Strategy", "WordPress"]', NOW(), NOW());

-- ============================================================
-- Seed: courses  (9 courses)
-- ============================================================
INSERT INTO courses (name, description, topic, instructor, duration, level, created_at, updated_at) VALUES
('Complete Web Development Bootcamp', 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB in this comprehensive bootcamp. Build 10+ real-world projects.', 'Web Development', 'Dr. Kamal Hossain', '12 weeks', 'Beginner', NOW(), NOW()),
('Python for Data Science & AI', 'Master Python programming with focus on data analysis, visualization, and machine learning fundamentals using pandas, numpy, and scikit-learn.', 'Data Science', 'Prof. Nusrat Jahan', '8 weeks', 'Intermediate', NOW(), NOW()),
('Mobile App Development with React Native', 'Build cross-platform mobile applications for iOS and Android using React Native and Expo. Publish your app to stores.', 'Mobile Development', 'Eng. Rafiq Ahmed', '10 weeks', 'Beginner', NOW(), NOW()),
('Cloud Computing & AWS Fundamentals', 'Get started with cloud computing concepts and hands-on AWS services including EC2, S3, Lambda, and DynamoDB.', 'Cloud Computing', 'Dr. Fatema Akhter', '6 weeks', 'Beginner', NOW(), NOW()),
('Advanced Laravel API Development', 'Deep dive into building scalable REST APIs with Laravel, including authentication, testing, and deployment strategies.', 'Backend Development', 'Eng. Tanvir Islam', '8 weeks', 'Advanced', NOW(), NOW()),
('UI/UX Design Masterclass', 'Learn user-centered design principles, wireframing, prototyping with Figma, and design thinking methodology.', 'Design', 'Anika Rahman', '6 weeks', 'Beginner', NOW(), NOW()),
('Cybersecurity Essentials', 'Understand network security, ethical hacking basics, and security best practices for modern applications.', 'Cybersecurity', 'Prof. Mohammad Ali', '8 weeks', 'Intermediate', NOW(), NOW()),
('Machine Learning A-Z', 'Comprehensive ML course covering supervised and unsupervised learning, neural networks, and model deployment.', 'Artificial Intelligence', 'Dr. Shirin Akter', '14 weeks', 'Advanced', NOW(), NOW()),
('Digital Marketing for Tech Products', 'Learn SEO, social media marketing, content strategy, and analytics for technology products and startups.', 'Marketing', 'Farhana Sultana', '4 weeks', 'Beginner', NOW(), NOW());

-- ============================================================
-- Seed: course_videos  (27 videos distributed across 9 courses)
-- ============================================================
INSERT INTO course_videos (course_id, title, url, duration, sequence, description, created_at, updated_at) VALUES
-- Course 1: Complete Web Development Bootcamp (3 videos)
(1, 'Module 1: HTML & CSS Fundamentals', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '15 min', 1, 'Learn the basics of HTML structure and CSS styling', NOW(), NOW()),
(1, 'Module 2: JavaScript Essentials', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '20 min', 2, 'Master JavaScript fundamentals and DOM manipulation', NOW(), NOW()),
(1, 'Module 3: React Introduction', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '25 min', 3, 'Build your first React components', NOW(), NOW()),

-- Course 2: Python for Data Science & AI (3 videos)
(2, 'Lesson 1: Python Basics', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '18 min', 1, 'Introduction to Python programming', NOW(), NOW()),
(2, 'Lesson 2: Data Analysis with Pandas', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '22 min', 2, 'Data manipulation and analysis', NOW(), NOW()),
(2, 'Lesson 3: ML Fundamentals', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '28 min', 3, 'Introduction to Machine Learning concepts', NOW(), NOW()),

-- Course 3: Mobile App Development with React Native (3 videos)
(3, 'Chapter 1: React Native Setup', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '16 min', 1, 'Set up your React Native environment', NOW(), NOW()),
(3, 'Chapter 2: Components & Navigation', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '20 min', 2, 'Build mobile UI components', NOW(), NOW()),
(3, 'Chapter 3: API Integration', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '24 min', 3, 'Connect your app to backend APIs', NOW(), NOW()),

-- Course 4: Cloud Computing & AWS Fundamentals (3 videos)
(4, 'Section 1: Cloud Basics', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '19 min', 1, 'Understanding cloud computing', NOW(), NOW()),
(4, 'Section 2: AWS Services Overview', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '23 min', 2, 'Explore EC2, S3, Lambda services', NOW(), NOW()),
(4, 'Section 3: Deploying Applications', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '26 min', 3, 'Deploy applications on AWS', NOW(), NOW()),

-- Course 5: Advanced Laravel API Development (3 videos)
(5, 'Part 1: REST API Design', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '21 min', 1, 'Design scalable REST APIs', NOW(), NOW()),
(5, 'Part 2: Authentication & Authorization', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '25 min', 2, 'Secure your APIs with auth', NOW(), NOW()),
(5, 'Part 3: Testing & Deployment', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '28 min', 3, 'Test and deploy Laravel APIs', NOW(), NOW()),

-- Course 6: UI/UX Design Masterclass (3 videos)
(6, 'Week 1: Design Principles', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '17 min', 1, 'Learn fundamental design principles', NOW(), NOW()),
(6, 'Week 2: Wireframing & Prototyping', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '22 min', 2, 'Create wireframes with Figma', NOW(), NOW()),
(6, 'Week 3: User Testing', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '20 min', 3, 'Conduct user testing sessions', NOW(), NOW()),

-- Course 7: Cybersecurity Essentials (3 videos)
(7, 'Topic 1: Network Security', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '24 min', 1, 'Protect network infrastructure', NOW(), NOW()),
(7, 'Topic 2: Ethical Hacking Basics', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '27 min', 2, 'Penetration testing fundamentals', NOW(), NOW()),
(7, 'Topic 3: Security Best Practices', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '21 min', 3, 'Implement security policies', NOW(), NOW()),

-- Course 8: Machine Learning A-Z (3 videos)
(8, 'Lecture 1: Supervised Learning', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '26 min', 1, 'Classification and regression', NOW(), NOW()),
(8, 'Lecture 2: Unsupervised Learning', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '23 min', 2, 'Clustering and dimensionality reduction', NOW(), NOW()),
(8, 'Lecture 3: Neural Networks', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '30 min', 3, 'Deep learning fundamentals', NOW(), NOW()),

-- Course 9: Digital Marketing for Tech Products (3 videos)
(9, 'Strategy 1: SEO Masterclass', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '19 min', 1, 'Search engine optimization techniques', NOW(), NOW()),
(9, 'Strategy 2: Social Media Marketing', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '21 min', 2, 'Build your social media presence', NOW(), NOW()),
(9, 'Strategy 3: Analytics & Metrics', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '18 min', 3, 'Measure marketing success', NOW(), NOW());

-- ============================================================
-- Seed: enrollments  (Alice & Bob enrolled in courses)
-- ============================================================
INSERT INTO enrollments (user_id, course_id, created_at, updated_at) VALUES
(1, 1, NOW(), NOW()),   -- Alice → Web Development Bootcamp
(1, 3, NOW(), NOW()),   -- Alice → React Native
(1, 5, NOW(), NOW()),   -- Alice → Advanced Laravel
(2, 2, NOW(), NOW()),   -- Bob → Python for Data Science
(2, 4, NOW(), NOW()),   -- Bob → Cloud Computing
(3, 1, NOW(), NOW()),   -- Fatema → Web Development Bootcamp
(3, 6, NOW(), NOW());   -- Fatema → UI/UX Design

-- ============================================================
-- Seed: user_skills  (skills for Alice, Bob, Fatema)
-- ============================================================
INSERT INTO user_skills (user_id, skill_name, proficiency) VALUES
-- Alice's skills
(1, 'React', 'Intermediate'),
(1, 'JavaScript', 'Intermediate'),
(1, 'HTML', 'Expert'),
(1, 'CSS', 'Expert'),
(1, 'Tailwind CSS', 'Beginner'),
(1, 'Python', 'Beginner'),
(1, 'SQL', 'Intermediate'),
(1, 'Laravel', 'Beginner'),
(1, 'Git', 'Professional'),
-- Bob's skills
(2, 'Python', 'Expert'),
(2, 'SQL', 'Professional'),
(2, 'Machine Learning', 'Intermediate'),
(2, 'Docker', 'Beginner'),
(2, 'AWS', 'Beginner'),
-- Fatema's skills
(3, 'HTML', 'Professional'),
(3, 'CSS', 'Professional'),
(3, 'Figma', 'Expert'),
(3, 'JavaScript', 'Intermediate'),
(3, 'React', 'Beginner');

-- ============================================================
-- Seed: job_applications  (users applying to jobs)
-- ============================================================
INSERT INTO job_applications (user_id, job_id, status) VALUES
(1, 1, 'Pending'),       -- Alice → Junior Frontend Developer
(1, 7, 'Reviewed'),      -- Alice → Mobile App Developer
(1, 9, 'Shortlisted'),   -- Alice → Full Stack Developer
(2, 3, 'Pending'),       -- Bob → Data Analyst Intern
(2, 4, 'Reviewed'),      -- Bob → Machine Learning Engineer
(3, 5, 'Accepted');      -- Fatema → UI/UX Designer

-- ============================================================
-- Seed: contacts  (sample contact messages)
-- ============================================================
INSERT INTO contacts (name, email, subject, message, created_at, updated_at) VALUES
('Rafiq Hasan', 'rafiq@gmail.com', 'Course Suggestion', 'Can you add a course on DevOps and CI/CD pipelines? That would be really helpful for my career.', NOW(), NOW()),
('Sadia Islam', 'sadia@gmail.com', 'Job Listing Issue', 'I noticed the salary range for the Backend Developer position seems incorrect. Could you verify?', NOW(), NOW());

-- Re-enable safe-update mode
SET SQL_SAFE_UPDATES = 1;

-- ============================================================
-- Done! All tables created and seeded.
-- ============================================================
-- Tables: users, password_reset_tokens, failed_jobs,
--         personal_access_tokens, posts, jobs, courses,
--         enrollments, user_skills, job_applications, contacts, chat_messages
--
-- Sample login credentials:
--   Email:    alice@example.com
--   Password: password123
--
--   Email:    bob@example.com
--   Password: password123
--
--   Email:    fatema@example.com
--   Password: password123
-- ============================================================
