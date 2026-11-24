import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 0, className = '' }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const startValRef = useRef(0);

  useEffect(() => {
    const duration = 1200;
    startValRef.current = display;
    startRef.current = performance.now();
    const target = Number(value) || 0;

    function tick(now) {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValRef.current + (target - startValRef.current) * eased;
      setDisplay(current);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString('en-IN');

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    healthy: { label: 'Healthy', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    reorder: { label: 'Reorder Now', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    stockout: { label: 'Stockout', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    overstocked: { label: 'Overstocked', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  };
  const s = map[status] || map.healthy;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === 'reorder' || status === 'stockout' ? 'animate-pulse' : ''}`} />
      {s.label}
    </span>
  );
}

export function ABCBadge({ cls }) {
  const map = {
    A: 'bg-slate-900 text-white',
    B: 'bg-slate-200 text-slate-700',
    C: 'bg-slate-100 text-slate-500',
  };
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold font-mono ${map[cls] || map.C}`}>
      {cls}
    </span>
  );
}

export function StockBar({ current, max, rop, status }) {
  const pct = Math.min((current / max) * 100, 100);
  const ropPct = Math.min((rop / max) * 100, 100);
  const color = status === 'stockout' ? 'bg-red-500' : status === 'reorder' ? 'bg-amber-400' : status === 'overstocked' ? 'bg-blue-400' : 'bg-emerald-500';

  return (
    <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-visible">
      <motion.div
        className={`h-2 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber-500 rounded-full"
        style={{ left: `${ropPct}%` }}
        title={`ROP: ${rop}`}
      />
    </div>
  );
}

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium border max-w-xs
            ${t.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
              t.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              t.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
              'bg-white border-slate-200 text-slate-800'}`}
        >
          {t.msg}
        </motion.div>
      ))}
    </div>
  );
}

export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};
