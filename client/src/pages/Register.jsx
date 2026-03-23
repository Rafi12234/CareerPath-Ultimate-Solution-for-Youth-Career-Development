import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, ArrowRight, Camera, X, Loader2 } from 'lucide-react';
import api from '../utils/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailHint, setEmailHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { register, updateUser } = useAuth();

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

    return responseData?.message || 'Registration failed. Please try again.';
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
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
    const normalizedEmail = normalizeEmailInput(email);

    if (normalizedEmail.includes('@gamil.com')) {
      setEmailHint('Did you mean gmail.com?');
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const userData = await register(name, normalizedEmail, password);

      // Upload avatar if selected
      if (avatar && userData?.id) {
        setUploadingAvatar(true);
        try {
          const formData = new FormData();
          formData.append('avatar', avatar);
          formData.append('user_id', userData.id);
          const avatarRes = await api.post('/upload-avatar', formData);
          if (avatarRes.data?.user) {
            updateUser(avatarRes.data.user);
          }
        } catch (avatarErr) {
          console.error('Avatar upload failed:', avatarErr);
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

  const inputClass = "w-full pr-4 py-3 bg-[#071015]/70 border border-[#1e3a42] rounded-xl text-white placeholder-gray-600 focus:border-[#14b8a6]/50 focus:ring-1 focus:ring-[#14b8a6]/20 transition-all duration-200";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-24 page-enter">
      {/* Fullscreen upload overlay */}
      {uploadingAvatar && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#0A1A22]/95 border border-[#14b8a6]/30 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl shadow-[#14b8a6]/10">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[#1e3a42] border-t-[#14b8a6] animate-spin" />
              <Camera size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#14b8a6]" />
            </div>
            <p className="text-white font-semibold text-sm">Uploading your photo...</p>
            <p className="text-gray-500 text-xs">This may take a moment</p>
          </div>
        </div>
      )}

      {/* Background effects */}
      <div className="absolute inset-0 bg-[#071015] pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-br from-[#06b6d4]/5 via-transparent to-[#14b8a6]/5 pointer-events-none" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-[#14b8a6]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#06b6d4]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-[#0A1A22]/90 backdrop-blur-xl border border-[#1e3a42]/60 rounded-2xl p-8 shadow-2xl shadow-black/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#06b6d4]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus size={24} className="text-[#06b6d4]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create account</h1>
            <p className="text-gray-500 text-sm mt-1.5">Start your career journey with CareerPath</p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-2">
              <div className="relative group">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-2xl bg-[#071015]/70 border-2 border-dashed border-[#1e3a42] hover:border-[#14b8a6]/50 flex items-center justify-center cursor-pointer transition-all duration-200 overflow-hidden"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={24} className="text-gray-600 group-hover:text-[#14b8a6] transition-colors" />
                  )}
                </div>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500/90 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={12} className="text-white" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2">Profile photo (optional)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <div className="relative">
                <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className={inputClass}
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputClass}
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
                  placeholder="Min 6 characters"
                  required
                  className={`${inputClass} !pr-12`}
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

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  className={inputClass}
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-linear-to-r from-[#14b8a6] to-[#06b6d4] rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#14b8a6]/20 hover:shadow-[#14b8a6]/30 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#1e3a42]/50 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#2dd4bf] hover:text-[#14b8a6] font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
