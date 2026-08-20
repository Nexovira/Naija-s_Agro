import React, { useState } from 'react';
import { Product } from '../types';
import { useCMS } from '../context/CMSContext';
import { Check, Droplet, Sparkles, Scale, ArrowRight, FileText, Package } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProductForRFQ: (productId: string) => void;
  onViewProductDetails: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProductForRFQ,
  onViewProductDetails,
}) => {
  const { data } = useCMS();
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter products: must be active (or undefined which defaults to active)
  const activeProducts = (data.products || []).filter(p => p.active !== false);

  const filteredProducts = activeCategory === 'all'
    ? activeProducts
    : activeProducts.filter((p) => p.category === activeCategory);

  const categories = data.categories && data.categories.length > 0
    ? data.categories
    : [
        { id: 'all', name: 'All Commodities' },
        { id: 'spices', name: 'Spices & Botanicals' },
        { id: 'oilseeds', name: 'Oilseeds & Kernels' },
        { id: 'flours', name: 'Processed Flours' }
      ];

  return (
    <section id="products" className="py-20 md:py-28 bg-[#F5EFE6]/60 border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0B3B24]/10 text-[#0B3B24] text-xs font-bold uppercase tracking-wider mb-3">
              Export Grade Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B24] tracking-tight">
              Export Product Catalog
            </h2>
            <p className="mt-3 text-base text-[#4A5568] leading-relaxed">
              Lab-tested, moisture-controlled agricultural commodities sourced directly from organized Nigerian farming clusters with guaranteed traceability.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#0B3B24] text-white shadow-sm'
                    : 'bg-white text-[#4A5568] border border-[#D9D0BE] hover:bg-[#EFE9DF]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              id={`product-card-${product.id}`}
              className="group rounded-2xl bg-white border border-[#E0D8C8] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Product Image Banner with Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-[#1E232A]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-[#0B3B24]/90 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider border border-white/20">
                      {product.specs?.grade || 'Grade A'}
                    </span>
                  </div>

                  {/* Botanical Name on Image Base */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-[11px] font-mono italic text-[#E6C687]">{product.botanicalName}</div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{product.name}</h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-5">
                  <p className="text-xs sm:text-sm text-[#4A5568] line-clamp-2 leading-relaxed">
                    {product.tagline}
                  </p>

                  {/* Technical Specifications Grid */}
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] space-y-3">
                    <div className="text-[11px] font-bold text-[#0B3B24] uppercase tracking-wider flex items-center justify-between">
                      <span>Technical Specifications</span>
                      <span className="text-[#8C7A5B] font-mono text-[10px]">HS: {product.specs?.hsCode || '0910.00'}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {/* Spec 1: Moisture */}
                      <div className="bg-white p-2.5 rounded-lg border border-[#E0D8C8] text-center">
                        <div className="flex items-center justify-center gap-1 text-[#64748B] mb-0.5">
                          <Droplet className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-[10px] font-semibold uppercase">Moisture</span>
                        </div>
                        <div className="text-xs sm:text-sm font-extrabold text-[#0B3B24]">
                          {product.specs?.moisture}
                        </div>
                      </div>

                      {/* Spec 2: Purity */}
                      <div className="bg-white p-2.5 rounded-lg border border-[#E0D8C8] text-center">
                        <div className="flex items-center justify-center gap-1 text-[#64748B] mb-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                          <span className="text-[10px] font-semibold uppercase">Purity</span>
                        </div>
                        <div className="text-xs sm:text-sm font-extrabold text-[#0B3B24]">
                          {product.specs?.purity}
                        </div>
                      </div>

                      {/* Spec 3: MOQ */}
                      <div className="bg-white p-2.5 rounded-lg border border-[#E0D8C8] text-center">
                        <div className="flex items-center justify-center gap-1 text-[#64748B] mb-0.5">
                          <Scale className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="text-[10px] font-semibold uppercase">MOQ</span>
                        </div>
                        <div className="text-[11px] sm:text-xs font-extrabold text-[#0B3B24] truncate" title={product.specs?.moq}>
                          {product.specs?.moq ? product.specs.moq.split('(')[0].trim() : '14 MT'}
                        </div>
                      </div>
                    </div>

                    {/* Secondary Specs: Origin & Packaging */}
                    <div className="pt-2 border-t border-[#E8DFC8]/70 text-xs text-[#5A687A] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#718096]">Origin:</span>
                        <span className="font-semibold text-[#1E232A]">{product.specs?.origin}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#718096]">Packaging:</span>
                        <span className="font-semibold text-[#1E232A] truncate max-w-[170px]" title={product.specs?.packaging}>
                          {product.specs?.packaging}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="space-y-1.5 text-xs text-[#3D4756]">
                    {(product.keyFeatures || []).slice(0, 2).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-6 pt-0 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  id={`btn-rfq-${product.id}`}
                  onClick={() => onSelectProductForRFQ(product.id)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#0B3B24] text-white text-xs sm:text-sm font-bold hover:bg-[#072818] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-4 h-4 text-[#E6C687]" />
                </button>

                <button
                  id={`btn-spec-${product.id}`}
                  onClick={() => onViewProductDetails(product)}
                  className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-[#FAF8F5] text-[#2D3748] text-xs font-semibold border border-[#D9D0BE] hover:bg-[#EFE9DF] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="View full laboratory and technical analysis specification sheet"
                >
                  <FileText className="w-4 h-4 text-[#0B3B24]" />
                  <span className="sm:hidden lg:inline">Lab Specs</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Custom Commodity Aggregation Notice */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-[#E0D8C8] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0B3B24] text-[#E6C687] flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0B3B24]">Need Custom Sourcing or Private Label Packaging?</h4>
              <p className="text-xs sm:text-sm text-[#5A687A]">
                We aggregate custom non-oil agro commodities with buyer-specific moisture thresholds, pre-palletization, and custom barcode retail packaging.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectProductForRFQ('custom')}
            className="shrink-0 px-5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#0B3B24]/20 text-[#0B3B24] font-semibold text-xs sm:text-sm hover:bg-[#EFE9DF] transition-colors"
          >
            Custom Commodity Inquiry
          </button>
        </div>

      </div>
    </section>
  );
};
