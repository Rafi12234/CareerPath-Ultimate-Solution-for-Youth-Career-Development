import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, BookOpen, Briefcase, FileText, LogOut, Menu, X,
  TrendingUp, Activity, ChevronRight, Shield, Zap, Bell, Settings,
  ArrowUpRight, ArrowDownRight, Clock, Calendar, Star, Target,
  Sparkles, Eye, CheckCircle, XCircle, AlertCircle, RefreshCw,
  Award, GraduationCap, Layers, Globe, Flame, Crown,
  ChevronDown, Play, LayoutGrid, Hexagon, Diamond,
  PieChart, Hash, ArrowRight, Loader2, ExternalLink, UserPlus
} from 'lucide-react';
import api from '../utils/api';

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
    @keyframes orbFloat {
      0% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(25px, -35px) scale(1.08); }
      50% { transform: translate(-18px, -55px) scale(0.93); }
      75% { transform: translate(35px, -18px) scale(1.04); }
      100% { transform: translate(0, 0) scale(1); }
    }
    @keyframes floatSlow { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-16px) rotate(2deg); } }
    @keyframes floatMed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes floatFast { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-30px); }
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
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes cardEntrance {
      from { opacity: 0; transform: translateY(30px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
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
      0%, 100% { box-shadow: 0 0 0 0 rgba(20,184,166,0.25); }
      50% { box-shadow: 0 0 0 8px rgba(20,184,166,0); }
    }
    @keyframes cardShine {
      0% { left: -100%; }
      50%, 100% { left: 150%; }
    }
    @keyframes rippleEffect {
      to { transform: scale(2.5); opacity: 0; }
    }
    @keyframes barGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    @keyframes barGrowY { from { transform: scaleY(0); } to { transform: scaleY(1); } }
    @keyframes scanLine {
      0% { top: -10%; }
      100% { top: 110%; }
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
    @keyframes statusDot {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.5); }
    }
    @keyframes ringDraw {
      from { stroke-dashoffset: 283; }
    }
    @keyframes sparkle {
      0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
      50% { opacity: 1; transform: scale(1) rotate(180deg); }
    }
    @keyframes waveBar {
      0%, 100% { height: 30%; }
      50% { height: 100%; }
    }
    @keyframes tickerScroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    @keyframes numberRoll {
      0% { transform: translateY(100%); opacity: 0; filter: blur(4px); }
      60% { filter: blur(0); }
      100% { transform: translateY(0); opacity: 1; filter: blur(0); }
    }
    @keyframes donutFill {
      from { stroke-dasharray: 0 283; }
    }
    @keyframes lineTrace {
      from { stroke-dashoffset: 500; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes heatPulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    @keyframes marqueeDrift {
      0% { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    }
    @keyframes bounceIn {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.15); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes glowPulseText {
      0%, 100% { text-shadow: 0 0 8px rgba(20,184,166,0.4); }
      50% { text-shadow: 0 0 20px rgba(20,184,166,0.8), 0 0 40px rgba(20,184,166,0.3); }
    }
    @keyframes progressShine {
      0% { left: -30%; }
      100% { left: 130%; }
    }
    @keyframes tooltipIn {
      from { opacity: 0; transform: translateX(-8px) scale(0.9); }
      to { opacity: 1; transform: translateX(0) scale(1); }
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
    .slide-right { animation: slideRight 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .slide-left { animation: slideLeft 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .scale-in { animation: scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in { animation: fadeIn 0.5s ease both; }
    .card-entrance { animation: cardEntrance 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .sidebar-item-in { animation: sidebarItemIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
    .bounce-in { animation: bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
    .number-roll { animation: numberRoll 0.9s cubic-bezier(0.16,1,0.3,1) both; }

    .gradient-text {
      background: linear-gradient(135deg, #14b8a6, #06b6d4, #2dd4bf, #14b8a6);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 4s ease infinite;
    }
    .glow-text { animation: glowPulseText 3s ease-in-out infinite; }

    .glass-card {
      background: linear-gradient(135deg, rgba(10,26,34,0.88) 0%, rgba(7,16,21,0.94) 100%);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(30,58,66,0.4);
      transition: all 0.45s cubic-bezier(0.16,1,0.3,1);
    }
    .glass-card:hover {
      border-color: rgba(20,184,166,0.3);
      box-shadow: 0 18px 50px -12px rgba(20,184,166,0.12), 0 0 0 1px rgba(20,184,166,0.08);
    }
    .glass-card-lift:hover { transform: translateY(-5px); }

    .shine-effect { position: relative; overflow: hidden; }
    .shine-effect::after {
      content: '';
      position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
      animation: cardShine 5s ease-in-out infinite;
    }

    .glow-border { position: relative; }
    .glow-border::before {
      content: '';
      position: absolute; inset: -1px; border-radius: inherit; padding: 1px;
      background: conic-gradient(from var(--angle, 0deg), transparent 40%, #14b8a6 50%, transparent 60%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude;
      animation: borderRotate 4s linear infinite;
      opacity: 0; transition: opacity 0.5s;
    }
    .glow-border:hover::before { opacity: 1; }

    .shimmer-skeleton { position: relative; overflow: hidden; background: rgba(30,58,66,0.15); }
    .shimmer-skeleton::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(20,184,166,0.06), transparent);
      animation: shimmer 1.8s ease-in-out infinite;
    }

    .ripple-container { position: relative; overflow: hidden; }
    .ripple-circle {
      position: absolute; border-radius: 50%;
      background: rgba(20,184,166,0.25);
      transform: scale(0); animation: rippleEffect 0.6s ease-out;
      pointer-events: none;
    }

    .dot-grid {
      background-image: radial-gradient(rgba(20,184,166,0.06) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    .bar-grow-x { animation: barGrow 1s cubic-bezier(0.16,1,0.3,1) both; transform-origin: left; }
    .bar-grow-y { animation: barGrowY 1s cubic-bezier(0.16,1,0.3,1) both; transform-origin: bottom; }
    .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
    .status-dot { animation: statusDot 2s ease-in-out infinite; }

    .progress-shine { position: relative; overflow: hidden; }
    .progress-shine::after {
      content: ''; position: absolute; top: 0; left: -30%; width: 30%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
      animation: progressShine 2s ease-in-out infinite;
    }

    .scan-line-overlay::after {
      content: ''; position: absolute; left: 0; width: 100%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(20,184,166,0.1), transparent);
      animation: scanLine 8s linear infinite;
    }

    .wave-bar { animation: waveBar 1.2s ease-in-out infinite; }

    .btn-primary {
      background: linear-gradient(135deg, #14b8a6, #0d9488);
      transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #0d9488, #0f766e);
      transform: translateY(-1px);
      box-shadow: 0 8px 25px -5px rgba(20,184,166,0.3);
    }
    .btn-primary:active:not(:disabled) { transform: translateY(0) scale(0.98); }

    .sidebar-tooltip {
      opacity: 0; transform: translateX(-8px);
      transition: all 0.2s ease; pointer-events: none;
    }
    .sidebar-item:hover .sidebar-tooltip {
      opacity: 1; transform: translateX(0);
    }

    .donut-fill { animation: donutFill 1.5s ease-out both; }
    .line-trace { animation: lineTrace 2s ease-out both; stroke-dasharray: 500; }

    .ticker-scroll { animation: tickerScroll 25s linear infinite; }
    .ticker-scroll:hover { animation-play-state: paused; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1e3a42; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #14b8a6; }
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

function useAnimatedNumber(target, dur = 1200) {
  const [val, setVal] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === prev.current || target == null) return;
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

function useLiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', emoji: '🌅', color: '#f59e0b' };
  if (h < 17) return { text: 'Good Afternoon', emoji: '☀️', color: '#14b8a6' };
  if (h < 21) return { text: 'Good Evening', emoji: '🌆', color: '#8b5cf6' };
  return { text: 'Good Night', emoji: '🌙', color: '#6366f1' };
}

/* ═══════════════════════════════════════
   RIPPLE BUTTON
   ═══════════════════════════════════════ */
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

/* ═══════════════════════════════════════
   TOAST
   ═══════════════════════════════════════ */
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const c = {
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', text: '#10b981', icon: CheckCircle },
    error: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', text: '#ef4444', icon: AlertCircle },
    info: { bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.25)', text: '#14b8a6', icon: Sparkles },
  }[type] || { bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.25)', text: '#14b8a6', icon: Sparkles };
  const Icon = c.icon;
  return (
    <div className="fixed top-6 right-6 z-[100] slide-left">
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl backdrop-blur-xl border shadow-2xl"
        style={{ background: c.bg, borderColor: c.border }}>
        <Icon size={18} style={{ color: c.text }} />
        <span className="text-sm font-semibold" style={{ color: c.text }}>{message}</span>
        <button onClick={onClose} className="ml-2 p-1 rounded-lg hover:bg-white/5 transition cursor-pointer">
          <X size={14} style={{ color: c.text }} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   DONUT CHART (SVG)
   ═══════════════════════════════════════ */
function DonutChart({ segments, size = 120, strokeWidth = 10, centerLabel, centerValue }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#0F3A42" strokeWidth={strokeWidth} />
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circ;
          const o = offset;
          offset += dash;
          return (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={seg.color} strokeWidth={strokeWidth} strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`} strokeDashoffset={-o}
              className="donut-fill" style={{ animationDelay: `${i * 0.15}s`, filter: `drop-shadow(0 0 4px ${seg.color}30)` }} />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white tabular-nums">{centerValue}</span>
        {centerLabel && <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">{centerLabel}</span>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SPARKLINE (SVG)
   ═══════════════════════════════════════ */
function Sparkline({ data, color = '#14b8a6', width = 100, height = 32 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#spark-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        className="line-trace" style={{ filter: `drop-shadow(0 0 3px ${color}40)` }} />
    </svg>
  );
}

/* ═══════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════ */
function StatCard({ icon: Icon, label, value, color, trend, trendValue, delay = 0, visible, sparkData }) {
  const animVal = useAnimatedNumber(visible ? (value || 0) : 0);
  const isPositive = trend === 'up';

  return (
    <div className="glass-card glow-border shine-effect rounded-2xl p-5 group cursor-default card-entrance glass-card-lift relative overflow-hidden"
      style={{ animationDelay: `${delay}s` }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: color }} />
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700"
        style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />
      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity scan-line-overlay" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${color}25, ${color}10)`, boxShadow: `0 4px 12px ${color}15` }}>
            <Icon size={18} style={{ color }} />
          </div>
          {trendValue && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border
              ${isPositive ? 'bg-emerald-500/8 text-emerald-400 border-emerald-500/15' : 'bg-red-500/8 text-red-400 border-red-500/15'}`}>
              {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{trendValue}
            </div>
          )}
        </div>
        <div className="text-3xl font-black text-white tabular-nums mb-0.5 number-roll" style={{ animationDelay: `${delay + 0.2}s` }}>
          {animVal.toLocaleString()}
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold mb-3">{label}</div>
        {sparkData && (
          <div className="mt-1">
            <Sparkline data={sparkData} color={color} width={140} height={28} />
          </div>
        )}
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════
   STATUS BAR
   ═══════════════════════════════════════ */
function StatusBar({ label, count, total, color, delay = 0 }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="group slide-up" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-400 font-medium flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} /> {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600 tabular-nums">{pct.toFixed(0)}%</span>
          <span className="text-xs font-bold text-white tabular-nums px-2 py-0.5 rounded-md group-hover:scale-105 transition-transform"
            style={{ background: `${color}18` }}>{count}</span>
        </div>
      </div>
      <div className="h-1.5 bg-[#0F3A42]/50 rounded-full overflow-hidden">
        <div className="h-full rounded-full bar-grow-x progress-shine" style={{
          width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}90)`,
          animationDelay: `${delay}s`, boxShadow: `0 0 8px ${color}25`
        }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   BAR CHART
   ═══════════════════════════════════════ */
function BarChart({ data, height = 130 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, idx) => {
        const barH = (item.value / max) * 100;
        return (
          <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
            <div className="w-full rounded-t-lg overflow-hidden relative" style={{ height: height - 24, background: '#0F3A42/30' }}>
              <div className="absolute bottom-0 left-0 right-0 rounded-t-lg bar-grow-y group-hover:brightness-125 transition-all"
                style={{ height: `${barH}%`, background: item.color, animationDelay: `${idx * 0.12}s`, filter: `drop-shadow(0 0 6px ${item.color}30)` }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold bg-black/40 px-1.5 py-0.5 rounded">{item.value}</span>
                </div>
              </div>
            </div>
            <span className="text-[9px] text-gray-600 font-medium truncate max-w-full">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
   ACTIVITY ITEM
   ═══════════════════════════════════════ */
function ActivityItem({ icon: Icon, title, description, time, color, delay = 0, isLast }) {
  return (
    <div className="flex gap-3 group slide-right" style={{ animationDelay: `${delay}s` }}>
      <div className="relative flex flex-col items-center">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform z-10"
          style={{ background: `${color}15` }}>
          <Icon size={14} style={{ color }} />
        </div>
        {!isLast && <div className="w-[1px] flex-1 mt-1" style={{ background: `linear-gradient(to bottom, ${color}30, transparent)` }} />}
      </div>
      <div className="flex-1 pb-4">
        <div className="p-3 rounded-xl bg-[#071015]/40 border border-[#1e3a42]/20 group-hover:border-[#14b8a6]/15 transition-all">
          <p className="text-xs font-semibold text-white mb-0.5">{title}</p>
          <p className="text-[10px] text-gray-500 mb-1.5">{description}</p>
          <span className="text-[9px] text-gray-600 flex items-center gap-1"><Clock size={8} /> {time}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   QUICK ACTION
   ═══════════════════════════════════════ */
function QuickAction({ icon: Icon, label, onClick, color, delay = 0 }) {
  return (
    <RippleButton onClick={onClick}
      className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-[#071015]/40 border border-[#1e3a42]/20 hover:border-[#14b8a6]/20 transition-all duration-300 cursor-pointer bounce-in"
      style={{ animationDelay: `${delay}s` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg"
        style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-wider">{label}</span>
    </RippleButton>
  );
}

/* ═══════════════════════════════════════
   METRIC MINI CARD
   ═══════════════════════════════════════ */
function MetricMini({ icon: Icon, label, value, change, positive, color, delay = 0 }) {
  return (
    <div className="glass-card rounded-xl p-3.5 group cursor-default card-entrance hover:border-[#14b8a6]/20 transition-all"
      style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}12` }}>
          <Icon size={13} style={{ color }} />
        </div>
        <div className={`flex items-center gap-0.5 text-[9px] font-bold ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {positive ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}{change}
        </div>
      </div>
      <p className="text-lg font-black text-white group-hover:text-[#2dd4bf] transition-colors tabular-nums">{value}</p>
      <p className="text-[9px] text-gray-600 font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════
   SKELETON
   ═══════════════════════════════════════ */
function DashboardSkeleton() {
  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex justify-between">
              <div className="w-10 h-10 shimmer-skeleton rounded-xl" />
              <div className="w-14 h-5 shimmer-skeleton rounded-lg" />
            </div>
            <div className="w-20 h-8 shimmer-skeleton rounded-lg" />
            <div className="w-28 h-3 shimmer-skeleton rounded" />
            <div className="h-7 shimmer-skeleton rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 shimmer-skeleton rounded-xl" />
              <div className="w-32 h-5 shimmer-skeleton rounded" />
            </div>
            {[...Array(4)].map((_, j) => (
              <div key={j} className="space-y-1.5">
                <div className="flex justify-between">
                  <div className="w-20 h-3 shimmer-skeleton rounded" />
                  <div className="w-8 h-5 shimmer-skeleton rounded-md" />
                </div>
                <div className="h-1.5 shimmer-skeleton rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   LIVE STATUS TICKER
   ═══════════════════════════════════════ */
function StatusTicker({ stats }) {
  const items = [
    { icon: Users, label: 'Users', value: stats?.total_users || 0, color: '#3b82f6' },
    { icon: BookOpen, label: 'Courses', value: stats?.total_courses || 0, color: '#8b5cf6' },
    { icon: Briefcase, label: 'Jobs', value: stats?.total_jobs || 0, color: '#10b981' },
    { icon: FileText, label: 'Applications', value: stats?.total_applications || 0, color: '#f59e0b' },
    { icon: CheckCircle, label: 'Accepted', value: stats?.applications_by_status?.accepted || 0, color: '#10b981' },
    { icon: AlertCircle, label: 'Pending', value: stats?.applications_by_status?.pending || 0, color: '#f59e0b' },
  ];
  return (
    <div className="relative overflow-hidden py-2.5 border-y border-[#1e3a42]/15 fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050D11] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050D11] to-transparent z-10" />
      <div className="flex ticker-scroll" style={{ width: 'max-content' }}>
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-5 shrink-0">
            <item.icon size={12} style={{ color: item.color }} />
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{item.label}</span>
            <span className="text-xs font-bold text-white tabular-nums">{item.value}</span>
            <div className="w-1 h-1 rounded-full bg-[#1e3a42] mx-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  const greeting = useGreeting();
  const clock = useLiveClock();
  const [statsRef, statsVisible] = useInView();
  const [chartsRef, chartsVisible] = useInView();

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });

  useEffect(() => {
    const admin = localStorage.getItem('admin_user');
    if (!admin) { navigate('/login'); return; }
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard/stats');
      setStats(res.data?.data || res.data);
    } catch { showToast('Failed to load stats', 'error'); }
    finally { setLoading(false); }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setTimeout(() => setRefreshing(false), 600);
    showToast('Dashboard refreshed', 'info');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.assign('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users', badge: '24' },
    { id: 'courses', label: 'Courses', icon: GraduationCap, path: '/admin/courses' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/admin/jobs' },
    { id: 'applications', label: 'Applications', icon: Award, path: '/admin/applications', badge: 'New' },
  ];

  const activities = [
    { icon: Users, title: 'New user registered', description: 'John Doe created an account', time: '2m ago', color: '#3b82f6' },
    { icon: FileText, title: 'Application submitted', description: 'Frontend Developer position', time: '15m ago', color: '#8b5cf6' },
    { icon: BookOpen, title: 'Course enrollment', description: 'React Masterclass — 3 new', time: '1h ago', color: '#10b981' },
    { icon: Briefcase, title: 'New job posted', description: 'Senior Backend Developer', time: '2h ago', color: '#f59e0b' },
    { icon: CheckCircle, title: 'Application accepted', description: 'UI/UX Designer role', time: '3h ago', color: '#14b8a6' },
  ];

  const sparkUsers = [12, 18, 15, 22, 28, 25, 32, 30, 35, 40, 38, 45];
  const sparkCourses = [5, 8, 6, 10, 9, 12, 11, 14, 13, 15, 16, 18];
  const sparkJobs = [3, 5, 4, 7, 8, 6, 9, 10, 8, 12, 11, 14];
  const sparkApps = [8, 12, 15, 18, 14, 20, 22, 25, 28, 24, 30, 35];

  const appStatusItems = useMemo(() => {
    if (!stats?.applications_by_status) return [];
    const s = stats.applications_by_status;
    return [
      { label: 'Pending', count: s.pending || 0, color: '#f59e0b' },
      { label: 'Reviewed', count: s.reviewed || 0, color: '#3b82f6' },
      { label: 'Shortlisted', count: s.shortlisted || 0, color: '#8b5cf6' },
      { label: 'Accepted', count: s.accepted || 0, color: '#10b981' },
      { label: 'Rejected', count: s.rejected || 0, color: '#ef4444' },
    ];
  }, [stats]);

  const totalApps = appStatusItems.reduce((s, i) => s + i.count, 0);

  const enrollmentData = useMemo(() => {
    if (!stats?.enrollments_by_level) return [];
    const l = stats.enrollments_by_level;
    return [
      { label: 'Beginner', value: l.beginner || 0, color: '#10b981' },
      { label: 'Mid', value: l.intermediate || 0, color: '#3b82f6' },
      { label: 'Advanced', value: l.advanced || 0, color: '#8b5cf6' },
    ];
  }, [stats]);

  return (
    <>
      <InjectStyles />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="min-h-screen relative overflow-hidden flex" style={{ background: 'linear-gradient(180deg, #03070A 0%, #0A1A22 50%, #050D11 100%)' }}>

        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="blob-1 absolute -top-[15%] -right-[10%] w-[450px] h-[450px] bg-[#14b8a6]/[0.025]" />
          <div className="blob-2 absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-[#06b6d4]/[0.025]" />
          <div className="absolute top-[35%] left-[25%] w-[350px] h-[350px] bg-[radial-gradient(ellipse,rgba(45,212,191,0.02)_0%,transparent_70%)]"
            style={{ animation: 'orbFloat 20s ease-in-out infinite' }} />
          <div className="dot-grid absolute inset-0 opacity-30" />
        </div>

        {/* ═══════════════════════════════
            SIDEBAR
           ═══════════════════════════════ */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-[72px]'} fixed h-screen z-30 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
          <div className="h-full flex flex-col bg-[#060E14]/90 backdrop-blur-2xl border-r border-[#1e3a42]/30">
            <div className="p-4 border-b border-[#1e3a42]/30">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-3 transition-all duration-500 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'}`}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20 pulse-glow">
                    <Shield size={16} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-sm font-black gradient-text tracking-tight">NexusAdmin</h1>
                    <p className="text-[9px] text-gray-600 uppercase tracking-[0.15em] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-dot" /> Online
                    </p>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1e3a42]/30 text-gray-500 hover:text-white transition-all cursor-pointer">
                  <Menu size={16} className={`transition-transform duration-500 ${sidebarOpen ? '' : 'rotate-180'}`} />
                </button>
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-1">
              {menuItems.map((item, i) => {
                const isActive = item.id === 'dashboard';
                return (
                  <div key={item.id} className="relative sidebar-item sidebar-item-in" style={{ animationDelay: `${i * 0.06}s` }}>
                    <button onClick={() => navigate(item.path)}
                      onMouseEnter={() => setSidebarHovered(item.id)}
                      onMouseLeave={() => setSidebarHovered(null)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden
                        ${isActive
                          ? 'bg-[#14b8a6]/12 text-[#2dd4bf] border border-[#14b8a6]/20'
                          : 'text-gray-500 hover:text-gray-300 hover:bg-[#1e3a42]/15 border border-transparent'}`}>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#14b8a6]" style={{ boxShadow: '0 0 10px rgba(20,184,166,0.5)' }} />}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${isActive ? 'bg-[#14b8a6]/15' : 'group-hover:bg-[#1e3a42]/20'}`}>
                        <item.icon size={16} className={`transition-transform duration-300 ${sidebarHovered === item.id ? 'scale-110' : ''}`} />
                      </div>
                      <span className={`text-sm font-semibold transition-all duration-500 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{item.label}</span>
                      {item.badge && sidebarOpen && (
                        <span className={`ml-auto px-2 py-0.5 rounded-md text-[9px] font-bold ${item.badge === 'New' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-[#14b8a6]/15 text-[#14b8a6] border border-[#14b8a6]/20'}`}>{item.badge}</span>
                      )}
                      {isActive && sidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#14b8a6] status-dot" />}
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                    </button>
                    {!sidebarOpen && (
                      <div className="sidebar-tooltip absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#0A1A22] border border-[#1e3a42]/50 rounded-lg text-xs font-semibold text-white whitespace-nowrap z-50 shadow-xl">{item.label}</div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="p-3 border-t border-[#1e3a42]/30">
              {sidebarOpen && (
                <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1e3a42]/10 rounded-xl mb-2 border border-[#1e3a42]/20 fade-in">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">A</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">Super Admin</p>
                    <p className="text-[10px] text-gray-600 truncate">admin@nexus.io</p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-[#1e3a42]/30 text-gray-500 hover:text-white transition-all hover:rotate-90 duration-300 cursor-pointer"><Settings size={13} /></button>
                </div>
              )}
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all cursor-pointer group border border-transparent hover:border-red-500/15">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-500/10 transition-all"><LogOut size={16} /></div>
                <span className={`text-sm font-semibold transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ═══════════════════════════════
            MAIN CONTENT
           ═══════════════════════════════ */}
        <main className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${sidebarOpen ? 'ml-64' : 'ml-[72px]'}`}>
          <div className="relative z-10 p-6 lg:p-8 max-w-[1400px] mx-auto">

            {/* Header */}
            <div className="mb-6 slide-down">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs mb-2">
                    <span className="text-gray-600">Admin</span>
                    <ChevronRight size={11} className="text-gray-700" />
                    <span className="text-[#14b8a6] font-semibold">Dashboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl float-fast">{greeting.emoji}</span>
                    <div>
                      <p className="text-xs text-gray-500">{greeting.text}</p>
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Admin <span className="gradient-text">Dashboard</span>
                      </h1>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                    <Sparkles size={11} className="text-[#14b8a6]" /> Real-time platform overview
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Live clock */}
                  <div className="hidden lg:flex items-center gap-2 px-3.5 py-2.5 bg-[#071015]/60 border border-[#1e3a42]/30 rounded-xl">
                    <Clock size={13} className="text-[#14b8a6]" />
                    <span className="text-xs font-mono text-gray-400 tabular-nums">{clock.toLocaleTimeString()}</span>
                  </div>
                  <div className="hidden lg:flex items-center gap-2 px-3.5 py-2.5 bg-[#071015]/60 border border-[#1e3a42]/30 rounded-xl">
                    <Calendar size={13} className="text-[#06b6d4]" />
                    <span className="text-xs text-gray-400">{clock.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#071015]/60 border border-[#1e3a42]/30 text-gray-500 hover:text-white hover:border-[#14b8a6]/25 transition-all cursor-pointer">
                    <Bell size={15} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full status-dot" />
                  </button>
                  <button onClick={handleRefresh} disabled={refreshing}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl bg-[#071015]/60 border border-[#1e3a42]/30 text-gray-500 hover:text-[#14b8a6] hover:border-[#14b8a6]/25 transition-all cursor-pointer ${refreshing ? 'animate-spin' : ''}`}>
                    <RefreshCw size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Status Ticker */}
            {stats && <StatusTicker stats={stats} />}

            {loading ? <DashboardSkeleton /> : stats ? (
              <>
                {/* Stats Grid */}
                <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6 mb-6">
                  <StatCard icon={Users} label="Total Users" value={stats.total_users} color="#3b82f6" trend="up" trendValue="+12%" delay={0} visible={statsVisible} sparkData={sparkUsers} />
                  <StatCard icon={BookOpen} label="Courses" value={stats.total_courses} color="#8b5cf6" trend="up" trendValue="+8%" delay={0.08} visible={statsVisible} sparkData={sparkCourses} />
                  <StatCard icon={Briefcase} label="Jobs" value={stats.total_jobs} color="#10b981" trend="up" trendValue="+15%" delay={0.16} visible={statsVisible} sparkData={sparkJobs} />
                  <StatCard icon={FileText} label="Applications" value={stats.total_applications} color="#f59e0b" trend="up" trendValue="+23%" delay={0.24} visible={statsVisible} sparkData={sparkApps} />
                  <StatCard icon={AlertCircle} label="Pending" value={stats.applications_by_status?.pending} color="#ef4444" trend="down" trendValue="-5%" delay={0.32} visible={statsVisible} />
                </div>

                {/* Main Content Grid */}
                <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

                  {/* Application Status */}
                  <div className="glass-card glow-border shine-effect rounded-2xl p-5 card-entrance relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/12 flex items-center justify-center">
                          <PieChart size={15} className="text-[#f59e0b]" />
                        </div>
                        <h2 className="text-sm font-bold text-white">Application Status</h2>
                      </div>
                      <span className="text-[10px] text-gray-600 bg-[#0F3A42]/40 px-2 py-0.5 rounded-full tabular-nums font-bold">{totalApps} total</span>
                    </div>

                    {/* Donut + legend */}
                    <div className="flex items-center gap-5">
                      <DonutChart
                        segments={appStatusItems.map(i => ({ value: i.count, color: i.color }))}
                        size={110} strokeWidth={10}
                        centerValue={totalApps} centerLabel="Total"
                      />
                      <div className="flex-1 space-y-2">
                        {appStatusItems.map((item, i) => (
                          <div key={item.label} className="flex items-center justify-between text-xs slide-right" style={{ animationDelay: `${0.2 + i * 0.06}s` }}>
                            <span className="flex items-center gap-1.5 text-gray-400">
                              <div className="w-2 h-2 rounded-full" style={{ background: item.color }} /> {item.label}
                            </span>
                            <span className="font-bold text-white tabular-nums">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bars */}
                    <div className="mt-5 space-y-2.5 pt-4 border-t border-[#1e3a42]/20">
                      {appStatusItems.map((item, i) => (
                        <StatusBar key={item.label} label={item.label} count={item.count} total={totalApps} color={item.color} delay={0.3 + i * 0.06} />
                      ))}
                    </div>
                  </div>

                  {/* Enrollments Chart */}
                  <div className="glass-card glow-border shine-effect rounded-2xl p-5 card-entrance relative overflow-hidden" style={{ animationDelay: '0.18s' }}>
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/12 flex items-center justify-center">
                        <GraduationCap size={15} className="text-[#8b5cf6]" />
                      </div>
                      <h2 className="text-sm font-bold text-white">Enrollments by Level</h2>
                    </div>

                    <BarChart data={enrollmentData} height={140} />

                    <div className="flex items-center justify-center gap-5 mt-5 pt-4 border-t border-[#1e3a42]/20">
                      {enrollmentData.map(item => (
                        <div key={item.label} className="flex items-center gap-1.5 text-[10px]">
                          <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                          <span className="text-gray-500">{item.label}</span>
                          <span className="font-bold text-white">({item.value})</span>
                        </div>
                      ))}
                    </div>

                    {/* Platform metrics */}
                    <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-[#1e3a42]/20">
                      <MetricMini icon={TrendingUp} label="Engagement" value="87%" change="+12%" positive color="#10b981" delay={0.3} />
                      <MetricMini icon={Star} label="Satisfaction" value="4.8/5" change="+0.3" positive color="#f59e0b" delay={0.36} />
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="glass-card glow-border shine-effect rounded-2xl p-5 card-entrance relative overflow-hidden" style={{ animationDelay: '0.26s' }}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#14b8a6]/12 flex items-center justify-center">
                          <Activity size={15} className="text-[#14b8a6]" />
                        </div>
                        <h2 className="text-sm font-bold text-white">Recent Activity</h2>
                      </div>
                      <button className="text-[10px] text-[#14b8a6] hover:text-[#2dd4bf] font-semibold flex items-center gap-1 transition cursor-pointer group/v">
                        All <ArrowRight size={10} className="group-hover/v:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                      {activities.map((a, i) => (
                        <ActivityItem key={i} {...a} delay={0.3 + i * 0.06} isLast={i === activities.length - 1} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions + Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  {/* Quick Actions */}
                  <div className="glass-card glow-border rounded-2xl p-5 card-entrance" style={{ animationDelay: '0.35s' }}>
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-[#14b8a6]/12 flex items-center justify-center">
                        <Zap size={15} className="text-[#14b8a6]" />
                      </div>
                      <h2 className="text-sm font-bold text-white">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <QuickAction icon={UserPlus} label="Add User" onClick={() => navigate('/admin/users')} color="#3b82f6" delay={0.4} />
                      <QuickAction icon={BookOpen} label="New Course" onClick={() => navigate('/admin/courses')} color="#8b5cf6" delay={0.45} />
                      <QuickAction icon={Briefcase} label="Post Job" onClick={() => navigate('/admin/jobs')} color="#10b981" delay={0.5} />
                      <QuickAction icon={FileText} label="Review" onClick={() => navigate('/admin/applications')} color="#f59e0b" delay={0.55} />
                    </div>
                  </div>

                  {/* Platform Overview */}
                  <div className="glass-card glow-border rounded-2xl p-5 card-entrance" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/12 flex items-center justify-center">
                        <Globe size={15} className="text-[#06b6d4]" />
                      </div>
                      <h2 className="text-sm font-bold text-white">Platform Overview</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <MetricMini icon={Clock} label="Avg. Session" value="24m" change="+5m" positive color="#3b82f6" delay={0.45} />
                      <MetricMini icon={Globe} label="Active Users" value="2.4K" change="-2%" positive={false} color="#8b5cf6" delay={0.5} />
                      <MetricMini icon={Eye} label="Page Views" value="12.8K" change="+18%" positive color="#14b8a6" delay={0.55} />
                      <MetricMini icon={Target} label="Conversion" value="3.2%" change="+0.8%" positive color="#f59e0b" delay={0.6} />
                    </div>
                  </div>
                </div>

                {/* System Status Footer */}
                <div className="flex items-center justify-center gap-4 py-4 text-[10px] text-gray-600 fade-in" style={{ animationDelay: '0.7s' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-dot" />
                    <span>All systems operational</span>
                  </div>
                  <span className="text-gray-700">·</span>
                  <span>Updated: {new Date().toLocaleTimeString()}</span>
                  <span className="text-gray-700">·</span>
                  <span>v2.1.0</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-28 slide-up">
                <div className="w-20 h-20 rounded-2xl bg-red-500/8 flex items-center justify-center mb-5 border border-red-500/15 float-slow">
                  <XCircle size={36} className="text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Failed to Load Data</h3>
                <p className="text-gray-500 text-sm mb-6">Unable to fetch dashboard statistics</p>
                <RippleButton onClick={fetchStats}
                  className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm cursor-pointer">
                  <RefreshCw size={15} /> Try Again
                </RippleButton>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}