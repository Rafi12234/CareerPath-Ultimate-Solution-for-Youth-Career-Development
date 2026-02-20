import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Building2, Briefcase, TrendingUp, Send, X, DollarSign, Star, CheckCircle, Clock, Award, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const skillColors = [
  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'bg-blue-500/15 text-blue-400 border-blue-500/25',
  'bg-purple-500/15 text-purple-300 border-purple-500/25',
  'bg-pink-500/15 text-pink-400 border-pink-500/25',
  'bg-amber-500/15 text-amber-400 border-amber-500/25',
];

export default function Jobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
    if (user) fetchUserSkills();
  }, [user]);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSkills = async () => {
    try {
      const res = await api.get(`/user-skills?user_id=${user.id}`);
      setUserSkills(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to fetch user skills:', e);
      setUserSkills([]);
    }
  };

  // ---- Proficiency / Level numeric maps ----
  const proficiencyRank = { Beginner: 1, Intermediate: 2, Expert: 3, Professional: 4 };
  const jobLevelRank = { 'Entry Level': 1, 'Mid Level': 2, Senior: 3 };

  // Compute the user's average proficiency as a numeric rank
  const avgProficiency = userSkills.length > 0
    ? userSkills.reduce((sum, s) => sum + (proficiencyRank[s.proficiency] || 1), 0) / userSkills.length
    : 0;

  // Determine the user's dominant "track" by checking which job-track their skills
  // overlap with most (computed lazily inside getMatchDetails)
  const userSkillNames = userSkills.map(s => (s.skill_name || '').toLowerCase());

  // ---- Real match calculation ----
  const getMatchDetails = (job) => {
    // If not logged in or no skills, return zeros
    if (!user || userSkills.length === 0) {
      return { total: 0, skills: 0, experience: 0, track: 0, matchedSkills: [] };
    }

    const jobSkills = (Array.isArray(job.skills) ? job.skills : []).map(s => s.toLowerCase());

    // --- Skills component (max 60) ---
    let skillScore = 0;
    let matchedSkills = [];
    if (jobSkills.length > 0) {
      matchedSkills = jobSkills.filter(js => userSkillNames.includes(js));
      skillScore = Math.round((matchedSkills.length / jobSkills.length) * 60);
    }

    // --- Experience component (max 20) ---
    const requiredLevel = jobLevelRank[job.level] || 1;
    let expScore = 0;
    if (avgProficiency >= requiredLevel) {
      expScore = 20; // meets or exceeds
    } else {
      const diff = requiredLevel - avgProficiency;
      if (diff <= 1) expScore = 12;
      else if (diff <= 2) expScore = 5;
    }

    // --- Track component (max 20) ---
    // If user has at least one skill matching the job → same career track area
    let trackScore = 0;
    if (matchedSkills.length > 0) {
      trackScore = matchedSkills.length >= jobSkills.length * 0.5 ? 20 : 10;
    }

    const total = skillScore + expScore + trackScore;
    return { total, skills: skillScore, experience: expScore, track: trackScore, matchedSkills };
  };

  const getMatchScore = (job) => getMatchDetails(job).total;

  const getMatchLabel = (score) => {
    if (score >= 80) return { text: 'Excellent Match', color: 'text-emerald-400' };
    if (score >= 60) return { text: 'Good Match', color: 'text-[#8b5cf6]' };
    return { text: 'Fair Match', color: 'text-amber-400' };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#7c3aed';
    return '#f59e0b';
  };

  // Derive user's average level label
  const avgLevelLabel = avgProficiency >= 3.5 ? 'Professional'
    : avgProficiency >= 2.5 ? 'Expert'
    : avgProficiency >= 1.5 ? 'Intermediate'
    : avgProficiency > 0 ? 'Beginner' : 'N/A';

  const filteredJobs = jobs.filter((j) => {
    const matchSearch = (j.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (j.company || '').toLowerCase().includes(search.toLowerCase());
    if (filter === 'all') return matchSearch;
    const score = getMatchScore(j);
    if (filter === 'excellent') return matchSearch && score >= 80;
    if (filter === 'good') return matchSearch && score >= 60 && score < 80;
    if (filter === 'fair') return matchSearch && score < 60;
    return matchSearch;
  });

  const excellentCount = jobs.filter(j => getMatchScore(j) >= 80).length;
  const goodCount = jobs.filter(j => getMatchScore(j) >= 60 && getMatchScore(j) < 80).length;
  const fairCount = jobs.filter(j => getMatchScore(j) < 60).length;

  return (
    <div className="min-h-screen pt-24 pb-16 page-enter">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            {user ? 'Your Job Matches' : 'Explore Jobs'}
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {user ? 'AI-powered job matching based on your skills and career track' : 'Browse available opportunities and find your perfect role'}
          </p>
        </div>

        {/* Profile Summary (logged in) */}
        {user && (
          <div className="bg-[#111128]/80 border border-[#2a2a5a]/60 rounded-2xl p-5 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-white mb-2">Your Profile</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-500/15 text-emerald-400 text-xs font-medium rounded-full">{avgLevelLabel}</span>
                  <span className="px-3 py-1 bg-pink-500/15 text-pink-400 text-xs font-medium rounded-full">{userSkills.length} skills</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">Skills ({userSkills.length})</div>
                <div className="flex flex-wrap gap-1.5">
                  {userSkills.length > 0 ? userSkills.map((s, i) => (
                    <span key={s.id} className={`px-2.5 py-1 border rounded-full text-xs ${skillColors[i % skillColors.length]}`}>
                      {s.skill_name}
                    </span>
                  )) : (
                    <span className="text-xs text-gray-600">No skills added yet — visit your Profile page</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, company, or skills..."
              className="w-full pl-11 pr-4 py-3 bg-[#111128] border border-[#2a2a5a] rounded-xl text-white placeholder-gray-600 focus:border-[#7c3aed]/50 focus:ring-1 focus:ring-[#7c3aed]/20 transition-all duration-200"
            />
          </div>
          {user && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-5 py-3 bg-[#111128] border border-[#2a2a5a] rounded-xl text-gray-300 focus:border-[#7c3aed]/50 transition-all duration-200 appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all">All Matches</option>
              <option value="excellent">Excellent (80%+)</option>
              <option value="good">Good (60-79%)</option>
              <option value="fair">Fair (&lt;60%)</option>
            </select>
          )}
        </div>

        {/* Stats Bar (logged in only) */}
        {user && <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Jobs', value: jobs.length, color: 'text-[#8b5cf6]', bg: 'bg-[#7c3aed]/10' },
            { label: 'Excellent', value: excellentCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Good', value: goodCount, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Fair', value: fairCount, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} border border-[#2a2a5a]/40 rounded-xl p-4 text-center`}>
              <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>}

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-24">
            <div className="w-10 h-10 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-[#111128] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} className="text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium">No jobs found</p>
            <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job, idx) => {
              const details = getMatchDetails(job);
              const score = details.total;
              const match = getMatchLabel(score);
              const scoreColor = getScoreColor(score);
              const circumference = 2 * Math.PI * 42;
              const dashArray = (score / 100) * circumference;

              const skillsBreakdown = details.skills;
              const expBreakdown = details.experience;
              const trackBreakdown = details.track;
              const jobSkills = Array.isArray(job.skills) ? job.skills : [];

              return (
                <div
                  key={job.id}
                  className="group bg-[#111128]/80 border border-[#2a2a5a]/60 rounded-2xl p-5 sm:p-6 hover:border-[#7c3aed]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[#7c3aed]/5"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
                    {/* Match Circle (logged in only) */}
                    {user && (
                      <div className="flex lg:flex-col items-center gap-4 lg:gap-2 lg:justify-center lg:min-w-[100px]">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#1a1a3e" strokeWidth="5" />
                            <circle
                              cx="50" cy="50" r="42" fill="none"
                              stroke={scoreColor}
                              strokeWidth="5"
                              strokeDasharray={`${dashArray} ${circumference}`}
                              strokeLinecap="round"
                              className="transition-all duration-700"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg sm:text-xl font-extrabold text-white">{score}%</span>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold ${match.color} whitespace-nowrap`}>{match.text}</span>
                      </div>
                    )}

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#8b5cf6] transition-colors duration-200">{job.title}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1.5"><Building2 size={14} /> {job.company}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><Briefcase size={14} /> {job.level}</span>
                      </div>

                      {/* Description */}
                      {job.description && (
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">{job.description}</p>
                      )}

                      {/* Salary Range */}
                      {(job.salary_min || job.salary_max) && (
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Salary:</span>
                          <span className="text-sm font-semibold text-emerald-400">
                            ৳{job.salary_min?.toLocaleString()} — ৳{job.salary_max?.toLocaleString()}/mo
                          </span>
                        </div>
                      )}

                      {/* Skills */}
                      <div className="mb-4">
                        <span className="text-xs text-gray-600 uppercase tracking-wider font-medium mb-2 block">
                          Required Skills{user ? ` (${details.matchedSkills.length}/${jobSkills.length} matched)` : ` (${jobSkills.length})`}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {jobSkills.map((skill, i) => {
                            const isMatched = user && details.matchedSkills.includes(skill.toLowerCase());
                            return (
                              <span key={i} className={`px-2.5 py-1 text-xs rounded-full border ${
                                isMatched
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                              }`}>
                                {isMatched && '✓ '}{skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {user && (
                        <div className="flex flex-wrap gap-4 text-sm mb-4">
                          <span className={`flex items-center gap-1.5 ${expBreakdown >= 15 ? 'text-emerald-400' : expBreakdown >= 8 ? 'text-amber-400' : 'text-gray-500'}`}>
                            <TrendingUp size={14} /> {expBreakdown >= 20 ? 'Meets experience level' : expBreakdown >= 12 ? 'Close to required level' : 'Below required level'}
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-500">
                            <span className={`w-1.5 h-1.5 rounded-full ${trackBreakdown >= 15 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            {trackBreakdown >= 20 ? 'Same track' : trackBreakdown >= 10 ? 'Related track' : 'Different track'}
                          </span>
                        </div>
                      )}

                      <div className="flex gap-2.5">
                        <button
                          onClick={() => { if (!user) navigate('/login'); }}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#7c3aed] to-[#ec4899] rounded-xl text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#7c3aed]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          <Send size={14} /> Apply Now
                        </button>
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="px-5 py-2.5 border border-[#2a2a5a] rounded-xl text-gray-400 text-sm font-medium hover:border-[#7c3aed]/40 hover:text-white transition-all duration-200 cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>

                    {/* Match Breakdown (logged in only) */}
                    {user && (
                      <div className="lg:min-w-[190px] bg-[#0a0a1a]/50 border border-[#2a2a5a]/40 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Match Breakdown</h4>
                        {[
                          { label: 'Skills', value: skillsBreakdown, max: 60, color: '#7c3aed' },
                          { label: 'Experience', value: expBreakdown, max: 20, color: '#ec4899' },
                          { label: 'Track', value: trackBreakdown, max: 20, color: '#8b5cf6' },
                        ].map((item) => (
                          <div key={item.label} className="mb-2.5 last:mb-0">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">{item.label}</span>
                              <span className="text-gray-300 font-medium">{item.value}/{item.max}</span>
                            </div>
                            <div className="h-1.5 bg-[#1a1a3e] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${(item.value / item.max) * 100}%`, backgroundColor: item.color }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======= Job Details Modal ======= */}
      {selectedJob && (() => {
        const d = getMatchDetails(selectedJob);
        const sc = d.total;
        const ml = getMatchLabel(sc);
        const sColor = getScoreColor(sc);
        const circ = 2 * Math.PI * 54;
        const dash = (sc / 100) * circ;
        const jSkills = Array.isArray(selectedJob.skills) ? selectedJob.skills : [];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedJob(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111128] border border-[#2a2a5a]/80 rounded-3xl shadow-2xl shadow-[#7c3aed]/10 animate-[modalIn_0.25s_ease-out]"
            >
              {/* Header gradient bar */}
              <div className="h-1.5 bg-linear-to-r from-[#7c3aed] via-[#ec4899] to-[#8b5cf6] rounded-t-3xl" />

              {/* Close button */}
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1a3e] border border-[#2a2a5a] text-gray-400 hover:text-white hover:border-[#7c3aed]/50 transition-all duration-200 cursor-pointer z-10"
              >
                <X size={18} />
              </button>

              <div className="p-6 sm:p-8">
                {/* Top section: Score ring + Title */}
                <div className="flex items-start gap-6 mb-6">
                  <div className="relative w-28 h-28 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#1a1a3e" strokeWidth="6" />
                      <circle
                        cx="60" cy="60" r="54" fill="none"
                        stroke={sColor}
                        strokeWidth="6"
                        strokeDasharray={`${dash} ${circ}`}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-white">{sc}%</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Match</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h2 className="text-2xl font-extrabold text-white mb-1.5 leading-tight">{selectedJob.title}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1.5"><Building2 size={14} /> {selectedJob.company}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {selectedJob.location}</span>
                      <span className="flex items-center gap-1.5"><Briefcase size={14} /> {selectedJob.level}</span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${sc >= 80 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : sc >= 60 ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
                      {ml.text}
                    </span>
                  </div>
                </div>

                {/* Salary */}
                {(selectedJob.salary_min || selectedJob.salary_max) && (
                  <div className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-4 py-3 mb-6">
                    <DollarSign size={18} className="text-emerald-400" />
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Salary Range</div>
                      <div className="text-base font-bold text-emerald-400">
                        ৳{selectedJob.salary_min?.toLocaleString()} — ৳{selectedJob.salary_max?.toLocaleString()}
                        <span className="text-emerald-400/60 font-normal text-sm"> / month</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedJob.description && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                      <ChevronRight size={14} className="text-[#7c3aed]" /> Job Description
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed pl-5">{selectedJob.description}</p>
                  </div>
                )}

                {/* Required Skills */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Star size={14} className="text-[#ec4899]" /> Required Skills
                    <span className="text-xs font-normal text-gray-500 ml-auto">{d.matchedSkills.length} of {jSkills.length} matched</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {jSkills.map((skill, i) => {
                      const matched = d.matchedSkills.includes(skill.toLowerCase());
                      return (
                        <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                          matched
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-[#1a1a3e] text-gray-500 border-[#2a2a5a]'
                        }`}>
                          {matched && <CheckCircle size={12} />} {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Match Breakdown */}
                <div className="bg-[#0a0a1a]/60 border border-[#2a2a5a]/40 rounded-xl p-5 mb-6">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Award size={14} className="text-[#8b5cf6]" /> Match Breakdown
                  </h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Skills Match', value: d.skills, max: 60, color: '#7c3aed', desc: `${d.matchedSkills.length} of ${jSkills.length} required skills` },
                      { label: 'Experience Level', value: d.experience, max: 20, color: '#ec4899', desc: d.experience >= 20 ? 'Meets required level' : d.experience >= 12 ? 'Close to required level' : 'Below required level' },
                      { label: 'Career Track', value: d.track, max: 20, color: '#8b5cf6', desc: d.track >= 20 ? 'Same career track' : d.track >= 10 ? 'Related career track' : 'Different career track' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm text-gray-300 font-medium">{item.label}</span>
                          <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}/{item.max}</span>
                        </div>
                        <div className="h-2 bg-[#1a1a3e] rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${(item.value / item.max) * 100}%`, backgroundColor: item.color }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience + Track info */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#0a0a1a]/40 border border-[#2a2a5a]/40 rounded-xl p-4 text-center">
                    <Clock size={20} className="mx-auto text-[#ec4899] mb-2" />
                    <div className="text-xs text-gray-500 mb-1">Required Level</div>
                    <div className="text-sm font-bold text-white">{selectedJob.level}</div>
                  </div>
                  <div className="bg-[#0a0a1a]/40 border border-[#2a2a5a]/40 rounded-xl p-4 text-center">
                    <Award size={20} className="mx-auto text-[#8b5cf6] mb-2" />
                    <div className="text-xs text-gray-500 mb-1">Your Level</div>
                    <div className="text-sm font-bold text-white">{avgLevelLabel}</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-[#7c3aed] to-[#ec4899] rounded-xl text-white text-sm font-bold hover:shadow-lg hover:shadow-[#7c3aed]/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                    <Send size={16} /> Apply Now
                  </button>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-6 py-3 border border-[#2a2a5a] rounded-xl text-gray-400 text-sm font-medium hover:border-[#7c3aed]/40 hover:text-white transition-all duration-200 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
