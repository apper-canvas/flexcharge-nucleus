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
  getCreditSystemConfig,
  updateCreditDefinition,
  getCreditPackages,
  createCreditPackage,
  updateCreditPackage,
  deleteCreditPackage,
  getCreditRules,
  updateCreditRules,
  getConsumptionRates,
  createConsumptionRate,
  updateConsumptionRate,
  deleteConsumptionRate
} from '@/services/api/creditSystemService'

const CreditSystemConfig = () => {
  const [config, setConfig] = useState(null)
  const [packages, setPackages] = useState([])
  const [rules, setRules] = useState(null)
  const [consumptionRates, setConsumptionRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('definition')
  const [editingPackage, setEditingPackage] = useState(null)
  const [editingRate, setEditingRate] = useState(null)
  const [showPackageForm, setShowPackageForm] = useState(false)
  const [showRateForm, setShowRateForm] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [configData, packagesData, rulesData, ratesData] = await Promise.all([
        getCreditSystemConfig(),
        getCreditPackages(),
        getCreditRules(),
        getConsumptionRates()
      ])
      setConfig(configData)
      setPackages(packagesData)
      setRules(rulesData)
      setConsumptionRates(ratesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleUpdateCreditDefinition = async (formData) => {
    try {
      const updated = await updateCreditDefinition(formData)
      setConfig(updated)
      toast.success('Credit definition updated successfully!')
    } catch (error) {
      toast.error('Failed to update credit definition')
    }
  }

  const handleSavePackage = async (packageData) => {
    try {
      if (editingPackage) {
        const updated = await updateCreditPackage(editingPackage.Id, packageData)
        setPackages(prev => prev.map(p => p.Id === editingPackage.Id ? updated : p))
        toast.success('Package updated successfully!')
      } else {
        const newPackage = await createCreditPackage(packageData)
        setPackages(prev => [...prev, newPackage])
        toast.success('Package created successfully!')
      }
      setEditingPackage(null)
      setShowPackageForm(false)
    } catch (error) {
      toast.error('Failed to save package')
    }
  }

  const handleDeletePackage = async (packageId) => {
    if (!confirm('Are you sure you want to delete this package?')) return
    
    try {
      await deleteCreditPackage(packageId)
      setPackages(prev => prev.filter(p => p.Id !== packageId))
      toast.success('Package deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete package')
    }
  }

  const handleUpdateRules = async (rulesData) => {
    try {
      const updated = await updateCreditRules(rulesData)
      setRules(updated)
      toast.success('Rules updated successfully!')
    } catch (error) {
      toast.error('Failed to update rules')
    }
  }

  const handleSaveRate = async (rateData) => {
    try {
      if (editingRate) {
        const updated = await updateConsumptionRate(editingRate.Id, rateData)
        setConsumptionRates(prev => prev.map(r => r.Id === editingRate.Id ? updated : r))
        toast.success('Consumption rate updated successfully!')
      } else {
        const newRate = await createConsumptionRate(rateData)
        setConsumptionRates(prev => [...prev, newRate])
        toast.success('Consumption rate created successfully!')
      }
      setEditingRate(null)
      setShowRateForm(false)
    } catch (error) {
      toast.error('Failed to save consumption rate')
    }
  }

  const handleDeleteRate = async (rateId) => {
    if (!confirm('Are you sure you want to delete this consumption rate?')) return
    
    try {
      await deleteConsumptionRate(rateId)
      setConsumptionRates(prev => prev.filter(r => r.Id !== rateId))
      toast.success('Consumption rate deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete consumption rate')
    }
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadData} />

  const tabs = [
    { id: 'definition', label: 'Credit Definition', icon: 'Coins' },
    { id: 'packages', label: 'Credit Packages', icon: 'Package' },
    { id: 'rules', label: 'System Rules', icon: 'Settings' },
    { id: 'rates', label: 'Consumption Rates', icon: 'Activity' }
  ]

  return (
    <div>
      <Header
        title="Credit System Configuration"
        subtitle="Configure credit definitions, packages, and consumption rates"
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

      {/* Credit Definition Tab */}
      {activeTab === 'definition' && config && (
        <CreditDefinitionForm
          config={config}
          onSave={handleUpdateCreditDefinition}
        />
      )}

      {/* Credit Packages Tab */}
      {activeTab === 'packages' && (
        <CreditPackagesManager
          packages={packages}
          onEdit={setEditingPackage}
          onDelete={handleDeletePackage}
          onAdd={() => setShowPackageForm(true)}
          showForm={showPackageForm || editingPackage}
          editingPackage={editingPackage}
          onSave={handleSavePackage}
          onCancel={() => {
            setEditingPackage(null)
            setShowPackageForm(false)
          }}
        />
      )}

      {/* System Rules Tab */}
      {activeTab === 'rules' && rules && (
        <SystemRulesForm
          rules={rules}
          onSave={handleUpdateRules}
        />
      )}

      {/* Consumption Rates Tab */}
      {activeTab === 'rates' && (
        <ConsumptionRatesManager
          rates={consumptionRates}
          onEdit={setEditingRate}
          onDelete={handleDeleteRate}
          onAdd={() => setShowRateForm(true)}
          showForm={showRateForm || editingRate}
          editingRate={editingRate}
          onSave={handleSaveRate}
          onCancel={() => {
            setEditingRate(null)
            setShowRateForm(false)
          }}
        />
      )}
    </div>
  )
}

// Credit Definition Form Component
const CreditDefinitionForm = ({ config, onSave }) => {
  const [formData, setFormData] = useState({
    name: config.name || '',
    symbol: config.symbol || '',
    baseValue: config.baseValue || 0.01
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
        <ApperIcon name="Coins" size={20} />
        Credit Definition
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Credit Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., FlexCredits"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Symbol
            </label>
            <Input
              value={formData.symbol}
              onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
              placeholder="e.g., FC"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Base Value (USD)
          </label>
          <Input
            type="number"
            step="0.001"
            value={formData.baseValue}
            onChange={(e) => setFormData(prev => ({ ...prev, baseValue: parseFloat(e.target.value) }))}
            placeholder="0.01"
            required
          />
          <p className="text-sm text-gray-400 mt-1">
            1 {formData.symbol || 'Credit'} = ${formData.baseValue || '0.01'}
          </p>
        </div>

        <Button type="submit" className="w-full">
          <ApperIcon name="Save" size={18} />
          Save Credit Definition
        </Button>
      </form>
    </motion.div>
  )
}

// Credit Packages Manager Component
const CreditPackagesManager = ({ packages, onEdit, onDelete, onAdd, showForm, editingPackage, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    price: '',
    bonusCredits: 0,
    badge: '',
    order: 1,
    isPopular: false
  })

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        name: editingPackage.name || '',
        amount: editingPackage.amount || '',
        price: editingPackage.price || '',
        bonusCredits: editingPackage.bonusCredits || 0,
        badge: editingPackage.badge || '',
        order: editingPackage.order || 1,
        isPopular: editingPackage.isPopular || false
      })
    } else {
      setFormData({
        name: '',
        amount: '',
        price: '',
        bonusCredits: 0,
        badge: '',
        order: packages.length + 1,
        isPopular: false
      })
    }
  }, [editingPackage, packages.length])

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
          <ApperIcon name="Package" size={20} />
          Credit Packages
        </h3>
        {!showForm && (
          <Button onClick={onAdd}>
            <ApperIcon name="Plus" size={18} />
            Add Package
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">
            {editingPackage ? 'Edit Package' : 'Add New Package'}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Package Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Starter"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Credit Amount
                </label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                  placeholder="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (USD)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  placeholder="10.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bonus Credits
                </label>
                <Input
                  type="number"
                  value={formData.bonusCredits}
                  onChange={(e) => setFormData(prev => ({ ...prev, bonusCredits: parseInt(e.target.value) }))}
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Badge
                </label>
                <Input
                  value={formData.badge}
                  onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="e.g., Best Value"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Order
                </label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPopular"
                checked={formData.isPopular}
                onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="isPopular" className="text-sm text-gray-300">
                Mark as Popular
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                <ApperIcon name="Save" size={18} />
                {editingPackage ? 'Update Package' : 'Create Package'}
              </Button>
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <motion.div
            key={pkg.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 relative"
          >
            {pkg.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="success">Popular</Badge>
              </div>
            )}
            
            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold text-white">{pkg.name}</h4>
              {pkg.badge && (
                <Badge variant="info" className="mt-2">{pkg.badge}</Badge>
              )}
            </div>

            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white">
                {pkg.amount.toLocaleString()}
                {pkg.bonusCredits > 0 && (
                  <span className="text-sm text-success"> +{pkg.bonusCredits}</span>
                )}
              </div>
              <div className="text-sm text-gray-400">credits</div>
              <div className="text-xl font-semibold text-primary mt-2">
                ${pkg.price.toFixed(2)}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(pkg)}
                className="flex-1"
              >
                <ApperIcon name="Edit" size={16} />
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(pkg.Id)}
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

