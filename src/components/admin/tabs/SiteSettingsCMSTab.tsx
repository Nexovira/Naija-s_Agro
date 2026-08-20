import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { SiteSettings } from '../../../types';
import { Save, Check, Globe, Shield, RefreshCw } from 'lucide-react';

export const SiteSettingsCMSTab: React.FC = () => {
  const { data, updateSiteSettings, resetToDefaults } = useCMS();
  const [formData, setFormData] = useState<SiteSettings>({ ...data.siteSettings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSiteSettings(formData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = async () => {
    await resetToDefaults();
    setShowResetConfirm(false);
    setFormData({ ...data.siteSettings });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B3B24] tracking-tight">
            Global Site Settings &amp; Legal CMS
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Configure brand name typography, institutional registration numbers, and live port desk status bar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4" />
              <span>Settings Saved</span>
            </span>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-75"
          >
            <Save className="w-4 h-4 text-[#E6C687]" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Brand Name Settings */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#0B3B24] flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>Brand Identity &amp; Navigation Text</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Company Main Title</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-extrabold text-[#0B3B24] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Highlighted Suffix (Gold)</label>
              <input
                type="text"
                value={formData.companyHighlight}
                onChange={(e) => handleChange('companyHighlight', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-bold text-[#C59B27] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Brand Tagline / Subtitle</label>
              <input
                type="text"
                value={formData.subTitle}
                onChange={(e) => handleChange('subTitle', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Live Port Desk Status Bar */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0B3B24]">Top Navigation Port Desk Status Indicator</h2>
              <p className="text-xs text-[#718096]">Controls the indicator badge in the top navigation bar</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0B3B24]">
              <input
                type="checkbox"
                checked={formData.portDeskOpen}
                onChange={(e) => handleChange('portDeskOpen', e.target.checked)}
                className="w-4 h-4 rounded text-[#0B3B24] focus:ring-[#0B3B24]"
              />
              <span>Desk Online / Gate-In Open</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Badge Text Display</label>
            <input
              type="text"
              value={formData.portDeskText}
              onChange={(e) => handleChange('portDeskText', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-medium text-[#1E232A] focus:bg-white"
            />
          </div>
        </div>

        {/* Legal & Regulatory Registrations */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#0B3B24] flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>Statutory Export Licenses &amp; Registration Codes</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">NEPC Exporter License No.</label>
              <input
                type="text"
                value={formData.nepcLicense}
                onChange={(e) => handleChange('nepcLicense', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-mono font-bold text-[#0B3B24] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">NAFDAC Facility Permit No.</label>
              <input
                type="text"
                value={formData.nafdacLicense}
                onChange={(e) => handleChange('nafdacLicense', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-mono font-bold text-[#0B3B24] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">US FDA Foreign Facility Registration</label>
              <input
                type="text"
                value={formData.fdaLicense}
                onChange={(e) => handleChange('fdaLicense', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-mono font-bold text-[#0B3B24] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">CAC Corporate RC Registration</label>
              <input
                type="text"
                value={formData.rcNumber}
                onChange={(e) => handleChange('rcNumber', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-mono text-[#1E232A] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Footer Copyright Notice</label>
              <input
                type="text"
                value={formData.copyrightText}
                onChange={(e) => handleChange('copyrightText', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Factory Reset Area */}
        <div className="p-6 rounded-2xl border border-red-200 bg-red-50/50 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-red-900">Reset CMS Content to Initial Defaults</h3>
            <p className="text-[11px] text-red-700 mt-0.5">
              Restores all default agricultural commodities, hero headlines, and logistics routes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-xl bg-white border border-red-300 text-red-700 text-xs font-bold hover:bg-red-100 flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

      </form>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#E0D8C8] shadow-2xl space-y-4 text-center">
            <h3 className="text-base font-bold text-[#1E232A]">Reset All Content?</h3>
            <p className="text-xs text-[#718096]">
              This will overwrite current custom changes with the baseline dataset.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#D9D0BE] text-xs font-semibold text-[#4A5568]"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                Reset Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
