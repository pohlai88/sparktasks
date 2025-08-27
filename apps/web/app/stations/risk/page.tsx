'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, TrendingUp, Eye, CheckCircle, Plus } from 'lucide-react'
import { Button } from '@sparktasks/ui'
import { useRailwayContext } from '@/lib/railway/context'
import { toast } from 'sonner'

interface Risk {
  id: string
  title: string
  description: string
  category: 'technical' | 'schedule' | 'budget' | 'resource' | 'external' | 'quality'
  probability: number // 1-5 scale
  impact: number // 1-5 scale
  riskScore: number // probability * impact
  mitigation: string
  contingency: string
  owner: string
  status: 'identified' | 'assessed' | 'mitigated' | 'closed'
  targetDate: string
}

export default function RiskStationPage() {
  const { state, dispatch } = useRailwayContext()
  const [risks, setRisks] = useState<Risk[]>([
    {
      id: '1',
      title: 'Technology Integration Complexity',
      description: 'Potential difficulties integrating with existing legacy systems and third-party APIs',
      category: 'technical',
      probability: 3,
      impact: 4,
      riskScore: 12,
      mitigation: 'Conduct thorough API testing and create integration sandboxes early in development',
      contingency: 'Develop custom middleware or consider alternative integration approaches',
      owner: 'Technical Lead',
      status: 'assessed',
      targetDate: '2025-09-15'
    },
    {
      id: '2',
      title: 'User Adoption Resistance',
      description: 'End users may resist transitioning from current project management tools',
      category: 'external',
      probability: 4,
      impact: 3,
      riskScore: 12,
      mitigation: 'Implement comprehensive change management and training programs',
      contingency: 'Phased rollout with parallel system operation during transition',
      owner: 'Change Manager',
      status: 'identified',
      targetDate: '2025-10-01'
    },
    {
      id: '3',
      title: 'Resource Availability',
      description: 'Key technical resources may be allocated to other high-priority projects',
      category: 'resource',
      probability: 2,
      impact: 4,
      riskScore: 8,
      mitigation: 'Secure resource commitments early and identify backup resources',
      contingency: 'Contract external consultants or adjust project timeline',
      owner: 'Project Manager',
      status: 'mitigated',
      targetDate: '2025-09-01'
    },
    {
      id: '4',
      title: 'Scope Creep',
      description: 'Stakeholders may request additional features beyond original scope',
      category: 'schedule',
      probability: 4,
      impact: 3,
      riskScore: 12,
      mitigation: 'Establish clear change control process and scope management',
      contingency: 'Defer non-critical features to Phase 2 or extend timeline',
      owner: 'Project Manager',
      status: 'assessed',
      targetDate: '2025-12-31'
    }
  ])

  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showAddRisk, setShowAddRisk] = useState(false)

  const currentProgress = state.stationProgress.risk?.progress || 0

  // Check prerequisites (either initiation is complete OR this is accessed independently)
  const canAccessRisk = state.stationProgress.initiation?.status === 'completed' || true // Risk can be accessed early

  const getRiskColor = (score: number) => {
    if (score >= 15) return 'bg-red-100 border-red-300 text-red-800'
    if (score >= 10) return 'bg-orange-100 border-orange-300 text-orange-800'
    if (score >= 6) return 'bg-yellow-100 border-yellow-300 text-yellow-800'
    return 'bg-green-100 border-green-300 text-green-800'
  }

  const getCategoryIcon = (category: Risk['category']) => {
    const icons = {
      technical: '💻',
      schedule: '📅',
      budget: '💰',
      resource: '👥',
      external: '🌐',
      quality: '✨'
    }
    return icons[category]
  }

  const getStatusColor = (status: Risk['status']) => {
    const colors = {
      identified: 'bg-blue-100 text-blue-800',
      assessed: 'bg-yellow-100 text-yellow-800',
      mitigated: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return colors[status]
  }

  const highRisks = risks.filter(r => r.riskScore >= 10)
  const averageRiskScore = risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length

  const handleCompleteRisk = async () => {
    if (highRisks.length > 0 && highRisks.some(r => r.status === 'identified')) {
      toast.error('High risks require mitigation plans', {
        description: 'Please assess and mitigate all high-priority risks before completing.'
      })
      return
    }

    setIsCompleting(true)

    try {
      // Simulate risk assessment validation
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update station progress
      dispatch({
        type: 'UPDATE_STATION_PROGRESS',
        payload: {
          station: 'risk',
          progress: {
            progress: 1.0,
            status: 'completed',
            completedAt: new Date().toISOString(),
            academicCitations: [
              'ISO 31000:2018 - Risk Management Guidelines',
              'PMBOK Guide 7th Edition, Section 11 - Project Risk Management',
              'ISO 31000:2018 - Risk Assessment Techniques'
            ],
            complianceScore: 0.96
          }
        }
      })

      // Clear any previous violations
      dispatch({
        type: 'CLEAR_POLICY_VIOLATIONS',
        payload: { station: 'risk' }
      })

      toast.success('Risk Management Plan Approved!', {
        description: 'ISO 31000 compliant risk assessment completed. Ready for Execution Phase.'
      })

    } catch (error) {
      toast.error('Risk assessment validation failed', {
        description: 'Please review risk mitigation strategies and try again.'
      })
    } finally {
      setIsCompleting(false)
    }
  }

  if (!canAccessRisk) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Prerequisites Required
        </h2>
        <p className="text-slate-600 mb-4">
          Complete previous stations before accessing Risk Management.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Station Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Risk Management</h1>
            <p className="text-slate-600">ISO 31000:2018 compliant risk identification and mitigation planning</p>
          </div>
        </div>

        {/* Risk Overview Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{risks.length}</div>
            <div className="text-sm text-slate-600">Total Risks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{highRisks.length}</div>
            <div className="text-sm text-slate-600">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{averageRiskScore.toFixed(1)}</div>
            <div className="text-sm text-slate-600">Avg Risk Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(currentProgress * 100)}%
            </div>
            <div className="text-sm text-slate-600">Progress</div>
          </div>
        </div>
      </motion.div>

      {/* Risk Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border"
      >
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Risk Heat Map</h2>
          <p className="text-sm text-slate-600">ISO 31000 Risk Assessment Matrix</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-6 gap-1 mb-4">
            {/* Header row */}
            <div className="text-center text-xs font-medium text-slate-600">Impact →</div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="text-center text-xs font-medium text-slate-600">{i}</div>
            ))}

            {/* Risk matrix */}
            {[5, 4, 3, 2, 1].map(prob => (
              <div key={prob} className="contents">
                <div className="text-center text-xs font-medium text-slate-600 flex items-center justify-center">
                  {prob === 3 && <span className="rotate-90 whitespace-nowrap">← Probability</span>}
                  {prob !== 3 && prob}
                </div>
                {[1, 2, 3, 4, 5].map(impact => {
                  const score = prob * impact
                  const cellRisks = risks.filter(r => r.probability === prob && r.impact === impact)
                  let bgColor = 'bg-gray-50'
                  if (score >= 15) bgColor = 'bg-red-200'
                  else if (score >= 10) bgColor = 'bg-orange-200'
                  else if (score >= 6) bgColor = 'bg-yellow-200'
                  else if (score >= 3) bgColor = 'bg-green-200'

                  return (
                    <div
                      key={`${prob}-${impact}`}
                      className={`${bgColor} border border-slate-300 h-12 flex items-center justify-center text-xs cursor-pointer hover:opacity-80 relative`}
                      onClick={() => cellRisks[0] && setSelectedRisk(cellRisks[0])}
                    >
                      {cellRisks.length > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                          {cellRisks.length > 1 && (
                            <span className="ml-1 text-xs">{cellRisks.length}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-500 text-center">
            Click on dots to view risk details
          </div>
        </div>
      </motion.div>

      {/* Risk Register */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Risk Register</h2>
            <Button
              onClick={() => setShowAddRisk(true)}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Risk
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {risks.map((risk) => (
              <motion.div
                key={risk.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 border-2 rounded-lg cursor-pointer hover:shadow-md transition-all ${
                  selectedRisk?.id === risk.id ? 'ring-2 ring-blue-500' : ''
                } ${getRiskColor(risk.riskScore)}`}
                onClick={() => setSelectedRisk(risk)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(risk.category)}</span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{risk.title}</h3>
                      <p className="text-sm text-slate-600">{risk.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{risk.riskScore}</div>
                    <div className="text-xs text-slate-600">Risk Score</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span>P: {risk.probability}</span>
                    <span>I: {risk.impact}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(risk.status)}`}>
                      {risk.status}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    Owner: {risk.owner}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Risk Detail Panel */}
      {selectedRisk && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border"
        >
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedRisk.title}</h3>
              <Button
                onClick={() => setSelectedRisk(null)}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mitigation Strategy
                </label>
                <p className="text-sm text-slate-600 p-3 bg-green-50 rounded-lg">
                  {selectedRisk.mitigation}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contingency Plan
                </label>
                <p className="text-sm text-slate-600 p-3 bg-orange-50 rounded-lg">
                  {selectedRisk.contingency}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Risk Owner
                </label>
                <p className="text-sm text-slate-900">{selectedRisk.owner}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Target Date
                </label>
                <p className="text-sm text-slate-900">{selectedRisk.targetDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Current Status
                </label>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedRisk.status)}`}>
                  {selectedRisk.status}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ISO 31000 Compliance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border"
      >
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">ISO 31000:2018 Compliance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Risk Identification</div>
                <div className="text-xs text-slate-600">ISO 31000:2018 6.4.2</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Risk Analysis</div>
                <div className="text-xs text-slate-600">ISO 31000:2018 6.4.3</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Risk Evaluation</div>
                <div className="text-xs text-slate-600">ISO 31000:2018 6.4.4</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Eye className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Risk Treatment</div>
                <div className="text-xs text-slate-600">ISO 31000:2018 6.5</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Monitoring & Review</div>
                <div className="text-xs text-slate-600">ISO 31000:2018 6.6</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Risk Communication</div>
                <div className="text-xs text-slate-600">ISO 31000:2018 6.7</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Complete Risk Management Station</h3>
            <p className="text-sm text-slate-600">
              Finalize risk assessment and proceed to Execution Phase
            </p>
            {highRisks.length > 0 && highRisks.some(r => r.status === 'identified') && (
              <p className="text-sm text-red-600 mt-1">
                ⚠️ {highRisks.filter(r => r.status === 'identified').length} high-priority risks need mitigation plans
              </p>
            )}
          </div>
          <Button
            onClick={handleCompleteRisk}
            disabled={isCompleting || currentProgress >= 1}
            className="bg-red-600 hover:bg-red-700"
          >
            {isCompleting ? 'Validating Risks...' :
             currentProgress >= 1 ? 'Station Complete' :
             'Approve Risk Plan'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
