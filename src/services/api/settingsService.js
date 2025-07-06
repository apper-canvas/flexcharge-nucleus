import mockSettings from '@/services/mockData/settings.json'

let settings = { ...mockSettings }

export const getSettings = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return settings
}

export const updateSettings = async (section, data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  settings[section] = { ...settings[section], ...data }
  return settings[section]
}

export const resetSettings = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  settings = { ...mockSettings }
  return settings
}