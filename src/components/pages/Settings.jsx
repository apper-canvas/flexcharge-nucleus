import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getSettings, updateSettings } from '@/services/api/settingsService'

const Settings = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('organization')
  const [saving, setSaving] = useState(false)

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getSettings()
      setSettings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSave = async (section, data) => {
    try {
      setSaving(true)
      await updateSettings(section, data)
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'organization', label: 'Organization', icon: 'Building' },
    { id: 'payment', label: 'Payment', icon: 'CreditCard' },
    { id: 'tax', label: 'Tax', icon: 'Receipt' },
    { id: 'integrations', label: 'Integrations', icon: 'Puzzle' }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSettings} />

  return (
    <div>
      <Header
        title="Settings"
        subtitle="Configure your billing platform"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-surface/40 text-gray-400 hover:text-white hover:bg-surface/60'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            {activeTab === 'organization' && (
              <OrganizationSettings 
                settings={settings?.organization} 
                onSave={(data) => handleSave('organization', data)}
                saving={saving}
              />
            )}
            
            {activeTab === 'payment' && (
              <PaymentSettings 
                settings={settings?.payment} 
                onSave={(data) => handleSave('payment', data)}
                saving={saving}
              />
            )}
            
            {activeTab === 'tax' && (
              <TaxSettings 
                settings={settings?.tax} 
                onSave={(data) => handleSave('tax', data)}
                saving={saving}
              />
            )}
            
            {activeTab === 'integrations' && (
              <IntegrationSettings 
                settings={settings?.integrations} 
                onSave={(data) => handleSave('integrations', data)}
                saving={saving}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const OrganizationSettings = ({ settings, onSave, saving }) => {
  const [formData, setFormData] = useState({
    name: settings?.name || '',
    email: settings?.email || '',
    phone: settings?.phone || '',
    address: settings?.address || '',
    website: settings?.website || '',
    timezone: settings?.timezone || 'UTC'
  })

  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-6">Organization Settings</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Organization Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <Input
            label="Website"
            value={formData.website}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
          />
        </div>
        
        <Input
          label="Address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
        
        <Select
          label="Timezone"
          options={timezones}
          value={formData.timezone}
          onChange={(e) => setFormData({...formData, timezone: e.target.value})}
        />
        
        <Button
          type="submit"
          variant="primary"
          isLoading={saving}
          icon="Save"
        >
          Save Changes
        </Button>
      </form>
    </div>
  )
}

const PaymentSettings = ({ settings, onSave, saving }) => {
  const [formData, setFormData] = useState({
    stripePublishableKey: settings?.stripePublishableKey || '',
    stripeSecretKey: settings?.stripeSecretKey || '',
    paypalClientId: settings?.paypalClientId || '',
    currency: settings?.currency || 'USD',
    webhookUrl: settings?.webhookUrl || ''
  })

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-6">Payment Settings</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-2">Stripe Configuration</h4>
          <p className="text-sm text-gray-400 mb-4">
            Connect your Stripe account to process payments
          </p>
          
          <div className="space-y-4">
            <Input
              label="Publishable Key"
              value={formData.stripePublishableKey}
              onChange={(e) => setFormData({...formData, stripePublishableKey: e.target.value})}
              placeholder="pk_test_..."
            />
            <Input
              label="Secret Key"
              type="password"
              value={formData.stripeSecretKey}
              onChange={(e) => setFormData({...formData, stripeSecretKey: e.target.value})}
              placeholder="sk_test_..."
            />
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-2">PayPal Configuration</h4>
          <p className="text-sm text-gray-400 mb-4">
            Connect your PayPal account for additional payment options
          </p>
          
          <Input
            label="PayPal Client ID"
            value={formData.paypalClientId}
            onChange={(e) => setFormData({...formData, paypalClientId: e.target.value})}
            placeholder="Your PayPal Client ID"
          />
        </div>
        
        <Select
          label="Default Currency"
          options={currencies}
          value={formData.currency}
          onChange={(e) => setFormData({...formData, currency: e.target.value})}
        />
        
        <Input
          label="Webhook URL"
          value={formData.webhookUrl}
          onChange={(e) => setFormData({...formData, webhookUrl: e.target.value})}
          placeholder="https://your-domain.com/webhook"
        />
        
        <Button
          type="submit"
          variant="primary"
          isLoading={saving}
          icon="Save"
        >
          Save Payment Settings
        </Button>
      </form>
    </div>
  )
}

const TaxSettings = ({ settings, onSave, saving }) => {
  const [formData, setFormData] = useState({
    taxEnabled: settings?.taxEnabled || false,
    taxRate: settings?.taxRate || 0,
    taxName: settings?.taxName || 'VAT',
    taxNumber: settings?.taxNumber || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-6">Tax Settings</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="taxEnabled"
            checked={formData.taxEnabled}
            onChange={(e) => setFormData({...formData, taxEnabled: e.target.checked})}
            className="w-4 h-4 text-primary bg-surface border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <label htmlFor="taxEnabled" className="text-white font-medium">
            Enable Tax Collection
          </label>
        </div>
        
        {formData.taxEnabled && (
          <div className="space-y-4 p-4 bg-white/5 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tax Name"
                value={formData.taxName}
                onChange={(e) => setFormData({...formData, taxName: e.target.value})}
                placeholder="VAT, GST, Sales Tax"
              />
              <Input
                label="Tax Rate (%)"
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData({...formData, taxRate: parseFloat(e.target.value)})}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            
            <Input
              label="Tax Number"
              value={formData.taxNumber}
              onChange={(e) => setFormData({...formData, taxNumber: e.target.value})}
              placeholder="Your tax identification number"
            />
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          isLoading={saving}
          icon="Save"
        >
          Save Tax Settings
        </Button>
      </form>
    </div>
  )
}

const IntegrationSettings = ({ settings, onSave, saving }) => {
  const integrations = [
    {
      name: 'Zapier',
      description: 'Automate workflows with 5000+ apps',
      icon: 'Zap',
      connected: false
    },
    {
      name: 'Slack',
      description: 'Get notifications in your Slack channels',
      icon: 'MessageSquare',
      connected: false
    },
    {
      name: 'Google Analytics',
      description: 'Track conversion and user behavior',
      icon: 'BarChart',
      connected: false
    },
    {
      name: 'Mailchimp',
      description: 'Sync customers to your email lists',
      icon: 'Mail',
      connected: false
    }
  ]

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-6">Integrations</h3>
      
      <div className="space-y-4">
        {integrations.map((integration, index) => (
          <div key={integration.name} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name={integration.icon} className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-white">{integration.name}</h4>
                <p className="text-sm text-gray-400">{integration.description}</p>
              </div>
            </div>
            
            <Button
              variant={integration.connected ? "secondary" : "primary"}
              size="sm"
              onClick={() => toast.info(`${integration.name} integration coming soon!`)}
            >
              {integration.connected ? "Connected" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Settings