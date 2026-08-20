import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X, ArrowRight, ShieldCheck, LayoutDashboard, Building2, UserCheck, Cloud } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface NavbarProps {
  onOpenRFQ: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRFQ }) => {
  const { 
    data, 
    isAuthenticated, 
    setCurrentView,
    customerUser,
    isCustomerAuthenticated,
    setIsCustomerPortalOpen,
    customerRFQs,
    firestoreSynced
  } = useCMS();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Products', href: '#products' },
    { name: 'Compliance', href: '#compliance' },
    { name: 'Supply Chain', href: '#supply-chain' },
  ];

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = 'admin';
    setCurrentView('admin');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-nav shadow-sm py-3.5 border-b border-[#0B3B24]/10' 
        : 'bg-[#FAF8F5]/90 backdrop-blur-md py-5 border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <a href="#home" id="brand-logo-link" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#0B3B24] flex items-center justify-center text-white shadow-md group-hover:bg-[#082a1a] transition-colors">
              <Leaf className="w-5 h-5 text-[#E6C687]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#0B3B24] leading-tight font-serif sm:font-sans">
                  {data.siteSettings.companyName}{' '}
                  <span className="text-[#C59B27] font-semibold">{data.siteSettings.companyHighlight}</span>
                </span>
                {firestoreSynced && (
                  <span 
                    title="Live Firebase Synchronized" 
                    className="hidden xl:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Live</span>
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#4A5568]">
                {data.siteSettings.subTitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                id={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium text-[#2D3748] hover:text-[#0B3B24] transition-colors py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B3B24] transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Action Area: Desk Status, Buyer Portal & RFQ Button */}
          <div className="hidden lg:flex items-center gap-3">
            {data.siteSettings.portDeskText && (
              <div className="flex items-center gap-2 text-xs text-[#4A5568] bg-[#EFE9DF] px-3 py-1.5 rounded-full border border-[#DFD7C7]">
                <span className={`w-2 h-2 rounded-full ${data.siteSettings.portDeskOpen ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`}></span>
                <span className="font-medium text-[#1E232A]">{data.siteSettings.portDeskText}</span>
              </div>
            )}

            {/* Buyer Portal Button */}
            <button
              onClick={() => setIsCustomerPortalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                isCustomerAuthenticated
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-[#0B3B24] border border-[#D9D0BE] hover:bg-[#FAF8F5]'
              }`}
            >
              {isCustomerAuthenticated ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="truncate max-w-[120px]">{customerUser?.companyName || 'Buyer Portal'}</span>
                  {customerRFQs.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-700 text-white text-[10px]">
                      {customerRFQs.length}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5 text-[#0B3B24]" />
                  <span>Buyer Portal</span>
                </>
              )}
            </button>

            <button
              id="nav-rfq-button"
              onClick={onOpenRFQ}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B3B24] text-white text-xs font-semibold hover:bg-[#072818] active:scale-[0.98] transition-all shadow-sm hover:shadow-md cursor-pointer group"
            >
              <span>RFQ Portal</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E6C687] group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Admin Dashboard Switch Button */}
            <button
              onClick={handleAdminClick}
              title="Open Admin Dashboard & CMS"
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-[#FAF8F5] border border-[#D9D0BE] text-[11px] font-semibold text-[#0B3B24] hover:bg-[#EFE9DF] transition-all shadow-sm cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#0B3B24]" />
              <span>{isAuthenticated ? 'Admin' : 'CMS'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setIsCustomerPortalOpen(true)}
              className="px-2.5 py-1.5 rounded border border-[#D9D0BE] bg-white text-[#0B3B24] text-xs font-semibold"
            >
              {isCustomerAuthenticated ? 'Portal' : 'Buyer'}
            </button>
            <button
              onClick={handleAdminClick}
              className="px-2 py-1.5 rounded border border-[#D9D0BE] text-[#0B3B24] text-xs font-semibold"
            >
              CMS
            </button>
            <button
              id="mobile-rfq-quick-btn"
              onClick={onOpenRFQ}
              className="px-2.5 py-1.5 rounded bg-[#0B3B24] text-white text-xs font-semibold"
            >
              RFQ
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#0B3B24] hover:bg-[#EFE9DF] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div id="mobile-nav-dropdown" className="md:hidden pt-4 pb-3 border-t border-[#0B3B24]/10 mt-3 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                id={`mobile-nav-${link.name.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-[#1E232A] hover:bg-[#EFE9DF] hover:text-[#0B3B24] transition-colors"
              >
                {link.name}
              </a>
            ))}
            
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCustomerPortalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white border border-[#D9D0BE] text-[#0B3B24] font-semibold text-xs shadow-sm"
              >
                <Building2 className="w-4 h-4 text-[#0B3B24]" />
                <span>{isCustomerAuthenticated ? `Buyer Portal (${customerUser?.companyName})` : 'International Buyer Portal'}</span>
              </button>

              <button
                id="mobile-menu-rfq-submit"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRFQ();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#0B3B24] text-white font-semibold text-sm shadow"
              >
                <span>Request Quotation (RFQ)</span>
                <ArrowRight className="w-4 h-4 text-[#E6C687]" />
              </button>

              <button
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleAdminClick(e);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#FAF8F5] border border-[#D9D0BE] text-[#0B3B24] text-xs font-semibold"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#0B3B24]" />
                <span>Access CMS Export Control Panel</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
