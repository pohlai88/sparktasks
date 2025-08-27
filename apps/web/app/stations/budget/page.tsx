'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, PlusCircle, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import { Button } from '@sparktasks/ui'
import { useRailwayContext } from '@/lib/railway/context'
import { toast } from 'sonner'

interface BudgetLine {
  id: string
  category: string
  description: string
  amount: number
  type: 'labor' | 'equipment' | 'materials' | 'overhead' | 'contingency'
}

interface BudgetData {
  totalBudget: number
  budgetLines: BudgetLine[]
  contingencyPercent: number
  approvalStatus: 'draft' | 'pending' | 'approved'
}

export default function BudgetStationPage() {
  const { state, dispatch } = useRailwayContext()
  const [budget, setBudget] = useState<BudgetData>({
    totalBudget: 2500000,
    contingencyPercent: 10,
    approvalStatus: 'draft',
    budgetLines: [
      {
        id: '1',
        category: 'Project Management',
        description: 'Project Manager, Scrum Masters, and PMO support',
        amount: 450000,
        type: 'labor'
      },
      {
        id: '2',
        category: 'Development Team',
        description: 'Full-stack developers, UX designers, DevOps engineers',
        amount: 850000,
        type: 'labor'
      },
      {
        id: '3',
        category: 'Infrastructure',
        description: 'Cloud services, monitoring tools, security platforms',
        amount: 380000,
        type: 'equipment'
      },
      {
        id: '4',
        category: 'Training & Change Management',
        description: 'Staff training, change management consultants',
        amount: 290000,
        type: 'materials'
      },
      {
        id: '5',
        category: 'Third-party Integrations',
        description: 'API licenses, external service providers',
        amount: 180000,
        type: 'overhead'
      },
      {
        id: '6',
        category: 'Contingency Reserve',
        description: 'Risk mitigation and unknown unknowns',
        amount: 250000,
        type: 'contingency'
      }
    ]
  })

  const [isCompleting, setIsCompleting] = useState(false)
  const [newBudgetLine, setNewBudgetLine] = useState<Partial<BudgetLine>>({
    category: '',
    description: '',
    amount: 0,
    type: 'labor'
  })

  const currentProgress = state.stationProgress.budget?.progress || 0
  const calculatedTotal = budget.budgetLines.reduce((sum, line) => sum + line.amount, 0)
  const isOverBudget = calculatedTotal > budget.totalBudget
  const budgetVariance = ((calculatedTotal - budget.totalBudget) / budget.totalBudget * 100)

  // Check if initiation is complete (PMBOK prerequisite)
  const canAccessBudget = state.stationProgress.initiation?.status === 'completed'

  const handleAddBudgetLine = () => {
    if (!newBudgetLine.category || !newBudgetLine.description || !newBudgetLine.amount) {
      toast.error('Please fill in all fields')
      return
    }

    const budgetLine: BudgetLine = {
      id: Date.now().toString(),
      category: newBudgetLine.category!,
      description: newBudgetLine.description!,
      amount: newBudgetLine.amount!,
      type: newBudgetLine.type!
    }

    setBudget(prev => ({
      ...prev,
      budgetLines: [...prev.budgetLines, budgetLine]
    }))

    setNewBudgetLine({
      category: '',
      description: '',
      amount: 0,
      type: 'labor'
    })
  }

  const handleCompleteBudget = async () => {
    if (isOverBudget) {
      toast.error('Budget exceeds approved limit', {
        description: 'Please adjust budget lines to stay within approved limits.'
      })
      return
    }

    setIsCompleting(true)

    try {
      // Simulate budget validation and approval
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update station progress
      dispatch({
        type: 'UPDATE_STATION_PROGRESS',
        payload: {
          station: 'budget',
          progress: {
            progress: 1.0,
            status: 'completed',
            completedAt: new Date().toISOString(),
            academicCitations: [
              'PMBOK Guide 7th Edition, Section 7.1 - Cost Management Planning',
              'PMBOK Guide 7th Edition, Section 7.2 - Cost Estimation',
              'PMBOK Guide 7th Edition, Section 7.3 - Budget Determination'
            ],
            complianceScore: 0.92
          }
        }
      })

      // Clear any previous violations
      dispatch({
        type: 'CLEAR_POLICY_VIOLATIONS',
        payload: { station: 'budget' }
      })

      // Set budget approval status
      setBudget(prev => ({ ...prev, approvalStatus: 'approved' }))

      toast.success('Budget Approved!', {
        description: 'Cost management plan completed. Ready for Schedule Planning.'
      })

    } catch (error) {
      toast.error('Budget approval failed', {
        description: 'Please review budget allocation and try again.'
      })
    } finally {
      setIsCompleting(false)
    }
  }

  const getCategoryColor = (type: BudgetLine['type']) => {
    const colors = {
      labor: 'bg-blue-100 text-blue-800',
      equipment: 'bg-purple-100 text-purple-800',
      materials: 'bg-green-100 text-green-800',
      overhead: 'bg-orange-100 text-orange-800',
      contingency: 'bg-red-100 text-red-800'
    }
    return colors[type]
  }

  if (!canAccessBudget) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Initiation Required
        </h2>
        <p className="text-slate-600 mb-4">
          Complete the Project Genesis station before accessing Budget Planning.
        </p>
        <p className="text-sm text-slate-500">
          PMBOK requires project charter approval before cost estimation.
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
          <div className="p-3 bg-yellow-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Financial Planning</h1>
            <p className="text-slate-600">PMBOK Planning Process Group - Cost Management & Budget Allocation</p>
          </div>
        </div>

        {/* Progress and Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-sm text-slate-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(currentProgress * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div
                className="bg-yellow-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              ${calculatedTotal.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Total Allocated</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              {budgetVariance > 0 ? '+' : ''}{budgetVariance.toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600">Budget Variance</div>
          </div>
        </div>
      </motion.div>

      {/* Budget Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Budget Breakdown</h2>
            <div className="text-sm">
              <span className="text-slate-600">Approved Budget: </span>
              <span className="font-medium">${budget.totalBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {budget.budgetLines.map((line) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-900">{line.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(line.type)}`}>
                      {line.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{line.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-900">
                    ${line.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">
                    {((line.amount / calculatedTotal) * 100).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Add Budget Line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border"
      >
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Add Budget Line Item</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={newBudgetLine.category || ''}
                onChange={(e) => setNewBudgetLine(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g., Software Licenses"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Type
              </label>
              <select
                value={newBudgetLine.type || 'labor'}
                onChange={(e) => setNewBudgetLine(prev => ({ ...prev, type: e.target.value as BudgetLine['type'] }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="labor">Labor</option>
                <option value="equipment">Equipment</option>
                <option value="materials">Materials</option>
                <option value="overhead">Overhead</option>
                <option value="contingency">Contingency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                value={newBudgetLine.amount || ''}
                onChange={(e) => setNewBudgetLine(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="0"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddBudgetLine}
                className="w-full"
                variant="outline"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Line
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={newBudgetLine.description || ''}
              onChange={(e) => setNewBudgetLine(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Detailed description of the budget item..."
            />
          </div>
        </div>
      </motion.div>

      {/* PMBOK Compliance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border"
      >
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">PMBOK Cost Management Compliance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Cost Planning</div>
                <div className="text-xs text-slate-600">PMBOK 7.1</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Cost Estimation</div>
                <div className="text-xs text-slate-600">PMBOK 7.2</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Budget Determination</div>
                <div className="text-xs text-slate-600">PMBOK 7.3</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Contingency Planning</div>
                <div className="text-xs text-slate-600">PMBOK 11.5.2.5</div>
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
            <h3 className="text-lg font-semibold">Complete Budget Station</h3>
            <p className="text-sm text-slate-600">
              Finalize cost management plan and proceed to Schedule Planning
            </p>
            {isOverBudget && (
              <p className="text-sm text-red-600 mt-1">
                ⚠️ Budget exceeds approved limit by ${(calculatedTotal - budget.totalBudget).toLocaleString()}
              </p>
            )}
          </div>
          <Button
            onClick={handleCompleteBudget}
            disabled={isCompleting || currentProgress >= 1 || isOverBudget}
            className={isOverBudget ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}
          >
            {isCompleting ? 'Validating Budget...' :
             currentProgress >= 1 ? 'Station Complete' :
             isOverBudget ? 'Fix Budget Issues' :
             'Approve Budget'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
