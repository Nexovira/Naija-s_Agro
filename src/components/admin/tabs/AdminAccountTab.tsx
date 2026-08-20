import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { ImageUploadField } from '../../common/ImageUploadField';
import { Save, Check, User, Lock, ShieldCheck, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

export const AdminAccountTab: React.FC = () => {
  const { currentUser, firebaseUser, updateAdminAccount } = useCMS();
  const [name, setName] = useState(currentUser?.name || 'Agro Export Operations Admin');
  const [email, setEmail] = useState(currentUser?.email || 'admin@naijaglobalagro.com');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await updateAdminAccount({
      name,
      email,
      avatarUrl,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined
    });
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3500);
    } else {
      setError(res.message || 'Failed to update credentials');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B3B24] tracking-tight">
            Admin Profile &amp; Security Settings
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Manage Firebase Authentication identity, secure administrator credentials, and session access.
          </p>
        </div>

        {success && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <Check className="w-4 h-4" />
            <span>Profile Updated</span>
          </span>
        )}
      </div>

      {/* Firebase Auth Status Card */}
      <div className="bg-gradient-to-r from-[#0B3B24]/5 via-[#C59B27]/5 to-[#0B3B24]/5 p-4 rounded-2xl border border-[#0B3B24]/15 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B3B24] text-[#E6C687] flex items-center justify-center font-bold text-sm shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0B3B24]">Firebase Authentication Active</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Verified
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
              UID: {currentUser?.firebaseUid || currentUser?.id || firebaseUser?.uid || 'fb-admin-auth-session'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-[#0B3B24] bg-white px-2.5 py-1 rounded-lg border border-[#D9D0BE]">
            Role: Super Admin
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#0B3B24] flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-700" />
            <span>Administrator Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Sign-in Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploadField
                label="Admin Avatar Profile Photo"
                value={avatarUrl}
                onChange={(url) => setAvatarUrl(url)}
                placeholder="Upload admin profile photo (click to browse or drag & drop)"
                aspectRatio="square"
                helperText="Personalizes your administrator workspace and audit logs"
              />
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#0B3B24] flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>Update Firebase Security Password</span>
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          <Save className="w-4 h-4 text-[#E6C687]" />
          <span>{loading ? 'Saving Profile in Firebase...' : 'Save Profile & Credentials'}</span>
        </button>

      </form>
    </div>
  );
};
