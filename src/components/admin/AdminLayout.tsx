import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { 
  Leaf, 
  LayoutDashboard, 
  Package, 
  FileText, 
  ShieldCheck, 
  Layers, 
  Ship, 
  Sliders, 
  Phone, 
  Globe, 
  Image as ImageIcon, 
  User, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Bell,
  Search,
  CheckCircle2,
  FolderTree,
  Volume2,
  VolumeX,
  Sparkles,
  Radio
} from 'lucide-react';

import { DashboardOverviewTab } from './tabs/DashboardOverviewTab';
import { HomepageCMSTab } from './tabs/HomepageCMSTab';
import { ProductsCMSTab } from './tabs/ProductsCMSTab';
import { CategoriesCMSTab } from './tabs/CategoriesCMSTab';
import { ComplianceCMSTab } from './tabs/ComplianceCMSTab';
import { SupplyChainCMSTab } from './tabs/SupplyChainCMSTab';
import { RFQManagerTab } from './tabs/RFQManagerTab';
import { PortsShippingCMSTab } from './tabs/PortsShippingCMSTab';
import { RFQSettingsCMSTab } from './tabs/RFQSettingsCMSTab';
import { ContactCMSTab } from './tabs/ContactCMSTab';
import { SiteSettingsCMSTab } from './tabs/SiteSettingsCMSTab';
import { MediaLibraryTab } from './tabs/MediaLibraryTab';
import { AdminAccountTab } from './tabs/AdminAccountTab';
import { NotificationCenter } from './NotificationCenter';
import { NotificationToast } from './NotificationToast';

