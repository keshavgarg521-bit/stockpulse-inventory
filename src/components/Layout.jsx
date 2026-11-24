import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, LayoutDashboard, Scan, TrendingUp, Layers, Truck,
  ChevronRight, Bell, Settings, RotateCcw, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

const NAV = [
  { id: 'landing', label: 'Overview', icon: Zap },
  { id: 'dashboard', label: 'Live Dashboard', icon: LayoutDashboard },
  { id: 'scanner', label: 'Scan Station', icon: Scan },
  { id: 'rop', label: 'ROP Engine', icon: TrendingUp },
  { id: 'abc', label: 'ABC-VED', icon: Layers },
  { id: 'suppliers', label: 'Suppliers & PO', icon: Truck },
];

export default function Layout({ activePage, setActivePage, children }) {
  const { reorderAlerts, stockouts, resetData } = useInventory();
  const [mobileOpen, setMobileOpen] = useState(false);

  const alertCount = reorderAlerts.length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-60 bg-white border-r border-slate-200
        flex flex-col transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm leading-tight tracking-tight">StockPulse</div>
            <div className="text-[10px] text-slate-400 font-mono tracking-wider">INVENTORY OS</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2 mb-2">Navigation</div>
          {NAV.map(item => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setActivePage(item.id); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5 text-left
                  ${active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <Icon size={16} className={active ? 'text-white' : 'text-slate-400'} />
                <span className="flex-1">{item.label}</span>
                {item.id === 'dashboard' && alertCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {alertCount}
                  </span>
                )}
                {active && <ChevronRight size={14} className="text-slate-400" />}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          {stockouts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
              <div className="text-xs font-semibold text-red-700 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {stockouts.length} Stockout{stockouts.length > 1 ? 's' : ''}
              </div>
              <div className="text-[11px] text-red-500 mt-0.5 truncate">{stockouts[0]?.name}</div>
            </div>
          )}
          <button
            onClick={resetData}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            <RotateCcw size={13} />
            Reset Demo Data
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/20 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-900">
              {NAV.find(n => n.id === activePage)?.label || 'StockPulse'}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Live ticker */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 overflow-hidden max-w-xs">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
            <div className="overflow-hidden w-48">
              <div className="animate-ticker whitespace-nowrap text-xs text-slate-500 font-mono">
                SKU-001 42 units · SKU-003 STOCKOUT · SKU-011 STOCKOUT · SKU-008 REORDER · 
                SKU-001 42 units · SKU-003 STOCKOUT · SKU-011 STOCKOUT · SKU-008 REORDER · 
              </div>
            </div>
          </div>

          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600">
            <Bell size={18} />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600">
            <Settings size={18} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
