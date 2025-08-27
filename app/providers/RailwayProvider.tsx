/**
 * Railway Provider - Station Orchestration Context
 *
 * Provides railway station state management and orchestration for the
 * AI-Orchestrated Project Railway System.
 *
 * Phase 1.1.1 Requirements:
 * - Station orchestration context
 * - PMBOK process group state management
 * - Railway navigation state
 * - Performance optimization with useMemo and useCallback
 */

import React, { createContext, useContext, useMemo, useCallback, useState } from 'react';

/**
 * PMBOK Process Groups (Academic Anchors)
 * 
 * Based on Project Management Body of Knowledge (PMBOK) 7th Edition
 * ensuring academic credibility and enterprise compliance.
 */
export type PMBOKProcessGroup = 
  | 'initiating'    // Project Charter, Stakeholder Identification
  | 'planning'      // Scope, Schedule, Resource Planning  
  | 'executing'     // Team Management, Task Execution
  | 'monitoring'    // Performance Measurement, Change Control
  | 'closing';      // Project Closure, Lessons Learned

/**
 * Railway Station Definition
 * 
 * Each station represents a PMBOK process group with enterprise governance
 */
export interface RailwayStation {
  id: string;
  name: string;
  pmbok: PMBOKProcessGroup;
  description: string;
  anchor: string;
  isActive: boolean;
  isCompleted: boolean;
  progress: number; // 0-100 percentage
}

/**
 * Railway Context State
 */
interface RailwayContextState {
  // Station Management
  stations: RailwayStation[];
  currentStation: RailwayStation | null;
  
  // Navigation
  navigateToStation: (stationId: string) => void;
  setStationProgress: (stationId: string, progress: number) => void;
  markStationCompleted: (stationId: string) => void;
  
  // Project State
  projectTitle: string;
  setProjectTitle: (title: string) => void;
}

/**
 * Railway Context
 */
const RailwayContext = createContext<RailwayContextState | null>(null);

/**
 * Railway Provider Props
 */
interface RailwayProviderProps {
  children: React.ReactNode;
}

/**
 * Default Railway Stations
 * 
 * Implements the 4 core PMBOK process groups as railway stations
 */
const DEFAULT_STATIONS: RailwayStation[] = [
  {
    id: 'initiation',
    name: 'Initiation Station',
    pmbok: 'initiating',
    description: 'Project Charter Creation & Stakeholder Identification',
    anchor: 'PMBOK Initiating Process Group',
    isActive: true,
    isCompleted: false,
    progress: 0,
  },
  {
    id: 'planning',
    name: 'Planning Station', 
    pmbok: 'planning',
    description: 'Scope Definition, Resource Planning & Risk Assessment',
    anchor: 'PMBOK Planning Process Group',
    isActive: false,
    isCompleted: false,
    progress: 0,
  },
  {
    id: 'execution',
    name: 'Execution Station',
    pmbok: 'executing', 
    description: 'Task Management & Team Coordination',
    anchor: 'PMBOK Executing Process Group',
    isActive: false,
    isCompleted: false,
    progress: 0,
  },
  {
    id: 'closure',
    name: 'Closure Station',
    pmbok: 'closing',
    description: 'Project Handover & Lessons Learned',
    anchor: 'PMBOK Closing Process Group', 
    isActive: false,
    isCompleted: false,
    progress: 0,
  },
];

/**
 * Railway Provider Component
 * 
 * Provides railway station orchestration with enterprise-grade state management
 */
export const RailwayProvider: React.FC<RailwayProviderProps> = ({ children }) => {
  // State management
  const [stations, setStations] = useState<RailwayStation[]>(DEFAULT_STATIONS);
  const [projectTitle, setProjectTitle] = useState<string>('New Railway Project');

  // Current station calculation
  const currentStation = useMemo(() => {
    return stations.find(station => station.isActive) || stations[0] || null;
  }, [stations]);

  // Navigation handler
  const navigateToStation = useCallback((stationId: string) => {
    setStations(prevStations => 
      prevStations.map(station => ({
        ...station,
        isActive: station.id === stationId,
      }))
    );
  }, []);

  // Progress handler
  const setStationProgress = useCallback((stationId: string, progress: number) => {
    setStations(prevStations =>
      prevStations.map(station =>
        station.id === stationId
          ? { ...station, progress: Math.max(0, Math.min(100, progress)) }
          : station
      )
    );
  }, []);

  // Completion handler
  const markStationCompleted = useCallback((stationId: string) => {
    setStations(prevStations =>
      prevStations.map(station =>
        station.id === stationId
          ? { ...station, isCompleted: true, progress: 100 }
          : station
      )
    );
  }, []);

  // Context value with performance optimization
  const contextValue = useMemo<RailwayContextState>(() => ({
    stations,
    currentStation,
    navigateToStation,
    setStationProgress,
    markStationCompleted,
    projectTitle,
    setProjectTitle,
  }), [
    stations,
    currentStation,
    navigateToStation,
    setStationProgress,
    markStationCompleted,
    projectTitle,
    setProjectTitle,
  ]);

  return (
    <RailwayContext.Provider value={contextValue}>
      {children}
    </RailwayContext.Provider>
  );
};

/**
 * Railway Hook
 * 
 * Custom hook for accessing railway context with error handling
 */
export const useRailway = (): RailwayContextState => {
  const context = useContext(RailwayContext);
  
  if (!context) {
    throw new Error('useRailway must be used within a RailwayProvider');
  }
  
  return context;
};
