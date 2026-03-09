import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { User, Plus, X, Save, Pencil, Trash2, BookOpen, Briefcase, Award, ChevronDown } from 'lucide-react';
import api from '../utils/api';

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Expert', 'Professional'];

const PROFICIENCY_COLORS = {
  Beginner: { bg: 'bg-blue-500/15', text: 'text-blue-400', bar: 'bg-blue-500' },
  Intermediate: { bg: 'bg-amber-500/15', text: 'text-amber-400', bar: 'bg-amber-500' },
  Expert: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  Professional: { bg: 'bg-purple-500/15', text: 'text-purple-400', bar: 'bg-purple-500' },
};

const PROFICIENCY_WIDTH = {
  Beginner: 'w-1/4',
  Intermediate: 'w-2/4',
  Expert: 'w-3/4',
  Professional: 'w-full',
};

export default function Profile() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add skill form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newProficiency, setNewProficiency] = useState('Beginner');
  const [saving, setSaving] = useState(false);

  // Edit skill
  const [editingId, setEditingId] = useState(null);
  const [editSkill, setEditSkill] = useState('');
  const [editProficiency, setEditProficiency] = useState('Beginner');

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [skillsRes, enrollRes] = await Promise.all([
        api.get(`/user-skills?user_id=${user.id}`).catch(() => ({ data: [] })),
        api.get(`/enrollments?user_id=${user.id}`).catch(() => ({ data: [] })),
      ]);
      setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
      setEnrollments(Array.isArray(enrollRes.data) ? enrollRes.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setSaving(true);
    try {
      const res = await api.post('/user-skills', {
        user_id: user.id,
        skill_name: newSkill.trim(),
        proficiency: newProficiency,
      });
      // Update or add
      setSkills((prev) => {
        const idx = prev.findIndex((s) => s.id === res.data.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = res.data;
          return updated;
        }
        return [...prev, res.data];
      });
      setNewSkill('');
      setNewProficiency('Beginner');
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSkill = async (id) => {
    setSaving(true);
    try {
      const res = await api.put(`/user-skills/${id}`, {
        skill_name: editSkill,
        proficiency: editProficiency,
      });
      setSkills((prev) => prev.map((s) => (s.id === id ? res.data : s)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.delete(`/user-skills/${id}`);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (skill) => {
    setEditingId(skill.id);
    setEditSkill(skill.skill_name);
    setEditProficiency(skill.proficiency);
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="hero-cinematic min-h-screen pt-24 pb-16 page-enter">
      {/* Cinematic background haze */}
      <div className="hero-haze">
        <div className="haze-orb haze-orb--center" />
        <div className="haze-orb haze-orb--right" />
        <div className="haze-orb haze-orb--left" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-6 sm:px-8 lg:px-12">

        {/* Profile Header */}
        <div className="bg-[#0A1A22]/80 border border-[#1e3a42]/60 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20 shrink-0">
              <span className="text-3xl font-bold text-white">{user.name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-500 mt-1">{user.email}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <Award size={15} className="text-[#2dd4bf]" />
                  <span>{skills.length} Skills</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <BookOpen size={15} className="text-[#06b6d4]" />
                  <span>{enrollments.length} Courses Enrolled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-[#0A1A22]/80 border border-[#1e3a42]/60 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award size={20} className="text-[#2dd4bf]" />
                My Skills
              </h2>
              <p className="text-gray-500 text-sm mt-1">Add your skills and knowledge level</p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#14b8a6] hover:bg-[#0d9488] text-white text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-[#14b8a6]/20"
              >
                <Plus size={16} />
                Add Skill
              </button>
            )}
          </div>

          {/* Add Skill Form */}
          {showAddForm && (
            <form onSubmit={handleAddSkill} className="bg-[#071015]/60 border border-[#1e3a42] rounded-xl p-5 mb-6">
              <h3 className="text-white font-semibold text-sm mb-4">Add New Skill</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-medium">Skill Name</label>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. React, Python, Docker..."
                    className="w-full px-4 py-2.5 bg-[#0F3A42]/50 border border-[#1e3a42] rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#14b8a6]/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-medium">Knowledge Level</label>
                  <div className="relative">
                    <select
                      value={newProficiency}
                      onChange={(e) => setNewProficiency(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#0F3A42]/50 border border-[#1e3a42] rounded-xl text-white text-sm appearance-none focus:outline-none focus:border-[#14b8a6]/50 transition-colors cursor-pointer"
                    >
                      {PROFICIENCY_LEVELS.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2 bg-[#14b8a6] hover:bg-[#0d9488] text-white text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  <Save size={14} />
                  {saving ? 'Saving...' : 'Save Skill'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setNewSkill(''); setNewProficiency('Beginner'); }}
                  className="px-4 py-2 text-gray-400 hover:text-white text-sm rounded-xl hover:bg-white/5 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Skills List */}
          {loading ? (
            <div className="text-center py-8 text-gray-500 text-sm">Loading skills...</div>
          ) : skills.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#1e3a42] rounded-xl">
              <Award size={40} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">No skills added yet</p>
              <p className="text-gray-600 text-xs mt-1">Click "Add Skill" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="group bg-[#071015]/40 border border-[#1e3a42]/40 rounded-xl p-4 hover:border-[#14b8a6]/20 transition-all duration-200"
                >
                  {editingId === skill.id ? (
                    /* Edit Mode */
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <input
                        type="text"
                        value={editSkill}
                        onChange={(e) => setEditSkill(e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#0F3A42]/50 border border-[#1e3a42] rounded-lg text-white text-sm focus:outline-none focus:border-[#14b8a6]/50"
                      />
                      <div className="relative">
                        <select
                          value={editProficiency}
                          onChange={(e) => setEditProficiency(e.target.value)}
                          className="px-3 py-2 bg-[#0F3A42]/50 border border-[#1e3a42] rounded-lg text-white text-sm appearance-none pr-8 focus:outline-none focus:border-[#14b8a6]/50 cursor-pointer"
                        >
                          {PROFICIENCY_LEVELS.map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateSkill(skill.id)}
                          disabled={saving}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-2 text-gray-400 hover:text-white text-xs rounded-lg hover:bg-white/5 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white font-medium text-sm">{skill.skill_name}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${PROFICIENCY_COLORS[skill.proficiency]?.bg} ${PROFICIENCY_COLORS[skill.proficiency]?.text}`}>
                            {skill.proficiency}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#0F3A42] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${PROFICIENCY_COLORS[skill.proficiency]?.bar} ${PROFICIENCY_WIDTH[skill.proficiency]}`} />
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => startEdit(skill)}
                          className="p-2 text-gray-500 hover:text-[#2dd4bf] rounded-lg hover:bg-[#14b8a6]/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enrolled Courses Section */}
        <div className="bg-[#0A1A22]/80 border border-[#1e3a42]/60 rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <BookOpen size={20} className="text-[#06b6d4]" />
            Enrolled Courses
          </h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#1e3a42] rounded-xl">
              <BookOpen size={40} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">No courses enrolled yet</p>
              <p className="text-gray-600 text-xs mt-1">Visit the Resources page to browse courses</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-[#071015]/40 border border-[#1e3a42]/40 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/12 flex items-center justify-center shrink-0">
                    <BookOpen size={18} className="text-[#06b6d4]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{enrollment.course?.name || 'Course'}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {enrollment.course?.topic && (
                        <span className="text-xs text-gray-500">{enrollment.course.topic}</span>
                      )}
                      {enrollment.course?.level && (
                        <span className="text-xs px-2 py-0.5 bg-[#14b8a6]/10 text-[#2dd4bf] rounded-full">{enrollment.course.level}</span>
                      )}
                      {enrollment.course?.duration && (
                        <span className="text-xs text-gray-600">{enrollment.course.duration}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0A1A22]/80 border border-[#1e3a42]/60 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-white">{skills.length}</div>
            <div className="text-xs text-gray-500 mt-1">Total Skills</div>
          </div>
          <div className="bg-[#0A1A22]/80 border border-[#1e3a42]/60 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-white">{skills.filter(s => s.proficiency === 'Professional').length}</div>
            <div className="text-xs text-gray-500 mt-1">Professional</div>
          </div>
          <div className="bg-[#0A1A22]/80 border border-[#1e3a42]/60 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-white">{skills.filter(s => s.proficiency === 'Expert').length}</div>
            <div className="text-xs text-gray-500 mt-1">Expert</div>
          </div>
          <div className="bg-[#0A1A22]/80 border border-[#1e3a42]/60 rounded-xl p-5 text-center">
            <div className="text-2xl font-bold text-white">{enrollments.length}</div>
            <div className="text-xs text-gray-500 mt-1">Courses</div>
          </div>
        </div>
      </div>
    </div>
  );
}
