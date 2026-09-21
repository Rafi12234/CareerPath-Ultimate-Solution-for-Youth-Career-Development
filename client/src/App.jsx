import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobApplicationForm from './pages/JobApplicationForm';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Chatbot from './pages/Chatbot';
import CVAnalyzer from './pages/CVAnalyzer';
import AICareerRoadmap from './pages/AICareerRoadmap';
import VoiceMockInterview from './pages/VoiceMockInterview';
import CoursePlayer from './pages/CoursePlayer';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import AdminJobsPage from './pages/AdminJobsPage';
import AdminApplicationsPage from './pages/AdminApplicationsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import CompanyAuthPage from './pages/CompanyAuthPage';
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyJobs from './pages/CompanyJobs';
import CompanyJobForm from './pages/CompanyJobForm';
import CompanyApplications from './pages/CompanyApplications';
import CompanyJobApplications from './pages/CompanyJobApplications';
import CompanyApplicationDetails from './pages/CompanyApplicationDetails';
import CompanySettings from './pages/CompanySettings';

function AdminRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  const admin = localStorage.getItem('admin_user');
  if (!token || !admin) {
    window.location.assign('/login');
    return null;
  }
  return children;
}

function CompanyRoute({ children }) {
  const token = localStorage.getItem('company_token');
  const user = localStorage.getItem('company_user');
  const company = localStorage.getItem('company_profile');
  if (!token || !user || !company) {
    window.location.assign('/company/login');
    return null;
  }
  return children;
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isCompanyRoute = location.pathname.startsWith('/company');
  const isPortalRoute = isAdminRoute || isCompanyRoute;

  useEffect(() => {
    // Ensure each route opens from top; avoids blank view with reveal-on-scroll sections.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <AuthProvider>
      <CompanyProvider>
      <div className="min-h-screen flex flex-col bg-[#03070A] text-gray-200">
        {!isPortalRoute && <Navbar />}
        <main key={location.pathname} className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/apply-job/:jobId" element={<JobApplicationForm />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/course-player/:courseId" element={<CoursePlayer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/cv-analyzer" element={<CVAnalyzer />} />
            <Route path="/ai-career-roadmap" element={<AICareerRoadmap />} />
            <Route path="/voice-mock-interview" element={<VoiceMockInterview />} />
            <Route path="/company/login" element={<CompanyAuthPage mode="login" />} />
            <Route path="/company/register" element={<CompanyAuthPage mode="register" />} />
            <Route path="/company/dashboard" element={<CompanyRoute><CompanyDashboard /></CompanyRoute>} />
            <Route path="/company/jobs" element={<CompanyRoute><CompanyJobs /></CompanyRoute>} />
            <Route path="/company/jobs/new" element={<CompanyRoute><CompanyJobForm /></CompanyRoute>} />
            <Route path="/company/jobs/:jobId/edit" element={<CompanyRoute><CompanyJobForm /></CompanyRoute>} />
            <Route path="/company/jobs/:jobId/applications" element={<CompanyRoute><CompanyJobApplications /></CompanyRoute>} />
            <Route path="/company/applications" element={<CompanyRoute><CompanyApplications /></CompanyRoute>} />
            <Route path="/company/applications/:applicationId" element={<CompanyRoute><CompanyApplicationDetails /></CompanyRoute>} />
            <Route path="/company/settings" element={<CompanyRoute><CompanySettings /></CompanyRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="/admin/courses" element={<AdminRoute><AdminCoursesPage /></AdminRoute>} />
            <Route path="/admin/jobs" element={<AdminRoute><AdminJobsPage /></AdminRoute>} />
            <Route path="/admin/applications" element={<AdminRoute><AdminApplicationsPage /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
          </Routes>
        </main>
        {!isPortalRoute && <Footer />}
      </div>
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;
