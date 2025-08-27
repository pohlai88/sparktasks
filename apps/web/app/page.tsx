import { Metadata } from 'next'
import Link from 'next/link'
import {
  Rocket,
  DollarSign,
  Shield,
  Play,
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  BookOpen,
  Award
} from 'lucide-react'
import { Button } from '@sparktasks/ui'

export const metadata: Metadata = {
  title: 'Railway Mission Control - SparkTasks Fortune 500',
  description: 'Navigate your Fortune 500 project through PMBOK-compliant stations with AI-powered guidance',
}

export default function HomePage() {
  // Mock project data - will be replaced with actual data
  const mockProject = {
    id: 'fortune-500-demo',
    name: 'Fortune 500 Pilot Implementation',
    description: 'Strategic initiative to implement AI-driven project management platform',
    progress: 0.35,
    currentStation: 'budget',
    completedStations: ['dashboard', 'initiation', 'charter'],
    totalStations: 24,
    estimatedCompletion: '2025-11-15',
    teamSize: 12
  }

  const quickStats = [
    {
      label: 'Project Progress',
      value: `${Math.round(mockProject.progress * 100)}%`,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: 'Active Station',
      value: 'Budget Planning',
      icon: DollarSign,
      color: 'text-yellow-600'
    },
    {
      label: 'Team Size',
      value: `${mockProject.teamSize} members`,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Est. Completion',
      value: 'Nov 15, 2025',
      icon: Clock,
      color: 'text-purple-600'
    }
  ]

  const recentStations = [
    {
      id: 'initiation',
      name: 'Project Genesis',
      status: 'completed',
      pmbokPhase: 'Initiating',
      completedAt: '2025-08-20',
      duration: '45 min'
    },
    {
      id: 'charter',
      name: 'Project Charter',
      status: 'completed',
      pmbokPhase: 'Initiating',
      completedAt: '2025-08-22',
      duration: '30 min'
    },
    {
      id: 'budget',
      name: 'Financial Planning',
      status: 'in_progress',
      pmbokPhase: 'Planning',
      progress: 0.6,
      duration: '60 min'
    }
  ]

  const nextRecommendations = [
    {
      id: 'schedule',
      name: 'Schedule Management',
      description: 'Work breakdown structure and critical path analysis',
      estimatedDuration: '75 min',
      academicStandard: 'PMBOK Planning Process Group'
    },
    {
      id: 'risk',
      name: 'Risk Management',
      description: 'ISO 31000:2018 compliant risk identification',
      estimatedDuration: '90 min',
      academicStandard: 'ISO 31000:2018'
    }
  ]

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Railway Mission Control
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Navigate your Fortune 500 project through PMBOK-compliant stations with
              AI-powered guidance and academic-grade methodology
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              {quickStats.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-blue-100">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Current Project Status */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {mockProject.name}
                </h2>
                <Button variant="outline" size="sm">
                  <ArrowRight size={16} />
                  Continue Journey
                </Button>
              </div>

              <p className="text-slate-600 mb-6">
                {mockProject.description}
              </p>

              {/* Progress Visualization */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    Overall Progress
                  </span>
                  <span className="text-sm text-slate-600">
                    {mockProject.completedStations.length} of {mockProject.totalStations} stations
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${mockProject.progress * 100}%` }}
                  />
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-medium text-slate-900 mb-4">Recent Station Activity</h3>
                <div className="space-y-3">
                  {recentStations.map((station) => (
                    <div key={station.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className={`
                        flex items-center justify-center w-10 h-10 rounded-lg
                        ${station.status === 'completed' ? 'bg-green-100 text-green-600' :
                          station.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-600'}
                      `}>
                        {station.status === 'completed' ? (
                          <CheckCircle size={16} />
                        ) : station.status === 'in_progress' ? (
                          <Play size={16} />
                        ) : (
                          <Clock size={16} />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">
                            {station.name}
                          </h4>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {station.pmbokPhase}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                          <span>Duration: {station.duration}</span>
                          {station.status === 'completed' && station.completedAt && (
                            <span>Completed: {station.completedAt}</span>
                          )}
                          {station.status === 'in_progress' && station.progress && (
                            <span>{Math.round(station.progress * 100)}% complete</span>
                          )}
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        {station.status === 'completed' ? 'Review' : 'Continue'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* AI Recommendations */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Rocket size={20} className="text-blue-600" />
                <h3 className="font-medium text-slate-900">Next Recommended Stations</h3>
              </div>

              <div className="space-y-4">
                {nextRecommendations.map((rec) => (
                  <div key={rec.id} className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-2">
                      {rec.name}
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      {rec.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span>Est. {rec.estimatedDuration}</span>
                      <span>{rec.academicStandard}</span>
                    </div>

                    <Button size="sm" className="w-full">
                      Start Station
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Compliance */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} className="text-green-600" />
                <h3 className="font-medium text-slate-900">Academic Compliance</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">PMBOK 7th Edition</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">ISO 31000:2018</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Lean/Kanban</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">ISO 9001:2015</span>
                  <Clock size={16} className="text-yellow-500" />
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4">
                <BookOpen size={16} />
                View Citations
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
