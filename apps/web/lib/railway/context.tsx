'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type {
  RailwayState,
  RailwayAction,
  ProjectContext,
  Station,
  PMBOKProcessGroup,
  StationProgress,
  PolicyViolation,
  ConductorRecommendation
} from './types'
import { FORTUNE_500_STATIONS } from './types'

// Initial Railway State with proper station initialization
const createInitialStationProgress = (): Record<Station, StationProgress> => {
  const stations: Station[] = [
    'dashboard', 'initiation', 'charter', 'stakeholder', 'budget', 'schedule',
    'scope', 'resource', 'risk', 'quality', 'communication', 'procurement',
    'execution', 'monitoring', 'closure', 'handover', 'evaluation', 'archive',
    'analytics', 'reporting', 'settings', 'governance', 'compliance'
  ];

  const progress: Record<string, StationProgress> = {};

  stations.forEach(station => {
    progress[station] = {
      station,
      progress: 0,
      status: station === 'dashboard' ? 'available' : 'locked',
      pmbokPhase: FORTUNE_500_STATIONS[station]?.pmbokPhase || 'initiating',
      policyChecks: {
        passed: 0,
        total: 0,
        violations: []
      },
      academicCitations: [],
      complianceScore: 0,
      lastUpdated: new Date().toISOString(),
      timeSpent: 0
    };
  });

  return progress as Record<Station, StationProgress>;
};

const initialState: RailwayState = {
  currentProject: null,
  activeStation: 'dashboard',
  stationProgress: createInitialStationProgress(),
  conductorRecommendations: [],
  policyViolations: [],
  academicAnchors: {
    pmbok: 'PMBOK Guide 7th Edition',
    iso31000: 'ISO 31000:2018 Risk Management',
    kanban: 'Lean Manufacturing Principles',
    iso9001: 'ISO 9001:2015 Quality Management'
  },
  isLoading: false,
  error: null
}

// Railway Reducer
function railwayReducer(state: RailwayState, action: RailwayAction): RailwayState {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
        isLoading: false,
        error: null
      }

    case 'SET_ACTIVE_STATION':
      return {
        ...state,
        activeStation: action.payload.station,
        // Track station navigation for analytics
        navigationHistory: [
          ...(state.navigationHistory || []),
          {
            from: state.activeStation,
            to: action.payload.station,
            timestamp: new Date().toISOString(),
            reason: action.payload.reason || 'user_navigation'
          }
        ].slice(-10) // Keep last 10 navigations
      }

    case 'UPDATE_STATION_PROGRESS':
      return {
        ...state,
        stationProgress: {
          ...state.stationProgress,
          [action.payload.station]: {
            ...state.stationProgress[action.payload.station],
            ...action.payload.progress,
            lastUpdated: new Date().toISOString()
          }
        }
      }

    case 'ADD_POLICY_VIOLATION':
      return {
        ...state,
        policyViolations: [
          ...state.policyViolations,
          {
            ...action.payload,
            id: `violation_${Date.now()}`,
            timestamp: new Date().toISOString()
          }
        ]
      }

    case 'CLEAR_POLICY_VIOLATIONS':
      return {
        ...state,
        policyViolations: action.payload?.station
          ? state.policyViolations.filter(v => v.station !== action.payload!.station)
          : []
      }

    case 'SET_CONDUCTOR_RECOMMENDATIONS':
      return {
        ...state,
        conductorRecommendations: action.payload.map(rec => ({
          ...rec,
          timestamp: new Date().toISOString()
        }))
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case 'RESET_RAILWAY':
      return initialState

    default:
      return state
  }
}

// Context Creation
const RailwayContext = createContext<{
  state: RailwayState
  dispatch: React.Dispatch<RailwayAction>
} | null>(null)

// Provider Component
interface RailwayContextProviderProps {
  children: ReactNode
}

export function RailwayContextProvider({ children }: RailwayContextProviderProps) {
  const [state, dispatch] = useReducer(railwayReducer, initialState)

  return (
    <RailwayContext.Provider value={{ state, dispatch }}>
      {children}
    </RailwayContext.Provider>
  )
}

// Custom Hook
export function useRailwayContext() {
  const context = useContext(RailwayContext)
  if (!context) {
    throw new Error('useRailwayContext must be used within a RailwayContextProvider')
  }
  return context
}

// Helper Hooks for Specific Railway Operations
export function useStationNavigation() {
  const { state, dispatch } = useRailwayContext()

  const navigateToStation = (station: Station, reason?: string) => {
    dispatch({
      type: 'SET_ACTIVE_STATION',
      payload: { station, reason }
    })
  }

  return {
    currentStation: state.activeStation,
    navigateToStation,
    navigationHistory: state.navigationHistory || []
  }
}

export function usePolicyValidation() {
  const { state, dispatch } = useRailwayContext()

  const addViolation = (violation: Omit<PolicyViolation, 'id' | 'timestamp'>) => {
    dispatch({
      type: 'ADD_POLICY_VIOLATION',
      payload: violation
    })
  }

  const clearViolations = (station?: Station) => {
    dispatch({
      type: 'CLEAR_POLICY_VIOLATIONS',
      payload: station ? { station } : undefined
    })
  }

  return {
    violations: state.policyViolations,
    addViolation,
    clearViolations
  }
}

export function useConductorRecommendations() {
  const { state, dispatch } = useRailwayContext()

  const setRecommendations = (recommendations: ConductorRecommendation[]) => {
    dispatch({
      type: 'SET_CONDUCTOR_RECOMMENDATIONS',
      payload: recommendations
    })
  }

  return {
    recommendations: state.conductorRecommendations,
    setRecommendations
  }
}
