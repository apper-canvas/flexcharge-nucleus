import mockOrders from '@/services/mockData/orders.json'

let orders = [...mockOrders]

export const getOrders = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return [...orders]
}

export const getOrderById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const order = orders.find(o => o.Id === parseInt(id))
  if (!order) {
    throw new Error('Order not found')
  }
  
  return order
}

export const createOrder = async (data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const maxId = Math.max(...orders.map(o => o.Id))
  const newOrder = {
    Id: maxId + 1,
    ...data,
    createdAt: new Date().toISOString()
  }
  
  orders.push(newOrder)
  return newOrder
}

export const updateOrder = async (id, data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = orders.findIndex(o => o.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Order not found')
  }
  
  orders[index] = { ...orders[index], ...data }
  return orders[index]
}

export const deleteOrder = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = orders.findIndex(o => o.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Order not found')
  }
  
  orders.splice(index, 1)
  return true
}