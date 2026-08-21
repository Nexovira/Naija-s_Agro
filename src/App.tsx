import React, { useState } from 'react';
import { CMSProvider, useCMS } from './context/CMSContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { TrustSection } from './components/TrustSection';
import { ExportFlowSection } from './components/ExportFlowSection';
import { RFQForm } from './components/RFQForm';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { RFQReceiptModal } from './components/RFQReceiptModal';
import { CustomerPortalModal } from './components/CustomerPortalModal';
import { FloatingChatWidget } from './components/chat/FloatingChatWidget';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { Product, SubmittedRFQReceipt } from './types';

const MainAppContent: React.FC = () => {
  const { 
    currentView, 
    isAuthenticated, 
    authLoading,
    isCustomerPortalOpen,
    setIsCustomerPortalOpen
  } = useCMS();

  // Public state
  const [selectedProductForRFQ, setSelectedProductForRFQ] = useState<string | null>(null);
  const [selectedPortForRFQ, setSelectedPortForRFQ] = useState<string | null>(null);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [submittedReceipt, setSubmittedReceipt] = useState<SubmittedRFQReceipt | null>(null);

  // If in Admin Mode: Check authentication
  if (currentView === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#0B3B24] flex items-center justify-center text-white shadow-xl shadow-[#0B3B24]/20 mb-4 animate-pulse">
            <div className="w-6 h-6 border-2 border-[#E6C687] border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-lg font-bold text-[#0B3B24]">Verifying Security Clearance...</h2>
          <p className="text-xs text-[#718096] mt-1">Connecting to Firebase Encrypted Authentication</p>
        </div>
      );
    }
    if (!isAuthenticated) {
      return <AdminLogin />;
    }
    return <AdminLayout />;
  }

  // Otherwise: Full Public High-End Landing Page
  const scrollToRFQ = (productId?: string, portName?: string) => {
    if (productId) {
      setSelectedProductForRFQ(productId);
    }
    if (portName) {
      setSelectedPortForRFQ(portName);
    }
    const rfqElement = document.getElementById('rfq');
    if (rfqElement) {
      rfqElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E232A] flex flex-col font-sans selection:bg-[#0B3B24] selection:text-[#E6C687]">
      {/* Sleek Navigation Bar */}
      <Navbar onOpenRFQ={() => scrollToRFQ()} />

      {/* Main Public Flow */}
      <main className="flex-1">
        {/* 1. Hero Section with Value Proposition and Commodity Card Showcase */}
        <Hero onOpenRFQ={() => scrollToRFQ()} />

        {/* 2. Product Catalog Grid with Technical Lab Specs (Moisture <9%, Purity >98%, MOQ) */}
        <ProductCatalog
          onSelectProductForRFQ={(id) => scrollToRFQ(id)}
          onViewProductDetails={(product) => setActiveDetailProduct(product)}
        />

        {/* 3. Trust & Institutional Compliance Section (NAFDAC, NEPC, FDA, SGS) */}
        <TrustSection />

        {/* 4. Export Flow Supply Chain & Maritime Transit Schedules */}
        <ExportFlowSection 
          onSelectRouteForRFQ={(port) => scrollToRFQ(undefined, port)}
        />

        {/* 5. Functional Commercial RFQ Form (Saves directly to Admin CMS Pipeline) */}
        <RFQForm
          initialProductId={selectedProductForRFQ}
          initialDestinationPort={selectedPortForRFQ}
          onSubmittedReceipt={(receipt) => setSubmittedReceipt(receipt)}
        />
      </main>


      {/* Footer with Legal Credentials & Admin Portal access */}
      <Footer />

      {/* Lab Specification Sheet Modal */}
      {activeDetailProduct && (
        <ProductDetailModal
          product={activeDetailProduct}
          onClose={() => setActiveDetailProduct(null)}
          onSelectForRFQ={(id) => {
            setActiveDetailProduct(null);
            scrollToRFQ(id);
          }}
        />
      )}

      {/* Formal Commercial Proforma Receipt Modal on RFQ Submission */}
      {submittedReceipt && (
        <RFQReceiptModal
          receipt={submittedReceipt}
          onClose={() => setSubmittedReceipt(null)}
        />
      )}

      {/* International Customer / Buyer Account & Consignment Tracking Modal */}
      <CustomerPortalModal
        isOpen={isCustomerPortalOpen}
        onClose={() => setIsCustomerPortalOpen(false)}
        onOpenRFQModal={(productId) => {
          setIsCustomerPortalOpen(false);
          scrollToRFQ(productId);
        }}
      />

      {/* Real-time Floating Inquiry & Sales Desk Chat Widget (Bottom Right) */}
      <FloatingChatWidget onOpenRFQ={(productId) => scrollToRFQ(productId)} />
    </div>
  );
};

export function App() {
  return (
    <CMSProvider>
      <MainAppContent />
    </CMSProvider>
  );
}

export default App;
