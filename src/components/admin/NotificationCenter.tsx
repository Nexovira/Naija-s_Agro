import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  BellRing, 
  CheckCheck, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Settings, 
  Sparkles, 
  ExternalLink, 
  X, 
  Ship, 
  Package, 
  Building2, 
  Clock, 
  Check, 
  Radio,
  Sliders,
  Laptop
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { playNotificationChime, playActionBeep } from '../../utils/audioNotification';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose
}) => {
  const {
    notifications,
    unreadNotificationCount,
    notificationPrefs,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    updateNotificationPreferences,
    simulateInboundRFQ,
    openRFQFromNotification
  } = useCMS();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [browserPermissionStatus, setBrowserPermissionStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'unread') return !notif.read;
    return true;
  });

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await simulateInboundRFQ();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRequestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermissionStatus(perm);
        if (perm === 'granted') {
          updateNotificationPreferences({ browserNotifications: true });
          playNotificationChime(0.5);
          new Notification('NaijaGlobal Agro Alerts Enabled', {
            body: 'You will receive real-time notifications for every incoming export RFQ.',
            icon: '/favicon.ico'
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Math.max(0, Date.now() - timestamp);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[460px] bg-white text-[#1E232A] shadow-2xl z-50 flex flex-col border-l border-[#E2D9C8]"
          >
            {/* Top Bar Header */}
            <div className="p-5 border-b border-[#E8DFC8] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-[#0B3B24] flex items-center justify-center text-white shadow-sm">
                  <Bell className="w-5 h-5 text-[#E6C687]" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
                      {unreadNotificationCount}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#0B3B24]">
                    Trade Inquiries &amp; Alerts
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <span>{notifications.length} Total Logs</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{unreadNotificationCount} Unread</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  title="Notification alert preferences"
                  className={`p-2 rounded-xl transition-colors ${
                    showSettings ? 'bg-[#0B3B24] text-[#E6C687]' : 'hover:bg-[#E8DFC8] text-[#4A5568]'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-[#E8DFC8] text-[#4A5568] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-toolbar: Simulation & Bulk Action Controls */}
            <div className="px-5 py-2.5 bg-white border-b border-[#EFE9DF] flex items-center justify-between gap-2 text-xs">
              {/* Quick simulation tester */}
              <button
                type="button"
                onClick={handleSimulate}
                disabled={isSimulating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold transition-colors disabled:opacity-50 cursor-pointer text-[11px]"
                title="Trigger a realistic simulated RFQ to test audio chime and live banner"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>{isSimulating ? 'Simulating...' : 'Simulate Inbound RFQ'}</span>
              </button>

              <div className="flex items-center gap-2">
                {unreadNotificationCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B3B24] hover:underline"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllNotifications}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:underline"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Preferences Drawer Popout */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-[#FAF8F5] border-b border-[#E8DFC8] px-5 py-4 overflow-hidden space-y-3.5 text-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8DFC8]">
                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-[#0B3B24] flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      Alerting &amp; Audio Preferences
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSettings(false)}
                      className="text-[11px] text-[#64748B] hover:text-[#0B3B24]"
                    >
                      Done
                    </button>
                  </div>

                  {/* Audio Synthesizer Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#1E232A]">Audio Chime on Inbound RFQ</div>
                      <div className="text-[11px] text-[#64748B]">Synthesized 3-tone harmonic chime</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => playNotificationChime(notificationPrefs.volume)}
                        className="px-2 py-1 rounded bg-[#0B3B24]/10 text-[#0B3B24] hover:bg-[#0B3B24]/20 font-bold text-[10px]"
                        title="Test sound output"
                      >
                        Test Chime
                      </button>
                      <button
                        type="button"
                        onClick={() => updateNotificationPreferences({ soundEnabled: !notificationPrefs.soundEnabled })}
                        className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                          notificationPrefs.soundEnabled ? 'bg-[#0B3B24]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            notificationPrefs.soundEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Volume Slider */}
                  {notificationPrefs.soundEnabled && (
                    <div className="flex items-center gap-3 pt-1">
                      <Volume2 className="w-4 h-4 text-[#64748B]" />
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={notificationPrefs.volume}
                        onChange={(e) => updateNotificationPreferences({ volume: parseFloat(e.target.value) })}
                        className="flex-1 accent-[#0B3B24]"
                      />
                      <span className="text-[10px] font-mono text-[#64748B] w-8">
                        {Math.round(notificationPrefs.volume * 100)}%
                      </span>
                    </div>
                  )}

                  {/* Toast Popups Toggle */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="font-bold text-[#1E232A]">Live Screen Toast Popup</div>
                      <div className="text-[11px] text-[#64748B]">Interactive banner at bottom-right</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateNotificationPreferences({ toastPopup: !notificationPrefs.toastPopup })}
                      className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                        notificationPrefs.toastPopup ? 'bg-[#0B3B24]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          notificationPrefs.toastPopup ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Browser Native Notifications */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="font-bold text-[#1E232A] flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-[#0B3B24]" />
                        <span>Desktop OS Notifications</span>
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Status: <strong className="capitalize">{browserPermissionStatus}</strong>
                      </div>
                    </div>
                    {browserPermissionStatus === 'granted' ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestBrowserPermission}
                        className="px-2.5 py-1 rounded bg-[#0B3B24] text-white hover:bg-[#072818] font-bold text-[10px]"
                      >
                        Enable
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Tabs */}
            <div className="flex border-b border-[#E8DFC8] bg-white px-5">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeFilter === 'all'
                    ? 'border-[#0B3B24] text-[#0B3B24]'
                    : 'border-transparent text-[#64748B] hover:text-[#1E232A]'
                }`}
              >
                <span>All Alerts</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-100 font-mono">
                  {notifications.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('unread')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeFilter === 'unread'
                    ? 'border-[#0B3B24] text-[#0B3B24]'
                    : 'border-transparent text-[#64748B] hover:text-[#1E232A]'
                }`}
              >
                <span>Unread Inquiries</span>
                {unreadNotificationCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Notifications Feed */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FAF8F5]/50">
              {filteredNotifications.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-[#4A5568]">No notifications in this view</div>
                  <p className="text-xs text-[#718096] max-w-xs mx-auto">
                    New RFQ submissions from overseas buyers and proforma quote requests will trigger real-time alerts here.
                  </p>
                  <button
                    type="button"
                    onClick={handleSimulate}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />
                    <span>Trigger Test RFQ</span>
                  </button>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`rounded-xl p-4 border transition-all relative ${
                      !notif.read
                        ? 'bg-white border-[#0B3B24]/40 shadow-sm ring-1 ring-[#0B3B24]/10'
                        : 'bg-white/80 border-[#E8DFC8] opacity-90'
                    }`}
                  >
                    {/* Unread indicator dot */}
                    {!notif.read && (
                      <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                    )}

                    <div className="space-y-2">
                      {/* Top Meta */}
                      <div className="flex items-center justify-between gap-2 pr-4">
                        <span className="text-[10px] font-mono font-bold text-[#0B3B24] bg-[#0B3B24]/10 px-2 py-0.5 rounded">
                          {notif.rfqId}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(notif.timestamp)}</span>
                        </div>
                      </div>

                      {/* Buyer Company */}
                      <div>
                        <div className="text-sm font-extrabold text-[#0B3B24] flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-[#C19B4B] shrink-0" />
                          <span className="truncate">{notif.buyerCompany}</span>
                        </div>
                        <div className="text-xs text-[#4A5568] mt-0.5">
                          Rep: <span className="font-semibold">{notif.buyerName}</span>
                          {notif.buyerCountry && <span className="text-[#718096]"> • {notif.buyerCountry}</span>}
                        </div>
                      </div>

                      {/* Commodities & Volume */}
                      <div className="bg-[#FAF8F5] rounded-lg p-2.5 border border-[#E8DFC8] text-xs space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#64748B] flex items-center gap-1">
                            <Package className="w-3 h-3 text-[#0B3B24]" />
                            Volume:
                          </span>
                          <span className="font-bold text-[#0B3B24]">
                            {notif.volumeMT} MT ({notif.incoterm})
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#64748B] flex items-center gap-1">
                            <Ship className="w-3 h-3 text-emerald-700" />
                            Port:
                          </span>
                          <span className="font-medium text-[#1E232A] truncate max-w-[200px]" title={notif.destinationPort}>
                            {notif.destinationPort.split('(')[0].replace('Port of', '').trim()}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#4A5568] truncate pt-0.5">
                          Items: <span className="font-semibold">{notif.commodities.join(', ')}</span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-1 gap-2">
                        <button
                          type="button"
                          onClick={() => openRFQFromNotification(notif.rfqId)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-[#0B3B24] text-white hover:bg-[#072818] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#E6C687]" />
                          <span>View RFQ Dossier</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => notif.read ? null : markNotificationAsRead(notif.id)}
                          title={notif.read ? 'Already read' : 'Mark as read'}
                          className={`p-1.5 rounded-lg text-xs transition-colors ${
                            notif.read ? 'text-gray-400 hover:text-gray-600' : 'text-[#0B3B24] bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteNotification(notif.id)}
                          title="Delete notification"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            <div className="p-3 bg-[#FAF8F5] border-t border-[#E8DFC8] text-center text-[11px] text-[#64748B]">
              Real-Time WebSocket &amp; Storage Bus Connected • Lagos Apapa Export Terminal
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
