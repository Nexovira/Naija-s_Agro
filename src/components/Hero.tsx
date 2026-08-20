import React from 'react';
import { ArrowRight, ShieldCheck, Anchor, CheckCircle2, Building2, ChevronDown } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface HeroProps {
  onOpenRFQ: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRFQ }) => {
  const { data, setIsCustomerPortalOpen, isCustomerAuthenticated, customerUser } = useCMS();
  const { homepage } = data;

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#FAF8F5]">
      {/* Background Subtle Gradient & Organic Geo Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#0B3B24]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#C59B27]/10 blur-3xl pointer-events-none" />
      
      {/* Top Banner Tag */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Accreditation Badge */}
            {homepage.campaignActive && (
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EFE9DF] border border-[#D9D0BE] text-[#0B3B24] text-xs font-semibold tracking-wide">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span>{homepage.campaignBadge}</span>
                {homepage.campaignSubBadge && (
                  <>
                    <span className="text-[#8C7A5B]">•</span>
                    <span className="text-[#3D4756] font-normal">{homepage.campaignSubBadge}</span>
                  </>
                )}
              </div>
            )}

            {/* Main Hero Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B3B24] tracking-tight leading-[1.12]">
              {homepage.headingPrefix}{' '}
              <span className="underline decoration-[#C59B27] decoration-4 underline-offset-8">
                {homepage.headingHighlight}
              </span>{' '}
              {homepage.headingSuffix}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-[#3D4756] max-w-2xl font-normal leading-relaxed">
              {homepage.subheadline}
            </p>

            {/* CTA Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                id="hero-request-quote-btn"
                onClick={onOpenRFQ}
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-[#0B3B24] text-white text-sm sm:text-base font-bold hover:bg-[#072818] shadow-lg shadow-[#0B3B24]/15 active:scale-[0.98] transition-all cursor-pointer group"
              >
                <span>Request Quote</span>
                <ArrowRight className="w-5 h-5 text-[#E6C687] group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#products"
                id="hero-explore-catalog-btn"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#1E232A] text-sm sm:text-base font-semibold border border-[#D9D0BE] hover:bg-[#F3EFE6] hover:border-[#0B3B24]/30 transition-all shadow-sm"
              >
                <span>Explore Catalog</span>
              </a>

              <button
                onClick={() => setIsCustomerPortalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#FAF8F5] text-[#0B3B24] text-sm sm:text-base font-semibold border border-[#0B3B24]/20 hover:bg-emerald-50/50 hover:border-[#0B3B24] transition-all shadow-sm cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#0B3B24]" />
                <span>{isCustomerAuthenticated ? `${customerUser?.companyName || 'Buyer Portal'}` : 'Buyer Portal'}</span>
              </button>
            </div>

            {/* Rapid Trust Highlights */}
            {homepage.heroStats && homepage.heroStats.length > 0 && (
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E5DEC9] w-full max-w-xl">
                {homepage.heroStats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-extrabold text-[#0B3B24]">{stat.value}</div>
                    <div className="text-xs text-[#5A687A] font-medium mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Hero Visual Commodity Card Showcase */}
          {homepage.spotlight && homepage.spotlight.enabled && (
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Premium Frame Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-[#E0D8C8]">
                  
                  {/* Image Header with Badge */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#0B3B24]">
                    <img
                      src={homepage.spotlight.image}
                      alt="Nigerian Agricultural Export Commodities"
                      className="w-full h-full object-cover object-center opacity-90 hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B24] via-transparent to-black/20" />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-md bg-[#0B3B24]/90 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                        {homepage.spotlight.originBadge}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-xs font-semibold tracking-wider uppercase text-[#E6C687]">
                        {homepage.spotlight.tagline}
                      </span>
                      <h2 className="text-xl font-bold text-white leading-tight">
                        {homepage.spotlight.title}
                      </h2>
                    </div>
                  </div>

                  {/* Card Specs Summary */}
                  <div className="p-6 bg-[#FAF8F5] space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-[#E8E1D3]">
                        <span className="text-[11px] text-[#64748B] block font-medium uppercase">Moisture Level</span>
                        <span className="text-sm font-bold text-[#0B3B24]">{homepage.spotlight.moistureText}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-[#E8E1D3]">
                        <span className="text-[11px] text-[#64748B] block font-medium uppercase">Purity Standard</span>
                        <span className="text-sm font-bold text-[#0B3B24]">{homepage.spotlight.purityText}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#4A5568] pt-2 border-t border-[#E8E1D3]">
                      <div className="flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>{homepage.spotlight.inspectionText}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-[#0B3B24]">
                        <Anchor className="w-3.5 h-3.5" />
                        <span>{homepage.spotlight.portText}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Floating Verified Exporter Pill */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white py-3 px-4 rounded-xl shadow-xl border border-[#D9D0BE] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0B3B24] flex items-center justify-center text-[#E6C687]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B3B24]">Certified NEPC Exporter</div>
                    <div className="text-[11px] text-[#64748B]">{homepage.spotlight.licenseText}</div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Subtle Scroll Down Bounce Indicator */}
        <div className="mt-12 md:mt-16 pt-4 flex justify-center items-center">
          <a
            href="#products"
            id="hero-scroll-down-indicator"
            aria-label="Scroll down to explore product catalog"
            className="group inline-flex flex-col items-center gap-1.5 text-xs font-semibold text-[#5A687A] hover:text-[#0B3B24] transition-colors focus:outline-none cursor-pointer"
          >
            <span className="tracking-wider uppercase text-[10px] text-[#718096] group-hover:text-[#0B3B24] transition-colors">
              Explore Export Catalog
            </span>
            <div className="w-8 h-8 rounded-full border border-[#D9D0BE] bg-white/80 backdrop-blur-xs flex items-center justify-center shadow-xs group-hover:border-[#0B3B24] group-hover:bg-emerald-50/60 transition-all">
              <ChevronDown className="w-4 h-4 text-[#0B3B24] animate-bounce" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
