# Complete Admin Panel Documentation

## Overview

A fully-featured Admin Panel has been built for the CareerPath platform that allows administrators to manage:
- User profiles
- Courses and course modules/videos
- Job listings
- Job applications and their statuses
- Dashboard statistics

## Getting Started

### 1. Accessing the Admin Panel

**Login Page**: Navigate to `/login`

You'll see two login options:
- **User Login** - Standard user authentication
- **Admin Login** - Administrator access

### 2. Admin Credentials (Demo)

```
Email: admin123@gmail.com
Password: 123456
```

**Note**: These credentials are currently hardcoded for demonstration. In production, implement proper admin user management.

### 3. Admin Dashboard URL

Once logged in, access the admin panel at:
```
http://localhost:3000/admin/dashboard
```

## Admin Panel Features

### A. Dashboard Tab

**Overview Statistics:**
- Total Users Count
- Total Courses Count
- Total Jobs Count
- Total Applications Count
- Pending Applications Count

**Detailed Breakdowns:**
- Application Status Distribution (Pending, Reviewed, Shortlisted, Accepted, Rejected)
- Courses by Level (Beginner, Intermediate, Advanced)

**Quick Actions:**
- Links to manage Users, Courses, Jobs, or Applications

### B. Users Management

**Features:**
- View all registered users
- Search users by name or email
- View user profile information including:
  - User skills and proficiency levels
  - Job applications history
  - Course enrollments
  - Avatar and contact info

**Database Columns Utilized:**
```
users:
- id, name, email, avatar, password, created_at, updated_at

Relationships:
- user_skills (skill_name, proficiency)
- job_applications (status, job details)
- enrollments (course details)
```

**Note**: Admin can view but NOT modify user information (read-only access)

### C. Courses Management

**Features:**
- View all courses with filters
- Add new courses
- Edit existing courses
- Delete courses
- View course videos/modules

**Create Course Form:**
```
- Course Name (required)
- Topic (required)
- Instructor Name (required)
- Duration (e.g., "8 weeks")
- Level (Beginner, Intermediate, Advanced)
- Course Description (required)
```

**Database Structure:**
```
courses:
- id, name, description, topic, instructor, duration, level, created_at, updated_at

course_videos (modules):
- id, course_id, title, url, duration, sequence, description, created_at, updated_at
```

**Module/Video Information:**
When adding videos/modules to a course, provide:
- Video Title
- Direct YouTube/Video Link (URL)
- Duration (e.g., "15 min")
- Sequence Number (order in course)
- Description (optional)

### D. Jobs Management

**Features:**
- View all job postings
- Post new jobs
- Edit job listings
- Delete outdated jobs
- See application count per job

**Create Job Form:**
```
Required Fields:
- Job Title (e.g., "UI/UX Designer")
- Company Name
- Location (or "Remote")
- Job Type (Full-time, Part-time, Internship, Contract, Remote)
- Experience Level (Entry Level, Mid Level, Senior)
- Job Description
- Salary Range (Minimum & Maximum)
- Career Track (e.g., "Software Engineering", "Design", "Data Science")
- Required Skills (comma-separated)
```

**Database Structure:**
```
jobs:
- id, title, company, location, type, level, description, 
  salary_min, salary_max, track, skills (JSON array), created_at, updated_at

Relationships:
- job_applications (tracks all applications for this job)
```

### E. Job Applications Management

**Features:**
- View all job applications across all jobs
- Filter applications by status:
  - Pending (awaiting review)
  - Reviewed (reviewed but no decision)
  - Shortlisted (candidate selected for interview)
  - Accepted (offer made & accepted)
  - Rejected (application declined)
- Update application status with dropdown select
- See applicant and job details

**Database Structure:**
```
job_applications:
- id, user_id, job_id, status, applied_at, created_at, updated_at

Status Options:
- Pending (yellow)
- Reviewed (blue)
- Shortlisted (purple)
- Accepted (green)
- Rejected (red)

Also includes:
- screening_questions (job-specific questions)
- screening_responses (applicant's responses)
- resume_path (uploaded resume URL)
```

**Workflow:**
1. User applies for job → Status: "Pending"
2. Admin reviews application → Status: "Reviewed"
3. Admin shortlists candidate → Status: "Shortlisted"
4. Candidate passes final interview → Status: "Accepted" OR "Rejected"

