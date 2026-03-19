import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search, MapPin, Building2, Briefcase, TrendingUp, Send, X,
  DollarSign, Star, CheckCircle, Clock, Award, ChevronRight,
  Loader2, Sparkles, Zap, Eye, Target, Layers, Bookmark,
  BookmarkCheck, ArrowRight, ChevronDown, Filter, Grid3X3,
  LayoutList, ArrowUpRight, Flame, Shield, Code2, Crown
} from 'lucide-react';
import api from '../utils/api';

const skillColors = [
  'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'bg-blue-500/15 text-blue-400 border-blue-500/25',
  'bg-purple-500/15 text-purple-300 border-purple-500/25',
  'bg-pink-500/15 text-pink-400 border-pink-500/25',
  'bg-amber-500/15 text-amber-400 border-amber-500/25',
];

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
    @keyframes floatSlow { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-20px) rotate(3deg); } }
    @keyframes floatMed { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-14px) rotate(-2deg); } }
    @keyframes floatFast { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes textReveal {
      from { clip-path: inset(0 100% 0 0); opacity: 0; }
      to { clip-path: inset(0 0 0 0); opacity: 1; }
    }
    @keyframes glowPulse {
      0%, 100% { opacity: 0.4; filter: blur(40px); }
      50% { opacity: 0.7; filter: blur(60px); }
    }
    @keyframes borderRotate {
      from { --angle: 0deg; }
      to { --angle: 360deg; }
    }
    @keyframes slideUp { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideRight { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes modalReveal {
      from { opacity: 0; transform: translateY(80px) scale(0.9) rotateX(5deg); }
      to { opacity: 1; transform: translateY(0) scale(1) rotateX(0); }
    }
    @keyframes modalBg { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(12px); } }
    @keyframes ringProgress {
      from { stroke-dasharray: 0 999; }
    }
    @keyframes sparkle {
      0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
      50% { opacity: 1; transform: scale(1) rotate(180deg); }
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    @keyframes rippleEffect {
      to { transform: scale(2.5); opacity: 0; }
    }
    @keyframes neonFlicker {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { text-shadow: 0 0 10px rgba(20,184,166,0.5), 0 0 20px rgba(20,184,166,0.3), 0 0 40px rgba(20,184,166,0.1); }
      20%, 24%, 55% { text-shadow: none; }
    }
    @keyframes cardShine {
      0% { left: -100%; }
      50%, 100% { left: 150%; }
    }
    @keyframes dotPulse {
      0%, 80%, 100% { transform: scale(0); opacity: 0; }
      40% { transform: scale(1); opacity: 1; }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes tiltIn {
      from { opacity: 0; transform: perspective(1000px) rotateY(-8deg) translateX(-30px); }
      to { opacity: 1; transform: perspective(1000px) rotateY(0) translateX(0); }
    }
    @keyframes countFlip {
      0% { transform: translateY(100%); opacity: 0; }
      60% { transform: translateY(-10%); }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes orbFloat {
      0% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(30px, -40px) scale(1.1); }
      50% { transform: translate(-20px, -60px) scale(0.9); }
      75% { transform: translate(40px, -20px) scale(1.05); }
      100% { transform: translate(0, 0) scale(1); }
    }
    @keyframes scanLine {
      0% { top: -10%; }
      100% { top: 110%; }
    }
    @keyframes barGrow {
      from { width: 0%; }
    }

    .blob-1 { animation: morphBlob1 15s ease-in-out infinite; }
    .blob-2 { animation: morphBlob2 18s ease-in-out infinite; }
    .float-slow { animation: floatSlow 6s ease-in-out infinite; }
    .float-med { animation: floatMed 4.5s ease-in-out infinite; }
    .float-fast { animation: floatFast 3s ease-in-out infinite; }

    .text-reveal { animation: textReveal 0.8s cubic-bezier(0.77,0,0.175,1) both; }
    .slide-up { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
    .slide-down { animation: slideDown 0.6s cubic-bezier(0.16,1,0.3,1) both; }
    .scale-in { animation: scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .slide-right { animation: slideRight 0.6s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in { animation: fadeIn 0.6s ease both; }
    .tilt-in { animation: tiltIn 0.7s cubic-bezier(0.16,1,0.3,1) both; }

    .gradient-text {
      background: linear-gradient(135deg, #14b8a6, #06b6d4, #2dd4bf, #14b8a6);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 4s ease infinite;
    }

    .neon-text { animation: neonFlicker 3s infinite; }

    .glass-card {
      background: linear-gradient(135deg, rgba(10,26,34,0.9) 0%, rgba(7,16,21,0.95) 100%);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(30,58,66,0.4);
      transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
    }
    .glass-card:hover {
      border-color: rgba(20,184,166,0.3);
      transform: translateY(-6px);
      box-shadow: 0 20px 60px -15px rgba(20,184,166,0.15), 0 0 0 1px rgba(20,184,166,0.1);
    }
    .glass-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba(20,184,166,0.05) 0%, transparent 50%, rgba(6,182,212,0.03) 100%);
      opacity: 0;
      transition: opacity 0.5s;
    }
    .glass-card:hover::before { opacity: 1; }

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
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
      animation: cardShine 4s ease-in-out infinite;
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

    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    .magnetic-btn {
      transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
    }

    .tab-indicator {
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    }

    .radar-grid { stroke: #1e3a42; fill: none; }
    .radar-fill { transition: all 0.8s cubic-bezier(0.16,1,0.3,1); }

    .featured-scroll {
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }
    .featured-scroll > * {
      scroll-snap-align: start;
    }
    .featured-scroll::-webkit-scrollbar { display: none; }

    .marquee-track {
      animation: marquee 30s linear infinite;
    }
    .marquee-track:hover {
      animation-play-state: paused;
    }

    .ripple-container {
      position: relative;
      overflow: hidden;
    }
    .ripple-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(20,184,166,0.3);
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out;
      pointer-events: none;
    }

    .scan-line::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(20,184,166,0.15), transparent);
      animation: scanLine 8s linear infinite;
    }

    .bar-animate { animation: barGrow 1.2s cubic-bezier(0.16,1,0.3,1) both; }

    .dot-grid {
      background-image: radial-gradient(rgba(20,184,166,0.08) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    .card-3d {
      transform-style: preserve-3d;
      perspective: 1000px;
    }

    .modal-reveal { animation: modalReveal 0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .modal-bg { animation: modalBg 0.3s ease both; }

    .skill-pop {
      animation: scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    }

    .counter-flip {
      animation: countFlip 0.6s cubic-bezier(0.16,1,0.3,1) both;
    }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1e3a42; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #14b8a6; }
  `}</style>
);

/* ─── Hooks ─── */
function useInView(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1, ...opts });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
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

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return pos;
}

/* ─── 3D Tilt Card Wrapper ─── */
function TiltCard({ children, className = '', intensity = 8 }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.01,1.01,1.01)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleLeave = () => {
    setStyle({ transform: 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1,1,1)', transition: 'transform 0.5s ease-out' });
  };

  return (
    <div ref={cardRef} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`card-3d ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ─── Ripple Button ─── */
function RippleButton({ children, onClick, disabled, className, ...props }) {
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

/* ─── Radar Chart ─── */
function RadarChart({ skills, experience, track, size = 140 }) {
  const c = size / 2;
  const r = size * 0.38;
  const angles = [-90, 30, 150].map(a => a * Math.PI / 180);
  const values = [skills / 60, experience / 20, track / 20];
  const labels = ['Skills', 'Exp', 'Track'];

  const point = (i, scale) => ({
    x: c + Math.cos(angles[i]) * r * scale,
    y: c + Math.sin(angles[i]) * r * scale,
  });

  const gridLevels = [0.33, 0.66, 1];
  const dataPoints = values.map((v, i) => point(i, v));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((level, li) => (
        <polygon key={li} className="radar-grid"
          points={angles.map((_, i) => { const p = point(i, level); return `${p.x},${p.y}`; }).join(' ')}
          strokeWidth="0.5" strokeDasharray={li < 2 ? '2,3' : 'none'} opacity={0.4 + li * 0.2}
        />
      ))}
      {angles.map((_, i) => {
        const p = point(i, 1);
        return <line key={i} x1={c} y1={c} x2={p.x} y2={p.y} stroke="#1e3a42" strokeWidth="0.5" opacity="0.5" />;
      })}
      <polygon className="radar-fill" points={dataPath.replace(/[MLZ]/g, (m) => m === 'Z' ? '' : '').trim().replace(/(\d+\.?\d*),(\d+\.?\d*)/g, '$1,$2')}
        fill="url(#radarGrad)" stroke="#14b8a6" strokeWidth="1.5" opacity="0.9"
        style={{ filter: 'drop-shadow(0 0 8px rgba(20,184,166,0.3))' }}
      />
      <path d={dataPath} fill="url(#radarGrad)" stroke="#14b8a6" strokeWidth="1.5" strokeLinejoin="round" opacity="0.85" />
      {dataPoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#0A1A22" stroke="#14b8a6" strokeWidth="2" />
          <circle cx={p.x} cy={p.y} r="2" fill="#14b8a6" />
        </g>
      ))}
      {angles.map((_, i) => {
        const p = point(i, 1.25);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="#9ca3af" fontSize="9" fontWeight="600">{labels[i]}</text>
        );
      })}
      <defs>
        <radialGradient id="radarGrad">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.08" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Ring Score ─── */
function ScoreRing({ score, size = 90, sw = 5 }) {
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#14b8a6' : '#f59e0b';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-3 rounded-full blur-lg opacity-25" style={{ background: color }} />
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#0F3A42" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}50)`, animation: 'ringProgress 1.2s ease-out both' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white tabular-nums">{score}%</span>
      </div>
    </div>
  );
}

/* ─── Skeleton ─── */
function Skeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="flex gap-6">
        <div className="w-24 h-24 rounded-full bg-[#1e3a42]/30 animate-pulse shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-5 w-2/3 bg-[#1e3a42]/30 rounded-lg animate-pulse" />
          <div className="h-4 w-1/3 bg-[#1e3a42]/20 rounded-lg animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="h-3 w-full bg-[#1e3a42]/15 rounded-lg animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="h-6 w-16 bg-[#1e3a42]/20 rounded-full animate-pulse" style={{ animationDelay: `${i*0.1}s` }} />)}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 scan-line pointer-events-none" />
    </div>
  );
}

/* ─── Stats Card ─── */
function StatsCard({ stat, statsVisible, index }) {
  const animVal = useAnimatedNumber(statsVisible ? stat.value : 0);

  return (
    <TiltCard intensity={4}>
      <div className="glass-card rounded-2xl p-5 text-center relative overflow-hidden group cursor-default"
        style={{ animationDelay: `${index * 0.08}s` }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: stat.color }} />
        <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
          style={{ background: `${stat.bg}15` }}>
          <stat.icon size={18} style={{ color: stat.color }} />
        </div>
        <div className="text-3xl font-black tabular-nums mb-1" style={{ color: stat.color }}>
          {animVal}
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold">{stat.label}</div>
      </div>
    </TiltCard>
  );
}

/* ─── Featured Job Card ─── */
function FeaturedCard({ job, score, onApply, onDetails, applied, applying }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#14b8a6' : '#f59e0b';
  const label = score >= 80 ? 'Top Match' : score >= 60 ? 'Good Fit' : 'Explore';

  return (
    <TiltCard intensity={6} className="shrink-0 w-[320px] sm:w-[360px]">
      <div className="glass-card glow-border shine-effect rounded-2xl p-5 h-full relative overflow-hidden">
        {/* Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
          <Flame size={10} /> {label}
        </div>

        {/* Score */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="#0F3A42" strokeWidth="3" />
              <circle cx="28" cy="28" r="24" fill="none" stroke={color} strokeWidth="3"
                strokeDasharray={`${(score/100)*2*Math.PI*24} ${2*Math.PI*24}`} strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 4px ${color}40)` }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black text-white">{score}%</span>
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="text-base font-bold text-white truncate">{job.title}</h4>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Building2 size={11} /> {job.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {[{ icon: MapPin, t: job.location }, { icon: Briefcase, t: job.level }].map((m, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0F3A42]/40 rounded text-[10px] text-gray-400 border border-[#1e3a42]/30">
              <m.icon size={10} /> {m.t}
            </span>
          ))}
        </div>

        {(job.salary_min || job.salary_max) && (
          <div className="text-sm font-bold text-emerald-400 mb-4">
            ৳{job.salary_min?.toLocaleString()} – ৳{job.salary_max?.toLocaleString()}<span className="text-emerald-400/40 text-xs font-normal"> /mo</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-4">
          {(job.skills || []).slice(0, 4).map((s, i) => (
            <span key={i} className="px-2 py-0.5 text-[10px] rounded-full bg-[#14b8a6]/10 text-[#2dd4bf] border border-[#14b8a6]/20">{s}</span>
          ))}
          {(job.skills || []).length > 4 && <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#0F3A42]/40 text-gray-500">+{job.skills.length - 4}</span>}
        </div>

        <div className="flex gap-2 mt-auto">
          <RippleButton onClick={() => onApply(job.id)} disabled={applied || applying}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer
              ${applied ? 'bg-emerald-600/70' : applying ? 'bg-gray-600' : 'bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] hover:shadow-lg hover:shadow-[#14b8a6]/20'}`}>
            {applied ? <><CheckCircle size={12} /> Applied</> : applying ? <><Loader2 size={12} className="animate-spin" /> ...</> : <><Send size={12} /> Apply</>}
          </RippleButton>
          <button onClick={() => onDetails(job)}
            className="px-3 py-2 border border-[#1e3a42]/50 rounded-xl text-gray-500 hover:text-white hover:border-[#14b8a6]/30 transition-all text-xs cursor-pointer">
            <Eye size={14} />
          </button>
        </div>
      </div>
    </TiltCard>
  );
}

/* ═══════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════ */
export default function Jobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [applyingTo, setApplyingTo] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [searchFocused, setSearchFocused] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const mousePos = useMousePosition();
  const featuredRef = useRef(null);

  const [heroRef, heroVisible] = useInView();
  const [statsRef, statsVisible] = useInView();
  const [listRef, listVisible] = useInView();

  useEffect(() => {
    fetchJobs();
    if (user) { fetchUserSkills(); fetchAppliedJobs(); }
  }, [user]);

  const fetchJobs = async () => {
    try { const r = await api.get('/jobs'); setJobs(Array.isArray(r.data) ? r.data : []); }
    catch { setJobs([]); }
    finally { setLoading(false); }
  };
  const fetchUserSkills = async () => {
    try { const r = await api.get(`/user-skills?user_id=${user.id}`); setUserSkills(Array.isArray(r.data) ? r.data : []); }
    catch { setUserSkills([]); }
  };
  const fetchAppliedJobs = async () => {
    try { const r = await api.get(`/job-applications?user_id=${user.id}`); setAppliedJobs(new Set((Array.isArray(r.data) ? r.data : []).map(a => a.job_id))); }
    catch {}
  };

  const applyToJob = (jobId) => {
    if (!user) { navigate('/login'); return; }
    if (appliedJobs.has(jobId)) return;
    // Navigate to the comprehensive application form instead of quick apply
    navigate(`/apply-job/${jobId}`);
  };

  const toggleSave = (id) => setSavedJobs(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const proficiencyRank = { Beginner: 1, Intermediate: 2, Expert: 3, Professional: 4 };
  const jobLevelRank = { 'Entry Level': 1, 'Mid Level': 2, Senior: 3 };
  const avgProficiency = userSkills.length > 0 ? userSkills.reduce((s, sk) => s + (proficiencyRank[sk.proficiency] || 1), 0) / userSkills.length : 0;
  const userSkillNames = useMemo(() => userSkills.map(s => (s.skill_name || '').toLowerCase()), [userSkills]);

  const getMatchDetails = useCallback((job) => {
    if (!user || userSkills.length === 0) return { total: 0, skills: 0, experience: 0, track: 0, matchedSkills: [] };
    const jsk = (Array.isArray(job.skills) ? job.skills : []).map(s => s.toLowerCase());
    const matched = jsk.filter(js => userSkillNames.includes(js));
    const skillScore = jsk.length > 0 ? Math.round((matched.length / jsk.length) * 60) : 0;
    const req = jobLevelRank[job.level] || 1;
    let expScore = avgProficiency >= req ? 20 : (req - avgProficiency <= 1 ? 12 : req - avgProficiency <= 2 ? 5 : 0);
    let trackScore = matched.length > 0 ? (matched.length >= jsk.length * 0.5 ? 20 : 10) : 0;
    return { total: skillScore + expScore + trackScore, skills: skillScore, experience: expScore, track: trackScore, matchedSkills: matched };
  }, [user, userSkills, userSkillNames, avgProficiency]);

  const getMatchScore = (j) => getMatchDetails(j).total;
  const avgLevelLabel = avgProficiency >= 3.5 ? 'Professional' : avgProficiency >= 2.5 ? 'Expert' : avgProficiency >= 1.5 ? 'Intermediate' : avgProficiency > 0 ? 'Beginner' : 'N/A';

  const filteredJobs = useMemo(() => jobs.filter(j => {
    const ms = [j.title, j.company, ...(j.skills || [])].some(s => (s || '').toLowerCase().includes(search.toLowerCase()));
    if (filter === 'all') return ms;
    const sc = getMatchScore(j);
    if (filter === 'excellent') return ms && sc >= 80;
    if (filter === 'good') return ms && sc >= 60 && sc < 80;
    if (filter === 'fair') return ms && sc < 60;
    if (filter === 'saved') return ms && savedJobs.has(j.id);
    return ms;
  }), [jobs, search, filter, savedJobs, getMatchScore]);

  const topMatches = useMemo(() =>
    [...jobs].sort((a, b) => getMatchScore(b) - getMatchScore(a)).slice(0, 6).filter(j => getMatchScore(j) > 0),
    [jobs, getMatchScore]
  );

  const excellentCount = useMemo(() => jobs.filter(j => getMatchScore(j) >= 80).length, [jobs]);
  const goodCount = useMemo(() => jobs.filter(j => { const s = getMatchScore(j); return s >= 60 && s < 80; }).length, [jobs]);
  const fairCount = useMemo(() => jobs.filter(j => getMatchScore(j) < 60).length, [jobs]);

  const filters = [
    { key: 'all', label: 'All', icon: Layers, count: jobs.length },
    ...(user ? [
      { key: 'excellent', label: 'Excellent', icon: Crown, count: excellentCount, c: '#10b981' },
      { key: 'good', label: 'Good', icon: Zap, count: goodCount, c: '#14b8a6' },
      { key: 'fair', label: 'Fair', icon: Target, count: fairCount, c: '#f59e0b' },
      { key: 'saved', label: 'Saved', icon: Bookmark, count: savedJobs.size, c: '#ec4899' },
    ] : []),
  ];

  const activeIdx = filters.findIndex(f => f.key === filter);

  return (
    <>
      <InjectStyles />
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #050D11 0%, #0A1A22 40%, #071218 100%)' }}>

        {/* ── Cursor glow ── */}
        <div className="fixed pointer-events-none z-50 mix-blend-screen"
          style={{ left: mousePos.x - 200, top: mousePos.y - 200, width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(20,184,166,0.03) 0%, transparent 70%)',
            transition: 'left 0.3s ease-out, top 0.3s ease-out' }} />

        {/* ── Background ── */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="blob-1 absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#14b8a6]/[0.03]" />
          <div className="blob-2 absolute -bottom-[10%] -right-[15%] w-[600px] h-[600px] bg-[#06b6d4]/[0.03]" />
          <div className="absolute top-[30%] left-[60%] w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(45,212,191,0.025)_0%,transparent_70%)]"
            style={{ animation: 'orbFloat 20s ease-in-out infinite' }} />
          <div className="dot-grid absolute inset-0 opacity-40" />
        </div>

        <div className="relative z-10 pt-24 pb-20">

          {/* ════════════════════════════════════
              HERO SECTION
             ════════════════════════════════════ */}
          <div ref={heroRef} className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 mb-16">
            <div className={`text-center ${heroVisible ? 'slide-down' : 'opacity-0'}`}>
              {/* Floating decorative elements */}
              <div className="relative inline-block mb-8">
                <div className="absolute -top-8 -left-12 float-slow opacity-40">
                  <div className="w-3 h-3 rounded-full bg-[#14b8a6]/40 blur-[2px]" />
                </div>
                <div className="absolute -top-4 -right-16 float-med opacity-30">
                  <div className="w-2 h-2 rounded-full bg-[#06b6d4]/60" />
                </div>
                <div className="absolute top-6 -left-20 float-fast opacity-20">
                  <div className="w-4 h-4 rounded bg-[#2dd4bf]/20 rotate-45" />
                </div>

                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#14b8a6]/[0.08] border border-[#14b8a6]/20 mb-6">
                  <Sparkles size={14} className="text-[#14b8a6] animate-pulse" />
                  <span className="text-xs font-bold text-[#2dd4bf] uppercase tracking-[0.2em]">
                    {user ? 'Intelligent Matching' : 'Career Portal'}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                </div>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                {user ? (
                  <>Discover Your<br /><span className="gradient-text">Dream Career</span></>
                ) : (
                  <>Explore<br /><span className="gradient-text">Opportunities</span></>
                )}
              </h1>
              <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8 text-reveal" style={{ animationDelay: '0.3s' }}>
                {user
                  ? 'AI-powered matching analyzes your skills, experience, and trajectory to find the perfect role'
                  : 'Browse curated positions from top companies and take the next step'}
              </p>

              {/* Stats bubbles in hero */}
              {user && (
                <div className="flex justify-center gap-3 sm:gap-5 flex-wrap scale-in" style={{ animationDelay: '0.5s' }}>
                  {[
                    { icon: Shield, label: 'Skills', value: userSkills.length, color: '#14b8a6' },
                    { icon: Award, label: 'Level', value: avgLevelLabel, color: '#06b6d4' },
                    { icon: Briefcase, label: 'Jobs', value: jobs.length, color: '#2dd4bf' },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0A1A22]/80 border border-[#1e3a42]/40 backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${b.color}15` }}>
                        <b.icon size={15} style={{ color: b.color }} />
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] text-gray-600 uppercase tracking-wider font-bold">{b.label}</div>
                        <div className="text-sm font-bold text-white">{b.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ════════════════════════════════════
              MARQUEE SKILLS TICKER
             ════════════════════════════════════ */}
          {user && userSkills.length > 0 && (
            <div className="relative mb-12 overflow-hidden py-3 border-y border-[#1e3a42]/20 fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050D11] to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050D11] to-transparent z-10" />
              <div className="marquee-track flex gap-4 w-max">
                {[...userSkills, ...userSkills, ...userSkills, ...userSkills].map((s, i) => (
                  <span key={i} className={`shrink-0 px-3 py-1.5 border rounded-full text-xs font-medium whitespace-nowrap ${skillColors[i % skillColors.length]}`}>
                    {s.skill_name} • {s.proficiency}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">

            {/* ════════════════════════════════════
                TOP MATCHES CAROUSEL
               ════════════════════════════════════ */}
            {user && topMatches.length > 0 && !loading && (
              <div className="mb-14 slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20">
                      <Flame size={16} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Top Matches</h2>
                      <p className="text-xs text-gray-600">Best fits based on your profile</p>
                    </div>
                  </div>
                  <button onClick={() => featuredRef.current?.scrollBy({ left: 370, behavior: 'smooth' })}
                    className="flex items-center gap-1 text-xs text-[#14b8a6] hover:text-[#2dd4bf] font-semibold transition-colors cursor-pointer group">
                    Scroll <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div ref={featuredRef} className="featured-scroll flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
                  {topMatches.map((job, i) => (
                    <div key={job.id} className="slide-right" style={{ animationDelay: `${i * 0.08}s` }}>
                      <FeaturedCard job={job} score={getMatchScore(job)} onApply={applyToJob}
                        onDetails={setSelectedJob} applied={appliedJobs.has(job.id)} applying={applyingTo === job.id} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════
                STATS GRID
               ════════════════════════════════════ */}
            {user && (
              <div ref={statsRef} className={`grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10 ${statsVisible ? 'slide-up' : 'opacity-0'}`}>
                {[
                  { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: '#2dd4bf', bg: '#14b8a6' },
                  { label: 'Excellent', value: excellentCount, icon: Crown, color: '#10b981', bg: '#10b981' },
                  { label: 'Good Match', value: goodCount, icon: Zap, color: '#14b8a6', bg: '#14b8a6' },
                  { label: 'Fair Match', value: fairCount, icon: Target, color: '#f59e0b', bg: '#f59e0b' },
                ].map((stat, i) => (
                  <StatsCard
                    key={stat.label}
                    stat={stat}
                    statsVisible={statsVisible}
                    index={i}
                  />
                ))}
              </div>
            )}

            {/* ════════════════════════════════════
                SEARCH + FILTERS
               ════════════════════════════════════ */}
            <div className="mb-8 slide-up" style={{ animationDelay: '0.2s' }}>
              {/* Search */}
              <div className="relative mb-5 group">
                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${searchFocused ? 'opacity-100' : 'opacity-0'}`}
                  style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.08) 0%, rgba(6,182,212,0.04) 100%)', filter: 'blur(20px)' }} />
                <div className="relative">
                  <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 ${searchFocused ? 'text-[#14b8a6] scale-110' : 'text-gray-600'}`}>
                    <Search size={18} />
                  </div>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                    placeholder="Search by title, company, or skills..."
                    className="w-full pl-13 pr-12 py-4 bg-[#0A1A22]/80 border border-[#1e3a42]/50 rounded-2xl text-white placeholder-gray-600 text-[15px]
                      focus:border-[#14b8a6]/40 focus:ring-2 focus:ring-[#14b8a6]/10 transition-all duration-400 backdrop-blur-sm" />
                  {search && (
                    <button onClick={() => setSearch('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg bg-[#1e3a42]/50 text-gray-400 hover:text-white transition-all cursor-pointer hover:bg-[#1e3a42] hover:scale-110">
                      <X size={13} />
                    </button>
                  )}
                  {/* Animated border bottom */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent rounded-full transition-all duration-500 ${searchFocused ? 'w-[90%] opacity-100' : 'w-0 opacity-0'}`} />
                </div>
              </div>

              {/* Filter tabs with sliding indicator */}
              <div className="relative">
                <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
                  {filters.map((f, i) => (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                      className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300
                        ${filter === f.key
                          ? 'bg-[#14b8a6]/15 text-[#2dd4bf] border border-[#14b8a6]/30 shadow-lg shadow-[#14b8a6]/5'
                          : 'text-gray-500 border border-transparent hover:text-gray-300 hover:bg-[#0F3A42]/30'
                        }`}>
                      {filter === f.key && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: f.c || '#14b8a6' }} />}
                      <f.icon size={13} />
                      {f.label}
                      <span className={`ml-0.5 tabular-nums px-1.5 py-0.5 rounded-md text-[10px] ${filter === f.key ? 'bg-[#14b8a6]/20' : 'bg-[#0F3A42]/40'}`}>
                        {f.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════
                RESULTS HEADER
               ════════════════════════════════════ */}
            <div ref={listRef} className={`flex items-center justify-between mb-5 ${listVisible ? 'fade-in' : 'opacity-0'}`}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#14b8a6] to-[#06b6d4]" />
                <h2 className="text-sm font-bold text-white uppercase tracking-[0.15em]">
                  {filter === 'all' ? 'All Jobs' : filters.find(f => f.key === filter)?.label || 'Results'}
                </h2>
                <span className="text-[10px] text-gray-600 bg-[#0F3A42]/40 px-2 py-0.5 rounded-full tabular-nums font-bold">
                  {filteredJobs.length}
                </span>
              </div>
            </div>

            {/* ════════════════════════════════════
                JOBS LIST
               ════════════════════════════════════ */}
            {loading ? (
              <div className="space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="slide-up" style={{ animationDelay: `${i * 0.1}s` }}><Skeleton /></div>)}
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-28 slide-up">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-3xl bg-[#0A1A22] border border-[#1e3a42]/40 flex items-center justify-center mx-auto float-slow">
                    <Briefcase size={36} className="text-gray-700" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 flex items-center justify-center scale-in" style={{ animationDelay: '0.3s' }}>
                    <Search size={14} className="text-[#14b8a6]" />
                  </div>
                </div>
                <p className="text-white text-lg font-bold mb-2">No jobs found</p>
                <p className="text-gray-600 text-sm max-w-sm mx-auto mb-6">Try different search terms or adjust your filters</p>
                {(search || filter !== 'all') && (
                  <button onClick={() => { setSearch(''); setFilter('all'); }}
                    className="px-6 py-2.5 bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-xl text-[#2dd4bf] text-sm font-bold hover:bg-[#14b8a6]/20 transition-all cursor-pointer">
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job, idx) => {
                  const details = getMatchDetails(job);
                  const score = details.total;
                  const jobSkills = Array.isArray(job.skills) ? job.skills : [];
                  const isSaved = savedJobs.has(job.id);
                  const isExpanded = expandedCard === job.id;
                  const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#14b8a6' : '#f59e0b';
                  const matchText = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair';

                  return (
                    <div key={job.id} className="tilt-in" style={{ animationDelay: `${idx * 0.06}s` }}>
                      <TiltCard intensity={3}>
                        <div className="glass-card glow-border shine-effect rounded-2xl relative overflow-hidden">
                          {/* Top color accent */}
                          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
                            background: `linear-gradient(90deg, transparent, ${scoreColor}60, transparent)`
                          }} />

                          <div className="p-5 sm:p-6 relative z-10">
                            <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">

                              {/* ── Score + Radar ── */}
                              {user && (
                                <div className="flex items-center lg:flex-col gap-5 lg:gap-3 lg:justify-center lg:min-w-[130px]">
                                  <ScoreRing score={score} />
                                  <div className="hidden lg:block">
                                    <RadarChart skills={details.skills} experience={details.experience} track={details.track} size={120} />
                                  </div>
                                  <span className="text-[11px] font-bold uppercase tracking-wider lg:hidden" style={{ color: scoreColor }}>
                                    {matchText} Match
                                  </span>
                                </div>
                              )}

                              {/* ── Content ── */}
                              <div className="flex-1 min-w-0">
                                {/* Header row */}
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <h3 className="text-lg sm:text-xl font-bold text-white leading-snug hover:text-[#2dd4bf] transition-colors cursor-default">
                                        {job.title}
                                      </h3>
                                      {user && (
                                        <span className="shrink-0 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider"
                                          style={{ background: `${scoreColor}15`, color: scoreColor, border: `1px solid ${scoreColor}25` }}>
                                          {matchText}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {[
                                        { icon: Building2, t: job.company },
                                        { icon: MapPin, t: job.location },
                                        { icon: Briefcase, t: job.level },
                                      ].map((m, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0F3A42]/30 rounded-md text-[11px] text-gray-500 border border-[#1e3a42]/25">
                                          <m.icon size={10} className="text-gray-600" /> {m.t}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <button onClick={() => toggleSave(job.id)} title={isSaved ? 'Unsave' : 'Save'}
                                    className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border cursor-pointer transition-all duration-300 hover:scale-110
                                      ${isSaved ? 'bg-pink-500/15 border-pink-500/25 text-pink-400' : 'bg-[#0F3A42]/30 border-[#1e3a42]/30 text-gray-600 hover:text-gray-300'}`}>
                                    {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                                  </button>
                                </div>

                                {/* Description */}
                                {job.description && (
                                  <p className={`text-sm text-gray-400/80 leading-relaxed mb-3 ${isExpanded ? '' : 'line-clamp-2'}`}>
                                    {job.description}
                                  </p>
                                )}

                                {/* Salary */}
                                {(job.salary_min || job.salary_max) && (
                                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/[0.06] border border-emerald-500/15 rounded-lg mb-3">
                                    <DollarSign size={12} className="text-emerald-400" />
                                    <span className="text-sm font-bold text-emerald-400">
                                      ৳{job.salary_min?.toLocaleString()} – ৳{job.salary_max?.toLocaleString()}
                                      <span className="text-emerald-400/40 text-[10px] font-normal ml-1">/mo</span>
                                    </span>
                                  </div>
                                )}

                                {/* Skills */}
                                <div className="mb-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-bold">
                                      Skills {user && <span className="text-[#14b8a6]">{details.matchedSkills.length}/{jobSkills.length}</span>}
                                    </span>
                                    {user && jobSkills.length > 0 && (
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-16 h-1 bg-[#0F3A42] rounded-full overflow-hidden">
                                          <div className="h-full rounded-full bar-animate" style={{
                                            width: `${(details.matchedSkills.length / jobSkills.length) * 100}%`,
                                            background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}80)`
                                          }} />
                                        </div>
                                        <span className="text-[9px] tabular-nums font-bold" style={{ color: scoreColor }}>
                                          {Math.round((details.matchedSkills.length / jobSkills.length) * 100)}%
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {jobSkills.map((skill, i) => {
                                      const matched = user && details.matchedSkills.includes(skill.toLowerCase());
                                      return (
                                        <span key={i} className={`skill-pop inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-full border cursor-default transition-all duration-200 hover:scale-105
                                          ${matched
                                            ? 'bg-emerald-500/12 text-emerald-300 border-emerald-500/25 shadow-sm shadow-emerald-500/5'
                                            : 'bg-[#0F3A42]/30 text-gray-500 border-[#1e3a42]/30 hover:border-[#1e3a42]/60'}`}
                                          style={{ animationDelay: `${i * 0.04}s` }}>
                                          {matched && <CheckCircle size={9} />} {skill}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Match indicators */}
                                {user && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {[
                                      { icon: TrendingUp, label: details.experience >= 20 ? 'Meets level' : details.experience >= 12 ? 'Close' : 'Below',
                                        active: details.experience >= 12, color: details.experience >= 20 ? '#10b981' : details.experience >= 12 ? '#f59e0b' : '#6b7280' },
                                      { icon: Target, label: details.track >= 20 ? 'Same track' : details.track >= 10 ? 'Related' : 'Different',
                                        active: details.track >= 10, color: details.track >= 20 ? '#10b981' : details.track >= 10 ? '#14b8a6' : '#6b7280' },
                                    ].map((ind, i) => (
                                      <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all"
                                        style={{ background: `${ind.color}08`, color: ind.color, borderColor: `${ind.color}20` }}>
                                        <ind.icon size={10} /> {ind.label}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Expandable details */}
                                {isExpanded && user && (
                                  <div className="scale-in mb-4 p-4 bg-[#071015]/50 border border-[#1e3a42]/25 rounded-xl">
                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                      {[
                                        { label: 'Skills', val: details.skills, max: 60, c: '#14b8a6' },
                                        { label: 'Experience', val: details.experience, max: 20, c: '#06b6d4' },
                                        { label: 'Track', val: details.track, max: 20, c: '#2dd4bf' },
                                      ].map(b => (
                                        <div key={b.label} className="text-center">
                                          <div className="text-[10px] text-gray-600 uppercase tracking-wider font-bold mb-1">{b.label}</div>
                                          <div className="text-lg font-black tabular-nums" style={{ color: b.c }}>{b.val}<span className="text-gray-600 text-[10px]">/{b.max}</span></div>
                                          <div className="w-full h-1 bg-[#0F3A42] rounded-full mt-1 overflow-hidden">
                                            <div className="h-full rounded-full bar-animate" style={{ width: `${(b.val / b.max) * 100}%`, background: b.c }} />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    {/* Inline radar */}
                                    <div className="flex justify-center">
                                      <RadarChart skills={details.skills} experience={details.experience} track={details.track} size={160} />
                                    </div>
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2.5">
                                  <RippleButton onClick={() => applyToJob(job.id)}
                                    disabled={appliedJobs.has(job.id) || applyingTo === job.id}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-300 cursor-pointer
                                      ${appliedJobs.has(job.id) ? 'bg-emerald-600/70 cursor-default shadow-lg shadow-emerald-500/10'
                                        : applyingTo === job.id ? 'bg-gray-600 cursor-wait'
                                        : 'bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] hover:shadow-xl hover:shadow-[#14b8a6]/20 hover:scale-[1.03] active:scale-[0.97]'}`}>
                                    {appliedJobs.has(job.id) ? <><CheckCircle size={14} /> Applied</> : applyingTo === job.id ? <><Loader2 size={14} className="animate-spin" /> ...</> : <><Send size={14} /> Apply</>}
                                  </RippleButton>

                                  <button onClick={() => setSelectedJob(job)}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#1e3a42]/40 rounded-xl text-gray-400 text-sm font-medium hover:border-[#14b8a6]/30 hover:text-white hover:bg-[#14b8a6]/5 transition-all duration-300 cursor-pointer group/d">
                                    <Eye size={14} /> Details
                                    <ArrowUpRight size={11} className="opacity-0 group-hover/d:opacity-100 transition-all duration-200" />
                                  </button>

                                  {user && (
                                    <button onClick={() => setExpandedCard(isExpanded ? null : job.id)}
                                      className="ml-auto flex items-center gap-1 text-[10px] text-gray-600 hover:text-[#14b8a6] transition-colors cursor-pointer font-semibold uppercase tracking-wider">
                                      {isExpanded ? 'Less' : 'Breakdown'}
                                      <ChevronDown size={12} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* ── Side breakdown (desktop) ── */}
                              {user && (
                                <div className="hidden xl:block xl:min-w-[180px] self-start">
                                  <div className="bg-[#071015]/50 border border-[#1e3a42]/25 rounded-xl p-4">
                                    <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                                      <Award size={10} className="text-[#2dd4bf]" /> Breakdown
                                    </h4>
                                    {[
                                      { l: 'Skills', v: details.skills, m: 60, c: '#14b8a6' },
                                      { l: 'Experience', v: details.experience, m: 20, c: '#06b6d4' },
                                      { l: 'Track', v: details.track, m: 20, c: '#2dd4bf' },
                                    ].map(item => (
                                      <div key={item.l} className="mb-3 last:mb-0">
                                        <div className="flex justify-between text-[10px] mb-1.5">
                                          <span className="text-gray-600 font-medium">{item.l}</span>
                                          <span className="font-bold tabular-nums" style={{ color: item.c }}>{item.v}/{item.m}</span>
                                        </div>
                                        <div className="h-1.5 bg-[#0F3A42]/60 rounded-full overflow-hidden">
                                          <div className="h-full rounded-full bar-animate"
                                            style={{ width: `${(item.v / item.m) * 100}%`, background: `linear-gradient(90deg, ${item.c}, ${item.c}80)`,
                                              boxShadow: `0 0 8px ${item.c}25` }} />
                                        </div>
                                      </div>
                                    ))}
                                    {/* Mini radar */}
                                    <div className="mt-4 flex justify-center">
                                      <RadarChart skills={details.skills} experience={details.experience} track={details.track} size={100} />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TiltCard>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Results count */}
            {!loading && filteredJobs.length > 0 && (
              <div className="text-center mt-12 fade-in">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#0A1A22]/60 border border-[#1e3a42]/30 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                  <span className="text-xs text-gray-500">
                    Showing <span className="text-white font-bold">{filteredJobs.length}</span> of <span className="text-white font-bold">{jobs.length}</span> jobs
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════
            MODAL
           ═══════════════════════════════════ */}
        {selectedJob && (() => {
          const d = getMatchDetails(selectedJob);
          const sc = d.total;
          const jSkills = Array.isArray(selectedJob.skills) ? selectedJob.skills : [];
          const scoreColor = sc >= 80 ? '#10b981' : sc >= 60 ? '#14b8a6' : '#f59e0b';
          const matchText = sc >= 80 ? 'Excellent Match' : sc >= 60 ? 'Good Match' : 'Fair Match';

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedJob(null)}>
              <div className="modal-bg absolute inset-0 bg-black/70 backdrop-blur-lg" />
              <div onClick={e => e.stopPropagation()}
                className="modal-reveal relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0A1A22] border border-[#1e3a42]/60 rounded-3xl shadow-2xl shadow-[#14b8a6]/5">

                {/* Gradient top */}
                <div className="h-1 bg-gradient-to-r from-[#14b8a6] via-[#06b6d4] to-[#2dd4bf] rounded-t-3xl" style={{ backgroundSize: '200% 200%', animation: 'gradientShift 3s ease infinite' }} />

                <div className="absolute top-0 right-0 w-60 h-60 bg-[radial-gradient(ellipse,rgba(20,184,166,0.04)_0%,transparent_70%)] pointer-events-none" />

                <button onClick={() => setSelectedJob(null)}
                  className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-xl bg-[#0F3A42]/50 border border-[#1e3a42] text-gray-400 hover:text-white hover:border-[#14b8a6]/30 transition-all cursor-pointer z-10 hover:rotate-90 duration-300">
                  <X size={18} />
                </button>

                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="flex items-start gap-5 mb-7">
                    {user && (
                      <div className="shrink-0 flex flex-col items-center gap-3">
                        <ScoreRing score={sc} size={100} sw={5} />
                        <RadarChart skills={d.skills} experience={d.experience} track={d.track} size={110} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pt-1">
                      <h2 className="text-2xl font-black text-white mb-2 leading-tight pr-10">{selectedJob.title}</h2>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {[{ icon: Building2, t: selectedJob.company }, { icon: MapPin, t: selectedJob.location }, { icon: Briefcase, t: selectedJob.level }].map((m, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0F3A42]/30 rounded-lg text-xs text-gray-400 border border-[#1e3a42]/25">
                            <m.icon size={11} className="text-gray-500" /> {m.t}
                          </span>
                        ))}
                      </div>
                      {user && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                          style={{ background: `${scoreColor}12`, color: scoreColor, borderColor: `${scoreColor}25` }}>
                          <Sparkles size={11} /> {matchText}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Salary */}
                  {(selectedJob.salary_min || selectedJob.salary_max) && (
                    <div className="flex items-center gap-3 bg-emerald-500/[0.04] border border-emerald-500/12 rounded-xl px-5 py-4 mb-6 group">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <DollarSign size={18} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-600 uppercase tracking-wider font-bold mb-0.5">Salary Range</div>
                        <div className="text-lg font-black text-emerald-400">
                          ৳{selectedJob.salary_min?.toLocaleString()} – ৳{selectedJob.salary_max?.toLocaleString()}
                          <span className="text-emerald-400/40 font-normal text-sm ml-1">/month</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {selectedJob.description && (
                    <div className="mb-6">
                      <h4 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                        <ChevronRight size={14} className="text-[#14b8a6]" /> Description
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed pl-5 border-l-2 border-[#1e3a42]/30">{selectedJob.description}</p>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                      <Star size={14} className="text-[#06b6d4]" /> Required Skills
                      {user && <span className="text-[10px] font-normal text-gray-600 ml-auto">{d.matchedSkills.length} of {jSkills.length}</span>}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {jSkills.map((skill, i) => {
                        const matched = user && d.matchedSkills.includes(skill.toLowerCase());
                        return (
                          <span key={i} className={`skill-pop inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border cursor-default
                            ${matched ? 'bg-emerald-500/12 text-emerald-300 border-emerald-500/25 shadow-sm shadow-emerald-500/5' : 'bg-[#0F3A42]/30 text-gray-500 border-[#1e3a42]/30'}`}
                            style={{ animationDelay: `${i * 0.05}s` }}>
                            {matched && <CheckCircle size={11} />} {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Breakdown */}
                  {user && (
                    <div className="bg-[#071015]/60 border border-[#1e3a42]/25 rounded-xl p-5 mb-6">
                      <h4 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                        <Award size={14} className="text-[#2dd4bf]" /> Match Breakdown
                      </h4>
                      <div className="space-y-4">
                        {[
                          { label: 'Skills Match', value: d.skills, max: 60, color: '#14b8a6', icon: Code2,
                            desc: `${d.matchedSkills.length} of ${jSkills.length} required skills` },
                          { label: 'Experience', value: d.experience, max: 20, color: '#06b6d4', icon: TrendingUp,
                            desc: d.experience >= 20 ? 'Meets required level' : d.experience >= 12 ? 'Close to required' : 'Below required' },
                          { label: 'Career Track', value: d.track, max: 20, color: '#2dd4bf', icon: Target,
                            desc: d.track >= 20 ? 'Same track' : d.track >= 10 ? 'Related track' : 'Different track' },
                        ].map(item => (
                          <div key={item.label}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-300 font-semibold flex items-center gap-2">
                                <item.icon size={13} style={{ color: item.color }} /> {item.label}
                              </span>
                              <span className="text-sm font-black tabular-nums" style={{ color: item.color }}>{item.value}/{item.max}</span>
                            </div>
                            <div className="h-2 bg-[#0F3A42]/60 rounded-full overflow-hidden mb-1.5">
                              <div className="h-full rounded-full bar-animate" style={{
                                width: `${(item.value / item.max) * 100}%`,
                                background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                                boxShadow: `0 0 10px ${item.color}25`
                              }} />
                            </div>
                            <p className="text-[11px] text-gray-600">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Level comparison */}
                  {user && (
                    <div className="grid grid-cols-2 gap-3 mb-7">
                      {[
                        { icon: Clock, label: 'Required', value: selectedJob.level, color: '#06b6d4' },
                        { icon: Award, label: 'Your Level', value: avgLevelLabel, color: '#2dd4bf' },
                      ].map((card, i) => (
                        <div key={i} className="bg-[#071015]/30 border border-[#1e3a42]/25 rounded-xl p-4 text-center group hover:border-[#14b8a6]/20 transition-all">
                          <div className="w-10 h-10 rounded-xl mx-auto mb-2.5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                            style={{ background: `${card.color}12` }}>
                            <card.icon size={18} style={{ color: card.color }} />
                          </div>
                          <div className="text-[10px] text-gray-600 uppercase tracking-wider font-bold mb-1">{card.label}</div>
                          <div className="text-sm font-bold text-white">{card.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <RippleButton onClick={() => applyToJob(selectedJob.id)}
                      disabled={appliedJobs.has(selectedJob.id) || applyingTo === selectedJob.id}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white text-sm font-bold transition-all duration-300 cursor-pointer
                        ${appliedJobs.has(selectedJob.id) ? 'bg-emerald-600/70 cursor-default shadow-lg shadow-emerald-500/10'
                          : applyingTo === selectedJob.id ? 'bg-gray-600 cursor-wait'
                          : 'bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] hover:shadow-xl hover:shadow-[#14b8a6]/20 hover:scale-[1.02] active:scale-[0.98]'}`}>
                      {appliedJobs.has(selectedJob.id) ? <><CheckCircle size={16} /> Applied Successfully</> : applyingTo === selectedJob.id ? <><Loader2 size={16} className="animate-spin" /> Applying...</> : <><Send size={16} /> Apply Now</>}
                    </RippleButton>
                    <button onClick={() => setSelectedJob(null)}
                      className="px-6 py-3.5 border border-[#1e3a42]/40 rounded-xl text-gray-400 text-sm font-semibold hover:border-[#14b8a6]/30 hover:text-white hover:bg-[#14b8a6]/5 transition-all duration-300 cursor-pointer">
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