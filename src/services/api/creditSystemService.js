import mockCreditSystem from '@/services/mockData/creditSystem.json'

let creditSystemData = { ...mockCreditSystem }

// Credit System Configuration
export const getCreditSystemConfig = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return creditSystemData.definition
}

export const updateCreditDefinition = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  creditSystemData.definition = { ...creditSystemData.definition, ...data }
  return creditSystemData.definition
}

// Credit Packages
export const getCreditPackages = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return [...creditSystemData.packages]
}

export const getCreditPackageById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200))
  const package_ = creditSystemData.packages.find(p => p.Id === parseInt(id))
  if (!package_) {
    throw new Error('Credit package not found')
  }
  return package_
}

export const createCreditPackage = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const maxId = Math.max(...creditSystemData.packages.map(p => p.Id), 0)
  const newPackage = {
    Id: maxId + 1,
    ...data,
    createdAt: new Date().toISOString()
  }
  creditSystemData.packages.push(newPackage)
  return newPackage
}

export const updateCreditPackage = async (id, data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const index = creditSystemData.packages.findIndex(p => p.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Credit package not found')
  }
  creditSystemData.packages[index] = { ...creditSystemData.packages[index], ...data }
  return creditSystemData.packages[index]
}

export const deleteCreditPackage = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const index = creditSystemData.packages.findIndex(p => p.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Credit package not found')
  }
  creditSystemData.packages.splice(index, 1)
  return true
}

// Credit Rules
export const getCreditRules = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return creditSystemData.rules
}

export const updateCreditRules = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  creditSystemData.rules = { ...creditSystemData.rules, ...data }
  return creditSystemData.rules
}

// Consumption Rates
export const getConsumptionRates = async () => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return [...creditSystemData.consumptionRates]
}

export const getConsumptionRateById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200))
  const rate = creditSystemData.consumptionRates.find(r => r.Id === parseInt(id))
  if (!rate) {
    throw new Error('Consumption rate not found')
  }
  return rate
}

export const createConsumptionRate = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const maxId = Math.max(...creditSystemData.consumptionRates.map(r => r.Id), 0)
  const newRate = {
    Id: maxId + 1,
    ...data,
    createdAt: new Date().toISOString()
  }
  creditSystemData.consumptionRates.push(newRate)
  return newRate
}

export const updateConsumptionRate = async (id, data) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const index = creditSystemData.consumptionRates.findIndex(r => r.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Consumption rate not found')
  }
  creditSystemData.consumptionRates[index] = { ...creditSystemData.consumptionRates[index], ...data }
  return creditSystemData.consumptionRates[index]
}

export const deleteConsumptionRate = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const index = creditSystemData.consumptionRates.findIndex(r => r.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Consumption rate not found')
  }
  creditSystemData.consumptionRates.splice(index, 1)
  return true
}