import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, BookOpen, Briefcase, FileText, LogOut, Menu, X,
  Users2, Upload, Eye, Edit, Trash2, Plus, Search, Filter, Download,
  TrendingUp, Activity, Clock, CheckCircle, AlertCircle, MoreVertical
} from 'lucide-react';
import api from '../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const admin = localStorage.getItem('admin_user');
    if (!admin) {
      navigate('/login');
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await api.get('/admin/dashboard/stats');
      console.log('Dashboard stats response:', res.data);
      // Handle different response structures
      const statsData = res.data?.data || res.data;
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.assign('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#03070A] text-gray-200 flex">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-[#0A1A22]/80 backdrop-blur-xl border-r border-[#1e3a42]/50 transition-all duration-300 fixed h-screen flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-[#1e3a42]/50 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-[#2dd4bf]">Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#1e3a42]/30 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? 'bg-[#14b8a6]/20 text-[#2dd4bf] border border-[#14b8a6]/30'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-[#1e3a42]/20'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#1e3a42]/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        <div className="p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-gray-400">Welcome back! Here's your platform overview</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-2 border-[#14b8a6]/30 border-t-[#14b8a6] rounded-full animate-spin" />
                </div>
              ) : stats ? (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <StatCard
                      icon={Users}
                      label="Total Users"
                      value={stats.total_users}
                      color="from-blue-500 to-cyan-500"
                    />
                    <StatCard
                      icon={BookOpen}
                      label="Total Courses"
                      value={stats.total_courses}
                      color="from-purple-500 to-pink-500"
                    />
                    <StatCard
                      icon={Briefcase}
                      label="Total Jobs"
                      value={stats.total_jobs}
                      color="from-green-500 to-teal-500"
                    />
                    <StatCard
                      icon={FileText}
                      label="Total Applications"
                      value={stats.total_applications}
                      color="from-orange-500 to-red-500"
                    />
                    <StatCard
                      icon={Activity}
                      label="Pending Apps"
                      value={stats.applications_by_status.pending}
                      color="from-yellow-500 to-orange-500"
                    />
                  </div>

                  {/* Applications Status Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Application Status */}
                    <div className="bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl p-6">
                      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <FileText size={24} className="text-[#14b8a6]" />
                        Applications Status
                      </h2>
                      <div className="space-y-4">
                        {[
                          { status: 'Pending', count: stats.applications_by_status.pending, color: 'bg-yellow-500', bgColor: 'bg-yellow-500/10' },
                          { status: 'Reviewed', count: stats.applications_by_status.reviewed, color: 'bg-blue-500', bgColor: 'bg-blue-500/10' },
                          { status: 'Shortlisted', count: stats.applications_by_status.shortlisted, color: 'bg-purple-500', bgColor: 'bg-purple-500/10' },
                          { status: 'Accepted', count: stats.applications_by_status.accepted, color: 'bg-green-500', bgColor: 'bg-green-500/10' },
                          { status: 'Rejected', count: stats.applications_by_status.rejected, color: 'bg-red-500', bgColor: 'bg-red-500/10' },
                        ].map(item => (
                          <div key={item.status} className={`${item.bgColor} border border-${item.color.split('-')[1]}-500/20 rounded-lg p-3 flex items-center justify-between`}>
                            <span className="text-gray-300">{item.status}</span>
                            <span className={`${item.color} text-white px-3 py-1 rounded-full font-bold text-sm`}>{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Course Levels */}
                    <div className="bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl p-6">
                      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <BookOpen size={24} className="text-[#14b8a6]" />
                        Courses by Level
                      </h2>
                      <div className="space-y-4">
                        {[
                          { level: 'Beginner', count: stats.enrollments_by_level.beginner, color: 'bg-green-500' },
                          { level: 'Intermediate', count: stats.enrollments_by_level.intermediate, color: 'bg-blue-500' },
                          { level: 'Advanced', count: stats.enrollments_by_level.advanced, color: 'bg-purple-500' },
                        ].map(item => (
                          <div key={item.level} className="flex items-center gap-4">
                            <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold`}>
                              {item.count}
                            </div>
                            <span className="text-gray-300">{item.level} Courses</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Manage Users', action: 'users' },
                        { label: 'Add Course', action: 'courses' },
                        { label: 'Post Job', action: 'jobs' },
                        { label: 'Review Apps', action: 'applications' },
                      ].map(item => (
                        <button
                          key={item.action}
                          onClick={() => setActiveTab(item.action)}
                          className="bg-[#14b8a6]/10 hover:bg-[#14b8a6]/20 border border-[#14b8a6]/30 rounded-lg py-4 transition text-center"
                        >
                          <p className="text-white font-semibold">{item.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && <AdminUsers />}

          {/* Courses Tab */}
          {activeTab === 'courses' && <AdminCourses />}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && <AdminJobs />}

          {/* Applications Tab */}
          {activeTab === 'applications' && <AdminApplications />}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} bg-opacity-10 border border-${color.split(' ')[1]}/20 rounded-2xl p-6 backdrop-blur-xl`}>
      <div className="flex items-center justify-between mb-4">
        <Icon size={24} className="text-[#14b8a6]" />
        <TrendingUp size={16} className="text-green-400" />
      </div>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

// Admin Users Component
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
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
      setShowProfileModal(true);
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage Users</h1>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-xl text-white placeholder-gray-600 focus:border-[#14b8a6]/50 focus:ring-1 focus:ring-[#14b8a6]/20"
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
                  <td className="px-6 py-4 text-gray-400 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewUser(user.id)}
                      className="p-2 hover:bg-[#1e3a42]/30 rounded-lg transition text-gray-400 hover:text-[#14b8a6]"
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

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl bg-[#0A1A22] border border-[#1e3a42]/50 rounded-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">User Profile</h2>
              <button
                onClick={() => {
                  setShowProfileModal(false);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#0F2635]/40 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="text-white font-semibold">{selectedUser.name || 'N/A'}</p>
                  </div>
                  <div className="bg-[#0F2635]/40 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-semibold">{selectedUser.email || 'N/A'}</p>
                  </div>
                  <div className="bg-[#0F2635]/40 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-semibold">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div className="bg-[#0F2635]/40 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Joined</p>
                    <p className="text-white font-semibold">
                      {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedUser.skills || []).length > 0 ? (
                      selectedUser.skills.map((skill) => (
                        <span key={skill.id} className="px-3 py-1 rounded-full bg-[#14b8a6]/20 text-[#2dd4bf] text-sm">
                          {skill.skill_name} {skill.proficiency ? `(${skill.proficiency})` : ''}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400">No skills added.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-red-400">Failed to load user profile.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Courses Component
function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topic: '',
    instructor: '',
    duration: '',
    level: 'Beginner'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      const courseData = res.data?.data?.data || res.data?.data || res.data || [];
      setCourses(Array.isArray(courseData) ? courseData : []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/courses', formData);
      setFormData({ name: '', description: '', topic: '', instructor: '', duration: '', level: 'Beginner' });
      setShowAddForm(false);
      fetchCourses();
    } catch (err) {
      console.error('Failed to add course:', err);
    }
  };

  const handleOpenEditCourse = (course) => {
    setEditingCourseId(course.id);
    setFormData({
      name: course.name || '',
      description: course.description || '',
      topic: course.topic || '',
      instructor: course.instructor || '',
      duration: course.duration || '',
      level: course.level || 'Beginner'
    });
    setShowEditForm(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!editingCourseId) return;

    try {
      await api.put(`/admin/courses/${editingCourseId}`, formData);
      setShowEditForm(false);
      setEditingCourseId(null);
      setFormData({ name: '', description: '', topic: '', instructor: '', duration: '', level: 'Beginner' });
      fetchCourses();
    } catch (err) {
      console.error('Failed to update course:', err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmed = window.confirm('Are you sure you want to delete this course?');
    if (!confirmed) return;

    try {
      await api.delete(`/admin/courses/${courseId}`);
      fetchCourses();
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  const handleViewCourseDetails = async (courseId) => {
    try {
      const res = await api.get(`/admin/courses/${courseId}`);
      setCourseDetails(res.data?.data || res.data);
      setShowCourseDetails(true);
    } catch (err) {
      console.error('Failed to fetch course details:', err);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage Courses</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-lg font-semibold transition"
        >
          <Plus size={20} /> Add Course
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Create New Course</h2>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Course Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600 focus:border-[#14b8a6]/50"
              />
              <input
                type="text"
                placeholder="Topic"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600 focus:border-[#14b8a6]/50"
              />
              <input
                type="text"
                placeholder="Instructor Name"
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600 focus:border-[#14b8a6]/50"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 8 weeks)"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600 focus:border-[#14b8a6]/50"
              />
              <select
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white focus:border-[#14b8a6]/50"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <textarea
              placeholder="Course Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows="4"
              className="w-full px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600 focus:border-[#14b8a6]/50"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-lg font-semibold transition"
              >
                Create Course
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showEditForm && (
        <div className="mb-6 bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Edit Course</h2>
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Course Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600 focus:border-[#14b8a6]/50"
              />
              <input
                type="text"
                placeholder="Topic"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600 focus:border-[#14b8a6]/50"
              />
              <input
                type="text"
                placeholder="Instructor Name"
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600 focus:border-[#14b8a6]/50"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 8 weeks)"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600 focus:border-[#14b8a6]/50"
              />
              <select
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white focus:border-[#14b8a6]/50"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <textarea
              placeholder="Course Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows="4"
              className="w-full px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600 focus:border-[#14b8a6]/50"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-lg font-semibold transition"
              >
                Update Course
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingCourseId(null);
                }}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#14b8a6]/30 border-t-[#14b8a6] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl p-6 hover:border-[#14b8a6]/30 transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{course.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{course.topic}</p>
                </div>
                <button
                  onClick={() => handleViewCourseDetails(course.id)}
                  className="p-2 hover:bg-[#1e3a42]/30 rounded-lg transition"
                >
                  <MoreVertical size={18} className="text-gray-400" />
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
              <div className="space-y-2 text-sm mb-4">
                <p className="text-gray-500">Instructor: <span className="text-gray-300">{course.instructor}</span></p>
                <p className="text-gray-500">Duration: <span className="text-gray-300">{course.duration}</span></p>
                <p className="text-gray-500">Level: <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  course.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                  course.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>{course.level}</span></p>
              </div>
              <div className="flex gap-2 pt-4 border-t border-[#1e3a42]/30">
                <button
                  onClick={() => handleOpenEditCourse(course)}
                  className="flex-1 py-2 bg-[#14b8a6]/10 hover:bg-[#14b8a6]/20 text-[#2dd4bf] rounded-lg transition text-sm font-semibold flex items-center justify-center gap-1"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition text-sm font-semibold flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCourseDetails && courseDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl bg-[#0A1A22] border border-[#1e3a42]/50 rounded-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Course Details</h2>
              <button onClick={() => setShowCourseDetails(false)} className="p-2 rounded-lg hover:bg-[#1e3a42]/40">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-white"><span className="text-gray-400">Name:</span> {courseDetails.name}</p>
              <p className="text-white"><span className="text-gray-400">Topic:</span> {courseDetails.topic}</p>
              <p className="text-white"><span className="text-gray-400">Instructor:</span> {courseDetails.instructor}</p>
              <p className="text-white"><span className="text-gray-400">Duration:</span> {courseDetails.duration}</p>
              <p className="text-white"><span className="text-gray-400">Description:</span> {courseDetails.description}</p>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3">Videos / Modules</h3>
            <div className="space-y-2">
              {(courseDetails.videos || []).length > 0 ? (
                courseDetails.videos.map((video) => (
                  <div key={video.id} className="p-3 bg-[#0F2635]/40 rounded-lg border border-[#1e3a42]/40">
                    <p className="text-white font-medium">{video.title}</p>
                    <p className="text-gray-400 text-sm">{video.duration || 'No duration'} • Sequence: {video.sequence || 0}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No videos/modules available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Jobs Component
function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    level: 'Entry Level',
    description: '',
    salary_min: 0,
    salary_max: 0,
    track: '',
    skills: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/admin/jobs');
      const jobData = res.data?.data?.data || res.data?.data || res.data || [];
      setJobs(Array.isArray(jobData) ? jobData : []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const skilsArray = formData.skills.split(',').map(s => s.trim());
      await api.post('/admin/jobs', {
        ...formData,
        salary_min: parseInt(formData.salary_min),
        salary_max: parseInt(formData.salary_max),
        skills: skilsArray
      });
      setFormData({
        title: '', company: '', location: '', type: 'Full-time',
        level: 'Entry Level', description: '', salary_min: 0, salary_max: 0,
        track: '', skills: ''
      });
      setShowAddForm(false);
      fetchJobs();
    } catch (err) {
      console.error('Failed to add job:', err);
    }
  };

  const handleOpenEditJob = (job) => {
    setEditingJobId(job.id);
    setFormData({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      type: job.type || 'Full-time',
      level: job.level || 'Entry Level',
      description: job.description || '',
      salary_min: job.salary_min || 0,
      salary_max: job.salary_max || 0,
      track: job.track || '',
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || '')
    });
    setShowEditForm(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    if (!editingJobId) return;

    try {
      const skillsArray = String(formData.skills || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.put(`/admin/jobs/${editingJobId}`, {
        ...formData,
        salary_min: parseInt(formData.salary_min, 10) || 0,
        salary_max: parseInt(formData.salary_max, 10) || 0,
        skills: skillsArray
      });

      setShowEditForm(false);
      setEditingJobId(null);
      fetchJobs();
    } catch (err) {
      console.error('Failed to update job:', err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;

    try {
      await api.delete(`/admin/jobs/${jobId}`);
      fetchJobs();
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage Jobs</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-lg font-semibold transition"
        >
          <Plus size={20} /> Post Job
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Post New Job</h2>
          <form onSubmit={handleAddJob} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
              <select
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white"
              >
                <option>Entry Level</option>
                <option>Mid Level</option>
                <option>Senior</option>
              </select>
              <input
                type="text"
                placeholder="Track (e.g., Software Engineering)"
                value={formData.track}
                onChange={(e) => setFormData({...formData, track: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
              <input
                type="number"
                placeholder="Minimum Salary"
                value={formData.salary_min}
                onChange={(e) => setFormData({...formData, salary_min: e.target.value})}
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
              <input
                type="number"
                placeholder="Maximum Salary"
                value={formData.salary_max}
                onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
              <input
                type="text"
                placeholder="Skills (comma-separated)"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                className="md:col-span-2 px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
            </div>
            <textarea
              placeholder="Job Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows="4"
              className="w-full px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
            />
            <div className="flex gap-4">
              <button type="submit" className="px-6 py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-lg font-semibold">
                Post Job
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showEditForm && (
        <div className="mb-6 bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Edit Job</h2>
          <form onSubmit={handleUpdateJob} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
              <select
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white"
              >
                <option>Entry Level</option>
                <option>Mid Level</option>
                <option>Senior</option>
              </select>
              <input
                type="text"
                placeholder="Track"
                value={formData.track}
                onChange={(e) => setFormData({...formData, track: e.target.value})}
                required
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
              <input
                type="number"
                placeholder="Minimum Salary"
                value={formData.salary_min}
                onChange={(e) => setFormData({...formData, salary_min: e.target.value})}
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
              <input
                type="number"
                placeholder="Maximum Salary"
                value={formData.salary_max}
                onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
              <input
                type="text"
                placeholder="Skills (comma-separated)"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                className="md:col-span-2 px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
              />
            </div>
            <textarea
              placeholder="Job Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows="4"
              className="w-full px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600"
            />
            <div className="flex gap-4">
              <button type="submit" className="px-6 py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-lg font-semibold">
                Update Job
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingJobId(null);
                }}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Title</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Company</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Level</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Apps</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, idx) => (
                <tr key={job.id} className="border-b border-[#1e3a42]/30 hover:bg-[#0F2635]/30">
                  <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                  <td className="px-6 py-4 text-white font-medium">{job.title}</td>
                  <td className="px-6 py-4 text-gray-400">{job.company}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{job.level}</td>
                  <td className="px-6 py-4"><span className="bg-[#14b8a6]/20 text-[#2dd4bf] px-3 py-1 rounded-full text-sm font-semibold">{job.applications_count}</span></td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleOpenEditJob(job)}
                      className="p-2 hover:bg-[#1e3a42]/30 rounded transition text-gray-400 hover:text-[#14b8a6]"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 hover:bg-[#1e3a42]/30 rounded transition text-gray-400 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Admin Applications Component
function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const url = filter ? `/admin/applications?status=${filter}` : '/admin/applications';
      const res = await api.get(url);
      console.log('Applications response:', res.data);
      // Handle different response structures
      const appData = res.data?.data?.data || res.data?.data || res.data || [];
      setApplications(Array.isArray(appData) ? appData : []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      await api.put(`/admin/applications/${appId}`, { status: newStatus });
      fetchApplications();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">Manage Applications</h1>
        <div className="flex gap-2 flex-wrap">
          {['', 'Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition font-semibold ${
                filter === status
                  ? 'bg-[#14b8a6] text-white'
                  : 'bg-[#1e3a42]/30 text-gray-400 hover:text-gray-300'
              }`}
            >
              {status || 'All'}
            </button>
          ))}
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
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Applicant</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Job</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Applied Date</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Status</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, idx) => (
                <tr key={app.id} className="border-b border-[#1e3a42]/30 hover:bg-[#0F2635]/30">
                  <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                  <td className="px-6 py-4 text-white font-medium">{app.user?.name}</td>
                  <td className="px-6 py-4 text-gray-400">{app.job?.title}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{new Date(app.applied_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      app.status === 'Reviewed' ? 'bg-blue-500/20 text-blue-300' :
                      app.status === 'Shortlisted' ? 'bg-purple-500/20 text-purple-300' :
                      app.status === 'Accepted' ? 'bg-green-500/20 text-green-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#14b8a6]/50"
                    >
                      <option>Pending</option>
                      <option>Reviewed</option>
                      <option>Shortlisted</option>
                      <option>Accepted</option>
                      <option>Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
