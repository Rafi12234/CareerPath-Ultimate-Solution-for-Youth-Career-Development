import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Menu, X, Plus, Edit, Trash2, Search, Eye, MoreVertical } from 'lucide-react';
import api from '../utils/api';

export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    const admin = localStorage.getItem('admin_user');
    if (!admin) {
      navigate('/login');
      return;
    }
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

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
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

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.assign('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'users', label: 'Users', icon: BookOpen },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'jobs', label: 'Jobs', icon: BookOpen },
    { id: 'applications', label: 'Applications', icon: BookOpen },
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
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#0A1A22]/80 backdrop-blur-xl border-r border-[#1e3a42]/50 transition-all duration-300 fixed h-screen flex flex-col`}>
        <div className="p-6 border-b border-[#1e3a42]/50 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-[#2dd4bf]">Admin</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-[#1e3a42]/30 rounded-lg transition">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => navigateTo(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${item.id === 'courses' ? 'bg-[#14b8a6]/20 text-[#2dd4bf] border border-[#14b8a6]/30' : 'text-gray-400 hover:text-gray-300 hover:bg-[#1e3a42]/20'}`}>
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

      <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Courses</h1>
              <p className="text-gray-400">Create, edit, and manage courses</p>
            </div>
            <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 px-6 py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-lg font-semibold transition">
              <Plus size={20} /> Add Course
            </button>
          </div>

          {showAddForm && (
            <div className="mb-6 bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Create New Course</h2>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Course Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                  <input type="text" placeholder="Topic" value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} required className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                  <input type="text" placeholder="Instructor Name" value={formData.instructor} onChange={(e) => setFormData({...formData, instructor: e.target.value})} required className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                  <input type="text" placeholder="Duration (e.g., 8 weeks)" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                  <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <textarea placeholder="Course Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required rows="4" className="w-full px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                <div className="flex gap-4">
                  <button type="submit" className="px-6 py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-lg font-semibold transition">Create Course</button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition">Cancel</button>
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
                  <h3 className="text-lg font-bold text-white mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>
                  <div className="space-y-2 text-sm mb-4">
                    <p className="text-gray-500">Instructor: <span className="text-gray-300">{course.instructor}</span></p>
                    <p className="text-gray-500">Duration: <span className="text-gray-300">{course.duration}</span></p>
                    <p className="text-gray-500">Level: <span className={`px-2 py-1 rounded text-xs font-semibold ${course.level === 'Beginner' ? 'bg-green-500/20 text-green-300' : course.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>{course.level}</span></p>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-[#1e3a42]/30">
                    <button onClick={() => handleViewCourseDetails(course.id)} className="flex-1 py-2 bg-[#14b8a6]/10 hover:bg-[#14b8a6]/20 text-[#2dd4bf] rounded-lg transition text-sm font-semibold flex items-center justify-center gap-1">
                      <Eye size={14} /> View
                    </button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition text-sm font-semibold flex items-center justify-center gap-1">
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
      </main>
    </div>
  );
}
