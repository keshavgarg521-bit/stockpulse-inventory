import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calculator, ShoppingCart, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { Card, StatusBadge, stagger, fadeUp } from '../components/ui';

function ROPCalculator({ item, onUpdate }) {
  const [dailyUsage, setDailyUsage] = useState(item.dailyUsage);
  const [leadTime, setLeadTime] = useState(item.leadTimeDays);
  const [safetyStock, setSafetyStock] = useState(item.safetyStock);
  const [expanded, setExpanded] = useState(false);

  const rop = (dailyUsage * leadTime) + safetyStock;
  const demandCoverage = leadTime * dailyUsage;
  const liveStatus = item.currentStock === 0 ? 'stockout' : item.currentStock <= rop ? 'reorder' : item.currentStock > item.maxStock * 0.9 ? 'overstocked' : 'healthy';

  const updateParam = (type, val) => {
    let d = dailyUsage, l = leadTime, s = safetyStock;
    if (type === 'dailyUsage') { setDailyUsage(val); d = val; }
    if (type === 'leadTime') { setLeadTime(val); l = val; }
    if (type === 'safetyStock') { setSafetyStock(val); s = val; }
    onUpdate({ skuId: item.id, dailyUsage: d, leadTimeDays: l, safetyStock: s });
  };

  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-md ${liveStatus === 'stockout' ? 'border-red-200' : liveStatus === 'reorder' ? 'border-amber-200' : ''}`}>
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400">{item.id}</span>
            <StatusBadge status={liveStatus} />
          </div>
          <div className="font-semibold text-slate-900 text-sm mt-0.5 truncate">{item.name}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-slate-400">Live ROP</div>
          <div className={`text-lg font-bold font-mono ${item.currentStock <= rop ? 'text-amber-600' : 'text-slate-900'}`}>
            {rop}
          </div>
          <div className="text-xs text-slate-400">units (Stock: {item.currentStock})</div>
        </div>
        <div className="text-slate-400 ml-2">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-slate-100 p-4 space-y-5"
        >
          {/* Formula display */}
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-center">
            <div className="text-slate-400 text-xs mb-2">Live ROP Formula Breakdown</div>
            <div className="text-white text-base">
              <span className="text-blue-400 font-bold">{dailyUsage}</span>
              <span className="text-slate-400 text-xs"> (Daily Use)</span>
              <span className="text-slate-400"> × </span>
              <span className="text-emerald-400 font-bold">{leadTime}d</span>
              <span className="text-slate-400 text-xs"> (Lead Time)</span>
              <span className="text-slate-400"> + </span>
              <span className="text-amber-400 font-bold">{safetyStock}</span>
              <span className="text-slate-400 text-xs"> (Safety)</span>
              <span className="text-slate-400"> = </span>
              <span className={`font-bold text-xl ${item.currentStock <= rop ? 'text-amber-400' : 'text-emerald-400'}`}>{rop}</span>
            </div>
            <div className="text-slate-400 text-xs mt-1.5 flex items-center justify-center gap-2">
              <span>Threshold Status:</span>
              <StatusBadge status={liveStatus} />
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {[
              { label: 'Average Daily Usage', key: 'dailyUsage', value: dailyUsage, min: 1, max: 100, unit: item.unit, color: 'text-blue-500' },
              { label: 'Supplier Lead Time (Days)', key: 'leadTime', value: leadTime, min: 1, max: 30, unit: 'days', color: 'text-emerald-500' },
              { label: 'Safety Stock Buffer', key: 'safetyStock', value: safetyStock, min: 0, max: 100, unit: item.unit, color: 'text-amber-500' },
            ].map(({ label, key, value, min, max, unit, color }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-slate-500 font-medium">{label}</label>
                  <span className={`font-mono text-sm font-bold ${color}`}>{value} <span className="text-slate-400 font-normal text-xs">{unit}</span></span>
                </div>
                <input
                  type="range" min={min} max={max} value={value}
                  onChange={e => updateParam(key, Number(e.target.value))}
                  className="w-full h-1.5 appearance-none rounded-full bg-slate-200 cursor-pointer accent-slate-900"
                />
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Demand in Lead Time', value: `${demandCoverage} ${item.unit}`, sub: `${dailyUsage} × ${leadTime}d` },
              { label: 'Current Shop Stock', value: `${item.currentStock} ${item.unit}`, sub: `Threshold: ${rop}` },
              { label: 'Buffer Gap', value: `${Math.abs(item.currentStock - rop)} ${item.unit}`, sub: item.currentStock <= rop ? 'Deficit' : 'Surplus' },
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-2.5 text-center">
                <div className="font-mono text-sm font-bold text-slate-800">{s.value}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{s.label}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </Card>
  );
}

export default function ROPPage({ setActivePage }) {
  const { inventory, reorderAlerts, updateROP, generatePO, poItems } = useInventory();

  return (
    <div className="p-6 lg:p-8">
      <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp}>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Pillar 2</div>
          <h2 className="text-2xl font-bold text-slate-900">Automated Reorder Point Engine</h2>
          <p className="text-sm text-slate-500 mt-1">Adjust sliders to recalculate ROP in real time for any SKU.</p>
        </motion.div>

        {/* Alert Feed */}
        {reorderAlerts.length > 0 && (
          <motion.div variants={fadeUp}>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-amber-500" />
                <div className="font-semibold text-slate-900 text-sm">
                  Automated Alert Feed — {reorderAlerts.length} item{reorderAlerts.length > 1 ? 's' : ''} at or below ROP
                </div>
              </div>
              <div className="space-y-2">
                {reorderAlerts.map(item => (
                  <div key={item.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm
                    ${item.status === 'stockout' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 animate-pulse ${item.status === 'stockout' ? 'bg-red-500' : 'bg-amber-400'}`} />
                    <span className="font-mono text-xs text-slate-500">{item.id}</span>
                    <span className="font-medium text-slate-800 flex-1 truncate">{item.name}</span>
                    <span className={`font-mono text-xs font-bold ${item.status === 'stockout' ? 'text-red-700' : 'text-amber-700'}`}>
                      {item.currentStock}/{item.reorderPoint} ROP
                    </span>
                    <button
                      onClick={() => generatePO(item.id)}
                      disabled={!!poItems[item.id]}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                        ${poItems[item.id]
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                    >
                      <ShoppingCart size={12} />
                      {poItems[item.id] ? 'Order Placed ✓' : '1-Click Generate PO'}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ROP Calculators */}
        <motion.div variants={fadeUp} className="space-y-3">
          <div className="text-sm font-semibold text-slate-700 mb-2">Interactive ROP Calculator — All SKUs</div>
          {inventory.map(item => (
            <ROPCalculator key={item.id} item={item} onUpdate={updateROP} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
