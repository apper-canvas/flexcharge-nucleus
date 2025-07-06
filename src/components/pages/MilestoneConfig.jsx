import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { getMilestoneConfig, updateMilestoneConfig } from "@/services/api/milestoneService";

const MilestoneConfig = () => {
  const navigate = useNavigate()
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMilestoneConfig()
      setConfig(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const handleConfigChange = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleArrayChange = (section, field, index, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].map((item, i) => 
          i === index ? value : item
        )
      }
    }))
  }

  const handleSaveConfig = async () => {
    try {
      setSaving(true)
      await updateMilestoneConfig(config)
      toast.success('Milestone configuration saved successfully!')
    } catch (error) {
      toast.error('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  if (loading) return <Loading type="dashboard" />
  if (error) return <Error message={error} onRetry={loadConfig} />

  return (
    <div>
      <Header
        title="Milestone/Project Configuration"
        subtitle="Configure project templates, payment terms, evidence requirements, and dispute resolution"
        action={{
          label: "Back to Dashboard",
          icon: "ArrowLeft",
          onClick: handleCancel
        }}
      />

      <div className="space-y-8">
        {/* Templates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="FileText" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Project Templates</h3>
              <p className="text-gray-400 text-sm">Pre-made templates for common project types</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config?.templates?.available?.map((template, index) => (
                <div key={template.Id} className="bg-black/20 border border-white/10 rounded-lg p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ApperIcon name={template.icon} className="w-5 h-5 text-primary" />
                      <h4 className="font-medium text-white">{template.name}</h4>
                    </div>
                    <Badge variant={template.isActive ? "success" : "secondary"}>
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{template.milestones} milestones</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`template-${template.Id}`}
                        checked={template.isActive}
                        onChange={(e) => handleArrayChange('templates', 'available', index, {
                          ...template,
                          isActive: e.target.checked
                        })}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`template-${template.Id}`} className="text-sm text-gray-300">
                        Enable
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Payment Terms Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="CreditCard" className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Payment Terms</h3>
              <p className="text-gray-400 text-sm">Configure deposit requirements and payment timeouts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requireDeposit"
                  checked={config?.paymentTerms?.requireDeposit || false}
                  onChange={(e) => handleConfigChange('paymentTerms', 'requireDeposit', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                />
                <label htmlFor="requireDeposit" className="text-sm text-gray-300">
                  Require Initial Deposit
                </label>
              </div>

              {config?.paymentTerms?.requireDeposit && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Deposit Percentage
                  </label>
                  <Input
                    type="number"
                    value={config.paymentTerms.depositPercentage || 25}
                    onChange={(e) => handleConfigChange('paymentTerms', 'depositPercentage', parseInt(e.target.value))}
                    min="5"
                    max="100"
                    className="w-full"
                  />
                </div>
              )}
)}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Timeout (days)
                </label>
                <Select
                  value={config?.paymentTerms?.paymentTimeout || 7}
                  onChange={(e) => handleConfigChange('paymentTerms', 'paymentTimeout', parseInt(e.target.value))}
                  className="w-full"
                  options={[
                    { value: 3, label: '3 Days' },
                    { value: 7, label: '7 Days' },
                    { value: 14, label: '14 Days' },
                    { value: 30, label: '30 Days' }
                  ]}
/>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Late Payment Fee (%)
                </label>
                <Input
                  type="number"
                  value={config?.paymentTerms?.lateFeePercentage || 5}
                  onChange={(e) => handleConfigChange('paymentTerms', 'lateFeePercentage', parseInt(e.target.value))}
                  min="0"
                  max="25"
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRelease"
                  checked={config?.paymentTerms?.autoReleasePayments || false}
                  onChange={(e) => handleConfigChange('paymentTerms', 'autoReleasePayments', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                />
                <label htmlFor="autoRelease" className="text-sm text-gray-300">
                  Auto-release payments on milestone completion
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Evidence Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Upload" className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Evidence Requirements</h3>
              <p className="text-gray-400 text-sm">Configure file upload requirements and allowed types</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requireEvidence"
                  checked={config?.evidence?.required || false}
                  onChange={(e) => handleConfigChange('evidence', 'required', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                />
                <label htmlFor="requireEvidence" className="text-sm text-gray-300">
                  Require Evidence for Milestone Completion
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maximum Files per Milestone
                </label>
                <Input
                  type="number"
                  value={config?.evidence?.maxFiles || 5}
                  onChange={(e) => handleConfigChange('evidence', 'maxFiles', parseInt(e.target.value))}
                  min="1"
                  max="20"
                  className="w-full"
                />
              </div>
</div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maximum File Size (MB)
                </label>
                <Select
                  value={config?.evidence?.maxFileSize || 10}
                  onChange={(e) => handleConfigChange('evidence', 'maxFileSize', parseInt(e.target.value))}
                  className="w-full"
                  options={[
                    { value: 5, label: '5 MB' },
                    { value: 10, label: '10 MB' },
                    { value: 25, label: '25 MB' },
                    { value: 50, label: '50 MB' }
                  ]}
/>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Allowed File Types
                </label>
                <div className="space-y-2">
                  {config?.evidence?.allowedTypes?.map((type, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`filetype-${index}`}
                        checked={type.enabled}
                        onChange={(e) => handleArrayChange('evidence', 'allowedTypes', index, {
                          ...type,
                          enabled: e.target.checked
                        })}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`filetype-${index}`} className="text-sm text-gray-300">
                        {type.name} ({type.extensions.join(', ')})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoApprove"
                  checked={config?.evidence?.autoApprove || false}
                  onChange={(e) => handleConfigChange('evidence', 'autoApprove', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                />
                <label htmlFor="autoApprove" className="text-sm text-gray-300">
                  Auto-approve evidence upon upload
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dispute Resolution Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface/60 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Scale" className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Dispute Resolution</h3>
              <p className="text-gray-400 text-sm">Configure mediation and dispute handling settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableDisputes"
                  checked={config?.disputes?.enabled || false}
                  onChange={(e) => handleConfigChange('disputes', 'enabled', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                />
                <label htmlFor="enableDisputes" className="text-sm text-gray-300">
                  Enable Dispute System
                </label>
              </div>
</div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dispute Window (days)
                </label>
                <Select
                  value={config?.disputes?.disputeWindow || 7}
                  onChange={(e) => handleConfigChange('disputes', 'disputeWindow', parseInt(e.target.value))}
                  className="w-full"
                  options={[
                    { value: 3, label: '3 Days' },
                    { value: 7, label: '7 Days' },
                    { value: 14, label: '14 Days' },
                    { value: 30, label: '30 Days' }
                  ]}
/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mediation Type
                </label>
                <Select
                  value={config?.disputes?.mediationType || 'platform'}
                  onChange={(e) => handleConfigChange('disputes', 'mediationType', e.target.value)}
                  className="w-full"
                  options={[
                    { value: 'platform', label: 'Platform Mediation' },
                    { value: 'thirdparty', label: 'Third-Party Mediation' },
                    { value: 'automated', label: 'Automated Resolution' }
                  ]}
/>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mediation Fee (%)
                </label>
                <Input
                  type="number"
                  value={config?.disputes?.mediationFee || 3}
                  onChange={(e) => handleConfigChange('disputes', 'mediationFee', parseInt(e.target.value))}
                  min="0"
                  max="10"
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoEscalate"
                  checked={config?.disputes?.autoEscalate || false}
                  onChange={(e) => handleConfigChange('disputes', 'autoEscalate', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                />
                <label htmlFor="autoEscalate" className="text-sm text-gray-300">
                  Auto-escalate unresolved disputes
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Escalation Timeout (days)
                </label>
                <Input
                  type="number"
                  value={config?.disputes?.escalationTimeout || 14}
                  onChange={(e) => handleConfigChange('disputes', 'escalationTimeout', parseInt(e.target.value))}
                  min="1"
                  max="30"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end gap-4"
        >
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveConfig}
            disabled={saving}
            icon={saving ? "Loader2" : "Save"}
          >
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default MilestoneConfig