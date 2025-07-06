import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'up',
  className = '',
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="bg-surface/60 rounded-xl p-6 animate-pulse">
        <div className="h-4 w-20 bg-white/20 rounded mb-2"></div>
        <div className="h-8 w-32 bg-white/30 rounded mb-1"></div>
        <div className="h-3 w-24 bg-white/20 rounded"></div>
      </div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-400">{title}</p>
        {icon && (
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
      
      <div className="mb-1">
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      
      {change && (
        <div className="flex items-center gap-1">
          <ApperIcon 
            name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            className={`w-4 h-4 ${trend === 'up' ? 'text-success' : 'text-error'}`} 
          />
          <span className={`text-sm ${trend === 'up' ? 'text-success' : 'text-error'}`}>
            {change}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default StatCard