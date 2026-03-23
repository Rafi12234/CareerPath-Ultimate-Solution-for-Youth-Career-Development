import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  User, Plus, X, Save, Pencil, Trash2, BookOpen, Briefcase, Award,
  ChevronDown, Camera, Loader2, Sparkles, Shield, Target, Zap,
  Code2, Crown, Star, TrendingUp, CheckCircle, ArrowRight,
  Layers, Heart, Eye, Clock, BarChart3, Hexagon, Activity,
  Mail, Phone, MapPin, GraduationCap, Building2, FileText
} from 'lucide-react';
import api from '../utils/api';

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Expert', 'Professional'];

const PROFICIENCY_META = {
  Beginner: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', rank: 1, icon: Code2, label: 'Learning' },
  Intermediate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', rank: 2, icon: Target, label: 'Practicing' },
  Expert: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', rank: 3, icon: Zap, label: 'Skilled' },
  Professional: { color: '#a855f7', bg: 'rgba(168,85,247,0.12)', rank: 4, icon: Crown, label: 'Mastered' },
};

const EDUCATION_GROUPS = ['Science', 'Commerce', 'Arts'];
const BANGLADESH_EDUCATION_BOARDS = ['Dhaka', 'Chattogram', 'Rajshahi', 'Jashore', 'Cumilla', 'Barishal', 'Sylhet', 'Dinajpur'];

const buildProfileForm = (source = {}) => ({
  name: source.name || '',
  email: source.email || '',
  phone: source.phone || '',
  date_of_birth: source.date_of_birth ? String(source.date_of_birth).slice(0, 10) : '',
  gender: source.gender || '',
  marital_status: source.marital_status || '',
  nationality: source.nationality || '',
  present_address: source.present_address || '',
  permanent_address: source.permanent_address || '',
  school_name: source.school_name || '',
  ssc_year: source.ssc_year ? String(source.ssc_year) : '',
  ssc_result: source.ssc_result || '',
  ssc_group: source.ssc_group || '',
  ssc_board: source.ssc_board || '',
  college_name: source.college_name || '',
  hsc_year: source.hsc_year ? String(source.hsc_year) : '',
  hsc_result: source.hsc_result || '',
  hsc_group: source.hsc_group || '',
  hsc_board: source.hsc_board || '',
  university_name: source.university_name || '',
  university_status: source.university_status || '',
  current_study_year: source.current_study_year ? String(source.current_study_year) : '',
  current_study_semester: source.current_study_semester ? String(source.current_study_semester) : '',
  university_graduation_year: source.university_graduation_year ? String(source.university_graduation_year) : '',
  university_cgpa: source.university_cgpa ? String(source.university_cgpa) : '',
  years_of_experience: source.years_of_experience != null ? String(source.years_of_experience) : '',
  is_fresher: source.is_fresher == null ? true : Boolean(source.is_fresher),
  current_job_title: source.current_job_title || '',
  current_company: source.current_company || '',
  previous_job_title: source.previous_job_title || '',
  previous_company: source.previous_company || '',
  previous_job_start: source.previous_job_start ? String(source.previous_job_start).slice(0, 10) : '',
  previous_job_end: source.previous_job_end ? String(source.previous_job_end).slice(0, 10) : '',
  previous_job_description: source.previous_job_description || '',
});

