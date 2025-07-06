import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import NavItem from '@/components/molecules/NavItem'

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

const navItems = [
    { to: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
    { to: '/billing-models', icon: 'Settings', label: 'Billing Models' },
    { to: '/billing-models/usage-config', icon: 'Gauge', label: 'Usage-Based' },
    { to: '/products', icon: 'Package', label: 'Products' },
    { to: '/customers', icon: 'Users', label: 'Customers' },
    { to: '/orders', icon: 'ShoppingCart', label: 'Orders' },
    { to: '/reports', icon: 'BarChart3', label: 'Reports' },
    { to: '/settings', icon: 'Settings', label: 'Settings' }
  ]

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface/80 backdrop-blur-sm rounded-lg border border-white/10 text-white"
      >
        <ApperIcon name={isMobileOpen ? 'X' : 'Menu'} className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 w-64 h-full bg-surface/40 backdrop-blur-sm border-r border-white/10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">FlexCharge</h1>
              <p className="text-xs text-gray-400">Billing Platform</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed left-0 top-0 w-64 h-full bg-surface/90 backdrop-blur-sm border-r border-white/10 z-50"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  <ApperIcon name="Zap" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">FlexCharge</h1>
                  <p className="text-xs text-gray-400">Billing Platform</p>
                </div>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.to} onClick={() => setIsMobileOpen(false)}>
                    <NavItem
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                    />
                  </div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar