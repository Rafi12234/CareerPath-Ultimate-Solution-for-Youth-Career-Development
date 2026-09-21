# CareerPath Company Portal — implementation notes

## Existing job contract that was preserved

The candidate-facing Jobs experience already depends on these `jobs` fields, so the Company Portal creates exactly this data rather than introducing a second job format:

- `title`
- `company` — filled automatically from the authenticated company profile
- `location`
- `type` — Full-time, Part-time, Internship, Contract, or Remote
- `level` — Entry Level, Mid Level, or Senior
- `description`
- `salary_min`
- `salary_max`
- `track`
- `skills` (JSON array)

The company feature adds only ownership/publishing metadata: `company_id`, `status`, `application_deadline`, and `vacancies`.

Only `published` jobs whose deadline has not passed are returned by the public `/api/jobs` endpoints. Old/admin-created jobs remain compatible because `company_id` is nullable and the new status defaults to `published`.

## Existing candidate application contract that was preserved

Candidates continue submitting one record to the existing `job_applications` pipeline. The Company Portal reads the same submitted snapshot:

- personal information: name, email, phone, address, date of birth, nationality
- CV/resume URL
- work experience
- education (SSC/HSC/university structure)
- skills
- cover letter
- additional documents structure
- work eligibility and visa-sponsorship answer
- references
- LinkedIn / portfolio / GitHub profiles
- screening-question responses
- application status

The employer feature adds `company_notes` (private employer notes) and `reviewed_at`. Employer notes are hidden from candidate-facing application serialization.

## Company account design

Authentication remains on the existing `users` and `user_sessions` JWT system. A company account has `users.role = company` and a one-to-one row in `companies`. This avoids a second authentication stack while keeping the three panels role-isolated.

The `companies` table contains employer identity/profile data: name, slug, industry, website, phone, email, location, company size, description, logo URL, founded year, and account status.

## Ownership and safety rules

- Company APIs are protected by both JWT auth and `company.auth`.
- A company can only read/update/delete jobs whose `jobs.company_id` matches its own company row.
- A company can only see applications for its own jobs.
- Candidate application APIs derive the candidate from the authenticated JWT instead of trusting a submitted `user_id`.
- Candidate application APIs are guarded by `candidate.auth`; company/admin tokens cannot submit candidate applications.
- Standard candidate login accepts `role = user`; company accounts use `/company/login`, and admins use `/admin/login`.
- A company job with applications cannot be deleted from the company portal; it can be closed instead.
- Screening questions become locked after the first application because changing/deleting question IDs would otherwise cascade-delete already submitted screening answers.
- Company profile name changes update the display `jobs.company` value for all company-owned jobs.

## Company frontend

React routes:

- `/company/login`
- `/company/register`
- `/company/dashboard`
- `/company/jobs`
- `/company/jobs/new`
- `/company/jobs/:jobId/edit`
- `/company/jobs/:jobId/applications`
- `/company/applications`
- `/company/applications/:applicationId`
- `/company/settings`

The portal uses the same dark teal/cyan visual language as the existing CareerPath UI, with glass surfaces, gentle fade/slide motion, responsive desktop/mobile navigation, and the same local Vite/Laravel API setup.

## Company backend endpoints

Public company auth:

- `POST /api/company/register`
- `POST /api/company/login`

Protected company workspace:

- `POST /api/company/logout`
- `GET /api/company/me`
- `PUT /api/company/profile`
- `GET /api/company/dashboard`
- `GET /api/company/jobs`
- `POST /api/company/jobs`
- `GET /api/company/jobs/{jobId}`
- `PUT /api/company/jobs/{jobId}`
- `DELETE /api/company/jobs/{jobId}`
- `GET /api/company/applications`
- `GET /api/company/applications/{applicationId}`
- `PUT /api/company/applications/{applicationId}`

## Database upgrade

For an existing local database created before this feature, execute `company_portal_mysql_changes.sql` once in MySQL Workbench. It mirrors `database/migrations/2026_09_22_000001_create_company_portal_tables.php` and inserts the migration marker so Laravel will not try to repeat the schema change later.
