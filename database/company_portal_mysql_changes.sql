-- =============================================================
-- CareerPath - Company Portal database upgrade
-- Target: the local `careerpath` database created from
--         careerpath_local_full.sql
-- Run this script ONCE in MySQL Workbench.
-- =============================================================

USE `careerpath`;

-- 1) Employer/company account profile.
-- Authentication still uses the existing `users` + `user_sessions` tables.
-- Company users are stored in users.role = 'company'.
CREATE TABLE `companies` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `industry` VARCHAR(255) NULL DEFAULT NULL,
    `website` VARCHAR(2048) NULL DEFAULT NULL,
    `phone` VARCHAR(50) NULL DEFAULT NULL,
    `email` VARCHAR(255) NULL DEFAULT NULL,
    `location` VARCHAR(255) NULL DEFAULT NULL,
    `company_size` VARCHAR(100) NULL DEFAULT NULL,
    `description` TEXT NULL,
    `logo_url` VARCHAR(2048) NULL DEFAULT NULL,
    `founded_year` SMALLINT UNSIGNED NULL DEFAULT NULL,
    `status` ENUM('active','suspended') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `companies_user_id_unique` (`user_id`),
    UNIQUE KEY `companies_slug_unique` (`slug`),
    CONSTRAINT `companies_user_id_foreign`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2) Job ownership + publishing controls.
-- Existing jobs stay public because status defaults to `published` and
-- company_id is nullable. Company-created jobs will have company_id set.
ALTER TABLE `jobs`
    ADD COLUMN `company_id` BIGINT UNSIGNED NULL DEFAULT NULL AFTER `id`,
    ADD COLUMN `status` ENUM('draft','published','closed') NOT NULL DEFAULT 'published' AFTER `skills`,
    ADD COLUMN `application_deadline` DATE NULL DEFAULT NULL AFTER `status`,
    ADD COLUMN `vacancies` INT UNSIGNED NOT NULL DEFAULT 1 AFTER `application_deadline`,
    ADD KEY `jobs_company_id_status_index` (`company_id`, `status`),
    ADD KEY `jobs_application_deadline_index` (`application_deadline`),
    ADD CONSTRAINT `jobs_company_id_foreign`
        FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL;

-- 3) Employer-side review metadata on the existing candidate application.
-- `company_notes` is private to the company portal; all existing candidate
-- fields (CV, cover letter, education, experience, screening answers, etc.)
-- remain in the same job_applications record.
ALTER TABLE `job_applications`
    ADD COLUMN `company_notes` TEXT NULL AFTER `application_notes`,
    ADD COLUMN `reviewed_at` TIMESTAMP NULL DEFAULT NULL AFTER `submitted_at`;

-- 4) Mark the matching Laravel migration as applied so that after importing
-- this Workbench script, `php artisan migrate` will not try to create the
-- same schema again.
SET @company_portal_batch := (SELECT COALESCE(MAX(`batch`), 0) + 1 FROM `migrations`);

INSERT INTO `migrations` (`migration`, `batch`)
SELECT '2026_09_22_000001_create_company_portal_tables', @company_portal_batch
WHERE NOT EXISTS (
    SELECT 1 FROM `migrations`
    WHERE `migration` = '2026_09_22_000001_create_company_portal_tables'
);

-- -------------------------------------------------------------
-- Verification (safe SELECTs; Workbench will show result grids)
-- -------------------------------------------------------------
SELECT 'Company Portal database upgrade completed' AS `result`;
SELECT COUNT(*) AS `companies_table_ready` FROM `companies`;
SHOW COLUMNS FROM `jobs` WHERE `Field` IN ('company_id','status','application_deadline','vacancies');
SHOW COLUMNS FROM `job_applications` WHERE `Field` IN ('company_notes','reviewed_at');