// System Rules Form Component
const SystemRulesForm = ({ rules, onSave }) => {
  const [formData, setFormData] = useState({
    expiration: rules.expiration || 'never',
    customExpirationDays: rules.customExpirationDays || 365,
    allowNegativeBalance: rules.allowNegativeBalance || false,
    autoRecharge: rules.autoRecharge || false,
    autoRechargeThreshold: rules.autoRechargeThreshold || 10,
    autoRechargeAmount: rules.autoRechargeAmount || 100
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
        <ApperIcon name="Settings" size={20} />
        System Rules
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
<label className="block text-sm font-medium text-gray-300 mb-2">
            Credit Expiration
          </label>
          <Select
            value={formData.expiration}
            onChange={(e) => setFormData(prev => ({ ...prev, expiration: e.target.value }))}
            options={[
              { value: 'never', label: 'Never Expire' },
              { value: '6months', label: '6 Months' },
              { value: '12months', label: '12 Months' },
              { value: 'custom', label: 'Custom' }
            ]}
          />
          {formData.expiration === 'custom' && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Expiration (Days)
              </label>
              <Input
                type="number"
                value={formData.customExpirationDays}
                onChange={(e) => setFormData(prev => ({ ...prev, customExpirationDays: parseInt(e.target.value) }))}
                placeholder="365"
                required
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="allowNegativeBalance"
              checked={formData.allowNegativeBalance}
              onChange={(e) => setFormData(prev => ({ ...prev, allowNegativeBalance: e.target.checked }))}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="allowNegativeBalance" className="text-sm text-gray-300">
              Allow Negative Balance
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoRecharge"
              checked={formData.autoRecharge}
              onChange={(e) => setFormData(prev => ({ ...prev, autoRecharge: e.target.checked }))}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="autoRecharge" className="text-sm text-gray-300">
              Enable Auto-Recharge
            </label>
          </div>

          {formData.autoRecharge && (
            <div className="ml-7 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Auto-Recharge Threshold
                </label>
                <Input
                  type="number"
                  value={formData.autoRechargeThreshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, autoRechargeThreshold: parseInt(e.target.value) }))}
                  placeholder="10"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">
                  Recharge when balance falls below this amount
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Auto-Recharge Amount
                </label>
                <Input
                  type="number"
                  value={formData.autoRechargeAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, autoRechargeAmount: parseInt(e.target.value) }))}
                  placeholder="100"
                  required
                />
              </div>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">
          <ApperIcon name="Save" size={18} />
          Save System Rules
        </Button>
      </form>
    </motion.div>
  )
}

