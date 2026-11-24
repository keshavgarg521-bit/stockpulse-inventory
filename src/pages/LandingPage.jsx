import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, AlertTriangle, CheckCircle, TrendingDown, Package, Eye, Zap } from 'lucide-react';
import { useState } from 'react';
import { stagger, fadeUp } from '../components/ui';

const PAIN_POINTS = [
  {
    icon: Eye,
    color: 'text-red-500 bg-red-50',
    title: 'Zero Real-Time Visibility',
    desc: 'End-of-day manual entries create shop-floor blind spots. By the time you know stock is low, the line is already down.',
    impact: '4–8 hrs downtime per incident',
  },
  {
    icon: TrendingDown,
    color: 'text-amber-500 bg-amber-50',
    title: 'Guesswork Purchasing',
    desc: 'Panic-buying on incomplete data ties up working capital in overstock while critical items go short simultaneously.',
    impact: '20–30% capital locked in deadstock',
  },
  {
    icon: AlertTriangle,
    color: 'text-orange-500 bg-orange-50',
    title: 'Unbuffered Lead Times',
    desc: 'No system to track promised vs. actual delivery. Single vendor dependency halts entire assembly lines on delay.',
    impact: '₹1.2–2L revenue lost per halt',
  },
  {
    icon: Package,
    color: 'text-purple-500 bg-purple-50',
    title: 'Phantom Inventory & Shrinkage',
    desc: 'Unrecorded scrap, miscounts, and informal "borrowing" creates ghost stock. The register says 50 — the shelf has 12.',
    impact: '3–8% annual inventory shrinkage',
  },
];

const COMPARISON = [
  {
    pain: 'Paper register updated at shift end',
    solution: 'Live QR scan on every IN/OUT movement',
    metric: '< 2 sec update latency',
  },
  {
    pain: 'Manager estimates reorder by gut feel',
    solution: 'ROP = (Daily Usage × Lead Time) + Safety Stock',
    metric: '50–70% fewer stockouts',
  },
  {
    pain: 'Single vendor, no backup plan',
    solution: 'Vendor scorecards + 1-click backup PO',
    metric: '98% supply continuity',
  },
  {
    pain: 'Everything treated with equal urgency',
    solution: 'ABC-VED tiering: A-class tracked daily',
    metric: '15–25% freed working capital',
  },
  {
    pain: 'No audit trail — who took what?',
    solution: 'Full timestamped transaction log with operator ID',
    metric: '98.4%+ inventory accuracy',
  },
];

export default function LandingPage({ setActivePage }) {
  const [activeComparison, setActiveComparison] = useState('solution');
  const [alertVisible, setAlertVisible] = useState(true);

  return (
    <div className="min-h-full">
      {/* Hero */}
      <section className="relative px-6 lg:px-12 pt-16 pb-20 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-mono px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Localized Supply Chain OS — Built for Indian Manufacturing SMEs
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
            End Factory Floor<br />
            Blind Spots.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-400">
              Zero Stockouts. Zero Overstock.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-2xl mb-10 leading-relaxed">
            StockPulse replaces paper registers and spreadsheets with a live, intelligent inventory OS — giving shop-floor managers real-time visibility, automated reorder triggers, and instant digital POs from any device.
          </motion.p>

          {/* Live alert preview */}
          <motion.div variants={fadeUp} className="mb-10">
            {alertVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="inline-flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 shadow-sm"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <div>
                  <div className="text-sm font-semibold text-red-800">🚨 STOCKOUT — Bearing 6205 ZZ</div>
                  <div className="text-xs text-red-500 font-mono">SKU-011 · 0 units · Last seen 7h ago · Festo Bay 2 halted</div>
                </div>
                <button
                  onClick={() => setActivePage('rop')}
                  className="ml-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Generate PO →
                </button>
              </motion.div>
            )}
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActivePage('dashboard')}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
            >
              <Zap size={16} />
              Launch Live Floor Dashboard
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-3 rounded-xl border border-slate-200 transition-colors text-sm"
            >
              Explore the Problem
              <ChevronDown size={16} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl"
        >
          {[
            { label: 'Less Downtime', value: '65%', color: 'text-emerald-600' },
            { label: 'Capital Freed', value: '₹8.4L', color: 'text-blue-600' },
            { label: 'Inventory Accuracy', value: '98.4%', color: 'text-slate-900' },
            { label: 'PO Generation', value: '<30s', color: 'text-amber-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="px-6 lg:px-12 py-16 bg-white border-y border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">The Visibility Lag</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Why Manual Tracking Breaks Manufacturing</h2>
          <p className="text-slate-500 max-w-2xl mb-12">
            Every small manufacturing unit running on paper registers or Excel faces the same four compounding failures. Here's what they cost.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl">
          {PAIN_POINTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${p.color}`}>
                  <Icon size={18} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-3">{p.desc}</p>
                <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1">
                  <AlertTriangle size={12} className="text-red-500" />
                  <span className="text-xs text-red-600 font-medium font-mono">{p.impact}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Solution Comparison */}
      <section className="px-6 lg:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">The StockPulse Solution</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Old Way vs. StockPulse</h2>
          <p className="text-slate-500 max-w-2xl mb-8">
            See exactly how each pain point is eliminated with measurable impact.
          </p>

          {/* Toggle */}
          <div className="inline-flex bg-slate-100 p-1 rounded-lg mb-8">
            {['manual', 'solution'].map(mode => (
              <button
                key={mode}
                onClick={() => setActiveComparison(mode)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeComparison === mode
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {mode === 'manual' ? '📋 Manual Way' : '⚡ StockPulse Way'}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="max-w-4xl space-y-3">
          {COMPARISON.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                activeComparison === 'solution'
                  ? 'bg-white border-slate-200'
                  : 'bg-red-50 border-red-100'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                activeComparison === 'solution' ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {activeComparison === 'solution'
                  ? <CheckCircle size={16} className="text-emerald-600" />
                  : <AlertTriangle size={16} className="text-red-500" />
                }
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-800">
                  {activeComparison === 'solution' ? row.solution : row.pain}
                </div>
              </div>
              {activeComparison === 'solution' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 flex-shrink-0">
                  <span className="text-xs font-mono text-emerald-700 font-semibold">{row.metric}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-slate-900 rounded-2xl p-8 max-w-4xl"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="text-white font-bold text-xl mb-2">Ready to see it live?</div>
              <div className="text-slate-400 text-sm">Every feature is fully interactive with real manufacturing data. No backend required.</div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePage('dashboard')}
                className="bg-white hover:bg-slate-100 text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Live Dashboard →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePage('scanner')}
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Try Scanner →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
