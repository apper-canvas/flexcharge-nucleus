import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { createOrganization } from '@/services/api/organizationService'

const Onboarding = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    businessType: '',
    currency: 'USD',
    country: '',
    logo: null
  })

  const businessTypes = [
    { value: 'saas', label: 'SaaS/Software' },
    { value: 'digital', label: 'Digital Products' },
    { value: 'services', label: 'Services' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'mixed', label: 'Mixed' }
  ]

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' }
  ]

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' }
  ]

const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file must be less than 5MB')
      return
    }

    // Convert to base64 for storage
    const reader = new FileReader()
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, logo: e.target.result }))
      toast.success('Logo uploaded successfully')
    }
    reader.onerror = () => {
      toast.error('Failed to upload logo')
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleLogoUpload(file)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    handleLogoUpload(file)
  }

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }))
    toast.info('Logo removed')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.businessType) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await createOrganization(formData)
      toast.success('Organization created successfully!')
      navigate('/billing-models')
    } catch (error) {
      toast.error('Failed to create organization')
    }
  }

  const handleSkip = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Zap" className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome to FlexCharge</h1>
          <p className="text-gray-400">Let's set up your billing platform</p>
        </div>

        <div className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Organization Name"
              placeholder="Enter your organization name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />

            <Select
              label="Business Type"
              options={businessTypes}
              value={formData.businessType}
              onChange={(e) => handleInputChange('businessType', e.target.value)}
              placeholder="Select business type"
            />

            <Select
              label="Primary Currency"
              options={currencies}
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
            />

            <Select
              label="Country"
              options={countries}
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Select country"
            />
<div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Logo Upload (Optional)
              </label>
              
              {formData.logo ? (
                <div className="relative">
                  <div className="bg-surface/40 border border-white/10 rounded-lg p-4 flex items-center justify-center">
                    <img 
                      src={formData.logo} 
                      alt="Organization logo" 
                      className="max-h-24 max-w-full object-contain rounded"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 hover:bg-error/80 transition-colors"
                  >
                    <ApperIcon name="X" size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className="bg-surface/40 border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('logo-upload').click()}
                >
                  <ApperIcon name="Upload" size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-400 mb-1">Drop your logo here or click to browse</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                icon="ArrowRight"
                className="flex-1"
              >
                Continue
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
              >
                Skip
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Onboarding