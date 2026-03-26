import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, CheckCircle, GraduationCap,
  Loader2, Search, X, Layers, Star, Clock
} from 'lucide-react';
import api from '../utils/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop';

const getCourseImage = (course) => course?.cover_image || FALLBACK_IMAGE;

export default function Resources() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [user?.id]);

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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = (courseId) =>
    enrollments.some((en) => Number(en.course_id) === Number(courseId));

  const handleEnroll = async (courseId) => {
    if (!user) return alert('Please login to enroll');
    setActionLoading(courseId);
    try {
      await api.post('/enrollments', { course_id: courseId, user_id: user.id });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnenroll = async (courseId) => {
    setActionLoading(courseId);
    try {
      const enrollment = enrollments.find((en) => Number(en.course_id) === Number(courseId));
      if (enrollment) {
        await api.delete(`/enrollments/${enrollment.id}`);
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  // Derive unique topics from courses
  const topics = useMemo(() => {
    const set = new Set(courses.map((c) => c.topic).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [courses]);

  // Filter courses by search + topic
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch = [c.name, c.topic, c.description]
        .some((s) => (s || '').toLowerCase().includes(search.toLowerCase()));
      const matchTopic = topicFilter === 'all' || c.topic === topicFilter;
      return matchSearch && matchTopic;
    });
  }, [courses, search, topicFilter]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="text-teal-600" size={30} />
            Learning Resources
          </h1>
          <p className="text-gray-500 mt-1.5 text-base">
            Browse and enroll in courses to grow your skills.
          </p>
        </div>

        {/* ── Search Bar ── */}
        <div className="relative mb-5">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, topic, or description..."
            className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl
              text-gray-800 placeholder-gray-400 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400
              transition-all duration-200"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6
                flex items-center justify-center rounded-full bg-gray-100
                text-gray-400 hover:text-gray-700 hover:bg-gray-200
                transition-colors cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* ── Topic Filter Chips ── */}
        <div className="flex flex-wrap gap-2 mb-7">
          {topics.map((topic) => {
            const isActive = topicFilter === topic;
            return (
              <button
                key={topic}
                onClick={() => setTopicFilter(topic)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm
                  font-medium border cursor-pointer transition-all duration-200
                  ${isActive
                    ? 'bg-teal-500 text-white border-teal-500 shadow-sm shadow-teal-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-600'
                  }`}
              >
                {topic === 'all' ? <Layers size={13} /> : null}
                {topic === 'all' ? 'All Topics' : topic}
              </button>
            );
          })}
        </div>

        {/* ── Results Info ── */}
        {!loading && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-400">
              {filteredCourses.length === courses.length
                ? `Showing all ${courses.length} courses`
                : `${filteredCourses.length} of ${courses.length} courses`}
            </p>
            {(search || topicFilter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setTopicFilter('all'); }}
                className="text-xs text-teal-500 hover:text-teal-700 font-semibold
                  flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={30} className="animate-spin text-teal-500" />
            <span className="ml-3 text-gray-400">Loading courses...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          /* ── Empty State ── */
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-700 font-semibold text-lg mb-1">No courses found</p>
            <p className="text-gray-400 text-sm mb-5">
              Try adjusting your search or removing filters.
            </p>
            {(search || topicFilter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setTopicFilter('all'); }}
                className="px-5 py-2 bg-teal-500 text-white text-sm font-semibold
                  rounded-xl hover:bg-teal-600 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* ── Course Grid ── */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => {
              const enrolled = isEnrolled(course.id);
              const isLoading = actionLoading === course.id;
              const img = getCourseImage(course);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm
                    overflow-hidden hover:shadow-lg hover:-translate-y-1
                    transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={img}
                      alt={course.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    {/* Enrolled badge on image */}
                    {enrolled && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500
                          text-white text-[11px] font-bold rounded-lg shadow-md">
                          <CheckCircle size={11} /> Enrolled
                        </span>
                      </div>
                    )}
                    {/* Topic badge on image */}
                    {course.topic && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm
                          text-white text-[11px] font-semibold rounded-lg">
                          {course.topic}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-1.5 line-clamp-1">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-1">
                      {course.description || 'Learn essential skills in this comprehensive course.'}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-4 border-t border-gray-50 pt-3">
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
                      {enrolled ? (
                        <>
                          <button
                            onClick={() => navigate(`/course-player/${course.id}`)}
                            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600
                              text-white text-xs font-bold rounded-xl transition-colors
                              cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <GraduationCap size={13} /> Continue Learning
                          </button>
                          <button
                            onClick={() => handleUnenroll(course.id)}
                            disabled={isLoading}
                            className="px-3.5 py-2.5 border border-red-200 text-red-400 text-xs
                              font-semibold rounded-xl hover:bg-red-50 transition-colors
                              cursor-pointer disabled:opacity-50 flex items-center justify-center"
                          >
                            {isLoading ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.id)}
                          disabled={isLoading}
                          className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-600
                            text-white text-xs font-bold rounded-xl transition-colors
                            cursor-pointer disabled:opacity-50
                            flex items-center justify-center gap-1.5"
                        >
                          {isLoading ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <><GraduationCap size={13} /> Enroll Now</>
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

        {/* ── Footer count ── */}
        {!loading && filteredCourses.length > 0 && (
          <p className="text-center text-xs text-gray-300 mt-10">
            {filteredCourses.length} courses shown
          </p>
        )}
      </div>
    </div>
  );
}