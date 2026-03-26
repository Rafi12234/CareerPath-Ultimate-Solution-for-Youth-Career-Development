import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, CheckCircle, GraduationCap, Loader2 } from 'lucide-react';
import api from '../utils/api';

export default function Resources() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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

  const isEnrolled = (courseId) => {
    return enrollments.some((en) => Number(en.course_id) === Number(courseId));
  };

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

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="text-teal-600" size={32} />
            Learning Resources
          </h1>
          <p className="text-gray-500 mt-2">
            Browse and enroll in courses to grow your skills.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-teal-500" />
            <span className="ml-3 text-gray-500 text-lg">Loading courses...</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No courses available yet.</p>
          </div>
        ) : (
          <>
            {/* Course Count */}
            <p className="text-sm text-gray-400 mb-6">
              Showing <span className="font-semibold text-gray-700">{courses.length}</span> courses
            </p>

            {/* Course Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const enrolled = isEnrolled(course.id);
                const isLoading = actionLoading === course.id;

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden
                      hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Course Image */}
                    <div className="h-40 bg-teal-50 overflow-hidden">
                      {course.cover_image ? (
                        <img
                          src={course.cover_image}
                          alt={course.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={40} className="text-teal-300" />
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      {/* Topic badge */}
                      {course.topic && (
                        <span className="inline-block px-2.5 py-0.5 bg-teal-100 text-teal-700
                          text-xs font-semibold rounded-full mb-2">
                          {course.topic}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                        {course.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                        {course.description || 'No description available.'}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {course.enrollment_count || 0} enrolled
                        </span>
                        {enrolled && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle size={12} />
                            Enrolled
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {enrolled ? (
                          <>
                            <button
                              onClick={() => navigate(`/course-player/${course.id}`)}
                              className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white
                                text-sm font-semibold rounded-lg transition-colors cursor-pointer
                                flex items-center justify-center gap-1.5"
                            >
                              <GraduationCap size={14} />
                              Continue
                            </button>
                            <button
                              onClick={() => handleUnenroll(course.id)}
                              disabled={isLoading}
                              className="px-3 py-2 border border-red-200 text-red-500 text-sm
                                rounded-lg hover:bg-red-50 transition-colors cursor-pointer
                                disabled:opacity-50"
                            >
                              {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'Drop'}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course.id)}
                            disabled={isLoading}
                            className="flex-1 py-2 bg-teal-500 hover:bg-teal-600 text-white
                              text-sm font-semibold rounded-lg transition-colors cursor-pointer
                              disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            {isLoading ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <>
                                <GraduationCap size={14} />
                                Enroll
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
