import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import {
  ChevronLeft, Play, CheckCircle, Lock, Loader2, AlertCircle,
  Volume2, Maximize2, SkipForward, Clock, Award, BarChart3, BookOpen,
  Maximize
} from 'lucide-react';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMarking, setIsMarking] = useState(false);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    if (!user || !courseId) return;
    // Reset watching state when course changes
    setIsWatching(false);
    fetchCourseVideos();
    fetchProgress();
  }, [courseId, user]);

  // Handle route changes - redirect if navigating away from course player
  useEffect(() => {
    if (!location.pathname.includes('/course-player/')) {
      setIsWatching(false);
    }
  }, [location.pathname]);

  // Format duration
  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    if (typeof duration === 'string' && duration.includes('min')) return duration;
    if (typeof duration === 'number') return `${duration} min`;
    return String(duration);
  };

  // Group videos by module
  const getGroupedModules = () => {
    const modules = {};
    videos.forEach(video => {
      const moduleNum = video.module_number || 1;
      if (!modules[moduleNum]) {
        modules[moduleNum] = [];
      }
      modules[moduleNum].push(video);
    });
    return modules;
  };

  // Check if a module can be accessed
  const canAccessModule = (moduleNumber) => {
    if (moduleNumber === 1) return true;
    
    const groupedModules = getGroupedModules();
    const previousModuleNum = moduleNumber - 1;
    
    if (!groupedModules[previousModuleNum]) return true;
    
    // Check if all videos in previous module are completed
    return groupedModules[previousModuleNum].every(v => completedVideos.has(v.id));
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    
    if (!isFullscreen) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      } else if (videoContainerRef.current.webkitRequestFullscreen) {
        videoContainerRef.current.webkitRequestFullscreen();
      } else if (videoContainerRef.current.mozRequestFullScreen) {
        videoContainerRef.current.mozRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const fetchCourseVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/course-videos/${courseId}`);
      setCourse(response.data.course);
      setVideos(response.data.videos);
      
      // Set completed videos
      const completed = new Set(
        response.data.videos
          .filter(v => v.completed)
          .map(v => v.id)
      );
      setCompletedVideos(completed);

      // Set first video or first incomplete video
      const firstIncomplete = response.data.videos.find(v => !v.completed);
      setCurrentVideo(firstIncomplete || response.data.videos[0]);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load course videos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await api.get(`/course-progress/${courseId}`);
      setProgress(response.data);
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  const markVideoComplete = async () => {
    if (!currentVideo || isMarking) return;

    try {
      setIsMarking(true);
      await api.post(`/mark-video-complete/${currentVideo.id}`);
      
      // Update completed set
      const newCompleted = new Set(completedVideos);
      newCompleted.add(currentVideo.id);
      setCompletedVideos(newCompleted);

      // Move to next video
      const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
      if (currentIndex < videos.length - 1) {
        const nextVideo = videos[currentIndex + 1];
        setCurrentVideo(nextVideo);
        setIsWatching(false);
      }

      // Refresh progress
      await fetchProgress();
    } catch (err) {
      console.error('Error marking video complete:', err);
      setError('Failed to mark video as completed.');
    } finally {
      setIsMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050D11] to-[#0A1A22] px-4 py-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-teal-500" size={48} />
          <p className="text-gray-400">Loading course videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050D11] to-[#0A1A22] px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-6"
          >
            <ChevronLeft size={20} /> Back
          </button>
          <div className="glass rounded-2xl p-8 border border-red-500/30 bg-red-500/5">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="text-red-400" size={24} />
              <h2 className="text-xl font-bold text-red-400">Error</h2>
            </div>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !currentVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050D11] to-[#0A1A22] px-4 py-8">
        <p className="text-gray-400 text-center">No videos available for this course.</p>
      </div>
    );
  }

  const isCurrentVideoCompleted = completedVideos.has(currentVideo.id);
  const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
  const canPlayNext = isCurrentVideoCompleted || (currentIndex === 0 && videos.length === 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050D11] to-[#0A1A22]">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-gradient-to-b from-[#0A1A22]/95 to-[#050D11]/80 backdrop-blur-md border-b border-[#1e3a42]">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 mt-2">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-4 transition-colors"
          >
            <ChevronLeft size={20} /> Back to Courses
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{course.name}</h1>
              <p className="text-gray-400">Video {currentIndex + 1} of {videos.length}</p>
            </div>
            {progress && (
              <div className="text-right">
                <div className="text-3xl font-bold text-teal-400">
                  {Math.round(progress.progress_percentage)}%
                </div>
                <p className="text-sm text-gray-400">Complete</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl overflow-hidden border border-[#1e3a42]">
              {/* Video Container */}
              <div className="relative bg-black aspect-video" ref={videoContainerRef}>
                <img
                  ref={videoRef}
                  src={currentVideo.url}
                  alt={currentVideo.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Play Overlay - Click to start */}
                {!isWatching && (
                  <button
                    onClick={() => setIsWatching(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/40 transition-colors group"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-teal-500/20 group-hover:bg-teal-500/30 transition-colors">
                        <Play className="text-white size-16 fill-white" />
                      </div>
                      <p className="text-white font-semibold">Click to Watch Video</p>
                    </div>
                  </button>
                )}

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-teal-400" />
                      <span className="text-white text-sm font-medium">{formatDuration(currentVideo.duration)}</span>
                    </div>
                    <button 
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Toggle fullscreen"
                    >
                      <Maximize size={18} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6 border-t border-[#1e3a42]">
                <h2 className="text-2xl font-bold text-white mb-2">{currentVideo.title}</h2>
                <p className="text-gray-400 mb-6">{currentVideo.description}</p>

                {/* Status Badge */}
                <div className="mb-6">
                  {isCurrentVideoCompleted ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/15 rounded-lg border border-emerald-500/30">
                      <CheckCircle size={16} className="text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Completed</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/15 rounded-lg border border-amber-500/30">
                      <Play size={16} className="text-amber-400" />
                      <span className="text-amber-400 font-medium">In Progress</span>
                    </div>
                  )}
                </div>

                {/* Mark Complete Button */}
                <button
                  onClick={markVideoComplete}
                  disabled={isCurrentVideoCompleted || isMarking}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    isCurrentVideoCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/30'
                  }`}
                >
                  {isMarking ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Marking...
                    </>
                  ) : isCurrentVideoCompleted ? (
                    <>
                      <CheckCircle size={18} />
                      Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Mark as Complete
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Next Video */}
            {currentIndex < videos.length - 1 && (
              <div className="mt-6 glass rounded-2xl p-6 border border-[#1e3a42]">
                <h3 className="text-lg font-bold text-white mb-4">Next Video</h3>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-14 bg-[#1e3a42] rounded-lg flex-shrink-0 flex items-center justify-center">
                    {canPlayNext ? (
                      <Play size={20} className="text-teal-400 fill-teal-400" />
                    ) : (
                      <Lock size={20} className="text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">
                      {canPlayNext ? 'Ready to watch' : 'Complete this video and all previous videos in the module first'}
                    </p>
                    <p className="text-white font-medium mb-2">{videos[currentIndex + 1].title}</p>
                    <button
                      onClick={() => {
                        setCurrentVideo(videos[currentIndex + 1]);
                        setIsWatching(false);
                      }}
                      disabled={!canPlayNext}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        canPlayNext
                          ? 'bg-teal-500/20 text-teal-400 hover:bg-teal-500/30'
                          : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canPlayNext ? 'Watch Now' : 'Locked'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Course Outline */}
          <div className="glass rounded-2xl p-6 border border-[#1e3a42] h-fit sticky top-32">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-teal-400" />
              Course Outline
            </h3>

            {/* Progress Stats */}
            {progress && (
              <div className="mb-6 space-y-3 pb-6 border-b border-[#1e3a42]">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Videos Completed</span>
                  <span className="font-bold text-teal-400">{progress.completed_videos}/{progress.total_videos}</span>
                </div>
                <div className="w-full bg-[#1e3a42] rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${progress.progress_percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Video List by Modules */}
            <div className="space-y-4 max-h-[calc(100vh-500px)] overflow-y-auto">
              {Object.entries(getGroupedModules()).map(([moduleNum, moduleVideos]) => {
                const moduleNumber = parseInt(moduleNum);
                const isModuleAccessible = canAccessModule(moduleNumber);
                const isModuleCompleted = moduleVideos.every(v => completedVideos.has(v.id));
                
                return (
                  <div key={moduleNum} className="space-y-2">
                    {/* Module Header */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      isModuleAccessible 
                        ? 'bg-[#1e3a42]/50' 
                        : 'bg-red-500/10 opacity-60'
                    }`}>
                      {isModuleCompleted ? (
                        <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                      ) : isModuleAccessible ? (
                        <Play size={16} className="text-teal-400 flex-shrink-0" />
                      ) : (
                        <Lock size={16} className="text-gray-500 flex-shrink-0" />
                      )}
                      <span className={`font-bold text-sm ${
                        isModuleAccessible ? 'text-white' : 'text-gray-500'
                      }`}>
                        Module {moduleNumber}: {moduleVideos[0]?.title?.split(':')[0] || `Module ${moduleNumber}`}
                      </span>
                    </div>
                    
                    {/* Videos in Module */}
                    <div className="space-y-2 ml-2">
                      {moduleVideos.map((video, idx) => {
                        const isCompleted = completedVideos.has(video.id);
                        const isCurrent = currentVideo.id === video.id;
                        const canAccess = isModuleAccessible;

                        return (
                          <button
                            key={video.id}
                            onClick={() => {
                              if (canAccess) {
                                setCurrentVideo(video);
                                setIsWatching(false);
                              }
                            }}
                            disabled={!canAccess}
                            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                              isCurrent
                                ? 'bg-teal-500/20 border border-teal-500/50'
                                : canAccess
                                ? 'hover:bg-[#1e3a42] border border-transparent'
                                : 'cursor-not-allowed opacity-50'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="flex-shrink-0 mt-0.5">
                                {isCompleted ? (
                                  <CheckCircle size={14} className="text-emerald-400" />
                                ) : isCurrent && canAccess ? (
                                  <Play size={14} className="text-teal-400 fill-teal-400" />
                                ) : canAccess ? (
                                  <div className="w-3.5 h-3.5 rounded-full border border-gray-500" />
                                ) : (
                                  <Lock size={14} className="text-gray-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium truncate ${
                                  isCurrent ? 'text-white' : canAccess ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                  {idx + 1}. {video.title}
                                </p>
                                <p className="text-[11px] text-gray-500 mt-0.5">{formatDuration(video.duration)}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Completion Message */}
            {progress && progress.completed_videos === progress.total_videos && (
              <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Award size={18} className="text-emerald-400" />
                  <p className="font-bold text-emerald-400">Course Complete! 🎉</p>
                </div>
                <p className="text-sm text-gray-300">You've successfully completed all videos in this course.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
