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
    localStorage.setItem('onboarding_completed', 'true')
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