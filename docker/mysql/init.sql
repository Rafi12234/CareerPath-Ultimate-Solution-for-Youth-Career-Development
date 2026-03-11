-- ============================================================
-- CareerPath — Docker MySQL Initialization Script
-- ============================================================
-- This file runs automatically when the MySQL container
-- starts for the first time. It creates all tables and
-- inserts seed data into the 'careerpath' database.
-- ============================================================

USE careerpath;

-- Disable safe-update mode and FK checks
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- DROP existing tables (clean slate)
-- ============================================================
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS personal_access_tokens;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS failed_jobs;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS migrations;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Laravel migrations table (so artisan doesn't re-run)
-- ============================================================
CREATE TABLE migrations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INT NOT NULL
);

INSERT INTO migrations (migration, batch) VALUES
('2014_10_12_000000_create_users_table', 1),
('2014_10_12_100000_create_password_reset_tokens_table', 1),
('2019_08_19_000000_create_failed_jobs_table', 1),
('2019_12_14_000001_create_personal_access_tokens_table', 1),
('2024_01_01_000001_create_jobs_table', 1),
('2024_01_01_000002_create_courses_table', 1),
('2024_01_01_000003_create_enrollments_table', 1),
('2024_01_01_000004_create_contacts_table', 1),
('2024_01_01_000005_create_job_applications_table', 1),
('2024_01_01_000006_create_chat_messages_table', 1),
('2024_01_01_000007_add_avatar_to_users_table', 1);

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
-- 8. enrollments  (user <-> course)
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
-- 10. job_applications  (user <-> job)
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


-- ############################################################
--                     SEED DATA
-- ############################################################

-- Seed: users  (password for all: password123)
INSERT INTO users (name, email, password, created_at, updated_at) VALUES
('Alice Johnson', 'alice@example.com', '$2y$12$B/67T1Tqi5E1GZS8diwCF.qfwRL4A/9REmU3q1q1Nobio9Zv2SGPa', NOW(), NOW()),
('Bob Rahman', 'bob@example.com', '$2y$12$B/67T1Tqi5E1GZS8diwCF.qfwRL4A/9REmU3q1q1Nobio9Zv2SGPa', NOW(), NOW()),
('Fatema Akter', 'fatema@example.com', '$2y$12$B/67T1Tqi5E1GZS8diwCF.qfwRL4A/9REmU3q1q1Nobio9Zv2SGPa', NOW(), NOW());

-- Seed: posts
INSERT INTO posts (user_id, title, content, created_at, updated_at) VALUES
(1, 'My First Post', 'This is the content of my first post.', NOW(), NOW()),
(1, 'Getting Started with React', 'React is a JavaScript library for building user interfaces. Here are my thoughts after learning it...', NOW(), NOW()),
(2, 'Laravel Tips & Tricks', 'Some useful Laravel patterns I have discovered while building APIs.', NOW(), NOW());

-- Seed: jobs  (10 jobs)
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

-- Seed: courses  (9 courses)
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

-- Seed: enrollments
INSERT INTO enrollments (user_id, course_id, created_at, updated_at) VALUES
(1, 1, NOW(), NOW()),
(1, 3, NOW(), NOW()),
(1, 5, NOW(), NOW()),
(2, 2, NOW(), NOW()),
(2, 4, NOW(), NOW()),
(3, 1, NOW(), NOW()),
(3, 6, NOW(), NOW());

-- Seed: user_skills
INSERT INTO user_skills (user_id, skill_name, proficiency) VALUES
(1, 'React', 'Intermediate'),
(1, 'JavaScript', 'Intermediate'),
(1, 'HTML', 'Expert'),
(1, 'CSS', 'Expert'),
(1, 'Tailwind CSS', 'Beginner'),
(1, 'Python', 'Beginner'),
(1, 'SQL', 'Intermediate'),
(1, 'Laravel', 'Beginner'),
(1, 'Git', 'Professional'),
(2, 'Python', 'Expert'),
(2, 'SQL', 'Professional'),
(2, 'Machine Learning', 'Intermediate'),
(2, 'Docker', 'Beginner'),
(2, 'AWS', 'Beginner'),
(3, 'HTML', 'Professional'),
(3, 'CSS', 'Professional'),
(3, 'Figma', 'Expert'),
(3, 'JavaScript', 'Intermediate'),
(3, 'React', 'Beginner');

-- Seed: job_applications
INSERT INTO job_applications (user_id, job_id, status) VALUES
(1, 1, 'Pending'),
(1, 7, 'Reviewed'),
(1, 9, 'Shortlisted'),
(2, 3, 'Pending'),
(2, 4, 'Reviewed'),
(3, 5, 'Accepted');

-- Seed: contacts
INSERT INTO contacts (name, email, subject, message, created_at, updated_at) VALUES
('Rafiq Hasan', 'rafiq@gmail.com', 'Course Suggestion', 'Can you add a course on DevOps and CI/CD pipelines? That would be really helpful for my career.', NOW(), NOW()),
('Sadia Islam', 'sadia@gmail.com', 'Job Listing Issue', 'I noticed the salary range for the Backend Developer position seems incorrect. Could you verify?', NOW(), NOW());

-- Re-enable safe-update mode
SET SQL_SAFE_UPDATES = 1;

-- ============================================================
-- Done! All 11 tables created and seeded for Docker.
-- Login: alice@example.com / password123
--        bob@example.com   / password123
--        fatema@example.com / password123
-- ============================================================
