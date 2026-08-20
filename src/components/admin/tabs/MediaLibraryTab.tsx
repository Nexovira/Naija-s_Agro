import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { MediaItem } from '../../../types';
import { Plus, Trash2, Copy, Check, Image as ImageIcon, ExternalLink, Sparkles } from 'lucide-react';
import { ImageUploadField } from '../../common/ImageUploadField';

export const MediaLibraryTab: React.FC = () => {
  const { data, addMedia, deleteMedia } = useCMS();
  const mediaList = data.media || [];

  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCat, setNewCat] = useState<'products' | 'certifications' | 'logistics' | 'general'>('products');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;
    await addMedia({
      name: newName.trim(),
      url: newUrl.trim(),
      category: newCat
    });
    setNewName('');
    setNewUrl('');
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B3B24] tracking-tight">
            Media &amp; Asset Library CMS
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Upload and manage commodity photography, certification seal logos, laboratory reports, and terminal assets.
          </p>
        </div>
      </div>

      {/* Add Media Card with Drag & Drop Image Uploader */}
      <form onSubmit={handleAdd} className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-3">
          <h2 className="text-sm font-bold text-[#0B3B24] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-700" />
            <span>Upload New Media Asset</span>
          </h2>
          <span className="text-[11px] text-[#718096]">Direct Device File Upload &amp; Preview</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          <div className="md:col-span-5">
            <ImageUploadField
              label="Select or Drop Image File"
              value={newUrl}
              onChange={(url) => {
                setNewUrl(url);
                if (!newName) {
                  setNewName(`Asset-${newCat}-${Date.now().toString().slice(-4)}`);
                }
              }}
              required
              placeholder="Drop commodity photo here or click to browse"
              aspectRatio="video"
            />
          </div>

          <div className="md:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Asset Name / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kano Ginger Processing Facility &amp; Sorting Line"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Asset Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white"
                >
                  <option value="products">Export Commodity Catalog</option>
                  <option value="certifications">Compliance &amp; Badges</option>
                  <option value="logistics">Logistics &amp; Seaports</option>
                  <option value="general">General Branding &amp; Hero</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={!newUrl}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#E6C687]" />
                  <span>Add to Asset Library</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#E0D8C8] shadow-sm overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-40 bg-[#1E232A] overflow-hidden">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] uppercase font-bold">
                  {item.category}
                </span>
              </div>

              <div className="p-3.5 space-y-1">
                <div className="font-bold text-xs text-[#0B3B24] truncate" title={item.name}>
                  {item.name}
                </div>
                <div className="text-[10px] text-[#718096] truncate font-mono" title={item.url}>
                  {item.url}
                </div>
              </div>
            </div>

            <div className="p-3.5 pt-0 flex items-center justify-between border-t border-[#EFE9DF] mt-2">
              <button
                type="button"
                onClick={() => handleCopyUrl(item.url, item.id)}
                className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D9D0BE] text-[11px] font-bold text-[#0B3B24] hover:bg-[#EFE9DF] flex items-center gap-1 cursor-pointer"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => deleteMedia(item.id)}
                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                title="Delete Media"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
