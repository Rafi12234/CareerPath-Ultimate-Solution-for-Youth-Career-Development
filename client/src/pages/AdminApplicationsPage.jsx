import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, ExternalLink, Eye, FileText, Filter, Globe,
  GraduationCap, LogOut, Mail, Menu, Phone, User, Users, X,
  Shield, Settings, ChevronRight, ChevronDown, ChevronLeft,
  Sparkles, Clock, Calendar, Award, Activity, Bell, Zap,
  CheckCircle, AlertCircle, XCircle, ArrowUpRight, ArrowDownRight,
  Search, RefreshCw, Star, Target, Flame, Crown, Loader2,
  BookOpen, Code, Building2, MapPin, Hash, Copy, Download,
  ChevronUp, Link, FileCheck, MessageSquare, Bookmark,
  BarChart3, TrendingUp, Layers
} from 'lucide-react';
import api from '../utils/api';

const STATUS_OPTIONS = ['Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected'];

const STATUS_CONFIG = {
  Pending: { bg: 'rgba(245,158,11,.12)', border: 'rgba(245,158,11,.25)', text: '#f59e0b', icon: Clock },
  Reviewed: { bg: 'rgba(59,130,246,.12)', border: 'rgba(59,130,246,.25)', text: '#3b82f6', icon: Eye },
  Shortlisted: { bg: 'rgba(168,85,247,.12)', border: 'rgba(168,85,247,.25)', text: '#a855f7', icon: Star },
  Accepted: { bg: 'rgba(16,185,129,.12)', border: 'rgba(16,185,129,.25)', text: '#10b981', icon: CheckCircle },
  Rejected: { bg: 'rgba(239,68,68,.12)', border: 'rgba(239,68,68,.25)', text: '#ef4444', icon: XCircle },
};

