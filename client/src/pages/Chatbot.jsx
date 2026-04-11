import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Send, Bot, User, Sparkles, Trash2, Loader2,
  Copy, Check, MessageSquare, Zap, BookOpen,
  Target, Code2, FileText, Lightbulb, ArrowDown,
  RotateCcw, ChevronDown, Wand2, Brain, Rocket,
  Shield, ThumbsUp, Clock, Cpu, Terminal,
  GraduationCap, Briefcase, Star, Volume2, X,
  Maximize2, Minimize2, Settings, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
    @keyframes floatSlow { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
    @keyframes floatMed { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(-2deg); } }
    @keyframes floatFast { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-20px) scale(0.97); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes fadeInRight {
      from { opacity: 0; transform: translateX(20px) scale(0.97); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.5); }
      70% { transform: scale(1.05); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes pulseRing {
      0% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.15); opacity: 0.2; }
      100% { transform: scale(1.3); opacity: 0; }
    }
    @keyframes pulseRing2 {
      0% { transform: scale(1); opacity: 0.4; }
      50% { transform: scale(1.25); opacity: 0.15; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    @keyframes neuralPulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }

    @keyframes waveBar {
      0%, 100% { height: 4px; }
      50% { height: 18px; }
    }
    @keyframes dotBounce {
      0%, 80%, 100% { transform: translateY(0) scale(1); }
      40% { transform: translateY(-10px) scale(1.2); }
    }
    @keyframes orbitalSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes borderGlow {
      0%, 100% { border-color: rgba(20,184,166,0.15); }
      50% { border-color: rgba(20,184,166,0.4); }
    }
    @keyframes textGlow {
      0%, 100% { text-shadow: 0 0 10px rgba(20,184,166,0.3); }
      50% { text-shadow: 0 0 20px rgba(20,184,166,0.6), 0 0 40px rgba(20,184,166,0.2); }
    }
    @keyframes particleDrift {
      0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.6; }
      100% { transform: translate(var(--dx), var(--dy)) rotate(360deg); opacity: 0; }
    }
    @keyframes scanLine {
      0% { top: -5%; }
      100% { top: 105%; }
    }
    @keyframes rippleEffect {
      to { transform: scale(2.5); opacity: 0; }
    }
    @keyframes chipReveal {
      from { opacity: 0; transform: translateY(10px) scale(0.9); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes topicCardIn {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes welcomePulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(20,184,166,0.15); }
      50% { box-shadow: 0 0 0 12px rgba(20,184,166,0); }
    }
    @keyframes typewriterCursor {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes statusPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
      50% { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
    }
    @keyframes scrollBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(4px); }
    }
    @keyframes glowLine {
      0% { left: -30%; opacity: 0; }
      50% { opacity: 1; }
      100% { left: 130%; opacity: 0; }
    }
    @keyframes messageShine {
      0% { left: -100%; }
      50%, 100% { left: 200%; }
    }
    @keyframes counterPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.08); opacity: 0.8; }
    }

    .blob-1 { animation: morphBlob1 15s ease-in-out infinite; }
    .blob-2 { animation: morphBlob2 18s ease-in-out infinite; }
    .float-slow { animation: floatSlow 6s ease-in-out infinite; }
    .float-med { animation: floatMed 4.5s ease-in-out infinite; }
    .float-fast { animation: floatFast 3s ease-in-out infinite; }
    .fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in-left { animation: fadeInLeft 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in-right { animation: fadeInRight 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .fade-in-scale { animation: fadeInScale 0.4s cubic-bezier(0.16,1,0.3,1) both; }
    .slide-down { animation: slideDown 0.6s cubic-bezier(0.16,1,0.3,1) both; }
    .slide-up-anim { animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
    .pop-in { animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
    .chip-reveal { animation: chipReveal 0.4s cubic-bezier(0.16,1,0.3,1) both; }

    .gradient-text {
      background: linear-gradient(135deg, #14b8a6, #06b6d4, #2dd4bf, #14b8a6);
      background-size: 300% 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 4s ease infinite;
    }

    .dot-grid {
      background-image: radial-gradient(rgba(20,184,166,0.06) 1px, transparent 1px);
      background-size: 28px 28px;
    }

    .glass-surface {
      background: linear-gradient(135deg, rgba(10,26,34,0.85) 0%, rgba(7,16,21,0.92) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }

    .chat-scrollbar::-webkit-scrollbar { width: 4px; }
    .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(30,58,66,0.5); border-radius: 10px; }
    .chat-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(20,184,166,0.4); }

    .input-glow:focus-within {
      box-shadow: 0 0 0 1px rgba(20,184,166,0.3), 0 0 30px -10px rgba(20,184,166,0.15);
    }

    .send-btn-glow {
      position: relative;
      overflow: hidden;
    }
    .send-btn-glow::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      background: linear-gradient(135deg, #14b8a6, #06b6d4, #2dd4bf);
      z-index: -1;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .send-btn-glow:hover::before { opacity: 0.5; filter: blur(8px); }

    .message-shine {
      position: relative;
      overflow: hidden;
    }
    .message-shine::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
      animation: messageShine 6s ease-in-out infinite;
    }

    .neural-bg {
      background-image:
        radial-gradient(ellipse at 20% 50%, rgba(20,184,166,0.04) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.03) 0%, transparent 50%);
    }

    .topic-card {
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    }
    .topic-card:hover {
      transform: translateY(-3px);
      border-color: rgba(20,184,166,0.3);
      box-shadow: 0 12px 40px -12px rgba(20,184,166,0.15);
    }

    .suggestion-chip {
      transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .suggestion-chip:hover {
      transform: translateY(-2px) scale(1.02);
      border-color: rgba(20,184,166,0.4);
      box-shadow: 0 8px 25px -8px rgba(20,184,166,0.2);
    }

    @media (max-width: 640px) {
      .chat-container { height: calc(100vh - 140px) !important; }
    }
  `}</style>
);

/* ═══════════════════════════════════════
   PARTICLE FIELD
   ═══════════════════════════════════════ */
function ParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      dx: `${(Math.random() - 0.5) * 120}px`,
      dy: `${(Math.random() - 0.5) * 120}px`,
    })), []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? '#14b8a6' : p.id % 3 === 1 ? '#06b6d4' : '#2dd4bf',
            opacity: 0,
            '--dx': p.dx,
            '--dy': p.dy,
            animation: `particleDrift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   AI AVATAR WITH PULSE RINGS
   ═══════════════════════════════════════ */
function AIAvatar({ isThinking = false, size = 'md' }) {
  const sizeMap = { sm: 'w-8 h-8', md: 'w-9 h-9', lg: 'w-12 h-12' };
  const iconSize = size === 'lg' ? 20 : size === 'md' ? 16 : 14;

  return (
    <div className="relative shrink-0">
      {/* Pulse rings */}
      {isThinking && (
        <>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4]"
            style={{ animation: 'pulseRing 2s ease-out infinite' }} />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4]"
            style={{ animation: 'pulseRing2 2s ease-out 0.5s infinite' }} />
        </>
      )}
      {/* Orbital dot */}
      {isThinking && (
        <div className="absolute inset-[-6px] z-0" style={{ animation: 'orbitalSpin 3s linear infinite' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"
            style={{ boxShadow: '0 0 6px #2dd4bf' }} />
        </div>
      )}
      {/* Avatar */}
      <div className={`${sizeMap[size]} rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20 relative z-10 ${isThinking ? '' : ''}`}
        style={isThinking ? { animation: 'breathe 2s ease-in-out infinite' } : {}}>
        <Bot size={iconSize} className="text-white" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   USER AVATAR
   ═══════════════════════════════════════ */
function UserAvatar() {
  return (
    <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-[#1e3a42] to-[#0F3A42] border border-[#1e3a42]/60 flex items-center justify-center">
      <User size={14} className="text-gray-400" />
    </div>
  );
}

/* ═══════════════════════════════════════
   WAVEFORM TYPING INDICATOR
   ═══════════════════════════════════════ */
function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start fade-in-left" style={{ animationDelay: '0.05s' }}>
      <AIAvatar isThinking={true} size="sm" />
      <div className="relative">
        <div className="px-5 py-3.5 rounded-2xl rounded-tl-sm bg-[#0A1A22]/90 border border-[#1e3a42]/40 backdrop-blur-sm">
          {/* Wave bars */}
          <div className="flex items-center gap-[3px] h-5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-gradient-to-t from-[#14b8a6] to-[#2dd4bf]"
                style={{
                  animation: `waveBar 1.2s ease-in-out ${i * 0.1}s infinite`,
                  opacity: 0.5 + (i % 3) * 0.2,
                }}
              />
            ))}
          </div>
        </div>
        {/* "Thinking" label */}
        <div className="absolute -bottom-5 left-2 flex items-center gap-1.5">
          <Cpu size={9} className="text-[#14b8a6]/60" />
          <span className="text-[9px] text-[#14b8a6]/50 font-medium tracking-wider uppercase">
            Thinking
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MESSAGE BUBBLE
   ═══════════════════════════════════════ */
function MessageBubble({ msg, index, isLatest }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const isBot = msg.role === 'bot';
  const isUser = msg.role === 'user';

  const copyText = useCallback(() => {
    navigator.clipboard.writeText(msg.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [msg.text]);

  const animClass = isBot ? 'fade-in-left' : 'fade-in-right';
  const delay = isLatest ? 0.05 : Math.min(index * 0.04, 0.5);

  return (
    <div
      className={`group flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'} ${animClass}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Bot avatar */}
      {isBot && <AIAvatar size="sm" />}

      {/* Bubble */}
      <div className="relative max-w-[82%] sm:max-w-[75%]">
        <div
          className={`relative px-4 py-3 text-[13.5px] leading-relaxed whitespace-pre-wrap
            ${isUser
              ? 'bg-gradient-to-br from-[#14b8a6] to-[#0d9488] text-white rounded-2xl rounded-tr-sm shadow-lg shadow-[#14b8a6]/10'
              : 'message-shine bg-[#0A1A22]/90 border border-[#1e3a42]/40 text-gray-300 rounded-2xl rounded-tl-sm backdrop-blur-sm'
            }`}
        >
          {msg.text}
        </div>

        {/* Actions bar (on hover) */}
        <div className={`absolute ${isUser ? 'left-0 -bottom-7' : 'right-0 -bottom-7'} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0`}>
          <button
            onClick={copyText}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0F3A42]/60 border border-[#1e3a42]/30 text-gray-500 hover:text-[#2dd4bf] hover:border-[#14b8a6]/30 transition-all duration-200 cursor-pointer"
            title="Copy"
          >
            {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
            <span className="text-[9px] font-medium">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          {isBot && (
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all duration-200 cursor-pointer
                ${liked
                  ? 'bg-[#14b8a6]/10 border-[#14b8a6]/30 text-[#2dd4bf]'
                  : 'bg-[#0F3A42]/60 border-[#1e3a42]/30 text-gray-500 hover:text-[#2dd4bf] hover:border-[#14b8a6]/30'
                }`}
              title="Helpful"
            >
              <ThumbsUp size={10} className={liked ? 'fill-current' : ''} />
            </button>
          )}
          {msg.timestamp && (
            <span className="text-[9px] text-gray-700 font-medium px-1.5 flex items-center gap-1">
              <Clock size={8} /> {msg.timestamp}
            </span>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && <UserAvatar />}
    </div>
  );
}

/* ═══════════════════════════════════════
   TOPIC CARD (WELCOME SCREEN)
   ═══════════════════════════════════════ */
function TopicCard({ icon: Icon, title, desc, color, onClick, delay }) {
  return (
    <button
      onClick={onClick}
      className="topic-card text-left p-4 rounded-2xl bg-[#0A1A22]/70 border border-[#1e3a42]/30 backdrop-blur-sm cursor-pointer group relative overflow-hidden"
      style={{ animation: `topicCardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s both` }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at center, ${color}08 0%, transparent 70%)` }} />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-[#2dd4bf] transition-colors duration-300">{title}</h4>
        <p className="text-[11px] text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════
   SUGGESTION CHIPS
   ═══════════════════════════════════════ */
function SuggestionChips({ onSend, visible }) {
  const suggestions = [
    { text: 'Review my resume', icon: FileText },
    { text: 'Interview tips', icon: Target },
    { text: 'Skill roadmap for React', icon: Code2 },
    { text: 'Salary negotiation', icon: Zap },
    { text: 'Career change advice', icon: Rocket },
    { text: 'How to upskill fast', icon: Lightbulb },
  ];

  if (!visible) return null;

  return (
    <div className="flex flex-wrap gap-2 px-1 mb-3">
      {suggestions.map((s, i) => (
        <button
          key={s.text}
          onClick={() => onSend(s.text)}
          className="suggestion-chip chip-reveal inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F3A42]/30 border border-[#1e3a42]/30 text-[11px] text-gray-400 font-medium cursor-pointer hover:text-[#2dd4bf] hover:bg-[#14b8a6]/5"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          <s.icon size={11} className="text-[#14b8a6]/60" />
          {s.text}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   CHAR COUNTER RING
   ═══════════════════════════════════════ */
function CharRing({ current, max }) {
  const pct = current / max;
  const r = 8;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const warn = pct > 0.8;
  const danger = pct > 0.95;
  const color = danger ? '#ef4444' : warn ? '#f59e0b' : '#14b8a6';

  if (current === 0) return null;

  return (
    <div className="relative w-6 h-6 flex items-center justify-center" style={pct >= 1 ? { animation: 'counterPop 0.3s ease' } : {}}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r={r} fill="none" stroke="#1e3a42" strokeWidth="2" />
        <circle cx="10" cy="10" r={r} fill="none" stroke={color} strokeWidth="2"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.2s ease, stroke 0.2s ease' }} />
      </svg>
      {warn && (
        <span className="absolute text-[7px] font-bold tabular-nums" style={{ color }}>
          {max - current}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SCROLL-TO-BOTTOM BUTTON
   ═══════════════════════════════════════ */
function ScrollToBottomBtn({ visible, onClick }) {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pop-in flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14b8a6]/90 text-white text-[11px] font-bold shadow-lg shadow-[#14b8a6]/30 cursor-pointer hover:bg-[#14b8a6] transition-all duration-200 hover:scale-105"
    >
      <ArrowDown size={12} style={{ animation: 'scrollBounce 1s ease infinite' }} />
      New messages
    </button>
  );
}

/* ═══════════════════════════════════════
   WELCOME SCREEN
   ═══════════════════════════════════════ */
function WelcomeScreen({ onTopicClick }) {
  const topics = [
    { icon: Briefcase, title: 'Job Search', desc: 'Tips for finding and landing your dream job', color: '#14b8a6' },
    { icon: FileText, title: 'Resume Review', desc: 'Get feedback on your resume or CV', color: '#06b6d4' },
    { icon: Target, title: 'Interview Prep', desc: 'Practice questions and strategies', color: '#2dd4bf' },
    { icon: Code2, title: 'Skill Roadmap', desc: 'Plan your learning path for any skill', color: '#10b981' },
    { icon: Rocket, title: 'Career Growth', desc: 'Strategies for career advancement', color: '#8b5cf6' },
    { icon: GraduationCap, title: 'Learning Resources', desc: 'Find courses, tutorials, and more', color: '#f59e0b' },
  ];

  const topicPrompts = [
    'Help me find a job in tech',
    'Review my resume and give feedback',
    'Give me common interview questions for a software developer role',
    'Create a skill roadmap for becoming a full-stack developer',
    'How can I accelerate my career growth?',
    'Recommend learning resources for web development',
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      {/* Central AI orb */}
      <div className="relative mb-8 fade-in-scale" style={{ animationDelay: '0.1s' }}>
        <div className="absolute inset-0 rounded-full bg-[#14b8a6]/20 blur-[40px]" style={{ animation: 'breathe 3s ease-in-out infinite' }} />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-2xl shadow-[#14b8a6]/30"
          style={{ animation: 'welcomePulse 3s ease infinite' }}>
          <Brain size={36} className="text-white" />
        </div>
        {/* Status dot */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0A1A22] flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-emerald-400" style={{ animation: 'statusPulse 2s ease infinite' }} />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 text-center slide-down" style={{ animationDelay: '0.2s' }}>
        How can I help your <span className="gradient-text">career</span> today?
      </h2>
      <p className="text-sm text-gray-500 mb-8 text-center max-w-md slide-down" style={{ animationDelay: '0.3s' }}>
        I can assist with job searching, resume building, interview prep, skill planning, and much more.
      </p>

      {/* Topic cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg">
        {topics.map((topic, i) => (
          <TopicCard
            key={topic.title}
            {...topic}
            onClick={() => onTopicClick(topicPrompts[i])}
            delay={0.3 + i * 0.08}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SESSION HEADER BAR
   ═══════════════════════════════════════ */
function SessionHeader({ messageCount, onClear, onRefresh }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e3a42]/20">
      <div className="flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: 'statusPulse 2s ease infinite' }} />
        <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Active Session</span>
        {messageCount > 1 && (
          <span className="text-[10px] text-gray-700 bg-[#0F3A42]/40 px-2 py-0.5 rounded-full font-bold tabular-nums">
            {messageCount} messages
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg text-gray-600 hover:text-[#14b8a6] hover:bg-[#14b8a6]/5 transition-all duration-200 cursor-pointer"
          title="New conversation"
        >
          <RefreshCw size={13} />
        </button>
        <button
          onClick={onClear}
          className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
          title="Clear chat"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN EXPORT — CHATBOT
   ═══════════════════════════════════════ */
export default function Chatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [inputFocused, setInputFocused] = useState(false);

  const maxChars = 2000;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Check if user has scrolled up
  const handleScroll = useCallback(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollBtn(!atBottom && messages.length > 3);
  }, [messages.length]);

  // Load history
  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        const res = await api.get('/chatbot/history');
        if (res.data.messages && res.data.messages.length > 0) {
          const historyMsgs = [];
          res.data.messages.forEach((m) => {
            historyMsgs.push({
              role: 'user',
              text: m.user_message,
              timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
            historyMsgs.push({
              role: 'bot',
              text: m.bot_reply,
              timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
          });
          setMessages(historyMsgs);
          setHasStarted(true);
        }
      } catch {
        // silently ignore
      }
    };
    fetchHistory();
  }, [user]);

  const getNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleSend = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    if (!hasStarted) setHasStarted(true);

    const userMsg = { role: 'user', text: trimmed, timestamp: getNow() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chatbot', { message: trimmed });
      setMessages((prev) => [...prev, { role: 'bot', text: res.data.reply, timestamp: getNow() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Sorry, something went wrong. Please try again.', timestamp: getNow() },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const clearChat = () => {
    setMessages([]);
    setHasStarted(false);
  };

  const refreshChat = () => {
    setMessages([
      { role: 'bot', text: "Fresh start! I'm ready to help. What would you like to talk about?", timestamp: getNow() },
    ]);
    setHasStarted(true);
  };

  const showWelcome = !hasStarted && messages.length === 0;
  const showSuggestions = hasStarted && messages.length > 0 && messages.length < 4 && !loading;

  return (
    <>
      <InjectStyles />
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #03070A 0%, #0A1A22 40%, #050D11 100%)' }}>

        {/* ── Background layers ── */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="blob-1 absolute -top-[15%] -left-[10%] w-[450px] h-[450px] bg-[#14b8a6]/[0.025]" />
          <div className="blob-2 absolute -bottom-[10%] -right-[15%] w-[500px] h-[500px] bg-[#06b6d4]/[0.025]" />
          <div className="dot-grid absolute inset-0 opacity-30" />
          <ParticleField />

          {/* Scan line */}
          <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#14b8a6]/10 to-transparent"
            style={{ animation: 'scanLine 12s linear infinite' }} />
        </div>

        <div className="relative z-10 pt-24 pb-8 px-4 sm:px-6 lg:px-8">

          {/* ═══ PAGE HEADER ═══ */}
          <div className="max-w-3xl mx-auto text-center mb-6 slide-down">
            {/* Floating decorations */}
            <div className="relative inline-block mb-5">
              <div className="absolute -top-6 -left-10 float-slow opacity-30">
                <div className="w-2.5 h-2.5 rounded-full bg-[#14b8a6]/50 blur-[1px]" />
              </div>
              <div className="absolute -top-3 -right-12 float-med opacity-25">
                <div className="w-2 h-2 rounded-full bg-[#06b6d4]/60" />
              </div>
              <div className="absolute top-4 -left-16 float-fast opacity-20">
                <div className="w-3 h-3 rounded bg-[#2dd4bf]/20 rotate-45" />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14b8a6]/[0.06] border border-[#14b8a6]/15">
                <Sparkles size={13} className="text-[#14b8a6]" style={{ animation: 'neuralPulse 2s ease-in-out infinite' }} />
                <span className="text-[10px] font-bold text-[#2dd4bf] uppercase tracking-[0.2em]">
                  AI Career Assistant
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'statusPulse 2s ease infinite' }} />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight tracking-tight">
              Career<span className="gradient-text">Path</span> AI
            </h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed fade-in-up" style={{ animationDelay: '0.2s' }}>
              Your intelligent career companion — ask anything about jobs, skills, resumes, interviews, or career growth.
            </p>
          </div>

          {/* ═══ CHAT CONTAINER ═══ */}
          <div className="max-w-3xl mx-auto fade-in-up chat-container" style={{ animationDelay: '0.3s', height: 'calc(100vh - 280px)', minHeight: '400px' }}>
            <div className="flex flex-col h-full glass-surface rounded-3xl border border-[#1e3a42]/30 shadow-2xl shadow-black/20 overflow-hidden relative">

              {/* Gradient accent line at top */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#14b8a6]/40 to-transparent shrink-0">
                <div className="absolute h-[2px] w-[30%] bg-gradient-to-r from-transparent via-[#2dd4bf] to-transparent"
                  style={{ animation: 'glowLine 4s ease-in-out infinite' }} />
              </div>

              {/* Session header */}
              {hasStarted && (
                <SessionHeader
                  messageCount={messages.filter(m => m.role === 'user').length}
                  onClear={clearChat}
                  onRefresh={refreshChat}
                />
              )}

              {/* ═══ CHAT BODY ═══ */}
              <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto chat-scrollbar relative"
              >
                {showWelcome ? (
                  <WelcomeScreen onTopicClick={(prompt) => handleSend(prompt)} />
                ) : (
                  <div className="p-4 sm:p-5 space-y-6 neural-bg min-h-full">
                    {/* History separator */}
                    {messages.length > 0 && messages[0].timestamp && (
                      <div className="flex items-center gap-3 fade-in-up">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#1e3a42]/40 to-transparent" />
                        <span className="text-[9px] text-gray-700 font-semibold uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={9} /> Conversation
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#1e3a42]/40 to-transparent" />
                      </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, i) => (
                      <MessageBubble
                        key={i}
                        msg={msg}
                        index={i}
                        isLatest={i >= messages.length - 2}
                      />
                    ))}

                    {/* Typing indicator */}
                    {loading && <TypingIndicator />}

                    {/* Suggestion chips */}
                    {showSuggestions && (
                      <div className="pt-2 slide-up-anim" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center gap-2 mb-2.5 px-1">
                          <Lightbulb size={11} className="text-[#14b8a6]/50" />
                          <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">
                            Suggestions
                          </span>
                        </div>
                        <SuggestionChips onSend={handleSend} visible={true} />
                      </div>
                    )}

                    <div ref={messagesEndRef} className="h-1" />
                  </div>
                )}

                {/* Scroll-to-bottom button */}
                <ScrollToBottomBtn visible={showScrollBtn} onClick={scrollToBottom} />
              </div>

              {/* ═══ INPUT AREA ═══ */}
              <div className="shrink-0 border-t border-[#1e3a42]/20 p-3 sm:p-4 relative">
                {/* Glow line above input */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent transition-all duration-500 ${inputFocused ? 'w-[80%] opacity-100' : 'w-0 opacity-0'}`} />

                <form onSubmit={handleFormSubmit} className="flex items-end gap-2.5">
                  {/* Input wrapper */}
                  <div className={`flex-1 relative rounded-2xl transition-all duration-300 input-glow ${inputFocused ? 'bg-[#0A1A22]' : ''}`}>
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => {
                        if (e.target.value.length <= maxChars) {
                          setInput(e.target.value);
                          // Auto-resize
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }
                      }}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleFormSubmit(e);
                        }
                      }}
                      placeholder="Ask me anything about your career..."
                      className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/[0.03] border border-[#1e3a42]/30 text-white placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-[#14b8a6]/30 transition-all duration-300"
                      style={{ minHeight: '46px', maxHeight: '120px' }}
                      disabled={loading}
                      rows={1}
                    />

                    {/* Char counter */}
                    <div className="absolute right-3 bottom-2.5">
                      <CharRing current={input.length} max={maxChars} />
                    </div>
                  </div>

                  {/* Send button */}
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="send-btn-glow shrink-0 w-[46px] h-[46px] rounded-2xl flex items-center justify-center text-white font-bold transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer relative z-10"
                    style={{
                      background: !input.trim() || loading
                        ? '#1e3a42'
                        : 'linear-gradient(135deg, #14b8a6, #0d9488, #06b6d4)',
                    }}
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={17} className={`transition-transform duration-200 ${input.trim() ? 'translate-x-[1px] -translate-y-[1px]' : ''}`} />
                    )}
                  </button>
                </form>

                {/* Footer info */}
                <div className="flex items-center justify-between mt-2.5 px-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded flex items-center justify-center bg-[#14b8a6]/10">
                      <Cpu size={8} className="text-[#14b8a6]/50" />
                    </div>
                    <span className="text-[10px] text-gray-700">
                      Powered by <span className="text-gray-600 font-medium">Google Gemini</span>
                    </span>
                  </div>
                  <span className="text-[9px] text-gray-800">
                    Shift + Enter for new line
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}