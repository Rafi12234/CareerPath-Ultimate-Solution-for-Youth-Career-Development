import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Shield, Users,
  Sparkles, Zap, Globe, CheckCircle, KeyRound, ShieldCheck,
  Layers, Fingerprint, TrendingUp, Award, Star, Activity,
  ChevronRight, Code2, Cpu, ArrowUpRight
} from 'lucide-react';
import api from '../utils/api';

/* ─── helpers ─── */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ─── typewriter hook ─── */
function useTypewriter(words) {
  const [text, setText] = useState('');
  const ref = useRef(words);
  useEffect(() => {
    let on = true;
    let i = 0;
    (async () => {
      while (on) {
        const w = ref.current[i % ref.current.length];
        for (let c = 0; c <= w.length && on; c++) {
          setText(w.slice(0, c));
          await sleep(65 + Math.random() * 45);
        }
        await sleep(2200);
        for (let c = w.length; c >= 0 && on; c--) {
          setText(w.slice(0, c));
          await sleep(30);
        }
        await sleep(500);
        i++;
      }
    })();
    return () => { on = false; };
  }, []);
  return text;
}

/* ─── particle seed ─── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  sz: 1.5 + Math.random() * 3,
  x: Math.random() * 100,
  y: Math.random() * 100,
  dur: 18 + Math.random() * 22,
  del: -(Math.random() * 20),
  o: 0.06 + Math.random() * 0.18,
}));

/* ─── orbital ring config ─── */
const RINGS = [
  { inset: 80, dots: 3, speed: 11, dir: 1, color: '#14b8a6', dotSize: 6, dashArray: 'none' },
  { inset: 48, dots: 4, speed: 19, dir: -1, color: '#06b6d4', dotSize: 4, dashArray: '4,6' },
  { inset: 16, dots: 2, speed: 27, dir: 1, color: '#2dd4bf', dotSize: 7, dashArray: 'none' },
];

/* ════════════════════════════════════════
   INJECTED STYLES
   ════════════════════════════════════════ */
