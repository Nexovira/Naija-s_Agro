import React, { useState } from 'react';
import { useCMS } from '../../../context/CMSContext';
import { TransitRoute } from '../../../types';
import { Save, Check, Plus, Trash2, Ship, Clock } from 'lucide-react';

export const PortsShippingCMSTab: React.FC = () => {
  const { data, updateSupplyChain } = useCMS();
  const [routes, setRoutes] = useState<TransitRoute[]>(data.transitRoutes || []);
  const [newPort, setNewPort] = useState('');
  const [newTransit, setNewTransit] = useState('');
  const [newFreq, setNewFreq] = useState('Weekly Direct Carrier');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddRoute = () => {
    if (!newPort.trim() || !newTransit.trim()) return;
    const newRoute: TransitRoute = {
      id: `route-${Date.now()}`,
      port: newPort.trim(),
      transit: newTransit.trim(),
      frequency: newFreq.trim()
    };
    setRoutes([...routes, newRoute]);
    setNewPort('');
    setNewTransit('');
  };

  const handleRemoveRoute = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
  };

  const handleRouteFieldChange = (idx: number, field: keyof TransitRoute, val: string) => {
    const updated = [...routes];
    if (updated[idx]) {
      updated[idx] = { ...updated[idx], [field]: val };
      setRoutes(updated);
    }
  };

  const handleSave = async () => {
    await updateSupplyChain(data.supplyChainSteps, routes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B3B24] tracking-tight">
            Destination Seaports &amp; Transit Times CMS
          </h1>
          <p className="text-xs text-[#718096] mt-0.5">
            Manage supported international container discharge seaports and maritime transit estimates from Lagos (Apapa Port).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-4 h-4" />
              <span>Transit Schedules Saved</span>
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#E6C687]" />
            <span>Save Shipping Routes</span>
          </button>
        </div>
      </div>

      {/* Add Route Form */}
      <div className="bg-white p-6 rounded-2xl border border-[#E0D8C8] shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#0B3B24] flex items-center gap-2">
          <Ship className="w-4 h-4 text-emerald-700" />
          <span>Add Global Destination Seaport Route</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={newPort}
            onChange={(e) => setNewPort(e.target.value)}
            placeholder="e.g. Port of Hamburg (Germany) - DE HAM"
            className="px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
          />
          <input
            type="text"
            value={newTransit}
            onChange={(e) => setNewTransit(e.target.value)}
            placeholder="e.g. 19 - 23 Days"
            className="px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newFreq}
              onChange={(e) => setNewFreq(e.target.value)}
              placeholder="e.g. Weekly Direct CMA CGM"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#D9D0BE] bg-[#FAF8F5] text-xs text-[#1E232A] focus:bg-white focus:ring-2 focus:ring-[#0B3B24]"
            />
            <button
              onClick={handleAddRoute}
              className="px-4 py-2.5 rounded-xl bg-[#0B3B24] text-white text-xs font-bold hover:bg-[#072818] shrink-0"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Routes List Table */}
      <div className="bg-white rounded-2xl border border-[#E0D8C8] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#EFE9DF] bg-[#FAF8F5] text-xs font-bold text-[#0B3B24] uppercase tracking-wider">
          Active Maritime Shipping Routes ({routes.length})
        </div>
        <div className="divide-y divide-[#EFE9DF]">
          {routes.map((route, idx) => (
            <div key={route.id || idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5]">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#718096] mb-0.5">Seaport Name &amp; Code</label>
                  <input
                    type="text"
                    value={route.port}
                    onChange={(e) => handleRouteFieldChange(idx, 'port', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9D0BE] bg-white text-xs font-bold text-[#1E232A]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#718096] mb-0.5">Transit Duration</label>
                  <input
                    type="text"
                    value={route.transit}
                    onChange={(e) => handleRouteFieldChange(idx, 'transit', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9D0BE] bg-white text-xs font-extrabold text-[#0B3B24]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#718096] mb-0.5">Carrier Frequency</label>
                  <input
                    type="text"
                    value={route.frequency}
                    onChange={(e) => handleRouteFieldChange(idx, 'frequency', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#D9D0BE] bg-white text-xs text-[#8C7A5B]"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRemoveRoute(route.id || '')}
                className="p-2 rounded-lg text-red-600 hover:bg-red-50 self-end sm:self-center"
                title="Remove Route"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
