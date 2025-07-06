import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getOneTimePurchaseConfig, updateOneTimePurchaseConfig } from '@/services/api/oneTimePurchaseService'

const OneTimePurchaseConfig = () => {
  const navigate = useNavigate()
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOneTimePurchaseConfig()
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

  const handleConfigChange = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSaveConfig = async () => {
    try {
      setSaving(true)
      await updateOneTimePurchaseConfig(config)
      toast.success('Configuration saved successfully!')
    } catch (error) {
      toast.error('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/billing-models')
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadConfig} />

  return (
    <div>
      <Header
        title="One-Time Purchase Configuration"
        subtitle="Configure delivery, licensing, and payment options"
        action={{
          label: "Back to Models",
          icon: "ArrowLeft",
          onClick: handleCancel
        }}
      />

      <div className="space-y-8">
        {/* Product Delivery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Package" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Product Delivery</h3>
              <p className="text-gray-400 text-sm">Configure how products are delivered to customers</p>
            </div>
          </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Delivery Method
              </label>
              <Select
                value={config?.delivery?.method || 'download'}
                onChange={(e) => handleConfigChange('delivery', 'method', e.target.value)}
                className="w-full"
              >
                <option value="download">Instant Download</option>
                <option value="email">Email Delivery</option>
                <option value="account">Account-Based Access</option>
                <option value="api">API/Webhook</option>
                <option value="none">No Delivery</option>
              </Select>
            </div>

{(config?.delivery?.method || 'download') === 'download' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Download Limit
                  </label>
                  <Input
                    type="number"
                    value={config?.delivery?.downloadLimit || 5}
                    onChange={(e) => handleConfigChange('delivery', 'downloadLimit', parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>
                <div>
<label className="block text-sm font-medium text-gray-300 mb-2">
                    Download Expiration
                  </label>
                  <Select
                    value={config?.delivery?.expiration || '24h'}
                    onChange={(e) => handleConfigChange('delivery', 'expiration', e.target.value)}
                    options={[
                      { value: '24h', label: '24 Hours' },
                      { value: '7d', label: '7 Days' },
                      { value: '30d', label: '30 Days' },
                      { value: 'never', label: 'Never' }
                    ]}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ipRestriction"
                    checked={config?.delivery?.ipRestriction || false}
                    onChange={(e) => handleConfigChange('delivery', 'ipRestriction', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                  />
                  <label htmlFor="ipRestriction" className="text-sm text-gray-300">
                    Enable IP Restriction
                  </label>
                </div>
              </>
            )}

{(config?.delivery?.method || 'download') === 'email' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Template
                  </label>
                  <textarea
                    value={config?.delivery?.emailTemplate || ''}
                    onChange={(e) => handleConfigChange('delivery', 'emailTemplate', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none"
                    placeholder="Enter email template content..."
                  />
                </div>
                <div>
<label className="block text-sm font-medium text-gray-300 mb-2">
                    Size Limit (MB)
                  </label>
                  <Select
                    value={config?.delivery?.sizeLimit || '10'}
                    onChange={(e) => handleConfigChange('delivery', 'sizeLimit', e.target.value)}
                    options={[
                      { value: '10', label: '10 MB' },
                      { value: '25', label: '25 MB' },
                      { value: '50', label: '50 MB' }
                    ]}
                  />
                </div>
              </>
            )}

{(config?.delivery?.method || 'download') === 'account' && (
              <>
                <div>
<label className="block text-sm font-medium text-gray-300 mb-2">
                    Access Duration
                  </label>
                  <Select
                    value={config?.delivery?.duration || 'lifetime'}
                    onChange={(e) => handleConfigChange('delivery', 'duration', e.target.value)}
                    options={[
                      { value: 'lifetime', label: 'Lifetime' },
                      { value: '1y', label: '1 Year' },
                      { value: '6m', label: '6 Months' },
                      { value: '3m', label: '3 Months' },
                      { value: 'custom', label: 'Custom' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Device Limit
                  </label>
<Input
                    type="number"
                    value={config?.delivery?.deviceLimit || 3}
                    onChange={(e) => handleConfigChange('delivery', 'deviceLimit', parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Licensing Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Shield" className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Licensing</h3>
              <p className="text-gray-400 text-sm">Configure licensing and activation options</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
<label className="block text-sm font-medium text-gray-300 mb-2">
                License Type
              </label>
              <Select
                value={config?.licensing?.type || 'personal'}
                onChange={(e) => handleConfigChange('licensing', 'type', e.target.value)}
                options={[
                  { value: 'personal', label: 'Personal' },
                  { value: 'commercial', label: 'Commercial' },
                  { value: 'extended', label: 'Extended' },
                  { value: 'custom', label: 'Custom' }
                ]}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="generateKeys"
                checked={config?.licensing?.generateKeys || false}
                onChange={(e) => handleConfigChange('licensing', 'generateKeys', e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
              />
              <label htmlFor="generateKeys" className="text-sm text-gray-300">
                Generate License Keys
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activationRequired"
                checked={config?.licensing?.activationRequired || false}
                onChange={(e) => handleConfigChange('licensing', 'activationRequired', e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
              />
              <label htmlFor="activationRequired" className="text-sm text-gray-300">
                Activation Required
              </label>
            </div>
          </div>
        </motion.div>

        {/* Payment Options Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="CreditCard" className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Payment Options</h3>
              <p className="text-gray-400 text-sm">Configure payment and ordering options</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="preOrders"
                checked={config?.payments?.preOrders || false}
                onChange={(e) => handleConfigChange('payments', 'preOrders', e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
              />
              <label htmlFor="preOrders" className="text-sm text-gray-300">
                Allow Pre-orders
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="partialPayments"
                checked={config?.payments?.partialPayments || false}
                onChange={(e) => handleConfigChange('payments', 'partialPayments', e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
              />
              <label htmlFor="partialPayments" className="text-sm text-gray-300">
                Allow Partial Payments
              </label>
            </div>
{config?.payments?.partialPayments && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Deposit (%)
                </label>
                <Input
                  type="number"
                  value={config?.payments?.minimumDeposit || 25}
                  onChange={(e) => handleConfigChange('payments', 'minimumDeposit', parseInt(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Refund Policy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="RefreshCw" className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Refund Policy</h3>
              <p className="text-gray-400 text-sm">Configure refund terms and conditions</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
<label className="block text-sm font-medium text-gray-300 mb-2">
                Refund Policy
              </label>
              <Select
                value={config?.refunds?.policy || 'none'}
                onChange={(e) => handleConfigChange('refunds', 'policy', e.target.value)}
                options={[
                  { value: 'none', label: 'No Refunds' },
                  { value: '7d', label: '7 Days' },
                  { value: '14d', label: '14 Days' },
                  { value: '30d', label: '30 Days' },
                  { value: 'custom', label: 'Custom' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Policy Text
              </label>
              <textarea
                value={config?.refunds?.policyText || ''}
                onChange={(e) => handleConfigChange('refunds', 'policyText', e.target.value)}
                rows="4"
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-primary/50 focus:outline-none"
                placeholder="Enter refund policy terms..."
              />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end gap-4"
        >
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveConfig}
            disabled={saving}
            icon={saving ? "Loader2" : "Save"}
          >
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default OneTimePurchaseConfig