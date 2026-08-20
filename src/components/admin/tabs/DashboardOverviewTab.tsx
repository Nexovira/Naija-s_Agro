import React from 'react';
import { useCMS } from '../../../context/CMSContext';
import { 
  Package, 
  FileText, 
  DollarSign, 
  Ship, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  Plus
} from 'lucide-react';

export const DashboardOverviewTab: React.FC = () => {
  const { data, setActiveAdminTab, setCurrentView } = useCMS();
  const { products, rfqs, transitRoutes, certifications } = data;

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.active !== false).length;
  const totalRFQs = (rfqs || []).length;
  const pendingRFQs = (rfqs || []).filter(r => r.status === 'new' || r.status === 'in-review').length;
  
  const totalVolumeMT = (rfqs || []).reduce((acc, curr) => acc + (curr.data?.orderVolumeMT || 0), 0);
  const totalPipelineUSD = (rfqs || []).reduce((acc, curr) => acc + (curr.estimatedValueUSD || (curr.data?.orderVolumeMT || 0) * 2800), 0);

  const recentRFQs = (rfqs || []).slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">New Lead</span>;
      case 'in-review':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">In Review</span>;
      case 'quote-sent':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">Proforma Sent</span>;
      case 'contract-signed':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">Contracted</span>;
      case 'shipped':
        return <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">On Water (Shipped)</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-[11px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-[#0B3B24] to-[#124b30] text-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E6C687] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>2026/2027 Export Season Operational Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Export Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
            Monitor real-time commercial inquiries, manage agricultural commodity specifications, update international compliance dockets, and sync website content instantly.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              window.location.hash = '';
              setCurrentView('public');
            }}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-[#E6C687]" />
            <span>Live Website</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('rfqs')}
            className="px-4 py-2.5 rounded-xl bg-[#E6C687] hover:bg-[#d8b570] text-[#0B3B24] text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>View Inquiries ({pendingRFQs})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Pending RFQs */}
        <div className="bg-white p-5 rounded-2xl border border-[#E0D8C8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block">Inbound RFQs</span>
            <div className="text-2xl sm:text-3xl font-black text-[#0B3B24] mt-1">{totalRFQs}</div>
            <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingRFQs} Action Required</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#0B3B24]/10 text-[#0B3B24] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Estimated Inquired Volume */}
        <div className="bg-white p-5 rounded-2xl border border-[#E0D8C8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block">Inquired Volume</span>
            <div className="text-2xl sm:text-3xl font-black text-[#0B3B24] mt-1">{totalVolumeMT} <span className="text-base font-semibold">MT</span></div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <Ship className="w-3.5 h-3.5" />
              <span>~{Math.ceil(totalVolumeMT / 14)} x 20ft FCLs</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Active Commodities */}
        <div className="bg-white p-5 rounded-2xl border border-[#E0D8C8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block">Active Commodities</span>
            <div className="text-2xl sm:text-3xl font-black text-[#0B3B24] mt-1">{activeProducts} / {totalProducts}</div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Lab Certified Grade A</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0B3B24] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Pipeline Valuation */}
        <div className="bg-white p-5 rounded-2xl border border-[#E0D8C8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block">Pipeline Estimation</span>
            <div className="text-2xl sm:text-3xl font-black text-[#0B3B24] mt-1">${(totalPipelineUSD / 1000).toFixed(0)}k</div>
            <span className="text-[11px] text-[#718096] font-medium flex items-center gap-1 mt-1">
              <span>Incoterms: FOB &amp; CIF</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 2-Column Section: Recent Inquiries + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Recent Commercial RFQs */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#E0D8C8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE9DF]">
            <div>
              <h2 className="text-lg font-bold text-[#0B3B24]">Recent Inbound RFQ Inquiries</h2>
              <p className="text-xs text-[#718096]">Latest requests received via public trading portal</p>
            </div>
            <button
              onClick={() => setActiveAdminTab('rfqs')}
              className="text-xs font-bold text-[#0B3B24] hover:underline flex items-center gap-1"
            >
              <span>View All ({totalRFQs})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] text-[#718096] border-b border-[#E0D8C8]">
                  <th className="py-3 px-3 font-bold uppercase tracking-wider">RFQ ID &amp; Date</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider">Buyer / Company</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider">Commodity &amp; Vol</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider">Destination Port</th>
                  <th className="py-3 px-3 font-bold uppercase tracking-wider">Status</th>
                  <th className="py-3 px-3 text-right font-bold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE9DF]">
                {recentRFQs.length > 0 ? (
                  recentRFQs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-[#0B3B24] block">{rfq.rfqId}</span>
                        <span className="text-[11px] text-[#718096]">{rfq.date}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-[#1E232A] block">{rfq.data?.companyName || 'Corporate Buyer'}</span>
                        <span className="text-[11px] text-[#718096]">{rfq.data?.buyerName}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-[#0B3B24] block truncate max-w-[140px]">
                          {(rfq.productNames || []).join(', ') || 'Commodity'}
                        </span>
                        <span className="text-[11px] font-bold text-[#1E232A]">
                          {rfq.data?.orderVolumeMT} MT ({rfq.data?.incoterm})
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="truncate max-w-[130px] block text-[#4A5568]" title={rfq.data?.destinationPort}>
                          {rfq.data?.destinationPort}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        {getStatusBadge(rfq.status)}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => setActiveAdminTab('rfqs')}
                          className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D9D0BE] text-[#0B3B24] font-bold text-[11px] hover:bg-[#0B3B24] hover:text-white transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#718096]">
                      No RFQ inquiries recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Quick Actions & Live Content Status */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl p-6 border border-[#E0D8C8] shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#0B3B24]">Quick Actions &amp; Publishing</h2>
            <div className="space-y-2.5">
              <button
                onClick={() => setActiveAdminTab('products')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0D8C8] text-xs font-semibold text-[#0B3B24] hover:bg-[#EFE9DF] transition-colors flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <span>Add New Export Commodity</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#718096]" />
              </button>

              <button
                onClick={() => setActiveAdminTab('homepage')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0D8C8] text-xs font-semibold text-[#0B3B24] hover:bg-[#EFE9DF] transition-colors flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Edit Homepage Headline &amp; Badges</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#718096]" />
              </button>

              <button
                onClick={() => setActiveAdminTab('compliance')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0D8C8] text-xs font-semibold text-[#0B3B24] hover:bg-[#EFE9DF] transition-colors flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Update NAFDAC / FDA Credentials</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#718096]" />
              </button>

              <button
                onClick={() => setActiveAdminTab('ports')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#FAF8F5] border border-[#E0D8C8] text-xs font-semibold text-[#0B3B24] hover:bg-[#EFE9DF] transition-colors flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Ship className="w-4 h-4 text-emerald-700" />
                  <span>Manage Ocean Shipping Transit Times</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#718096]" />
              </button>
            </div>
          </div>

          {/* Institutional Compliance Health Status */}
          <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E0D8C8] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B3B24] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Compliance Credentials Active</span>
            </h3>

            <div className="space-y-2 pt-1">
              {certifications.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-[#EAE3D4] text-xs">
                  <span className="font-bold text-[#1E232A]">{c.name}</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">{c.validity}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
