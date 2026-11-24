import { useState } from 'react'
import { InventoryProvider, useInventory } from './context/InventoryContext'
import Layout from './components/Layout'
import { Toast } from './components/ui'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ScannerPage from './pages/ScannerPage'
import ROPPage from './pages/ROPPage'
import ABCPage from './pages/ABCPage'
import SuppliersPage from './pages/SuppliersPage'
import './index.css'

function AppInner() {
  const [activePage, setActivePage] = useState('landing')
  const { toasts } = useInventory()

  const renderPage = () => {
    switch (activePage) {
      case 'landing': return <LandingPage setActivePage={setActivePage} />
      case 'dashboard': return <Dashboard />
      case 'scanner': return <ScannerPage />
      case 'rop': return <ROPPage setActivePage={setActivePage} />
      case 'abc': return <ABCPage />
      case 'suppliers': return <SuppliersPage />
      default: return <LandingPage setActivePage={setActivePage} />
    }
  }

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
      <Toast toasts={toasts} />
    </Layout>
  )
}

export default function App() {
  return (
    <InventoryProvider>
      <AppInner />
    </InventoryProvider>
  )
}
