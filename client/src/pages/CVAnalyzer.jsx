import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Upload, FileText, CheckCircle, AlertCircle, Loader2, X, Sparkles,
  Target, TrendingUp, Zap, Award, Briefcase, Star, Lightbulb, ArrowRight,
  Shield, Code2, Eye, ChevronRight, Crown, Layers, BarChart3, BookOpen,
  ArrowUpRight, Download, Share2, RefreshCw, Clock, MapPin, Mail, Phone,
  User as UserIcon, Calendar, Hash, Flame, Rocket, Wand2, ScanLine,
  CircleDot, GraduationCap, Heart, FileSearch, BrainCircuit
} from 'lucide-react';
import api from '../utils/api';

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
    @keyframes tiltIn{from{opacity:0;transform:perspective(800px) rotateY(-6deg) translateX(-25px)}to{opacity:1;transform:perspective(800px) rotateY(0) translateX(0)}}
    @keyframes tiltInRight{from{opacity:0;transform:perspective(800px) rotateY(6deg) translateX(25px)}to{opacity:1;transform:perspective(800px) rotateY(0) translateX(0)}}
    @keyframes ringDraw{from{stroke-dasharray:0 999}}
    @keyframes barGrow{from{width:0}}
    @keyframes barGrowHeight{from{height:0}}
    @keyframes orbitalSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes orbitalReverse{from{transform:rotate(360deg)}to{transform:rotate(0)}}
    @keyframes cardShine{0%{left:-100%}50%,100%{left:150%}}
    @keyframes particleFloat{
      0%{transform:translateY(0) translateX(0) scale(1);opacity:.4}
      50%{opacity:.7}
      100%{transform:translateY(-100vh) translateX(30px) scale(0);opacity:0}
    }
    @keyframes ripple{to{transform:scale(3);opacity:0}}
    @keyframes pulseRing{0%{transform:scale(1);opacity:.5}100%{transform:scale(2.2);opacity:0}}
    @keyframes glowPulse{0%,100%{box-shadow:0 0 0 0 rgba(20,184,166,.3)}50%{box-shadow:0 0 20px 5px rgba(20,184,166,.12)}}
    @keyframes scanDown{0%{top:-5%}100%{top:105%}}
    @keyframes scanPulse{0%,100%{opacity:.3}50%{opacity:.8}}
    @keyframes dataStream{
      0%{transform:translateY(-100%);opacity:0}
      10%{opacity:1}
      90%{opacity:1}
      100%{transform:translateY(100vh);opacity:0}
    }
    @keyframes successBurst{
      0%{transform:scale(0);opacity:1}
      50%{opacity:.6}
      100%{transform:scale(3);opacity:0}
    }
    @keyframes confettiDrop{
      0%{transform:translateY(-20px) rotate(0);opacity:1}
      100%{transform:translateY(60px) rotate(720deg);opacity:0}
    }
    @keyframes typewriter{from{width:0}to{width:100%}}
    @keyframes blinkCaret{50%{border-color:transparent}}
    @keyframes skillOrbit{
      0%{transform:rotate(var(--start-angle)) translateX(var(--orbit-r)) rotate(calc(-1 * var(--start-angle)))}
      100%{transform:rotate(calc(var(--start-angle) + 360deg)) translateX(var(--orbit-r)) rotate(calc(-1 * (var(--start-angle) + 360deg)))}
    }
    @keyframes hexPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.12);opacity:1}}
    @keyframes countUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes borderRotate{from{--angle:0deg}to{--angle:360deg}}
    @keyframes progressFill{from{stroke-dasharray:0 999}}
    @keyframes stepReveal{from{opacity:0;transform:translateX(-30px) scale(.9)}to{opacity:1;transform:translateX(0) scale(1)}}
    @keyframes dragPulse{0%,100%{border-color:rgba(30,58,66,.5);background:rgba(20,184,166,.02)}50%{border-color:rgba(20,184,166,.4);background:rgba(20,184,166,.06)}}
    @keyframes uploadIcon{
      0%,100%{transform:translateY(0)}
      25%{transform:translateY(-8px)}
      50%{transform:translateY(-4px)}
      75%{transform:translateY(-10px)}
    }
    @keyframes analyzePhase{
      0%{content:"Uploading file..."}
      20%{content:"Extracting text..."}
      40%{content:"Analyzing structure..."}
      60%{content:"Evaluating skills..."}
      80%{content:"Generating insights..."}
      100%{content:"Almost done..."}
    }
    @keyframes shimmerText{from{background-position:200% center}to{background-position:-200% center}}
    @keyframes tooltipIn{from{opacity:0;transform:translateY(4px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes scoreCountUp{from{--score:0}}
    @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}

    @property --angle{syntax:'<angle>';initial-value:0deg;inherits:false}

    .blob-1{animation:morphBlob1 20s ease-in-out infinite}
    .blob-2{animation:morphBlob2 25s ease-in-out infinite}
    .float-1{animation:float1 7s ease-in-out infinite}
    .float-2{animation:float2 5.5s ease-in-out infinite}
    .float-3{animation:float3 4s ease-in-out infinite}
    .slide-up{animation:slideUp .7s cubic-bezier(.16,1,.3,1) both}
    .slide-down{animation:slideDown .6s cubic-bezier(.16,1,.3,1) both}
    .scale-in{animation:scaleIn .5s cubic-bezier(.16,1,.3,1) both}
    .fade-in{animation:fadeIn .6s ease both}
    .tilt-in{animation:tiltIn .7s cubic-bezier(.16,1,.3,1) both}
    .tilt-in-r{animation:tiltInRight .7s cubic-bezier(.16,1,.3,1) both}
    .step-reveal{animation:stepReveal .5s cubic-bezier(.16,1,.3,1) both}
    .ring-draw circle:last-child{animation:ringDraw 1.2s ease-out both}
    .bar-animate{animation:barGrow 1s cubic-bezier(.16,1,.3,1) both}
    .bar-h-animate{animation:barGrowHeight 1s cubic-bezier(.16,1,.3,1) both}
    .breathe{animation:breathe 3s ease-in-out infinite}

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
      animation:shimmerText 5s linear infinite;
    }

    .glass{
      background:linear-gradient(135deg,rgba(10,26,34,.92),rgba(7,16,21,.96));
      backdrop-filter:blur(24px);
      border:1px solid rgba(30,58,66,.4);
      transition:all .5s cubic-bezier(.16,1,.3,1);
    }
    .glass:hover{
      border-color:rgba(20,184,166,.25);
      box-shadow:0 16px 50px -12px rgba(20,184,166,.08);
    }
    .glass::before{
      content:'';position:absolute;inset:0;border-radius:inherit;
      background:linear-gradient(135deg,rgba(20,184,166,.03) 0%,transparent 50%,rgba(6,182,212,.02) 100%);
      opacity:0;transition:opacity .5s;pointer-events:none;
    }
    .glass:hover::before{opacity:1}

    .glow-border{position:relative}
    .glow-border::after{
      content:'';position:absolute;inset:-1px;border-radius:inherit;padding:1px;
      background:conic-gradient(from var(--angle,0deg),transparent 40%,#14b8a6 50%,transparent 60%);
      -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
      -webkit-mask-composite:xor;mask-composite:exclude;
      animation:orbitalSpin 5s linear infinite;opacity:0;transition:opacity .5s;pointer-events:none;
    }
    .glow-border:hover::after,.glow-border.active::after{opacity:1}

    .shine{position:relative;overflow:hidden}
    .shine::after{
      content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.025),transparent);
      animation:cardShine 6s ease-in-out infinite;pointer-events:none;
    }

    .card-wrapper{
      transition:all 0.3s cubic-bezier(0.16,1,0.3,1);
      position:relative;
      z-index:1;
    }
    .card-wrapper:hover{
      transform:translateY(-4px);
      box-shadow:0 12px 30px -8px rgba(20,184,166,0.15);
    }
    .card-wrapper:active{
      transform:translateY(-2px);
    }

    .glass:has(.card-wrapper:hover){
      border-color:rgba(20,184,166,0.2);
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

    .drag-zone{animation:dragPulse 3s ease-in-out infinite}
    .drag-zone.drag-over{
      border-color:rgba(20,184,166,.6) !important;
      background:rgba(20,184,166,.08) !important;
      animation:none;
    }

    .upload-icon-float{animation:uploadIcon 3s ease-in-out infinite}

    .scan-line{
      position:absolute;left:0;width:100%;height:3px;
      background:linear-gradient(90deg,transparent,rgba(20,184,166,.6),rgba(6,182,212,.4),transparent);
      filter:blur(1px);
      animation:scanDown 2s ease-in-out infinite;
      box-shadow:0 0 15px rgba(20,184,166,.3);
    }

    .data-column{
      position:absolute;font-family:monospace;font-size:10px;color:#14b8a6;
      opacity:.15;writing-mode:vertical-rl;line-height:1.2;
      animation:dataStream var(--dur) linear var(--delay) infinite;
    }

    .score-ring svg circle:last-child{animation:progressFill 1.5s cubic-bezier(.16,1,.3,1) both}

    .skill-tag{transition:all .25s cubic-bezier(.16,1,.3,1)}
    .skill-tag:hover{transform:translateY(-3px) scale(1.06);box-shadow:0 6px 20px -4px rgba(20,184,166,.2)}

    .strength-item{transition:all .3s ease}
    .strength-item:hover{transform:translateX(6px);background:rgba(16,185,129,.06)}

    .weakness-item{transition:all .3s ease}
    .weakness-item:hover{transform:translateX(6px);background:rgba(245,158,11,.06)}

    .tip-card{transition:all .35s cubic-bezier(.16,1,.3,1)}
    .tip-card:hover{transform:translateY(-4px);box-shadow:0 12px 30px -8px rgba(20,184,166,.15)}

    .step-card{transition:all .3s ease}
    .step-card:hover{transform:translateX(4px);border-color:rgba(20,184,166,.3)}

    .timeline-line{
      position:absolute;left:15px;top:0;bottom:0;width:2px;
      background:linear-gradient(180deg,#14b8a6,#06b6d4 50%,transparent);
    }

    .info-field{transition:all .2s ease}
    .info-field:hover{background:rgba(20,184,166,.04);border-color:rgba(20,184,166,.15)}

    .analyze-phases::after{
      content:"Analyzing...";
      animation:analyzePhase 6s steps(6) infinite;
    }

    .tab-btn{transition:all .3s cubic-bezier(.16,1,.3,1)}
    .tab-btn:hover{transform:translateY(-1px)}
    .tab-btn.active{box-shadow:0 4px 15px -3px rgba(20,184,166,.3)}

    .confetti-piece{animation:confettiDrop 1.5s cubic-bezier(.16,1,.3,1) both}

    .success-ring{animation:successBurst 1s ease-out both}

    .section-connector{
      position:relative;
    }
    .section-connector::before{
      content:'';position:absolute;left:50%;top:-12px;width:2px;height:12px;
      background:linear-gradient(180deg,transparent,rgba(20,184,166,.2));
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
    let retryCount = 0;
    const maxRetries = 20;
    const checkAndObserve = () => {
      const el = ref.current;
      if (!el) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(checkAndObserve, 150);
        }
        return;
      }
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
        { threshold: 0.1, ...opts }
      );
      obs.observe(el);
      return () => obs.disconnect();
    };
    checkAndObserve();
  }, []);
  return [ref, visible];
}

