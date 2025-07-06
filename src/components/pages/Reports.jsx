import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import StatCard from '@/components/molecules/StatCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getReportsData } from '@/services/api/reportService'

const Reports = () => {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState('30d')

  const loadReportData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getReportsData(timeRange)
      setReportData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportData()
  }, [timeRange])

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadReportData} />

  return (
    <div>
      <Header
        title="Reports"
        subtitle="Analyze your billing performance"
        action={{
          label: "Generate Report",
          icon: "FileText",
          onClick: () => console.log("Generate report clicked")
        }}
      />

      {/* Time Range Filter */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-gray-400">Time Range:</span>
        {[
          { value: '7d', label: '7 Days' },
          { value: '30d', label: '30 Days' },
          { value: '90d', label: '90 Days' },
          { value: '1y', label: '1 Year' }
        ].map(range => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === range.value
                ? 'bg-primary text-white'
                : 'bg-surface/40 text-gray-400 hover:text-white'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={reportData?.totalRevenue || '$0'}
          change="+12.5%"
          icon="DollarSign"
          trend="up"
        />
        <StatCard
          title="Total Orders"
          value={reportData?.totalOrders || '0'}
          change="+8.2%"
          icon="ShoppingCart"
          trend="up"
        />
        <StatCard
          title="Average Order Value"
          value={reportData?.averageOrderValue || '$0'}
          change="+3.1%"
          icon="TrendingUp"
          trend="up"
        />
        <StatCard
          title="Conversion Rate"
          value={reportData?.conversionRate || '0%'}
          change="-1.4%"
          icon="Target"
          trend="down"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Revenue Trend</h3>
          <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="BarChart3" className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Revenue chart will be displayed here</p>
            </div>
          </div>
        </motion.div>

        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Orders by Model</h3>
          <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="PieChart" className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Orders breakdown chart will be displayed here</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Top Performing Products</h3>
        
        <div className="space-y-4">
          {reportData?.topProducts?.map((product, index) => (
            <div key={product.Id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-white">{product.name}</p>
                  <p className="text-sm text-gray-400">{product.orders} orders</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-white">${product.revenue}</p>
                <p className="text-sm text-gray-400">{product.growth}% growth</p>
              </div>
            </div>
          )) || (
            <p className="text-center text-gray-400 py-8">
              No product data available for the selected time range
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Reports