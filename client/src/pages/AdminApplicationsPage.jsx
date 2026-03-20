import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, LogOut, Menu, X } from 'lucide-react';
import api from '../utils/api';

export default function AdminApplicationsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const admin = localStorage.getItem('admin_user');
    if (!admin) {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      const url = filter ? `/admin/applications?status=${filter}` : '/admin/applications';
      const res = await api.get(url);
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
      await api.put(`/admin/applications/${appId}`, { status: newStatus });
      fetchApplications();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.assign('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'users', label: 'Users', icon: FileText },
    { id: 'courses', label: 'Courses', icon: FileText },
    { id: 'jobs', label: 'Jobs', icon: FileText },
    { id: 'applications', label: 'Applications', icon: FileText },
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
            <button key={item.id} onClick={() => navigateTo(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${item.id === 'applications' ? 'bg-[#14b8a6]/20 text-[#2dd4bf] border border-[#14b8a6]/30' : 'text-gray-400 hover:text-gray-300 hover:bg-[#1e3a42]/20'}`}>
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
      </main>
    </div>
  );
}
