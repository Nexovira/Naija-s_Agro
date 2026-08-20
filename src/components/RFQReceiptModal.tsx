import React from 'react';
import { SubmittedRFQReceipt } from '../types';
import { CheckCircle, Download, Printer, X, ShieldCheck, Mail, Phone, ArrowRight, FileText, Send } from 'lucide-react';

interface RFQReceiptModalProps {
  receipt: SubmittedRFQReceipt | null;
  onClose: () => void;
}

export const RFQReceiptModal: React.FC<RFQReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `Hello NaijaGlobal Agro Trade Desk, I have submitted RFQ #${receipt.rfqId} for ${receipt.productNames.join(', ')} (${receipt.data.orderVolumeMT} MT under ${receipt.data.incoterm} terms to ${receipt.data.destinationPort}). Please provide the formal Proforma Invoice.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white border border-[#D9D0BE] shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Receipt Header */}
        <div className="bg-[#0B3B24] text-white p-6 sm:p-8 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#E6C687] text-[#0B3B24] uppercase tracking-wider">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Official Quotation Request Generated</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Quotation Reference</h3>
            <p className="font-mono text-sm text-[#E6C687]">{receipt.rfqId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto bg-[#FAF8F5]">
          
          {/* Status Message */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              <span className="font-bold">Thank you, {receipt.data.buyerName}.</span> Your RFQ has been logged with our Lagos Export Trade Desk. A signed Proforma Invoice (PI) and laboratory specification batch sheet will be dispatched to <span className="font-semibold">{receipt.data.businessEmail}</span> within 4 business hours.
            </div>
          </div>

          {/* Key Trade Parameters Summary */}
          <div className="bg-white rounded-xl p-5 border border-[#E0D8C8] space-y-4">
            <h4 className="text-xs font-bold text-[#0B3B24] uppercase tracking-wider border-b border-[#EFE9DF] pb-2">
              Trade &amp; Consignment Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#718096] block">Selected Commodity:</span>
                <span className="font-bold text-[#1E232A] text-sm">
                  {receipt.productNames.join(', ') || 'Custom Commodity'}
                </span>
              </div>
              <div>
                <span className="text-[#718096] block">Order Volume:</span>
                <span className="font-bold text-[#0B3B24] text-sm">
                  {receipt.data.orderVolumeMT} Metric Tons (~{receipt.estimatedContainers} x 20ft FCL)
                </span>
              </div>
              <div>
                <span className="text-[#718096] block">Incoterm:</span>
                <span className="font-mono font-bold text-[#0B3B24] text-sm">
                  {receipt.data.incoterm} {receipt.data.incoterm === 'FOB' ? '(Lagos Port)' : `(${receipt.data.destinationPort})`}
                </span>
              </div>
              <div>
                <span className="text-[#718096] block">Destination Seaport:</span>
                <span className="font-bold text-[#1E232A] text-sm">
                  {receipt.data.destinationPort}
                </span>
              </div>
              <div>
                <span className="text-[#718096] block">Packaging Spec:</span>
                <span className="font-medium text-[#1E232A]">
                  {receipt.data.packagingType}
                </span>
              </div>
              <div>
                <span className="text-[#718096] block">Target Shipment Date:</span>
                <span className="font-medium text-[#1E232A]">
                  {receipt.data.targetDeliveryDate || 'Immediate Available Sailing'}
                </span>
              </div>
            </div>
          </div>

          {/* Buyer Information */}
          <div className="bg-white rounded-xl p-5 border border-[#E0D8C8] space-y-3">
            <h4 className="text-xs font-bold text-[#0B3B24] uppercase tracking-wider border-b border-[#EFE9DF] pb-2">
              Consignee &amp; Buyer Profile
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#718096] block">Company:</span>
                <span className="font-semibold text-[#1E232A]">{receipt.data.companyName}</span>
              </div>
              <div>
                <span className="text-[#718096] block">Country:</span>
                <span className="font-semibold text-[#1E232A]">{receipt.data.country || 'International'}</span>
              </div>
              <div>
                <span className="text-[#718096] block">Contact Person:</span>
                <span className="font-semibold text-[#1E232A]">{receipt.data.buyerName}</span>
              </div>
              <div>
                <span className="text-[#718096] block">Contact Phone:</span>
                <span className="font-semibold text-[#1E232A]">{receipt.data.phoneOrWhatsApp}</span>
              </div>
            </div>

            {receipt.data.specialRequirements && (
              <div className="pt-2 border-t border-[#EFE9DF] text-xs">
                <span className="text-[#718096] block">Custom Lab / Moisture Instructions:</span>
                <p className="text-[#3D4756] italic mt-0.5">{receipt.data.specialRequirements}</p>
              </div>
            )}
          </div>

        </div>

        {/* Action Controls */}
        <div className="p-5 sm:p-6 bg-white border-t border-[#E0D8C8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#D9D0BE] text-xs font-semibold text-[#4A5568] hover:bg-[#FAF8F5] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#0B3B24]" />
            <span>Print Confirmation</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <a
              href={`https://wa.me/2348000000000?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>WhatsApp Trade Desk</span>
            </a>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818]"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
