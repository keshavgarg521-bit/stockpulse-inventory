import { motion } from 'framer-motion';
import { useState } from 'react';
import { Package, Layers, AlertCircle, RefreshCw } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { Card, ABCBadge, StatusBadge, stagger, fadeUp } from '../components/ui';

const ABC_INFO = {
  A: {
    label: 'Class A — High Value',
    color: 'bg-slate-900 text-white',
    borderColor: 'border-slate-900',
    bgColor: 'bg-slate-50',
    desc: '~70% of total spend. Daily tracking, tight safety stocks, priority reorder.',
    track: 'Daily tracking required',
    badge: 'bg-slate-900 text-white',
  },
  B: {
    label: 'Class B — Moderate Value',
    color: 'bg-slate-500 text-white',
    borderColor: 'border-slate-400',
    bgColor: 'bg-slate-50',
    desc: '~20% of spend. Weekly review, moderate safety stocks.',
    track: 'Weekly tracking',
    badge: 'bg-slate-200 text-slate-700',
  },
  C: {
    label: 'Class C — Low Value',
    color: 'bg-slate-200 text-slate-700',
    borderColor: 'border-slate-200',
    bgColor: 'bg-slate-50',
    desc: '~10% of spend. Two-bin system, bulk procurement, minimal admin.',
    track: 'Two-Bin System',
    badge: 'bg-slate-100 text-slate-500',
  },
};

function TwoBinVisual({ item, onToggle }) {
  const bin1Empty = item.binStatus === 'bin1_empty';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-mono text-xs text-slate-400">{item.id}</div>
          <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="flex gap-3 mb-3">
        {/* Bin 1 */}
        <motion.div
          layout
          className={`flex-1 rounded-xl border-2 p-3 text-center transition-all ${
            bin1Empty
              ? 'border-red-300 bg-red-50'
              : 'border-emerald-300 bg-emerald-50'
          }`}
        >
          <div className={`text-lg font-bold font-mono ${bin1Empty ? 'text-red-600' : 'text-emerald-700'}`}>
            {bin1Empty ? '∅' : Math.ceil(item.currentStock / 2)}
          </div>
          <div className={`text-xs font-semibold mt-0.5 ${bin1Empty ? 'text-red-600' : 'text-emerald-700'}`}>
            BIN 1 {bin1Empty ? '— EMPTY' : '— ACTIVE'}
          </div>
        </motion.div>

        {/* Bin 2 */}
        <div className="flex-1 rounded-xl border-2 border-slate-300 bg-slate-50 p-3 text-center">
          <div className="text-lg font-bold font-mono text-slate-700">
            {bin1Empty ? item.currentStock : Math.floor(item.currentStock / 2)}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-0.5">
            BIN 2 — {bin1Empty ? 'NOW ACTIVE' : 'RESERVE'}
          </div>
        </div>
      </div>

      <button
        onClick={() => onToggle(item.id)}
        className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
          bin1Empty
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
        }`}
      >
        <RefreshCw size={12} />
        {bin1Empty ? 'Bin 1 Restocked — Mark Full' : 'Mark Bin 1 as Empty'}
      </button>

      {bin1Empty && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-700 text-center font-medium"
        >
          🔔 Auto-queued for restock — Bin 2 is now active
        </motion.div>
      )}
    </div>
  );
}

export default function ABCPage() {
  const { inventory, totalValue, toggleBin } = useInventory();

  const classA = inventory.filter(i => i.abcClass === 'A');
  const classB = inventory.filter(i => i.abcClass === 'B');
  const classC = inventory.filter(i => i.abcClass === 'C');

  const valueA = classA.reduce((s, i) => s + i.currentStock * i.unitCost, 0);
  const valueB = classB.reduce((s, i) => s + i.currentStock * i.unitCost, 0);
  const valueC = classC.reduce((s, i) => s + i.currentStock * i.unitCost, 0);

  const classCItems = inventory.filter(i => i.abcClass === 'C');

  return (
    <div className="p-6 lg:p-8">
      <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp}>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Pillar 3</div>
          <h2 className="text-2xl font-bold text-slate-900">ABC-VED Prioritization</h2>
          <p className="text-sm text-slate-500 mt-1">Focus control effort where the value is. Class A = daily tracking, Class C = Two-Bin system.</p>
        </motion.div>

        {/* ABC Summary Bars */}
        <motion.div variants={fadeUp}>
          <Card className="p-5">
            <div className="text-sm font-semibold text-slate-900 mb-4">Inventory Value Distribution</div>
            <div className="space-y-3">
              {[
                { cls: 'A', items: classA, value: valueA, label: 'High Value — Daily Track' },
                { cls: 'B', items: classB, value: valueB, label: 'Moderate — Weekly Review' },
                { cls: 'C', items: classC, value: valueC, label: 'Low Value — Two-Bin System' },
              ].map(({ cls, items, value, label }) => {
                const pct = totalValue > 0 ? (value / totalValue * 100) : 0;
                return (
                  <div key={cls} className="flex items-center gap-4">
                    <ABCBadge cls={cls} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">{label}</span>
                        <span className="font-mono text-slate-500">₹{value.toLocaleString('en-IN')} ({pct.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-2 rounded-full ${cls === 'A' ? 'bg-slate-900' : cls === 'B' ? 'bg-slate-500' : 'bg-slate-300'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono w-16 text-right">{items.length} SKUs</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Class Sections */}
        {[
          { cls: 'A', items: classA },
          { cls: 'B', items: classB },
        ].map(({ cls, items }) => (
          <motion.div key={cls} variants={fadeUp}>
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mb-3 ${ABC_INFO[cls].bgColor} border ${ABC_INFO[cls].borderColor}`}>
              <ABCBadge cls={cls} />
              <div>
                <div className="font-semibold text-slate-900 text-sm">{ABC_INFO[cls].label}</div>
                <div className="text-xs text-slate-500">{ABC_INFO[cls].desc}</div>
              </div>
              <div className="ml-auto bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded">
                {ABC_INFO[cls].track}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {items.map(item => (
                <Card key={item.id} className="p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono text-xs text-slate-400">{item.id}</div>
                      <div className="font-semibold text-slate-900 text-sm mt-0.5">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.category} · {item.supplier}</div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Stock', value: `${item.currentStock} ${item.unit}`, mono: true },
                      { label: 'Value', value: `₹${(item.currentStock * item.unitCost).toLocaleString('en-IN')}`, mono: true },
                      { label: 'ROP', value: item.reorderPoint, mono: true },
                    ].map((s, i) => (
                      <div key={i} className="bg-slate-50 rounded-lg p-2">
                        <div className="text-xs text-slate-400">{s.label}</div>
                        <div className="font-mono text-xs font-bold text-slate-800 mt-0.5">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Class C — Two-Bin System */}
        <motion.div variants={fadeUp}>
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl mb-3 bg-slate-50 border border-slate-200`}>
            <ABCBadge cls="C" />
            <div>
              <div className="font-semibold text-slate-900 text-sm">Class C — Low Value Items</div>
              <div className="text-xs text-slate-500">Two-Bin system: when Bin 1 is empty, switch to Bin 2 and auto-queue restock.</div>
            </div>
            <div className="ml-auto bg-slate-200 text-slate-700 text-[10px] font-mono px-2 py-1 rounded">
              Two-Bin System
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {classCItems.map(item => (
              <TwoBinVisual key={item.id} item={item} onToggle={toggleBin} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
