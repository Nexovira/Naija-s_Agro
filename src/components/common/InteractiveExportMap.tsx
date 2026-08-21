import React, { useState, useMemo } from 'react';
import { 
  Ship, 
  MapPin, 
  Clock, 
  Anchor, 
  Navigation, 
  Compass, 
  CheckCircle2, 
  Layers, 
  Globe, 
  ArrowRight, 
  Sparkles,
  Info,
  Calendar,
  ShieldCheck,
  Building2,
  Box
} from 'lucide-react';
import { TransitRoute } from '../../types';

export interface PortNode {
  id: string;
  name: string;
  portCode: string;
  country: string;
  region: 'Europe' | 'North America' | 'Middle East' | 'Asia' | 'South America';
  x: number;
  y: number;
  transitDays: string;
  frequency: string;
  carriers: string[];
  keyCommodities: string[];
  avgStuffingTime: string;
  routeType: 'Direct Oceanic' | 'Transshipment Hub' | 'Express Feeder';
  description: string;
  curvedPath: string; // SVG path arc
}

export interface OriginPort {
  id: string;
  name: string;
  code: string;
  state: string;
  terminalType: string;
  x: number;
  y: number;
  annualAgriThroughput: string;
  customsGateIn: string;
}

const ORIGIN_PORTS: OriginPort[] = [
  {
    id: 'apapa',
    name: 'Apapa Container Terminal (Lagos)',
    code: 'NG APP',
    state: 'Lagos State',
    terminalType: 'APM Terminals / Deep Sea Berth',
    x: 478,
    y: 276,
    annualAgriThroughput: '650,000+ MT',
    customsGateIn: '24-48 hrs Express'
  },
  {
    id: 'tincan',
    name: 'Tin Can Island Port (Lagos)',
    code: 'NG TCI',
    state: 'Lagos State',
    terminalType: 'TICT / Bulk Agro Wharf',
    x: 474,
    y: 278,
    annualAgriThroughput: '420,000+ MT',
    customsGateIn: '24-36 hrs Fast-Track'
  },
  {
    id: 'onne',
    name: 'Federal Ocean Terminal Onne',
    code: 'NG ONN',
    state: 'Rivers State (Niger Delta)',
    terminalType: 'WACT Deep Water Terminal',
    x: 494,
    y: 284,
    annualAgriThroughput: '280,000+ MT',
    customsGateIn: 'Direct Oil & Agro Berth'
  }
];

