# CareerPath

CareerPath is an interactive platform designed to guide students and job-seekers through every step of their career journey. The platform offers personalized career development tools, such as job matching, skill gap analysis, and AI-powered roadmap generation, helping users to build career profiles, explore job opportunities, improve skills, and access valuable career resources.

## Local stack

- **Frontend:** React + Vite (`client/`)
- **Backend:** PHP Laravel 10 (project root)
- **Database:** MySQL 8 (`careerpath`)
- **Container/deployment layer:** none. This project is configured for local development only.

## Prerequisites

Install these directly on your computer:

- PHP 8.1 or newer with the `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, and `tokenizer` extensions
- Composer 2
- MySQL 8.x and MySQL Workbench
- Node.js 18+ with npm

## 1. Import the database in MySQL Workbench

Open and execute:

`database/careerpath_local_full.sql`

The script creates the `careerpath` database, creates the complete current schema, loads the database data bundled with this project, and synchronizes Laravel's `migrations` table. You do **not** need to run `php artisan migrate` after the first import.

> The original project used a Docker named volume for live database storage. Named-volume runtime files are not contained in this source ZIP. The SQL file above therefore contains all database data that was actually present in the uploaded project (the former Docker init data), reconciled with every current Laravel migration.

## 2. Configure and run Laravel

From the project root:

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
```

On Windows Command Prompt, use `copy .env.example .env` instead of `cp`.

The local `.env.example` expects:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=careerpath
DB_USERNAME=root
DB_PASSWORD=
```

If your local MySQL `root` account has a password, put it in `DB_PASSWORD` before starting Laravel.

Backend URL: `http://127.0.0.1:8000`

## 3. Run the React frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

The Vite development server proxies `/api` requests to `http://127.0.0.1:8000`, so the existing frontend API calls continue to work locally without Docker or a reverse proxy.

## Optional API integrations

AI/upload features still use their existing external APIs. Add the appropriate keys to `.env` only if you want those features enabled:

- `GEMINI_API_KEY`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `FILESTACK_API_KEY`

### Team Members
| Roll Number | Name                  | Email                                         | Role                              |
|-------------|-----------------------|-----------------------------------------------|-----------------------------------|
| 20230104091 | Shajedul Kabir Rafi   | shajedul.cse.20230104091@aust.edu             | Lead Frontend & Backend Developer |
| 20230104082 | Samanta Islam         | samanta.cse.20230104082@aust.edu              | Backend Developer    |
| 20230104093 | Maruf Islam Shiab     | maruful.cse.20230104093@aust.edu              | Frontend Developer   |
| 20230104089 | Nusrat Jahan Shanti   | nusrat.cse.20230104089@aust.edu               | Frontend Developer   |

---

#### Features
#### Core Features

- Interactive UI Dashboard:
  The platform provides an interactive dashboard that recommends relevant courses and job opportunities based on the user's interests, knowledge, and skills. It helps users discover personalized career pathways and learning resources.

- Job Matching:
  CareerPath uses advanced algorithms to match users with job opportunities that align with their current skills and level of learning (rated at 100%). The system also suggests areas where the user needs to improve and recommends specific courses and learning resources   to help fill skill gaps.

- Courses Enrollment Page:
  Users can explore a wide range of courses related to their career development. The platform suggests relevant courses based on the user’s skills, career goals, and knowledge gaps. Users can enroll directly through the platform.

#### Exclusive Features

- AI Chatbot:
  The AI-powered chatbot answers career-related queries, provides job advice, and helps users navigate the platform more efficiently. It acts as an assistant to answer questions about job opportunities, career development, and skills enhancement.

- AI CV Analyzer:
  The AI CV Analyzer helps users improve their CVs by extracting key skills, roles, and domains. It provides tips and feedback on areas for improvement based on current market demands and the user's professional goals.

- AI Roadmap Generator:
  By analyzing the user’s current skills, education, and career goals, the AI generates a personalized roadmap that shows the user’s step-by-step career path. This roadmap helps guide users to achieve their dream job by suggesting necessary skills, courses, and experience.

