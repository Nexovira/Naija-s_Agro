import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { HomepageContent } from '../../../types';
import { ImageUploadField } from '../../common/ImageUploadField';
import { Save, Check, RefreshCw, Eye, Sparkles } from 'lucide-react';

export const HomepageCMSTab: React.FC = () => {
  const { data, updateHomepage } = useCMS();
  const [formData, setFormData] = useState<HomepageContent>({ ...data.homepage });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof HomepageContent, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpotlightChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      spotlight: {
        ...prev.spotlight,
        [field]: value
      }
    }));
  };

  const handleStatChange = (index: number, field: 'value' | 'label', val: string) => {
    const newStats = [...(formData.heroStats || [])];
    if (newStats[index]) {
      newStats[index][field] = val;
      setFormData(prev => ({ ...prev, heroStats: newStats }));
    }
  };

  const handleAddStat = () => {
    setFormData(prev => ({
      ...prev,
      heroStats: [...(prev.heroStats || []), { value: '99.5%', label: 'Metric Label' }]
    }));
  };

  const handleRemoveStat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      heroStats: (prev.heroStats || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateHomepage(formData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B3B24] tracking-tight">
            Homepage Hero &amp; Brand CMS
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Modify the main headlines, campaign status pill, live stats counters, and commodity showcase card.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4" />
              <span>Published Instantly</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-75"
          >
            <Save className="w-4 h-4 text-[#E6C687]" />
            <span>{isSaving ? 'Saving...' : 'Save & Publish Changes'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Campaign Status Bar */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#0B3B24]">1. Campaign Status Badge</h2>
              <p className="text-xs text-[#718096]">Top pulsing badge indicating active harvest export cycles</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0B3B24]">
              <input
                type="checkbox"
                checked={formData.campaignActive}
                onChange={(e) => handleChange('campaignActive', e.target.checked)}
                className="w-4 h-4 rounded text-[#0B3B24] focus:ring-[#0B3B24]"
              />
              <span>Campaign Active</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Badge Text</label>
              <input
                type="text"
                value={formData.campaignBadge}
                onChange={(e) => handleChange('campaignBadge', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Sub-badge (e.g. FOB Lagos &amp; CIF Global)</label>
              <input
                type="text"
                value={formData.campaignSubBadge}
                onChange={(e) => handleChange('campaignSubBadge', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Main Headline & Copy */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-5">
          <div className="border-b border-[#EFE9DF] pb-4">
            <h2 className="text-base font-bold text-[#0B3B24]">2. Hero Headline &amp; Subheadline</h2>
            <p className="text-xs text-[#718096]">Structure the main value proposition and highlighted words</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Heading Prefix</label>
              <input
                type="text"
                value={formData.headingPrefix}
                onChange={(e) => handleChange('headingPrefix', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Highlighted Word(s) (Underlined)</label>
              <input
                type="text"
                value={formData.headingHighlight}
                onChange={(e) => handleChange('headingHighlight', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Heading Suffix</label>
              <input
                type="text"
                value={formData.headingSuffix}
                onChange={(e) => handleChange('headingSuffix', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A5568] mb-1">Subheadline Description</label>
            <textarea
              rows={3}
              value={formData.subheadline}
              onChange={(e) => handleChange('subheadline', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
            />
          </div>
        </div>

        {/* Section 3: Rapid Trust Stats Counter */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#0B3B24]">3. Key Metric Stats Counters</h2>
              <p className="text-xs text-[#718096]">3-column fast metrics displayed under hero buttons</p>
            </div>
            <button
              type="button"
              onClick={handleAddStat}
              className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D9D0BE] text-[#0B3B24] text-xs font-bold hover:bg-[#EFE9DF]"
            >
              + Add Metric
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(formData.heroStats || []).map((stat, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0D8C8] space-y-2 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveStat(idx)}
                  className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
                <div>
                  <label className="block text-[11px] font-semibold text-[#718096] mb-1">Value (e.g. &lt; 9%)</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9D0BE] bg-white text-xs font-bold text-[#0B3B24]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#718096] mb-1">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9D0BE] bg-white text-xs text-[#1E232A]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Spotlight Showcase Card */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#0B3B24]">4. Hero Spotlight Commodity Card</h2>
              <p className="text-xs text-[#718096]">Featured product showcase card rendered on the right hero column</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0B3B24]">
              <input
                type="checkbox"
                checked={formData.spotlight?.enabled ?? true}
                onChange={(e) => handleSpotlightChange('enabled', e.target.checked)}
                className="w-4 h-4 rounded text-[#0B3B24] focus:ring-[#0B3B24]"
              />
              <span>Display Card</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Showcase Title</label>
              <input
                type="text"
                value={formData.spotlight?.title || ''}
                onChange={(e) => handleSpotlightChange('title', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Tagline / Category</label>
              <input
                type="text"
                value={formData.spotlight?.tagline || ''}
                onChange={(e) => handleSpotlightChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Origin Badge</label>
              <input
                type="text"
                value={formData.spotlight?.originBadge || ''}
                onChange={(e) => handleSpotlightChange('originBadge', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploadField
                label="Spotlight Product Photograph"
                value={formData.spotlight?.image || ''}
                onChange={(url) => handleSpotlightChange('image', url)}
                placeholder="Upload featured commodity photo (click to browse or drag & drop)"
                aspectRatio="video"
                helperText="Appears on the homepage hero spotlight card"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Moisture Text Display</label>
              <input
                type="text"
                value={formData.spotlight?.moistureText || ''}
                onChange={(e) => handleSpotlightChange('moistureText', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Purity Text Display</label>
              <input
                type="text"
                value={formData.spotlight?.purityText || ''}
                onChange={(e) => handleSpotlightChange('purityText', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Inspection Badge</label>
              <input
                type="text"
                value={formData.spotlight?.inspectionText || ''}
                onChange={(e) => handleSpotlightChange('inspectionText', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Port Text</label>
              <input
                type="text"
                value={formData.spotlight?.portText || ''}
                onChange={(e) => handleSpotlightChange('portText', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">License Text</label>
              <input
                type="text"
                value={formData.spotlight?.licenseText || ''}
                onChange={(e) => handleSpotlightChange('licenseText', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-[#0B3B24] text-white text-sm font-bold hover:bg-[#072818] transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-75"
          >
            <Save className="w-4 h-4 text-[#E6C687]" />
            <span>{isSaving ? 'Publishing Changes...' : 'Save & Publish Changes'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
