import { Product } from '../types';

export const PRODUCTS_DATA: Product[] = [
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
    certifications: ['NAFDAC', 'NEPC', 'FDA', 'SGS']
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
    certifications: ['NAFDAC', 'NEPC', 'FDA', 'SGS']
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
    certifications: ['NAFDAC', 'NEPC', 'FDA', 'SGS']
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
    certifications: ['NAFDAC', 'NEPC', 'FDA', 'SGS']
  }
];

export const COMMODITY_CATEGORIES = [
  { id: 'all', name: 'All Commodities' },
  { id: 'spices', name: 'Spices & Botanicals' },
  { id: 'oilseeds', name: 'Oilseeds & Kernels' },
  { id: 'flours', name: 'Processed Flours' }
];

export const POPULAR_PORTS = [
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
];
