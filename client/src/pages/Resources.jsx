import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, CheckCircle, GraduationCap, Loader2,
  Search, X, Layers, Star, Clock, Award, Sparkles, Code2,
  BarChart3, Shield, ChevronRight, ArrowRight, Flame,
  GraduationCap as GradCap, TrendingUp
} from 'lucide-react';
import api from '../utils/api';

/* ─── Constants ─── */
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop';
const getCourseImage = (course) => course?.cover_image || FALLBACK_IMAGE;

const topicMeta = {
  'AI':       { color: '#a855f7', icon: Sparkles },
  'Web':      { color: '#3b82f6', icon: Code2 },
  'Data':     { color: '#10b981', icon: BarChart3 },
  'Mobile':   { color: '#ec4899', icon: Layers },
  'Cloud':    { color: '#06b6d4', icon: Shield },
  'Security': { color: '#f59e0b', icon: Shield },
  'default':  { color: '#14b8a6', icon: BookOpen },
};

function getTopicMeta(topic) {
  const key = Object.keys(topicMeta).find((k) =>
    (topic || '').toLowerCase().includes(k.toLowerCase())
  );
  return topicMeta[key] || topicMeta['default'];
}

/* ─── useInView Hook ─── */
function useInView(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1, ...opts }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── StatCard ─── */
function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center
        hover:shadow-md hover:-translate-y-1 transition-all duration-300"
      style={{ transitionDelay: `${delay}s` }}
    >
      <div
        className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
        style={{ background: `${color}15` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div className="text-2xl font-black mb-1" style={{ color }}>{value}</div>
      <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{label}</div>
    </div>
  );
}

