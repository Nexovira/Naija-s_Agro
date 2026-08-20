import React, { useState, useEffect, useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { db } from '../../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { ChatMessage, ChatInquirySession } from '../../types';
import { 
  MessageSquare, 
  X, 
  Send, 
  Phone, 
  Sparkles, 
  Clock, 
  CheckCheck, 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  RefreshCw, 
  ChevronDown, 
  User, 
  Building2, 
  Mail, 
  Globe, 
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { playNotificationChime } from '../../utils/audioNotification';

interface FloatingChatWidgetProps {
  onOpenRFQ?: (productId?: string) => void;
}

const STORAGE_SESSION_KEY = 'nga_live_chat_session_id';
const STORAGE_USER_DATA_KEY = 'nga_live_chat_user_meta';

// Pre-defined quick inquiry templates
const QUICK_PROMPTS = [
  { label: '💰 2026 FOB/CIF Quote', text: 'Hello, I would like to request current FOB Lagos and CIF export price indications for this season.' },
  { label: '🚢 Shipping Transit & MOQ', text: 'What is your Minimum Order Quantity (MOQ) and estimated maritime transit time to our destination port?' },
  { label: '📜 Lab Specs & SGS Certificate', text: 'Could you share the technical laboratory analysis specifications (moisture, purity) and SGS inspection compliance for your commodities?' },
  { label: '🌾 2026 Harvest Availability', text: 'Please confirm available export inventory and weekly stuffing capacity at Apapa/Tin Can Island ports.' },
];

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({ onOpenRFQ }) => {
  const { data, customerUser } = useCMS();
  const [isOpen, setIsOpen] = useState(false);
  const [inquiryId, setInquiryId] = useState<string>('');
  const [session, setSession] = useState<ChatInquirySession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(true);

  // Intake form state (if starting fresh inquiry)
  const [formData, setFormData] = useState({
    name: customerUser?.displayName || '',
    email: customerUser?.email || '',
    company: customerUser?.companyName || '',
    commodity: 'Sesame Seeds',
    initialMessage: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioChimeRef = useRef(false);

  // Initialize or restore session ID from localStorage
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_SESSION_KEY);
    const savedMeta = localStorage.getItem(STORAGE_USER_DATA_KEY);
    
    if (savedMeta) {
      try {
        const parsed = JSON.parse(savedMeta);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.warn(e);
      }
    }

    if (customerUser) {
      setFormData(prev => ({
        ...prev,
        name: customerUser.displayName || prev.name,
        email: customerUser.email || prev.email,
        company: customerUser.companyName || prev.company
      }));
    }

    if (savedId) {
      setInquiryId(savedId);
    }
  }, [customerUser]);

  // Real-time Firestore Listener for Chat Inquiry Session & Messages
  useEffect(() => {
    if (!inquiryId) return;

    // 1. Listen to Session metadata
    const sessionDocRef = doc(db, 'chatInquiries', inquiryId);
    const unsubscribeSession = onSnapshot(sessionDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const sessionData = docSnap.data() as ChatInquirySession;
        setSession(sessionData);
      }
    }, (err) => {
      console.warn('Firestore chat session listener notice:', err);
    });

    // 2. Listen to Messages subcollection in real time
    const messagesColRef = collection(db, 'chatInquiries', inquiryId, 'messages');
    const unsubscribeMessages = onSnapshot(messagesColRef, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        const m = docSnap.data() as ChatMessage;
        if (m) msgs.push(m);
      });

      msgs.sort((a, b) => a.timestamp - b.timestamp);

      if (msgs.length > 0) {
        setMessages(msgs);

        // If closed and new agent message arrives, trigger chime and unread badge
        const latest = msgs[msgs.length - 1];
        if (!isOpen && latest.sender === 'agent' && audioChimeRef.current) {
          setHasUnread(true);
          playNotificationChime(0.4);
        }
        audioChimeRef.current = true;
      }
    }, (err) => {
      console.warn('Firestore chat messages listener notice:', err);
    });

    return () => {
      unsubscribeSession();
      unsubscribeMessages();
    };
  }, [inquiryId, isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Dismiss welcome tooltip after a few seconds or on interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeTooltip(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasUnread(false);
    setShowWelcomeTooltip(false);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  // Automated Trade Specialist Smart Response Generator
  const triggerAutomatedAgentResponse = async (
    targetInquiryId: string, 
    userText: string, 
    commodityName: string
  ) => {
    setIsTyping(true);

    const deskSpecialistName = data.contactSettings?.deskWhatsApp ? 'Trade Desk Specialist' : 'Alhaji Mukhtar (Senior Export Executive)';
    
    // Custom responsive message matching commodities and inquiries
    let replyText = `Hello! Thank you for reaching out to the Naija Global Agro Export Operations Desk. We have registered your inquiry regarding ${commodityName}.`;
    let quickAction: ChatMessage['quickAction'] = undefined;

    const lower = userText.toLowerCase();

    if (lower.includes('price') || lower.includes('quote') || lower.includes('fob') || lower.includes('cif') || lower.includes('cost')) {
      replyText = `Thank you for your pricing inquiry on export-grade ${commodityName}. We quote official FOB Lagos (Apapa/Tin Can Island) and CIF terms (Rotterdam, Qingdao, Jebel Ali, Houston, Nhava Sheva). For binding commercial proforma invoices and volume-tiered discounts, please submit your target tonnage and destination port.`;
      quickAction = {
        type: 'rfq',
        label: 'Open Formal RFQ & Proforma Generator'
      };
    } else if (lower.includes('transit') || lower.includes('moq') || lower.includes('container') || lower.includes('shipping')) {
      replyText = `Our standard Minimum Order Quantity (MOQ) is 1x20ft FCL (approx. 18-20 MT for Sesame/Ginger) or 1x40ft FCL for Cashew & Cocoa. Direct maritime transit from Lagos: Rotterdam (~16-18 days), Qingdao (~28-32 days), Jebel Ali (~22-25 days). All consignments are inspected and sealed at the port terminal.`;
      quickAction = {
        type: 'rfq',
        label: 'Submit Container Specification'
      };
    } else if (lower.includes('sgs') || lower.includes('spec') || lower.includes('moisture') || lower.includes('purity') || lower.includes('certificate')) {
      replyText = `All our ${commodityName} consignments undergo 100% pre-shipment laboratory analysis by SGS or Bureau Veritas. We guarantee Moisture < 9.0%, Purity > 98.5%, Admixture < 1.5%, with Phytosanitary Certificates issued by the Federal Ministry of Agriculture & NAFDAC export clearance.`;
      quickAction = {
        type: 'whatsapp',
        label: 'Chat Live on WhatsApp for Spec Sheets',
        payload: data.contactSettings?.deskWhatsApp || '+2348001234567'
      };
    } else if (lower.includes('sample') || lower.includes('dispatch') || lower.includes('lab')) {
      replyText = `We dispatch 500g - 1kg verified crop samples worldwide via DHL Express / FedEx directly from our Kano / Lagos export aggregation centers. Please share your courier account or delivery address for immediate dispatch scheduling.`;
      quickAction = {
        type: 'whatsapp',
        label: 'Request Courier Sample Dispatch'
      };
    } else {
      replyText = `We are on standby to assist your company with ${commodityName} export consignments, contract drafting, Incoterms 2020 structuring, and container allocations for 2026. How many metric tonnes is your company looking to source?`;
      quickAction = {
        type: 'rfq',
        label: 'Request Official Commercial Quote'
      };
    }

    // Delay 1.5 - 2.2 seconds to simulate human specialist typing
    setTimeout(async () => {
      const agentMsgId = `msg-agent-${Date.now()}`;
      const agentMsg: ChatMessage = {
        id: agentMsgId,
        sender: 'agent',
        text: replyText,
        timestamp: Date.now(),
        agentName: deskSpecialistName,
        agentRole: 'Export Operations Desk',
        isAutomated: true,
        quickAction
      };

      try {
        await setDoc(doc(db, 'chatInquiries', targetInquiryId, 'messages', agentMsgId), agentMsg);
        await setDoc(doc(db, 'chatInquiries', targetInquiryId), {
          lastMessageAt: Date.now(),
          lastMessageText: replyText,
          status: 'active'
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore agent msg write warning:', e);
      }

      setMessages(prev => {
        if (prev.some(m => m.id === agentMsgId)) return prev;
        return [...prev, agentMsg];
      });

      setIsTyping(false);
      playNotificationChime(0.3);
    }, 1800);
  };

  // Start a new Inquiry Session
  const handleStartInquiry = async (e?: React.FormEvent, customInitialMsg?: string) => {
    if (e) e.preventDefault();

    const senderName = formData.name.trim() || customerUser?.displayName || 'International Buyer';
    const senderEmail = formData.email.trim() || customerUser?.email || 'trade-inquiry@partner.com';
    const initialText = customInitialMsg || formData.initialMessage.trim() || `Hello, I would like to inquire about ${formData.commodity} export supply.`;

    if (!senderName || !senderEmail) return;

    setIsSending(true);
    const newSessionId = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem(STORAGE_SESSION_KEY, newSessionId);
    localStorage.setItem(STORAGE_USER_DATA_KEY, JSON.stringify(formData));
    setInquiryId(newSessionId);

    const newSession: ChatInquirySession = {
      id: newSessionId,
      customerName: senderName,
      customerEmail: senderEmail,
      companyName: formData.company.trim(),
      commodityInterest: formData.commodity,
      status: 'open',
      createdAt: Date.now(),
      lastMessageAt: Date.now(),
      lastMessageText: initialText,
      unreadCount: 0
    };

    const initialUserMsg: ChatMessage = {
      id: `msg-usr-${Date.now()}`,
      sender: 'user',
      text: initialText,
      timestamp: Date.now()
    };

    try {
      // 1. Create session document in Firestore
      await setDoc(doc(db, 'chatInquiries', newSessionId), newSession);
      // 2. Write initial user message
      await setDoc(doc(db, 'chatInquiries', newSessionId, 'messages', initialUserMsg.id), initialUserMsg);
    } catch (err) {
      console.warn('Firestore session create warning:', err);
    }

    setSession(newSession);
    setMessages([initialUserMsg]);
    setIsSending(false);

    // Trigger automated trade desk reply
    triggerAutomatedAgentResponse(newSessionId, initialText, formData.commodity);
  };

  // Send a follow-up message in active chat
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend || !inquiryId || isSending) return;

    setIsSending(true);
    setInputText('');

    const newMsgId = `msg-usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: newMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    // Optimistically update UI
    setMessages(prev => [...prev, userMsg]);

    try {
      await setDoc(doc(db, 'chatInquiries', inquiryId, 'messages', newMsgId), userMsg);
      await setDoc(doc(db, 'chatInquiries', inquiryId), {
        lastMessageAt: Date.now(),
        lastMessageText: textToSend,
        status: 'active'
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore send message warning:', err);
    }

    setIsSending(false);

    // Trigger intelligent specialist reply
    triggerAutomatedAgentResponse(inquiryId, textToSend, session?.commodityInterest || formData.commodity || 'Agricultural Commodities');
  };

  const handleResetSession = () => {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setInquiryId('');
    setSession(null);
    setMessages([]);
  };

  const availableCommodities = (data.products && data.products.length > 0) 
    ? data.products.map(p => p.name) 
    : ['Sesame Seeds', 'Dried Split Ginger', 'Raw Cashew Nuts', 'Cocoa Beans', 'Soybeans', 'Gum Arabic', 'Hibiscus Flower', 'Shea Butter'];

  return (
    <div id="floating-chat-container" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 select-none font-sans">
      
      {/* 1. Welcome Tooltip (Floating callout preview) */}
      {!isOpen && showWelcomeTooltip && (
        <div 
          onClick={handleOpenChat}
          className="absolute bottom-16 right-0 mb-2 w-64 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#E8DFC8] text-[#1E232A] cursor-pointer animate-fade-in hover:scale-105 transition-transform"
        >
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0B3B24] flex items-center justify-center text-[#E6C687] shrink-0 font-bold text-xs shadow-xs">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B3B24]">Export Trade Desk</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Online
                </span>
              </div>
              <p className="text-[11px] text-[#5A687A] mt-0.5 leading-snug">
                Quick inquiry on 2026 FOB/CIF rates, moisture specs, or shipping transit?
              </p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-[#EFE9DF] flex items-center justify-between text-[10px] font-bold text-[#0B3B24]">
            <span>Click to chat live</span>
            <span className="text-[#C5A059]">⚡ Instant reply</span>
          </div>
        </div>
      )}

      {/* 2. Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          id="btn-open-chat-widget"
          type="button"
          onClick={handleOpenChat}
          className="group relative flex items-center gap-3 px-4 py-3 sm:px-4.5 sm:py-3.5 rounded-full bg-[#0B3B24] text-white shadow-2xl hover:bg-[#072818] hover:shadow-[#0B3B24]/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-[#E6C687]/40"
          aria-label="Open Sales Desk Chat"
        >
          {/* Active online pulse ring */}
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0B3B24]" />
          </span>

          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#E6C687] group-hover:scale-110 transition-transform" />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">Live Export Inquiry</div>
              <div className="text-[10px] text-[#E6C687] font-medium leading-tight">Trade Agent Online</div>
            </div>
          </div>

          {/* Unread badge counter */}
          {hasUnread && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-[#0B3B24] font-black text-[11px] flex items-center justify-center border-2 border-white shadow-md animate-bounce">
              1
            </span>
          )}
        </button>
      )}

      {/* 3. Real-Time Chat Window Popover */}
      {isOpen && (
        <div 
          id="sales-chat-window" 
          className="w-[calc(100vw-2.5rem)] sm:w-[390px] h-[540px] max-h-[85vh] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E0D8C8] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="bg-[#0B3B24] text-white p-4 sm:p-4.5 relative overflow-hidden shrink-0 border-b border-[#E6C687]/20">
            {/* Ambient pattern */}
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#E6C687]/10 pointer-events-none blur-xl" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-800 to-[#072818] border border-[#E6C687]/40 flex items-center justify-center text-[#E6C687] shadow-inner font-bold text-sm">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0B3B24] rounded-full" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white tracking-tight">Trade Operations Desk</h3>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold uppercase tracking-wider border border-emerald-500/30">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-[#E6C687] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Export Specialist • ~2m reply</span>
                  </p>
                </div>
              </div>

              {/* Close & Options buttons */}
              <div className="flex items-center gap-1">
                {inquiryId && (
                  <button
                    type="button"
                    onClick={handleResetSession}
                    title="Start fresh inquiry"
                    className="p-1.5 rounded-lg text-emerald-200/70 hover:text-white hover:bg-white/10 transition-colors text-[11px] font-medium cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  id="btn-close-chat-widget"
                  type="button"
                  onClick={handleCloseChat}
                  className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Contact Ribbon */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/90">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E6C687]" />
                <span>NEPC &amp; NAFDAC Licensed Exporter</span>
              </span>
              {data.contactSettings?.deskWhatsApp && (
                <a
                  href={`https://wa.me/${data.contactSettings.deskWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Naija Global Agro Trade Desk, I would like to inquire about agricultural export commodities.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E6C687] hover:underline font-bold flex items-center gap-1 text-[10px]"
                >
                  <Phone className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F5]">
            
            {/* STATE A: New Intake Form (If no active session) */}
            {!inquiryId || messages.length === 0 ? (
              <div className="space-y-4 py-1">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFC8] shadow-xs text-xs text-[#5A687A] space-y-2">
                  <div className="flex items-center gap-2 text-[#0B3B24] font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>Direct Commodity Trade Inquiry</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#718096]">
                    Connect directly with our port operations and export specialists in Lagos &amp; Kano. Enter your details to start live real-time assistance.
                  </p>
                </div>

                <form onSubmit={(e) => handleStartInquiry(e)} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A5568] mb-1">Your Full Name / Representative *</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#718096]" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Captain Hans Mueller"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#D9D0BE] bg-white text-xs text-[#1E232A] focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A5568] mb-1">Business Email or WhatsApp *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-[#718096]" />
                      <input
                        type="text"
                        required
                        placeholder="buyer@globaltrade.com or +49 170..."
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#D9D0BE] bg-white text-xs text-[#1E232A] focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] mb-1">Company (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Hamburg Spices GmbH"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#D9D0BE] bg-white text-xs text-[#1E232A] focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] mb-1">Commodity</label>
                      <select
                        value={formData.commodity}
                        onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-xl border border-[#D9D0BE] bg-white text-xs text-[#1E232A] focus:outline-none focus:ring-1 focus:ring-[#0B3B24]"
                      >
                        {availableCommodities.map((c, i) => (
                          <option key={i} value={c}>{c}</option>
                        ))}
                        <option value="General Agri Portfolio">General Portfolio Inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick Inquiry preset buttons */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[10px] font-bold text-[#718096] uppercase tracking-wider">
                      Or Choose a Quick Inquiry Topic:
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {QUICK_PROMPTS.map((prompt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (!formData.name) {
                              setFormData(prev => ({ ...prev, name: 'Trade Partner' }));
                            }
                            if (!formData.email) {
                              setFormData(prev => ({ ...prev, email: 'buyer@inquiry.com' }));
                            }
                            handleStartInquiry(undefined, prompt.text);
                          }}
                          className="text-left p-2 rounded-xl bg-white hover:bg-emerald-50/70 border border-[#E0D8C8] hover:border-emerald-600/40 text-[11px] font-medium text-[#1E232A] transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <span className="truncate">{prompt.label}</span>
                          <span className="text-[10px] text-[#0B3B24] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            Start &rarr;
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E6C687]" />
                        <span>Connecting to Trade Desk...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-3.5 h-3.5 text-[#E6C687]" />
                        <span>Start Live Export Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* STATE B: Active Real-Time Messages View */
              <div className="space-y-3">
                
                {/* Session info banner */}
                <div className="p-2.5 rounded-xl bg-white/80 border border-[#E8DFC8] text-[11px] text-[#5A687A] flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-[#1E232A]">{session?.commodityInterest || formData.commodity}</span>
                    <span className="text-[10px] text-[#718096]">• {session?.customerName || formData.name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    Active Session
                  </span>
                </div>

                {/* Message bubbles */}
                {messages.map((msg) => {
                  const isMe = msg.sender === 'user';
                  const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-1.5 max-w-[85%]">
                        {!isMe && (
                          <div className="w-6 h-6 rounded-full bg-[#0B3B24] text-[#E6C687] font-bold text-[10px] flex items-center justify-center shrink-0 mb-1">
                            NG
                          </div>
                        )}

                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#0B3B24] text-white rounded-br-xs shadow-xs'
                              : 'bg-white text-[#1E232A] border border-[#E0D8C8] rounded-bl-xs shadow-2xs'
                          }`}
                        >
                          {!isMe && msg.agentName && (
                            <div className="text-[10px] font-bold text-[#0B3B24] mb-1 flex items-center gap-1">
                              <span>{msg.agentName}</span>
                              <span className="text-[#718096] font-normal">• {msg.agentRole || 'Sales Desk'}</span>
                            </div>
                          )}

                          <p className="whitespace-pre-wrap">{msg.text}</p>

                          {/* Quick Interactive Actions attached to Agent messages */}
                          {msg.quickAction && (
                            <div className="mt-2.5 pt-2 border-t border-[#EFE9DF]">
                              {msg.quickAction.type === 'rfq' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleCloseChat();
                                    if (onOpenRFQ) onOpenRFQ();
                                  }}
                                  className="w-full py-1.5 px-2.5 rounded-lg bg-[#0B3B24] text-[#E6C687] text-[11px] font-bold hover:bg-[#072818] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>{msg.quickAction.label}</span>
                                </button>
                              )}

                              {msg.quickAction.type === 'whatsapp' && (
                                <a
                                  href={`https://wa.me/${(data.contactSettings?.deskWhatsApp || '+2348001234567').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, regarding our chat inquiry for ${session?.commodityInterest || formData.commodity}: ${msg.text}`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-1.5 px-2.5 rounded-lg bg-[#25D366]/15 text-[#128C7E] text-[11px] font-bold hover:bg-[#25D366]/25 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{msg.quickAction.label}</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`text-[9px] text-[#718096] mt-1 px-1 flex items-center gap-1 ${isMe ? 'mr-1' : 'ml-8'}`}>
                        <span>{timeStr}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 ml-1 text-[11px] text-[#718096] italic animate-pulse">
                    <div className="w-6 h-6 rounded-full bg-[#0B3B24] text-[#E6C687] font-bold text-[10px] flex items-center justify-center shrink-0">
                      NG
                    </div>
                    <div className="p-2.5 rounded-2xl bg-white border border-[#E0D8C8] text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#0B3B24] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#0B3B24] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#0B3B24] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[10px] text-[#718096] ml-1.5">Trade Desk typing...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer Input Bar (When session is active) */}
          {inquiryId && messages.length > 0 && (
            <div className="p-3 bg-white border-t border-[#EFE9DF] shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  id="chat-input-text"
                  type="text"
                  placeholder="Type your message or inquiry..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isSending}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:outline-none focus:ring-1 focus:ring-[#0B3B24] focus:bg-white transition-colors placeholder:text-[#A0AEC0]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="p-2.5 rounded-xl bg-[#0B3B24] text-white hover:bg-[#072818] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 text-[#E6C687]" />
                </button>
              </form>

              {/* Quick shortcut pills */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 no-scrollbar text-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    setInputText('What is the current FOB Lagos price per MT?');
                  }}
                  className="px-2 py-1 rounded-lg bg-[#FAF8F5] border border-[#E8DFC8] text-[#5A687A] hover:bg-emerald-50 hover:text-[#0B3B24] whitespace-nowrap cursor-pointer transition-colors"
                >
                  💵 FOB Price?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('Can you send me the SGS laboratory analysis sheet?');
                  }}
                  className="px-2 py-1 rounded-lg bg-[#FAF8F5] border border-[#E8DFC8] text-[#5A687A] hover:bg-emerald-50 hover:text-[#0B3B24] whitespace-nowrap cursor-pointer transition-colors"
                >
                  📄 SGS Certificate?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('What is the maritime transit time to Rotterdam/Qingdao?');
                  }}
                  className="px-2 py-1 rounded-lg bg-[#FAF8F5] border border-[#E8DFC8] text-[#5A687A] hover:bg-emerald-50 hover:text-[#0B3B24] whitespace-nowrap cursor-pointer transition-colors"
                >
                  🚢 Transit Time?
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
