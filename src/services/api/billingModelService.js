import mockModels from '@/services/mockData/billingModels.json'

let billingModels = [...mockModels]

export const getBillingModels = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return billingModels
}

export const getBillingModelById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const model = billingModels.find(m => m.Id === parseInt(id))
  if (!model) {
    throw new Error('Billing model not found')
  }
  
  return model
}

export const updateBillingModel = async (id, data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = billingModels.findIndex(m => m.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Billing model not found')
  }
  
  billingModels[index] = { ...billingModels[index], ...data }
  return billingModels[index]
}

export const createBillingModel = async (data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const maxId = Math.max(...billingModels.map(m => m.Id))
  const newModel = {
    Id: maxId + 1,
    ...data,
    createdAt: new Date().toISOString()
  }
  
  billingModels.push(newModel)
  return newModel
}