/**
 * Policy Provider - Governance Context
 *
 * Provides PMBOK-based policy enforcement and governance for the Railway System.
 * Implements Fortune 500 compliance and enterprise governance standards.
 *
 * Phase 1.1.1 Requirements:
 * - PMBOK governance context
 * - Policy validation framework
 * - Real-time compliance monitoring
 * - Academic anchor enforcement
 */

import React, { createContext, useContext, useMemo, useCallback, useState } from 'react';

/**
 * Policy Rule Definition
 * 
 * Based on PMBOK standards and enterprise governance requirements
 */
export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  anchor: string; // Academic methodology reference
  severity: 'info' | 'warning' | 'error';
  condition: string; // Rule logic description
  isActive: boolean;
}

/**
 * Policy Violation Alert
 * 
 * Represents a governance violation that requires attention
 */
export interface PolicyViolation {
  id: string;
  ruleId: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: Date;
  context: Record<string, unknown>;
  isResolved: boolean;
}

/**
 * Policy Context State
 */
interface PolicyContextState {
  // Policy Management
  rules: PolicyRule[];
  violations: PolicyViolation[];
  
  // Policy Actions
  validateAction: (action: string, context: Record<string, unknown>) => PolicyViolation[];
  resolveViolation: (violationId: string) => void;
  addCustomRule: (rule: Omit<PolicyRule, 'id'>) => void;
  
  // Compliance Status
  complianceScore: number; // 0-100 percentage
  isCompliant: boolean;
}

/**
 * Policy Context
 */
const PolicyContext = createContext<PolicyContextState | null>(null);

/**
 * Policy Provider Props
 */
interface PolicyProviderProps {
  children: React.ReactNode;
}

/**
 * Default PMBOK Policy Rules
 * 
 * Enterprise governance rules based on Project Management Body of Knowledge
 */
const DEFAULT_POLICY_RULES: PolicyRule[] = [
  {
    id: 'pmbok-charter-required',
    name: 'Project Charter Required',
    description: 'All projects must have a formal project charter before proceeding to planning',
    anchor: 'PMBOK 7th Edition - Initiating Process Group',
    severity: 'error',
    condition: 'Project must have charter with defined scope, objectives, and stakeholders',
    isActive: true,
  },
  {
    id: 'pmbok-stakeholder-approval',
    name: 'Stakeholder Approval Required',
    description: 'Key stakeholders must approve major project decisions',
    anchor: 'PMBOK 7th Edition - Stakeholder Management',
    severity: 'warning',
    condition: 'Decisions impacting scope, budget, or timeline require stakeholder approval',
    isActive: true,
  },
  {
    id: 'pmbok-risk-assessment',
    name: 'Risk Assessment Mandatory',
    description: 'Projects must conduct formal risk assessment using ISO 31000 framework',
    anchor: 'ISO 31000:2018 - Risk Management Guidelines',
    severity: 'error',
    condition: 'Risk register must be maintained with mitigation strategies',
    isActive: true,
  },
  {
    id: 'pmbok-quality-gates',
    name: 'Quality Gate Compliance',
    description: 'Each station must meet quality criteria before progression',
    anchor: 'PMBOK 7th Edition - Quality Management',
    severity: 'error',
    condition: 'Quality gates must be passed with documented evidence',
    isActive: true,
  },
  {
    id: 'pmbok-lessons-learned',
    name: 'Lessons Learned Documentation',
    description: 'Project closure requires comprehensive lessons learned documentation',
    anchor: 'PMBOK 7th Edition - Closing Process Group',
    severity: 'warning',
    condition: 'Lessons learned must be documented for organizational learning',
    isActive: true,
  },
];

/**
 * Policy Provider Component
 * 
 * Provides enterprise governance with real-time policy enforcement
 */
export const PolicyProvider: React.FC<PolicyProviderProps> = ({ children }) => {
  // State management
  const [rules, setRules] = useState<PolicyRule[]>(DEFAULT_POLICY_RULES);
  const [violations, setViolations] = useState<PolicyViolation[]>([]);

  // Compliance calculation
  const complianceScore = useMemo(() => {
    if (violations.length === 0) return 100;
    
    const totalViolations = violations.length;
    const resolvedViolations = violations.filter(v => v.isResolved).length;
    const errorViolations = violations.filter(v => v.severity === 'error' && !v.isResolved).length;
    
    // Severe penalty for unresolved errors
    const errorPenalty = errorViolations * 20;
    const baseScore = (resolvedViolations / totalViolations) * 100;
    
    return Math.max(0, Math.min(100, baseScore - errorPenalty));
  }, [violations]);

  const isCompliant = useMemo(() => {
    return complianceScore >= 90 && violations.filter(v => v.severity === 'error' && !v.isResolved).length === 0;
  }, [complianceScore, violations]);

  // Policy validation
  const validateAction = useCallback((action: string, context: Record<string, unknown>) => {
    const newViolations: PolicyViolation[] = [];

    // Example validation logic - in real implementation this would be more sophisticated
    rules.forEach(rule => {
      if (!rule.isActive) return;

      // Simple validation examples based on common PMBOK requirements
      if (rule.id === 'pmbok-charter-required' && action === 'start-planning') {
        if (!context.hasCharter) {
          newViolations.push({
            id: `violation-${Date.now()}-${rule.id}`,
            ruleId: rule.id,
            message: 'Cannot proceed to planning without an approved project charter',
            severity: rule.severity,
            timestamp: new Date(),
            context,
            isResolved: false,
          });
        }
      }

      if (rule.id === 'pmbok-risk-assessment' && action === 'start-execution') {
        if (!context.hasRiskAssessment) {
          newViolations.push({
            id: `violation-${Date.now()}-${rule.id}`,
            ruleId: rule.id,
            message: 'Risk assessment required before starting execution phase',
            severity: rule.severity,
            timestamp: new Date(),
            context,
            isResolved: false,
          });
        }
      }
    });

    // Add new violations to state
    if (newViolations.length > 0) {
      setViolations(prevViolations => [...prevViolations, ...newViolations]);
    }

    return newViolations;
  }, [rules]);

  // Violation resolution
  const resolveViolation = useCallback((violationId: string) => {
    setViolations(prevViolations =>
      prevViolations.map(violation =>
        violation.id === violationId
          ? { ...violation, isResolved: true }
          : violation
      )
    );
  }, []);

  // Custom rule addition
  const addCustomRule = useCallback((rule: Omit<PolicyRule, 'id'>) => {
    const newRule: PolicyRule = {
      ...rule,
      id: `custom-${Date.now()}`,
    };
    
    setRules(prevRules => [...prevRules, newRule]);
  }, []);

  // Context value with performance optimization
  const contextValue = useMemo<PolicyContextState>(() => ({
    rules,
    violations,
    validateAction,
    resolveViolation,
    addCustomRule,
    complianceScore,
    isCompliant,
  }), [
    rules,
    violations,
    validateAction,
    resolveViolation,
    addCustomRule,
    complianceScore,
    isCompliant,
  ]);

  return (
    <PolicyContext.Provider value={contextValue}>
      {children}
    </PolicyContext.Provider>
  );
};

/**
 * Policy Hook
 * 
 * Custom hook for accessing policy context with error handling
 */
export const usePolicy = (): PolicyContextState => {
  const context = useContext(PolicyContext);
  
  if (!context) {
    throw new Error('usePolicy must be used within a PolicyProvider');
  }
  
  return context;
};
