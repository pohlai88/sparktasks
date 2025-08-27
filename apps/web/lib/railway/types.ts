// Railway System Types for Fortune 500 SparkTasks Platform

export type Station =
  | 'dashboard'
  | 'initiation'
  | 'charter'
  | 'stakeholder'
  | 'budget'
  | 'schedule'
  | 'scope'
  | 'resource'
  | 'risk'
  | 'quality'
  | 'communication'
  | 'procurement'
  | 'execution'
  | 'monitoring'
  | 'closure'
  | 'handover'
  | 'evaluation'
  | 'archive'
  | 'analytics'
  | 'reporting'
  | 'settings'
  | 'governance'
  | 'compliance'

export type PMBOKProcessGroup =
  | 'initiating'
  | 'planning'
  | 'executing'
  | 'monitoring'
  | 'closing'

export interface ProjectContext {
  id: string
  name: string
  description?: string
  status: 'active' | 'paused' | 'completed' | 'archived'
  policyProfile: 'startup' | 'enterprise' | 'fortune500'
  createdAt: string
  updatedAt: string

  // PMBOK Compliance
  pmbokProcessGroups: {
    [key in PMBOKProcessGroup]: {
      status: 'not_started' | 'in_progress' | 'completed'
      progress: number
      completedStations: Station[]
      requiredStations: Station[]
    }
  }

  // Academic Anchors
  complianceStandards: {
    pmbok: boolean
    iso31000: boolean
    iso9001: boolean
    kanban: boolean
  }
}

export interface StationProgress {
  station: Station
  progress: number // 0-1
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  pmbokPhase: PMBOKProcessGroup

  // Policy Compliance
  policyChecks: {
    passed: number
    total: number
    violations: PolicyViolation[]
  }

  // Academic Grounding
  academicCitations: string[]
  complianceScore: number // 0-1

  // Metadata
  startedAt?: string
  completedAt?: string
  lastUpdated: string
  timeSpent: number // minutes
}

export interface PolicyViolation {
  id: string
  station: Station
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  academicCitation: string
  blocksProgression: boolean
  timestamp: string

  // Resolution
  resolved?: boolean
  resolvedAt?: string
  resolution?: string
}

export interface ConductorRecommendation {
  id: string
  type: 'navigation' | 'policy' | 'optimization' | 'risk' | 'academic'
  title: string
  description: string
  station: Station

  // Academic Justification
  academicJustification: string
  citations: string[]
  confidence: number // 0-1

  // Action
  actionRequired: boolean
  suggestedActions: string[]

  // Metadata
  timestamp: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface AcademicAnchor {
  pmbok: string
  iso31000: string
  kanban: string
  iso9001: string
}

export interface NavigationHistoryEntry {
  from: Station
  to: Station
  timestamp: string
  reason: string
}

export interface RailwayState {
  // Core State
  currentProject: ProjectContext | null
  activeStation: Station

  // Progress Tracking
  stationProgress: Record<Station, StationProgress>

  // AI Conductor
  conductorRecommendations: ConductorRecommendation[]

  // Policy Engine
  policyViolations: PolicyViolation[]

  // Academic Framework
  academicAnchors: AcademicAnchor

  // Navigation
  navigationHistory?: NavigationHistoryEntry[]

