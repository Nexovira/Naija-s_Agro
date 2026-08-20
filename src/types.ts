export interface ProductSpec {
  moisture: string;
  purity: string;
  moq: string;
  origin: string;
  cropYear: string;
  packaging: string;
  grade: string;
  shelfLife: string;
  hsCode: string;
  admixture?: string;
  oilContent?: string;
  aflatoxin?: string;
  extraneousMatter?: string;
}

export interface Product {
  id: string;
  name: string;
  botanicalName: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  gallery?: string[];
  specs: ProductSpec;
  keyFeatures: string[];
  certifications: string[];
  certificationsIncluded?: string[];
  applications?: string[];
  featured?: boolean;
  active?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

export interface Certification {
  id: string;
  code: string;
  name: string;
  fullName: string;
  issuer: string;
  description: string;
  badgeNumber: string;
  validity: string;
  iconName: string;
  scope: string;
}

export interface ExportDocument {
  id: string;
  name: string;
  issuer: string;
  desc: string;
}

export interface SupplyChainStep {
  id: string;
  step: string;
  title: string;
  location: string;
  desc: string;
  iconName: string;
  checkpoint: string;
}

export interface TransitRoute {
  id: string;
  port: string;
  transit: string;
  frequency: string;
  region?: string;
}

export type Incoterm = 'FOB' | 'CIF' | 'CFR';

export interface RFQFormData {
  selectedProducts: string[];
  orderVolumeMT: number;
  destinationPort: string;
  incoterm: Incoterm;
  packagingType: string;
  targetDeliveryDate: string;
  companyName: string;
  buyerName: string;
  businessEmail: string;
  country: string;
  phoneOrWhatsApp: string;
  specialRequirements: string;
}

export type RFQStatus = 'new' | 'in-review' | 'quote-sent' | 'contract-signed' | 'shipped' | 'closed' | 'contacted' | 'quotation_sent' | 'negotiating' | 'confirmed' | 'completed' | 'cancelled';

export interface SubmittedRFQReceipt {
  rfqId: string;
  date: string;
  data: RFQFormData;
  estimatedContainers: number;
  productNames: string[];
}

export interface RFQRecord {
  id: string;
  rfqId: string;
  date: string;
  timestamp: number;
  data: RFQFormData;
  estimatedContainers: number;
  productNames: string[];
  status: RFQStatus;
  buyerUserId?: string;
  internalNotes?: string;
  estimatedValueUSD?: number;
  assignedAgent?: string;
  updatedAt?: string;
}

export interface CustomerUser {
  uid: string;
  email: string;
  displayName: string;
  companyName: string;
  country: string;
  phone: string;
  role: 'customer' | 'buyer';
  createdAt: string;
  preferredCommodities?: string[];
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface SpotlightCommodity {
  enabled: boolean;
  originBadge: string;
  tagline: string;
  title: string;
  image: string;
  moistureText: string;
  purityText: string;
  inspectionText: string;
  portText: string;
  licenseText: string;
}

export interface HomepageContent {
  campaignActive: boolean;
  campaignBadge: string;
  campaignSubBadge: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  subheadline: string;
  heroStats: HeroStat[];
  spotlight: SpotlightCommodity;
}

export interface SiteSettings {
  companyName: string;
  companyHighlight: string;
  subTitle: string;
  nepcLicense: string;
  nafdacLicense: string;
  fdaLicense: string;
  rcNumber: string;
  portDeskOpen: boolean;
  portDeskText: string;
  copyrightText: string;
}

export interface ContactSettings {
  tradeEmail: string;
  supportEmail: string;
  deskWhatsApp: string;
  deskPhone: string;
  hqAddress: string;
  northernHubAddress: string;
  hours: string;
  workingHours?: string;
}

export interface RFQSettings {
  defaultVolumeMT: number;
  volumePresets: number[];
  availableIncoterms: Incoterm[];
  packagingOptions: string[];
  popularPorts: string[];
  hotlineWhatsApp: string;
  hotlineEmail: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  firebaseUid?: string;
  isEmailVerified?: boolean;
  lastLoginAt?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: 'products' | 'certifications' | 'logistics' | 'general';
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  rfqId: string;
  title: string;
  buyerCompany: string;
  buyerName: string;
  buyerEmail?: string;
  buyerCountry?: string;
  commodities: string[];
  volumeMT: number;
  destinationPort: string;
  incoterm: string;
  timestamp: number;
  read: boolean;
  estimatedValueUSD?: number;
  rfqRecord?: RFQRecord;
}

export interface NotificationPreferences {
  soundEnabled: boolean;
  browserNotifications: boolean;
  toastPopup: boolean;
  volume: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: number;
  agentName?: string;
  agentRole?: string;
  isAutomated?: boolean;
  quickAction?: {
    type: 'rfq' | 'whatsapp' | 'email' | 'call';
    label: string;
    payload?: string;
  };
}

export interface ChatInquirySession {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  commodityInterest?: string;
  status: 'open' | 'active' | 'closed';
  createdAt: number;
  lastMessageAt: number;
  lastMessageText: string;
  unreadCount?: number;
  messages?: ChatMessage[];
}

export interface AppCMSData {
  homepage: HomepageContent;
  products: Product[];
  categories: Category[];
  certifications: Certification[];
  exportDocs: ExportDocument[];
  supplyChainSteps: SupplyChainStep[];
  transitRoutes: TransitRoute[];
  siteSettings: SiteSettings;
  contactSettings: ContactSettings;
  rfqSettings: RFQSettings;
  rfqs: RFQRecord[];
  media: MediaItem[];
  adminUser: AdminUser;
}