const Styles = () => (
  <style>{`
    @keyframes morphA {
      0%,100%{border-radius:42% 58% 70% 30%/45% 45% 55% 55%;transform:rotate(0) scale(1)}
      33%{border-radius:70% 30% 50% 50%/30% 60% 40% 70%;transform:rotate(120deg) scale(1.06)}
      66%{border-radius:30% 70% 40% 60%/55% 30% 70% 45%;transform:rotate(240deg) scale(.94)}
    }
    @keyframes morphB {
      0%,100%{border-radius:58% 42% 30% 70%/55% 45% 55% 45%;transform:scale(1)}
      50%{border-radius:40% 60% 60% 40%/60% 30% 70% 40%;transform:scale(1.08)}
    }
    @keyframes pFloat {
      0%,100%{transform:translate(0,0)}
      25%{transform:translate(20px,-45px)}
      50%{transform:translate(-18px,-75px)}
      75%{transform:translate(30px,-25px)}
    }
    @keyframes spinCW  {to{transform:rotate(360deg)}}
    @keyframes spinCCW {to{transform:rotate(-360deg)}}
    @keyframes pulseRing {
      0%{transform:scale(.85);opacity:.55}
      100%{transform:scale(2.8);opacity:0}
    }
    @keyframes glowPulse {
      0%,100%{opacity:.25;transform:scale(1)}
      50%{opacity:.55;transform:scale(1.12)}
    }
    @keyframes aurora {
      0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}
    }
    @keyframes slideUp {
      from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}
    }
    @keyframes slideDown {
      from{opacity:0;transform:translateY(-28px)}to{opacity:1;transform:translateY(0)}
    }
    @keyframes slideLeft {
      from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}
    }
    @keyframes slideInLeft {
      from{opacity:0;transform:translateX(-50px) rotate(-2deg)}
      to{opacity:1;transform:translateX(0) rotate(0)}
    }
    @keyframes fadeIn   {from{opacity:0}to{opacity:1}}
    @keyframes scaleIn  {from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
    @keyframes countUp  {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes cursorBlink {0%,100%{opacity:1}50%{opacity:0}}
    @keyframes shimmer {0%{left:-100%}50%,100%{left:100%}}
    @keyframes ripple   {to{transform:scale(2.5);opacity:0}}
    @keyframes floatA   {0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes floatB   {0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-9px) rotate(2deg)}}
    @keyframes floatC   {0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-7px) rotate(-1.5deg)}}
    @keyframes scanDown {0%{top:-5%}100%{top:105%}}
    @keyframes shake    {0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
    @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes borderPulse{0%,100%{border-color:rgba(20,184,166,.12)}50%{border-color:rgba(20,184,166,.32)}}
    @keyframes iconPop  {0%{transform:scale(0) rotate(-45deg)}60%{transform:scale(1.15) rotate(5deg)}100%{transform:scale(1) rotate(0)}}
    @keyframes checkDraw{from{stroke-dashoffset:20}to{stroke-dashoffset:0}}
    @keyframes orbGlow  {0%,100%{box-shadow:0 0 8px rgba(20,184,166,.15)}50%{box-shadow:0 0 22px rgba(20,184,166,.35)}}
    @keyframes waveBar  {0%,100%{height:12px}50%{height:28px}}
    @keyframes nodeConnect {
      0%{opacity:0;transform:scaleX(0)}
      50%{opacity:1;transform:scaleX(1)}
      100%{opacity:0;transform:scaleX(1)}
    }

    .slide-up{animation:slideUp .7s cubic-bezier(.16,1,.3,1) both}
    .slide-down{animation:slideDown .6s cubic-bezier(.16,1,.3,1) both}
    .slide-left{animation:slideLeft .6s cubic-bezier(.16,1,.3,1) both}
    .slide-in-left{animation:slideInLeft .7s cubic-bezier(.16,1,.3,1) both}
    .fade-in{animation:fadeIn .6s ease both}
    .scale-in{animation:scaleIn .5s cubic-bezier(.16,1,.3,1) both}
    .count-up{animation:countUp .6s cubic-bezier(.16,1,.3,1) both}
    .icon-pop{animation:iconPop .6s cubic-bezier(.34,1.56,.64,1) both}
    .err-shake{animation:shake .45s ease}

    .gradient-text{
      background:linear-gradient(135deg,#14b8a6,#06b6d4,#2dd4bf,#14b8a6);
      background-size:300% 300%;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      animation:gradShift 4s ease infinite;
    }
    .glass{
      background:linear-gradient(145deg,rgba(10,26,34,.92),rgba(7,16,21,.97));
      backdrop-filter:blur(28px);border:1px solid rgba(30,58,66,.35);
    }
    .scan::after{
      content:'';position:absolute;left:0;width:100%;height:1px;
      background:linear-gradient(90deg,transparent,rgba(20,184,166,.1),transparent);
      animation:scanDown 7s linear infinite;pointer-events:none;
    }
    .shim{position:relative;overflow:hidden}
    .shim::after{
      content:'';position:absolute;top:0;left:-100%;width:55%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);
      animation:shimmer 3.5s ease-in-out infinite;
    }
    .dot-bg{
      background-image:radial-gradient(rgba(20,184,166,.05) 1px,transparent 1px);
      background-size:26px 26px;
    }
    .inp-glow{transition:all .35s cubic-bezier(.16,1,.3,1)}
    .inp-glow:focus-within{
      border-color:rgba(20,184,166,.45)!important;
      box-shadow:0 0 0 3px rgba(20,184,166,.07),0 0 24px -6px rgba(20,184,166,.18);
    }
    .float-a{animation:floatA 5.5s ease-in-out infinite}
    .float-b{animation:floatB 4.8s ease-in-out infinite}
    .float-c{animation:floatC 6.2s ease-in-out infinite}
    .border-pulse{animation:borderPulse 3s ease-in-out infinite}
    .orb-glow{animation:orbGlow 2.5s ease-in-out infinite}

    .ripple-wrap{position:relative;overflow:hidden}
    .rip{
      position:absolute;border-radius:50%;
      background:rgba(255,255,255,.22);
      transform:scale(0);animation:ripple .55s ease-out;
      pointer-events:none;
    }

    @media(max-width:1023px){
      .hide-mobile{display:none!important}
    }

    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#1e3a42;border-radius:10px}
  `}</style>
);

