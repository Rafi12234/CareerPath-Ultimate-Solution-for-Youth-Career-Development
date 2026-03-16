import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Search, BookOpen, Users, CheckCircle, Clock, Star, X, ChevronRight,
  Award, Layers, GraduationCap, Sparkles, Zap, Target, Filter,
  Grid3X3, LayoutList, Heart, Share2, Play, ArrowRight, Flame,
  TrendingUp, Shield, Code2, ChevronDown, Eye, Bookmark, BookmarkCheck,
  BarChart3, Crown, CircleDot, Loader2, ExternalLink, Trophy
} from 'lucide-react';
import api from '../utils/api';

const courseImages = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
];

const topicMeta = {
  'AI': { color: '#a855f7', icon: Sparkles, gradient: 'from-purple-500/20 to-violet-500/10' },
  'Web': { color: '#3b82f6', icon: Code2, gradient: 'from-blue-500/20 to-cyan-500/10' },
  'Data': { color: '#10b981', icon: BarChart3, gradient: 'from-emerald-500/20 to-teal-500/10' },
  'Mobile': { color: '#ec4899', icon: Layers, gradient: 'from-pink-500/20 to-rose-500/10' },
  'Cloud': { color: '#06b6d4', icon: Shield, gradient: 'from-cyan-500/20 to-blue-500/10' },
  'Security': { color: '#f59e0b', icon: Shield, gradient: 'from-amber-500/20 to-yellow-500/10' },
  'default': { color: '#14b8a6', icon: BookOpen, gradient: 'from-teal-500/20 to-cyan-500/10' },
};

function getTopicMeta(topic) {
  const key = Object.keys(topicMeta).find(k => (topic || '').toLowerCase().includes(k.toLowerCase()));
  return topicMeta[key] || topicMeta['default'];
}

