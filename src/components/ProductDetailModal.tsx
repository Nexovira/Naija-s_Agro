import React from 'react';
import { Product } from '../types';
import { X, CheckCircle, ShieldCheck, Download, ExternalLink, ArrowRight, Layers, FileCheck } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectForRFQ: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectForRFQ,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-white border border-[#D9D0BE] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#0B3B24] text-white p-6 sm:p-8 flex items-start justify-between">
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#E6C687] text-[#0B3B24] uppercase tracking-wider">
              Technical Specification Sheet
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{product.name}</h3>
            <p className="text-xs sm:text-sm font-mono text-[#E6C687] italic">{product.botanicalName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto bg-[#FAF8F5]">
          
          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B3B24] mb-2">Commodity Overview</h4>
            <p className="text-sm text-[#3D4756] leading-relaxed bg-white p-4 rounded-xl border border-[#E0D8C8]">
              {product.description}
            </p>
          </div>

          {/* Laboratory & Technical Parameters Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B3B24] mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>Laboratory &amp; Export Verification Parameters</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-[#E0D8C8] flex justify-between items-center">
                <span className="text-xs text-[#64748B]">Moisture Content</span>
                <span className="text-sm font-extrabold text-[#0B3B24]">{product.specs.moisture}</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#E0D8C8] flex justify-between items-center">
                <span className="text-xs text-[#64748B]">Purity / Cleanliness</span>
                <span className="text-sm font-extrabold text-[#0B3B24]">{product.specs.purity}</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#E0D8C8] flex justify-between items-center">
                <span className="text-xs text-[#64748B]">Minimum Order Quantity (MOQ)</span>
                <span className="text-sm font-extrabold text-[#0B3B24]">{product.specs.moq}</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#E0D8C8] flex justify-between items-center">
                <span className="text-xs text-[#64748B]">Origin / Harvest Region</span>
                <span className="text-sm font-bold text-[#1E232A]">{product.specs.origin}</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#E0D8C8] flex justify-between items-center">
                <span className="text-xs text-[#64748B]">Export Grade</span>
                <span className="text-sm font-bold text-[#1E232A]">{product.specs.grade}</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-[#E0D8C8] flex justify-between items-center">
                <span className="text-xs text-[#64748B]">Harmonized System (HS) Code</span>
                <span className="text-sm font-mono font-bold text-[#1E232A]">{product.specs.hsCode}</span>
              </div>
              {product.specs.oilContent && (
                <div className="bg-white p-3.5 rounded-xl border border-[#E0D8C8] flex justify-between items-center">
                  <span className="text-xs text-[#64748B]">Essential Oil / Lipids</span>
                  <span className="text-sm font-bold text-[#0B3B24]">{product.specs.oilContent}</span>
                </div>
              )}
              {product.specs.aflatoxin && (
                <div className="bg-white p-3.5 rounded-xl border border-[#E0D8C8] flex justify-between items-center">
                  <span className="text-xs text-[#64748B]">Aflatoxin Limits</span>
                  <span className="text-sm font-bold text-[#0B3B24]">{product.specs.aflatoxin}</span>
                </div>
              )}
              {product.specs.extraneousMatter && (
                <div className="bg-white p-3.5 rounded-xl border border-[#E0D8C8] flex justify-between items-center">
                  <span className="text-xs text-[#64748B]">Extraneous Foreign Matter</span>
                  <span className="text-sm font-bold text-[#0B3B24]">{product.specs.extraneousMatter}</span>
                </div>
              )}
              <div className="bg-white p-3.5 rounded-xl border border-[#E0D8C8] flex justify-between items-center">
                <span className="text-xs text-[#64748B]">Shelf Life</span>
                <span className="text-sm font-bold text-[#1E232A]">{product.specs.shelfLife}</span>
              </div>
            </div>
          </div>

          {/* Standard Export Packaging Info */}
          <div className="bg-[#EFE9DF] p-4 rounded-xl border border-[#DFD7C7]">
            <h5 className="text-xs font-bold text-[#0B3B24] uppercase tracking-wider mb-1">Standard Packaging Specifications</h5>
            <p className="text-xs text-[#3D4756]">{product.specs.packaging}</p>
          </div>

          {/* Key Quality Assurances */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B3B24] mb-2">Quality &amp; Processing Standards</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#2D3748] bg-white p-2.5 rounded-lg border border-[#E0D8C8]">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-white border-t border-[#E0D8C8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#718096]">
            Full COA (Certificate of Analysis) provided with each shipped container.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#D9D0BE] text-xs font-semibold text-[#4A5568] hover:bg-[#FAF8F5]"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onSelectForRFQ(product.id);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0B3B24] text-white text-xs sm:text-sm font-bold hover:bg-[#072818] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Include in RFQ</span>
              <ArrowRight className="w-4 h-4 text-[#E6C687]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
