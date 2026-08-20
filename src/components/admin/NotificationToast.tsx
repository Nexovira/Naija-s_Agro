import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BellRing, 
  ArrowRight, 
  X, 
  Ship, 
  Package, 
  Building2, 
  MapPin, 
  Clock, 
  Volume2, 
  VolumeX,
  FileSpreadsheet
} from 'lucide-react';
import { AdminNotification } from '../../types';
import { useCMS } from '../../context/CMSContext';

interface NotificationToastProps {
  notification: AdminNotification | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose
}) => {
  const { openRFQFromNotification, notificationPrefs, updateNotificationPreferences } = useCMS();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!notification) return;
    setProgress(100);
    const duration = 10000; // 10s auto-dismiss
    const interval = 100;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 right-6 z-50 max-w-md w-full sm:w-[420px] bg-[#0B3B24] text-white rounded-2xl shadow-2xl border border-[#165a38] overflow-hidden"
        role="alert"
        aria-live="assertive"
      >
        {/* Top Progress Countdown Bar */}
        <div className="h-1.5 w-full bg-black/30">
          <div 
            className="h-full bg-gradient-to-r from-[#E6C687] to-emerald-400 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content Container */}
        <div className="p-5 space-y-3.5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E6C687]/20 border border-[#E6C687]/40 flex items-center justify-center shrink-0">
                <BellRing className="w-5 h-5 text-[#E6C687] animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E6C687]">
                    Live Inbound RFQ
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-xs font-mono text-white/70">
                  {notification.rfqId}
                </div>
              </div>
            </div>

            {/* Quick Actions Header: Mute / Dismiss */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateNotificationPreferences({ soundEnabled: !notificationPrefs.soundEnabled })}
                title={notificationPrefs.soundEnabled ? 'Mute sound alerts' : 'Unmute sound alerts'}
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                {notificationPrefs.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-amber-400" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                title="Dismiss alert"
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lead & Commodity Summary Card */}
          <div className="bg-black/30 rounded-xl p-3.5 border border-white/10 space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Building2 className="w-4 h-4 text-[#E6C687] shrink-0" />
                <span className="truncate">{notification.buyerCompany}</span>
              </div>
              {notification.estimatedValueUSD && (
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                  ~${notification.estimatedValueUSD.toLocaleString()}
                </span>
              )}
            </div>

            <div className="text-white/80 flex items-center gap-1.5">
              <span className="text-white/60">Buyer:</span>
              <span className="font-semibold text-white truncate">{notification.buyerName}</span>
              {notification.buyerCountry && (
                <span className="text-white/60">({notification.buyerCountry})</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[11px]">
              <div className="flex items-center gap-1.5 text-white/80">
                <Package className="w-3.5 h-3.5 text-[#E6C687] shrink-0" />
                <span className="font-semibold text-[#E6C687] truncate">
                  {notification.volumeMT} MT ({notification.incoterm})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 truncate">
                <Ship className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate" title={notification.destinationPort}>
                  {notification.destinationPort.split('(')[0].replace('Port of', '').trim()}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-white/70 italic truncate">
              📦 Commodities: {notification.commodities.join(', ')}
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => openRFQFromNotification(notification.rfqId)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#E6C687] hover:bg-[#dfba76] text-[#0B3B24] text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md shadow-black/20 cursor-pointer active:scale-[0.99]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Inspect &amp; Create Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-xs font-semibold transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
