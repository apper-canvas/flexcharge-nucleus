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
import { getCustomers } from '@/services/api/customerService'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCustomers()
      setCustomers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadCustomers} />

  return (
    <div>
      <Header
        title="Customers"
        subtitle="Manage your customer base"
        action={{
          label: "Add Customer",
          icon: "UserPlus",
          onClick: () => toast.info("Customer creation coming soon!")
        }}
      />

{customers.length === 0 ? (
        <Empty
          title="No customers yet"
          description="Your customers will appear here once they start making purchases"
          actionText="Invite Customer"
          onAction={() => toast.info("Customer invitation coming soon!")}
          icon="Users"
        />
      ) : (
        <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Total Spent</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <motion.tr
                    key={customer.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{customer.name}</p>
                          <p className="text-sm text-gray-400">
                            Joined {new Date(customer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300">{customer.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-white">${customer.totalSpent}</span>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={customer.status === 'active' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Eye"
                          onClick={() => toast.info("Customer details coming soon!")}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="MessageCircle"
                          onClick={() => toast.info("Customer messaging coming soon!")}
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

export default Customers