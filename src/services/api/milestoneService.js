// Mock milestone configuration data
const mockConfig = {
  templates: {
    available: [
      {
        Id: 1,
        name: "Website Development",
        description: "Complete website development with design, development, and deployment phases",
        icon: "Globe",
        milestones: 5,
        isActive: true
      },
      {
        Id: 2,
        name: "Mobile App Development",
        description: "Native or hybrid mobile app development with testing and deployment",
        icon: "Smartphone",
        milestones: 6,
        isActive: true
      },
      {
        Id: 3,
        name: "Logo & Brand Design",
        description: "Complete brand identity package including logo, colors, and guidelines",
        icon: "Palette",
        milestones: 4,
        isActive: false
      },
      {
        Id: 4,
        name: "Content Writing",
        description: "Professional content creation with research, writing, and editing phases",
        icon: "FileText",
        milestones: 3,
        isActive: true
      },
      {
        Id: 5,
        name: "SEO Optimization",
        description: "Complete SEO audit and optimization with keyword research and implementation",
        icon: "Search",
        milestones: 4,
        isActive: false
      },
      {
        Id: 6,
        name: "Social Media Campaign",
        description: "Strategic social media campaign with content creation and performance tracking",
        icon: "Share2",
        milestones: 5,
        isActive: true
      }
    ]
  },
  paymentTerms: {
    requireDeposit: true,
    depositPercentage: 25,
    paymentTimeout: 7,
    lateFeePercentage: 5,
    autoReleasePayments: false
  },
  evidence: {
    required: true,
    maxFiles: 5,
    maxFileSize: 10,
    autoApprove: false,
    allowedTypes: [
      {
        name: "Screenshots",
        extensions: [".jpg", ".jpeg", ".png", ".gif"],
        enabled: true
      },
      {
        name: "Documents",
        extensions: [".pdf", ".doc", ".docx", ".txt"],
        enabled: true
      },
      {
        name: "Spreadsheets",
        extensions: [".xls", ".xlsx", ".csv"],
        enabled: false
      },
      {
        name: "Presentations",
        extensions: [".ppt", ".pptx"],
        enabled: false
      },
      {
        name: "Archive Files",
        extensions: [".zip", ".rar", ".7z"],
        enabled: true
      }
    ]
  },
  disputes: {
    enabled: true,
    disputeWindow: 7,
    mediationType: "platform",
    mediationFee: 3,
    autoEscalate: false,
    escalationTimeout: 14
  }
}

let config = { ...mockConfig }

export const getMilestoneConfig = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return { ...config }
}

export const updateMilestoneConfig = async (newConfig) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  config = { ...newConfig }
  return { ...config }
}