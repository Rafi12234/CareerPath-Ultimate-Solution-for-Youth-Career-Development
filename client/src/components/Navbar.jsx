import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu, X, Bell, ChevronDown, LogOut, User, Briefcase,
  BookOpen, Home, MessageSquare, LayoutDashboard, Sparkles,
  Settings, ArrowRight, Zap, Bot, FileText
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [mobileAiOpen, setMobileAiOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const menuRef = useRef(null);
  const aiMenuRef = useRef(null);
  const navContainerRef = useRef(null);
  const linkRefs = useRef([]);
  const [notifPing, setNotifPing] = useState(true);
  const [mouseOnNav, setMouseOnNav] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleSafeNav = (e, to) => {
    e.preventDefault();
    // CoursePlayer can retain heavy fullscreen/overlay UI state during client-side transitions.
    // Force a hard navigation only when exiting CoursePlayer to guarantee clean teardown.
    const isCoursePlayerRoute = location.pathname.startsWith('/course-player/');
    if (isAuthPage || isCoursePlayerRoute) {
      window.location.assign(to);
      return;
    }
    navigate(to);
  };

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (aiMenuRef.current && !aiMenuRef.current.contains(e.target)) setAiMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll detection with progress
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalH > 0 ? Math.min(window.scrollY / totalH, 1) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
    setAiMenuOpen(false);
    setMobileAiOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/profile', label: 'Profile', icon: User },
        { to: '/jobs', label: 'Jobs', icon: Briefcase },
        { to: '/resources', label: 'Resources', icon: BookOpen },
        {
          label: 'AI Features',
          icon: Sparkles,
          children: [
            { to: '/chatbot', label: 'AI Chat', icon: Bot },
            { to: '/cv-analyzer', label: 'CV Analyzer', icon: FileText },
          ],
        },
        { to: '/contact', label: 'Contact', icon: MessageSquare },
      ]
    : [
        { to: '/', label: 'Home', icon: Home },
        { to: '/jobs', label: 'Jobs', icon: Briefcase },
        { to: '/resources', label: 'Resources', icon: BookOpen },
        { to: '/contact', label: 'Contact', icon: MessageSquare },
      ];

  const isLinkActive = (link) => {
    if (link.children) {
      return link.children.some((child) => isActive(child.to));
    }
    return isActive(link.to);
  };

  // Animated pill indicator
  const updatePill = useCallback((index) => {
    const el = linkRefs.current[index];
    if (el) {
      const container = navContainerRef.current;
      const containerRect = container?.getBoundingClientRect() || { left: 0 };
      const rect = el.getBoundingClientRect();
      setPillStyle({
        left: rect.left - containerRect.left,
        width: rect.width,
        opacity: 1,
      });
    }
  }, []);

  // Update pill on route change
  useEffect(() => {
    const activeIdx = navLinks.findIndex((l) => isLinkActive(l));
    if (activeIdx >= 0) {
      // Small delay to ensure refs are ready
      setTimeout(() => updatePill(activeIdx), 50);
    } else {
      setPillStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [location.pathname, navLinks, updatePill]);

  const handleHover = (index) => {
    setHoverIndex(index);
    updatePill(index);
  };

  const handleLeave = () => {
    setHoverIndex(null);
    const activeIdx = navLinks.findIndex((l) => isLinkActive(l));
    if (activeIdx >= 0) updatePill(activeIdx);
    else setPillStyle(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <>
      <style>{`
        @keyframes nav-slide-down {
          from { opacity: 0; transform: translateY(-20px) scale(0.97); }
          to { opacity: 1; transform: none; }
        }
        @keyframes nav-glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes nav-border-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes nav-ping {
          0% { transform: scale(1); opacity: 1; }
          75% { transform: scale(2.5); opacity: 0; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes nav-menu-in {
          from { opacity: 0; transform: translateY(8px) scale(0.95) rotateX(8deg); }
          to { opacity: 1; transform: none; }
        }
        @keyframes nav-mobile-slide {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes nav-shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes nav-logo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes nav-dot-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes nav-progress-glow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 4px rgba(20,184,166,0.3)); }
          50% { filter: brightness(1.3) drop-shadow(0 0 8px rgba(20,184,166,0.6)); }
        }

        .nav-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        .nav-3d-inner {
          transform: translateZ(0);
        }

        .nav-glass {
          background: linear-gradient(
            135deg,
            rgba(7, 16, 21, 0.55) 0%,
            rgba(10, 26, 34, 0.45) 50%,
            rgba(7, 16, 21, 0.55) 100%
          );
          backdrop-filter: blur(20px) saturate(1.6);
          -webkit-backdrop-filter: blur(20px) saturate(1.6);
        }

        .nav-glass-heavy {
          background: linear-gradient(
            145deg,
            rgba(7, 16, 21, 0.75) 0%,
            rgba(10, 26, 34, 0.68) 50%,
            rgba(7, 16, 21, 0.75) 100%
          );
          backdrop-filter: blur(20px) saturate(1.8);
          -webkit-backdrop-filter: blur(20px) saturate(1.8);
        }

        /* Link hover 3D lift */
        .nav-link-3d {
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateZ(0) translateY(0);
        }
        .nav-link-3d:hover {
          transform: translateZ(2px) translateY(-1px);
        }

        /* Shimmer effect on sign-up button */
        .nav-shimmer-btn {
          position: relative;
          overflow: hidden;
        }
        .nav-shimmer-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: nav-shimmer 3s ease-in-out infinite;
        }

        /* Mobile link stagger */
        .nav-mobile-stagger > * {
          animation: nav-mobile-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .nav-mobile-stagger > *:nth-child(1) { animation-delay: 0.05s; }
        .nav-mobile-stagger > *:nth-child(2) { animation-delay: 0.1s; }
        .nav-mobile-stagger > *:nth-child(3) { animation-delay: 0.15s; }
        .nav-mobile-stagger > *:nth-child(4) { animation-delay: 0.2s; }
        .nav-mobile-stagger > *:nth-child(5) { animation-delay: 0.25s; }
        .nav-mobile-stagger > *:nth-child(6) { animation-delay: 0.3s; }
        .nav-mobile-stagger > *:nth-child(7) { animation-delay: 0.35s; }
      `}</style>

      <nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-5"
        style={{
          paddingTop: scrolled ? '8px' : '12px',
          transition: 'padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          animation: 'nav-slide-down 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={() => setMouseOnNav(true)}
        onMouseLeave={() => setMouseOnNav(false)}
      >
        <div className="w-full max-w-[1200px] nav-3d">
          <div
            className={`nav-3d-inner relative rounded-[30px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              scrolled
                ? 'nav-glass-heavy shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6),0_2px_15px_-3px_rgba(20,184,166,0.08)]'
                : 'nav-glass shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4),0_1px_10px_-2px_rgba(20,184,166,0.05)]'
            }`}
          >
            {/* ── Animated border layer ── */}
            <div
              className="absolute inset-0 rounded-[20px] pointer-events-none transition-opacity duration-700"
              style={{ opacity: mouseOnNav ? 1 : 0.5 }}
            >
              {/* Outer gradient border */}
              <div
                className="absolute inset-0 rounded-[20px] p-[1px]"
                style={{
                  background: `linear-gradient(90deg, 
                    rgba(20,184,166,${mouseOnNav ? 0.4 : 0.15}), 
                    rgba(6,182,212,${mouseOnNav ? 0.2 : 0.08}), 
                    rgba(139,92,246,${mouseOnNav ? 0.15 : 0.05}),
                    rgba(6,182,212,${mouseOnNav ? 0.2 : 0.08}),
                    rgba(20,184,166,${mouseOnNav ? 0.4 : 0.15})
                  )`,
                  backgroundSize: '200% 100%',
                  animation: 'nav-border-flow 6s linear infinite',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  transition: 'background 0.5s ease',
                }}
              />
              {/* Inner highlight line — top */}
              <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent rounded-full" />
            </div>

            {/* ── Scroll progress bar ── */}
            <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${scrollProgress * 100}%`,
                  background: 'linear-gradient(90deg, #14b8a6, #06b6d4, #8b5cf6)',
                  opacity: scrollProgress > 0.01 ? 0.8 : 0,
                  animation: scrollProgress > 0 ? 'nav-progress-glow 3s ease infinite' : 'none',
                }}
              />
            </div>

            {/* ── Top reflection for 3D depth ── */}
            <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-[20px] pointer-events-none overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
                }}
              />
            </div>

            {/* ══ CONTENT ══ */}
            <div className="relative z-10 px-5 sm:px-6">
              <div className="flex items-center justify-between h-[60px]">

                {/* ── Logo ── */}
                <Link
                  to={user ? '/dashboard' : '/'}
                  onClick={(e) => handleSafeNav(e, user ? '/dashboard' : '/')}
                  className="flex items-center gap-3 group shrink-0 nav-link-3d"
                >
                  <div className="relative" style={{ animation: 'nav-logo-float 4s ease-in-out infinite' }}>
                    {/* Logo glow */}
                    <div className="absolute -inset-1.5 rounded-xl bg-gradient-to-br from-[#14b8a6]/20 to-[#06b6d4]/10 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    {/* Logo ring */}
                    <div className="absolute -inset-[3px] rounded-xl border border-[#14b8a6]/0 group-hover:border-[#14b8a6]/30 transition-all duration-500" />
                    <img
                      src="https://res.cloudinary.com/dnzjg9lq8/image/upload/v1771619628/a-modern-minimalist-logo-design-featurin_1uJsjrn8RAWcX1Q_cP56-A_L4ta2RDPTV60VCZaV-IRKA_cover_sd_q0fsvx.jpg"
                      alt="CareerPath"
                      className="relative w-9 h-9 rounded-xl object-cover ring-1 ring-white/[0.08] group-hover:ring-[#14b8a6]/30 transition-all duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-[17px] font-extrabold tracking-tight leading-none" style={{
                      background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      Career<span style={{
                        background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>Path</span>
                    </span>
                    <span className="text-[9px] text-gray-600 font-medium tracking-[0.2em] uppercase leading-none mt-0.5">
                      career platform
                    </span>
                  </div>
                </Link>

                {/* ── Desktop Navigation ── */}
                <div
                  className="hidden md:flex items-center relative"
                  ref={navContainerRef}
                  onMouseLeave={handleLeave}
                >
                  {/* Sliding pill indicator */}
                  <div
                    className="absolute h-[34px] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none top-1/2 -translate-y-1/2"
                    style={{
                      left: pillStyle.left,
                      width: pillStyle.width,
                      opacity: pillStyle.opacity,
                      background: hoverIndex !== null
                        ? 'rgba(255,255,255,0.04)'
                        : 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(6,182,212,0.06))',
                      border: `1px solid ${hoverIndex !== null ? 'rgba(255,255,255,0.06)' : 'rgba(20,184,166,0.15)'}`,
                      boxShadow: hoverIndex !== null
                        ? 'none'
                        : '0 0 20px -5px rgba(20,184,166,0.15), inset 0 1px 0 rgba(255,255,255,0.03)',
                    }}
                  />

                  {navLinks.map((link, i) => (
                    link.children ? (
                      <div key={link.label} className="relative z-10" ref={aiMenuRef}>
                        <button
                          type="button"
                          ref={el => linkRefs.current[i] = el}
                          onMouseEnter={() => handleHover(i)}
                          onClick={() => setAiMenuOpen((prev) => !prev)}
                          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 nav-link-3d ${
                            isLinkActive(link)
                              ? 'text-white'
                              : 'text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          <link.icon
                            size={14}
                            className={`transition-all duration-300 ${
                              isLinkActive(link) ? 'text-[#14b8a6]' : 'text-gray-500'
                            }`}
                            style={{
                              filter: isLinkActive(link) ? 'drop-shadow(0 0 4px rgba(20,184,166,0.4))' : 'none',
                            }}
                          />
                          {link.label}
                          <ChevronDown
                            size={13}
                            className={`transition-all duration-300 ${aiMenuOpen ? 'rotate-180 text-[#14b8a6]' : 'text-gray-500'}`}
                          />
                          {isLinkActive(link) && (
                            <span
                              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#14b8a6]"
                              style={{
                                boxShadow: '0 0 8px rgba(20,184,166,0.6)',
                                animation: 'nav-glow-pulse 2s ease-in-out infinite',
                              }}
                            />
                          )}
                        </button>

                        {aiMenuOpen && (
                          <div className="absolute left-0 top-full mt-2 w-48 rounded-xl nav-glass-heavy border border-[#1e3a42]/50 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)] p-1.5">
                            {link.children.map((child) => (
                              <Link
                                key={child.to}
                                to={child.to}
                                onClick={(e) => {
                                  handleSafeNav(e, child.to);
                                  setAiMenuOpen(false);
                                }}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-300 ${
                                  isActive(child.to)
                                    ? 'text-white bg-[#14b8a6]/12'
                                    : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                                }`}
                              >
                                <child.icon size={14} className={isActive(child.to) ? 'text-[#14b8a6]' : 'text-gray-500'} />
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={(e) => handleSafeNav(e, link.to)}
                        ref={el => linkRefs.current[i] = el}
                        onMouseEnter={() => handleHover(i)}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 nav-link-3d z-10 ${
                          isLinkActive(link)
                            ? 'text-white'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <link.icon
                          size={14}
                          className={`transition-all duration-300 ${
                            isLinkActive(link) ? 'text-[#14b8a6]' : 'text-gray-500 group-hover:text-gray-400'
                          }`}
                          style={{
                            filter: isLinkActive(link) ? 'drop-shadow(0 0 4px rgba(20,184,166,0.4))' : 'none',
                          }}
                        />
                        {link.label}

                        {isLinkActive(link) && (
                          <span
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#14b8a6]"
                            style={{
                              boxShadow: '0 0 8px rgba(20,184,166,0.6)',
                              animation: 'nav-glow-pulse 2s ease-in-out infinite',
                            }}
                          />
                        )}
                      </Link>
                    )
                  ))}
                </div>

                {/* ── Right Controls ── */}
                <div className="hidden md:flex items-center gap-2 shrink-0">
                  {user ? (
                    <>
                      {/* Notification bell */}
                      <button
                        className="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-300 nav-link-3d group"
                        onClick={() => setNotifPing(false)}
                      >
                        <Bell size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                        {notifPing && (
                          <>
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#14b8a6] rounded-full ring-2 ring-[#071015]" />
                            <span
                              className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#14b8a6] rounded-full"
                              style={{ animation: 'nav-ping 1.5s ease-in-out infinite' }}
                            />
                          </>
                        )}
                      </button>

                      {/* Divider */}
                      <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-[#1e3a42]/60 to-transparent mx-1" />

                      {/* User Menu */}
                      <div className="relative" ref={menuRef}>
                        <button
                          onClick={() => setUserMenuOpen(!userMenuOpen)}
                          className={`group flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-2xl transition-all duration-400 nav-link-3d ${
                            userMenuOpen
                              ? 'bg-[#14b8a6]/10 ring-1 ring-[#14b8a6]/25 shadow-[0_0_20px_-5px_rgba(20,184,166,0.2)]'
                              : 'bg-white/[0.03] ring-1 ring-white/[0.06] hover:ring-[#14b8a6]/20 hover:bg-white/[0.05]'
                          }`}
                        >
                          {/* Avatar with glow */}
                          <div className="relative">
                            <div className={`absolute -inset-0.5 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] blur-sm transition-opacity duration-300 ${userMenuOpen ? 'opacity-40' : 'opacity-0 group-hover:opacity-25'}`} />
                            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/10 overflow-hidden">
                              {user.avatar ? (
                                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-white text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                              )}
                            </div>
                          </div>
                          <span className="text-[13px] font-semibold text-gray-300 max-w-[90px] truncate group-hover:text-white transition-colors duration-300">
                            {user.name?.split(' ')[0]}
                          </span>
                          <ChevronDown
                            size={13}
                            className={`text-gray-500 transition-all duration-400 ${userMenuOpen ? 'rotate-180 text-[#14b8a6]' : 'group-hover:text-gray-400'}`}
                          />
                        </button>

                        {/* Dropdown */}
                        {userMenuOpen && (
                          <div
                            className="absolute right-0 top-full mt-3 w-[260px] rounded-2xl overflow-hidden"
                            style={{
                              animation: 'nav-menu-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                              transformOrigin: 'top right',
                            }}
                          >
                            {/* 3D layered dropdown */}
                            <div className="relative">
                              {/* Border glow */}
                              <div className="absolute -inset-[1px] rounded-2xl" style={{
                                background: 'linear-gradient(135deg, rgba(20,184,166,0.25), rgba(6,182,212,0.1), rgba(139,92,246,0.08))',
                                backgroundSize: '200% 200%',
                                animation: 'nav-border-flow 4s linear infinite',
                              }} />

                              <div className="relative nav-glass-heavy rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7),0_0_40px_-10px_rgba(20,184,166,0.08)] overflow-hidden">
                                {/* Top reflection */}
                                <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none rounded-t-2xl" />

                                {/* User info header */}
                                <div className="relative p-5 pb-4">
                                  <div className="flex items-center gap-3.5">
                                    <div className="relative">
                                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/20 overflow-hidden">
                                        {user.avatar ? (
                                          <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                          <span className="text-white text-base font-bold">{user.name?.[0]?.toUpperCase()}</span>
                                        )}
                                      </div>
                                      {/* Online dot */}
                                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#10b981] border-2 border-[#0A1A22]" style={{ animation: 'nav-glow-pulse 2s ease infinite' }} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{user.email}</p>
                                    </div>
                                  </div>
                                  {/* Level badge */}
                                  <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#14b8a6]/[0.06] border border-[#14b8a6]/15 w-fit">
                                    <Sparkles size={11} className="text-[#14b8a6]" />
                                    <span className="text-[10px] text-[#2dd4bf] font-bold uppercase tracking-wider">Active Member</span>
                                  </div>
                                </div>

                                {/* Divider */}
                                <div className="mx-5 h-[1px] bg-gradient-to-r from-transparent via-[#1e3a42]/50 to-transparent" />

                                {/* Menu items */}
                                <div className="p-2">
                                  {[
                                    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', desc: 'Overview & stats' },
                                    { to: '/profile', icon: Settings, label: 'Profile', desc: 'Account settings' },
                                  ].map((item) => (
                                    <Link
                                      key={item.to}
                                      to={item.to}
                                      onClick={() => setUserMenuOpen(false)}
                                      className="group/item flex items-center gap-3.5 px-3.5 py-3 rounded-xl hover:bg-white/[0.04] transition-all duration-300"
                                    >
                                      <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover/item:border-[#14b8a6]/20 group-hover/item:bg-[#14b8a6]/[0.06] transition-all duration-300">
                                        <item.icon size={15} className="text-gray-400 group-hover/item:text-[#14b8a6] transition-colors duration-300" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <span className="text-sm font-semibold text-gray-300 group-hover/item:text-white transition-colors duration-300 block">{item.label}</span>
                                        <span className="text-[10px] text-gray-600 block">{item.desc}</span>
                                      </div>
                                      <ArrowRight size={12} className="text-gray-700 group-hover/item:text-gray-400 transition-all duration-300 group-hover/item:translate-x-0.5 shrink-0" />
                                    </Link>
                                  ))}
                                </div>

                                {/* Divider */}
                                <div className="mx-5 h-[1px] bg-gradient-to-r from-transparent via-[#1e3a42]/50 to-transparent" />

                                {/* Logout */}
                                <div className="p-2">
                                  <button
                                    onClick={() => {
                                      logout();
                                      setUserMenuOpen(false);
                                      setMobileOpen(false);
                                      window.location.assign('/');
                                    }}
                                    className="group/out flex items-center gap-3.5 w-full px-3.5 py-3 rounded-xl hover:bg-red-500/[0.06] transition-all duration-300"
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover/out:border-red-500/20 group-hover/out:bg-red-500/[0.06] transition-all duration-300">
                                      <LogOut size={15} className="text-gray-400 group-hover/out:text-red-400 transition-colors duration-300" />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-400 group-hover/out:text-red-400 transition-colors duration-300">
                                      Sign Out
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <Link
                        to="/login"
                        onClick={(e) => handleSafeNav(e, '/login')}
                        className="px-4 py-2 text-[13px] font-semibold text-gray-400 hover:text-white rounded-xl hover:bg-white/[0.05] transition-all duration-300 nav-link-3d"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={(e) => handleSafeNav(e, '/register')}
                        className="nav-shimmer-btn group relative px-5 py-2.5 text-[13px] font-bold rounded-2xl text-white transition-all duration-500 hover:scale-[1.04] active:scale-[0.97] hover:shadow-[0_8px_30px_-5px_rgba(20,184,166,0.35)] nav-link-3d"
                        style={{
                          background: 'linear-gradient(135deg, #14b8a6, #0d9488, #06b6d4)',
                          backgroundSize: '200% 200%',
                        }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Zap size={13} />
                          Get Started
                        </span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* ── Mobile Toggle ── */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className="relative w-5 h-5 flex flex-col items-center justify-center">
                    <span
                      className={`absolute h-[2px] w-5 rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        mobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                      }`}
                    />
                    <span
                      className={`absolute h-[2px] w-3.5 rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        mobileOpen ? 'opacity-0 translate-x-4' : 'opacity-100'
                      }`}
                    />
                    <span
                      className={`absolute h-[2px] w-5 rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        mobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* ══ MOBILE MENU ══ */}
            <div
              className="md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                maxHeight: mobileOpen ? '600px' : '0px',
                opacity: mobileOpen ? 1 : 0,
              }}
            >
              {/* Gradient divider */}
              <div className="mx-5 h-[1px] bg-gradient-to-r from-transparent via-[#14b8a6]/20 to-transparent" />

              <div className="p-4 nav-mobile-stagger">
                {/* Mobile links */}
                {navLinks.map((link) => (
                  link.children ? (
                    <div key={link.label} className="mb-1">
                      <button
                        type="button"
                        onClick={() => setMobileAiOpen((prev) => !prev)}
                        className={`group w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[14px] font-semibold transition-all duration-300 ${
                          isLinkActive(link)
                            ? 'text-white bg-gradient-to-r from-[#14b8a6]/10 to-transparent border-l-2 border-[#14b8a6]'
                            : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isLinkActive(link) ? 'bg-[#14b8a6]/15' : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
                        }`}>
                          <link.icon
                            size={16}
                            className={`transition-all duration-300 ${isLinkActive(link) ? 'text-[#14b8a6]' : 'text-gray-500 group-hover:text-gray-300'}`}
                          />
                        </div>
                        <span className="flex-1 text-left">{link.label}</span>
                        <ChevronDown size={15} className={`transition-all duration-300 ${mobileAiOpen ? 'rotate-180 text-[#14b8a6]' : 'text-gray-500'}`} />
                      </button>

                      {mobileAiOpen && (
                        <div className="ml-3 mt-1 space-y-1 border-l border-[#1e3a42]/40 pl-3">
                          {link.children.map((child) => (
                            <Link
                              key={child.to}
                              to={child.to}
                              onClick={(e) => {
                                handleSafeNav(e, child.to);
                                setMobileAiOpen(false);
                              }}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                                isActive(child.to)
                                  ? 'text-white bg-[#14b8a6]/12'
                                  : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                              }`}
                            >
                              <child.icon size={14} className={isActive(child.to) ? 'text-[#14b8a6]' : 'text-gray-500'} />
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={(e) => handleSafeNav(e, link.to)}
                      className={`group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[14px] font-semibold transition-all duration-300 mb-1 ${
                        isLinkActive(link)
                          ? 'text-white bg-gradient-to-r from-[#14b8a6]/10 to-transparent border-l-2 border-[#14b8a6]'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isLinkActive(link) ? 'bg-[#14b8a6]/15' : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
                      }`}>
                        <link.icon
                          size={16}
                          className={`transition-all duration-300 ${isLinkActive(link) ? 'text-[#14b8a6]' : 'text-gray-500 group-hover:text-gray-300'}`}
                        />
                      </div>
                      <span className="flex-1">{link.label}</span>
                      {isLinkActive(link) && (
                        <div className="w-2 h-2 rounded-full bg-[#14b8a6] shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                      )}
                    </Link>
                  )
                ))}

                {/* Auth section */}
                {!user && (
                  <div className="mt-3 pt-3 border-t border-[#1e3a42]/30 space-y-2">
                    <Link
                      to="/login"
                      onClick={(e) => handleSafeNav(e, '/login')}
                      className="flex items-center justify-center px-4 py-3 rounded-2xl text-[14px] font-semibold text-gray-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={(e) => handleSafeNav(e, '/register')}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[14px] font-bold text-white transition-all duration-300"
                      style={{ background: 'linear-gradient(135deg, #14b8a6, #06b6d4)' }}
                    >
                      <Zap size={14} />
                      Get Started
                    </Link>
                  </div>
                )}

                {user && (
                  <div className="mt-3 pt-3 border-t border-[#1e3a42]/30">
                    {/* User info card */}
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl bg-white/[0.02]">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#14b8a6]/15 overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold">{user.name?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                        setUserMenuOpen(false);
                        window.location.assign('/');
                      }}
                      className="group flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl text-[14px] font-semibold text-red-400/80 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-300"
                    >
                      <div className="w-9 h-9 rounded-xl bg-red-500/[0.06] flex items-center justify-center group-hover:bg-red-500/10 transition-all duration-300">
                        <LogOut size={16} className="text-red-400/60 group-hover:text-red-400 transition-colors duration-300" />
                      </div>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}