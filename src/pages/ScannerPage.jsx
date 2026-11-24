import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Scan, ArrowUpCircle, ArrowDownCircle, CheckCircle, Package, Clock, User } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { Card, StatusBadge, stagger, fadeUp } from '../components/ui';

export default function ScannerPage() {
  const { inventory, transactions, scanItem } = useInventory();
  const [selectedSku, setSelectedSku] = useState('');
  const [mode, setMode] = useState('OUT');
  const [qty, setQty] = useState(1);
  const [operator, setOperator] = useState('Ravi Kumar');
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);

  const selectedItem = inventory.find(i => i.id === selectedSku);

  const simulateScan = () => {
    let targetSku = selectedSku;
    let targetItem = selectedItem;
    if (!targetSku) {
      const randomItem = inventory[Math.floor(Math.random() * inventory.length)];
      targetSku = randomItem.id;
      targetItem = randomItem;
      setSelectedSku(targetSku);
    }
    setScanning(true);
    setTimeout(() => {
      scanItem({ skuId: targetSku, type: mode, qty: Number(qty), operator, station: 'QR Scan Station' });
      setLastScan({ skuId: targetSku, name: targetItem?.name, type: mode, qty: Number(qty), ts: new Date().toISOString() });
      setScanning(false);
      setQty(1);
    }, 1000);
  };

  return (
    <div className="p-6 lg:p-8">
      <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp}>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Pillar 1</div>
          <h2 className="text-2xl font-bold text-slate-900">Shop Floor Scan Station</h2>
          <p className="text-sm text-slate-500 mt-1">Simulate QR/Barcode scans to log real-time inventory movements.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scanner UI */}
          <motion.div variants={fadeUp}>
            <Card className="p-6">
              {/* QR frame */}
              <div className="relative w-full aspect-square max-w-xs mx-auto mb-6 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
                {/* Corner marks */}
                {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-6 h-6 border-2 border-emerald-400 rounded-sm
                    ${i === 1 || i === 3 ? 'border-l-0' : 'border-r-0'}
                    ${i === 2 || i === 3 ? 'border-t-0' : 'border-b-0'}
                  `} />
                ))}

                {scanning ? (
                  <>
                    {/* Scan line */}
                    <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_2px_#34D399] animate-scan" />
                    <div className="text-emerald-400 text-xs font-mono animate-pulse">SCANNING...</div>
                  </>
                ) : lastScan && selectedSku === lastScan.skuId ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <CheckCircle size={40} className="text-emerald-400 mx-auto mb-2" />
                    <div className="text-white text-xs font-mono">{lastScan.type === 'IN' ? '+ RECEIVED' : '- ISSUED'}</div>
                    <div className="text-emerald-400 text-lg font-bold font-mono">{lastScan.qty} units</div>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <Scan size={40} className="text-slate-500 mx-auto mb-2" />
                    <div className="text-slate-500 text-xs font-mono">READY TO SCAN</div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Mode toggle */}
                <div className="flex rounded-xl overflow-hidden border border-slate-200">
                  {['OUT', 'IN'].map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all
                        ${mode === m
                          ? m === 'OUT' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                          : 'bg-white text-slate-400 hover:bg-slate-50'
                        }`}
                    >
                      {m === 'OUT' ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                      {m === 'IN' ? 'Receive Stock (IN)' : 'Issue to Floor (OUT)'}
                    </button>
                  ))}
                </div>

                {/* SKU Select */}
                <div>
                  <label className="text-xs text-slate-500 font-medium block mb-1.5">Select Material / Scan QR</label>
                  <select
                    value={selectedSku}
                    onChange={e => setSelectedSku(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">— Select SKU —</option>
                    {inventory.map(i => (
                      <option key={i.id} value={i.id}>{i.id} — {i.name}</option>
                    ))}
                  </select>
                </div>

                {/* Qty */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Quantity</label>
                    <input
                      type="number" min={1} value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium block mb-1.5">Operator</label>
                    <select
                      value={operator} onChange={e => setOperator(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      {['Ravi Kumar', 'Priya Sharma', 'Arvind Patel', 'Suresh Nair', 'Meena Joshi'].map(o => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected item info */}
                {selectedItem && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-slate-50 rounded-xl p-3 text-xs space-y-1"
                  >
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Stock</span>
                      <span className="font-mono font-bold text-slate-800">{selectedItem.currentStock} {selectedItem.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">After this scan</span>
                      <span className={`font-mono font-bold ${
                        mode === 'OUT' && selectedItem.currentStock - qty <= selectedItem.reorderPoint ? 'text-red-600' : 'text-emerald-600'
                      }`}>
                        {mode === 'IN' ? selectedItem.currentStock + Number(qty) : Math.max(0, selectedItem.currentStock - Number(qty))} {selectedItem.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status</span>
                      <StatusBadge status={selectedItem.status} />
                    </div>
                  </motion.div>
                )}

                {/* Scan button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={simulateScan}
                  disabled={scanning}
                  className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all
                    ${scanning ? 'bg-slate-200 text-slate-400 cursor-wait' :
                      !selectedSku ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' :
                      mode === 'IN' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
                      'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                >
                  <Scan size={16} />
                  {!selectedSku ? 'Simulate QR Scan (Auto-Select)' : scanning ? 'Processing...' : `Confirm ${mode} Scan`}
                </motion.button>
              </div>
            </Card>
          </motion.div>

          {/* Activity Feed */}
          <motion.div variants={fadeUp}>
            <Card className="h-full overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="font-semibold text-slate-900 text-sm">Live Activity Feed</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                <AnimatePresence>
                  {transactions.slice(0, 20).map((txn, i) => (
                    <motion.div
                      key={txn.id}
                      initial={{ opacity: 0, x: 20, backgroundColor: '#F0FDF4' }}
                      animate={{ opacity: 1, x: 0, backgroundColor: '#FFFFFF' }}
                      transition={{ delay: i === 0 ? 0 : i * 0.04 }}
                      className="flex items-start gap-3 px-4 py-3"
                    >
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5
                        ${txn.type === 'IN' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                        {txn.type === 'IN'
                          ? <ArrowUpCircle size={14} className="text-emerald-600" />
                          : <ArrowDownCircle size={14} className="text-red-500" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${txn.type === 'IN' ? 'text-emerald-700' : 'text-red-600'}`}>
                            {txn.type === 'IN' ? '+' : '-'}{txn.qty}
                          </span>
                          <span className="text-xs font-medium text-slate-700 truncate">{txn.skuName}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <User size={10} /> {txn.operator}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock size={10} />
                            {new Date(txn.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {txn.note && (
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate font-mono">{txn.note}</div>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 flex-shrink-0">{txn.skuId}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