function useAnimatedNumber(target, dur = 1200) {
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

/* ─── Particles ─── */
function Particles() {
  const dots = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i, left: Math.random() * 100, size: Math.random() * 2.5 + 0.8,
      delay: Math.random() * 14, duration: Math.random() * 18 + 14, opacity: Math.random() * 0.2 + 0.06,
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

/* ─── Simple Card Wrapper ─── */
function CardWrapper({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

/* ─── Ripple Button ─── */
function RippleButton({ children, onClick, disabled, className, ...props }) {
  const ref = useRef(null);
  const handleClick = (e) => {
    if (disabled) return;
    const btn = ref.current, rect = btn.getBoundingClientRect();
    const circle = document.createElement('span');
    const d = Math.max(rect.width, rect.height);
    circle.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d/2}px;top:${e.clientY - rect.top - d/2}px`;
    circle.className = 'ripple-circle';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
    onClick?.(e);
  };
  return <button ref={ref} onClick={handleClick} disabled={disabled} className={`ripple-container ${className}`} {...props}>{children}</button>;
}

/* ─── Score Ring ─── */
function ScoreRing({ score, size = 80, sw = 4, label, color }) {
  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(score, 100) / 100) * circ;
  const c = color || (score >= 80 ? '#10b981' : score >= 60 ? '#14b8a6' : score >= 40 ? '#f59e0b' : '#ef4444');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-3 rounded-full blur-lg opacity-20" style={{ background: c }} />
        <svg className="w-full h-full -rotate-90 score-ring" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#0F3A42" strokeWidth={sw} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={sw}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${c}50)` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-white tabular-nums">{score}</span>
          <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold">/ 100</span>
        </div>
      </div>
      {label && <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>}
    </div>
  );
}

/* ─── Radar Chart ─── */
function RadarChart({ scores, size = 200 }) {
  const labels = Object.keys(scores);
  const values = Object.values(scores).map(v => Math.min(v, 100) / 100);
  const c = size / 2;
  const r = size * 0.36;
  const n = labels.length;
  const angles = labels.map((_, i) => (i * 2 * Math.PI / n) - Math.PI / 2);
  const point = (i, scale) => ({ x: c + Math.cos(angles[i]) * r * scale, y: c + Math.sin(angles[i]) * r * scale });
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = values.map((v, i) => point(i, v));
  const pathStr = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
  const colors = ['#14b8a6', '#06b6d4', '#2dd4bf', '#a855f7', '#f59e0b', '#10b981'];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {gridLevels.map((lev, li) => (
        <polygon key={li}
          points={angles.map((_, i) => { const p = point(i, lev); return `${p.x},${p.y}`; }).join(' ')}
          fill="none" stroke="#1e3a42" strokeWidth="0.5" opacity={0.25 + li * 0.15}
          strokeDasharray={li < 3 ? '2,4' : 'none'} />
      ))}
      {angles.map((_, i) => {
        const p = point(i, 1);
        return <line key={i} x1={c} y1={c} x2={p.x} y2={p.y} stroke="#1e3a42" strokeWidth="0.5" opacity="0.3" />;
      })}
      <path d={pathStr} fill="url(#cvRadarGrad)" stroke="#14b8a6" strokeWidth="1.5" strokeLinejoin="round" opacity="0.85" />
      {dataPoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#0A1A22" stroke={colors[i % colors.length]} strokeWidth="2" />
          <circle cx={p.x} cy={p.y} r="1.5" fill={colors[i % colors.length]} />
        </g>
      ))}
      {angles.map((_, i) => {
        const p = point(i, 1.2);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill={colors[i % colors.length]} fontSize="8" fontWeight="700">
            {labels[i].slice(0, 6)}
          </text>
        );
      })}
      <defs>
        <radialGradient id="cvRadarGrad">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Scanning Overlay ─── */
function ScanningOverlay({ phase }) {
  const dataColumns = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: 5 + (i / 12) * 90,
      chars: Array.from({ length: 40 }, () => String.fromCharCode(33 + Math.floor(Math.random() * 94))).join(''),
      dur: 3 + Math.random() * 4,
      delay: Math.random() * 3,
    })), []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(5,13,17,0.92)', backdropFilter: 'blur(12px)' }}>
      {/* Data streams */}
      {dataColumns.map(col => (
        <div key={col.id} className="data-column"
          style={{ left: `${col.left}%`, '--dur': `${col.dur}s`, '--delay': `${col.delay}s` }}>
          {col.chars}
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-8 scale-in">
        {/* Orbital rings */}
        <div className="relative w-32 h-32">
          <div className="absolute inset-[-12px] rounded-full border border-dashed border-[#14b8a6]/20"
            style={{ animation: 'orbitalSpin 8s linear infinite' }}>
            <div className="absolute top-[-3px] left-1/2 -ml-[3px] w-[6px] h-[6px] rounded-full bg-[#14b8a6] shadow-[0_0_8px_rgba(20,184,166,.6)]" />
          </div>
          <div className="absolute inset-[-24px] rounded-full border border-dashed border-[#06b6d4]/15"
            style={{ animation: 'orbitalReverse 14s linear infinite' }}>
            <div className="absolute bottom-[-3px] right-1/4 w-[5px] h-[5px] rounded-full bg-[#06b6d4] shadow-[0_0_8px_rgba(6,182,212,.6)]" />
          </div>

          {/* Core */}
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4]
            flex items-center justify-center shadow-2xl shadow-[#14b8a6]/30 breathe">
            <BrainCircuit size={40} className="text-white" />
          </div>

          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-2xl border-2 border-[#14b8a6]/40"
            style={{ animation: 'pulseRing 2s cubic-bezier(0,0,.2,1) infinite' }} />
          <div className="absolute inset-0 rounded-2xl border-2 border-[#06b6d4]/30"
            style={{ animation: 'pulseRing 2s cubic-bezier(0,0,.2,1) 0.5s infinite' }} />
        </div>

        {/* Phase text */}
        <div className="text-center">
          <p className="text-white font-bold text-lg mb-2">Analyzing Your CV</p>
          <p className="shimmer-text text-sm font-medium">{phase}</p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-[#0F3A42] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#14b8a6] to-[#06b6d4]"
            style={{ width: '100%', animation: 'barGrow 6s ease-in-out infinite', backgroundSize: '200% 100%', animationName: 'gradientShift, barGrow' }} />
        </div>

        <div className="flex items-center gap-2 text-[10px] text-gray-600 font-medium">
          <Sparkles size={10} className="text-[#14b8a6] animate-pulse" />
          Powered by Gemini AI
        </div>
      </div>
    </div>
  );
}

/* ─── Success Animation ─── */
function SuccessAnimation({ onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  const confetti = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: 30 + Math.random() * 40,
      delay: Math.random() * 0.5,
      color: ['#14b8a6', '#06b6d4', '#2dd4bf', '#10b981', '#a855f7', '#f59e0b'][i % 6],
      size: 4 + Math.random() * 4,
      rotation: Math.random() * 360,
    })), []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Burst ring */}
      <div className="absolute w-32 h-32 rounded-full border-4 border-[#14b8a6] success-ring" />
      <div className="absolute w-32 h-32 rounded-full border-4 border-[#06b6d4] success-ring" style={{ animationDelay: '0.2s' }} />

      {/* Confetti */}
      {confetti.map(c => (
        <div key={c.id} className="absolute confetti-piece"
          style={{
            left: `${c.left}%`, top: '45%',
            width: c.size, height: c.size,
            background: c.color, borderRadius: c.id % 2 === 0 ? '50%' : '2px',
            animationDelay: `${c.delay}s`,
            transform: `rotate(${c.rotation}deg)`,
          }} />
      ))}

      {/* Checkmark */}
      <div className="scale-in" style={{ animationDelay: '0.3s' }}>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#14b8a6]
          flex items-center justify-center shadow-2xl shadow-emerald-500/30">
          <CheckCircle size={36} className="text-white" />
        </div>
      </div>
    </div>
  );
}

