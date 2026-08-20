import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { SupplyChainStep } from '../../../types';
import { Save, Check, Plus, Trash2, MapPin } from 'lucide-react';

export const SupplyChainCMSTab: React.FC = () => {
  const { data, updateSupplyChain } = useCMS();
  const [steps, setSteps] = useState<SupplyChainStep[]>(data.supplyChainSteps || []);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleStepChange = (idx: number, field: keyof SupplyChainStep, val: string) => {
    const updated = [...steps];
    if (updated[idx]) {
      updated[idx] = { ...updated[idx], [field]: val };
      setSteps(updated);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSupplyChain(steps, data.transitRoutes);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B3B24] tracking-tight">
            Supply Chain &amp; Logistics Pipeline CMS
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Configure the 4 structured farmgate aggregation, laboratory cleaning, terminal staging, and ocean freight steps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4" />
              <span>Pipeline Saved</span>
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-75"
          >
            <Save className="w-4 h-4 text-[#E6C687]" />
            <span>{isSaving ? 'Saving...' : 'Save Pipeline Steps'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, idx) => (
          <div key={step.id || idx} className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-3">
              <span className="text-xl font-mono font-extrabold text-[#C59B27]">{step.step}</span>
              <span className="text-xs font-bold text-[#0B3B24]">Step {idx + 1}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Step Title</label>
              <input
                type="text"
                value={step.title}
                onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-bold text-[#1E232A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Location / Facility</label>
              <input
                type="text"
                value={step.location}
                onChange={(e) => handleStepChange(idx, 'location', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#8C7A5B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Description</label>
              <textarea
                rows={3}
                value={step.desc}
                onChange={(e) => handleStepChange(idx, 'desc', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#4A5568]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Quality Checkpoint Badge</label>
              <input
                type="text"
                value={step.checkpoint}
                onChange={(e) => handleStepChange(idx, 'checkpoint', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-emerald-800 font-semibold"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
