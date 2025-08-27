export type Station =
  | 'resource'
  | 'dashboard'
  | 'initiation'
  | 'charter'
  | 'stakeholder'
  | 'budget'
  | 'schedule'
  | 'risk'
  | 'procurement'
  | 'resource-allocation'
  | 'quality'
  | 'execution'
  | 'monitoring'
  | 'progress'
  | 'sprint'
  | 'handover'
  | 'evaluation'
  | 'lessons'
  | 'closing'
  | 'archive'
  | 'analytics'
  | 'export'
  | 'ai-conductor';

export const STATIONS: Station[] = [
  'resource',
  'dashboard',
  'initiation',
  'charter',
  'stakeholder',
  'budget',
  'schedule',
  'risk',
  'procurement',
  'resource-allocation',
  'quality',
  'execution',
  'monitoring',
  'progress',
  'sprint',
  'handover',
  'evaluation',
  'lessons',
  'closing',
  'archive',
  'analytics',
  'export',
  'ai-conductor'
];

export interface StationProgress {
  progress: number; // 0.0 to 1.0
  completedAt?: string;
  pmbokCompliance: boolean;
  academicCitations: string[];
  policyViolations: PolicyViolation[];
  estimatedTimeRemaining?: number; // minutes
}

export interface PolicyViolation {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  academicCitation: string;
  blocksProgression: boolean;
  station: Station;
  createdAt: string;
}

export interface ConductorRecommendation {
  id: string;
  type: 'station_progression' | 'policy_compliance' | 'risk_mitigation' | 'optimization';
  title: string;
  description: string;
  academicJustification: string;
  confidence: number; // 0.0 to 1.0
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedImpact: string;
  requiredActions: string[];
  createdAt: string;
}

export interface AcademicAnchor {
  standard: string;
  citation: string;
  relevantStations: Station[];
  complianceLevel: number; // 0.0 to 1.0
  lastValidated: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  currentStation: Station;
  policyProfile: 'startup' | 'enterprise' | 'fortune500';
  academicCompliance: boolean;
}

export interface RailwayContextType {
  // Core State
  currentProject: Project | null;
  activeStation: Station;
  stationProgress: Record<Station, StationProgress>;

  // AI Conductor
  conductorRecommendations: ConductorRecommendation[];
  isLoadingRecommendations: boolean;

  // Policy Engine
  policyViolations: PolicyViolation[];
  academicAnchors: Record<string, AcademicAnchor>;

  // Actions
  setActiveStation: (station: Station) => void;
  updateStationProgress: (station: Station, progress: Partial<StationProgress>) => void;
  refreshConductorRecommendations: () => Promise<void>;
  validatePolicyCompliance: (station: Station) => Promise<PolicyViolation[]>;
}
