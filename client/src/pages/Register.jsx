import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail, Lock, Eye, EyeOff, User, UserPlus, ArrowRight, Camera, X,
  Loader2, Sparkles, Shield, CheckCircle, ChevronRight, ArrowLeft,
  Zap, Globe, Award, TrendingUp, Layers, Fingerprint, Activity,
  ShieldCheck, Image, Upload, Star, Target, Code2, Briefcase,
  ArrowUpRight, Check, AlertCircle, KeyRound, Heart
} from 'lucide-react';
import api from '../utils/api';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ─── typewriter ─── */
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
          await sleep(55 + Math.random() * 40);
        }
        await sleep(2400);
        for (let c = w.length; c >= 0 && on; c--) {
          setText(w.slice(0, c));
          await sleep(28);
        }
        await sleep(400);
        i++;
      }
    })();
    return () => { on = false; };
  }, []);
  return text;
}

/* ─── particles ─── */
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  sz: 1.5 + Math.random() * 3,
  x: Math.random() * 100,
  y: Math.random() * 100,
  dur: 16 + Math.random() * 24,
  del: -(Math.random() * 20),
  o: 0.05 + Math.random() * 0.16,
}));

/* ─── constellation nodes ─── */
const NODES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: 15 + Math.random() * 70,
  y: 10 + Math.random() * 80,
  sz: 2 + Math.random() * 3,
  dur: 8 + Math.random() * 12,
  del: Math.random() * -6,
}));

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
  [0, 3], [1, 5], [2, 6], [4, 7],
];

