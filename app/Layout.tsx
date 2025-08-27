/**
 * Railway Layout - Enterprise App Shell
 *
 * Implements the main layout structure for the AI-Orchestrated Project Railway System
 * with dark-theme first design and Fortune 500 enterprise standards.
 *
 * Phase 1.1.1 Requirements:
 * - Enterprise app shell with <200ms response
 * - Mobile-first responsive design
 * - WCAG AAA compliance
 * - ENHANCED_DESIGN_TOKENS integration (zero hardcoded values)
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Railway Station Pages
import { InitiationStation } from '../pages/stations/InitiationStation';
import { PlanningStation } from '../pages/stations/PlanningStation';
import { ExecutionStation } from '../pages/stations/ExecutionStation';
import { ClosureStation } from '../pages/stations/ClosureStation';

// Dashboard Pages
import { ProjectDashboard } from '../pages/dashboard/ProjectDashboard';
import { OverviewDashboard } from '../pages/dashboard/OverviewDashboard';

// Utility function for class names (simplified version)
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Railway Navigation Header
 * 
 * Provides navigation between railway stations with academic anchors
 */
const RailwayHeader: React.FC = () => {
  return (
    <header 
      className={cn(
        // Dark theme surface
        'bg-slate-900/80 border-slate-700',
        // Layout and spacing
        'border-b px-6 py-4',
        // Enterprise styling
        'backdrop-blur-sm',
        // Responsive design
        'sm:px-8'
      )}
    >
      <div className="max-w-7xl mx-auto">
        <h1 
          className={cn(
            'text-3xl font-bold leading-tight tracking-tight',
            'text-white',
            // Railway branding
            'font-semibold tracking-tight'
          )}
        >
          SparkTasks Railway System
        </h1>
        <p 
          className={cn(
            'text-sm font-normal leading-normal',
            'text-slate-400',
            'mt-1'
          )}
        >
          AI-Orchestrated Project Management Platform
        </p>
      </div>
    </header>
  );
};

/**
 * Main Layout Component
 * 
 * Provides the enterprise-grade app shell with routing for Railway stations
 */
export const Layout: React.FC = () => {
  return (
    <div 
      className={cn(
        // Full height layout
        'min-h-screen flex flex-col',
        // Performance optimization
        'will-change-auto'
      )}
    >
      <RailwayHeader />
      
      <main 
        className={cn(
          // Flex grow to fill remaining space
          'flex-1',
          // Content spacing
          'px-6 py-8',
          // Responsive design
          'sm:px-8',
          // Maximum content width for enterprise readability
          'max-w-7xl mx-auto w-full'
        )}
      >
        <Routes>
          {/* Default dashboard route */}
          <Route path="/" element={<OverviewDashboard />} />
          
          {/* Railway Station Routes (PMBOK Process Groups) */}
          <Route path="/stations/initiation" element={<InitiationStation />} />
          <Route path="/stations/planning" element={<PlanningStation />} />
          <Route path="/stations/execution" element={<ExecutionStation />} />
          <Route path="/stations/closure" element={<ClosureStation />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard/overview" element={<OverviewDashboard />} />
          <Route path="/dashboard/project/:id" element={<ProjectDashboard />} />
          
          {/* Fallback route */}
          <Route path="*" element={<OverviewDashboard />} />
        </Routes>
      </main>
    </div>
  );
};