## Database Table Reference

### Complete Table Columns

**users**
```javascript
{
  id: Integer (Primary Key),
  name: String(255),
  email: String(255) - UNIQUE,
  password: String(255),
  avatar: String(500) - nullable,
  email_verified_at: Timestamp - nullable,
  remember_token: String(100) - nullable,
  created_at: Timestamp,
  updated_at: Timestamp,
  // Additional fields from migrations:
  bio: Text - nullable,
  headline: String - nullable,
  phone: String - nullable,
  location: String - nullable,
  // Education fields:
  education_board: String - nullable,
  education_group: String - nullable,
  years_of_experience: Integer - nullable
}
```

**courses**
```javascript
{
  id: Integer (Primary Key),
  name: String(255),
  description: Text - nullable,
  topic: String(255) - nullable,
  instructor: String(255) - nullable,
  duration: String(255) - nullable,
  level: Enum('Beginner', 'Intermediate', 'Advanced'),
  created_at: Timestamp,
  updated_at: Timestamp
}
```

**course_videos**
```javascript
{
  id: Integer (Primary Key),
  course_id: Integer (Foreign Key → courses.id),
  title: String(255),
  url: Text,
  duration: String(50) - nullable,
  sequence: Integer,
  description: Text - nullable,
  created_at: Timestamp,
  updated_at: Timestamp,
  // Indexes: (course_id, sequence)
}
```

