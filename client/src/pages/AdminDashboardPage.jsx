import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, BookOpen, Briefcase, FileText, LogOut, Menu, X,
  TrendingUp, Activity
} from 'lucide-react';
import api from '../utils/api';

export default function AdminDashboardPage() {
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
      const res = await api.get('/admin/dashboard/stats');
      const statsData = res.data?.data || res.data;
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
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

  const navigateTo = (tab) => {
    setActiveTab(tab);
    switch(tab) {
      case 'dashboard':
        navigate('/admin/dashboard');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'courses':
        navigate('/admin/courses');
        break;
      case 'jobs':
        navigate('/admin/jobs');
        break;
      case 'applications':
        navigate('/admin/applications');
        break;
      default:
        navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#03070A] text-gray-200 flex">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-[#0A1A22]/80 backdrop-blur-xl border-r border-[#1e3a42]/50 transition-all duration-300 fixed h-screen flex flex-col`}>
        <div className="p-6 border-b border-[#1e3a42]/50 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-[#2dd4bf]">Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#1e3a42]/30 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
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
                <StatCard icon={Users} label="Total Users" value={stats.total_users} color="from-blue-500 to-cyan-500" />
                <StatCard icon={BookOpen} label="Total Courses" value={stats.total_courses} color="from-purple-500 to-pink-500" />
                <StatCard icon={Briefcase} label="Total Jobs" value={stats.total_jobs} color="from-green-500 to-teal-500" />
                <StatCard icon={FileText} label="Total Applications" value={stats.total_applications} color="from-orange-500 to-red-500" />
                <StatCard icon={Activity} label="Pending Apps" value={stats.applications_by_status.pending} color="from-yellow-500 to-orange-500" />
              </div>

              {/* Applications Status Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileText size={24} className="text-[#14b8a6]" />
                    Applications Status
                  </h2>
                  <div className="space-y-4">
                    {[
                      { status: 'Pending', count: stats.applications_by_status.pending, color: 'bg-yellow-500' },
                      { status: 'Reviewed', count: stats.applications_by_status.reviewed, color: 'bg-blue-500' },
                      { status: 'Shortlisted', count: stats.applications_by_status.shortlisted, color: 'bg-purple-500' },
                      { status: 'Accepted', count: stats.applications_by_status.accepted, color: 'bg-green-500' },
                      { status: 'Rejected', count: stats.applications_by_status.rejected, color: 'bg-red-500' },
                    ].map(item => (
                      <div key={item.status} className="flex items-center justify-between">
                        <span className="text-gray-300">{item.status}</span>
                        <span className={`${item.color} text-white px-3 py-1 rounded-full font-bold text-sm`}>{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

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
            </>
          ) : null}
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
