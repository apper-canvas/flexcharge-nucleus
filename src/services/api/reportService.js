import mockReports from '@/services/mockData/reports.json'

export const getReportsData = async (timeRange = '30d') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // Return different data based on time range
  return mockReports[timeRange] || mockReports['30d']
}

export const generateReport = async (type, options = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    id: Date.now(),
    type,
    options,
    generatedAt: new Date().toISOString(),
    downloadUrl: '#'
  }
}