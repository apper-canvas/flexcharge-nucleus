// Mock configuration data
const mockConfig = {
  delivery: {
    method: 'download',
    downloadLimit: 5,
    expiration: '24h',
    ipRestriction: false,
    emailTemplate: 'Thank you for your purchase! Your download is ready.',
    sizeLimit: '10',
    duration: 'lifetime',
    deviceLimit: 3
  },
  licensing: {
    type: 'personal',
    generateKeys: true,
    activationRequired: false
  },
  payments: {
    preOrders: true,
    partialPayments: false,
    minimumDeposit: 25
  },
  refunds: {
    policy: '7d',
    policyText: 'Full refund available within 7 days of purchase if not satisfied with the product.'
  }
}

let config = { ...mockConfig }

export const getOneTimePurchaseConfig = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return { ...config }
}

export const updateOneTimePurchaseConfig = async (newConfig) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  config = { ...newConfig }
  return { ...config }
}