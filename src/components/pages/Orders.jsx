import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { getOrders } from '@/services/api/orderService'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOrders()
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'pending': return 'warning'
      case 'failed': return 'error'
      default: return 'secondary'
    }
  }

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadOrders} />

  return (
    <div>
      <Header
        title="Orders & Transactions"
        subtitle="Track all your sales and payments"
        action={{
          label: "Export Data",
          icon: "Download",
          onClick: () => toast.info("Export feature coming soon!")
        }}
      />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Filter by status:</span>
          {['all', 'completed', 'pending', 'failed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-surface/40 text-gray-400 hover:text-white'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Empty
          title="No orders found"
          description="Your orders will appear here once customers start making purchases"
          actionText="View Products"
          onAction={() => toast.info("Redirecting to products...")}
          icon="ShoppingCart"
        />
      ) : (
        <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Order ID</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm text-gray-300">#{order.orderId}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-xs">
                            {order.customerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white">{order.customerName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300">{order.productName}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-white">${order.amount}</span>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={getStatusVariant(order.status)}
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Eye"
                          onClick={() => toast.info("Order details coming soon!")}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Receipt"
                          onClick={() => toast.info("Invoice generation coming soon!")}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders