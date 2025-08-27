'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Command,
  Rocket,
  DollarSign,
  Shield,
  Play,
  CheckCircle,
  FileText,
  Users,
  Calendar,
  Target,
  Award,
  MessageCircle,
  ShoppingCart,
  Activity,
  Archive,
  GitBranch,
  Database,
  BarChart,
  Settings,
  CheckSquare
} from 'lucide-react'
import { Button } from '@sparktasks/ui'
import { useStationNavigation } from '@/lib/railway/context'
import { FORTUNE_500_STATIONS, type Station, type PMBOKProcessGroup } from '@/lib/railway/types'

// Icon mapping for stations
const StationIcons: Record<string, React.ComponentType<any>> = {
  command: Command,
  rocket: Rocket,
  'dollar-sign': DollarSign,
  shield: Shield,
  play: Play,
  'check-circle': CheckCircle,
  'file-text': FileText,
  users: Users,
  calendar: Calendar,
  target: Target,
  award: Award,
  'message-circle': MessageCircle,
  'shopping-cart': ShoppingCart,
  activity: Activity,
  archive: Archive,
  'git-branch': GitBranch,
  database: Database,
  'bar-chart': BarChart,
  settings: Settings,
  'check-square': CheckSquare
}

// PMBOK Process Group Colors
const ProcessGroupColors: Record<PMBOKProcessGroup, string> = {
  initiating: 'bg-green-100 text-green-800 border-green-200',
  planning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  executing: 'bg-blue-100 text-blue-800 border-blue-200',
  monitoring: 'bg-orange-100 text-orange-800 border-orange-200',
  closing: 'bg-purple-100 text-purple-800 border-purple-200'
}

interface StationItemProps {
  station: Station
  isActive: boolean
  isCompleted: boolean
  isLocked: boolean
  progress: number
}

function StationItem({ station, isActive, isCompleted, isLocked, progress }: StationItemProps) {
  const config = FORTUNE_500_STATIONS[station]
  const Icon = StationIcons[config.icon] || Command
  const { navigateToStation } = useStationNavigation()

  const handleClick = () => {
    if (!isLocked) {
      navigateToStation(station, 'user_navigation')
    }
  }

  return (
    <div className={`
      group relative
      ${isActive ? 'bg-blue-50 border-blue-200' : 'hover:bg-slate-50'}
      ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      border rounded-lg p-3 transition-all duration-200
    `}>
      <Link
        href={config.route}
        onClick={handleClick}
        className="block w-full"
      >
        <div className="flex items-center gap-3">
          {/* Station Icon */}
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-lg
            ${isCompleted ? 'bg-green-100 text-green-600' :
              isActive ? 'bg-blue-100 text-blue-600' :
              'bg-slate-100 text-slate-600'}
          `}>
            <Icon size={16} />
          </div>

          {/* Station Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`
                font-medium text-sm truncate
                ${isActive ? 'text-blue-900' : 'text-slate-900'}
              `}>
                {config.name}
              </h3>

              {/* PMBOK Badge */}
              <span className={`
                px-2 py-0.5 text-xs font-medium rounded-full border
                ${ProcessGroupColors[config.pmbokPhase]}
              `}>
                {config.pmbokPhase}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              {config.description}
            </p>

            {/* Progress Bar */}
            {progress > 0 && (
              <div className="mt-2">
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-slate-500">
                    {Math.round(progress * 100)}%
                  </span>
                  <span className="text-xs text-slate-500">
                    ~{config.estimatedDuration}min
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Status Indicator */}
          <div className="flex flex-col items-center">
            {isCompleted && (
              <CheckCircle size={16} className="text-green-500" />
            )}
            {isLocked && (
              <Shield size={16} className="text-slate-400" />
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export function RailwayNavigation() {
  const pathname = usePathname()
  const [selectedProcessGroup, setSelectedProcessGroup] = useState<PMBOKProcessGroup | 'all'>('all')

  // Mock data - will be replaced with actual context data
  const mockStationProgress = {
    dashboard: { progress: 1, completed: true, locked: false },
    initiation: { progress: 0.8, completed: false, locked: false },
    charter: { progress: 1, completed: true, locked: false },
    stakeholder: { progress: 0.6, completed: false, locked: false },
    budget: { progress: 0, completed: false, locked: true },
    // Add more as needed
  }

  // Filter stations by process group
  const filteredStations = Object.entries(FORTUNE_500_STATIONS)
    .filter(([_, config]) =>
      selectedProcessGroup === 'all' || config.pmbokPhase === selectedProcessGroup
    )
    .sort((a, b) => a[1].name.localeCompare(b[1].name))

  // Process group statistics
  const processGroupStats = Object.values(FORTUNE_500_STATIONS).reduce((acc, config) => {
    acc[config.pmbokPhase] = (acc[config.pmbokPhase] || 0) + 1
    return acc
  }, {} as Record<PMBOKProcessGroup, number>)

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white">
            <Command size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900">Railway Control</h1>
            <p className="text-sm text-slate-600">Fortune 500 Project Management</p>
          </div>
        </div>

        {/* Academic Anchors */}
        <div className="mt-3 flex flex-wrap gap-1">
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
            PMBOK 7th Edition
          </span>
          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
            ISO 31000:2018
          </span>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
            Lean/Kanban
          </span>
        </div>
      </div>

      {/* Process Group Filter */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-medium text-slate-900 mb-2">PMBOK Process Groups</h3>
        <div className="flex flex-wrap gap-1">
          <Button
            variant={selectedProcessGroup === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedProcessGroup('all')}
            className="text-xs"
          >
            All ({Object.keys(FORTUNE_500_STATIONS).length})
          </Button>
          {Object.entries(processGroupStats).map(([group, count]) => (
            <Button
              key={group}
              variant={selectedProcessGroup === group ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedProcessGroup(group as PMBOKProcessGroup)}
              className="text-xs"
            >
              {group} ({count})
            </Button>
          ))}
        </div>
      </div>

      {/* Station List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          {filteredStations.map(([stationId, config]) => {
            const station = stationId as Station
            const progress = mockStationProgress[station as keyof typeof mockStationProgress] ||
              { progress: 0, completed: false, locked: false }

            const isActive = pathname === config.route

            return (
              <StationItem
                key={station}
                station={station}
                isActive={isActive}
                isCompleted={progress.completed}
                isLocked={progress.locked}
                progress={progress.progress}
              />
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-center">
          <p className="text-xs text-slate-600">
            Academic Standards Compliant
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise Project Management Platform
          </p>
        </div>
      </div>
    </div>
  )
}