- AI Mock Interview Practice:
  Users can practice for job interviews with AI-powered mock interviews. The system simulates real interview scenarios, asks questions based on the user's chosen career path, and provides feedback on answers, helping users to prepare effectively.

#### Admin Panel

- Admin Panel for User and Content Management:
  The admin panel allows platform administrators to manage user activity, monitor course enrollments, and oversee job listings. It provides detailed insights into the platform's performance, job market trends, and user engagement.
---

---

### **Authentication**
**CareerPath** uses secure and reliable authentication mechanisms to ensure that only authorized users can access the platform. The authentication system is designed with both security and user experience in mind.

#### **Key Authentication Features:**

1. **JWT-based Secure Authentication**:  
   - **JSON Web Tokens (JWT)** are used to manage user sessions securely. After a user successfully logs in, a JWT token is issued, which they can use for authenticated requests. This token is stored securely on the client side (typically in localStorage or cookies).
   - JWT tokens ensure that each request from the client to the server is authenticated, providing a seamless and secure experience.

2. **Profile Completion After Authentication**:  
  - After successful registration or login, users who have not completed their profile are redirected to the profile form.
  - All required profile information is then saved in the main `users` table.

3. **Role-based Access Control (RBAC)**:  
   - The platform implements **role-based access control** to ensure that users have appropriate permissions based on their roles.
   - Common roles include:
     - **General User / Candidate**: Regular access to job listings, applications, course recommendations, profile management, etc.
     - **Company / Employer**: Company-scoped access for posting jobs and reviewing applicants to its own jobs.
     - **Admin**: Full access to the admin panel for managing user activity, job market insights, content moderation, etc.

4. **Password Security**:  
   - Passwords are securely stored using **bcrypt** hashing, ensuring that passwords are not exposed in their raw form.
   - Users can reset their passwords through a secure email-based recovery process.

5. **Session Management**:  
   - The platform manages sessions using JWT tokens, ensuring that users stay logged in until they choose to log out.
   - Tokens are refreshed automatically before expiration to ensure a seamless user experience.
   - Session timeouts are implemented for added security, automatically logging out users after a specified period of inactivity.

6. **Account-Based Authentication**:  
  - CareerPath uses email and password authentication with JWT session handling.

#### **User Authentication Flow:**

1. **Sign-Up**:  
  - The user registers by providing their name, email, and password.
  - After registration, the user is logged in and can continue to complete their profile.
   
2. **Account Creation**:  
  - The user creates an account with email, password, and basic profile details.
  - Once the account is created, the user can log in using email and password.

3. **Login**:  
  - The user can log in using credentials (email and password).
   - Upon successful login, the user receives a JWT token, which is used for further authentication in subsequent requests.
  - If profile data is incomplete, the user is redirected to the profile page.

4. **Accessing Platform Features**:  
   - The system checks the JWT token in the user's request headers to authenticate them before allowing access to protected features like job matching, course recommendations, and AI-powered tools.

## Company Portal

The project now has three isolated account experiences: candidate/user, admin, and company/employer.

If your database was already imported before this feature was added, run `company_portal_mysql_changes.sql` **once** in MySQL Workbench. The script preserves all existing users, jobs, applications, screening responses, courses, and other data, then adds company ownership and employer-review fields. It also records the matching Laravel migration, so do not run both the SQL upgrade and that migration manually.

After the SQL upgrade, restart Laravel after clearing configuration/cache:

```bash
php artisan optimize:clear
php artisan serve --host=127.0.0.1 --port=8000
```

Keep the React development server running from `client/` with `npm run dev`.

Company routes:

- Company sign in: `http://localhost:5173/company/login`
- Company registration: `http://localhost:5173/company/register`
- Company dashboard: `http://localhost:5173/company/dashboard`
- Company jobs: `http://localhost:5173/company/jobs`
- Company applicants: `http://localhost:5173/company/applications`

A company account is created through the Company Portal registration page. Company-posted jobs use the same `jobs` records the candidate Jobs page already consumes. Candidate applications continue to use the same `job_applications`, `screening_questions`, and `screening_responses` pipeline; the company portal is an ownership-scoped review interface over those records.