const InjectStyles = () => (
  <style>{`
    @keyframes morphBlob1{
      0%,100%{border-radius:42% 58% 70% 30%/45% 45% 55% 55%;transform:rotate(0) scale(1)}
      25%{border-radius:70% 30% 50% 50%/30% 60% 40% 70%;transform:rotate(90deg) scale(1.06)}
      50%{border-radius:30% 70% 40% 60%/55% 30% 70% 45%;transform:rotate(180deg) scale(.94)}
      75%{border-radius:55% 45% 60% 40%/40% 70% 30% 60%;transform:rotate(270deg) scale(1.03)}
    }
    @keyframes morphBlob2{
      0%,100%{border-radius:58% 42% 30% 70%/55% 45% 55% 45%;transform:rotate(0)}
      33%{border-radius:40% 60% 60% 40%/60% 30% 70% 40%;transform:rotate(120deg)}
      66%{border-radius:60% 40% 45% 55%/35% 65% 35% 65%;transform:rotate(240deg)}
    }
    @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes float1{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-18px) rotate(2deg)}}
    @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes float3{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-7px) rotate(-1.5deg)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(.82)}to{opacity:1;transform:scale(1)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes cardReveal{
      from{opacity:0;transform:translateY(40px) scale(.95)}
      to{opacity:1;transform:translateY(0) scale(1)}
    }
    @keyframes slideRight{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
    @keyframes barGrow{from{width:0}}
    @keyframes particleFloat{
      0%{transform:translateY(0) translateX(0) scale(1);opacity:.4}
      50%{opacity:.7}
      100%{transform:translateY(-100vh) translateX(30px) scale(0);opacity:0}
    }
    @keyframes ripple{to{transform:scale(3);opacity:0}}
    @keyframes cardShine{0%{left:-100%}50%,100%{left:150%}}
    @keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(20,184,166,.3)}50%{box-shadow:0 0 20px 5px rgba(20,184,166,.1)}}
    @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @keyframes modalReveal{
      from{opacity:0;transform:translateY(60px) scale(.93)}
      to{opacity:1;transform:translateY(0) scale(1)}
    }
    @keyframes modalBg{from{opacity:0;backdrop-filter:blur(0)}to{opacity:1;backdrop-filter:blur(12px)}}
    @keyframes shimmer{
      0%{background-position:-200% 0}
      100%{background-position:200% 0}
    }
    @keyframes enrollSuccess{
      0%{transform:scale(1)}
      25%{transform:scale(1.15)}
      50%{transform:scale(.95)}
      100%{transform:scale(1)}
    }
    @keyframes confettiBurst{
      0%{transform:translateY(0) rotate(0);opacity:1}
      100%{transform:translateY(-60px) rotate(540deg);opacity:0}
    }
    @keyframes imageZoom{from{transform:scale(1.15)}to{transform:scale(1)}}
    @keyframes badgePop{
      0%{transform:scale(0);opacity:0}
      60%{transform:scale(1.2)}
      100%{transform:scale(1);opacity:1}
    }
    @keyframes heartBeat{
      0%{transform:scale(1)}14%{transform:scale(1.2)}28%{transform:scale(1)}
      42%{transform:scale(1.2)}70%{transform:scale(1)}
    }
    @keyframes chipSlide{
      from{opacity:0;transform:translateY(10px) scale(.9)}
      to{opacity:1;transform:translateY(0) scale(1)}
    }
    @keyframes searchGlow{
      0%,100%{box-shadow:0 0 0 0 rgba(20,184,166,0)}
      50%{box-shadow:0 0 25px -5px rgba(20,184,166,.12)}
    }
    @keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes progressRing{from{stroke-dasharray:0 999}}
    @keyframes hoverLift{to{transform:translateY(-8px);box-shadow:0 20px 50px -12px rgba(20,184,166,.12)}}
    @keyframes borderFlow{
      0%{background-position:0% 50%}
      100%{background-position:200% 50%}
    }
    @keyframes skeletonPulse{0%,100%{opacity:.1}50%{opacity:.25}}
    @keyframes tooltipIn{from{opacity:0;transform:translateY(4px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes viewToggle{from{opacity:0;transform:scale(.8) rotate(-5deg)}to{opacity:1;transform:scale(1) rotate(0)}}

    .blob-1{animation:morphBlob1 20s ease-in-out infinite}
    .blob-2{animation:morphBlob2 25s ease-in-out infinite}
    .float-1{animation:float1 7s ease-in-out infinite}
    .float-2{animation:float2 5.5s ease-in-out infinite}
    .float-3{animation:float3 4s ease-in-out infinite}
    .slide-up{animation:slideUp .7s cubic-bezier(.16,1,.3,1) both}
    .slide-down{animation:slideDown .6s cubic-bezier(.16,1,.3,1) both}
    .scale-in{animation:scaleIn .5s cubic-bezier(.16,1,.3,1) both}
    .fade-in{animation:fadeIn .6s ease both}
    .card-reveal{animation:cardReveal .6s cubic-bezier(.16,1,.3,1) both}
    .slide-right{animation:slideRight .5s cubic-bezier(.16,1,.3,1) both}
    .bar-animate{animation:barGrow 1s cubic-bezier(.16,1,.3,1) both}
    .chip-slide{animation:chipSlide .4s cubic-bezier(.16,1,.3,1) both}
    .badge-pop{animation:badgePop .4s cubic-bezier(.34,1.56,.64,1) both}
    .view-toggle{animation:viewToggle .3s cubic-bezier(.16,1,.3,1) both}

    .gradient-text{
      background:linear-gradient(135deg,#14b8a6,#06b6d4,#2dd4bf,#14b8a6);
      background-size:300% 300%;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      animation:gradientShift 4s ease infinite;
    }
    .shimmer-text{
      background:linear-gradient(90deg,#6b7280,#2dd4bf 30%,#14b8a6 50%,#2dd4bf 70%,#6b7280);
      background-size:400% 100%;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      animation:shimmer 5s linear infinite;
    }

    .glass{
      background:linear-gradient(135deg,rgba(10,26,34,.92),rgba(7,16,21,.96));
      backdrop-filter:blur(24px);
      border:1px solid rgba(30,58,66,.4);
      transition:all .45s cubic-bezier(.16,1,.3,1);
    }
    .glass::before{
      content:'';position:absolute;inset:0;border-radius:inherit;
      background:linear-gradient(135deg,rgba(20,184,166,.03) 0%,transparent 50%,rgba(6,182,212,.02) 100%);
      opacity:0;transition:opacity .5s;pointer-events:none;
    }
    .glass:hover::before{opacity:1}

    .glass-card{
      background:linear-gradient(160deg,rgba(10,26,34,.9),rgba(7,16,21,.95));
      backdrop-filter:blur(16px);
      border:1px solid rgba(30,58,66,.35);
      transition:all .5s cubic-bezier(.16,1,.3,1);
    }
    .glass-card:hover{
      border-color:rgba(20,184,166,.25);
      transform:translateY(-6px);
      box-shadow:0 20px 60px -15px rgba(20,184,166,.12),0 0 0 1px rgba(20,184,166,.08);
    }
    .glass-card::before{
      content:'';position:absolute;inset:0;border-radius:inherit;
      background:linear-gradient(135deg,rgba(20,184,166,.04),transparent 50%);
      opacity:0;transition:opacity .5s;pointer-events:none;
    }
    .glass-card:hover::before{opacity:1}

    .shine{position:relative;overflow:hidden}
    .shine::after{
      content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.025),transparent);
      animation:cardShine 6s ease-in-out infinite;pointer-events:none;
    }

    .dot-grid{
      background-image:radial-gradient(rgba(20,184,166,.05) 1px,transparent 1px);
      background-size:28px 28px;
    }

    .particle{position:absolute;border-radius:50%;pointer-events:none}

    .ripple-container{position:relative;overflow:hidden}
    .ripple-circle{
      position:absolute;border-radius:50%;background:rgba(20,184,166,.2);
      transform:scale(0);animation:ripple .6s ease-out;pointer-events:none;
    }

    .course-card .card-image img{
      transition:transform .8s cubic-bezier(.16,1,.3,1);
    }
    .course-card:hover .card-image img{
      transform:scale(1.08);
    }
    .course-card .card-image .image-overlay{
      opacity:0;transition:opacity .5s;
    }
    .course-card:hover .card-image .image-overlay{
      opacity:1;
    }



    .enroll-btn{
      position:relative;overflow:hidden;transition:all .3s cubic-bezier(.16,1,.3,1);
    }
    .enroll-btn:hover{
      transform:translateY(-2px);
      box-shadow:0 8px 25px -5px rgba(20,184,166,.3);
    }
    .enroll-btn:active{transform:translateY(0);box-shadow:none}
    .enroll-btn::after{
      content:'';position:absolute;inset:0;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);
      transform:translateX(-100%);transition:transform .6s;
    }
    .enroll-btn:hover::after{transform:translateX(100%)}

    .enroll-success{animation:enrollSuccess .5s ease both}

    .bookmark-btn{transition:all .3s cubic-bezier(.16,1,.3,1)}
    .bookmark-btn:hover{transform:scale(1.15)}
    .bookmark-btn.saved{animation:heartBeat .8s ease both}

    .search-glow:focus-within{animation:searchGlow 2s ease-in-out infinite}

    .skeleton{animation:skeletonPulse 1.5s ease-in-out infinite}

    .featured-scroll{
      scroll-snap-type:x mandatory;
      -webkit-overflow-scrolling:touch;
      scrollbar-width:none;
    }
    .featured-scroll::-webkit-scrollbar{display:none}
    .featured-scroll>*{scroll-snap-align:start}

    .marquee-track{animation:marquee 35s linear infinite}
    .marquee-track:hover{animation-play-state:paused}

    .filter-chip{transition:all .25s cubic-bezier(.16,1,.3,1)}
    .filter-chip:hover{transform:translateY(-2px)}
    .filter-chip.active{box-shadow:0 4px 15px -3px var(--chip-shadow,rgba(20,184,166,.3))}

    .modal-bg{animation:modalBg .3s ease both}
    .modal-content{animation:modalReveal .4s cubic-bezier(.16,1,.3,1) both}

    .stat-card{transition:all .3s ease}
    .stat-card:hover{transform:translateY(-3px)}

    .view-btn{transition:all .25s ease}
    .view-btn:hover{background:rgba(20,184,166,.1)}
    .view-btn.active{background:rgba(20,184,166,.15);color:#2dd4bf}

    .confetti{animation:confettiBurst 1s cubic-bezier(.16,1,.3,1) both}

    .list-card{
      transition:all .4s cubic-bezier(.16,1,.3,1);
    }
    .list-card:hover{
      transform:translateX(6px);
      border-color:rgba(20,184,166,.25);
      box-shadow:0 8px 30px -8px rgba(20,184,166,.1);
    }

    .progress-ring circle:last-child{animation:progressRing 1.2s ease-out both}

    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#1e3a42;border-radius:10px}
    ::-webkit-scrollbar-thumb:hover{background:#14b8a6}
  `}</style>
);