/* ─── styles ─── */
const Styles = () => (
  <style>{`
    @keyframes morphA{0%,100%{border-radius:42% 58% 70% 30%/45% 45% 55% 55%;transform:rotate(0) scale(1)}33%{border-radius:70% 30% 50% 50%/30% 60% 40% 70%;transform:rotate(120deg) scale(1.06)}66%{border-radius:30% 70% 40% 60%/55% 30% 70% 45%;transform:rotate(240deg) scale(.94)}}
    @keyframes morphB{0%,100%{border-radius:58% 42% 30% 70%/55% 45% 55% 45%;transform:scale(1)}50%{border-radius:40% 60% 60% 40%/60% 30% 70% 40%;transform:scale(1.08)}}
    @keyframes pFloat{0%,100%{transform:translate(0,0)}25%{transform:translate(20px,-45px)}50%{transform:translate(-18px,-75px)}75%{transform:translate(30px,-25px)}}
    @keyframes spinCW{to{transform:rotate(360deg)}}
    @keyframes spinCCW{to{transform:rotate(-360deg)}}
    @keyframes pulseRing{0%{transform:scale(.85);opacity:.55}100%{transform:scale(2.8);opacity:0}}
    @keyframes glowPulse{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:.55;transform:scale(1.12)}}
    @keyframes aurora{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes slideUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideLeft{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideInLeft{from{opacity:0;transform:translateX(-50px) rotate(-2deg)}to{opacity:1;transform:translateX(0) rotate(0)}}
    @keyframes slideInRight{from{opacity:0;transform:translateX(50px) rotate(2deg)}to{opacity:1;transform:translateX(0) rotate(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes scaleIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
    @keyframes countUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes shimmer{0%{left:-100%}50%,100%{left:100%}}
    @keyframes ripple{to{transform:scale(2.5);opacity:0}}
    @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes floatB{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-9px) rotate(2deg)}}
    @keyframes floatC{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-7px) rotate(-1.5deg)}}
    @keyframes scanDown{0%{top:-5%}100%{top:105%}}
    @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
    @keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes borderPulse{0%,100%{border-color:rgba(20,184,166,.12)}50%{border-color:rgba(20,184,166,.32)}}
    @keyframes iconPop{0%{transform:scale(0) rotate(-45deg)}60%{transform:scale(1.15) rotate(5deg)}100%{transform:scale(1) rotate(0)}}
    @keyframes orbGlow{0%,100%{box-shadow:0 0 8px rgba(20,184,166,.15)}50%{box-shadow:0 0 22px rgba(20,184,166,.35)}}
    @keyframes waveBar{0%,100%{height:12px}50%{height:28px}}
    @keyframes nodeFloat{0%,100%{transform:translate(0,0)}50%{transform:translate(var(--dx,8px),var(--dy,-12px))}}
    @keyframes linePulse{0%,100%{opacity:.04}50%{opacity:.12}}
    @keyframes confettiBurst{0%{transform:translateY(0) rotate(0) scale(1);opacity:1}100%{transform:translateY(-60px) rotate(360deg) scale(0);opacity:0}}
    @keyframes successScale{0%{transform:scale(0) rotate(-180deg)}60%{transform:scale(1.2) rotate(10deg)}100%{transform:scale(1) rotate(0)}}
    @keyframes checkDraw{from{stroke-dashoffset:24}to{stroke-dashoffset:0}}
    @keyframes breathe{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.08);opacity:1}}
    @keyframes avatarReveal{0%{transform:scale(.5) rotate(-10deg);opacity:0}60%{transform:scale(1.1) rotate(3deg)}100%{transform:scale(1) rotate(0);opacity:1}}
    @keyframes dropZonePulse{0%,100%{border-color:rgba(20,184,166,.15);background:rgba(20,184,166,.02)}50%{border-color:rgba(20,184,166,.35);background:rgba(20,184,166,.06)}}
    @keyframes stepComplete{0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
    @keyframes progressFill{from{width:0%}}
    @keyframes slideOutLeft{to{opacity:0;transform:translateX(-60px) scale(.95)}}
    @keyframes slideOutRight{to{opacity:0;transform:translateX(60px) scale(.95)}}

    .slide-up{animation:slideUp .7s cubic-bezier(.16,1,.3,1) both}
    .slide-down{animation:slideDown .6s cubic-bezier(.16,1,.3,1) both}
    .slide-left{animation:slideLeft .6s cubic-bezier(.16,1,.3,1) both}
    .slide-in-left{animation:slideInLeft .7s cubic-bezier(.16,1,.3,1) both}
    .slide-in-right{animation:slideInRight .7s cubic-bezier(.16,1,.3,1) both}
    .fade-in{animation:fadeIn .6s ease both}
    .scale-in{animation:scaleIn .5s cubic-bezier(.16,1,.3,1) both}
    .count-up{animation:countUp .6s cubic-bezier(.16,1,.3,1) both}
    .icon-pop{animation:iconPop .6s cubic-bezier(.34,1.56,.64,1) both}
    .err-shake{animation:shake .45s ease}

    .gradient-text{
      background:linear-gradient(135deg,#06b6d4,#14b8a6,#2dd4bf,#06b6d4);
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
      background:linear-gradient(90deg,transparent,rgba(6,182,212,.1),transparent);
      animation:scanDown 7s linear infinite;pointer-events:none;
    }
    .shim{position:relative;overflow:hidden}
    .shim::after{
      content:'';position:absolute;top:0;left:-100%;width:55%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent);
      animation:shimmer 3.5s ease-in-out infinite;
    }
    .dot-bg{
      background-image:radial-gradient(rgba(6,182,212,.05) 1px,transparent 1px);
      background-size:26px 26px;
    }
    .inp-glow{transition:all .35s cubic-bezier(.16,1,.3,1)}
    .inp-glow:focus-within{
      border-color:rgba(6,182,212,.45)!important;
      box-shadow:0 0 0 3px rgba(6,182,212,.07),0 0 24px -6px rgba(6,182,212,.18);
    }
    .float-a{animation:floatA 5.5s ease-in-out infinite}
    .float-b{animation:floatB 4.8s ease-in-out infinite}
    .float-c{animation:floatC 6.2s ease-in-out infinite}
    .border-pulse{animation:borderPulse 3s ease-in-out infinite}
    .orb-glow{animation:orbGlow 2.5s ease-in-out infinite}
    .breathe{animation:breathe 3s ease-in-out infinite}

    .ripple-wrap{position:relative;overflow:hidden}
    .rip{
      position:absolute;border-radius:50%;
      background:rgba(255,255,255,.22);
      transform:scale(0);animation:ripple .55s ease-out;
      pointer-events:none;
    }

    .avatar-reveal{animation:avatarReveal .6s cubic-bezier(.34,1.56,.64,1) both}
    .drop-zone-pulse{animation:dropZonePulse 2s ease-in-out infinite}
    .step-complete{animation:stepComplete .4s cubic-bezier(.34,1.56,.64,1)}
    .progress-fill{animation:progressFill 1s cubic-bezier(.16,1,.3,1) both}
    .success-scale{animation:successScale .7s cubic-bezier(.34,1.56,.64,1) both}

    @media(max-width:1023px){.hide-mobile{display:none!important}}

    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#1e3a42;border-radius:10px}
  `}</style>
);

