import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { Category } from '../../../types';
import { Plus, Edit2, Trash2, Check, Save } from 'lucide-react';

export const CategoriesCMSTab: React.FC = () => {
  const { data, updateCategories } = useCMS();
  const [categories, setCategories] = useState<Category[]>(data.categories || []);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const id = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const updated = [...categories, { id, name: newCatName.trim() }];
    setCategories(updated);
    setNewCatName('');
  };

  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const handleUpdateName = (id: string, name: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, name } : c));
  };

  const handleSaveAll = async () => {
    await updateCategories(categories);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B3B24] tracking-tight">
            Commodity Categories CMS
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Manage category filter tabs rendered on the public commodity catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4" />
              <span>Saved</span>
            </span>
          )}
          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#E6C687]" />
            <span>Save Categories</span>
          </button>
        </div>
      </div>

      {/* Add Category Form */}
      <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#0B3B24]">Add New Category</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Raw Botanical Extracts"
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
          />
          <button
            onClick={handleAddCategory}
            className="px-5 py-2.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-2xl border border-[#E0D8C8] shadow-sm divide-y divide-[#EFE9DF] overflow-hidden">
        {categories.map((cat, idx) => (
          <div key={cat.id || idx} className="p-4 flex items-center justify-between gap-4 hover:bg-[#FAF8F5]">
            <div className="flex items-center gap-3 flex-1">
              <span className="w-6 h-6 rounded-full bg-[#0B3B24]/10 text-[#0B3B24] font-mono text-xs flex items-center justify-center font-bold">
                {idx + 1}
              </span>
              <div className="flex-1">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => handleUpdateName(cat.id, e.target.value)}
                  className="w-full max-w-sm px-3 py-1.5 rounded-lg border border-[#D9D0BE] text-xs font-bold text-[#0B3B24] bg-white focus:ring-2 focus:ring-[#0B3B24]"
                />
                <span className="text-[10px] font-mono text-[#718096] block mt-0.5">ID: {cat.id}</span>
              </div>
            </div>

            {cat.id !== 'all' && (
              <button
                onClick={() => handleRemoveCategory(cat.id)}
                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                title="Remove Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
