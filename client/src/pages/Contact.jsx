import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Send, MapPin, Phone, Mail, MessageSquare, CheckCircle,
  Sparkles, ArrowRight, Clock, Globe, Zap, Shield,
  ChevronRight, Star, Users, Headphones, Radio,
  Copy, Check, ExternalLink, Loader2, AlertCircle,
  X, CornerDownLeft, Terminal, Cpu
} from 'lucide-react';
import api from '../utils/api';

/* ═══════════════════════════════════════
   INJECTED STYLES
═══════════════════════════════════════ */
const InjectStyles = () => (
  <style>{`
    @keyframes morphBlob1 {
      0%,100% { border-radius:42% 58% 70% 30%/45% 45% 55% 55%; transform:rotate(0deg) scale(1); }
      25%      { border-radius:70% 30% 50% 50%/30% 60% 40% 70%; transform:rotate(90deg) scale(1.05); }
      50%      { border-radius:30% 70% 40% 60%/55% 30% 70% 45%; transform:rotate(180deg) scale(0.95); }
      75%      { border-radius:55% 45% 60% 40%/40% 70% 30% 60%; transform:rotate(270deg) scale(1.02); }
    }
    @keyframes morphBlob2 {
      0%,100% { border-radius:58% 42% 30% 70%/55% 45% 55% 45%; transform:rotate(0deg); }
      33%      { border-radius:40% 60% 60% 40%/60% 30% 70% 40%; transform:rotate(120deg); }
      66%      { border-radius:60% 40% 45% 55%/35% 65% 35% 65%; transform:rotate(240deg); }
    }
    @keyframes floatSlow { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-22px) rotate(4deg);} }
    @keyframes floatMed  { 0%,100%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-14px) rotate(-3deg);} }
    @keyframes floatFast { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }

    @keyframes fadeInUp    { from{opacity:0;transform:translateY(24px) scale(0.97);} to{opacity:1;transform:translateY(0) scale(1);} }
    @keyframes fadeInLeft  { from{opacity:0;transform:translateX(-28px);} to{opacity:1;transform:translateX(0);} }
    @keyframes fadeInRight { from{opacity:0;transform:translateX(28px);} to{opacity:1;transform:translateX(0);} }
    @keyframes fadeInScale { from{opacity:0;transform:scale(0.82);} to{opacity:1;transform:scale(1);} }
    @keyframes slideDown   { from{opacity:0;transform:translateY(-18px);} to{opacity:1;transform:translateY(0);} }
    @keyframes popIn       { 0%{opacity:0;transform:scale(0.6);} 70%{transform:scale(1.06);} 100%{opacity:1;transform:scale(1);} }

    @keyframes gradientShift {
      0%   { background-position:0% 50%; }
      50%  { background-position:100% 50%; }
      100% { background-position:0% 50%; }
    }
    @keyframes borderRotate {
      from { --angle:0deg; }
      to   { --angle:360deg; }
    }
    @keyframes scanLine {
      0%   { top:-4%; }
      100% { top:104%; }
    }
    @keyframes glowPulse {
      0%,100% { opacity:0.35; filter:blur(40px); }
      50%     { opacity:0.65; filter:blur(60px); }
    }
    @keyframes statusPulse {
      0%,100% { box-shadow:0 0 0 0 rgba(16,185,129,0.4); }
      50%     { box-shadow:0 0 0 7px rgba(16,185,129,0); }
    }
    @keyframes cardShine {
      0%      { left:-100%; }
      50%,100%{ left:160%; }
    }
    @keyframes particleDrift {
      0%   { transform:translate(0,0) rotate(0deg); opacity:0; }
      10%  { opacity:0.55; }
      90%  { opacity:0.55; }
      100% { transform:translate(var(--dx),var(--dy)) rotate(360deg); opacity:0; }
    }
    @keyframes orbFloat {
      0%   { transform:translate(0,0) scale(1); }
      25%  { transform:translate(30px,-40px) scale(1.08); }
      50%  { transform:translate(-20px,-60px) scale(0.93); }
      75%  { transform:translate(40px,-20px) scale(1.04); }
      100% { transform:translate(0,0) scale(1); }
    }
    @keyframes pulseRing {
      0%   { transform:scale(1); opacity:0.5; }
      100% { transform:scale(1.5); opacity:0; }
    }
    @keyframes rippleOut {
      to { transform:scale(2.8); opacity:0; }
    }
    @keyframes inputFocusLine {
      from { width:0%; opacity:0; }
      to   { width:90%; opacity:1; }
    }
    @keyframes successBounce {
      0%  { transform:scale(0.5) rotate(-10deg); opacity:0; }
      60% { transform:scale(1.1) rotate(4deg); }
      100%{ transform:scale(1) rotate(0deg); opacity:1; }
    }
    @keyframes successRipple {
      to { transform:scale(3); opacity:0; }
    }
    @keyframes counterTick {
      0%  { transform:translateY(50%); opacity:0; }
      60% { transform:translateY(-8%); }
      100%{ transform:translateY(0); opacity:1; }
    }
    @keyframes labelFloat {
      from { top:50%; font-size:.875rem; color:rgb(75,85,99); }
      to   { top:0%; font-size:.65rem; color:#14b8a6; }
    }
    @keyframes breathe {
      0%,100%{ transform:scale(1); opacity:0.5; }
      50%    { transform:scale(1.1); opacity:0.85; }
    }
    @keyframes shimmer {
      0%   { background-position:-200% 0; }
      100% { background-position:200% 0; }
    }
    @keyframes glowLine {
      0%   { left:-20%; opacity:0; }
      50%  { opacity:1; }
      100% { left:120%; opacity:0; }
    }
    @keyframes infoCardIn {
      from { opacity:0; transform:translateX(-20px) scale(0.96); }
      to   { opacity:1; transform:translateX(0) scale(1); }
    }
    @keyframes statsCountIn {
      from { opacity:0; transform:translateY(12px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes dotBlink {
      0%,100%{ opacity:1; } 50%{ opacity:0.2; }
    }
    @keyframes mapPing {
      0%   { transform:scale(1); opacity:1; }
      100% { transform:scale(2.5); opacity:0; }
    }
    @keyframes tagReveal {
      from { opacity:0; transform:translateY(8px) scale(0.9); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes waveformBar {
      0%,100%{ height:4px; }
      50%    { height:16px; }
    }

    .blob-1 { animation:morphBlob1 16s ease-in-out infinite; }
    .blob-2 { animation:morphBlob2 20s ease-in-out infinite; }
    .float-slow { animation:floatSlow 7s ease-in-out infinite; }
    .float-med  { animation:floatMed  5s ease-in-out infinite; }
    .float-fast { animation:floatFast 3.5s ease-in-out infinite; }

    .fade-in-up    { animation:fadeInUp    0.65s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in-left  { animation:fadeInLeft  0.65s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in-right { animation:fadeInRight 0.65s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in-scale { animation:fadeInScale 0.5s  cubic-bezier(0.16,1,0.3,1) both; }
    .slide-down    { animation:slideDown   0.6s  cubic-bezier(0.16,1,0.3,1) both; }
    .pop-in        { animation:popIn       0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

    .gradient-text {
      background: linear-gradient(135deg,#14b8a6,#06b6d4,#2dd4bf,#14b8a6);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 4s ease infinite;
    }

    .dot-grid {
      background-image: radial-gradient(rgba(20,184,166,0.07) 1px, transparent 1px);
      background-size: 26px 26px;
    }

    .glass-card {
      background: linear-gradient(135deg,rgba(10,26,34,0.88) 0%,rgba(7,16,21,0.94) 100%);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
    }

    .shine-card {
      position: relative;
      overflow: hidden;
    }
    .shine-card::after {
      content:'';
      position:absolute;
      top:0; left:-100%;
      width:55%; height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.03),transparent);
      animation:cardShine 6s ease-in-out infinite;
    }

    .glow-border {
      position: relative;
    }
    .glow-border::before {
      content:'';
      position:absolute;
      inset:-1px;
      border-radius:inherit;
      padding:1px;
      background:conic-gradient(from var(--angle,0deg),transparent 40%,#14b8a6 50%,transparent 60%);
      -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
      -webkit-mask-composite:xor;
      mask-composite:exclude;
      animation:borderRotate 5s linear infinite;
      opacity:0;
      transition:opacity 0.5s;
    }
    .glow-border:hover::before { opacity:1; }

    @property --angle {
      syntax:'<angle>';
      initial-value:0deg;
      inherits:false;
    }

    .info-card-hover {
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    }
    .info-card-hover:hover {
      transform: translateX(6px);
      border-color: rgba(20,184,166,0.3);
      box-shadow: 0 8px 32px -12px rgba(20,184,166,0.15);
    }

    .field-wrapper { position:relative; }
    .field-glow-line {
      position:absolute;
      bottom:0; left:50%;
      transform:translateX(-50%);
      height:2px;
      background:linear-gradient(90deg,transparent,#14b8a6,transparent);
      border-radius:2px;
      width:0%; opacity:0;
      transition:width 0.4s ease, opacity 0.4s ease;
    }
    .field-wrapper:focus-within .field-glow-line {
      width:90%; opacity:1;
    }

    .submit-btn {
      position:relative;
      overflow:hidden;
      transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
    }
    .submit-btn::before {
      content:'';
      position:absolute;
      inset:0;
      background:linear-gradient(135deg,#14b8a6,#06b6d4,#2dd4bf,#14b8a6);
      background-size:300% 300%;
      animation:gradientShift 3s ease infinite;
      opacity:0;
      transition:opacity 0.35s;
    }
    .submit-btn:hover::before { opacity:1; }
    .submit-btn:hover { transform:translateY(-2px); box-shadow:0 16px 40px -12px rgba(20,184,166,0.35); }
    .submit-btn:active { transform:translateY(0); }

    .ripple-container { position:relative; overflow:hidden; }
    .ripple-circle {
      position:absolute;
      border-radius:50%;
      background:rgba(255,255,255,0.2);
      transform:scale(0);
      animation:rippleOut 0.6s ease-out;
      pointer-events:none;
    }

    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:#1e3a42; border-radius:10px; }
    ::-webkit-scrollbar-thumb:hover { background:#14b8a6; }
  `}</style>
);

