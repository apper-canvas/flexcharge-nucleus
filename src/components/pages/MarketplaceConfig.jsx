import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getMarketplaceConfig, updateMarketplaceConfig } from '@/services/api/marketplaceService'

const MarketplaceConfig = () => {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMarketplaceConfig()
      setConfig(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      await updateMarketplaceConfig(config.Id, config)
      toast.success('Marketplace configuration saved successfully!')
    } catch (error) {
      toast.error('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadConfig} />

  return (
    <div className="space-y-6">
      <Header
        title="Marketplace Configuration"
        subtitle="Configure commission rates, fees, and payout settings"
        action={{
          label: "Save Changes",
          icon: "Save",
          onClick: handleSave,
          loading: saving
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Percent" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Commission</h3>
              <p className="text-sm text-gray-400">Base commission structure</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Commission Type</label>
              <Select
                value={config.commission.type}
                onChange={(e) => updateConfig('commission', 'type', e.target.value)}
                className="w-full"
              >
                <option value="flat">Flat Rate</option>
                <option value="category">Category-based</option>
                <option value="tier">Tier-based</option>
                <option value="volume">Volume-based</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Base Rate (%)</label>
              <Input
                type="number"
                value={config.commission.baseRate}
                onChange={(e) => updateConfig('commission', 'baseRate', parseFloat(e.target.value))}
                placeholder="15"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
        </motion.div>

        {/* Additional Fees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="CreditCard" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Additional Fees</h3>
              <p className="text-sm text-gray-400">Listing and transaction fees</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Listing Fee ($)</label>
              <Input
                type="number"
                value={config.fees.listingFee}
                onChange={(e) => updateConfig('fees', 'listingFee', parseFloat(e.target.value))}
                placeholder="2.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Transaction Fee (%)</label>
              <Input
                type="number"
                value={config.fees.transactionFee}
                onChange={(e) => updateConfig('fees', 'transactionFee', parseFloat(e.target.value))}
                placeholder="2.5"
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Payment Processing</label>
              <Select
                value={config.fees.paymentProcessing}
                onChange={(e) => updateConfig('fees', 'paymentProcessing', e.target.value)}
                className="w-full"
              >
                <option value="platform">Platform Pays</option>
                <option value="vendor">Vendor Pays</option>
                <option value="split">Split Cost</option>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Payout Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Wallet" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Payouts</h3>
              <p className="text-sm text-gray-400">Payout schedule and requirements</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Payout Schedule</label>
              <Select
                value={config.payouts.schedule}
                onChange={(e) => updateConfig('payouts', 'schedule', e.target.value)}
                className="w-full"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="net15">Net 15</option>
                <option value="net30">Net 30</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Minimum Amount ($)</label>
              <Input
                type="number"
                value={config.payouts.minimumAmount}
                onChange={(e) => updateConfig('payouts', 'minimumAmount', parseFloat(e.target.value))}
                placeholder="50"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Hold Period (days)</label>
              <Input
                type="number"
                value={config.payouts.holdPeriod}
                onChange={(e) => updateConfig('payouts', 'holdPeriod', parseInt(e.target.value))}
                placeholder="7"
                min="0"
                max="365"
              />
            </div>
          </div>
        </motion.div>

        {/* Vendor Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-success to-info rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Vendor Requirements</h3>
              <p className="text-sm text-gray-400">KYC and verification settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-white">KYC Required</label>
                <p className="text-xs text-gray-400">Require identity verification</p>
              </div>
              <button
                onClick={() => updateConfig('vendorRequirements', 'kycRequired', !config.vendorRequirements.kycRequired)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.vendorRequirements.kycRequired ? 'bg-primary' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.vendorRequirements.kycRequired ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-white">Business Vendors</label>
                <p className="text-xs text-gray-400">Allow business accounts</p>
              </div>
              <button
                onClick={() => updateConfig('vendorRequirements', 'businessVendors', !config.vendorRequirements.businessVendors)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.vendorRequirements.businessVendors ? 'bg-primary' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.vendorRequirements.businessVendors ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-white">International Support</label>
                <p className="text-xs text-gray-400">Allow international vendors</p>
              </div>
              <button
                onClick={() => updateConfig('vendorRequirements', 'internationalSupport', !config.vendorRequirements.internationalSupport)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.vendorRequirements.internationalSupport ? 'bg-primary' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.vendorRequirements.internationalSupport ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button for Mobile */}
      <div className="lg:hidden">
        <Button
          onClick={handleSave}
          loading={saving}
          className="w-full btn-primary"
        >
          <ApperIcon name="Save" className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  )
}

export default MarketplaceConfig