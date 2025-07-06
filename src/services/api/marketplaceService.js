import mockConfig from '@/services/mockData/marketplaceConfig.json'

let marketplaceConfig = { ...mockConfig }

export const getMarketplaceConfig = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return marketplaceConfig
}

export const updateMarketplaceConfig = async (id, data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  if (parseInt(id) !== marketplaceConfig.Id) {
    throw new Error('Marketplace configuration not found')
  }
  
  marketplaceConfig = { 
    ...marketplaceConfig, 
    ...data,
    updatedAt: new Date().toISOString()
  }
  
  return marketplaceConfig
}