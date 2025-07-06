import mockCustomers from '@/services/mockData/customers.json'

let customers = [...mockCustomers]

export const getCustomers = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return [...customers]
}

export const getCustomerById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const customer = customers.find(c => c.Id === parseInt(id))
  if (!customer) {
    throw new Error('Customer not found')
  }
  
  return customer
}

export const createCustomer = async (data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const maxId = Math.max(...customers.map(c => c.Id))
  const newCustomer = {
    Id: maxId + 1,
    ...data,
    createdAt: new Date().toISOString()
  }
  
  customers.push(newCustomer)
  return newCustomer
}

export const updateCustomer = async (id, data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = customers.findIndex(c => c.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Customer not found')
  }
  
  customers[index] = { ...customers[index], ...data }
  return customers[index]
}

export const deleteCustomer = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = customers.findIndex(c => c.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Customer not found')
  }
  
  customers.splice(index, 1)
  return true
}