// Consumption Rates Manager Component
const ConsumptionRatesManager = ({ rates, onEdit, onDelete, onAdd, showForm, editingRate, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    operation: '',
    description: '',
    creditsRequired: '',
    unit: 'per_call',
    isActive: true
  })

  useEffect(() => {
    if (editingRate) {
      setFormData({
        operation: editingRate.operation || '',
        description: editingRate.description || '',
        creditsRequired: editingRate.creditsRequired || '',
        unit: editingRate.unit || 'per_call',
        isActive: editingRate.isActive !== undefined ? editingRate.isActive : true
      })
    } else {
      setFormData({
        operation: '',
        description: '',
        creditsRequired: '',
        unit: 'per_call',
        isActive: true
      })
    }
  }, [editingRate])

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
          <ApperIcon name="Activity" size={20} />
          Consumption Rates
        </h3>
        {!showForm && (
          <Button onClick={onAdd}>
            <ApperIcon name="Plus" size={18} />
            Add Rate
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">
            {editingRate ? 'Edit Consumption Rate' : 'Add New Consumption Rate'}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Operation Name
                </label>
                <Input
                  value={formData.operation}
                  onChange={(e) => setFormData(prev => ({ ...prev, operation: e.target.value }))}
                  placeholder="e.g., API Call"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Credits Required
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.creditsRequired}
                  onChange={(e) => setFormData(prev => ({ ...prev, creditsRequired: parseFloat(e.target.value) }))}
                  placeholder="1"
                  required
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
                placeholder="e.g., Standard API endpoint call"
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
                  { value: 'per_call', label: 'Per Call' },
                  { value: 'per_page', label: 'Per Page' },
                  { value: 'per_minute', label: 'Per Minute' },
                  { value: 'per_mb', label: 'Per MB' },
                  { value: 'per_item', label: 'Per Item' }
                ]}
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
                {editingRate ? 'Update Rate' : 'Create Rate'}
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Operation</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Credits</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Unit</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {rates.map((rate) => (
                <tr key={rate.Id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{rate.operation}</div>
                      {rate.description && (
                        <div className="text-sm text-gray-400">{rate.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white">{rate.creditsRequired}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{rate.unit}</td>
                  <td className="px-6 py-4">
                    <Badge variant={rate.isActive ? 'success' : 'secondary'}>
                      {rate.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(rate)}
                        className="text-primary hover:text-secondary transition-colors"
                      >
                        <ApperIcon name="Edit" size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(rate.Id)}
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

export default CreditSystemConfig