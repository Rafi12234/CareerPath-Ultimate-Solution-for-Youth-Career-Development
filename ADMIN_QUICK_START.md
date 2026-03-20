# Admin Panel - Quick Start Guide 🚀

## ⚡ 30-Second Setup

1. **Go to Login Page**: http://localhost:3000/login
2. **Click Admin Login Button** (blue toggle)
3. **Use Demo Credentials**:
   - Email: `admin123@gmail.com`
   - Password: `123456`
4. **Click Admin Sign In**
5. **Access Dashboard**: Automatically redirected to `/admin/dashboard`

---

## 📍 Navigation

Once in the admin dashboard, you'll see a sidebar with 5 main sections:

```
├── Dashboard    (📊 Statistics & Overview)
├── Users        (👥 Manage Users)
├── Courses      (📚 Manage Courses & Modules)
├── Jobs         (💼 Post Jobs)
└── Applications (📋 Review Applications)
```

---

## 🎯 Quick Tasks

### Add a New Course
1. Click **Courses** in sidebar
2. Click **"Add Course"** button
3. Fill in:
   - Course Name: `e.g., Advanced React`
   - Topic: `e.g., Web Development`
   - Instructor: `e.g., John Developer`
   - Duration: `e.g., 8 weeks`
   - Level: Select from dropdown
   - Description: Course details
4. Click **"Create Course"**
5. New course appears in the list

### Post a New Job
1. Click **Jobs** in sidebar
2. Click **"Post Job"** button
3. Fill in all fields:
   - Job Title, Company, Location
   - Job Type (Full-time, Part-time, etc.)
   - Experience Level
   - Description
   - Salary Range
   - Required Skills (comma-separated)
4. Click **"Post Job"**

### Review Job Applications
1. Click **Applications** in sidebar
2. **Filter by Status** using buttons:
   - All, Pending, Reviewed, Shortlisted, Accepted, Rejected
3. **Update Status** using dropdown:
   - Select new status from dropdown
   - Automatically saves
4. **View Details**:
   - Applicant name
   - Job applied for
   - Application date

### Search Users
1. Click **Users** in sidebar
2. Type in search box to find by:
   - Name: `"John"`
   - Email: `"john@example.com"`
3. Results update instantly
4. Click user row to see:
   - Skills and proficiency
   - Job applications
   - Course enrollments

### View Dashboard Stats
1. Click **Dashboard** (default on login)
2. See total counts:
   - Users, Courses, Jobs, Applications
3. View breakdown:
   - Application statuses
   - Course levels
4. Click **Quick Actions** to jump to sections

---

## 🔄 Application Status Workflow

```
User Applies for Job
        ↓
    PENDING (🟡 Yellow)
        ↓
Admin Reviews Application
        ↓
    REVIEWED (🔵 Blue)
        ↓
Admin Shortlists Candidate
        ↓
  SHORTLISTED (🟣 Purple)
        ↓
    Interview Process
        ↓
Admin Makes Decision
        ↓
ACCEPTED (🟢 Green) OR REJECTED (🔴 Red)
```

---

## 📊 Dashboard Statistics

**Cards Show:**
- 👥 **Total Users**: All registered users
- 📚 **Total Courses**: All courses available
- 💼 **Total Jobs**: All job postings
- 📋 **Total Applications**: All applications received
- ⏳ **Pending Apps**: Applications awaiting action

**Charts Show:**
- Application status breakdown (5 statuses)
- Courses by difficulty (Beginner, Intermediate, Advanced)

---

## 🛠️ Course Management

### Add Video Module to Course
1. In Courses tab, click "Edit" on a course
2. Click **"Add Module"** button
3. Fill in:
   - Video Title
   - YouTube/Video Link (full URL)
   - Duration (e.g., "15 min")
   - Sequence Number (order)
   - Description (optional)
4. Click **"Add Video"**

### Module Information
```
Must Provide:
✓ Title (e.g., "Module 1: Basics")
✓ Direct Video Link (e.g., https://youtube.com/...)
✓ Duration (e.g., "20 min")
✓ Sequence (Number for order, e.g., 1, 2, 3)

Optional:
- Description (course content overview)
```

---

## ⚙️ Job Posting Details

