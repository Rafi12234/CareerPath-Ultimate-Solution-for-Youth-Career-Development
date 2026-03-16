import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CourseCertificatePanel from '../components/CourseCertificatePanel';
import {
  ChevronLeft, Play, CheckCircle, Lock, Loader2, AlertCircle,
  Maximize, Minimize2, Clock, BookOpen, ChevronDown, ChevronRight,
  Sparkles, Zap, Target, Shield, Layers, ArrowRight, Star,
  SkipForward, RotateCcw, Eye, Flame, Trophy, Crown, GraduationCap,
  CircleDot, Heart, Pause, Volume2, VolumeX, Settings, X
} from 'lucide-react';

const FALLBACK_VIDEO_POOL = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
];

const SPEED_OPTIONS = [1, 1.5, 1.75, 2];

function inferMimeType(url) {
  if (!url) return 'video/mp4';
  const clean = url.split('?')[0].toLowerCase();
  if (clean.endsWith('.webm')) return 'video/webm';
  if (clean.endsWith('.ogg') || clean.endsWith('.ogv')) return 'video/ogg';
  return 'video/mp4';
}

function getPlayableSources(rawUrl, seed = 0) {
  if (!rawUrl) return [];

  const clean = rawUrl.split('?')[0].toLowerCase();
  const looksLikeGif = clean.endsWith('.gif') || rawUrl.includes('/image/upload/');

  if (!looksLikeGif) {
    return [{ src: rawUrl, type: inferMimeType(rawUrl) }];
  }

  // Many seeded URLs are GIF image resources, which are not reliably playable in <video>.
  // Try a Cloudinary MP4 variant first, then fall back to known public MP4 samples.
  const cloudinaryMp4 = rawUrl
    .replace('/image/upload/', '/video/upload/f_mp4/')
    .replace(/\.gif(\?.*)?$/i, '.mp4$1');

  const fallback = FALLBACK_VIDEO_POOL[seed % FALLBACK_VIDEO_POOL.length];
  return [
    { src: cloudinaryMp4, type: 'video/mp4' },
    { src: fallback, type: 'video/mp4' },
  ];
}

