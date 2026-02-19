import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Briefcase, BookOpen, TrendingUp, Target, Award, ArrowRight, Users, Star, MapPin, Building2, Send, Zap, BarChart3, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, courses: 0, enrollments: 0 });
  const [allJobs, setAllJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, coursesRes, enrollRes, skillsRes] = await Promise.all([
          api.get('/jobs').catch(() => ({ data: [] })),
          api.get('/courses').catch(() => ({ data: [] })),
          user ? api.get(`/enrollments?user_id=${user.id}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          user ? api.get(`/user-skills?user_id=${user.id}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ]);
        const skills = Array.isArray(skillsRes.data) ? skillsRes.data : [];
        const jobsList = Array.isArray(jobsRes.data) ? jobsRes.data : [];
        setUserSkills(skills);
        setAllJobs(jobsList);
        setStats({
          jobs: Array.isArray(jobsRes.data) ? jobsRes.data.length : 0,
          courses: Array.isArray(coursesRes.data) ? coursesRes.data.length : 0,
          enrollments: Array.isArray(enrollRes.data) ? enrollRes.data.length : 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoaded(true);
      }
    };
    fetchStats();
  }, [user]);

  const proficiencyRank = { Beginner: 1, Intermediate: 2, Expert: 3, Professional: 4 };
  const avgProficiency = userSkills.length > 0
    ? userSkills.reduce((sum, s) => sum + (proficiencyRank[s.proficiency] || 1), 0) / userSkills.length
    : 0;
  const avgLevelLabel = avgProficiency >= 3.5 ? 'Professional'
    : avgProficiency >= 2.5 ? 'Expert'
    : avgProficiency >= 1.5 ? 'Intermediate'
    : avgProficiency > 0 ? 'Beginner' : 'N/A';

  const jobLevelRank = { 'Entry Level': 1, 'Mid Level': 2, Senior: 3 };
  const userSkillNames = userSkills.map(s => (s.skill_name || '').toLowerCase());

  const getMatchDetails = (job) => {
    if (!user || userSkills.length === 0) return { total: 0, skills: 0, experience: 0, track: 0, matchedSkills: [] };
    const jobSkills = (Array.isArray(job.skills) ? job.skills : []).map(s => s.toLowerCase());
    let matchedSkills = [];
    let skillScore = 0;
    if (jobSkills.length > 0) {
      matchedSkills = jobSkills.filter(js => userSkillNames.includes(js));
      skillScore = Math.round((matchedSkills.length / jobSkills.length) * 60);
    }
    const requiredLevel = jobLevelRank[job.level] || 1;
    let expScore = 0;
    if (avgProficiency >= requiredLevel) expScore = 20;
    else { const diff = requiredLevel - avgProficiency; if (diff <= 1) expScore = 12; else if (diff <= 2) expScore = 5; }
    let trackScore = 0;
    if (matchedSkills.length > 0) trackScore = matchedSkills.length >= jobSkills.length * 0.5 ? 20 : 10;
    return { total: skillScore + expScore + trackScore, skills: skillScore, experience: expScore, track: trackScore, matchedSkills };
  };

  const getScoreColor = (score) => score >= 80 ? '#10b981' : score >= 60 ? '#7c3aed' : '#f59e0b';
  const getMatchLabel = (score) => score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair';

  const recommendedJobs = [...allJobs]
    .map(job => ({ ...job, matchDetails: getMatchDetails(job) }))
    .sort((a, b) => b.matchDetails.total - a.matchDetails.total)
    .slice(0, 3);

  const dashCards = [
    { icon: Briefcase, label: 'Available Jobs', value: stats.jobs, gradient: 'from-[#7c3aed] to-[#6d28d9]', glow: '#7c3aed', link: '/jobs' },
    { icon: BookOpen, label: 'Courses', value: stats.courses, gradient: 'from-[#ec4899] to-[#db2777]', glow: '#ec4899', link: '/resources' },
    { icon: Award, label: 'My Enrollments', value: stats.enrollments, gradient: 'from-[#10b981] to-[#059669]', glow: '#10b981', link: '/resources' },
    { icon: TrendingUp, label: 'Skill Level', value: avgLevelLabel, gradient: 'from-[#3b82f6] to-[#2563eb]', glow: '#3b82f6', link: '/profile' },
  ];

  const quickActions = [
    { icon: Target, label: 'Find Matching Jobs', desc: 'AI-powered job matching based on your skills', link: '/jobs', color: '#7c3aed' },
    { icon: BookOpen, label: 'Browse Courses', desc: 'Explore learning resources to grow your skills', link: '/resources', color: '#ec4899' },
    { icon: Users, label: 'Contact Support', desc: 'Get help with your career development', link: '/contact', color: '#10b981' },
    { icon: Star, label: 'Update Profile', desc: 'Keep your skills and experience up to date', link: '/profile', color: '#f59e0b' },
  ];

  const greetingTime = new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen pt-24 pb-20 page-enter">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-[#7c3aed]/[0.04] rounded-full blur-[100px]" />
        <div className="absolute top-60 -right-40 w-96 h-96 bg-[#ec4899]/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-40 left-1/3 w-96 h-96 bg-[#3b82f6]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1140px] mx-auto px-5 sm:px-8 lg:px-10">

        {/* ───── Hero Welcome Section ───── */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-[#2a2a5a]/40 bg-gradient-to-br from-[#111128]/90 to-[#0d0d24]/90 backdrop-blur-xl p-6 sm:p-8">
          {/* Decorative inner glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#7c3aed]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#ec4899]/8 to-transparent rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#ec4899] flex items-center justify-center shadow-lg shadow-[#7c3aed]/25 shrink-0 ring-2 ring-[#7c3aed]/20 ring-offset-2 ring-offset-[#0d0d24]">
                <span className="text-xl sm:text-2xl font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={13} className="text-gray-500" />
                  <span className="text-xs text-gray-500 font-medium">{greetingTime}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  Welcome back, <span className="gradient-text">{user?.name}</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">Here's what's happening with your career journey today.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="flex flex-col items-center px-4 py-2.5 rounded-xl bg-white/[0.03] border border-[#2a2a5a]/50">
                <span className="text-xs text-gray-500 mb-0.5">Level</span>
                <span className="text-sm font-bold text-[#7c3aed]">{avgLevelLabel}</span>
              </div>
              <div className="flex flex-col items-center px-4 py-2.5 rounded-xl bg-white/[0.03] border border-[#2a2a5a]/50">
                <span className="text-xs text-gray-500 mb-0.5">Skills</span>
                <span className="text-sm font-bold text-[#ec4899]">{userSkills.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ───── Stats Grid ───── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {dashCards.map((card, i) => (
            <Link key={card.label} to={card.link} className="group" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="relative h-full bg-[#111128]/60 backdrop-blur-sm border border-[#2a2a5a]/40 rounded-2xl p-5 sm:p-6 hover:border-[#2a2a5a]/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
                {/* Subtle top accent line */}
                <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-b-full bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    style={{ boxShadow: `0 4px 16px ${card.glow}25` }}
                  >
                    <card.icon size={18} className="text-white" />
                  </div>
                  <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-all duration-200 group-hover:translate-x-0.5" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mb-0.5 tracking-tight">
                  {loaded ? card.value : <span className="inline-block w-8 h-7 rounded bg-[#1a1a3e] animate-pulse" />}
                </div>
                <div className="text-xs text-gray-500 font-medium">{card.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* ───── Two-column: Profile + Skills ───── */}
        <div className="grid lg:grid-cols-5 gap-4 mb-10">
          {/* Profile Card — 3 cols */}
          <div className="lg:col-span-3 bg-[#111128]/60 backdrop-blur-sm border border-[#2a2a5a]/40 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={16} className="text-[#7c3aed]" />
              <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Profile Overview</h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#ec4899] flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white">{user?.name}</h3>
                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
              </div>
              <Link to="/profile" className="px-4 py-2 rounded-xl bg-white/[0.04] border border-[#2a2a5a]/50 text-xs font-medium text-gray-400 hover:text-white hover:border-[#7c3aed]/40 transition-all duration-200">
                Edit Profile →
              </Link>
            </div>
            {/* Skills pills */}
            <div className="mb-1">
              <p className="text-[11px] text-gray-600 uppercase tracking-wider font-semibold mb-2.5">Skills & Expertise</p>
              <div className="flex flex-wrap gap-2">
                {userSkills.length > 0 ? userSkills.slice(0, 8).map((s) => {
                  const profColor = s.proficiency === 'Professional' ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/8'
                    : s.proficiency === 'Expert' ? 'border-[#7c3aed]/40 text-[#a78bfa] bg-[#7c3aed]/8'
                    : s.proficiency === 'Intermediate' ? 'border-blue-500/40 text-blue-300 bg-blue-500/8'
                    : 'border-gray-500/30 text-gray-400 bg-gray-500/8';
                  return (
                    <span key={s.id} className={`px-2.5 py-1 text-xs rounded-lg border ${profColor} font-medium`}>
                      {s.skill_name}
                      <span className="ml-1.5 text-[10px] opacity-60">· {s.proficiency?.[0]}</span>
                    </span>
                  );
                }) : (
                  <span className="text-xs text-gray-600 italic">No skills added yet — <Link to="/profile" className="text-[#7c3aed] hover:underline">add some</Link></span>
                )}
                {userSkills.length > 8 && (
                  <span className="px-2.5 py-1 text-[#8b5cf6] text-xs font-medium">+{userSkills.length - 8} more</span>
                )}
              </div>
            </div>
          </div>

          {/* Level Ring — 2 cols */}
          <div className="lg:col-span-2 bg-[#111128]/60 backdrop-blur-sm border border-[#2a2a5a]/40 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1a1a3e" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#levelGradient)" strokeWidth="8"
                  strokeDasharray={`${(avgProficiency / 4) * (2 * Math.PI * 50)} ${2 * Math.PI * 50}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="levelGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-white">{Math.round((avgProficiency / 4) * 100)}%</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">proficiency</span>
              </div>
            </div>
            <span className="text-sm font-bold text-white mb-1">{avgLevelLabel}</span>
            <span className="text-xs text-gray-500">{userSkills.length} skills tracked</span>
            <Link to="/profile" className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-xs font-semibold text-white hover:shadow-lg hover:shadow-[#7c3aed]/20 transition-all duration-200 hover:scale-[1.03]">
              Manage Skills
            </Link>
          </div>
        </div>

        {/* ───── Recommended Jobs ───── */}
        {user && recommendedJobs.length > 0 && (
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#7c3aed]/15 flex items-center justify-center">
                  <Zap size={14} className="text-[#7c3aed]" />
                </div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Top Matches For You</h2>
              </div>
              <Link to="/jobs" className="text-xs text-[#8b5cf6] hover:text-[#a78bfa] transition-colors font-medium">
                View all →
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {recommendedJobs.map((job, idx) => {
                const d = job.matchDetails;
                const scoreColor = getScoreColor(d.total);
                const label = getMatchLabel(d.total);
                const jobSkills = Array.isArray(job.skills) ? job.skills : [];
                const circumference = 2 * Math.PI * 30;
                const dashArray = (d.total / 100) * circumference;
                return (
                  <div key={job.id} className="group relative bg-[#111128]/60 backdrop-blur-sm border border-[#2a2a5a]/40 rounded-2xl p-5 hover:border-[#2a2a5a]/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col overflow-hidden">
                    {/* Rank badge */}
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/[0.04] border border-[#2a2a5a]/50 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-gray-500">#{idx + 1}</span>
                    </div>

                    {/* Match circle + title */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="relative w-14 h-14 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
                          <circle cx="35" cy="35" r="30" fill="none" stroke="#1a1a3e" strokeWidth="5" />
                          <circle cx="35" cy="35" r="30" fill="none" stroke={scoreColor} strokeWidth="5" strokeDasharray={`${dashArray} ${circumference}`} strokeLinecap="round" className="transition-all duration-700" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-extrabold text-white">{d.total}%</span>
                        </div>
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <h3 className="text-sm font-bold text-white leading-snug">{job.title}</h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
                          <Building2 size={10} /> <span className="truncate">{job.company}</span>
                          <span className="text-gray-700">·</span>
                          <MapPin size={10} /> <span className="truncate">{job.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Match label badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider" style={{ color: scoreColor, backgroundColor: `${scoreColor}15` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: scoreColor }} />
                        {label} Match
                      </span>
                    </div>

                    {/* Skills preview */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {jobSkills.slice(0, 4).map((skill, i) => {
                        const matched = d.matchedSkills.includes(skill.toLowerCase());
                        return (
                          <span key={i} className={`px-2 py-0.5 text-[10px] font-medium rounded-md border ${
                            matched ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-white/[0.02] text-gray-500 border-[#2a2a5a]/40'
                          }`}>
                            {matched && '✓ '}{skill}
                          </span>
                        );
                      })}
                      {jobSkills.length > 4 && <span className="text-[10px] text-gray-600 self-center">+{jobSkills.length - 4}</span>}
                    </div>

                    {/* Breakdown bars */}
                    <div className="space-y-2 mb-5">
                      {[
                        { label: 'Skills', val: d.skills, max: 60 },
                        { label: 'Exp', val: d.experience, max: 20 },
                        { label: 'Track', val: d.track, max: 20 },
                      ].map(b => (
                        <div key={b.label} className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 w-8 font-medium">{b.label}</span>
                          <div className="flex-1 h-1.5 bg-[#1a1a3e] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(b.val / b.max) * 100}%`, background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}aa)` }} />
                          </div>
                          <span className="text-[10px] text-gray-500 w-8 text-right font-mono">{b.val}/{b.max}</span>
                        </div>
                      ))}
                    </div>

                    {/* Apply button */}
                    <Link to="/jobs" className="mt-auto">
                      <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] rounded-xl text-white text-xs font-semibold hover:shadow-lg hover:shadow-[#7c3aed]/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                        <Send size={12} /> Apply Now
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ───── Quick Actions ───── */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#ec4899]/15 flex items-center justify-center">
            <Zap size={14} className="text-[#ec4899]" />
          </div>
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Quick Actions</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.link}>
              <div className="group bg-[#111128]/60 backdrop-blur-sm border border-[#2a2a5a]/40 rounded-2xl p-5 hover:border-[#2a2a5a]/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <action.icon size={18} style={{ color: action.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm">{action.label}</h3>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{action.desc}</p>
                </div>
                <ArrowRight size={15} className="text-gray-600 group-hover:text-gray-400 transition-all duration-200 group-hover:translate-x-1 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
