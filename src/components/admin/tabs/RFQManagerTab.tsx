import React, { useState, useEffect } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { RFQRecord, RFQStatus } from '../../../types';
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Ship, 
  DollarSign, 
  Mail, 
  Phone, 
  Building, 
  Trash2, 
  Edit, 
  Download, 
  X, 
  Send, 
  Printer, 
  Eye,
  Sparkles,
  BellRing
} from 'lucide-react';

export const RFQManagerTab: React.FC = () => {
  const { data, updateRFQ, deleteRFQ, targetRFQId, setTargetRFQId, simulateInboundRFQ } = useCMS();
  const rfqs = data.rfqs || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQRecord | null>(null);
  const [showProformaModal, setShowProformaModal] = useState<RFQRecord | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [assignedAgent, setAssignedAgent] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Auto-select target RFQ if navigated from notification
  useEffect(() => {
    if (targetRFQId) {
      const matched = rfqs.find(r => r.rfqId === targetRFQId || r.id === targetRFQId);
      if (matched) {
        setSelectedRFQ(matched);
        setInternalNote(matched.internalNotes || '');
        setAssignedAgent(matched.assignedAgent || 'Lagos Trade Desk');
      }
    } else if (rfqs.length > 0 && !selectedRFQ) {
      setSelectedRFQ(rfqs[0]);
      setInternalNote(rfqs[0].internalNotes || '');
      setAssignedAgent(rfqs[0].assignedAgent || 'Lagos Trade Desk');
    }
  }, [targetRFQId, rfqs]);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const newRecord = await simulateInboundRFQ();
      setSelectedRFQ(newRecord);
      setInternalNote(newRecord.internalNotes || '');
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const filteredRFQs = rfqs.filter((r) => {
    const matchesSearch = 
      r.rfqId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.data?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.data?.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.data?.destinationPort.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectRFQ = (rfq: RFQRecord) => {
    setSelectedRFQ(rfq);
    setInternalNote(rfq.internalNotes || '');
    setAssignedAgent(rfq.assignedAgent || 'Lagos Trade Desk');
  };

  const handleSaveStatus = async (status: RFQStatus) => {
    if (!selectedRFQ) return;
    await updateRFQ(selectedRFQ.id, {
      status,
      internalNotes: internalNote,
      assignedAgent
    });
    setSelectedRFQ({
      ...selectedRFQ,
      status,
      internalNotes: internalNote,
      assignedAgent
    });
  };

  const handleExportCSV = () => {
    const headers = ['RFQ_ID', 'Date', 'Company', 'Buyer', 'Email', 'Phone', 'Commodities', 'Volume_MT', 'Containers_FCL', 'Incoterm', 'Destination_Port', 'Status', 'Estimated_USD'];
    const rows = rfqs.map(r => [
      r.rfqId,
      r.date,
      `"${r.data?.companyName || ''}"`,
      `"${r.data?.buyerName || ''}"`,
      r.data?.businessEmail || '',
      `"${r.data?.phoneOrWhatsApp || ''}"`,
      `"${(r.productNames || []).join('; ')}"`,
      r.data?.orderVolumeMT || 0,
      r.estimatedContainers || 1,
      r.data?.incoterm || 'CIF',
      `"${r.data?.destinationPort || ''}"`,
      r.status,
      r.estimatedValueUSD || (r.data?.orderVolumeMT || 0) * 2800
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NaijaGlobal_Agro_RFQs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: RFQStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">New Inquiry</span>;
      case 'in-review':
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">In Review</span>;
      case 'quote-sent':
        return <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">Proforma Issued</span>;
      case 'contract-signed':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">Contract Executed</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">Consignment Shipped</span>;
      case 'closed':
        return <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-bold">Closed</span>;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B3B24] tracking-tight">
            Commercial RFQ Pipeline &amp; Proforma Desk
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Process inbound container orders, update negotiation stages, generate formal proforma quotes, and store buyer requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSimulate}
            disabled={isSimulating}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            title="Trigger a live simulated international buyer RFQ to test audio chime, real-time alert badge & toast"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>{isSimulating ? 'Generating Inquiry...' : 'Simulate Inbound RFQ'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#D9D0BE] text-[#0B3B24] text-xs font-bold hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search + Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E0D8C8] shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search RFQ ID, buyer, company, seaport..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'new', 'in-review', 'quote-sent', 'contract-signed', 'shipped', 'closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors capitalize whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#0B3B24] text-white'
                  : 'bg-[#FAF8F5] text-[#4A5568] hover:bg-[#EFE9DF]'
              }`}
            >
              {st === 'all' ? `All (${rfqs.length})` : st.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: RFQ List Left (7 cols) + Selected RFQ Dossier Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RFQ Records Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E0D8C8] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#EFE9DF] bg-[#FAF8F5] flex items-center justify-between">
            <span className="text-xs font-bold text-[#0B3B24] uppercase tracking-wider">
              Inquiries ({filteredRFQs.length})
            </span>
            <span className="text-[11px] text-[#718096]">Click an inquiry to review dossier</span>
          </div>

          <div className="divide-y divide-[#EFE9DF] max-h-[700px] overflow-y-auto">
            {filteredRFQs.length > 0 ? (
              filteredRFQs.map((rfq) => {
                const isSelected = selectedRFQ?.id === rfq.id;
                return (
                  <div
                    key={rfq.id}
                    onClick={() => handleSelectRFQ(rfq)}
                    className={`p-4 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#0B3B24]/5 border-l-4 border-[#0B3B24]'
                        : 'hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#0B3B24]">{rfq.rfqId}</span>
                          <span className="text-[11px] text-[#718096]">• {rfq.date}</span>
                          {rfq.buyerUserId && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                              Registered Buyer
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-[#1E232A] mt-0.5">
                          {rfq.data?.companyName || 'Corporate Buyer'}
                        </h3>
                        <div className="text-xs text-[#64748B]">
                          Rep: <strong className="text-[#1E232A]">{rfq.data?.buyerName}</strong> ({rfq.data?.country || 'International'})
                        </div>
                      </div>
                      <div>
                        {getStatusBadge(rfq.status)}
                      </div>
                    </div>

                    <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E8DFC8] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#718096]">Volume:</span>{' '}
                        <strong className="text-[#0B3B24]">{rfq.data?.orderVolumeMT} MT</strong>{' '}
                        <span className="text-[10px] text-[#8C7A5B]">({rfq.data?.incoterm})</span>
                      </div>
                      <div className="text-right truncate max-w-[170px]" title={rfq.data?.destinationPort}>
                        <span className="text-[#718096]">Port:</span>{' '}
                        <span className="font-semibold text-[#1E232A]">{rfq.data?.destinationPort?.split('(')[0] || rfq.data?.destinationPort}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-[#718096] text-xs">
                No RFQs found matching the selected filter.
              </div>
            )}
          </div>
        </div>

        {/* Selected RFQ Detail Dossier Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {selectedRFQ ? (
            <div className="bg-white rounded-2xl border border-[#E0D8C8] shadow-sm p-6 space-y-6">
              
              {/* Dossier Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#EFE9DF]">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#8C7A5B] uppercase tracking-wider block">
                    Commercial Dossier
                  </span>
                  <h3 className="text-lg font-bold text-[#0B3B24]">{selectedRFQ.rfqId}</h3>
                  <span className="text-xs text-[#718096]">Received: {selectedRFQ.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowProformaModal(selectedRFQ)}
                    className="px-3 py-1.5 rounded-lg bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] flex items-center gap-1.5 shadow-sm"
                    title="Generate formal Proforma Invoice"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#E6C687]" />
                    <span>Proforma</span>
                  </button>
                  <button
                    onClick={() => deleteRFQ(selectedRFQ.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B3B24] mb-2">
                  Update Negotiation Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['new', 'in-review', 'quote-sent', 'contract-signed', 'shipped', 'closed'] as RFQStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleSaveStatus(st)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-colors capitalize ${
                        selectedRFQ.status === st
                          ? 'bg-[#0B3B24] text-white border-[#0B3B24]'
                          : 'bg-[#FAF8F5] text-[#4A5568] border-[#D9D0BE] hover:bg-[#EFE9DF]'
                      }`}
                    >
                      {st.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consignment Specification Details */}
              <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-xl border border-[#E8DFC8] text-xs">
                <div className="font-bold text-[#0B3B24] uppercase tracking-wider text-[11px] border-b border-[#E0D8C8] pb-1.5">
                  Consignment Requirements
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#718096] block text-[11px]">Commodity:</span>
                    <strong className="text-[#1E232A]">{(selectedRFQ.productNames || []).join(', ')}</strong>
                  </div>
                  <div>
                    <span className="text-[#718096] block text-[11px]">Order Volume:</span>
                    <strong className="text-[#0B3B24]">{selectedRFQ.data?.orderVolumeMT} Metric Tons</strong>
                  </div>
                  <div>
                    <span className="text-[#718096] block text-[11px]">Est. Capacity:</span>
                    <strong className="text-[#1E232A]">~{selectedRFQ.estimatedContainers || Math.ceil((selectedRFQ.data?.orderVolumeMT || 14)/14)} x 20ft FCL</strong>
                  </div>
                  <div>
                    <span className="text-[#718096] block text-[11px]">Incoterm:</span>
                    <strong className="text-[#C59B27] font-mono">{selectedRFQ.data?.incoterm}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E0D8C8]">
                  <span className="text-[#718096] block text-[11px]">Destination Seaport:</span>
                  <span className="font-bold text-[#1E232A]">{selectedRFQ.data?.destinationPort}</span>
                </div>

                <div>
                  <span className="text-[#718096] block text-[11px]">Packaging Specification:</span>
                  <span className="font-medium text-[#1E232A]">{selectedRFQ.data?.packagingType}</span>
                </div>

                {selectedRFQ.data?.specialRequirements && (
                  <div className="pt-2 border-t border-[#E0D8C8]">
                    <span className="text-[#718096] block text-[11px]">Buyer Notes / Lab Constraints:</span>
                    <p className="text-[#1E232A] italic bg-white p-2.5 rounded-lg border border-[#E0D8C8] mt-1 text-[11px] leading-relaxed">
                      "{selectedRFQ.data.specialRequirements}"
                    </p>
                  </div>
                )}
              </div>

              {/* Corporate Buyer Contact Card */}
              <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-xl border border-[#E8DFC8] text-xs">
                <div className="font-bold text-[#0B3B24] uppercase tracking-wider text-[11px] border-b border-[#E0D8C8] pb-1.5">
                  Corporate Importer Contact
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#0B3B24] shrink-0" />
                    <span><strong>Company:</strong> {selectedRFQ.data?.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-[#0B3B24] font-bold text-center">👤</span>
                    <span><strong>Representative:</strong> {selectedRFQ.data?.buyerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0B3B24] shrink-0" />
                    <a href={`mailto:${selectedRFQ.data?.businessEmail}`} className="text-[#0B3B24] hover:underline font-semibold">
                      {selectedRFQ.data?.businessEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#0B3B24] shrink-0" />
                    <a href={`https://wa.me/${selectedRFQ.data?.phoneOrWhatsApp?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline font-mono font-bold">
                      {selectedRFQ.data?.phoneOrWhatsApp}
                    </a>
                  </div>
                </div>
              </div>

              {/* Internal Desk Notes & Assignment */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="assigned-agent-input" className="text-xs font-bold uppercase tracking-wider text-[#0B3B24]">
                    Assigned Desk Agent
                  </label>
                  <input
                    id="assigned-agent-input"
                    type="text"
                    value={assignedAgent}
                    onChange={(e) => setAssignedAgent(e.target.value)}
                    placeholder="e.g. Kolawole (Export Operations)"
                    className="px-2.5 py-1 text-xs rounded-lg border border-[#D9D0BE] bg-[#FAF8F5] text-[#1E232A]"
                  />
                </div>

                <div>
                  <label htmlFor="internal-desk-notes" className="block text-xs font-semibold text-[#4A5568] mb-1">
                    Internal Trading Desk Notes (Assay confirmation, freight bookings, payment terms)
                  </label>
                  <textarea
                    id="internal-desk-notes"
                    rows={3}
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="e.g. Buyer requested Phytosanitary inspection copy and SGS assay prior to 30% TT advance."
                    className="w-full px-3 py-2 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveStatus(selectedRFQ.status)}
                  className="w-full py-2.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#E6C687]" />
                  <span>Update Desk Notes &amp; Assignment</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E0D8C8] shadow-sm p-12 text-center text-[#718096] space-y-3">
              <FileText className="w-10 h-10 text-[#CBD5E1] mx-auto" />
              <div className="font-bold text-[#1E232A]">No RFQ Selected</div>
              <p className="text-xs max-w-xs mx-auto">
                Select any inquiry from the left table to inspect full buyer parameters, update status, and issue a Proforma Invoice.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Proforma Quote Preview / Printable Modal */}
      {showProformaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E0D8C8] shadow-2xl overflow-hidden my-6">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between p-4 border-b border-[#EFE9DF] bg-[#FAF8F5]">
              <span className="text-xs font-bold text-[#0B3B24]">Proforma Quotation Generator</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setShowProformaModal(null)}
                  className="p-1.5 rounded-lg text-[#718096] hover:bg-[#EFE9DF]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Proforma Body */}
            <div className="p-8 space-y-6 text-[#1E232A] text-xs" id="printable-proforma-document">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-[#0B3B24] pb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0B3B24]">NAIJAGLOBAL AGROEXPORT LTD</h2>
                  <div className="text-[11px] text-[#718096] mt-0.5">
                    NEPC Licensed Exporter No. NEPC/EXP/2026/0891<br />
                    Apapa Seaport Export Terminal, Lagos, Nigeria<br />
                    trade@naijaglobalagro.com | +234 803 456 7890
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-[#0B3B24]">PROFORMA INVOICE</div>
                  <div className="font-mono font-bold text-xs text-[#8C7A5B]">{showProformaModal.rfqId}</div>
                  <div className="text-[11px] text-[#718096]">Date: {showProformaModal.date}</div>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-4 bg-[#FAF8F5] p-4 rounded-xl border border-[#E0D8C8]">
                <div>
                  <span className="text-[10px] font-bold text-[#718096] uppercase">Consignee / Importer:</span>
                  <div className="font-bold text-sm text-[#0B3B24] mt-0.5">{showProformaModal.data?.companyName}</div>
                  <div className="text-[11px] text-[#4A5568]">Attn: {showProformaModal.data?.buyerName}</div>
                  <div className="text-[11px] text-[#4A5568]">{showProformaModal.data?.businessEmail}</div>
                  <div className="text-[11px] text-[#4A5568]">{showProformaModal.data?.phoneOrWhatsApp}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#718096] uppercase">Shipping Parameters:</span>
                  <div className="text-[11px] mt-0.5"><strong>Incoterm:</strong> {showProformaModal.data?.incoterm} (ICC 2020)</div>
                  <div className="text-[11px]"><strong>Port of Loading:</strong> Apapa Seaport, Lagos (NG APP)</div>
                  <div className="text-[11px]"><strong>Port of Discharge:</strong> {showProformaModal.data?.destinationPort}</div>
                  <div className="text-[11px]"><strong>Estimated Container:</strong> ~{showProformaModal.estimatedContainers} x 20ft FCL</div>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left border border-[#E0D8C8]">
                <thead className="bg-[#FAF8F5] text-[#0B3B24] border-b border-[#E0D8C8]">
                  <tr>
                    <th className="p-2.5 font-bold">Commodity Description</th>
                    <th className="p-2.5 font-bold">Quantity (MT)</th>
                    <th className="p-2.5 font-bold">Packaging</th>
                    <th className="p-2.5 font-bold text-right">Est. Unit Price (USD/MT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE9DF]">
                  <tr>
                    <td className="p-2.5">
                      <div className="font-bold text-[#0B3B24]">{(showProformaModal.productNames || []).join(', ')}</div>
                      <div className="text-[10px] text-[#718096]">Moisture &lt; 9%, Purity &gt; 98%, Grade A Export Quality</div>
                    </td>
                    <td className="p-2.5 font-bold">{showProformaModal.data?.orderVolumeMT} MT</td>
                    <td className="p-2.5">{showProformaModal.data?.packagingType}</td>
                    <td className="p-2.5 text-right font-mono font-bold">$2,800.00 / MT</td>
                  </tr>
                </tbody>
              </table>

              {/* Payment & Inspection Terms */}
              <div className="border-t border-[#EFE9DF] pt-4 space-y-1.5 text-[11px] text-[#5A687A]">
                <div><strong>Standard Payment Terms:</strong> 30% TT deposit upon contract execution, 70% against scanned original Bill of Lading, Phytosanitary, and SGS Assay documents.</div>
                <div><strong>Quality Guarantees:</strong> Certified SGS pre-shipment inspection certificates and NAFDAC export seals provided with original shipping docket.</div>
                <div><strong>Validity:</strong> This commercial proforma quotation remains valid for 14 business days from issue date.</div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
