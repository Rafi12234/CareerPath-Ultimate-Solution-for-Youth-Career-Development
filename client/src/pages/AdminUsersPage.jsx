import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, LogOut, Menu, X, Search, Eye, Mail, Phone, MapPin,
  Briefcase, BookOpen, Award, ChevronRight, Sparkles,
  GraduationCap, Building2, Calendar, Clock, TrendingUp,
  Shield, Activity, Zap, Star, RefreshCw, UserCheck, UserX,
  Globe, Code, Layers, LayoutGrid, List, ChevronDown,
  ArrowUpRight, ArrowDownRight, UserPlus, Settings, Bell, Hash, Crown,
  Target, Flame, Filter, MoreVertical, CheckCircle, AlertCircle,
  XCircle, Copy, Download, ExternalLink, ArrowRight, Loader2
} from 'lucide-react';
import api from '../utils/api';

/* ═══════════════════════════════════════
   INJECTED STYLES
   ═══════════════════════════════════════ */
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
    @keyframes orbFloat {
      0%{transform:translate(0,0) scale(1)}25%{transform:translate(25px,-35px) scale(1.08)}
      50%{transform:translate(-18px,-55px) scale(.93)}75%{transform:translate(35px,-18px) scale(1.04)}
      100%{transform:translate(0,0) scale(1)}
    }
    @keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-16px) rotate(2deg)}}
    @keyframes floatMed{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes floatFast{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideRight{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideLeft{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes cardEntrance{from{opacity:0;transform:translateY(30px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes staggerIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes modalReveal{from{opacity:0;transform:translateY(50px) scale(.93)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes modalBg{from{opacity:0;backdrop-filter:blur(0)}to{opacity:1;backdrop-filter:blur(16px)}}
    @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
    @keyframes borderRotate{from{--angle:0deg}to{--angle:360deg}}
    @keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(20,184,166,.25)}50%{box-shadow:0 0 0 8px rgba(20,184,166,0)}}
    @keyframes cardShine{0%{left:-100%}50%,100%{left:150%}}
    @keyframes rippleEffect{to{transform:scale(2.5);opacity:0}}
    @keyframes barGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
    @keyframes scanLine{0%{top:-10%}100%{top:110%}}
    @keyframes counterFlip{0%{transform:translateY(100%);opacity:0}60%{transform:translateY(-8%)}100%{transform:translateY(0);opacity:1}}
    @keyframes sidebarItemIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes statusDot{0%,100%{transform:scale(1)}50%{transform:scale(1.5)}}
    @keyframes ringDraw{from{stroke-dashoffset:283}}
    @keyframes sparkle{0%,100%{opacity:0;transform:scale(0) rotate(0)}50%{opacity:1;transform:scale(1) rotate(180deg)}}
    @keyframes numberRoll{0%{transform:translateY(100%);opacity:0;filter:blur(4px)}60%{filter:blur(0)}100%{transform:translateY(0);opacity:1;filter:blur(0)}}
    @keyframes lineTrace{from{stroke-dashoffset:500}to{stroke-dashoffset:0}}
    @keyframes bounceIn{0%{transform:scale(0);opacity:0}50%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
    @keyframes progressShine{0%{left:-30%}100%{left:130%}}
    @keyframes tooltipIn{from{opacity:0;transform:translateX(-8px) scale(.9)}to{opacity:1;transform:translateX(0) scale(1)}}
    @keyframes waveBar{0%,100%{height:30%}50%{height:100%}}
    @keyframes avatarRing{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
    @keyframes tagFloat{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-3px) rotate(1deg)}}
    @keyframes expandHeight{from{max-height:0;opacity:0}to{max-height:2000px;opacity:1}}

    @property --angle{syntax:'<angle>';initial-value:0deg;inherits:false}

    .blob-1{animation:morphBlob1 15s ease-in-out infinite}
    .blob-2{animation:morphBlob2 18s ease-in-out infinite}
    .float-slow{animation:floatSlow 6s ease-in-out infinite}
    .float-med{animation:floatMed 4.5s ease-in-out infinite}
    .float-fast{animation:floatFast 3s ease-in-out infinite}

    .slide-up{animation:slideUp .6s cubic-bezier(.16,1,.3,1) both}
    .slide-down{animation:slideDown .5s cubic-bezier(.16,1,.3,1) both}
    .slide-right{animation:slideRight .5s cubic-bezier(.16,1,.3,1) both}
    .slide-left{animation:slideLeft .5s cubic-bezier(.16,1,.3,1) both}
    .scale-in{animation:scaleIn .4s cubic-bezier(.16,1,.3,1) both}
    .fade-in{animation:fadeIn .5s ease both}
    .card-entrance{animation:cardEntrance .5s cubic-bezier(.16,1,.3,1) both}
    .stagger-in{animation:staggerIn .4s cubic-bezier(.16,1,.3,1) both}
    .modal-reveal{animation:modalReveal .4s cubic-bezier(.16,1,.3,1) both}
    .modal-bg{animation:modalBg .3s ease both}
    .sidebar-item-in{animation:sidebarItemIn .4s cubic-bezier(.16,1,.3,1) both}
    .bounce-in{animation:bounceIn .6s cubic-bezier(.34,1.56,.64,1) both}
    .number-roll{animation:numberRoll .9s cubic-bezier(.16,1,.3,1) both}
    .expand-enter{animation:expandHeight .4s cubic-bezier(.16,1,.3,1) both;overflow:hidden}

    .gradient-text{
      background:linear-gradient(135deg,#14b8a6,#06b6d4,#2dd4bf,#14b8a6);
      background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
      animation:gradientShift 4s ease infinite}

    .glass-card{
      background:linear-gradient(135deg,rgba(10,26,34,.88),rgba(7,16,21,.94));
      backdrop-filter:blur(20px);border:1px solid rgba(30,58,66,.4);
      transition:all .45s cubic-bezier(.16,1,.3,1)}
    .glass-card:hover{border-color:rgba(20,184,166,.3);box-shadow:0 18px 50px -12px rgba(20,184,166,.12),0 0 0 1px rgba(20,184,166,.08)}
    .glass-card-lift:hover{transform:translateY(-5px)}

    .shine-effect{position:relative;overflow:hidden}
    .shine-effect::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent);animation:cardShine 5s ease-in-out infinite}

    .glow-border{position:relative}
    .glow-border::before{content:'';position:absolute;inset:-1px;border-radius:inherit;padding:1px;
      background:conic-gradient(from var(--angle,0deg),transparent 40%,#14b8a6 50%,transparent 60%);
      -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
      -webkit-mask-composite:xor;mask-composite:exclude;animation:borderRotate 4s linear infinite;
      opacity:0;transition:opacity .5s}
    .glow-border:hover::before{opacity:1}

    .shimmer-skeleton{position:relative;overflow:hidden;background:rgba(30,58,66,.15)}
    .shimmer-skeleton::after{content:'';position:absolute;inset:0;
      background:linear-gradient(90deg,transparent,rgba(20,184,166,.06),transparent);animation:shimmer 1.8s ease-in-out infinite}

    .ripple-container{position:relative;overflow:hidden}
    .ripple-circle{position:absolute;border-radius:50%;background:rgba(20,184,166,.25);transform:scale(0);animation:rippleEffect .6s ease-out;pointer-events:none}

    .dot-grid{background-image:radial-gradient(rgba(20,184,166,.06) 1px,transparent 1px);background-size:24px 24px}

    .bar-grow{animation:barGrow 1s cubic-bezier(.16,1,.3,1) both;transform-origin:left}
    .pulse-glow{animation:pulseGlow 2s ease-in-out infinite}
    .status-dot{animation:statusDot 2s ease-in-out infinite}

    .progress-shine{position:relative;overflow:hidden}
    .progress-shine::after{content:'';position:absolute;top:0;left:-30%;width:30%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);animation:progressShine 2s ease-in-out infinite}

    .scan-line-overlay::after{content:'';position:absolute;left:0;width:100%;height:1px;
      background:linear-gradient(90deg,transparent,rgba(20,184,166,.1),transparent);animation:scanLine 8s linear infinite}

    .input-glow{transition:all .3s ease}
    .input-glow:focus{border-color:rgba(20,184,166,.5);box-shadow:0 0 0 3px rgba(20,184,166,.08),0 0 20px rgba(20,184,166,.05)}

    .btn-primary{background:linear-gradient(135deg,#14b8a6,#0d9488);transition:all .3s cubic-bezier(.16,1,.3,1)}
    .btn-primary:hover:not(:disabled){background:linear-gradient(135deg,#0d9488,#0f766e);transform:translateY(-1px);box-shadow:0 8px 25px -5px rgba(20,184,166,.3)}
    .btn-primary:active:not(:disabled){transform:translateY(0) scale(.98)}

    .sidebar-tooltip{opacity:0;transform:translateX(-8px);transition:all .2s ease;pointer-events:none}
    .sidebar-item:hover .sidebar-tooltip{opacity:1;transform:translateX(0)}

    .tag-float{animation:tagFloat 3s ease-in-out infinite}

    .user-card-hover{transition:all .4s cubic-bezier(.16,1,.3,1)}
    .user-card-hover:hover{transform:translateY(-5px);border-color:rgba(20,184,166,.35);box-shadow:0 20px 50px -15px rgba(20,184,166,.15),0 0 0 1px rgba(20,184,166,.1)}
    .user-card-hover:hover .user-name{color:#5eead4}
    .user-card-hover:hover .user-avatar{transform:scale(1.08);box-shadow:0 0 20px rgba(20,184,166,.3)}
    .user-card-hover:hover .view-btn{opacity:1;transform:translateX(0)}
    .user-card-hover:hover .card-accent{opacity:1}
    .user-card-hover:hover .corner-glow{opacity:.15}

    .ring-draw{animation:ringDraw 1.5s ease-out both}
    .avatar-ring{animation:avatarRing 8s linear infinite}
    .line-trace{animation:lineTrace 2s ease-out both;stroke-dasharray:500}

    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#1e3a42;border-radius:10px}
    ::-webkit-scrollbar-thumb:hover{background:#14b8a6}
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

function useAnimatedNumber(target, dur = 900) {
  const [val, setVal] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === prev.current || target == null) return;
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

function useLiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t;
}

/* ═══════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════ */
function RippleButton({ children, onClick, disabled, className = '', ...props }) {
  const ref = useRef(null);
  const handle = (e) => {
    if (disabled) return;
    const btn = ref.current, rect = btn.getBoundingClientRect();
    const c = document.createElement('span'), d = Math.max(rect.width, rect.height);
    c.style.width = c.style.height = d + 'px';
    c.style.left = e.clientX - rect.left - d / 2 + 'px';
    c.style.top = e.clientY - rect.top - d / 2 + 'px';
    c.className = 'ripple-circle';
    btn.appendChild(c); setTimeout(() => c.remove(), 600);
    onClick?.(e);
  };
  return <button ref={ref} onClick={handle} disabled={disabled} className={`ripple-container ${className}`} {...props}>{children}</button>;
}

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const c = { success: { bg: 'rgba(16,185,129,.12)', border: 'rgba(16,185,129,.25)', text: '#10b981', Icon: CheckCircle },
    error: { bg: 'rgba(239,68,68,.12)', border: 'rgba(239,68,68,.25)', text: '#ef4444', Icon: AlertCircle },
    info: { bg: 'rgba(20,184,166,.12)', border: 'rgba(20,184,166,.25)', text: '#14b8a6', Icon: Sparkles } }[type] || {};
  return (
    <div className="fixed top-6 right-6 z-[100] slide-left">
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl backdrop-blur-xl border shadow-2xl" style={{ background: c.bg, borderColor: c.border }}>
        <c.Icon size={18} style={{ color: c.text }} />
        <span className="text-sm font-semibold" style={{ color: c.text }}>{message}</span>
        <button onClick={onClose} className="ml-2 p-1 rounded-lg hover:bg-white/5 transition cursor-pointer"><X size={14} style={{ color: c.text }} /></button>
      </div>
    </div>
  );
}

function ScoreRing({ value, max, size = 44, sw = 3, color = '#14b8a6' }) {
  const r = (size - sw * 2) / 2, circ = 2 * Math.PI * r, dash = (value / max) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#0F3A42" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" className="ring-draw"
          style={{ filter: `drop-shadow(0 0 4px ${color}40)` }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-black text-white tabular-nums">{value}</span>
      </div>
    </div>
  );
}

function Sparkline({ data, color = '#14b8a6', w = 80, h = 24 }) {
  if (!data || data.length < 2) return null;
  const mx = Math.max(...data), mn = Math.min(...data), rng = mx - mn || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - mn) / rng) * (h - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs><linearGradient id={`sp-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".25" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sp-${color.slice(1)})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="line-trace" style={{ filter: `drop-shadow(0 0 3px ${color}40)` }} />
    </svg>
  );
}

/* ═══════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════ */
function StatCard({ icon: Icon, label, value, color, trend, trendValue, delay = 0, visible, sparkData }) {
  const animVal = useAnimatedNumber(visible ? (value || 0) : 0);
  const isPos = trend === 'up';
  return (
    <div className="glass-card glow-border shine-effect rounded-2xl p-5 group cursor-default card-entrance glass-card-lift relative overflow-hidden" style={{ animationDelay: `${delay}s` }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: color }} />
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-0 group-hover:opacity-[.06] transition-opacity duration-700" style={{ background: `radial-gradient(circle,${color},transparent)` }} />
      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity scan-line-overlay" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg" style={{ background: `linear-gradient(135deg,${color}25,${color}10)`, boxShadow: `0 4px 12px ${color}15` }}>
            <Icon size={18} style={{ color }} />
          </div>
          {trendValue && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${isPos ? 'bg-emerald-500/8 text-emerald-400 border-emerald-500/15' : 'bg-red-500/8 text-red-400 border-red-500/15'}`}>
              {isPos ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{trendValue}
            </div>
          )}
        </div>
        <div className="text-3xl font-black text-white tabular-nums mb-0.5 number-roll" style={{ animationDelay: `${delay + 0.2}s` }}>{animVal.toLocaleString()}</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-[.15em] font-bold mb-3">{label}</div>
        {sparkData && <Sparkline data={sparkData} color={color} />}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg,transparent,${color},transparent)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════
   USER CARD
   ═══════════════════════════════════════ */
function UserCard({ user, index, onView }) {
  const initials = (user.name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const grads = ['from-[#14b8a6] to-[#0891b2]', 'from-[#6366f1] to-[#8b5cf6]', 'from-[#f59e0b] to-[#ef4444]', 'from-[#10b981] to-[#059669]', 'from-[#ec4899] to-[#be185d]', 'from-[#3b82f6] to-[#1d4ed8]', 'from-[#f97316] to-[#dc2626]', 'from-[#8b5cf6] to-[#6366f1]'];
  const grad = grads[(user.name?.charCodeAt(0) || 0) % grads.length];

  return (
    <div className="card-entrance" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="glass-card glow-border shine-effect user-card-hover rounded-2xl overflow-hidden relative cursor-pointer group" onClick={() => onView(user.id)}>
        <div className="card-accent absolute top-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg,transparent,#14b8a6,transparent)' }} />
        <div className="corner-glow absolute -bottom-8 -right-8 w-36 h-36 rounded-full opacity-0 transition-opacity duration-500" style={{ background: 'radial-gradient(circle,rgba(20,184,166,.15),transparent)' }} />
        <div className="relative z-10 p-5">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className={`user-avatar w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} p-[2px] transition-all duration-500 shadow-lg`}>
                <div className="w-full h-full rounded-2xl bg-[#0A1A22] flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{initials}</span>
                </div>
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#0A1A22] shadow-lg flex items-center justify-center ${user.is_active !== false ? 'bg-emerald-500' : 'bg-gray-500'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-white status-dot" />
              </div>
              {index < 3 && (
                <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg float-fast">
                  <Crown size={10} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="user-name text-sm font-bold text-white truncate transition-colors duration-300">{user.name}</h3>
                {!user.is_fresher && <span className="shrink-0 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-blue-500/12 text-blue-400 border border-blue-500/20">Pro</span>}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                <Mail size={10} className="text-gray-600 shrink-0" /><span className="truncate">{user.email}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {user.location && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0F3A42]/30 rounded-md text-[10px] text-gray-500 border border-[#1e3a42]/25"><MapPin size={8} className="text-gray-600" />{user.location}</span>}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0F3A42]/30 rounded-md text-[10px] text-gray-500 border border-[#1e3a42]/25"><Calendar size={8} className="text-gray-600" />{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <button className="view-btn shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-[#14b8a6]/10 text-[#14b8a6] border border-transparent hover:border-[#14b8a6]/25 hover:bg-[#14b8a6]/15 transition-all duration-300 opacity-0 translate-x-3 cursor-pointer hover:scale-110"
              onClick={e => { e.stopPropagation(); onView(user.id); }}><Eye size={14} /></button>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1e3a42]/25">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border tag-float ${user.is_fresher ? 'bg-emerald-500/8 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/8 text-blue-400 border-blue-500/20'}`}
                style={{ animationDelay: `${index * .2}s` }}>
                {user.is_fresher ? '🌱 Fresher' : '💼 Experienced'}
              </span>
              {user.headline && <span className="text-[10px] text-gray-600 truncate max-w-[100px]">{user.headline}</span>}
            </div>
            <div className="flex items-center gap-1 text-[9px] text-gray-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span>Profile</span><ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   USER LIST ROW
   ═══════════════════════════════════════ */
function UserListRow({ user, index, onView }) {
  const initials = (user.name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const grads = ['from-[#14b8a6] to-[#0891b2]', 'from-[#6366f1] to-[#8b5cf6]', 'from-[#f59e0b] to-[#ef4444]', 'from-[#10b981] to-[#059669]', 'from-[#ec4899] to-[#be185d]', 'from-[#3b82f6] to-[#1d4ed8]'];
  const grad = grads[(user.name?.charCodeAt(0) || 0) % grads.length];
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-[#14b8a6]/[.03] transition-all duration-300 cursor-pointer group border-b border-[#1e3a42]/15 last:border-0 stagger-in"
      style={{ animationDelay: `${index * .04}s` }} onClick={() => onView(user.id)}>
      <span className="text-xs text-gray-600 font-mono w-8 tabular-nums">{index + 1}</span>
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} p-[2px] group-hover:scale-105 transition-transform duration-300 shadow-md shrink-0`}>
        <div className="w-full h-full rounded-xl bg-[#0A1A22] flex items-center justify-center"><span className="text-sm font-bold text-white">{initials}</span></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate group-hover:text-[#2dd4bf] transition-colors">{user.name}</p>
        <p className="text-[11px] text-gray-500 truncate">{user.headline || 'No headline'}</p>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 min-w-[160px]"><Mail size={11} className="text-gray-600 shrink-0" /><span className="truncate">{user.email}</span></div>
      <div className="hidden md:block min-w-[90px]">
        <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase border ${user.is_fresher ? 'bg-emerald-500/8 text-emerald-400 border-emerald-500/15' : 'bg-blue-500/8 text-blue-400 border-blue-500/15'}`}>{user.is_fresher ? 'Fresher' : 'Experienced'}</span>
      </div>
      <div className="hidden lg:block text-[11px] text-gray-500 min-w-[80px]">{new Date(user.created_at).toLocaleDateString()}</div>
      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#14b8a6]/8 text-[#14b8a6] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#14b8a6]/15 hover:scale-110 cursor-pointer"
        onClick={e => { e.stopPropagation(); onView(user.id); }}><Eye size={13} /></button>
    </div>
  );
}

/* ═══════════════════════════════════════
   SKELETON / EMPTY
   ═══════════════════════════════════════ */
function UserSkeleton({ delay = 0 }) {
  return (
    <div className="glass-card rounded-2xl p-5 overflow-hidden card-entrance" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl shimmer-skeleton shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 w-32 shimmer-skeleton rounded-lg" />
          <div className="h-3 w-48 shimmer-skeleton rounded-lg" />
          <div className="flex gap-2"><div className="h-5 w-16 shimmer-skeleton rounded-md" /><div className="h-5 w-20 shimmer-skeleton rounded-md" /></div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-[#1e3a42]/20">
        <div className="h-6 w-20 shimmer-skeleton rounded-lg" /><div className="h-6 w-16 shimmer-skeleton rounded-lg" />
      </div>
    </div>
  );
}

function EmptyState({ search, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 slide-up">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-[#0A1A22] border border-[#1e3a42]/40 flex items-center justify-center float-slow"><UserX size={40} className="text-gray-700" /></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 flex items-center justify-center scale-in" style={{ animationDelay: '.3s' }}><Search size={14} className="text-[#14b8a6]" /></div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
      <p className="text-gray-500 text-sm max-w-sm text-center mb-6">{search ? `No results matching "${search}"` : 'No registered users yet.'}</p>
      {search && <RippleButton onClick={onClear} className="px-5 py-2.5 bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-xl text-[#2dd4bf] text-sm font-bold hover:bg-[#14b8a6]/20 transition-all cursor-pointer">Clear Search</RippleButton>}
    </div>
  );
}

/* ═══════════════════════════════════════
   PROFILE SECTION / INFO
   ═══════════════════════════════════════ */
function ProfileSection({ title, icon: Icon, children, delay = 0, collapsible = false, color = '#14b8a6' }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="glass-card rounded-2xl overflow-hidden slide-up" style={{ animationDelay: `${delay}s` }}>
      <div className={`flex items-center justify-between px-5 py-3.5 border-b border-[#1e3a42]/30 ${collapsible ? 'cursor-pointer hover:bg-[#14b8a6]/[.03]' : ''}`} onClick={() => collapsible && setOpen(!open)}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}12` }}><Icon size={15} style={{ color }} /></div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
        {collapsible && <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />}
      </div>
      <div className={`transition-all duration-400 ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}><div className="p-5">{children}</div></div>
    </div>
  );
}

function InfoItem({ label, value, icon: Icon, copyable = false }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { if (value && copyable) { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); } };
  return (
    <div className="group p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/25 hover:border-[#14b8a6]/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[9px] text-gray-600 uppercase tracking-[.15em] font-bold flex items-center gap-1.5">{Icon && <Icon size={9} className="text-[#14b8a6]" />}{label}</p>
        {copyable && value && <button onClick={copy} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-[#1e3a42]/40 cursor-pointer">{copied ? <CheckCircle size={10} className="text-emerald-400" /> : <Copy size={10} className="text-gray-600" />}</button>}
      </div>
      <p className="text-sm text-white font-medium group-hover:text-[#2dd4bf] transition-colors truncate">{value || <span className="text-gray-600 italic text-xs">Not provided</span>}</p>
    </div>
  );
}

function EducationCard({ title, icon: Icon, data, color = '#14b8a6' }) {
  return (
    <div className="p-4 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/25 hover:border-[#14b8a6]/20 transition-all group">
      <p className="font-semibold text-xs mb-3 flex items-center gap-1.5" style={{ color }}><Icon size={13} className="group-hover:rotate-6 transition-transform" />{title}</p>
      <div className="grid grid-cols-2 gap-3">
        {data.map(({ label, value }) => <div key={label}><p className="text-gray-600 text-[9px] uppercase tracking-wider mb-0.5 font-bold">{label}</p><p className="text-white text-xs font-medium">{value || <span className="text-gray-600 italic">N/A</span>}</p></div>)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [toast, setToast] = useState(null);
  const clock = useLiveClock();
  const [statsRef, statsVisible] = useInView();

  const showToast = (m, t = 'success') => setToast({ message: m, type: t });

  useEffect(() => { const a = localStorage.getItem('admin_user'); if (!a) { navigate('/login'); return; } fetchUsers(); }, []);
  useEffect(() => { const t = setTimeout(() => fetchUsers(), 400); return () => clearTimeout(t); }, [search]);

  const fetchUsers = async () => {
    try { setLoading(true); const r = await api.get(`/admin/users?search=${search}`); const d = r.data?.data?.data || r.data?.data || r.data || []; setUsers(Array.isArray(d) ? d : []); }
    catch { setUsers([]); } finally { setLoading(false); }
  };

  const handleRefresh = async () => { setRefreshing(true); await fetchUsers(); setTimeout(() => setRefreshing(false), 600); showToast('Users refreshed', 'info'); };

  const handleViewUser = async (userId) => {
    try { setProfileLoading(true); setShowUserModal(true); const r = await api.get(`/admin/users/${userId}`); setSelectedUser(r.data?.data || r.data); }
    catch { setSelectedUser(null); showToast('Failed to load profile', 'error'); } finally { setProfileLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); window.location.assign('/login'); };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, path: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users', badge: 'Live' },
    { id: 'courses', label: 'Courses', icon: GraduationCap, path: '/admin/courses' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/admin/jobs' },
    { id: 'applications', label: 'Applications', icon: Award, path: '/admin/applications', badge: 'New' },
  ];

  const filteredUsers = useMemo(() => {
    let r = users.filter(u => { if (activeTab === 'fresher' && !u.is_fresher) return false; if (activeTab === 'experienced' && u.is_fresher) return false; return true; });
    r.sort((a, b) => { if (sortOrder === 'newest') return new Date(b.created_at) - new Date(a.created_at); if (sortOrder === 'oldest') return new Date(a.created_at) - new Date(b.created_at); if (sortOrder === 'name') return a.name.localeCompare(b.name); return 0; });
    return r;
  }, [users, activeTab, sortOrder]);

  const tabCounts = { all: users.length, fresher: users.filter(u => u.is_fresher).length, experienced: users.filter(u => !u.is_fresher).length };
  const sparkUsers = [12, 18, 15, 22, 28, 25, 32, 30, 35, 40, 38, 45];

  return (
    <>
      <InjectStyles />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="min-h-screen relative overflow-hidden flex" style={{ background: 'linear-gradient(180deg,#03070A 0%,#0A1A22 50%,#050D11 100%)' }}>
        {/* BG */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="blob-1 absolute -top-[15%] -right-[10%] w-[450px] h-[450px] bg-[#14b8a6]/[.025]" />
          <div className="blob-2 absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-[#06b6d4]/[.025]" />
          <div className="absolute top-[35%] left-[25%] w-[350px] h-[350px] bg-[radial-gradient(ellipse,rgba(45,212,191,.02)_0%,transparent_70%)]" style={{ animation: 'orbFloat 20s ease-in-out infinite' }} />
          <div className="dot-grid absolute inset-0 opacity-30" />
        </div>

        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-[72px]'} fixed h-screen z-30 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]`}>
          <div className="h-full flex flex-col bg-[#060E14]/90 backdrop-blur-2xl border-r border-[#1e3a42]/30">
            <div className="p-4 border-b border-[#1e3a42]/30">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-3 transition-all duration-500 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0 overflow-hidden'}`}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20 pulse-glow"><Shield size={16} className="text-white" /></div>
                  <div><h1 className="text-sm font-black gradient-text tracking-tight">NexusAdmin</h1><p className="text-[9px] text-gray-600 uppercase tracking-[.15em] font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-dot" />Online</p></div>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1e3a42]/30 text-gray-500 hover:text-white transition-all cursor-pointer"><Menu size={16} className={`transition-transform duration-500 ${sidebarOpen ? '' : 'rotate-180'}`} /></button>
              </div>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {menuItems.map((item, i) => {
                const isActive = item.id === 'users';
                return (
                  <div key={item.id} className="relative sidebar-item sidebar-item-in" style={{ animationDelay: `${i * .06}s` }}>
                    <button onClick={() => navigate(item.path)} onMouseEnter={() => setSidebarHovered(item.id)} onMouseLeave={() => setSidebarHovered(null)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${isActive ? 'bg-[#14b8a6]/12 text-[#2dd4bf] border border-[#14b8a6]/20' : 'text-gray-500 hover:text-gray-300 hover:bg-[#1e3a42]/15 border border-transparent'}`}>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#14b8a6]" style={{ boxShadow: '0 0 10px rgba(20,184,166,.5)' }} />}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${isActive ? 'bg-[#14b8a6]/15' : 'group-hover:bg-[#1e3a42]/20'}`}>
                        <item.icon size={16} className={`transition-transform duration-300 ${sidebarHovered === item.id ? 'scale-110' : ''}`} />
                      </div>
                      <span className={`text-sm font-semibold transition-all duration-500 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{item.label}</span>
                      {item.badge && sidebarOpen && <span className={`ml-auto px-2 py-0.5 rounded-md text-[9px] font-bold ${item.badge === 'Live' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : item.badge === 'New' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-[#14b8a6]/15 text-[#14b8a6] border border-[#14b8a6]/20'}`}>{item.badge}</span>}
                      {isActive && sidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#14b8a6] status-dot" />}
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/[.03] to-transparent pointer-events-none" />
                    </button>
                    {!sidebarOpen && <div className="sidebar-tooltip absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#0A1A22] border border-[#1e3a42]/50 rounded-lg text-xs font-semibold text-white whitespace-nowrap z-50 shadow-xl">{item.label}</div>}
                  </div>
                );
              })}
            </nav>
            <div className="p-3 border-t border-[#1e3a42]/30">
              {sidebarOpen && <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1e3a42]/10 rounded-xl mb-2 border border-[#1e3a42]/20 fade-in"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">A</div><div className="flex-1 min-w-0"><p className="text-xs font-bold text-white truncate">Super Admin</p><p className="text-[10px] text-gray-600 truncate">admin@nexus.io</p></div><button className="p-1.5 rounded-lg hover:bg-[#1e3a42]/30 text-gray-500 hover:text-white transition-all hover:rotate-90 duration-300 cursor-pointer"><Settings size={13} /></button></div>}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all cursor-pointer group border border-transparent hover:border-red-500/15"><div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-500/10 transition-all"><LogOut size={16} /></div><span className={`text-sm font-semibold transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Logout</span></button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className={`flex-1 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${sidebarOpen ? 'ml-64' : 'ml-[72px]'}`}>
          <div className="relative z-10 p-6 lg:p-8 max-w-[1400px] mx-auto">

            {/* Header */}
            <div className="mb-6 slide-down">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs mb-2"><span className="text-gray-600">Admin</span><ChevronRight size={11} className="text-gray-700" /><span className="text-[#14b8a6] font-semibold">Users</span></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20 pulse-glow"><Users size={20} className="text-white" /></div>
                    <div><h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">User <span className="gradient-text">Command</span></h1><p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5"><Sparkles size={11} className="text-[#14b8a6]" />Monitor and manage community members</p></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-[#071015]/60 border border-[#1e3a42]/30 rounded-xl"><Clock size={12} className="text-[#14b8a6]" /><span className="text-xs font-mono text-gray-400 tabular-nums">{clock.toLocaleTimeString()}</span></div>
                  <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#071015]/60 border border-[#1e3a42]/30 text-gray-500 hover:text-white hover:border-[#14b8a6]/25 transition-all cursor-pointer"><Bell size={15} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full status-dot" /></button>
                  <button onClick={handleRefresh} disabled={refreshing} className={`w-9 h-9 flex items-center justify-center rounded-xl bg-[#071015]/60 border border-[#1e3a42]/30 text-gray-500 hover:text-[#14b8a6] hover:border-[#14b8a6]/25 transition-all cursor-pointer ${refreshing ? 'animate-spin' : ''}`}><RefreshCw size={15} /></button>
                  <RippleButton className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm cursor-pointer group"><UserPlus size={15} className="group-hover:rotate-12 transition-transform" />Add User</RippleButton>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <StatCard icon={Users} label="Total Users" value={users.length} color="#3b82f6" trend="up" trendValue="+12%" delay={0} visible={statsVisible} sparkData={sparkUsers} />
              <StatCard icon={UserCheck} label="Active Now" value={Math.floor(users.length * .35)} color="#10b981" trend="up" trendValue="+8%" delay={.08} visible={statsVisible} />
              <StatCard icon={GraduationCap} label="Enrolled" value={Math.floor(users.length * .6)} color="#8b5cf6" delay={.16} visible={statsVisible} />
              <StatCard icon={Briefcase} label="Job Seekers" value={Math.floor(users.length * .45)} color="#f59e0b" delay={.24} visible={statsVisible} />
            </div>

            {/* Search & Filters */}
            <div className="mb-6 slide-up" style={{ animationDelay: '.15s' }}>
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative group">
                  <div className={`absolute inset-0 rounded-xl transition-opacity duration-500 ${searchFocused ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(135deg,rgba(20,184,166,.06),rgba(6,182,212,.03))', filter: 'blur(15px)' }} />
                  <div className="relative">
                    <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${searchFocused ? 'text-[#14b8a6] scale-110' : 'text-gray-600'}`} />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                      placeholder="Search users by name, email, location..." className="w-full pl-11 pr-10 py-3.5 bg-[#071015]/60 border border-[#1e3a42]/40 rounded-xl text-white text-sm placeholder-gray-600 input-glow outline-none" />
                    {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg bg-[#1e3a42]/40 text-gray-500 hover:text-white transition cursor-pointer hover:scale-110 hover:rotate-90 duration-300"><X size={11} /></button>}
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent rounded-full transition-all duration-500 ${searchFocused ? 'w-[85%] opacity-100' : 'w-0 opacity-0'}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-[#071015]/50 border border-[#1e3a42]/30 rounded-xl p-1.5">
                  {[{ key: 'all', label: 'All', icon: Users }, { key: 'fresher', label: 'Freshers', icon: Sparkles }, { key: 'experienced', label: 'Experienced', icon: Award }].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${activeTab === tab.key ? 'bg-[#14b8a6]/15 text-[#2dd4bf] border border-[#14b8a6]/25 shadow-lg shadow-[#14b8a6]/5' : 'text-gray-500 border border-transparent hover:text-gray-300 hover:bg-[#1e3a42]/15'}`}>
                      <tab.icon size={12} />{tab.label}<span className={`tabular-nums px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab.key ? 'bg-[#14b8a6]/20' : 'bg-[#0F3A42]/40'}`}>{tabCounts[tab.key]}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="relative group/sort">
                    <button className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/30 text-gray-500 hover:text-white text-xs font-semibold transition-all cursor-pointer"><Filter size={13} />Sort<ChevronDown size={12} /></button>
                    <div className="absolute top-full right-0 mt-1.5 w-40 py-1.5 bg-[#0A1A22] border border-[#1e3a42]/40 rounded-xl opacity-0 invisible group-hover/sort:opacity-100 group-hover/sort:visible transition-all duration-300 z-50 shadow-xl backdrop-blur-xl">
                      {[{ key: 'newest', label: 'Newest First' }, { key: 'oldest', label: 'Oldest First' }, { key: 'name', label: 'Name A-Z' }].map(opt => (
                        <button key={opt.key} onClick={() => setSortOrder(opt.key)} className={`w-full px-3.5 py-2 text-left text-xs font-medium transition-all cursor-pointer ${sortOrder === opt.key ? 'bg-[#14b8a6]/10 text-[#14b8a6]' : 'text-gray-400 hover:text-white hover:bg-[#1e3a42]/20'}`}>{opt.label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex bg-[#071015]/50 border border-[#1e3a42]/30 rounded-xl p-1">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${viewMode === 'grid' ? 'bg-[#14b8a6] text-white shadow-lg shadow-[#14b8a6]/25' : 'text-gray-500 hover:text-white'}`}><LayoutGrid size={14} /></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'bg-[#14b8a6] text-white shadow-lg shadow-[#14b8a6]/25' : 'text-gray-500 hover:text-white'}`}><List size={14} /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-5 fade-in" style={{ animationDelay: '.2s' }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#14b8a6] to-[#06b6d4]" />
                <h2 className="text-sm font-bold text-white uppercase tracking-[.12em]">{activeTab === 'all' ? 'All Users' : activeTab === 'fresher' ? 'Freshers' : 'Experienced'}</h2>
                <span className="text-[10px] text-gray-600 bg-[#0F3A42]/40 px-2 py-0.5 rounded-full tabular-nums font-bold">{filteredUsers.length}</span>
              </div>
              <p className="text-[10px] text-gray-600 flex items-center gap-1.5"><Clock size={10} />Updated: {new Date().toLocaleTimeString()}</p>
            </div>

            {/* Users */}
            {loading ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{[0,1,2,3,4,5].map(i => <UserSkeleton key={i} delay={i * .08} />)}</div>
              ) : (
                <div className="glass-card rounded-2xl overflow-hidden">{[0,1,2,3,4,5].map(i => <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[#1e3a42]/15"><div className="w-10 h-10 shimmer-skeleton rounded-xl" /><div className="flex-1 space-y-2"><div className="h-3.5 w-32 shimmer-skeleton rounded-lg" /><div className="h-3 w-48 shimmer-skeleton rounded-lg" /></div></div>)}</div>
              )
            ) : filteredUsers.length === 0 ? (
              <EmptyState search={search} onClear={() => setSearch('')} />
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{filteredUsers.map((u, i) => <UserCard key={u.id} user={u} index={i} onView={handleViewUser} />)}</div>
            ) : (
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-3 border-b border-[#1e3a42]/30 bg-[#071015]/30">
                  {['#', 'Av', 'User', 'Contact', 'Status', 'Joined', ''].map((h, i) => <span key={i} className={`text-[9px] text-gray-600 font-bold uppercase tracking-wider ${i === 0 ? 'w-8' : i === 1 ? 'w-10' : i === 2 ? 'flex-1' : i === 3 ? 'hidden sm:block min-w-[160px]' : i === 4 ? 'hidden md:block min-w-[90px]' : i === 5 ? 'hidden lg:block min-w-[80px]' : 'w-8'}`}>{h}</span>)}
                </div>
                {filteredUsers.map((u, i) => <UserListRow key={u.id} user={u} index={i} onView={handleViewUser} />)}
              </div>
            )}

            {/* Footer */}
            {!loading && filteredUsers.length > 0 && (
              <div className="text-center mt-10 fade-in">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#0A1A22]/50 border border-[#1e3a42]/25 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                  <span className="text-[11px] text-gray-500">Showing <span className="text-white font-bold">{filteredUsers.length}</span> of <span className="text-white font-bold">{users.length}</span> users</span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* MODAL */}
        {showUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => { setShowUserModal(false); setSelectedUser(null); }}>
            <div className="modal-bg absolute inset-0 bg-black/75 backdrop-blur-xl" />
            <div onClick={e => e.stopPropagation()} className="modal-reveal relative w-full max-w-5xl max-h-[92vh] overflow-hidden bg-[#0A1A22] border border-[#1e3a42]/50 rounded-3xl shadow-2xl shadow-[#14b8a6]/5">
              <div className="h-1 bg-gradient-to-r from-[#14b8a6] via-[#06b6d4] to-[#2dd4bf] rounded-t-3xl" style={{ backgroundSize: '200% 200%', animation: 'gradientShift 3s ease infinite' }} />
              <div className="px-6 lg:px-8 py-5 border-b border-[#1e3a42]/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] p-[2px] shadow-lg shadow-[#14b8a6]/25"><div className="w-full h-full rounded-2xl bg-[#0A1A22] flex items-center justify-center text-2xl font-black text-white">{selectedUser?.name?.charAt(0).toUpperCase() || 'U'}</div></div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0A1A22] flex items-center justify-center shadow-lg"><Zap size={10} className="text-white" /></div>
                  </div>
                  <div><h2 className="text-xl font-black text-white">{selectedUser?.name || 'Loading...'}</h2><p className="text-xs text-gray-500 flex items-center gap-1.5"><Mail size={11} />{selectedUser?.email || '...'}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1e3a42]/20 text-gray-500 hover:text-[#14b8a6] transition-all cursor-pointer hover:bg-[#1e3a42]/30"><Download size={15} /></button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1e3a42]/20 text-gray-500 hover:text-[#14b8a6] transition-all cursor-pointer hover:bg-[#1e3a42]/30"><ExternalLink size={15} /></button>
                  <button onClick={() => { setShowUserModal(false); setSelectedUser(null); }} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1e3a42]/20 text-gray-400 hover:text-white hover:bg-red-500/15 transition-all cursor-pointer hover:rotate-90 duration-300 border border-transparent hover:border-red-500/20"><X size={16} /></button>
                </div>
              </div>
              <div className="p-6 lg:p-8 max-h-[calc(92vh-120px)] overflow-y-auto">
                {profileLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="relative"><div className="w-14 h-14 border-2 border-[#1e3a42] border-t-[#14b8a6] rounded-full animate-spin" /><div className="absolute inset-2 w-10 h-10 border-2 border-[#1e3a42] border-b-[#06b6d4] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '.6s' }} /></div>
                    <span className="text-xs text-gray-500 font-semibold">Loading profile...</span>
                  </div>
                ) : selectedUser ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <ProfileSection title="Personal Information" icon={Users} delay={0}>
                      <div className="grid grid-cols-2 gap-3">
                        <InfoItem label="Full Name" value={selectedUser.name} copyable />
                        <InfoItem label="Email" value={selectedUser.email} icon={Mail} copyable />
                        <InfoItem label="Phone" value={selectedUser.phone} icon={Phone} copyable />
                        <InfoItem label="Date of Birth" value={selectedUser.date_of_birth ? new Date(selectedUser.date_of_birth).toLocaleDateString() : null} />
                        <InfoItem label="Gender" value={selectedUser.gender} />
                        <InfoItem label="Nationality" value={selectedUser.nationality} icon={Globe} />
                        <InfoItem label="Location" value={selectedUser.location} icon={MapPin} />
                        <InfoItem label="Marital Status" value={selectedUser.marital_status} />
                        <div className="col-span-2"><InfoItem label="Headline" value={selectedUser.headline} /></div>
                        <div className="col-span-2"><InfoItem label="Bio" value={selectedUser.bio} /></div>
                      </div>
                    </ProfileSection>

                    <ProfileSection title="Education" icon={GraduationCap} delay={.08} collapsible>
                      <div className="space-y-3">
                        <EducationCard title="SSC" icon={BookOpen} data={[{ label: 'School', value: selectedUser.school_name }, { label: 'Year', value: selectedUser.ssc_year }, { label: 'Result', value: selectedUser.ssc_result }, { label: 'Board', value: selectedUser.ssc_board }]} />
                        <EducationCard title="HSC" icon={BookOpen} color="#0891b2" data={[{ label: 'College', value: selectedUser.college_name }, { label: 'Year', value: selectedUser.hsc_year }, { label: 'Result', value: selectedUser.hsc_result }, { label: 'Board', value: selectedUser.hsc_board }]} />
                        <EducationCard title="University" icon={GraduationCap} color="#2dd4bf" data={[{ label: 'University', value: selectedUser.university_name }, { label: 'Status', value: selectedUser.university_status }, { label: 'CGPA', value: selectedUser.university_cgpa }, { label: 'Graduation', value: selectedUser.university_graduation_year }]} />
                      </div>
                    </ProfileSection>

                    <ProfileSection title="Experience" icon={Briefcase} delay={.16}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#14b8a6]/8 via-transparent to-transparent border border-[#14b8a6]/15">
                          <span className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg ${selectedUser.is_fresher ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/20'}`}>{selectedUser.is_fresher ? '🌱 Fresher' : '💼 Experienced'}</span>
                          <span className="text-xs text-gray-400">{selectedUser.years_of_experience || 0} years</span>
                        </div>
                        {!selectedUser.is_fresher && <div className="grid grid-cols-2 gap-3"><InfoItem label="Current Title" value={selectedUser.current_job_title} /><InfoItem label="Current Company" value={selectedUser.current_company} icon={Building2} /><InfoItem label="Previous Title" value={selectedUser.previous_job_title} /><InfoItem label="Previous Company" value={selectedUser.previous_company} /></div>}
                      </div>
                    </ProfileSection>

                    <ProfileSection title="Skills" icon={Code} delay={.24}>
                      <div className="flex flex-wrap gap-2">
                        {(selectedUser.skills || []).length > 0 ? selectedUser.skills.map((s, i) => (
                          <span key={s.id} className="px-3 py-1.5 rounded-xl bg-[#14b8a6]/8 text-[#2dd4bf] text-xs font-semibold border border-[#14b8a6]/20 hover:scale-105 hover:border-[#14b8a6]/40 transition-all cursor-default slide-up shadow-sm" style={{ animationDelay: `${i * .04}s` }}>{s.skill_name}{s.proficiency && <span className="text-gray-500 ml-1.5 text-[10px]">• {s.proficiency}</span>}</span>
                        )) : <p className="text-gray-600 text-xs italic">No skills added.</p>}
                      </div>
                    </ProfileSection>

                    <ProfileSection title={`Applications (${(selectedUser.applications || []).length})`} icon={Award} delay={.32} collapsible>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {(selectedUser.applications || []).length > 0 ? selectedUser.applications.map((a, i) => (
                          <div key={a.id} className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/25 hover:border-[#14b8a6]/20 transition-all slide-up flex items-center justify-between" style={{ animationDelay: `${i * .04}s` }}>
                            <div><p className="text-xs font-semibold text-white">{a.job?.title || 'Job'}</p><p className="text-[10px] text-gray-500">{a.job?.company || 'Company'}</p></div>
                            <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase border ${a.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/15' : a.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' : 'bg-red-500/10 text-red-400 border-red-500/15'}`}>{a.status}</span>
                          </div>
                        )) : <p className="text-gray-600 text-xs text-center py-6 italic">No applications.</p>}
                      </div>
                    </ProfileSection>

                    <ProfileSection title={`Enrollments (${(selectedUser.enrollments || []).length})`} icon={BookOpen} delay={.4} collapsible>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {(selectedUser.enrollments || []).length > 0 ? selectedUser.enrollments.map((e, i) => (
                          <div key={e.id} className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/25 hover:border-[#14b8a6]/20 transition-all flex items-center gap-3 slide-up" style={{ animationDelay: `${i * .04}s` }}>
                            <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/15"><BookOpen size={14} className="text-violet-400" /></div>
                            <div><p className="text-xs font-semibold text-white">{e.course?.name || 'Course'}</p><p className="text-[10px] text-gray-500">Level: {e.course?.level || 'N/A'}</p></div>
                          </div>
                        )) : <p className="text-gray-600 text-xs text-center py-6 italic">No enrollments.</p>}
                      </div>
                    </ProfileSection>

                    <div className="lg:col-span-2">
                      <ProfileSection title="Account" icon={Shield} delay={.48}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <InfoItem label="User ID" value={`#${selectedUser.id}`} icon={Hash} copyable />
                          <InfoItem label="Member Since" value={new Date(selectedUser.created_at).toLocaleDateString()} icon={Calendar} />
                          <InfoItem label="Last Updated" value={new Date(selectedUser.updated_at).toLocaleDateString()} icon={Clock} />
                          <InfoItem label="Status" value="Active" icon={CheckCircle} />
                        </div>
                      </ProfileSection>
                    </div>

                    <div className="lg:col-span-2 slide-up" style={{ animationDelay: '.56s' }}>
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#14b8a6]/6 via-transparent to-transparent border border-[#14b8a6]/15">
                        <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/10 flex items-center justify-center shrink-0 float-fast"><Sparkles size={16} className="text-[#14b8a6]" /></div>
                        <p className="text-xs text-gray-400">This is a <span className="text-white font-semibold">read-only</span> view. Modifications require additional permissions.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 slide-up">
                    <div className="w-20 h-20 rounded-2xl bg-red-500/8 flex items-center justify-center mb-4 border border-red-500/15"><XCircle size={36} className="text-red-400" /></div>
                    <p className="text-red-400 font-bold text-lg">Failed to load profile</p>
                    <p className="text-gray-500 text-xs mt-1">Please try again later</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}