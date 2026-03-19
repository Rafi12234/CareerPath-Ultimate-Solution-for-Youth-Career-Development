import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  X, Send, Loader2, Upload, FileUp, Sparkles, AlertCircle, CheckCircle,
  ChevronRight, ChevronLeft, FileText, User, Briefcase, GraduationCap,
  Zap, Shield, Users, Globe, Plus, Trash2, Edit3, Check, Star,
  ArrowRight, Rocket, Brain, Target, Award, Clock, MapPin, Building2,
  Phone, Mail, Calendar, Flag, Link, Github, Linkedin, ExternalLink,
  MessageSquare, HelpCircle, ChevronDown, Hexagon, Layers, Wand2
} from 'lucide-react';
import api from '../utils/api';

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
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn { 0% { opacity: 0; transform: scale(0.5); } 60% { transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes checkmark { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }
    @keyframes expandWidth { from { width: 0; } }
    @keyframes ripple { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(2.5); opacity: 0; } }
    @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(20,184,166,0.3); } 50% { box-shadow: 0 0 40px rgba(20,184,166,0.6); } }
    @keyframes textGlow { 0%, 100% { text-shadow: 0 0 20px rgba(20,184,166,0.5); } 50% { text-shadow: 0 0 40px rgba(20,184,166,0.8); } }
    @keyframes stepPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(20,184,166,0.4); } 50% { box-shadow: 0 0 0 10px rgba(20,184,166,0); } }
    @keyframes uploadPulse { 0%, 100% { border-color: rgba(20,184,166,0.3); } 50% { border-color: rgba(20,184,166,0.6); } }
    @keyframes iconBounce { 0%, 100% { transform: scale(1) rotate(0); } 25% { transform: scale(1.2) rotate(-10deg); } 75% { transform: scale(1.2) rotate(10deg); } }
    @keyframes successRipple { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
    @keyframes typewriter { from { width: 0; } to { width: 100%; } }
    @keyframes dotPulse { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
    @keyframes slideInStep { from { opacity: 0; transform: translateX(100px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }
    @keyframes slideOutStep { from { opacity: 1; transform: translateX(0) scale(1); } to { opacity: 0; transform: translateX(-100px) scale(0.95); } }
    @keyframes modalReveal { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes inputFocus { 0% { box-shadow: 0 0 0 0 rgba(20,184,166,0.4); } 100% { box-shadow: 0 0 0 4px rgba(20,184,166,0.1); } }
    @keyframes labelFloat { from { top: 50%; font-size: 1rem; } to { top: 0; font-size: 0.75rem; } }
    @keyframes progressPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
    @keyframes confetti { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(-200px) rotate(720deg); opacity: 0; } }
    @keyframes orbit { from { transform: rotate(0deg) translateX(80px) rotate(0deg); } to { transform: rotate(360deg) translateX(80px) rotate(-360deg); } }
    @keyframes waveMove { 0% { transform: translateX(0) translateY(0); } 50% { transform: translateX(-25%) translateY(10px); } 100% { transform: translateX(-50%) translateY(0); } }

    .morph-blob { animation: morphBlob 20s ease-in-out infinite; }
    .float { animation: float 8s ease-in-out infinite; }
    .float-reverse { animation: floatReverse 7s ease-in-out infinite; }
    .pulse { animation: pulse 3s ease-in-out infinite; }
    .spin-slow { animation: spin 20s linear infinite; }
    .bounce { animation: bounce 2s ease-in-out infinite; }
    .glow { animation: glow 3s ease-in-out infinite; }
    .text-glow { animation: textGlow 3s ease-in-out infinite; }
    .step-pulse { animation: stepPulse 2s ease-in-out infinite; }

    .slide-up { animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
    .slide-down { animation: slideDown 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
    .slide-left { animation: slideLeft 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
    .slide-right { animation: slideRight 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
    .scale-in { animation: scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
    .fade-in { animation: fadeIn 0.6s ease forwards; }
    .pop-in { animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    .modal-reveal { animation: modalReveal 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
    .slide-in-step { animation: slideInStep 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }

    .gradient-text {
      background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 25%, #2dd4bf 50%, #14b8a6 75%, #06b6d4 100%);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradientFlow 6s ease infinite;
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

    .glass-light {
      background: rgba(20,40,50,0.5);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(30,58,66,0.25);
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
      transform: translateY(-4px);
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

    .btn-secondary {
      background: rgba(30,58,66,0.4);
      border: 1px solid rgba(30,58,66,0.6);
      transition: all 0.3s ease;
    }
    .btn-secondary:hover {
      background: rgba(30,58,66,0.6);
      border-color: rgba(20,184,166,0.3);
      transform: translateY(-1px);
    }

    .btn-ai {
      background: linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(168,85,247,0.2) 100%);
      border: 1px solid rgba(139,92,246,0.3);
      transition: all 0.3s ease;
    }
    .btn-ai:hover {
      background: linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(168,85,247,0.3) 100%);
      border-color: rgba(139,92,246,0.5);
      transform: translateY(-2px);
      box-shadow: 0 10px 30px -10px rgba(139,92,246,0.3);
    }

    .input-field {
      background: rgba(10,26,34,0.6);
      border: 1px solid rgba(30,58,66,0.5);
      transition: all 0.3s ease;
    }
    .input-field:focus {
      border-color: rgba(20,184,166,0.5);
      box-shadow: 0 0 0 3px rgba(20,184,166,0.1), 0 0 20px rgba(20,184,166,0.1);
      background: rgba(10,26,34,0.8);
    }
    .input-field:hover:not(:focus) {
      border-color: rgba(30,58,66,0.8);
    }

    .input-group {
      position: relative;
    }
    .input-group .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #4b5563;
      transition: color 0.3s;
      pointer-events: none;
    }
    .input-group input:focus + .input-icon,
    .input-group textarea:focus + .input-icon {
      color: #14b8a6;
    }

    .upload-zone {
      border: 2px dashed rgba(30,58,66,0.6);
      transition: all 0.3s ease;
    }
    .upload-zone:hover, .upload-zone.dragging {
      border-color: rgba(20,184,166,0.5);
      background: rgba(20,184,166,0.05);
    }
    .upload-zone.has-file {
      border-color: rgba(16,185,129,0.5);
      background: rgba(16,185,129,0.05);
    }

    .progress-bar {
      animation: expandWidth 1s cubic-bezier(0.16,1,0.3,1) forwards;
    }

    .step-indicator {
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    }
    .step-indicator.active {
      animation: stepPulse 2s ease-in-out infinite;
    }
    .step-indicator.completed {
      background: linear-gradient(135deg, #14b8a6, #10b981);
    }

    .skill-tag {
      transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .skill-tag:hover {
      transform: translateY(-2px) scale(1.03);
    }

    .reference-card {
      transition: all 0.3s ease;
    }
    .reference-card:hover {
      transform: translateX(4px);
      border-left-color: rgba(20,184,166,0.6);
    }

    .checkbox-custom {
      appearance: none;
      width: 22px;
      height: 22px;
      border: 2px solid rgba(30,58,66,0.6);
      border-radius: 6px;
      background: rgba(10,26,34,0.6);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }
    .checkbox-custom:checked {
      background: linear-gradient(135deg, #14b8a6, #10b981);
      border-color: #14b8a6;
    }
    .checkbox-custom:checked::after {
      content: '';
      position: absolute;
      left: 6px;
      top: 2px;
      width: 6px;
      height: 12px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    .checkbox-custom:hover {
      border-color: rgba(20,184,166,0.5);
    }

    .radio-custom {
      appearance: none;
      width: 22px;
      height: 22px;
      border: 2px solid rgba(30,58,66,0.6);
      border-radius: 50%;
      background: rgba(10,26,34,0.6);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }
    .radio-custom:checked {
      border-color: #14b8a6;
    }
    .radio-custom:checked::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: linear-gradient(135deg, #14b8a6, #10b981);
    }
    .radio-custom:hover {
      border-color: rgba(20,184,166,0.5);
    }

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

    .stagger-1 { animation-delay: 0.05s; }
    .stagger-2 { animation-delay: 0.1s; }
    .stagger-3 { animation-delay: 0.15s; }
    .stagger-4 { animation-delay: 0.2s; }
    .stagger-5 { animation-delay: 0.25s; }
    .stagger-6 { animation-delay: 0.3s; }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════
   ANIMATED BACKGROUND
   ═══════════════════════════════════════════════════════════════ */
const AnimatedBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #030810 0%, #0A1620 40%, #071018 100%)' }} />
    <div className="morph-blob absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#14b8a6] opacity-[0.02]" />
    <div className="morph-blob absolute top-1/3 -right-32 w-[400px] h-[400px] bg-[#06b6d4] opacity-[0.02]" style={{ animationDelay: '-7s' }} />
    <div className="morph-blob absolute -bottom-32 left-1/4 w-[450px] h-[450px] bg-[#2dd4bf] opacity-[0.015]" style={{ animationDelay: '-14s' }} />
    <div className="float absolute top-20 left-[15%] w-48 h-48 rounded-full bg-gradient-to-br from-[#14b8a6]/10 to-transparent blur-3xl" />
    <div className="float-reverse absolute bottom-32 right-[10%] w-64 h-64 rounded-full bg-gradient-to-tl from-[#06b6d4]/8 to-transparent blur-3xl" style={{ animationDelay: '-4s' }} />
    <div className="dot-pattern absolute inset-0 opacity-50" />
    <div className="wave-bg opacity-50">
      <div className="wave" />
      <div className="wave" style={{ animationDelay: '-5s', opacity: 0.5 }} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   UTILITY HOOKS
   ═══════════════════════════════════════════════════════════════ */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

// Step Progress Indicator
const StepProgress = ({ currentStep, totalSteps, stepLabels }) => {
  return (
    <div className="mb-10">
      {/* Progress Bar */}
      <div className="relative h-2 bg-[rgba(30,58,66,0.4)] rounded-full overflow-hidden mb-6">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] rounded-full blur-sm opacity-50 transition-all duration-700"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-between relative">
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;
          
          return (
            <div key={index} className="flex flex-col items-center relative z-10">
              <div className={`
                step-indicator w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold mb-2
                ${isCompleted ? 'completed text-white shadow-lg shadow-[#14b8a6]/30' : 
                  isActive ? 'active bg-[#14b8a6] text-white shadow-lg shadow-[#14b8a6]/40' : 
                  'bg-[rgba(30,58,66,0.4)] text-gray-500'}
              `}>
                {isCompleted ? <Check size={20} /> : stepNum}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-[#14b8a6]' : isCompleted ? 'text-[#10b981]' : 'text-gray-500'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Animated Input Field
const AnimatedInput = ({ icon: Icon, label, type = 'text', value, onChange, placeholder, className = '', ...props }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  
  return (
    <div className={`relative group ${className}`}>
      <div className="input-group">
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`
            input-field w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 rounded-xl text-white placeholder-gray-500 outline-none
          `}
          {...props}
        />
        {Icon && <Icon size={18} className="input-icon" />}
      </div>
      {label && (
        <label className={`
          absolute left-${Icon ? '12' : '4'} transition-all duration-300 pointer-events-none
          ${focused || hasValue ? '-top-2.5 text-xs bg-[#0A1620] px-2 text-[#14b8a6]' : 'top-4 text-gray-500'}
        `}>
          {label}
        </label>
      )}
      {focused && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent rounded-full" />
      )}
    </div>
  );
};

// Animated Textarea
const AnimatedTextarea = ({ icon: Icon, label, value, onChange, placeholder, rows = 4, className = '' }) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className={`relative ${className}`}>
      <textarea
        value={value || ''}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={rows}
        className="input-field w-full px-4 py-4 rounded-xl text-white placeholder-gray-500 outline-none resize-none"
      />
      {focused && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent rounded-full" />
      )}
    </div>
  );
};

// Section Header
const SectionHeader = ({ icon: Icon, title, subtitle, color = '#14b8a6' }) => (
  <div className="flex items-center gap-4 mb-8">
    <div 
      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
      style={{ background: `${color}15` }}
    >
      <Icon size={26} style={{ color }} />
    </div>
    <div>
      <h2 className="text-2xl font-black text-white">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// Skill Tag
const SkillTag = ({ skill, onRemove, index }) => (
  <div 
    className="skill-tag inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14b8a6]/15 border border-[#14b8a6]/30 pop-in"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <Zap size={14} className="text-[#14b8a6]" />
    <span className="text-sm font-medium text-[#2dd4bf]">{skill}</span>
    <button 
      onClick={onRemove}
      className="w-5 h-5 rounded-full bg-[rgba(239,68,68,0.2)] flex items-center justify-center hover:bg-[rgba(239,68,68,0.3)] transition-colors"
    >
      <X size={12} className="text-red-400" />
    </button>
  </div>
);

// Education Card
const EducationCard = ({ title, data, icon: Icon }) => (
  <div className="glass-light rounded-2xl p-5 hover-glow transition-all duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/15 flex items-center justify-center">
        <Icon size={18} className="text-[#14b8a6]" />
      </div>
      <h4 className="text-lg font-bold text-white">{title}</h4>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(data).map(([key, value], i) => (
        <div key={i} className={key.includes('name') || key.includes('Name') ? 'col-span-2' : ''}>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {key.replace(/_/g, ' ')}
          </p>
          <p className="text-white font-medium">{value || 'N/A'}</p>
        </div>
      ))}
    </div>
  </div>
);

// Reference Card
const ReferenceCard = ({ reference, index, onUpdate, onRemove }) => (
  <div className="reference-card glass-light rounded-2xl p-5 border-l-4 border-[rgba(30,58,66,0.6)]">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/15 flex items-center justify-center">
          <User size={18} className="text-[#06b6d4]" />
        </div>
        <span className="text-sm font-bold text-white">Reference #{index + 1}</span>
      </div>
      <button 
        onClick={onRemove}
        className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors"
      >
        <Trash2 size={14} className="text-red-400" />
      </button>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <AnimatedInput 
        icon={User}
        placeholder="Full Name"
        value={reference.name}
        onChange={(e) => onUpdate('name', e.target.value)}
      />
      <AnimatedInput 
        icon={Briefcase}
        placeholder="Relationship"
        value={reference.relationship}
        onChange={(e) => onUpdate('relationship', e.target.value)}
      />
      <AnimatedInput 
        icon={Mail}
        type="email"
        placeholder="Email"
        value={reference.email}
        onChange={(e) => onUpdate('email', e.target.value)}
      />
      <AnimatedInput 
        icon={Phone}
        type="tel"
        placeholder="Phone"
        value={reference.phone}
        onChange={(e) => onUpdate('phone', e.target.value)}
      />
    </div>
  </div>
);

// File Upload Zone
const FileUploadZone = ({ file, onUpload }) => {
  const [dragging, setDragging] = useState(false);
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onUpload({ target: { files: [droppedFile] } });
    }
  };
  
  return (
    <div
      className={`upload-zone rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={onUpload}
        accept=".pdf,.doc,.docx"
        className="hidden"
        id="resume-upload"
      />
      <label htmlFor="resume-upload" className="cursor-pointer block">
        <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center transition-all duration-300 ${file ? 'bg-emerald-500/15' : 'bg-[#14b8a6]/15'}`}>
          {file ? (
            <CheckCircle size={36} className="text-emerald-400" />
          ) : (
            <Upload size={36} className="text-[#14b8a6]" />
          )}
        </div>
        
        {file ? (
          <div className="space-y-2">
            <p className="text-emerald-400 font-bold text-lg flex items-center justify-center gap-2">
              <FileText size={20} />
              {file.name}
            </p>
            <p className="text-gray-500 text-sm">Click or drag to replace</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-white font-bold text-lg">Drop your resume here</p>
            <p className="text-gray-500">or click to browse</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              {['PDF', 'DOC', 'DOCX'].map((format) => (
                <span key={format} className="px-3 py-1 rounded-full bg-[rgba(30,58,66,0.4)] text-xs text-gray-400">
                  {format}
                </span>
              ))}
            </div>
          </div>
        )}
      </label>
    </div>
  );
};

// AI Modal
const AIModal = ({ show, onClose, onGenerate, generating }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-reveal relative glass rounded-3xl p-8 max-w-lg w-full">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#14b8a6]/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
                <Wand2 size={24} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">AI Cover Letter</h3>
                <p className="text-sm text-gray-500">Powered by GPT</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl glass-dark flex items-center justify-center hover:bg-[rgba(30,58,66,0.6)] transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          
          <div className="glass-dark rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/15 flex items-center justify-center shrink-0">
                <Brain size={20} className="text-[#14b8a6]" />
              </div>
              <div>
                <p className="text-gray-300 leading-relaxed">
                  I'll analyze the <span className="text-[#14b8a6] font-semibold">job requirements</span> and your <span className="text-[#14b8a6] font-semibold">profile</span> to craft a compelling, personalized cover letter that highlights your strengths.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn-secondary flex-1 px-6 py-4 rounded-xl text-white font-bold"
            >
              Cancel
            </button>
            <button
              onClick={onGenerate}
              disabled={generating}
              className="btn-ai flex-1 px-6 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Screen
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <AnimatedBackground />
    <div className="relative z-10 text-center">
      <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#14b8a6]/20 spin-slow" />
        <div className="absolute inset-4 rounded-full border-2 border-[#06b6d4]/30 pulse" />
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#14b8a6]/20 to-[#06b6d4]/10 flex items-center justify-center">
          <FileText size={32} className="text-[#14b8a6] float" />
        </div>
      </div>
      <h2 className="text-2xl font-black text-white mb-2">Loading Application</h2>
      <p className="text-gray-400">Preparing your form...</p>
      <div className="flex justify-center gap-2 mt-6 loading-dots">
        <span className="w-3 h-3 rounded-full bg-[#14b8a6]" />
        <span className="w-3 h-3 rounded-full bg-[#06b6d4]" />
        <span className="w-3 h-3 rounded-full bg-[#2dd4bf]" />
      </div>
    </div>
  </div>
);

// Error Screen
const ErrorScreen = ({ error, onBack, onDashboard, showDashboard }) => (
  <div className="min-h-screen flex items-center justify-center p-6">
    <AnimatedBackground />
    <div className="relative z-10 glass rounded-3xl p-10 text-center max-w-xl w-full scale-in">
      <div className="w-24 h-24 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={48} className="text-red-400" />
      </div>
      <h2 className="text-2xl font-black text-white mb-3">Unable to Proceed</h2>
      <p className="text-red-300 mb-8 leading-relaxed">{error}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onBack} className="btn-primary px-8 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2">
          <ChevronLeft size={18} />
          <span className="relative z-10">Back to Jobs</span>
        </button>
        {showDashboard && (
          <button onClick={onDashboard} className="btn-secondary px-8 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2">
            <Layers size={18} />
            View Applications
          </button>
        )}
      </div>
    </div>
  </div>
);

// Success Message
const SuccessMessage = ({ message }) => (
  <div className="glass rounded-2xl p-5 border border-emerald-500/30 flex items-start gap-4 mb-6 slide-down">
    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
      <CheckCircle size={24} className="text-emerald-400" />
    </div>
    <div>
      <p className="text-emerald-400 font-bold">Success!</p>
      <p className="text-gray-300">{message}</p>
    </div>
  </div>
);

// Error Message
const ErrorMessage = ({ message }) => (
  <div className="glass rounded-2xl p-5 border border-red-500/30 flex items-start gap-4 mb-6 slide-down">
    <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
      <AlertCircle size={24} className="text-red-400" />
    </div>
    <div>
      <p className="text-red-400 font-bold">Error</p>
      <p className="text-gray-300">{message}</p>
    </div>
  </div>
);

// Status Message
const StatusMessage = ({ message }) => (
  <div className="glass rounded-2xl p-5 border border-blue-500/30 flex items-center gap-4 mb-6 slide-down">
    <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
      <Loader2 size={24} className="text-blue-400 animate-spin" />
    </div>
    <div>
      <p className="text-blue-400 font-bold">Processing</p>
      <p className="text-gray-300">{message}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   STEP COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

// Step 1: Personal Info
const PersonalInfoStep = ({ form, updateForm }) => {
  const [ref, visible] = useInView();
  
  return (
    <div ref={ref} className={`space-y-6 ${visible ? 'slide-in-step' : 'opacity-0'}`}>
      <SectionHeader icon={User} title="Personal Information" subtitle="Tell us about yourself" />
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <AnimatedInput
            icon={User}
            placeholder="Full Name"
            value={form.personal_info.full_name}
            onChange={(e) => updateForm('personal_info', { ...form.personal_info, full_name: e.target.value })}
          />
        </div>
        <AnimatedInput
          icon={Mail}
          type="email"
          placeholder="Email Address"
          value={form.personal_info.email}
          onChange={(e) => updateForm('personal_info', { ...form.personal_info, email: e.target.value })}
        />
        <AnimatedInput
          icon={Phone}
          type="tel"
          placeholder="Phone Number"
          value={form.personal_info.phone}
          onChange={(e) => updateForm('personal_info', { ...form.personal_info, phone: e.target.value })}
        />
        <div className="md:col-span-2">
          <AnimatedInput
            icon={MapPin}
            placeholder="Address"
            value={form.personal_info.address}
            onChange={(e) => updateForm('personal_info', { ...form.personal_info, address: e.target.value })}
          />
        </div>
        <AnimatedInput
          icon={Calendar}
          type="date"
          placeholder="Date of Birth"
          value={form.personal_info.date_of_birth}
          onChange={(e) => updateForm('personal_info', { ...form.personal_info, date_of_birth: e.target.value })}
        />
        <AnimatedInput
          icon={Flag}
          placeholder="Nationality"
          value={form.personal_info.nationality}
          onChange={(e) => updateForm('personal_info', { ...form.personal_info, nationality: e.target.value })}
        />
      </div>
    </div>
  );
};

// Step 2: Resume Upload
const ResumeStep = ({ form, handleResumeUpload }) => {
  const [ref, visible] = useInView();
  
  return (
    <div ref={ref} className={`space-y-6 ${visible ? 'slide-in-step' : 'opacity-0'}`}>
      <SectionHeader icon={FileText} title="Resume / CV" subtitle="Upload your latest resume" />
      <FileUploadZone file={form.resume} onUpload={handleResumeUpload} />
      
      <div className="glass-dark rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
            <Star size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-white font-bold mb-1">Pro Tip</p>
            <p className="text-gray-400 text-sm">Make sure your resume is up-to-date and tailored to this specific role for the best results.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3: Experience & Education
const ExperienceEducationStep = ({ form, updateForm }) => {
  const [ref, visible] = useInView();
  const [newSkill, setNewSkill] = useState('');
  
  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      updateForm('skills', [...form.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };
  
  const removeSkill = (skill) => {
    updateForm('skills', form.skills.filter(s => s !== skill));
  };
  
  return (
    <div ref={ref} className={`space-y-8 ${visible ? 'slide-in-step' : 'opacity-0'}`}>
      {/* Work Experience */}
      <div>
        <SectionHeader icon={Briefcase} title="Work Experience" subtitle="Your professional journey" />
        {form.work_experience.length > 0 ? (
          <div className="space-y-4">
            {form.work_experience.map((exp, idx) => (
              <div key={idx} className="glass-light rounded-2xl p-5 hover-glow transition-all duration-300 border-l-4 border-[#14b8a6]">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">{exp.job_title}</h4>
                    <p className="text-[#14b8a6] font-medium">{exp.company}</p>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                      <Clock size={14} /> {exp.employment_dates}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/15 flex items-center justify-center">
                    <Building2 size={18} className="text-[#14b8a6]" />
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-dark rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(30,58,66,0.4)] flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} className="text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium">Fresh Graduate</p>
            <p className="text-gray-500 text-sm">No work experience yet - that's okay!</p>
          </div>
        )}
      </div>
      
      {/* Education */}
      <div>
        <SectionHeader icon={GraduationCap} title="Education" subtitle="Your academic background" color="#06b6d4" />
        <div className="grid md:grid-cols-2 gap-4">
          {form.education_info.ssc && (
            <EducationCard
              title="SSC"
              icon={Award}
              data={{
                'School': form.education_info.ssc.school_name,
                'Year': form.education_info.ssc.year,
                'Group': form.education_info.ssc.group,
                'Board': form.education_info.ssc.board,
                'Result': form.education_info.ssc.result,
              }}
            />
          )}
          {form.education_info.hsc && (
            <EducationCard
              title="HSC"
              icon={Award}
              data={{
                'College': form.education_info.hsc.college_name,
                'Year': form.education_info.hsc.year,
                'Group': form.education_info.hsc.group,
                'Board': form.education_info.hsc.board,
                'Result': form.education_info.hsc.result,
              }}
            />
          )}
          {form.education_info.university && (
            <div className="md:col-span-2">
              <EducationCard
                title="University"
                icon={GraduationCap}
                data={{
                  'University Name': form.education_info.university.name,
                  'Status': form.education_info.university.status,
                  'Current Year': form.education_info.university.current_year,
                  'Expected Graduation': form.education_info.university.graduation_year,
                  'CGPA': form.education_info.university.cgpa,
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Skills */}
      <div>
        <SectionHeader icon={Zap} title="Skills" subtitle="Your technical expertise" color="#2dd4bf" />
        
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <AnimatedInput
              icon={Plus}
              placeholder="Add a skill (e.g., React, Python, AWS)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
          </div>
          <button
            onClick={addSkill}
            className="btn-primary px-6 rounded-xl text-white font-bold flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="relative z-10 hidden sm:inline">Add</span>
          </button>
        </div>
        
        {form.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill, idx) => (
              <SkillTag key={idx} skill={skill} index={idx} onRemove={() => removeSkill(skill)} />
            ))}
          </div>
        ) : (
          <div className="glass-dark rounded-2xl p-6 text-center">
            <p className="text-gray-400">No skills added yet. Add your professional skills to stand out!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Step 4: Cover Letter
const CoverLetterStep = ({ form, updateForm, showAIModal, setShowAIModal, generatingCoverLetter, generateCoverLetter }) => {
  const [ref, visible] = useInView();
  
  return (
    <div ref={ref} className={`space-y-6 ${visible ? 'slide-in-step' : 'opacity-0'}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <SectionHeader icon={FileText} title="Cover Letter" subtitle="Make a great first impression" />
        <button
          onClick={() => setShowAIModal(true)}
          className="btn-ai px-5 py-3 rounded-xl text-purple-300 font-bold flex items-center gap-2"
        >
          <Sparkles size={18} />
          AI Assist
        </button>
      </div>
      
      <AnimatedTextarea
        value={form.cover_letter}
        onChange={(e) => updateForm('cover_letter', e.target.value)}
        placeholder="Write your cover letter here... or use AI to generate one!"
        rows={12}
      />
      
      <div className="glass-dark rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0">
            <Wand2 size={18} className="text-purple-400" />
          </div>
          <div>
            <p className="text-white font-bold mb-1">AI-Powered Writing</p>
            <p className="text-gray-400 text-sm">Click "AI Assist" to generate a personalized cover letter based on the job requirements and your profile.</p>
          </div>
        </div>
      </div>
      
      <AIModal
        show={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={generateCoverLetter}
        generating={generatingCoverLetter}
      />
    </div>
  );
};

// Step 5: Screening Questions
const ScreeningQuestionsStep = ({ screeningQuestions, form, updateScreeningResponse }) => {
  const [ref, visible] = useInView();
  
  return (
    <div ref={ref} className={`space-y-6 ${visible ? 'slide-in-step' : 'opacity-0'}`}>
      <SectionHeader icon={HelpCircle} title="Screening Questions" subtitle="Answer employer questions" color="#f59e0b" />
      
      {screeningQuestions.length === 0 ? (
        <div className="glass-dark rounded-2xl p-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[rgba(30,58,66,0.4)] flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} className="text-emerald-400" />
          </div>
          <p className="text-white font-bold text-lg mb-2">No Screening Questions</p>
          <p className="text-gray-400">This job doesn't require any additional responses. You can proceed to the next step!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {screeningQuestions.map((q, idx) => (
            <div key={q.id} className={`glass-light rounded-2xl p-6 pop-in`} style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                  <MessageSquare size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-bold">
                    {q.question_text}
                    {q.required && <span className="text-red-400 ml-1">*</span>}
                  </p>
                </div>
              </div>
              
              {q.question_type === 'text' && (
                <AnimatedTextarea
                  placeholder="Type your answer..."
                  onChange={(e) => updateScreeningResponse(q.id, e.target.value)}
                  rows={4}
                />
              )}
              
              {q.question_type === 'yes_no' && (
                <div className="flex gap-4">
                  {['yes', 'no'].map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        onChange={(e) => updateScreeningResponse(q.id, e.target.value)}
                        className="radio-custom"
                      />
                      <span className="text-white capitalize group-hover:text-[#14b8a6] transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {q.question_type === 'multiple_choice' && (
                <div className="space-y-3">
                  {(q.options || []).map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        onChange={(e) => updateScreeningResponse(q.id, e.target.value)}
                        className="radio-custom"
                      />
                      <span className="text-white group-hover:text-[#14b8a6] transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Step 6: Additional Info
const AdditionalInfoStep = ({ form, updateForm, addReference, updateReference, removeReference }) => {
  const [ref, visible] = useInView();
  
  return (
    <div ref={ref} className={`space-y-8 ${visible ? 'slide-in-step' : 'opacity-0'}`}>
      {/* Work Eligibility */}
      <div>
        <SectionHeader icon={Shield} title="Work Eligibility" subtitle="Legal authorization" color="#10b981" />
        <div className="glass-light rounded-2xl p-6 space-y-4">
          <label className="flex items-center gap-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.work_eligibility?.authorized_to_work !== false}
              onChange={(e) => updateForm('work_eligibility', { ...form.work_eligibility, authorized_to_work: e.target.checked })}
              className="checkbox-custom"
            />
            <span className="text-white group-hover:text-[#14b8a6] transition-colors">I am authorized to work in this country</span>
          </label>
          <label className="flex items-center gap-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.work_eligibility?.visa_sponsorship_needed === true}
              onChange={(e) => updateForm('work_eligibility', { ...form.work_eligibility, visa_sponsorship_needed: e.target.checked })}
              className="checkbox-custom"
            />
            <span className="text-white group-hover:text-[#14b8a6] transition-colors">I may need visa sponsorship</span>
          </label>
        </div>
      </div>
      
      {/* References */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <SectionHeader icon={Users} title="References" subtitle="Professional references (optional)" color="#06b6d4" />
          <button
            onClick={addReference}
            className="btn-secondary px-4 py-2 rounded-xl text-[#14b8a6] font-bold flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        
        {form.references.length === 0 ? (
          <div className="glass-dark rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(30,58,66,0.4)] flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-gray-500" />
            </div>
            <p className="text-gray-400">No references added yet.</p>
            <p className="text-gray-500 text-sm">Add professional references to strengthen your application.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {form.references.map((ref, idx) => (
              <ReferenceCard
                key={idx}
                reference={ref}
                index={idx}
                onUpdate={(field, value) => updateReference(idx, field, value)}
                onRemove={() => removeReference(idx)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Online Profiles */}
      <div>
        <SectionHeader icon={Globe} title="Online Profiles" subtitle="Your web presence" color="#8b5cf6" />
        <div className="space-y-4">
          <AnimatedInput
            icon={Linkedin}
            type="url"
            placeholder="LinkedIn Profile URL"
            value={form.online_profiles?.linkedin}
            onChange={(e) => updateForm('online_profiles', { ...form.online_profiles, linkedin: e.target.value })}
          />
          <AnimatedInput
            icon={Link}
            type="url"
            placeholder="Portfolio Website"
            value={form.online_profiles?.portfolio}
            onChange={(e) => updateForm('online_profiles', { ...form.online_profiles, portfolio: e.target.value })}
          />
          <AnimatedInput
            icon={Github}
            type="url"
            placeholder="GitHub Profile"
            value={form.online_profiles?.github}
            onChange={(e) => updateForm('online_profiles', { ...form.online_profiles, github: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const JobApplicationForm = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const [form, setForm] = useState({
    personal_info: {},
    work_experience: [],
    education_info: {},
    skills: [],
    cover_letter: '',
    references: [],
    online_profiles: {},
    work_eligibility: {},
    additional_documents: {},
    screening_responses: [],
    resume: null,
  });

  const [screeningQuestions, setScreeningQuestions] = useState([]);

  const TOTAL_STEPS = 6;
  const stepLabels = ['Personal', 'Resume', 'Experience', 'Cover Letter', 'Screening', 'Additional'];

  useEffect(() => {
    const loadApplicationData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/job-applications/init/${jobId}`);
        const data = response.data;

        setJob(data.job);
        setScreeningQuestions(data.screening_questions);

        setForm(prev => ({
          ...prev,
          personal_info: data.pre_filled.personal_info,
          work_experience: data.pre_filled.work_experience,
          education_info: data.pre_filled.education_info,
          skills: data.pre_filled.skills,
          work_eligibility: { authorized_to_work: true, visa_sponsorship_needed: false },
          online_profiles: {
            linkedin: user?.linkedin || '',
            portfolio: user?.portfolio || '',
            github: user?.github || '',
          },
          references: [],
        }));
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        if (err.response?.status === 403) {
          setError(err.response?.data?.message || 'You have already applied for this position.');
          return;
        }
        setError('Failed to load application form: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    loadApplicationData();
  }, [jobId, user, navigate]);

  const updateForm = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) updateForm('resume', file);
  };

  const addReference = () => {
    updateForm('references', [...form.references, { name: '', relationship: '', email: '', phone: '' }]);
  };

  const updateReference = (index, field, value) => {
    const updated = [...form.references];
    updated[index][field] = value;
    updateForm('references', updated);
  };

  const removeReference = (index) => {
    updateForm('references', form.references.filter((_, i) => i !== index));
  };

  const updateScreeningResponse = (questionId, response) => {
    const existing = form.screening_responses.find(r => r.question_id === questionId);
    if (existing) existing.response = response;
    else form.screening_responses.push({ question_id: questionId, response });
    setForm({ ...form });
  };

  const generateCoverLetterWithAI = async () => {
    try {
      setGeneratingCoverLetter(true);
      const response = await api.post('/job-applications/generate-cover-letter', {
        job_id: jobId,
        user_profile: {
          name: user.name,
          email: user.email,
          skills: form.skills,
          years_of_experience: user.years_of_experience || 0,
          education: `${user.university_name} - ${user.university_status}`,
        },
      });

      updateForm('cover_letter', response.data.cover_letter);
      setShowAIModal(false);
      setSuccess('AI-generated cover letter added! Feel free to edit.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Failed to generate cover letter: ' + (err.response?.data?.message || err.message));
    } finally {
      setGeneratingCoverLetter(false);
    }
  };

  const submitApplication = async () => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      setSubmissionStatus('Preparing form data...');

      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('job_id', jobId);
      formData.append('personal_info', JSON.stringify(form.personal_info));
      formData.append('work_experience', JSON.stringify(form.work_experience));
      formData.append('education_info', JSON.stringify(form.education_info));
      formData.append('skills', JSON.stringify(form.skills));
      formData.append('cover_letter', form.cover_letter);
      formData.append('references', JSON.stringify(form.references));
      formData.append('online_profiles', JSON.stringify(form.online_profiles));
      formData.append('work_eligibility', JSON.stringify(form.work_eligibility));
      formData.append('screening_responses', JSON.stringify(form.screening_responses));

      if (form.resume) {
        setSubmissionStatus('Uploading resume...');
        formData.append('resume', form.resume);
      }

      setSubmissionStatus('Submitting application...');

      await api.post('/job-applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Application submitted successfully!');
      setSubmissionStatus('');

      setTimeout(() => {
        window.location.assign('/jobs');
      }, 2000);
    } catch (err) {
      setSubmissionStatus('');
      const backendError = err.response?.data?.error || err.response?.data?.message || err.message;
      
      if (err.response?.status === 409) {
        setError('You have already applied for this position.');
      } else {
        setError('Failed to submit: ' + backendError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(Math.min(TOTAL_STEPS, currentStep + 1));
  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  if (loading) return <><InjectStyles /><LoadingScreen /></>;

  if (error && !job) {
    return (
      <>
        <InjectStyles />
        <ErrorScreen
          error={error}
          onBack={() => navigate('/jobs')}
          onDashboard={() => navigate('/dashboard')}
          showDashboard={error.includes('already applied')}
        />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <InjectStyles />
        <ErrorScreen error="Job not found" onBack={() => navigate('/jobs')} />
      </>
    );
  }

  return (
    <>
      <InjectStyles />
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen pt-28 sm:pt-32 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="glass rounded-3xl p-6 sm:p-8 mb-8 shimmer slide-down">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14b8a6]/20 to-[#06b6d4]/10 flex items-center justify-center shrink-0">
                <Rocket size={32} className="text-[#14b8a6]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-[#14b8a6]/15 border border-[#14b8a6]/30 text-[#2dd4bf] text-xs font-bold uppercase tracking-wider">
                    Applying
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={16} className="text-[#14b8a6]" />
                    {job.company}
                  </span>
                  {job.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-[#06b6d4]" />
                      {job.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8 slide-up stagger-1">
            <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} stepLabels={stepLabels} />
          </div>

          {/* Messages */}
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}
          {submissionStatus && <StatusMessage message={submissionStatus} />}

          {/* Form Content */}
          <div className="glass rounded-3xl p-6 sm:p-10 mb-8 shimmer">
            {currentStep === 1 && <PersonalInfoStep form={form} updateForm={updateForm} />}
            {currentStep === 2 && <ResumeStep form={form} handleResumeUpload={handleResumeUpload} />}
            {currentStep === 3 && <ExperienceEducationStep form={form} updateForm={updateForm} />}
            {currentStep === 4 && (
              <CoverLetterStep
                form={form}
                updateForm={updateForm}
                showAIModal={showAIModal}
                setShowAIModal={setShowAIModal}
                generatingCoverLetter={generatingCoverLetter}
                generateCoverLetter={generateCoverLetterWithAI}
              />
            )}
            {currentStep === 5 && (
              <ScreeningQuestionsStep
                screeningQuestions={screeningQuestions}
                form={form}
                updateScreeningResponse={updateScreeningResponse}
              />
            )}
            {currentStep === 6 && (
              <AdditionalInfoStep
                form={form}
                updateForm={updateForm}
                addReference={addReference}
                updateReference={updateReference}
                removeReference={removeReference}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary px-6 py-4 rounded-xl text-white font-bold flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {currentStep === TOTAL_STEPS ? (
              <button
                onClick={submitApplication}
                disabled={submitting}
                className="btn-primary px-8 py-4 rounded-xl text-white font-bold flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span className="relative z-10">Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span className="relative z-10">Submit Application</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="btn-primary px-8 py-4 rounded-xl text-white font-bold flex items-center gap-2 cursor-pointer"
              >
                <span className="relative z-10">Continue</span>
                <ChevronRight size={20} className="relative z-10" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobApplicationForm;