import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, Filter, TrendingDown, Package, AlertCircle, CheckCircle } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer
} from 'recharts';
import { useInventory } from '../context/InventoryContext';
import { AnimatedCounter, StatusBadge, ABCBadge, StockBar, Card, stagger, fadeUp } from '../components/ui';
import { STOCK_HISTORY } from '../data/mockInventory';

const KPI = ({ label, value, prefix, suffix, decimals, sub, color, isAlert, alertCount }) => (
  <motion.div variants={fadeUp}>
    <Card className="p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400 font-medium">{label}</div>
        {isAlert && alertCount > 0 && (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold font-mono ${color || 'text-slate-900'}`}>
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      {sub && <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">{sub}</div>}
    </Card>
  </motion.div>
);

export default function Dashboard() {
  const { inventory, totalValue, reorderAlerts } = useInventory();
  const [search, setSearch] = useState('');
  const [abcFilter, setAbcFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = inventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchAbc = abcFilter === 'all' || item.abcClass === abcFilter;
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchAbc && matchStatus;
  });

  const accuracyPct = ((inventory.length - inventory.filter(i => i.status === 'stockout').length) / inventory.length * 100);
  const savedCapital = inventory.filter(i => i.status !== 'overstocked').reduce((s, i) => s + (i.maxStock - i.currentStock) * i.unitCost * 0.15, 0);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* KPI Strip */}
      <motion.div variants={stagger} initial="initial" animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total Inventory Value" value={totalValue} prefix="₹" suffix="" color="text-slate-900"
          sub="Across all SKUs" />
        <KPI label="Active Reorder Alerts" value={reorderAlerts.length} color="text-amber-600"
          isAlert={true} alertCount={reorderAlerts.length}
          sub={<><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" /> {reorderAlerts.filter(i => i.status === 'stockout').length} critical stockouts</>} />
        <KPI label="Working Capital Saved" value={savedCapital} prefix="₹" color="text-emerald-600"
          sub="vs. overstock baseline" />
        <KPI label="Inventory Accuracy" value={accuracyPct} suffix="%" decimals={1} color="text-blue-600"
          sub="98.4% industry benchmark" />
      </motion.div>

      {/* Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-semibold text-slate-900 text-sm">Consumption vs. Stock Levels (7 Days)</div>
            <div className="text-xs text-slate-400 mt-0.5">ROP threshold lines shown as dashed reference</div>
          </div>
          <div className="flex gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 rounded" />Steel</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 rounded" />Hyd. Oil</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={STOCK_HISTORY} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gSteel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gOil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ fontWeight: 600, color: '#0F172A' }}
            />
            <ReferenceLine y={50} stroke="#D97706" strokeDasharray="4 2" label={{ value: 'ROP Steel', fill: '#D97706', fontSize: 10 }} />
            <ReferenceLine y={100} stroke="#D97706" strokeDasharray="4 2" label={{ value: 'ROP Oil', fill: '#D97706', fontSize: 10 }} />
            <Area type="monotone" dataKey="steelSheets" stroke="#3B82F6" strokeWidth={2} fill="url(#gSteel)" name="Steel Sheets" dot={false} />
            <Area type="monotone" dataKey="hydraulicOil" stroke="#059669" strokeWidth={2} fill="url(#gOil)" name="Hydraulic Oil" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search SKU or name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'A', 'B', 'C'].map(f => (
              <button key={f}
                onClick={() => setAbcFilter(f)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${abcFilter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
              >
                {f === 'all' ? 'All ABC' : `Class ${f}`}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Status' },
              { id: 'healthy', label: 'Healthy' },
              { id: 'reorder', label: 'Reorder Now' },
              { id: 'overstocked', label: 'Overstocked' },
              { id: 'stockout', label: 'Stockout' }
            ].map(f => (
              <button key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${statusFilter === f.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['SKU', 'Item', 'ABC', 'Stock', 'Level', 'ROP', 'Value', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${item.status === 'stockout' ? 'bg-red-50/30' : ''}`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 whitespace-nowrap">{item.name}</div>
                    <div className="text-xs text-slate-400">{item.category}</div>
                  </td>
                  <td className="px-4 py-3"><ABCBadge cls={item.abcClass} /></td>
                  <td className="px-4 py-3 font-mono text-sm font-semibold">
                    <span className={item.currentStock === 0 ? 'text-red-600' : item.currentStock <= item.reorderPoint ? 'text-amber-600' : 'text-slate-900'}>
                      {item.currentStock}
                    </span>
                    <span className="text-slate-300 mx-1">/</span>
                    <span className="text-slate-400 text-xs">{item.maxStock} {item.unit}</span>
                  </td>
                  <td className="px-4 py-3 w-32">
                    <StockBar current={item.currentStock} max={item.maxStock} rop={item.reorderPoint} status={item.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.reorderPoint}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">
                    ₹{(item.currentStock * item.unitCost).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">No items match your filters.</div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
          Showing {filtered.length} of {inventory.length} SKUs
        </div>
      </Card>
    </div>
  );
}