const InjectStyles = () => (
  <style>{`
    @keyframes morphBlob1 {
      0%,100%{border-radius:42% 58% 70% 30%/45% 45% 55% 55%;transform:rotate(0) scale(1)}
      25%{border-radius:70% 30% 50% 50%/30% 60% 40% 70%;transform:rotate(90deg) scale(1.05)}
      50%{border-radius:30% 70% 40% 60%/55% 30% 70% 45%;transform:rotate(180deg) scale(.95)}
      75%{border-radius:55% 45% 60% 40%/40% 70% 30% 60%;transform:rotate(270deg) scale(1.02)}
    }
    @keyframes morphBlob2 {
      0%,100%{border-radius:58% 42% 30% 70%/55% 45% 55% 45%;transform:rotate(0)}
      33%{border-radius:40% 60% 60% 40%/60% 30% 70% 40%;transform:rotate(120deg)}
      66%{border-radius:60% 40% 45% 55%/35% 65% 35% 65%;transform:rotate(240deg)}
    }
    @keyframes float1{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-18px) rotate(3deg)}}
    @keyframes float2{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-12px) rotate(-2deg)}}
    @keyframes float3{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes tiltIn{from{opacity:0;transform:perspective(800px) rotateY(-6deg) translateX(-20px)}to{opacity:1;transform:perspective(800px) rotateY(0) translateX(0)}}
    @keyframes ringDraw{from{stroke-dasharray:0 999}}
    @keyframes barGrow{from{width:0}}
    @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes borderGlow{0%,100%{opacity:.3}50%{opacity:.8}}
    @keyframes pulseRing{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.8);opacity:0}}
    @keyframes cardShine{0%{left:-100%}50%,100%{left:150%}}
    @keyframes typewriter{from{width:0}to{width:100%}}
    @keyframes blink{50%{border-color:transparent}}
    @keyframes hexPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.15);opacity:1}}
    @keyframes orbitalSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes particleFloat{
      0%{transform:translateY(0) translateX(0) scale(1);opacity:.5}
      50%{opacity:.8}
      100%{transform:translateY(-100vh) translateX(40px) scale(0);opacity:0}
    }
    @keyframes ripple{to{transform:scale(3);opacity:0}}
    @keyframes skillSlotIn{
      from{opacity:0;transform:translateX(-30px) rotateY(-10deg)}
      to{opacity:1;transform:translateX(0) rotateY(0)}
    }
    @keyframes modalReveal{
      from{opacity:0;transform:translateY(60px) scale(.92) rotateX(4deg)}
      to{opacity:1;transform:translateY(0) scale(1) rotateX(0)}
    }
    @keyframes progressPulse{
      0%,100%{box-shadow:0 0 0 0 rgba(20,184,166,.3)}
      50%{box-shadow:0 0 12px 3px rgba(20,184,166,.15)}
    }
    @keyframes confetti{
      0%{transform:translateY(0) rotate(0);opacity:1}
      100%{transform:translateY(-80px) rotate(720deg);opacity:0}
    }
    @keyframes countFlip{0%{transform:translateY(100%);opacity:0}60%{transform:translateY(-8%)}100%{transform:translateY(0);opacity:1}}
    @keyframes glowPulse{0%,100%{filter:brightness(1)}50%{filter:brightness(1.3)}}

    .blob-1{animation:morphBlob1 18s ease-in-out infinite}
    .blob-2{animation:morphBlob2 22s ease-in-out infinite}
    .float-1{animation:float1 6s ease-in-out infinite}
    .float-2{animation:float2 5s ease-in-out infinite}
    .float-3{animation:float3 4s ease-in-out infinite}
    .slide-up{animation:slideUp .7s cubic-bezier(.16,1,.3,1) both}
    .slide-down{animation:slideDown .6s cubic-bezier(.16,1,.3,1) both}
    .scale-in{animation:scaleIn .5s cubic-bezier(.16,1,.3,1) both}
    .fade-in{animation:fadeIn .6s ease both}
    .tilt-in{animation:tiltIn .7s cubic-bezier(.16,1,.3,1) both}
    .skill-slot{animation:skillSlotIn .5s cubic-bezier(.16,1,.3,1) both}
    .modal-reveal{animation:modalReveal .4s cubic-bezier(.16,1,.3,1) both}
    .bar-animate{animation:barGrow 1s cubic-bezier(.16,1,.3,1) both}
    .ring-draw circle:last-child{animation:ringDraw 1.2s ease-out both}

    .gradient-text{
      background:linear-gradient(135deg,#14b8a6,#06b6d4,#2dd4bf,#14b8a6);
      background-size:300% 300%;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      animation:gradientShift 4s ease infinite;
    }

    .glass{
      background:linear-gradient(135deg,rgba(10,26,34,.92),rgba(7,16,21,.96));
      backdrop-filter:blur(20px);
      border:1px solid rgba(30,58,66,.4);
      transition:all .5s cubic-bezier(.16,1,.3,1);
    }
    .glass:hover{
      border-color:rgba(20,184,166,.25);
      box-shadow:0 16px 50px -12px rgba(20,184,166,.1),0 0 0 1px rgba(20,184,166,.08);
    }
    .glass::before{
      content:'';position:absolute;inset:0;border-radius:inherit;
      background:linear-gradient(135deg,rgba(20,184,166,.04) 0%,transparent 50%,rgba(6,182,212,.02) 100%);
      opacity:0;transition:opacity .5s;pointer-events:none;
    }
    .glass:hover::before{opacity:1}

    .glow-border{position:relative}
    .glow-border::after{
      content:'';position:absolute;inset:-1px;border-radius:inherit;padding:1px;
      background:conic-gradient(from var(--angle,0deg),transparent 40%,#14b8a6 50%,transparent 60%);
      -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
      -webkit-mask-composite:xor;mask-composite:exclude;
      animation:orbitalSpin 4s linear infinite;opacity:0;transition:opacity .5s;pointer-events:none;
    }
    .glow-border:hover::after{opacity:1}
    @property --angle{syntax:'<angle>';initial-value:0deg;inherits:false}

    .shine{position:relative;overflow:hidden}
    .shine::after{
      content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent);
      animation:cardShine 5s ease-in-out infinite;pointer-events:none;
    }

    .card-hover-smooth{
      transition:transform .28s ease, filter .28s ease;
    }
    .card-hover-smooth:hover{
      transform:translateY(-4px);
      filter:drop-shadow(0 14px 30px rgba(20,184,166,.08));
    }

    .hex-badge{
      clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
    }

    .ripple-container{position:relative;overflow:hidden}
    .ripple-circle{
      position:absolute;border-radius:50%;background:rgba(20,184,166,.25);
      transform:scale(0);animation:ripple .6s ease-out;pointer-events:none;
    }

    .dot-grid{
      background-image:radial-gradient(rgba(20,184,166,.06) 1px,transparent 1px);
      background-size:28px 28px;
    }

    .skill-ring{transition:all .3s cubic-bezier(.16,1,.3,1)}
    .skill-ring:hover{transform:scale(1.08)}

    .orbit-container{position:relative}
    .orbit-ring{
      position:absolute;border:1px dashed rgba(30,58,66,.3);border-radius:50%;
      animation:orbitalSpin 20s linear infinite;
    }
    .orbit-dot{
      position:absolute;width:6px;height:6px;border-radius:50%;
      background:#14b8a6;top:-3px;left:50%;margin-left:-3px;
      box-shadow:0 0 8px rgba(20,184,166,.5);
    }

    .particle{position:absolute;border-radius:50%;pointer-events:none}

    .completion-ring{animation:progressPulse 2s ease-in-out infinite}

    .stat-number{animation:countFlip .6s cubic-bezier(.16,1,.3,1) both}

    .course-timeline{position:relative}
    .course-timeline::before{
      content:'';position:absolute;left:19px;top:0;bottom:0;width:2px;
      background:linear-gradient(180deg,#14b8a6 0%,#06b6d4 50%,transparent 100%);
    }

    .glow-text{animation:glowPulse 3s ease-in-out infinite}

    .achievement-badge{
      transition:all .3s ease;
    }
    .achievement-badge:hover{
      transform:translateY(-4px) scale(1.05);
      box-shadow:0 8px 30px -8px var(--badge-shadow);
    }

    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#1e3a42;border-radius:10px}
    ::-webkit-scrollbar-thumb:hover{background:#14b8a6}
  `}</style>
);

/* ─── Hooks ─── */
function useInView(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1, ...opts }
    );
    obs.observe(el);
    return () => obs.disconnect();
  });
  return [ref, visible];
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
      const e = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(target * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, dur]);
  return val;
}

/* ─── 3D Tilt wrapper ─── */
function TiltCard({ children, className = '', intensity = 6 }) {
  void intensity;
  return (
    <div className={`card-hover-smooth ${className}`}>
      {children}
    </div>
  );
}

/* ─── Ripple Button ─── */
function RippleButton({ children, onClick, disabled, className, ...props }) {
  const btnRef = useRef(null);
  const handleClick = (e) => {
    if (disabled) return;
    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const circle = document.createElement('span');
    const d = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = d + 'px';
    circle.style.left = e.clientX - rect.left - d / 2 + 'px';
    circle.style.top = e.clientY - rect.top - d / 2 + 'px';
    circle.className = 'ripple-circle';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
    onClick?.(e);
  };
  return (
    <button ref={btnRef} onClick={handleClick} disabled={disabled}
      className={`ripple-container ${className}`} {...props}>
      {children}
    </button>
  );
}

/* ─── Particles ─── */
function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 12,
      duration: Math.random() * 18 + 14,
      opacity: Math.random() * 0.25 + 0.08,
    })), []);
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(p => (
        <div key={p.id} className="particle"
          style={{
            left: `${p.left}%`, bottom: '-5px', width: p.size, height: p.size,
            background: p.id % 3 === 0 ? '#14b8a6' : p.id % 3 === 1 ? '#06b6d4' : '#2dd4bf',
            opacity: p.opacity,
            animation: `particleFloat ${p.duration}s linear ${p.delay}s infinite`,
          }} />
      ))}
    </div>
  );
}

/* ─── Skill Ring (circular progress) ─── */
function SkillRing({ proficiency, size = 52, strokeWidth = 3.5 }) {
  const meta = PROFICIENCY_META[proficiency] || PROFICIENCY_META.Beginner;
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = meta.rank / 4;
  const dash = pct * circ;
  const Icon = meta.icon;

  return (
    <div className="skill-ring relative cursor-default" style={{ width: size, height: size }}>
      <div className="absolute inset-2 rounded-full blur-md opacity-20" style={{ background: meta.color }} />
      <svg className="w-full h-full -rotate-90 ring-draw" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#0F3A42" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={meta.color} strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${meta.color}50)` }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon size={size * 0.3} style={{ color: meta.color }} />
      </div>
    </div>
  );
}

