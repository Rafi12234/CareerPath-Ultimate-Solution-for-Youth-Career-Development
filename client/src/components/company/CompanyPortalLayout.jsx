import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BriefcaseBusiness, UsersRound, Settings, LogOut,
  Menu, X, Plus, Building2, ChevronRight, Bell, Sparkles
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';

export const CompanyPortalStyles = () => (
  <style>{`
    @keyframes cpFadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    @keyframes cpSlideIn { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
    @keyframes cpFloat { 0%,100%{transform:translate3d(0,0,0)} 50%{transform:translate3d(0,-14px,0)} }
    @keyframes cpPulse { 0%,100%{opacity:.28;transform:scale(1)} 50%{opacity:.5;transform:scale(1.08)} }
    @keyframes cpShimmer { 0%{transform:translateX(-120%)} 100%{transform:translateX(220%)} }
    @keyframes cpSpin { to{transform:rotate(360deg)} }
    .cp-fade-up{animation:cpFadeUp .55s cubic-bezier(.16,1,.3,1) both}
    .cp-slide-in{animation:cpSlideIn .45s cubic-bezier(.16,1,.3,1) both}
    .cp-card{background:linear-gradient(145deg,rgba(10,26,34,.86),rgba(5,13,18,.94));border:1px solid rgba(30,58,66,.45);backdrop-filter:blur(20px);transition:transform .35s cubic-bezier(.16,1,.3,1),border-color .35s,box-shadow .35s}
    .cp-card:hover{border-color:rgba(20,184,166,.22);box-shadow:0 22px 55px -35px rgba(20,184,166,.45)}
    .cp-input{width:100%;background:rgba(7,16,21,.72);border:1px solid rgba(30,58,66,.75);border-radius:14px;padding:.78rem .9rem;color:#e5e7eb;outline:none;transition:.25s}
    .cp-input:focus{border-color:rgba(20,184,166,.55);box-shadow:0 0 0 3px rgba(20,184,166,.08)}
    .cp-input::placeholder{color:#4b5563}
    .cp-btn{transition:all .3s cubic-bezier(.16,1,.3,1)}
    .cp-btn:hover{transform:translateY(-1px)}
    .cp-grid-bg{background-image:linear-gradient(rgba(20,184,166,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(20,184,166,.025) 1px,transparent 1px);background-size:32px 32px}
    .cp-soft-scroll::-webkit-scrollbar{width:5px;height:5px}.cp-soft-scroll::-webkit-scrollbar-thumb{background:#1e3a42;border-radius:99px}
  `}</style>
);