/* ─── Floating input ─── */
function FloatingInput({ icon: Icon, label, type = 'text', value, onChange, delay = '0s', children, error: fieldError, success, ...rest }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const borderColor = fieldError ? 'border-red-500/40' : success ? 'border-emerald-500/30' : active ? 'border-[#06b6d4]/35' : 'border-[#1e3a42]/60 hover:border-[#1e3a42]';

  return (
    <div className="slide-up" style={{ animationDelay: delay }}>
      <div className={`relative inp-glow rounded-xl border transition-colors duration-300 ${borderColor}`}>
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 z-10 ${fieldError ? 'text-red-400' : success ? 'text-emerald-400' : active ? 'text-[#06b6d4]' : 'text-gray-600'}`}
          style={{ transform: active ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%) scale(1)' }}>
          <Icon size={16} />
        </div>
        <input type={type} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder=" "
          className="peer w-full pl-11 pr-4 py-4 pt-7 pb-2 bg-[#071015]/60 rounded-xl text-white text-sm focus:outline-none transition-colors duration-300"
          {...rest} />
        <label className={`absolute left-11 pointer-events-none transition-all duration-300
          ${active ? 'top-[10px] text-[10px] font-bold uppercase tracking-[.15em]' : 'top-1/2 -translate-y-1/2 text-[13px] font-normal tracking-normal'}
          ${fieldError ? 'text-red-400' : success ? 'text-emerald-400' : active ? 'text-[#06b6d4]' : 'text-gray-600'}`}>
          {label}
        </label>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-500"
          style={{ width: focused ? '88%' : '0%', opacity: focused ? 1 : 0,
            background: fieldError ? 'linear-gradient(90deg,transparent,#ef4444,transparent)' : 'linear-gradient(90deg,transparent,#06b6d4,#14b8a6,transparent)' }} />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-400"
          style={{ height: active ? '55%' : '0%', opacity: active ? 1 : 0,
            background: fieldError ? '#ef4444' : success ? '#10b981' : 'linear-gradient(180deg,#06b6d4,#14b8a6)' }} />
        {success && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 scale-in z-10">
            <CheckCircle size={16} className="text-emerald-400" />
          </div>
        )}
        {children}
      </div>
      {fieldError && (
        <p className="text-red-400 text-[11px] mt-1.5 ml-1 flex items-center gap-1 fade-in">
          <AlertCircle size={11} /> {fieldError}
        </p>
      )}
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

/* ─── Password strength ─── */
function PasswordStrength({ password }) {
  const checks = useMemo(() => ({
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }), [password]);

  const score = Object.values(checks).filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef4444', '#f59e0b', '#14b8a6', '#10b981'];

  if (!password) return null;

  return (
    <div className="scale-in">
      <div className="flex gap-1.5 mb-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full transition-all duration-500"
            style={{
              background: i < score ? colors[score] : 'rgba(30,58,66,.3)',
              boxShadow: i < score ? `0 0 8px ${colors[score]}25` : 'none',
            }} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider transition-colors duration-300"
          style={{ color: colors[score] }}>{labels[score]}</span>
        <div className="flex gap-3">
          {[
            { label: '6+ chars', ok: checks.length },
            { label: 'A-Z', ok: checks.upper },
            { label: '0-9', ok: checks.number },
            { label: '!@#', ok: checks.special },
          ].map((c, i) => (
            <span key={i} className={`text-[9px] font-medium transition-all duration-300 flex items-center gap-0.5
              ${c.ok ? 'text-emerald-400' : 'text-gray-600'}`}>
              {c.ok && <Check size={8} />} {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Avatar upload ─── */
function AvatarUpload({ preview, onFileSelect, onRemove, fileInputRef }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect({ target: { files: [file] } });
    }
  }, [onFileSelect]);

  return (
    <div className="flex flex-col items-center slide-up" style={{ animationDelay: '.3s' }}>
      <div className="relative group">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center
            cursor-pointer transition-all duration-400 overflow-hidden
            ${dragOver ? 'border-[#06b6d4]/60 bg-[#06b6d4]/10 scale-105' :
              preview ? 'border-[#14b8a6]/30 bg-transparent' :
              'border-[#1e3a42]/40 hover:border-[#06b6d4]/40 bg-[#071015]/60 drop-zone-pulse'}`}
        >
          {preview ? (
            <img src={preview} alt="Avatar" className="w-full h-full object-cover avatar-reveal" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 transition-transform duration-300 group-hover:scale-110">
              <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 flex items-center justify-center">
                <Camera size={18} className={`transition-colors duration-300 ${dragOver ? 'text-[#06b6d4]' : 'text-gray-600 group-hover:text-[#06b6d4]'}`} />
              </div>
            </div>
          )}

          {/* hover overlay */}
          {preview && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Upload size={20} className="text-white" />
            </div>
          )}

          {/* corner sparkles on hover */}
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles size={10} className="text-[#06b6d4]/50" />
          </div>
        </div>

        {preview && (
          <button type="button" onClick={onRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500/90 hover:bg-red-500 rounded-full
              flex items-center justify-center transition-all duration-200 scale-in
              hover:scale-110 hover:rotate-90 shadow-lg shadow-red-500/20 cursor-pointer z-10">
            <X size={11} className="text-white" />
          </button>
        )}

        {/* orbiting dot */}
        {!preview && (
          <div className="absolute inset-[-6px] pointer-events-none" style={{ animation: 'spinCW 8s linear infinite' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#06b6d4]/40" />
          </div>
        )}
      </div>

      <div className="mt-2.5 text-center">
        <p className="text-[11px] text-gray-500 font-medium">
          {preview ? 'Photo ready!' : 'Drag or click to upload'}
        </p>
        <p className="text-[9px] text-gray-600 mt-0.5">Optional • Max 5MB</p>
      </div>

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
        onChange={onFileSelect} className="hidden" />
    </div>
  );
}

/* ─── Step indicator ─── */
function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6 slide-down" style={{ animationDelay: '.15s' }}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold
              transition-all duration-500 ${isDone ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 step-complete'
                : isActive ? 'bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] border-pulse'
                : 'bg-[#071015]/60 border border-[#1e3a42]/30 text-gray-600'}`}>
              {isDone ? <Check size={14} /> : step}
              {isActive && (
                <div className="absolute inset-0 rounded-xl border border-[#06b6d4]/20" style={{ animation: 'pulseRing 2s ease-out infinite' }} />
              )}
            </div>
            {i < totalSteps - 1 && (
              <div className="w-8 h-[2px] rounded-full overflow-hidden bg-[#1e3a42]/30">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: isDone ? '100%' : isActive ? '50%' : '0%',
                    background: isDone ? '#10b981' : 'linear-gradient(90deg, #06b6d4, #14b8a6)',
                  }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Constellation background (left panel) ─── */
function Constellation() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      {CONNECTIONS.map(([a, b], i) => (
        <line key={i}
          x1={`${NODES[a].x}%`} y1={`${NODES[a].y}%`}
          x2={`${NODES[b].x}%`} y2={`${NODES[b].y}%`}
          stroke="#14b8a6" strokeWidth="0.5"
          style={{ animation: `linePulse ${3 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
        />
      ))}
      {NODES.map((n) => (
        <circle key={n.id} cx={`${n.x}%`} cy={`${n.y}%`} r={n.sz} fill="#06b6d4"
          style={{
            opacity: 0.15 + Math.random() * 0.2,
            animation: `nodeFloat ${n.dur}s ease-in-out infinite`,
            animationDelay: `${n.del}s`,
            '--dx': `${(Math.random() - 0.5) * 20}px`,
            '--dy': `${(Math.random() - 0.5) * 20}px`,
          }} />
      ))}
    </svg>
  );
}

