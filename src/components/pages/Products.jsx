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
import { getProducts, deleteProduct } from '@/services/api/productService'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      await deleteProduct(productId)
      setProducts(prev => prev.filter(p => p.Id !== productId))
      toast.success('Product deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true
    return product.status === filter
  })

  if (loading) return <Loading type="table" />
  if (error) return <Error message={error} onRetry={loadProducts} />

  return (
    <div>
      <Header
        title="Products"
        subtitle="Manage your products and pricing"
        action={{
          label: "Add Product",
          icon: "Plus",
          onClick: () => toast.info("Product creation coming soon!")
        }}
      />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Filter by status:</span>
          {['all', 'active', 'inactive', 'draft'].map(status => (
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

{filteredProducts.length === 0 ? (
        <Empty
          title={filter === 'all' ? "No products yet" : `No ${filter} products found`}
          description={filter === 'all' ? "Create your first product to start selling" : `No products with ${filter} status found. Try changing the filter.`}
          actionText={filter === 'all' ? "Add Product" : "Clear Filter"}
          onAction={() => filter === 'all' ? toast.info("Product creation coming soon!") : setFilter('all')}
          icon="Package"
        />
      ) : (
        <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                          <ApperIcon name="Package" className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-sm text-gray-400">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" size="sm">
                        {product.modelType}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-white">${product.price}</span>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={product.status === 'active' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => toast.info("Edit product coming soon!")}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleDeleteProduct(product.Id)}
                          className="text-error hover:text-error"
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

export default Products