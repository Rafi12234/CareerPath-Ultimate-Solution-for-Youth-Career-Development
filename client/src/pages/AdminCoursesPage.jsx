import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, LogOut, Menu, X, Plus, Trash2, FileVideo, Upload,
  Edit2, ChevronUp, ChevronDown, Users, Briefcase, ClipboardList,
  LayoutDashboard, GraduationCap, Sparkles, Clock, User, Layers,
  Film, Save, RotateCcw, Eye, Image, PlayCircle, Zap, ArrowRight,
  Search, Filter, MoreVertical, Star, TrendingUp, CheckCircle,
  AlertCircle, Loader2, ChevronRight, Hash, Grip
} from 'lucide-react';
import api from '../utils/api';

const FALLBACK_COURSE_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop';

/* ═══════════════════════════════════════
   INJECTED STYLES
   ═══════════════════════════════════════ */
const InjectStyles = () => (
  <style>{`
    @keyframes morphBlob1 {
      0%, 100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; transform: rotate(0deg) scale(1); }
      25% { border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%; transform: rotate(90deg) scale(1.05); }
      50% { border-radius: 30% 70% 40% 60% / 55% 30% 70% 45%; transform: rotate(180deg) scale(0.95); }
      75% { border-radius: 55% 45% 60% 40% / 40% 70% 30% 60%; transform: rotate(270deg) scale(1.02); }
    }
    @keyframes morphBlob2 {
      0%, 100% { border-radius: 58% 42% 30% 70% / 55% 45% 55% 45%; transform: rotate(0deg); }
      33% { border-radius: 40% 60% 60% 40% / 60% 30% 70% 40%; transform: rotate(120deg); }
      66% { border-radius: 60% 40% 45% 55% / 35% 65% 35% 65%; transform: rotate(240deg); }
    }
    @keyframes floatSlow { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-18px) rotate(3deg); } }
    @keyframes floatMed { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(-2deg); } }
    @keyframes floatFast { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-25px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideLeft {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.85); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes modalReveal {
      from { opacity: 0; transform: translateY(60px) scale(0.92); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes modalBg {
      from { opacity: 0; backdrop-filter: blur(0px); }
      to { opacity: 1; backdrop-filter: blur(16px); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes borderRotate {
      from { --angle: 0deg; }
      to { --angle: 360deg; }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(20,184,166,0.3); }
      50% { box-shadow: 0 0 0 8px rgba(20,184,166,0); }
    }
    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    @keyframes cardShine {
      0% { left: -100%; }
      50%, 100% { left: 150%; }
    }
    @keyframes rippleEffect {
      to { transform: scale(2.5); opacity: 0; }
    }
    @keyframes barGrow {
      from { width: 0%; }
    }
    @keyframes scanLine {
      0% { top: -10%; }
      100% { top: 110%; }
    }
    @keyframes orbFloat {
      0% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(20px, -30px) scale(1.08); }
      50% { transform: translate(-15px, -50px) scale(0.92); }
      75% { transform: translate(30px, -15px) scale(1.04); }
      100% { transform: translate(0, 0) scale(1); }
    }
    @keyframes counterFlip {
      0% { transform: translateY(100%); opacity: 0; }
      60% { transform: translateY(-8%); }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes sidebarItemIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes cardEntrance {
      from { opacity: 0; transform: translateY(30px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes successPop {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes progressPulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    @keyframes rotateIn {
      from { transform: rotate(-180deg) scale(0); opacity: 0; }
      to { transform: rotate(0deg) scale(1); opacity: 1; }
    }
    @keyframes drawLine {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes expandHeight {
      from { max-height: 0; opacity: 0; }
      to { max-height: 2000px; opacity: 1; }
    }
    @keyframes collapseHeight {
      from { max-height: 2000px; opacity: 1; }
      to { max-height: 0; opacity: 0; }
    }
    @keyframes statusDot {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.5); }
    }

    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    .blob-1 { animation: morphBlob1 15s ease-in-out infinite; }
    .blob-2 { animation: morphBlob2 18s ease-in-out infinite; }
    .float-slow { animation: floatSlow 6s ease-in-out infinite; }
    .float-med { animation: floatMed 4.5s ease-in-out infinite; }
    .float-fast { animation: floatFast 3s ease-in-out infinite; }

    .slide-up { animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
    .slide-down { animation: slideDown 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .slide-right { animation: slideRight 0.6s cubic-bezier(0.16,1,0.3,1) both; }
    .slide-left { animation: slideLeft 0.6s cubic-bezier(0.16,1,0.3,1) both; }
    .scale-in { animation: scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in { animation: fadeIn 0.5s ease both; }
    .modal-reveal { animation: modalReveal 0.4s cubic-bezier(0.16,1,0.3,1) both; }
    .modal-bg { animation: modalBg 0.3s ease both; }
    .card-entrance { animation: cardEntrance 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .success-pop { animation: successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
    .rotate-in { animation: rotateIn 0.6s cubic-bezier(0.16,1,0.3,1) both; }

    .gradient-text {
      background: linear-gradient(135deg, #14b8a6, #06b6d4, #2dd4bf, #14b8a6);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 4s ease infinite;
    }

    .glass-card {
      background: linear-gradient(135deg, rgba(10,26,34,0.9) 0%, rgba(7,16,21,0.95) 100%);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(30,58,66,0.4);
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    }
    .glass-card:hover {
      border-color: rgba(20,184,166,0.3);
      box-shadow: 0 16px 48px -12px rgba(20,184,166,0.12), 0 0 0 1px rgba(20,184,166,0.08);
    }

    .shine-effect {
      position: relative;
      overflow: hidden;
    }
    .shine-effect::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 60%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
      animation: cardShine 5s ease-in-out infinite;
    }

    .glow-border {
      position: relative;
    }
    .glow-border::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      padding: 1px;
      background: conic-gradient(from var(--angle, 0deg), transparent 40%, #14b8a6 50%, transparent 60%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      animation: borderRotate 4s linear infinite;
      opacity: 0;
      transition: opacity 0.5s;
    }
    .glow-border:hover::before { opacity: 1; }

    .shimmer-skeleton {
      position: relative;
      overflow: hidden;
      background: rgba(30,58,66,0.15);
    }
    .shimmer-skeleton::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(20,184,166,0.06), transparent);
      animation: shimmer 1.8s ease-in-out infinite;
    }

    .ripple-container { position: relative; overflow: hidden; }
    .ripple-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(20,184,166,0.25);
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out;
      pointer-events: none;
    }

    .dot-grid {
      background-image: radial-gradient(rgba(20,184,166,0.06) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    .scan-line-overlay::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(20,184,166,0.12), transparent);
      animation: scanLine 8s linear infinite;
    }

    .bar-animate { animation: barGrow 1s cubic-bezier(0.16,1,0.3,1) both; }

    .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }

    .sidebar-item-in { animation: sidebarItemIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }

    .status-dot { animation: statusDot 2s ease-in-out infinite; }

    .expand-enter {
      animation: expandHeight 0.4s cubic-bezier(0.16,1,0.3,1) both;
      overflow: hidden;
    }

    .progress-pulse { animation: progressPulse 1.5s ease-in-out infinite; }

    .hover-lift {
      transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
    }
    .hover-lift:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 35px -10px rgba(20,184,166,0.15);
    }

    .input-glow {
      transition: all 0.3s ease;
    }
    .input-glow:focus {
      border-color: rgba(20,184,166,0.5);
      box-shadow: 0 0 0 3px rgba(20,184,166,0.08), 0 0 20px rgba(20,184,166,0.05);
    }

    .btn-primary {
      background: linear-gradient(135deg, #14b8a6, #0d9488);
      transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #0d9488, #0f766e);
      transform: translateY(-1px);
      box-shadow: 0 8px 25px -5px rgba(20,184,166,0.3);
    }
    .btn-primary:active:not(:disabled) {
      transform: translateY(0) scale(0.98);
    }
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-ghost {
      transition: all 0.3s ease;
    }
    .btn-ghost:hover {
      background: rgba(20,184,166,0.08);
      border-color: rgba(20,184,166,0.25);
      color: #2dd4bf;
    }

    .btn-danger {
      transition: all 0.3s ease;
    }
    .btn-danger:hover {
      background: rgba(239,68,68,0.15);
      border-color: rgba(239,68,68,0.3);
      transform: translateY(-1px);
    }

    .course-card-img {
      transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
    }
    .course-card:hover .course-card-img {
      transform: scale(1.08);
    }

    .module-row {
      transition: all 0.3s ease;
    }
    .module-row:hover {
      background: rgba(20,184,166,0.04);
      border-color: rgba(20,184,166,0.2);
    }

    .counter-flip { animation: counterFlip 0.6s cubic-bezier(0.16,1,0.3,1) both; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1e3a42; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #14b8a6; }

    .sidebar-tooltip {
      opacity: 0;
      transform: translateX(-8px);
      transition: all 0.2s ease;
      pointer-events: none;
    }
    .sidebar-item:hover .sidebar-tooltip {
      opacity: 1;
      transform: translateX(0);
    }
  `}</style>
);

