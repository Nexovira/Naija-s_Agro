import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { RFQSettings } from '../../../types';
import { Save, Check, Plus, Trash2, Sliders } from 'lucide-react';

export const RFQSettingsCMSTab: React.FC = () => {
  const { data, updateRFQSettings } = useCMS();
  const [settings, setSettings] = useState<RFQSettings>({ ...data.rfqSettings });
  const [newPort, setNewPort] = useState('');
  const [newPackaging, setNewPackaging] = useState('');
  const [newVolume, setNewVolume] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddPort = () => {
    if (!newPort.trim()) return;
    setSettings(prev => ({ ...prev, popularPorts: [...(prev.popularPorts || []), newPort.trim()] }));
    setNewPort('');
  };

  const handleRemovePort = (idx: number) => {
    setSettings(prev => ({ ...prev, popularPorts: (prev.popularPorts || []).filter((_, i) => i !== idx) }));
  };

  const handleAddPackaging = () => {
    if (!newPackaging.trim()) return;
    setSettings(prev => ({ ...prev, packagingOptions: [...(prev.packagingOptions || []), newPackaging.trim()] }));
    setNewPackaging('');
  };

  const handleRemovePackaging = (idx: number) => {
    setSettings(prev => ({ ...prev, packagingOptions: (prev.packagingOptions || []).filter((_, i) => i !== idx) }));
  };

  const handleAddVolume = () => {
    const vol = parseInt(newVolume);
    if (isNaN(vol) || vol <= 0) return;
    setSettings(prev => ({ ...prev, volumePresets: [...(prev.volumePresets || []), vol].sort((a, b) => a - b) }));
    setNewVolume('');
  };

  const handleRemoveVolume = (vol: number) => {
    setSettings(prev => ({ ...prev, volumePresets: (prev.volumePresets || []).filter(v => v !== vol) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateRFQSettings(settings);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B3B24] tracking-tight">
            RFQ Portal Form Settings CMS
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Configure dropdown choices, quick volume preset buttons, default MOQ values, and hotline credentials.
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
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-75"
          >
            <Save className="w-4 h-4 text-[#E6C687]" />
            <span>{isSaving ? 'Saving...' : 'Save RFQ Configuration'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Hotlines & Defaults */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#0B3B24]">Default Volume &amp; Fast Desk Hotline</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Default Initial MT</label>
              <input
                type="number"
                value={settings.defaultVolumeMT}
                onChange={(e) => setSettings({ ...settings, defaultVolumeMT: parseInt(e.target.value) || 14 })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-bold text-[#0B3B24]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Hotline WhatsApp</label>
              <input
                type="text"
                value={settings.hotlineWhatsApp}
                onChange={(e) => setSettings({ ...settings, hotlineWhatsApp: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Hotline Email</label>
              <input
                type="email"
                value={settings.hotlineEmail}
                onChange={(e) => setSettings({ ...settings, hotlineEmail: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A]"
              />
            </div>
          </div>
        </div>

        {/* Volume Preset Chips */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B3B24]">Volume Preset Quick Chips (MT)</h3>
              <p className="text-xs text-[#718096]">Chips rendered next to the metric tons input field</p>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="MT (e.g. 150)"
                value={newVolume}
                onChange={(e) => setNewVolume(e.target.value)}
                className="w-24 px-2.5 py-1.5 rounded-lg border border-[#D9D0BE] text-xs"
              />
              <button
                type="button"
                onClick={handleAddVolume}
                className="px-3 py-1.5 rounded-lg bg-[#0B3B24] text-white text-xs font-bold"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(settings.volumePresets || []).map((vol) => (
              <div key={vol} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D9D0BE] text-xs font-bold text-[#0B3B24]">
                <span>{vol} MT</span>
                <button
                  type="button"
                  onClick={() => handleRemoveVolume(vol)}
                  className="text-red-500 hover:text-red-700 ml-1"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Ports List */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B3B24]">Popular Destination Discharge Ports Dropdown</h3>
              <p className="text-xs text-[#718096]">Options available in the destination port selector</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Port of Ningbo-Zhoushan (China) - CN NGB"
              value={newPort}
              onChange={(e) => setNewPort(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A]"
            />
            <button
              type="button"
              onClick={handleAddPort}
              className="px-4 py-2 rounded-xl bg-[#0B3B24] text-white text-xs font-bold shrink-0"
            >
              + Add Seaport
            </button>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pt-2">
            {(settings.popularPorts || []).map((port, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5] border border-[#EFE9DF] text-xs">
                <span className="font-semibold text-[#1E232A]">{port}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePort(idx)}
                  className="text-red-500 hover:text-red-700 text-xs px-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Packaging Options */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0B3B24]">Packaging Specification Options</h3>
              <p className="text-xs text-[#718096]">Options available in packaging preference dropdown</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 50kg Heavy-Duty Jute Sacks with Inner Polyethylene Liner"
              value={newPackaging}
              onChange={(e) => setNewPackaging(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A]"
            />
            <button
              type="button"
              onClick={handleAddPackaging}
              className="px-4 py-2 rounded-xl bg-[#0B3B24] text-white text-xs font-bold shrink-0"
            >
              + Add Packaging
            </button>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pt-2">
            {(settings.packagingOptions || []).map((opt, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5] border border-[#EFE9DF] text-xs">
                <span className="font-medium text-[#1E232A]">{opt}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePackaging(idx)}
                  className="text-red-500 hover:text-red-700 text-xs px-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

      </form>
    </div>
  );
};