const InjectStyles = () => (
  <style>{`
    @keyframes cp-morphBlob1{
      0%,100%{border-radius:42% 58% 70% 30%/45% 45% 55% 55%;transform:rotate(0) scale(1)}
      25%{border-radius:70% 30% 50% 50%/30% 60% 40% 70%;transform:rotate(90deg) scale(1.06)}
      50%{border-radius:30% 70% 40% 60%/55% 30% 70% 45%;transform:rotate(180deg) scale(.94)}
      75%{border-radius:55% 45% 60% 40%/40% 70% 30% 60%;transform:rotate(270deg) scale(1.03)}
    }
    @keyframes cp-morphBlob2{
      0%,100%{border-radius:58% 42% 30% 70%/55% 45% 55% 45%;transform:rotate(0)}
      33%{border-radius:40% 60% 60% 40%/60% 30% 70% 40%;transform:rotate(120deg)}
      66%{border-radius:60% 40% 45% 55%/35% 65% 35% 65%;transform:rotate(240deg)}
    }
    @keyframes cp-gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes cp-fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
    @keyframes cp-fadeIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
    @keyframes cp-slideR{from{opacity:0;transform:translateX(-35px)}to{opacity:1;transform:translateX(0)}}
    @keyframes cp-slideL{from{opacity:0;transform:translateX(35px)}to{opacity:1;transform:translateX(0)}}
    @keyframes cp-scaleIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
    @keyframes cp-pulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.06)}}
    @keyframes cp-rotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes cp-rotateR{from{transform:rotate(360deg)}to{transform:rotate(0)}}
    @keyframes cp-glow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.3)}}
    @keyframes cp-barGrow{from{width:0}}
    @keyframes cp-barGrowH{from{transform:scaleY(0)}}
    @keyframes cp-shine{0%{left:-100%}50%,100%{left:150%}}
    @keyframes cp-borderFlow{0%{background-position:0% 50%}100%{background-position:200% 50%}}
    @keyframes cp-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes cp-float2{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-5px) rotate(2deg)}}
    @keyframes cp-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
    @keyframes cp-dotPulse{0%,100%{box-shadow:0 0 0 0 currentColor}50%{box-shadow:0 0 0 6px transparent}}
    @keyframes cp-particleFloat{
      0%{transform:translateY(0) translateX(0) scale(1);opacity:.3}
      50%{opacity:.6}
      100%{transform:translateY(-100vh) translateX(25px) scale(0);opacity:0}
    }
    @keyframes cp-ripple{to{transform:scale(3);opacity:0}}
    @keyframes cp-pulseExpand{0%{transform:scale(1);opacity:.4}100%{transform:scale(2.2);opacity:0}}
    @keyframes cp-playBounce{
      0%{transform:scale(1)}
      30%{transform:scale(1.2)}
      60%{transform:scale(.95)}
      100%{transform:scale(1)}
    }
    @keyframes cp-successBurst{
      0%{transform:scale(0);opacity:1}
      60%{opacity:.5}
      100%{transform:scale(3);opacity:0}
    }
    @keyframes cp-confetti{
      0%{transform:translateY(0) rotate(0);opacity:1}
      100%{transform:translateY(-80px) rotate(720deg);opacity:0}
    }
    @keyframes cp-moduleSlide{
      from{opacity:0;transform:translateX(-20px)}
      to{opacity:1;transform:translateX(0)}
    }
    @keyframes cp-videoItem{
      from{opacity:0;transform:translateY(10px)}
      to{opacity:1;transform:translateY(0)}
    }
    @keyframes cp-progressGlow{
      0%,100%{box-shadow:0 0 0 0 rgba(20,184,166,.3)}
      50%{box-shadow:0 0 15px 3px rgba(20,184,166,.1)}
    }
    @keyframes cp-waveBar{0%,100%{height:4px}50%{height:14px}}
    @keyframes cp-hexPulse{0%,100%{opacity:.3;stroke-width:1}50%{opacity:.8;stroke-width:1.5}}
    @keyframes cp-counterPop{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}
    @keyframes cp-checkPop{0%{transform:scale(0) rotate(-180deg)}60%{transform:scale(1.2) rotate(10deg)}100%{transform:scale(1) rotate(0)}}
    @keyframes cp-lockShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
    @keyframes cp-completionRing{from{stroke-dasharray:0 999}}
    @keyframes cp-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes cp-skeleton{0%,100%{opacity:.1}50%{opacity:.25}}
    @keyframes cp-statusDot{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.5);opacity:1}}

    .cp-reveal{opacity:0;transform:translateY(40px);transition:all .8s cubic-bezier(.16,1,.3,1)}
    .cp-reveal.vis{opacity:1;transform:none}
    .cp-stagger>*{opacity:0;transform:translateY(20px)}
    .cp-stagger.vis>*{animation:cp-videoItem .5s cubic-bezier(.16,1,.3,1) both}
    .cp-stagger.vis>*:nth-child(1){animation-delay:.03s}
    .cp-stagger.vis>*:nth-child(2){animation-delay:.06s}
    .cp-stagger.vis>*:nth-child(3){animation-delay:.09s}
    .cp-stagger.vis>*:nth-child(4){animation-delay:.12s}
    .cp-stagger.vis>*:nth-child(5){animation-delay:.15s}
    .cp-stagger.vis>*:nth-child(6){animation-delay:.18s}
    .cp-stagger.vis>*:nth-child(7){animation-delay:.21s}
    .cp-stagger.vis>*:nth-child(8){animation-delay:.24s}
    .cp-stagger.vis>*:nth-child(9){animation-delay:.27s}
    .cp-stagger.vis>*:nth-child(10){animation-delay:.3s}

    .cp-grad{
      background:linear-gradient(135deg,#14b8a6,#06b6d4,#2dd4bf,#14b8a6);
      background-size:300% 300%;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      animation:cp-gradShift 4s ease infinite;
    }
    .cp-shimmer-text{
      background:linear-gradient(90deg,#6b7280,#2dd4bf 30%,#14b8a6 50%,#2dd4bf 70%,#6b7280);
      background-size:400% 100%;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      animation:cp-shimmer 5s linear infinite;
    }

    .cp-glass{
      background:linear-gradient(145deg,rgba(10,26,34,.85),rgba(7,16,21,.92));
      backdrop-filter:blur(30px);
      border:1px solid rgba(30,58,66,.35);
      transition:all .5s cubic-bezier(.16,1,.3,1);
    }
    .cp-glass:hover{border-color:rgba(30,58,66,.55)}
    .cp-glass::before{
      content:'';position:absolute;inset:0;border-radius:inherit;
      background:linear-gradient(135deg,rgba(20,184,166,.03),transparent 50%,rgba(6,182,212,.02));
      opacity:0;transition:opacity .5s;pointer-events:none;
    }
    .cp-glass:hover::before{opacity:1}

    .cp-flow-border{position:relative}
    .cp-flow-border::after{
      content:'';position:absolute;inset:-1px;border-radius:inherit;padding:1px;
      background:linear-gradient(90deg,transparent,#14b8a6,transparent,#06b6d4,transparent);
      background-size:200% 100%;
      animation:cp-borderFlow 4s linear infinite;
      -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
      -webkit-mask-composite:xor;mask-composite:exclude;
      opacity:0;transition:opacity .5s;pointer-events:none;
    }
    .cp-flow-border:hover::after{opacity:1}

    .cp-shine{position:relative;overflow:hidden}
    .cp-shine::after{
      content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.02),transparent);
      animation:cp-shine 7s ease-in-out infinite;pointer-events:none;
    }

    .cp-card{transition:all .5s cubic-bezier(.16,1,.3,1)}
    .cp-card:hover{transform:translateY(-4px);box-shadow:0 16px 50px -12px rgba(20,184,166,.08)}

    .cp-dot-grid{
      background-image:radial-gradient(rgba(20,184,166,.04) 1px,transparent 1px);
      background-size:30px 30px;
    }

    .cp-particle{position:absolute;border-radius:50%;pointer-events:none}

    .cp-ripple-container{position:relative;overflow:hidden}
    .cp-ripple-circle{
      position:absolute;border-radius:50%;background:rgba(20,184,166,.2);
      transform:scale(0);animation:cp-ripple .6s ease-out;pointer-events:none;
    }

    .cp-bar{transform-origin:left;animation:cp-barGrow 1s cubic-bezier(.16,1,.3,1) both}

    .cp-video-btn{
      transition:all .3s cubic-bezier(.16,1,.3,1);
    }
    .cp-video-btn:hover{transform:translateX(4px)}
    .cp-video-btn.active{
      background:rgba(20,184,166,.08);
      border-color:rgba(20,184,166,.25);
    }

    .cp-play-pulse{
      animation:cp-breathe 2s ease-in-out infinite;
    }
    .cp-play-pulse:hover{
      animation:cp-playBounce .5s ease both;
    }

    .cp-lock-shake:hover{
      animation:cp-lockShake .4s ease;
    }

    .cp-check-pop{
      animation:cp-checkPop .5s cubic-bezier(.34,1.56,.64,1) both;
    }

    .cp-progress-glow{
      animation:cp-progressGlow 2s ease-in-out infinite;
    }

    .cp-module-header{
      transition:all .3s ease;
    }
    .cp-module-header:hover{
      background:rgba(20,184,166,.04);
    }

    .cp-wave{animation:cp-waveBar var(--dur) ease-in-out var(--delay) infinite}

    .cp-completion-ring circle:last-child{animation:cp-completionRing 1.5s cubic-bezier(.16,1,.3,1) both}

    .cp-skeleton{animation:cp-skeleton 1.5s ease-in-out infinite}

    .cp-sidebar-scroll::-webkit-scrollbar{width:3px}
    .cp-sidebar-scroll::-webkit-scrollbar-track{background:transparent}
    .cp-sidebar-scroll::-webkit-scrollbar-thumb{background:#1e3a42;border-radius:10px}
    .cp-sidebar-scroll::-webkit-scrollbar-thumb:hover{background:#14b8a6}

    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#1e3a42;border-radius:10px}
    ::-webkit-scrollbar-thumb:hover{background:#14b8a6}
  `}</style>
);

