import mockUsageBasedConfig from '@/services/mockData/usageBasedConfig.json'

let usageBasedData = { ...mockUsageBasedConfig }

// Meters
export const getMeters = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return [...usageBasedData.meters]
}

export const getMeterById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200))
  const meter = usageBasedData.meters.find(m => m.Id === parseInt(id))
  if (!meter) {
    throw new Error('Meter not found')
  }
  return meter
}

export const createMeter = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const maxId = Math.max(...usageBasedData.meters.map(m => m.Id), 0)
  const newMeter = {
    Id: maxId + 1,
    ...data,
    createdAt: new Date().toISOString()
  }
  usageBasedData.meters.push(newMeter)
  return newMeter
}

export const updateMeter = async (id, data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const index = usageBasedData.meters.findIndex(m => m.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Meter not found')
  }
  usageBasedData.meters[index] = { ...usageBasedData.meters[index], ...data }
  return usageBasedData.meters[index]
}

export const deleteMeter = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const index = usageBasedData.meters.findIndex(m => m.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Meter not found')
  }
  usageBasedData.meters.splice(index, 1)
  return true
}

// Pricing Models
export const getPricingModels = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return [...usageBasedData.pricingModels]
}

export const getPricingModelById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200))
  const model = usageBasedData.pricingModels.find(m => m.Id === parseInt(id))
  if (!model) {
    throw new Error('Pricing model not found')
  }
  return model
}

export const createPricingModel = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const maxId = Math.max(...usageBasedData.pricingModels.map(m => m.Id), 0)
  const newModel = {
    Id: maxId + 1,
    ...data,
    createdAt: new Date().toISOString()
  }
  usageBasedData.pricingModels.push(newModel)
  return newModel
}

export const updatePricingModel = async (id, data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const index = usageBasedData.pricingModels.findIndex(m => m.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Pricing model not found')
  }
  usageBasedData.pricingModels[index] = { ...usageBasedData.pricingModels[index], ...data }
  return usageBasedData.pricingModels[index]
}

export const deletePricingModel = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const index = usageBasedData.pricingModels.findIndex(m => m.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Pricing model not found')
  }
  usageBasedData.pricingModels.splice(index, 1)
  return true
}

// Usage Controls
export const getUsageControls = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return usageBasedData.usageControls
}

export const updateUsageControls = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  usageBasedData.usageControls = { ...usageBasedData.usageControls, ...data }
  return usageBasedData.usageControls
}

// Rate Configurations
export const getRateConfigurations = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return [...usageBasedData.rateConfigurations]
}

export const getRateConfigurationById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200))
  const config = usageBasedData.rateConfigurations.find(r => r.Id === parseInt(id))
  if (!config) {
    throw new Error('Rate configuration not found')
  }
  return config
}

export const createRateConfiguration = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const maxId = Math.max(...usageBasedData.rateConfigurations.map(r => r.Id), 0)
  const newConfig = {
    Id: maxId + 1,
    ...data,
    createdAt: new Date().toISOString()
  }
  usageBasedData.rateConfigurations.push(newConfig)
  return newConfig
}

export const updateRateConfiguration = async (id, data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const index = usageBasedData.rateConfigurations.findIndex(r => r.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Rate configuration not found')
  }
  usageBasedData.rateConfigurations[index] = { ...usageBasedData.rateConfigurations[index], ...data }
  return usageBasedData.rateConfigurations[index]
}

export const deleteRateConfiguration = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const index = usageBasedData.rateConfigurations.findIndex(r => r.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Rate configuration not found')
  }
  usageBasedData.rateConfigurations.splice(index, 1)
  return true
}