/* ─── FeaturedCard ─── */
function FeaturedCard({ course, enrolled, onDetails }) {
  const meta = getTopicMeta(course.topic);
  const img = getCourseImage(course);
  const Icon = meta.icon;

  return (
    <div className="shrink-0 w-[280px] sm:w-[310px]">
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
          hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full"
      >
        {/* Image */}
        <div className="relative h-36 overflow-hidden">
          <img src={img} alt={course.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Topic badge */}
          <div className="absolute top-3 left-3">
            <span
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide"
              style={{ background: `${meta.color}dd`, color: '#fff' }}
            >
              <Icon size={10} /> {course.topic || 'Course'}
            </span>
          </div>

          {/* Enrolled badge */}
          {enrolled && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500
                text-white text-[10px] font-bold rounded-lg">
                <CheckCircle size={10} /> Enrolled
              </span>
            </div>
          )}

          {/* Flame icon */}
          <div className="absolute bottom-3 right-3 w-7 h-7 rounded-lg
            bg-gradient-to-br from-amber-400 to-red-500
            flex items-center justify-center shadow-md">
            <Flame size={13} className="text-white" />
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{course.name}</h4>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
            {course.description || 'Advance your career with this curated course.'}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><Users size={10} /> {course.enrollment_count || 0}</span>
              <span className="flex items-center gap-1 text-amber-400"><Star size={10} fill="currentColor" /> 4.8</span>
            </div>
            <button
              onClick={() => onDetails(course)}
              className="flex items-center gap-1 text-[11px] font-semibold
                text-teal-600 hover:text-teal-800 transition-colors cursor-pointer"
            >
              Details <ChevronRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function Resources() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses]         = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch]           = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null); // prep for Step 4 modal

  const featuredRef         = useRef(null);
  const [heroRef, heroVis]  = useInView();
  const [statsRef, statsVis] = useInView();

  useEffect(() => { fetchData(); }, [user?.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, enrollRes] = await Promise.all([
        api.get('/courses'),
        user
          ? api.get(`/enrollments?user_id=${user.id}`).catch(() => ({ data: [] }))
          : Promise.resolve({ data: [] }),
      ]);
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      setEnrollments(Array.isArray(enrollRes.data) ? enrollRes.data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const isEnrolled = (courseId) =>
    enrollments.some((en) => Number(en.course_id) === Number(courseId));

  const handleEnroll = async (courseId) => {
    if (!user) return alert('Please login to enroll');
    setActionLoading(courseId);
    try {
      await api.post('/enrollments', { course_id: courseId, user_id: user.id });
      await fetchData();
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const handleUnenroll = async (courseId) => {
    setActionLoading(courseId);
    try {
      const enrollment = enrollments.find((en) => Number(en.course_id) === Number(courseId));
      if (enrollment) { await api.delete(`/enrollments/${enrollment.id}`); await fetchData(); }
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const topics = useMemo(() => {
    const set = new Set(courses.map((c) => c.topic).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [courses]);

  const filteredCourses = useMemo(() =>
    courses.filter((c) => {
      const matchSearch = [c.name, c.topic, c.description]
        .some((s) => (s || '').toLowerCase().includes(search.toLowerCase()));
      const matchTopic = topicFilter === 'all' || c.topic === topicFilter;
      return matchSearch && matchTopic;
    }),
    [courses, search, topicFilter]
  );

  const enrolledCount  = enrollments.length;
  const totalStudents  = courses.reduce((sum, c) => sum + (c.enrollment_count || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ HERO ══ */}
        <div
          ref={heroRef}
          className={`text-center mb-12 transition-all duration-700
            ${heroVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-teal-50 border border-teal-100 mb-5">
            <GradCap size={13} className="text-teal-500" />
            <span className="text-[11px] font-bold text-teal-600 uppercase tracking-widest">
              Learning Hub
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
            Level Up Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">
              Career Skills
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Explore curated courses, track your progress, and build the skills employers are looking for.
          </p>
        </div>

        {/* ══ STATS ══ */}
        <div
          ref={statsRef}
          className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12
            transition-all duration-700 delay-100
            ${statsVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <StatCard icon={BookOpen}   label="Courses"  value={courses.length}  color="#14b8a6" delay={0}    />
          <StatCard icon={Users}      label="Students" value={totalStudents}    color="#06b6d4" delay={0.08} />
          <StatCard icon={CheckCircle} label="Enrolled" value={enrolledCount}  color="#10b981" delay={0.16} />
          <StatCard icon={Award}      label="Topics"   value={topics.length - 1} color="#a855f7" delay={0.24} />
        </div>

        {/* ══ FEATURED COURSES ══ */}
        {!loading && courses.length > 0 && (
          <div className="mb-12">
            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-red-500
                  flex items-center justify-center shadow-sm">
                  <Flame size={15} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Featured Courses</h2>
                  <p className="text-[11px] text-gray-400">Handpicked for your career growth</p>
                </div>
              </div>
              <button
                onClick={() => featuredRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                className="flex items-center gap-1 text-xs text-teal-500 hover:text-teal-700
                  font-semibold transition-colors cursor-pointer group"
              >
                Scroll <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Horizontal scroll */}
            <div
              ref={featuredRef}
              className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1"
              style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
            >
              {courses.slice(0, 8).map((course) => (
                <FeaturedCard
                  key={course.id}
                  course={course}
                  enrolled={isEnrolled(course.id)}
                  onDetails={setSelectedCourse}
                />
              ))}
            </div>
          </div>
        )}

        {/* ══ SEARCH BAR ══ */}
        <div className="relative mb-5">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={17} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by name, topic, or description..."
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl
              text-gray-800 placeholder-gray-400 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400
              transition-all duration-200"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7
                flex items-center justify-center rounded-lg bg-gray-100
                text-gray-400 hover:text-gray-600 hover:bg-gray-200
                transition-colors cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* ══ TOPIC FILTER + COUNT ══ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => {
              const isActive = topicFilter === topic;
              const meta = topic === 'all' ? { color: '#14b8a6', icon: Layers } : getTopicMeta(topic);
              const Icon = meta.icon;
              return (
                <button
                  key={topic}
                  onClick={() => setTopicFilter(topic)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs
                    font-semibold border cursor-pointer transition-all duration-200
                    ${isActive
                      ? 'text-white border-transparent shadow-sm'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  style={isActive ? { background: meta.color, borderColor: meta.color } : {}}
                >
                  <Icon size={11} />
                  {topic === 'all' ? 'All' : topic}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-gray-400 tabular-nums font-medium">
              {filteredCourses.length} courses
            </span>
            {(search || topicFilter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setTopicFilter('all'); }}
                className="text-xs text-teal-500 hover:text-teal-700 font-semibold
                  flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ══ COURSE GRID ══ */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-teal-500" />
            <span className="ml-3 text-gray-400">Loading courses...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-700 font-bold text-lg mb-1">No courses found</p>
            <p className="text-gray-400 text-sm mb-5">
              Try adjusting your search or filters.
            </p>
            {(search || topicFilter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setTopicFilter('all'); }}
                className="px-5 py-2.5 bg-teal-500 text-white text-sm font-bold
                  rounded-xl hover:bg-teal-600 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course, idx) => {
              const enrolled = isEnrolled(course.id);
              const isLoading = actionLoading === course.id;
              const meta = getTopicMeta(course.topic);
              const img = getCourseImage(course);
              const Icon = meta.icon;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
                    hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                  style={{ transitionDelay: `${idx * 0.03}s` }}
                >
                  {/* Top color accent */}
                  <div className="h-[3px]" style={{ background: meta.color }} />

                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={img} alt={course.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    {/* Image overlays */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {course.topic && (
                        <span
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg
                            text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm"
                          style={{ background: `${meta.color}cc`, color: '#fff' }}
                        >
                          <Icon size={10} /> {course.topic}
                        </span>
                      )}
                    </div>
                    {enrolled && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500
                          text-white text-[10px] font-bold rounded-lg shadow-md">
                          <CheckCircle size={10} /> Enrolled
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-1.5 line-clamp-1">
                      {course.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-1">
                      {course.description || 'Learn essential skills in this comprehensive course.'}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-4 pt-3 border-t border-gray-50">
                      <span className="flex items-center gap-1">
                        <Users size={11} /> {course.enrollment_count || 0} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> Self-paced
                      </span>
                      <span className="flex items-center gap-1 ml-auto text-amber-400">
                        <Star size={11} fill="currentColor" /> 4.8
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {/* Details button — prep for modal */}
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-500
                          text-xs font-semibold hover:border-gray-300 hover:text-gray-700
                          transition-all cursor-pointer flex items-center gap-1"
                      >
                        <ChevronRight size={12} /> Details
                      </button>

                      {enrolled ? (
                        <button
                          onClick={() => navigate(`/course-player/${course.id}`)}
                          className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600
                            text-white text-xs font-bold rounded-xl transition-colors
                            cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <GraduationCap size={13} /> Continue Learning
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.id)}
                          disabled={isLoading}
                          className="flex-1 py-2.5 text-white text-xs font-bold rounded-xl
                            transition-all cursor-pointer disabled:opacity-50
                            flex items-center justify-center gap-1.5 hover:opacity-90"
                          style={{ background: `linear-gradient(135deg, ${meta.color}, #06b6d4)` }}
                        >
                          {isLoading ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <><GraduationCap size={13} /> Enroll</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer count */}
        {!loading && filteredCourses.length > 0 && (
          <div className="text-center mt-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100
              rounded-full text-xs text-gray-400 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Showing {filteredCourses.length} of {courses.length} courses
            </span>
          </div>
        )}
      </div>
    </div>
  );
}