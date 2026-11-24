import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Truck, Star, Clock, ShoppingCart, MessageCircle, Mail, X, Phone, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { Card, stagger, fadeUp } from '../components/ui';
import { SUPPLIERS } from '../data/mockInventory';

function ReliabilityBar({ score }) {
  const color = score >= 90 ? 'bg-emerald-500' : score >= 75 ? 'bg-amber-400' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-1.5 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className={`font-mono text-xs font-bold ${score >= 90 ? 'text-emerald-600' : score >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
        {score}%
      </span>
    </div>
  );
}

function PODrawer({ item, supplier, onClose, onConfirm, placed }) {
  if (!item || !supplier) return null;
  const orderQty = Math.ceil((item.maxStock - item.currentStock) * 0.8);
  const totalCost = orderQty * item.unitCost;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/30 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.98 }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">Purchase Order</div>
            <div className="font-bold text-slate-900 mt-0.5">PO-{Date.now().toString().slice(-6)}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <X size={18} />
          </button>
        </div>

        {/* PO Content */}
        <div className="p-5 space-y-4">
          {/* From / To */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-xs text-slate-400 font-medium mb-1">FROM</div>
              <div className="font-semibold text-slate-900">Your Manufacturing Unit</div>
              <div className="text-xs text-slate-500 mt-0.5">GSTIN: 27AAAPL1234R1Z5</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-xs text-slate-400 font-medium mb-1">TO</div>
              <div className="font-semibold text-slate-900">{supplier.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{supplier.location}</div>
            </div>
          </div>

          {/* Item line */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs text-slate-500 font-medium">Item</th>
                  <th className="px-3 py-2 text-right text-xs text-slate-500 font-medium">Qty</th>
                  <th className="px-3 py-2 text-right text-xs text-slate-500 font-medium">Unit Cost</th>
                  <th className="px-3 py-2 text-right text-xs text-slate-500 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-3">
                    <div className="font-medium text-slate-800">{item.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{item.id}</div>
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-semibold text-slate-800">{orderQty}</td>
                  <td className="px-3 py-3 text-right font-mono text-slate-600">₹{item.unitCost.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">₹{totalCost.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50">
                <tr>
                  <td colSpan={3} className="px-3 py-2 text-right text-xs font-semibold text-slate-700">Order Total (incl. GST 18%)</td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                    ₹{Math.round(totalCost * 1.18).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Clock size={12} />
            Expected delivery: {supplier.promisedLeadDays} business days from confirmation
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onConfirm('whatsapp')}
              disabled={placed}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${placed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
            >
              <MessageCircle size={15} />
              {placed ? 'Sent via WhatsApp ✓' : 'Send via WhatsApp'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onConfirm('email')}
              disabled={placed}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all
                ${placed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'}`}
            >
              <Mail size={15} />
              {placed ? 'Email Sent ✓' : 'Send via Email'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SuppliersPage() {
  const { inventory, generatePO, poItems, addToast } = useInventory();
  const [poDrawer, setPODrawer] = useState(null); // { item, supplier }
  const [poPlaced, setPOPlaced] = useState({});

  const getSupplierForItem = (item) => SUPPLIERS.find(s => s.id === item.supplierId);

  const handleGeneratePO = (item) => {
    const supplier = getSupplierForItem(item);
    if (supplier) setPODrawer({ item, supplier });
  };

  const handleConfirmPO = (method) => {
    const { item } = poDrawer;
    generatePO(item.id);
    setPOPlaced(prev => ({ ...prev, [item.id]: method }));
    addToast(`📤 PO sent via ${method === 'whatsapp' ? 'WhatsApp' : 'Email'} to ${poDrawer.supplier.name}`, 'success');
  };

  const alertItems = inventory.filter(i => i.status === 'reorder' || i.status === 'stockout');

  return (
    <div className="p-6 lg:p-8">
      <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div variants={fadeUp}>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Pillar 4</div>
          <h2 className="text-2xl font-bold text-slate-900">Supplier Sync & Digital PO Generator</h2>
          <p className="text-sm text-slate-500 mt-1">Vendor scorecards, reliability tracking, and 1-click digital POs with WhatsApp/Email dispatch.</p>
        </motion.div>

        {/* Low Stock Alert + Quick PO */}
        {alertItems.length > 0 && (
          <motion.div variants={fadeUp}>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={15} className="text-amber-500" />
                <div className="font-semibold text-sm text-slate-900">Items Needing PO — {alertItems.length} pending</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {alertItems.map(item => {
                  const supplier = getSupplierForItem(item);
                  const placed = !!poItems[item.id] || !!poPlaced[item.id];
                  return (
                    <div key={item.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm
                        ${item.status === 'stockout' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-800 truncate">{item.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{item.id} · Stock: {item.currentStock}</div>
                      </div>
                      <button
                        onClick={() => handleGeneratePO(item)}
                        disabled={placed}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                          ${placed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                      >
                        <ShoppingCart size={12} />
                        {placed ? 'Placed ✓' : 'Generate PO'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Vendor Scorecards */}
        <motion.div variants={fadeUp}>
          <div className="text-sm font-semibold text-slate-700 mb-3">Vendor Scorecards</div>
          <div className="grid md:grid-cols-2 gap-4">
            {SUPPLIERS.map((sup, i) => {
              const lag = sup.actualLeadDays - sup.promisedLeadDays;
              const lagColor = lag <= 0 ? 'text-emerald-600' : lag <= 1 ? 'text-amber-600' : 'text-red-600';
              const relatedItems = inventory.filter(item => item.supplierId === sup.id);

              return (
                <motion.div
                  key={sup.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    {/* Top */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-semibold text-slate-900">{sup.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <span>{sup.location}</span>
                          <span className="text-slate-200">·</span>
                          <span className="font-mono">{sup.id}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={12} fill={j < Math.round(sup.rating) ? 'currentColor' : 'none'} />
                        ))}
                        <span className="font-mono text-xs text-slate-500 ml-1">{sup.rating}</span>
                      </div>
                    </div>

                    {/* Lead time comparison */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                        <div className="text-xs text-slate-400">Promised Lead Time</div>
                        <div className="font-mono text-lg font-bold text-slate-900 mt-0.5">{sup.promisedLeadDays}d</div>
                      </div>
                      <div className={`rounded-lg p-2.5 text-center ${lag <= 0 ? 'bg-emerald-50' : lag <= 1 ? 'bg-amber-50' : 'bg-red-50'}`}>
                        <div className="text-xs text-slate-400">Actual Lead Time</div>
                        <div className={`font-mono text-lg font-bold mt-0.5 ${lagColor}`}>{sup.actualLeadDays}d</div>
                        {lag > 0 && <div className={`text-[10px] font-mono ${lagColor}`}>+{lag.toFixed(1)}d lag</div>}
                        {lag <= 0 && <div className="text-[10px] font-mono text-emerald-600">On time ✓</div>}
                      </div>
                    </div>

                    {/* Reliability */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                        <span>Reliability Score</span>
                        <span className="font-mono">{sup.onTimeDeliveries}/{sup.totalOrders} on-time</span>
                      </div>
                      <ReliabilityBar score={sup.reliabilityScore} />
                    </div>

                    {/* Backup supplier */}
                    {sup.backupSupplierName && (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs text-blue-700 mb-3">
                        🔄 Backup: <span className="font-semibold">{sup.backupSupplierName}</span>
                      </div>
                    )}

                    {/* Linked items */}
                    {relatedItems.length > 0 && (
                      <div className="text-xs text-slate-400 mb-3">
                        Supplies: {relatedItems.map(i => <span key={i.id} className="font-mono bg-slate-100 px-1.5 py-0.5 rounded mr-1">{i.id}</span>)}
                      </div>
                    )}

                    {/* Contact + PO */}
                    <div className="flex gap-2">
                      <a href={`https://wa.me/${sup.whatsapp}`}
                        className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                        onClick={e => e.preventDefault()}
                      >
                        <Phone size={12} /> Contact
                      </a>
                      <button
                        onClick={() => {
                          const item = relatedItems.find(i => i.status === 'reorder' || i.status === 'stockout') || relatedItems[0];
                          if (item) handleGeneratePO(item);
                        }}
                        disabled={!relatedItems.length}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        <ShoppingCart size={12} />
                        Generate PO
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* PO Drawer */}
      <AnimatePresence>
        {poDrawer && (
          <PODrawer
            item={poDrawer.item}
            supplier={poDrawer.supplier}
            placed={!!poPlaced[poDrawer.item?.id]}
            onClose={() => setPODrawer(null)}
            onConfirm={handleConfirmPO}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
