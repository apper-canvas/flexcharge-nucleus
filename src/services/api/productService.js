import mockProducts from '@/services/mockData/products.json'

let products = [...mockProducts]

export const getProducts = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return products
}

export const getProductById = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const product = products.find(p => p.Id === parseInt(id))
  if (!product) {
    throw new Error('Product not found')
  }
  
  return product
}

export const createProduct = async (data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const maxId = Math.max(...products.map(p => p.Id))
  const newProduct = {
    Id: maxId + 1,
    ...data,
    createdAt: new Date().toISOString()
  }
  
  products.push(newProduct)
  return newProduct
}

export const updateProduct = async (id, data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = products.findIndex(p => p.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Product not found')
  }
  
  products[index] = { ...products[index], ...data }
  return products[index]
}

export const deleteProduct = async (id) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = products.findIndex(p => p.Id === parseInt(id))
  if (index === -1) {
    throw new Error('Product not found')
  }
  
  products.splice(index, 1)
  return true
}