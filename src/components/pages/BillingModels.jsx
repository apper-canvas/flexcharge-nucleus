import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import ModelCard from '@/components/molecules/ModelCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { getBillingModels, updateBillingModel } from '@/services/api/billingModelService'

const BillingModels = () => {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadModels = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getBillingModels()
      setModels(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadModels()
  }, [])

  const handleSelectModel = async (modelId) => {
    try {
      const updatedModel = await updateBillingModel(modelId, { isActive: true })
      setModels(prev => prev.map(model => 
        model.Id === modelId 
          ? { ...model, isActive: true }
          : model
      ))
      toast.success(`${updatedModel.type} model activated successfully!`)
    } catch (error) {
      toast.error('Failed to activate billing model')
    }
  }

  const handleConfigureModel = (modelId) => {
    toast.info('Configuration panel coming soon!')
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadModels} />

  return (
    <div>
      <Header
        title="Billing Models"
        subtitle="Choose and configure your payment models"
        action={{
          label: "Add Custom Model",
          icon: "Plus",
          onClick: () => toast.info("Custom model creation coming soon!")
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model, index) => (
          <motion.div
            key={model.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ModelCard
              title={model.name}
              description={model.description}
              bestFor={model.bestFor}
              icon={model.icon}
              isActive={model.isActive}
              onSelect={() => handleSelectModel(model.Id)}
              onConfigure={() => handleConfigureModel(model.Id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Active Models Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Active Models</h3>
        
        <div className="space-y-3">
          {models.filter(model => model.isActive).map(model => (
            <div key={model.Id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-slow"></div>
                <span className="text-white font-medium">{model.name}</span>
              </div>
              <button
                onClick={() => handleConfigureModel(model.Id)}
                className="text-sm text-primary hover:text-secondary transition-colors"
              >
                Configure
              </button>
            </div>
          ))}
          
          {models.filter(model => model.isActive).length === 0 && (
            <p className="text-gray-400 text-center py-4">
              No active billing models. Select one to get started.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default BillingModels