/* ─── Info Field ─── */
function InfoField({ icon: Icon, label, value, color = '#14b8a6', delay = 0 }) {
  if (!value) return null;
  return (
    <div className="info-field flex items-center gap-3 p-3.5 bg-[#071015]/40 border border-[#1e3a42]/25
      rounded-xl cursor-default scale-in" style={{ animationDelay: `${delay}s` }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}12` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="text-[9px] text-gray-600 uppercase tracking-[0.15em] font-bold">{label}</div>
        <div className="text-sm font-semibold text-white truncate">{value}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN CV ANALYZER
   ═══════════════════════════════════════ */
export default function CVAnalyzer() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [analyzePhase, setAnalyzePhase] = useState('Uploading file...');
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef(null);

  const [heroRef, heroVisible] = useInView();

  // Phase cycling during analysis
  useEffect(() => {
    if (!loading) return;
    const phases = [
      'Uploading your CV...', 'Extracting text content...', 'Analyzing document structure...',
      'Evaluating skills & experience...', 'Scoring professionalism...', 'Generating insights...',
      'Preparing recommendations...', 'Almost done...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phases.length;
      setAnalyzePhase(phases[i]);
    }, 2200);
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or image file (JPEG, PNG, GIF, WebP)');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File must be less than 10MB');
      return;
    }
    setFile(selectedFile);
    setError('');
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const dt = new DataTransfer(); dt.items.add(droppedFile);
      fileInputRef.current.files = dt.files;
      handleFileSelect({ target: fileInputRef.current });
    }
  };

  const handleAnalyze = async () => {
    if (!file) { setError('Please select a file first'); return; }
    setLoading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('cv_file', file);
      const res = await api.post('/cv-analyze', formData);
      if (res.data?.analysis) {
        setLoading(false);
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); setAnalysis(res.data.analysis); }, 1800);
      } else {
        setError('Analysis returned unexpected format');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'CV analysis failed. Please try again.');
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null); setPreview(null); setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetAll = () => { setAnalysis(null); removeFile(); setActiveTab('overview'); };

  // Results tab data
  const tabs = useMemo(() => {
    if (!analysis) return [];
    const t = [{ key: 'overview', label: 'Overview', icon: BarChart3 }];
    if (analysis.extracted_skills?.length) t.push({ key: 'skills', label: 'Skills', icon: Code2 });
    if (analysis.strengths?.length || analysis.weaknesses?.length) t.push({ key: 'assessment', label: 'Assessment', icon: Target });
    if (analysis.improvement_tips?.length) t.push({ key: 'tips', label: 'Tips', icon: Lightbulb });
    if (analysis.skills_to_develop?.length || analysis.next_steps?.length || analysis.career_guidance) t.push({ key: 'career', label: 'Career', icon: Rocket });
    return t;
  }, [analysis]);

  if (!user) {
    return (
      <>
        <InjectStyles />
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center"
          style={{ background: 'linear-gradient(180deg,#050D11,#0A1A22,#071218)' }}>
          <div className="glass rounded-3xl p-12 text-center scale-in max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4]
              flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#14b8a6]/20 float-2">
              <FileSearch size={28} className="text-white" />
            </div>
            <p className="text-white text-xl font-bold mb-2">Authentication Required</p>
            <p className="text-gray-500 text-sm">Please log in to analyze your CV</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <InjectStyles />

      {/* Scanning overlay */}
      {loading && <ScanningOverlay phase={analyzePhase} />}

      {/* Success animation */}
      {showSuccess && <SuccessAnimation onDone={() => {}} />}

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
          <div className="max-w-[1000px] mx-auto px-6 sm:px-8 lg:px-12">

            {/* ═══ HERO ═══ */}
            <div ref={heroRef} className={`text-center mb-14 ${heroVisible ? 'slide-down' : 'opacity-0'}`}>
              <div className="relative inline-block mb-6">
                <div className="absolute -top-6 -left-10 float-1 opacity-30">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#14b8a6]/50" />
                </div>
                <div className="absolute -top-3 -right-14 float-2 opacity-20">
                  <div className="w-3 h-3 rounded bg-[#06b6d4]/30 rotate-45" />
                </div>
                <div className="absolute top-5 -left-18 float-3 opacity-15">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]" />
                </div>

                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full
                  bg-[#14b8a6]/[0.08] border border-[#14b8a6]/20">
                  <BrainCircuit size={13} className="text-[#14b8a6] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-[0.2em]">
                    AI CV Analyzer
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-[1.1] tracking-tight">
                Analyze Your<br />
                <span className="gradient-text">Professional CV</span>
              </h1>
              <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                Upload your CV and receive AI-powered insights on skills, quality scores,
                improvement tips, and personalized career guidance
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-7 scale-in" style={{ animationDelay: '0.3s' }}>
                {[
                  { icon: ScanLine, t: 'Smart Parsing', c: '#14b8a6' },
                  { icon: BarChart3, t: 'Quality Scoring', c: '#06b6d4' },
                  { icon: Target, t: 'Skill Analysis', c: '#2dd4bf' },
                  { icon: Rocket, t: 'Career Tips', c: '#a855f7' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    bg-[#071015]/60 border border-[#1e3a42]/30 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: f.c }}>
                    <f.icon size={11} /> {f.t}
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ UPLOAD AREA (no analysis) ═══ */}
            {!analysis && (
              <div className="slide-up" style={{ animationDelay: '0.15s' }}>
                <div className="card-wrapper">
                  <div className="glass glow-border shine rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px]
                      bg-gradient-to-r from-transparent via-[#14b8a6]/40 to-transparent" />

                    {/* Drop zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`drag-zone border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer
                        transition-all duration-300 relative overflow-hidden
                        ${dragOver
                          ? 'drag-over border-[#14b8a6]/60 bg-[#14b8a6]/8'
                          : file
                            ? 'border-[#14b8a6]/30 bg-[#14b8a6]/[0.03]'
                            : 'border-[#1e3a42]/50 hover:border-[#14b8a6]/30 hover:bg-[#14b8a6]/[0.02]'
                        }`}
                    >
                      {/* Scan line during drag */}
                      {dragOver && <div className="scan-line" />}

                      {file ? (
                        <div className="relative z-10">
                          {/* File info with preview */}
                          <div className="flex flex-col items-center gap-4">
                            {preview ? (
                              <div className="relative group">
                                <img src={preview} alt="Preview"
                                  className="max-w-[200px] max-h-[180px] rounded-xl border border-[#1e3a42]/40
                                    shadow-lg shadow-[#14b8a6]/5 transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A22]/80 to-transparent rounded-xl
                                  opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                                  <span className="text-[10px] text-white font-bold">Click to change</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#14b8a6]/20 to-[#06b6d4]/20
                                border border-[#14b8a6]/25 flex items-center justify-center">
                                <FileText size={32} className="text-[#14b8a6]" />
                              </div>
                            )}
                            <div>
                              <p className="text-lg font-bold text-white mb-1">{file.name}</p>
                              <div className="flex items-center justify-center gap-3">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Layers size={10} /> {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <FileText size={10} /> {file.type.split('/')[1]?.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                              <CheckCircle size={13} /> Ready to analyze
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative z-10">
                          <div className="flex justify-center mb-6">
                            <div className="relative">
                              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4]
                                flex items-center justify-center shadow-xl shadow-[#14b8a6]/25 upload-icon-float">
                                <Upload size={32} className="text-white" />
                              </div>
                              {/* Orbiting dots */}
                              <div className="absolute inset-[-14px] rounded-2xl border border-dashed border-[#14b8a6]/15"
                                style={{ animation: 'orbitalSpin 10s linear infinite' }}>
                                <div className="absolute top-[-3px] left-1/2 -ml-[3px] w-[6px] h-[6px] rounded-full bg-[#14b8a6]/50" />
                              </div>
                            </div>
                          </div>
                          <p className="text-xl font-bold text-white mb-2">
                            {dragOver ? 'Drop your CV here!' : 'Drop your CV here or click to browse'}
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            Supports PDF, JPEG, PNG, GIF, WebP — up to 10MB
                          </p>
                          <div className="flex items-center justify-center gap-4 text-[10px] text-gray-700">
                            <span className="flex items-center gap-1"><Shield size={10} className="text-[#14b8a6]/50" /> Secure upload</span>
                            <span className="flex items-center gap-1"><Zap size={10} className="text-[#06b6d4]/50" /> AI-powered</span>
                            <span className="flex items-center gap-1"><Clock size={10} className="text-[#2dd4bf]/50" /> ~10 seconds</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                      onChange={handleFileSelect} className="hidden" />

                    {/* Error */}
                    {error && (
                      <div className="mt-5 p-4 bg-red-500/8 border border-red-500/15 rounded-xl flex items-start gap-3 scale-in">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                          <AlertCircle size={16} className="text-red-400" />
                        </div>
                        <div>
                          <p className="text-red-400 text-sm font-semibold">{error}</p>
                          <button onClick={() => setError('')}
                            className="text-red-400/60 text-xs mt-1 hover:text-red-300 cursor-pointer">Dismiss</button>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    {file && (
                      <div className="mt-6 flex gap-3 scale-in">
                        <RippleButton onClick={handleAnalyze} disabled={loading}
                          className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5
                            bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-white font-bold rounded-xl
                            hover:shadow-xl hover:shadow-[#14b8a6]/20 hover:scale-[1.02] active:scale-[0.98]
                            disabled:opacity-50 transition-all duration-300 cursor-pointer text-sm">
                          <Sparkles size={17} /> Analyze CV
                        </RippleButton>
                        <button onClick={removeFile} disabled={loading}
                          className="px-5 py-3.5 border border-[#1e3a42]/40 rounded-xl text-gray-400
                            hover:text-white hover:border-[#14b8a6]/30 hover:bg-[#14b8a6]/5
                            transition-all duration-300 cursor-pointer disabled:opacity-50">
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* How it works */}
                <div className="mt-10 slide-up" style={{ animationDelay: '0.25s' }}>
                  <h3 className="text-center text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mb-6">
                    How it works
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: Upload, title: 'Upload', desc: 'Drop your CV or click to select', color: '#14b8a6', step: '01' },
                      { icon: BrainCircuit, title: 'Analyze', desc: 'AI processes & evaluates content', color: '#06b6d4', step: '02' },
                      { icon: BarChart3, title: 'Results', desc: 'Get scores, tips & career guidance', color: '#2dd4bf', step: '03' },
                    ].map((step, i) => (
                      <div key={i}>
                        <div className="glass shine card-wrapper rounded-2xl p-5 text-center relative overflow-hidden group cursor-default
                          scale-in" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                          <div className="absolute top-3 right-3 text-[10px] font-black tracking-wider"
                            style={{ color: `${step.color}30` }}>{step.step}</div>
                          <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center
                            group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                            style={{ background: `${step.color}12` }}>
                            <step.icon size={22} style={{ color: step.color }} />
                          </div>
                          <h4 className="text-white font-bold text-sm mb-1">{step.title}</h4>
                          <p className="text-gray-600 text-xs">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ ANALYSIS RESULTS ═══ */}
            {analysis && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-2 slide-down">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#14b8a6]
                      flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CheckCircle size={22} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Analysis Complete</h2>
                      <p className="text-xs text-gray-600">{analysis.name ? `Results for ${analysis.name}` : 'Your CV analysis results'}</p>
                    </div>
                  </div>
                  <RippleButton onClick={resetAll}
                    className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-gray-400
                      hover:text-white hover:border-[#14b8a6]/30 transition-all text-sm font-semibold cursor-pointer">
                    <RefreshCw size={14} /> New Analysis
                  </RippleButton>
                </div>

                {/* Tab navigation */}
                <div className="flex gap-1.5 p-1.5 bg-[#071015]/60 border border-[#1e3a42]/25 rounded-xl
                  overflow-x-auto slide-up" style={{ animationDelay: '0.05s', scrollbarWidth: 'none' }}>
                  {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`tab-btn flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold
                        cursor-pointer whitespace-nowrap transition-all
                        ${activeTab === tab.key
                          ? 'active bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-white'
                          : 'text-gray-500 hover:text-gray-300 hover:bg-[#1e3a42]/20'
                        }`}>
                      <tab.icon size={13} /> {tab.label}
                    </button>
                  ))}
                </div>

                {/* ── OVERVIEW TAB ── */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Personal Info + Scores */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                      {/* Personal info */}
                      {(analysis.name || analysis.email || analysis.phone) && (
                        <div className="lg:col-span-2 tilt-in" style={{ animationDelay: '0.1s' }}>
                          <div className="card-wrapper">
                            <div className="glass shine rounded-2xl p-6 h-full relative overflow-hidden">
                              <div className="absolute top-0 left-0 right-0 h-[2px]
                                bg-gradient-to-r from-transparent via-[#14b8a6]/30 to-transparent" />
                              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <UserIcon size={14} className="text-[#14b8a6]" /> Profile
                              </h3>
                              <div className="space-y-2.5">
                                <InfoField icon={UserIcon} label="Name" value={analysis.name} delay={0.15} />
                                <InfoField icon={Mail} label="Email" value={analysis.email} color="#06b6d4" delay={0.2} />
                                <InfoField icon={Phone} label="Phone" value={analysis.phone} color="#2dd4bf" delay={0.25} />
                                <InfoField icon={MapPin} label="Location" value={analysis.location} color="#a855f7" delay={0.3} />
                                {analysis.years_of_experience && (
                                  <InfoField icon={Calendar} label="Experience" value={`${analysis.years_of_experience} years`} color="#f59e0b" delay={0.35} />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quality Scores */}
                      {analysis.quality_score && (
                        <div className={`${analysis.name ? 'lg:col-span-3' : 'lg:col-span-5'} tilt-in-r`}
                          style={{ animationDelay: '0.15s' }}>
                          <div className="card-wrapper">
                            <div className="glass shine rounded-2xl p-6 h-full relative overflow-hidden">
                              <div className="absolute top-0 left-0 right-0 h-[2px]
                                bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent" />
                              <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2 uppercase tracking-wider">
                                <Star size={14} className="text-[#f59e0b]" /> Quality Scores
                              </h3>
                              <div className="flex flex-col sm:flex-row items-center gap-6">
                                {/* Main score ring */}
                                <ScoreRing score={analysis.quality_score.overall || 0} size={110} sw={5} label="Overall" />

                                {/* Sub scores */}
                                <div className="flex-1 grid grid-cols-3 gap-3">
                                  {[
                                    { label: 'Format', value: analysis.quality_score.formatting, color: '#06b6d4', icon: Layers },
                                    { label: 'Content', value: analysis.quality_score.content, color: '#2dd4bf', icon: FileText },
                                    { label: 'Professional', value: analysis.quality_score.professionalism, color: '#a855f7', icon: Crown },
                                  ].map((s, i) => (
                                    <div key={i} className="text-center scale-in" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                                      <ScoreRing score={s.value || 0} size={70} sw={3.5} color={s.color} />
                                      <div className="mt-2 flex items-center justify-center gap-1">
                                        <s.icon size={9} style={{ color: s.color }} />
                                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{s.label}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Radar chart */}
                                <div className="hidden xl:block">
                                  <RadarChart scores={{
                                    Overall: analysis.quality_score.overall || 0,
                                    Format: analysis.quality_score.formatting || 0,
                                    Content: analysis.quality_score.content || 0,
                                    Prof: analysis.quality_score.professionalism || 0,
                                  }} size={140} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick strengths/weaknesses summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {analysis.strengths?.length > 0 && (
                        <div className="card-wrapper">
                          <div className="glass shine rounded-2xl p-6 relative overflow-hidden tilt-in"
                            style={{ animationDelay: '0.2s' }}>
                            <div className="absolute top-0 left-0 right-0 h-[2px]
                              bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                              <TrendingUp size={14} className="text-emerald-400" /> Top Strengths
                              <span className="ml-auto text-[10px] text-emerald-400/60 tabular-nums">{analysis.strengths.length}</span>
                            </h3>
                            <ul className="space-y-2">
                              {analysis.strengths.slice(0, 3).map((s, i) => (
                                <li key={i} className="strength-item flex items-start gap-2.5 p-2.5
                                  rounded-xl border border-transparent cursor-default"
                                  style={{ animationDelay: `${0.25 + i * 0.05}s` }}>
                                  <div className="w-5 h-5 rounded-md bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle size={11} className="text-emerald-400" />
                                  </div>
                                  <span className="text-sm text-gray-300 leading-relaxed">{s}</span>
                                </li>
                              ))}
                              {analysis.strengths.length > 3 && (
                                <button onClick={() => setActiveTab('assessment')}
                                  className="text-[11px] text-[#14b8a6] font-semibold flex items-center gap-1 ml-7 cursor-pointer hover:underline">
                                  +{analysis.strengths.length - 3} more <ChevronRight size={11} />
                                </button>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}

                      {analysis.weaknesses?.length > 0 && (
                        <div className="card-wrapper">
                          <div className="glass shine rounded-2xl p-6 relative overflow-hidden tilt-in-r"
                            style={{ animationDelay: '0.25s' }}>
                            <div className="absolute top-0 left-0 right-0 h-[2px]
                              bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                              <AlertCircle size={14} className="text-amber-400" /> Improve
                              <span className="ml-auto text-[10px] text-amber-400/60 tabular-nums">{analysis.weaknesses.length}</span>
                            </h3>
                            <ul className="space-y-2">
                              {analysis.weaknesses.slice(0, 3).map((w, i) => (
                                <li key={i} className="weakness-item flex items-start gap-2.5 p-2.5
                                  rounded-xl border border-transparent cursor-default">
                                  <div className="w-5 h-5 rounded-md bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                    <AlertCircle size={11} className="text-amber-400" />
                                  </div>
                                  <span className="text-sm text-gray-300 leading-relaxed">{w}</span>
                                </li>
                              ))}
                              {analysis.weaknesses.length > 3 && (
                                <button onClick={() => setActiveTab('assessment')}
                                  className="text-[11px] text-[#14b8a6] font-semibold flex items-center gap-1 ml-7 cursor-pointer hover:underline">
                                  +{analysis.weaknesses.length - 3} more <ChevronRight size={11} />
                                </button>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── SKILLS TAB ── */}
                {activeTab === 'skills' && analysis.extracted_skills?.length > 0 && (
                  <div className="slide-up">
                    <div className="card-wrapper">
                      <div className="glass shine rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px]
                          bg-gradient-to-r from-transparent via-[#14b8a6]/40 to-transparent" />
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2 uppercase tracking-wider">
                          <Award size={14} className="text-[#14b8a6]" /> Detected Skills
                          <span className="ml-auto text-[10px] text-gray-500 tabular-nums font-bold">
                            {analysis.extracted_skills.length} found
                          </span>
                        </h3>
                        <p className="text-xs text-gray-600 mb-5">Skills identified in your CV</p>

                        <div className="flex flex-wrap gap-2">
                          {analysis.extracted_skills.map((skill, i) => {
                            const colors = ['#14b8a6', '#06b6d4', '#2dd4bf', '#a855f7', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];
                            const c = colors[i % colors.length];
                            return (
                              <span key={i} className="skill-tag inline-flex items-center gap-1.5 px-4 py-2
                                rounded-xl text-sm font-semibold cursor-default border scale-in"
                                style={{
                                  background: `${c}10`, color: c, borderColor: `${c}20`,
                                  animationDelay: `${i * 0.04}s`
                                }}>
                                <CircleDot size={10} /> {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── ASSESSMENT TAB ── */}
                {activeTab === 'assessment' && (
                  <div className="space-y-5 slide-up">
                    {analysis.strengths?.length > 0 && (
                      <div className="card-wrapper">
                        <div className="glass shine rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[2px]
                            bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                          <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2 uppercase tracking-wider">
                            <TrendingUp size={14} className="text-emerald-400" /> Strengths
                          </h3>
                          <ul className="space-y-2.5">
                            {analysis.strengths.map((s, i) => (
                              <li key={i} className="strength-item flex items-start gap-3 p-3.5
                                rounded-xl border border-[#1e3a42]/15 cursor-default step-reveal"
                                style={{ animationDelay: `${i * 0.06}s` }}>
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/12 flex items-center justify-center shrink-0 mt-0.5">
                                  <CheckCircle size={14} className="text-emerald-400" />
                                </div>
                                <span className="text-sm text-gray-300 leading-relaxed pt-1">{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {analysis.weaknesses?.length > 0 && (
                      <div className="card-wrapper">
                        <div className="glass shine rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[2px]
                            bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                          <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2 uppercase tracking-wider">
                            <AlertCircle size={14} className="text-amber-400" /> Areas for Improvement
                          </h3>
                          <ul className="space-y-2.5">
                            {analysis.weaknesses.map((w, i) => (
                              <li key={i} className="weakness-item flex items-start gap-3 p-3.5
                                rounded-xl border border-[#1e3a42]/15 cursor-default step-reveal"
                                style={{ animationDelay: `${i * 0.06}s` }}>
                                <div className="w-7 h-7 rounded-lg bg-amber-500/12 flex items-center justify-center shrink-0 mt-0.5">
                                  <AlertCircle size={14} className="text-amber-400" />
                                </div>
                                <span className="text-sm text-gray-300 leading-relaxed pt-1">{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── TIPS TAB ── */}
                {activeTab === 'tips' && analysis.improvement_tips?.length > 0 && (
                  <div className="slide-up">
                    <div className="card-wrapper">
                      <div className="glass shine rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px]
                          bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent" />
                        <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                          <Lightbulb size={14} className="text-[#f59e0b]" /> Professional Tips
                        </h3>
                        <div className="space-y-3">
                          {analysis.improvement_tips.map((tip, i) => (
                            <div key={i} className="tip-card flex items-start gap-4 p-4
                              bg-[#14b8a6]/[0.03] border border-[#14b8a6]/10 rounded-xl cursor-default
                              step-reveal" style={{ animationDelay: `${i * 0.07}s` }}>
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#14b8a6]/20 to-[#06b6d4]/20
                                flex items-center justify-center shrink-0 mt-0.5">
                                <Zap size={16} className="text-[#2dd4bf]" />
                              </div>
                              <div className="flex-1">
                                <span className="text-sm text-gray-300 leading-relaxed">{tip}</span>
                              </div>
                              <span className="text-[9px] text-[#14b8a6]/40 font-bold shrink-0 mt-1">
                                #{String(i + 1).padStart(2, '0')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CAREER TAB ── */}
                {activeTab === 'career' && (
                  <div className="space-y-5 slide-up">
                    {/* Skills to develop */}
                    {analysis.skills_to_develop?.length > 0 && (
                      <div className="card-wrapper">
                        <div className="glass shine rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[2px]
                            bg-gradient-to-r from-transparent via-[#06b6d4]/30 to-transparent" />
                          <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2 uppercase tracking-wider">
                            <Target size={14} className="text-[#06b6d4]" /> Skills to Develop
                          </h3>
                          <div className="space-y-3">
                            {analysis.skills_to_develop.map((item, i) => (
                              <div key={i} className="step-card flex items-start gap-4 p-4 bg-[#06b6d4]/[0.03]
                                border border-[#06b6d4]/10 rounded-xl cursor-default step-reveal"
                                style={{ animationDelay: `${i * 0.06}s` }}>
                                <div className="w-9 h-9 rounded-lg bg-[#06b6d4]/12 flex items-center justify-center shrink-0">
                                  <ArrowUpRight size={16} className="text-[#06b6d4]" />
                                </div>
                                <div>
                                  <p className="text-white font-bold text-sm mb-1">{item.skill}</p>
                                  <p className="text-gray-500 text-xs leading-relaxed">{item.reason}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Career guidance */}
                    {analysis.career_guidance && (
                      <div className="card-wrapper">
                        <div className="glass shine rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[2px]
                            bg-gradient-to-r from-transparent via-[#a855f7]/30 to-transparent" />
                          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <Sparkles size={14} className="text-[#a855f7]" /> Career Guidance
                          </h3>
                          <div className="p-5 bg-[#a855f7]/[0.03] border border-[#a855f7]/10 rounded-xl">
                            <p className="text-gray-300 leading-relaxed text-sm">{analysis.career_guidance}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Next steps - Timeline */}
                    {analysis.next_steps?.length > 0 && (
                      <div className="card-wrapper">
                        <div className="glass shine rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-[2px]
                            bg-gradient-to-r from-transparent via-[#14b8a6]/30 to-transparent" />
                          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                            <Rocket size={14} className="text-[#14b8a6]" /> Next Steps
                          </h3>
                          <div className="relative ml-4">
                            <div className="timeline-line" />
                            <div className="space-y-5">
                              {analysis.next_steps.map((step, i) => (
                                <div key={i} className="relative pl-10 step-reveal"
                                  style={{ animationDelay: `${i * 0.08}s` }}>
                                  {/* Timeline dot */}
                                  <div className="absolute left-0 top-1.5 w-[10px] h-[10px]
                                    rounded-full bg-[#0A1A22] border-2 border-[#14b8a6] z-10 ml-[11px]">
                                    <div className="absolute inset-0 rounded-full bg-[#14b8a6] scale-50 opacity-60" />
                                  </div>

                                  <div className="step-card p-4 bg-[#071015]/40 border border-[#1e3a42]/25
                                    rounded-xl cursor-default">
                                    <div className="flex items-start gap-3">
                                      <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#06b6d4]
                                        flex items-center justify-center text-white font-bold text-[10px] shrink-0 mt-0.5
                                        shadow-sm shadow-[#14b8a6]/20">
                                        {i + 1}
                                      </span>
                                      <span className="text-sm text-gray-300 leading-relaxed pt-0.5">{step}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom action */}
                <div className="pt-4 slide-up" style={{ animationDelay: '0.3s' }}>
                  <RippleButton onClick={resetAll}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-4
                      bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-white font-bold rounded-xl
                      hover:shadow-xl hover:shadow-[#14b8a6]/20 hover:scale-[1.01] active:scale-[0.99]
                      transition-all duration-300 cursor-pointer text-sm">
                    <Upload size={17} /> Analyze Another CV
                  </RippleButton>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}


