-- ============================================================
-- CareerPath - Local MySQL Full Database
-- ============================================================
-- Purpose: local development without Docker or deployment services.
-- Import this entire file in MySQL Workbench.
-- It creates the `careerpath` database, the complete current schema,
-- and the seed data that was bundled with the former Docker database init.
--
-- NOTE: The uploaded project contains the Docker initialization SQL, but
-- not Docker's runtime named-volume files (/var/lib/mysql). Therefore this
-- file preserves all database data available in the project archive and
-- reconciles it with every current Laravel migration in this source tree.
-- ============================================================

CREATE DATABASE IF NOT EXISTS `careerpath`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `careerpath`;

SET NAMES utf8mb4;
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `screening_responses`;
DROP TABLE IF EXISTS `screening_questions`;
DROP TABLE IF EXISTS `mock_interview_turns`;
DROP TABLE IF EXISTS `career_roadmaps`;
DROP TABLE IF EXISTS `video_completions`;
DROP TABLE IF EXISTS `course_videos`;
DROP TABLE IF EXISTS `chat_messages`;
DROP TABLE IF EXISTS `job_applications`;
DROP TABLE IF EXISTS `user_skills`;
DROP TABLE IF EXISTS `enrollments`;
DROP TABLE IF EXISTS `contacts`;
DROP TABLE IF EXISTS `user_sessions`;
DROP TABLE IF EXISTS `personal_access_tokens`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` (`migration`, `batch`) VALUES
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
('2024_01_01_000007_add_avatar_to_users_table', 1),
('2024_03_16_000001_create_course_videos_table', 1),
('2024_03_16_000002_create_video_completions_table', 1),
('2024_03_16_000003_seed_course_videos', 2),
('2026_03_19_000001_create_career_roadmaps_table', 2),
('2026_03_19_000002_add_profile_fields_to_users_table', 2),
('2026_03_20_000003_add_detailed_education_and_fresher_fields_to_users_table', 2),
('2026_03_20_000004_expand_job_applications_table', 2),
('2026_03_20_000005_create_screening_questions_table', 2),
('2026_03_20_000006_create_screening_responses_table', 2),
('2026_03_20_000007_fix_missing_screening_questions_table', 2),
('2026_03_24_000001_add_professional_profile_fields_to_users_table', 2),
('2026_03_24_000002_add_cover_image_to_courses_table', 2),
('2026_03_24_000010_make_course_videos_url_nullable', 2),
('2026_04_02_000001_create_mock_interview_turns_table', 2),
('2026_04_09_000001_add_jwt_session_table', 1);

CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'user',
    `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
    `password` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(500) NULL DEFAULT NULL,
    `profile_completed` TINYINT(1) NOT NULL DEFAULT 0,
    `phone` VARCHAR(255) NULL DEFAULT NULL,
    `date_of_birth` DATE NULL DEFAULT NULL,
    `gender` VARCHAR(20) NULL DEFAULT NULL,
    `marital_status` VARCHAR(30) NULL DEFAULT NULL,
    `nationality` VARCHAR(255) NULL DEFAULT NULL,
    `location` VARCHAR(255) NULL DEFAULT NULL,
    `bio` TEXT NULL,
    `headline` VARCHAR(255) NULL DEFAULT NULL,
    `present_address` TEXT NULL,
    `permanent_address` TEXT NULL,
    `highest_education` VARCHAR(255) NULL DEFAULT NULL,
    `institution_name` VARCHAR(255) NULL DEFAULT NULL,
    `field_of_study` VARCHAR(255) NULL DEFAULT NULL,
    `graduation_year` SMALLINT UNSIGNED NULL DEFAULT NULL,
    `result_grade` VARCHAR(100) NULL DEFAULT NULL,
    `years_of_experience` TINYINT UNSIGNED NULL DEFAULT NULL,
    `current_job_title` VARCHAR(255) NULL DEFAULT NULL,
    `current_company` VARCHAR(255) NULL DEFAULT NULL,
    `previous_job_title` VARCHAR(255) NULL DEFAULT NULL,
    `previous_company` VARCHAR(255) NULL DEFAULT NULL,
    `previous_job_start` DATE NULL DEFAULT NULL,
    `previous_job_end` DATE NULL DEFAULT NULL,
    `previous_job_description` TEXT NULL,
    `school_name` VARCHAR(255) NULL DEFAULT NULL,
    `ssc_year` SMALLINT UNSIGNED NULL DEFAULT NULL,
    `ssc_result` VARCHAR(100) NULL DEFAULT NULL,
    `ssc_group` VARCHAR(50) NULL DEFAULT NULL,
    `ssc_board` VARCHAR(50) NULL DEFAULT NULL,
    `education_board` VARCHAR(50) NULL DEFAULT NULL,
    `education_group` VARCHAR(50) NULL DEFAULT NULL,
    `college_name` VARCHAR(255) NULL DEFAULT NULL,
    `hsc_year` SMALLINT UNSIGNED NULL DEFAULT NULL,
    `hsc_result` VARCHAR(100) NULL DEFAULT NULL,
    `hsc_group` VARCHAR(50) NULL DEFAULT NULL,
    `hsc_board` VARCHAR(50) NULL DEFAULT NULL,
    `university_name` VARCHAR(255) NULL DEFAULT NULL,
    `university_status` VARCHAR(20) NULL DEFAULT NULL,
    `current_study_year` TINYINT UNSIGNED NULL DEFAULT NULL,
    `current_study_semester` TINYINT UNSIGNED NULL DEFAULT NULL,
    `university_graduation_year` SMALLINT UNSIGNED NULL DEFAULT NULL,
    `university_cgpa` DECIMAL(3,2) NULL DEFAULT NULL,
    `is_fresher` TINYINT(1) NOT NULL DEFAULT 1,
    `remember_token` VARCHAR(100) NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_sessions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `jti` CHAR(36) NOT NULL,
    `device_name` VARCHAR(255) NULL DEFAULT NULL,
    `issued_at` TIMESTAMP NOT NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `revoked_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_sessions_jti_unique` (`jti`),
    KEY `idx_user_sessions_user_expiry` (`user_id`, `expires_at`),
    CONSTRAINT `user_sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `abilities` TEXT NULL,
    `last_used_at` TIMESTAMP NULL DEFAULT NULL,
    `expires_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
    KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `posts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `company` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) DEFAULT 'Remote',
    `type` VARCHAR(255) DEFAULT 'Full-time',
    `level` VARCHAR(255) DEFAULT 'Entry Level',
    `description` TEXT NULL,
    `salary_min` INT NULL DEFAULT NULL,
    `salary_max` INT NULL DEFAULT NULL,
    `track` VARCHAR(255) NULL DEFAULT NULL,
    `skills` JSON NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `courses` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `topic` VARCHAR(255) NULL DEFAULT NULL,
    `instructor` VARCHAR(255) NULL DEFAULT NULL,
    `duration` VARCHAR(255) NULL DEFAULT NULL,
    `level` VARCHAR(255) DEFAULT 'Beginner',
    `cover_image` VARCHAR(2048) NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `enrollments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `course_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `enrollments_user_id_course_id_unique` (`user_id`, `course_id`),
    CONSTRAINT `enrollments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `enrollments_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_skills` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `skill_name` VARCHAR(255) NOT NULL,
    `proficiency` ENUM('Beginner','Intermediate','Expert','Professional') DEFAULT 'Beginner',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_user_skill` (`user_id`, `skill_name`),
    CONSTRAINT `user_skills_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_applications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `job_id` BIGINT UNSIGNED NOT NULL,
    `status` ENUM('Pending','Reviewed','Shortlisted','Accepted','Rejected') DEFAULT 'Pending',
    `applied_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `personal_info` JSON NULL,
    `resume_path` VARCHAR(255) NULL DEFAULT NULL,
    `work_experience` JSON NULL,
    `education_info` JSON NULL,
    `skills` JSON NULL,
    `cover_letter` LONGTEXT NULL,
    `additional_documents` JSON NULL,
    `work_eligibility` JSON NULL,
    `references` JSON NULL,
    `online_profiles` JSON NULL,
    `application_notes` TEXT NULL,
    `submitted_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_application` (`user_id`, `job_id`),
    CONSTRAINT `job_applications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `job_applications_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `contacts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `chat_messages` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
    `user_message` TEXT NOT NULL,
    `bot_reply` TEXT NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `chat_messages_user_id_index` (`user_id`),
    CONSTRAINT `chat_messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `course_videos` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `course_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `url` TEXT NULL,
    `duration` VARCHAR(50) NULL DEFAULT NULL,
    `sequence` INT NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `course_videos_course_id_sequence_index` (`course_id`, `sequence`),
    CONSTRAINT `course_videos_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `video_completions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `course_video_id` BIGINT UNSIGNED NOT NULL,
    `completed_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `video_completions_user_id_course_video_id_unique` (`user_id`, `course_video_id`),
    CONSTRAINT `video_completions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `video_completions_course_video_id_foreign` FOREIGN KEY (`course_video_id`) REFERENCES `course_videos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `career_roadmaps` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `target_job_title` VARCHAR(255) NOT NULL,
    `skills_snapshot` JSON NULL,
    `guidance_text` TEXT NULL,
    `ai_response` LONGTEXT NOT NULL,
    `roadmap_json` JSON NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `career_roadmaps_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `screening_questions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `job_id` BIGINT UNSIGNED NOT NULL,
    `question_text` TEXT NOT NULL,
    `question_type` ENUM('text','yes_no','multiple_choice') NOT NULL DEFAULT 'text',
    `options` JSON NULL,
    `required` TINYINT(1) NOT NULL DEFAULT 1,
    `order` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `screening_questions_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `screening_responses` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `job_application_id` BIGINT UNSIGNED NOT NULL,
    `screening_question_id` BIGINT UNSIGNED NOT NULL,
    `response_text` LONGTEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_app_question` (`job_application_id`, `screening_question_id`),
    CONSTRAINT `screening_responses_job_application_id_foreign` FOREIGN KEY (`job_application_id`) REFERENCES `job_applications` (`id`) ON DELETE CASCADE,
    CONSTRAINT `screening_responses_screening_question_id_foreign` FOREIGN KEY (`screening_question_id`) REFERENCES `screening_questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `mock_interview_turns` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `topic` VARCHAR(255) NULL DEFAULT NULL,
    `turn_number` INT UNSIGNED NOT NULL DEFAULT 1,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `feedback` TEXT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `mock_interview_turns_user_id_created_at_index` (`user_id`, `created_at`),
    CONSTRAINT `mock_interview_turns_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ############################################################
--                     SEED DATA
-- ############################################################

-- Seed: users  (password for all: password123)
INSERT INTO users (name, email, role, password, created_at, updated_at) VALUES
('Administrator', 'admin@gmail.com', 'admin', '$2y$12$YHMt7sAwSKp9tckCvt1A9OW79iXt77rrxSMkVyffhmIZhVWIO31pq', NOW(), NOW()),
('Alice Johnson', 'alice@example.com', 'user', '$2y$12$B/67T1Tqi5E1GZS8diwCF.qfwRL4A/9REmU3q1q1Nobio9Zv2SGPa', NOW(), NOW()),
('Bob Rahman', 'bob@example.com', 'user', '$2y$12$B/67T1Tqi5E1GZS8diwCF.qfwRL4A/9REmU3q1q1Nobio9Zv2SGPa', NOW(), NOW()),
('Fatema Akter', 'fatema@example.com', 'user', '$2y$12$B/67T1Tqi5E1GZS8diwCF.qfwRL4A/9REmU3q1q1Nobio9Zv2SGPa', NOW(), NOW());

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

-- Seed: course_videos (27 videos - 3 per course)
INSERT INTO course_videos (course_id, title, url, duration, sequence, description, created_at, updated_at) VALUES
-- Course 1: Web Development
(1, 'Module 1: HTML & CSS Fundamentals', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '15 min', 1, 'Learn and master this course topic', NOW(), NOW()),
(1, 'Module 2: JavaScript Essentials', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '20 min', 2, 'Learn and master this course topic', NOW(), NOW()),
(1, 'Module 3: React Introduction', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '25 min', 3, 'Learn and master this course topic', NOW(), NOW()),
-- Course 2: Data Science
(2, 'Lesson 1: Python Basics', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '18 min', 1, 'Learn and master this course topic', NOW(), NOW()),
(2, 'Lesson 2: Data Analysis with Pandas', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '22 min', 2, 'Learn and master this course topic', NOW(), NOW()),
(2, 'Lesson 3: ML Fundamentals', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '28 min', 3, 'Learn and master this course topic', NOW(), NOW()),
-- Course 3: React Native
(3, 'Chapter 1: React Native Setup', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '16 min', 1, 'Learn and master this course topic', NOW(), NOW()),
(3, 'Chapter 2: Components & Navigation', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '20 min', 2, 'Learn and master this course topic', NOW(), NOW()),
(3, 'Chapter 3: API Integration', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '24 min', 3, 'Learn and master this course topic', NOW(), NOW()),
-- Course 4: Cloud Computing
(4, 'Section 1: Cloud Basics', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '19 min', 1, 'Learn and master this course topic', NOW(), NOW()),
(4, 'Section 2: AWS Services Overview', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '23 min', 2, 'Learn and master this course topic', NOW(), NOW()),
(4, 'Section 3: Deploying Applications', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '26 min', 3, 'Learn and master this course topic', NOW(), NOW()),
-- Course 5: Laravel API
(5, 'Part 1: REST API Design', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '21 min', 1, 'Learn and master this course topic', NOW(), NOW()),
(5, 'Part 2: Authentication & Authorization', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '25 min', 2, 'Learn and master this course topic', NOW(), NOW()),
(5, 'Part 3: Testing & Deployment', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '28 min', 3, 'Learn and master this course topic', NOW(), NOW()),
-- Course 6: UI/UX Design
(6, 'Week 1: Design Principles', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '17 min', 1, 'Learn and master this course topic', NOW(), NOW()),
(6, 'Week 2: Wireframing & Prototyping', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '22 min', 2, 'Learn and master this course topic', NOW(), NOW()),
(6, 'Week 3: User Testing', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '20 min', 3, 'Learn and master this course topic', NOW(), NOW()),
-- Course 7: Cybersecurity
(7, 'Topic 1: Network Security', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '24 min', 1, 'Learn and master this course topic', NOW(), NOW()),
(7, 'Topic 2: Ethical Hacking Basics', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '27 min', 2, 'Learn and master this course topic', NOW(), NOW()),
(7, 'Topic 3: Security Best Practices', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '21 min', 3, 'Learn and master this course topic', NOW(), NOW()),
-- Course 8: Machine Learning
(8, 'Lecture 1: Supervised Learning', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '26 min', 1, 'Learn and master this course topic', NOW(), NOW()),
(8, 'Lecture 2: Unsupervised Learning', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '23 min', 2, 'Learn and master this course topic', NOW(), NOW()),
(8, 'Lecture 3: Neural Networks', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '30 min', 3, 'Learn and master this course topic', NOW(), NOW()),
-- Course 9: Digital Marketing
(9, 'Strategy 1: SEO Masterclass', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/1-10_iygbnq.mp4', '19 min', 1, 'Learn and master this course topic', NOW(), NOW()),
(9, 'Strategy 2: Social Media Marketing', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661019/11-20_uhcgb8.mp4', '21 min', 2, 'Learn and master this course topic', NOW(), NOW()),
(9, 'Strategy 3: Analytics & Metrics', 'https://res.cloudinary.com/dnzjg9lq8/video/upload/v1773661018/21-30_ngegrl.mp4', '18 min', 3, 'Learn and master this course topic', NOW(), NOW());

-- Apply the same cover-image values added by the current Laravel migration.
UPDATE `courses` SET `cover_image` = CASE `id`
    WHEN 1 THEN 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=700&fit=crop'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=700&fit=crop'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop'
    WHEN 4 THEN 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=700&fit=crop'
    WHEN 5 THEN 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=700&fit=crop'
    WHEN 6 THEN 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=700&fit=crop'
    WHEN 7 THEN 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=700&fit=crop'
    WHEN 8 THEN 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=700&fit=crop'
    WHEN 9 THEN 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop'
    ELSE `cover_image`
END
WHERE `cover_image` IS NULL;

SET SQL_SAFE_UPDATES = 1;
SET FOREIGN_KEY_CHECKS = 1;

-- Import complete. Laravel's migration table is already synchronized with
-- the migration files in this project, so no initial `php artisan migrate`
-- is required after importing this file.
