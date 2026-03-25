import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Shield, Users,
  Sparkles, Zap, ChevronRight, Star, Fingerprint, KeyRound,
  CircuitBoard, Cpu, Globe, Layers, CheckCircle, AlertCircle,
  Info
} from 'lucide-react';
import api from '../utils/api';

/* ═══════════════════════════════════════
   INJECTED STYLES & KEYFRAMES
   ═══════════════════════════════════════ */
const LoginStyles = () => (
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
    @keyframes floatSlow {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(3deg); }
    }
    @keyframes floatMed {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-14px) rotate(-2deg); }
    }
    @keyframes floatFast {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.7); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(25px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes borderRotate {
      from { --angle: 0deg; }
      to { --angle: 360deg; }
    }
    @keyframes rippleEffect {
      to { transform: scale(2.5); opacity: 0; }
    }
    @keyframes orbitSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes orbitSpinReverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    @keyframes pulseRing {
      0% { transform: scale(0.8); opacity: 0.6; }
      50% { transform: scale(1.1); opacity: 0.2; }
      100% { transform: scale(0.8); opacity: 0.6; }
    }
    @keyframes pulseRingDelay {
      0% { transform: scale(0.9); opacity: 0.4; }
      50% { transform: scale(1.2); opacity: 0.1; }
      100% { transform: scale(0.9); opacity: 0.4; }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes typeReveal {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes blinkCursor {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes nodeFloat1 {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(15px, -25px); }
      50% { transform: translate(-10px, -40px); }
      75% { transform: translate(20px, -15px); }
    }
    @keyframes nodeFloat2 {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(-20px, -15px); }
      50% { transform: translate(15px, -35px); }
      75% { transform: translate(-25px, -20px); }
    }
    @keyframes nodeFloat3 {
      0%, 100% { transform: translate(0, 0); }
      33% { transform: translate(25px, -20px); }
      66% { transform: translate(-15px, -30px); }
    }
    @keyframes glowPulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.7; }
    }
    @keyframes scanLine {
      0% { top: -10%; }
      100% { top: 110%; }
    }
    @keyframes electricArc {
      0%, 100% { opacity: 0; d: path('M10,50 Q30,20 50,50 T90,50'); }
      25% { opacity: 0.8; d: path('M10,50 Q30,80 50,30 T90,50'); }
      50% { opacity: 0.3; d: path('M10,50 Q40,10 60,60 T90,50'); }
      75% { opacity: 0.6; d: path('M10,50 Q25,70 55,40 T90,50'); }
    }
    @keyframes successPop {
      0% { transform: scale(0) rotate(-45deg); opacity: 0; }
      50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
    @keyframes particleRise {
      0% { transform: translateY(0) scale(1); opacity: 1; }
      100% { transform: translateY(-80px) scale(0); opacity: 0; }
    }
    @keyframes inputHighlight {
      0% { width: 0; left: 50%; }
      100% { width: 100%; left: 0; }
    }
    @keyframes rotateGlow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    @keyframes dashDraw {
      to { stroke-dashoffset: 0; }
    }
    @keyframes hexPulse {
      0%, 100% { opacity: 0.03; transform: scale(1); }
      50% { opacity: 0.08; transform: scale(1.02); }
    }
    @keyframes letterReveal {
      0% { opacity: 0; transform: translateY(20px) rotateX(-90deg); filter: blur(4px); }
      100% { opacity: 1; transform: translateY(0) rotateX(0deg); filter: blur(0px); }
    }
    @keyframes iconMorph {
      0%, 100% { border-radius: 28% 72% 50% 50% / 50% 28% 72% 50%; }
      25% { border-radius: 50% 50% 28% 72% / 72% 50% 50% 28%; }
      50% { border-radius: 72% 28% 50% 50% / 28% 72% 50% 50%; }
      75% { border-radius: 50% 50% 72% 28% / 50% 28% 72% 50%; }
    }
    @keyframes lineExpand {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
    @keyframes dotTrail {
      0% { transform: translateX(0); opacity: 1; }
      100% { transform: translateX(30px); opacity: 0; }
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    .gradient-text {
      background: linear-gradient(135deg, #14b8a6, #06b6d4, #2dd4bf, #14b8a6);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 4s ease infinite;
    }

    .gradient-text-warm {
      background: linear-gradient(135deg, #2dd4bf, #14b8a6, #06b6d4, #2dd4bf);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 5s ease infinite;
    }

    .slide-up { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
    .slide-down { animation: slideDown 0.6s cubic-bezier(0.16,1,0.3,1) both; }
    .scale-in { animation: scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in { animation: fadeIn 0.6s ease both; }
    .fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }

    .login-card {
      background: linear-gradient(145deg, rgba(10,26,34,0.95) 0%, rgba(7,16,21,0.98) 100%);
      backdrop-filter: blur(40px) saturate(1.5);
      border: 1px solid rgba(30,58,66,0.4);
      transition: all 0.6s cubic-bezier(0.16,1,0.3,1);
    }
    .login-card:hover {
      border-color: rgba(20,184,166,0.2);
      box-shadow: 0 30px 80px -20px rgba(20,184,166,0.1), 0 0 0 1px rgba(20,184,166,0.05);
    }

    .glow-border-card {
      position: relative;
    }
    .glow-border-card::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      padding: 1px;
      background: conic-gradient(from var(--angle, 0deg), transparent 30%, #14b8a6 50%, transparent 70%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      animation: borderRotate 6s linear infinite;
      opacity: 0.4;
      transition: opacity 0.5s;
    }
    .glow-border-card:hover::before {
      opacity: 0.8;
    }

    .input-field {
      position: relative;
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    }
    .input-field::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #14b8a6, #06b6d4);
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
      border-radius: 2px;
    }
    .input-field.focused::after {
      width: 100%;
      left: 0;
    }

    .floating-label {
      position: absolute;
      left: 2.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #4b5563;
      font-size: 0.875rem;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
      background: transparent;
      padding: 0 4px;
    }
    .floating-label.active {
      top: -2px;
      left: 0.75rem;
      transform: translateY(-50%);
      font-size: 0.7rem;
      color: #14b8a6;
      background: linear-gradient(to bottom, transparent 45%, #0a1a22 45%);
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .orbit-container {
      animation: orbitSpin 20s linear infinite;
    }
    .orbit-container-reverse {
      animation: orbitSpinReverse 25s linear infinite;
    }
    .orbit-dot {
      animation: orbitSpinReverse 20s linear infinite;
    }
    .orbit-dot-reverse {
      animation: orbitSpin 25s linear infinite;
    }

    .ripple-container { position: relative; overflow: hidden; }
    .ripple-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      transform: scale(0);
      animation: rippleEffect 0.7s ease-out;
      pointer-events: none;
    }

    .shimmer-btn {
      position: relative;
      overflow: hidden;
    }
    .shimmer-btn::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 60%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      animation: shimmer 3s ease-in-out infinite;
    }

    .hex-bg {
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L55.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2314b8a6' stroke-width='0.3' opacity='0.06'/%3E%3C/svg%3E");
      animation: hexPulse 8s ease-in-out infinite;
    }

    .dot-grid-login {
      background-image: radial-gradient(rgba(20,184,166,0.06) 1px, transparent 1px);
      background-size: 28px 28px;
    }

    .success-pop { animation: successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
    .shake-anim { animation: shake 0.5s ease both; }
    .breathe { animation: breathe 3s ease-in-out infinite; }

    .particle { animation: particleRise 1s ease-out forwards; }

    .scan-overlay::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(20,184,166,0.1), transparent);
      animation: scanLine 10s linear infinite;
    }

    .toggle-slider {
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    }

    .letter-anim {
      display: inline-block;
      animation: letterReveal 0.5s cubic-bezier(0.16,1,0.3,1) both;
    }

    .icon-morph {
      animation: iconMorph 8s ease-in-out infinite;
    }

    .line-expand {
      transform-origin: left;
      animation: lineExpand 0.8s cubic-bezier(0.16,1,0.3,1) both;
    }

    .node-1 { animation: nodeFloat1 12s ease-in-out infinite; }
    .node-2 { animation: nodeFloat2 15s ease-in-out infinite; }
    .node-3 { animation: nodeFloat3 10s ease-in-out infinite; }

    .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1e3a42; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #14b8a6; }
  `}</style>
);

/* ═══════════════════════════════════════
   ANIMATED LETTER COMPONENT
   ═══════════════════════════════════════ */
function AnimatedText({ text, className = '', baseDelay = 0 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="letter-anim"
          style={{ animationDelay: `${baseDelay + i * 0.04}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════
   ORBITAL RINGS COMPONENT
   ═══════════════════════════════════════ */
function OrbitalRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Ring 1 */}
      <div className="absolute w-[500px] h-[500px] rounded-full border border-[#14b8a6]/[0.04]"
        style={{ animation: 'pulseRing 6s ease-in-out infinite' }} />
      {/* Ring 2 */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-[#06b6d4]/[0.03]"
        style={{ animation: 'pulseRingDelay 8s ease-in-out infinite' }} />
      {/* Ring 3 */}
      <div className="absolute w-[700px] h-[700px] rounded-full border border-dashed border-[#14b8a6]/[0.03]"
        style={{ animation: 'pulseRing 10s ease-in-out infinite' }} />

      {/* Orbiting dot 1 */}
      <div className="absolute w-[500px] h-[500px] orbit-container">
        <div className="orbit-dot absolute -top-1 left-1/2 -translate-x-1/2">
          <div className="w-2 h-2 rounded-full bg-[#14b8a6]/60 shadow-lg shadow-[#14b8a6]/30" />
        </div>
      </div>

      {/* Orbiting dot 2 */}
      <div className="absolute w-[600px] h-[600px] orbit-container-reverse">
        <div className="orbit-dot-reverse absolute top-1/2 -right-1 -translate-y-1/2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]/50 shadow-lg shadow-[#06b6d4]/20" />
        </div>
      </div>

      {/* Orbiting dot 3 */}
      <div className="absolute w-[700px] h-[700px] orbit-container" style={{ animationDuration: '30s' }}>
        <div className="orbit-dot absolute -bottom-1 left-1/2 -translate-x-1/2" style={{ animationDuration: '30s' }}>
          <div className="w-1 h-1 rounded-full bg-[#2dd4bf]/40" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   NETWORK NODES BACKGROUND
   ═══════════════════════════════════════ */
function NetworkNodes() {
  const nodes = useMemo(() => [
    { x: '15%', y: '20%', size: 3, cls: 'node-1', opacity: 0.3, color: '#14b8a6' },
    { x: '80%', y: '15%', size: 2, cls: 'node-2', opacity: 0.2, color: '#06b6d4' },
    { x: '10%', y: '75%', size: 2.5, cls: 'node-3', opacity: 0.25, color: '#2dd4bf' },
    { x: '85%', y: '70%', size: 2, cls: 'node-1', opacity: 0.15, color: '#14b8a6' },
    { x: '50%', y: '10%', size: 1.5, cls: 'node-2', opacity: 0.2, color: '#06b6d4' },
    { x: '25%', y: '90%', size: 2, cls: 'node-3', opacity: 0.15, color: '#2dd4bf' },
    { x: '70%', y: '85%', size: 3, cls: 'node-1', opacity: 0.2, color: '#14b8a6' },
    { x: '40%', y: '30%', size: 1.5, cls: 'node-2', opacity: 0.1, color: '#06b6d4' },
    { x: '65%', y: '45%', size: 2, cls: 'node-3', opacity: 0.12, color: '#2dd4bf' },
    { x: '90%', y: '40%', size: 1.5, cls: 'node-1', opacity: 0.18, color: '#14b8a6' },
    { x: '5%', y: '50%', size: 2, cls: 'node-2', opacity: 0.15, color: '#06b6d4' },
    { x: '55%', y: '80%', size: 1.5, cls: 'node-3', opacity: 0.12, color: '#2dd4bf' },
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {nodes.map((node, i) => (
        <div key={i} className={`absolute ${node.cls}`}
          style={{ left: node.x, top: node.y }}>
          <div className="relative">
            <div className="rounded-full" style={{
              width: node.size * 2, height: node.size * 2,
              background: node.color, opacity: node.opacity,
              boxShadow: `0 0 ${node.size * 6}px ${node.color}40`
            }} />
            <div className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: node.color, opacity: node.opacity * 0.3,
                animationDuration: `${3 + i * 0.5}s`
              }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   FLOATING GEOMETRIC SHAPES
   ═══════════════════════════════════════ */
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Rotating square */}
      <div className="absolute top-[15%] right-[15%] w-8 h-8 border border-[#14b8a6]/10 rotate-45"
        style={{ animation: 'floatSlow 8s ease-in-out infinite, orbitSpin 20s linear infinite' }} />

      {/* Small diamond */}
      <div className="absolute bottom-[25%] left-[12%] w-4 h-4 bg-[#06b6d4]/8 rotate-45"
        style={{ animation: 'floatMed 6s ease-in-out infinite' }} />

      {/* Circle */}
      <div className="absolute top-[60%] right-[10%] w-6 h-6 rounded-full border border-[#2dd4bf]/8"
        style={{ animation: 'floatFast 4s ease-in-out infinite' }} />

      {/* Plus shape */}
      <div className="absolute top-[30%] left-[8%] opacity-10" style={{ animation: 'floatSlow 7s ease-in-out infinite' }}>
        <div className="relative w-5 h-5">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#14b8a6] -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-[#14b8a6] -translate-x-1/2" />
        </div>
      </div>

      {/* Triangle */}
      <div className="absolute bottom-[15%] right-[20%] opacity-10"
        style={{ animation: 'floatMed 9s ease-in-out infinite' }}>
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-[#06b6d4]" />
      </div>

      {/* Hexagon outline */}
      <div className="absolute top-[75%] left-[25%] opacity-[0.06]"
        style={{ animation: 'floatSlow 11s ease-in-out infinite' }}>
        <svg width="30" height="30" viewBox="0 0 30 30">
          <path d="M15 1L28 8.5V23.5L15 29L2 23.5V8.5Z" fill="none" stroke="#14b8a6" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Arc */}
      <div className="absolute top-[45%] left-[5%] opacity-[0.06]"
        style={{ animation: 'floatFast 5s ease-in-out infinite' }}>
        <svg width="40" height="20" viewBox="0 0 40 20">
          <path d="M2 18 Q20 -10 38 18" fill="none" stroke="#2dd4bf" strokeWidth="0.8" />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PARTICLE BURST EFFECT
   ═══════════════════════════════════════ */
function ParticleBurst({ active, x, y }) {
  if (!active) return null;
  const particles = Array.from({ length: 8 }, (_, i) => ({
    angle: (i / 8) * 360,
    distance: 20 + Math.random() * 30,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 0.2,
  }));

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {particles.map((p, i) => (
        <div key={i} className="particle absolute" style={{
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: '#14b8a6',
          transform: `rotate(${p.angle}deg) translateY(-${p.distance}px)`,
          animationDelay: `${p.delay}s`,
          opacity: 0.8,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   ANIMATED INPUT COMPONENT
   ═══════════════════════════════════════ */
function AnimatedInput({
  icon: Icon, label, type = 'text', value, onChange, placeholder,
  required, suffix, delay = 0, error
}) {
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const hasValue = value && value.length > 0;
  const isActive = focused || hasValue;

  return (
    <div className="fade-in-up" style={{ animationDelay: `${delay}s` }}>
      <div className={`input-field relative rounded-xl overflow-hidden transition-all duration-400
        ${focused ? 'focused' : ''}
        ${error && touched ? 'shake-anim' : ''}`}>
        {/* Ambient glow on focus */}
        <div className={`absolute inset-0 rounded-xl transition-opacity duration-500 pointer-events-none
          ${focused ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(20,184,166,0.06) 0%, transparent 70%)',
          }} />

        <div className="relative">
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-all duration-300 z-10
            ${focused ? 'text-[#14b8a6] scale-110' : hasValue ? 'text-[#14b8a6]/60' : 'text-gray-600'}`}>
            <Icon size={17} />
          </div>

          {/* Floating label */}
          <div className={`floating-label z-10 ${isActive ? 'active' : ''}`}>
            {label}
          </div>

          <input
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); setTouched(true); }}
            required={required}
            className={`w-full pr-12 py-3.5 bg-[#071015]/60 border rounded-xl text-white text-[15px]
              transition-all duration-300 outline-none
              ${focused
                ? 'border-[#14b8a6]/40 shadow-[0_0_0_3px_rgba(20,184,166,0.08)]'
                : hasValue
                  ? 'border-[#1e3a42]/60'
                  : 'border-[#1e3a42]/40'
              }
              ${error && touched ? 'border-red-500/40' : ''}`}
            style={{ paddingLeft: '2.75rem' }}
          />

          {suffix && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10">
              {suffix}
            </div>
          )}

          {/* Focus indicator line */}
          <div className={`absolute bottom-0 left-0 h-[2px] rounded-b-xl transition-all duration-500 ease-out
            ${focused ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
            style={{ background: 'linear-gradient(90deg, #14b8a6, #06b6d4, #14b8a6)' }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ANIMATED TOGGLE COMPONENT
   ═══════════════════════════════════════ */
function LoginToggle({ loginType, setLoginType }) {
  return (
    <div className="fade-in-up relative" style={{ animationDelay: '0.3s' }}>
      <div className="relative flex gap-1 p-1 bg-[#071015]/60 rounded-2xl border border-[#1e3a42]/40 overflow-hidden">
        {/* Sliding background */}
        <div className="toggle-slider absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-[#14b8a6]/15 to-[#06b6d4]/10 border border-[#14b8a6]/25"
          style={{
            width: 'calc(50% - 4px)',
            left: loginType === 'user' ? '4px' : 'calc(50%)',
            boxShadow: '0 0 20px rgba(20,184,166,0.08)',
          }} />

        <button type="button" onClick={() => setLoginType('user')}
          className={`relative z-10 flex-1 py-3 px-4 rounded-xl transition-all duration-400 font-semibold text-sm
            flex items-center justify-center gap-2.5 cursor-pointer
            ${loginType === 'user' ? 'text-[#2dd4bf]' : 'text-gray-500 hover:text-gray-300'}`}>
          <div className={`transition-all duration-300 ${loginType === 'user' ? 'scale-110' : 'scale-100'}`}>
            <Users size={16} />
          </div>
          <span>User</span>
          {loginType === 'user' && (
            <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
          )}
        </button>

        <button type="button" onClick={() => setLoginType('admin')}
          className={`relative z-10 flex-1 py-3 px-4 rounded-xl transition-all duration-400 font-semibold text-sm
            flex items-center justify-center gap-2.5 cursor-pointer
            ${loginType === 'admin' ? 'text-[#2dd4bf]' : 'text-gray-500 hover:text-gray-300'}`}>
          <div className={`transition-all duration-300 ${loginType === 'admin' ? 'scale-110' : 'scale-100'}`}>
            <Shield size={16} />
          </div>
          <span>Admin</span>
          {loginType === 'admin' && (
            <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
          )}
        </button>
      </div>

      {/* Subtle reflection */}
      <div className="absolute -bottom-3 left-[10%] right-[10%] h-3 bg-gradient-to-b from-[#14b8a6]/5 to-transparent blur-sm rounded-full" />
    </div>
  );
}

/* ═══════════════════════════════════════
   ANIMATED LOGO / ICON
   ═══════════════════════════════════════ */
function AnimatedLogo({ loginType }) {
  return (
    <div className="relative flex items-center justify-center mb-6 scale-in" style={{ animationDelay: '0.1s' }}>
      {/* Outer pulsing rings */}
      <div className="absolute w-24 h-24 rounded-full border border-[#14b8a6]/10"
        style={{ animation: 'pulseRing 4s ease-in-out infinite' }} />
      <div className="absolute w-32 h-32 rounded-full border border-[#06b6d4]/5"
        style={{ animation: 'pulseRingDelay 5s ease-in-out infinite' }} />

      {/* Rotating dashed ring */}
      <div className="absolute w-20 h-20">
        <svg className="w-full h-full" viewBox="0 0 80 80" style={{ animation: 'orbitSpin 15s linear infinite' }}>
          <circle cx="40" cy="40" r="36" fill="none" stroke="#14b8a6" strokeWidth="0.5"
            strokeDasharray="4,8" opacity="0.3" />
        </svg>
      </div>

      {/* Main icon container */}
      <div className="relative">
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl icon-morph
          bg-gradient-to-br from-[#14b8a6]/20 to-[#06b6d4]/10 border border-[#14b8a6]/25
          shadow-lg shadow-[#14b8a6]/10 breathe">
          <div className="transition-all duration-500">
            {loginType === 'admin' ? (
              <Shield size={28} className="text-[#2dd4bf]" />
            ) : (
              <Fingerprint size={28} className="text-[#2dd4bf]" />
            )}
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#14b8a6]/40 animate-pulse" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#06b6d4]/30 animate-pulse"
          style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   TRUST INDICATORS
   ═══════════════════════════════════════ */
function TrustIndicators() {
  const items = [
    { icon: Shield, text: 'Encrypted' },
    { icon: Zap, text: 'Fast' },
    { icon: Globe, text: 'Secure' },
  ];

  return (
    <div className="flex items-center justify-center gap-4 fade-in-up" style={{ animationDelay: '0.8s' }}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5 text-gray-600 group cursor-default">
          <item.icon size={11} className="text-[#14b8a6]/40 group-hover:text-[#14b8a6]/70 transition-colors duration-300" />
          <span className="text-[10px] uppercase tracking-[0.15em] font-medium group-hover:text-gray-400 transition-colors duration-300">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   STATUS NOTIFICATION COMPONENT
   ═══════════════════════════════════════ */
function StatusNotification({ type, message, onAction, actionLabel }) {
  if (!message) return null;

  const config = {
    error: {
      bg: 'bg-red-500/8',
      border: 'border-red-500/20',
      icon: AlertCircle,
      iconColor: 'text-red-400',
      textColor: 'text-red-300',
      dotColor: 'bg-red-500',
      anim: 'shake-anim',
    },
    warning: {
      bg: 'bg-amber-500/8',
      border: 'border-amber-500/20',
      icon: Info,
      iconColor: 'text-amber-400',
      textColor: 'text-amber-300',
      dotColor: 'bg-amber-500',
      anim: 'fade-in-up',
    },
    success: {
      bg: 'bg-emerald-500/8',
      border: 'border-emerald-500/20',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
      textColor: 'text-emerald-300',
      dotColor: 'bg-emerald-500',
      anim: 'success-pop',
    },
  };

  const c = config[type] || config.error;
  const IconComp = c.icon;

  return (
    <div className={`${c.anim} mb-5 p-3.5 ${c.bg} border ${c.border} rounded-xl backdrop-blur-sm`}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 mt-0.5 ${c.iconColor}`}>
          <IconComp size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`${c.textColor} text-sm leading-relaxed`}>{message}</p>
          {onAction && actionLabel && (
            <button type="button" onClick={onAction}
              className={`mt-2 text-xs font-bold ${c.textColor} hover:text-white transition-colors underline underline-offset-2 cursor-pointer`}>
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   RIPPLE BUTTON
   ═══════════════════════════════════════ */
function RippleButton({ children, onClick, disabled, className, type = 'button' }) {
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
    setTimeout(() => circle.remove(), 700);
    onClick?.(e);
  };

  return (
    <button ref={btnRef} type={type} onClick={handleClick} disabled={disabled}
      className={`ripple-container ${className}`}>
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   SIDE DECORATIVE PANEL
   ═══════════════════════════════════════ */
function SideDecor() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center w-[280px] relative">
      {/* Circuit lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 280 600">
        <path d="M140 0 V100 H200 V200 H80 V300 H220 V400 H60 V500 H180 V600" fill="none" stroke="#14b8a6" strokeWidth="1" />
        <path d="M0 150 H100 V250 H200 V350 H50 V450 H250" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="4,6" />
        {/* Nodes on circuit */}
        <circle cx="140" cy="100" r="3" fill="#14b8a6" opacity="0.3" />
        <circle cx="200" cy="200" r="2.5" fill="#06b6d4" opacity="0.2" />
        <circle cx="80" cy="300" r="3" fill="#2dd4bf" opacity="0.25" />
        <circle cx="220" cy="400" r="2" fill="#14b8a6" opacity="0.2" />
      </svg>

      {/* Central decorative element */}
      <div className="relative z-10">
        {/* Morphing blob */}
        <div className="w-40 h-40 bg-[#14b8a6]/[0.04]"
          style={{ animation: 'morphBlob1 15s ease-in-out infinite' }} />

        {/* Overlapping blob */}
        <div className="absolute inset-4 bg-[#06b6d4]/[0.03]"
          style={{ animation: 'morphBlob2 18s ease-in-out infinite' }} />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[#14b8a6]/20">
            <CircuitBoard size={48} />
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div className="absolute bottom-20 space-y-3 w-full px-8">
        {[
          { label: 'System', status: 'Online', color: '#10b981' },
          { label: 'Auth', status: 'Ready', color: '#14b8a6' },
          { label: 'API', status: 'Active', color: '#06b6d4' },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2 bg-[#0A1A22]/40 rounded-lg border border-[#1e3a42]/20 fade-in"
            style={{ animationDelay: `${1 + i * 0.15}s` }}>
            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">{s.label}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
              <span className="text-[10px] font-semibold" style={{ color: s.color }}>{s.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ADMIN CREDENTIALS CARD
   ═══════════════════════════════════════ */
function AdminCredentialsCard() {
  const [copied, setCopied] = useState(null);

  const copyText = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fade-in-up mb-5" style={{ animationDelay: '0.35s' }}>
      <div className="relative p-4 bg-[#14b8a6]/[0.04] border border-[#14b8a6]/15 rounded-xl overflow-hidden">
        {/* Subtle scan line */}
        <div className="absolute inset-0 scan-overlay pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-md bg-[#14b8a6]/15 flex items-center justify-center">
              <KeyRound size={11} className="text-[#14b8a6]" />
            </div>
            <span className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-[0.15em]">Demo Credentials</span>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Email', value: 'admin123@gmail.com', field: 'email' },
              { label: 'Password', value: '123456', field: 'password' },
            ].map(({ label, value, field }) => (
              <div key={field} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium w-16">{label}</span>
                  <code className="text-xs text-[#14b8a6] font-mono bg-[#14b8a6]/8 px-2 py-0.5 rounded">{value}</code>
                </div>
                <button onClick={() => copyText(value, field)}
                  className="text-[10px] text-gray-600 hover:text-[#14b8a6] transition-colors cursor-pointer font-medium">
                  {copied === field ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle size={10} /> Copied
                    </span>
                  ) : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  const normalizeEmailInput = (value) => value.trim().toLowerCase();

  const extractErrorMessage = (err) => {
    const responseData = err?.response?.data;
    if (!responseData) return 'Unable to reach server. Please try again.';
    if (responseData?.errors && typeof responseData.errors === 'object') {
      const firstErrorKey = Object.keys(responseData.errors)[0];
      const firstErrorValue = responseData.errors[firstErrorKey];
      if (Array.isArray(firstErrorValue) && firstErrorValue[0]) return firstErrorValue[0];
    }
    return responseData?.message || 'Login failed. Please check your credentials.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailHint('');
    setLoading(true);
    const normalizedEmail = normalizeEmailInput(email);

    if (normalizedEmail.includes('@gamil.com')) {
      setEmailHint('Did you mean gmail.com?');
    }

    try {
      if (loginType === 'admin') {
        const res = await api.post('/admin/login', { email: normalizedEmail, password });
        const { admin, token } = res.data;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(admin));
        window.location.assign('/admin/dashboard');
      } else {
        await login(normalizedEmail, password);
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

  return (
    <>
      <LoginStyles />
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #050D11 0%, #0A1A22 40%, #071218 100%)' }}>

        {/* ── Mouse-following ambient glow ── */}
        <div className="fixed pointer-events-none z-0 mix-blend-screen"
          style={{
            left: mousePos.x - 250,
            top: mousePos.y - 250,
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 70%)',
            transition: 'left 0.4s ease-out, top 0.4s ease-out',
          }} />

        {/* ── Background layers ── */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Morphing blobs */}
          <div className="absolute -top-[15%] -left-[10%] w-[450px] h-[450px] bg-[#14b8a6]/[0.025]"
            style={{ animation: 'morphBlob1 15s ease-in-out infinite' }} />
          <div className="absolute -bottom-[10%] -right-[15%] w-[500px] h-[500px] bg-[#06b6d4]/[0.02]"
            style={{ animation: 'morphBlob2 18s ease-in-out infinite' }} />

          {/* Radial glows */}
          <div className="absolute top-[20%] left-[20%] w-80 h-80 bg-[radial-gradient(ellipse,rgba(20,184,166,0.035)_0%,transparent_70%)] glow-pulse" />
          <div className="absolute bottom-[20%] right-[15%] w-72 h-72 bg-[radial-gradient(ellipse,rgba(6,182,212,0.025)_0%,transparent_70%)] glow-pulse"
            style={{ animationDelay: '1.5s' }} />

          {/* Dot grid */}
          <div className="dot-grid-login absolute inset-0 opacity-50" />

          {/* Hex pattern overlay */}
          <div className="hex-bg absolute inset-0" />
        </div>

        {/* ── Floating shapes ── */}
        <FloatingShapes />

        {/* ── Network nodes ── */}
        <NetworkNodes />

        {/* ── Orbital rings ── */}
        <OrbitalRings />

        {/* ── Main content ── */}
        <div className={`relative z-10 flex items-center gap-0 transition-all duration-1000
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* ── Side decorative panel (desktop) ── */}
          <SideDecor />

          {/* ── Login card ── */}
          <div ref={cardRef} className="relative w-full max-w-[440px] mx-4">
            {/* Card glow */}
            <div className="absolute -inset-4 bg-[radial-gradient(ellipse,rgba(20,184,166,0.06)_0%,transparent_70%)] blur-2xl pointer-events-none" />

            <div className="login-card glow-border-card rounded-3xl overflow-hidden relative">
              {/* Top gradient bar */}
              <div className="h-[3px] w-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, #14b8a6, #06b6d4, #2dd4bf, transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'gradientShift 3s ease infinite',
                }} />

              {/* Subtle top corner accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse,rgba(20,184,166,0.04)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[radial-gradient(ellipse,rgba(6,182,212,0.03)_0%,transparent_70%)] pointer-events-none" />

              <div className="relative p-8 sm:p-10">

                {/* ── Animated Logo ── */}
                <AnimatedLogo loginType={loginType} />

                {/* ── Header text ── */}
                <div className="text-center mb-8">
                  <h1 className="text-[28px] font-black text-white mb-2 leading-tight tracking-tight">
                    <AnimatedText text="Welcome back" baseDelay={0.2} />
                  </h1>
                  <div className="fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <p className="text-gray-500 text-sm">
                      Sign in to your <span className="gradient-text font-semibold">CareerPath</span> account
                    </p>
                  </div>

                  {/* Decorative line */}
                  <div className="flex items-center justify-center mt-4 gap-3">
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#1e3a42] line-expand" style={{ animationDelay: '0.6s' }} />
                    <div className="w-1 h-1 rounded-full bg-[#14b8a6]/30 scale-in" style={{ animationDelay: '0.7s' }} />
                    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#1e3a42] line-expand" style={{ animationDelay: '0.6s', transformOrigin: 'right' }} />
                  </div>
                </div>

                {/* ── Login Type Toggle ── */}
                <LoginToggle loginType={loginType} setLoginType={setLoginType} />

                {/* ── Admin credentials card ── */}
                {loginType === 'admin' && <AdminCredentialsCard />}

                {/* ── Error notification ── */}
                <StatusNotification type="error" message={error} />

                {/* ── Email hint notification ── */}
                <StatusNotification
                  type="warning"
                  message={emailHint}
                  onAction={() => {
                    setEmail(prev => prev.replace('@gamil.com', '@gmail.com'));
                    setEmailHint('');
                  }}
                  actionLabel="Fix Email"
                />

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="space-y-5 mt-7">

                  {/* Email input */}
                  <AnimatedInput
                    icon={Mail}
                    label={loginType === 'admin' ? 'Admin Email' : 'Email Address'}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={loginType === 'admin' ? 'admin123@gmail.com' : 'you@example.com'}
                    required
                    delay={0.4}
                    error={!!error}
                  />

                  {/* Password input */}
                  <AnimatedInput
                    icon={Lock}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    delay={0.5}
                    error={!!error}
                    suffix={
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-600 hover:text-[#14b8a6] transition-all duration-300 cursor-pointer p-1 rounded-lg hover:bg-[#14b8a6]/10">
                        <div className="transition-transform duration-300" style={{ transform: showPassword ? 'rotateY(180deg)' : 'rotateY(0)' }}>
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </div>
                      </button>
                    }
                  />

                  {/* ── Submit button ── */}
                  <div className="fade-in-up pt-2" style={{ animationDelay: '0.6s' }}>
                    <RippleButton
                      type="submit"
                      disabled={loading}
                      onClick={() => {}}
                      className={`shimmer-btn w-full py-4 rounded-xl text-white font-bold text-[15px] cursor-pointer
                        transition-all duration-500 flex items-center justify-center gap-2.5
                        ${loading
                          ? 'bg-[#14b8a6]/50 cursor-wait'
                          : 'bg-gradient-to-r from-[#14b8a6] via-[#0d9e94] to-[#06b6d4] hover:shadow-2xl hover:shadow-[#14b8a6]/25 hover:scale-[1.02] active:scale-[0.98]'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-lg shadow-[#14b8a6]/15`}
                    >
                      {loading ? (
                        <>
                          <div className="relative w-5 h-5">
                            <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
                            <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                          <span className="animate-pulse">Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>{loginType === 'admin' ? 'Admin Sign In' : 'Sign In'}</span>
                          <div className="flex items-center gap-0.5 transition-transform duration-300 group-hover:translate-x-1">
                            <ArrowRight size={16} className="transition-transform duration-300" />
                          </div>
                        </>
                      )}
                    </RippleButton>

                    {/* Button reflection */}
                    <div className="mx-auto mt-2 w-[60%] h-4 bg-gradient-to-b from-[#14b8a6]/8 to-transparent blur-md rounded-full" />
                  </div>
                </form>

                {/* ── Divider ── */}
                {loginType === 'user' && (
                  <div className="fade-in-up" style={{ animationDelay: '0.7s' }}>
                    <div className="relative mt-8 mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#1e3a42]/60 to-transparent" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-4 text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold bg-[#0A1A22]">
                          New Here?
                        </span>
                      </div>
                    </div>

                    {/* ── Register link ── */}
                    <Link to="/register"
                      className="group flex items-center justify-center gap-3 w-full py-3.5 rounded-xl
                        border border-[#1e3a42]/40 text-gray-400 text-sm font-semibold
                        hover:border-[#14b8a6]/30 hover:text-[#2dd4bf] hover:bg-[#14b8a6]/[0.04]
                        transition-all duration-400">
                      <Sparkles size={15} className="text-gray-600 group-hover:text-[#14b8a6] transition-colors duration-300" />
                      <span>Create your account</span>
                      <ChevronRight size={14} className="text-gray-600 group-hover:text-[#14b8a6] group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  </div>
                )}

                {/* ── Trust indicators ── */}
                <div className="mt-7">
                  <TrustIndicators />
                </div>

              </div>
            </div>

            {/* ── Bottom ambient glow ── */}
            <div className="absolute -bottom-8 left-[10%] right-[10%] h-16 bg-[radial-gradient(ellipse,rgba(20,184,166,0.06)_0%,transparent_70%)] blur-xl pointer-events-none" />
          </div>
        </div>

        {/* ── Bottom decorative bar ── */}
        <div className="fixed bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#14b8a6]/10 to-transparent pointer-events-none" />

        {/* ── Corner decorations ── */}
        <div className="fixed top-6 left-6 opacity-20 pointer-events-none fade-in" style={{ animationDelay: '1s' }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path d="M0 20 L20 0" stroke="#14b8a6" strokeWidth="0.5" fill="none" />
            <path d="M0 40 L40 0" stroke="#14b8a6" strokeWidth="0.5" fill="none" opacity="0.5" />
          </svg>
        </div>
        <div className="fixed bottom-6 right-6 opacity-20 pointer-events-none fade-in" style={{ animationDelay: '1.2s' }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path d="M40 20 L20 40" stroke="#06b6d4" strokeWidth="0.5" fill="none" />
            <path d="M40 0 L0 40" stroke="#06b6d4" strokeWidth="0.5" fill="none" opacity="0.5" />
          </svg>
        </div>

        {/* ── Version tag ── */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-gray-700 tracking-[0.3em] uppercase font-medium pointer-events-none fade-in"
          style={{ animationDelay: '1.5s' }}>
          CareerPath v2.0
        </div>
      </div>
    </>
  );
}