import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import StatCard from '@/components/molecules/StatCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getDashboardStats } from '@/services/api/dashboardService'

const Dashboard = () => {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDashboardStats()
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadStats} />

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Overview of your billing performance"
        action={{
          label: "View Reports",
          icon: "BarChart3",
          onClick: () => console.log("View Reports clicked")
        }}
      />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>
      
      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Revenue Overview</h3>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm bg-primary/20 text-primary rounded-lg">
              Monthly
            </button>
            <button className="px-3 py-1 text-sm text-gray-400 hover:text-white">
              Weekly
            </button>
          </div>
        </div>
        
        <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ApperIcon name="BarChart3" className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">Revenue chart will be displayed here</p>
          </div>
        </div>
      </motion.div>
      
      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">New order received</p>
                <p className="text-sm text-gray-400">2 minutes ago</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">$29.99</p>
                <p className="text-sm text-gray-400">One-time purchase</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard