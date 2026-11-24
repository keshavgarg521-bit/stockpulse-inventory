import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_INVENTORY, INITIAL_TRANSACTIONS } from '../data/mockInventory';

const InventoryContext = createContext(null);

const STORAGE_KEY = 'stockpulse_v1';

function computeStatus(item) {
  if (item.currentStock === 0) return 'stockout';
  if (item.currentStock <= item.reorderPoint) return 'reorder';
  if (item.currentStock > item.maxStock * 0.9) return 'overstocked';
  return 'healthy';
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState(() => {
    const saved = loadState();
    return saved?.inventory || INITIAL_INVENTORY;
  });
  const [transactions, setTransactions] = useState(() => {
    const saved = loadState();
    return saved?.transactions || INITIAL_TRANSACTIONS;
  });
  const [toasts, setToasts] = useState([]);
  const [poItems, setPoItems] = useState(() => {
    const saved = loadState();
    return saved?.poItems || {};
  });

  useEffect(() => {
    saveState({ inventory, transactions, poItems });
  }, [inventory, transactions, poItems]);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const scanItem = useCallback(({ skuId, type, qty, operator = 'Floor Operator', station = 'Scan Station', note = '' }) => {
    setInventory(prev => prev.map(item => {
      if (item.id !== skuId) return item;
      const delta = type === 'IN' ? qty : -qty;
      const newStock = Math.max(0, item.currentStock + delta);
      const updated = { ...item, currentStock: newStock, lastUpdated: new Date().toISOString() };
      updated.status = computeStatus(updated);
      return updated;
    }));
    const item = inventory.find(i => i.id === skuId);
    const txn = {
      id: `TXN-${Date.now()}`,
      type,
      skuId,
      skuName: item?.name || skuId,
      qty,
      operator,
      station,
      timestamp: new Date().toISOString(),
      note,
    };
    setTransactions(prev => [txn, ...prev].slice(0, 100));
    if (type === 'OUT') {
      const newStock = Math.max(0, (item?.currentStock || 0) - qty);
      if (newStock === 0) {
        addToast(`🚨 CRITICAL STOCKOUT: ${item?.name} has reached 0 units!`, 'error');
      } else if (newStock <= (item?.reorderPoint || 0)) {
        addToast(`⚠️ ROP Alert: ${item?.name} dropped below reorder point (${newStock}/${item?.reorderPoint})!`, 'warning');
      } else {
        addToast(`📤 Issued ${qty} ${item?.unit || 'units'} of ${item?.name} to floor`, 'info');
      }
    } else {
      addToast(`📥 Received +${qty} ${item?.unit || 'units'} of ${item?.name} into inventory`, 'success');
    }
  }, [inventory, addToast]);

  const updateROP = useCallback(({ skuId, dailyUsage, leadTimeDays, safetyStock }) => {
    setInventory(prev => prev.map(item => {
      if (item.id !== skuId) return item;
      const newROP = (dailyUsage * leadTimeDays) + safetyStock;
      const updated = { ...item, dailyUsage, leadTimeDays, safetyStock, reorderPoint: newROP };
      updated.status = computeStatus(updated);
      return updated;
    }));
  }, []);

  const toggleBin = useCallback((skuId) => {
    setInventory(prev => prev.map(item => {
      if (item.id !== skuId) return item;
      const newBin = item.binStatus === 'bin1_empty' ? 'healthy' : 'bin1_empty';
      return { ...item, binStatus: newBin };
    }));
  }, []);

  const generatePO = useCallback((skuId) => {
    const item = inventory.find(i => i.id === skuId);
    if (!item) return;
    setPoItems(prev => ({ ...prev, [skuId]: { status: 'placed', timestamp: new Date().toISOString() } }));
    addToast(`📋 PO Generated for ${item.name} — Order Placed!`, 'success');
  }, [inventory, addToast]);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setInventory(INITIAL_INVENTORY);
    setTransactions(INITIAL_TRANSACTIONS);
    setPoItems({});
    addToast('Data reset to factory defaults', 'info');
  }, [addToast]);

  // Computed stats
  const totalValue = inventory.reduce((sum, i) => sum + i.currentStock * i.unitCost, 0);
  const reorderAlerts = inventory.filter(i => i.status === 'reorder' || i.status === 'stockout');
  const stockouts = inventory.filter(i => i.status === 'stockout');

  return (
    <InventoryContext.Provider value={{
      inventory, transactions, toasts, poItems,
      totalValue, reorderAlerts, stockouts,
      scanItem, updateROP, toggleBin, generatePO, resetData, addToast
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used inside InventoryProvider');
  return ctx;
}