/* ─── Feature chip ─── */
function FeatureChip({ icon: Ic, title, desc, color, delay, floatClass }) {
  return (
    <div className={`slide-in-left ${floatClass}`} style={{ animationDelay: delay }}>
      <div className="bg-[#0A1A22]/80 backdrop-blur-md border border-[#1e3a42]/30 rounded-xl px-4 py-3 shadow-lg shadow-black/10 hover:border-[#06b6d4]/20 transition-colors duration-300 group cursor-default">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            style={{ background: `${color}12` }}>
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

/* ─── Wave bars ─── */
function WaveBars() {
  return (
    <div className="flex items-end gap-[3px] h-7 opacity-40">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="w-[3px] rounded-full bg-[#06b6d4]"
          style={{ animation: `waveBar ${0.8 + i * 0.12}s ease-in-out infinite`,
            animationDelay: `${i * 0.09}s`, opacity: 0.3 + (i % 3) * 0.2 }} />
      ))}
    </div>
  );
}

/* ─── Hexagon grid (decorative) ─── */
function HexGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[.04] overflow-hidden">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
            <polygon points="28,2 52,14 52,34 28,46 4,34 4,14" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN REGISTER COMPONENT
   ═══════════════════════════════════════ */
export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [emailHint, setEmailHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [stepDirection, setStepDirection] = useState('forward');
  const [fieldErrors, setFieldErrors] = useState({});
  const fileInputRef = useRef(null);
  const { register, updateUser } = useAuth();

  useEffect(() => { setMounted(true); }, []);

  const typewriterWords = useMemo(
    () => ['Build your professional profile', 'Get matched with dream jobs', 'Start your career journey today'],
    [],
  );
  const typed = useTypewriter(typewriterWords);

  const totalSteps = 3;

  /* ── validation ── */
  const validateStep1 = () => {
    const errs = {};
    if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!email.includes('@') || !email.includes('.')) errs.email = 'Please enter a valid email';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (password.length < 6) errs.password = 'At least 6 characters required';
    if (password !== confirmPassword) errs.confirm = 'Passwords do not match';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    setError('');
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStepDirection('forward');
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => {
    setStepDirection('backward');
    setFieldErrors({});
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

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
    return d?.message || 'Registration failed. Please try again.';
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailHint('');
    setLoading(true);
    const norm = normalizeEmailInput(email);

    if (norm.includes('@gamil.com')) setEmailHint('Did you mean gmail.com?');

    try {
      const userData = await register(name, norm, password);

      if (avatar && userData?.id) {
        setUploadingAvatar(true);
        try {
          const formData = new FormData();
          formData.append('avatar', avatar);
          formData.append('user_id', userData.id);
          const avatarRes = await api.post('/upload-avatar', formData);
          if (avatarRes.data?.user) updateUser(avatarRes.data.user);
        } catch {
          console.error('Avatar upload failed');
        } finally {
          setUploadingAvatar(false);
        }
      }

      window.location.assign('/dashboard');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const stepAnimClass = stepDirection === 'forward' ? 'slide-up' : 'slide-up';

  /* ═══════════ JSX ═══════════ */
  return (
    <>
      <Styles />

      <div className="min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#050D11 0%,#0A1A22 45%,#071218 100%)' }}>

        {/* ── fullscreen upload overlay ── */}
        {uploadingAvatar && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center fade-in">
            <div className="glass rounded-2xl p-10 flex flex-col items-center gap-5 scale-in shadow-2xl shadow-[#06b6d4]/10">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-[3px] border-[#1e3a42] border-t-[#06b6d4] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera size={22} className="text-[#06b6d4]" />
                </div>
                <div className="absolute inset-[-8px] rounded-full border border-[#06b6d4]/10"
                  style={{ animation: 'pulseRing 2s ease-out infinite' }} />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-sm mb-1">Uploading your photo...</p>
                <p className="text-gray-500 text-xs">Almost there</p>
              </div>
              <div className="w-40 h-1.5 bg-[#1e3a42]/50 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#06b6d4] to-[#14b8a6]"
                  style={{ animation: 'shimmer 1.5s ease-in-out infinite', width: '70%' }} />
              </div>
            </div>
          </div>
        )}

        {/* ── BG layer ── */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-[15%] -right-[8%] w-[480px] h-[480px] bg-[#06b6d4]/[.035]"
            style={{ animation: 'morphA 16s ease-in-out infinite' }} />
          <div className="absolute -bottom-[10%] -left-[12%] w-[520px] h-[520px] bg-[#14b8a6]/[.03]"
            style={{ animation: 'morphB 20s ease-in-out infinite' }} />
          <div className="dot-bg absolute inset-0 opacity-50" />
          {PARTICLES.map((p) => (
            <div key={p.id} className="absolute rounded-full bg-[#06b6d4]"
              style={{ width: p.sz, height: p.sz, left: `${p.x}%`, top: `${p.y}%`, opacity: p.o,
                animation: `pFloat ${p.dur}s ease-in-out infinite`, animationDelay: `${p.del}s` }} />
          ))}
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16 sm:px-6">
          <div className="w-full max-w-[1100px] mx-auto flex items-center gap-16">

            {/* ════════════════════════════
               LEFT PANEL (lg+)
               ════════════════════════════ */}
            <div className="hide-mobile flex-1 flex flex-col items-center justify-center relative">
              <Constellation />
              <HexGrid />

              {/* badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#06b6d4]/[.07] border border-[#06b6d4]/15 mb-6 slide-down relative z-10"
                style={{ animationDelay: '.15s' }}>
                <UserPlus size={13} className="text-[#06b6d4]" />
                <span className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-[.2em]">Create Account</span>
              </div>

              {/* heading */}
              <h2 className="text-3xl xl:text-4xl font-black text-white text-center leading-tight mb-2 slide-down relative z-10"
                style={{ animationDelay: '.25s' }}>
                Join the<br /><span className="gradient-text">CareerPath</span><br />Community
              </h2>

              {/* typewriter */}
              <div className="h-6 flex items-center justify-center mb-10 fade-in relative z-10" style={{ animationDelay: '.4s' }}>
                <span className="text-sm text-gray-500">{typed}</span>
                <span className="inline-block w-[2px] h-4 bg-[#06b6d4] ml-0.5 rounded-full"
                  style={{ animation: 'cursorBlink 1s step-end infinite' }} />
              </div>

              {/* journey visual */}
              <div className="relative w-full max-w-[340px] mb-10 scale-in z-10" style={{ animationDelay: '.5s' }}>
                <div className="flex items-center justify-between relative">
                  {/* connecting line */}
                  <div className="absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-[#1e3a42]/30 -translate-y-1/2">
                    <div className="h-full bg-gradient-to-r from-[#06b6d4] via-[#14b8a6] to-[#2dd4bf] progress-fill rounded-full"
                      style={{ animationDelay: '.8s' }} />
                  </div>
                  {[
                    { icon: UserPlus, label: 'Sign Up', color: '#06b6d4', active: true },
                    { icon: Layers, label: 'Profile', color: '#14b8a6', active: step >= 2 },
                    { icon: Award, label: 'Match', color: '#2dd4bf', active: step >= 3 },
                  ].map((n, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 relative z-10 count-up"
                      style={{ animationDelay: `${0.7 + i * 0.15}s` }}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500
                        ${n.active ? 'border-2 shadow-lg' : 'bg-[#0A1A22] border border-[#1e3a42]/40'}`}
                        style={n.active ? { borderColor: `${n.color}40`, background: `${n.color}10`,
                          boxShadow: `0 0 20px ${n.color}15` } : {}}>
                        <n.icon size={18} style={{ color: n.active ? n.color : '#4a5568' }}
                          className="transition-colors duration-500" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500
                        ${n.active ? '' : 'text-gray-600'}`}
                        style={n.active ? { color: n.color } : {}}>{n.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* floating features */}
              <div className="relative w-full max-w-[380px] h-[120px] z-10">
                <div className="absolute top-0 left-0">
                  <FeatureChip icon={TrendingUp} title="Smart Matching" desc="AI-powered results" color="#06b6d4" delay=".85s" floatClass="float-a" />
                </div>
                <div className="absolute top-2 right-0">
                  <FeatureChip icon={Shield} title="Secure Data" desc="Enterprise-grade security" color="#14b8a6" delay="1s" floatClass="float-b" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <FeatureChip icon={Globe} title="10K+ Jobs" desc="Updated daily" color="#2dd4bf" delay="1.15s" floatClass="float-c" />
                </div>
              </div>

              {/* stats */}
              <div className="flex items-center gap-8 fade-in relative z-10 mt-6" style={{ animationDelay: '1.2s' }}>
                <WaveBars />
                {[
                  { v: '50K+', l: 'Users', c: '#06b6d4' },
                  { v: '10K+', l: 'Jobs', c: '#14b8a6' },
                  { v: '95%', l: 'Success', c: '#2dd4bf' },
                ].map((s, i) => (
                  <div key={i} className="text-center count-up" style={{ animationDelay: `${1.3 + i * 0.12}s` }}>
                    <div className="text-lg font-black tabular-nums" style={{ color: s.c }}>{s.v}</div>
                    <div className="text-[9px] text-gray-600 uppercase tracking-[.12em] font-bold">{s.l}</div>
                  </div>
                ))}
                <WaveBars />
              </div>
            </div>

            {/* ════════════════════════════
               RIGHT PANEL (form)
               ════════════════════════════ */}
            <div className="w-full max-w-[440px] mx-auto lg:mx-0 lg:shrink-0">
              <div className={`glass scan shim rounded-2xl overflow-hidden relative transition-all duration-700
                ${mounted ? 'slide-up' : 'opacity-0'}`} style={{ animationDelay: '.05s' }}>

                {/* aurora top */}
                <div className="h-[3px] rounded-t-2xl"
                  style={{ background: 'linear-gradient(90deg,#06b6d4,#14b8a6,#2dd4bf,#06b6d4)',
                    backgroundSize: '300% 100%', animation: 'aurora 4s ease infinite' }} />

                {/* corner markers */}
                {['top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl',
                  'top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl',
                  'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl',
                  'bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl',
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-5 h-5 border-[#06b6d4]/20 pointer-events-none ${cls}`} />
                ))}

                <div className="p-7 sm:p-8 relative z-10">

                  {/* ── header ── */}
                  <div className="text-center mb-5">
                    <div className="relative w-14 h-14 mx-auto mb-4 icon-pop" style={{ animationDelay: '.2s' }}>
                      <div className="absolute inset-0 rounded-2xl bg-[#06b6d4]/15 blur-xl"
                        style={{ animation: 'glowPulse 3s ease-in-out infinite' }} />
                      <div className="relative w-full h-full bg-[#06b6d4]/[.08] border border-[#06b6d4]/20 rounded-2xl flex items-center justify-center border-pulse">
                        <UserPlus size={24} className="text-[#06b6d4]" />
                      </div>
                      <div className="absolute inset-[-8px]" style={{ animation: 'spinCW 6s linear infinite' }}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#06b6d4] shadow-lg shadow-[#06b6d4]/40" />
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white slide-up" style={{ animationDelay: '.25s' }}>
                      Create account
                    </h1>
                    <p className="text-gray-500 text-sm mt-1.5 slide-up" style={{ animationDelay: '.3s' }}>
                      Start your journey with <span className="text-[#2dd4bf] font-medium">CareerPath</span>
                    </p>
                  </div>

                  {/* ── step indicator ── */}
                  <StepIndicator currentStep={step} totalSteps={totalSteps} />

                  {/* ── step labels ── */}
                  <div className="text-center mb-5 fade-in" style={{ animationDelay: '.2s' }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06b6d4]/[.06] border border-[#06b6d4]/15">
                      <div className="w-1 h-1 rounded-full bg-[#06b6d4] animate-pulse" />
                      <span className="text-[10px] font-bold text-[#06b6d4] uppercase tracking-wider">
                        {step === 1 ? 'Personal Info' : step === 2 ? 'Security' : 'Profile Photo'}
                      </span>
                    </div>
                  </div>

                  {/* ── error ── */}
                  {error && (
                    <div className="mb-4 p-3.5 bg-red-500/[.07] border border-red-500/20 rounded-xl flex items-center gap-2.5 err-shake">
                      <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* ── email hint ── */}
                  {emailHint && (
                    <div className="mb-4 p-3.5 bg-amber-500/[.07] border border-amber-500/20 rounded-xl flex items-center justify-between gap-2 scale-in">
                      <p className="text-amber-300 text-sm">{emailHint}</p>
                      <button type="button" onClick={() => setEmail((p) => p.replace('@gamil.com', '@gmail.com'))}
                        className="text-xs font-bold text-amber-200 hover:text-white transition-colors
                          px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer">
                        Fix
                      </button>
                    </div>
                  )}

                  {/* ── form ── */}
                  <form onSubmit={handleSubmit}>

                    {/* ═══ STEP 1: Name & Email ═══ */}
                    {step === 1 && (
                      <div key="step1" className={stepAnimClass}>
                        <div className="space-y-4">
                          <FloatingInput icon={User} label="Full name" value={name}
                            onChange={(e) => { setName(e.target.value); setFieldErrors(p => ({...p, name: undefined})); }}
                            delay=".35s" required
                            error={fieldErrors.name}
                            success={name.trim().length >= 2} />

                          <FloatingInput icon={Mail} label="Email address" type="email" value={email}
                            onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({...p, email: undefined})); }}
                            delay=".45s" required
                            error={fieldErrors.email}
                            success={email.includes('@') && email.includes('.')} />

                          {/* info cards */}
                          <div className="grid grid-cols-2 gap-2 pt-2 slide-up" style={{ animationDelay: '.55s' }}>
                            {[
                              { icon: Zap, label: 'Fast Setup', desc: '2 minutes', color: '#06b6d4' },
                              { icon: Shield, label: 'Secure', desc: 'Encrypted', color: '#14b8a6' },
                            ].map((c, i) => (
                              <div key={i} className="p-3 bg-[#071015]/40 border border-[#1e3a42]/25 rounded-xl group hover:border-[#06b6d4]/15 transition-all duration-300 cursor-default">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                    style={{ background: `${c.color}10` }}>
                                    <c.icon size={12} style={{ color: c.color }} />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold text-white">{c.label}</p>
                                    <p className="text-[8px] text-gray-600">{c.desc}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 slide-up" style={{ animationDelay: '.6s' }}>
                          <RippleBtn type="button" onClick={nextStep}
                            className="shim w-full py-3.5 rounded-xl text-white font-semibold text-sm
                              flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300
                              bg-gradient-to-r from-[#06b6d4] to-[#14b8a6] hover:from-[#14b8a6] hover:to-[#06b6d4]
                              hover:shadow-xl hover:shadow-[#06b6d4]/20 hover:scale-[1.02] active:scale-[0.98]">
                            Continue <ArrowRight size={16} />
                          </RippleBtn>
                        </div>
                      </div>
                    )}

                    {/* ═══ STEP 2: Password ═══ */}
                    {step === 2 && (
                      <div key="step2" className={stepAnimClass}>
                        <div className="space-y-4">
                          <FloatingInput icon={Lock} label="Create password"
                            type={showPassword ? 'text' : 'password'} value={password}
                            onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({...p, password: undefined})); }}
                            delay=".3s" required error={fieldErrors.password}>
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center
                                justify-center rounded-lg text-gray-600 hover:text-[#06b6d4]
                                hover:bg-[#06b6d4]/[.06] transition-all duration-300 cursor-pointer z-10"
                              style={{ transform: `translateY(-50%) rotate(${showPassword ? '180deg' : '0deg'})`,
                                transition: 'transform .35s cubic-bezier(.16,1,.3,1), color .3s, background .3s' }}>
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </FloatingInput>

                          <PasswordStrength password={password} />

                          <FloatingInput icon={KeyRound} label="Confirm password"
                            type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors(p => ({...p, confirm: undefined})); }}
                            delay=".45s" required error={fieldErrors.confirm}
                            success={passwordsMatch}>
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center
                                justify-center rounded-lg text-gray-600 hover:text-[#06b6d4]
                                hover:bg-[#06b6d4]/[.06] transition-all duration-300 cursor-pointer z-10"
                              style={{ transform: `translateY(-50%) rotate(${showConfirm ? '180deg' : '0deg'})`,
                                transition: 'transform .35s cubic-bezier(.16,1,.3,1), color .3s, background .3s' }}>
                              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </FloatingInput>

                          {/* match indicator */}
                          {confirmPassword.length > 0 && (
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border scale-in
                              ${passwordsMatch
                                ? 'bg-emerald-500/[.06] border-emerald-500/15'
                                : 'bg-red-500/[.06] border-red-500/15'}`}>
                              {passwordsMatch ? (
                                <>
                                  <CheckCircle size={14} className="text-emerald-400" />
                                  <span className="text-[11px] text-emerald-400 font-medium">Passwords match</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle size={14} className="text-red-400" />
                                  <span className="text-[11px] text-red-400 font-medium">Passwords don't match</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button type="button" onClick={prevStep}
                            className="px-5 py-3.5 rounded-xl border border-[#1e3a42]/40 text-gray-400 text-sm
                              font-semibold hover:border-[#06b6d4]/30 hover:text-white hover:bg-[#06b6d4]/5
                              transition-all duration-300 cursor-pointer flex items-center gap-2 slide-up"
                            style={{ animationDelay: '.5s' }}>
                            <ArrowLeft size={16} /> Back
                          </button>
                          <RippleBtn type="button" onClick={nextStep}
                            className="shim flex-1 py-3.5 rounded-xl text-white font-semibold text-sm
                              flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300
                              bg-gradient-to-r from-[#06b6d4] to-[#14b8a6] hover:from-[#14b8a6] hover:to-[#06b6d4]
                              hover:shadow-xl hover:shadow-[#06b6d4]/20 hover:scale-[1.02] active:scale-[0.98] slide-up"
                            style={{ animationDelay: '.55s' }}>
                            Continue <ArrowRight size={16} />
                          </RippleBtn>
                        </div>
                      </div>
                    )}

                    {/* ═══ STEP 3: Avatar & Submit ═══ */}
                    {step === 3 && (
                      <div key="step3" className={stepAnimClass}>
                        <AvatarUpload preview={avatarPreview} onFileSelect={handleAvatarChange}
                          onRemove={removeAvatar} fileInputRef={fileInputRef} />

                        {/* review summary */}
                        <div className="mt-6 bg-[#071015]/40 border border-[#1e3a42]/25 rounded-xl p-4 slide-up"
                          style={{ animationDelay: '.4s' }}>
                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[.15em] mb-3 flex items-center gap-1.5">
                            <CheckCircle size={11} className="text-[#06b6d4]" /> Review
                          </h4>
                          <div className="space-y-2.5">
                            {[
                              { icon: User, label: 'Name', value: name, color: '#06b6d4' },
                              { icon: Mail, label: 'Email', value: email, color: '#14b8a6' },
                              { icon: Lock, label: 'Password', value: '•'.repeat(Math.min(password.length, 12)), color: '#2dd4bf' },
                              { icon: Image, label: 'Photo', value: avatar ? avatar.name : 'None (optional)', color: '#f59e0b' },
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-3 group">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                                  style={{ background: `${item.color}10` }}>
                                  <item.icon size={12} style={{ color: item.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">{item.label}</p>
                                  <p className="text-xs text-gray-300 truncate">{item.value}</p>
                                </div>
                                <CheckCircle size={12} className="text-emerald-400/50 shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button type="button" onClick={prevStep}
                            className="px-5 py-3.5 rounded-xl border border-[#1e3a42]/40 text-gray-400 text-sm
                              font-semibold hover:border-[#06b6d4]/30 hover:text-white hover:bg-[#06b6d4]/5
                              transition-all duration-300 cursor-pointer flex items-center gap-2 slide-up"
                            style={{ animationDelay: '.5s' }}>
                            <ArrowLeft size={16} /> Back
                          </button>
                          <RippleBtn type="submit" disabled={loading}
                            className={`shim flex-1 py-3.5 rounded-xl text-white font-semibold text-sm
                              flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300
                              ${loading
                                ? 'bg-[#06b6d4]/50 cursor-wait'
                                : 'bg-gradient-to-r from-[#06b6d4] via-[#14b8a6] to-[#2dd4bf] hover:shadow-xl hover:shadow-[#06b6d4]/20 hover:scale-[1.02] active:scale-[0.98]'}
                              disabled:opacity-50 disabled:cursor-not-allowed slide-up`}
                            style={{ animationDelay: '.55s' }}>
                            {loading ? (
                              <>
                                <div className="relative w-5 h-5">
                                  <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
                                  <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin" />
                                </div>
                                <span>Creating account</span>
                                <span className="flex gap-0.5">
                                  {[0, 1, 2].map((d) => (
                                    <span key={d} className="w-1 h-1 rounded-full bg-white/60"
                                      style={{ animation: 'fadeIn .5s ease infinite alternate', animationDelay: `${d * 0.15}s` }} />
                                  ))}
                                </span>
                              </>
                            ) : (
                              <>
                                <Sparkles size={16} /> Create Account <ArrowRight size={16} />
                              </>
                            )}
                          </RippleBtn>
                        </div>
                      </div>
                    )}
                  </form>

                  {/* ── security strip ── */}
                  <div className="mt-6 pt-5 border-t border-[#1e3a42]/25 slide-up" style={{ animationDelay: '.7s' }}>
                    <div className="flex items-center justify-center gap-5 flex-wrap">
                      {[
                        { icon: ShieldCheck, label: '256-bit SSL' },
                        { icon: Fingerprint, label: 'Encrypted' },
                        { icon: Activity, label: '99.9% Uptime' },
                        { icon: Heart, label: 'Free Forever' },
                      ].map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 group cursor-default fade-in"
                          style={{ animationDelay: `${0.8 + i * 0.08}s` }}>
                          <f.icon size={11} className="text-[#06b6d4]/30 group-hover:text-[#06b6d4]/70 transition-colors duration-300" />
                          <span className="text-[10px] text-gray-600 font-medium group-hover:text-gray-400 transition-colors duration-300">{f.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── login link ── */}
                  <div className="mt-5 pt-5 border-t border-[#1e3a42]/25 text-center slide-up" style={{ animationDelay: '.85s' }}>
                    <p className="text-gray-500 text-sm">
                      Already have an account?{' '}
                      <Link to="/login"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.assign('/login');
                        }}
                        className="relative text-[#2dd4bf] hover:text-[#06b6d4] font-semibold transition-colors duration-300 group/link">
                        Sign in
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#06b6d4] group-hover/link:w-full transition-all duration-300" />
                        <ArrowUpRight size={13} className="inline ml-0.5 opacity-0 group-hover/link:opacity-100 transition-all duration-200 -translate-y-0.5" />
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* card reflection */}
              <div className="w-3/4 h-20 mx-auto -mt-1 rounded-b-3xl opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center,rgba(6,182,212,.08) 0%,transparent 70%)', filter: 'blur(16px)' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}