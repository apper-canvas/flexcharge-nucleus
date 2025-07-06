import mockOrganization from '@/services/mockData/organization.json'

let organization = { ...mockOrganization }

export const getOrganization = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return organization
}

export const createOrganization = async (data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  organization = {
    Id: 1,
    ...data,
    createdAt: new Date().toISOString()
  }
  
  return organization
}

export const updateOrganization = async (data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  organization = { ...organization, ...data }
  return organization
}