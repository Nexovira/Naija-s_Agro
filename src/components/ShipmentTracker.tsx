import React, { useState } from 'react';
import { 
  Warehouse, 
  Truck, 
  FileCheck2, 
  Ship, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Anchor, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Search, 
  ArrowRight, 
  ChevronRight, 
  Download, 
  Box, 
  Sparkles, 
  RefreshCw, 
  Check,
  Container,
  Navigation,
  Globe2,
  Building2,
  ExternalLink
} from 'lucide-react';
import { RFQRecord } from '../types';

export type ExportStageId = 'warehouse' | 'port_transit' | 'customs_clearance' | 'shipping';

export interface ExportMilestone {
  id: string;
  title: string;
  description: string;
  authority: string;
  completedAt?: string;
  status: 'completed' | 'in_progress' | 'pending';
  documentName?: string;
  documentRef?: string;
}

export interface ExportStageData {
  id: ExportStageId;
  name: string;
  shortDesc: string;
  location: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'upcoming';
  progressPercentage: number;
  estimatedDate: string;
  completedDate?: string;
  milestones: ExportMilestone[];
  keyParameters?: { label: string; value: string }[];
}

export interface TrackedConsignment {
  id: string;
  trackingNumber: string;
  rfqId: string;
  commodity: string;
  orderVolumeMT: number;
  containersCount: number;
  containerNumbers: string[];
  sealNumber: string;
  carrier: string;
  vesselName: string;
  voyageNumber: string;
  originTerminal: string;
  destinationPort: string;
  incoterm: string;
  currentStageId: ExportStageId;
  departureDate: string;
  estimatedArrivalDate: string;
  stages: ExportStageData[];
  buyerCompany: string;
  buyerEmail: string;
}

interface ShipmentTrackerProps {
  customerRFQs?: RFQRecord[];
  initialSelectedRfqId?: string | null;
  onOpenNewQuote?: () => void;
}