/* ─── Animated floating input ─── */
function FloatingInput({
  icon: Icon,
  label,
  type = 'text',
  value,
  onChange,
  delay = '0s',
  children,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="slide-up" style={{ animationDelay: delay }}>
      <div
        className={`relative inp-glow rounded-xl border transition-colors duration-300
          ${active ? 'border-[#14b8a6]/35' : 'border-[#1e3a42]/60 hover:border-[#1e3a42]'}
        `}
      >
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 z-10
            ${active ? 'text-[#14b8a6]' : 'text-gray-600'}
          `}
          style={{ transform: active ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%) scale(1)' }}
        >
          <Icon size={16} />
        </div>

        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=" "
          className="peer w-full pl-11 pr-4 py-4 pt-7 pb-2 bg-[#071015]/60 rounded-xl text-white
                     text-sm focus:outline-none transition-colors duration-300"
          {...rest}
        />

        <label
          className={`absolute left-11 pointer-events-none transition-all duration-300
            ${
              active
                ? 'top-[10px] text-[10px] font-bold uppercase tracking-[.15em] text-[#14b8a6]'
                : 'top-1/2 -translate-y-1/2 text-[13px] text-gray-600 font-normal tracking-normal'
            }
          `}
        >
          {label}
        </label>

        {/* focus bar */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-500"
          style={{
            width: focused ? '88%' : '0%',
            opacity: focused ? 1 : 0,
            background: 'linear-gradient(90deg, transparent, #14b8a6, #06b6d4, transparent)',
          }}
        />

        {/* side accent */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-400"
          style={{
            height: active ? '55%' : '0%',
            opacity: active ? 1 : 0,
            background: 'linear-gradient(180deg, #14b8a6, #06b6d4)',
          }}
        />

        {children}
      </div>
    </div>
  );
}

/* ─── Ripple button ─── */
function RippleBtn({ children, className = '', onClick, disabled, ...p }) {
  const ref = useRef(null);
  const fire = (e) => {
    if (disabled) return;
    const r = ref.current.getBoundingClientRect();
    const d = Math.max(r.width, r.height);
    const el = document.createElement('span');
    el.style.width = el.style.height = d + 'px';
    el.style.left = e.clientX - r.left - d / 2 + 'px';
    el.style.top = e.clientY - r.top - d / 2 + 'px';
    el.className = 'rip';
    ref.current.appendChild(el);
    setTimeout(() => el.remove(), 600);
    onClick?.(e);
  };
  return (
    <button ref={ref} onClick={fire} disabled={disabled} className={`ripple-wrap ${className}`} {...p}>
      {children}
    </button>
  );
}

/* ─── Orbital system ─── */
function OrbitalViz({ loginType }) {
  return (
    <div className="relative w-[300px] h-[300px] mx-auto scale-in" style={{ animationDelay: '.55s' }}>
      {/* rings + orbiting dots */}
      {RINGS.map((ring, ri) => (
        <div key={ri} className="absolute rounded-full" style={{ inset: ring.inset }}>
          {/* ring border */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: `1px ${ring.dashArray !== 'none' ? 'dashed' : 'solid'} ${ring.color}`,
              opacity: 0.12 + ri * 0.04,
            }}
          />
          {/* orbiting dots */}
          {Array.from({ length: ring.dots }).map((_, di) => (
            <div
              key={di}
              className="absolute inset-0"
              style={{
                animation: `${ring.dir > 0 ? 'spinCW' : 'spinCCW'} ${ring.speed}s linear infinite`,
                animationDelay: `${(-ring.speed / ring.dots) * di}s`,
              }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: ring.dotSize,
                  height: ring.dotSize,
                  background: ring.color,
                  boxShadow: `0 0 ${ring.dotSize + 4}px ${ring.color}50`,
                  opacity: 0.6 + di * 0.12,
                }}
              />
            </div>
          ))}
        </div>
      ))}

      {/* pulse rings */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[52px] h-[52px] rounded-2xl border border-[#14b8a6]/15"
            style={{ animation: 'pulseRing 3.5s ease-out infinite', animationDelay: `${i * 1.15}s` }}
          />
        </div>
      ))}

      {/* centre glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-28 h-28 rounded-full bg-[#14b8a6]/8 blur-2xl"
          style={{ animation: 'glowPulse 3s ease-in-out infinite' }}
        />
      </div>

      {/* centre icon */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative orb-glow w-[56px] h-[56px] bg-gradient-to-br from-[#0A1A22] to-[#071015] border-2 border-[#14b8a6]/30 rounded-2xl flex items-center justify-center shadow-2xl">
          <div className="transition-all duration-500" style={{ transform: loginType === 'admin' ? 'rotateY(180deg)' : 'rotateY(0)' }}>
            {loginType === 'admin' ? (
              <Shield size={24} className="text-[#14b8a6]" />
            ) : (
              <KeyRound size={24} className="text-[#14b8a6]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Feature card ─── */
function FeatureChip({ icon: Ic, title, desc, color, delay, floatClass }) {
  return (
    <div className={`slide-in-left ${floatClass}`} style={{ animationDelay: delay }}>
      <div className="bg-[#0A1A22]/80 backdrop-blur-md border border-[#1e3a42]/30 rounded-xl px-4 py-3 shadow-lg shadow-black/10 hover:border-[#14b8a6]/20 transition-colors duration-300 group cursor-default">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            style={{ background: `${color}12` }}
          >
            <Ic size={14} style={{ color }} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white leading-tight">{title}</p>
            <p className="text-[9px] text-gray-500 leading-tight mt-0.5">{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── wave bars (decorative) ─── */
function WaveBars() {
  return (
    <div className="flex items-end gap-[3px] h-7 opacity-40">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-[#14b8a6]"
          style={{
            animation: `waveBar ${0.8 + i * 0.12}s ease-in-out infinite`,
            animationDelay: `${i * 0.09}s`,
            opacity: 0.3 + (i % 3) * 0.2,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN LOGIN COMPONENT
   ═══════════════════════════════════════ */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailHint, setEmailHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const typewriterWords = useMemo(
    () => ['Your career journey continues here', 'AI-powered matching awaits you', '10,000+ opportunities inside'],
    [],
  );
  const typed = useTypewriter(typewriterWords);

  /* ── helpers ── */
  const normalizeEmailInput = (v) => v.trim().toLowerCase();

  const extractErrorMessage = (err) => {
    const d = err?.response?.data;
    if (!d) return 'Unable to reach server. Please try again.';
    if (d?.errors && typeof d.errors === 'object') {
      const k = Object.keys(d.errors)[0];
      const v = d.errors[k];
      if (Array.isArray(v) && v[0]) return v[0];
    }
    return d?.message || 'Login failed. Please check your credentials.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailHint('');
    setLoading(true);
    const norm = normalizeEmailInput(email);

    if (norm.includes('@gamil.com')) setEmailHint('Did you mean gmail.com?');

    try {
      if (loginType === 'admin') {
        const res = await api.post('/admin/login', { email: norm, password });
        const { admin, token } = res.data;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(admin));
        window.location.assign('/admin/dashboard');
      } else {
        await login(norm, password);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.assign('/dashboard');
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /* ═══════════ JSX ═══════════ */
  return (
    <>
      <Styles />

      <div
        className="min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#050D11 0%,#0A1A22 45%,#071218 100%)' }}
      >
        {/* ── BG layer ── */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute -top-[15%] -left-[8%] w-[480px] h-[480px] bg-[#14b8a6]/[.035]"
            style={{ animation: 'morphA 16s ease-in-out infinite' }}
          />
          <div
            className="absolute -bottom-[10%] -right-[12%] w-[520px] h-[520px] bg-[#06b6d4]/[.03]"
            style={{ animation: 'morphB 20s ease-in-out infinite' }}
          />
          <div className="dot-bg absolute inset-0 opacity-50" />

          {/* particles */}
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-[#14b8a6]"
              style={{
                width: p.sz,
                height: p.sz,
                left: `${p.x}%`,
                top: `${p.y}%`,
                opacity: p.o,
                animation: `pFloat ${p.dur}s ease-in-out infinite`,
                animationDelay: `${p.del}s`,
              }}
            />
          ))}
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16 sm:px-6">
          <div className="w-full max-w-[1100px] mx-auto flex items-center gap-16">
            {/* ════════════════════════════
               LEFT  PANEL  (lg+)
               ════════════════════════════ */}
            <div className="hide-mobile flex-1 flex flex-col items-center justify-center relative">
              {/* badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14b8a6]/[.07] border border-[#14b8a6]/15 mb-6 slide-down"
                style={{ animationDelay: '.15s' }}
              >
                <ShieldCheck size={13} className="text-[#14b8a6]" />
                <span className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-[.2em]">
                  Secure Authentication
                </span>
              </div>

              {/* heading */}
              <h2
                className="text-3xl xl:text-4xl font-black text-white text-center leading-tight mb-2 slide-down"
                style={{ animationDelay: '.25s' }}
              >
                Welcome to
                <br />
                <span className="gradient-text">CareerPath</span>
              </h2>

              {/* typewriter */}
              <div
                className="h-6 flex items-center justify-center mb-10 fade-in"
                style={{ animationDelay: '.4s' }}
              >
                <span className="text-sm text-gray-500">{typed}</span>
                <span
                  className="inline-block w-[2px] h-4 bg-[#14b8a6] ml-0.5 rounded-full"
                  style={{ animation: 'cursorBlink 1s step-end infinite' }}
                />
              </div>

              {/* orbital */}
              <div className="relative mb-10">
                <OrbitalViz loginType={loginType} />

                {/* floating feature cards */}
                <div className="absolute -top-10 -right-6 z-20">
                  <FeatureChip
                    icon={TrendingUp}
                    title="AI Matching"
                    desc="Smart recommendations"
                    color="#14b8a6"
                    delay=".75s"
                    floatClass="float-a"
                  />
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 -left-14 z-20">
                  <FeatureChip
                    icon={Layers}
                    title="Skill Analytics"
                    desc="Track your growth"
                    color="#06b6d4"
                    delay=".9s"
                    floatClass="float-b"
                  />
                </div>
                <div className="absolute -bottom-8 right-2 z-20">
                  <FeatureChip
                    icon={Globe}
                    title="Global Jobs"
                    desc="10K+ opportunities"
                    color="#2dd4bf"
                    delay="1.05s"
                    floatClass="float-c"
                  />
                </div>
              </div>

              {/* wave + stats */}
              <div
                className="flex items-center gap-8 fade-in"
                style={{ animationDelay: '1.1s' }}
              >
                <WaveBars />
                {[
                  { v: '10K+', l: 'Jobs', c: '#14b8a6' },
                  { v: '500+', l: 'Companies', c: '#06b6d4' },
                  { v: '95%', l: 'Match Rate', c: '#2dd4bf' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="text-center count-up"
                    style={{ animationDelay: `${1.2 + i * 0.12}s` }}
                  >
                    <div className="text-lg font-black tabular-nums" style={{ color: s.c }}>
                      {s.v}
                    </div>
                    <div className="text-[9px] text-gray-600 uppercase tracking-[.12em] font-bold">
                      {s.l}
                    </div>
                  </div>
                ))}
                <WaveBars />
              </div>

              {/* connection lines (decorative) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[.06]" aria-hidden>
                <line x1="20%" y1="25%" x2="50%" y2="50%" stroke="#14b8a6" strokeWidth="1" />
                <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="#06b6d4" strokeWidth="1" />
                <line x1="25%" y1="80%" x2="50%" y2="50%" stroke="#2dd4bf" strokeWidth="1" />
              </svg>
            </div>

            {/* ════════════════════════════
               RIGHT  PANEL  (form)
               ════════════════════════════ */}
            <div className="w-full max-w-[420px] mx-auto lg:mx-0 lg:shrink-0">
              <div
                className={`glass scan shim rounded-2xl overflow-hidden relative transition-all duration-700
                  ${mounted ? 'slide-up' : 'opacity-0'}`}
                style={{ animationDelay: '.05s' }}
              >
                {/* aurora top */}
                <div
                  className="h-[3px] rounded-t-2xl"
                  style={{
                    background: 'linear-gradient(90deg,#14b8a6,#06b6d4,#2dd4bf,#14b8a6)',
                    backgroundSize: '300% 100%',
                    animation: 'aurora 4s ease infinite',
                  }}
                />

                {/* corner markers */}
                {[
                  'top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl',
                  'top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl',
                  'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl',
                  'bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl',
                ].map((cls, i) => (
                  <div
                    key={i}
                    className={`absolute w-5 h-5 border-[#14b8a6]/20 pointer-events-none ${cls}`}
                  />
                ))}

                <div className="p-7 sm:p-8 relative z-10">
                  {/* ── header ── */}
                  <div className="text-center mb-7">
                    <div
                      className="relative w-14 h-14 mx-auto mb-4 icon-pop"
                      style={{ animationDelay: '.2s' }}
                    >
                      {/* glow behind */}
                      <div
                        className="absolute inset-0 rounded-2xl bg-[#14b8a6]/15 blur-xl"
                        style={{ animation: 'glowPulse 3s ease-in-out infinite' }}
                      />
                      <div className="relative w-full h-full bg-[#14b8a6]/[.08] border border-[#14b8a6]/20 rounded-2xl flex items-center justify-center border-pulse">
                        <LogIn size={24} className="text-[#2dd4bf]" />
                      </div>
                      {/* tiny orbiting dot */}
                      <div
                        className="absolute inset-[-8px]"
                        style={{ animation: 'spinCW 6s linear infinite' }}
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#14b8a6] shadow-lg shadow-[#14b8a6]/40" />
                      </div>
                    </div>

                    <h1
                      className="text-2xl font-bold text-white slide-up"
                      style={{ animationDelay: '.25s' }}
                    >
                      Welcome back
                    </h1>
                    <p
                      className="text-gray-500 text-sm mt-1.5 slide-up"
                      style={{ animationDelay: '.3s' }}
                    >
                      Sign in to your{' '}
                      <span className="text-[#2dd4bf] font-medium">CareerPath</span> account
                    </p>
                  </div>

                  {/* ── toggle ── */}
                  <div
                    className="relative mb-6 flex p-1 bg-[#071015]/50 rounded-xl border border-[#1e3a42]/40 slide-up"
                    style={{ animationDelay: '.35s' }}
                  >
                    {/* sliding indicator */}
                    <div
                      className="absolute top-1 bottom-1 rounded-lg pointer-events-none transition-all duration-500"
                      style={{
                        width: 'calc(50% - 4px)',
                        left: loginType === 'user' ? 4 : 'calc(50%)',
                        background: 'linear-gradient(135deg, rgba(20,184,166,.12), rgba(6,182,212,.08))',
                        border: '1px solid rgba(20,184,166,.22)',
                        boxShadow: '0 0 18px -4px rgba(20,184,166,.12)',
                      }}
                    />

                    {[
                      { key: 'user', label: 'User Login', Icon: Users },
                      { key: 'admin', label: 'Admin Login', Icon: Shield },
                    ].map(({ key, label, Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setLoginType(key)}
                        className={`relative z-10 flex-1 py-2.5 rounded-lg text-sm font-semibold
                          flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer
                          ${
                            loginType === key
                              ? 'text-[#2dd4bf]'
                              : 'text-gray-500 hover:text-gray-300'
                          }`}
                      >
                        <Icon
                          size={15}
                          className="transition-transform duration-300"
                          style={{
                            transform: loginType === key ? 'scale(1.15)' : 'scale(1)',
                          }}
                        />
                        {label}
                        {loginType === key && (
                          <div className="w-1 h-1 rounded-full bg-[#14b8a6] animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* ── admin creds ── */}
                  <div
                    className="transition-all duration-500 overflow-hidden"
                    style={{
                      maxHeight: loginType === 'admin' ? 120 : 0,
                      opacity: loginType === 'admin' ? 1 : 0,
                      marginBottom: loginType === 'admin' ? 20 : 0,
                    }}
                  >
                    <div className="p-3.5 bg-[#14b8a6]/[.06] border border-[#14b8a6]/15 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={12} className="text-[#14b8a6]" />
                        <p className="text-[#2dd4bf] text-[11px] font-bold uppercase tracking-wider">
                          Demo Credentials
                        </p>
                      </div>
                      <p className="text-gray-400 text-xs">
                        Email:{' '}
                        <span className="font-mono text-[#14b8a6] bg-[#14b8a6]/[.08] px-1.5 py-0.5 rounded">
                          admin123@gmail.com
                        </span>
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Password:{' '}
                        <span className="font-mono text-[#14b8a6] bg-[#14b8a6]/[.08] px-1.5 py-0.5 rounded">
                          123456
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* ── error ── */}
                  {error && (
                    <div className="mb-5 p-3.5 bg-red-500/[.07] border border-red-500/20 rounded-xl flex items-center gap-2.5 err-shake">
                      <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* ── email hint ── */}
                  {emailHint && (
                    <div className="mb-5 p-3.5 bg-amber-500/[.07] border border-amber-500/20 rounded-xl flex items-center justify-between gap-2 scale-in">
                      <p className="text-amber-300 text-sm">{emailHint}</p>
                      <button
                        type="button"
                        onClick={() => setEmail((p) => p.replace('@gamil.com', '@gmail.com'))}
                        className="text-xs font-bold text-amber-200 hover:text-white transition-colors
                                   px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer"
                      >
                        Fix
                      </button>
                    </div>
                  )}

                  {/* ── form ── */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <FloatingInput
                      icon={Mail}
                      label="Email address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      delay=".45s"
                      required
                    />

                    <FloatingInput
                      icon={Lock}
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      delay=".55s"
                      required
                    >
                      {/* eye toggle */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center
                                   justify-center rounded-lg text-gray-600 hover:text-[#14b8a6]
                                   hover:bg-[#14b8a6]/[.06] transition-all duration-300 cursor-pointer z-10"
                        style={{
                          transform: `translateY(-50%) rotate(${showPassword ? '180deg' : '0deg'})`,
                          transition: 'transform .35s cubic-bezier(.16,1,.3,1), color .3s, background .3s',
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </FloatingInput>

                    {/* ── password strength hint (visual only) ── */}
                    <div
                      className="flex gap-1.5 slide-up"
                      style={{ animationDelay: '.6s' }}
                    >
                      {[0, 1, 2, 3].map((i) => {
                        const filled =
                          password.length > 0 &&
                          (i === 0
                            ? password.length >= 1
                            : i === 1
                              ? password.length >= 4
                              : i === 2
                                ? password.length >= 6
                                : password.length >= 8);
                        return (
                          <div
                            key={i}
                            className="flex-1 h-[3px] rounded-full transition-all duration-500"
                            style={{
                              background: filled
                                ? i < 2
                                  ? '#f59e0b'
                                  : i < 3
                                    ? '#14b8a6'
                                    : '#10b981'
                                : 'rgba(30,58,66,.3)',
                              boxShadow: filled
                                ? `0 0 8px ${i < 2 ? '#f59e0b' : i < 3 ? '#14b8a6' : '#10b981'}25`
                                : 'none',
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* ── submit ── */}
                    <div className="slide-up" style={{ animationDelay: '.65s' }}>
                      <RippleBtn
                        type="submit"
                        disabled={loading}
                        className={`shim w-full py-3.5 rounded-xl text-white font-semibold text-sm
                          flex items-center justify-center gap-2.5 cursor-pointer
                          transition-all duration-300
                          ${
                            loading
                              ? 'bg-[#14b8a6]/50 cursor-wait'
                              : 'bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#14b8a6] hover:shadow-xl hover:shadow-[#14b8a6]/20 hover:scale-[1.02] active:scale-[0.98]'
                          }
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {loading ? (
                          <>
                            <div className="relative w-5 h-5">
                              <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
                              <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin" />
                            </div>
                            <span>Authenticating</span>
                            <span className="flex gap-0.5">
                              {[0, 1, 2].map((d) => (
                                <span
                                  key={d}
                                  className="w-1 h-1 rounded-full bg-white/60"
                                  style={{
                                    animation: `fadeIn .5s ease infinite alternate`,
                                    animationDelay: `${d * 0.15}s`,
                                  }}
                                />
                              ))}
                            </span>
                          </>
                        ) : (
                          <>
                            {loginType === 'admin' ? (
                              <>
                                <Shield size={16} /> Admin Sign In
                              </>
                            ) : (
                              <>
                                Sign In <ArrowRight size={16} />
                              </>
                            )}
                          </>
                        )}
                      </RippleBtn>
                    </div>
                  </form>

                  {/* ── security strip ── */}
                  <div
                    className="mt-6 pt-5 border-t border-[#1e3a42]/25 slide-up"
                    style={{ animationDelay: '.75s' }}
                  >
                    <div className="flex items-center justify-center gap-5 flex-wrap">
                      {[
                        { icon: ShieldCheck, label: '256-bit SSL' },
                        { icon: Fingerprint, label: 'Secure Auth' },
                        { icon: Activity, label: '99.9% Uptime' },
                        { icon: Zap, label: 'Fast Login' },
                      ].map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 group cursor-default fade-in"
                          style={{ animationDelay: `${0.85 + i * 0.08}s` }}
                        >
                          <f.icon
                            size={11}
                            className="text-[#14b8a6]/30 group-hover:text-[#14b8a6]/70 transition-colors duration-300"
                          />
                          <span className="text-[10px] text-gray-600 font-medium group-hover:text-gray-400 transition-colors duration-300">
                            {f.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── register link ── */}
                  {loginType === 'user' && (
                    <div
                      className="mt-5 pt-5 border-t border-[#1e3a42]/25 text-center slide-up"
                      style={{ animationDelay: '.85s' }}
                    >
                      <p className="text-gray-500 text-sm">
                        Don&apos;t have an account?{' '}
                        <Link
                          to="/register"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.assign('/register');
                          }}
                          className="relative text-[#2dd4bf] hover:text-[#14b8a6] font-semibold
                                     transition-colors duration-300 group/link"
                        >
                          Create one
                          <span
                            className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#14b8a6]
                                       group-hover/link:w-full transition-all duration-300"
                          />
                          <ArrowUpRight
                            size={13}
                            className="inline ml-0.5 opacity-0 group-hover/link:opacity-100
                                       transition-all duration-200 -translate-y-0.5"
                          />
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* card reflection glow */}
              <div
                className="w-3/4 h-20 mx-auto -mt-1 rounded-b-3xl opacity-30 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(20,184,166,.08) 0%, transparent 70%)',
                  filter: 'blur(16px)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}