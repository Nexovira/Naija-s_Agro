import React from 'react';
import { Leaf, Mail, MapPin, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export const Footer: React.FC = () => {
  const { data, isAuthenticated, setCurrentView } = useCMS();
  const { siteSettings, contactSettings } = data;

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = 'admin';
    setCurrentView('admin');
  };

  return (
    <footer className="bg-[#0B3B24] text-white border-t border-[#082a1a] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white border border-white/20">
                <Leaf className="w-5 h-5 text-[#E6C687]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                {siteSettings.companyName}{' '}
                <span className="text-[#E6C687]">{siteSettings.companyHighlight}</span>
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed">
              Nigeria’s premier institutional exporter of lab-certified agricultural commodities. Sourcing, processing, and delivering split ginger, egusi melon seeds, and yam flour under international NAFDAC, FDA, and SGS standards.
            </p>

            <div className="pt-2 text-xs text-white/60 space-y-1">
              <div>NEPC Exporter License: <strong className="text-white">{siteSettings.nepcLicense}</strong></div>
              <div>NAFDAC Regulated Facility: <strong className="text-white">{siteSettings.nafdacLicense}</strong></div>
              <div>US FDA Facility Registration: <strong className="text-white">{siteSettings.fdaLicense}</strong></div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6C687]">Commodity Lines</h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <a href="#products" className="hover:text-white transition-colors">Dried Split Ginger</a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors">De-shelled Egusi Seeds</a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors">Organic Yam Flour (Elubo)</a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors">Dried Hibiscus Calyces</a>
              </li>
              <li>
                <a href="#rfq" className="hover:text-white transition-colors">Custom Sourced Commodities</a>
              </li>
            </ul>
          </div>

          {/* Compliance & Trade */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6C687]">Trade &amp; Compliance</h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <a href="#compliance" className="hover:text-white transition-colors">NAFDAC Food Safety</a>
              </li>
              <li>
                <a href="#compliance" className="hover:text-white transition-colors">NEPC Non-Oil Incentives</a>
              </li>
              <li>
                <a href="#compliance" className="hover:text-white transition-colors">US FDA FSVP Validation</a>
              </li>
              <li>
                <a href="#compliance" className="hover:text-white transition-colors">SGS Quality Assays</a>
              </li>
              <li>
                <a href="#supply-chain" className="hover:text-white transition-colors">Incoterms 2020 (FOB / CIF)</a>
              </li>
            </ul>
          </div>

          {/* Corporate Offices */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6C687]">Trade Desks</h4>
            <div className="space-y-3 text-xs text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E6C687] shrink-0 mt-0.5" />
                <span>
                  <strong>HQ &amp; Export Desk:</strong><br />
                  {contactSettings.hqAddress}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E6C687] shrink-0 mt-0.5" />
                <span>
                  <strong>Northern Hub:</strong><br />
                  {contactSettings.northernHubAddress}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E6C687] shrink-0" />
                <span>{contactSettings.tradeEmail}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <div>
            &copy; {new Date().getFullYear()} {siteSettings.copyrightText} {siteSettings.rcNumber ? `(${siteSettings.rcNumber})` : ''}
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy &amp; Data Security</span>
            <span className="hover:text-white cursor-pointer">Export Contract Terms</span>
            
            {/* Admin Dashboard Portal Link */}
            <button
              onClick={handleAdminClick}
              className="inline-flex items-center gap-1 text-[#E6C687] hover:underline font-semibold cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
