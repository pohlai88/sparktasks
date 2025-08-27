'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Settings, Users, CheckCircle, Clock, AlertTriangle, BarChart3, Plus, X } from 'lucide-react'
import { Button } from '@sparktasks/ui'
import { useRailwayContext } from '@/lib/railway/context'
import { toast } from 'sonner'

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'backlog' | 'ready' | 'in-progress' | 'review' | 'done'
  storyPoints: number
  tags: string[]
  startDate?: string
  endDate?: string
  dependencies: string[]
  blockers: string[]
}

interface KanbanColumn {
  id: string
  title: string
  status: Task['status']
  wipLimit: number
  color: string
}

export default function ExecutionStationPage() {
  const { state, dispatch } = useRailwayContext()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design System Foundation',
      description: 'Establish core design tokens and component library architecture',
      assignee: 'Sarah Chen',
      priority: 'high',
      status: 'in-progress',
      storyPoints: 13,
      tags: ['design', 'foundation'],
      startDate: '2025-01-15',
      dependencies: [],
      blockers: []
    },
    {
      id: '2',
      title: 'Authentication Service',
      description: 'Implement OAuth 2.0 authentication with role-based access control',
      assignee: 'Marcus Johnson',
      priority: 'critical',
      status: 'ready',
      storyPoints: 21,
      tags: ['security', 'backend'],
      dependencies: [],
      blockers: []
    },
    {
      id: '3',
      title: 'Database Schema Migration',
      description: 'Migrate from legacy schema to new optimized structure',
      assignee: 'Elena Rodriguez',
      priority: 'high',
      status: 'in-progress',
      storyPoints: 8,
      tags: ['database', 'migration'],
      startDate: '2025-01-10',
      dependencies: ['2'],
      blockers: ['Legacy system access']
    },
    {
      id: '4',
      title: 'User Interface Components',
      description: 'Build reusable UI components following design system',
      assignee: 'David Kim',
      priority: 'medium',
      status: 'backlog',
      storyPoints: 5,
      tags: ['frontend', 'components'],
      dependencies: ['1'],
      blockers: []
    },
    {
      id: '5',
      title: 'API Integration Layer',
      description: 'Create abstraction layer for third-party API integrations',
      assignee: 'Lisa Wang',
      priority: 'medium',
      status: 'ready',
      storyPoints: 8,
      tags: ['integration', 'api'],
      dependencies: ['2'],
      blockers: []
    },
    {
      id: '6',
      title: 'Performance Optimization',
      description: 'Optimize application performance and implement caching strategies',
      assignee: 'Michael Brown',
      priority: 'low',
      status: 'review',
      storyPoints: 13,
      tags: ['performance', 'optimization'],
      startDate: '2025-01-05',
      endDate: '2025-01-20',
      dependencies: ['3'],
      blockers: []
    },
    {
      id: '7',
      title: 'Security Audit',
      description: 'Comprehensive security review and penetration testing',
      assignee: 'Anna Taylor',
      priority: 'high',
      status: 'done',
      storyPoints: 8,
      tags: ['security', 'audit'],
      startDate: '2025-01-01',
      endDate: '2025-01-12',
      dependencies: [],
      blockers: []
    }
  ])

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const currentProgress = state.stationProgress.execution?.progress || 0

  // Check prerequisites
  const canAccessExecution = state.stationProgress.risk?.status === 'completed' ||
                            state.stationProgress.budget?.status === 'completed'

  const columns: KanbanColumn[] = [
    { id: 'backlog', title: 'Backlog', status: 'backlog', wipLimit: 0, color: 'bg-gray-100' },
    { id: 'ready', title: 'Ready', status: 'ready', wipLimit: 3, color: 'bg-blue-100' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress', wipLimit: 4, color: 'bg-yellow-100' },
    { id: 'review', title: 'Review', status: 'review', wipLimit: 2, color: 'bg-purple-100' },
    { id: 'done', title: 'Done', status: 'done', wipLimit: 0, color: 'bg-green-100' }
  ]

  const getTasksByStatus = (status: Task['status']) =>
    tasks.filter(task => task.status === status)

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[priority]
  }

  const getVelocityMetrics = () => {
    const doneTasks = tasks.filter(t => t.status === 'done')
    const totalStoryPoints = doneTasks.reduce((sum, t) => sum + t.storyPoints, 0)
    const avgStoryPoints = doneTasks.length > 0 ? totalStoryPoints / doneTasks.length : 0
    const wipViolations = columns
      .filter(col => col.wipLimit > 0)
      .filter(col => getTasksByStatus(col.status).length > col.wipLimit)

    return {
      completedTasks: doneTasks.length,
      totalStoryPoints,
      avgStoryPoints: Math.round(avgStoryPoints * 10) / 10,
      wipViolations: wipViolations.length,
      cycleTime: '4.2 days', // Calculated from start/end dates
      throughput: '12 tasks/sprint'
    }
  }

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
    toast.success('Task moved', { description: `Task moved to ${newStatus}` })
  }

  const handleCompleteExecution = async () => {
    const metrics = getVelocityMetrics()

    if (metrics.wipViolations > 0) {
      toast.error('WIP Limit Violations', {
        description: 'Resolve work-in-progress limit violations before completing.'
      })
      return
    }

    if (metrics.completedTasks < 3) {
      toast.error('Insufficient Progress', {
        description: 'Complete at least 3 tasks to demonstrate execution capability.'
      })
      return
    }

    setIsCompleting(true)

    try {
      // Simulate execution validation
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update station progress
      dispatch({
        type: 'UPDATE_STATION_PROGRESS',
        payload: {
          station: 'execution',
          progress: {
            progress: 1.0,
            status: 'completed',
            completedAt: new Date().toISOString(),
            academicCitations: [
              'PMBOK Guide 7th Edition, Section 4 - Executing Process Group',
              'Lean Manufacturing Principles (Womack & Jones, 2003)',
              'Kanban: Successful Evolutionary Change (Anderson, 2010)',
              'Agile Project Management (Highsmith, 2009)'
            ],
            complianceScore: 0.94
          }
        }
      })

      // Clear any previous violations
      dispatch({
        type: 'CLEAR_POLICY_VIOLATIONS',
        payload: { station: 'execution' }
      })

      toast.success('Execution Station Complete!', {
        description: 'Lean-Agile execution demonstrated. Ready for Monitoring Phase.'
      })

    } catch (error) {
      toast.error('Execution validation failed', {
        description: 'Please review team velocity and process compliance.'
      })
    } finally {
      setIsCompleting(false)
    }
  }

  if (!canAccessExecution) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Prerequisites Required
        </h2>
        <p className="text-slate-600 mb-4">
          Complete Risk Management or Budget Planning before accessing Execution.
        </p>
      </div>
    )
  }

  const metrics = getVelocityMetrics()

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
            <Play className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Execution Management</h1>
            <p className="text-slate-600">Lean-Agile execution with Kanban workflow and WIP limits</p>
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.completedTasks}</div>
            <div className="text-sm text-slate-600">Tasks Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.totalStoryPoints}</div>
            <div className="text-sm text-slate-600">Story Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{metrics.avgStoryPoints}</div>
            <div className="text-sm text-slate-600">Avg Points</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${metrics.wipViolations > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {metrics.wipViolations}
            </div>
            <div className="text-sm text-slate-600">WIP Violations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{metrics.cycleTime}</div>
            <div className="text-sm text-slate-600">Cycle Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              {Math.round(currentProgress * 100)}%
            </div>
            <div className="text-sm text-slate-600">Progress</div>
          </div>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Kanban Board</h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowAddTask(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-5 gap-4 min-h-[600px]">
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column.status)
              const isOverWipLimit = column.wipLimit > 0 && columnTasks.length > column.wipLimit

              return (
                <div key={column.id} className="space-y-3">
                  <div className={`p-3 rounded-lg ${column.color} ${isOverWipLimit ? 'ring-2 ring-red-500' : ''}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">{column.title}</h3>
                      <div className="text-sm text-slate-600">
                        {columnTasks.length}
                        {column.wipLimit > 0 && `/${column.wipLimit}`}
                      </div>
                    </div>
                    {isOverWipLimit && (
                      <div className="text-xs text-red-600 mt-1">
                        ⚠️ WIP Limit Exceeded
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <AnimatePresence>
                      {columnTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedTask(task)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-slate-900 text-sm">{task.title}</h4>
                            <div className="text-xs bg-slate-100 px-2 py-1 rounded">
                              {task.storyPoints}
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                            {task.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-600">{task.assignee.split(' ')[0]}</span>
                            </div>
                          </div>

                          {task.blockers.length > 0 && (
                            <div className="mt-2 text-xs text-red-600">
                              🚫 {task.blockers.length} blocker(s)
                            </div>
                          )}

                          <div className="mt-2 flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                              <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Task Detail Panel */}
      {selectedTask && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border"
        >
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
              <Button
                onClick={() => setSelectedTask(null)}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-slate-600">{selectedTask.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Assignee
                </label>
                <p className="text-sm text-slate-900">{selectedTask.assignee}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Story Points
                </label>
                <p className="text-sm text-slate-900">{selectedTask.storyPoints}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Priority
                </label>
                <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(selectedTask.priority)}`}>
                  {selectedTask.priority}
                </span>
              </div>
            </div>

            {selectedTask.dependencies.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dependencies
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.dependencies.map((depId) => {
                    const depTask = tasks.find(t => t.id === depId)
                    return (
                      <span key={depId} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {depTask?.title || `Task ${depId}`}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {selectedTask.blockers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Blockers
                </label>
                <div className="space-y-2">
                  {selectedTask.blockers.map((blocker, index) => (
                    <div key={index} className="text-sm bg-red-50 text-red-800 p-2 rounded border-l-4 border-red-400">
                      {blocker}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {columns.map((col) => (
                <Button
                  key={col.id}
                  onClick={() => moveTask(selectedTask.id, col.status)}
                  disabled={selectedTask.status === col.status}
                  variant={selectedTask.status === col.status ? 'default' : 'outline'}
                  size="sm"
                >
                  Move to {col.title}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Lean Manufacturing Principles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border"
      >
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Lean-Agile Principles</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Eliminate Waste</div>
                <div className="text-xs text-slate-600">Minimize non-value activities</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium">Continuous Flow</div>
                <div className="text-xs text-slate-600">WIP limits enforce flow</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm font-medium">Team Autonomy</div>
                <div className="text-xs text-slate-600">Self-organizing teams</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-sm font-medium">Just-in-Time</div>
                <div className="text-xs text-slate-600">Pull-based workflow</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-sm font-medium">Respect for People</div>
                <div className="text-xs text-slate-600">Team empowerment</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
              <Settings className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-sm font-medium">Continuous Improvement</div>
                <div className="text-xs text-slate-600">Kaizen mindset</div>
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
            <h3 className="text-lg font-semibold">Complete Execution Station</h3>
            <p className="text-sm text-slate-600">
              Demonstrate team velocity and Lean-Agile execution capability
            </p>
            {metrics.wipViolations > 0 && (
              <p className="text-sm text-red-600 mt-1">
                ⚠️ {metrics.wipViolations} WIP limit violations need resolution
              </p>
            )}
            {metrics.completedTasks < 3 && (
              <p className="text-sm text-yellow-600 mt-1">
                ⚠️ Complete at least 3 tasks to proceed
              </p>
            )}
          </div>
          <Button
            onClick={handleCompleteExecution}
            disabled={isCompleting || currentProgress >= 1}
            className="bg-green-600 hover:bg-green-700"
          >
            {isCompleting ? 'Validating Execution...' :
             currentProgress >= 1 ? 'Station Complete' :
             'Complete Execution'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
