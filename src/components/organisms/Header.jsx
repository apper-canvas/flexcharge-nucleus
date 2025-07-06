import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Header = ({ title, subtitle, action }) => {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-surface/60 backdrop-blur-sm rounded-lg border border-white/10 hover:border-primary/30 transition-all duration-200"
            >
              <ApperIcon name="Bell" className="w-5 h-5 text-gray-400" />
            </button>
            
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-12 w-80 bg-surface/90 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl z-50"
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-semibold text-white">Notifications</h3>
                </div>
                <div className="p-4 text-center text-gray-400">
                  <p>No new notifications</p>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Action Button */}
          {action && (
            <Button
              variant="primary"
              onClick={action.onClick}
              icon={action.icon}
            >
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header