const navItems = [
  { to: '/company/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/company/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { to: '/company/applications', label: 'Applicants', icon: UsersRound },
  { to: '/company/settings', label: 'Company Profile', icon: Settings },
];

export function PortalCard({ children, className = '', hover = false, ...props }) {
  return <div className={`cp-card rounded-2xl ${hover ? 'hover:-translate-y-1' : ''} ${className}`} {...props}>{children}</div>;
}

export function StatusPill({ status }) {
  const map = {
    published: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    draft: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    closed: 'text-gray-300 bg-gray-500/10 border-gray-500/20',
    Pending: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    Reviewed: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
    Shortlisted: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
    Accepted: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    Rejected: 'text-red-300 bg-red-500/10 border-red-500/20',
  };
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[status] || map.closed}`}>{status || '—'}</span>;
}

export function CompanyPortalLayout({ title, subtitle, children, actions }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { companyUser, company, logout } = useCompany();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const doLogout = async () => {
    await logout();
    navigate('/company/login');
  };

  const SidebarContent = () => (
    <>
      <div className="h-20 px-5 flex items-center border-b border-[#1e3a42]/40">
        <Link to="/company/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-xl bg-[#14b8a6]/10 border border-[#14b8a6]/20 flex items-center justify-center shrink-0">
            <Building2 size={20} className="text-[#2dd4bf]" />
            <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-[#2dd4bf] shadow-[0_0_10px_rgba(45,212,191,.7)]" />
          </div>
          {sidebarOpen && <div className="min-w-0"><div className="text-white font-black truncate">{company?.name || 'Company Portal'}</div><div className="text-[10px] text-gray-500 uppercase tracking-[.18em]">Hiring workspace</div></div>}
        </Link>
      </div>
      <nav className="p-3 space-y-1.5 flex-1">
        {navItems.map(({ to, label, icon: Icon }, i) => {
          const active = location.pathname === to || (to !== '/company/dashboard' && location.pathname.startsWith(to));
          return <Link key={to} to={to} className={`cp-slide-in group flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all ${active ? 'bg-[#14b8a6]/10 border-[#14b8a6]/20 text-[#2dd4bf]' : 'border-transparent text-gray-500 hover:text-gray-200 hover:bg-white/[.025]'}`} style={{ animationDelay: `${i * .04}s` }}>
            <Icon size={18} className="shrink-0" />
            {sidebarOpen && <><span className="text-sm font-semibold flex-1">{label}</span>{active && <ChevronRight size={14} />}</>}
          </Link>;
        })}
        <Link to="/company/jobs/new" className="mt-4 cp-btn flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-[#041014] font-black text-sm shadow-[0_12px_30px_-16px_rgba(20,184,166,.9)]">
          <Plus size={17}/>{sidebarOpen && 'Post a Job'}
        </Link>
      </nav>
      <div className="p-3 border-t border-[#1e3a42]/40">
        {sidebarOpen && <div className="px-3 pb-3"><div className="text-xs text-white font-semibold truncate">{companyUser?.name}</div><div className="text-[11px] text-gray-600 truncate">{companyUser?.email}</div></div>}
        <button onClick={doLogout} className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-red-400 hover:bg-red-500/8 transition-colors"><LogOut size={18}/>{sidebarOpen && <span className="text-sm font-semibold">Sign out</span>}</button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#03070A] text-gray-200 cp-grid-bg">
      <CompanyPortalStyles />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-20 w-[460px] h-[460px] rounded-full bg-[#14b8a6]/[.055] blur-[110px]" style={{ animation: 'cpPulse 8s ease-in-out infinite' }}/>
        <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] rounded-full bg-[#06b6d4]/[.04] blur-[110px]" style={{ animation: 'cpFloat 10s ease-in-out infinite' }}/>
      </div>

      <aside className={`hidden lg:flex fixed z-40 inset-y-0 left-0 ${sidebarOpen ? 'w-64' : 'w-[78px]'} flex-col bg-[#071015]/90 backdrop-blur-2xl border-r border-[#1e3a42]/45 transition-all duration-500`}>
        <SidebarContent />
        <button onClick={() => setSidebarOpen(v => !v)} className="absolute top-[22px] -right-3 w-7 h-7 rounded-full bg-[#0A1A22] border border-[#1e3a42] flex items-center justify-center text-gray-500 hover:text-[#2dd4bf] transition"><ChevronRight size={13} className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`}/></button>
      </aside>

      {mobileOpen && <div className="lg:hidden fixed inset-0 z-50"><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)}/><aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#071015] border-r border-[#1e3a42]/60 flex flex-col"><div className="absolute right-3 top-3"><button onClick={() => setMobileOpen(false)} className="p-2 text-gray-400"><X size={20}/></button></div><SidebarContent /></aside></div>}

      <div className={`relative min-h-screen transition-all duration-500 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-[78px]'}`}>
        <header className="sticky top-0 z-30 h-20 border-b border-[#1e3a42]/35 bg-[#03070A]/75 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-xl border border-[#1e3a42]/50 text-gray-400"><Menu size={20}/></button>
          <div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-[10px] uppercase tracking-[.18em] text-[#14b8a6] font-bold mb-1"><Sparkles size={11}/>Company Portal</div><h1 className="text-xl sm:text-2xl font-black text-white truncate">{title}</h1>{subtitle && <p className="text-xs text-gray-600 mt-0.5 truncate">{subtitle}</p>}</div>
          <div className="flex items-center gap-2">{actions}<button className="relative p-2.5 rounded-xl border border-[#1e3a42]/45 bg-[#0A1A22]/50 text-gray-500"><Bell size={17}/><span className="absolute right-2 top-2 w-1.5 h-1.5 bg-[#14b8a6] rounded-full"/></button></div>
        </header>
        <main className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
