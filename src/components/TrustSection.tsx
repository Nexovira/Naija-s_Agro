import React from 'react';
import { useCMS } from '../context/CMSContext';
import { ShieldCheck, Award, CheckCircle2, FileCheck, Shield, FileText, CheckCircle } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const { data } = useCMS();
  const certifications = data.certifications || [];
  const exportDocs = data.exportDocs || [];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-8 h-8 text-[#0B3B24]" />;
      case 'Award':
        return <Award className="w-8 h-8 text-[#C59B27]" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-8 h-8 text-[#0B3B24]" />;
      case 'FileCheck':
        return <FileCheck className="w-8 h-8 text-[#0B3B24]" />;
      default:
        return <Shield className="w-8 h-8 text-[#0B3B24]" />;
    }
  };

  return (
    <section id="compliance" className="py-20 md:py-28 bg-[#FAF8F5] border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B3B24]/10 text-[#0B3B24] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#0B3B24]" />
            <span>International Compliance &amp; Certifications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B24] tracking-tight">
            Institutional Trust &amp; Export Verification
          </h2>
          <p className="text-base text-[#4A5568] leading-relaxed">
            All NaijaGlobal Agro food shipments undergo strict statutory Nigerian export protocols, FDA foreign facility audits, and SGS pre-shipment quality verification.
          </p>
        </div>

        {/* 4 Required Certification Badges Grid: NAFDAC, NEPC, FDA, and SGS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              id={`trust-badge-${cert.id}`}
              className="bg-white rounded-2xl p-6 border border-[#E0D8C8] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0B3B24] group-hover:bg-[#C59B27] transition-colors" />

              <div>
                {/* Badge Header with Code & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIcon(cert.iconName)}
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#0B3B24]/5 text-[#0B3B24] font-mono text-xs font-extrabold border border-[#0B3B24]/10">
                    {cert.code}
                  </span>
                </div>

                {/* Badge Name & Issuer */}
                <h3 className="text-lg font-bold text-[#0B3B24] group-hover:text-[#072818] transition-colors">
                  {cert.name}
                </h3>
                <div className="text-[11px] font-medium text-[#718096] mb-3">
                  {cert.issuer}
                </div>

                {/* Description */}
                <p className="text-xs text-[#4A5568] leading-relaxed mb-4">
                  {cert.description}
                </p>
              </div>

              {/* Badge Footer with Verified Number */}
              <div className="pt-4 border-t border-[#EFE9DF] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#718096] font-medium">Credential:</span>
                  <span className="font-mono font-bold text-[#0B3B24] text-[10px] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E0D8C8]">
                    {cert.badgeNumber?.split('#')[1] || cert.badgeNumber?.split('No.')[1] || cert.badgeNumber || 'VERIFIED'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{cert.validity}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Accompanying Export Documentation Framework */}
        {exportDocs.length > 0 && (
          <div className="mt-16 bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D8C8] shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#EFE9DF] gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B3B24] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <span>Standard Shipping Documentation Docket Included With Every Consignment</span>
                </h3>
                <p className="text-xs text-[#718096] mt-1">
                  Issued in full conformity with ICC Incoterms 2020 and Destination Port customs clearance guidelines.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0B3B24] bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E0D8C8] shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Full Docket Expedited Digitally &amp; Courier via DHL</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {exportDocs.map((doc, idx) => (
                <div key={doc.id || idx} className="space-y-1.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D4]">
                  <div className="text-xs font-bold text-[#1E232A] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#0B3B24] text-white text-[10px] flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span>{doc.name}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#8C7A5B]">{doc.issuer}</div>
                  <div className="text-[11px] text-[#4A5568] leading-normal">{doc.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