/* ─── Hooks ─── */
function useReveal(threshold = 0.1) {
  const [vis, setVis] = useState(false);
  const obsRef = useRef(null);
  const doneRef = useRef(false);
  const ref = useCallback((el) => {
    if (obsRef.current) { obsRef.current.disconnect(); obsRef.current = null; }
    if (!el || doneRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { doneRef.current = true; setVis(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el); obsRef.current = obs;
  }, [threshold]);
  useEffect(() => () => { if (obsRef.current) obsRef.current.disconnect(); }, []);
  return { ref, vis };
}

/* ─── Particles ─── */
function Particles() {
  const dots = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i, left: Math.random() * 100, size: Math.random() * 2.5 + 0.8,
      delay: Math.random() * 12, duration: Math.random() * 18 + 14, opacity: Math.random() * 0.15 + 0.05,
    })), []);
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {dots.map(p => (
        <div key={p.id} className="cp-particle" style={{
          left: `${p.left}%`, bottom: '-5px', width: p.size, height: p.size,
          background: p.id % 3 === 0 ? '#14b8a6' : p.id % 3 === 1 ? '#06b6d4' : '#2dd4bf',
          opacity: p.opacity, animation: `cp-particleFloat ${p.duration}s linear ${p.delay}s infinite`
        }} />
      ))}
    </div>
  );
}

/* ─── Ripple Button ─── */
function RippleBtn({ children, onClick, disabled, className, ...props }) {
  const ref = useRef(null);
  const handleClick = (e) => {
    if (disabled) return;
    const btn = ref.current, rect = btn.getBoundingClientRect();
    const c = document.createElement('span');
    const d = Math.max(rect.width, rect.height);
    c.style.cssText = `position:absolute;border-radius:50%;background:rgba(20,184,166,.2);width:${d}px;height:${d}px;left:${e.clientX-rect.left-d/2}px;top:${e.clientY-rect.top-d/2}px;transform:scale(0);animation:cp-ripple .6s ease-out;pointer-events:none`;
    btn.appendChild(c);
    setTimeout(() => c.remove(), 600);
    onClick?.(e);
  };
  return <button ref={ref} onClick={handleClick} disabled={disabled} className={`cp-ripple-container ${className}`} {...props}>{children}</button>;
}

/* ─── Completion Ring ─── */
function CompletionRing({ pct, size = 56, sw = 3.5 }) {
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 100 ? '#10b981' : pct >= 50 ? '#14b8a6' : '#f59e0b';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-2 rounded-full blur-md opacity-20" style={{ background: color }} />
      <svg className="w-full h-full -rotate-90 cp-completion-ring" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#0d2630" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}50)` }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-black text-white tabular-nums">{Math.round(pct)}%</span>
      </div>
    </div>
  );
}