  // UI State
  isLoading: boolean
  error: string | null
}

export type RailwayAction =
  | { type: 'SET_CURRENT_PROJECT'; payload: ProjectContext }
  | { type: 'SET_ACTIVE_STATION'; payload: { station: Station; reason?: string } }
  | { type: 'UPDATE_STATION_PROGRESS'; payload: { station: Station; progress: Partial<StationProgress> } }
  | { type: 'ADD_POLICY_VIOLATION'; payload: Omit<PolicyViolation, 'id' | 'timestamp'> }
  | { type: 'CLEAR_POLICY_VIOLATIONS'; payload?: { station: Station } }
  | { type: 'SET_CONDUCTOR_RECOMMENDATIONS'; payload: ConductorRecommendation[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_RAILWAY' }

// API Response Types
export interface APIResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
  academicValidation?: {
    citationsValid: boolean
    pmbokCompliant: boolean
    iso31000Compliant: boolean
  }
}

// TanStack Query Key Factory
export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.projects.lists(), { filters }] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
    stations: (projectId: string) => [...queryKeys.projects.detail(projectId), 'stations'] as const,
    station: (projectId: string, station: Station) => [...queryKeys.projects.stations(projectId), station] as const,
  },

  conductor: {
    all: ['conductor'] as const,
    recommendations: (projectId: string) => [...queryKeys.conductor.all, 'recommendations', projectId] as const,
    routing: (projectId: string, from: Station, to: Station) =>
      [...queryKeys.conductor.all, 'routing', projectId, from, to] as const,
  },

  policy: {
    all: ['policy'] as const,
    violations: (projectId: string) => [...queryKeys.policy.all, 'violations', projectId] as const,
    validation: (projectId: string, station: Station) =>
      [...queryKeys.policy.all, 'validation', projectId, station] as const,
  },

  academic: {
    all: ['academic'] as const,
    citations: (standard: string) => [...queryKeys.academic.all, 'citations', standard] as const,
    compliance: (projectId: string) => [...queryKeys.academic.all, 'compliance', projectId] as const,
  }
} as const

// Station Configuration
export interface StationConfig {
  id: Station
  name: string
  description: string
  pmbokPhase: PMBOKProcessGroup
  icon: string
  academicStandard: keyof AcademicAnchor

  // Prerequisites
  requiredStations: Station[]
  optionalStations: Station[]

  // Policy Requirements
  requiredPolicies: string[]

  // UI Configuration
  route: string
  color: string
  estimatedDuration: number // minutes
}

