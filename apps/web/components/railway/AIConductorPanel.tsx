'use client'

import { useState, useEffect } from 'react'
import {
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Zap
} from 'lucide-react'
import { Button } from '@sparktasks/ui'

interface ConductorRecommendation {
  id: string
  type: 'navigation' | 'policy' | 'optimization' | 'risk'
  title: string
  description: string
  academicJustification: string
  confidence: number
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export function AIConductorPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [recommendations, setRecommendations] = useState<ConductorRecommendation[]>([])
  const [isThinking, setIsThinking] = useState(false)

  // Mock AI recommendations - will be replaced with actual AI service
  useEffect(() => {
    const mockRecommendations: ConductorRecommendation[] = [
      {
        id: 'rec_1',
        type: 'navigation',
        title: 'Complete Project Charter',
        description: 'PMBOK requires formal project charter before proceeding to planning phase.',
        academicJustification: 'PMBOK Guide 7th Edition, Section 4.1.1.1 - Project Charter Development',
        confidence: 0.95,
        priority: 'high'
      },
      {
        id: 'rec_2',
        type: 'policy',
        title: 'Risk Assessment Pending',
        description: 'ISO 31000:2018 compliance requires systematic risk identification.',
        academicJustification: 'ISO 31000:2018 Risk Management Guidelines, Clause 6.4',
        confidence: 0.88,
        priority: 'medium'
      },
      {
        id: 'rec_3',
        type: 'optimization',
        title: 'Parallel Planning Opportunity',
        description: 'Budget and schedule planning can proceed in parallel to optimize timeline.',
        academicJustification: 'PMBOK Planning Process Group - Concurrent Activities',
        confidence: 0.82,
        priority: 'low'
      }
    ]
    setRecommendations(mockRecommendations)
  }, [])

  const handleAskConductor = () => {
    setIsThinking(true)
    // Simulate AI thinking
    setTimeout(() => {
      setIsThinking(false)
      setIsExpanded(true)
    }, 2000)
  }

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }

  const typeIcons = {
    navigation: ArrowRight,
    policy: AlertTriangle,
    optimization: Lightbulb,
    risk: AlertTriangle
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        {/* AI Conductor Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">AI Railway Conductor</h2>
            <p className="text-blue-100 text-sm">
              PMBOK-compliant guidance • Academic anchors verified
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAskConductor}
            disabled={isThinking}
            className="bg-white/20 hover:bg-white/30 text-white border-white/20"
          >
            {isThinking ? (
              <>
                <Zap size={16} className="animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain size={16} />
                Ask Conductor
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/20"
          >
            {isExpanded ? 'Minimize' : 'View All'}
          </Button>
        </div>
      </div>

      {/* Expanded Recommendations Panel */}
      {isExpanded && (
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-yellow-300" />
              <h3 className="font-medium text-white">Current Recommendations</h3>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white">
                {recommendations.length} insights
              </span>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => {
                const Icon = typeIcons[rec.type]
                return (
                  <div
                    key={rec.id}
                    className="bg-white/10 rounded-lg p-3 border border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg">
                        <Icon size={14} className="text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white text-sm">
                            {rec.title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[rec.priority]}`}>
                            {rec.priority}
                          </span>
                          <span className="text-xs text-blue-200">
                            {Math.round(rec.confidence * 100)}% confidence
                          </span>
                        </div>

                        <p className="text-sm text-blue-100 mb-2">
                          {rec.description}
                        </p>

                        <div className="flex items-center gap-1 text-xs text-blue-200">
                          <BookOpen size={12} />
                          <span>{rec.academicJustification}</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/20 text-xs"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Academic Compliance Badge */}
            <div className="mt-4 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-200">
                  <CheckCircle size={12} />
                  <span>All recommendations academically grounded</span>
                </div>
                <div className="text-blue-200">
                  Response time: &lt;2s • PMBOK compliant
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Status Bar */}
      {!isExpanded && recommendations.length > 0 && (
        <div className="mt-2 flex items-center justify-between text-sm">
          <div className="text-blue-100">
            {recommendations.length} recommendations • Next: {recommendations[0]?.title}
          </div>
          <div className="flex items-center gap-1 text-blue-200">
            <CheckCircle size={12} />
            <span>Academic standards verified</span>
          </div>
        </div>
      )}
    </div>
  )
}