/* ─── Sound Wave ─── */
function SoundWave({ active, className = '' }) {
  return (
    <div className={`flex items-end gap-[2px] h-4 ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className={`w-[2px] rounded-full transition-all duration-300
          ${active ? 'bg-[#14b8a6]' : 'bg-[#1e3a42]'}`}
          style={{
            height: active ? undefined : '3px',
            animation: active ? `cp-waveBar ${0.7 + i * 0.12}s ease-in-out ${i * 0.08}s infinite` : 'none',
            '--dur': `${0.7 + i * 0.12}s`, '--delay': `${i * 0.08}s`
          }} />
      ))}
    </div>
  );
}

/* ─── Success Celebration ─── */
function SuccessAnimation({ show }) {
  const confetti = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i, left: 35 + Math.random() * 30, delay: Math.random() * 0.4,
      color: ['#14b8a6', '#06b6d4', '#2dd4bf', '#10b981', '#f59e0b', '#a855f7'][i % 6],
      size: 3 + Math.random() * 4,
    })), []);

  if (!show) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      <div className="absolute w-20 h-20 rounded-full border-2 border-emerald-400"
        style={{ animation: 'cp-successBurst .8s ease-out both' }} />
      <div className="absolute w-20 h-20 rounded-full border-2 border-[#14b8a6]"
        style={{ animation: 'cp-successBurst .8s ease-out .15s both' }} />
      {confetti.map(c => (
        <div key={c.id} className="absolute" style={{
          left: `${c.left}%`, top: '50%', width: c.size, height: c.size,
          background: c.color, borderRadius: c.id % 2 === 0 ? '50%' : '2px',
          animation: `cp-confetti 1.2s cubic-bezier(.16,1,.3,1) ${c.delay}s both`,
        }} />
      ))}
    </div>
  );
}

/* ─── Skeleton Loader ─── */
function SkeletonLoader() {
  return (
    <div className="min-h-screen pt-24" style={{ background: 'linear-gradient(180deg,#050D11,#0A1A22,#071218)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8">
        <div className="h-6 w-40 bg-[#1e3a42]/30 rounded-lg cp-skeleton mb-6" />
        <div className="h-10 w-3/4 bg-[#1e3a42]/30 rounded-xl cp-skeleton mb-3" />
        <div className="h-5 w-1/3 bg-[#1e3a42]/20 rounded-lg cp-skeleton mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-[#1e3a42]/20 rounded-2xl cp-skeleton mb-6" />
            <div className="space-y-3">
              <div className="h-6 w-2/3 bg-[#1e3a42]/20 rounded-lg cp-skeleton" />
              <div className="h-4 w-full bg-[#1e3a42]/15 rounded-lg cp-skeleton" style={{ animationDelay: '.1s' }} />
              <div className="h-4 w-1/2 bg-[#1e3a42]/15 rounded-lg cp-skeleton" style={{ animationDelay: '.2s' }} />
            </div>
          </div>
          <div>
            <div className="h-80 bg-[#1e3a42]/20 rounded-2xl cp-skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COURSE PLAYER
   ═══════════════════════════════════════ */
const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [expandedModules, setExpandedModules] = useState(new Set([1]));
  const [showCelebration, setShowCelebration] = useState(false);
  const [justCompleted, setJustCompleted] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const isMountedRef = useRef(true);
  const r1 = useReveal();
  const r2 = useReveal();

  const goToResources = useCallback(() => {
    window.location.assign('/resources');
  }, []);
  const videoSources = useMemo(
    () => getPlayableSources(currentVideo?.url, currentVideo?.id || 0),
    [currentVideo?.url, currentVideo?.id]
  );

  // Reset mounted flag on component mount and cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!user || !courseId) return;
    setIsWatching(false);
    setIsPlaying(false);
    setVideoCurrentTime(0);
    setVideoDuration(0);
    fetchCourseVideos();
    fetchProgress();
  }, [courseId, user]);

  // Cleanup transient UI state and fullscreen on unmount.
  useEffect(() => {
    return () => {
      const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsElement) {
        document.exitFullscreen?.();
        document.webkitExitFullscreen?.();
      }
    };
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (el) {
      el.playbackRate = playbackRate;
    }
  }, [playbackRate, currentVideo?.id]);

  useEffect(() => {
    setShowSpeedMenu(false);
    setVideoError(false);
  }, [currentVideo?.id]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoSources.length) return;
    el.load();
  }, [videoSources]);

  const formatDuration = (d) => {
    if (!d) return 'N/A';
    if (typeof d === 'string' && d.includes('min')) return d;
    if (typeof d === 'number') return `${d} min`;
    return String(d);
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
    const total = Math.floor(seconds);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startPlayback = async () => {
    const el = videoRef.current;
    if (!el) return;
    setIsWatching(true);
    try {
      await el.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Video play failed:', err);
    }
  };

  const togglePlayPause = async () => {
    const el = videoRef.current;
    if (!el) return;

    if (el.paused) {
      try {
        await el.play();
        setIsWatching(true);
        setIsPlaying(true);
      } catch (err) {
        console.error('Video resume failed:', err);
      }
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const onSeek = (e) => {
    const el = videoRef.current;
    if (!el) return;
    const next = Number(e.target.value);
    el.currentTime = next;
    setVideoCurrentTime(next);
  };

  const setSpeed = (rate) => {
    const el = videoRef.current;
    setPlaybackRate(rate);
    if (el) el.playbackRate = rate;
    setShowSpeedMenu(false);
  };

  const retryPlayback = async () => {
    const el = videoRef.current;
    if (!el) return;
    setVideoError(false);
    el.load();
    try {
      await el.play();
      setIsWatching(true);
      setIsPlaying(true);
    } catch (err) {
      console.error('Video retry failed:', err);
    }
  };

  const getGroupedModules = useCallback(() => {
    const modules = {};
    videos.forEach(v => {
      const n = v.module_number || 1;
      if (!modules[n]) modules[n] = [];
      modules[n].push(v);
    });
    return modules;
  }, [videos]);

  const canAccessVideo = useCallback((videoId) => {
    const idx = videos.findIndex(v => v.id === videoId);
    if (idx <= 0) return true;
    return videos.slice(0, idx).every(v => completedVideos.has(v.id));
  }, [videos, completedVideos]);

  const canAccessModule = useCallback((moduleNumber) => {
    const firstVideoInModule = videos.find(v => (v.module_number || 1) === moduleNumber);
    if (!firstVideoInModule) return false;
    return canAccessVideo(firstVideoInModule.id);
  }, [videos, canAccessVideo]);

  const toggleModule = (num, accessible) => {
    if (!accessible) return;
    setExpandedModules(prev => {
      const next = new Set(prev);
      next.has(num) ? next.delete(num) : next.add(num);
      return next;
    });
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!isFullscreen) {
      videoContainerRef.current.requestFullscreen?.() || videoContainerRef.current.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const fetchCourseVideos = async () => {
    try {
      setLoading(true); 
      setError(null);
      const response = await api.get(`/course-videos/${courseId}`);
      if (!isMountedRef.current) return;
      
      setCourse(response.data.course);
      setVideos(response.data.videos);
      const completed = new Set(response.data.videos.filter(v => v.completed).map(v => v.id));
      setCompletedVideos(completed);
      const firstIncomplete = response.data.videos.find(v => !v.completed);
      setCurrentVideo(firstIncomplete || response.data.videos[0]);
      setIsPlaying(false);
      setVideoCurrentTime(0);
      setVideoDuration(0);
      // Auto-expand current module
      const currentModNum = (firstIncomplete || response.data.videos[0])?.module_number || 1;
      setExpandedModules(new Set([currentModNum]));
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error(err);
      setError('Failed to load course videos.');
    } finally { 
      if (isMountedRef.current) setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try { 
      const r = await api.get(`/course-progress/${courseId}`);
      if (isMountedRef.current) setProgress(r.data);
    }
    catch (err) { 
      if (isMountedRef.current) console.error(err);
    }
  };

  const markVideoComplete = async () => {
    if (!currentVideo || isMarking) return;
    try {
      setIsMarking(true);
      await api.post(`/mark-video-complete/${currentVideo.id}`);
      if (!isMountedRef.current) return;
      
      const newCompleted = new Set(completedVideos);
      newCompleted.add(currentVideo.id);
      setCompletedVideos(newCompleted);
      setJustCompleted(currentVideo.id);
      setShowCelebration(true);
      setTimeout(() => { 
        if (isMountedRef.current) {
          setShowCelebration(false); 
          setJustCompleted(null);
        }
      }, 2000);

      const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
      if (currentIndex < videos.length - 1) {
        setTimeout(() => {
          if (isMountedRef.current) {
            setCurrentVideo(videos[currentIndex + 1]);
            setIsWatching(false);
            const nextMod = videos[currentIndex + 1]?.module_number || 1;
            setExpandedModules(prev => new Set([...prev, nextMod]));
          }
        }, 1200);
      }
      await fetchProgress();
    } catch (err) { 
      if (isMountedRef.current) {
        console.error(err); 
        setError('Failed to mark video as completed.');
      }
    }
    finally { 
      if (isMountedRef.current) setIsMarking(false);
    }
  };

  // Computed
  const currentIndex = currentVideo ? videos.findIndex(v => v.id === currentVideo.id) : 0;
  const isCurrentVideoCompleted = currentVideo ? completedVideos.has(currentVideo.id) : false;
  const totalCompleted = completedVideos.size;
  const totalVideos = videos.length;
  const progressPct = totalVideos > 0 ? (totalCompleted / totalVideos) * 100 : 0;
  const isCourseDone = progress && progress.completed_videos === progress.total_videos;

  if (loading) return (<><InjectStyles /><SkeletonLoader /></>);

  if (error) {
    return (
      <>
        <InjectStyles />
        <div className="min-h-screen pt-24 px-6 flex items-center justify-center"
          style={{ background: 'linear-gradient(180deg,#050D11,#0A1A22,#071218)' }}>
          <div className="cp-glass rounded-3xl p-10 max-w-md text-center" style={{ animation: 'cp-scaleIn .5s ease both' }}>
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={28} className="text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <RippleBtn onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] rounded-xl text-white font-bold cursor-pointer transition-all hover:shadow-lg hover:shadow-[#14b8a6]/20">
              <ChevronLeft size={16} className="inline mr-1" /> Go Back
            </RippleBtn>
          </div>
        </div>
      </>
    );
  }

  if (!course || !currentVideo) {
    return (
      <>
        <InjectStyles />
        <div className="min-h-screen pt-24 flex items-center justify-center"
          style={{ background: 'linear-gradient(180deg,#050D11,#0A1A22,#071218)' }}>
          <div className="cp-glass rounded-3xl p-10 text-center" style={{ animation: 'cp-scaleIn .5s ease both' }}>
            <BookOpen size={36} className="mx-auto text-gray-600 mb-4" style={{ animation: 'cp-float 3s ease-in-out infinite' }} />
            <p className="text-gray-400 text-lg font-semibold">No videos available</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <InjectStyles />
      <div className="min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#050D11 0%,#0A1A22 35%,#071218 100%)' }}>

        <Particles />

        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute opacity-[0.02]" style={{ width: 450, height: 450, top: '-10%', right: '-5%', background: 'radial-gradient(circle,#14b8a6,transparent 70%)', animation: 'cp-morphBlob1 22s ease-in-out infinite' }} />
          <div className="absolute opacity-[0.015]" style={{ width: 400, height: 400, bottom: '5%', left: '-5%', background: 'radial-gradient(circle,#06b6d4,transparent 70%)', animation: 'cp-morphBlob2 28s ease-in-out infinite' }} />
          <div className="cp-dot-grid absolute inset-0 opacity-30" />
        </div>

        <div className="relative z-10 pt-20">
          {/* ═══ HEADER ═══ */}
          <div className="sticky top-16 z-40 border-b border-[#1e3a42]/40"
            style={{ background: 'linear-gradient(180deg,rgba(5,13,17,.97),rgba(10,26,34,.92))', backdropFilter: 'blur(20px)' }}>
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Left: back + course info */}
                <div className="flex items-center gap-4 min-w-0">
                  <button onClick={goToResources}
                    aria-label="Go to resources"
                    className="shrink-0 w-9 h-9 rounded-xl bg-[#0F3A42]/40 border border-[#1e3a42]/40
                      flex items-center justify-center text-gray-400 hover:text-[#14b8a6] hover:border-[#14b8a6]/25
                      transition-all duration-300 cursor-pointer hover:scale-105">
                    <ChevronLeft size={18} />
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#14b8a6]/[0.06] border border-[#14b8a6]/12">
                        <GraduationCap size={9} className="text-[#14b8a6]" />
                        <span className="text-[8px] text-[#14b8a6] font-bold uppercase tracking-[0.15em]">Course</span>
                      </div>
                      <SoundWave active={isPlaying} />
                    </div>
                    <h1 className="text-base sm:text-lg font-bold text-white truncate">{course.name}</h1>
                  </div>
                </div>

                {/* Center: progress */}
                <div className="hidden md:flex items-center gap-4">
                  <CompletionRing pct={progressPct} size={48} sw={3} />
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Video {currentIndex + 1} of {totalVideos}</div>
                    <div className="text-sm font-bold text-white">{totalCompleted} completed</div>
                  </div>
                </div>

                {/* Right: progress bar */}
                <div className="hidden sm:flex flex-col items-end gap-1 min-w-[140px]">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-medium">Progress</span>
                    <span className="font-bold text-[#14b8a6] tabular-nums">{Math.round(progressPct)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0d2630] rounded-full overflow-hidden cp-progress-glow">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] transition-all duration-700"
                      style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ MAIN CONTENT ═══ */}
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-10 py-6">
            <div className="flex gap-5">
              {/* ── VIDEO PLAYER AREA ── */}
              <div className={`flex-1 min-w-0 transition-all duration-500 ${sidebarCollapsed ? 'max-w-full' : ''}`}>
                {/* Video Container */}
                <div ref={r1.ref} className={`cp-reveal ${r1.vis ? 'vis' : ''}`}>
                  <div className="cp-glass cp-flow-border rounded-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6]/30 to-transparent z-10" />

                    {/* Video */}
                    <div className="relative bg-black aspect-video group" ref={videoContainerRef}>
                      <video
                        key={currentVideo.id}
                        ref={videoRef}
                        className="w-full h-full object-cover transition-all duration-500"
                        preload="metadata"
                        playsInline
                        controls={false}
                        onLoadedMetadata={(e) => {
                          const d = e.currentTarget.duration;
                          setVideoDuration(Number.isFinite(d) ? d : 0);
                          e.currentTarget.playbackRate = playbackRate;
                        }}
                        onTimeUpdate={(e) => setVideoCurrentTime(e.currentTarget.currentTime || 0)}
                        onPlay={() => { setIsPlaying(true); setIsWatching(true); }}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                        onError={() => {
                          setVideoError(true);
                          setIsPlaying(false);
                        }}
                      >
                        {videoSources.map((source) => (
                          <source key={source.src} src={source.src} type={source.type} />
                        ))}
                      </video>

                      {videoError && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 p-6">
                          <div className="text-center max-w-md">
                            <p className="text-red-300 font-semibold mb-2">Video failed to load</p>
                            <p className="text-gray-400 text-xs mb-4">The original source appears to be a non-video media link. A fallback video source is available.</p>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={retryPlayback}
                                className="px-3 py-2 rounded-lg bg-[#14b8a6]/20 border border-[#14b8a6]/30 text-[#14b8a6] text-xs font-bold cursor-pointer hover:bg-[#14b8a6]/30 transition-all"
                              >
                                Retry
                              </button>
                              <button
                                onClick={() => window.open(currentVideo?.url, '_blank', 'noopener,noreferrer')}
                                className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-bold cursor-pointer hover:bg-white/20 transition-all"
                              >
                                Open Original Link
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Play overlay */}
                      {!isWatching && (
                        <button onClick={startPlayback}
                          className="absolute inset-0 flex items-center justify-center bg-black/60 hover:bg-black/50 transition-all duration-500 group/play cursor-pointer z-10">
                          <div className="flex flex-col items-center gap-5">
                            <div className="relative">
                              <div className="absolute inset-[-16px] rounded-full border border-dashed border-[#14b8a6]/15"
                                style={{ animation: 'cp-rotate 12s linear infinite' }}>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#14b8a6] shadow-lg shadow-[#14b8a6]/50" />
                              </div>
                              <div className="absolute inset-[-30px] rounded-full border border-dotted border-[#06b6d4]/10"
                                style={{ animation: 'cp-rotateR 20s linear infinite' }} />
                              <div className="cp-play-pulse w-20 h-20 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#06b6d4]
                                flex items-center justify-center shadow-2xl shadow-[#14b8a6]/30 relative z-10">
                                <Play className="text-white ml-1" size={28} fill="white" />
                              </div>
                              {[0, 1].map(i => (
                                <div key={i} className="absolute inset-0 rounded-full border-2 border-[#14b8a6]/20"
                                  style={{ animation: `cp-pulseExpand 2.5s ease-out ${i * 1.2}s infinite` }} />
                              ))}
                            </div>

                            <div className="text-center">
                              <p className="text-white font-bold text-base mb-1">Watch Video</p>
                              <p className="text-gray-400 text-xs">{currentVideo.title}</p>
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Bottom gradient controls */}
                      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300 ${isWatching ? 'opacity-100' : 'opacity-0'} z-10`}>
                        {/* Mini progress */}
                        <div className="mb-3">
                          <input
                            type="range"
                            min="0"
                            max={videoDuration || 0}
                            step="0.1"
                            value={videoCurrentTime}
                            onChange={onSeek}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button onClick={togglePlayPause}
                              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer">
                              {isPlaying ? <Pause size={14} /> : <Play size={14} fill="white" />}
                            </button>
                            <div className="flex items-center gap-1.5 text-xs text-white/70">
                              <Clock size={11} className="text-[#14b8a6]" />
                              <span className="font-medium">{formatTime(videoCurrentTime)} / {formatTime(videoDuration)}</span>
                            </div>
                            <SoundWave active={isPlaying} className="ml-1" />
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <button
                                onClick={() => setShowSpeedMenu((prev) => !prev)}
                                className="w-auto min-w-12 px-2 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer text-[11px] font-semibold gap-1"
                                title="Playback speed"
                              >
                                <Settings size={11} /> {playbackRate}x
                              </button>
                              {showSpeedMenu && (
                                <div className="absolute right-0 bottom-10 z-20 w-24 rounded-lg bg-[#071015]/95 border border-[#1e3a42]/60 shadow-xl overflow-hidden">
                                  {SPEED_OPTIONS.map((rate) => (
                                    <button
                                      key={rate}
                                      onClick={() => setSpeed(rate)}
                                      className={`w-full px-3 py-2 text-xs text-left transition-colors cursor-pointer ${playbackRate === rate ? 'bg-[#14b8a6]/20 text-[#14b8a6] font-bold' : 'text-gray-300 hover:bg-white/10'}`}
                                    >
                                      {rate}x
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {currentIndex < videos.length - 1 && (
                              <button onClick={() => { setCurrentVideo(videos[currentIndex + 1]); setIsWatching(false); }}
                                disabled={!isCurrentVideoCompleted}
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                                <SkipForward size={14} />
                              </button>
                            )}
                            <button onClick={toggleFullscreen}
                              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                              {isFullscreen ? <Minimize2 size={14} /> : <Maximize size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Celebration overlay */}
                      <SuccessAnimation show={showCelebration} />
                    </div>

                    {/* Video Info Panel */}
                    <div className="p-6 relative">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                        <div className="min-w-0 flex-1">
                          <h2 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">{currentVideo.title}</h2>
                          <p className="text-sm text-gray-500 leading-relaxed">{currentVideo.description}</p>
                        </div>

                        {/* Status badge */}
                        <div className="shrink-0">
                          {isCurrentVideoCompleted ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                              style={{ animation: justCompleted === currentVideo?.id ? 'cp-checkPop .5s ease both' : 'none' }}>
                              <CheckCircle size={15} className="text-emerald-400" />
                              <span className="text-emerald-400 text-sm font-bold">Completed</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                              <div className="w-2 h-2 rounded-full bg-amber-400" style={{ animation: 'cp-statusDot 2s ease infinite' }} />
                              <span className="text-amber-400 text-sm font-bold">In Progress</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {[
                          { icon: Clock, label: formatTime(videoDuration), color: '#14b8a6' },
                          { icon: Layers, label: `Module ${currentVideo.module_number || 1}`, color: '#06b6d4' },
                          { icon: CircleDot, label: `Video ${currentIndex + 1}/${totalVideos}`, color: '#2dd4bf' },
                        ].map((m, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#071015]/40 border border-[#1e3a42]/25 text-xs"
                            style={{ color: m.color }}>
                            <m.icon size={11} /> <span className="text-gray-400">{m.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Mark Complete Button */}
                      <RippleBtn onClick={markVideoComplete}
                        disabled={isCurrentVideoCompleted || isMarking}
                        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer
                          flex items-center justify-center gap-2
                          ${isCurrentVideoCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                            : isMarking
                              ? 'bg-gray-600 text-white cursor-wait'
                              : 'bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-white hover:shadow-xl hover:shadow-[#14b8a6]/20 hover:scale-[1.01] active:scale-[0.99]'
                          }`}>
                        {isMarking ? (
                          <><Loader2 size={16} className="animate-spin" /> Marking...</>
                        ) : isCurrentVideoCompleted ? (
                          <><CheckCircle size={16} /> Completed</>
                        ) : (
                          <><CheckCircle size={16} /> Mark as Complete</>
                        )}
                      </RippleBtn>

                      <CourseCertificatePanel
                        isVisible={Boolean(isCourseDone)}
                        userName={user?.name}
                        courseName={course?.name}
                        completedAt={progress?.completed_at}
                      />
                    </div>
                  </div>

                  {/* Next Video Preview */}
                  {currentIndex < videos.length - 1 && (
                    <div className="mt-5 cp-glass cp-flow-border cp-shine rounded-2xl p-5 relative overflow-hidden group"
                      style={{ animation: 'cp-fadeUp .6s ease .2s both' }}>
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#06b6d4]/25 to-transparent" />
                      <div className="flex items-center gap-2 mb-3">
                        <SkipForward size={13} className="text-[#06b6d4]" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Up Next</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`w-20 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all
                          ${isCurrentVideoCompleted
                            ? 'bg-[#14b8a6]/10 border-[#14b8a6]/20 group-hover:scale-105'
                            : 'bg-[#1e3a42]/30 border-[#1e3a42]/30'}`}>
                          {isCurrentVideoCompleted ? (
                            <Play size={16} className="text-[#14b8a6] ml-0.5" fill="#14b8a6" />
                          ) : (
                            <Lock size={14} className="text-gray-600 cp-lock-shake" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate mb-0.5">{videos[currentIndex + 1].title}</p>
                          <p className="text-[11px] text-gray-600">
                            {isCurrentVideoCompleted ? 'Ready to watch' : 'Complete current video first'}
                          </p>
                        </div>
                        <RippleBtn
                          onClick={() => { setCurrentVideo(videos[currentIndex + 1]); setIsWatching(false); }}
                          disabled={!isCurrentVideoCompleted}
                          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all
                            ${isCurrentVideoCompleted
                              ? 'bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/20 hover:bg-[#14b8a6]/20'
                              : 'bg-[#1e3a42]/20 text-gray-600 border border-[#1e3a42]/20 cursor-not-allowed'
                            }`}>
                          {isCurrentVideoCompleted ? 'Watch' : 'Locked'}
                        </RippleBtn>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── SIDEBAR ── */}
              <div className={`transition-all duration-500 ${sidebarCollapsed ? 'w-12' : 'w-[340px] lg:w-[380px]'} shrink-0 hidden lg:block`}>
                {/* Collapse toggle */}
                <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="w-full flex items-center justify-center py-2 mb-3 rounded-xl bg-[#071015]/40
                    border border-[#1e3a42]/20 text-gray-500 hover:text-[#14b8a6] hover:border-[#14b8a6]/20
                    transition-all cursor-pointer text-xs font-semibold gap-1.5">
                  {sidebarCollapsed ? <ChevronLeft size={14} /> : <><ChevronRight size={14} /> Collapse</>}
                </button>

                {!sidebarCollapsed && (
                  <div ref={r2.ref} className={`cp-reveal ${r2.vis ? 'vis' : ''}`}>
                    <div className="cp-glass cp-flow-border cp-shine rounded-2xl relative overflow-hidden sticky top-36">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6]/30 to-transparent" />

                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-center gap-2.5 mb-5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/15">
                            <BookOpen size={14} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">Course Outline</h3>
                            <p className="text-[10px] text-gray-600">{totalCompleted}/{totalVideos} videos</p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        {progress && (
                          <div className="mb-5 pb-5 border-b border-[#1e3a42]/25">
                            <div className="flex justify-between text-[10px] mb-2">
                              <span className="text-gray-500 font-semibold uppercase tracking-wider">Progress</span>
                              <span className="font-bold text-[#14b8a6] tabular-nums">{Math.round(progressPct)}%</span>
                            </div>
                            <div className="w-full h-2 bg-[#0d2630] rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] transition-all duration-700 cp-bar"
                                style={{ width: `${progressPct}%` }} />
                            </div>
                          </div>
                        )}

                        {/* Module list */}
                        <div className="cp-sidebar-scroll space-y-2 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
                          {Object.entries(getGroupedModules()).map(([moduleNum, moduleVideos]) => {
                            const num = parseInt(moduleNum);
                            const accessible = canAccessModule(num);
                            const allDone = moduleVideos.every(v => completedVideos.has(v.id));
                            const isExpanded = expandedModules.has(num);
                            const completedInMod = moduleVideos.filter(v => completedVideos.has(v.id)).length;

                            return (
                              <div key={moduleNum} style={{ animation: `cp-moduleSlide .4s ease ${num * 0.05}s both` }}>
                                {/* Module header */}
                                <button onClick={() => toggleModule(num, accessible)}
                                  className={`cp-module-header w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer border
                                    ${accessible
                                      ? allDone
                                        ? 'bg-emerald-500/[0.04] border-emerald-500/10'
                                        : 'bg-[#071015]/30 border-[#1e3a42]/15'
                                      : 'bg-red-500/[0.02] border-red-500/5 opacity-60'
                                    }`}>
                                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: allDone ? '#10b98112' : accessible ? '#14b8a612' : '#ef444412' }}>
                                    {allDone ? <CheckCircle size={12} className="text-emerald-400" />
                                      : accessible ? <Play size={11} className="text-[#14b8a6]" fill="#14b8a6" />
                                        : <Lock size={11} className="text-gray-600" />}
                                  </div>
                                  <div className="flex-1 text-left min-w-0">
                                    <span className={`text-xs font-bold block truncate ${accessible ? 'text-white' : 'text-gray-600'}`}>
                                      Module {num}
                                    </span>
                                    <span className="text-[9px] text-gray-600">{completedInMod}/{moduleVideos.length}</span>
                                  </div>
                                  <ChevronDown size={13} className={`text-gray-600 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Videos */}
                                <div className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(.16,1,.3,1)]
                                  ${isExpanded ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                  <div className={`space-y-0.5 ml-2 pl-3 border-l border-[#1e3a42]/20 cp-stagger ${isExpanded ? 'vis' : ''}`}>
                                    {moduleVideos.map((video, idx) => {
                                      const completed = completedVideos.has(video.id);
                                      const isCurrent = currentVideo?.id === video.id;
                                      const canAccess = canAccessVideo(video.id);

                                      return (
                                        <button key={video.id}
                                          onClick={() => { if (canAccess) { setCurrentVideo(video); setIsWatching(false); } }}
                                          disabled={!canAccess}
                                          className={`cp-video-btn w-full text-left px-3 py-2.5 rounded-xl border transition-all
                                            ${isCurrent
                                              ? 'active bg-[#14b8a6]/[0.06] border-[#14b8a6]/20'
                                              : canAccess
                                                ? 'border-transparent hover:bg-white/[0.02] hover:border-[#1e3a42]/20 cursor-pointer'
                                                : 'cursor-not-allowed opacity-40 border-transparent'
                                            }`}>
                                          <div className="flex items-center gap-2.5">
                                            <div className="shrink-0">
                                              {completed ? (
                                                <div className={`w-5 h-5 rounded-md bg-emerald-500/15 flex items-center justify-center
                                                  ${justCompleted === video.id ? 'cp-check-pop' : ''}`}>
                                                  <CheckCircle size={11} className="text-emerald-400" />
                                                </div>
                                              ) : isCurrent && canAccess ? (
                                                <div className="w-5 h-5 rounded-md bg-[#14b8a6]/15 flex items-center justify-center">
                                                  <Play size={10} className="text-[#14b8a6] ml-0.5" fill="#14b8a6" />
                                                </div>
                                              ) : canAccess ? (
                                                <div className="w-5 h-5 rounded-full border border-[#1e3a42]/40" />
                                              ) : (
                                                <div className="w-5 h-5 rounded-md bg-[#1e3a42]/20 flex items-center justify-center">
                                                  <Lock size={9} className="text-gray-600" />
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className={`text-[11px] font-semibold truncate ${isCurrent ? 'text-white' : canAccess ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {idx + 1}. {video.title}
                                              </p>
                                              <p className="text-[9px] text-gray-600 mt-0.5">{formatDuration(video.duration)}</p>
                                            </div>
                                            {isCurrent && (
                                              <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] shrink-0"
                                                style={{ animation: 'cp-pulse 2s ease infinite' }} />
                                            )}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Course Complete */}
                        {isCourseDone && (
                          <div className="mt-5 p-4 bg-emerald-500/[0.06] rounded-xl border border-emerald-500/15 relative overflow-hidden"
                            style={{ animation: 'cp-scaleIn .5s ease both' }}>
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center"
                                style={{ animation: 'cp-float 3s ease-in-out infinite' }}>
                                <Trophy size={16} className="text-emerald-400" />
                              </div>
                              <div>
                                <p className="font-bold text-emerald-400 text-sm">Course Complete! 🎉</p>
                                <p className="text-[10px] text-gray-500">All videos finished</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile sidebar toggle */}
            <div className="lg:hidden mt-6">
              <div className="cp-glass cp-flow-border rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6]/30 to-transparent" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-[#14b8a6]" />
                    <h3 className="text-sm font-bold text-white">Course Outline</h3>
                  </div>
                  {progress && (
                    <span className="text-xs font-bold text-[#14b8a6] tabular-nums">{Math.round(progressPct)}%</span>
                  )}
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto cp-sidebar-scroll">
                  {Object.entries(getGroupedModules()).map(([moduleNum, moduleVideos]) => {
                    const num = parseInt(moduleNum);
                    const accessible = canAccessModule(num);
                    const isExpanded = expandedModules.has(num);

                    return (
                      <div key={moduleNum}>
                        <button onClick={() => toggleModule(num, accessible)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#071015]/30 border border-[#1e3a42]/15 cursor-pointer">
                          {accessible ? <Play size={10} className="text-[#14b8a6]" /> : <Lock size={10} className="text-gray-600" />}
                          <span className="text-xs font-bold text-white flex-1 text-left">Module {num}</span>
                          <ChevronDown size={12} className={`text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="ml-4 mt-1 space-y-1">
                            {moduleVideos.map((video, idx) => {
                              const completed = completedVideos.has(video.id);
                              const isCurrent = currentVideo?.id === video.id;
                              const canAccess = canAccessVideo(video.id);
                              return (
                                <button key={video.id}
                                  onClick={() => { if (canAccess) { setCurrentVideo(video); setIsWatching(false); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
                                  disabled={!canAccess}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-[11px] flex items-center gap-2 transition-all
                                    ${isCurrent ? 'bg-[#14b8a6]/[0.06] text-white font-bold' : 'text-gray-400 hover:bg-white/[0.02]'}
                                    ${!canAccess ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                                  {completed ? <CheckCircle size={10} className="text-emerald-400 shrink-0" />
                                    : isCurrent && canAccess ? <Play size={9} className="text-[#14b8a6] shrink-0" fill="#14b8a6" />
                                      : canAccess ? <div className="w-2.5 h-2.5 rounded-full border border-gray-600 shrink-0" />
                                        : <Lock size={9} className="text-gray-600 shrink-0" />}
                                  <span className="truncate">{idx+1}. {video.title}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePlayer;