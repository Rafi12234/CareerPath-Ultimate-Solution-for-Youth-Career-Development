import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, LogOut, Menu, X, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../utils/api';

export default function AdminJobsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    const admin = localStorage.getItem('admin_user');
    if (!admin) {
      navigate('/login');
      return;
    }
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
      const skillsArray = formData.skills.split(',').map(s => s.trim());
      await api.post('/admin/jobs', {
        ...formData,
        salary_min: parseInt(formData.salary_min),
        salary_max: parseInt(formData.salary_max),
        skills: skillsArray
      });
      setFormData({ title: '', company: '', location: '', type: 'Full-time', level: 'Entry Level', description: '', salary_min: 0, salary_max: 0, track: '', skills: '' });
      setShowAddForm(false);
      fetchJobs();
    } catch (err) {
      console.error('Failed to add job:', err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/admin/jobs/${jobId}`);
      fetchJobs();
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.assign('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
    { id: 'users', label: 'Users', icon: Briefcase },
    { id: 'courses', label: 'Courses', icon: Briefcase },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: Briefcase },
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
            <button key={item.id} onClick={() => navigateTo(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${item.id === 'jobs' ? 'bg-[#14b8a6]/20 text-[#2dd4bf] border border-[#14b8a6]/30' : 'text-gray-400 hover:text-gray-300 hover:bg-[#1e3a42]/20'}`}>
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
              <h1 className="text-3xl font-bold text-white mb-2">Manage Jobs</h1>
              <p className="text-gray-400">Post and manage job listings</p>
            </div>
            <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 px-6 py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-lg font-semibold transition">
              <Plus size={20} /> Post Job
            </button>
          </div>

          {showAddForm && (
            <div className="mb-6 bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Post New Job</h2>
              <form onSubmit={handleAddJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Job Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                  <input type="text" placeholder="Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} required className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                  <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                  <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white">
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior</option>
                  </select>
                  <input type="text" placeholder="Track (e.g., Software Engineering)" value={formData.track} onChange={(e) => setFormData({...formData, track: e.target.value})} required className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                  <input type="number" placeholder="Minimum Salary" value={formData.salary_min} onChange={(e) => setFormData({...formData, salary_min: e.target.value})} className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                  <input type="number" placeholder="Maximum Salary" value={formData.salary_max} onChange={(e) => setFormData({...formData, salary_max: e.target.value})} className="px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                  <input type="text" placeholder="Skills (comma-separated)" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} className="md:col-span-2 px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                </div>
                <textarea placeholder="Job Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required rows="4" className="w-full px-4 py-3 bg-[#0F2635]/50 border border-[#1e3a42] rounded-lg text-white placeholder-gray-600" />
                <div className="flex gap-4">
                  <button type="submit" className="px-6 py-2.5 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-lg font-semibold transition">Post Job</button>
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
            <div className="bg-[#0A1A22]/60 border border-[#1e3a42]/50 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-[#1e3a42]/50 bg-[#0F2635]/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">#</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Title</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Company</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Level</th>
                    <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Applications</th>
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
                      <td className="px-6 py-4"><span className="bg-[#14b8a6]/20 text-[#2dd4bf] px-3 py-1 rounded-full text-sm font-semibold">{job.applications_count || 0}</span></td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => handleDeleteJob(job.id)} className="p-2 hover:bg-[#1e3a42]/30 rounded transition text-gray-400 hover:text-red-400">
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
      </main>
    </div>
  );
}
