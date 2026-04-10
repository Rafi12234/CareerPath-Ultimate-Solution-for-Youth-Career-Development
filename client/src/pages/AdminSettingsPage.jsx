import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Save, Shield, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const savedAdmin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user') || 'null');
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!savedAdmin) {
      navigate('/login');
      return;
    }
    setEmail(savedAdmin.email || '');
  }, [navigate, savedAdmin]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!currentPassword) {
      setError('Current password is required.');
      return;
    }

    if (!email && !newPassword) {
      setError('Provide a new email and/or a new password.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        current_password: currentPassword,
        email,
      };
      if (newPassword) {
        payload.new_password = newPassword;
        payload.new_password_confirmation = confirmPassword;
      }

      const res = await api.put('/admin/account', payload);
      const updatedAdmin = res.data?.admin;
      if (updatedAdmin) {
        localStorage.setItem('admin_user', JSON.stringify(updatedAdmin));
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage(res.data?.message || 'Admin account updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update admin account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#03070A] text-gray-200 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="rounded-2xl border border-[#1e3a42]/40 bg-[#071015]/80 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/15 flex items-center justify-center">
              <Shield size={18} className="text-[#14b8a6]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Account Settings</h1>
              <p className="text-xs text-gray-500">Update your admin email and password</p>
            </div>
          </div>

          {message && <div className="mb-4 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">{message}</div>}
          {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs text-gray-400 mb-1.5 inline-block">Admin Email</span>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#03070A]/70 border border-[#1e3a42]/40 focus:border-[#14b8a6]/40 outline-none text-sm"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs text-gray-400 mb-1.5 inline-block">Current Password</span>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#03070A]/70 border border-[#1e3a42]/40 focus:border-[#14b8a6]/40 outline-none text-sm"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs text-gray-400 mb-1.5 inline-block">New Password (optional)</span>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#03070A]/70 border border-[#1e3a42]/40 focus:border-[#14b8a6]/40 outline-none text-sm"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs text-gray-400 mb-1.5 inline-block">Confirm New Password</span>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#03070A]/70 border border-[#1e3a42]/40 focus:border-[#14b8a6]/40 outline-none text-sm"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#14b8a6] hover:bg-[#0d9488] text-white text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer"
            >
              <Save size={15} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}