/* ─── Radar Chart ─── */
function SkillRadar({ skills }) {
  if (skills.length === 0) return null;

  const profCount = { Beginner: 0, Intermediate: 0, Expert: 0, Professional: 0 };
  skills.forEach(s => { if (profCount[s.proficiency] !== undefined) profCount[s.proficiency]++; });
  const max = Math.max(...Object.values(profCount), 1);

  const labels = ['Beginner', 'Intermediate', 'Expert', 'Professional'];
  const values = labels.map(l => profCount[l] / max);
  const size = 180;
  const c = size / 2;
  const r = size * 0.36;
  const angles = labels.map((_, i) => (i * 2 * Math.PI / labels.length) - Math.PI / 2);

  const point = (i, scale) => ({
    x: c + Math.cos(angles[i]) * r * scale,
    y: c + Math.sin(angles[i]) * r * scale,
  });

  const gridLevels = [0.33, 0.66, 1];
  const dataPoints = values.map((v, i) => point(i, v));
  const pathStr = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  const colors = labels.map(l => PROFICIENCY_META[l].color);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {gridLevels.map((lev, li) => (
        <polygon key={li}
          points={angles.map((_, i) => { const p = point(i, lev); return `${p.x},${p.y}`; }).join(' ')}
          fill="none" stroke="#1e3a42" strokeWidth="0.5" opacity={0.3 + li * 0.2}
          strokeDasharray={li < 2 ? '2,3' : 'none'} />
      ))}
      {angles.map((_, i) => {
        const p = point(i, 1);
        return <line key={i} x1={c} y1={c} x2={p.x} y2={p.y} stroke="#1e3a42" strokeWidth="0.5" opacity="0.4" />;
      })}
      <path d={pathStr} fill="url(#radarGrad)" stroke="#14b8a6" strokeWidth="1.5" strokeLinejoin="round" opacity="0.85" />
      {dataPoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#0A1A22" stroke={colors[i]} strokeWidth="2" />
          <circle cx={p.x} cy={p.y} r="1.5" fill={colors[i]} />
        </g>
      ))}
      {angles.map((_, i) => {
        const p = point(i, 1.3);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill={colors[i]} fontSize="8" fontWeight="700">{labels[i].slice(0, 4)}</text>
        );
      })}
      <defs>
        <radialGradient id="radarGrad">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Profile Completion Ring ─── */
function CompletionRing({ pct }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#14b8a6' : '#f59e0b';

  return (
    <div className="completion-ring relative w-[100px] h-[100px]">
      <div className="absolute inset-3 rounded-full blur-lg opacity-15" style={{ background: color }} />
      <svg className="w-full h-full -rotate-90 ring-draw" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#0F3A42" strokeWidth="5" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white tabular-nums">{pct}%</span>
        <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">Complete</span>
      </div>
    </div>
  );
}

