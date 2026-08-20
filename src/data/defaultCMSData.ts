import { AppCMSData } from '../types';

export const DEFAULT_CMS_DATA: AppCMSData = {
  homepage: {
    campaignActive: true,
    campaignBadge: '2026/2027 Export Harvest Campaign Active',
    campaignSubBadge: 'FOB Lagos & CIF Global',
    headingPrefix: 'Connecting Premium',
    headingHighlight: 'Nigerian Agriculture',
    headingSuffix: 'to Global Markets',
    subheadline: 'Sourcing, processing, and shipping NAFDAC & FDA-certified food commodities worldwide.',
    heroStats: [
      { value: '98.5%+', label: 'Average Purity Rating' },
      { value: '< 9.0%', label: 'Controlled Moisture' },
      { value: '40+ Ports', label: 'Direct Freight Routes' }
    ],
    spotlight: {
      enabled: true,
      originBadge: 'Origin: Kaduna & Benue',
      tagline: 'Spotlight Commodity',
      title: 'Grade A Dried Split Ginger & Agro Produce',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=85',
      moistureText: '< 9% Max Guaranteed',
      purityText: '> 98.5% Machine Cleaned',
      inspectionText: 'SGS & NAFDAC Pre-Shipment Tested',
      portText: 'Apapa Seaport',
      licenseText: 'License #NX-0049281-AG'
    }
  },
  products: [
    {
      id: 'dried-split-ginger',
      name: 'Premium Dried Split Ginger',
      botanicalName: 'Zingiber officinale',
      category: 'spices',
      tagline: 'Sun-cured, aromatic split ginger roots from Southern Kaduna with high gingerol potency.',
      description: 'Our premium Nigerian dried split ginger is organically harvested across the fertile soils of Southern Kaduna (Kachia & Jaba). Mechanically split and sun-dried under hygienic controlled conditions to preserve high oleoresin and volatile essential oil content.',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      specs: {
        moisture: '< 9.0% Max',
        purity: '> 98.5% Min',
        moq: '14 MT (1 x 20ft FCL)',
        origin: 'Southern Kaduna, Nigeria',
        cropYear: '2025/2026 Current Crop',
        packaging: '40kg or 50kg new export-grade PP woven bags with polyethylene liner',
        grade: 'Grade A Export Sun-Dried Split',
        shelfLife: '24 Months (stored in cool, dry conditions)',
        hsCode: '0910.11.00',
        oilContent: '2.5% - 3.8% volatile oil',
        aflatoxin: '< 10 ppb (EU Standard compliant)',
        extraneousMatter: '< 1.0% max'
      },
      keyFeatures: [
        'High gingerol & pungent oleoresin content',
        'Naturally sun-dried with zero sulfur fumigation',
        'Free from mould, live weevils, and chemical additives',
        'EU and US FDA Phytosanitary compliant'
      ],
      certifications: ['NAFDAC', 'NEPC', 'FDA', 'SGS'],
      featured: true,
      active: true
    },
    {
      id: 'deshelled-egusi',
      name: 'De-shelled Egusi',
      botanicalName: 'Citrullus lanatus / Cucumeropsis mannii',
      category: 'oilseeds',
      tagline: 'Whole, cream-white melon seeds machine-hulled and sorted for gourmet culinary & oil extraction.',
      description: 'Harvested from the Benue-Nassarawa agricultural belt, our de-shelled egusi seeds undergo multi-stage optical cleaning and magnetic destoning. High in healthy essential lipids, protein, and dietary fiber, packaged in nitrogen-flushed food bags.',
      image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
      specs: {
        moisture: '< 8.5% Max (Standard < 9%)',
        purity: '> 99.0% Min (Standard > 98%)',
        moq: '12 MT (1 x 20ft FCL) / LCL 3 MT',
        origin: 'Benue State (Food Basket of the Nation)',
        cropYear: '2025/2026 Fresh Harvest',
        packaging: '25kg multi-ply food grade paper sacks or vacuum-sealed 10kg cartons',
        grade: 'Premium Whole Cream Kernels, Grade A',
        shelfLife: '18 Months in climate-controlled storage',
        hsCode: '1207.70.00',
        oilContent: '48% - 52% healthy vegetable oil',
        aflatoxin: '< 4 ppb B1 / < 10 ppb Total',
        extraneousMatter: '< 0.5% max'
      },
      keyFeatures: [
        'Over 99% whole unbroken white kernels',
        'Zero rancidity and free fatty acid (FFA) < 1.5%',
        'Machine de-hulled with double air-aspirator dust separation',
        'Direct farm gate traceability to cooperative farmers'
      ],
      certifications: ['NAFDAC', 'NEPC', 'FDA', 'SGS'],
      featured: true,
      active: true
    },
    {
      id: 'organic-yam-flour',
      name: 'Organic Yam Flour',
      botanicalName: 'Discorea alata / Discorea rotundata (Elubo)',
      category: 'flours',
      tagline: 'Traditional sun-steeped, fine-milled authentic yam flour for global food distributors & African diaspora retailers.',
      description: 'Produced from selected mature white and water yams from Oyo and Niger states. Peeled, parboiled in pure artisan spring water, naturally cured, and micro-pulverized into an ultra-smooth, velvety brown and white flour with rich natural elastic texture.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      specs: {
        moisture: '< 8.0% Max (Standard < 9%)',
        purity: '> 99.2% Min (Standard > 98%)',
        moq: '18 MT (1 x 20ft FCL)',
        origin: 'Oyo & Niger States, Nigeria',
        cropYear: 'Continuous Year-Round Processing',
        packaging: '1kg, 2kg, 5kg retail zip-pouches or 25kg multi-wall Kraft paper sacks',
        grade: 'Extra-Fine Culinary Mesh (100-120 mesh)',
        shelfLife: '24 Months tightly sealed',
        hsCode: '1106.30.10',
        aflatoxin: '< 4 ppb Total Aflatoxin',
        extraneousMatter: '0% Nil'
      },
      keyFeatures: [
        '100% pure yam with zero starch fillers or cassava blend',
        'Smooth texture with high elasticity upon boiling',
        'Pre-sterilized with tamper-proof export sealing',
        'Barcode & nutritional facts panel formatted for US/UK/EU retail'
      ],
      certifications: ['NAFDAC', 'NEPC', 'FDA', 'SGS'],
      featured: true,
      active: true
    },
    {
      id: 'dried-hibiscus-flower',
      name: 'Dried Hibiscus Flower',
      botanicalName: 'Hibiscus sabdariffa (Zobo Calyces)',
      category: 'spices',
      tagline: 'Deep crimson, whole-flower calyces with high anthocyanin and citric acidity for beverage & tea blends.',
      description: 'Sourced from the arid, pesticide-free plains of Jigawa and Kano. Hand-plucked, shade-dried, and mechanically de-sanded to preserve dark ruby coloration and pungent tart flavor profile.',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      specs: {
        moisture: '< 9.0% Max',
        purity: '> 98.8% Min',
        moq: '12 MT (1 x 40ft HC FCL / Light Bulk)',
        origin: 'Kano & Jigawa States, Nigeria',
        cropYear: '2025/2026 Harvest',
        packaging: '25kg tightly pressed PP bags or master cartons',
        grade: 'Whole Dark Red Calyces, Grade A',
        shelfLife: '24 Months',
        hsCode: '1211.90.80',
        extraneousMatter: '< 1.2% max'
      },
      keyFeatures: [
        'Deep crimson color with intense natural ruby pigment',
        'Laser sorted for zero foreign leaves or stones',
        'Compliant with European pharmacopoeia tea standards',
        'Rich in antioxidants, Vitamin C, and bioflavonoids'
      ],
      certifications: ['NAFDAC', 'NEPC', 'FDA', 'SGS'],
      featured: false,
      active: true
    }
  ],
  categories: [
    { id: 'all', name: 'All Commodities', description: 'Complete catalog of export-grade commodities' },
    { id: 'spices', name: 'Spices & Botanicals', description: 'Ginger roots, dried hibiscus calyces, chili peppers' },
    { id: 'oilseeds', name: 'Oilseeds & Kernels', description: 'De-shelled melon seeds, raw cashew nuts, sesame seeds' },
    { id: 'flours', name: 'Processed Flours', description: 'Yam flour (elubo), plantain flour, cassava derivatives' }
  ],
  certifications: [
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
  ],
  exportDocs: [
    {
      id: 'doc-1',
      name: 'Phytosanitary Certificate',
      issuer: 'Nigeria Agricultural Quarantine Service (NAQS)',
      desc: 'Guarantees freedom from regulated pests, insects, and weed seeds.'
    },
    {
      id: 'doc-2',
      name: 'Certificate of Origin (EUR.1 / Form C)',
      issuer: 'Lagos Chamber of Commerce & Industry (LCCI)',
      desc: 'Validates Nigerian sovereign agricultural origin for duty exemptions.'
    },
    {
      id: 'doc-3',
      name: 'Clean Bill of Lading (B/L)',
      issuer: 'Maersk / MSC / Hapag-Lloyd Ocean Carriers',
      desc: 'Shipped on board marine bill of lading with full container tracking.'
    },
    {
      id: 'doc-4',
      name: 'Fumigation & Degasification Certificate',
      issuer: 'Federal Environmental Protection Certified Agency',
      desc: 'Aluminum phosphide / heat treatment sealing for container integrity.'
    }
  ],
  supplyChainSteps: [
    {
      id: 'step-1',
      step: '01',
      title: 'Farmgate Direct Aggregation',
      location: 'Kaduna, Benue & Oyo Belts',
      desc: 'Ethical sourcing directly from organized Nigerian farmer cooperatives, ensuring origin traceability and pesticide-safe cultivation.',
      iconName: 'MapPin',
      checkpoint: 'Origin Traceability Assured'
    },
    {
      id: 'step-2',
      step: '02',
      title: 'Optical Sorting & Moisture Control',
      location: 'Kaduna & Lagos Processing Centers',
      desc: 'Multi-deck de-stoning, magnetic separation, mechanical slicing, and solar/hygienic dry-curing to enforce moisture < 9.0%.',
      iconName: 'Search',
      checkpoint: 'Moisture < 9.0% Passed'
    },
    {
      id: 'step-3',
      step: '03',
      title: 'NAFDAC & SGS Lab Inspection',
      location: 'Accredited Analytical Labs',
      desc: 'Comprehensive aflatoxin, microbiology, purity assays (>98%), and mandatory NAQS Phytosanitary sealing prior to containerization.',
      iconName: 'ShieldCheck',
      checkpoint: 'Purity > 98.5% Certified'
    },
    {
      id: 'step-4',
      step: '04',
      title: 'Port Freight & Ocean Dispatch',
      location: 'Apapa / Tin Can Island Port, Lagos',
      desc: 'FCL & LCL stuffing into clean, food-grade ocean containers with desiccant dry-bags and real-time vessel tracking.',
      iconName: 'Ship',
      checkpoint: 'Vessel B/L Tracked'
    }
  ],
  transitRoutes: [
    { id: 'route-1', port: 'Port of Rotterdam (Netherlands) - NL RTM', transit: '18 - 21 Days', frequency: 'Weekly Sailing', region: 'Europe' },
    { id: 'route-2', port: 'Port of Antwerp-Bruges (Belgium) - BE ANR', transit: '19 - 22 Days', frequency: 'Weekly Sailing', region: 'Europe' },
    { id: 'route-3', port: 'Port of London / Tilbury (United Kingdom) - GB TIL', transit: '16 - 19 Days', frequency: 'Direct Feeder', region: 'Europe' },
    { id: 'route-4', port: 'Port of Houston (United States) - US HOU', transit: '24 - 28 Days', frequency: 'Bi-Weekly Express', region: 'North America' },
    { id: 'route-5', port: 'Port of Newark / NY (United States) - US EWR', transit: '22 - 26 Days', frequency: 'Weekly Direct', region: 'North America' },
    { id: 'route-6', port: 'Port of Jebel Ali, Dubai (UAE) - AE JEA', transit: '22 - 26 Days', frequency: 'Weekly Express', region: 'Middle East' },
    { id: 'route-7', port: 'Port of Ningbo-Zhoushan (China) - CN NGB', transit: '28 - 34 Days', frequency: 'Weekly Direct', region: 'Asia' },
    { id: 'route-8', port: 'Port of Singapore (Singapore) - SG SIN', transit: '25 - 30 Days', frequency: 'Weekly Transit', region: 'Asia' }
  ],
  siteSettings: {
    companyName: 'NaijaGlobal',
    companyHighlight: 'Agro',
    subTitle: 'Export Commodities • West Africa',
    nepcLicense: 'NX-0049281-AG',
    nafdacLicense: 'A1-94827-EXP',
    fdaLicense: '18492049182',
    rcNumber: 'RC 1948201',
    portDeskOpen: true,
    portDeskText: 'Lagos Apapa Port Desk: Open',
    copyrightText: 'NaijaGlobal Agro Ltd. All rights reserved. Registered in the Federal Republic of Nigeria.'
  },
  contactSettings: {
    tradeEmail: 'exports@naijaglobalagro.com',
    supportEmail: 'commercial@naijaglobalagro.com',
    deskWhatsApp: '+234 803 928 1044',
    deskPhone: '+234 1 293 8472',
    hqAddress: 'Plot 14, Commercial Avenue, Victoria Island, Lagos, Nigeria',
    northernHubAddress: 'Kachia Ginger Aggregation Yard, Kaduna State',
    hours: 'Monday - Friday: 08:00 - 18:00 (WAT / GMT+1)'
  },
  rfqSettings: {
    defaultVolumeMT: 14,
    volumePresets: [14, 28, 56, 100],
    availableIncoterms: ['CIF', 'FOB', 'CFR'],
    packagingOptions: [
      '50kg Standard Export PP Bags with Liner',
      '40kg Export Grade Jute Bags',
      '25kg Multi-Wall Food Grade Kraft Paper Sacks',
      '10kg Vacuum-Sealed Nitrogen Flush Cartons',
      'Retail Packaged (1kg / 2kg / 5kg Stand-up Pouches)',
      'Custom Private Labeling Specified in Notes'
    ],
    popularPorts: [
      'Port of Rotterdam (Netherlands) - NL RTM',
      'Port of Antwerp-Bruges (Belgium) - BE ANR',
      'Port of Houston (United States) - US HOU',
      'Port of Newark / NY (United States) - US EWR',
      'Port of London / Tilbury (United Kingdom) - GB TIL',
      'Port of Felixstowe (United Kingdom) - GB FXT',
      'Port of Hamburg (Germany) - DE HAM',
      'Port of Jebel Ali, Dubai (UAE) - AE JEA',
      'Port of Ningbo-Zhoushan (China) - CN NGB',
      'Port of Singapore (Singapore) - SG SIN',
      'Port of Le Havre (France) - FR LEH',
      'Port of Toronto / Montreal (Canada) - CA TOR'
    ],
    hotlineWhatsApp: '+234 803 928 1044',
    hotlineEmail: 'exports@naijaglobalagro.com'
  },
  rfqs: [
    {
      id: 'rfq-demo-1',
      rfqId: 'RFQ-NGA-2026-8492',
      date: '18 Aug 2026',
      timestamp: Date.now() - 86400000 * 2,
      data: {
        selectedProducts: ['dried-split-ginger'],
        orderVolumeMT: 28,
        destinationPort: 'Port of Rotterdam (Netherlands) - NL RTM',
        incoterm: 'CIF',
        packagingType: '50kg Standard Export PP Bags with Liner',
        targetDeliveryDate: '2026-10-15',
        companyName: 'EuroSpice Botanicals B.V.',
        buyerName: 'Jan de Vries (Procurement Head)',
        businessEmail: 'jandevries@eurospicebotanicals.nl',
        country: 'Netherlands',
        phoneOrWhatsApp: '+31 20 555 0192',
        specialRequirements: 'Requires SGS pre-shipment aflatoxin testing < 5 ppb. Clean bill of lading with 14 free demurrage days at Rotterdam.'
      },
      estimatedContainers: 2,
      productNames: ['Premium Dried Split Ginger'],
      status: 'quotation_sent',
      estimatedValueUSD: 84000,
      assignedAgent: 'Tunde Bakare',
      internalNotes: 'Draft proforma sent at $3,000/MT CIF Rotterdam. Buyer requested SGS assay docket and COA sample before final signoff.'
    },
    {
      id: 'rfq-demo-2',
      rfqId: 'RFQ-NGA-2026-9210',
      date: '19 Aug 2026',
      timestamp: Date.now() - 86400000 * 1,
      data: {
        selectedProducts: ['deshelled-egusi', 'organic-yam-flour'],
        orderVolumeMT: 14,
        destinationPort: 'Port of Houston (United States) - US HOU',
        incoterm: 'CIF',
        packagingType: '25kg Multi-Wall Food Grade Kraft Paper Sacks',
        targetDeliveryDate: '2026-11-01',
        companyName: 'AfriTaste Imports LLC (Houston)',
        buyerName: 'Marcus Washington',
        businessEmail: 'mwashington@afritasteimports.com',
        country: 'United States',
        phoneOrWhatsApp: '+1 713 555 4921',
        specialRequirements: 'US FDA foreign facility verification required on invoice and packing slip. Barcode formatted for North American food distribution.'
      },
      estimatedContainers: 1,
      productNames: ['De-shelled Egusi', 'Organic Yam Flour'],
      status: 'new',
      estimatedValueUSD: 46200,
      assignedAgent: 'Amaka Eze',
      internalNotes: 'New inbound lead from Houston trade expo. Follow up by WhatsApp regarding FDA registration certificate number.'
    },
    {
      id: 'rfq-demo-3',
      rfqId: 'RFQ-NGA-2026-7319',
      date: '20 Aug 2026',
      timestamp: Date.now() - 3600000 * 4,
      data: {
        selectedProducts: ['dried-hibiscus-flower'],
        orderVolumeMT: 24,
        destinationPort: 'Port of Hamburg (Germany) - DE HAM',
        incoterm: 'FOB',
        packagingType: '25kg tightly pressed PP bags or master cartons',
        targetDeliveryDate: '2026-09-30',
        companyName: 'Bremen Herb & Tea GmbH',
        buyerName: 'Dr. Greta Weber',
        businessEmail: 'g.weber@brementee.de',
        country: 'Germany',
        phoneOrWhatsApp: '+49 40 555 3829',
        specialRequirements: 'Purity > 99% with zero pesticide residue. Shipped on FOB Apapa terms with buyer handling Maersk charter.'
      },
      estimatedContainers: 2,
      productNames: ['Dried Hibiscus Flower'],
      status: 'negotiating',
      estimatedValueUSD: 52800,
      assignedAgent: 'Tunde Bakare',
      internalNotes: 'Negotiating FOB container stuffing schedule at Apapa port. Awaiting vessel nomination from Maersk Hamburg agent.'
    }
  ],
  media: [
    {
      id: 'med-1',
      name: 'Dried Split Ginger Burlap',
      url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=85',
      category: 'products',
      createdAt: '2026-08-01'
    },
    {
      id: 'med-2',
      name: 'De-shelled Egusi Kernels',
      url: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
      category: 'products',
      createdAt: '2026-08-01'
    },
    {
      id: 'med-3',
      name: 'Organic Yam Flour Milling',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      category: 'products',
      createdAt: '2026-08-01'
    },
    {
      id: 'med-4',
      name: 'Dried Hibiscus Calyces',
      url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      category: 'products',
      createdAt: '2026-08-01'
    },
    {
      id: 'med-5',
      name: 'Ocean Freight Container Cargo',
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      category: 'logistics',
      createdAt: '2026-08-01'
    }
  ],
  adminUser: {
    id: 'usr-admin-1',
    name: 'Alhaji Ibrahim Danladi',
    email: 'admin@naijaglobalagro.com',
    role: 'Super Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
};
