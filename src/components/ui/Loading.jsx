import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-surface/60 rounded-lg animate-pulse"></div>
          <div className="h-10 w-32 bg-surface/60 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface/60 rounded-xl p-6 animate-pulse"
            >
              <div className="h-4 w-20 bg-white/20 rounded mb-2"></div>
              <div className="h-8 w-32 bg-white/30 rounded mb-1"></div>
              <div className="h-3 w-24 bg-white/20 rounded"></div>
            </motion.div>
          ))}
        </div>
        
        {/* Chart skeleton */}
        <div className="bg-surface/60 rounded-xl p-6 animate-pulse">
          <div className="h-6 w-40 bg-white/20 rounded mb-4"></div>
          <div className="h-64 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }
  
  if (type === 'table') {
    return (
      <div className="space-y-4">
        {/* Table header skeleton */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-surface/60 rounded-lg animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-white/20 rounded"></div>
          ))}
        </div>
        
        {/* Table rows skeleton */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-4 gap-4 p-4 bg-surface/40 rounded-lg animate-pulse"
          >
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-4 bg-white/20 rounded"></div>
            ))}
          </motion.div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-surface animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
      </div>
    </div>
  )
}

export default Loading