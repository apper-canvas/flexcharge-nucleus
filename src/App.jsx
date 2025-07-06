import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Onboarding from '@/components/pages/Onboarding'
import BillingModels from '@/components/pages/BillingModels'
import OneTimePurchaseConfig from '@/components/pages/OneTimePurchaseConfig'
import CreditSystemConfig from '@/components/pages/CreditSystemConfig'
import UsageBasedConfig from '@/components/pages/UsageBasedConfig'
import MarketplaceConfig from '@/components/pages/MarketplaceConfig'
import MilestoneConfig from '@/components/pages/MilestoneConfig'
import Products from '@/components/pages/Products'
import Customers from '@/components/pages/Customers'
import Orders from '@/components/pages/Orders'
import Reports from '@/components/pages/Reports'
import Settings from '@/components/pages/Settings'

function App() {
  return (
    <>
<Routes>
        <Route path="/onboarding" element={<Onboarding />} />
<Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
<Route path="billing-models" element={<BillingModels />} />
<Route path="billing-models/one-time-config" element={<OneTimePurchaseConfig />} />
          <Route path="billing-models/credit-config" element={<CreditSystemConfig />} />
          <Route path="billing-models/usage-config" element={<UsageBasedConfig />} />
          <Route path="billing-models/marketplace-config" element={<MarketplaceConfig />} />
          <Route path="milestone-config" element={<MilestoneConfig />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

export default App