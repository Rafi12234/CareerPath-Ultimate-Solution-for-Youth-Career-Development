import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, LogOut, Menu, X, Search, Eye, Mail, Phone, MapPin, 
  Briefcase, BookOpen, Award, ChevronRight, Sparkles, 
  GraduationCap, Building2, Calendar, Clock, TrendingUp,
  Shield, Activity, Zap, Star, RefreshCw, UserCheck, UserX, 
  Globe, Code, Layers, LayoutGrid, List, ChevronDown, 
  ArrowUpRight, UserPlus, Settings, Bell, Hash, Crown,
  Target, Flame, Hexagon, Diamond, Filter, MoreVertical,
  CheckCircle, AlertCircle, XCircle, ChevronUp, Verified,
  ExternalLink, Copy, Download, BarChart3, PieChart
} from 'lucide-react';
import api from '../utils/api';

/* ═══════════════════════════════════════════════════════════════════
   GLOBAL STYLES & KEYFRAME ANIMATIONS
   ═══════════════════════════════════════════════════════════════════ */
const InjectStyles = () => (
  <style>{`
    /* === Keyframe Animations === */
    @keyframes morphBlob {
      0%, 100% { 
        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        transform: rotate(0deg) scale(1);
      }
      25% { 
        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
        transform: rotate(90deg) scale(1.05);
      }
      50% { 
        border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
        transform: rotate(180deg) scale(0.95);
      }
      75% { 
        border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%;
        transform: rotate(270deg) scale(1.02);
      }
    }

    @keyframes floatParticle {
      0%, 100% { 
        transform: translateY(0) translateX(0) rotate(0deg);
        opacity: 0.4;
      }
      25% { 
        transform: translateY(-40px) translateX(20px) rotate(90deg);
        opacity: 0.8;
      }
      50% { 
        transform: translateY(-80px) translateX(-10px) rotate(180deg);
        opacity: 0.3;
      }
      75% { 
        transform: translateY(-40px) translateX(30px) rotate(270deg);
        opacity: 0.6;
      }
    }

    @keyframes pulseGlow {
      0%, 100% { 
        box-shadow: 0 0 20px rgba(20, 184, 166, 0.15);
        transform: scale(1);
      }
      50% { 
        box-shadow: 0 0 40px rgba(20, 184, 166, 0.35), 0 0 80px rgba(20, 184, 166, 0.15);
        transform: scale(1.02);
      }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(60px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-40px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideLeft {
      from { opacity: 0; transform: translateX(-50px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slideRight {
      from { opacity: 0; transform: translateX(50px); }
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

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes borderFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes countUp {
      from { 
        opacity: 0; 
        transform: translateY(25px) scale(0.7);
        filter: blur(8px);
      }
      to { 
        opacity: 1; 
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes rippleEffect {
      0% { transform: scale(0); opacity: 0.6; }
      100% { transform: scale(4); opacity: 0; }
    }

    @keyframes textGradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes orbFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(40px, -30px) scale(1.1); }
      66% { transform: translate(-30px, 25px) scale(0.9); }
    }

    @keyframes modalReveal {
      from { 
        opacity: 0; 
        transform: scale(0.92) translateY(30px);
        filter: blur(4px);
      }
      to { 
        opacity: 1; 
        transform: scale(1) translateY(0);
        filter: blur(0);
      }
    }

    @keyframes dotPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.8); opacity: 0.4; }
    }

    @keyframes lineGrow {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }

    @keyframes barGrow {
      from { width: 0%; }
      to { width: var(--target-width); }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }

    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      14% { transform: scale(1.1); }
      28% { transform: scale(1); }
      42% { transform: scale(1.1); }
      70% { transform: scale(1); }
    }

    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    @keyframes wave {
      0%, 100% { transform: translateY(0); }
      25% { transform: translateY(-5px); }
      75% { transform: translateY(5px); }
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes scanLine {
      0% { top: -100%; }
      100% { top: 100%; }
    }

    /* === Animation Classes === */
    .animate-morph { animation: morphBlob 25s ease-in-out infinite; }
    .animate-float-particle { animation: floatParticle 10s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulseGlow 4s ease-in-out infinite; }
    .animate-slide-up { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-slide-down { animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-slide-left { animation: slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-slide-right { animation: slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.6s ease forwards; }
    .animate-shimmer { 
      background: linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.08), transparent);
      background-size: 200% 100%;
      animation: shimmer 2.5s linear infinite;
    }
    .animate-border-flow {
      background: linear-gradient(90deg, #14b8a6, #0891b2, #06b6d4, #2dd4bf, #14b8a6);
      background-size: 400% 100%;
      animation: borderFlow 5s linear infinite;
    }
    .animate-count-up { animation: countUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-spin-slow { animation: spinSlow 25s linear infinite; }
    .animate-text-gradient {
      background: linear-gradient(90deg, #14b8a6, #2dd4bf, #06b6d4, #0891b2, #14b8a6);
      background-size: 400% 100%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: textGradient 5s ease infinite;
    }
    .animate-orb-float { animation: orbFloat 18s ease-in-out infinite; }
    .animate-modal-reveal { animation: modalReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-dot-pulse { animation: dotPulse 2.5s ease-in-out infinite; }
    .animate-line-grow { animation: lineGrow 1.2s ease-out forwards; transform-origin: left; }
    .animate-bounce { animation: bounce 2s ease-in-out infinite; }
    .animate-wiggle { animation: wiggle 0.5s ease-in-out; }
    .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }

    /* === Glass Morphism === */
    .glass-panel {
      background: linear-gradient(135deg, rgba(10, 26, 34, 0.85) 0%, rgba(15, 38, 53, 0.7) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(30, 58, 66, 0.5);
    }
    
    .glass-card {
      background: linear-gradient(145deg, rgba(15, 38, 53, 0.75) 0%, rgba(10, 26, 34, 0.9) 100%);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(30, 58, 66, 0.45);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .glass-card:hover {
      border-color: rgba(20, 184, 166, 0.45);
      box-shadow: 
        0 25px 50px -15px rgba(0, 0, 0, 0.5), 
        0 0 40px rgba(20, 184, 166, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
      transform: translateY(-6px);
    }

    .glass-card-subtle {
      background: rgba(10, 26, 34, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(30, 58, 66, 0.3);
      transition: all 0.4s ease;
    }

    /* === Gradient Border === */
    .gradient-border {
      position: relative;
      background: #0A1A22;
    }
    .gradient-border::before {
      content: "";
      position: absolute;
      inset: 0;
      padding: 1px;
      border-radius: inherit;
      background: linear-gradient(135deg, #14b8a6, #0891b2, #06b6d4, #2dd4bf);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0.6;
      transition: opacity 0.4s ease;
    }
    .gradient-border:hover::before {
      opacity: 1;
    }

    /* === Neon Effects === */
    .neon-text {
      text-shadow: 
        0 0 10px rgba(20, 184, 166, 0.6), 
        0 0 20px rgba(20, 184, 166, 0.4),
        0 0 40px rgba(20, 184, 166, 0.2);
    }

    .neon-border {
      box-shadow: 
        0 0 10px rgba(20, 184, 166, 0.3),
        inset 0 0 10px rgba(20, 184, 166, 0.1);
    }

    /* === Scrollbar === */
    .scrollbar-custom::-webkit-scrollbar { width: 6px; height: 6px; }
    .scrollbar-custom::-webkit-scrollbar-track { background: rgba(30, 58, 66, 0.2); border-radius: 10px; }
    .scrollbar-custom::-webkit-scrollbar-thumb { 
      background: linear-gradient(180deg, #14b8a6, #0891b2);
      border-radius: 10px;
    }
    .scrollbar-custom::-webkit-scrollbar-thumb:hover { background: #2dd4bf; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }

    /* === Hover Effects === */
    .hover-lift {
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
    }
    .hover-lift:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px -15px rgba(0, 0, 0, 0.4);
    }

    .hover-glow {
      transition: box-shadow 0.4s ease;
    }
    .hover-glow:hover {
      box-shadow: 0 0 40px rgba(20, 184, 166, 0.25);
    }

    .hover-scale {
      transition: transform 0.3s ease;
    }
    .hover-scale:hover {
      transform: scale(1.05);
    }

    /* === Ripple Container === */
    .ripple-container { position: relative; overflow: hidden; }
    .ripple-container .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(20, 184, 166, 0.35);
      animation: rippleEffect 0.7s linear;
      pointer-events: none;
    }

    /* === Background Patterns === */
    .dot-grid {
      background-image: radial-gradient(rgba(20, 184, 166, 0.08) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    .line-grid {
      background-image: 
        linear-gradient(rgba(20, 184, 166, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(20, 184, 166, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
    }

    /* === Noise Overlay === */
    .noise-overlay {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.015;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    /* === Scan Line Effect === */
    .scan-line::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.15), transparent);
      animation: scanLine 8s linear infinite;
    }

    /* === Status Badge === */
    .status-badge {
      position: relative;
      overflow: hidden;
    }
    .status-badge::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s ease;
    }
    .status-badge:hover::before {
      left: 100%;
    }

    /* === Focus Styles === */
    .focus-ring:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.3);
    }

    /* === Skeleton Loading === */
    .skeleton {
      background: linear-gradient(90deg, 
        rgba(30, 58, 66, 0.3) 0%, 
        rgba(30, 58, 66, 0.5) 50%, 
        rgba(30, 58, 66, 0.3) 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════════
   ANIMATED BACKGROUND COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const AnimatedBackground = () => {
  const particlesRef = useRef([]);
  
  useEffect(() => {
    particlesRef.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 8,
      opacity: Math.random() * 0.4 + 0.2
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main Gradient Orbs */}
      <div className="absolute -top-[30%] -left-[15%] w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] 
                      bg-gradient-to-br from-[#14b8a6]/15 via-[#0891b2]/10 to-transparent 
                      animate-morph blur-[100px]" />
      <div className="absolute -bottom-[25%] -right-[15%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px]
                      bg-gradient-to-tl from-[#6366f1]/10 via-[#14b8a6]/8 to-transparent 
                      animate-morph blur-[120px]" 
           style={{ animationDelay: '-12s' }} />
      <div className="absolute top-[25%] right-[5%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px]
                      bg-gradient-to-bl from-[#0891b2]/12 via-[#2dd4bf]/6 to-transparent 
                      animate-orb-float blur-[90px]" />
      <div className="absolute bottom-[20%] left-[10%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px]
                      bg-gradient-to-tr from-[#14b8a6]/8 to-transparent 
                      animate-orb-float blur-[80px]"
           style={{ animationDelay: '-8s' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 line-grid opacity-60" />
      
      {/* Floating Particles */}
      {particlesRef.current.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float-particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `rgba(20, 184, 166, ${particle.opacity})`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(20, 184, 166, 0.3)`
          }}
        />
      ))}
      
      {/* Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#03070A_75%)]" />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   CUSTOM HOOKS
   ═══════════════════════════════════════════════════════════════════ */
const useAnimatedCounter = (target, duration = 1800) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = null;
    
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      
      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };
    
    rafIdRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafIdRef.current);
  }, [target, duration]);

  return count;
};