const DESTINATION_PORTS: PortNode[] = [
  // Europe
  {
    id: 'rotterdam',
    name: 'Port of Rotterdam',
    portCode: 'NL RTM',
    country: 'Netherlands',
    region: 'Europe',
    x: 490,
    y: 138,
    transitDays: '18 – 21 Days',
    frequency: '2 Sailings / Week',
    carriers: ['Maersk', 'CMA CGM', 'Hapag-Lloyd', 'MSC'],
    keyCommodities: ['Sesame Seeds', 'Dried Ginger', 'Cocoa Beans', 'Soybeans'],
    avgStuffingTime: '48 hrs stuffing to gate-in',
    routeType: 'Direct Oceanic',
    description: 'Premier gateway to Northwest Europe, Rhine industrial corridor, and European spice processing refineries.',
    curvedPath: 'M 478 276 C 430 250, 420 180, 490 138'
  },
  {
    id: 'antwerp',
    name: 'Port of Antwerp-Bruges',
    portCode: 'BE ANR',
    country: 'Belgium',
    region: 'Europe',
    x: 494,
    y: 144,
    transitDays: '19 – 22 Days',
    frequency: 'Weekly Direct',
    carriers: ['MSC', 'CMA CGM', 'Hapag-Lloyd'],
    keyCommodities: ['Raw Cashew Nuts', 'Cocoa Butter', 'Gum Arabic'],
    avgStuffingTime: '48 hrs stuffing',
    routeType: 'Direct Oceanic',
    description: 'Major European agro-food hub with specialized temperature-controlled storage and cocoa grading terminals.',
    curvedPath: 'M 478 276 C 435 255, 430 190, 494 144'
  },
  {
    id: 'london',
    name: 'Port of Tilbury / London Gateway',
    portCode: 'GB TIL',
    country: 'United Kingdom',
    region: 'Europe',
    x: 476,
    y: 134,
    transitDays: '16 – 19 Days',
    frequency: 'Weekly Express',
    carriers: ['Maersk', 'ONE Line', 'MSC'],
    keyCommodities: ['Hibiscus Flower', 'Yam Flour', 'Dried Ginger', 'Shea Butter'],
    avgStuffingTime: '36 hrs stuffing',
    routeType: 'Direct Oceanic',
    description: 'Fast direct ocean route catering to UK diaspora grocery distribution and beverage blending brands.',
    curvedPath: 'M 478 276 C 420 245, 415 175, 476 134'
  },
  {
    id: 'hamburg',
    name: 'Port of Hamburg',
    portCode: 'DE HAM',
    country: 'Germany',
    region: 'Europe',
    x: 508,
    y: 130,
    transitDays: '20 – 23 Days',
    frequency: 'Weekly Direct',
    carriers: ['Hapag-Lloyd', 'CMA CGM', 'Maersk'],
    keyCommodities: ['Dried Split Ginger', 'Sesame Seeds', 'Organic Flours'],
    avgStuffingTime: '48 hrs stuffing',
    routeType: 'Direct Oceanic',
    description: 'Central European hub connecting German, Austrian, and Swiss pharmaceutical and confectionery processors.',
    curvedPath: 'M 478 276 C 440 240, 440 160, 508 130'
  },

  // North America
  {
    id: 'houston',
    name: 'Port of Houston',
    portCode: 'US HOU',
    country: 'United States',
    region: 'North America',
    x: 182,
    y: 210,
    transitDays: '24 – 28 Days',
    frequency: 'Bi-Weekly Express',
    carriers: ['Maersk', 'MSC', 'CMA CGM'],
    keyCommodities: ['Sesame Seeds', 'Hibiscus (Zobo)', 'Yam Flour', 'Shea Butter'],
    avgStuffingTime: '48 hrs stuffing',
    routeType: 'Direct Oceanic',
    description: 'Gulf Coast gateway offering multi-modal intermodal rail connections across the American South and Midwest.',
    curvedPath: 'M 478 276 C 350 310, 240 280, 182 210'
  },
  {
    id: 'newark',
    name: 'Port of New York / Newark',
    portCode: 'US EWR',
    country: 'United States',
    region: 'North America',
    x: 236,
    y: 174,
    transitDays: '22 – 26 Days',
    frequency: 'Weekly Direct',
    carriers: ['MSC', 'Maersk', 'Hapag-Lloyd'],
    keyCommodities: ['Ginger', 'Sesame Oil Grade', 'Botanical Herbs', 'Cocoa'],
    avgStuffingTime: '48 hrs stuffing',
    routeType: 'Direct Oceanic',
    description: 'East Coast deepwater harbor serving the US Northeast agro wholesale and cosmetics manufacturing corridor.',
    curvedPath: 'M 478 276 C 360 260, 280 200, 236 174'
  },

  // Middle East
  {
    id: 'jebelali',
    name: 'Port of Jebel Ali (Dubai)',
    portCode: 'AE JEA',
    country: 'United Arab Emirates',
    region: 'Middle East',
    x: 638,
    y: 238,
    transitDays: '22 – 26 Days',
    frequency: 'Weekly Express',
    carriers: ['DP World', 'CMA CGM', 'MSC', 'Maersk'],
    keyCommodities: ['Sesame Seeds (White/Brown)', 'Raw Cashew Nuts', 'Gum Arabic'],
    avgStuffingTime: '48 hrs stuffing',
    routeType: 'Transshipment Hub',
    description: 'Mega regional trading re-export hub for GCC countries, Levant, and Central Asian grain markets.',
    curvedPath: 'M 478 276 C 530 350, 590 320, 638 238'
  },
  {
    id: 'jeddah',
    name: 'Jeddah Islamic Port',
    portCode: 'SA JED',
    country: 'Saudi Arabia',
    region: 'Middle East',
    x: 594,
    y: 246,
    transitDays: '20 – 24 Days',
    frequency: 'Weekly Direct',
    carriers: ['MSC', 'Hapag-Lloyd', 'Bahri'],
    keyCommodities: ['Sesame Seeds', 'Dried Ginger', 'Soybeans'],
    avgStuffingTime: '48 hrs stuffing',
    routeType: 'Direct Oceanic',
    description: 'Red Sea maritime hub connecting Saudi food manufacturing plants and Halal-certified agro distribution.',
    curvedPath: 'M 478 276 C 520 330, 560 300, 594 246'
  },

  // Asia
  {
    id: 'ningbo',
    name: 'Port of Ningbo-Zhoushan',
    portCode: 'CN NGB',
    country: 'China',
    region: 'Asia',
    x: 834,
    y: 218,
    transitDays: '28 – 34 Days',
    frequency: 'Weekly Direct',
    carriers: ['COSCO Shipping', 'CMA CGM', 'MSC', 'ONE Line'],
    keyCommodities: ['Sesame Seeds (High Oil)', 'Raw Cashew Nuts (RCN)', 'Dried Ginger'],
    avgStuffingTime: '48 hrs stuffing',
    routeType: 'Direct Oceanic',
    description: 'World’s largest cargo tonnage terminal serving major Chinese agricultural oil extraction mills.',
    curvedPath: 'M 478 276 C 580 430, 720 360, 834 218'
  },
  {
    id: 'qingdao',
    name: 'Port of Qingdao',
    portCode: 'CN TAO',
    country: 'China',
    region: 'Asia',
    x: 826,
    y: 194,
    transitDays: '29 – 35 Days',
    frequency: 'Weekly Direct',
    carriers: ['COSCO', 'Maersk', 'MSC'],
    keyCommodities: ['Sesame Seeds', 'Groundnuts', 'Dried Split Ginger'],
    avgStuffingTime: '48 hrs stuffing',
    routeType: 'Direct Oceanic',
    description: 'Key northern China agro-industrial terminal with state-of-the-art bulk grain quarantine silos.',
    curvedPath: 'M 478 276 C 580 420, 720 330, 826 194'
  },
  {
    id: 'singapore',
    name: 'Port of Singapore',
    portCode: 'SG SIN',
    country: 'Singapore',
    region: 'Asia',
    x: 772,
    y: 310,
    transitDays: '25 – 30 Days',
    frequency: '2 Sailings / Week',
    carriers: ['PSA', 'ONE Line', 'Maersk', 'Evergreen'],
    keyCommodities: ['Raw Cashew Nuts', 'Cocoa Beans', 'Gum Arabic'],
    avgStuffingTime: '36 hrs stuffing',
    routeType: 'Transshipment Hub',
    description: 'Global mega-transshipment center connecting Southeast Asian food conglomerates and Australasia.',
    curvedPath: 'M 478 276 C 560 410, 680 380, 772 310'
  },
  {
    id: 'nhavasheva',
    name: 'Jawaharlal Nehru Port (Nhava Sheva)',
    portCode: 'IN NSA',
    country: 'India',
    region: 'Asia',
    x: 692,
    y: 254,
    transitDays: '21 – 25 Days',
    frequency: 'Weekly Direct',
    carriers: ['SCI', 'MSC', 'Hapag-Lloyd', 'Maersk'],
    keyCommodities: ['Raw Cashew Nuts (48-52 LBS KOR)', 'Dried Ginger', 'Soybeans'],
    avgStuffingTime: '48 hrs stuffing',
    routeType: 'Direct Oceanic',
    description: 'India’s premier container port powering major cashew processing plants across Maharashtra and Kerala.',
    curvedPath: 'M 478 276 C 540 380, 620 330, 692 254'
  },
  {
    id: 'hochiminh',
    name: 'Cat Lai Port (Ho Chi Minh City)',
    portCode: 'VN SGN',
    country: 'Vietnam',
    region: 'Asia',
    x: 786,
    y: 276,
    transitDays: '27 – 32 Days',
    frequency: 'Weekly Direct',
    carriers: ['CMA CGM', 'COSCO', 'Evergreen'],
    keyCommodities: ['Raw Cashew Nuts (RCN In-Shell)', 'Cassava Chips'],
    avgStuffingTime: '48 hrs stuffing',
    routeType: 'Direct Oceanic',
    description: 'Vietnam’s central cashew roasting and kernel export manufacturing epicentre.',
    curvedPath: 'M 478 276 C 570 420, 690 350, 786 276'
  },

  // South America
  {
    id: 'santos',
    name: 'Port of Santos (São Paulo)',
    portCode: 'BR SSZ',
    country: 'Brazil',
    region: 'South America',
    x: 324,
    y: 376,
    transitDays: '16 – 20 Days',
    frequency: 'Bi-Weekly Direct',
    carriers: ['Hamburg Süd', 'Maersk', 'MSC'],
    keyCommodities: ['Specialty Spices', 'Botanicals', 'Gum Arabic'],
    avgStuffingTime: '48 hrs stuffing',
    routeType: 'Direct Oceanic',
    description: 'Latin America’s largest container complex with bilateral South-South trade connectivity.',
    curvedPath: 'M 478 276 C 410 320, 360 340, 324 376'
  }
];

