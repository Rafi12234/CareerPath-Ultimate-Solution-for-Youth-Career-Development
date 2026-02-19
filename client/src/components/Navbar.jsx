import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/profile', label: 'Profile' },
        { to: '/jobs', label: 'Jobs' },
        { to: '/resources', label: 'Resources' },
        { to: '/contact', label: 'Contact' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/jobs', label: 'Jobs' },
        { to: '/resources', label: 'Resources' },
        { to: '/contact', label: 'Contact' },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-5 pt-3">
      <div
        className={`w-full max-w-[1200px] transition-all duration-500 rounded-2xl border ${
          scrolled
            ? 'bg-[#0d0d24]/70 backdrop-blur-2xl border-[#2a2a5a]/50 shadow-2xl shadow-black/30'
            : 'bg-[#0d0d24]/50 backdrop-blur-xl border-[#2a2a5a]/30 shadow-lg shadow-black/10'
        }`}
      >
        <div className="px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#ec4899] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#7c3aed]/25 group-hover:shadow-[#7c3aed]/50 transition-all duration-300 group-hover:scale-105">
                C
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:inline">CareerPath</span>
            </Link>

            {/* Desktop Nav — centered */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'text-white bg-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#ec4899] rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              {user ? (
                <>
                  <button className="relative p-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200">
                    <Bell size={19} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#ec4899] rounded-full ring-2 ring-[#0d0d24]" />
                  </button>
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl border transition-all duration-200 ${
                        userMenuOpen
                          ? 'bg-[#7c3aed]/15 border-[#7c3aed]/40'
                          : 'bg-white/[0.04] border-[#2a2a5a]/60 hover:border-[#7c3aed]/30 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#ec4899] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-300 max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div
                      className={`absolute right-0 top-full mt-2 w-52 bg-[#111128]/95 backdrop-blur-2xl border border-[#2a2a5a]/60 rounded-xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-200 ${
                        userMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'
                      }`}
                    >
                      <div className="px-4 py-3 border-b border-[#2a2a5a]/50">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors duration-150">
                        <User size={14} /> Dashboard
                      </Link>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-colors duration-150">
                        <User size={14} /> Profile
                      </Link>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-150"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.03] transition-all duration-200 flex items-center gap-1.5"
                  >
                    <span className="w-4 h-4 rounded bg-white/20 flex items-center justify-center text-[10px]">⚡</span>
                    Get App
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-[500px] border-t border-[#2a2a5a]/40' : 'max-h-0'
          }`}
        >
          <div className="px-4 py-3 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="pt-3 mt-2 border-t border-[#2a2a5a]/40 space-y-2">
                <Link to="/login" className="block px-4 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all">
                  Sign In
                </Link>
                <Link to="/register" className="block px-4 py-2.5 rounded-xl text-sm bg-gradient-to-r from-[#10b981] to-[#059669] text-white text-center font-semibold">
                  Get App
                </Link>
              </div>
            )}
            {user && (
              <div className="pt-3 mt-2 border-t border-[#2a2a5a]/40">
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