// Fortune 500 Demo Configuration
export const FORTUNE_500_STATIONS: Record<Station, StationConfig> = {
  dashboard: {
    id: 'dashboard',
    name: 'Mission Control',
    description: 'Project overview and railway navigation hub',
    pmbokPhase: 'initiating',
    icon: 'command',
    academicStandard: 'pmbok',
    requiredStations: [],
    optionalStations: [],
    requiredPolicies: [],
    route: '/',
    color: 'blue',
    estimatedDuration: 5
  },

  initiation: {
    id: 'initiation',
    name: 'Project Genesis',
    description: 'PMBOK Initiating Process Group - Project charter and stakeholder identification',
    pmbokPhase: 'initiating',
    icon: 'rocket',
    academicStandard: 'pmbok',
    requiredStations: [],
    optionalStations: [],
    requiredPolicies: ['pmbok_initiation_required'],
    route: '/initiation',
    color: 'green',
    estimatedDuration: 45
  },

  budget: {
    id: 'budget',
    name: 'Financial Planning',
    description: 'PMBOK Planning Process Group - Cost estimation and budget allocation',
    pmbokPhase: 'planning',
    icon: 'dollar-sign',
    academicStandard: 'pmbok',
    requiredStations: ['initiation'],
    optionalStations: ['stakeholder'],
    requiredPolicies: ['pmbok_charter_required', 'budget_approval_required'],
    route: '/budget',
    color: 'yellow',
    estimatedDuration: 60
  },

  risk: {
    id: 'risk',
    name: 'Risk Management',
    description: 'ISO 31000:2018 compliant risk identification and mitigation planning',
    pmbokPhase: 'planning',
    icon: 'shield',
    academicStandard: 'iso31000',
    requiredStations: ['initiation'],
    optionalStations: ['budget', 'schedule'],
    requiredPolicies: ['iso31000_risk_assessment'],
    route: '/risk',
    color: 'red',
    estimatedDuration: 90
  },

  execution: {
    id: 'execution',
    name: 'Kanban Workflow',
    description: 'Lean Manufacturing principles with Kanban board and WIP limits',
    pmbokPhase: 'executing',
    icon: 'play',
    academicStandard: 'kanban',
    requiredStations: ['budget', 'schedule', 'risk'],
    optionalStations: ['resource', 'quality'],
    requiredPolicies: ['kanban_wip_limits', 'lean_workflow'],
    route: '/execution',
    color: 'blue',
    estimatedDuration: 180
  },

  evaluation: {
    id: 'evaluation',
    name: 'Project Closure',
    description: 'PMBOK Closing Process Group - Lessons learned and knowledge transfer',
    pmbokPhase: 'closing',
    icon: 'check-circle',
    academicStandard: 'pmbok',
    requiredStations: ['execution'],
    optionalStations: ['monitoring'],
    requiredPolicies: ['pmbok_closure_required'],
    route: '/evaluation',
    color: 'purple',
    estimatedDuration: 75
  },

  // Additional stations for comprehensive 24-page structure
  charter: {
    id: 'charter',
    name: 'Project Charter',
    description: 'Formal project authorization document per PMBOK standards',
    pmbokPhase: 'initiating',
    icon: 'file-text',
    academicStandard: 'pmbok',
    requiredStations: [],
    optionalStations: [],
    requiredPolicies: ['pmbok_charter_format'],
    route: '/charter',
    color: 'green',
    estimatedDuration: 30
  },

  stakeholder: {
    id: 'stakeholder',
    name: 'Stakeholder Registry',
    description: 'Stakeholder identification and engagement planning',
    pmbokPhase: 'initiating',
    icon: 'users',
    academicStandard: 'pmbok',
    requiredStations: ['charter'],
    optionalStations: [],
    requiredPolicies: ['stakeholder_identification'],
    route: '/stakeholder',
    color: 'green',
    estimatedDuration: 45
  },

  schedule: {
    id: 'schedule',
    name: 'Schedule Management',
    description: 'Work breakdown structure and critical path analysis',
    pmbokPhase: 'planning',
    icon: 'calendar',
    academicStandard: 'pmbok',
    requiredStations: ['initiation'],
    optionalStations: ['scope'],
    requiredPolicies: ['pmbok_schedule_development'],
    route: '/schedule',
    color: 'yellow',
    estimatedDuration: 75
  },

  scope: {
    id: 'scope',
    name: 'Scope Definition',
    description: 'Project scope statement and WBS creation',
    pmbokPhase: 'planning',
    icon: 'target',
    academicStandard: 'pmbok',
    requiredStations: ['charter'],
    optionalStations: [],
    requiredPolicies: ['scope_validation'],
    route: '/scope',
    color: 'yellow',
    estimatedDuration: 60
  },

  resource: {
    id: 'resource',
    name: 'Resource Planning',
    description: 'Human resource and material resource allocation',
    pmbokPhase: 'planning',
    icon: 'users',
    academicStandard: 'pmbok',
    requiredStations: ['budget', 'schedule'],
    optionalStations: [],
    requiredPolicies: ['resource_availability'],
    route: '/resource',
    color: 'yellow',
    estimatedDuration: 45
  },

  quality: {
    id: 'quality',
    name: 'Quality Management',
    description: 'ISO 9001:2015 quality planning and assurance processes',
    pmbokPhase: 'planning',
    icon: 'award',
    academicStandard: 'iso9001',
    requiredStations: ['scope'],
    optionalStations: [],
    requiredPolicies: ['iso9001_quality_planning'],
    route: '/quality',
    color: 'yellow',
    estimatedDuration: 90
  },

  communication: {
    id: 'communication',
    name: 'Communication Plan',
    description: 'Stakeholder communication strategy and protocols',
    pmbokPhase: 'planning',
    icon: 'message-circle',
    academicStandard: 'pmbok',
    requiredStations: ['stakeholder'],
    optionalStations: [],
    requiredPolicies: ['communication_planning'],
    route: '/communication',
    color: 'yellow',
    estimatedDuration: 30
  },

  procurement: {
    id: 'procurement',
    name: 'Procurement Management',
    description: 'Vendor selection and contract management processes',
    pmbokPhase: 'planning',
    icon: 'shopping-cart',
    academicStandard: 'pmbok',
    requiredStations: ['budget', 'scope'],
    optionalStations: [],
    requiredPolicies: ['procurement_planning'],
    route: '/procurement',
    color: 'yellow',
    estimatedDuration: 60
  },

  monitoring: {
    id: 'monitoring',
    name: 'Performance Monitoring',
    description: 'Earned value management and performance tracking',
    pmbokPhase: 'monitoring',
    icon: 'activity',
    academicStandard: 'pmbok',
    requiredStations: ['execution'],
    optionalStations: [],
    requiredPolicies: ['performance_monitoring'],
    route: '/monitoring',
    color: 'orange',
    estimatedDuration: 120
  },

  closure: {
    id: 'closure',
    name: 'Administrative Closure',
    description: 'Contract closure and administrative completion',
    pmbokPhase: 'closing',
    icon: 'archive',
    academicStandard: 'pmbok',
    requiredStations: ['evaluation'],
    optionalStations: [],
    requiredPolicies: ['administrative_closure'],
    route: '/closure',
    color: 'purple',
    estimatedDuration: 45
  },

  handover: {
    id: 'handover',
    name: 'Knowledge Transfer',
    description: 'Documentation handover and knowledge transfer sessions',
    pmbokPhase: 'closing',
    icon: 'git-branch',
    academicStandard: 'pmbok',
    requiredStations: ['monitoring'],
    optionalStations: [],
    requiredPolicies: ['knowledge_transfer'],
    route: '/handover',
    color: 'purple',
    estimatedDuration: 60
  },

  archive: {
    id: 'archive',
    name: 'Project Archive',
    description: 'Document archival and organizational learning capture',
    pmbokPhase: 'closing',
    icon: 'database',
    academicStandard: 'pmbok',
    requiredStations: ['closure'],
    optionalStations: [],
    requiredPolicies: ['document_retention'],
    route: '/archive',
    color: 'purple',
    estimatedDuration: 30
  },

  analytics: {
    id: 'analytics',
    name: 'Project Analytics',
    description: 'Performance analytics and predictive insights',
    pmbokPhase: 'monitoring',
    icon: 'bar-chart',
    academicStandard: 'pmbok',
    requiredStations: [],
    optionalStations: [],
    requiredPolicies: [],
    route: '/analytics',
    color: 'indigo',
    estimatedDuration: 15
  },

  reporting: {
    id: 'reporting',
    name: 'Executive Reporting',
    description: 'Executive dashboards and stakeholder reports',
    pmbokPhase: 'monitoring',
    icon: 'file-text',
    academicStandard: 'pmbok',
    requiredStations: [],
    optionalStations: [],
    requiredPolicies: [],
    route: '/reporting',
    color: 'indigo',
    estimatedDuration: 20
  },

  settings: {
    id: 'settings',
    name: 'Project Settings',
    description: 'Project configuration and policy settings',
    pmbokPhase: 'initiating',
    icon: 'settings',
    academicStandard: 'pmbok',
    requiredStations: [],
    optionalStations: [],
    requiredPolicies: [],
    route: '/settings',
    color: 'gray',
    estimatedDuration: 10
  },

  governance: {
    id: 'governance',
    name: 'Governance Framework',
    description: 'Project governance structure and decision-making processes',
    pmbokPhase: 'initiating',
    icon: 'shield',
    academicStandard: 'pmbok',
    requiredStations: ['charter'],
    optionalStations: [],
    requiredPolicies: ['governance_structure'],
    route: '/governance',
    color: 'gray',
    estimatedDuration: 45
  },

  compliance: {
    id: 'compliance',
    name: 'Compliance Monitoring',
    description: 'Regulatory compliance and audit trail management',
    pmbokPhase: 'monitoring',
    icon: 'check-square',
    academicStandard: 'pmbok',
    requiredStations: [],
    optionalStations: [],
    requiredPolicies: ['compliance_monitoring'],
    route: '/compliance',
    color: 'gray',
    estimatedDuration: 30
  }
} as const