**Required Fields:**
- Job Title (e.g., "UI/UX Designer")
- Company Name (e.g., "Tech Company Inc")
- Location (e.g., "New York" or "Remote")
- Job Type (Full-time, Part-time, Internship, Contract, Remote)
- Level (Entry Level, Mid Level, Senior)
- Description (full job details)
- Salary Min & Max (e.g., 40000 - 80000)
- Career Track (e.g., "Design", "Engineering")
- Skills (comma-separated, e.g., "React, JavaScript, CSS")

---

## 📋 Managing Applications

**Available Statuses:**
- 🟡 **Pending** - Initial submission
- 🔵 **Reviewed** - Admin has reviewed
- 🟣 **Shortlisted** - Passed initial screening
- 🟢 **Accepted** - Offered & accepted job
- 🔴 **Rejected** - Application declined

**To Update Status:**
1. Go to Applications tab
2. Click dropdown in "Action" column
3. Select new status
4. Status updates automatically

---

## 🔍 Search & Filter Features

### Users Search
- Search by Name: Type first/last name
- Search by Email: Type email address
- Real-time results

### Courses Filter
- Filter by Level: Beginner, Intermediate, Advanced
- Search by Name or Topic

### Jobs Filter
- Search by Title, Company, or Description
- Filter by Level or Track
- Shows application count

### Applications Filter
- 6 filter buttons: All, Pending, Reviewed, Shortlisted, Accepted, Rejected
- Shows total per status

---

## 🚨 Important Notes

### Remember
✅ Admin can **view** users but **NOT modify** them  
✅ Admin can **create, edit, delete** courses  
✅ Admin can **create, edit, delete** jobs  
✅ Admin can **update** application statuses  
✅ Admin can **add video modules** to courses

### cannot
❌ Modify user profile information  
❌ Reset user passwords  
❌ Delete user accounts  
❌ Access user email credentials

---

## 🔒 Security Notes

- **Admin credentials** are hardcoded (demo only)
- **Cannot login** using these credentials with User Login button
- **Separate authentication** for admin vs users
- **Token-based** API security

---

## 📞 Troubleshooting

**Can't see courses after creating them?**
- Refresh the page (F5)
- Check browser console for errors

**Application status won't change?**
- Verify you're logged in as admin
- Check the internet connection
- Ensure status is valid (Pending/Reviewed/Shortlisted/Accepted/Rejected)

**Can't find user?**
- Make sure user exists in database
- Try searching by email instead of name
- Check exact spelling

**Job not showing up after posting?**
- Refresh the page
- Verify all required fields were filled
- Check database connection

---

## 📚 Full Documentation

For complete details, see:
- **ADMIN_PANEL_GUIDE.md** - Comprehensive guide with database schema
- **ADMIN_PANEL_IMPLEMENTATION.md** - Technical implementation details

---

## 🎓 Sample Workflow

### Complete Example: Add Course with Video

1. **Login as Admin**
   - Go to `/login`
   - Select Admin Login
   - Enter: admin123@gmail.com / 123456

2. **Add Course**
   - Click Courses → "Add Course"
   - Name: "Web Development Bootcamp"
   - Topic: "Web Development"
   - Instructor: "Sarah Johnson"
   - Duration: "12 weeks"
   - Level: "Beginner"
   - Description: "Learn HTML, CSS, and JavaScript..."
   - Click "Create Course"

3. **Add Video Module**
   - Course appears in list
   - Click "Edit"
   - Click "Add Module"
   - Title: "Module 1: HTML Basics"
   - Link: "https://youtube.com/video..."
   - Duration: "25 min"
   - Sequence: 1
   - Click "Add Video"

4. **Verify**
   - Course now shows 1 video/module
   - Students can enroll and watch

---

## ✨ Pro Tips

1. **Bulk Management**: Filter applications by status to review many at once
2. **Search Efficiency**: Use email for exact user search
3. **Course Organization**: Number modules in sequence for logical order
4. **Job Placement**: Update application status to track hiring pipeline
5. **Dashboard Check**: Start each session viewing dashboard stats

---

**You're all set! 🎉**

Start managing your platform content now!

Questions? Check the full documentation or contact support.
