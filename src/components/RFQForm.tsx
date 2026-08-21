import React, { useState, useEffect } from 'react';
import { RFQFormData, Incoterm, SubmittedRFQReceipt } from '../types';
import { useCMS } from '../context/CMSContext';
import { CheckCircle2, ShieldCheck, ArrowRight, FileText } from 'lucide-react';

interface RFQFormProps {
  initialProductId?: string | null;
  initialDestinationPort?: string | null;
  onSubmittedReceipt: (receipt: SubmittedRFQReceipt) => void;
}

export const RFQForm: React.FC<RFQFormProps> = ({
  initialProductId,
  initialDestinationPort,
  onSubmittedReceipt,
}) => {
  const { data, submitRFQ, customerUser, isCustomerAuthenticated, setIsCustomerPortalOpen } = useCMS();
  const { rfqSettings, products } = data;

  const defaultPort = initialDestinationPort || rfqSettings.popularPorts?.[0] || 'Port of Rotterdam (Netherlands) - NL RTM';
  const defaultPacking = rfqSettings.packagingOptions?.[0] || '50kg Standard Export PP Bags with Liner';

  const [formData, setFormData] = useState<RFQFormData>({
    selectedProducts: initialProductId ? [initialProductId] : ['dried-split-ginger'],
    orderVolumeMT: rfqSettings.defaultVolumeMT || 14,
    destinationPort: defaultPort,
    incoterm: (rfqSettings.availableIncoterms?.[0] || 'CIF') as Incoterm,
    packagingType: defaultPacking,
    targetDeliveryDate: '',
    companyName: customerUser?.companyName || '',
    buyerName: customerUser?.displayName || '',
    businessEmail: customerUser?.email || '',
    country: customerUser?.country || '',
    phoneOrWhatsApp: customerUser?.phone || '',
    specialRequirements: '',
  });

  const [customPort, setCustomPort] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync initialDestinationPort if passed from Map
  useEffect(() => {
    if (initialDestinationPort) {
      setFormData(prev => ({
        ...prev,
        destinationPort: initialDestinationPort,
        incoterm: 'CIF' // default to CIF when selecting international port
      }));
      // If port is not in default popular ports, switch to custom or keep it selected
      const isPopular = (rfqSettings.popularPorts || []).some(p => p.toLowerCase().includes(initialDestinationPort.toLowerCase()));
      if (!isPopular) {
        setCustomPort(true);
      }
    }
  }, [initialDestinationPort, rfqSettings.popularPorts]);


  // Auto-sync when customerUser signs in or changes
  useEffect(() => {
    if (customerUser) {
      setFormData(prev => ({
        ...prev,
        companyName: customerUser.companyName || prev.companyName,
        buyerName: customerUser.displayName || prev.buyerName,
        businessEmail: customerUser.email || prev.businessEmail,
        country: customerUser.country || prev.country,
        phoneOrWhatsApp: customerUser.phone || prev.phoneOrWhatsApp
      }));
    }
  }, [customerUser]);

  useEffect(() => {
    if (initialProductId) {
      setFormData((prev) => ({
        ...prev,
        selectedProducts: prev.selectedProducts.includes(initialProductId)
          ? prev.selectedProducts
          : [...prev.selectedProducts, initialProductId],
      }));
    }
  }, [initialProductId]);

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedProducts.includes(productId);
      if (exists) {
        if (prev.selectedProducts.length === 1) return prev; // keep at least one
        return { ...prev, selectedProducts: prev.selectedProducts.filter((id) => id !== productId) };
      } else {
        return { ...prev, selectedProducts: [...prev.selectedProducts, productId] };
      }
    });
  };

  const handleVolumeChange = (vol: number) => {
    if (vol < 1) vol = 1;
    setFormData((prev) => ({ ...prev, orderVolumeMT: vol }));
  };

  const estimatedContainers = Math.max(1, Math.ceil(formData.orderVolumeMT / 14));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.destinationPort.trim()) errs.destinationPort = 'Destination port is required';
    if (formData.orderVolumeMT <= 0) errs.orderVolumeMT = 'Please enter a valid order volume in MT';
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required';
    if (!formData.buyerName.trim()) errs.buyerName = 'Contact person name is required';
    if (!formData.businessEmail.trim() || !formData.businessEmail.includes('@')) {
      errs.businessEmail = 'Valid corporate email is required';
    }
    if (!formData.phoneOrWhatsApp.trim()) errs.phoneOrWhatsApp = 'Contact phone/WhatsApp is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const productNames = formData.selectedProducts.map((id) => {
      if (id === 'custom') return 'Custom Sourced Agro Commodity';
      const found = products.find((p) => p.id === id);
      return found ? found.name : id;
    });

    try {
      const submittedRecord = await submitRFQ(formData, estimatedContainers, productNames, customerUser?.uid);

      const receipt: SubmittedRFQReceipt = {
        rfqId: submittedRecord.rfqId,
        date: submittedRecord.date,
        data: { ...formData },
        estimatedContainers,
        productNames,
      };

      setIsSubmitting(false);
      onSubmittedReceipt(receipt);
    } catch (err) {
      console.error('Error submitting RFQ:', err);
      setIsSubmitting(false);
    }
  };

  const activeProducts = products.filter(p => p.active !== false);

  return (
    <section id="rfq" className="py-20 md:py-28 bg-[#FAF8F5] border-t border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with White Space */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B3B24]/10 text-[#0B3B24] text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4 text-[#0B3B24]" />
            <span>Formal Commercial Inquiry</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B24] tracking-tight">
            Request for Quote (RFQ)
          </h2>
          <p className="text-base text-[#4A5568] leading-relaxed">
            Submit your consignment requirements directly to our Lagos trading desk. We provide formal Proforma Invoices with guaranteed assay guarantees and vessel schedule within 4 hours.
          </p>
        </div>

        {/* Main Grid: Form Left / Estimate Preview Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Multi-Input RFQ Form */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-10 border border-[#E0D8C8] shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8" id="rfq-commercial-form">
              
              {/* Step 1: Product Selection */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3B24] mb-3">
                  1. Select Commodities Required
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeProducts.map((prod) => {
                    const isSelected = formData.selectedProducts.includes(prod.id);
                    return (
                      <button
                        type="button"
                        key={prod.id}
                        onClick={() => handleProductToggle(prod.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#0B3B24] border-[#0B3B24] text-white shadow-sm'
                            : 'bg-[#FAF8F5] border-[#E0D8C8] text-[#1E232A] hover:bg-[#EFE9DF]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#E6C687]' : 'text-[#0B3B24]'}`}>
                            {prod.specs?.moisture || '< 9%'}
                          </span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-[#E6C687] border-[#E6C687] text-[#0B3B24]' : 'border-[#CBD5E1]'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 fill-current" />}
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm font-bold leading-tight">{prod.name}</div>
                        <div className={`text-[10px] mt-1 ${isSelected ? 'text-white/80' : 'text-[#64748B]'}`}>
                          Purity {prod.specs?.purity || '> 98%'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Order Volume in Metric Tons */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="order-volume-input" className="text-xs font-extrabold uppercase tracking-wider text-[#0B3B24]">
                    2. Order Volume in Metric Tons (MT)
                  </label>
                  <span className="text-xs text-[#64748B] font-medium">
                    Equivalent to ~<strong className="text-[#0B3B24]">{estimatedContainers}</strong> x 20ft FCL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-6 relative">
                    <input
                      id="order-volume-input"
                      type="number"
                      min="1"
                      step="1"
                      value={formData.orderVolumeMT}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-4 pr-16 py-3.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-[#1E232A] font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#0B3B24] focus:bg-white"
                      placeholder="e.g. 14"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B] uppercase">
                      Metric Tons
                    </span>
                  </div>

                  {/* Quick Volume Preset Chips */}
                  <div className="sm:col-span-6 flex flex-wrap gap-2">
                    {(rfqSettings.volumePresets || [14, 28, 56, 100]).map((vol) => (
                      <button
                        type="button"
                        key={vol}
                        onClick={() => handleVolumeChange(vol)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          formData.orderVolumeMT === vol
                            ? 'bg-[#0B3B24] text-white border-[#0B3B24]'
                            : 'bg-white text-[#4A5568] border-[#D9D0BE] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {vol} MT {vol === 14 ? '(1 FCL)' : vol === 28 ? '(2 FCL)' : ''}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.orderVolumeMT && (
                  <p className="text-xs text-red-600 font-medium mt-1">{errors.orderVolumeMT}</p>
                )}
              </div>

              {/* Step 3: Incoterms (FOB / CIF / CFR) */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3B24] mb-3">
                  3. Incoterms (ICC 2020 Rules)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* FOB Option */}
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                      formData.incoterm === 'FOB'
                        ? 'bg-[#0B3B24]/5 border-[#0B3B24] ring-1 ring-[#0B3B24]'
                        : 'bg-[#FAF8F5] border-[#E0D8C8] hover:bg-[#EFE9DF]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="incoterm"
                      value="FOB"
                      checked={formData.incoterm === 'FOB'}
                      onChange={() => setFormData({ ...formData, incoterm: 'FOB' })}
                      className="mt-1 text-[#0B3B24] focus:ring-[#0B3B24]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#0B3B24]">FOB</span>
                        <span className="text-xs font-semibold text-[#64748B]">Free On Board (Lagos Apapa Port)</span>
                      </div>
                      <p className="text-xs text-[#5A687A] mt-1 leading-normal">
                        NaijaGlobal handles inland transport, customs export clearance, and loading aboard the vessel at Lagos Seaport.
                      </p>
                    </div>
                  </label>

                  {/* CIF Option */}
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                      formData.incoterm === 'CIF'
                        ? 'bg-[#0B3B24]/5 border-[#0B3B24] ring-1 ring-[#0B3B24]'
                        : 'bg-[#FAF8F5] border-[#E0D8C8] hover:bg-[#EFE9DF]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="incoterm"
                      value="CIF"
                      checked={formData.incoterm === 'CIF'}
                      onChange={() => setFormData({ ...formData, incoterm: 'CIF' })}
                      className="mt-1 text-[#0B3B24] focus:ring-[#0B3B24]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#0B3B24]">CIF</span>
                        <span className="text-xs font-semibold text-[#64748B]">Cost, Insurance &amp; Freight</span>
                      </div>
                      <p className="text-xs text-[#5A687A] mt-1 leading-normal">
                        We cover ocean freight and marine cargo insurance up to your chosen destination seaport. (Most Preferred by Overseas Buyers).
                      </p>
                    </div>
                  </label>

                </div>
              </div>

              {/* Step 4: Destination Port */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="destination-port-select" className="text-xs font-extrabold uppercase tracking-wider text-[#0B3B24]">
                    4. Destination Discharge Seaport
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomPort(!customPort)}
                    className="text-xs text-[#0B3B24] font-semibold underline cursor-pointer"
                  >
                    {customPort ? 'Choose from major port list' : 'Type custom port'}
                  </button>
                </div>

                {!customPort ? (
                  <select
                    id="destination-port-select"
                    value={formData.destinationPort}
                    onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-[#1E232A] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B24] focus:bg-white"
                  >
                    {(rfqSettings.popularPorts || []).map((port) => (
                      <option key={port} value={port}>
                        {port}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.destinationPort}
                    onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                    placeholder="Enter Seaport Name, City & Country (e.g. Port of Long Beach, USA)"
                    className="w-full px-4 py-3.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-[#1E232A] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B24] focus:bg-white"
                  />
                )}
                {errors.destinationPort && (
                  <p className="text-xs text-red-600 font-medium mt-1">{errors.destinationPort}</p>
                )}
              </div>

              {/* Step 5: Packaging Preference */}
              <div>
                <label htmlFor="packaging-preference-select" className="block text-xs font-extrabold uppercase tracking-wider text-[#0B3B24] mb-2">
                  5. Packaging Specification
                </label>
                <select
                  id="packaging-preference-select"
                  value={formData.packagingType}
                  onChange={(e) => setFormData({ ...formData, packagingType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-[#1E232A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3B24]"
                >
                  {(rfqSettings.packagingOptions || [
                    '50kg Standard Export PP Bags with Liner',
                    '40kg Export Grade Jute Bags',
                    '25kg Multi-Wall Food Grade Kraft Paper Sacks',
                    '10kg Vacuum-Sealed Nitrogen Flush Cartons',
                    'Retail Packaged (1kg / 2kg / 5kg Stand-up Pouches)',
                    'Custom Private Labeling Specified in Notes'
                  ]).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 6: Corporate & Buyer Information */}
              <div className="pt-6 border-t border-[#E8DFC8] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0B3B24]">
                    6. Corporate Buyer Credentials
                  </h3>
                  {isCustomerAuthenticated ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Linked to Buyer Account ({customerUser?.companyName})</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsCustomerPortalOpen(true)}
                      className="text-xs text-[#0B3B24] hover:underline font-bold"
                    >
                      Sign In to Buyer Account &rarr;
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company-name-input" className="block text-xs font-medium text-[#4A5568] mb-1">Company / Importer Name *</label>
                    <input
                      id="company-name-input"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Apex Global Foods Ltd"
                      className="w-full px-4 py-3 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24] focus:bg-white"
                    />
                    {errors.companyName && <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>}
                  </div>

                  <div>
                    <label htmlFor="buyer-name-input" className="block text-xs font-medium text-[#4A5568] mb-1">Representative Name *</label>
                    <input
                      id="buyer-name-input"
                      type="text"
                      required
                      value={formData.buyerName}
                      onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                      placeholder="e.g. David Vance (Procurement Dir.)"
                      className="w-full px-4 py-3 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24] focus:bg-white"
                    />
                    {errors.buyerName && <p className="text-xs text-red-600 mt-1">{errors.buyerName}</p>}
                  </div>

                  <div>
                    <label htmlFor="business-email-input" className="block text-xs font-medium text-[#4A5568] mb-1">Corporate Email Address *</label>
                    <input
                      id="business-email-input"
                      type="email"
                      required
                      value={formData.businessEmail}
                      onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                      placeholder="procurement@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24] focus:bg-white"
                    />
                    {errors.businessEmail && <p className="text-xs text-red-600 mt-1">{errors.businessEmail}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone-input" className="block text-xs font-medium text-[#4A5568] mb-1">Phone / WhatsApp (with Country Code) *</label>
                    <input
                      id="phone-input"
                      type="text"
                      required
                      value={formData.phoneOrWhatsApp}
                      onChange={(e) => setFormData({ ...formData, phoneOrWhatsApp: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-4 py-3 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24] focus:bg-white"
                    />
                    {errors.phoneOrWhatsApp && <p className="text-xs text-red-600 mt-1">{errors.phoneOrWhatsApp}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="special-requirements-input" className="block text-xs font-medium text-[#4A5568] mb-1">
                    Special Laboratory Requirements, Moisture Limits or Target Shipment Window (Optional)
                  </label>
                  <textarea
                    id="special-requirements-input"
                    rows={3}
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                    placeholder="Specify any custom aflatoxin thresholds (e.g. < 4 ppb for EU), third-party SGS inspection requests, or preferred ocean carrier."
                    className="w-full px-4 py-3 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-sm text-[#1E232A] focus:outline-none focus:ring-2 focus:ring-[#0B3B24] focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="rfq-submit-button"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#0B3B24] text-white text-base font-bold hover:bg-[#072818] shadow-lg shadow-[#0B3B24]/15 active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span>Generating Proforma Quotation...</span>
                ) : (
                  <>
                    <span>Submit RFQ &amp; Request Proforma Invoice</span>
                    <ArrowRight className="w-5 h-5 text-[#E6C687]" />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Right Column: Live Consignment & Trade Summary Box */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live Summary Card */}
            <div className="bg-[#0B3B24] text-white rounded-2xl p-6 sm:p-7 border border-[#082a1a] shadow-xl space-y-6">
              <div className="border-b border-white/15 pb-4">
                <span className="text-[11px] uppercase tracking-wider font-mono text-[#E6C687] font-semibold">
                  Live Quotation Engine
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Consignment Estimation</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/70">Selected Commodities:</span>
                  <span className="font-bold text-[#E6C687] text-right">
                    {formData.selectedProducts.length} Items Selected
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/70">Total Volume:</span>
                  <span className="font-extrabold text-white text-sm">
                    {formData.orderVolumeMT} Metric Tons
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/70">Container Capacity:</span>
                  <span className="font-bold text-white">
                    ~{estimatedContainers} x 20ft FCL
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/70">Incoterm:</span>
                  <span className="font-mono font-bold text-[#E6C687] text-sm">
                    {formData.incoterm}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-white/70">Port of Loading:</span>
                  <span className="font-bold text-white">
                    Apapa Seaport, Lagos (NG APP)
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-white/70 block mb-1">Destination Port:</span>
                  <div className="bg-white/10 p-2.5 rounded-lg text-xs font-semibold text-white leading-tight">
                    {formData.destinationPort}
                  </div>
                </div>
              </div>

              {/* Trust assurances checklist */}
              <div className="p-4 rounded-xl bg-black/20 border border-white/10 space-y-2 text-[11px] text-white/85">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>NAFDAC &amp; Phytosanitary Sealed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>SGS Pre-Shipment Assay Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Guaranteed Moisture &lt; 9% &amp; Purity &gt; 98%</span>
                </div>
              </div>
            </div>

            {/* Direct Commercial Hotline Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E0D8C8] shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-[#0B3B24]">Need Urgent Vessel Booking?</h4>
              <p className="text-xs text-[#5A687A] leading-relaxed">
                Our export freight operations desk handles spot bookings for urgent food commodity container slots.
              </p>
              <div className="pt-2 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#718096]">Desk WhatsApp:</span>
                  <span className="font-mono font-bold text-[#0B3B24]">
                    {rfqSettings.hotlineWhatsApp || data.contactSettings.deskWhatsApp}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Trade Email:</span>
                  <span className="font-semibold text-[#0B3B24]">
                    {rfqSettings.hotlineEmail || data.contactSettings.tradeEmail}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
