import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ModelCard = ({ 
  title, 
  description, 
  bestFor, 
  icon, 
  isActive = false,
  onSelect,
  onConfigure,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative bg-surface/60 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
        isActive 
          ? 'border-primary/50 shadow-lg shadow-primary/20' 
          : 'border-white/10 hover:border-primary/30'
      } ${className}`}
      onClick={onSelect}
    >
      {isActive && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
          <ApperIcon name="Check" className="w-3 h-3 text-white" />
        </div>
      )}
      
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isActive ? 'bg-primary/20' : 'bg-white/10'
        }`}>
          <ApperIcon name={icon} className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
        </div>
        
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          {isActive && (
            <span className="text-xs text-primary font-medium">Active</span>
          )}
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      
      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">Best for:</p>
        <p className="text-sm text-gray-300">{bestFor}</p>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant={isActive ? "primary" : "secondary"}
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          className="flex-1"
        >
          {isActive ? "Active" : "Select"}
        </Button>
        
        {isActive && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onConfigure()
            }}
            icon="Settings"
          >
            Configure
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default ModelCard