export const ShipmentTracker: React.FC<ShipmentTrackerProps> = ({
  customerRFQs = [],
  initialSelectedRfqId,
  onOpenNewQuote
}) => {
  // Built-in verified sample export consignment profiles reflecting real Nigerian agro-export workflows
  const defaultConsignments: TrackedConsignment[] = [
    {
      id: 'consignment-01',
      trackingNumber: 'MSKU-NGA-2026-9812',
      rfqId: customerRFQs[0]?.rfqId || 'RFQ-2026-8812',
      commodity: customerRFQs[0]?.productNames?.[0] || 'Premium Dried Split Ginger (Grade A)',
      orderVolumeMT: customerRFQs[0]?.data?.orderVolumeMT || 28,
      containersCount: customerRFQs[0]?.estimatedContainers || 2,
      containerNumbers: ['MSKU-984102-4', 'MSKU-984103-0'],
      sealNumber: 'NG-CUSTOMS-SEAL-88910',
      carrier: 'Maersk Line A/S',
      vesselName: 'Maersk Camden',
      voyageNumber: 'Voyage 2604N',
      originTerminal: 'APMT Container Terminal, Apapa Wharf, Lagos, Nigeria',
      destinationPort: customerRFQs[0]?.data?.destinationPort || 'Port of Rotterdam (Netherlands) - NL RTM',
      incoterm: customerRFQs[0]?.data?.incoterm || 'CIF',
      currentStageId: 'shipping',
      departureDate: '2026-08-14',
      estimatedArrivalDate: '2026-09-02',
      buyerCompany: customerRFQs[0]?.data?.companyName || 'Al-Madina Spice & Foodstuff LLC',
      buyerEmail: customerRFQs[0]?.data?.businessEmail || 'procurement@almadinaspices.ae',
      stages: [
        {
          id: 'warehouse',
          name: 'Warehouse Processing',
          shortDesc: 'Cleaning, grading, laboratory moisture testing & phytosanitary bagging',
          location: 'Kano & Kaduna Central Aggregation Hubs',
          icon: Warehouse,
          status: 'completed',
          progressPercentage: 100,
          estimatedDate: '2026-08-05',
          completedDate: '2026-08-08',
          keyParameters: [
            { label: 'Moisture Reading', value: '7.4% (Assayed < 8.0%)' },
            { label: 'Purity Level', value: '98.8% Min' },
            { label: 'Packaging', value: '50kg PP Bags + Inner Poly Liner' },
            { label: 'Quarantine Fumigation', value: 'Aluminum Phosphide 3g/m³' }
          ],
          milestones: [
            {
              id: 'm-wh-1',
              title: 'Primary Farmgate Aggregation & Purity Grading',
              description: 'Sortation and destoning across optical gravity separators ensuring zero extraneous stones or stalks.',
              authority: 'NaijaGlobal Quality Lab',
              completedAt: '2026-08-05 11:30',
              status: 'completed'
            },
            {
              id: 'm-wh-2',
              title: 'Moisture & Aflatoxin Assay Testing',
              description: 'Calibrated NIR moisture assay verifying 7.4% moisture; HPLC testing confirmed total Aflatoxin < 3.2 ppb (EU standard compliance).',
              authority: 'SGS Nigeria Certified Lab',
              completedAt: '2026-08-06 14:15',
              status: 'completed',
              documentName: 'Certificate of Analysis (COA)',
              documentRef: 'COA-SGS-NGA-2026-441'
            },
            {
              id: 'm-wh-3',
              title: 'Export Packaging & NAQS Phytosanitary Inspection',
              description: 'Bagged into 560 x 50kg export polypropylene bags with moisture barrier liners; sealed and tagged with traceability QR codes.',
              authority: 'Nigeria Agricultural Quarantine Service (NAQS)',
              completedAt: '2026-08-08 09:00',
              status: 'completed',
              documentName: 'NAQS Phytosanitary Certificate',
              documentRef: 'NAQS-PHYTO-EXP-9014'
            }
          ]
        },
        {
          id: 'port_transit',
          name: 'Port Transit',
          shortDesc: 'Bonded inland GPS haulage, terminal gate-in & SOLAS VGM container stuffing',
          location: 'Apapa Port Corridor & APM Terminals Lagos',
          icon: Truck,
          status: 'completed',
          progressPercentage: 100,
          estimatedDate: '2026-08-09',
          completedDate: '2026-08-11',
          keyParameters: [
            { label: 'Haulage Corridor', value: 'Northern Bonded Highway -> Lagos' },
            { label: 'Ingate Terminal', value: 'APMT Apapa Wharf Gate 2' },
            { label: 'VGM Gross Weight', value: '28,420 KG per Container' },
            { label: 'Security Seal', value: 'High-Security Bolt Seal Applied' }
          ],
          milestones: [
            {
              id: 'm-pt-1',
              title: 'Bonded Trucking Dispatch with GPS Geofencing',
              description: 'Consignment loaded onto 2 x 40ft skeletal trailers equipped with satellite cargo tracking and tamper-proof electronic seals.',
              authority: 'NaijaGlobal Fleet Logistics',
              completedAt: '2026-08-09 06:45',
              status: 'completed'
            },
            {
              id: 'm-pt-2',
              title: 'Terminal Gate-In & APMT Container Reception',
              description: 'Trucks arrived at Apapa Wharf; containers gated into APMT export stack yard under pre-advised EIR (Equipment Interchange Receipt).',
              authority: 'APM Terminals Apapa',
              completedAt: '2026-08-10 16:20',
              status: 'completed',
              documentName: 'Terminal EIR Tally Slip',
              documentRef: 'APMT-EIR-2026-7781'
            },
            {
              id: 'm-pt-3',
              title: 'SOLAS Verified Gross Mass (VGM) Weighbridge Certification',
              description: 'Calibrated weighbridge certified gross container weight at 28.42 Metric Tons conforming to IMO SOLAS Chapter VI guidelines.',
              authority: 'Nigerian Shippers Council / APMT',
              completedAt: '2026-08-11 10:10',
              status: 'completed',
              documentName: 'SOLAS VGM Declaration Slip',
              documentRef: 'VGM-APMT-984102'
            }
          ]
        },
        {
          id: 'customs_clearance',
          name: 'Customs Clearance',
          shortDesc: 'Central Bank NXP Form validation, Customs joint appraisal & CCI issuance',
          location: 'Nigeria Customs Service Export Command, Apapa',
          icon: FileCheck2,
          status: 'completed',
          progressPercentage: 100,
          estimatedDate: '2026-08-12',
          completedDate: '2026-08-13',
          keyParameters: [
            { label: 'Central Bank NXP Form', value: 'Approved & Funded' },
            { label: 'Customs Command', value: 'Apapa Area 1 Export Seat' },
            { label: 'Inspection Agency', value: 'Cobalt / Federal Pre-Shipment' },
            { label: 'Export Levy Status', value: 'Fully Cleared (Duty-Free Agro)' }
          ],
          milestones: [
            {
              id: 'm-cc-1',
              title: 'Central Bank of Nigeria (CBN) Electronic NXP Form Validation',
              description: 'Approved Form NXP registered via the Nigerian Trade Portal (Single Window) with authorized dealer commercial bank.',
              authority: 'Central Bank of Nigeria / Trade Hub',
              completedAt: '2026-08-12 11:00',
              status: 'completed',
              documentName: 'Electronic NXP Document',
              documentRef: 'CBN-NXP-2026-904128'
            },
            {
              id: 'm-cc-2',
              title: 'Nigeria Customs Service (NCS) Physical Joint Examination',
              description: 'Multi-agency joint examination conducted alongside NDLEA, NAFDAC & Quarantine; no discrepancies found.',
              authority: 'Nigeria Customs Service (NCS)',
              completedAt: '2026-08-12 15:45',
              status: 'completed',
              documentName: 'Customs Export Release Order',
              documentRef: 'NCS-ERO-AP-2026-612'
            },
            {
              id: 'm-cc-3',
              title: 'Clean Certificate of Inspection (CCI) Final Release',
              description: 'Federal Government Appointed Pre-Shipment Inspection Agent issued formal Clean Certificate confirming quality, quantity, and pricing integrity.',
              authority: 'Federal Inspection Agency (PIA)',
              completedAt: '2026-08-13 17:30',
              status: 'completed',
              documentName: 'Clean Certificate of Inspection (CCI)',
              documentRef: 'CCI-FGN-2026-004921'
            }
          ]
        },
        {
          id: 'shipping',
          name: 'Shipping (Ocean Transit)',
          shortDesc: 'Vessel laden on board, Original Bill of Lading & live oceanic passage',
          location: 'Atlantic Ocean Corridor -> Destination Seaport',
          icon: Ship,
          status: 'current',
          progressPercentage: 65,
          estimatedDate: '2026-09-02',
          completedDate: undefined,
          keyParameters: [
            { label: 'Ocean Carrier', value: 'Maersk Line' },
            { label: 'Vessel / Voyage', value: 'Maersk Camden / 2604N' },
            { label: 'Master B/L Ref', value: 'MSKU202688190' },
            { label: 'Current Position', value: 'Off Coast of Dakar / Transiting North' }
          ],
          milestones: [
            {
              id: 'm-sh-1',
              title: 'Container Loaded On Board Ocean Vessel',
              description: 'Containers loaded onto cell position 14-02-06 aboard container vessel Maersk Camden at APMT Berth 1.',
              authority: 'Maersk Vessel Operations',
              completedAt: '2026-08-14 04:30',
              status: 'completed',
              documentName: 'Mate\'s Receipt / Loading Tally',
              documentRef: 'MR-MSK-2604-01'
            },
            {
              id: 'm-sh-2',
              title: 'Original Ocean Master Bill of Lading (B/L) Dispatched',
              description: 'Clean on Board Ocean Bill of Lading released to buyer\'s nominated consignee bank under LC / Trade terms.',
              authority: 'Maersk Line Shipping Agency',
              completedAt: '2026-08-15 12:00',
              status: 'completed',
              documentName: 'Master Bill of Lading (B/L)',
              documentRef: 'MSKU202688190'
            },
            {
              id: 'm-sh-3',
              title: 'Open Water Oceanic Voyage to Destination Seaport',
              description: 'Vessel is maintaining scheduled speed of 18.4 knots. Weather conditions optimal across North Atlantic route.',
              authority: 'Maritime AIS Telemetry',
              status: 'in_progress'
            },
            {
              id: 'm-sh-4',
              title: 'Destination Port Discharge & Consignee Handover',
              description: 'Scheduled berth arrival at Port of Rotterdam. Cargo release upon presentation of original documents.',
              authority: 'Destination Terminal Authority',
              status: 'pending'
            }
          ]
        }
      ]
    },
    {
      id: 'consignment-02',
      trackingNumber: 'CMA-NGA-2026-4402',
      rfqId: customerRFQs[1]?.rfqId || 'RFQ-2026-7731',
      commodity: 'Raw Cashew Nuts (Outturn 48+ LBS, Nut Count 185)',
      orderVolumeMT: 50,
      containersCount: 3,
      containerNumbers: ['CMAU-410928-1', 'CMAU-410929-7', 'CMAU-410930-5'],
      sealNumber: 'NG-CUSTOMS-SEAL-77192',
      carrier: 'CMA CGM Lines',
      vesselName: 'CMA CGM Palais',
      voyageNumber: 'Voyage 0NX14W',
      originTerminal: 'Tin Can Island Container Terminal, Lagos',
      destinationPort: 'Port of Jebel Ali, Dubai (UAE) - AE JEA',
      incoterm: 'CIF',
      currentStageId: 'customs_clearance',
      departureDate: '2026-08-24',
      estimatedArrivalDate: '2026-09-15',
      buyerCompany: 'Gulf Agri-Commodities DMCC',
      buyerEmail: 'trade@gulfagri.ae',
      stages: [
        {
          id: 'warehouse',
          name: 'Warehouse Processing',
          shortDesc: 'Outturn sampling, moisture stabilization (< 9%) & jute bag packing',
          location: 'Ogbomosho & Ilorin Agro Warehouses',
          icon: Warehouse,
          status: 'completed',
          progressPercentage: 100,
          estimatedDate: '2026-08-12',
          completedDate: '2026-08-15',
          keyParameters: [
            { label: 'Outturn Quality (KOR)', value: '48.5 LBS / 80kg' },
            { label: 'Nut Count', value: '182 nuts/kg' },
            { label: 'Moisture', value: '7.9%' },
            { label: 'Packaging', value: '80kg New Export Jute Bags' }
          ],
          milestones: [
            {
              id: 'm2-wh-1',
              title: 'Quality Sampling & Cutting Test',
              description: 'Independent inspection confirming KOR 48.5 LBS with zero insect infestation.',
              authority: 'Bureau Veritas Nigeria',
              completedAt: '2026-08-14 16:00',
              status: 'completed'
            }
          ]
        },
        {
          id: 'port_transit',
          name: 'Port Transit',
          shortDesc: 'Tin Can Island Terminal Ingate & stuffing verification',
          location: 'Tin Can Island Port Corridor, Lagos',
          icon: Truck,
          status: 'completed',
          progressPercentage: 100,
          estimatedDate: '2026-08-18',
          completedDate: '2026-08-19',
          keyParameters: [
            { label: 'Ingate Terminal', value: 'TICT Tin Can Island' },
            { label: 'Container Size', value: '3 x 20ft Heavy FCL' }
          ],
          milestones: [
            {
              id: 'm2-pt-1',
              title: 'Terminal Gate-in & Weighbridge Gross Verification',
              description: 'All 3 containers successfully passed through TICT main gate and stacked in export yard.',
              authority: 'Tin Can Island Container Terminal',
              completedAt: '2026-08-19 14:30',
              status: 'completed'
            }
          ]
        },
        {
          id: 'customs_clearance',
          name: 'Customs Clearance',
          shortDesc: 'Final Clean Certificate of Inspection and Customs Release validation',
          location: 'Customs Area Command, Tin Can Island',
          icon: FileCheck2,
          status: 'current',
          progressPercentage: 80,
          estimatedDate: '2026-08-22',
          keyParameters: [
            { label: 'Status', value: 'Awaiting Final Inspection Seal' },
            { label: 'Customs Seat', value: 'Export Processing Seat' }
          ],
          milestones: [
            {
              id: 'm2-cc-1',
              title: 'Single Window Form NXP Commercial Bank Approval',
              description: 'Funded and accepted on CBN Trade Portal.',
              authority: 'Central Bank of Nigeria',
              completedAt: '2026-08-20 10:00',
              status: 'completed'
            },
            {
              id: 'm2-cc-2',
              title: 'Final Customs Appraisal & Gate Release',
              description: 'Customs appraisal in final review for loading authorization.',
              authority: 'Nigeria Customs Service',
              status: 'in_progress'
            }
          ]
        },
        {
          id: 'shipping',
          name: 'Shipping (Ocean Transit)',
          shortDesc: 'Vessel loading scheduled aboard CMA CGM Palais',
          location: 'Gulf Transit Line',
          icon: Ship,
          status: 'upcoming',
          progressPercentage: 0,
          estimatedDate: '2026-09-15',
          milestones: [
            {
              id: 'm2-sh-1',
              title: 'Vessel Berth & Container Crane Loading',
              description: 'Estimated berthing date: 2026-08-24 08:00',
              authority: 'CMA CGM Terminal Operations',
              status: 'pending'
            }
          ]
        }
      ]
    }
  ];

  // Current active consignment
  const [selectedConsignmentId, setSelectedConsignmentId] = useState<string>(
    initialSelectedRfqId 
      ? (defaultConsignments.find(c => c.rfqId === initialSelectedRfqId)?.id || defaultConsignments[0].id)
      : defaultConsignments[0].id
  );

  // Active selected stage for drill-down inspection
  const [activeStageId, setActiveStageId] = useState<ExportStageId>('shipping');
  
  // Search query filter
  const [searchQuery, setSearchQuery] = useState('');

  const currentConsignment = defaultConsignments.find(c => c.id === selectedConsignmentId) || defaultConsignments[0];
  const activeStage = currentConsignment.stages.find(s => s.id === activeStageId) || currentConsignment.stages[0];

  // Stage order helper
  const stageOrder: ExportStageId[] = ['warehouse', 'port_transit', 'customs_clearance', 'shipping'];
  const currentStageIndex = stageOrder.indexOf(currentConsignment.currentStageId);

  // Calculate overall consignment progress
  const calculateTotalProgress = () => {
    switch (currentConsignment.currentStageId) {
      case 'warehouse':
        return 25;
      case 'port_transit':
        return 50;
      case 'customs_clearance':
        return 75;
      case 'shipping':
        return 90;
      default:
        return 30;
    }
  };

  const getStageStatus = (stageId: ExportStageId) => {
    const stageIdx = stageOrder.indexOf(stageId);
    if (stageIdx < currentStageIndex) return 'completed';
    if (stageIdx === currentStageIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Real-time Vessel & Consignment Telemetry */}
      <div className="bg-[#0B3B24] text-white rounded-2xl p-5 sm:p-6 border border-[#E6C687]/30 shadow-md relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full pointer-events-none blur-2xl" />
        <div className="absolute right-12 bottom-0 w-32 h-32 bg-[#E6C687]/10 rounded-full pointer-events-none blur-xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#E6C687] text-[#0B3B24]">
                  Live Export Tracking
                </span>
                <span className="text-xs text-white/70 font-mono">
                  {currentConsignment.trackingNumber}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white mt-1">
                {currentConsignment.commodity}
              </h3>
            </div>

            {/* Consignment Switcher */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-1 rounded-xl border border-white/15">
              <span className="text-[11px] text-white/70 pl-2 hidden sm:inline font-medium">Consignment:</span>
              <select
                value={selectedConsignmentId}
                onChange={(e) => {
                  setSelectedConsignmentId(e.target.value);
                  const selected = defaultConsignments.find(c => c.id === e.target.value);
                  if (selected) {
                    setActiveStageId(selected.currentStageId);
                  }
                }}
                className="bg-[#072818] text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 focus:outline-none focus:ring-1 focus:ring-[#E6C687] cursor-pointer"
              >
                {defaultConsignments.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.rfqId} ({c.orderVolumeMT} MT - {c.commodity.split('(')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-white/60 block text-[11px]">Ocean Carrier &amp; Vessel</span>
              <strong className="text-white font-semibold flex items-center gap-1 mt-0.5 truncate">
                <Ship className="w-3.5 h-3.5 text-[#E6C687] shrink-0" />
                <span className="truncate">{currentConsignment.vesselName}</span>
              </strong>
              <span className="text-[10px] text-[#E6C687] block font-mono mt-0.5">{currentConsignment.voyageNumber}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-white/60 block text-[11px]">Volume &amp; Containers</span>
              <strong className="text-white font-semibold flex items-center gap-1 mt-0.5">
                <Box className="w-3.5 h-3.5 text-[#E6C687] shrink-0" />
                <span>{currentConsignment.orderVolumeMT} MT</span>
              </strong>
              <span className="text-[10px] text-white/70 block mt-0.5">{currentConsignment.containersCount} x 20ft FCL ({currentConsignment.incoterm})</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-white/60 block text-[11px]">Discharge Seaport</span>
              <strong className="text-white font-semibold flex items-center gap-1 mt-0.5 truncate">
                <Anchor className="w-3.5 h-3.5 text-[#E6C687] shrink-0" />
                <span className="truncate">{currentConsignment.destinationPort.split('(')[0]}</span>
              </strong>
              <span className="text-[10px] text-white/70 block mt-0.5">Origin: Apapa Wharf, Lagos</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-white/60 block text-[11px]">Estimated Port Arrival (ETA)</span>
              <strong className="text-[#E6C687] font-semibold flex items-center gap-1 mt-0.5 font-mono">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{currentConsignment.estimatedArrivalDate}</span>
              </strong>
              <span className="text-[10px] text-emerald-300 block mt-0.5 font-medium">On Schedule</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-STAGE INTERACTIVE VISUAL PROGRESS TRACKER */}
      <div className="bg-white rounded-2xl p-6 border border-[#E0D8C8] shadow-sm space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FAF8F5] pb-3">
          <div>
            <h4 className="text-sm font-bold text-[#0B3B24]">Export Pipeline Status</h4>
            <p className="text-xs text-[#64748B]">Click any stage to inspect quality assays, customs seals, and shipping bills.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0B3B24]">Overall Transit Progress:</span>
            <div className="w-24 bg-[#E8DFC8] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${calculateTotalProgress()}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-[#0B3B24]">{calculateTotalProgress()}%</span>
          </div>
        </div>

        {/* 4 STAGES STEPPER BAR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          {currentConsignment.stages.map((stage, idx) => {
            const status = getStageStatus(stage.id);
            const isSelected = activeStageId === stage.id;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageId(stage.id)}
                className={`text-left p-4 rounded-xl border transition-all relative cursor-pointer group ${
                  isSelected
                    ? 'border-[#0B3B24] bg-[#0B3B24]/5 shadow-sm ring-2 ring-[#0B3B24]/20'
                    : status === 'completed'
                    ? 'border-[#E0D8C8] bg-white hover:border-[#0B3B24]/40 hover:bg-[#FAF8F5]'
                    : status === 'current'
                    ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50'
                    : 'border-[#EBE4D5] bg-[#FAF8F5]/60 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : status === 'current'
                        ? 'bg-[#0B3B24] text-white animate-pulse'
                        : 'bg-[#E8DFC8] text-[#718096]'
                    }`}>
                      {status === 'completed' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : status === 'current'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {status === 'completed' && 'Completed'}
                      {status === 'current' && 'In Progress'}
                      {status === 'upcoming' && 'Scheduled'}
                    </span>
                  </div>

                  <Icon className={`w-4 h-4 ${
                    isSelected ? 'text-[#0B3B24]' : 'text-[#8C7A5B]'
                  }`} />
                </div>

                <h5 className="text-xs font-bold text-[#1E232A] group-hover:text-[#0B3B24] transition-colors line-clamp-1">
                  {stage.name}
                </h5>
                <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2 leading-relaxed">
                  {stage.shortDesc}
                </p>

                {/* Progress bar under card */}
                <div className="mt-3 w-full bg-[#E8DFC8] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      status === 'completed'
                        ? 'bg-emerald-600 w-full'
                        : status === 'current'
                        ? 'bg-[#0B3B24] w-2/3'
                        : 'bg-transparent w-0'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE STAGE DRILL-DOWN DETAILS */}
        <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-6 border border-[#E0D8C8] space-y-5">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8DFC8] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B3B24] text-[#E6C687] flex items-center justify-center shadow-sm">
                <activeStage.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#0B3B24]">
                    Stage {stageOrder.indexOf(activeStage.id) + 1}: {activeStage.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#D9D0BE] text-[#4A5568]">
                    {activeStage.location}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {activeStage.shortDesc}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-[#64748B] block">Execution Timestamp</span>
              <strong className="text-xs font-mono text-[#0B3B24]">
                {activeStage.completedDate ? `Cleared on ${activeStage.completedDate}` : `Target: ${activeStage.estimatedDate}`}
              </strong>
            </div>
          </div>

          {/* Key Parameters at this Stage */}
          {activeStage.keyParameters && activeStage.keyParameters.length > 0 && (
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B3B24] block mb-2">
                Certified Operational Specifications
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {activeStage.keyParameters.map((param, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-[#E0D8C8] text-xs">
                    <span className="text-[10px] text-[#718096] block">{param.label}</span>
                    <strong className="text-[#1E232A] font-semibold block mt-0.5 truncate" title={param.value}>
                      {param.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestone Checkpoints Audit Log */}
          <div className="space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0B3B24] block">
              Inspection &amp; Regulatory Checkpoints ({activeStage.milestones.length})
            </span>

            <div className="space-y-2.5">
              {activeStage.milestones.map((milestone) => (
                <div 
                  key={milestone.id}
                  className="bg-white p-4 rounded-xl border border-[#E0D8C8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-[#0B3B24]/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      milestone.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : milestone.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : milestone.status === 'in_progress' ? (
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-[#1E232A] font-bold">{milestone.title}</strong>
                        <span className="text-[10px] font-medium text-[#718096] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EFE9DF]">
                          {milestone.authority}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] leading-relaxed max-w-xl">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Document Badge or Verification Proof */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0 pl-9 sm:pl-0">
                    {milestone.documentName ? (
                      <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-[#D9D0BE] text-[11px] text-[#0B3B24] font-medium">
                        <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-mono text-[10px]">{milestone.documentRef}</span>
                      </div>
                    ) : milestone.completedAt ? (
                      <span className="text-[11px] text-[#718096] font-mono">
                        {milestone.completedAt}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-500 italic">
                        Pending execution
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* VERIFIED SHIPPING CONTAINER & BILL OF LADING DETAILS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Container Security Details */}
        <div className="bg-white p-5 rounded-2xl border border-[#E0D8C8] space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#0B3B24] font-bold">
            <Container className="w-4 h-4 text-emerald-700" />
            <span>Assigned Export Containers &amp; Seals</span>
          </div>

          <div className="space-y-2">
            {currentConsignment.containerNumbers.map((cntr, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EFE9DF]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#0B3B24]/10 text-[#0B3B24] font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-mono font-bold text-[#1E232A]">{cntr}</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  20ft FCL Standard Heavy
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EFE9DF]">
              <span className="text-[#64748B] text-[11px]">Nigeria Customs High-Security Seal:</span>
              <span className="font-mono font-bold text-[#0B3B24] text-[11px]">{currentConsignment.sealNumber}</span>
            </div>
          </div>
        </div>

        {/* Ocean Carrier & Port Contact */}
        <div className="bg-white p-5 rounded-2xl border border-[#E0D8C8] space-y-3 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#0B3B24] font-bold">
              <Navigation className="w-4 h-4 text-[#0B3B24]" />
              <span>Ocean Shipping Operations Desk</span>
            </div>
            
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Consignment under strict GPS and maritime bill of lading monitoring. Official shipping documents (Original B/L, Commercial Invoice, Packing List, Certificate of Origin, Phytosanitary Certificate, SGS Quality Assay) are dispatched via DHL express courier / electronic bank transfer.
            </p>
          </div>

          <div className="pt-2 border-t border-[#FAF8F5] flex items-center justify-between">
            <span className="text-[11px] text-[#64748B]">Assigned Freight Coordinator:</span>
            <a
              href={`https://wa.me/2348030000000?text=${encodeURIComponent(`Hello NaijaGlobal Shipping Operations, inquiring on tracking status for container ${currentConsignment.trackingNumber} aboard ${currentConsignment.vesselName}`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
            >
              <span>Contact Freight Agent</span>
              <ArrowRight className="w-3 h-3 text-emerald-600" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
