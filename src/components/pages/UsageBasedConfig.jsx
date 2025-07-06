import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import {
  getMeters,
  createMeter,
  updateMeter,
  deleteMeter,
  getPricingModels,
  createPricingModel,
  updatePricingModel,
  deletePricingModel,
  getUsageControls,
  updateUsageControls,
  getRateConfigurations,
  createRateConfiguration,
  updateRateConfiguration,
  deleteRateConfiguration
} from '@/services/api/usageBasedService'

const UsageBasedConfig = () => {
  const [meters, setMeters] = useState([])
  const [pricingModels, setPricingModels] = useState([])
  const [usageControls, setUsageControls] = useState(null)
  const [rateConfigurations, setRateConfigurations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('meters')
  const [editingMeter, setEditingMeter] = useState(null)
  const [editingPricingModel, setEditingPricingModel] = useState(null)
  const [editingRateConfig, setEditingRateConfig] = useState(null)
  const [showMeterForm, setShowMeterForm] = useState(false)
  const [showPricingModelForm, setShowPricingModelForm] = useState(false)
  const [showRateConfigForm, setShowRateConfigForm] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [metersData, pricingModelsData, usageControlsData, rateConfigsData] = await Promise.all([
        getMeters(),
        getPricingModels(),
        getUsageControls(),
        getRateConfigurations()
      ])
      setMeters(metersData)
      setPricingModels(pricingModelsData)
      setUsageControls(usageControlsData)
      setRateConfigurations(rateConfigsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSaveMeter = async (meterData) => {
    try {
      if (editingMeter) {
        const updated = await updateMeter(editingMeter.Id, meterData)
        setMeters(prev => prev.map(m => m.Id === editingMeter.Id ? updated : m))
        toast.success('Meter updated successfully!')
      } else {
        const newMeter = await createMeter(meterData)
        setMeters(prev => [...prev, newMeter])
        toast.success('Meter created successfully!')
      }
      setEditingMeter(null)
      setShowMeterForm(false)
    } catch (error) {
      toast.error('Failed to save meter')
    }
  }

  const handleDeleteMeter = async (meterId) => {
    if (!confirm('Are you sure you want to delete this meter?')) return
    
    try {
      await deleteMeter(meterId)
      setMeters(prev => prev.filter(m => m.Id !== meterId))
      toast.success('Meter deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete meter')
    }
  }

  const handleSavePricingModel = async (modelData) => {
    try {
      if (editingPricingModel) {
        const updated = await updatePricingModel(editingPricingModel.Id, modelData)
        setPricingModels(prev => prev.map(m => m.Id === editingPricingModel.Id ? updated : m))
        toast.success('Pricing model updated successfully!')
      } else {
        const newModel = await createPricingModel(modelData)
        setPricingModels(prev => [...prev, newModel])
        toast.success('Pricing model created successfully!')
      }
      setEditingPricingModel(null)
      setShowPricingModelForm(false)
    } catch (error) {
      toast.error('Failed to save pricing model')
    }
  }

  const handleDeletePricingModel = async (modelId) => {
    if (!confirm('Are you sure you want to delete this pricing model?')) return
    
    try {
      await deletePricingModel(modelId)
      setPricingModels(prev => prev.filter(m => m.Id !== modelId))
      toast.success('Pricing model deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete pricing model')
    }
  }

  const handleUpdateUsageControls = async (controlsData) => {
    try {
      const updated = await updateUsageControls(controlsData)
      setUsageControls(updated)
      toast.success('Usage controls updated successfully!')
    } catch (error) {
      toast.error('Failed to update usage controls')
    }
  }

  const handleSaveRateConfig = async (configData) => {
    try {
      if (editingRateConfig) {
        const updated = await updateRateConfiguration(editingRateConfig.Id, configData)
        setRateConfigurations(prev => prev.map(r => r.Id === editingRateConfig.Id ? updated : r))
        toast.success('Rate configuration updated successfully!')
      } else {
        const newConfig = await createRateConfiguration(configData)
        setRateConfigurations(prev => [...prev, newConfig])
        toast.success('Rate configuration created successfully!')
      }
      setEditingRateConfig(null)
      setShowRateConfigForm(false)
    } catch (error) {
      toast.error('Failed to save rate configuration')
    }
  }

  const handleDeleteRateConfig = async (configId) => {
    if (!confirm('Are you sure you want to delete this rate configuration?')) return
    
    try {
      await deleteRateConfiguration(configId)
      setRateConfigurations(prev => prev.filter(r => r.Id !== configId))
      toast.success('Rate configuration deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete rate configuration')
    }
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadData} />

  const tabs = [
    { id: 'meters', label: 'Meter Setup', icon: 'Gauge' },
    { id: 'pricing', label: 'Pricing Models', icon: 'DollarSign' },
    { id: 'controls', label: 'Usage Controls', icon: 'Shield' },
    { id: 'rates', label: 'Rate Configurations', icon: 'Settings' }
  ]

  return (
    <div>
      <Header
        title="Usage-Based Configuration"
        subtitle="Configure meters, pricing models, and usage controls"
        action={{
          label: "Back to Billing Models",
          icon: "ArrowLeft",
          onClick: () => window.location.href = '/billing-models'
        }}
      />

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-lg'
                : 'bg-surface/60 text-gray-300 hover:bg-surface/80'
            }`}
          >
            <ApperIcon name={tab.icon} size={18} />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Meter Setup Tab */}
      {activeTab === 'meters' && (
        <MeterSetupManager
          meters={meters}
          onEdit={setEditingMeter}
          onDelete={handleDeleteMeter}
          onAdd={() => setShowMeterForm(true)}
          showForm={showMeterForm || editingMeter}
          editingMeter={editingMeter}
          onSave={handleSaveMeter}
          onCancel={() => {
            setEditingMeter(null)
            setShowMeterForm(false)
          }}
        />
      )}

      {/* Pricing Models Tab */}
      {activeTab === 'pricing' && (
        <PricingModelsManager
          models={pricingModels}
          onEdit={setEditingPricingModel}
          onDelete={handleDeletePricingModel}
          onAdd={() => setShowPricingModelForm(true)}
          showForm={showPricingModelForm || editingPricingModel}
          editingModel={editingPricingModel}
          onSave={handleSavePricingModel}
          onCancel={() => {
            setEditingPricingModel(null)
            setShowPricingModelForm(false)
          }}
        />
      )}

      {/* Usage Controls Tab */}
      {activeTab === 'controls' && usageControls && (
        <UsageControlsForm
          controls={usageControls}
          onSave={handleUpdateUsageControls}
        />
      )}

      {/* Rate Configurations Tab */}
      {activeTab === 'rates' && (
        <RateConfigurationsManager
          configurations={rateConfigurations}
          onEdit={setEditingRateConfig}
          onDelete={handleDeleteRateConfig}
          onAdd={() => setShowRateConfigForm(true)}
          showForm={showRateConfigForm || editingRateConfig}
          editingConfig={editingRateConfig}
          onSave={handleSaveRateConfig}
          onCancel={() => {
            setEditingRateConfig(null)
            setShowRateConfigForm(false)
          }}
        />
      )}
    </div>
  )
}

// Meter Setup Manager Component
const MeterSetupManager = ({ meters, onEdit, onDelete, onAdd, showForm, editingMeter, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    unit: 'api_calls',
    aggregation: 'sum',
    resetPeriod: 'monthly',
    description: ''
  })

  useEffect(() => {
    if (editingMeter) {
      setFormData({
        name: editingMeter.name || '',
        code: editingMeter.code || '',
        unit: editingMeter.unit || 'api_calls',
        aggregation: editingMeter.aggregation || 'sum',
        resetPeriod: editingMeter.resetPeriod || 'monthly',
        description: editingMeter.description || ''
      })
    } else {
      setFormData({
        name: '',
        code: '',
        unit: 'api_calls',
        aggregation: 'sum',
        resetPeriod: 'monthly',
        description: ''
      })
    }
  }, [editingMeter])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <ApperIcon name="Gauge" size={20} />
          Meter Setup
        </h3>
        {!showForm && (
          <Button onClick={onAdd}>
            <ApperIcon name="Plus" size={18} />
            Add Meter
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">
            {editingMeter ? 'Edit Meter' : 'Add New Meter'}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meter Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., API Usage"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Code
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., api_usage"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Unit
                </label>
                <Select
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  options={[
                    { value: 'api_calls', label: 'API Calls' },
                    { value: 'gb_storage', label: 'GB Storage' },
                    { value: 'compute_hours', label: 'Compute Hours' },
                    { value: 'bandwidth', label: 'Bandwidth' },
                    { value: 'users', label: 'Users' },
                    { value: 'transactions', label: 'Transactions' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Aggregation
                </label>
                <Select
                  value={formData.aggregation}
                  onChange={(e) => setFormData(prev => ({ ...prev, aggregation: e.target.value }))}
                  options={[
                    { value: 'sum', label: 'Sum' },
                    { value: 'max', label: 'Max' },
                    { value: 'average', label: 'Average' },
                    { value: 'unique', label: 'Unique' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reset Period
                </label>
                <Select
                  value={formData.resetPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, resetPeriod: e.target.value }))}
                  options={[
                    { value: 'never', label: 'Never' },
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'annual', label: 'Annual' }
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Tracks API endpoint usage"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                <ApperIcon name="Save" size={18} />
                {editingMeter ? 'Update Meter' : 'Create Meter'}
              </Button>
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Code</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Unit</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Aggregation</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Reset Period</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {meters.map((meter) => (
                <tr key={meter.Id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{meter.name}</div>
                      {meter.description && (
                        <div className="text-sm text-gray-400">{meter.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{meter.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{meter.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{meter.aggregation}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{meter.resetPeriod}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(meter)}
                        className="text-primary hover:text-secondary transition-colors"
                      >
                        <ApperIcon name="Edit" size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(meter.Id)}
                        className="text-error hover:text-red-400 transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

// Pricing Models Manager Component
const PricingModelsManager = ({ models, onEdit, onDelete, onAdd, showForm, editingModel, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'simple',
    pricePerUnit: '',
    tiers: [],
    volumeRates: [],
    packagePrice: '',
    packageUnits: '',
    overageRate: '',
    description: ''
  })

  useEffect(() => {
    if (editingModel) {
      setFormData({
        name: editingModel.name || '',
        type: editingModel.type || 'simple',
        pricePerUnit: editingModel.pricePerUnit || '',
        tiers: editingModel.tiers || [],
        volumeRates: editingModel.volumeRates || [],
        packagePrice: editingModel.packagePrice || '',
        packageUnits: editingModel.packageUnits || '',
        overageRate: editingModel.overageRate || '',
        description: editingModel.description || ''
      })
    } else {
      setFormData({
        name: '',
        type: 'simple',
        pricePerUnit: '',
        tiers: [],
        volumeRates: [],
        packagePrice: '',
        packageUnits: '',
        overageRate: '',
        description: ''
      })
    }
  }, [editingModel])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <ApperIcon name="DollarSign" size={20} />
          Pricing Models
        </h3>
        {!showForm && (
          <Button onClick={onAdd}>
            <ApperIcon name="Plus" size={18} />
            Add Pricing Model
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">
            {editingModel ? 'Edit Pricing Model' : 'Add New Pricing Model'}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Model Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Standard API Pricing"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pricing Type
                </label>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  options={[
                    { value: 'simple', label: 'Simple - Price per unit' },
                    { value: 'tiered', label: 'Tiered - Different rates per tier' },
                    { value: 'volume', label: 'Volume - Total volume determines price' },
                    { value: 'package', label: 'Package - Fixed package with overage' }
                  ]}
                />
              </div>
            </div>

            {formData.type === 'simple' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price Per Unit
                </label>
                <Input
                  type="number"
                  step="0.001"
                  value={formData.pricePerUnit}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerUnit: parseFloat(e.target.value) }))}
                  placeholder="0.01"
                  required
                />
              </div>
            )}

            {formData.type === 'package' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Package Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.packagePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, packagePrice: parseFloat(e.target.value) }))}
                    placeholder="10.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Package Units
                  </label>
                  <Input
                    type="number"
                    value={formData.packageUnits}
                    onChange={(e) => setFormData(prev => ({ ...prev, packageUnits: parseInt(e.target.value) }))}
                    placeholder="1000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Overage Rate
                  </label>
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.overageRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, overageRate: parseFloat(e.target.value) }))}
                    placeholder="0.02"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Standard pricing for API calls"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                <ApperIcon name="Save" size={18} />
                {editingModel ? 'Update Model' : 'Create Model'}
              </Button>
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <motion.div
            key={model.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-white">{model.name}</h4>
              <Badge variant="info">{model.type}</Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              {model.type === 'simple' && (
                <div className="text-sm text-gray-300">
                  Price: ${model.pricePerUnit}/unit
                </div>
              )}
              {model.type === 'package' && (
                <div className="text-sm text-gray-300">
                  ${model.packagePrice} for {model.packageUnits} units
                  <br />
                  Overage: ${model.overageRate}/unit
                </div>
              )}
              {model.description && (
                <div className="text-sm text-gray-400">{model.description}</div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(model)}
                className="flex-1"
              >
                <ApperIcon name="Edit" size={16} />
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(model.Id)}
                className="flex-1"
              >
                <ApperIcon name="Trash2" size={16} />
                Delete
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Usage Controls Form Component
const UsageControlsForm = ({ controls, onSave }) => {
  const [formData, setFormData] = useState({
    hardLimits: controls.hardLimits || false,
    maxUsage: controls.maxUsage || 1000,
    softAlerts: controls.softAlerts || {
      enabled: true,
      thresholds: [50, 75, 90, 100]
    },
    budgetCaps: controls.budgetCaps || false,
    maxBudget: controls.maxBudget || 100.00,
    notificationEmails: controls.notificationEmails || []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <ApperIcon name="Shield" size={20} />
        Usage Controls
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hardLimits"
              checked={formData.hardLimits}
              onChange={(e) => setFormData(prev => ({ ...prev, hardLimits: e.target.checked }))}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="hardLimits" className="text-sm text-gray-300">
              Enable Hard Limits
            </label>
          </div>

          {formData.hardLimits && (
            <div className="ml-7">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Usage
              </label>
              <Input
                type="number"
                value={formData.maxUsage}
                onChange={(e) => setFormData(prev => ({ ...prev, maxUsage: parseInt(e.target.value) }))}
                placeholder="1000"
                required
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="softAlerts"
              checked={formData.softAlerts.enabled}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                softAlerts: { ...prev.softAlerts, enabled: e.target.checked }
              }))}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="softAlerts" className="text-sm text-gray-300">
              Enable Soft Alerts (50%, 75%, 90%, 100%)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="budgetCaps"
              checked={formData.budgetCaps}
              onChange={(e) => setFormData(prev => ({ ...prev, budgetCaps: e.target.checked }))}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="budgetCaps" className="text-sm text-gray-300">
              Enable Budget Caps
            </label>
          </div>

          {formData.budgetCaps && (
            <div className="ml-7">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Budget ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.maxBudget}
                onChange={(e) => setFormData(prev => ({ ...prev, maxBudget: parseFloat(e.target.value) }))}
                placeholder="100.00"
                required
              />
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">
          <ApperIcon name="Save" size={18} />
          Save Usage Controls
        </Button>
      </form>
    </motion.div>
  )
}

// Rate Configurations Manager Component
const RateConfigurationsManager = ({ configurations, onEdit, onDelete, onAdd, showForm, editingConfig, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    meterId: '',
    pricingModelId: '',
    isActive: true,
    description: ''
  })

  useEffect(() => {
    if (editingConfig) {
      setFormData({
        name: editingConfig.name || '',
        meterId: editingConfig.meterId || '',
        pricingModelId: editingConfig.pricingModelId || '',
        isActive: editingConfig.isActive !== undefined ? editingConfig.isActive : true,
        description: editingConfig.description || ''
      })
    } else {
      setFormData({
        name: '',
        meterId: '',
        pricingModelId: '',
        isActive: true,
        description: ''
      })
    }
  }, [editingConfig])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <ApperIcon name="Settings" size={20} />
          Rate Configurations
        </h3>
        {!showForm && (
          <Button onClick={onAdd}>
            <ApperIcon name="Plus" size={18} />
            Add Configuration
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">
            {editingConfig ? 'Edit Rate Configuration' : 'Add New Rate Configuration'}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Configuration Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., API Standard Rate"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Standard rate configuration for API usage"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="isActive" className="text-sm text-gray-300">
                Active
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                <ApperIcon name="Save" size={18} />
                {editingConfig ? 'Update Configuration' : 'Create Configuration'}
              </Button>
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {configurations.map((config) => (
                <tr key={config.Id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm font-medium text-white">{config.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{config.description}</td>
                  <td className="px-6 py-4">
                    <Badge variant={config.isActive ? 'success' : 'secondary'}>
                      {config.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(config)}
                        className="text-primary hover:text-secondary transition-colors"
                      >
                        <ApperIcon name="Edit" size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(config.Id)}
                        className="text-error hover:text-red-400 transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

export default UsageBasedConfig