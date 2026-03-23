import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Shield, Users } from 'lucide-react';
import api from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailHint, setEmailHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const { login } = useAuth();
  const navigate = useNavigate();

  const normalizeEmailInput = (value) => value.trim().toLowerCase();

  const extractErrorMessage = (err) => {
    const responseData = err?.response?.data;
    if (!responseData) return 'Unable to reach server. Please try again.';

    if (responseData?.errors && typeof responseData.errors === 'object') {
      const firstErrorKey = Object.keys(responseData.errors)[0];
      const firstErrorValue = responseData.errors[firstErrorKey];
      if (Array.isArray(firstErrorValue) && firstErrorValue[0]) {
        return firstErrorValue[0];
      }
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
        // Admin login
        const res = await api.post('/admin/login', { email: normalizedEmail, password });
        const { admin, token } = res.data;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(admin));
        window.location.assign('/admin/dashboard');
      } else {
        // User login
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
    <div className="relative min-h-screen flex items-center justify-center px-4 py-24 page-enter">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[#071015] pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-br from-[#14b8a6]/5 via-transparent to-[#06b6d4]/5 pointer-events-none" />
      <div className="absolute top-40 left-20 w-72 h-72 bg-[#14b8a6]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#06b6d4]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-[#0A1A22]/90 backdrop-blur-xl border border-[#1e3a42]/60 rounded-2xl p-8 shadow-2xl shadow-black/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#14b8a6]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn size={24} className="text-[#2dd4bf]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1.5">Sign in to your CareerPath account</p>
          </div>

          {/* Login Type Toggle */}
          <div className="mb-6 flex gap-3 p-1 bg-[#071015]/50 rounded-lg border border-[#1e3a42]/50">
            <button
              type="button"
              onClick={() => setLoginType('user')}
              className={`flex-1 py-2.5 px-4 rounded-md transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2 ${
                loginType === 'user'
                  ? 'bg-[#14b8a6]/20 text-[#2dd4bf] border border-[#14b8a6]/30'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Users size={16} />
              User Login
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-2.5 px-4 rounded-md transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2 ${
                loginType === 'admin'
                  ? 'bg-[#14b8a6]/20 text-[#2dd4bf] border border-[#14b8a6]/30'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Shield size={16} />
              Admin Login
            </button>
          </div>

          {/* Admin Credentials Info */}
          {loginType === 'admin' && (
            <div className="mb-6 p-3.5 bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-xl">
              <p className="text-[#2dd4bf] text-xs font-semibold mb-2">Demo Admin Credentials:</p>
              <p className="text-gray-300 text-xs">Email: <span className="font-mono text-[#14b8a6]">admin123@gmail.com</span></p>
              <p className="text-gray-300 text-xs">Password: <span className="font-mono text-[#14b8a6]">123456</span></p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {emailHint && (
            <div className="mb-6 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between gap-2">
              <p className="text-amber-300 text-sm">{emailHint}</p>
              <button
                type="button"
                onClick={() => setEmail((prev) => prev.replace('@gamil.com', '@gmail.com'))}
                className="text-xs font-semibold text-amber-200 hover:text-white transition"
              >
                Fix Email
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={loginType === 'admin' ? 'admin123@gmail.com' : 'you@example.com'}
                  required
                  className="w-full pl-10.5 pr-4 py-3 bg-[#071015]/70 border border-[#1e3a42] rounded-xl text-white placeholder-gray-600 focus:border-[#14b8a6]/50 focus:ring-1 focus:ring-[#14b8a6]/20 transition-all duration-200"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={loginType === 'admin' ? '123456' : 'Enter your password'}
                  required
                  className="w-full pr-12 py-3 bg-[#071015]/70 border border-[#1e3a42] rounded-xl text-white placeholder-gray-600 focus:border-[#14b8a6]/50 focus:ring-1 focus:ring-[#14b8a6]/20 transition-all duration-200"
                  style={{ paddingLeft: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#14b8a6] hover:bg-[#0d9488] rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#14b8a6]/20 hover:shadow-[#14b8a6]/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  {loginType === 'admin' ? 'Admin Sign In' : 'Sign In'} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {loginType === 'user' && (
            <div className="mt-6 pt-6 border-t border-[#1e3a42]/50 text-center">
              <p className="text-gray-500 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#2dd4bf] hover:text-[#14b8a6] font-medium transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
