import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { ContactSettings } from '../../../types';
import { Save, Check, MapPin, Mail, Phone, Clock } from 'lucide-react';

export const ContactCMSTab: React.FC = () => {
  const { data, updateContactSettings } = useCMS();
  const [formData, setFormData] = useState<ContactSettings>({ ...data.contactSettings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof ContactSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateContactSettings(formData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B3B24] tracking-tight">
            Trade Desk &amp; Facility Contact CMS
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Manage corporate HQ addresses, northern sourcing clusters, export desks, WhatsApp lines, and operational hours.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4" />
              <span>Published Instantly</span>
            </span>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-75"
          >
            <Save className="w-4 h-4 text-[#E6C687]" />
            <span>{isSaving ? 'Saving...' : 'Save Contacts'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Email & Phone */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#0B3B24] flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-700" />
            <span>Commercial Email &amp; WhatsApp Lines</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Corporate Trade Email</label>
              <input
                type="email"
                value={formData.tradeEmail}
                onChange={(e) => handleChange('tradeEmail', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Export Desk Direct WhatsApp</label>
              <input
                type="text"
                value={formData.deskWhatsApp}
                onChange={(e) => handleChange('deskWhatsApp', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-mono font-bold text-[#0B3B24] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
              />
            </div>
          </div>
        </div>

        {/* Physical Addresses */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#0B3B24] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Trade Offices &amp; Processing Terminals</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">HQ &amp; Lagos Seaport Export Terminal Address</label>
              <textarea
                rows={2}
                value={formData.hqAddress}
                onChange={(e) => handleChange('hqAddress', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Northern Aggregation &amp; Warehousing Hub Address</label>
              <textarea
                rows={2}
                value={formData.northernHubAddress}
                onChange={(e) => handleChange('northernHubAddress', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Trading Desk Hours &amp; Timezone</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => handleChange('workingHours', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