function formatDate(v) {
  if (!v) return 'N/A';
  const d = new Date(v);
  return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function normalizeArray(v) { return Array.isArray(v) ? v : []; }

/* ═══════════════════════════════════════
   INJECTED STYLES
   ═══════════════════════════════════════ */
const InjectStyles = () => (
  <style>{`
    @keyframes morphBlob1{0%,100%{border-radius:42% 58% 70% 30%/45% 45% 55% 55%;transform:rotate(0) scale(1)}25%{border-radius:70% 30% 50% 50%/30% 60% 40% 70%;transform:rotate(90deg) scale(1.05)}50%{border-radius:30% 70% 40% 60%/55% 30% 70% 45%;transform:rotate(180deg) scale(.95)}75%{border-radius:55% 45% 60% 40%/40% 70% 30% 60%;transform:rotate(270deg) scale(1.02)}}
    @keyframes morphBlob2{0%,100%{border-radius:58% 42% 30% 70%/55% 45% 55% 45%;transform:rotate(0)}33%{border-radius:40% 60% 60% 40%/60% 30% 70% 40%;transform:rotate(120deg)}66%{border-radius:60% 40% 45% 55%/35% 65% 35% 65%;transform:rotate(240deg)}}
    @keyframes orbFloat{0%{transform:translate(0,0) scale(1)}25%{transform:translate(25px,-35px) scale(1.08)}50%{transform:translate(-18px,-55px) scale(.93)}75%{transform:translate(35px,-18px) scale(1.04)}100%{transform:translate(0,0) scale(1)}}
    @keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-16px) rotate(2deg)}}
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
    @keyframes statusDot{0%,100%{transform:scale(1)}50%{transform:scale(1.5)}}
    @keyframes sidebarItemIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes numberRoll{0%{transform:translateY(100%);opacity:0;filter:blur(4px)}60%{filter:blur(0)}100%{transform:translateY(0);opacity:1;filter:blur(0)}}
    @keyframes progressShine{0%{left:-30%}100%{left:130%}}
    @keyframes expandHeight{from{max-height:0;opacity:0}to{max-height:2000px;opacity:1}}
    @keyframes rowSlide{from{opacity:0;transform:translateX(-15px)}to{opacity:1;transform:translateX(0)}}
    @keyframes tooltipIn{from{opacity:0;transform:translateX(-8px) scale(.9)}to{opacity:1;transform:translateX(0) scale(1)}}
    @keyframes counterFlip{0%{transform:translateY(100%);opacity:0}60%{transform:translateY(-8%)}100%{transform:translateY(0);opacity:1}}
    @keyframes tagFloat{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-3px) rotate(1deg)}}
    @keyframes bounceIn{0%{transform:scale(0);opacity:0}50%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}

    @property --angle{syntax:'<angle>';initial-value:0deg;inherits:false}

    .blob-1{animation:morphBlob1 15s ease-in-out infinite}
    .blob-2{animation:morphBlob2 18s ease-in-out infinite}
    .float-slow{animation:floatSlow 6s ease-in-out infinite}
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
    .number-roll{animation:numberRoll .9s cubic-bezier(.16,1,.3,1) both}
    .bounce-in{animation:bounceIn .6s cubic-bezier(.34,1.56,.64,1) both}
    .row-slide{animation:rowSlide .4s cubic-bezier(.16,1,.3,1) both}
    .expand-enter{animation:expandHeight .4s cubic-bezier(.16,1,.3,1) both;overflow:hidden}

    .gradient-text{background:linear-gradient(135deg,#14b8a6,#06b6d4,#2dd4bf,#14b8a6);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gradientShift 4s ease infinite}

    .glass-card{background:linear-gradient(135deg,rgba(10,26,34,.88),rgba(7,16,21,.94));backdrop-filter:blur(20px);border:1px solid rgba(30,58,66,.4);transition:all .45s cubic-bezier(.16,1,.3,1)}
    .glass-card:hover{border-color:rgba(20,184,166,.3);box-shadow:0 18px 50px -12px rgba(20,184,166,.12),0 0 0 1px rgba(20,184,166,.08)}
    .glass-card-lift:hover{transform:translateY(-5px)}

    .shine-effect{position:relative;overflow:hidden}
    .shine-effect::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent);animation:cardShine 5s ease-in-out infinite}

    .glow-border{position:relative}
    .glow-border::before{content:'';position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:conic-gradient(from var(--angle,0deg),transparent 40%,#14b8a6 50%,transparent 60%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:borderRotate 4s linear infinite;opacity:0;transition:opacity .5s}
    .glow-border:hover::before{opacity:1}

    .shimmer-skeleton{position:relative;overflow:hidden;background:rgba(30,58,66,.15)}
    .shimmer-skeleton::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(20,184,166,.06),transparent);animation:shimmer 1.8s ease-in-out infinite}

    .ripple-container{position:relative;overflow:hidden}
    .ripple-circle{position:absolute;border-radius:50%;background:rgba(20,184,166,.25);transform:scale(0);animation:rippleEffect .6s ease-out;pointer-events:none}

    .dot-grid{background-image:radial-gradient(rgba(20,184,166,.06) 1px,transparent 1px);background-size:24px 24px}

    .bar-grow{animation:barGrow 1s cubic-bezier(.16,1,.3,1) both;transform-origin:left}
    .pulse-glow{animation:pulseGlow 2s ease-in-out infinite}
    .status-dot{animation:statusDot 2s ease-in-out infinite}

    .progress-shine{position:relative;overflow:hidden}
    .progress-shine::after{content:'';position:absolute;top:0;left:-30%;width:30%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);animation:progressShine 2s ease-in-out infinite}

    .scan-line-overlay::after{content:'';position:absolute;left:0;width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(20,184,166,.1),transparent);animation:scanLine 8s linear infinite}

    .input-glow{transition:all .3s ease}
    .input-glow:focus{border-color:rgba(20,184,166,.5);box-shadow:0 0 0 3px rgba(20,184,166,.08),0 0 20px rgba(20,184,166,.05)}

    .btn-primary{background:linear-gradient(135deg,#14b8a6,#0d9488);transition:all .3s cubic-bezier(.16,1,.3,1)}
    .btn-primary:hover:not(:disabled){background:linear-gradient(135deg,#0d9488,#0f766e);transform:translateY(-1px);box-shadow:0 8px 25px -5px rgba(20,184,166,.3)}
    .btn-primary:active:not(:disabled){transform:translateY(0) scale(.98)}

    .sidebar-tooltip{opacity:0;transform:translateX(-8px);transition:all .2s ease;pointer-events:none}
    .sidebar-item:hover .sidebar-tooltip{opacity:1;transform:translateX(0)}

    .table-row-hover{transition:all .3s ease}
    .table-row-hover:hover{background:rgba(20,184,166,.03);border-color:rgba(20,184,166,.15)}
    .table-row-hover:hover .row-name{color:#5eead4}
    .table-row-hover:hover .row-actions{opacity:1;transform:translateX(0)}

    .tag-float{animation:tagFloat 3s ease-in-out infinite}

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
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1, ...opts });
    obs.observe(el); return () => obs.disconnect();
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
    const tick = (now) => { const p = Math.min((now - s) / dur, 1); setVal(Math.round(target * (1 - Math.pow(1 - p, 4)))); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, [target, dur]);
  return val;
}

/* ═══════════════════════════════════════
   SMALL COMPONENTS
   ═══════════════════════════════════════ */
function RippleButton({ children, onClick, disabled, className = '', ...props }) {
  const ref = useRef(null);
  const handle = (e) => {
    if (disabled) return;
    const btn = ref.current, rect = btn.getBoundingClientRect(), d = Math.max(rect.width, rect.height);
    const c = document.createElement('span');
    c.style.width = c.style.height = d + 'px';
    c.style.left = e.clientX - rect.left - d / 2 + 'px';
    c.style.top = e.clientY - rect.top - d / 2 + 'px';
    c.className = 'ripple-circle'; btn.appendChild(c); setTimeout(() => c.remove(), 600);
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

function StatCard({ icon: Icon, label, value, color, delay = 0, visible }) {
  const animVal = useAnimatedNumber(visible ? (value || 0) : 0);
  return (
    <div className="glass-card shine-effect glow-border rounded-2xl p-4 group cursor-default card-entrance glass-card-lift relative overflow-hidden" style={{ animationDelay: `${delay}s` }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: color }} />
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shrink-0" style={{ background: `linear-gradient(135deg,${color}25,${color}10)` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div>
          <div className="text-2xl font-black text-white tabular-nums number-roll" style={{ animationDelay: `${delay + .2}s` }}>{animVal}</div>
          <div className="text-[9px] text-gray-500 uppercase tracking-[.15em] font-bold">{label}</div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || { bg: 'rgba(107,114,128,.12)', border: 'rgba(107,114,128,.25)', text: '#6b7280', icon: AlertCircle };
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all hover:scale-105 cursor-default"
      style={{ background: c.bg, borderColor: c.border, color: c.text }}>
      <Icon size={10} /> {status}
    </span>
  );
}

function SectionCard({ title, icon: Icon, children, color = '#14b8a6', delay = 0, collapsible = false }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="glass-card rounded-2xl overflow-hidden slide-up" style={{ animationDelay: `${delay}s` }}>
      <div className={`flex items-center justify-between px-5 py-3 border-b border-[#1e3a42]/30 ${collapsible ? 'cursor-pointer hover:bg-[#14b8a6]/[.03]' : ''}`}
        onClick={() => collapsible && setOpen(!open)}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}12` }}><Icon size={14} style={{ color }} /></div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h4>
        </div>
        {collapsible && <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />}
      </div>
      <div className={`transition-all duration-400 ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-2 py-1.5 group">
      {Icon && <Icon size={11} className="text-[#14b8a6] mt-0.5 shrink-0" />}
      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold min-w-[80px] shrink-0">{label}</span>
      <span className="text-xs text-white font-medium group-hover:text-[#2dd4bf] transition-colors">{value || <span className="text-gray-600 italic">N/A</span>}</span>
    </div>
  );
}

/* Resume Viewer */
function ResumeViewerModal({ resumeUrl, onClose }) {
  if (!resumeUrl) return null;
  const gUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(resumeUrl)}`;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div className="modal-bg absolute inset-0 bg-black/80 backdrop-blur-xl" />
      <div onClick={e => e.stopPropagation()} className="modal-reveal relative w-full max-w-5xl h-[90vh] bg-[#0A1A22] border border-[#1e3a42]/50 rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-1 bg-gradient-to-r from-[#14b8a6] via-[#06b6d4] to-[#2dd4bf] rounded-t-3xl" style={{ backgroundSize: '200% 200%', animation: 'gradientShift 3s ease infinite' }} />
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e3a42]/40">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#14b8a6]" />
            <h3 className="text-sm font-bold text-white">Resume Preview</h3>
          </div>
          <div className="flex items-center gap-2">
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#14b8a6]/10 hover:bg-[#14b8a6]/20 text-[#2dd4bf] font-bold border border-[#14b8a6]/20 transition-all cursor-pointer">
              <ExternalLink size={12} /> Open Original
            </a>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e3a42]/20 text-gray-400 hover:text-white hover:bg-red-500/15 transition-all cursor-pointer hover:rotate-90 duration-300"><X size={16} /></button>
          </div>
        </div>
        <iframe title="Resume Preview" src={gUrl} className="w-full h-[calc(90vh-60px)]" />
      </div>
    </div>
  );
}

/* Table Skeleton */
function TableSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden fade-in">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[#1e3a42]/15" style={{ animationDelay: `${i * .06}s` }}>
          <div className="w-10 h-10 shimmer-skeleton rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-36 shimmer-skeleton rounded-lg" />
            <div className="h-3 w-24 shimmer-skeleton rounded-lg" />
          </div>
          <div className="w-20 h-6 shimmer-skeleton rounded-lg hidden sm:block" />
          <div className="w-16 h-6 shimmer-skeleton rounded-full" />
          <div className="w-14 h-8 shimmer-skeleton rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function AdminApplicationsPage() {
  const navigate = useNavigate();
  const adminUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user') || 'null');
    } catch {
      return null;
    }
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [resumePreviewUrl, setResumePreviewUrl] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiResumeMeta, setAiResumeMeta] = useState(null);
  const [aiError, setAiError] = useState('');

  const showToast = (m, t = 'success') => setToast({ message: m, type: t });
  const [statsRef, statsVisible] = useInView();

  useEffect(() => { const a = localStorage.getItem('admin_user'); if (!a) { navigate('/login'); return; } fetchApplications(); }, [filter, page, navigate]);
  useEffect(() => {
    setAiAnalysis(null);
    setAiResumeMeta(null);
    setAiError('');
    setAiAnalyzing(false);
  }, [selectedApplication?.id]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter) params.set('status', filter);
      params.set('page', String(page));
      params.set('per_page', '20');
      const res = await api.get(`/admin/applications?${params.toString()}`);
      const payload = res.data?.data;
      const rows = payload?.data || payload || [];
      setApplications(Array.isArray(rows) ? rows : []);
      setPagination({ current_page: payload?.current_page || 1, last_page: payload?.last_page || 1, total: payload?.total || (Array.isArray(rows) ? rows.length : 0) });
    } catch { setApplications([]); setPagination({ current_page: 1, last_page: 1, total: 0 }); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (appId, nextStatus) => {
    try {
      await api.put(`/admin/applications/${appId}`, { status: nextStatus });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: nextStatus } : a));
      setSelectedApplication(prev => prev && prev.id === appId ? { ...prev, status: nextStatus } : prev);
      showToast(`Status updated to ${nextStatus}`);
      if (filter && filter !== nextStatus) await fetchApplications();
    } catch (err) { showToast(err?.response?.data?.message || 'Failed to update status', 'error'); }
  };

  const handleRefresh = async () => { setRefreshing(true); await fetchApplications(); setTimeout(() => setRefreshing(false), 600); showToast('Applications refreshed', 'info'); };
  const handleLogout = () => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); window.location.assign('/login'); };

  const handleAnalyzeWithAi = async (application) => {
    if (!application?.id || aiAnalyzing) return;
    try {
      setAiAnalyzing(true);
      setAiError('');
      const res = await api.post(`/admin/applications/${application.id}/ai-analysis`);
      const payload = res?.data?.data || {};
      setAiAnalysis(payload.analysis || null);
      setAiResumeMeta(payload.resume || null);
      showToast('AI analysis completed', 'success');
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to analyze with AI';
      setAiError(msg);
      showToast(msg, 'error');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, path: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'courses', label: 'Courses', icon: GraduationCap, path: '/admin/courses' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/admin/jobs' },
    { id: 'applications', label: 'Applications', icon: Award, path: '/admin/applications', badge: 'Live' },
  ];

  const screeningQA = useMemo(() => {
    if (!selectedApplication) return [];
    const responses = normalizeArray(selectedApplication.screening_responses);
    const byQid = Object.fromEntries(responses.map(r => [r.screening_question_id, r.response_text || '']));
    const questions = normalizeArray(selectedApplication.job?.screening_questions);
    if (questions.length > 0) return questions.map(q => ({ question: q.question_text, answer: byQid[q.id] || 'No response' }));
    return responses.map(r => ({ question: r.screening_question?.question_text || 'Question', answer: r.response_text || 'No response' }));
  }, [selectedApplication]);

  const statusCounts = useMemo(() => {
    const counts = { total: applications.length };
    STATUS_OPTIONS.forEach(s => { counts[s] = applications.filter(a => a.status === s).length; });
    return counts;
  }, [applications]);

  const filteredApps = useMemo(() => {
    if (!searchQuery) return applications;
    const q = searchQuery.toLowerCase();
    return applications.filter(a => {
      const name = (a.personal_info?.full_name || a.user?.name || '').toLowerCase();
      const job = (a.job?.title || '').toLowerCase();
      const company = (a.job?.company || '').toLowerCase();
      return name.includes(q) || job.includes(q) || company.includes(q);
    });
  }, [applications, searchQuery]);

  return (
    <>
      <InjectStyles />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ResumeViewerModal resumeUrl={resumePreviewUrl} onClose={() => setResumePreviewUrl('')} />

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
                const isActive = item.id === 'applications';
                return (
                  <div key={item.id} className="relative sidebar-item sidebar-item-in" style={{ animationDelay: `${i * .06}s` }}>
                    <button onClick={() => navigate(item.path)} onMouseEnter={() => setSidebarHovered(item.id)} onMouseLeave={() => setSidebarHovered(null)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${isActive ? 'bg-[#14b8a6]/12 text-[#2dd4bf] border border-[#14b8a6]/20' : 'text-gray-500 hover:text-gray-300 hover:bg-[#1e3a42]/15 border border-transparent'}`}>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#14b8a6]" style={{ boxShadow: '0 0 10px rgba(20,184,166,.5)' }} />}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${isActive ? 'bg-[#14b8a6]/15' : 'group-hover:bg-[#1e3a42]/20'}`}>
                        <item.icon size={16} className={`transition-transform duration-300 ${sidebarHovered === item.id ? 'scale-110' : ''}`} />
                      </div>
                      <span className={`text-sm font-semibold transition-all duration-500 whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{item.label}</span>
                      {item.badge && sidebarOpen && <span className="ml-auto px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">{item.badge}</span>}
                      {isActive && sidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#14b8a6] status-dot" />}
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/[.03] to-transparent pointer-events-none" />
                    </button>
                    {!sidebarOpen && <div className="sidebar-tooltip absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#0A1A22] border border-[#1e3a42]/50 rounded-lg text-xs font-semibold text-white whitespace-nowrap z-50 shadow-xl">{item.label}</div>}
                  </div>
                );
              })}
            </nav>
            <div className="p-3 border-t border-[#1e3a42]/30">
              {sidebarOpen && <div className="flex items-center gap-3 px-3 py-2.5 bg-[#1e3a42]/10 rounded-xl mb-2 border border-[#1e3a42]/20 fade-in"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">A</div><div className="flex-1 min-w-0"><p className="text-xs font-bold text-white truncate">{adminUser?.name || 'Administrator'}</p><p className="text-[10px] text-gray-600 truncate">{adminUser?.email || 'No email loaded'}</p></div><button onClick={() => navigate('/admin/settings')} className="p-1.5 rounded-lg hover:bg-[#1e3a42]/30 text-gray-500 hover:text-white transition-all hover:rotate-90 duration-300 cursor-pointer"><Settings size={13} /></button></div>}
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
                  <div className="flex items-center gap-2 text-xs mb-2"><span className="text-gray-600">Admin</span><ChevronRight size={11} className="text-gray-700" /><span className="text-[#14b8a6] font-semibold">Applications</span></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20 pulse-glow"><Award size={20} className="text-white" /></div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Application <span className="gradient-text">Review</span></h1>
                      <p className="text-xs text-gray-500 mt-0.5">Review resumes, education, skills, references & screening responses</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#071015]/60 border border-[#1e3a42]/30 text-gray-500 hover:text-white hover:border-[#14b8a6]/25 transition-all cursor-pointer"><Bell size={15} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full status-dot" /></button>
                  <button onClick={handleRefresh} disabled={refreshing} className={`w-9 h-9 flex items-center justify-center rounded-xl bg-[#071015]/60 border border-[#1e3a42]/30 text-gray-500 hover:text-[#14b8a6] hover:border-[#14b8a6]/25 transition-all cursor-pointer ${refreshing ? 'animate-spin' : ''}`}><RefreshCw size={15} /></button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              <StatCard icon={FileText} label="Total" value={pagination.total} color="#14b8a6" delay={0} visible={statsVisible} />
              <StatCard icon={Clock} label="Pending" value={statusCounts.Pending || 0} color="#f59e0b" delay={.06} visible={statsVisible} />
              <StatCard icon={Eye} label="Reviewed" value={statusCounts.Reviewed || 0} color="#3b82f6" delay={.12} visible={statsVisible} />
              <StatCard icon={Star} label="Shortlisted" value={statusCounts.Shortlisted || 0} color="#a855f7" delay={.18} visible={statsVisible} />
              <StatCard icon={CheckCircle} label="Accepted" value={statusCounts.Accepted || 0} color="#10b981" delay={.24} visible={statsVisible} />
              <StatCard icon={XCircle} label="Rejected" value={statusCounts.Rejected || 0} color="#ef4444" delay={.3} visible={statsVisible} />
            </div>

            {/* Search + Filters */}
            <div className="mb-6 slide-up" style={{ animationDelay: '.1s' }}>
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative group">
                  <div className={`absolute inset-0 rounded-xl transition-opacity duration-500 ${searchFocused ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(135deg,rgba(20,184,166,.06),rgba(6,182,212,.03))', filter: 'blur(15px)' }} />
                  <div className="relative">
                    <Search size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${searchFocused ? 'text-[#14b8a6] scale-110' : 'text-gray-600'}`} />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                      placeholder="Search by name, job title, company..." className="w-full pl-10 pr-10 py-3 bg-[#071015]/60 border border-[#1e3a42]/40 rounded-xl text-white text-sm placeholder-gray-600 input-glow outline-none" />
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-lg bg-[#1e3a42]/40 text-gray-500 hover:text-white transition cursor-pointer hover:scale-110 hover:rotate-90 duration-300"><X size={11} /></button>}
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#14b8a6] to-transparent rounded-full transition-all duration-500 ${searchFocused ? 'w-[85%] opacity-100' : 'w-0 opacity-0'}`} />
                  </div>
                </div>
                {/* Status filters */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['', ...STATUS_OPTIONS].map(status => {
                    const isActive = filter === status;
                    const conf = status ? STATUS_CONFIG[status] : null;
                    return (
                      <button key={status || 'all'} onClick={() => { setFilter(status); setPage(1); }}
                        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer border
                          ${isActive ? 'bg-[#14b8a6]/15 text-[#2dd4bf] border-[#14b8a6]/25 shadow-lg shadow-[#14b8a6]/5' : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#1e3a42]/15'}`}>
                        {status ? <div className="w-2 h-2 rounded-full" style={{ background: conf?.text }} /> : <Layers size={12} />}
                        {status || 'All'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 fade-in" style={{ animationDelay: '.15s' }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#14b8a6] to-[#06b6d4]" />
                <h2 className="text-sm font-bold text-white uppercase tracking-[.12em]">{filter || 'All'} Applications</h2>
                <span className="text-[10px] text-gray-600 bg-[#0F3A42]/40 px-2 py-0.5 rounded-full tabular-nums font-bold">{filteredApps.length}</span>
              </div>
              <span className="text-[10px] text-gray-600">Page {pagination.current_page}/{pagination.last_page}</span>
            </div>

            {/* TABLE */}
            {loading ? <TableSkeleton /> : filteredApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 slide-up">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-3xl bg-[#0A1A22] border border-[#1e3a42]/40 flex items-center justify-center float-slow"><FileText size={40} className="text-gray-700" /></div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 flex items-center justify-center scale-in" style={{ animationDelay: '.3s' }}><Search size={14} className="text-[#14b8a6]" /></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No applications found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="glass-card rounded-2xl overflow-hidden card-entrance">
                {/* Table Header */}
                <div className="hidden md:flex items-center gap-4 px-5 py-3 border-b border-[#1e3a42]/30 bg-[#071015]/30">
                  {['Applicant', 'Job Position', 'Contact', 'Applied', 'Status', 'Actions'].map(h => (
                    <span key={h} className={`text-[9px] text-gray-600 font-bold uppercase tracking-wider ${h === 'Applicant' || h === 'Job Position' ? 'flex-1' : h === 'Contact' ? 'w-[160px] hidden lg:block' : h === 'Applied' ? 'w-[100px] hidden xl:block' : h === 'Status' ? 'w-[110px]' : 'w-[140px]'}`}>{h}</span>
                  ))}
                </div>
                {/* Rows */}
                {filteredApps.map((app, idx) => {
                  const name = app.personal_info?.full_name || app.user?.name || 'N/A';
                  const email = app.personal_info?.email || app.user?.email || '';
                  const phone = app.personal_info?.phone || app.user?.phone || '';
                  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                  const grads = ['from-[#14b8a6] to-[#0891b2]', 'from-[#6366f1] to-[#8b5cf6]', 'from-[#f59e0b] to-[#ef4444]', 'from-[#10b981] to-[#059669]', 'from-[#ec4899] to-[#be185d]', 'from-[#3b82f6] to-[#1d4ed8]'];
                  const grad = grads[(name.charCodeAt(0) || 0) % grads.length];

                  return (
                    <div key={app.id} className="table-row-hover flex flex-col md:flex-row md:items-center gap-2 md:gap-4 px-5 py-4 border-b border-[#1e3a42]/15 cursor-pointer row-slide group"
                      style={{ animationDelay: `${idx * .04}s` }} onClick={() => setSelectedApplication(app)}>
                      {/* Applicant */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} p-[2px] group-hover:scale-105 transition-transform duration-300 shadow-md shrink-0`}>
                          <div className="w-full h-full rounded-xl bg-[#0A1A22] flex items-center justify-center"><span className="text-sm font-bold text-white">{initials}</span></div>
                        </div>
                        <div className="min-w-0">
                          <p className="row-name text-sm font-semibold text-white truncate transition-colors">{name}</p>
                          <p className="text-[10px] text-gray-600">#{app.id}</p>
                        </div>
                      </div>
                      {/* Job */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-300 truncate">{app.job?.title || 'N/A'}</p>
                        <p className="text-[10px] text-gray-600 truncate">{app.job?.company || 'N/A'}</p>
                      </div>
                      {/* Contact */}
                      <div className="w-[160px] hidden lg:block">
                        <p className="text-[11px] text-gray-400 truncate flex items-center gap-1"><Mail size={9} className="text-gray-600 shrink-0" />{email || 'N/A'}</p>
                        {phone && <p className="text-[10px] text-gray-500 truncate flex items-center gap-1"><Phone size={9} className="text-gray-600 shrink-0" />{phone}</p>}
                      </div>
                      {/* Applied */}
                      <div className="w-[100px] hidden xl:block">
                        <span className="text-[10px] text-gray-500">{formatDate(app.applied_at || app.submitted_at || app.created_at)}</span>
                      </div>
                      {/* Status */}
                      <div className="w-[110px]"><StatusBadge status={app.status} /></div>
                      {/* Actions */}
                      <div className="w-[140px] flex items-center gap-2 row-actions md:opacity-0 md:translate-x-2 transition-all duration-300">
                        <RippleButton onClick={e => { e.stopPropagation(); setSelectedApplication(app); }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#14b8a6]/10 hover:bg-[#14b8a6]/20 text-[#2dd4bf] text-[10px] font-bold border border-[#14b8a6]/15 transition-all cursor-pointer">
                          <Eye size={11} /> View
                        </RippleButton>
                        <select value={app.status} onClick={e => e.stopPropagation()} onChange={e => handleStatusChange(app.id, e.target.value)}
                          className="bg-[#071015]/60 border border-[#1e3a42]/40 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none input-glow cursor-pointer">
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredApps.length > 0 && (
              <div className="flex items-center justify-between mt-5 fade-in">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#0A1A22]/50 border border-[#1e3a42]/25 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6] animate-pulse" />
                  <span className="text-[11px] text-gray-500">Showing <span className="text-white font-bold">{filteredApps.length}</span> of <span className="text-white font-bold">{pagination.total}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pagination.current_page <= 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#071015]/60 border border-[#1e3a42]/30 text-xs font-semibold text-gray-400 hover:text-white hover:border-[#14b8a6]/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft size={13} /> Prev
                  </button>
                  <span className="text-xs text-gray-500 px-2 tabular-nums">{pagination.current_page} / {pagination.last_page}</span>
                  <button onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))} disabled={pagination.current_page >= pagination.last_page}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#071015]/60 border border-[#1e3a42]/30 text-xs font-semibold text-gray-400 hover:text-white hover:border-[#14b8a6]/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                    Next <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ════════════════════════════════
            APPLICATION DETAIL MODAL
           ════════════════════════════════ */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setSelectedApplication(null)}>
            <div className="modal-bg absolute inset-0 bg-black/75 backdrop-blur-xl" />
            <div onClick={e => e.stopPropagation()} className="modal-reveal relative w-full max-w-5xl my-6 bg-[#0A1A22] border border-[#1e3a42]/50 rounded-3xl shadow-2xl shadow-[#14b8a6]/5 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#14b8a6] via-[#06b6d4] to-[#2dd4bf] rounded-t-3xl" style={{ backgroundSize: '200% 200%', animation: 'gradientShift 3s ease infinite' }} />

              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-[#1e3a42]/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] p-[2px] shadow-lg shadow-[#14b8a6]/25">
                    <div className="w-full h-full rounded-2xl bg-[#0A1A22] flex items-center justify-center text-xl font-black text-white">
                      {(selectedApplication.personal_info?.full_name || selectedApplication.user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">{selectedApplication.personal_info?.full_name || selectedApplication.user?.name || 'Application'}</h2>
                    <p className="text-xs text-gray-500 flex items-center gap-2"><Briefcase size={11} />{selectedApplication.job?.title || 'N/A'} at {selectedApplication.job?.company || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedApplication.status} />
                  <RippleButton
                    onClick={() => handleAnalyzeWithAi(selectedApplication)}
                    disabled={aiAnalyzing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#14b8a6]/10 hover:bg-[#14b8a6]/20 text-[#2dd4bf] text-xs font-bold border border-[#14b8a6]/15 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {aiAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {aiAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                  </RippleButton>
                  <select value={selectedApplication.status} onChange={e => handleStatusChange(selectedApplication.id, e.target.value)}
                    className="bg-[#071015]/60 border border-[#1e3a42]/40 rounded-lg px-3 py-2 text-white text-xs outline-none input-glow cursor-pointer">
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setSelectedApplication(null)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1e3a42]/20 text-gray-400 hover:text-white hover:bg-red-500/15 transition-all cursor-pointer hover:rotate-90 duration-300 border border-transparent hover:border-red-500/20"><X size={16} /></button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                  <SectionCard title="Personal Information" icon={User} delay={0}>
                    <div className="space-y-1">
                      <InfoRow label="Name" value={selectedApplication.personal_info?.full_name || selectedApplication.user?.name} icon={User} />
                      <InfoRow label="Email" value={selectedApplication.personal_info?.email || selectedApplication.user?.email} icon={Mail} />
                      <InfoRow label="Phone" value={selectedApplication.personal_info?.phone || selectedApplication.user?.phone} icon={Phone} />
                      <InfoRow label="Address" value={selectedApplication.personal_info?.address || selectedApplication.user?.present_address} icon={MapPin} />
                      <InfoRow label="DOB" value={selectedApplication.personal_info?.date_of_birth || selectedApplication.user?.date_of_birth} icon={Calendar} />
                      <InfoRow label="Nationality" value={selectedApplication.personal_info?.nationality || selectedApplication.user?.nationality} icon={Globe} />
                    </div>
                  </SectionCard>

                  <SectionCard title="Job & Timing" icon={Briefcase} color="#3b82f6" delay={.06}>
                    <div className="space-y-1">
                      <InfoRow label="Title" value={selectedApplication.job?.title} icon={Briefcase} />
                      <InfoRow label="Company" value={selectedApplication.job?.company} icon={Building2} />
                      <InfoRow label="Applied" value={formatDate(selectedApplication.applied_at || selectedApplication.submitted_at || selectedApplication.created_at)} icon={Clock} />
                    </div>
                  </SectionCard>

                  <SectionCard title="Resume / CV" icon={FileCheck} color="#10b981" delay={.12}>
                    {selectedApplication.resume_path ? (
                      <div className="space-y-3">
                        <p className="text-[10px] text-gray-500">Uploaded CV available</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <RippleButton onClick={() => setResumePreviewUrl(selectedApplication.resume_path)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#14b8a6]/10 hover:bg-[#14b8a6]/20 text-[#2dd4bf] text-xs font-bold border border-[#14b8a6]/15 transition-all cursor-pointer"><Eye size={12} />Preview</RippleButton>
                          <a href={selectedApplication.resume_path} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1e3a42]/20 hover:bg-[#1e3a42]/40 text-gray-300 text-xs font-semibold transition-all"><ExternalLink size={12} />Open</a>
                        </div>
                        <p className="text-[9px] text-gray-600 break-all">{selectedApplication.resume_path}</p>
                      </div>
                    ) : <p className="text-xs text-gray-600 italic">No CV uploaded</p>}
                  </SectionCard>

                  <SectionCard title="Skills" icon={Code} color="#8b5cf6" delay={.18}>
                    {normalizeArray(selectedApplication.skills).length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {normalizeArray(selectedApplication.skills).map((s, i) => (
                          <span key={`${s}-${i}`} className="px-2.5 py-1 rounded-lg bg-[#14b8a6]/8 text-[#2dd4bf] text-[10px] font-bold border border-[#14b8a6]/15 hover:scale-105 transition-all cursor-default tag-float" style={{ animationDelay: `${i * .1}s` }}>{s}</span>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-600 italic">No skills provided</p>}
                  </SectionCard>

                  <SectionCard title="Education" icon={GraduationCap} color="#06b6d4" delay={.24} collapsible>
                    <div className="space-y-3">
                      {[{ title: 'SSC', data: selectedApplication.education_info?.ssc, fields: [['School', 'school_name'], ['Year', 'year'], ['Group', 'group'], ['Board', 'board'], ['Result', 'result']] },
                        { title: 'HSC', data: selectedApplication.education_info?.hsc, fields: [['College', 'college_name'], ['Year', 'year'], ['Group', 'group'], ['Board', 'board'], ['Result', 'result']] },
                        { title: 'University', data: selectedApplication.education_info?.university, fields: [['Name', 'name'], ['Status', 'status'], ['Year', 'current_year'], ['Semester', 'current_semester'], ['Graduation', 'graduation_year'], ['CGPA', 'cgpa']] }
                      ].map(sec => (
                        <div key={sec.title} className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/20">
                          <p className="text-[10px] font-bold text-[#14b8a6] uppercase tracking-wider mb-2">{sec.title}</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {sec.fields.map(([label, key]) => (
                              <div key={key} className="flex items-center gap-1">
                                <span className="text-[9px] text-gray-600 uppercase tracking-wider font-bold min-w-[60px]">{label}</span>
                                <span className="text-[11px] text-white truncate">{sec.data?.[key] || 'N/A'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Work Experience" icon={Building2} color="#f59e0b" delay={.3} collapsible>
                    {normalizeArray(selectedApplication.work_experience).length > 0 ? (
                      <div className="space-y-2">
                        {normalizeArray(selectedApplication.work_experience).map((exp, i) => (
                          <div key={i} className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/20 slide-up" style={{ animationDelay: `${i * .06}s` }}>
                            <p className="text-xs font-semibold text-white">{exp.job_title || 'N/A'}</p>
                            <p className="text-[10px] text-gray-400">{exp.company || 'N/A'} • {exp.employment_dates || 'N/A'}</p>
                            {exp.description && <p className="text-[10px] text-gray-500 mt-1">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-600 italic">No work experience</p>}
                  </SectionCard>

                  <SectionCard title="Cover Letter" icon={Mail} color="#ec4899" delay={.36}>
                    <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedApplication.cover_letter || <span className="text-gray-600 italic">No cover letter provided</span>}</p>
                  </SectionCard>

                  <SectionCard title="AI Application Analysis" icon={Sparkles} color="#14b8a6" delay={.39}>
                    {aiAnalyzing ? (
                      <div className="flex items-center gap-2 text-xs text-[#2dd4bf]">
                        <Loader2 size={14} className="animate-spin" />
                        Gemini is analyzing job description, cover letter, and CV...
                      </div>
                    ) : aiError ? (
                      <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{aiError}</div>
                    ) : aiAnalysis ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/20">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Cover Letter AI Likelihood</p>
                            <p className="text-lg font-black text-white">{aiAnalysis.cover_letter_ai_likelihood_percent ?? 0}%</p>
                            <div className="h-1.5 rounded-full bg-[#1e3a42]/40 mt-2 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#14b8a6] to-[#06b6d4]" style={{ width: `${Math.max(0, Math.min(100, aiAnalysis.cover_letter_ai_likelihood_percent || 0))}%` }} />
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/20">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">CV AI Likelihood</p>
                            <p className="text-lg font-black text-white">{aiAnalysis.cv_ai_likelihood_percent ?? 0}%</p>
                            <div className="h-1.5 rounded-full bg-[#1e3a42]/40 mt-2 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444]" style={{ width: `${Math.max(0, Math.min(100, aiAnalysis.cv_ai_likelihood_percent || 0))}%` }} />
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/20">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Job Fit Summary</p>
                          <p className="text-xs text-gray-300">{aiAnalysis.job_fit_summary || 'N/A'}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/20">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Overall Assessment</p>
                          <p className="text-xs text-gray-300">{aiAnalysis.overall_assessment || 'N/A'}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/20">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Strengths</p>
                            {Array.isArray(aiAnalysis.strengths) && aiAnalysis.strengths.length > 0 ? (
                              <div className="space-y-1">
                                {aiAnalysis.strengths.map((item, i) => <p key={i} className="text-xs text-emerald-300">• {item}</p>)}
                              </div>
                            ) : <p className="text-xs text-gray-600 italic">No strengths listed</p>}
                          </div>
                          <div className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/20">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Concerns</p>
                            {Array.isArray(aiAnalysis.concerns) && aiAnalysis.concerns.length > 0 ? (
                              <div className="space-y-1">
                                {aiAnalysis.concerns.map((item, i) => <p key={i} className="text-xs text-amber-300">• {item}</p>)}
                              </div>
                            ) : <p className="text-xs text-gray-600 italic">No concerns listed</p>}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/20">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Evidence</p>
                          {Array.isArray(aiAnalysis.evidence) && aiAnalysis.evidence.length > 0 ? (
                            <div className="space-y-1">
                              {aiAnalysis.evidence.map((item, i) => <p key={i} className="text-xs text-gray-300">• {item}</p>)}
                            </div>
                          ) : <p className="text-xs text-gray-600 italic">No evidence notes</p>}
                        </div>

                        <div className="text-[10px] text-gray-500">
                          Confidence: <span className="text-[#2dd4bf] font-bold uppercase">{aiAnalysis.confidence || 'medium'}</span>
                          {aiAnalysis.notes ? <> • Notes: {aiAnalysis.notes}</> : null}
                          {aiResumeMeta?.resume_fetch_error ? <> • Resume attachment: {aiResumeMeta.resume_fetch_error}</> : null}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">
                        Run AI analysis to estimate how likely the cover letter and CV were AI-written, and to evaluate fit against the job description.
                      </div>
                    )}
                  </SectionCard>

                  <SectionCard title="Screening Q&A" icon={MessageSquare} color="#14b8a6" delay={.42} collapsible>
                    {screeningQA.length > 0 ? (
                      <div className="space-y-2">
                        {screeningQA.map((qa, i) => (
                          <div key={i} className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/20 slide-up" style={{ animationDelay: `${i * .06}s` }}>
                            <p className="text-[10px] font-bold text-[#14b8a6] mb-1">Q: {qa.question}</p>
                            <p className="text-xs text-gray-300">A: {qa.answer}</p>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-600 italic">No screening questions</p>}
                  </SectionCard>

                  <SectionCard title="Work Eligibility" icon={Shield} color="#10b981" delay={.48}>
                    <div className="space-y-1">
                      <InfoRow label="Authorized" value={selectedApplication.work_eligibility?.authorized_to_work ? '✅ Yes' : '❌ No'} icon={CheckCircle} />
                      <InfoRow label="Visa Needed" value={selectedApplication.work_eligibility?.visa_sponsorship_needed ? '✅ Yes' : '❌ No'} icon={Globe} />
                    </div>
                  </SectionCard>

                  <SectionCard title="References" icon={Users} color="#6366f1" delay={.54} collapsible>
                    {normalizeArray(selectedApplication.references).length > 0 ? (
                      <div className="space-y-2">
                        {normalizeArray(selectedApplication.references).map((r, i) => (
                          <div key={i} className="p-3 rounded-xl bg-[#071015]/50 border border-[#1e3a42]/20">
                            <p className="text-xs font-semibold text-white">{r.name || 'N/A'}</p>
                            <p className="text-[10px] text-gray-400">{r.relationship || 'N/A'}</p>
                            <div className="flex items-center gap-3 mt-1">
                              {r.email && <span className="text-[10px] text-gray-500 flex items-center gap-1"><Mail size={8} />{r.email}</span>}
                              {r.phone && <span className="text-[10px] text-gray-500 flex items-center gap-1"><Phone size={8} />{r.phone}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-600 italic">No references</p>}
                  </SectionCard>

                  <SectionCard title="Online Profiles" icon={Link} color="#06b6d4" delay={.6}>
                    <div className="space-y-2">
                      {['linkedin', 'github', 'portfolio'].map(key => {
                        const url = selectedApplication.online_profiles?.[key];
                        const label = key.charAt(0).toUpperCase() + key.slice(1);
                        return url ? (
                          <a key={key} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#2dd4bf] hover:text-white transition-colors group/link">
                            <ExternalLink size={11} className="group-hover/link:translate-x-0.5 transition-transform" />{label}
                          </a>
                        ) : (
                          <p key={key} className="text-[10px] text-gray-600">{label}: N/A</p>
                        );
                      })}
                    </div>
                  </SectionCard>

                  <SectionCard title="Additional Documents" icon={FileText} color="#f59e0b" delay={.66}>
                    {selectedApplication.additional_documents && Object.keys(selectedApplication.additional_documents).length > 0 ? (
                      <div className="space-y-1">
                        {Object.entries(selectedApplication.additional_documents).map(([k, v]) => (
                          <InfoRow key={k} label={k} value={String(v)} />
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-600 italic">No additional documents</p>}
                  </SectionCard>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}