'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Rocket, FileText, Users, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@sparktasks/ui'
import { useRailwayContext } from '@/lib/railway/context'
import { toast } from 'sonner'

interface ProjectCharter {
  projectName: string
  businessCase: string
  objectives: string[]
  stakeholders: string[]
  assumptions: string[]
  constraints: string[]
}

export default function InitiationStationPage() {
  const { state, dispatch } = useRailwayContext()
  const [charter, setCharter] = useState<ProjectCharter>({
    projectName: 'Fortune 500 Digital Transformation',
    businessCase: 'Implement AI-driven project management to increase efficiency by 40% and reduce project delivery time by 30%.',
    objectives: [
      'Deploy Railway project management system',
      'Train 500+ project managers on PMBOK best practices',
      'Achieve ISO 31000 risk management compliance',
      'Establish executive reporting dashboards'
    ],
    stakeholders: [
      'Chief Technology Officer',
      'Project Management Office',
      'Business Unit Leaders',
      'IT Operations Team'
    ],
    assumptions: [
      'Executive sponsorship remains consistent',
      'Budget allocation of $2.5M approved',
      'Technical infrastructure supports new system',
      'Staff training time available'
    ],
    constraints: [
      'Must complete within 6 months',
      'Cannot disrupt existing operations',
      'Must comply with enterprise security policies',
      'Limited to current approved headcount'
    ]
  })

  const [isCompleting, setIsCompleting] = useState(false)
  const currentProgress = state.stationProgress.initiation?.progress || 0

  const handleCompleteInitiation = async () => {
    setIsCompleting(true)

    try {
      // Simulate charter validation and approval
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update station progress
      dispatch({
        type: 'UPDATE_STATION_PROGRESS',
        payload: {
          station: 'initiation',
          progress: {
            progress: 1.0,
            status: 'completed',
            completedAt: new Date().toISOString(),
            academicCitations: [
              'PMBOK Guide 7th Edition, Section 4.1 - Project Charter Development',
              'PMBOK Guide 7th Edition, Section 13.1 - Stakeholder Identification'
            ],
            complianceScore: 0.95
          }
        }
      })

      // Clear any previous violations
      dispatch({
        type: 'CLEAR_POLICY_VIOLATIONS',
        payload: { station: 'initiation' }
      })

      // Navigate to next recommended station
      dispatch({
        type: 'SET_ACTIVE_STATION',
        payload: {
          station: 'budget',
          reason: 'pmbok_sequential_flow'
        }
      })

      toast.success('Project Charter Approved!', {
        description: 'PMBOK Initiating Process Group completed. Ready for Planning Phase.'
      })

    } catch (error) {
      toast.error('Charter validation failed', {
        description: 'Please review requirements and try again.'
      })
    } finally {
      setIsCompleting(false)
    }
  }

  const addObjective = () => {
    setCharter(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }))
  }

  const updateObjective = (index: number, value: string) => {
    setCharter(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }))
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
          <div className="p-3 bg-green-100 rounded-lg">
            <Rocket className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Project Genesis</h1>
            <p className="text-slate-600">PMBOK Initiating Process Group - Project Charter Development</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(currentProgress * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="text-sm text-slate-500">
            Academic Anchor: <span className="font-medium text-green-600">PMBOK 7th Edition</span>
          </div>
        </div>
      </motion.div>

      {/* Project Charter Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border"
      >
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Project Charter</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              PMBOK Required
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={charter.projectName}
              onChange={(e) => setCharter(prev => ({ ...prev, projectName: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project name..."
            />
          </div>

          {/* Business Case */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Business Case
            </label>
            <textarea
              value={charter.businessCase}
              onChange={(e) => setCharter(prev => ({ ...prev, businessCase: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the business justification..."
            />
          </div>

          {/* Project Objectives */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Project Objectives
              </label>
              <Button
                onClick={addObjective}
                variant="outline"
                size="sm"
              >
                Add Objective
              </Button>
            </div>
            <div className="space-y-2">
              {charter.objectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter objective..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Stakeholders */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <label className="block text-sm font-medium text-slate-700">
                Key Stakeholders
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {charter.stakeholders.map((stakeholder, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{stakeholder}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assumptions & Constraints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Key Assumptions
              </label>
              <div className="space-y-1">
                {charter.assumptions.map((assumption, index) => (
                  <div key={index} className="text-sm text-slate-600 p-2 bg-green-50 rounded">
                    • {assumption}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Constraints
              </label>
              <div className="space-y-1">
                {charter.constraints.map((constraint, index) => (
                  <div key={index} className="text-sm text-slate-600 p-2 bg-orange-50 rounded flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    {constraint}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* PMBOK Compliance Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border"
      >
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">PMBOK Compliance Check</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Charter Complete</div>
                <div className="text-xs text-slate-600">PMBOK 4.1.1.1</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Stakeholders Identified</div>
                <div className="text-xs text-slate-600">PMBOK 13.1.1.1</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Business Case Valid</div>
                <div className="text-xs text-slate-600">PMBOK 4.1.2.1</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Complete Initiation Station</h3>
            <p className="text-sm text-slate-600">
              Finalize project charter and proceed to Planning Process Group
            </p>
          </div>
          <Button
            onClick={handleCompleteInitiation}
            disabled={isCompleting || currentProgress >= 1}
            className="bg-green-600 hover:bg-green-700"
          >
            {isCompleting ? 'Validating Charter...' :
             currentProgress >= 1 ? 'Station Complete' :
             'Approve Charter'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
