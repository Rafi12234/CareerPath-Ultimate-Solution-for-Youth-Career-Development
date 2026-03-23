import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, Menu, X, Search, Eye, Mail, Phone, MapPin, Briefcase, BookOpen, Award } from 'lucide-react';
import api from '../utils/api';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem('admin_user');
    if (!admin) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/admin/users?search=${search}`);
      const userData = res.data?.data?.data || res.data?.data || res.data || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      setProfileLoading(true);
      setShowUserModal(true);
      const res = await api.get(`/admin/users/${userId}`);
      const userProfile = res.data?.data || res.data;
      setSelectedUser(userProfile);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setSelectedUser(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.assign('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: Award },
  ];

  const navigateTo = (id) => {
    if (id === 'dashboard') navigate('/admin/dashboard');
    else if (id === 'users') navigate('/admin/users');
    else if (id === 'courses') navigate('/admin/courses');
    else if (id === 'jobs') navigate('/admin/jobs');
    else if (id === 'applications') navigate('/admin/applications');
  };

  return (
    <div className="min-h-screen bg-[#03070A] text-gray-200 flex">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-[#0A1A22]/80 backdrop-blur-xl border-r border-[#1e3a42]/50 transition-all duration-300 fixed h-screen flex flex-col`}>
        <div className="p-6 border-b border-[#1e3a42]/50 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-[#2dd4bf]">Admin</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-[#1e3a42]/30 rounded-lg transition">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                item.id === 'users'
                  ? 'bg-[#14b8a6]/20 text-[#2dd4bf] border border-[#14b8a6]/30'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-[#1e3a42]/20'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1e3a42]/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Manage Users</h1>
            <p className="text-gray-400">View all user profiles and information</p>
          </div>

          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-xl text-white placeholder-gray-600 focus:border-[#14b8a6]/50"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-[#14b8a6]/30 border-t-[#14b8a6] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-[#1e3a42]/50 bg-[#0F2635]/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">#</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Name</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Email</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Phone</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Joined</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user.id} className="border-b border-[#1e3a42]/30 hover:bg-[#0F2635]/30 transition">
                      <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                      <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 text-gray-400">{user.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="p-2 hover:bg-[#1e3a42]/30 rounded-lg transition text-gray-400 hover:text-[#14b8a6]"
                          title="View all user information"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* User Profile Modal - Shows ALL Information */}
          {showUserModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
              <div className="w-full max-w-4xl bg-[#0A1A22] border border-[#1e3a42]/50 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Complete User Profile</h2>
                  <button
                    onClick={() => {
                      setShowUserModal(false);
                      setSelectedUser(null);
                    }}
                    className="p-2 rounded-lg hover:bg-[#1e3a42]/40"
                  >
                    <X size={20} />
                  </button>
                </div>

                {profileLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-2 border-[#14b8a6]/30 border-t-[#14b8a6] rounded-full animate-spin" />
                  </div>
                ) : selectedUser ? (
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-[#0F2635]/40 rounded-lg p-4 border border-[#1e3a42]/30">
                      <h3 className="text-lg font-semibold text-[#14b8a6] mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Full Name</p>
                          <p className="text-white font-medium">{selectedUser.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Email Address</p>
                          <p className="text-white font-medium flex items-center gap-2"><Mail size={14} /> {selectedUser.email || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Phone Number</p>
                          <p className="text-white font-medium flex items-center gap-2"><Phone size={14} /> {selectedUser.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Date of Birth</p>
                          <p className="text-white font-medium">{selectedUser.date_of_birth ? new Date(selectedUser.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Gender</p>
                          <p className="text-white font-medium">{selectedUser.gender || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Marital Status</p>
                          <p className="text-white font-medium">{selectedUser.marital_status || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Nationality</p>
                          <p className="text-white font-medium">{selectedUser.nationality || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Location</p>
                          <p className="text-white font-medium flex items-center gap-2"><MapPin size={14} /> {selectedUser.location || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Professional Headline</p>
                          <p className="text-white font-medium">{selectedUser.headline || 'N/A'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-gray-400 text-sm">Professional Bio</p>
                          <p className="text-white font-medium">{selectedUser.bio || 'N/A'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-gray-400 text-sm">Present Address</p>
                          <p className="text-white font-medium">{selectedUser.present_address || 'N/A'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-gray-400 text-sm">Permanent Address</p>
                          <p className="text-white font-medium">{selectedUser.permanent_address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Educational Information */}
                    <div className="bg-[#0F2635]/40 rounded-lg p-4 border border-[#1e3a42]/30">
                      <h3 className="text-lg font-semibold text-[#14b8a6] mb-4">Educational Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Education Board</p>
                          <p className="text-white font-medium">{selectedUser.education_board || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Education Group</p>
                          <p className="text-white font-medium">{selectedUser.education_group || 'N/A'}</p>
                        </div>

                        {/* SSC Information */}
                        <div className="md:col-span-2">
                          <p className="text-gray-300 font-semibold text-sm mb-2">Secondary School Certificate (SSC)</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">School Name</p>
                          <p className="text-white font-medium">{selectedUser.school_name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">SSC Year</p>
                          <p className="text-white font-medium">{selectedUser.ssc_year || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">SSC Result</p>
                          <p className="text-white font-medium">{selectedUser.ssc_result || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">SSC Group</p>
                          <p className="text-white font-medium">{selectedUser.ssc_group || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">SSC Board</p>
                          <p className="text-white font-medium">{selectedUser.ssc_board || 'N/A'}</p>
                        </div>

                        {/* HSC Information */}
                        <div className="md:col-span-2">
                          <p className="text-gray-300 font-semibold text-sm mb-2">Higher Secondary Certificate (HSC)</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">College Name</p>
                          <p className="text-white font-medium">{selectedUser.college_name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">HSC Year</p>
                          <p className="text-white font-medium">{selectedUser.hsc_year || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">HSC Result</p>
                          <p className="text-white font-medium">{selectedUser.hsc_result || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">HSC Group</p>
                          <p className="text-white font-medium">{selectedUser.hsc_group || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">HSC Board</p>
                          <p className="text-white font-medium">{selectedUser.hsc_board || 'N/A'}</p>
                        </div>

                        {/* University Information */}
                        <div className="md:col-span-2">
                          <p className="text-gray-300 font-semibold text-sm mb-2">University Education</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">University Name</p>
                          <p className="text-white font-medium">{selectedUser.university_name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">University Status</p>
                          <p className="text-white font-medium">{selectedUser.university_status || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Current Study Year</p>
                          <p className="text-white font-medium">{selectedUser.current_study_year || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Current Study Semester</p>
                          <p className="text-white font-medium">{selectedUser.current_study_semester || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Graduation Year</p>
                          <p className="text-white font-medium">{selectedUser.university_graduation_year || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">CGPA</p>
                          <p className="text-white font-medium">{selectedUser.university_cgpa || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-[#0F2635]/40 rounded-lg p-4 border border-[#1e3a42]/30">
                      <h3 className="text-lg font-semibold text-[#14b8a6] mb-4">Professional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Fresher Status</p>
                          <p className="text-white font-medium">
                            <span className={`px-2 py-1 rounded text-sm ${selectedUser.is_fresher ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {selectedUser.is_fresher ? 'Fresher' : 'Experienced'}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Years of Experience</p>
                          <p className="text-white font-medium">{selectedUser.years_of_experience || '0'} years</p>
                        </div>

                        {!selectedUser.is_fresher && (
                          <>
                            {/* Current Job */}
                            <div className="md:col-span-2">
                              <p className="text-gray-300 font-semibold text-sm mb-2">Current Employment</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Current Job Title</p>
                              <p className="text-white font-medium">{selectedUser.current_job_title || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Current Company</p>
                              <p className="text-white font-medium">{selectedUser.current_company || 'N/A'}</p>
                            </div>

                            {/* Previous Job */}
                            <div className="md:col-span-2">
                              <p className="text-gray-300 font-semibold text-sm mb-2">Previous Employment</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Previous Job Title</p>
                              <p className="text-white font-medium">{selectedUser.previous_job_title || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Previous Company</p>
                              <p className="text-white font-medium">{selectedUser.previous_company || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Previous Job Start Date</p>
                              <p className="text-white font-medium">{selectedUser.previous_job_start ? new Date(selectedUser.previous_job_start).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Previous Job End Date</p>
                              <p className="text-white font-medium">{selectedUser.previous_job_end ? new Date(selectedUser.previous_job_end).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-gray-400 text-sm">Previous Job Description</p>
                              <p className="text-white font-medium">{selectedUser.previous_job_description || 'N/A'}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-[#0F2635]/40 rounded-lg p-4 border border-[#1e3a42]/30">
                      <h3 className="text-lg font-semibold text-[#14b8a6] mb-4">Skills & Proficiency</h3>
                      <div className="flex flex-wrap gap-2">
                        {(selectedUser.skills || []).length > 0 ? (
                          selectedUser.skills.map((skill) => (
                            <span key={skill.id} className="px-3 py-1 rounded-full bg-[#14b8a6]/20 text-[#2dd4bf] text-sm border border-[#14b8a6]/30">
                              {skill.skill_name} <span className="text-gray-400 ml-1">({skill.proficiency || 'N/A'})</span>
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-400">No skills added.</p>
                        )}
                      </div>
                    </div>

                    {/* Job Applications */}
                    <div className="bg-[#0F2635]/40 rounded-lg p-4 border border-[#1e3a42]/30">
                      <h3 className="text-lg font-semibold text-[#14b8a6] mb-4">Job Applications ({(selectedUser.applications || []).length})</h3>
                      {(selectedUser.applications || []).length > 0 ? (
                        <div className="space-y-2">
                          {selectedUser.applications.map((app) => (
                            <div key={app.id} className="p-2 bg-[#0A1A22]/50 rounded border border-[#1e3a42]/20 text-sm">
                              <p className="text-white font-medium">{app.job?.title || 'Job'} - {app.job?.company || 'Company'}</p>
                              <p className="text-gray-400 text-xs">Status: <span className="text-[#14b8a6]">{app.status}</span> | Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">No job applications.</p>
                      )}
                    </div>

                    {/* Course Enrollments */}
                    <div className="bg-[#0F2635]/40 rounded-lg p-4 border border-[#1e3a42]/30">
                      <h3 className="text-lg font-semibold text-[#14b8a6] mb-4">Course Enrollments ({(selectedUser.enrollments || []).length})</h3>
                      {(selectedUser.enrollments || []).length > 0 ? (
                        <div className="space-y-2">
                          {selectedUser.enrollments.map((enroll) => (
                            <div key={enroll.id} className="p-2 bg-[#0A1A22]/50 rounded border border-[#1e3a42]/20 text-sm">
                              <p className="text-white font-medium">{enroll.course?.name || 'Course'}</p>
                              <p className="text-gray-400 text-xs">Level: {enroll.course?.level || 'N/A'}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400">No course enrollments.</p>
                      )}
                    </div>

                    {/* Account Information */}
                    <div className="bg-[#0F2635]/40 rounded-lg p-4 border border-[#1e3a42]/30">
                      <h3 className="text-lg font-semibold text-[#14b8a6] mb-4">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Member Since</p>
                          <p className="text-white font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Last Updated</p>
                          <p className="text-white font-medium">{new Date(selectedUser.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-lg p-4 text-sm text-gray-300">
                      ℹ️ This is a read-only view. Admin cannot modify user information directly.
                    </div>
                  </div>
                ) : (
                  <p className="text-red-400">Failed to load user profile.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
