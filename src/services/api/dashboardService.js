import mockStats from '@/services/mockData/dashboardStats.json'

export const getDashboardStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return mockStats
}