interface InteractiveExportMapProps {
  onSelectRouteForRFQ?: (portName: string) => void;
  cmsTransitRoutes?: TransitRoute[];
}

export const InteractiveExportMap: React.FC<InteractiveExportMapProps> = ({ 
  onSelectRouteForRFQ,
  cmsTransitRoutes 
}) => {
  const [selectedOrigin, setSelectedOrigin] = useState<OriginPort>(ORIGIN_PORTS[0]);
  const [selectedDestination, setSelectedDestination] = useState<PortNode>(DESTINATION_PORTS[0]);
  const [hoveredDestination, setHoveredDestination] = useState<PortNode | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [showAllRoutes, setShowAllRoutes] = useState<boolean>(true);

  // Filter destination nodes by region
  const filteredDestinations = useMemo(() => {
    if (activeRegion === 'All') return DESTINATION_PORTS;
    return DESTINATION_PORTS.filter(d => d.region === activeRegion);
  }, [activeRegion]);

  const activePort = hoveredDestination || selectedDestination;

  // Generate dynamic bezier curve from selected origin to target port
  const getDynamicPath = (origin: OriginPort, dest: PortNode) => {
    const dx = dest.x - origin.x;
    const dy = dest.y - origin.y;
    
    // Control point calculation for aesthetic natural ocean curved arcs
    let cx = origin.x + dx * 0.5;
    let cy = origin.y + dy * 0.5;

    // Ocean curvature bias
    if (dest.region === 'Europe') {
      cx = origin.x - 50;
      cy = origin.y - 70;
    } else if (dest.region === 'North America') {
      cx = origin.x - 120;
      cy = origin.y + (dy > 0 ? 40 : -20);
    } else if (dest.region === 'Middle East') {
      cx = origin.x + 80;
      cy = origin.y + 60;
    } else if (dest.region === 'Asia') {
      cx = origin.x + 130;
      cy = origin.y + 110;
    } else if (dest.region === 'South America') {
      cx = origin.x - 80;
      cy = origin.y + 70;
    }

    return `M ${origin.x} ${origin.y} Q ${cx} ${cy} ${dest.x} ${dest.y}`;
  };

  return (
    <div id="interactive-export-map-wrapper" className="bg-white rounded-3xl border border-[#E0D8C8] shadow-sm overflow-hidden">
      
      {/* Map Control Header Bar */}
      <div className="p-5 sm:p-7 bg-[#FAF8F5] border-b border-[#E8DFC8]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#0B3B24] text-[#E6C687]">
                <Globe className="w-4 h-4" />
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0B3B24] tracking-tight">
                Global Maritime Transit &amp; Ocean Carrier Map
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5A687A] mt-1">
              Select or hover destination ports to inspect live transit days, ocean freight alliances, and stuffing lead times from Nigeria.
            </p>
          </div>

          {/* Controls & Region Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-white rounded-xl border border-[#D9D0BE] p-1 shadow-2xs">
              {(['All', 'Europe', 'North America', 'Middle East', 'Asia', 'South America'] as const).map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setActiveRegion(reg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeRegion === reg
                      ? 'bg-[#0B3B24] text-white shadow-xs'
                      : 'text-[#4A5568] hover:text-[#0B3B24] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            {/* Origin Port Selector */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#D9D0BE] shadow-2xs">
              <Anchor className="w-3.5 h-3.5 text-[#0B3B24]" />
              <label htmlFor="origin-port-select" className="text-[11px] font-bold text-[#718096]">Origin:</label>
              <select
                id="origin-port-select"
                value={selectedOrigin.id}
                onChange={(e) => {
                  const found = ORIGIN_PORTS.find(p => p.id === e.target.value);
                  if (found) setSelectedOrigin(found);
                }}
                className="text-xs font-bold text-[#0B3B24] bg-transparent focus:outline-none cursor-pointer"
              >
                {ORIGIN_PORTS.map((origin) => (
                  <option key={origin.id} value={origin.id}>
                    {origin.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Canvas & Interactive Stage */}
      <div className="relative bg-[#071F15] w-full overflow-hidden select-none">
        
        {/* Ocean Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(#E6C687 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-[#E6C687]/5 rounded-full blur-2xl pointer-events-none" />

        {/* The World SVG Canvas */}
        <div className="relative w-full aspect-[21/10] min-h-[360px] sm:min-h-[440px] max-h-[560px]">
          <svg
            id="global-export-routes-svg"
            viewBox="0 0 1000 500"
            className="w-full h-full object-contain"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Glowing Route Gradients */}
              <linearGradient id="routeGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E6C687" stopOpacity="1" />
                <stop offset="50%" stopColor="#48BB78" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#38A169" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="routeGradInactive" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E6C687" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38A169" stopOpacity="0.2" />
              </linearGradient>

              {/* Marker Glow Filter */}
              <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ================= SIMPLIFIED WORLD CONTINENT LANDMASSES ================= */}
            <g id="world-landmasses" className="fill-[#0C2D1F] stroke-[#12422E] stroke-[0.8]">
              
              {/* North America */}
              <path d="M 80 80 Q 140 60 210 70 Q 250 85 270 120 Q 260 160 240 190 Q 210 230 180 235 Q 150 240 140 210 Q 110 180 90 140 Z" />
              <path d="M 230 140 Q 280 130 290 170 Q 250 190 230 160 Z" /> {/* Greenland/Atlantic Islands */}
              <path d="M 180 235 Q 210 255 230 270 Q 220 280 195 265 Z" /> {/* Central America */}

              {/* South America */}
              <path d="M 230 270 Q 290 275 350 310 Q 360 360 330 420 Q 290 460 270 430 Q 250 370 235 320 Z" />

              {/* Europe */}
              <path d="M 440 120 Q 480 90 530 95 Q 560 120 540 155 Q 490 170 450 160 Q 435 140 440 120 Z" />
              <path d="M 460 120 Q 480 110 475 140 Q 460 135 460 120 Z" /> {/* British Isles */}
              <path d="M 500 80 Q 530 65 545 100 Q 520 115 500 80 Z" /> {/* Scandinavia */}

              {/* Africa */}
              <path d="M 430 170 Q 520 165 580 185 Q 600 230 560 310 Q 550 380 520 430 Q 480 435 450 380 Q 420 300 425 220 Z" />

              {/* Highlighted Federal Republic of Nigeria (Origin Hub) */}
              <path 
                d="M 465 260 Q 495 258 505 270 Q 502 292 475 292 Q 462 280 465 260 Z"
                className="fill-[#1A5C3D] stroke-[#E6C687] stroke-[1.5] filter drop-shadow"
              />

              {/* Middle East & Arabian Peninsula */}
              <path d="M 575 185 Q 630 180 650 220 Q 645 260 610 275 Q 580 250 575 185 Z" />

              {/* Asia & Eurasia */}
              <path d="M 550 100 Q 660 70 820 90 Q 890 120 880 200 Q 840 250 780 280 Q 730 290 680 260 Q 620 220 570 180 Z" />
              {/* India */}
              <path d="M 660 220 Q 715 225 725 270 Q 700 320 670 285 Q 650 250 660 220 Z" />
              {/* Southeast Asia */}
              <path d="M 750 270 Q 800 275 810 320 Q 780 345 750 310 Z" />
              {/* Japan */}
              <path d="M 865 160 Q 890 175 875 220 Q 855 205 865 160 Z" />

              {/* Oceania / Australia */}
              <path d="M 780 360 Q 880 340 910 390 Q 870 450 800 430 Q 770 390 780 360 Z" />
            </g>

            {/* ================= MARITIME SHIPPING LANES (ARCS) ================= */}
            <g id="shipping-lanes">
              {filteredDestinations.map((dest) => {
                const isSelected = selectedDestination.id === dest.id;
                const isHovered = hoveredDestination?.id === dest.id;
                const isActive = isSelected || isHovered;
                const routePath = getDynamicPath(selectedOrigin, dest);

                return (
                  <g key={`route-${dest.id}`} className="transition-all duration-300">
                    {/* Background glow path when active */}
                    {isActive && (
                      <path
                        d={routePath}
                        fill="none"
                        stroke="#E6C687"
                        strokeWidth="5"
                        strokeOpacity="0.4"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                    )}

                    {/* Main Curved Maritime Route Line */}
                    <path
                      d={routePath}
                      fill="none"
                      stroke={isActive ? "url(#routeGradActive)" : "#38A169"}
                      strokeWidth={isActive ? "2.5" : "1.2"}
                      strokeOpacity={isActive ? 1 : 0.45}
                      strokeDasharray={isActive ? "6 4" : "3 3"}
                      strokeLinecap="round"
                      className={isActive ? "animated-maritime-lane" : ""}
                    />

                    {/* Animated moving vessel particle along active route */}
                    {isActive && (
                      <circle r="3.5" fill="#E6C687" filter="url(#goldGlow)">
                        <animateMotion
                          path={routePath}
                          dur="4.5s"
                          repeatCount="indefinite"
                          rotate="auto"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </g>

            {/* ================= DESTINATION PORT NODES ================= */}
            <g id="destination-nodes">
              {filteredDestinations.map((dest) => {
                const isSelected = selectedDestination.id === dest.id;
                const isHovered = hoveredDestination?.id === dest.id;
                const isActive = isSelected || isHovered;

                return (
                  <g
                    key={`node-${dest.id}`}
                    transform={`translate(${dest.x}, ${dest.y})`}
                    onClick={() => {
                      setSelectedDestination(dest);
                      setHoveredDestination(null);
                    }}
                    onMouseEnter={() => setHoveredDestination(dest)}
                    onMouseLeave={() => setHoveredDestination(null)}
                    className="cursor-pointer group"
                  >
                    {/* Outer Target Ping when selected */}
                    {isActive && (
                      <circle
                        r="14"
                        fill="none"
                        stroke="#E6C687"
                        strokeWidth="1.5"
                        className="animate-ping opacity-60"
                      />
                    )}

                    {/* Pulse aura */}
                    <circle
                      r={isActive ? "9" : "5"}
                      fill={isActive ? "#E6C687" : "#48BB78"}
                      fillOpacity={isActive ? "0.3" : "0.2"}
                      className="transition-all duration-200"
                    />

                    {/* Core Port Node */}
                    <circle
                      r={isActive ? "5" : "3.5"}
                      fill={isActive ? "#E6C687" : "#38A169"}
                      stroke="#071F15"
                      strokeWidth="1.5"
                      className="transition-all duration-200 group-hover:scale-125"
                    />

                    {/* Port City Label */}
                    <text
                      y="-9"
                      textAnchor="middle"
                      className={`text-[9px] font-sans font-bold tracking-tight pointer-events-none transition-all duration-200 ${
                        isActive 
                          ? 'fill-[#E6C687] text-[10px] font-extrabold' 
                          : 'fill-[#A0AEC0] opacity-80 group-hover:opacity-100 group-hover:fill-white'
                      }`}
                    >
                      {dest.name.replace('Port of ', '')}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* ================= NIGERIA ORIGIN EXPORT GATEWAY MARKER ================= */}
            <g id="origin-hub-marker" transform={`translate(${selectedOrigin.x}, ${selectedOrigin.y})`}>
              {/* Radar Wave Ping */}
              <circle
                r="18"
                fill="none"
                stroke="#E6C687"
                strokeWidth="1.5"
                className="animate-ping opacity-75"
              />
              <circle
                r="10"
                fill="#E6C687"
                fillOpacity="0.25"
              />
              {/* Main Golden Origin Anchor Node */}
              <circle
                r="6"
                fill="#E6C687"
                stroke="#071F15"
                strokeWidth="2"
                filter="url(#goldGlow)"
              />
              <circle
                r="2.5"
                fill="#0B3B24"
              />

              {/* Origin Badge Label */}
              <g transform="translate(0, 18)">
                <rect
                  x="-60"
                  y="-8"
                  width="120"
                  height="16"
                  rx="8"
                  fill="#0B3B24"
                  stroke="#E6C687"
                  strokeWidth="1"
                />
                <text
                  textAnchor="middle"
                  y="3"
                  className="fill-[#E6C687] text-[8.5px] font-extrabold tracking-wider uppercase font-mono"
                >
                  ⚓ {selectedOrigin.code} ORIGIN
                </text>
              </g>
            </g>

            {/* Quick Map Legend Overlay */}
            <g id="map-legend" transform="translate(18, 440)">
              <rect
                x="0"
                y="0"
                width="280"
                height="44"
                rx="10"
                fill="#0B3B24"
                fillOpacity="0.85"
                stroke="#1A5C3D"
                strokeWidth="1"
              />
              <circle cx="15" cy="15" r="4" fill="#E6C687" stroke="#071F15" strokeWidth="1" />
              <text x="26" y="18" className="fill-[#E6C687] text-[9.5px] font-bold">Nigerian Ocean Terminal (Origin)</text>

              <circle cx="15" cy="31" r="3.5" fill="#38A169" stroke="#071F15" strokeWidth="1" />
              <text x="26" y="34" className="fill-[#CBD5E0] text-[9px] font-medium">Destination Seaport Hub</text>

              <line x1="165" y1="23" x2="195" y2="23" stroke="#E6C687" strokeWidth="2" strokeDasharray="4 2" />
              <text x="202" y="26" className="fill-[#CBD5E0] text-[9px] font-medium">Active Sea Route</text>
            </g>

          </svg>
        </div>

        {/* Live Port Real-time Indicator Pill on bottom right */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#0B3B24]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E6C687]/30 text-white text-[11px] font-bold shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Apapa &amp; Tin Can Port Desks: 24/7 Gate-In Active</span>
        </div>
      </div>

      {/* ================= DETAIL INSPECTION CARD & ROUTE SPECIFICATIONS ================= */}
      <div className="p-6 sm:p-8 bg-white border-t border-[#E8DFC8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Target Port Overview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0B3B24] text-[#E6C687] text-[10px] font-extrabold uppercase tracking-wider font-mono">
                    {activePort.portCode}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    {activePort.region}
                  </span>
                  <span className="text-xs text-[#718096] font-medium">
                    {activePort.country}
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-extrabold text-[#0B3B24] tracking-tight mt-1">
                  {activePort.name}
                </h4>
              </div>

              {/* Transit Days Badge */}
              <div className="bg-[#FAF8F5] border border-[#E0D8C8] px-4 py-2 rounded-2xl text-right">
                <div className="text-[10px] uppercase tracking-wider text-[#718096] font-bold flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>Sea Transit</span>
                </div>
                <div className="text-lg font-black text-[#0B3B24]">
                  {activePort.transitDays}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
              {activePort.description}
            </p>

            {/* Key Discharged Commodities */}
            <div>
              <div className="text-[11px] font-bold text-[#718096] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-[#0B3B24]" />
                <span>Primary Discharged Agricultural Commodities:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activePort.keyCommodities.map((comm, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#D9D0BE] text-[#1E232A] text-xs font-semibold"
                  >
                    {comm}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Freight Logistics Specs & Action */}
          <div className="lg:col-span-5 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E0D8C8] space-y-4">
            <h5 className="text-xs font-bold text-[#0B3B24] uppercase tracking-wider flex items-center gap-2">
              <Ship className="w-4 h-4 text-emerald-700" />
              <span>Carrier &amp; Container Schedule</span>
            </h5>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#EFE9DF]">
                <div className="text-[10px] text-[#718096] font-bold uppercase">Sailing Frequency</div>
                <div className="font-extrabold text-[#0B3B24] mt-0.5">{activePort.frequency}</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#EFE9DF]">
                <div className="text-[10px] text-[#718096] font-bold uppercase">Port Stuffing SLA</div>
                <div className="font-extrabold text-[#0B3B24] mt-0.5">{activePort.avgStuffingTime}</div>
              </div>
            </div>

            {/* Ocean Carrier Alliances */}
            <div>
              <div className="text-[10px] text-[#718096] font-bold uppercase mb-1.5">Contracted Ocean Alliances:</div>
              <div className="flex flex-wrap gap-1">
                {activePort.carriers.map((carrier, cIdx) => (
                  <span
                    key={cIdx}
                    className="px-2 py-0.5 rounded bg-white text-[#0B3B24] border border-[#D9D0BE] text-[10px] font-bold"
                  >
                    {carrier}
                  </span>
                ))}
              </div>
            </div>

            {/* Inquire Shipping Quote CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onSelectRouteForRFQ) {
                    onSelectRouteForRFQ(activePort.name);
                  } else {
                    const rfqSection = document.getElementById('rfq-section');
                    if (rfqSection) {
                      rfqSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg group cursor-pointer"
              >
                <span>Request CIF / FOB Quote to {activePort.name.replace('Port of ', '')}</span>
                <ArrowRight className="w-4 h-4 text-[#E6C687] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
