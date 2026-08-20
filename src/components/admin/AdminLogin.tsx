import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Leaf, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft, Eye, EyeOff, User, CheckCircle2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, registerAdmin, resetPassword, setCurrentView } = useCMS();
  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (mode === 'signin') {
      const res = await login(email, password);
      setLoading(false);
      if (!res.success) {
        setError(res.message || 'Invalid email or password');
      }
    } else if (mode === 'register') {
      const res = await registerAdmin(email, password, name);
      setLoading(false);
      if (!res.success) {
        setError(res.message || 'Failed to create administrator account');
      }
    } else if (mode === 'forgot') {
      const res = await resetPassword(email);
      setLoading(false);
      if (res.success) {
        setSuccessMessage(res.message || 'Password reset link sent! Check your inbox.');
      } else {
        setError(res.message || 'Failed to send reset link.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#0B3B24]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#C59B27]/10 blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => {
            window.location.hash = '';
            setCurrentView('public');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#D9D0BE] text-xs font-semibold text-[#0B3B24] hover:bg-[#EFE9DF] transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#0B3B24] flex items-center justify-center text-white shadow-xl shadow-[#0B3B24]/20 mb-4">
          <Leaf className="w-8 h-8 text-[#E6C687]" />
        </div>

        <h2 className="text-3xl font-extrabold text-[#0B3B24] tracking-tight">
          NaijaGlobal <span className="text-[#C59B27]">Agro</span>
        </h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
          Export Management System &amp; Content Control Panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#E0D8C8] shadow-xl space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-[#FAF8F5] p-1 border border-[#E8DFC8]">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white text-[#0B3B24] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0B3B24]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#0B3B24] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0B3B24]'
              }`}
            >
              New Admin
            </button>
            <button
              type="button"
              onClick={() => { setMode('forgot'); setError(null); setSuccessMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'forgot'
                  ? 'bg-white text-[#0B3B24] shadow-sm'
                  : 'text-[#64748B] hover:text-[#0B3B24]'
              }`}
            >
              Reset Pass
            </button>
          </div>

          <div className="border-b border-[#EFE9DF] pb-3">
            <h3 className="text-sm font-bold text-[#0B3B24] flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>
                {mode === 'signin' && 'Firebase Admin Authentication'}
                {mode === 'register' && 'Create Administrator Account'}
                {mode === 'forgot' && 'Reset Security Password'}
              </span>
            </h3>
            <p className="text-xs text-[#718096] mt-0.5">
              {mode === 'signin' && 'Enter your authorized credentials to access the export trading desk CMS.'}
              {mode === 'register' && 'Provision a new authorized operator with Firebase Authentication.'}
              {mode === 'forgot' && 'Dispatches a secure password reset link to your administrator email.'}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="admin-name" className="block text-xs font-semibold text-[#4A5568] mb-1">
                  Full Name / Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718096]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24] focus:bg-white transition-all"
                    placeholder="Agro Export Operations Admin"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-[#4A5568] mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718096]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24] focus:bg-white transition-all"
                  placeholder="admin@naijaglobalagro.com"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="admin-password" className="block text-xs font-semibold text-[#4A5568]">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-[#0B3B24] hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718096]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24] focus:bg-white transition-all"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#718096] hover:text-[#1E232A]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#0B3B24] text-white text-sm font-bold hover:bg-[#072818] shadow-md shadow-[#0B3B24]/15 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Firebase Security Clearance...</span>
                </div>
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In to Dashboard'}
                    {mode === 'register' && 'Register & Enter Dashboard'}
                    {mode === 'forgot' && 'Dispatch Reset Email'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#E6C687]" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#718096] pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Firebase 256-Bit Encrypted Agricultural Operations Portal</span>
          </div>

        </div>
      </div>
    </div>
  );
};
