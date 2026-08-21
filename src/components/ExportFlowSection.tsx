import React from 'react';
import { useCMS } from '../context/CMSContext';
import { MapPin, Search, ShieldCheck, Ship, CheckCircle2, Clock, Truck, Award, Box, Navigation, Anchor } from 'lucide-react';
import { InteractiveExportMap } from './common/InteractiveExportMap';

interface ExportFlowSectionProps {
  onSelectRouteForRFQ?: (portName: string) => void;
}

export const ExportFlowSection: React.FC<ExportFlowSectionProps> = ({ onSelectRouteForRFQ }) => {
  const { data } = useCMS();
  const steps = data.supplyChainSteps || [];
  const transitRoutes = data.transitRoutes || [];

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'MapPin':
        return <MapPin className="w-5 h-5" />;
      case 'Search':
        return <Search className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Ship':
        return <Ship className="w-5 h-5" />;
      case 'Truck':
        return <Truck className="w-5 h-5" />;
      case 'Award':
        return <Award className="w-5 h-5" />;
      default:
        return <Box className="w-5 h-5" />;
    }
  };

  return (
    <section id="supply-chain" className="py-20 md:py-28 bg-[#F5EFE6]/60 border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0B3B24]/10 text-[#0B3B24] text-xs font-bold uppercase tracking-wider">
            Export Logistics &amp; Shipping Grid
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B24] tracking-tight">
            From Nigerian Soil to Your Destination Seaport
          </h2>
          <p className="text-base text-[#4A5568] leading-relaxed">
            Every metric ton follows a strictly documented, quality-governed supply chain with direct ocean liner routes from Apapa &amp; Tin Can Island to global industrial centers.
          </p>
        </div>

        {/* 1. Interactive Maritime Export Routes SVG Map */}
        <InteractiveExportMap 
          onSelectRouteForRFQ={onSelectRouteForRFQ}
          cmsTransitRoutes={transitRoutes}
        />

        {/* 2. Dynamic 4-Stage Pipeline Steps Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E0D8C8] pb-3">
            <div>
              <h3 className="text-xl font-bold text-[#0B3B24] tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>4-Stage Quality &amp; Chain-of-Custody Pipeline</span>
              </h3>
              <p className="text-xs text-[#718096]">
                Guaranteed provenance, lab assay clearances, and airtight containerization before port terminal gate-in.
              </p>
            </div>
            <span className="hidden sm:inline-flex text-[11px] font-bold text-[#0B3B24] bg-white px-3 py-1 rounded-full border border-[#D9D0BE]">
              100% Pre-Shipment Inspection
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item) => (
              <div
                key={item.id || item.step}
                className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-mono font-extrabold text-[#C59B27]">{item.step}</span>
                    <div className="w-10 h-10 rounded-xl bg-[#0B3B24]/5 flex items-center justify-center text-[#0B3B24]">
                      {getStepIcon(item.iconName)}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#0B3B24] mb-1">{item.title}</h3>
                  <div className="text-[11px] font-semibold text-[#8C7A5B] mb-2.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>{item.location}</span>
                  </div>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EFE9DF] flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.checkpoint || 'Quality Checkpoint Cleared'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Ocean Freight Transit Times Quick Reference */}
        {transitRoutes.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D8C8] shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#0B3B24] flex items-center gap-2">
                  <Ship className="w-5 h-5 text-emerald-700" />
                  <span>Major Global Maritime Transit Times (Ex-Apapa Port, Lagos)</span>
                </h3>
                <p className="text-xs text-[#718096] mt-0.5">
                  Standard ocean freight carrier schedules with Maersk, CMA CGM, Hapag-Lloyd, and MSC.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B3B24] bg-[#FAF8F5] px-3.5 py-2 rounded-xl border border-[#E0D8C8]">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Average 24–48hr Port Customs Gate-in</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {transitRoutes.map((route, idx) => (
                <div 
                  key={route.id || idx} 
                  onClick={() => onSelectRouteForRFQ && onSelectRouteForRFQ(route.port)}
                  className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] space-y-1 hover:border-[#0B3B24] hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                >
                  <div className="text-xs font-bold text-[#1E232A] truncate group-hover:text-[#0B3B24]" title={route.port}>
                    {route.port}
                  </div>
                  <div className="text-sm font-extrabold text-[#0B3B24]">{route.transit}</div>
                  <div className="text-[10px] text-[#8C7A5B] font-medium flex items-center justify-between">
                    <span>{route.frequency}</span>
                    <span className="text-emerald-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