/* ─── Achievement Badge ─── */
function AchievementBadge({ icon: Icon, label, value, color, earned }) {
  return (
    <div className={`achievement-badge flex flex-col items-center gap-2 p-4 rounded-2xl border cursor-default
      ${earned
        ? 'glass border-opacity-40'
        : 'bg-[#071015]/40 border-[#1e3a42]/20 opacity-40'}`}
      style={{ '--badge-shadow': `${color}30` }}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
        ${earned ? 'glow-text' : ''}`}
        style={{ background: earned ? `${color}15` : '#0F3A42' }}>
        <Icon size={22} style={{ color: earned ? color : '#374151' }} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-center"
        style={{ color: earned ? color : '#4b5563' }}>
        {label}
      </span>
      {value !== undefined && (
        <span className="text-xs font-black tabular-nums" style={{ color: earned ? '#fff' : '#4b5563' }}>
          {value}
        </span>
      )}
    </div>
  );
}

/* ─── Stats Card ─── */
function StatsCard({ stat, statsVisible, index }) {
  const animVal = useAnimatedNumber(statsVisible ? stat.value : 0);

  return (
    <TiltCard intensity={5}>
      <div className="glass glow-border shine rounded-2xl p-5 text-center relative overflow-hidden
        cursor-default group" style={{ animationDelay: `${index * 0.08}s` }}>
        {/* Top accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-b-full
          opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: stat.color }} />

        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient}
          flex items-center justify-center mx-auto mb-3
          shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
          style={{ boxShadow: `0 8px 20px -4px ${stat.color}25` }}>
          <stat.icon size={18} className="text-white" />
        </div>
        <div className="text-3xl font-black text-white tabular-nums mb-1">{animVal}</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold">{stat.label}</div>
      </div>
    </TiltCard>
  );
}

/* ═══════════════════════════════════════
   MAIN PROFILE
   ═══════════════════════════════════════ */
export default function Profile() {
  const { user, updateUser } = useAuth();
  const [skills, setSkills] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [profileForm, setProfileForm] = useState(buildProfileForm());
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileMessageType, setProfileMessageType] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newProficiency, setNewProficiency] = useState('Beginner');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editSkill, setEditSkill] = useState('');
  const [editProficiency, setEditProficiency] = useState('Beginner');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [justAdded, setJustAdded] = useState(null);

  const [heroRef, heroVisible] = useInView();
  const [skillsRef, skillsVisible] = useInView();
  const [coursesRef, coursesVisible] = useInView();
  const [statsRef, statsVisible] = useInView();
  const [achieveRef, achieveVisible] = useInView();

  useEffect(() => {
    if (user) {
      setProfileForm(buildProfileForm(user));
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [skillsRes, enrollRes, profileRes] = await Promise.all([
        api.get(`/user-skills?user_id=${user.id}`).catch(() => ({ data: [] })),
        api.get(`/enrollments?user_id=${user.id}`).catch(() => ({ data: [] })),
        api.get('/profile').catch(() => ({ data: { user } })),
      ]);
      setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
      setEnrollments(Array.isArray(enrollRes.data) ? enrollRes.data : []);
      setProfileForm(buildProfileForm(profileRes.data?.user || user));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');
    setProfileMessageType('');

    try {
      const payload = {
        ...profileForm,
        ssc_year: Number(profileForm.ssc_year),
        hsc_year: Number(profileForm.hsc_year),
        current_study_year: profileForm.current_study_year ? Number(profileForm.current_study_year) : null,
        current_study_semester: profileForm.current_study_semester ? Number(profileForm.current_study_semester) : null,
        university_graduation_year: profileForm.university_graduation_year ? Number(profileForm.university_graduation_year) : null,
        university_cgpa: profileForm.university_cgpa ? Number(profileForm.university_cgpa) : null,
        years_of_experience: profileForm.years_of_experience ? Number(profileForm.years_of_experience) : 0,
        is_fresher: Boolean(profileForm.is_fresher),
      };

      if (payload.is_fresher) {
        payload.years_of_experience = 0;
        payload.current_job_title = '';
        payload.current_company = '';
        payload.previous_job_title = '';
        payload.previous_company = '';
        payload.previous_job_start = '';
        payload.previous_job_end = '';
        payload.previous_job_description = '';
      }

      const res = await api.put('/profile', payload);
      if (res.data?.user) {
        updateUser(res.data.user);
        setProfileForm(buildProfileForm(res.data.user));
      }
      setProfileMessageType('success');
      setProfileMessage('Profile information saved successfully.');
      setTimeout(() => {
        setProfileMessage('');
        setProfileMessageType('');
      }, 3000);
    } catch (err) {
      console.error('Profile update error:', err.response?.data);
      const validationErrors = err?.response?.data?.errors;
      const errorMessage = err?.response?.data?.message;
      setProfileMessageType('error');
      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0]?.[0] || 'Validation failed';
        setProfileMessage(firstError);
      } else if (errorMessage) {
        setProfileMessage(errorMessage);
      } else if (err.response?.status === 401) {
        setProfileMessage('Session expired. Please login again.');
      } else {
        setProfileMessage(err?.response?.data?.error || 'Failed to update profile. Please try again.');
      }
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setSaving(true);
    try {
      const res = await api.post('/user-skills', {
        user_id: user.id, skill_name: newSkill.trim(), proficiency: newProficiency,
      });
      setSkills((prev) => {
        const idx = prev.findIndex((s) => s.id === res.data.id);
        if (idx >= 0) { const u = [...prev]; u[idx] = res.data; return u; }
        return [...prev, res.data];
      });
      setJustAdded(res.data.id);
      setTimeout(() => setJustAdded(null), 2000);
      setNewSkill(''); setNewProficiency('Beginner'); setShowAddForm(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleUpdateSkill = async (id) => {
    setSaving(true);
    try {
      const res = await api.put(`/user-skills/${id}`, { skill_name: editSkill, proficiency: editProficiency });
      setSkills((prev) => prev.map((s) => (s.id === id ? res.data : s)));
      setEditingId(null);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.delete(`/user-skills/${id}`);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      setDeleteConfirm(null);
    } catch (err) { console.error(err); }
  };

  const startEdit = (skill) => {
    setEditingId(skill.id); setEditSkill(skill.skill_name); setEditProficiency(skill.proficiency);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be less than 5MB'); return; }
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('user_id', user.id);
      const res = await api.post('/upload-avatar', formData);
      if (res.data?.user) updateUser(res.data.user);
    } catch (err) { console.error(err); }
    finally { setUploadingAvatar(false); if (avatarInputRef.current) avatarInputRef.current.value = ''; }
  };

  // Computed
  const profCounts = useMemo(() => {
    const c = { Beginner: 0, Intermediate: 0, Expert: 0, Professional: 0 };
    skills.forEach(s => { if (c[s.proficiency] !== undefined) c[s.proficiency]++; });
    return c;
  }, [skills]);

  const completionPct = useMemo(() => {
    const baseRequired = [
      'name',
      'email',
      'phone',
      'date_of_birth',
      'gender',
      'marital_status',
      'nationality',
      'present_address',
      'permanent_address',
      'school_name',
      'ssc_year',
      'ssc_result',
      'ssc_group',
      'ssc_board',
      'college_name',
      'hsc_year',
      'hsc_result',
      'hsc_group',
      'hsc_board',
      'university_name',
      'university_status',
      'university_cgpa',
    ];

    const universityConditional = profileForm.university_status === 'studying'
      ? ['current_study_year', 'current_study_semester']
      : ['university_graduation_year'];

    const jobConditional = profileForm.is_fresher
      ? []
      : ['years_of_experience', 'current_job_title', 'current_company', 'previous_job_title', 'previous_company', 'previous_job_start', 'previous_job_end', 'previous_job_description'];

    const requiredFields = [...baseRequired, ...universityConditional, ...jobConditional];
    const filledCount = requiredFields.filter((key) => {
      const val = profileForm[key];
      return val !== null && val !== undefined && String(val).trim() !== '';
    }).length;

    return requiredFields.length ? Math.round((filledCount / requiredFields.length) * 100) : 0;
  }, [profileForm]);

  const achievements = useMemo(() => [
    { icon: Code2, label: 'First Skill', earned: skills.length >= 1, color: '#14b8a6' },
    { icon: Layers, label: '5 Skills', earned: skills.length >= 5, color: '#06b6d4', value: `${skills.length}/5` },
    { icon: Crown, label: 'Professional', earned: profCounts.Professional >= 1, color: '#a855f7' },
    { icon: Zap, label: 'Expert', earned: profCounts.Expert >= 1, color: '#10b981' },
    { icon: BookOpen, label: 'Learner', earned: enrollments.length >= 1, color: '#3b82f6' },
    { icon: Star, label: 'Diverse', earned: Object.values(profCounts).filter(v => v > 0).length >= 3, color: '#f59e0b' },
    { icon: Camera, label: 'Avatar Set', earned: !!user?.avatar, color: '#ec4899' },
    { icon: Shield, label: 'Complete', earned: completionPct >= 80, color: '#2dd4bf' },
  ], [skills, enrollments, profCounts, completionPct, user]);

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg,#050D11,#0A1A22,#071218)' }}>
        <div className="glass rounded-2xl p-10 text-center scale-in">
          <User size={40} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg font-semibold">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <InjectStyles />
      <div className="min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#050D11 0%,#0A1A22 35%,#071218 100%)' }}>

        <Particles />

        {/* Background layers */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="blob-1 absolute -top-[15%] -right-[10%] w-[500px] h-[500px] bg-[#14b8a6]/[0.025]" />
          <div className="blob-2 absolute -bottom-[15%] -left-[10%] w-[550px] h-[550px] bg-[#06b6d4]/[0.025]" />
          <div className="dot-grid absolute inset-0 opacity-30" />
        </div>

        {/* Upload overlay */}
        {uploadingAvatar && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center fade-in">
            <div className="glass rounded-3xl p-10 flex flex-col items-center gap-5 shadow-2xl scale-in">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[#1e3a42] border-t-[#14b8a6] animate-spin" />
                <Camera size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#14b8a6]" />
              </div>
              <p className="text-white font-bold">Uploading your photo...</p>
              <p className="text-gray-600 text-xs">This won't take long</p>
            </div>
          </div>
        )}

        <div className="relative z-10 pt-24 pb-20">
          <div className="max-w-[960px] mx-auto px-6 sm:px-8 lg:px-12">

            {/* ═══════════════════════════════════
                HERO PROFILE HEADER
               ═══════════════════════════════════ */}
            <div ref={heroRef} className={`mb-10 ${heroVisible ? 'slide-down' : 'opacity-0'}`}>
              <TiltCard intensity={4}>
                <div className="glass glow-border shine rounded-3xl p-7 sm:p-9 relative overflow-hidden">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(ellipse,rgba(20,184,166,.06),transparent_70%)] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[radial-gradient(ellipse,rgba(6,182,212,.04),transparent_70%)] pointer-events-none" />

                  <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-7">
                    {/* Avatar + Completion */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative group">
                        {/* Orbital rings */}
                        <div className="orbit-container">
                          <div className="orbit-ring" style={{ width: 110, height: 110, top: -11, left: -11 }}>
                            <div className="orbit-dot" />
                          </div>
                        </div>

                        <div onClick={() => !uploadingAvatar && avatarInputRef.current?.click()}
                          className="w-[88px] h-[88px] rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4]
                            flex items-center justify-center shadow-xl shadow-[#14b8a6]/20 cursor-pointer
                            overflow-hidden relative z-10 transition-transform duration-300 group-hover:scale-105">
                          {uploadingAvatar ? (
                            <Loader2 size={30} className="text-white animate-spin" />
                          ) : user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl font-black text-white">{user.name?.[0]?.toUpperCase()}</span>
                          )}
                          {/* Hover camera overlay */}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl">
                            <Camera size={22} className="text-white" />
                          </div>
                        </div>
                        <input ref={avatarInputRef} type="file"
                          accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                          onChange={handleAvatarUpload} className="hidden" />

                        {/* Online dot */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0A1A22]
                          flex items-center justify-center z-20">
                          <div className="w-3 h-3 rounded-full bg-emerald-400 relative">
                            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                          </div>
                        </div>
                      </div>

                      <CompletionRing pct={completionPct} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 text-center sm:text-left pt-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                        bg-[#14b8a6]/[0.08] border border-[#14b8a6]/20 mb-3">
                        <Sparkles size={11} className="text-[#14b8a6] animate-pulse" />
                        <span className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-[0.2em]">Profile</span>
                      </div>

                      <h1 className="text-3xl sm:text-4xl font-black text-white mb-1.5 leading-tight">
                        {user.name}
                      </h1>
                      <p className="text-gray-500 text-sm mb-5">{user.email}</p>

                      {/* Quick stats */}
                      <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                        {[
                          { icon: Award, label: 'Skills', value: skills.length, color: '#2dd4bf' },
                          { icon: BookOpen, label: 'Courses', value: enrollments.length, color: '#06b6d4' },
                          { icon: Crown, label: 'Pro Skills', value: profCounts.Professional, color: '#a855f7' },
                          { icon: Zap, label: 'Expert', value: profCounts.Expert, color: '#10b981' },
                        ].map((stat, i) => (
                          <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl
                            bg-[#071015]/50 border border-[#1e3a42]/30 hover:border-[#14b8a6]/20
                            transition-all duration-300 group/stat cursor-default"
                            style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center
                              group-hover/stat:scale-110 transition-transform duration-300"
                              style={{ background: `${stat.color}12` }}>
                              <stat.icon size={14} style={{ color: stat.color }} />
                            </div>
                            <div>
                              <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">{stat.label}</div>
                              <div className="text-sm font-black text-white tabular-nums">{stat.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Radar chart */}
                    <div className="hidden lg:block shrink-0">
                      <div className="text-center mb-2">
                        <span className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-bold">Skill Map</span>
                      </div>
                      <SkillRadar skills={skills} />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* ═══════════════════════════════════
                PROFILE DETAILS FORM
               ═══════════════════════════════════ */}
            <div className="mb-10 slide-up" style={{ animationDelay: '0.08s' }}>
              <TiltCard intensity={2}>
                <div className="glass glow-border shine rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px]
                    bg-gradient-to-r from-transparent via-[#14b8a6]/30 to-transparent" />

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4]
                      flex items-center justify-center shadow-lg shadow-[#14b8a6]/20">
                      <FileText size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Complete Personal Profile</h2>
                      <p className="text-[11px] text-gray-600">All fields are required and saved in the database</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} noValidate className="space-y-7">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-sm font-bold text-[#2dd4bf] uppercase tracking-[0.18em] mb-4">Personal Information</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Full Name</label>
                          <div className="relative">
                            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input name="name" value={profileForm.name} onChange={handleProfileChange} required
                              className="w-full pl-9 pr-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Email</label>
                          <div className="relative">
                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} required
                              className="w-full pl-9 pr-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Phone</label>
                          <div className="relative">
                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input name="phone" value={profileForm.phone} onChange={handleProfileChange} required
                              className="w-full pl-9 pr-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Date of Birth</label>
                          <input type="date" name="date_of_birth" value={profileForm.date_of_birth} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Gender</label>
                          <select name="gender" value={profileForm.gender} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40">
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Marital Status</label>
                          <select name="marital_status" value={profileForm.marital_status} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40">
                            <option value="">Select status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Nationality</label>
                          <input name="nationality" value={profileForm.nationality} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Present Address</label>
                          <div className="relative">
                            <MapPin size={14} className="absolute left-3 top-3.5 text-gray-600" />
                            <textarea name="present_address" value={profileForm.present_address} onChange={handleProfileChange} rows={2} required
                              className="w-full pl-9 pr-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Permanent Address</label>
                          <div className="relative">
                            <MapPin size={14} className="absolute left-3 top-3.5 text-gray-600" />
                            <textarea name="permanent_address" value={profileForm.permanent_address} onChange={handleProfileChange} rows={2} required
                              className="w-full pl-9 pr-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div>
                      <h3 className="text-sm font-bold text-[#2dd4bf] uppercase tracking-[0.18em] mb-4">Academic Information</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">School Name</label>
                          <input name="school_name" value={profileForm.school_name} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">SSC Year</label>
                          <input type="number" min="1950" max="2100" name="ssc_year" value={profileForm.ssc_year} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">SSC Result</label>
                          <input name="ssc_result" value={profileForm.ssc_result} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">SSC Group</label>
                          <select name="ssc_group" value={profileForm.ssc_group} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40">
                            <option value="">Select group</option>
                            {EDUCATION_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">SSC Board</label>
                          <select name="ssc_board" value={profileForm.ssc_board} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40">
                            <option value="">Select board</option>
                            {BANGLADESH_EDUCATION_BOARDS.map((board) => <option key={board} value={board}>{board}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">College Name</label>
                          <input name="college_name" value={profileForm.college_name} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">HSC Year</label>
                          <input type="number" min="1950" max="2100" name="hsc_year" value={profileForm.hsc_year} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">HSC Result</label>
                          <input name="hsc_result" value={profileForm.hsc_result} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">HSC Group</label>
                          <select name="hsc_group" value={profileForm.hsc_group} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40">
                            <option value="">Select group</option>
                            {EDUCATION_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">HSC Board</label>
                          <select name="hsc_board" value={profileForm.hsc_board} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40">
                            <option value="">Select board</option>
                            {BANGLADESH_EDUCATION_BOARDS.map((board) => <option key={board} value={board}>{board}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">University Name</label>
                          <input name="university_name" value={profileForm.university_name} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">University Status</label>
                          <select name="university_status" value={profileForm.university_status} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40">
                            <option value="">Select status</option>
                            <option value="studying">Currently Studying</option>
                            <option value="graduated">Graduated</option>
                          </select>
                        </div>
                        {profileForm.university_status === 'studying' && (
                          <>
                            <div>
                              <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Current Year</label>
                              <input type="number" min="1" max="8" name="current_study_year" value={profileForm.current_study_year} onChange={handleProfileChange} required
                                className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Current Semester</label>
                              <input type="number" min="1" max="16" name="current_study_semester" value={profileForm.current_study_semester} onChange={handleProfileChange} required
                                className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                              />
                            </div>
                          </>
                        )}
                        {profileForm.university_status === 'graduated' && (
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Graduation Year</label>
                            <input type="number" min="1950" max="2100" name="university_graduation_year" value={profileForm.university_graduation_year} onChange={handleProfileChange} required
                              className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">University CGPA</label>
                          <input type="number" step="0.01" min="0" max="4" name="university_cgpa" value={profileForm.university_cgpa} onChange={handleProfileChange} required
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Job Experience */}
                    <div>
                      <h3 className="text-sm font-bold text-[#2dd4bf] uppercase tracking-[0.18em] mb-4">Job Experience Information</h3>
                      <div className="mb-4 flex items-center gap-3">
                        <input id="is_fresher" type="checkbox" name="is_fresher" checked={profileForm.is_fresher} onChange={handleProfileChange}
                          className="w-4 h-4 rounded border-[#1e3a42] bg-[#0A1A22] text-[#14b8a6] focus:ring-[#14b8a6]/30" />
                        <label htmlFor="is_fresher" className="text-sm text-gray-300">I am a Fresher (no previous job experience)</label>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Years of Experience</label>
                          <input type="number" min="0" max="60" name="years_of_experience" value={profileForm.is_fresher ? '0' : profileForm.years_of_experience} onChange={handleProfileChange} required={!profileForm.is_fresher} disabled={profileForm.is_fresher}
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div className={profileForm.is_fresher ? 'opacity-50' : ''}>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Current Job Title</label>
                          <div className="relative">
                            <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input name="current_job_title" value={profileForm.current_job_title} onChange={handleProfileChange} required={!profileForm.is_fresher} disabled={profileForm.is_fresher}
                              className="w-full pl-9 pr-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                            />
                          </div>
                        </div>
                        <div className={profileForm.is_fresher ? 'opacity-50' : ''}>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Current Company</label>
                          <div className="relative">
                            <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input name="current_company" value={profileForm.current_company} onChange={handleProfileChange} required={!profileForm.is_fresher} disabled={profileForm.is_fresher}
                              className="w-full pl-9 pr-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                            />
                          </div>
                        </div>
                        <div className={profileForm.is_fresher ? 'opacity-50' : ''}>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Previous Job Title</label>
                          <input name="previous_job_title" value={profileForm.previous_job_title} onChange={handleProfileChange} required={!profileForm.is_fresher} disabled={profileForm.is_fresher}
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div className={profileForm.is_fresher ? 'opacity-50' : ''}>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Previous Company</label>
                          <input name="previous_company" value={profileForm.previous_company} onChange={handleProfileChange} required={!profileForm.is_fresher} disabled={profileForm.is_fresher}
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div className={profileForm.is_fresher ? 'opacity-50' : ''}>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Previous Job Start Date</label>
                          <input type="date" name="previous_job_start" value={profileForm.previous_job_start} onChange={handleProfileChange} required={!profileForm.is_fresher} disabled={profileForm.is_fresher}
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div className={profileForm.is_fresher ? 'opacity-50' : ''}>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Previous Job End Date</label>
                          <input type="date" name="previous_job_end" value={profileForm.previous_job_end} onChange={handleProfileChange} required={!profileForm.is_fresher} disabled={profileForm.is_fresher}
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                        <div className={`sm:col-span-2 ${profileForm.is_fresher ? 'opacity-50' : ''}`}>
                          <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">Previous Job Responsibilities</label>
                          <textarea name="previous_job_description" value={profileForm.previous_job_description} onChange={handleProfileChange} rows={3} required={!profileForm.is_fresher} disabled={profileForm.is_fresher}
                            className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40"
                          />
                        </div>
                      </div>
                    </div>

                    {profileMessage && (
                      <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                        profileMessageType === 'success'
                          ? 'border-emerald-400/40 bg-emerald-500/12 text-emerald-200'
                          : 'border-rose-400/40 bg-rose-500/12 text-rose-200'
                      }`}>
                        {profileMessage}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <RippleButton type="submit" disabled={profileSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-white text-sm font-bold rounded-xl cursor-pointer hover:shadow-lg hover:shadow-[#14b8a6]/20 disabled:opacity-60 transition-all duration-300">
                        {profileSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {profileSaving ? 'Saving profile...' : 'Save Full Profile'}
                      </RippleButton>
                    </div>
                  </form>
                </div>
              </TiltCard>
            </div>

            {/* ═══════════════════════════════════
                ACHIEVEMENTS
               ═══════════════════════════════════ */}
            <div ref={achieveRef} className={`mb-10 ${achieveVisible ? 'slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#f97316]
                  flex items-center justify-center shadow-lg shadow-amber-500/15">
                  <Star size={15} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Achievements</h2>
                  <p className="text-[11px] text-gray-600">
                    {achievements.filter(a => a.earned).length} of {achievements.length} unlocked
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {achievements.map((a, i) => (
                  <div key={i} className="scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    <AchievementBadge {...a} />
                  </div>
                ))}
              </div>
            </div>

            {/* ═══════════════════════════════════
                SKILLS SECTION
               ═══════════════════════════════════ */}
            <div ref={skillsRef} className={`mb-10 ${skillsVisible ? 'slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.15s' }}>
              <TiltCard intensity={2}>
                <div className="glass glow-border shine rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px]
                    bg-gradient-to-r from-transparent via-[#14b8a6]/30 to-transparent" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-7 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4]
                        flex items-center justify-center shadow-lg shadow-[#14b8a6]/20">
                        <Award size={18} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">My Skills</h2>
                        <p className="text-[11px] text-gray-600">Manage your expertise</p>
                      </div>
                    </div>
                    {!showAddForm && (
                      <RippleButton onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#14b8a6] to-[#06b6d4]
                          text-white text-sm font-bold rounded-xl cursor-pointer
                          hover:shadow-xl hover:shadow-[#14b8a6]/20 hover:scale-[1.03] active:scale-[0.97]
                          transition-all duration-300">
                        <Plus size={16} /> Add Skill
                      </RippleButton>
                    )}
                  </div>

                  {/* Proficiency legend */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {PROFICIENCY_LEVELS.map(level => {
                      const meta = PROFICIENCY_META[level];
                      const Icon = meta.icon;
                      return (
                        <div key={level} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-default
                          transition-all duration-200 hover:scale-105"
                          style={{ background: meta.bg, borderColor: `${meta.color}20` }}>
                          <Icon size={11} style={{ color: meta.color }} />
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>
                            {level}
                          </span>
                          <span className="text-[10px] font-black tabular-nums ml-1"
                            style={{ color: `${meta.color}80` }}>
                            {profCounts[level]}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add form */}
                  {showAddForm && (
                    <div className="scale-in mb-6">
                      <form onSubmit={handleAddSkill}
                        className="bg-[#071015]/70 border border-[#14b8a6]/15 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px]
                          bg-gradient-to-r from-transparent via-[#14b8a6]/50 to-transparent" />

                        <h3 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
                          <Sparkles size={14} className="text-[#14b8a6]" /> Add New Skill
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4 mb-5">
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">
                              Skill Name
                            </label>
                            <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="e.g. React, Python, Docker..."
                              className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl
                                text-white text-sm placeholder:text-gray-600
                                focus:outline-none focus:border-[#14b8a6]/40 focus:ring-2 focus:ring-[#14b8a6]/10
                                transition-all duration-300"
                              required />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-[0.15em] font-bold">
                              Proficiency Level
                            </label>
                            <div className="relative">
                              <select value={newProficiency} onChange={(e) => setNewProficiency(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-xl
                                  text-white text-sm appearance-none cursor-pointer
                                  focus:outline-none focus:border-[#14b8a6]/40 focus:ring-2 focus:ring-[#14b8a6]/10
                                  transition-all duration-300">
                                {PROFICIENCY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                              </select>
                              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Preview */}
                        <div className="flex items-center gap-3 p-3 bg-[#0A1A22]/50 border border-[#1e3a42]/25 rounded-xl mb-5">
                          <SkillRing proficiency={newProficiency} size={40} strokeWidth={3} />
                          <div>
                            <div className="text-xs text-gray-400 font-medium">{newSkill || 'Skill preview'}</div>
                            <div className="text-[10px] font-bold" style={{ color: PROFICIENCY_META[newProficiency].color }}>
                              {PROFICIENCY_META[newProficiency].label}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <RippleButton type="submit" disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#14b8a6] to-[#06b6d4]
                              text-white text-sm font-bold rounded-xl cursor-pointer
                              hover:shadow-lg hover:shadow-[#14b8a6]/20 disabled:opacity-50 transition-all duration-300">
                            <Save size={14} /> {saving ? 'Saving...' : 'Save Skill'}
                          </RippleButton>
                          <button type="button"
                            onClick={() => { setShowAddForm(false); setNewSkill(''); setNewProficiency('Beginner'); }}
                            className="px-5 py-2.5 text-gray-400 hover:text-white text-sm font-medium
                              rounded-xl hover:bg-[#1e3a42]/20 transition-all duration-200 cursor-pointer">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Skills list */}
                  {loading ? (
                    <div className="space-y-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-20 bg-[#071015]/40 border border-[#1e3a42]/20 rounded-xl animate-pulse"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  ) : skills.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-[#1e3a42]/30 rounded-2xl">
                      <div className="w-16 h-16 rounded-2xl bg-[#0F3A42]/30 flex items-center justify-center mx-auto mb-4 float-1">
                        <Award size={28} className="text-gray-600" />
                      </div>
                      <p className="text-gray-400 font-bold mb-1">No skills added yet</p>
                      <p className="text-gray-600 text-xs mb-5">Start building your skill portfolio</p>
                      <button onClick={() => setShowAddForm(true)}
                        className="px-5 py-2.5 bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-xl
                          text-[#2dd4bf] text-sm font-bold hover:bg-[#14b8a6]/20 transition-all cursor-pointer">
                        <Plus size={14} className="inline mr-1" /> Add Your First Skill
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {skills.map((skill, idx) => {
                        const meta = PROFICIENCY_META[skill.proficiency] || PROFICIENCY_META.Beginner;
                        const pctWidth = `${(meta.rank / 4) * 100}%`;
                        const isJustAdded = justAdded === skill.id;

                        return (
                          <div key={skill.id} className={`skill-slot group relative ${isJustAdded ? 'scale-in' : ''}`}
                            style={{ animationDelay: `${idx * 0.05}s` }}>

                            {/* Delete confirm overlay */}
                            {deleteConfirm === skill.id && (
                              <div className="absolute inset-0 z-20 bg-red-950/80 backdrop-blur-sm rounded-2xl
                                flex items-center justify-center gap-3 scale-in border border-red-500/20">
                                <p className="text-red-300 text-sm font-medium">Delete this skill?</p>
                                <button onClick={() => handleDeleteSkill(skill.id)}
                                  className="px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg
                                    hover:bg-red-600 transition-colors cursor-pointer">
                                  Delete
                                </button>
                                <button onClick={() => setDeleteConfirm(null)}
                                  className="px-4 py-1.5 bg-[#1e3a42] text-gray-300 text-xs font-medium rounded-lg
                                    hover:bg-[#1e3a42]/80 transition-colors cursor-pointer">
                                  Cancel
                                </button>
                              </div>
                            )}

                            <div className={`bg-[#071015]/50 border rounded-2xl p-4 sm:p-5
                              transition-all duration-400 relative overflow-hidden
                              ${isJustAdded
                                ? 'border-[#14b8a6]/40 shadow-lg shadow-[#14b8a6]/10'
                                : 'border-[#1e3a42]/30 hover:border-[#14b8a6]/20'
                              }
                              hover:shadow-md hover:shadow-[#14b8a6]/5`}>

                              {/* Accent line */}
                              <div className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: `linear-gradient(90deg, transparent, ${meta.color}50, transparent)` }} />

                              {/* Just added confetti-like sparkle */}
                              {isJustAdded && (
                                <div className="absolute top-2 right-2">
                                  <Sparkles size={14} className="text-[#14b8a6] animate-pulse" />
                                </div>
                              )}

                              {editingId === skill.id ? (
                                /* ── Edit Mode ── */
                                <div className="scale-in">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                    <div className="flex-1 w-full sm:w-auto">
                                      <input type="text" value={editSkill}
                                        onChange={(e) => setEditSkill(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-[#0A1A22]/80 border border-[#1e3a42]/50
                                          rounded-xl text-white text-sm focus:outline-none focus:border-[#14b8a6]/40
                                          focus:ring-2 focus:ring-[#14b8a6]/10 transition-all" />
                                    </div>
                                    <div className="relative">
                                      <select value={editProficiency} onChange={(e) => setEditProficiency(e.target.value)}
                                        className="px-4 py-2.5 bg-[#0A1A22]/80 border border-[#1e3a42]/50
                                          rounded-xl text-white text-sm appearance-none pr-9 cursor-pointer
                                          focus:outline-none focus:border-[#14b8a6]/40 transition-all">
                                        {PROFICIENCY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                                      </select>
                                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                    </div>
                                    <div className="flex gap-2">
                                      <RippleButton onClick={() => handleUpdateSkill(skill.id)} disabled={saving}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs
                                          font-bold rounded-xl transition-all cursor-pointer">
                                        <Save size={12} className="inline mr-1" /> Save
                                      </RippleButton>
                                      <button onClick={() => setEditingId(null)}
                                        className="px-4 py-2 text-gray-400 hover:text-white text-xs rounded-xl
                                          hover:bg-[#1e3a42]/20 transition-all cursor-pointer">
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* ── Display Mode ── */
                                <div className="flex items-center gap-4">
                                  <SkillRing proficiency={skill.proficiency} />

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-white font-bold text-[15px]">{skill.skill_name}</span>
                                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider border"
                                        style={{ background: meta.bg, color: meta.color, borderColor: `${meta.color}25` }}>
                                        {skill.proficiency}
                                      </span>
                                    </div>
                                    {/* Progress bar */}
                                    <div className="w-full h-2 bg-[#0F3A42]/50 rounded-full overflow-hidden">
                                      <div className="h-full rounded-full bar-animate relative"
                                        style={{
                                          width: pctWidth,
                                          background: `linear-gradient(90deg, ${meta.color}, ${meta.color}80)`,
                                          boxShadow: `0 0 10px ${meta.color}30`,
                                        }}>
                                        {/* Shine on bar */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full"
                                          style={{ animation: 'cardShine 3s ease-in-out infinite' }} />
                                      </div>
                                    </div>
                                    <div className="flex justify-between mt-1.5">
                                      <span className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">
                                        {meta.label}
                                      </span>
                                      <span className="text-[9px] font-bold tabular-nums" style={{ color: `${meta.color}80` }}>
                                        {meta.rank}/4
                                      </span>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0">
                                    <button onClick={() => startEdit(skill)} title="Edit"
                                      className="w-8 h-8 flex items-center justify-center rounded-lg
                                        text-gray-500 hover:text-[#2dd4bf] hover:bg-[#14b8a6]/10
                                        transition-all duration-200 cursor-pointer hover:scale-110">
                                      <Pencil size={13} />
                                    </button>
                                    <button onClick={() => setDeleteConfirm(skill.id)} title="Delete"
                                      className="w-8 h-8 flex items-center justify-center rounded-lg
                                        text-gray-500 hover:text-red-400 hover:bg-red-500/10
                                        transition-all duration-200 cursor-pointer hover:scale-110">
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TiltCard>
            </div>

            {/* ═══════════════════════════════════
                ENROLLED COURSES — TIMELINE
               ═══════════════════════════════════ */}
            <div ref={coursesRef} className={`mb-10 ${coursesVisible ? 'slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}>
              <TiltCard intensity={2}>
                <div className="glass glow-border shine rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px]
                    bg-gradient-to-r from-transparent via-[#06b6d4]/30 to-transparent" />

                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#3b82f6]
                      flex items-center justify-center shadow-lg shadow-[#06b6d4]/20">
                      <BookOpen size={18} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Learning Journey</h2>
                      <p className="text-[11px] text-gray-600">{enrollments.length} courses enrolled</p>
                    </div>
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {[1,2].map(i => (
                        <div key={i} className="h-16 bg-[#071015]/40 border border-[#1e3a42]/20 rounded-xl animate-pulse"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  ) : enrollments.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-[#1e3a42]/30 rounded-2xl">
                      <div className="w-16 h-16 rounded-2xl bg-[#06b6d4]/10 flex items-center justify-center mx-auto mb-4 float-2">
                        <BookOpen size={28} className="text-gray-600" />
                      </div>
                      <p className="text-gray-400 font-bold mb-1">No courses enrolled</p>
                      <p className="text-gray-600 text-xs">Visit Resources to start learning</p>
                    </div>
                  ) : (
                    <div className="course-timeline space-y-0 ml-5">
                      {enrollments.map((enrollment, i) => (
                        <div key={enrollment.id} className="relative pl-10 pb-6 last:pb-0 tilt-in group"
                          style={{ animationDelay: `${i * 0.08}s` }}>
                          {/* Timeline dot */}
                          <div className="absolute left-[-1px] top-1 w-[10px] h-[10px] rounded-full
                            bg-[#0A1A22] border-2 border-[#14b8a6] z-10
                            group-hover:border-[#2dd4bf] group-hover:shadow-lg group-hover:shadow-[#14b8a6]/30
                            transition-all duration-300">
                            <div className="absolute inset-0 rounded-full bg-[#14b8a6] opacity-0
                              group-hover:opacity-100 transition-opacity duration-300 scale-75" />
                          </div>

                          <div className="bg-[#071015]/50 border border-[#1e3a42]/30 rounded-xl p-4
                            hover:border-[#06b6d4]/20 hover:shadow-md hover:shadow-[#06b6d4]/5
                            transition-all duration-300 group-hover:translate-x-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                bg-[#06b6d4]/10 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen size={16} className="text-[#06b6d4]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-bold text-sm truncate
                                  group-hover:text-[#2dd4bf] transition-colors">
                                  {enrollment.course?.name || 'Course'}
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-1.5">
                                  {enrollment.course?.topic && (
                                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                      <Layers size={9} /> {enrollment.course.topic}
                                    </span>
                                  )}
                                  {enrollment.course?.level && (
                                    <span className="text-[10px] px-2 py-0.5 bg-[#14b8a6]/10 text-[#2dd4bf]
                                      rounded-full border border-[#14b8a6]/15 font-semibold">
                                      {enrollment.course.level}
                                    </span>
                                  )}
                                  {enrollment.course?.duration && (
                                    <span className="text-[10px] text-gray-600 flex items-center gap-1">
                                      <Clock size={9} /> {enrollment.course.duration}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight size={14} className="text-gray-700 group-hover:text-[#14b8a6]
                                group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TiltCard>
            </div>

            {/* ═══════════════════════════════════
                STATS GRID
               ═══════════════════════════════════ */}
            <div ref={statsRef} className={`${statsVisible ? 'slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.25s' }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Skills', value: skills.length, icon: Award, color: '#2dd4bf', gradient: 'from-[#14b8a6] to-[#06b6d4]' },
                  { label: 'Professional', value: profCounts.Professional, icon: Crown, color: '#a855f7', gradient: 'from-[#a855f7] to-[#7c3aed]' },
                  { label: 'Expert', value: profCounts.Expert, icon: Zap, color: '#10b981', gradient: 'from-[#10b981] to-[#059669]' },
                  { label: 'Courses', value: enrollments.length, icon: BookOpen, color: '#06b6d4', gradient: 'from-[#06b6d4] to-[#3b82f6]' },
                ].map((stat, i) => (
                  <StatsCard
                    key={stat.label}
                    stat={stat}
                    statsVisible={statsVisible}
                    index={i}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}