/* ═══════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════ */
function useInView(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1, ...opts });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useAnimatedNumber(target, dur = 800) {
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

/* ═══════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════ */

/* Ripple Button */
function RippleButton({ children, onClick, disabled, className = '', ...props }) {
  const btnRef = useRef(null);
  const createRipple = (e) => {
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
    <button ref={btnRef} onClick={createRipple} disabled={disabled} className={`ripple-container ${className}`} {...props}>
      {children}
    </button>
  );
}

/* Toast Notification */
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', text: '#10b981', icon: CheckCircle },
    error: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', text: '#ef4444', icon: AlertCircle },
    info: { bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.25)', text: '#14b8a6', icon: Sparkles },
  };
  const c = colors[type] || colors.info;
  const Icon = c.icon;

  return (
    <div className="fixed top-6 right-6 z-[100] slide-left" style={{ animationDelay: '0s' }}>
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl backdrop-blur-xl border shadow-2xl"
        style={{ background: c.bg, borderColor: c.border, boxShadow: `0 20px 50px -12px ${c.bg}` }}>
        <Icon size={18} style={{ color: c.text }} />
        <span className="text-sm font-semibold" style={{ color: c.text }}>{message}</span>
        <button onClick={onClose} className="ml-2 p-1 rounded-lg hover:bg-white/5 transition">
          <X size={14} style={{ color: c.text }} />
        </button>
      </div>
    </div>
  );
}

