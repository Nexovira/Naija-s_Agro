import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { 
  X, 
  User, 
  Building2, 
  Globe, 
  Phone, 
  Mail, 
  Lock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Ship, 
  Package, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  LogOut, 
  Check, 
  Clock, 
  ShieldCheck, 
  MessageSquareShare,
  Layers,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Incoterm, RFQFormData } from '../types';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRFQModal?: (productId?: string) => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenRFQModal
}) => {
  const { 
    customerUser, 
    isCustomerAuthenticated, 
    customerLoading,
    customerSignup, 
    customerLogin, 
    customerLogout, 
    updateCustomerProfile,
    customerRFQs,
    customerPortalTab,
    setCustomerPortalTab,
    data,
    submitRFQ
  } = useCMS();

  // Auth View State
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [phone, setPhone] = useState('');
  const [preferredCommodities, setPreferredCommodities] = useState<string[]>(['dried-split-ginger']);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Quick RFQ inside modal state
  const [quickProduct, setQuickProduct] = useState('dried-split-ginger');
  const [quickVolume, setQuickVolume] = useState(28);
  const [quickPort, setQuickPort] = useState('Port of Rotterdam (Netherlands) - NL RTM');
  const [quickIncoterm, setQuickIncoterm] = useState<Incoterm>('CIF');
  const [quickNotes, setQuickNotes] = useState('');
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickSuccessMessage, setQuickSuccessMessage] = useState<string | null>(null);

  // Sync profile edit fields when user logs in
  React.useEffect(() => {
    if (customerUser) {
      setEditName(customerUser.displayName || '');
      setEditCompany(customerUser.companyName || '');
      setEditCountry(customerUser.country || 'International');
      setEditPhone(customerUser.phone || '');
    }
  }, [customerUser]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (authMode === 'signup') {
      if (!companyName.trim()) {
        setAuthError('Please enter your Company / Organization name.');
        return;
      }
      const res = await customerSignup({
        email,
        pass: password,
        displayName: displayName || companyName,
        companyName,
        country,
        phone,
        preferredCommodities
      });
      if (!res.success) {
        setAuthError(res.message || 'Failed to create customer account');
      } else {
        setAuthSuccess('Account registered successfully! Welcome to the Buyer Trade Portal.');
      }
    } else if (authMode === 'signin') {
      const res = await customerLogin(email, password);
      if (!res.success) {
        setAuthError(res.message || 'Invalid email or password');
      }
    } else if (authMode === 'forgot') {
      if (!email.trim()) {
        setAuthError('Please enter your registered email address.');
        return;
      }
      setAuthSuccess(`Password reset instructions sent to ${email}. Please check your inbox.`);
    }
  };

  const handleDemoBuyerFill = () => {
    setEmail('procurement@almadinaspices.ae');
    setPassword('BuyerAccess2026!');
    setCompanyName('Al-Madina Spice & Foodstuff LLC');
    setDisplayName('Tariq Al-Mansoor');
    setCountry('United Arab Emirates');
    setPhone('+971 4 883 4912');
    setAuthError(null);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    const res = await updateCustomerProfile({
      displayName: editName,
      companyName: editCompany,
      country: editCountry,
      phone: editPhone
    });
    setProfileSaving(false);
    if (res.success) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  const handleQuickRFQSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerUser) return;
    setQuickSubmitting(true);

    const productObj = data.products.find(p => p.id === quickProduct);
    const productName = productObj ? productObj.name : 'Nigerian Export Commodity';
    const estimatedContainers = Math.max(1, Math.ceil(quickVolume / 14));

    const formData: RFQFormData = {
      selectedProducts: [quickProduct],
      orderVolumeMT: quickVolume,
      destinationPort: quickPort,
      incoterm: quickIncoterm,
      packagingType: '50kg Standard Export PP Bags with Liner',
      targetDeliveryDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      companyName: customerUser.companyName || 'Corporate Buyer',
      buyerName: customerUser.displayName || 'Procurement Officer',
      businessEmail: customerUser.email,
      country: customerUser.country || 'International',
      phoneOrWhatsApp: customerUser.phone || '',
      specialRequirements: quickNotes
    };

    try {
      const rec = await submitRFQ(formData, estimatedContainers, [productName], customerUser.uid);
      setQuickSubmitting(false);
      setQuickSuccessMessage(`Consignment request ${rec.rfqId} dispatched to Lagos export desk!`);
      setQuickNotes('');
      setTimeout(() => {
        setCustomerPortalTab('inquiries');
        setQuickSuccessMessage(null);
      }, 2000);
    } catch (err) {
      setQuickSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
            <span>Under Review</span>
          </span>
        );
      case 'in-review':
      case 'quotation_sent':
      case 'quote-sent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <FileText className="w-3 h-3 text-blue-600" />
            <span>Quotation Dispatched</span>
          </span>
        );
      case 'contract-signed':
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Contract Confirmed</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
            <Ship className="w-3 h-3 text-purple-600" />
            <span>Vessel In Transit</span>
          </span>
        );
      case 'completed':
      case 'fulfilled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            <Check className="w-3 h-3 text-emerald-700" />
            <span>Consignment Delivered</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF8F5] w-full max-w-4xl rounded-3xl border border-[#E0D8C8] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="bg-[#0B3B24] text-white p-5 sm:px-8 flex items-center justify-between border-b border-[#E6C687]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E6C687] border border-white/10 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">International Buyer Trade Portal</h2>
                <span className="bg-[#E6C687]/20 text-[#E6C687] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border border-[#E6C687]/30">
                  Real-time Sync
                </span>
              </div>
              <p className="text-xs text-white/70">
                {isCustomerAuthenticated && customerUser
                  ? `${customerUser.companyName} • ${customerUser.country}`
                  : 'Manage export inquiries, contract proformas, and direct vessel schedules'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unauthenticated View: Sign In / Sign Up Form */}
        {!isCustomerAuthenticated ? (
          <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
            
            {/* Mode Switcher */}
            <div className="flex max-w-md mx-auto rounded-xl bg-white p-1 border border-[#D9D0BE] shadow-sm">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setAuthError(null); setAuthSuccess(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-[#0B3B24] text-white shadow-sm'
                    : 'text-[#4A5568] hover:text-[#0B3B24]'
                }`}
              >
                Buyer Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setAuthError(null); setAuthSuccess(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-[#0B3B24] text-white shadow-sm'
                    : 'text-[#4A5568] hover:text-[#0B3B24]'
                }`}
              >
                Create Buyer Account
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('forgot'); setAuthError(null); setAuthSuccess(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'forgot'
                    ? 'bg-[#0B3B24] text-white shadow-sm'
                    : 'text-[#4A5568] hover:text-[#0B3B24]'
                }`}
              >
                Reset Password
              </button>
            </div>

            {authError && (
              <div className="max-w-md mx-auto p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="max-w-md mx-auto p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="max-w-md mx-auto space-y-4">
              
              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">
                      Legal Company / Organization Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718096]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9D0BE] bg-white text-xs text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24]"
                        placeholder="e.g. TransEuro Commodities B.V."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A5568] mb-1">
                        Procurement Officer Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718096]">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D9D0BE] bg-white text-xs text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24]"
                          placeholder="Contact person"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A5568] mb-1">
                        Destination Country
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718096]">
                          <Globe className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D9D0BE] bg-white text-xs text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24]"
                          placeholder="United Kingdom / UAE / USA"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A5568] mb-1">
                      Direct WhatsApp / Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718096]">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9D0BE] bg-white text-xs text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24]"
                        placeholder="+44 20 7946 0912"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">
                  Corporate Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718096]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9D0BE] bg-white text-xs text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24]"
                    placeholder="procurement@company.com"
                  />
                </div>
              </div>

              {authMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#4A5568]">
                      Password *
                    </label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
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
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#D9D0BE] bg-white text-xs text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24]"
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
                disabled={customerLoading}
                className="w-full py-3 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] shadow-md shadow-[#0B3B24]/15 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {customerLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Buyer Clearance...</span>
                  </div>
                ) : (
                  <>
                    <span>
                      {authMode === 'signin' && 'Sign In to Buyer Portal'}
                      {authMode === 'signup' && 'Complete Registration & Enter Portal'}
                      {authMode === 'forgot' && 'Send Password Reset Link'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#E6C687]" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill helper */}
            <div className="max-w-md mx-auto pt-3 border-t border-[#E8DFC8] flex items-center justify-between text-xs text-[#64748B]">
              <span>Need to test customer portal?</span>
              <button
                type="button"
                onClick={handleDemoBuyerFill}
                className="text-[11px] font-bold text-[#0B3B24] hover:underline bg-[#0B3B24]/10 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                Auto-fill Demo Buyer
              </button>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-[#E0D8C8] text-xs text-[#4A5568] space-y-1.5">
              <div className="font-bold text-[#0B3B24] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Buyer Account Privileges</span>
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Registered international commodity buyers get guaranteed 4-hour proforma invoice generation, assigned dedicated trade brokers, and live container tracking from Apapa/Tin Can ports.
              </p>
            </div>

          </div>
        ) : (
          /* Authenticated Customer View: Pipeline, New RFQ & Profile */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Customer Sub-Navbar */}
            <div className="bg-white px-6 py-3 border-b border-[#E0D8C8] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCustomerPortalTab('inquiries')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    customerPortalTab === 'inquiries'
                      ? 'bg-[#0B3B24] text-white shadow-sm'
                      : 'text-[#4A5568] hover:bg-[#FAF8F5] hover:text-[#0B3B24]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>My Consignments &amp; RFQs</span>
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                    {customerRFQs.length}
                  </span>
                </button>

                <button
                  onClick={() => setCustomerPortalTab('new-quote')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    customerPortalTab === 'new-quote'
                      ? 'bg-[#0B3B24] text-white shadow-sm'
                      : 'text-[#4A5568] hover:bg-[#FAF8F5] hover:text-[#0B3B24]'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Request New Quote</span>
                </button>

                <button
                  onClick={() => setCustomerPortalTab('profile')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    customerPortalTab === 'profile'
                      ? 'bg-[#0B3B24] text-white shadow-sm'
                      : 'text-[#4A5568] hover:bg-[#FAF8F5] hover:text-[#0B3B24]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Company Profile</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#64748B] hidden sm:inline">
                  Signed in as <strong className="text-[#1E232A]">{customerUser.email}</strong>
                </span>
                <button
                  onClick={customerLogout}
                  className="px-2.5 py-1.5 rounded-lg border border-[#D9D0BE] text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Sign out of buyer portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Sub-tab content */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
              
              {/* TAB 1: INQUIRIES & RFQS */}
              {customerPortalTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#0B3B24]">Your Export Consignment Inquiries</h3>
                      <p className="text-xs text-[#64748B]">Real-time status updates synced directly from our Lagos export terminal.</p>
                    </div>
                    <button
                      onClick={() => setCustomerPortalTab('new-quote')}
                      className="px-3 py-1.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Submit Inbound RFQ</span>
                    </button>
                  </div>

                  {customerRFQs.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 border border-[#E0D8C8] text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#0B3B24]/10 text-[#0B3B24] mx-auto flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-[#1E232A]">No Commercial Inquiries Recorded Yet</h4>
                      <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                        Submit a Request for Quotation (RFQ) to receive official proforma invoices, assay sheets, and scheduled bill of lading dates.
                      </p>
                      <button
                        onClick={() => setCustomerPortalTab('new-quote')}
                        className="mt-2 px-4 py-2 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-colors cursor-pointer"
                      >
                        Create First Export Request
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customerRFQs.map((rfq) => (
                        <div
                          key={rfq.id || rfq.rfqId}
                          className="bg-white p-5 rounded-2xl border border-[#E0D8C8] hover:border-[#0B3B24]/40 transition-all shadow-sm space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FAF8F5] pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#0B3B24] bg-[#0B3B24]/10 px-2.5 py-1 rounded-lg">
                                {rfq.rfqId}
                              </span>
                              <span className="text-xs text-[#718096] flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {rfq.date}
                              </span>
                            </div>
                            <div>{getStatusBadge(rfq.status)}</div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <span className="text-[#718096] block text-[11px]">Commodity / Products</span>
                              <strong className="text-[#1E232A] font-semibold">
                                {(rfq.productNames || []).join(', ') || 'Agro Export'}
                              </strong>
                            </div>
                            <div>
                              <span className="text-[#718096] block text-[11px]">Order Volume &amp; Packaging</span>
                              <strong className="text-[#1E232A] font-semibold">
                                {rfq.data?.orderVolumeMT || 14} MT ({rfq.estimatedContainers || 1} x 20ft FCL)
                              </strong>
                            </div>
                            <div>
                              <span className="text-[#718096] block text-[11px]">Destination Port</span>
                              <strong className="text-[#1E232A] font-semibold flex items-center gap-1">
                                <Ship className="w-3.5 h-3.5 text-[#0B3B24]" />
                                <span className="truncate">{rfq.data?.destinationPort || 'International Port'}</span>
                              </strong>
                            </div>
                          </div>

                          {rfq.data?.specialRequirements && (
                            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EFE9DF] text-[11px] text-[#4A5568]">
                              <strong className="text-[#0B3B24] block mb-0.5">Special Specifications / Assay:</strong>
                              {rfq.data.specialRequirements}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-[#FAF8F5] text-xs">
                            <span className="text-[11px] text-[#64748B]">
                              Assigned Desk: <strong>{rfq.assignedAgent || 'Lagos Export Operations'}</strong>
                            </span>

                            <a
                              href={`https://wa.me/2348030000000?text=${encodeURIComponent(`Hello NaijaGlobal Agro, following up on our commercial RFQ ${rfq.rfqId} for ${rfq.productNames?.join(', ')}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors font-semibold text-xs"
                            >
                              <MessageSquareShare className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp Export Officer</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: REQUEST NEW QUOTE (QUICK) */}
              {customerPortalTab === 'new-quote' && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E0D8C8] space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#0B3B24]">Request Commercial Export Proforma</h3>
                    <p className="text-xs text-[#64748B]">
                      Pre-filled with your verified company credentials for instant clearance.
                    </p>
                  </div>

                  {quickSuccessMessage && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{quickSuccessMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleQuickRFQSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A5568] mb-1">
                          Select Export Commodity
                        </label>
                        <select
                          value={quickProduct}
                          onChange={(e) => setQuickProduct(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                        >
                          {data.products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A5568] mb-1">
                          Order Volume (Metric Tonnes)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={5000}
                          value={quickVolume}
                          onChange={(e) => setQuickVolume(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                        />
                        <span className="text-[10px] text-[#718096] mt-0.5 block">
                          Approx: {Math.max(1, Math.ceil(quickVolume / 14))} x 20ft FCL container loads
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A5568] mb-1">
                          Destination Seaport
                        </label>
                        <select
                          value={quickPort}
                          onChange={(e) => setQuickPort(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                        >
                          {(data.rfqSettings?.popularPorts || [
                            'Port of Rotterdam (Netherlands) - NL RTM',
                            'Port of Jebel Ali, Dubai (UAE) - AE JEA',
                            'Port of New York / New Jersey - US NYC',
                            'Port of Felixstowe (UK) - GB FXT',
                            'Port of Qingdao (China) - CN TAO'
                          ]).map((port) => (
                            <option key={port} value={port}>{port}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A5568] mb-1">
                          Incoterm Trade Basis
                        </label>
                        <div className="flex gap-2">
                          {(['CIF', 'FOB', 'CFR'] as Incoterm[]).map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => setQuickIncoterm(term)}
                              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                                quickIncoterm === term
                                  ? 'bg-[#0B3B24] text-white border-[#0B3B24]'
                                  : 'bg-[#FAF8F5] text-[#4A5568] border-[#D9D0BE] hover:bg-white'
                              }`}
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A5568] mb-1">
                        Specific Quality Specs / Moisture / Inspection Clauses
                      </label>
                      <textarea
                        rows={3}
                        value={quickNotes}
                        onChange={(e) => setQuickNotes(e.target.value)}
                        placeholder="e.g. Requires SGS pre-shipment assay verifying moisture < 8.5% and phytosanitary certificate."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={quickSubmitting}
                      className="w-full py-3.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {quickSubmitting ? (
                        <span>Transmitting Consignment Order to Lagos Terminal...</span>
                      ) : (
                        <>
                          <Ship className="w-4 h-4 text-[#E6C687]" />
                          <span>Dispatch Commercial RFQ to Export Desk</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: COMPANY PROFILE */}
              {customerPortalTab === 'profile' && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E0D8C8] space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#0B3B24]">Registered Trade Entity Profile</h3>
                      <p className="text-xs text-[#64748B]">Update company contacts, export destination, and authorized representatives.</p>
                    </div>

                    {profileSuccess && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        <span>Profile Saved</span>
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A5568] mb-1">Company Legal Entity</label>
                        <input
                          type="text"
                          required
                          value={editCompany}
                          onChange={(e) => setEditCompany(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A5568] mb-1">Authorized Representative</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A5568] mb-1">Trade Destination Country</label>
                        <input
                          type="text"
                          value={editCountry}
                          onChange={(e) => setEditCountry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#4A5568] mb-1">Direct Phone / WhatsApp</label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="w-full py-3 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      <Check className="w-4 h-4 text-[#E6C687]" />
                      <span>{profileSaving ? 'Saving Updates...' : 'Update Trade Profile'}</span>
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