export const AdminLayout: React.FC = () => {
  const { 
    data, 
    currentUser, 
    activeAdminTab, 
    setActiveAdminTab, 
    logout, 
    setCurrentView,
    unreadNotificationCount,
    activeNotificationToast,
    setActiveNotificationToast,
    notificationPrefs,
    updateNotificationPreferences,
    simulateInboundRFQ
  } = useCMS();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [isSimulatingQuick, setIsSimulatingQuick] = useState(false);
  const pendingRFQs = (data.rfqs || []).filter(r => r.status === 'new' || r.status === 'in-review').length;

  const handleSelectTab = (tab: string) => {
    setActiveAdminTab(tab);
    window.location.hash = `admin/${tab}`;
    setMobileSidebarOpen(false);
  };

  const handleQuickSimulate = async () => {
    setIsSimulatingQuick(true);
    try {
      await simulateInboundRFQ();
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSimulatingQuick(false);
    }
  };

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      group: 'Content CMS',
      items: [
        { id: 'homepage', label: 'Homepage & Hero', icon: Globe, badge: null },
        { id: 'products', label: 'Commodity Catalog', icon: Package, badge: `${data.products?.length || 0}` },
        { id: 'categories', label: 'Categories', icon: FolderTree, badge: null },
        { id: 'compliance', label: 'Compliance & Badges', icon: ShieldCheck, badge: null },
        { id: 'supply-chain', label: 'Supply Chain Pipeline', icon: Layers, badge: null }
      ]
    },
    {
      group: 'Trade & Operations',
      items: [
        { id: 'rfqs', label: 'RFQ Inquiries & Quotes', icon: FileText, badge: pendingRFQs > 0 ? `${pendingRFQs} New` : null, highlight: pendingRFQs > 0 },
        { id: 'ports', label: 'Seaports & Transit', icon: Ship, badge: null },
        { id: 'rfq-settings', label: 'RFQ Form Settings', icon: Sliders, badge: null }
      ]
    },
    {
      group: 'Corporate & Media',
      items: [
        { id: 'contact', label: 'Trade Desks & Offices', icon: Phone, badge: null },
        { id: 'site-settings', label: 'Site Settings & Legal', icon: Globe, badge: null },
        { id: 'media', label: 'Media Library', icon: ImageIcon, badge: null }
      ]
    },
    {
      group: 'Account & Security',
      items: [
        { id: 'account', label: 'Admin Security Profile', icon: User, badge: null }
      ]
    }
  ];

  const renderActiveTab = () => {
    switch (activeAdminTab) {
      case 'dashboard':
        return <DashboardOverviewTab />;
      case 'homepage':
        return <HomepageCMSTab />;
      case 'products':
        return <ProductsCMSTab />;
      case 'categories':
        return <CategoriesCMSTab />;
      case 'compliance':
        return <ComplianceCMSTab />;
      case 'supply-chain':
        return <SupplyChainCMSTab />;
      case 'rfqs':
        return <RFQManagerTab />;
      case 'ports':
        return <PortsShippingCMSTab />;
      case 'rfq-settings':
        return <RFQSettingsCMSTab />;
      case 'contact':
        return <ContactCMSTab />;
      case 'site-settings':
        return <SiteSettingsCMSTab />;
      case 'media':
        return <MediaLibraryTab />;
      case 'account':
        return <AdminAccountTab />;
      default:
        return <DashboardOverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row text-[#1E232A]">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0B3B24] text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#E6C687]">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm">NaijaGlobal CMS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setNotificationCenterOpen(true)}
            className="p-2 rounded-lg bg-white/10 text-[#E6C687] relative cursor-pointer"
            title="Open Notification Center"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center ring-2 ring-[#0B3B24]">
                {unreadNotificationCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg text-white hover:bg-white/10 cursor-pointer"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Left Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0B3B24] text-white flex flex-col justify-between transition-transform duration-300
        md:translate-x-0 md:static md:h-screen md:sticky md:top-0
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E6C687] shadow-inner border border-white/10">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white block leading-tight">
                NaijaGlobal <span className="text-[#E6C687]">Agro</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
                Operations CMS Desk
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] bg-black/25 px-3 py-1.5 rounded-lg border border-white/10">
            <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Production Data</span>
            </span>
            <span className="font-mono text-white/60">v1.2</span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {navGroups.map((grp) => (
            <div key={grp.group} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                {grp.group}
              </span>

              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeAdminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#E6C687] text-[#0B3B24] shadow-md font-bold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#0B3B24]' : 'text-[#E6C687]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-[#0B3B24] text-white'
                          : item.highlight
                          ? 'bg-amber-400 text-black font-extrabold'
                          : 'bg-white/20 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: User profile & View Public & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
          
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#E6C687] text-[#0B3B24] font-bold text-xs flex items-center justify-center">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 truncate">
              <div className="text-xs font-bold text-white truncate">{currentUser?.name || 'Administrator'}</div>
              <div className="text-[10px] text-white/60 truncate font-mono">{currentUser?.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                window.location.hash = '';
                setCurrentView('public');
              }}
              className="py-2 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#E6C687]" />
              <span>Public Site</span>
            </button>

            <button
              onClick={logout}
              className="py-2 px-2.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-200 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-300" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

      </aside>

      {/* Main Admin Content Stage */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Top Navbar Desktop */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-[#E0D8C8] px-8 py-3.5 sticky top-0 z-30 shadow-xs">
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#718096]">Admin CMS</span>
            <span className="text-[#D9D0BE]">/</span>
            <span className="text-xs font-bold text-[#0B3B24] capitalize">
              {activeAdminTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Quick Test Simulator Button */}
            <button
              type="button"
              onClick={handleQuickSimulate}
              disabled={isSimulatingQuick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              title="Test real-time alert engine with a realistic simulated RFQ inquiry"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              <span>{isSimulatingQuick ? 'Generating...' : 'Simulate RFQ'}</span>
            </button>

            {/* Quick Sound Mute / Unmute Toggle */}
            <button
              type="button"
              onClick={() => updateNotificationPreferences({ soundEnabled: !notificationPrefs.soundEnabled })}
              className={`p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                notificationPrefs.soundEnabled
                  ? 'bg-[#FAF8F5] border-[#D9D0BE] text-[#0B3B24] hover:bg-[#EFE9DF]'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
              title={notificationPrefs.soundEnabled ? 'Chime sound is ACTIVE' : 'Chime sound is MUTED'}
            >
              {notificationPrefs.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-700" />
              ) : (
                <VolumeX className="w-4 h-4 text-amber-600" />
              )}
            </button>

            {/* Notification Center Bell Trigger */}
            <button
              type="button"
              onClick={() => setNotificationCenterOpen(true)}
              className="relative p-2 rounded-xl bg-[#0B3B24] text-white hover:bg-[#072818] transition-all cursor-pointer shadow-sm active:scale-95"
              title="Open Trade Alerts & Notifications"
            >
              <Bell className="w-4 h-4 text-[#E6C687]" />
              {unreadNotificationCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white font-black text-[9px] flex items-center justify-center ring-2 ring-white">
                    {unreadNotificationCount}
                  </span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping opacity-75 pointer-events-none" />
                </>
              )}
            </button>

            {/* Quick Public Site Button */}
            <button
              onClick={() => {
                window.location.hash = '';
                setCurrentView('public');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#D9D0BE] text-xs font-bold text-[#0B3B24] hover:bg-[#EFE9DF] transition-colors cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>

            {/* User Profile Pill */}
            <div 
              onClick={() => handleSelectTab('account')}
              className="flex items-center gap-2.5 pl-3 border-l border-[#EFE9DF] cursor-pointer hover:opacity-80"
            >
              <div className="w-8 h-8 rounded-full bg-[#0B3B24] text-[#E6C687] font-bold text-xs flex items-center justify-center">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-xs font-bold text-[#1E232A] block leading-tight">{currentUser?.name}</span>
                <span className="text-[10px] text-[#718096]">Super Admin</span>
              </div>
            </div>

          </div>

        </header>

        {/* Tab View Container */}
        <div className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActiveTab()}
        </div>

      </main>

      {/* Slide-over Notification Center Drawer */}
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />

      {/* Interactive Floating Live Toast Alert */}
      <NotificationToast
        notification={activeNotificationToast}
        onClose={() => setActiveNotificationToast(null)}
      />

    </div>
  );
};
