import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Compass,
  ExternalLink,
  FileText,
  Flame,
  FolderKanban,
  GraduationCap,
  Hexagon,
  Layers,
  Lightbulb,
  Loader2,
  MapPin,
  MessageSquare,
  Milestone,
  Play,
  Plus,
  Rocket,
  Search,
  Send,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  User,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const proficiencyRank = { Beginner: 1, Intermediate: 2, Expert: 3, Professional: 4 };

/* ═══════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════ */
const InjectStyles = () => (
  <style>{`
    @keyframes morphBlob {
      0%, 100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; transform: rotate(0deg) scale(1); }
      33% { border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%; transform: rotate(120deg) scale(1.1); }
      66% { border-radius: 30% 70% 40% 60% / 55% 30% 70% 45%; transform: rotate(240deg) scale(0.95); }
    }
    @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-20px) rotate(3deg); } }
    @keyframes floatReverse { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(15px) rotate(-2deg); } }
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
    @keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }
    @keyframes gradientFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideLeft { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideRight { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
    @keyframes scaleUp { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn { 0% { opacity: 0; transform: scale(0.5); } 60% { transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes dash { to { stroke-dashoffset: 0; } }
    @keyframes expand { from { width: 0; } }
    @keyframes expandHeight { from { max-height: 0; opacity: 0; } to { max-height: 1000px; opacity: 1; } }
    @keyframes typewriter { from { width: 0; } to { width: 100%; } }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    @keyframes ripple { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2.5); opacity: 0; } }
    @keyframes orbit { from { transform: rotate(0deg) translateX(100px) rotate(0deg); } to { transform: rotate(360deg) translateX(100px) rotate(-360deg); } }
    @keyframes hexFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-30px) rotate(180deg); } }
    @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(20,184,166,0.3); } 50% { box-shadow: 0 0 40px rgba(20,184,166,0.6); } }
    @keyframes textGlow { 0%, 100% { text-shadow: 0 0 20px rgba(20,184,166,0.5); } 50% { text-shadow: 0 0 40px rgba(20,184,166,0.8); } }
    @keyframes countUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes progressFill { from { stroke-dashoffset: 283; } }
    @keyframes slideInStagger { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes cardReveal { from { opacity: 0; transform: translateY(40px) rotateX(10deg); } to { opacity: 1; transform: translateY(0) rotateX(0); } }
    @keyframes iconBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
    @keyframes dotPulse { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
    @keyframes waveMove { 0% { transform: translateX(0) translateY(0); } 50% { transform: translateX(-25%) translateY(10px); } 100% { transform: translateX(-50%) translateY(0); } }
    @keyframes particleFloat {
      0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translate(var(--tx), var(--ty)) rotate(360deg); opacity: 0; }
    }

    .morph-blob { animation: morphBlob 20s ease-in-out infinite; }
    .float { animation: float 8s ease-in-out infinite; }
    .float-reverse { animation: floatReverse 7s ease-in-out infinite; }
    .pulse { animation: pulse 3s ease-in-out infinite; }
    .spin-slow { animation: spinSlow 20s linear infinite; }
    .bounce { animation: bounce 2s ease-in-out infinite; }
    .glow { animation: glow 3s ease-in-out infinite; }
    .text-glow { animation: textGlow 3s ease-in-out infinite; }

    .slide-up { animation: slideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
    .slide-down { animation: slideDown 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
    .slide-left { animation: slideLeft 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
    .slide-right { animation: slideRight 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
    .scale-in { animation: scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
    .scale-up { animation: scaleUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    .fade-in { animation: fadeIn 0.8s ease forwards; }
    .pop-in { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    .card-reveal { animation: cardReveal 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }

    .gradient-text {
      background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 25%, #2dd4bf 50%, #14b8a6 75%, #06b6d4 100%);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradientFlow 6s ease infinite;
    }

    .gradient-border {
      position: relative;
      background: linear-gradient(135deg, rgba(10,26,34,0.95), rgba(7,17,24,0.98));
      border: none;
    }
    .gradient-border::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 1px;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba(20,184,166,0.3), rgba(6,182,212,0.1), rgba(20,184,166,0.3));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .glass {
      background: linear-gradient(135deg, rgba(10,26,34,0.85) 0%, rgba(7,17,24,0.92) 100%);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(30,58,66,0.4);
    }

    .glass-dark {
      background: rgba(5,13,17,0.8);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(30,58,66,0.3);
    }

    .shimmer {
      position: relative;
      overflow: hidden;
    }
    .shimmer::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 60%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
      animation: shimmer 4s ease-in-out infinite;
    }

    .hover-lift {
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    }
    .hover-lift:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px -15px rgba(20,184,166,0.2);
    }

    .hover-glow {
      transition: all 0.3s ease;
    }
    .hover-glow:hover {
      box-shadow: 0 0 30px rgba(20,184,166,0.15);
      border-color: rgba(20,184,166,0.4);
    }

    .btn-primary {
      background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .btn-primary:hover::before { opacity: 1; }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px -10px rgba(20,184,166,0.5);
    }
    .btn-primary:active { transform: translateY(0); }

    .progress-ring { transition: stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1); }
    .progress-bar { animation: expand 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }

    .dot-pattern {
      background-image: radial-gradient(rgba(20,184,166,0.07) 1px, transparent 1px);
      background-size: 20px 20px;
    }

    .line-pattern {
      background-image: linear-gradient(90deg, rgba(20,184,166,0.03) 1px, transparent 1px);
      background-size: 60px 100%;
    }

    .loading-dots span {
      animation: dotPulse 1.4s ease-in-out infinite;
    }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

    .timeline-connector {
      position: relative;
    }
    .timeline-connector::after {
      content: '';
      position: absolute;
      left: 24px;
      top: 56px;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, rgba(20,184,166,0.4) 0%, rgba(20,184,166,0.1) 100%);
    }

    .skill-badge {
      transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .skill-badge:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 8px 20px -8px currentColor;
    }

    .expandable-content {
      overflow: hidden;
      transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
    }

    .card-stack {
      transform-style: preserve-3d;
      perspective: 1000px;
    }

    .wave-bg {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 200px;
      overflow: hidden;
    }
    .wave {
      position: absolute;
      bottom: 0;
      width: 200%;
      height: 100%;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath fill='%2314b8a6' fill-opacity='0.03' d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'%3E%3C/path%3E%3C/svg%3E") repeat-x;
      animation: waveMove 15s linear infinite;
    }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(10,26,34,0.5); }
    ::-webkit-scrollbar-thumb { background: rgba(20,184,166,0.3); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(20,184,166,0.5); }

    .stagger-1 { animation-delay: 0.1s; }
    .stagger-2 { animation-delay: 0.2s; }
    .stagger-3 { animation-delay: 0.3s; }
    .stagger-4 { animation-delay: 0.4s; }
    .stagger-5 { animation-delay: 0.5s; }
    .stagger-6 { animation-delay: 0.6s; }
    .stagger-7 { animation-delay: 0.7s; }
    .stagger-8 { animation-delay: 0.8s; }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════
   UTILITY HOOKS
   ═══════════════════════════════════════════════════════════════ */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setVisible(true);
      return;
    }

    // Fallback: never keep content hidden if observer does not fire on hard refresh.
    const fallbackTimer = setTimeout(() => setVisible(true), 900);

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      clearTimeout(fallbackTimer);
      return;
    }

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        clearTimeout(fallbackTimer);
        obs.disconnect();
      }
    }, { threshold });

    obs.observe(el);

    return () => {
      clearTimeout(fallbackTimer);
      obs.disconnect();
    };
  }, [threshold]);
  return [ref, visible];
}

function useAnimatedCounter(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return value;
}

function useTypewriter(text, speed = 30, startDelay = 500) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    if (!text) { setDisplayed(''); return; }
    setIsTyping(true);
    setDisplayed('');
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  
  return { displayed, isTyping };
}

/* ═══════════════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */
function parseJsonFromText(text) {
  if (!text) return null;
  try { return JSON.parse(text); } catch {}
  const block = text.match(/\{[\s\S]*\}/);
  if (block) { try { return JSON.parse(block[0]); } catch {} }
  return null;
}

function getProficiencyStyle(level) {
  const styles = {
    Professional: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
    Expert: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-cyan-500/20' },
    Intermediate: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
    Beginner: { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', glow: 'shadow-slate-500/20' },
  };
  return styles[level] || styles.Beginner;
}

function getScoreColor(score) {
  if (score >= 80) return { color: '#10b981', label: 'Excellent Match', bg: 'bg-emerald-500' };
  if (score >= 60) return { color: '#14b8a6', label: 'Good Match', bg: 'bg-teal-500' };
  if (score >= 40) return { color: '#f59e0b', label: 'Fair Match', bg: 'bg-amber-500' };
  return { color: '#ef4444', label: 'Needs Work', bg: 'bg-red-500' };
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

// Animated Background
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient base */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #030810 0%, #0A1620 40%, #071018 100%)' }} />
      
      {/* Morphing blobs */}
      <div className="morph-blob absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#14b8a6] opacity-[0.02]" />
      <div className="morph-blob absolute top-1/2 -right-48 w-[500px] h-[500px] bg-[#06b6d4] opacity-[0.02]" style={{ animationDelay: '-7s' }} />
      <div className="morph-blob absolute -bottom-32 left-1/3 w-[550px] h-[550px] bg-[#2dd4bf] opacity-[0.015]" style={{ animationDelay: '-14s' }} />
      
      {/* Floating orbs */}
      <div className="float absolute top-20 left-[15%] w-64 h-64 rounded-full bg-gradient-to-br from-[#14b8a6]/10 to-transparent blur-3xl" />
      <div className="float-reverse absolute bottom-32 right-[10%] w-80 h-80 rounded-full bg-gradient-to-tl from-[#06b6d4]/8 to-transparent blur-3xl" style={{ animationDelay: '-4s' }} />
      
      {/* Grid patterns */}
      <div className="dot-pattern absolute inset-0 opacity-50" />
      <div className="line-pattern absolute inset-0 opacity-30" />
      
      {/* Wave decoration */}
      <div className="wave-bg opacity-50">
        <div className="wave" />
        <div className="wave" style={{ animationDelay: '-5s', opacity: 0.5 }} />
      </div>
      
      {/* Decorative hexagons */}
      <Hexagon className="absolute top-40 right-20 text-[#14b8a6]/5 w-32 h-32" style={{ animation: 'hexFloat 12s ease-in-out infinite' }} />
      <Hexagon className="absolute bottom-60 left-16 text-[#06b6d4]/5 w-24 h-24" style={{ animation: 'hexFloat 15s ease-in-out infinite', animationDelay: '-5s' }} />
    </div>
  );
}

// Circular Progress Ring
function ProgressRing({ value, size = 180, strokeWidth = 10, showLabel = true }) {
  const [ref, visible] = useInView();
  const animatedValue = useAnimatedCounter(visible ? value : 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;
  const { color, label } = getScoreColor(value);
  
  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div className="absolute inset-4 rounded-full blur-2xl opacity-30" style={{ background: color }} />
      
      {/* Background ring */}
      <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(30,58,66,0.5)" strokeWidth={strokeWidth} />
        
        {/* Animated progress */}
        <circle
          cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring"
          style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}
        />
      </svg>
      
      {/* Center content */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-white">{animatedValue}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Score</span>
          <span className="text-xs font-semibold mt-2 px-3 py-1 rounded-full" style={{ background: `${color}20`, color }}>{label}</span>
        </div>
      )}
    </div>
  );
}

// Mini Progress Bar
function ProgressBar({ value, color = '#14b8a6', height = 6, label, showValue = true, delay = 0 }) {
  const [ref, visible] = useInView();
  
  return (
    <div ref={ref} className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showValue && <span className="text-sm font-bold" style={{ color }}>{value}%</span>}
        </div>
      )}
      <div className="relative w-full rounded-full overflow-hidden" style={{ height, background: 'rgba(30,58,66,0.4)' }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: visible ? `${value}%` : '0%',
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
            boxShadow: `0 0 10px ${color}40`,
            transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
          }}
        />
      </div>
    </div>
  );
}

// Stat Card
function StatCard({ icon: Icon, label, value, suffix = '', color = '#14b8a6', delay = 0, large = false }) {
  const [ref, visible] = useInView();
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  const animatedValue = useAnimatedCounter(visible && !isNaN(numValue) ? numValue : 0);
  const displayValue = isNaN(numValue) ? value : animatedValue;
  
  return (
    <div
      ref={ref}
      className={`glass rounded-2xl p-6 hover-lift hover-glow opacity-0 ${visible ? 'card-reveal' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={22} style={{ color }} />
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <TrendingUp size={12} className="text-emerald-400" />
          <span className="text-emerald-400 font-semibold">Active</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">{label}</p>
      <p className={`font-black text-white ${large ? 'text-4xl' : 'text-3xl'}`}>
        {displayValue}{suffix}
      </p>
    </div>
  );
}

// Skill Badge
function SkillBadge({ name, proficiency, index }) {
  const style = getProficiencyStyle(proficiency);
  const [ref, visible] = useInView();
  
  return (
    <div
      ref={ref}
      className={`skill-badge flex items-center gap-3 px-4 py-3 rounded-xl border ${style.bg} ${style.border} opacity-0 ${visible ? 'pop-in' : ''}`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className={`w-2.5 h-2.5 rounded-full ${style.bg} ${style.text}`} style={{ boxShadow: `0 0 8px currentColor` }} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${style.text} truncate`}>{name}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{proficiency}</p>
      </div>
    </div>
  );
}

// Timeline Phase Card
function PhaseCard({ phase, index, isLast, isExpanded, onToggle }) {
  const [ref, visible] = useInView();
  const colors = ['#14b8a6', '#06b6d4', '#2dd4bf', '#10b981', '#8b5cf6'];
  const color = colors[index % colors.length];
  
  return (
    <div ref={ref} className={`relative ${!isLast ? 'timeline-connector' : ''}`}>
      {/* Timeline dot */}
      <div className="absolute left-0 top-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${color}20` }}>
            <div className="w-6 h-6 rounded-full" style={{ background: color, boxShadow: `0 0 20px ${color}60` }} />
          </div>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
      
      {/* Content card */}
      <div
        className={`ml-20 glass rounded-2xl overflow-hidden hover-glow cursor-pointer opacity-0 ${visible ? 'slide-left' : ''}`}
        style={{ animationDelay: `${index * 0.15}s`, borderLeft: `3px solid ${color}` }}
        onClick={onToggle}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: `${color}15`, color }}>
              {phase.phase || `Phase ${index + 1}`}
            </span>
            <ChevronDown
              size={18}
              className="text-gray-500 transition-transform duration-300"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}
            />
          </div>
          
          <h4 className="text-lg font-bold text-white mb-2">{phase.focus || 'Focus Area'}</h4>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock size={12} /> Timeline</span>
            <span className="flex items-center gap-1"><Target size={12} /> {(phase.actions || []).length} Actions</span>
          </div>
        </div>
        
        {/* Expandable content */}
        <div className={`expandable-content ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-5 pb-5 pt-2 border-t border-[rgba(30,58,66,0.3)]">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Action Items</p>
            <ul className="space-y-2 mb-4">
              {(phase.actions || []).map((action, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 bg-[rgba(10,26,34,0.5)] rounded-lg p-3">
                  <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color }} />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
            
            {phase.milestone && (
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${color}10` }}>
                <Trophy size={18} style={{ color }} />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Milestone</p>
                  <p className="text-sm font-semibold" style={{ color }}>{phase.milestone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Project Card
function ProjectCard({ project, index, color }) {
  const [ref, visible] = useInView();
  const icons = [FolderKanban, Code2, Lightbulb, Rocket, Star];
  const Icon = icons[index % icons.length];
  
  return (
    <div
      ref={ref}
      className={`glass rounded-xl p-5 hover-lift hover-glow group opacity-0 ${visible ? 'scale-in' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ background: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white mb-1 line-clamp-2">{project}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Timer size={10} /> Project</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Certification Badge
function CertificationBadge({ cert, index }) {
  const [ref, visible] = useInView();
  
  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 px-4 py-3 glass rounded-xl hover-glow opacity-0 ${visible ? 'slide-right' : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
        <Award size={18} className="text-amber-400" />
      </div>
      <span className="text-sm text-gray-300 line-clamp-2">{cert}</span>
    </div>
  );
}

// Interview Tip Card
function InterviewTip({ tip, index }) {
  const [ref, visible] = useInView();
  
  return (
    <div
      ref={ref}
      className={`relative pl-6 py-3 opacity-0 ${visible ? 'slide-right' : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="absolute left-0 top-4 w-3 h-3 rounded-full bg-purple-500/30 border-2 border-purple-500" />
      <p className="text-sm text-gray-300">{tip}</p>
    </div>
  );
}

// Weekly Schedule Block
function ScheduleBlock({ item, index, totalHours }) {
  const [ref, visible] = useInView();
  const colors = ['#14b8a6', '#06b6d4', '#2dd4bf', '#10b981', '#8b5cf6', '#ec4899'];
  const color = colors[index % colors.length];
  
  return (
    <div
      ref={ref}
      className={`glass rounded-xl p-4 hover-glow border-l-4 opacity-0 ${visible ? 'slide-up' : ''}`}
      style={{ borderLeftColor: color, animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Play size={16} style={{ color }} />
        </div>
        <p className="text-sm text-gray-300 flex-1">{item}</p>
      </div>
    </div>
  );
}

// Strengths vs Gaps Comparison
function StrengthsGapsSection({ strengths, gaps }) {
  const [ref, visible] = useInView();
  
  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-6">
      {/* Strengths */}
      <div className={`glass rounded-2xl p-6 shimmer opacity-0 ${visible ? 'slide-right' : ''}`} style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Rocket size={22} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Your Strengths</h3>
            <p className="text-xs text-gray-500">{(strengths || []).length} skills identified</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {(strengths || []).map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 opacity-0 ${visible ? 'slide-right' : ''}`}
              style={{ animationDelay: `${0.2 + i * 0.08}s` }}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle size={14} className="text-emerald-400" />
              </div>
              <span className="text-sm text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Gaps */}
      <div className={`glass rounded-2xl p-6 shimmer opacity-0 ${visible ? 'slide-left' : ''}`} style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Target size={22} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Skills to Develop</h3>
            <p className="text-xs text-gray-500">{(gaps || []).length} skills needed</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {(gaps || []).map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 opacity-0 ${visible ? 'slide-left' : ''}`}
              style={{ animationDelay: `${0.25 + i * 0.08}s` }}
            >
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Plus size={14} className="text-amber-400" />
              </div>
              <span className="text-sm text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Summary Card with Typewriter
function SummaryCard({ summary, targetRole, score }) {
  const [ref, visible] = useInView();
  const { displayed, isTyping } = useTypewriter(visible ? summary : '', 20, 800);
  const { color, label } = getScoreColor(score);
  
  return (
    <div ref={ref} className={`glass rounded-3xl p-8 shimmer relative overflow-hidden opacity-0 ${visible ? 'card-reveal' : ''}`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[rgba(20,184,166,0.1)] to-transparent rounded-bl-[100px]" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[rgba(6,182,212,0.05)] blur-2xl" />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
        {/* Score Ring */}
        <ProgressRing value={score} size={200} strokeWidth={12} />
        
        {/* Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
            <span className="px-4 py-1.5 rounded-full bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.2)] text-[#2dd4bf] text-xs font-bold uppercase tracking-wider">
              Target Role
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: `${color}15`, color }}>
              {label}
            </span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            {targetRole}
          </h2>
          
          <div className="relative">
            <p className="text-gray-400 text-lg leading-relaxed">
              {displayed}
              {isTyping && <span className="inline-block w-0.5 h-5 bg-[#14b8a6] ml-1" style={{ animation: 'blink 0.8s infinite' }} />}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading Animation
function LoadingState() {
  return (
    <div className="glass rounded-3xl p-12 text-center">
      <div className="relative w-48 h-48 mx-auto mb-8">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-[rgba(20,184,166,0.2)] spin-slow" />
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-4 rounded-full border-2 border-[rgba(6,182,212,0.3)] pulse" />
        
        {/* Inner glow */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[rgba(20,184,166,0.2)] to-[rgba(6,182,212,0.1)] glow" />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain size={48} className="text-[#14b8a6] float" />
        </div>
        
        {/* Orbiting particles */}
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: `orbit ${6 + i}s linear infinite`, animationDelay: `${i * -2}s` }}
          >
            <div className="w-3 h-3 rounded-full" style={{ background: ['#14b8a6', '#06b6d4', '#2dd4bf'][i], boxShadow: `0 0 10px ${['#14b8a6', '#06b6d4', '#2dd4bf'][i]}` }} />
          </div>
        ))}
      </div>
      
      <h3 className="text-2xl font-black text-white mb-3 gradient-text">Crafting Your Roadmap</h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Our AI is analyzing your skills and creating a personalized career path...
      </p>
      
      <div className="flex justify-center gap-2 loading-dots">
        <span className="w-3 h-3 rounded-full bg-[#14b8a6]" />
        <span className="w-3 h-3 rounded-full bg-[#06b6d4]" />
        <span className="w-3 h-3 rounded-full bg-[#2dd4bf]" />
      </div>
    </div>
  );
}

// Empty State
function EmptyState() {
  return (
    <div className="glass rounded-3xl p-12 text-center shimmer relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      
      <div className="relative z-10">
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[rgba(20,184,166,0.1)] to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass size={64} className="text-[#14b8a6] float" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 text-[#2dd4bf] w-8 h-8 bounce" />
          <Zap className="absolute bottom-4 -left-4 text-[#06b6d4] w-6 h-6 bounce" style={{ animationDelay: '0.5s' }} />
        </div>
        
        <h3 className="text-3xl font-black text-white mb-4">
          Your Journey <span className="gradient-text">Starts Here</span>
        </h3>
        <p className="text-gray-400 text-lg max-w-lg mx-auto mb-8">
          Enter your dream job title and let our AI create a comprehensive roadmap tailored to your skills.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {['Skill Analysis', 'Learning Path', 'Project Ideas', 'Interview Prep'].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 glass rounded-full">
              <CheckCircle size={14} className="text-[#14b8a6]" />
              <span className="text-sm text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Raw Reply Fallback
function RawReplyCard({ reply }) {
  return (
    <div className="glass rounded-2xl p-6 shimmer">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[rgba(20,184,166,0.15)] flex items-center justify-center">
          <MessageSquare size={18} className="text-[#14b8a6]" />
        </div>
        <h3 className="text-lg font-bold text-white">AI Response</h3>
      </div>
      <div className="prose prose-invert prose-sm max-w-none">
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{reply}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AICareerRoadmap() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [targetRole, setTargetRole] = useState('');
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [error, setError] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [rawReply, setRawReply] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [roadmapHistory, setRoadmapHistory] = useState([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  
  const [heroRef, heroVisible] = useInView();
  const roadmapRef = useRef(null);
  
  useEffect(() => {
    const loadSkills = async () => {
      if (!user?.id) { setSkillsLoading(false); return; }
      try {
        setSkillsLoading(true);
        const res = await api.get(`/user-skills?user_id=${user.id}`);
        setSkills(Array.isArray(res.data) ? res.data : []);
      } catch { setSkills([]); }
      finally { setSkillsLoading(false); }
    };
    loadSkills();
  }, [user?.id]);
  
  const averageProficiency = useMemo(() => {
    if (!skills.length) return 0;
    return (skills.reduce((sum, s) => sum + (proficiencyRank[s.proficiency] || 1), 0) / skills.length).toFixed(1);
  }, [skills]);
  
  const proficiencyLabel = useMemo(() => {
    const avg = parseFloat(averageProficiency);
    if (avg >= 3.5) return 'Professional';
    if (avg >= 2.5) return 'Expert';
    if (avg >= 1.5) return 'Intermediate';
    if (avg > 0) return 'Beginner';
    return 'N/A';
  }, [averageProficiency]);

  const loadRoadmapHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await api.get('/career-roadmap/history');
      setRoadmapHistory(Array.isArray(res.data?.history) ? res.data.history : []);
    } catch {
      setRoadmapHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const openHistory = useCallback(async () => {
    setShowHistory(true);
    if (!roadmapHistory.length) {
      await loadRoadmapHistory();
    }
  }, [roadmapHistory.length, loadRoadmapHistory]);

  const loadHistoryRoadmap = useCallback((item) => {
    const parsedRoadmap = item.roadmap_json || parseJsonFromText(item.ai_response || '');
    if (!parsedRoadmap) {
      setError('Unable to load this saved roadmap.');
      return;
    }

    setTargetRole(item.target_job_title || '');
    setRoadmap(parsedRoadmap);
    setRawReply(item.ai_response || '');
    setExpandedPhase(null);
    setShowHistory(false);

    setTimeout(() => roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
  }, []);
  
  const generateRoadmap = useCallback(async () => {
    if (!targetRole.trim()) { setError('Please enter a target job title.'); return; }
    
    setError('');
    setRoadmap(null);
    setRawReply('');
    setLoadingRoadmap(true);
    setExpandedPhase(null);
    
    const skillsForPayload = skills.map(s => ({
      skill_name: s.skill_name,
      proficiency: s.proficiency,
    }));
    
    try {
      const res = await api.post('/career-roadmap/generate', {
        target_role: targetRole.trim(),
        user_skills: skillsForPayload,
      });

      const reply = res.data?.ai_response || '';
      const parsed = res.data?.roadmap || parseJsonFromText(reply);
      
      if (!parsed) {
        setRawReply(reply || 'Unable to generate roadmap.');
        setError('AI returned unstructured response. Try again.');
      } else {
        setRoadmap(parsed);
        setTimeout(() => roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      }
    } catch {
      setError('Failed to generate roadmap. Please try again.');
    } finally {
      setLoadingRoadmap(false);
    }
  }, [targetRole, skills]);
  
  // Auth check
  if (!user) {
    return (
      <>
        <InjectStyles />
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'linear-gradient(180deg, #030810 0%, #0A1620 50%, #071018 100%)' }}>
          <div className="glass rounded-3xl p-12 text-center max-w-md w-full scale-in">
            <div className="w-24 h-24 rounded-2xl bg-[rgba(20,184,166,0.1)] flex items-center justify-center mx-auto mb-8 float">
              <User size={44} className="text-[#14b8a6]" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3">Login Required</h1>
            <p className="text-gray-400 mb-8">Sign in to access AI-powered career planning.</p>
            <a href="/login" className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold">
              <Zap size={18} />
              <span className="relative z-10">Login to Continue</span>
            </a>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <InjectStyles />
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* ═══════════════════════════════════════
              HERO SECTION
             ═══════════════════════════════════════ */}
          <section ref={heroRef} className={`mb-16 opacity-0 ${heroVisible ? 'slide-down' : ''}`}>
            <div className="text-center mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full mb-6">
                <Brain size={16} className="text-[#14b8a6]" />
                <span className="text-xs font-bold text-[#2dd4bf] uppercase tracking-[0.2em]">AI Career Strategist</span>
                <span className="w-2 h-2 rounded-full bg-[#14b8a6] pulse" />
              </div>
              
              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
                Design Your
                <span className="block gradient-text text-glow">Career Blueprint</span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Leverage AI to analyze your skills, identify gaps, and create a personalized roadmap to your dream role.
              </p>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <StatCard icon={Code2} label="Your Skills" value={skills.length} color="#14b8a6" delay={0.1} />
              <StatCard icon={TrendingUp} label="Avg Level" value={averageProficiency} suffix="/4" color="#06b6d4" delay={0.2} />
              <StatCard icon={Award} label="Proficiency" value={proficiencyLabel} color="#2dd4bf" delay={0.3} />
              <StatCard icon={Wand2} label="AI Engine" value="GPT" color="#8b5cf6" delay={0.4} />
            </div>
          </section>
          
          {/* ═══════════════════════════════════════
              INPUT SECTION
             ═══════════════════════════════════════ */}
          <section className="mb-16">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Skills Panel */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass rounded-2xl p-6 shimmer slide-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[rgba(20,184,166,0.15)] flex items-center justify-center">
                        <Layers size={22} className="text-[#14b8a6]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Your Skills</h3>
                        <p className="text-xs text-gray-500">From your profile</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 glass rounded-full text-xs font-bold text-[#14b8a6]">
                      {skills.length} skills
                    </span>
                  </div>
                  
                  {skillsLoading ? (
                    <div className="flex items-center gap-3 py-8 justify-center">
                      <Loader2 size={20} className="text-[#14b8a6] animate-spin" />
                      <span className="text-gray-400">Loading skills...</span>
                    </div>
                  ) : skills.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-2xl bg-[rgba(30,58,66,0.5)] flex items-center justify-center mx-auto mb-4">
                        <Code2 size={28} className="text-gray-600" />
                      </div>
                      <p className="text-gray-400 text-sm mb-2">No skills found</p>
                      <p className="text-gray-500 text-xs">Add skills in your profile for better results</p>
                    </div>
                  ) : (
                    <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2">
                      {skills.map((s, i) => (
                        <SkillBadge key={`${s.id}-${s.skill_name}`} name={s.skill_name} proficiency={s.proficiency} index={i} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Input Panel */}
              <div className="lg:col-span-3">
                <div className="glass rounded-2xl p-8 shimmer slide-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(20,184,166,0.2)] to-[rgba(6,182,212,0.1)] flex items-center justify-center">
                      <Briefcase size={22} className="text-[#14b8a6]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Define Your Goal</h3>
                      <p className="text-sm text-gray-500">What role do you aspire to?</p>
                    </div>
                    <div className="ml-auto">
                      <button
                        onClick={openHistory}
                        className="px-4 py-2 glass rounded-xl text-sm text-gray-300 hover:text-white hover:border-[rgba(20,184,166,0.35)] transition-all duration-300 cursor-pointer flex items-center gap-2"
                      >
                        <Clock size={14} />
                        History
                      </button>
                    </div>
                  </div>
                  
                  {/* Input field */}
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${inputFocused ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
                      style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(6,182,212,0.08) 100%)', filter: 'blur(20px)' }}
                    />
                    <div className="relative">
                      <Search size={20} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${inputFocused ? 'text-[#14b8a6]' : 'text-gray-600'}`} />
                      <input
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        onKeyDown={(e) => e.key === 'Enter' && !loadingRoadmap && generateRoadmap()}
                        placeholder="e.g., Senior Full Stack Developer, Data Scientist, Product Manager..."
                        className="w-full pl-14 pr-6 py-5 glass-dark rounded-2xl text-white text-lg placeholder:text-gray-600 outline-none transition-all duration-300 focus:border-[rgba(20,184,166,0.4)]"
                      />
                      {inputFocused && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent" />
                      )}
                    </div>
                  </div>
                  
                  {/* Role suggestions */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Frontend Developer', 'Backend Engineer', 'Data Scientist', 'DevOps Engineer', 'Product Manager'].map((role, i) => (
                      <button
                        key={i}
                        onClick={() => setTargetRole(role)}
                        className="px-4 py-2 glass rounded-xl text-sm text-gray-400 hover:text-white hover:border-[rgba(20,184,166,0.3)] transition-all duration-300 cursor-pointer"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                  
                  {/* Generate button */}
                  <button
                    onClick={generateRoadmap}
                    disabled={loadingRoadmap || !targetRole.trim()}
                    className="btn-primary w-full flex items-center justify-center gap-3 px-8 py-5 rounded-xl text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                  >
                    {loadingRoadmap ? (
                      <>
                        <Loader2 size={22} className="animate-spin" />
                        <span className="relative z-10">Analyzing Your Profile...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={22} />
                        <span className="relative z-10">Generate Career Roadmap</span>
                        <ArrowRight size={18} className="relative z-10" />
                      </>
                    )}
                  </button>
                  
                  {/* Error message */}
                  {error && (
                    <div className="flex items-start gap-3 mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 slide-up">
                      <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════
              HISTORY PANEL
             ═══════════════════════════════════════ */}
          {showHistory && (
            <section className="mb-16">
              <div className="glass rounded-2xl p-6 shimmer slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-white">Roadmap History</h3>
                    <p className="text-sm text-gray-500">All your previous full roadmap requests and AI responses</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={loadRoadmapHistory}
                      className="px-3 py-2 glass rounded-lg text-xs text-gray-300 hover:text-white hover:border-[rgba(20,184,166,0.3)] transition-all cursor-pointer"
                    >
                      Refresh
                    </button>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="px-3 py-2 glass rounded-lg text-xs text-gray-300 hover:text-white hover:border-[rgba(20,184,166,0.3)] transition-all cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {historyLoading ? (
                  <div className="flex items-center gap-3 py-10 justify-center">
                    <Loader2 size={20} className="text-[#14b8a6] animate-spin" />
                    <span className="text-gray-400">Loading history...</span>
                  </div>
                ) : roadmapHistory.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-400">No roadmap history found yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                    {roadmapHistory.map((item) => {
                      const created = item.created_at ? new Date(item.created_at).toLocaleString() : 'Unknown time';
                      const isExpanded = expandedHistoryId === item.id;
                      return (
                        <div key={item.id} className="glass-dark rounded-xl border border-[rgba(30,58,66,0.35)] overflow-hidden">
                          <div className="p-4 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
                            <div>
                              <p className="text-white font-semibold">{item.target_job_title}</p>
                              <p className="text-xs text-gray-500 mt-1">Requested on {created}</p>
                              {item.guidance_text && (
                                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{item.guidance_text}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => loadHistoryRoadmap(item)}
                                className="px-3 py-2 rounded-lg bg-[rgba(20,184,166,0.18)] text-[#2dd4bf] text-xs font-semibold hover:bg-[rgba(20,184,166,0.26)] transition-colors cursor-pointer"
                              >
                                Open Roadmap
                              </button>
                              <button
                                onClick={() => setExpandedHistoryId(isExpanded ? null : item.id)}
                                className="px-3 py-2 glass rounded-lg text-xs text-gray-300 hover:text-white hover:border-[rgba(20,184,166,0.3)] transition-all cursor-pointer"
                              >
                                {isExpanded ? 'Hide Full AI' : 'Show Full AI'}
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="border-t border-[rgba(30,58,66,0.35)] p-4 bg-[rgba(6,16,24,0.55)]">
                              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Full AI Response</p>
                              <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed font-sans max-h-[260px] overflow-y-auto">
                                {item.ai_response || 'No AI response saved.'}
                              </pre>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}
          
          {/* ═══════════════════════════════════════
              ROADMAP OUTPUT
             ═══════════════════════════════════════ */}
          <section ref={roadmapRef}>
            {loadingRoadmap ? (
              <LoadingState />
            ) : !roadmap && !rawReply ? (
              <EmptyState />
            ) : rawReply && !roadmap ? (
              <RawReplyCard reply={rawReply} />
            ) : roadmap && (
              <div className="space-y-8">
                {/* Summary Card */}
                <SummaryCard
                  summary={roadmap.summary || 'Your personalized career roadmap has been generated.'}
                  targetRole={roadmap.target_role || targetRole}
                  score={roadmap.match_score || 0}
                />
                
                {/* Strengths vs Gaps */}
                <StrengthsGapsSection strengths={roadmap.current_strengths} gaps={roadmap.missing_skills} />
                
                {/* Learning Path */}
                <div className="glass rounded-3xl p-8 shimmer">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgba(20,184,166,0.2)] to-[rgba(6,182,212,0.1)] flex items-center justify-center">
                      <MapPin size={26} className="text-[#14b8a6]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">Learning Path</h3>
                      <p className="text-gray-500">Your step-by-step journey to {roadmap.target_role || targetRole}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {(roadmap.learning_path || []).map((phase, i) => (
                      <PhaseCard
                        key={i}
                        phase={phase}
                        index={i}
                        isLast={i === (roadmap.learning_path || []).length - 1}
                        isExpanded={expandedPhase === i}
                        onToggle={() => setExpandedPhase(expandedPhase === i ? null : i)}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Projects Grid */}
                {(roadmap.projects || []).length > 0 && (
                  <div className="glass rounded-3xl p-8 shimmer">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                        <FolderKanban size={26} className="text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white">Recommended Projects</h3>
                        <p className="text-gray-500">Build these to demonstrate your skills</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(roadmap.projects || []).map((project, i) => (
                        <ProjectCard key={i} project={project} index={i} color={['#10b981', '#14b8a6', '#06b6d4'][i % 3]} />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Certifications & Interview */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Certifications */}
                  {(roadmap.certifications || []).length > 0 && (
                    <div className="glass rounded-2xl p-6 shimmer">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
                          <GraduationCap size={22} className="text-amber-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Certifications</h3>
                          <p className="text-xs text-gray-500">Recommended credentials</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {(roadmap.certifications || []).map((cert, i) => (
                          <CertificationBadge key={i} cert={cert} index={i} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Interview Prep */}
                  {(roadmap.interview_prep || []).length > 0 && (
                    <div className="glass rounded-2xl p-6 shimmer">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
                          <MessageSquare size={22} className="text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Interview Prep</h3>
                          <p className="text-xs text-gray-500">Key areas to focus on</p>
                        </div>
                      </div>
                      <div className="space-y-1 border-l-2 border-purple-500/30 ml-2">
                        {(roadmap.interview_prep || []).map((tip, i) => (
                          <InterviewTip key={i} tip={tip} index={i} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Weekly Plan */}
                {roadmap.weekly_plan && (
                  <div className="glass rounded-3xl p-8 shimmer">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[rgba(139,92,246,0.15)] flex items-center justify-center">
                          <Calendar size={26} className="text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-white">Weekly Schedule</h3>
                          <p className="text-gray-500">Recommended time investment</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 px-6 py-4 glass rounded-2xl">
                        <Clock size={24} className="text-purple-400" />
                        <div>
                          <p className="text-3xl font-black text-white">{roadmap.weekly_plan.hours_per_week || 0}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Hours / Week</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {(roadmap.weekly_plan.breakdown || []).map((item, i) => (
                        <ScheduleBlock key={i} item={item} index={i} totalHours={roadmap.weekly_plan.hours_per_week || 0} />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* CTA Footer */}
                <div className="glass rounded-3xl p-10 text-center shimmer relative overflow-hidden">
                  <div className="absolute inset-0 dot-pattern opacity-20" />
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgba(20,184,166,0.2)] to-[rgba(6,182,212,0.1)] flex items-center justify-center mx-auto mb-6 glow">
                      <Rocket size={36} className="text-[#14b8a6]" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">
                      Ready to <span className="gradient-text">Begin?</span>
                    </h3>
                    <p className="text-gray-400 text-lg max-w-lg mx-auto mb-8">
                      Your personalized roadmap is ready. Start with Phase 1 and track your progress.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <button
                        onClick={() => { setRoadmap(null); setExpandedPhase(null); }}
                        className="px-8 py-4 glass rounded-xl text-gray-400 hover:text-white hover:border-[rgba(20,184,166,0.4)] transition-all duration-300 font-bold cursor-pointer"
                      >
                        Generate New Roadmap
                      </button>
                      <button className="btn-primary px-8 py-4 rounded-xl text-white font-bold flex items-center gap-2 cursor-pointer">
                        <Star size={18} />
                        <span className="relative z-10">Start Phase 1</span>
                        <ArrowRight size={16} className="relative z-10" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}