/* Stats Card */
function StatCard({ icon: Icon, label, value, color, delay = 0, visible }) {
  const animVal = useAnimatedNumber(visible ? value : 0);
  return (
    <div className="glass-card shine-effect rounded-2xl p-5 group cursor-default card-entrance hover-lift"
      style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
          style={{ background: `${color}12` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div className="w-12 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: `${color}10`, color }}>
          <TrendingUp size={10} className="mr-0.5" /> +{Math.floor(Math.random() * 12 + 1)}%
        </div>
      </div>
      <div className="text-2xl font-black text-white tabular-nums mb-0.5 counter-flip">{animVal}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold">{label}</div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: color }} />
    </div>
  );
}

/* Course Card Skeleton */
function CourseSkeleton({ delay = 0 }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#1e3a42]/30 card-entrance" style={{ animationDelay: `${delay}s` }}>
      <div className="h-44 shimmer-skeleton" />
      <div className="p-5 space-y-3 bg-[#0A1A22]/60">
        <div className="h-5 w-3/4 shimmer-skeleton rounded-lg" />
        <div className="h-3 w-full shimmer-skeleton rounded-lg" />
        <div className="h-3 w-2/3 shimmer-skeleton rounded-lg" />
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-20 shimmer-skeleton rounded-full" />
          <div className="h-7 w-16 shimmer-skeleton rounded-full" />
        </div>
        <div className="flex gap-2 pt-3 border-t border-[#1e3a42]/20">
          <div className="h-9 flex-1 shimmer-skeleton rounded-xl" />
          <div className="h-9 flex-1 shimmer-skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* Empty State */
function EmptyState({ onAdd }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 slide-up">
      <div className="relative mb-6">
        <div className="w-28 h-28 rounded-3xl bg-[#0A1A22] border border-[#1e3a42]/40 flex items-center justify-center float-slow">
          <GraduationCap size={44} className="text-gray-700" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 flex items-center justify-center scale-in"
          style={{ animationDelay: '0.3s' }}>
          <Plus size={18} className="text-[#14b8a6]" />
        </div>
        <div className="absolute -bottom-1 -left-3 w-6 h-6 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/20 float-fast scale-in"
          style={{ animationDelay: '0.5s' }} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No courses yet</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-sm text-center">Create your first course to get started with content management</p>
      <RippleButton onClick={onAdd}
        className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm cursor-pointer">
        <Plus size={16} /> Create First Course
      </RippleButton>
    </div>
  );
}

/* Animated Input */
function AnimInput({ label, icon: Icon, type = 'text', value, onChange, placeholder, required, rows, className = '' }) {
  const [focused, setFocused] = useState(false);
  const isTextarea = rows && rows > 1;
  const Comp = isTextarea ? 'textarea' : 'input';

  return (
    <div className={`relative group ${className}`}>
      {label && (
        <label className={`block text-[10px] font-bold uppercase tracking-[0.15em] mb-2 transition-colors duration-300 ${focused ? 'text-[#14b8a6]' : 'text-gray-500'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-all duration-300 ${focused ? 'text-[#14b8a6] scale-110' : 'text-gray-600'}`}>
            <Icon size={15} />
          </div>
        )}
        <Comp
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-[#071015]/60 border border-[#1e3a42]/50 rounded-xl text-white text-sm placeholder-gray-600/80 input-glow outline-none`}
        />
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent rounded-full transition-all duration-500 ${focused ? 'w-[80%] opacity-100' : 'w-0 opacity-0'}`} />
      </div>
    </div>
  );
}

/* Level Badge */
function LevelBadge({ level }) {
  const config = {
    Beginner: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)' },
    Intermediate: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.25)' },
    Advanced: { bg: 'rgba(168,85,247,0.12)', color: '#a855f7', border: 'rgba(168,85,247,0.25)' },
  };
  const c = config[level] || config.Beginner;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
      style={{ background: c.bg, color: c.color, borderColor: c.border }}>
      <Star size={9} /> {level}
    </span>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  // Module management
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedCourseForModules, setSelectedCourseForModules] = useState(null);
  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editingModule, setEditingModule] = useState(null);

  // Upload states
  const [uploadingImageCourseId, setUploadingImageCourseId] = useState(null);
  const [uploadingVideoModuleId, setUploadingVideoModuleId] = useState(null);
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [newCourseCoverFile, setNewCourseCoverFile] = useState(null);
  const [newCourseModules, setNewCourseModules] = useState([]);
  const [newCourseModuleForm, setNewCourseModuleForm] = useState({
    title: '', description: '', duration: '', sequence: 1, videoFile: null,
  });
  const [editingNewCourseModuleIndex, setEditingNewCourseModuleIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: '', description: '', topic: '', instructor: '', duration: '', level: 'Beginner', cover_image: ''
  });

  const [moduleFormData, setModuleFormData] = useState({
    title: '', description: '', duration: '', sequence: 1
  });

  const [statsRef, statsVisible] = useInView();
  const [cardsRef, cardsVisible] = useInView();

  useEffect(() => {
    const admin = localStorage.getItem('admin_user');
    if (!admin) { navigate('/login'); return; }
    fetchCourses();
  }, [navigate]);

  // ── API Functions ──
  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      const courseData = res.data?.data?.data || res.data?.data || res.data || [];
      setCourses(Array.isArray(courseData) ? courseData : []);
    } catch { setCourses([]); }
    finally { setLoading(false); }
  };

  const fetchModules = async (courseId) => {
    setModulesLoading(true);
    try {
      const res = await api.get(`/admin/courses/${courseId}`);
      const course = res.data?.data || res.data;
      setModules((course.videos || []).sort((a, b) => a.sequence - b.sequence));
    } catch { setModules([]); }
    finally { setModulesLoading(false); }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourseModules.length) { showToast('Add at least one module with a video.', 'error'); return; }
    setCreatingCourse(true);
    try {
      const courseRes = await api.post('/admin/courses', formData);
      const createdCourse = courseRes.data?.data || courseRes.data;
      const courseId = createdCourse?.id;
      if (!courseId) throw new Error('Course created but ID not returned.');

      if (newCourseCoverFile) {
        const coverPayload = new FormData();
        coverPayload.append('cover_image', newCourseCoverFile);
        await api.post(`/admin/courses/${courseId}/cover-image`, coverPayload, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      const ordered = [...newCourseModules].sort((a, b) => a.sequence - b.sequence);
      for (let i = 0; i < ordered.length; i++) {
        const m = ordered[i];
        const mp = new FormData();
        mp.append('video_file', m.videoFile);
        mp.append('title', m.title);
        mp.append('description', m.description || '');
        mp.append('duration', m.duration);
        mp.append('sequence', i + 1);
        await api.post(`/admin/courses/${courseId}/upload-video`, mp, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      resetNewCourseBuilder();
      setShowAddForm(false);
      await fetchCourses();
      showToast('Course created successfully!');
    } catch (err) {
      showToast(err?.response?.data?.details || err?.response?.data?.message || err?.message || 'Failed to add course', 'error');
    } finally { setCreatingCourse(false); }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course permanently?')) return;
    try {
      await api.delete(`/admin/courses/${courseId}`);
      fetchCourses();
      showToast('Course deleted successfully!');
    } catch { showToast('Failed to delete course', 'error'); }
  };

  const handleOpenModuleModal = async (course) => {
    setSelectedCourseForModules(course);
    setShowModuleModal(true);
    await fetchModules(course.id);
  };

  const handleCloseModuleModal = () => {
    setShowModuleModal(false);
    setShowAddModuleForm(false);
    setEditingModuleId(null);
    setModuleFormData({ title: '', description: '', duration: '', sequence: 1 });
  };

  const handleSelectCoverImage = (courseId) => {
    setUploadingImageCourseId(courseId);
    document.getElementById('course-cover-input')?.click();
  };

  const resetNewCourseBuilder = () => {
    setFormData({ name: '', description: '', topic: '', instructor: '', duration: '', level: 'Beginner', cover_image: '' });
    setNewCourseCoverFile(null);
    setNewCourseModules([]);
    setNewCourseModuleForm({ title: '', description: '', duration: '', sequence: 1, videoFile: null });
    setEditingNewCourseModuleIndex(null);
  };

  const handleNewCourseCoverChange = (e) => { setNewCourseCoverFile(e.target.files?.[0] || null); e.target.value = ''; };
  const handleNewCourseModuleVideoChange = (e) => { setNewCourseModuleForm(p => ({ ...p, videoFile: e.target.files?.[0] || null })); e.target.value = ''; };

  const handleAddOrUpdateNewCourseModule = () => {
    if (!newCourseModuleForm.title || !newCourseModuleForm.duration || !newCourseModuleForm.videoFile) {
      showToast('Provide module title, duration, and video file.', 'error');
      return;
    }
    const payload = {
      title: newCourseModuleForm.title,
      description: newCourseModuleForm.description,
      duration: newCourseModuleForm.duration,
      sequence: Number(newCourseModuleForm.sequence) || (newCourseModules.length + 1),
      videoFile: newCourseModuleForm.videoFile,
    };
    if (editingNewCourseModuleIndex !== null) {
      const updated = [...newCourseModules];
      updated[editingNewCourseModuleIndex] = payload;
      setNewCourseModules(updated.sort((a, b) => a.sequence - b.sequence));
    } else {
      setNewCourseModules(p => [...p, payload].sort((a, b) => a.sequence - b.sequence));
    }
    setNewCourseModuleForm({ title: '', description: '', duration: '', sequence: newCourseModules.length + 2, videoFile: null });
    setEditingNewCourseModuleIndex(null);
    showToast(editingNewCourseModuleIndex !== null ? 'Module updated!' : 'Module added to draft!', 'info');
  };

  const handleEditNewCourseModule = (index) => {
    const m = newCourseModules[index];
    if (!m) return;
    setEditingNewCourseModuleIndex(index);
    setNewCourseModuleForm({ ...m });
  };

  const handleDeleteNewCourseModule = (index) => {
    setNewCourseModules(p => p.filter((_, i) => i !== index));
    if (editingNewCourseModuleIndex === index) {
      setEditingNewCourseModuleIndex(null);
      setNewCourseModuleForm({ title: '', description: '', duration: '', sequence: 1, videoFile: null });
    }
  };

  const moveNewCourseModule = (index, direction) => {
    const ti = direction === 'up' ? index - 1 : index + 1;
    if (ti < 0 || ti >= newCourseModules.length) return;
    const u = [...newCourseModules];
    [u[index], u[ti]] = [u[ti], u[index]];
    setNewCourseModules(u.map((m, i) => ({ ...m, sequence: i + 1 })));
  };

  const handleUploadCoverImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingImageCourseId) return;
    const fd = new FormData();
    fd.append('cover_image', file);
    try {
      await api.post(`/admin/courses/${uploadingImageCourseId}/cover-image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      await fetchCourses();
      showToast('Cover image uploaded!');
    } catch { showToast('Failed to upload image', 'error'); }
    finally { setUploadingImageCourseId(null); }
  };

  const handleRemoveCoverImage = async (courseId) => {
    if (!window.confirm('Remove cover image?')) return;
    try {
      await api.put(`/admin/courses/${courseId}`, { cover_image: null });
      await fetchCourses();
      showToast('Cover image removed!');
    } catch { showToast('Failed to remove image', 'error'); }
  };

  const handleAddModule = async () => {
    if (!moduleFormData.title || !moduleFormData.duration) { showToast('Fill all fields', 'error'); return; }
    document.getElementById('video-file-input')?.click();
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCourseForModules) return;
    const fd = new FormData();
    fd.append('video_file', file);
    fd.append('title', moduleFormData.title);
    fd.append('description', moduleFormData.description);
    fd.append('duration', moduleFormData.duration);
    fd.append('sequence', moduleFormData.sequence);
    try {
      setUploadingVideoModuleId(true);
      await api.post(`/admin/courses/${selectedCourseForModules.id}/upload-video`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setModuleFormData({ title: '', description: '', duration: '', sequence: modules.length + 1 });
      setShowAddModuleForm(false);
      await fetchModules(selectedCourseForModules.id);
      showToast('Module added successfully!');
    } catch (err) {
      showToast(err?.response?.data?.details || 'Failed to upload video', 'error');
    } finally { setUploadingVideoModuleId(false); }
  };

  const handleEditModule = (module) => {
    setEditingModuleId(module.id);
    setEditingModule(module);
    setModuleFormData({ title: module.title, description: module.description || '', duration: module.duration, sequence: module.sequence });
  };

  const handleSaveModuleEdit = async (moduleId) => {
    try {
      await api.put(`/admin/videos/${moduleId}`, moduleFormData);
      setEditingModuleId(null);
      setEditingModule(null);
      await fetchModules(selectedCourseForModules.id);
      showToast('Module updated!');
    } catch { showToast('Failed to update module', 'error'); }
  };

  const handleReplaceVideo = (moduleId) => {
    setUploadingVideoModuleId(moduleId);
    document.getElementById('replace-video-input')?.click();
  };

  const handleReplaceVideoFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingVideoModuleId || !selectedCourseForModules) return;
    const fd = new FormData();
    fd.append('video_file', file);
    try {
      await api.post(`/admin/videos/${uploadingVideoModuleId}/replace-video`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setEditingModuleId(null);
      setEditingModule(null);
      await fetchModules(selectedCourseForModules.id);
      showToast('Video replaced!');
    } catch (err) {
      showToast(err?.response?.data?.details || 'Failed to replace video', 'error');
    } finally { setUploadingVideoModuleId(null); e.target.value = ''; }
  };

  const handleRemoveVideo = async (moduleId) => {
    if (!window.confirm('Remove video from this module?')) return;
    try {
      await api.delete(`/admin/videos/${moduleId}/video-link`);
      setEditingModuleId(null);
      setEditingModule(null);
      await fetchModules(selectedCourseForModules.id);
      showToast('Video removed!');
    } catch { showToast('Failed to remove video', 'error'); }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Delete this module?')) return;
    try {
      await api.delete(`/admin/videos/${moduleId}`);
      await fetchModules(selectedCourseForModules.id);
      showToast('Module deleted!');
    } catch { showToast('Failed to delete module', 'error'); }
  };

  const moveModuleUp = async (module) => {
    if (module.sequence <= 1) return;
    const prev = modules.find(m => m.sequence === module.sequence - 1);
    if (!prev) return;
    try {
      await api.put(`/admin/videos/${module.id}`, { sequence: module.sequence - 1 });
      await api.put(`/admin/videos/${prev.id}`, { sequence: module.sequence });
      await fetchModules(selectedCourseForModules.id);
    } catch {}
  };

  const moveModuleDown = async (module) => {
    if (module.sequence >= modules.length) return;
    const next = modules.find(m => m.sequence === module.sequence + 1);
    if (!next) return;
    try {
      await api.put(`/admin/videos/${module.id}`, { sequence: module.sequence + 1 });
      await api.put(`/admin/videos/${next.id}`, { sequence: module.sequence });
      await fetchModules(selectedCourseForModules.id);
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.assign('/login');
  };

  // ── Sidebar config ──
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'courses', label: 'Courses', icon: GraduationCap, path: '/admin/courses' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/admin/jobs' },
    { id: 'applications', label: 'Applications', icon: ClipboardList, path: '/admin/applications' },
  ];

  // ── Filtered courses ──
  const filteredCourses = courses.filter(c => {
    const matchesSearch = [c.name, c.description, c.instructor, c.topic]
      .some(f => (f || '').toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = filterLevel === 'all' || c.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const levelCounts = {
    all: courses.length,
    Beginner: courses.filter(c => c.level === 'Beginner').length,
    Intermediate: courses.filter(c => c.level === 'Intermediate').length,
    Advanced: courses.filter(c => c.level === 'Advanced').length,
  };

  const totalModules = courses.reduce((s, c) => s + (c.videos?.length || c.video_count || 0), 0);

  return (
    <>
      <InjectStyles />

      {/* Hidden file inputs */}
      <input id="course-cover-input" type="file" accept="image/*" className="hidden" onChange={handleUploadCoverImage} />
      <input id="video-file-input" type="file" accept="video/*" className="hidden" onChange={handleUploadVideo} />
      <input id="replace-video-input" type="file" accept="video/*" className="hidden" onChange={handleReplaceVideoFile} />
      <input id="new-course-cover-input" type="file" accept="image/*" className="hidden" onChange={handleNewCourseCoverChange} />
      <input id="new-course-module-video-input" type="file" accept="video/*" className="hidden" onChange={handleNewCourseModuleVideoChange} />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="min-h-screen relative overflow-hidden flex" style={{ background: 'linear-gradient(180deg, #03070A 0%, #0A1A22 50%, #050D11 100%)' }}>

        {/* ── Background ── */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="blob-1 absolute -top-[15%] -right-[10%] w-[450px] h-[450px] bg-[#14b8a6]/[0.025]" />
          <div className="blob-2 absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-[#06b6d4]/[0.025]" />
          <div className="absolute top-[40%] left-[30%] w-[350px] h-[350px] bg-[radial-gradient(ellipse,rgba(45,212,191,0.02)_0%,transparent_70%)]"
            style={{ animation: 'orbFloat 20s ease-in-out infinite' }} />
          <div className="dot-grid absolute inset-0 opacity-30" />
        </div>

        {/* ═══════════════════════════════════
            SIDEBAR
           ═══════════════════════════════════ */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-[72px]'} fixed h-screen z-30 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
          <div className="h-full flex flex-col bg-[#060E14]/90 backdrop-blur-2xl border-r border-[#1e3a42]/30">

            {/* Sidebar Header */}
            <div className="p-4 border-b border-[#1e3a42]/30">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-3 transition-all duration-500 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'}`}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20">
                    <Zap size={16} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-sm font-black text-white tracking-tight">Admin Panel</h1>
                    <p className="text-[9px] text-gray-600 uppercase tracking-[0.15em] font-bold">Course Manager</p>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1e3a42]/30 text-gray-500 hover:text-white transition-all duration-300 cursor-pointer group">
                  <Menu size={16} className={`transition-transform duration-500 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
                </button>
              </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-3 space-y-1">
              {menuItems.map((item, i) => {
                const isActive = item.id === 'courses';
                return (
                  <div key={item.id} className="relative sidebar-item sidebar-item-in" style={{ animationDelay: `${i * 0.06}s` }}>
                    <button
                      onClick={() => navigate(item.path)}
                      onMouseEnter={() => setSidebarHovered(item.id)}
                      onMouseLeave={() => setSidebarHovered(null)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden
                        ${isActive
                          ? 'bg-[#14b8a6]/12 text-[#2dd4bf] border border-[#14b8a6]/20'
                          : 'text-gray-500 hover:text-gray-300 hover:bg-[#1e3a42]/15 border border-transparent'
                        }`}>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#14b8a6]"
                          style={{ boxShadow: '0 0 10px rgba(20,184,166,0.5)' }} />
                      )}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0
                        ${isActive ? 'bg-[#14b8a6]/15' : 'bg-transparent group-hover:bg-[#1e3a42]/20'}`}>
                        <item.icon size={16} className={`transition-transform duration-300 ${sidebarHovered === item.id ? 'scale-110' : ''}`} />
                      </div>
                      <span className={`text-sm font-semibold transition-all duration-500 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                        {item.label}
                      </span>
                      {isActive && sidebarOpen && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#14b8a6] status-dot" />
                      )}
                    </button>

                    {/* Collapsed tooltip */}
                    {!sidebarOpen && (
                      <div className="sidebar-tooltip absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#0A1A22] border border-[#1e3a42]/50 rounded-lg text-xs font-semibold text-white whitespace-nowrap z-50 shadow-xl">
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-[#1e3a42]/50" />
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-[#1e3a42]/30">
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all duration-300 cursor-pointer group border border-transparent hover:border-red-500/15">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-500/10 transition-all">
                  <LogOut size={16} />
                </div>
                <span className={`text-sm font-semibold transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                  Logout
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* ═══════════════════════════════════
            MAIN CONTENT
           ═══════════════════════════════════ */}
        <main className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${sidebarOpen ? 'ml-64' : 'ml-[72px]'}`}>
          <div className="relative z-10 p-6 lg:p-8 max-w-[1400px] mx-auto">

            {/* ── Page Header ── */}
            <div className="mb-8 slide-down">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20">
                      <GraduationCap size={20} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Course Management</h1>
                      <p className="text-xs text-gray-500 mt-0.5">Create and manage your learning content</p>
                    </div>
                  </div>
                </div>
                <RippleButton onClick={() => { setShowAddForm(!showAddForm); if (showAddForm) resetNewCourseBuilder(); }}
                  className={`btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm cursor-pointer ${showAddForm ? '!bg-red-500/80 hover:!bg-red-500' : ''}`}>
                  {showAddForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> New Course</>}
                </RippleButton>
              </div>
            </div>

            {/* ── Stats Grid ── */}
            <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              <StatCard icon={GraduationCap} label="Total Courses" value={courses.length} color="#14b8a6" delay={0} visible={statsVisible} />
              <StatCard icon={Film} label="Total Modules" value={totalModules} color="#06b6d4" delay={0.08} visible={statsVisible} />
              <StatCard icon={Layers} label="Beginner" value={levelCounts.Beginner} color="#10b981" delay={0.16} visible={statsVisible} />
              <StatCard icon={Zap} label="Advanced" value={levelCounts.Advanced} color="#a855f7" delay={0.24} visible={statsVisible} />
            </div>

            {/* ══════════════════════════════
                ADD COURSE FORM
               ══════════════════════════════ */}
            {showAddForm && (
              <div className="mb-8 expand-enter">
                <div className="glass-card rounded-2xl overflow-hidden relative">
                  {/* Top gradient bar */}
                  <div className="h-1 bg-gradient-to-r from-[#14b8a6] via-[#06b6d4] to-[#2dd4bf]"
                    style={{ backgroundSize: '200% 200%', animation: 'gradientShift 3s ease infinite' }} />

                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/10 flex items-center justify-center">
                        <Sparkles size={18} className="text-[#14b8a6]" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Create New Course</h2>
                        <p className="text-xs text-gray-500">Fill in the details, add modules, then publish</p>
                      </div>
                    </div>

                    <form onSubmit={handleAddCourse} className="space-y-6">
                      {/* Course Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimInput label="Course Name" icon={BookOpen} placeholder="e.g., Advanced React Patterns"
                          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        <AnimInput label="Topic" icon={Layers} placeholder="e.g., Web Development"
                          value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} required />
                        <AnimInput label="Instructor" icon={User} placeholder="e.g., John Doe"
                          value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} required />
                        <AnimInput label="Duration" icon={Clock} placeholder="e.g., 8 weeks"
                          value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required />
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2 text-gray-500">Level</label>
                          <div className="flex gap-2">
                            {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                              <button key={lvl} type="button" onClick={() => setFormData({...formData, level: lvl})}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer
                                  ${formData.level === lvl
                                    ? 'bg-[#14b8a6]/12 text-[#2dd4bf] border-[#14b8a6]/30 shadow-lg shadow-[#14b8a6]/5'
                                    : 'bg-[#071015]/40 text-gray-500 border-[#1e3a42]/30 hover:border-[#1e3a42]/60 hover:text-gray-400'}`}>
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <AnimInput label="Description" icon={null} placeholder="Describe what students will learn..."
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows={3} />

                      {/* Cover Image */}
                      <div className="bg-[#071015]/40 border border-[#1e3a42]/30 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Image size={16} className="text-[#14b8a6]" />
                          <h3 className="text-sm font-bold text-white">Cover Image</h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <RippleButton type="button" onClick={() => document.getElementById('new-course-cover-input')?.click()}
                            className="px-4 py-2.5 bg-[#14b8a6]/8 hover:bg-[#14b8a6]/15 text-[#2dd4bf] rounded-xl text-xs font-bold border border-[#14b8a6]/15 transition-all cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Upload size={14} />
                              {newCourseCoverFile ? 'Replace' : 'Upload'}
                            </div>
                          </RippleButton>
                          <span className="text-xs text-gray-500 truncate">
                            {newCourseCoverFile ? (
                              <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-emerald-400" /> {newCourseCoverFile.name}</span>
                            ) : 'No cover selected'}
                          </span>
                        </div>
                      </div>

                      {/* Modules Builder */}
                      <div className="bg-[#071015]/40 border border-[#1e3a42]/30 rounded-xl p-5 space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Film size={16} className="text-[#06b6d4]" />
                            <h3 className="text-sm font-bold text-white">Modules & Videos</h3>
                            {newCourseModules.length > 0 && (
                              <span className="px-2 py-0.5 bg-[#14b8a6]/10 text-[#14b8a6] rounded-full text-[10px] font-bold">
                                {newCourseModules.length} added
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Module form */}
                        <div className="space-y-3 bg-[#060E14]/50 border border-[#1e3a42]/20 rounded-xl p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <AnimInput placeholder="Module Title" icon={BookOpen}
                              value={newCourseModuleForm.title} onChange={e => setNewCourseModuleForm({...newCourseModuleForm, title: e.target.value})} />
                            <AnimInput placeholder="Duration (e.g., 15 min)" icon={Clock}
                              value={newCourseModuleForm.duration} onChange={e => setNewCourseModuleForm({...newCourseModuleForm, duration: e.target.value})} />
                          </div>
                          <AnimInput placeholder="Module Description (optional)" rows={2}
                            value={newCourseModuleForm.description} onChange={e => setNewCourseModuleForm({...newCourseModuleForm, description: e.target.value})} />
                          <div className="flex flex-wrap items-center gap-3">
                            <AnimInput placeholder="Seq" icon={Hash} type="number" className="w-24"
                              value={newCourseModuleForm.sequence} onChange={e => setNewCourseModuleForm({...newCourseModuleForm, sequence: parseInt(e.target.value, 10) || 1})} />
                            <RippleButton type="button" onClick={() => document.getElementById('new-course-module-video-input')?.click()}
                              className="px-4 py-2.5 bg-blue-500/8 hover:bg-blue-500/15 text-blue-400 rounded-xl text-xs font-bold border border-blue-500/15 transition-all cursor-pointer">
                              <div className="flex items-center gap-2">
                                <PlayCircle size={14} />
                                {newCourseModuleForm.videoFile ? 'Replace Video' : 'Select Video'}
                              </div>
                            </RippleButton>
                            {newCourseModuleForm.videoFile && (
                              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                <CheckCircle size={10} /> {newCourseModuleForm.videoFile.name}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 pt-2">
                            <RippleButton type="button" onClick={handleAddOrUpdateNewCourseModule}
                              className="btn-primary px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer">
                              <div className="flex items-center gap-2">
                                {editingNewCourseModuleIndex !== null ? <><Save size={13} /> Update Module</> : <><Plus size={13} /> Add Module</>}
                              </div>
                            </RippleButton>
                            {editingNewCourseModuleIndex !== null && (
                              <button type="button" onClick={() => {
                                setEditingNewCourseModuleIndex(null);
                                setNewCourseModuleForm({ title: '', description: '', duration: '', sequence: newCourseModules.length + 1, videoFile: null });
                              }} className="px-4 py-2 bg-[#1e3a42]/20 hover:bg-[#1e3a42]/40 text-gray-400 rounded-xl text-xs font-bold transition cursor-pointer">
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Draft modules list */}
                        {newCourseModules.length > 0 && (
                          <div className="space-y-2 pt-2">
                            {newCourseModules.map((mod, index) => (
                              <div key={`${mod.title}-${index}`}
                                className="module-row p-3.5 bg-[#060E14]/50 border border-[#1e3a42]/25 rounded-xl card-entrance group"
                                style={{ animationDelay: `${index * 0.04}s` }}>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#14b8a6]/10 flex items-center justify-center shrink-0 mt-0.5">
                                      <span className="text-xs font-black text-[#14b8a6]">{mod.sequence}</span>
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-white">{mod.title}</p>
                                      {mod.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{mod.description}</p>}
                                      <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-[10px] text-gray-600 flex items-center gap-1"><Clock size={9} /> {mod.duration}</span>
                                        <span className="text-[10px] text-emerald-400/70 flex items-center gap-1"><PlayCircle size={9} /> {mod.videoFile?.name}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {index > 0 && (
                                      <button type="button" onClick={() => moveNewCourseModule(index, 'up')}
                                        className="p-1.5 bg-[#14b8a6]/8 hover:bg-[#14b8a6]/15 text-[#2dd4bf] rounded-lg transition cursor-pointer">
                                        <ChevronUp size={12} />
                                      </button>
                                    )}
                                    {index < newCourseModules.length - 1 && (
                                      <button type="button" onClick={() => moveNewCourseModule(index, 'down')}
                                        className="p-1.5 bg-[#14b8a6]/8 hover:bg-[#14b8a6]/15 text-[#2dd4bf] rounded-lg transition cursor-pointer">
                                        <ChevronDown size={12} />
                                      </button>
                                    )}
                                    <button type="button" onClick={() => handleEditNewCourseModule(index)}
                                      className="p-1.5 bg-blue-500/8 hover:bg-blue-500/15 text-blue-400 rounded-lg transition cursor-pointer">
                                      <Edit2 size={12} />
                                    </button>
                                    <button type="button" onClick={() => handleDeleteNewCourseModule(index)}
                                      className="p-1.5 bg-red-500/8 hover:bg-red-500/15 text-red-400 rounded-lg transition cursor-pointer">
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Submit */}
                      <div className="flex gap-3 pt-2">
                        <RippleButton type="submit" disabled={creatingCourse}
                          className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm cursor-pointer">
                          {creatingCourse ? (
                            <><Loader2 size={16} className="animate-spin" /> Creating...</>
                          ) : (
                            <><Sparkles size={16} /> Create Course</>
                          )}
                        </RippleButton>
                        <button type="button" onClick={() => { setShowAddForm(false); resetNewCourseBuilder(); }}
                          className="px-6 py-3 bg-[#1e3a42]/15 hover:bg-[#1e3a42]/30 text-gray-400 rounded-xl font-bold text-sm transition cursor-pointer border border-[#1e3a42]/20">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════
                SEARCH & FILTERS
               ══════════════════════════════ */}
            <div className="mb-6 slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 group">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#14b8a6] transition-colors" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full pl-11 pr-10 py-3 bg-[#071015]/60 border border-[#1e3a42]/40 rounded-xl text-white text-sm placeholder-gray-600 input-glow outline-none" />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg bg-[#1e3a42]/40 text-gray-500 hover:text-white transition cursor-pointer hover:scale-110">
                      <X size={11} />
                    </button>
                  )}
                </div>

                {/* Level filters */}
                <div className="flex gap-1.5">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'Beginner', label: 'Beginner' },
                    { key: 'Intermediate', label: 'Mid' },
                    { key: 'Advanced', label: 'Advanced' },
                  ].map(f => (
                    <button key={f.key} onClick={() => setFilterLevel(f.key)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer whitespace-nowrap
                        ${filterLevel === f.key
                          ? 'bg-[#14b8a6]/12 text-[#2dd4bf] border-[#14b8a6]/25'
                          : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#1e3a42]/15'}`}>
                      {f.label}
                      <span className="ml-1.5 text-[10px] tabular-nums opacity-60">{levelCounts[f.key]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Results Header ── */}
            <div className="flex items-center justify-between mb-5 fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#14b8a6] to-[#06b6d4]" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.12em]">
                  {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
                </span>
              </div>
            </div>

            {/* ══════════════════════════════
                COURSES GRID
               ══════════════════════════════ */}
            <div ref={cardsRef}>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[0, 1, 2, 3, 4, 5].map(i => <CourseSkeleton key={i} delay={i * 0.08} />)}
                </div>
              ) : filteredCourses.length === 0 ? (
                <EmptyState onAdd={() => setShowAddForm(true)} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCourses.map((course, idx) => (
                    <div key={course.id} className="card-entrance" style={{ animationDelay: `${idx * 0.06}s` }}>
                      <div className="glass-card glow-border shine-effect rounded-2xl overflow-hidden hover-lift course-card group relative">
                        {/* Image */}
                        <div className="relative h-44 overflow-hidden">
                          <img src={course.cover_image || FALLBACK_COURSE_IMAGE} alt={course.name}
                            className="w-full h-full object-cover course-card-img" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A22] via-transparent to-transparent" />

                          {/* Overlay actions */}
                          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <button onClick={() => handleSelectCoverImage(course.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-[#14b8a6]/80 transition-all cursor-pointer border border-white/10 hover:border-[#14b8a6]"
                              title="Upload cover">
                              <Upload size={12} />
                            </button>
                            {course.cover_image && (
                              <button onClick={() => handleRemoveCoverImage(course.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-red-500/80 transition-all cursor-pointer border border-white/10 hover:border-red-500"
                                title="Remove cover">
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>

                          {/* Level badge */}
                          <div className="absolute bottom-3 left-3">
                            <LevelBadge level={course.level} />
                          </div>

                          {/* Module count */}
                          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
                            <Film size={10} className="text-gray-300" />
                            <span className="text-[10px] font-bold text-gray-300">{course.videos?.length || course.video_count || 0}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="text-base font-bold text-white mb-1.5 line-clamp-1 group-hover:text-[#2dd4bf] transition-colors duration-300">
                            {course.name}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{course.description}</p>

                          <div className="space-y-1.5 mb-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <User size={11} className="text-gray-600 shrink-0" />
                              <span className="truncate">{course.instructor}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock size={11} className="text-gray-600 shrink-0" />
                              <span>{course.duration}</span>
                            </div>
                            {course.topic && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Layers size={11} className="text-gray-600 shrink-0" />
                                <span className="truncate">{course.topic}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-3 border-t border-[#1e3a42]/25">
                            <RippleButton onClick={() => handleOpenModuleModal(course)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[#2dd4bf] text-xs font-bold bg-[#14b8a6]/8 hover:bg-[#14b8a6]/15 border border-[#14b8a6]/15 transition-all cursor-pointer">
                              <FileVideo size={13} /> Modules
                            </RippleButton>
                            <RippleButton onClick={() => handleDeleteCourse(course.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-red-400/80 text-xs font-bold bg-red-500/6 hover:bg-red-500/12 border border-red-500/10 hover:border-red-500/20 transition-all cursor-pointer">
                              <Trash2 size={13} /> Delete
                            </RippleButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Results footer */}
            {!loading && filteredCourses.length > 0 && (
              <div className="text-center mt-10 fade-in">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#0A1A22]/50 border border-[#1e3a42]/25 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                  <span className="text-[11px] text-gray-500">
                    Showing <span className="text-white font-bold">{filteredCourses.length}</span> of <span className="text-white font-bold">{courses.length}</span> courses
                  </span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ═══════════════════════════════════
            MODULE MANAGEMENT MODAL
           ═══════════════════════════════════ */}
        {showModuleModal && selectedCourseForModules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleCloseModuleModal}>
            <div className="modal-bg absolute inset-0 bg-black/70 backdrop-blur-xl" />
            <div onClick={e => e.stopPropagation()}
              className="modal-reveal relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0A1A22] border border-[#1e3a42]/50 rounded-3xl shadow-2xl shadow-[#14b8a6]/5">

              {/* Gradient top */}
              <div className="h-1 bg-gradient-to-r from-[#14b8a6] via-[#06b6d4] to-[#2dd4bf] rounded-t-3xl"
                style={{ backgroundSize: '200% 200%', animation: 'gradientShift 3s ease infinite' }} />

              <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20">
                      <Film size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">{selectedCourseForModules.name}</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Manage modules & video content</p>
                    </div>
                  </div>
                  <button onClick={handleCloseModuleModal}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1e3a42]/20 border border-[#1e3a42]/30 text-gray-400 hover:text-white hover:border-[#14b8a6]/30 transition-all cursor-pointer hover:rotate-90 duration-300">
                    <X size={18} />
                  </button>
                </div>

                {modulesLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-2 border-[#1e3a42] border-t-[#14b8a6] rounded-full animate-spin" />
                      <div className="absolute inset-2 w-8 h-8 border-2 border-[#1e3a42] border-b-[#06b6d4] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.6s' }} />
                    </div>
                    <span className="text-xs text-gray-500 font-semibold">Loading modules...</span>
                  </div>
                ) : (
                  <>
                    {/* Add module button */}
                    <div className="mb-5">
                      <RippleButton onClick={() => { setShowAddModuleForm(!showAddModuleForm); setEditingModuleId(null); }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all border
                          ${showAddModuleForm
                            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/15'
                            : 'btn-primary text-white border-transparent'}`}>
                        {showAddModuleForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Module</>}
                      </RippleButton>
                    </div>

                    {/* Add module form */}
                    {showAddModuleForm && (
                      <div className="mb-6 expand-enter">
                        <div className="bg-[#071015]/60 border border-[#1e3a42]/30 rounded-xl p-5 space-y-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={14} className="text-[#14b8a6]" />
                            <h3 className="text-sm font-bold text-white">New Module</h3>
                          </div>
                          <AnimInput placeholder="Module Title" icon={BookOpen}
                            value={moduleFormData.title} onChange={e => setModuleFormData({...moduleFormData, title: e.target.value})} />
                          <AnimInput placeholder="Description" rows={2}
                            value={moduleFormData.description} onChange={e => setModuleFormData({...moduleFormData, description: e.target.value})} />
                          <div className="grid grid-cols-2 gap-3">
                            <AnimInput placeholder="Duration" icon={Clock}
                              value={moduleFormData.duration} onChange={e => setModuleFormData({...moduleFormData, duration: e.target.value})} />
                            <AnimInput placeholder="Sequence" icon={Hash} type="number"
                              value={moduleFormData.sequence} onChange={e => setModuleFormData({...moduleFormData, sequence: parseInt(e.target.value) || 1})} />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <RippleButton onClick={handleAddModule} disabled={uploadingVideoModuleId}
                              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold cursor-pointer">
                              {uploadingVideoModuleId ? (
                                <><Loader2 size={14} className="animate-spin" /> Uploading...</>
                              ) : (
                                <><Upload size={14} /> Upload Video & Add</>
                              )}
                            </RippleButton>
                            <button onClick={() => setShowAddModuleForm(false)}
                              className="px-5 py-2.5 bg-[#1e3a42]/15 text-gray-400 rounded-xl text-xs font-bold transition hover:bg-[#1e3a42]/30 cursor-pointer">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Modules list */}
                    <div className="space-y-3">
                      {modules.length > 0 ? (
                        modules.map((module, idx) => (
                          <div key={module.id} className="module-row border border-[#1e3a42]/25 rounded-xl overflow-hidden card-entrance group"
                            style={{ animationDelay: `${idx * 0.05}s` }}>
                            {editingModuleId === module.id ? (
                              /* Editing state */
                              <div className="p-5 space-y-3 bg-[#071015]/40 expand-enter">
                                <AnimInput placeholder="Title" icon={BookOpen}
                                  value={moduleFormData.title} onChange={e => setModuleFormData({...moduleFormData, title: e.target.value})} />
                                <AnimInput placeholder="Description" rows={2}
                                  value={moduleFormData.description} onChange={e => setModuleFormData({...moduleFormData, description: e.target.value})} />
                                <AnimInput placeholder="Duration" icon={Clock}
                                  value={moduleFormData.duration} onChange={e => setModuleFormData({...moduleFormData, duration: e.target.value})} />

                                {/* Video management */}
                                <div className="bg-[#060E14]/50 border border-[#1e3a42]/20 rounded-xl p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Film size={13} className="text-[#06b6d4]" />
                                    <span className="text-xs font-bold text-white">Video</span>
                                    {module.url ? (
                                      <span className="text-[10px] text-emerald-400 flex items-center gap-1"><CheckCircle size={9} /> Uploaded</span>
                                    ) : (
                                      <span className="text-[10px] text-amber-400 flex items-center gap-1"><AlertCircle size={9} /> No video</span>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <RippleButton onClick={() => handleReplaceVideo(module.id)} disabled={uploadingVideoModuleId === module.id}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-500/8 hover:bg-blue-500/15 text-blue-400 rounded-lg text-[11px] font-bold border border-blue-500/15 transition cursor-pointer">
                                      <RotateCcw size={11} /> {module.url ? 'Replace' : 'Upload'}
                                    </RippleButton>
                                    {module.url && (
                                      <RippleButton onClick={() => handleRemoveVideo(module.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/8 hover:bg-red-500/15 text-red-400 rounded-lg text-[11px] font-bold border border-red-500/10 transition cursor-pointer">
                                        <Trash2 size={11} /> Remove
                                      </RippleButton>
                                    )}
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-1">
                                  <RippleButton onClick={() => handleSaveModuleEdit(module.id)}
                                    className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer">
                                    <Save size={13} /> Save Changes
                                  </RippleButton>
                                  <button onClick={() => setEditingModuleId(null)}
                                    className="px-4 py-2 bg-[#1e3a42]/15 text-gray-400 rounded-xl text-xs font-bold transition hover:bg-[#1e3a42]/30 cursor-pointer">
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Display state */
                              <div className="p-4">
                                <div className="flex items-start gap-3">
                                  {/* Sequence number */}
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6]/15 to-[#06b6d4]/10 flex items-center justify-center shrink-0 border border-[#14b8a6]/15">
                                    <span className="text-sm font-black text-[#14b8a6]">{module.sequence}</span>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <h4 className="text-sm font-bold text-white truncate">{module.title}</h4>
                                      {module.url ? (
                                        <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/12 flex items-center justify-center">
                                          <PlayCircle size={10} className="text-emerald-400" />
                                        </span>
                                      ) : (
                                        <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/12 flex items-center justify-center">
                                          <AlertCircle size={10} className="text-amber-400" />
                                        </span>
                                      )}
                                    </div>
                                    {module.description && <p className="text-xs text-gray-500 line-clamp-1 mb-1">{module.description}</p>}
                                    <span className="text-[10px] text-gray-600 flex items-center gap-1"><Clock size={9} /> {module.duration || 'N/A'}</span>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {idx > 0 && (
                                      <button onClick={() => moveModuleUp(module)}
                                        className="p-1.5 bg-[#14b8a6]/8 hover:bg-[#14b8a6]/15 text-[#2dd4bf] rounded-lg transition cursor-pointer">
                                        <ChevronUp size={13} />
                                      </button>
                                    )}
                                    {idx < modules.length - 1 && (
                                      <button onClick={() => moveModuleDown(module)}
                                        className="p-1.5 bg-[#14b8a6]/8 hover:bg-[#14b8a6]/15 text-[#2dd4bf] rounded-lg transition cursor-pointer">
                                        <ChevronDown size={13} />
                                      </button>
                                    )}
                                    <button onClick={() => handleEditModule(module)}
                                      className="p-1.5 bg-blue-500/8 hover:bg-blue-500/15 text-blue-400 rounded-lg transition cursor-pointer">
                                      <Edit2 size={13} />
                                    </button>
                                    <button onClick={() => handleDeleteModule(module.id)}
                                      className="p-1.5 bg-red-500/8 hover:bg-red-500/15 text-red-400 rounded-lg transition cursor-pointer">
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-14 gap-3 slide-up">
                          <div className="w-16 h-16 rounded-2xl bg-[#0F3A42]/20 border border-[#1e3a42]/30 flex items-center justify-center float-slow">
                            <Film size={28} className="text-gray-700" />
                          </div>
                          <p className="text-sm text-gray-500 font-semibold">No modules yet</p>
                          <p className="text-xs text-gray-600">Click "Add Module" to create your first module</p>
                        </div>
                      )}
                    </div>

                    {/* Module count footer */}
                    {modules.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-[#1e3a42]/20 flex items-center justify-between">
                        <span className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-bold">
                          {modules.length} {modules.length === 1 ? 'module' : 'modules'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-400/60">
                            {modules.filter(m => m.url).length} with video
                          </span>
                          <div className="w-1 h-1 rounded-full bg-[#1e3a42]" />
                          <span className="text-[10px] text-amber-400/60">
                            {modules.filter(m => !m.url).length} without
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}