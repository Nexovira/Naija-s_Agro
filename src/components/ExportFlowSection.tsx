import React from 'react';
import { useCMS } from '../context/CMSContext';
import { MapPin, Search, ShieldCheck, Ship, CheckCircle2, Clock, Truck, Award, Box } from 'lucide-react';

export const ExportFlowSection: React.FC = () => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0B3B24]/10 text-[#0B3B24] text-xs font-bold uppercase tracking-wider">
            Export Logistics Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B24] tracking-tight">
            From Nigerian Soil to Your Destination Seaport
          </h2>
          <p className="text-base text-[#4A5568] leading-relaxed">
            Every metric ton follows a strictly documented, quality-governed supply chain minimizing freight delay and ensuring zero foreign matter contamination.
          </p>
        </div>

        {/* Dynamic Pipeline Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div
              key={item.id || item.step}
              className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm relative flex flex-col justify-between"
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

        {/* Ocean Freight Transit Times Quick Reference */}
        {transitRoutes.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D8C8]">
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
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B3B24] bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E0D8C8]">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Average 24–48hr Port Customs Gate-in</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {transitRoutes.map((route, idx) => (
                <div key={route.id || idx} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] space-y-1">
                  <div className="text-xs font-bold text-[#1E232A] truncate" title={route.port}>
                    {route.port}
                  </div>
                  <div className="text-sm font-extrabold text-[#0B3B24]">{route.transit}</div>
                  <div className="text-[10px] text-[#8C7A5B] font-medium">{route.frequency}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