**jobs**
```javascript
{
  id: Integer (Primary Key),
  title: String(255),
  company: String(255),
  location: String(255),
  type: String(255) - Values: Full-time, Part-time, Internship, Contract, Remote,
  level: String(255) - Values: Entry Level, Mid Level, Senior,
  description: Text - nullable,
  salary_min: Integer - nullable,
  salary_max: Integer - nullable,
  track: String(255) - nullable,
  skills: JSON - array of required skills,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

**job_applications**
```javascript
{
  id: Integer (Primary Key),
  user_id: Integer (Foreign Key → users.id),
  job_id: Integer (Foreign Key → jobs.id),
  status: Enum('Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected'),
  applied_at: Timestamp,
  created_at: Timestamp,
  updated_at: Timestamp,
  // Additional fields from migrations:
  resume_path: String - nullable (URL to uploaded resume),
  cover_letter: Text - nullable,
  additional_info: Text - nullable
}
```

**user_skills**
```javascript
{
  id: Integer (Primary Key),
  user_id: Integer (Foreign Key → users.id),
  skill_name: String(255),
  proficiency: Enum('Beginner', 'Intermediate', 'Expert', 'Professional'),
  created_at: Timestamp,
  updated_at: Timestamp,
  // Unique: (user_id, skill_name)
}
```

**enrollments**
```javascript
{
  id: Integer (Primary Key),
  user_id: Integer (Foreign Key → users.id),
  course_id: Integer (Foreign Key → courses.id),
  created_at: Timestamp,
  updated_at: Timestamp,
  // Unique: (user_id, course_id)
}
```

**video_completions**
```javascript
{
  id: Integer (Primary Key),
  user_id: Integer (Foreign Key → users.id),
  course_video_id: Integer (Foreign Key → course_videos.id),
  completed_at: Timestamp,
  created_at: Timestamp,
  updated_at: Timestamp,
  // Unique: (user_id, course_video_id)
}
```

**screening_questions**
```javascript
{
  id: Integer (Primary Key),
  job_id: Integer (Foreign Key → jobs.id),
  question_text: Text,
  question_type: String - (text, multiple_choice, etc.),
  sequence: Integer,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

**screening_responses**
```javascript
{
  id: Integer (Primary Key),
  job_application_id: Integer (Foreign Key → job_applications.id),
  screening_question_id: Integer (Foreign Key → screening_questions.id),
  answer_text: Text,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

## API Endpoints (Backend)

### Authentication
```
POST /api/admin/login
- Body: { email, password }
- Response: { message, admin: {...}, token, type: "bearer" }

GET /api/admin/me
- Headers: Authorization: Bearer {token}
- Response: { id, name, email, role }

POST /api/admin/logout
- Response: { message }
```

### Users
```
GET /api/admin/users?search={search}&per_page={perPage}
- Returns paginated user list

GET /api/admin/users/{userId}
- Returns detailed user profile with skills, applications, enrollments
```

### Courses
```
GET /api/admin/courses?search={search}&level={level}&per_page={perPage}
GET /api/admin/courses/{courseId}
POST /api/admin/courses
- Body: { name, description, topic, instructor, duration, level }

PUT /api/admin/courses/{courseId}
DELETE /api/admin/courses/{courseId}

POST /api/admin/courses/{courseId}/videos
- Body: { title, url, duration, sequence, description }

PUT /api/admin/videos/{videoId}
DELETE /api/admin/videos/{videoId}
```

### Jobs
```
GET /api/admin/jobs?search={search}&level={level}&track={track}&per_page={perPage}
GET /api/admin/jobs/{jobId}
POST /api/admin/jobs
- Body: { title, company, location, type, level, description, salary_min, salary_max, track, skills }

PUT /api/admin/jobs/{jobId}
DELETE /api/admin/jobs/{jobId}
```

### Job Applications
```
GET /api/admin/applications?status={status}&job_id={jobId}&per_page={perPage}
GET /api/admin/applications/status/{status}
PUT /api/admin/applications/{applicationId}
- Body: { status: 'Pending|Reviewed|Shortlisted|Accepted|Rejected' }

GET /api/admin/dashboard/stats
- Returns: { total_users, total_courses, total_jobs, total_applications, applications_by_status, enrollments_by_level }
```

## Frontend Admin Components

### AdminDashboard.jsx
Main dashboard component with:
- Sidebar navigation
- Stats cards
- Application status breakdown
- Course level distribution
- Quick action buttons
- Tab-based interface

### Sub-Components:
1. **AdminUsers** - User management table
2. **AdminCourses** - Course management with add/edit form
3. **AdminJobs** - Job management with post job form
4. **AdminApplications** - Application management with status filter

## Workflow Example: Posting a New Course

1. Go to Admin Dashboard → Click "Courses" tab
2. Click "Add Course" button
3. Fill form:
   - Name: "Advanced React Patterns"
   - Topic: "Web Development"
   - Instructor: "John Developer"
   - Duration: "10 weeks"
   - Level: "Advanced"
   - Description: "Learn advanced React patterns..."
4. Click "Create Course"
5. Course appears in the courses list
6. Click "Edit" to add videos/modules
7. Click "+ Add Module" to add course videos

## Workflow Example: Managing Job Applications

1. Go to Admin Dashboard → Click "Applications" tab
2. Filter by status (Pending, Reviewed, etc.) using buttons at top
3. For each application:
   - See applicant name, job title, application date
   - Click status dropdown to change status
   - Select new status (Reviewed → Shortlisted → Accepted/Rejected)
4. Status updates immediately

## Important Notes

### Security Considerations (Future Implementation)
- Currently uses hardcoded admin credentials
- Should implement:
  - Proper admin user table with secure password hashing
  - Role-based access control (RBAC)
  - Admin login rate limiting
  - Audit logs for admin actions
  - Password reset functionality
  - Two-factor authentication

### Data Validation
- All form inputs are validated on both frontend and backend
- File uploads (if added) should have size/type restrictions
- JSON arrays (skills) are properly serialized/deserialized

### Performance Optimization
- Implement pagination for large datasets
- Add caching for frequently accessed data
- Consider lazy loading for admin panels
- Add search/filter optimization with database indexes

## Troubleshooting

**Issue**: Cannot access admin dashboard after login
- **Solution**: Check localStorage for admin_token and admin_user
- Verify token is being sent in Authorization header

**Issue**: Courses not showing up
- **Solution**: Ensure courses are created with all required fields
- Check database migrations have run
- Verify API endpoint returns data

**Issue**: Application status won't update
- **Solution**: Verify admin is authenticated
- Check browser console for API errors
- Ensure status value is one of: Pending, Reviewed, Shortlisted, Accepted, Rejected

## Future Enhancements

1. **Bulk Operations** - Bulk approve/reject applications
2. **Export Functionality** - Export courses, jobs, applications to CSV
3. **Analytics Dashboard** - Advanced analytics and reports
4. **Email Notifications** - Notify candidates of status updates
5. **Admin User Management** - Create/manage multiple admin accounts
6. **Activity Logging** - Track all admin actions
7. **Template Management** - Email templates, job templates
8. **Bulk Import** - Import courses/jobs from CSV