/* ─── Hooks ─── */
function useInView(opts = {}) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1, ...opts });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function useAnimatedNumber(target, dur = 1000) {
  const [val, setVal] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === prev.current) return;
    prev.current = target;
    const s = performance.now();
    const tick = (now) => {
      const p = Math.min((now - s) / dur, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, dur]);
  return val;
}

/* ─── Particles ─── */
function Particles() {
  const dots = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i, left: Math.random() * 100, size: Math.random() * 2.5 + 0.8,
      delay: Math.random() * 14, duration: Math.random() * 18 + 14, opacity: Math.random() * 0.18 + 0.06,
    })), []);
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {dots.map(p => (
        <div key={p.id} className="particle" style={{
          left: `${p.left}%`, bottom: '-5px', width: p.size, height: p.size,
          background: p.id % 3 === 0 ? '#14b8a6' : p.id % 3 === 1 ? '#06b6d4' : '#2dd4bf',
          opacity: p.opacity, animation: `particleFloat ${p.duration}s linear ${p.delay}s infinite`
        }} />
      ))}
    </div>
  );
}

/* ─── Ripple Button ─── */
function RippleButton({ children, onClick, disabled, className, ...props }) {
  const ref = useRef(null);
  const handleClick = (e) => {
    if (disabled) return;
    const btn = ref.current, rect = btn.getBoundingClientRect();
    const circle = document.createElement('span');
    const d = Math.max(rect.width, rect.height);
    circle.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX-rect.left-d/2}px;top:${e.clientY-rect.top-d/2}px`;
    circle.className = 'ripple-circle';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
    onClick?.(e);
  };
  return <button ref={ref} onClick={handleClick} disabled={disabled} className={`ripple-container ${className}`} {...props}>{children}</button>;
}

/* ─── Skeleton Card ─── */
function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="h-44 bg-[#1e3a42]/20 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 bg-[#1e3a42]/20 rounded-lg skeleton" />
        <div className="h-3 w-full bg-[#1e3a42]/15 rounded-lg skeleton" style={{ animationDelay: '.1s' }} />
        <div className="h-3 w-1/2 bg-[#1e3a42]/15 rounded-lg skeleton" style={{ animationDelay: '.2s' }} />
        <div className="flex gap-2 pt-2">
          <div className="h-8 flex-1 bg-[#1e3a42]/15 rounded-xl skeleton" style={{ animationDelay: '.3s' }} />
          <div className="h-8 flex-1 bg-[#1e3a42]/15 rounded-xl skeleton" style={{ animationDelay: '.4s' }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  const [ref, vis] = useInView();
  const animVal = useAnimatedNumber(vis ? value : 0);
  return (
    <div ref={ref} className="stat-card glass shine rounded-2xl p-5 text-center cursor-default
      relative overflow-hidden group" style={{ animationDelay: `${delay}s` }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-b-full
        opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: color }} />
      <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center
        group-hover:scale-110 transition-transform duration-300"
        style={{ background: `${color}15` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="text-2xl font-black tabular-nums mb-1" style={{ color }}>{animVal}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold">{label}</div>
    </div>
  );
}

/* ─── Featured Course Card ─── */
function FeaturedCard({ course, index, enrolled, onEnroll, onUnenroll, onDetails, actionLoading }) {
  const meta = getTopicMeta(course.topic);
  const img = courseImages[index % courseImages.length];
  const Icon = meta.icon;

  return (
    <div className="shrink-0 w-[300px] sm:w-[340px] slide-right" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="glass-card shine rounded-2xl overflow-hidden h-full relative group course-card">
        {/* Image */}
        <div className="card-image relative h-40 overflow-hidden">
          <img src={img} alt={course.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A22] via-[#0A1A22]/30 to-transparent" />
          <div className="image-overlay absolute inset-0 bg-[#14b8a6]/10 backdrop-blur-[2px]" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
              style={{ background: `${meta.color}20`, color: meta.color, border: `1px solid ${meta.color}25` }}>
              <Icon size={10} /> {course.topic || 'Course'}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {enrolled && (
              <span className="badge-pop flex items-center gap-1 px-2 py-1 bg-emerald-500/90 backdrop-blur-md rounded-lg text-white text-[10px] font-bold shadow-lg shadow-emerald-500/20">
                <CheckCircle size={10} /> Enrolled
              </span>
            )}
          </div>

          {/* Flame badge for featured */}
          <div className="absolute bottom-3 right-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#ef4444]
              flex items-center justify-center shadow-lg shadow-amber-500/20 float-3">
              <Flame size={14} className="text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className="text-sm font-bold text-white mb-1.5 line-clamp-1 group-hover:text-[#2dd4bf] transition-colors">
            {course.name}
          </h4>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
            {course.description || 'Comprehensive course to advance your career skills.'}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-gray-600">
              <span className="flex items-center gap-1"><Users size={10} /> {course.enrollment_count || 0}</span>
              <span className="flex items-center gap-1"><Star size={10} className="text-amber-400" /> 4.8</span>
            </div>
            <RippleButton onClick={() => onDetails(course)}
              className="px-3 py-1.5 text-[10px] font-bold text-[#14b8a6] hover:bg-[#14b8a6]/10
                rounded-lg transition-all cursor-pointer flex items-center gap-1">
              Details <ChevronRight size={10} />
            </RippleButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN RESOURCES
   ═══════════════════════════════════════ */
export default function Resources() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [topicFilter, setTopicFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [savedCourses, setSavedCourses] = useState(new Set());
  const [searchFocused, setSearchFocused] = useState(false);
  const [justEnrolled, setJustEnrolled] = useState(null);

  const featuredRef = useRef(null);
  const [heroRef, heroVisible] = useInView();
  const [statsRef, statsVisible] = useInView();
  const [gridRef, gridVisible] = useInView();

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, enrollRes] = await Promise.all([
        api.get('/courses'),
        user ? api.get(`/enrollments?user_id=${user.id}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
      ]);
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      setEnrollments(Array.isArray(enrollRes.data) ? enrollRes.data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const isEnrolled = (courseId) => {
    const normalizedCourseId = Number(courseId);
    return enrollments.some(en => Number(en.course_id) === normalizedCourseId);
  };

  const handleEnroll = async (courseId) => {
    if (!user) return alert('Please login to enroll');
    setActionLoading(courseId);
    try {
      await api.post('/enrollments', { course_id: courseId, user_id: user.id });
      setJustEnrolled(courseId);
      setTimeout(() => setJustEnrolled(null), 2000);
      await fetchData();
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const handleUnenroll = async (courseId) => {
    setActionLoading(courseId);
    try {
      const enrollment = enrollments.find(en => en.course_id === courseId);
      if (enrollment) { await api.delete(`/enrollments/${enrollment.id}`); await fetchData(); }
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const toggleSave = (id) => setSavedCourses(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // Topics extraction
  const topics = useMemo(() => {
    const set = new Set(courses.map(c => c.topic).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [courses]);

  const filteredCourses = useMemo(() => courses.filter(c => {
    const matchSearch = [c.name, c.topic, c.description].some(s => (s || '').toLowerCase().includes(search.toLowerCase()));
    const matchTopic = topicFilter === 'all' || c.topic === topicFilter;
    return matchSearch && matchTopic;
  }), [courses, search, topicFilter]);

  const enrolledCount = enrollments.length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollment_count || 0), 0);

  return (
    <>
      <InjectStyles />
      <div className="min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#050D11 0%,#0A1A22 35%,#071218 100%)' }}>

        <Particles />

        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="blob-1 absolute -top-[15%] -right-[10%] w-[500px] h-[500px] bg-[#14b8a6]/[0.02]" />
          <div className="blob-2 absolute -bottom-[10%] -left-[10%] w-[550px] h-[550px] bg-[#06b6d4]/[0.02]" />
          <div className="dot-grid absolute inset-0 opacity-30" />
        </div>

        <div className="relative z-10 pt-24 pb-20">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">

            {/* ═══ HERO ═══ */}
            <div ref={heroRef} className={`text-center mb-14 ${heroVisible ? 'slide-down' : 'opacity-0'}`}>
              <div className="relative inline-block mb-6">
                <div className="absolute -top-6 -left-10 float-1 opacity-30">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#14b8a6]/50" />
                </div>
                <div className="absolute -top-3 -right-14 float-2 opacity-20">
                  <div className="w-3 h-3 rounded bg-[#06b6d4]/30 rotate-45" />
                </div>

                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full
                  bg-[#14b8a6]/[0.08] border border-[#14b8a6]/20">
                  <GraduationCap size={13} className="text-[#14b8a6] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-[0.2em]">
                    Learning Hub
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-[1.1] tracking-tight">
                Level Up Your<br />
                <span className="gradient-text">Career Skills</span>
              </h1>
              <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                Explore curated courses, track your progress, and build the skills employers are looking for
              </p>
            </div>

            {/* ═══ STATS ═══ */}
            <div ref={statsRef} className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10
              ${statsVisible ? 'slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
              <StatCard icon={BookOpen} label="Courses" value={courses.length} color="#14b8a6" delay={0} />
              <StatCard icon={Users} label="Students" value={totalStudents} color="#06b6d4" delay={0.08} />
              <StatCard icon={CheckCircle} label="Enrolled" value={enrolledCount} color="#10b981" delay={0.16} />
              <StatCard icon={Award} label="Topics" value={topics.length - 1} color="#a855f7" delay={0.24} />
            </div>

            {/* ═══ MARQUEE TICKER ═══ */}
            {courses.length > 0 && (
              <div className="relative mb-10 overflow-hidden py-3 border-y border-[#1e3a42]/20 fade-in"
                style={{ animationDelay: '0.3s' }}>
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050D11] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050D11] to-transparent z-10" />
                <div className="marquee-track flex gap-6 w-max">
                  {[...courses, ...courses, ...courses].map((c, i) => {
                    const m = getTopicMeta(c.topic);
                    return (
                      <span key={i} className="shrink-0 flex items-center gap-2 text-xs text-gray-600 whitespace-nowrap">
                        <CircleDot size={8} style={{ color: m.color }} />
                        <span className="font-medium" style={{ color: m.color }}>{c.name}</span>
                        <span className="text-gray-700">•</span>
                        <span>{c.topic}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══ FEATURED COURSES ═══ */}
            {!loading && courses.length > 0 && (
              <div className="mb-12 slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#ef4444]
                      flex items-center justify-center shadow-lg shadow-amber-500/15">
                      <Flame size={16} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Featured Courses</h2>
                      <p className="text-[11px] text-gray-600">Handpicked for your career growth</p>
                    </div>
                  </div>
                  <button onClick={() => featuredRef.current?.scrollBy({ left: 360, behavior: 'smooth' })}
                    className="flex items-center gap-1 text-xs text-[#14b8a6] hover:text-[#2dd4bf]
                      font-semibold transition-colors cursor-pointer group">
                    Scroll <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div ref={featuredRef} className="featured-scroll flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
                  {courses.slice(0, 8).map((course, i) => (
                    <FeaturedCard key={course.id} course={course} index={i}
                      enrolled={isEnrolled(course.id)} onEnroll={handleEnroll}
                      onUnenroll={handleUnenroll} onDetails={setSelectedCourse}
                      actionLoading={actionLoading} />
                  ))}
                </div>
              </div>
            )}

            {/* ═══ SEARCH + FILTERS ═══ */}
            <div className="mb-8 slide-up" style={{ animationDelay: '0.25s' }}>
              {/* Search */}
              <div className={`relative mb-5 group search-glow rounded-2xl ${searchFocused ? '' : ''}`}>
                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500
                  ${searchFocused ? 'opacity-100' : 'opacity-0'}`}
                  style={{ background: 'linear-gradient(135deg,rgba(20,184,166,.06),rgba(6,182,212,.03))', filter: 'blur(20px)' }} />
                <div className="relative">
                  <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300
                    ${searchFocused ? 'text-[#14b8a6] scale-110' : 'text-gray-600'}`}>
                    <Search size={18} />
                  </div>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                    placeholder="Search courses by name, topic, or description..."
                    className="w-full pl-13 pr-12 py-4 bg-[#0A1A22]/80 border border-[#1e3a42]/50
                      rounded-2xl text-white placeholder-gray-600 text-[15px]
                      focus:border-[#14b8a6]/40 focus:ring-2 focus:ring-[#14b8a6]/10
                      transition-all duration-300 backdrop-blur-sm" />
                  {search && (
                    <button onClick={() => setSearch('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center
                        rounded-lg bg-[#1e3a42]/50 text-gray-400 hover:text-white transition-all cursor-pointer hover:bg-[#1e3a42]">
                      <X size={13} />
                    </button>
                  )}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full
                    bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent transition-all duration-500
                    ${searchFocused ? 'w-[90%] opacity-100' : 'w-0 opacity-0'}`} />
                </div>
              </div>

              {/* Filter row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Topic chips */}
                <div className="flex flex-wrap gap-1.5">
                  {topics.map((topic, i) => {
                    const isActive = topicFilter === topic;
                    const meta = topic === 'all' ? { color: '#14b8a6', icon: Layers } : getTopicMeta(topic);
                    const Icon = meta.icon;
                    return (
                      <button key={topic} onClick={() => setTopicFilter(topic)}
                        className={`filter-chip chip-slide flex items-center gap-1.5 px-3.5 py-2 rounded-xl
                          text-[11px] font-bold cursor-pointer border
                          ${isActive
                            ? 'text-white border-opacity-40'
                            : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#0F3A42]/30'
                          }`}
                        style={{
                          animationDelay: `${i * 0.04}s`,
                          ...(isActive ? {
                            background: `${meta.color}15`,
                            borderColor: `${meta.color}30`,
                            color: meta.color,
                            '--chip-shadow': `${meta.color}30`,
                          } : {}),
                        }}>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: meta.color }} />}
                        <Icon size={11} />
                        {topic === 'all' ? 'All' : topic}
                      </button>
                    );
                  })}
                </div>

                {/* View toggle + count */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider tabular-nums">
                    {filteredCourses.length} courses
                  </span>
                  <div className="flex bg-[#071015]/50 border border-[#1e3a42]/30 rounded-xl p-1">
                    {[
                      { key: 'grid', icon: Grid3X3 },
                      { key: 'list', icon: LayoutList },
                    ].map(v => (
                      <button key={v.key} onClick={() => setViewMode(v.key)}
                        className={`view-btn w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer
                          ${viewMode === v.key ? 'active' : 'text-gray-600'}`}>
                        <v.icon size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ COURSES ═══ */}
            <div ref={gridRef}>
              {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                      <SkeletonCard />
                    </div>
                  ))}
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-28 slide-up">
                  <div className="w-20 h-20 rounded-3xl bg-[#0A1A22] border border-[#1e3a42]/40
                    flex items-center justify-center mx-auto mb-5 float-2">
                    <BookOpen size={32} className="text-gray-600" />
                  </div>
                  <p className="text-white text-lg font-bold mb-2">No courses found</p>
                  <p className="text-gray-600 text-sm max-w-sm mx-auto mb-5">
                    Try adjusting your search or filter criteria
                  </p>
                  {(search || topicFilter !== 'all') && (
                    <button onClick={() => { setSearch(''); setTopicFilter('all'); }}
                      className="px-5 py-2.5 bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-xl
                        text-[#2dd4bf] text-sm font-bold hover:bg-[#14b8a6]/20 transition-all cursor-pointer">
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : viewMode === 'grid' ? (
                /* ── GRID VIEW ── */
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCourses.map((course, idx) => {
                    const enrolled = isEnrolled(course.id);
                    const meta = getTopicMeta(course.topic);
                    const img = courseImages[course.id % courseImages.length];
                    const Icon = meta.icon;
                    const isSaved = savedCourses.has(course.id);
                    const wasJustEnrolled = justEnrolled === course.id;

                    return (
                      <div key={course.id} className="card-reveal" style={{ animationDelay: `${idx * 0.06}s` }}>
                        <div className="glass-card shine rounded-2xl overflow-hidden
                          relative group course-card">

                          {/* Color accent */}
                          <div className="absolute top-0 left-0 right-0 h-[2px] z-10"
                            style={{ background: `linear-gradient(90deg,transparent,${meta.color}50,transparent)` }} />

                          {/* Image */}
                          <div className="card-image relative h-44 overflow-hidden">
                            <img src={img} alt={course.name}
                              className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A22] via-[#0A1A22]/30 to-transparent" />
                            <div className="image-overlay absolute inset-0 bg-[#14b8a6]/[0.06] backdrop-blur-[1px]" />

                            {/* Top badges */}
                            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                              {course.topic && (
                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold
                                  uppercase tracking-wider backdrop-blur-md border"
                                  style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}20` }}>
                                  <Icon size={10} /> {course.topic}
                                </span>
                              )}
                            </div>

                            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                              {enrolled && (
                                <span className={`flex items-center gap-1 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-md
                                  rounded-lg text-white text-[10px] font-bold shadow-lg shadow-emerald-500/20
                                  ${wasJustEnrolled ? 'enroll-success' : 'badge-pop'}`}>
                                  <CheckCircle size={10} /> Enrolled
                                </span>
                              )}
                              <button onClick={(e) => { e.stopPropagation(); toggleSave(course.id); }}
                                className={`bookmark-btn w-8 h-8 rounded-lg backdrop-blur-md flex items-center justify-center
                                  cursor-pointer border transition-all
                                  ${isSaved
                                    ? 'saved bg-pink-500/20 border-pink-500/30 text-pink-400'
                                    : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                                  }`}>
                                {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                              </button>
                            </div>

                            {/* Play overlay on hover */}
                            <div className="image-overlay absolute inset-0 flex items-center justify-center z-10">
                              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20
                                flex items-center justify-center scale-in cursor-pointer hover:bg-white/20 transition-all"
                                onClick={() => setSelectedCourse(course)}>
                                <Eye size={18} className="text-white" />
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 relative z-10">
                            <h3 className="text-[15px] font-bold text-white mb-2 line-clamp-1
                              group-hover:text-[#2dd4bf] transition-colors duration-300">
                              {course.name}
                            </h3>
                            <p className="text-gray-500 text-xs mb-4 leading-relaxed line-clamp-2">
                              {course.description || 'Learn essential skills in this comprehensive course.'}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-3 text-[10px] text-gray-600 mb-4">
                              <span className="flex items-center gap-1">
                                <Users size={10} className="text-gray-500" /> {course.enrollment_count || 0} students
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={10} className="text-gray-500" /> Self-paced
                              </span>
                              <span className="flex items-center gap-1 ml-auto">
                                <Star size={10} className="text-amber-400" /> 4.8
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <button onClick={() => setSelectedCourse(course)}
                                className="flex-1 py-2.5 border border-[#1e3a42]/40 rounded-xl text-gray-400
                                  text-xs font-semibold hover:border-[#14b8a6]/30 hover:text-white
                                  hover:bg-[#14b8a6]/5 transition-all duration-300 cursor-pointer
                                  flex items-center justify-center gap-1.5 group/btn">
                                <Eye size={12} /> Details
                                <ChevronRight size={10} className="opacity-0 -translate-x-1
                                  group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                              </button>
                              {enrolled ? (
                                <RippleButton onClick={() => navigate(`/course-player/${course.id}`)}
                                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500
                                    border border-emerald-500/30 rounded-xl text-white
                                    text-xs font-semibold transition-all duration-300 cursor-pointer
                                    flex items-center justify-center gap-1.5">
                                  <Play size={12} /> Continue Learning
                                </RippleButton>
                              ) : (
                                <RippleButton onClick={() => handleEnroll(course.id)}
                                  disabled={actionLoading === course.id}
                                  className="enroll-btn flex-1 py-2.5 bg-gradient-to-r from-[#14b8a6] to-[#06b6d4]
                                    rounded-xl text-white text-xs font-bold cursor-pointer disabled:opacity-50
                                    flex items-center justify-center gap-1.5">
                                  {actionLoading === course.id ? (
                                    <><Loader2 size={12} className="animate-spin" /> ...</>
                                  ) : (
                                    <><GraduationCap size={12} /> Enroll</>
                                  )}
                                </RippleButton>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* ── LIST VIEW ── */
                <div className="space-y-3 view-toggle">
                  {filteredCourses.map((course, idx) => {
                    const enrolled = isEnrolled(course.id);
                    const meta = getTopicMeta(course.topic);
                    const img = courseImages[course.id % courseImages.length];
                    const Icon = meta.icon;

                    return (
                      <div key={course.id} className="card-reveal" style={{ animationDelay: `${idx * 0.04}s` }}>
                        <div className="list-card glass shine rounded-2xl p-4 relative overflow-hidden group cursor-default">
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                            style={{ background: meta.color }} />

                          <div className="flex items-center gap-4">
                            {/* Thumbnail */}
                            <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden">
                              <img src={img} alt={course.name} className="w-full h-full object-cover" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-bold text-white truncate group-hover:text-[#2dd4bf] transition-colors">
                                  {course.name}
                                </h3>
                                {enrolled && (
                                  <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15
                                    text-emerald-400 text-[9px] font-bold rounded-md border border-emerald-500/20">
                                    <CheckCircle size={8} /> Enrolled
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                                {course.description || 'Comprehensive career course'}
                              </p>
                              <div className="flex items-center gap-3 text-[10px] text-gray-600">
                                {course.topic && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md border"
                                    style={{ background: `${meta.color}08`, color: meta.color, borderColor: `${meta.color}15` }}>
                                    <Icon size={9} /> {course.topic}
                                  </span>
                                )}
                                <span className="flex items-center gap-1"><Users size={9} /> {course.enrollment_count || 0}</span>
                                <span className="flex items-center gap-1"><Star size={9} className="text-amber-400" /> 4.8</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button onClick={() => setSelectedCourse(course)}
                                className="w-9 h-9 rounded-xl border border-[#1e3a42]/40 flex items-center justify-center
                                  text-gray-500 hover:text-white hover:border-[#14b8a6]/30 transition-all cursor-pointer">
                                <Eye size={14} />
                              </button>
                              {enrolled ? (
                                <RippleButton onClick={() => navigate(`/course-player/${course.id}`)}
                                  className="px-4 py-2 border border-emerald-500/30 bg-emerald-500/10 rounded-xl text-emerald-400 text-xs font-semibold
                                    hover:border-emerald-500/50 hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5">
                                  <Play size={12} /> Continue
                                </RippleButton>
                              ) : (
                                <RippleButton onClick={() => handleEnroll(course.id)}
                                  disabled={actionLoading === course.id}
                                  className="enroll-btn px-5 py-2 bg-gradient-to-r from-[#14b8a6] to-[#06b6d4]
                                    rounded-xl text-white text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                                  {actionLoading === course.id ? <Loader2 size={12} className="animate-spin" /> : <><GraduationCap size={12} /> Enroll</>}
                                </RippleButton>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Results footer */}
              {!loading && filteredCourses.length > 0 && (
                <div className="text-center mt-10 fade-in">
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#0A1A22]/60
                    border border-[#1e3a42]/30 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                    <span className="text-xs text-gray-500">
                      Showing <span className="text-white font-bold">{filteredCourses.length}</span> of{' '}
                      <span className="text-white font-bold">{courses.length}</span> courses
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ MODAL ═══ */}
        {selectedCourse && (() => {
          const enrolled = isEnrolled(selectedCourse.id);
          const meta = getTopicMeta(selectedCourse.topic);
          const modalImg = courseImages[courses.findIndex(c => c.id === selectedCourse.id) % courseImages.length] || courseImages[0];
          const Icon = meta.icon;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedCourse(null)}>
              <div className="modal-bg absolute inset-0 bg-black/70 backdrop-blur-lg" />

              <div onClick={e => e.stopPropagation()}
                className="modal-content relative w-full max-w-2xl max-h-[90vh] overflow-y-auto
                  bg-[#0A1A22] border border-[#1e3a42]/60 rounded-3xl shadow-2xl shadow-[#14b8a6]/5">

                {/* Hero Image */}
                <div className="relative h-52 sm:h-64 overflow-hidden rounded-t-3xl">
                  <img src={modalImg} alt={selectedCourse.name}
                    className="w-full h-full object-cover"
                    style={{ animation: 'imageZoom 0.8s ease-out both' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A22] via-[#0A1A22]/40 to-transparent" />

                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] z-10"
                    style={{
                      background: `linear-gradient(90deg,transparent,${meta.color},transparent)`,
                      backgroundSize: '200% 100%',
                      animation: 'gradientShift 3s ease infinite',
                    }} />

                  {/* Close */}
                  <button onClick={() => setSelectedCourse(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md
                      border border-white/10 text-white/80 hover:text-white hover:bg-black/60
                      transition-all cursor-pointer z-20 hover:rotate-90 duration-300
                      flex items-center justify-center">
                    <X size={18} />
                  </button>

                  {/* Badges */}
                  <div className="absolute bottom-4 left-5 flex items-center gap-2 z-10">
                    {selectedCourse.topic && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                        uppercase tracking-wider backdrop-blur-md border"
                        style={{ background: `${meta.color}20`, color: meta.color, borderColor: `${meta.color}25` }}>
                        <Icon size={12} /> {selectedCourse.topic}
                      </span>
                    )}
                    {enrolled && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md
                        rounded-lg text-white text-xs font-bold shadow-lg shadow-emerald-500/20">
                        <CheckCircle size={12} /> Enrolled
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {/* Title */}
                  <h2 className="text-2xl font-black text-white mb-3 leading-tight">{selectedCourse.name}</h2>

                  {/* Stats row */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      { icon: Users, label: `${selectedCourse.enrollment_count || 0} students`, color: '#14b8a6' },
                      { icon: Clock, label: 'Self-paced', color: '#06b6d4' },
                      { icon: GraduationCap, label: 'Certificate', color: '#10b981' },
                      { icon: Star, label: '4.8 / 5.0', color: '#f59e0b' },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        bg-[#071015]/50 border border-[#1e3a42]/25 text-xs"
                        style={{ color: stat.color }}>
                        <stat.icon size={12} /> <span className="text-gray-400">{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                      <ChevronRight size={14} className="text-[#14b8a6]" /> About This Course
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed pl-5 border-l-2 border-[#1e3a42]/30">
                      {selectedCourse.description || 'Learn essential skills in this comprehensive course designed to advance your career. Covers fundamental concepts and advanced techniques with hands-on projects.'}
                    </p>
                  </div>

                  {/* What you'll learn */}
                  <div className="mb-6">
                    <h4 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                      <Award size={14} className="text-[#06b6d4]" /> What You'll Learn
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2.5 pl-1">
                      {[
                        `Core ${selectedCourse.topic || 'technical'} fundamentals`,
                        'Hands-on project experience',
                        'Industry best practices',
                        'Problem-solving techniques',
                        'Portfolio-ready projects',
                        'Career preparation guidance',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl
                          hover:bg-emerald-500/5 transition-all cursor-default scale-in"
                          style={{ animationDelay: `${i * 0.05}s` }}>
                          <div className="w-5 h-5 rounded-md bg-emerald-500/12 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle size={11} className="text-emerald-400" />
                          </div>
                          <span className="text-sm text-gray-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Course details cards */}
                  <div className="grid grid-cols-3 gap-3 mb-7">
                    {[
                      { icon: Layers, label: 'Level', value: 'All Levels', color: '#14b8a6' },
                      { icon: Clock, label: 'Duration', value: 'Self-paced', color: '#06b6d4' },
                      { icon: Trophy, label: 'Certificate', value: 'Yes', color: '#f59e0b' },
                    ].map((card, i) => (
                      <div key={i} className="bg-[#071015]/40 border border-[#1e3a42]/25 rounded-xl p-4 text-center
                        hover:border-[#14b8a6]/20 transition-all group/card cursor-default">
                        <div className="w-9 h-9 rounded-lg mx-auto mb-2 flex items-center justify-center
                          group-hover/card:scale-110 transition-transform duration-300"
                          style={{ background: `${card.color}12` }}>
                          <card.icon size={16} style={{ color: card.color }} />
                        </div>
                        <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold mb-0.5">{card.label}</div>
                        <div className="text-xs font-bold text-white">{card.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {enrolled ? (
                      <RippleButton
                        onClick={() => { handleUnenroll(selectedCourse.id); setSelectedCourse(null); }}
                        disabled={actionLoading === selectedCourse.id}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5
                          bg-[#1e3a42]/40 hover:bg-red-500/10 border border-[#1e3a42]/30 hover:border-red-500/20
                          rounded-xl text-gray-300 hover:text-red-400 text-sm font-bold transition-all cursor-pointer
                          disabled:opacity-50">
                        {actionLoading === selectedCourse.id ? (
                          <><Loader2 size={16} className="animate-spin" /> Processing...</>
                        ) : (
                          <><X size={16} /> Unenroll from Course</>
                        )}
                      </RippleButton>
                    ) : (
                      <RippleButton
                        onClick={() => { handleEnroll(selectedCourse.id); setSelectedCourse(null); }}
                        disabled={actionLoading === selectedCourse.id}
                        className="enroll-btn flex-1 flex items-center justify-center gap-2 px-6 py-3.5
                          bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] rounded-xl text-white text-sm font-bold
                          cursor-pointer disabled:opacity-50">
                        {actionLoading === selectedCourse.id ? (
                          <><Loader2 size={16} className="animate-spin" /> Enrolling...</>
                        ) : (
                          <><GraduationCap size={16} /> Enroll Now</>
                        )}
                      </RippleButton>
                    )}
                    <button onClick={() => setSelectedCourse(null)}
                      className="px-6 py-3.5 border border-[#1e3a42]/40 rounded-xl text-gray-400
                        text-sm font-semibold hover:border-[#14b8a6]/30 hover:text-white
                        hover:bg-[#14b8a6]/5 transition-all cursor-pointer">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}