const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

/* ═══════════════════════════════════════════════════════════════════
   STAT CARD COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const StatCard = ({ icon: Icon, label, value, trend, gradient, delay, accentIcon: AccentIcon, subtitle }) => {
  const animatedValue = useAnimatedCounter(value);
  const [ref, isVisible] = useIntersectionObserver();
  
  return (
    <div 
      ref={ref}
      className={`group relative glass-card rounded-3xl p-7 overflow-hidden cursor-default
                  ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background Glow Effect */}
      <div className={`absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br ${gradient} 
                      opacity-0 group-hover:opacity-25 blur-[70px] transition-all duration-700`} />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Accent Pattern */}
      <div className="absolute top-0 right-0 w-36 h-36 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        {AccentIcon && (
          <AccentIcon 
            size={120} 
            className="absolute -top-4 -right-4 animate-spin-slow" 
            style={{ animationDuration: '60s' }}
          />
        )}
      </div>
      
      {/* Scan Line */}
      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6]/30 to-transparent"
             style={{ animation: 'scanLine 3s linear infinite' }} />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg 
                          group-hover:scale-110 group-hover:rotate-3 transition-all duration-500
                          group-hover:shadow-xl`}>
            <Icon size={26} className="text-white" />
          </div>
          {trend && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                          bg-emerald-500/10 border border-emerald-500/25 
                          group-hover:bg-emerald-500/20 transition-all">
              <ArrowUpRight size={14} className="text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">{trend}</span>
            </div>
          )}
        </div>
        
        {/* Value */}
        <div className="mb-2">
          <h3 className="text-5xl font-black text-white tracking-tight animate-count-up" 
              style={{ animationDelay: `${delay + 200}ms` }}>
            {animatedValue.toLocaleString()}
          </h3>
          {subtitle && (
            <span className="text-sm text-gray-500 ml-1">{subtitle}</span>
          )}
        </div>
        
        {/* Label */}
        <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-4">{label}</p>
        
        {/* Progress Bar */}
        <div className="h-1.5 bg-[#1e3a42]/60 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out`}
            style={{ 
              width: isVisible ? `${Math.min(100, (value / 100) * 100)}%` : '0%',
              transitionDelay: `${delay + 400}ms`
            }}
          />
        </div>
      </div>
      
      {/* Bottom Accent Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   USER CARD COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const UserCard = ({ user, index, onView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [ref, isVisible] = useIntersectionObserver();

  const createRipple = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.className = 'ripple';
    
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }, []);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const getAvatarGradient = (name) => {
    const gradients = [
      'from-[#14b8a6] to-[#0891b2]',
      'from-[#6366f1] to-[#8b5cf6]',
      'from-[#f59e0b] to-[#ef4444]',
      'from-[#10b981] to-[#059669]',
      'from-[#ec4899] to-[#be185d]',
      'from-[#3b82f6] to-[#1d4ed8]',
    ];
    const index = name?.charCodeAt(0) % gradients.length || 0;
    return gradients[index];
  };

  return (
    <div
      ref={(el) => { cardRef.current = el; ref.current = el; }}
      className={`group relative glass-card rounded-3xl overflow-hidden ripple-container cursor-pointer
                  ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => { createRipple(e); onView(user.id); }}
    >
      {/* Top Gradient Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#14b8a6] via-[#0891b2] to-[#06b6d4] 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Hover Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br from-[#14b8a6]/5 via-transparent to-[#0891b2]/5 
                      transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className="relative z-10 p-6">
        <div className="flex items-start gap-5">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <div className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${getAvatarGradient(user.name)} p-0.5
                           group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
              <div className="w-full h-full rounded-2xl bg-[#0A1A22] flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {getInitials(user.name)}
                </span>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-[#0A1A22]
                            flex items-center justify-center shadow-lg
                            ${user.is_active !== false ? 'bg-emerald-500' : 'bg-gray-500'}`}>
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-dot-pulse" />
            </div>
            
            {/* Verified Badge */}
            {index < 3 && (
              <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 
                            flex items-center justify-center shadow-lg animate-bounce"
                   style={{ animationDuration: '3s' }}>
                <Crown size={14} className="text-white" />
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-white truncate group-hover:text-[#2dd4bf] transition-colors duration-300">
                {user.name}
              </h3>
              {user.is_fresher === false && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 
                               text-blue-400 text-[10px] font-bold uppercase">
                  Pro
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail size={13} className="flex-shrink-0 text-gray-500" />
              <span className="truncate">{user.email}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={11} className="text-gray-600" />
                {new Date(user.created_at).toLocaleDateString()}
              </span>
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-gray-600" />
                  {user.location}
                </span>
              )}
              {user.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={11} className="text-gray-600" />
                  {user.phone}
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button 
            className="p-3.5 rounded-2xl bg-[#14b8a6]/10 text-[#14b8a6] 
                      opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0
                      transition-all duration-400 hover:bg-[#14b8a6]/20 hover:scale-110
                      border border-transparent hover:border-[#14b8a6]/30"
            onClick={(e) => { e.stopPropagation(); onView(user.id); }}
          >
            <Eye size={20} />
          </button>
        </div>

        {/* Tags & Footer */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#1e3a42]/40">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`status-badge px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide
                            ${user.is_fresher 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/25'}`}>
              {user.is_fresher ? '🌱 Fresher' : '💼 Experienced'}
            </span>
            
            {user.headline && (
              <span className="px-3 py-1.5 rounded-xl text-xs bg-[#1e3a42]/40 text-gray-400 
                             border border-[#1e3a42]/30 truncate max-w-[150px]">
                {user.headline}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-[11px] text-gray-500 uppercase tracking-wider 
                        opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span>View Profile</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tl from-[#14b8a6]/5 to-transparent rounded-tl-full 
                       group-hover:from-[#14b8a6]/10 transition-all duration-500" />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SKELETON LOADER COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const SkeletonCard = ({ index }) => (
  <div 
    className="relative glass-card rounded-3xl p-6 overflow-hidden animate-fade-in"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex items-start gap-5">
      <div className="w-18 h-18 rounded-2xl skeleton" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-36 rounded-lg skeleton" />
        <div className="h-4 w-52 rounded-lg skeleton" />
        <div className="h-3 w-28 rounded-lg skeleton" />
      </div>
    </div>
    <div className="flex gap-3 mt-6 pt-5 border-t border-[#1e3a42]/30">
      <div className="h-8 w-24 rounded-xl skeleton" />
      <div className="h-8 w-20 rounded-xl skeleton" />
    </div>
    
    {/* Shimmer Overlay */}
    <div className="absolute inset-0 animate-shimmer" />
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   PROFILE MODAL COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */
const ProfileSection = ({ title, icon: Icon, children, delay = 0, collapsible = false }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div 
      className="glass-card rounded-2xl overflow-hidden animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div 
        className={`flex items-center justify-between gap-3 px-6 py-4 border-b border-[#1e3a42]/40 
                    bg-gradient-to-r from-[#14b8a6]/10 via-transparent to-transparent
                    ${collapsible ? 'cursor-pointer hover:from-[#14b8a6]/15' : ''}`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#14b8a6]/20 to-[#0891b2]/10 
                        group-hover:scale-110 transition-transform">
            <Icon size={20} className="text-[#14b8a6]" />
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        {collapsible && (
          <ChevronDown 
            size={20} 
            className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </div>
      <div className={`transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, icon: Icon, copyable = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (value && copyable) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group p-4 rounded-xl bg-[#0A1A22]/50 border border-[#1e3a42]/30 
                    hover:border-[#14b8a6]/30 hover:bg-[#0A1A22]/70 transition-all duration-300">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs mb-1.5 flex items-center gap-2 uppercase tracking-wider font-medium">
          {Icon && <Icon size={12} className="text-[#14b8a6]" />}
          {label}
        </p>
        {copyable && value && (
          <button 
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[#1e3a42]/50"
          >
            {copied ? (
              <CheckCircle size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} className="text-gray-500" />
            )}
          </button>
        )}
      </div>
      <p className="text-white font-medium group-hover:text-[#2dd4bf] transition-colors line-clamp-2">
        {value || <span className="text-gray-600 italic">Not provided</span>}
      </p>
    </div>
  );
};

const EducationCard = ({ title, icon: Icon, data, accentColor = '#14b8a6' }) => (
  <div className="p-5 rounded-xl bg-[#0A1A22]/50 border border-[#1e3a42]/30 
                  hover:border-[#14b8a6]/30 transition-all duration-300 group">
    <p className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: accentColor }}>
      <Icon size={16} className="group-hover:rotate-12 transition-transform" />
      {title}
    </p>
    <div className="grid grid-cols-2 gap-4">
      {data.map(({ label, value }) => (
        <div key={label}>
          <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-1 font-medium">{label}</p>
          <p className="text-white text-sm font-medium">
            {value || <span className="text-gray-600 italic">N/A</span>}
          </p>
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   SIDEBAR COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Sidebar = ({ isOpen, onToggle, activeItem, onNavigate, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, badge: null },
    { id: 'users', label: 'Users', icon: Users, badge: 'Live' },
    { id: 'courses', label: 'Courses', icon: BookOpen, badge: null },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, badge: '12' },
    { id: 'applications', label: 'Applications', icon: Award, badge: 'New' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen z-50 transition-all duration-500 ease-out
                  ${isOpen ? 'w-72' : 'w-22'} 
                  bg-gradient-to-b from-[#0A1A22]/98 via-[#0F2635]/95 to-[#0A1A22]/98 
                  backdrop-blur-2xl border-r border-[#1e3a42]/40`}
    >
      {/* Animated Side Accent */}
      <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#14b8a6]/30 to-transparent" />
      
      {/* Logo Section */}
      <div className="p-6 border-b border-[#1e3a42]/40">
        <div className={`flex items-center gap-4 ${!isOpen && 'justify-center'}`}>
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#0891b2] 
                          flex items-center justify-center shadow-lg shadow-[#14b8a6]/30 
                          animate-pulse-glow">
              <Shield size={26} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full 
                          border-2 border-[#0A1A22] animate-dot-pulse shadow-lg shadow-emerald-400/50" />
          </div>
          {isOpen && (
            <div className="animate-slide-left">
              <h1 className="text-2xl font-black animate-text-gradient">NexusAdmin</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-dot-pulse" />
                System Active
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-custom">
        {menuItems.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300
                       group relative overflow-hidden
                       ${item.id === activeItem
                         ? 'bg-gradient-to-r from-[#14b8a6]/20 via-[#14b8a6]/10 to-transparent text-[#2dd4bf] shadow-lg shadow-[#14b8a6]/10'
                         : 'text-gray-400 hover:text-white hover:bg-[#1e3a42]/30'
                       }`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Active Indicator */}
            {item.id === activeItem && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 
                            bg-gradient-to-b from-[#14b8a6] to-[#0891b2] rounded-r-full shadow-lg shadow-[#14b8a6]/50" />
            )}
            
            <div className={`p-2.5 rounded-xl transition-all duration-300
                            ${item.id === activeItem 
                              ? 'bg-[#14b8a6]/20' 
                              : 'group-hover:bg-[#1e3a42]/50'}`}>
              <item.icon size={22} className="group-hover:scale-110 transition-transform" />
            </div>
            
            {isOpen && (
              <>
                <span className="font-semibold flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold
                                  ${item.badge === 'Live' 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                    : item.badge === 'New'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-[#14b8a6]/20 text-[#14b8a6] border border-[#14b8a6]/30'}`}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
            
            {item.id === activeItem && isOpen && (
              <div className="w-2 h-2 rounded-full bg-[#14b8a6] shadow-lg shadow-[#14b8a6]/60 animate-dot-pulse" />
            )}
            
            {/* Hover Shimmer */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] 
                          transition-transform duration-700 bg-gradient-to-r from-transparent 
                          via-white/5 to-transparent pointer-events-none" />
          </button>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-[#1e3a42]/40 space-y-3">
        {isOpen && (
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#1e3a42]/30 to-transparent 
                        rounded-2xl animate-fade-in border border-[#1e3a42]/30">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 
                          flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Super Admin</p>
              <p className="text-xs text-gray-500 truncate">admin@nexus.io</p>
            </div>
            <button className="p-2 rounded-xl hover:bg-[#1e3a42]/50 text-gray-400 
                             hover:text-white transition-all hover:rotate-90 duration-300">
              <Settings size={18} />
            </button>
          </div>
        )}
        
        <button 
          onClick={onLogout} 
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl
                     text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300
                     border border-transparent hover:border-red-500/25 group
                     ${!isOpen && 'justify-center'}`}
        >
          <LogOut size={22} className="group-hover:rotate-12 transition-transform duration-300" />
          {isOpen && <span className="font-semibold">Logout</span>}
        </button>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={onToggle}
        className="absolute -right-4 top-28 w-8 h-14 bg-gradient-to-r from-[#0F2635] to-[#0A1A22] 
                  border border-[#1e3a42]/50 rounded-r-2xl flex items-center justify-center 
                  text-gray-400 hover:text-[#14b8a6] hover:border-[#14b8a6]/50 
                  transition-all z-50 shadow-lg group"
      >
        <ChevronRight 
          size={16} 
          className={`transition-transform duration-500 group-hover:scale-125 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
    </aside>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const admin = localStorage.getItem('admin_user');
    if (!admin) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?search=${search}`);
      const userData = res.data?.data?.data || res.data?.data || res.data || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleViewUser = async (userId) => {
    try {
      setProfileLoading(true);
      setShowUserModal(true);
      const res = await api.get(`/admin/users/${userId}`);
      setSelectedUser(res.data?.data || res.data);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setSelectedUser(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.assign('/login');
  };

  const navigateTo = (id) => {
    const routes = {
      dashboard: '/admin/dashboard',
      users: '/admin/users',
      courses: '/admin/courses',
      jobs: '/admin/jobs',
      applications: '/admin/applications',
    };
    navigate(routes[id]);
  };

  const filteredUsers = users.filter(user => {
    if (activeTab === 'fresher' && !user.is_fresher) return false;
    if (activeTab === 'experienced' && user.is_fresher) return false;
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortOrder === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortOrder === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const stats = [
    { 
      icon: Users, label: 'Total Users', value: users.length, 
      trend: '+12%', gradient: 'from-[#14b8a6] to-[#0891b2]', 
      accentIcon: Hexagon, subtitle: 'members' 
    },
    { 
      icon: UserCheck, label: 'Active Now', value: Math.floor(users.length * 0.35), 
      trend: '+8%', gradient: 'from-emerald-500 to-emerald-600', 
      accentIcon: Target, subtitle: 'online' 
    },
    { 
      icon: GraduationCap, label: 'Enrolled', value: Math.floor(users.length * 0.6), 
      gradient: 'from-violet-500 to-purple-600', 
      accentIcon: Diamond, subtitle: 'students' 
    },
    { 
      icon: Briefcase, label: 'Job Seekers', value: Math.floor(users.length * 0.45), 
      gradient: 'from-orange-500 to-amber-500', 
      accentIcon: Flame, subtitle: 'applicants' 
    },
  ];

  const tabCounts = {
    all: users.length,
    fresher: users.filter(u => u.is_fresher).length,
    experienced: users.filter(u => !u.is_fresher).length,
  };

  return (
    <div className="min-h-screen bg-[#03070A] text-gray-200 overflow-x-hidden">
      <InjectStyles />
      <AnimatedBackground />
      <div className="noise-overlay" />

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeItem="users"
        onNavigate={navigateTo}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className={`transition-all duration-500 min-h-screen ${sidebarOpen ? 'ml-72' : 'ml-22'}`}>
        <div className="max-w-[1800px] mx-auto p-8 space-y-8 relative z-10">
          
          {/* ═══════════════════════════════════════════════════════════════════
             HEADER SECTION
             ═══════════════════════════════════════════════════════════════════ */}
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-4 animate-slide-down">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Admin</span>
                <ChevronRight size={14} className="text-gray-600" />
                <span className="text-[#14b8a6] font-medium">User Management</span>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-[#14b8a6]/20 to-[#0891b2]/10 
                              border border-[#14b8a6]/25 animate-pulse-glow">
                  <Users size={32} className="text-[#14b8a6]" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                    User <span className="animate-text-gradient">Command</span>
                  </h1>
                  <p className="text-gray-400 mt-2 flex items-center gap-2 text-lg">
                    <Sparkles size={18} className="text-[#14b8a6] animate-bounce" style={{ animationDuration: '2s' }} />
                    Monitor and manage your community members
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 animate-slide-down" style={{ animationDelay: '100ms' }}>
              {/* Notification Bell */}
              <button className="relative p-3.5 rounded-2xl glass-card-subtle
                               text-gray-400 hover:text-white hover:border-[#14b8a6]/50 transition-all
                               hover:scale-105">
                <Bell size={22} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-dot-pulse" />
              </button>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`p-3.5 rounded-2xl glass-card-subtle
                           text-gray-400 hover:text-[#14b8a6] hover:border-[#14b8a6]/50 
                           transition-all duration-300 hover:scale-105 ${refreshing ? 'animate-spin-slow' : ''}`}
              >
                <RefreshCw size={22} />
              </button>
              
              {/* Sort Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-3.5 rounded-2xl glass-card-subtle
                                 text-gray-400 hover:text-white transition-all">
                  <Filter size={18} />
                  <span className="text-sm font-medium">Sort</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute top-full right-0 mt-2 w-44 py-2 glass-panel rounded-xl 
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                              transition-all duration-300 z-50 shadow-xl">
                  {[
                    { key: 'newest', label: 'Newest First' },
                    { key: 'oldest', label: 'Oldest First' },
                    { key: 'name', label: 'Name A-Z' },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setSortOrder(opt.key)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-all
                                ${sortOrder === opt.key 
                                  ? 'bg-[#14b8a6]/10 text-[#14b8a6]' 
                                  : 'text-gray-400 hover:text-white hover:bg-[#1e3a42]/30'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex glass-card-subtle rounded-2xl p-1.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-[#14b8a6] text-white shadow-lg shadow-[#14b8a6]/30' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-[#14b8a6] text-white shadow-lg shadow-[#14b8a6]/30' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
              
              {/* Add User Button */}
              <button className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl 
                               bg-gradient-to-r from-[#14b8a6] to-[#0891b2] text-white font-bold
                               shadow-lg shadow-[#14b8a6]/25 hover:shadow-[#14b8a6]/40 
                               hover:scale-105 transition-all duration-300 group">
                <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                <span>Add User</span>
              </button>
            </div>
          </header>

          {/* ═══════════════════════════════════════════════════════════════════
             STATS GRID
             ═══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatCard key={stat.label} {...stat} delay={idx * 120} />
            ))}
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
             SEARCH & FILTER SECTION
             ═══════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col lg:flex-row gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <div className={`absolute inset-0 bg-gradient-to-r from-[#14b8a6]/20 to-[#0891b2]/20 
                              rounded-2xl blur-xl transition-opacity duration-500 
                              ${searchFocused ? 'opacity-100' : 'opacity-0'}`} />
              <div className="relative flex items-center">
                <Search size={22} className={`absolute left-5 transition-all duration-300
                                             ${searchFocused ? 'text-[#14b8a6] scale-110' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search users by name, email, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-14 pr-14 py-5 bg-[#0F2635]/80 backdrop-blur-xl 
                           border border-[#1e3a42]/50 rounded-2xl text-white placeholder-gray-500 
                           focus:border-[#14b8a6]/50 focus:outline-none focus:ring-2 
                           focus:ring-[#14b8a6]/20 transition-all duration-300 text-lg"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-5 p-2 rounded-xl hover:bg-[#1e3a42]/50 
                             text-gray-400 hover:text-white transition-all hover:rotate-90 duration-300"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              {/* Animated Focus Line */}
              <div className={`absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-[#14b8a6] to-[#0891b2] 
                              rounded-full transition-all duration-500 -translate-x-1/2
                              ${searchFocused ? 'w-[95%] opacity-100' : 'w-0 opacity-0'}`} />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#0F2635]/80 border border-[#1e3a42]/50 rounded-2xl p-2">
              {[
                { key: 'all', label: 'All Users', icon: Users },
                { key: 'fresher', label: 'Freshers', icon: Sparkles },
                { key: 'experienced', label: 'Experienced', icon: Award },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300
                            flex items-center gap-2.5
                            ${activeTab === tab.key
                              ? 'bg-gradient-to-r from-[#14b8a6] to-[#0891b2] text-white shadow-lg shadow-[#14b8a6]/30'
                              : 'text-gray-400 hover:text-white hover:bg-[#1e3a42]/30'
                            }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold
                                  ${activeTab === tab.key 
                                    ? 'bg-white/20' 
                                    : 'bg-[#1e3a42]/60'}`}>
                    {tabCounts[tab.key]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
             RESULTS HEADER
             ═══════════════════════════════════════════════════════════════════ */}
          <div className="flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-gradient-to-b from-[#14b8a6] to-[#0891b2] rounded-full shadow-lg shadow-[#14b8a6]/30" />
              <h2 className="text-xl font-bold text-white">
                {activeTab === 'all' ? 'All Users' : activeTab === 'fresher' ? 'Fresher Users' : 'Experienced Users'}
              </h2>
              <span className="px-4 py-1.5 bg-[#1e3a42]/50 rounded-xl text-sm text-gray-400 font-semibold 
                             border border-[#1e3a42]/30">
                {filteredUsers.length} results
              </span>
            </div>
            
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Clock size={14} />
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
             USERS GRID/LIST
             ═══════════════════════════════════════════════════════════════════ */}
          {loading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 animate-scale-in">
              <div className="relative w-36 h-36 mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#14b8a6]/20 to-[#0891b2]/10 
                              rounded-full blur-2xl animate-pulse" />
                <div className="relative w-full h-full rounded-full bg-[#0F2635] border border-[#1e3a42]/50 
                              flex items-center justify-center">
                  <UserX size={56} className="text-gray-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">No Users Found</h3>
              <p className="text-gray-500 text-center max-w-md mb-8 text-lg">
                {search ? `No users matching "${search}"` : 'There are no registered users yet.'}
              </p>
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="px-8 py-4 rounded-2xl bg-[#14b8a6]/10 border border-[#14b8a6]/30 
                           text-[#14b8a6] font-bold hover:bg-[#14b8a6]/20 transition-all
                           hover:scale-105"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user, idx) => (
                <UserCard key={user.id} user={user} index={idx} onView={handleViewUser} />
              ))}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="glass-card rounded-3xl overflow-hidden animate-fade-in">
              <div className="overflow-x-auto scrollbar-custom">
                <table className="w-full">
                  <thead className="border-b border-[#1e3a42]/50 bg-[#0F2635]/50">
                    <tr>
                      {['#', 'User', 'Contact', 'Status', 'Joined', 'Actions'].map((header) => (
                        <th key={header} className="text-left px-6 py-5 text-gray-400 font-bold text-sm uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e3a42]/30">
                    {filteredUsers.map((user, idx) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-[#14b8a6]/5 transition-all duration-300 group cursor-pointer"
                        onClick={() => handleViewUser(user.id)}
                      >
                        <td className="px-6 py-5 text-gray-500 font-mono">{idx + 1}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#0891b2] 
                                          flex items-center justify-center text-white font-bold text-lg
                                          group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-bold group-hover:text-[#2dd4bf] transition-colors">
                                {user.name}
                              </p>
                              <p className="text-gray-500 text-sm">{user.headline || 'No headline'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                              <Mail size={13} /> {user.email}
                            </p>
                            {user.phone && (
                              <p className="text-gray-500 text-sm flex items-center gap-2">
                                <Phone size={13} /> {user.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`status-badge px-4 py-2 rounded-xl text-xs font-bold uppercase
                                          ${user.is_fresher
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                                          }`}>
                            {user.is_fresher ? '🌱 Fresher' : '💼 Experienced'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-gray-400 text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleViewUser(user.id); }}
                              className="p-3 rounded-xl bg-[#14b8a6]/10 text-[#14b8a6] 
                                       hover:bg-[#14b8a6]/20 hover:scale-110 transition-all duration-300
                                       border border-transparent hover:border-[#14b8a6]/30"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              className="p-3 rounded-xl bg-[#1e3a42]/30 text-gray-400
                                       hover:bg-[#1e3a42]/50 hover:text-white transition-all"
                            >
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination Info */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500 animate-fade-in">
              <span>Showing</span>
              <span className="px-3 py-1 bg-[#1e3a42]/50 rounded-lg text-[#14b8a6] font-bold">
                {filteredUsers.length}
              </span>
              <span>of</span>
              <span className="font-bold text-white">{users.length}</span>
              <span>users</span>
            </div>
          )}
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
         USER PROFILE MODAL
         ═══════════════════════════════════════════════════════════════════ */}
      {showUserModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-lg animate-fade-in"
            onClick={() => { setShowUserModal(false); setSelectedUser(null); }}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden animate-modal-reveal">
            <div className="bg-gradient-to-br from-[#0A1A22] via-[#0F2635] to-[#0A1A22] 
                          border border-[#1e3a42]/50 rounded-3xl shadow-2xl shadow-[#14b8a6]/10">
              
              {/* Gradient Top Border */}
              <div className="h-1.5 w-full animate-border-flow rounded-t-3xl" />
              
              {/* Modal Header */}
              <div className="relative px-8 py-6 border-b border-[#1e3a42]/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#14b8a6] to-[#0891b2] p-0.5
                                    shadow-xl shadow-[#14b8a6]/30 animate-pulse-glow">
                        <div className="w-full h-full rounded-3xl bg-[#0A1A22] flex items-center justify-center 
                                      text-3xl font-black text-white">
                          {selectedUser?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 
                                    border-3 border-[#0A1A22] flex items-center justify-center shadow-lg">
                        <Zap size={14} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white mb-1">
                        {selectedUser?.name || 'User Profile'}
                      </h2>
                      <p className="text-gray-400 flex items-center gap-2 text-lg">
                        <Mail size={16} />
                        {selectedUser?.email || 'Loading...'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="p-3 rounded-xl bg-[#1e3a42]/30 text-gray-400 
                                     hover:text-[#14b8a6] hover:bg-[#1e3a42]/50 transition-all">
                      <Download size={20} />
                    </button>
                    <button className="p-3 rounded-xl bg-[#1e3a42]/30 text-gray-400 
                                     hover:text-[#14b8a6] hover:bg-[#1e3a42]/50 transition-all">
                      <ExternalLink size={20} />
                    </button>
                    <button
                      onClick={() => { setShowUserModal(false); setSelectedUser(null); }}
                      className="p-3 rounded-xl bg-[#1e3a42]/30 text-gray-400 hover:text-white 
                               hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 
                               hover:rotate-90 border border-transparent"
                    >
                      <X size={22} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 max-h-[calc(92vh-180px)] overflow-y-auto scrollbar-custom">
                {profileLoading ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 border-4 border-[#14b8a6]/20 border-t-[#14b8a6] 
                                    rounded-full animate-spin" />
                      <div className="absolute inset-3 border-4 border-[#0891b2]/20 border-b-[#0891b2] 
                                    rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
                      <div className="absolute inset-6 border-4 border-[#2dd4bf]/20 border-t-[#2dd4bf] 
                                    rounded-full animate-spin" style={{ animationDuration: '2s' }} />
                    </div>
                    <p className="text-gray-400 text-lg">Loading complete profile...</p>
                  </div>
                ) : selectedUser ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <ProfileSection title="Personal Information" icon={Users} delay={0}>
                      <div className="grid grid-cols-2 gap-4">
                        <InfoItem label="Full Name" value={selectedUser.name} copyable />
                        <InfoItem label="Email" value={selectedUser.email} icon={Mail} copyable />
                        <InfoItem label="Phone" value={selectedUser.phone} icon={Phone} copyable />
                        <InfoItem label="Date of Birth" value={selectedUser.date_of_birth ? new Date(selectedUser.date_of_birth).toLocaleDateString() : null} />
                        <InfoItem label="Gender" value={selectedUser.gender} />
                        <InfoItem label="Nationality" value={selectedUser.nationality} icon={Globe} />
                        <InfoItem label="Location" value={selectedUser.location} icon={MapPin} />
                        <InfoItem label="Marital Status" value={selectedUser.marital_status} />
                        <div className="col-span-2">
                          <InfoItem label="Professional Headline" value={selectedUser.headline} />
                        </div>
                        <div className="col-span-2">
                          <InfoItem label="Bio" value={selectedUser.bio} />
                        </div>
                      </div>
                    </ProfileSection>

                    {/* Educational Background */}
                    <ProfileSection title="Educational Background" icon={GraduationCap} delay={100} collapsible>
                      <div className="space-y-4">
                        <EducationCard 
                          title="SSC Information" 
                          icon={BookOpen}
                          data={[
                            { label: 'School', value: selectedUser.school_name },
                            { label: 'Year', value: selectedUser.ssc_year },
                            { label: 'Result', value: selectedUser.ssc_result },
                            { label: 'Board', value: selectedUser.ssc_board },
                          ]}
                        />
                        <EducationCard 
                          title="HSC Information" 
                          icon={BookOpen}
                          accentColor="#0891b2"
                          data={[
                            { label: 'College', value: selectedUser.college_name },
                            { label: 'Year', value: selectedUser.hsc_year },
                            { label: 'Result', value: selectedUser.hsc_result },
                            { label: 'Board', value: selectedUser.hsc_board },
                          ]}
                        />
                        <EducationCard 
                          title="University Information" 
                          icon={GraduationCap}
                          accentColor="#2dd4bf"
                          data={[
                            { label: 'University', value: selectedUser.university_name },
                            { label: 'Status', value: selectedUser.university_status },
                            { label: 'CGPA', value: selectedUser.university_cgpa },
                            { label: 'Graduation', value: selectedUser.university_graduation_year },
                          ]}
                        />
                      </div>
                    </ProfileSection>

                    {/* Professional Experience */}
                    <ProfileSection title="Professional Experience" icon={Briefcase} delay={200}>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-5 rounded-2xl 
                                      bg-gradient-to-r from-[#14b8a6]/10 via-transparent to-transparent 
                                      border border-[#14b8a6]/25">
                          <span className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg
                                         ${selectedUser.is_fresher 
                                           ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30' 
                                           : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30'}`}>
                            {selectedUser.is_fresher ? '🌱 Fresher' : '💼 Experienced'}
                          </span>
                          <span className="text-gray-400 font-medium">
                            {selectedUser.years_of_experience || 0} years of experience
                          </span>
                        </div>
                        
                        {!selectedUser.is_fresher && (
                          <div className="grid grid-cols-2 gap-4">
                            <InfoItem label="Current Job Title" value={selectedUser.current_job_title} />
                            <InfoItem label="Current Company" value={selectedUser.current_company} icon={Building2} />
                            <InfoItem label="Previous Job Title" value={selectedUser.previous_job_title} />
                            <InfoItem label="Previous Company" value={selectedUser.previous_company} />
                          </div>
                        )}
                      </div>
                    </ProfileSection>

                    {/* Skills */}
                    <ProfileSection title="Skills & Expertise" icon={Code} delay={300}>
                      <div className="flex flex-wrap gap-3">
                        {(selectedUser.skills || []).length > 0 ? (
                          selectedUser.skills.map((skill, idx) => (
                            <span 
                              key={skill.id} 
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#14b8a6]/15 to-[#0891b2]/10 
                                       text-[#2dd4bf] text-sm font-semibold border border-[#14b8a6]/30 
                                       hover:scale-105 hover:border-[#14b8a6]/50 transition-all cursor-default
                                       animate-slide-up shadow-sm"
                              style={{ animationDelay: `${idx * 60}ms` }}
                            >
                              {skill.skill_name}
                              {skill.proficiency && (
                                <span className="text-gray-500 ml-2 text-xs font-medium">• {skill.proficiency}</span>
                              )}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm italic">No skills added yet.</p>
                        )}
                      </div>
                    </ProfileSection>

                    {/* Applications */}
                    <ProfileSection title={`Job Applications (${(selectedUser.applications || []).length})`} icon={Award} delay={400} collapsible>
                      <div className="space-y-3 max-h-52 overflow-y-auto scrollbar-custom">
                        {(selectedUser.applications || []).length > 0 ? (
                          selectedUser.applications.map((app, idx) => (
                            <div 
                              key={app.id} 
                              className="p-4 rounded-xl bg-[#0A1A22]/50 border border-[#1e3a42]/30 
                                       hover:border-[#14b8a6]/30 transition-all animate-slide-up
                                       flex items-center justify-between"
                              style={{ animationDelay: `${idx * 60}ms` }}
                            >
                              <div>
                                <p className="text-white font-semibold">{app.job?.title || 'Job'}</p>
                                <p className="text-gray-500 text-sm">{app.job?.company || 'Company'}</p>
                              </div>
                              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase
                                             ${app.status === 'pending' 
                                               ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' 
                                               : app.status === 'accepted'
                                               ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                               : 'bg-red-500/15 text-red-400 border border-red-500/25'}`}>
                                {app.status}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm text-center py-6 italic">No applications yet.</p>
                        )}
                      </div>
                    </ProfileSection>

                    {/* Enrollments */}
                    <ProfileSection title={`Course Enrollments (${(selectedUser.enrollments || []).length})`} icon={BookOpen} delay={500} collapsible>
                      <div className="space-y-3 max-h-52 overflow-y-auto scrollbar-custom">
                        {(selectedUser.enrollments || []).length > 0 ? (
                          selectedUser.enrollments.map((enroll, idx) => (
                            <div 
                              key={enroll.id} 
                              className="p-4 rounded-xl bg-[#0A1A22]/50 border border-[#1e3a42]/30 
                                       hover:border-[#14b8a6]/30 transition-all flex items-center gap-4 
                                       animate-slide-up"
                              style={{ animationDelay: `${idx * 60}ms` }}
                            >
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 
                                            flex items-center justify-center border border-violet-500/20">
                                <BookOpen size={20} className="text-violet-400" />
                              </div>
                              <div>
                                <p className="text-white font-semibold">{enroll.course?.name || 'Course'}</p>
                                <p className="text-gray-500 text-sm">Level: {enroll.course?.level || 'N/A'}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm text-center py-6 italic">No enrollments yet.</p>
                        )}
                      </div>
                    </ProfileSection>

                    {/* Account Info - Full Width */}
                    <div className="lg:col-span-2">
                      <ProfileSection title="Account Information" icon={Shield} delay={600}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <InfoItem label="User ID" value={`#${selectedUser.id}`} icon={Hash} copyable />
                          <InfoItem label="Member Since" value={new Date(selectedUser.created_at).toLocaleDateString()} icon={Calendar} />
                          <InfoItem label="Last Updated" value={new Date(selectedUser.updated_at).toLocaleDateString()} icon={Clock} />
                          <InfoItem label="Account Status" value="Active" icon={CheckCircle} />
                        </div>
                      </ProfileSection>
                    </div>

                    {/* Notice - Full Width */}
                    <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '700ms' }}>
                      <div className="flex items-center gap-5 p-6 rounded-2xl 
                                    bg-gradient-to-r from-[#14b8a6]/10 via-[#14b8a6]/5 to-transparent 
                                    border border-[#14b8a6]/20">
                        <div className="p-4 rounded-2xl bg-[#14b8a6]/15 animate-bounce" style={{ animationDuration: '3s' }}>
                          <Sparkles size={24} className="text-[#14b8a6]" />
                        </div>
                        <p className="text-gray-400">
                          This is a <span className="text-white font-semibold">read-only view</span> of the user profile. 
                          Administrative modifications require additional permissions and audit logging.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-28 h-28 rounded-full bg-red-500/10 flex items-center justify-center mb-6 
                                  border border-red-500/20 animate-wiggle">
                      <XCircle size={48} className="text-red-400" />
                    </div>
                    <p className="text-red-400 font-bold text-xl">Failed to load profile</p>
                    <p className="text-gray-500 text-sm mt-2">Please try again later</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}