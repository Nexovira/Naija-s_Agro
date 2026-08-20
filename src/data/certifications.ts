import { Certification } from '../types';

export const CERTIFICATIONS_DATA: Certification[] = [
  {
    id: 'nafdac',
    code: 'NAFDAC',
    name: 'NAFDAC Certified',
    fullName: 'National Agency for Food and Drug Administration and Control',
    issuer: 'Federal Republic of Nigeria',
    description: 'Statutory regulatory certification validating processing hygiene, aflatoxin limits, microbiological safety, and food manufacturing compliance.',
    badgeNumber: 'NAFDAC Reg. No. A1-94827-EXP',
    validity: 'Active (Annual Inspection Passed)',
    iconName: 'ShieldCheck',
    scope: 'Food processing, raw root drying, and milling facility compliance.'
  },
  {
    id: 'nepc',
    code: 'NEPC',
    name: 'NEPC Registered Exporter',
    fullName: 'Nigerian Export Promotion Council',
    issuer: 'Federal Ministry of Industry, Trade and Investment',
    description: 'Accredited non-oil commodity exporter license ensuring legitimate origin documentation, Single Goods Declaration (SGD), and export proceeds repatriation.',
    badgeNumber: 'NEPC Exporter Cert #NX-0049281-AG',
    validity: 'Certified 2026/2027 Export Category A',
    iconName: 'Award',
    scope: 'Direct export of agricultural commodities & processed food flours.'
  },
  {
    id: 'fda',
    code: 'FDA',
    name: 'FDA Facility Registered',
    fullName: 'U.S. Food and Drug Administration',
    issuer: 'Department of Health and Human Services (USA)',
    description: 'Registered foreign food processing facility adhering to Food Safety Modernization Act (FSMA) and Foreign Supplier Verification Programs (FSVP).',
    badgeNumber: 'FDA Facility Reg. #18492049182',
    validity: 'Biennial FSMA Verification Current',
    iconName: 'CheckCircle2',
    scope: 'Direct entry into US Seaports (Houston, Newark, Long Beach, Savannah).'
  },
  {
    id: 'sgs',
    code: 'SGS',
    name: 'SGS Inspected & Verified',
    fullName: 'Société Générale de Surveillance S.A.',
    issuer: 'Independent Swiss Inspection & Testing Body',
    description: 'Mandatory pre-shipment inspection for quality grading, weight verification, container moisture sealing, and Clean Report of Findings (CRF).',
    badgeNumber: 'SGS Audit Reference: SGS-NIG-AG-92814',
    validity: 'Pre-Shipment Inspection on Every Bill of Lading',
    iconName: 'FileCheck',
    scope: 'Moisture, purity, heavy metals, pesticide residues & container tallying.'
  }
];

export const EXPORT_DOCUMENTATION = [
  {
    name: 'Phytosanitary Certificate',
    issuer: 'Nigeria Agricultural Quarantine Service (NAQS)',
    desc: 'Guarantees freedom from regulated pests, insects, and weed seeds.'
  },
  {
    name: 'Certificate of Origin (EUR.1 / Form C)',
    issuer: 'Lagos Chamber of Commerce & Industry (LCCI)',
    desc: 'Validates Nigerian sovereign agricultural origin for duty exemptions.'
  },
  {
    name: 'Clean Bill of Lading (B/L)',
    issuer: 'Maersk / MSC / Hapag-Lloyd Ocean Carriers',
    desc: 'Shipped on board marine bill of lading with full container tracking.'
  },
  {
    name: 'Fumigation & Degasification Certificate',
    issuer: 'Federal Environmental Protection Certified Agency',
    desc: 'Aluminum phosphide / heat treatment sealing for container integrity.'
  }
];
