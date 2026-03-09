import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Briefcase, BookOpen, TrendingUp, Target, Award, ArrowRight, Users, Star, MapPin, Building2, Send, Zap, BarChart3, Clock, AlertTriangle, Lightbulb, CheckCircle, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, courses: 0, enrollments: 0, applications: 0 });
  const [allJobs, setAllJobs] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, coursesRes, enrollRes, skillsRes, appsRes] = await Promise.all([
          api.get('/jobs').catch(() => ({ data: [] })),
          api.get('/courses').catch(() => ({ data: [] })),
          user ? api.get(`/enrollments?user_id=${user.id}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          user ? api.get(`/user-skills?user_id=${user.id}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          user ? api.get(`/job-applications?user_id=${user.id}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ]);
        const skills = Array.isArray(skillsRes.data) ? skillsRes.data : [];
        const jobsList = Array.isArray(jobsRes.data) ? jobsRes.data : [];
        const coursesList = Array.isArray(coursesRes.data) ? coursesRes.data : [];
        const appsList = Array.isArray(appsRes.data) ? appsRes.data : [];
        setUserSkills(skills);
        setAllJobs(jobsList);
        setAllCourses(coursesList);
        setAppliedJobs(appsList);
        setStats({
          jobs: Array.isArray(jobsRes.data) ? jobsRes.data.length : 0,
          courses: Array.isArray(coursesRes.data) ? coursesRes.data.length : 0,
          enrollments: Array.isArray(enrollRes.data) ? enrollRes.data.length : 0,
          applications: appsList.length,
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

  const getScoreColor = (score) => score >= 80 ? '#10b981' : score >= 60 ? '#14b8a6' : '#f59e0b';
  const getMatchLabel = (score) => score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair';

  const recommendedJobs = [...allJobs]
    .map(job => ({ ...job, matchDetails: getMatchDetails(job) }))
    .sort((a, b) => b.matchDetails.total - a.matchDetails.total)
    .slice(0, 3);

  const dashCards = [
    { icon: Briefcase, label: 'Available Jobs', value: stats.jobs, gradient: 'from-[#14b8a6] to-[#0d9488]', glow: '#14b8a6', link: '/jobs' },
    { icon: BookOpen, label: 'Courses', value: stats.courses, gradient: 'from-[#06b6d4] to-[#0891b2]', glow: '#06b6d4', link: '/resources' },
    { icon: Award, label: 'My Enrollments', value: stats.enrollments, gradient: 'from-[#10b981] to-[#059669]', glow: '#10b981', link: '/resources' },
    { icon: FileText, label: 'Applications', value: stats.applications, gradient: 'from-[#f59e0b] to-[#d97706]', glow: '#f59e0b', link: '/jobs' },
    { icon: TrendingUp, label: 'Skill Level', value: avgLevelLabel, gradient: 'from-[#3b82f6] to-[#2563eb]', glow: '#3b82f6', link: '/profile' },
  ];

  const quickActions = [
    { icon: Target, label: 'Find Matching Jobs', desc: 'AI-powered job matching based on your skills', link: '/jobs', color: '#14b8a6' },
    { icon: BookOpen, label: 'Browse Courses', desc: 'Explore learning resources to grow your skills', link: '/resources', color: '#06b6d4' },
    { icon: Users, label: 'Contact Support', desc: 'Get help with your career development', link: '/contact', color: '#10b981' },
    { icon: Star, label: 'Update Profile', desc: 'Keep your skills and experience up to date', link: '/profile', color: '#f59e0b' },
  ];

  const greetingTime = new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen pt-24 pb-20 page-enter">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-[#14b8a6]/[0.04] rounded-full blur-[100px]" />
        <div className="absolute top-60 -right-40 w-96 h-96 bg-[#06b6d4]/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-40 left-1/3 w-96 h-96 bg-[#3b82f6]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">

        {/* â”€â”€â”€â”€â”€ Hero Welcome Section â”€â”€â”€â”€â”€ */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-[#1e3a42]/40 bg-gradient-to-br from-[#0f1d22]/90 to-[#0c1a1e]/90 backdrop-blur-xl p-7 sm:p-9">
          {/* Decorative inner glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#14b8a6]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#06b6d4]/8 to-transparent rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/25 shrink-0 ring-2 ring-[#14b8a6]/20 ring-offset-2 ring-offset-[#0c1a1e]">
                <span className="text-2xl sm:text-3xl font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-500 font-medium">{greetingTime}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  Welcome back, <span className="gradient-text">{user?.name}</span>
                </h1>
                <p className="text-gray-500 text-base mt-1">Here's what's happening with your career journey today.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="flex flex-col items-center px-5 py-3 rounded-xl bg-white/[0.03] border border-[#1e3a42]/50">
                <span className="text-sm text-gray-500 mb-0.5">Level</span>
                <span className="text-base font-bold text-[#14b8a6]">{avgLevelLabel}</span>
              </div>
              <div className="flex flex-col items-center px-5 py-3 rounded-xl bg-white/[0.03] border border-[#1e3a42]/50">
                <span className="text-sm text-gray-500 mb-0.5">Skills</span>
                <span className="text-base font-bold text-[#06b6d4]">{userSkills.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* â”€â”€â”€â”€â”€ Stats Grid â”€â”€â”€â”€â”€ */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-10">
          {dashCards.map((card, i) => (
            <Link key={card.label} to={card.link} className="group" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="relative h-full bg-[#0f1d22]/60 backdrop-blur-sm border border-[#1e3a42]/40 rounded-2xl p-6 sm:p-7 hover:border-[#1e3a42]/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
                {/* Subtle top accent line */}
                <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-b-full bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    style={{ boxShadow: `0 4px 16px ${card.glow}25` }}
                  >
                    <card.icon size={22} className="text-white" />
                  </div>
                  <ArrowRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-all duration-200 group-hover:translate-x-0.5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1 tracking-tight">
                  {loaded ? card.value : <span className="inline-block w-10 h-8 rounded bg-[#162a32] animate-pulse" />}
                </div>
                <div className="text-sm text-gray-500 font-medium">{card.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* â”€â”€â”€â”€â”€ Two-column: Profile + Skills â”€â”€â”€â”€â”€ */}
        <div className="grid lg:grid-cols-5 gap-5 mb-10">
          {/* Profile Card â€” 3 cols */}
          <div className="lg:col-span-3 bg-[#0f1d22]/60 backdrop-blur-sm border border-[#1e3a42]/40 rounded-2xl p-6 sm:p-7">
            <div className="flex items-center gap-2.5 mb-5">
              <BarChart3 size={18} className="text-[#14b8a6]" />
              <h2 className="text-base font-semibold text-white tracking-wide uppercase">Profile Overview</h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                <p className="text-gray-500 text-sm truncate">{user?.email}</p>
              </div>
              <Link to="/profile" className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-[#1e3a42]/50 text-sm font-medium text-gray-400 hover:text-white hover:border-[#14b8a6]/40 transition-all duration-200">
                Edit Profile â†’
              </Link>
            </div>
            {/* Skills pills */}
            <div className="mb-1">
              <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-3">Skills & Expertise</p>
              <div className="flex flex-wrap gap-2">
                {userSkills.length > 0 ? userSkills.slice(0, 8).map((s) => {
                  const profColor = s.proficiency === 'Professional' ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/8'
                    : s.proficiency === 'Expert' ? 'border-[#14b8a6]/40 text-[#5eead4] bg-[#14b8a6]/8'
                    : s.proficiency === 'Intermediate' ? 'border-blue-500/40 text-blue-300 bg-blue-500/8'
                    : 'border-gray-500/30 text-gray-400 bg-gray-500/8';
                  return (
                    <span key={s.id} className={`px-3 py-1.5 text-sm rounded-lg border ${profColor} font-medium`}>
                      {s.skill_name}
                      <span className="ml-1.5 text-xs opacity-60">Â· {s.proficiency?.[0]}</span>
                    </span>
                  );
                }) : (
                  <span className="text-xs text-gray-600 italic">No skills added yet â€” <Link to="/profile" className="text-[#14b8a6] hover:underline">add some</Link></span>
                )}
                {userSkills.length > 8 && (
                  <span className="px-3 py-1.5 text-[#2dd4bf] text-sm font-medium">+{userSkills.length - 8} more</span>
                )}
              </div>
            </div>
          </div>

          {/* Level Ring â€” 2 cols */}
          <div className="lg:col-span-2 bg-[#0f1d22]/60 backdrop-blur-sm border border-[#1e3a42]/40 rounded-2xl p-6 sm:p-7 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 mb-5">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#162a32" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#levelGradient)" strokeWidth="8"
                  strokeDasharray={`${(avgProficiency / 4) * (2 * Math.PI * 50)} ${2 * Math.PI * 50}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="levelGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white">{Math.round((avgProficiency / 4) * 100)}%</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">proficiency</span>
              </div>
            </div>
            <span className="text-base font-bold text-white mb-1">{avgLevelLabel}</span>
            <span className="text-sm text-gray-500">{userSkills.length} skills tracked</span>
            <Link to="/profile" className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-sm font-semibold text-white hover:shadow-lg hover:shadow-[#14b8a6]/20 transition-all duration-200 hover:scale-[1.03]">
              Manage Skills
            </Link>
          </div>
        </div>

        {/* â”€â”€â”€â”€â”€ Recommended Jobs â”€â”€â”€â”€â”€ */}
        {user && recommendedJobs.length > 0 && (
          <div className="mb-10">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#14b8a6]/15 flex items-center justify-center">
                  <Zap size={16} className="text-[#14b8a6]" />
                </div>
                <h2 className="text-base font-semibold text-white uppercase tracking-wide">Top Matches For You</h2>
              </div>
              <Link to="/jobs" className="text-sm text-[#2dd4bf] hover:text-[#5eead4] transition-colors font-medium">
                View all â†’
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {recommendedJobs.map((job, idx) => {
                const d = job.matchDetails;
                const scoreColor = getScoreColor(d.total);
                const label = getMatchLabel(d.total);
                const jobSkills = Array.isArray(job.skills) ? job.skills : [];
                const circumference = 2 * Math.PI * 30;
                const dashArray = (d.total / 100) * circumference;
                return (
                  <div key={job.id} className="group relative bg-[#0f1d22]/60 backdrop-blur-sm border border-[#1e3a42]/40 rounded-2xl p-6 hover:border-[#1e3a42]/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col overflow-hidden">
                    {/* Rank badge */}
                    <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/[0.04] border border-[#1e3a42]/50 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-500">#{idx + 1}</span>
                    </div>

                    {/* Match circle + title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative w-16 h-16 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
                          <circle cx="35" cy="35" r="30" fill="none" stroke="#162a32" strokeWidth="5" />
                          <circle cx="35" cy="35" r="30" fill="none" stroke={scoreColor} strokeWidth="5" strokeDasharray={`${dashArray} ${circumference}`} strokeLinecap="round" className="transition-all duration-700" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-extrabold text-white">{d.total}%</span>
                        </div>
                      </div>
                      <div className="min-w-0 pt-1">
                        <h3 className="text-base font-bold text-white leading-snug">{job.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Building2 size={12} /> <span className="truncate">{job.company}</span>
                          <span className="text-gray-700">Â·</span>
                          <MapPin size={12} /> <span className="truncate">{job.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Match label badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider" style={{ color: scoreColor, backgroundColor: `${scoreColor}15` }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: scoreColor }} />
                        {label} Match
                      </span>
                    </div>

                    {/* Skills preview */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {jobSkills.slice(0, 4).map((skill, i) => {
                        const matched = d.matchedSkills.includes(skill.toLowerCase());
                        return (
                          <span key={i} className={`px-2.5 py-1 text-xs font-medium rounded-md border ${
                            matched ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-white/[0.02] text-gray-500 border-[#1e3a42]/40'
                          }`}>
                            {matched && 'âœ“ '}{skill}
                          </span>
                        );
                      })}
                      {jobSkills.length > 4 && <span className="text-xs text-gray-600 self-center">+{jobSkills.length - 4}</span>}
                    </div>

                    {/* Breakdown bars */}
                    <div className="space-y-2.5 mb-5">
                      {[
                        { label: 'Skills', val: d.skills, max: 60 },
                        { label: 'Exp', val: d.experience, max: 20 },
                        { label: 'Track', val: d.track, max: 20 },
                      ].map(b => (
                        <div key={b.label} className="flex items-center gap-2.5">
                          <span className="text-xs text-gray-500 w-10 font-medium">{b.label}</span>
                          <div className="flex-1 h-2 bg-[#162a32] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(b.val / b.max) * 100}%`, background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}aa)` }} />
                          </div>
                          <span className="text-xs text-gray-500 w-10 text-right font-mono">{b.val}/{b.max}</span>
                        </div>
                      ))}
                    </div>

                    {/* Apply button */}
                    <Link to="/jobs" className="mt-auto">
                      <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] rounded-xl text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#14b8a6]/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                        <Send size={14} /> Apply Now
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* â”€â”€â”€â”€â”€ Skill Gap Analysis & Course Recommendations â”€â”€â”€â”€â”€ */}

        {/* â”€â”€â”€â”€â”€ My Job Applications â”€â”€â”€â”€â”€ */}
        {user && appliedJobs.length > 0 && (
          <div className="mb-10">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/15 flex items-center justify-center">
                  <FileText size={16} className="text-[#f59e0b]" />
                </div>
                <h2 className="text-base font-semibold text-white uppercase tracking-wide">My Job Applications</h2>
              </div>
              <Link to="/jobs" className="text-sm text-[#2dd4bf] hover:text-[#5eead4] transition-colors font-medium">
                Browse jobs &rarr;
              </Link>
            </div>
            <div className="space-y-3">
              {appliedJobs.map((app) => {
                const job = app.job;
                if (!job) return null;
                const statusColors = {
                  Pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                  Reviewed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
                  Shortlisted: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
                  Accepted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                  Rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
                };
                const statusStyle = statusColors[app.status] || statusColors.Pending;
                return (
                  <div key={app.id} className="bg-[#0f1d22]/60 backdrop-blur-sm border border-[#1e3a42]/40 rounded-2xl p-5 hover:border-[#1e3a42]/80 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shrink-0">
                          <Briefcase size={20} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-white">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><Building2 size={12} /> {job.company}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> Applied {new Date(app.applied_at || app.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusStyle}`}>
                          <CheckCircle size={12} /> {app.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {user && userSkills.length > 0 && allJobs.length > 0 && (() => {
          // Collect all required skills from jobs, count frequency
          const skillFrequency = {};
          allJobs.forEach(job => {
            const jSkills = Array.isArray(job.skills) ? job.skills : [];
            jSkills.forEach(sk => {
              const lower = sk.toLowerCase();
              if (!userSkillNames.includes(lower)) {
                skillFrequency[sk] = (skillFrequency[sk] || 0) + 1;
              }
            });
          });

          // Sort missing skills by how many jobs require them
          const missingSkills = Object.entries(skillFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);

          if (missingSkills.length === 0) return null;

          // Map each missing skill to the best matching course
          const courseKeywords = {
            'react': ['web development', 'react', 'frontend'],
            'node.js': ['web development', 'node', 'backend', 'api'],
            'javascript': ['web development', 'javascript', 'frontend'],
            'typescript': ['web development', 'typescript', 'react native'],
            'python': ['python', 'data science', 'machine learning'],
            'sql': ['data science', 'python', 'backend'],
            'html': ['web development'],
            'css': ['web development', 'design'],
            'tailwind css': ['web development'],
            'laravel': ['laravel', 'api', 'backend'],
            'rest api': ['laravel', 'api', 'web development', 'react native'],
            'git': ['web development'],
            'docker': ['cloud', 'devops', 'aws'],
            'kubernetes': ['cloud', 'devops', 'aws'],
            'aws': ['cloud', 'aws'],
            'jenkins': ['cloud', 'devops'],
            'linux': ['cloud', 'cybersecurity'],
            'react native': ['react native', 'mobile'],
            'figma': ['design', 'ui/ux'],
            'adobe xd': ['design', 'ui/ux'],
            'user research': ['design', 'ui/ux'],
            'prototyping': ['design', 'ui/ux'],
            'design systems': ['design', 'ui/ux'],
            'tensorflow': ['machine learning', 'ai', 'python'],
            'pytorch': ['machine learning', 'ai', 'python'],
            'mlops': ['machine learning', 'cloud'],
            'machine learning': ['machine learning', 'ai'],
            'excel': ['data science'],
            'power bi': ['data science'],
            'statistics': ['data science', 'python'],
            'network security': ['cybersecurity', 'security'],
            'siem': ['cybersecurity'],
            'penetration testing': ['cybersecurity', 'security'],
            'postgresql': ['backend', 'web development', 'laravel'],
            'mongodb': ['web development', 'backend'],
            'technical writing': ['marketing', 'digital marketing'],
            'seo': ['marketing', 'digital marketing'],
            'content strategy': ['marketing', 'digital marketing'],
            'wordpress': ['web development', 'marketing'],
          };

          const findCourse = (skillName) => {
            const lower = skillName.toLowerCase();
            const keywords = courseKeywords[lower] || [lower];
            let bestCourse = null;
            let bestScore = 0;
            allCourses.forEach(course => {
              const haystack = `${course.name} ${course.topic} ${course.description}`.toLowerCase();
              let score = 0;
              keywords.forEach(kw => { if (haystack.includes(kw)) score++; });
              if (score > bestScore) { bestScore = score; bestCourse = course; }
            });
            return bestCourse;
          };

          // Build recommendations: unique courses with the skills they cover
          const courseMap = new Map();
          missingSkills.forEach(([skill]) => {
            const course = findCourse(skill);
            if (course) {
              if (!courseMap.has(course.id)) {
                courseMap.set(course.id, { course, skills: [], demand: 0 });
              }
              const entry = courseMap.get(course.id);
              entry.skills.push(skill);
              entry.demand += skillFrequency[skill];
            }
          });

          const recommendations = [...courseMap.values()]
            .sort((a, b) => b.demand - a.demand)
            .slice(0, 4);

          return (
            <div className="mb-10">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                    <Lightbulb size={16} className="text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white uppercase tracking-wide">Skill Gap Analysis</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Skills you're missing & courses to fill the gap</p>
                  </div>
                </div>
                <Link to="/resources" className="text-sm text-[#2dd4bf] hover:text-[#5eead4] transition-colors font-medium">
                  All Courses â†’
                </Link>
              </div>

              {/* Missing Skills Overview */}
              <div className="bg-[#0f1d22]/60 backdrop-blur-sm border border-[#1e3a42]/40 rounded-2xl p-6 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={15} className="text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">In-Demand Skills You're Missing</h3>
                  <span className="text-xs text-gray-500 ml-auto">{missingSkills.length} skills found across {allJobs.length} jobs</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map(([skill, count]) => (
                    <div key={skill} className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-200">
                      <span className="text-sm text-amber-300 font-medium">{skill}</span>
                      <span className="text-[10px] text-amber-500/70 bg-amber-500/10 px-1.5 py-0.5 rounded-md font-mono">
                        {count} {count === 1 ? 'job' : 'jobs'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Courses */}
              {recommendations.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {recommendations.map(({ course, skills, demand }) => (
                    <div key={course.id} className="group bg-[#0f1d22]/60 backdrop-blur-sm border border-[#1e3a42]/40 rounded-2xl p-5 hover:border-[#14b8a6]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl flex flex-col">
                      {/* Course header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shrink-0">
                          <BookOpen size={18} className="text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white leading-snug group-hover:text-[#2dd4bf] transition-colors">{course.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{course.topic}</span>
                            {course.duration && (
                              <>
                                <span className="text-gray-700">Â·</span>
                                <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} />{course.duration}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Skills this course addresses */}
                      <div className="mb-3">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-1.5">Fills skill gaps in:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map(sk => (
                            <span key={sk} className="px-2 py-1 text-xs font-medium rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              + {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Impact indicator */}
                      <div className="flex items-center gap-2 mb-4 mt-auto">
                        <div className="flex-1 h-1.5 bg-[#162a32] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] transition-all duration-700"
                            style={{ width: `${Math.min((demand / allJobs.length) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          Unlocks {demand} job{demand !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* CTA */}
                      <Link to="/resources" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-[#1e3a42]/60 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:border-[#14b8a6]/40 hover:bg-[#14b8a6]/5 transition-all duration-200">
                        <BookOpen size={14} /> Enroll in Course
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* â”€â”€â”€â”€â”€ Quick Actions â”€â”€â”€â”€â”€ */}
        <div className="mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/15 flex items-center justify-center">
            <Zap size={16} className="text-[#06b6d4]" />
          </div>
          <h2 className="text-base font-semibold text-white uppercase tracking-wide">Quick Actions</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.link}>
              <div className="group bg-[#0f1d22]/60 backdrop-blur-sm border border-[#1e3a42]/40 rounded-2xl p-6 hover:border-[#1e3a42]/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <action.icon size={22} style={{ color: action.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base">{action.label}</h3>
                  <p className="text-gray-500 text-sm mt-0.5 truncate">{action.desc}</p>
                </div>
                <ArrowRight size={18} className="text-gray-600 group-hover:text-gray-400 transition-all duration-200 group-hover:translate-x-1 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