/* ═══════════════════════════════════════
   PARTICLE FIELD
═══════════════════════════════════════ */
function ParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 18 + 14,
      delay: Math.random() * 8,
      dx: `${(Math.random() - 0.5) * 100}px`,
      dy: `${(Math.random() - 0.5) * 100}px`,
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: ['#14b8a6', '#06b6d4', '#2dd4bf'][p.id % 3],
            opacity: 0,
            '--dx': p.dx, '--dy': p.dy,
            animation: `particleDrift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   RIPPLE BUTTON
═══════════════════════════════════════ */
function RippleButton({ children, onClick, disabled, className, type = 'button', ...props }) {
  const btnRef = useRef(null);
  const fire = (e) => {
    if (disabled) return;
    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const span = document.createElement('span');
    const d = Math.max(rect.width, rect.height);
    span.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px`;
    span.className = 'ripple-circle';
    btn.appendChild(span);
    setTimeout(() => span.remove(), 600);
    onClick?.(e);
  };
  return (
    <button ref={btnRef} type={type} onClick={fire} disabled={disabled}
      className={`ripple-container ${className}`} {...props}>
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   ANIMATED FIELD WRAPPER
═══════════════════════════════════════ */
function FieldWrapper({ label, children, hint, required }) {
  return (
    <div className="field-wrapper group">
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-2 group-focus-within:text-[#14b8a6] transition-colors duration-300">
        {label}
        {required && <span className="text-[#14b8a6] ml-0.5">*</span>}
        {hint && <span className="text-gray-700 ml-2 normal-case tracking-normal font-medium text-[10px]">{hint}</span>}
      </label>
      {children}
      <div className="field-glow-line" />
    </div>
  );
}

/* ═══════════════════════════════════════
   STYLED INPUT
═══════════════════════════════════════ */
const inputBase =
  'w-full px-4 py-3 bg-[#071015]/60 border border-[#1e3a42]/60 rounded-xl text-white text-sm placeholder-gray-700 ' +
  'focus:outline-none focus:border-[#14b8a6]/40 focus:bg-[#071015]/80 transition-all duration-300 ' +
  'hover:border-[#1e3a42] focus:ring-1 focus:ring-[#14b8a6]/10';

/* ═══════════════════════════════════════
   INFO CARD
═══════════════════════════════════════ */
function InfoCard({ icon: Icon, label, value, color, bg, delay, sub }) {
  const [copied, setCopied] = useState(false);
  const canCopy = value.includes('@') || value.includes('+');
  const doCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="info-card-hover glow-border shine-card group flex items-start gap-4 p-4 rounded-2xl border border-[#1e3a42]/30 bg-[#071015]/50 cursor-default relative overflow-hidden"
      style={{ animation: `infoCardIn 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s both` }}
    >
      {/* Hover bg glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 50%, ${color.replace('text-', '')}08 0%, transparent 70%)` }} />

      {/* Icon */}
      <div className="relative shrink-0">
        <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center transition-all duration-400 group-hover:scale-110 group-hover:rotate-3 relative z-10`}>
          <Icon size={18} className={color} />
        </div>
        {/* Pulse ring */}
        <div className={`absolute inset-0 rounded-xl ${bg} opacity-0 group-hover:opacity-100`}
          style={{ animation: 'pulseRing 1.5s ease-out infinite' }} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-bold mb-0.5">{label}</p>
        <p className="text-white text-sm font-semibold truncate group-hover:text-[#2dd4bf] transition-colors duration-300">{value}</p>
        {sub && <p className="text-[11px] text-gray-600 mt-0.5">{sub}</p>}
      </div>

      {/* Copy button */}
      {canCopy && (
        <button onClick={doCopy}
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-[#2dd4bf] hover:bg-[#14b8a6]/10 transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer relative z-10">
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   LIVE STATUS BADGE
═══════════════════════════════════════ */
function LiveStatusBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.06] border border-emerald-500/15">
      <div className="relative w-2 h-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: 'statusPulse 2s ease infinite' }} />
        <div className="absolute inset-0 rounded-full bg-emerald-400"
          style={{ animation: 'mapPing 1.5s ease-out infinite' }} />
      </div>
      {/* Waveform bars */}
      <div className="flex items-center gap-[2px]">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="w-[2px] rounded-full bg-emerald-400"
            style={{ animation: `waveformBar 1s ease-in-out ${i * 0.15}s infinite` }} />
        ))}
      </div>
      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Online</span>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAP CARD
═══════════════════════════════════════ */
function MapCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#1e3a42]/30 bg-[#071015]/50 h-44 group"
      style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s both' }}>

      {/* Fake grid map */}
      <div className="absolute inset-0 dot-grid opacity-60" />

      {/* Grid lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={`h${i}`} className="absolute left-0 right-0 border-t border-[#1e3a42]/20"
          style={{ top: `${i * 25}%` }} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={`v${i}`} className="absolute top-0 bottom-0 border-l border-[#1e3a42]/20"
          style={{ left: `${i * 20}%` }} />
      ))}

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071015]/40 via-transparent to-[#0A1A22]/40" />

      {/* Pin */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Ripple rings */}
          <div className="absolute inset-[-12px] rounded-full bg-[#14b8a6]/15"
            style={{ animation: 'pulseRing 2s ease-out infinite' }} />
          <div className="absolute inset-[-20px] rounded-full bg-[#14b8a6]/08"
            style={{ animation: 'pulseRing 2s ease-out 0.6s infinite' }} />

          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-xl shadow-[#14b8a6]/30 float-slow">
            <MapPin size={22} className="text-white" />
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A1A22]/90 border border-[#1e3a42]/40 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
          <span className="text-[10px] text-gray-400 font-semibold">Dhaka, Bangladesh</span>
        </div>
      </div>

      {/* Corner coords */}
      <div className="absolute top-2 left-3 text-[9px] text-gray-700 font-mono">23.8103° N</div>
      <div className="absolute top-2 right-3 text-[9px] text-gray-700 font-mono">90.4125° E</div>

      {/* Scan line */}
      <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#14b8a6]/20 to-transparent pointer-events-none"
        style={{ animation: 'scanLine 6s linear infinite' }} />
    </div>
  );
}

/* ═══════════════════════════════════════
   STATS ROW
═══════════════════════════════════════ */
function StatsRow() {
  const stats = [
    { value: '< 2h', label: 'Response Time', icon: Clock, color: '#14b8a6' },
    { value: '99%', label: 'Satisfaction', icon: Star, color: '#06b6d4' },
    { value: '24/7', label: 'Support', icon: Headphones, color: '#2dd4bf' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((s, i) => (
        <div key={s.label}
          className="text-center p-3 rounded-xl bg-[#071015]/40 border border-[#1e3a42]/20 group hover:border-[#14b8a6]/20 transition-all duration-300"
          style={{ animation: `statsCountIn 0.5s cubic-bezier(0.16,1,0.3,1) ${0.6 + i * 0.1}s both` }}>
          <div className="text-base font-black tabular-nums mb-0.5 transition-all duration-300 group-hover:scale-110"
            style={{ color: s.color }}>{s.value}</div>
          <div className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   SUCCESS OVERLAY
═══════════════════════════════════════ */
function SuccessOverlay({ onDismiss }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-2xl bg-[#0A1A22]/97 backdrop-blur-sm"
      style={{ animation: 'fadeInScale 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>

      {/* Ripple rings behind icon */}
      <div className="relative mb-6">
        <div className="absolute inset-[-20px] rounded-full bg-emerald-500/10"
          style={{ animation: 'pulseRing 2s ease-out infinite' }} />
        <div className="absolute inset-[-32px] rounded-full bg-emerald-500/05"
          style={{ animation: 'pulseRing 2s ease-out 0.5s infinite' }} />

        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#14b8a6] flex items-center justify-center shadow-2xl shadow-emerald-500/30"
          style={{ animation: 'successBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <CheckCircle size={38} className="text-white" />
        </div>
      </div>

      {/* Decorative dots */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: ['#14b8a6', '#06b6d4', '#2dd4bf'][i % 3],
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            animation: `fadeInScale 0.4s ${0.2 + i * 0.08}s both`,
            opacity: 0.4 + Math.random() * 0.4,
          }} />
      ))}

      <h3 className="text-2xl font-black text-white mb-2 fade-in-up" style={{ animationDelay: '0.2s' }}>
        Message Sent!
      </h3>
      <p className="text-gray-400 text-sm text-center max-w-xs mb-6 fade-in-up" style={{ animationDelay: '0.3s' }}>
        We've received your message and will get back to you within 2 hours.
      </p>

      {/* Tags */}
      <div className="flex gap-2 mb-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
        {['Confirmed', 'In Queue', 'Soon'].map((t, i) => (
          <span key={t} className="px-2.5 py-1 rounded-full text-[10px] font-bold border"
            style={{
              background: 'rgba(20,184,166,0.08)',
              borderColor: 'rgba(20,184,166,0.2)',
              color: '#2dd4bf',
              animation: `tagReveal 0.4s ${0.5 + i * 0.08}s both`,
            }}>
            {t}
          </span>
        ))}
      </div>

      <button onClick={onDismiss}
        className="px-6 py-2.5 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] text-sm font-bold hover:bg-[#14b8a6]/20 transition-all duration-200 cursor-pointer fade-in-up hover:scale-105 active:scale-95"
        style={{ animationDelay: '0.5s' }}>
        Send Another
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   CHAR COUNTER
═══════════════════════════════════════ */
function CharCounter({ current, max }) {
  const pct = current / max;
  const warn = pct > 0.75;
  const danger = pct > 0.9;
  const color = danger ? '#ef4444' : warn ? '#f59e0b' : '#6b7280';
  return (
    <div className="flex items-center gap-1.5 mt-1.5 justify-end">
      <div className="w-12 h-1 rounded-full overflow-hidden bg-[#1e3a42]/40">
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct * 100}%`, background: color }} />
      </div>
      <span className="text-[9px] tabular-nums font-semibold" style={{ color }}>
        {current}/{max}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════
   TOPIC TAGS
═══════════════════════════════════════ */
function TopicTags({ value, onChange }) {
  const topics = ['Job Application', 'Resume Help', 'Technical Issue', 'Partnership', 'Feedback', 'Other'];
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((t, i) => (
        <button key={t} type="button" onClick={() => onChange(t)}
          className="px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          style={{
            animation: `tagReveal 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both`,
            background: value === t ? 'rgba(20,184,166,0.12)' : 'rgba(15,58,66,0.2)',
            borderColor: value === t ? 'rgba(20,184,166,0.4)' : 'rgba(30,58,66,0.4)',
            color: value === t ? '#2dd4bf' : '#6b7280',
            boxShadow: value === t ? '0 0 16px -6px rgba(20,184,166,0.25)' : 'none',
          }}>
          {t}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN EXPORT — CONTACT
═══════════════════════════════════════ */
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/contacts', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    {
      icon: MapPin, label: 'Location', value: 'Dhaka, Bangladesh',
      color: 'text-[#2dd4bf]', bg: 'bg-[#14b8a6]/10',
      sub: 'South Asian HQ', delay: 0.1,
    },
    {
      icon: Phone, label: 'Phone', value: '+880 1700 000000',
      color: 'text-[#06b6d4]', bg: 'bg-[#06b6d4]/10',
      sub: 'Mon – Fri, 9AM – 6PM', delay: 0.18,
    },
    {
      icon: Mail, label: 'Email', value: 'support@careerpath.dev',
      color: 'text-emerald-400', bg: 'bg-emerald-500/10',
      sub: 'Usually replies < 2h', delay: 0.26,
    },
    {
      icon: MessageSquare, label: 'Live Chat', value: 'Chat with us now',
      color: 'text-amber-400', bg: 'bg-amber-500/10',
      sub: 'Available 9AM – 6PM BST', delay: 0.34,
    },
  ];

  return (
    <>
      <InjectStyles />
      <div className="min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#050D11 0%,#0A1A22 40%,#071218 100%)' }}>

        {/* ── Background ── */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="blob-1 absolute -top-[18%] -left-[8%] w-[480px] h-[480px] bg-[#14b8a6]/[0.025]" />
          <div className="blob-2 absolute -bottom-[12%] -right-[14%] w-[560px] h-[560px] bg-[#06b6d4]/[0.025]" />
          <div className="absolute top-[35%] left-[55%] w-[380px] h-[380px] bg-[radial-gradient(ellipse,rgba(45,212,191,0.022)_0%,transparent_70%)]"
            style={{ animation: 'orbFloat 22s ease-in-out infinite' }} />
          <div className="dot-grid absolute inset-0 opacity-35" />
          <ParticleField />
          <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#14b8a6]/10 to-transparent"
            style={{ animation: 'scanLine 10s linear infinite' }} />
        </div>

        <div className="relative z-10 pt-24 pb-20">
          <div className="max-w-[1120px] mx-auto px-6 sm:px-8 lg:px-12">

            {/* ═══ HERO HEADER ═══ */}
            <div className="text-center mb-14 slide-down">
              {/* Floating decorations */}
              <div className="relative inline-block mb-6">
                <div className="absolute -top-8 -left-12 float-slow opacity-35">
                  <div className="w-3 h-3 rounded-full bg-[#14b8a6]/40 blur-[1.5px]" />
                </div>
                <div className="absolute -top-4 -right-14 float-med opacity-28">
                  <div className="w-2 h-2 rounded-full bg-[#06b6d4]/60" />
                </div>
                <div className="absolute top-5 -left-18 float-fast opacity-20">
                  <div className="w-4 h-4 rounded bg-[#2dd4bf]/15 rotate-45" />
                </div>

                <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#14b8a6]/[0.07] border border-[#14b8a6]/18 mb-5">
                  <Sparkles size={13} className="text-[#14b8a6] animate-pulse" />
                  <span className="text-[10px] font-black text-[#2dd4bf] uppercase tracking-[0.22em]">
                    Get In Touch
                  </span>
                  <LiveStatusBadge />
                </div>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-5 leading-[1.08] tracking-tight">
                Let's <span className="gradient-text">Connect</span>
              </h1>
              <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed fade-in-up" style={{ animationDelay: '0.25s' }}>
                Have questions, feedback, or just want to say hello? We'd love to hear from you — our team typically responds within 2 hours.
              </p>

              {/* Floating decorative tags below subtitle */}
              <div className="flex justify-center gap-3 flex-wrap mt-7 fade-in-up" style={{ animationDelay: '0.4s' }}>
                {[
                  { icon: Zap, label: 'Fast Replies', c: '#14b8a6' },
                  { icon: Shield, label: 'Secure', c: '#06b6d4' },
                  { icon: Globe, label: 'Worldwide', c: '#2dd4bf' },
                ].map((tag, i) => (
                  <div key={tag.label} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0A1A22]/70 border border-[#1e3a42]/40 backdrop-blur-sm">
                    <tag.icon size={13} style={{ color: tag.c }} />
                    <span className="text-[11px] text-gray-400 font-semibold">{tag.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ MAIN GRID ═══ */}
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">

              {/* ═══ LEFT COLUMN ═══ */}
              <div className="lg:col-span-2 space-y-4">

                {/* Contact info panel */}
                <div className="glass-card glow-border shine-card rounded-2xl border border-[#1e3a42]/30 p-6 fade-in-left relative overflow-hidden">
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6]/35 to-transparent">
                    <div className="absolute h-[2px] w-[35%] bg-gradient-to-r from-transparent via-[#2dd4bf] to-transparent"
                      style={{ animation: 'glowLine 5s ease-in-out infinite' }} />
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20">
                      <Radio size={15} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-white tracking-wide">Contact Information</h2>
                      <p className="text-[10px] text-gray-600 font-medium">Multiple ways to reach us</p>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    {contactCards.map(card => (
                      <InfoCard key={card.label} {...card} />
                    ))}
                  </div>
                </div>

                {/* Stats row */}
                <StatsRow />

                {/* Map card */}
                <MapCard />

                {/* Terminal-style note */}
                <div className="rounded-xl border border-[#1e3a42]/25 bg-[#071015]/50 p-4 font-mono fade-in-up" style={{ animationDelay: '0.7s' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1.5">
                      {['#ef4444', '#f59e0b', '#10b981'].map(c => (
                        <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                    <span className="text-[9px] text-gray-700 font-bold uppercase tracking-wider ml-1">terminal</span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex gap-2"><span className="text-[#14b8a6]">$</span><span className="text-gray-500">ping support@careerpath.dev</span></div>
                    <div className="text-emerald-400">✓ Host reachable — 12ms</div>
                    <div className="flex gap-2"><span className="text-[#14b8a6]">$</span><span className="text-gray-500">status --team</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">●</span>
                      <span className="text-gray-500">All systems operational</span>
                      <span className="text-gray-700" style={{ animation: 'typewriterCursor 1s infinite' }}>▋</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══ RIGHT COLUMN — FORM ═══ */}
              <div className="lg:col-span-3">
                <div className="glass-card glow-border shine-card rounded-2xl border border-[#1e3a42]/30 p-6 sm:p-8 relative overflow-hidden fade-in-right">

                  {/* Top gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6]/35 to-transparent">
                    <div className="absolute h-[2px] w-[35%] bg-gradient-to-r from-transparent via-[#2dd4bf] to-transparent"
                      style={{ animation: 'glowLine 4s ease-in-out 1s infinite' }} />
                  </div>

                  {/* Form header */}
                  <div className="flex items-start justify-between mb-7">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20">
                          <Send size={13} className="text-white" />
                        </div>
                        <h2 className="text-base font-black text-white tracking-wide">Send a Message</h2>
                      </div>
                      <p className="text-[11px] text-gray-600 ml-10">Fill in the details and we'll reply ASAP</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0F3A42]/30 border border-[#1e3a42]/25">
                      <Cpu size={10} className="text-[#14b8a6]/50" />
                      <span className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">Encrypted</span>
                    </div>
                  </div>

                  {/* Error alert */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-500/[0.06] border border-red-500/20 rounded-xl pop-in">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-red-400 text-sm font-semibold mb-0.5">Failed to send</p>
                          <p className="text-red-400/70 text-xs">{error}</p>
                        </div>
                        <button onClick={() => setError('')}
                          className="text-red-400/50 hover:text-red-400 transition-colors cursor-pointer">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name + Email row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FieldWrapper label="Full Name" required>
                        <input type="text" name="name" value={form.name} onChange={handleChange}
                          required placeholder="John Doe" className={inputBase} />
                      </FieldWrapper>
                      <FieldWrapper label="Email Address" required>
                        <input type="email" name="email" value={form.email} onChange={handleChange}
                          required placeholder="john@example.com" className={inputBase} />
                      </FieldWrapper>
                    </div>

                    {/* Topic tags */}
                    <div>
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-2.5">
                        Topic <span className="text-gray-700 normal-case tracking-normal font-medium">(optional)</span>
                      </p>
                      <TopicTags value={form.subject} onChange={v => setForm(p => ({ ...p, subject: v }))} />
                    </div>

                    {/* Subject */}
                    <FieldWrapper label="Subject" required>
                      <input type="text" name="subject" value={form.subject} onChange={handleChange}
                        required placeholder="How can we help you?"
                        className={inputBase} />
                    </FieldWrapper>

                    {/* Message */}
                    <FieldWrapper label="Message" required hint="Be as detailed as possible">
                      <textarea name="message" value={form.message} onChange={handleChange}
                        required rows={5} placeholder="Tell us what's on your mind..."
                        className={`${inputBase} resize-none`} maxLength={1000} />
                      <CharCounter current={form.message.length} max={1000} />
                    </FieldWrapper>

                    {/* Privacy note */}
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0F3A42]/20 border border-[#1e3a42]/20">
                      <Shield size={13} className="text-[#14b8a6]/50 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-gray-700 leading-relaxed">
                        Your information is encrypted and never shared. By submitting you agree to our
                        <span className="text-[#14b8a6]/60 ml-1 cursor-pointer hover:text-[#14b8a6] transition-colors">privacy policy</span>.
                      </p>
                    </div>

                    {/* Submit button */}
                    <RippleButton type="submit" disabled={loading}
                      className="submit-btn w-full py-4 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer relative z-10"
                      style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488,#06b6d4)' }}>
                      <span className="relative z-10 flex items-center gap-2.5">
                        {loading ? (
                          <>
                            <Loader2 size={17} className="animate-spin" />
                            <span>Sending your message…</span>
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            <span>Send Message</span>
                            <CornerDownLeft size={13} className="opacity-50" />
                          </>
                        )}
                      </span>
                    </RippleButton>

                    {/* Bottom footnote */}
                    <p className="text-center text-[10px] text-gray-700 flex items-center justify-center gap-1.5">
                      <Clock size={10} className="text-gray-700" />
                      Average response time: <strong className="text-gray-600">under 2 hours</strong>
                    </p>
                  </form>

                  {/* Success overlay */}
                  {success && <SuccessOverlay onDismiss={() => setSuccess(false)} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}