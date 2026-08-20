import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { Certification, ExportDocument } from '../../../types';
import { Save, Check, Plus, Trash2, ShieldCheck, FileText } from 'lucide-react';

export const ComplianceCMSTab: React.FC = () => {
  const { data, updateCertifications } = useCMS();
  const [certifications, setCertifications] = useState<Certification[]>(data.certifications || []);
  const [exportDocs, setExportDocs] = useState<ExportDocument[]>(data.exportDocs || []);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCertChange = (idx: number, field: keyof Certification, val: string) => {
    const updated = [...certifications];
    if (updated[idx]) {
      updated[idx] = { ...updated[idx], [field]: val };
      setCertifications(updated);
    }
  };

  const handleDocChange = (idx: number, field: keyof ExportDocument, val: string) => {
    const updated = [...exportDocs];
    if (updated[idx]) {
      updated[idx] = { ...updated[idx], [field]: val };
      setExportDocs(updated);
    }
  };

  const handleAddDoc = () => {
    setExportDocs([
      ...exportDocs,
      {
        id: `doc-${Date.now()}`,
        name: 'New Export Document',
        issuer: 'Issuing Authority / Ministry',
        desc: 'Description of statutory purpose for international clearance.'
      }
    ]);
  };

  const handleRemoveDoc = (id: string) => {
    setExportDocs(exportDocs.filter(d => d.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateCertifications(certifications, exportDocs);
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
            Institutional Compliance &amp; Badges CMS
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Manage NAFDAC, NEPC, FDA, and SGS audit credential IDs, descriptions, and shipping documentation dockets.
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
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-75"
          >
            <Save className="w-4 h-4 text-[#E6C687]" />
            <span>{isSaving ? 'Saving...' : 'Save & Publish Compliance'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 4 Required Certification Badges */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0B3B24] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>International Verification Badges (NAFDAC, NEPC, FDA, SGS)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert, idx) => (
              <div key={cert.id || idx} className="bg-white p-5 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-2">
                  <span className="font-bold text-sm text-[#0B3B24]">{cert.code} Verification</span>
                  <span className="font-mono text-xs text-[#8C7A5B]">{cert.id}</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A5568] mb-1">Badge Title</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleCertChange(idx, 'name', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-bold text-[#1E232A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A5568] mb-1">Issuer / Regulatory Body</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleCertChange(idx, 'issuer', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A5568] mb-1">Badge Number / Registration Credential</label>
                  <input
                    type="text"
                    value={cert.badgeNumber}
                    onChange={(e) => handleCertChange(idx, 'badgeNumber', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D9D0BE] bg-[#FAF8F5] text-xs font-mono font-bold text-[#0B3B24]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A5568] mb-1">Audit Validity Text</label>
                  <input
                    type="text"
                    value={cert.validity}
                    onChange={(e) => handleCertChange(idx, 'validity', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A5568] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={cert.description}
                    onChange={(e) => handleCertChange(idx, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Documentation Docket */}
        <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#0B3B24] flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <span>Export Shipping Documentation Docket Included With Shipments</span>
              </h2>
              <p className="text-xs text-[#718096]">Documents displayed under the compliance trust section</p>
            </div>
            <button
              type="button"
              onClick={handleAddDoc}
              className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D9D0BE] text-[#0B3B24] text-xs font-bold hover:bg-[#EFE9DF] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exportDocs.map((doc, idx) => (
              <div key={doc.id || idx} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] space-y-2 relative">
                <button
                  type="button"
                  onClick={() => handleRemoveDoc(doc.id)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div>
                  <label className="block text-[10px] font-semibold text-[#718096] mb-0.5">Document Title</label>
                  <input
                    type="text"
                    value={doc.name}
                    onChange={(e) => handleDocChange(idx, 'name', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9D0BE] bg-white text-xs font-bold text-[#1E232A]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#718096] mb-0.5">Issuing Authority</label>
                  <input
                    type="text"
                    value={doc.issuer}
                    onChange={(e) => handleDocChange(idx, 'issuer', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9D0BE] bg-white text-xs text-[#8C7A5B]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#718096] mb-0.5">Description</label>
                  <input
                    type="text"
                    value={doc.desc}
                    onChange={(e) => handleDocChange(idx, 'desc', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9D0BE] bg-white text-xs text-[#4A5568]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </form>

    </div>
  );
};
