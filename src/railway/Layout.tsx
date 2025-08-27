/**
 * Railway Layout - Enterprise App Shell
 *
 * Implements the main layout structure for the AI-Orchestrated Project Railway System
 * with dark-theme first design and Fortune 500 enterprise standards.
 */

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Utility function for class names (simplified version)
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Railway Station Component (Simplified)
 */
const RailwayStation: React.FC<{ title: string; description: string; pmbok: string }> = ({ title, description, pmbok }) => {
  return (
    <div className={cn(
      'bg-slate-900/50 border border-slate-700 rounded-lg p-6',
      'hover:border-slate-600 transition-colors'
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          'px-3 py-1 rounded-full text-xs font-medium',
          'bg-green-900/30 text-green-400 border border-green-400/30'
        )}>
          {pmbok}
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

/**
 * Railway Header Component
 */
const RailwayHeader: React.FC = () => {
  return (
    <header className={cn(
      'bg-slate-900/80 border-slate-700 border-b px-6 py-4 backdrop-blur-sm'
    )}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white">
          SparkTasks Railway System
        </h1>
        <p className="text-slate-400 mt-1">
          AI-Orchestrated Project Management Platform
        </p>
      </div>
    </header>
  );
};

/**
 * Main Layout Component
 */
export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <RailwayHeader />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <Routes>
          <Route path="/stations/initiation" element={
            <RailwayStation 
              title="Project Charter Creation" 
              description="Define project scope, objectives, and stakeholder requirements with PMBOK Initiating process compliance."
              pmbok="PMBOK Initiating"
            />
          } />
          <Route path="/stations/planning" element={
            <RailwayStation 
              title="Project Planning & Resource Allocation" 
              description="Comprehensive planning with RACI matrix, resource allocation, and WIP limit management."
              pmbok="PMBOK Planning"
            />
          } />
          <Route path="/stations/execution" element={
            <RailwayStation 
              title="Project Execution & Task Management" 
              description="Kanban-based task management with policy enforcement and real-time monitoring."
              pmbok="PMBOK Executing"
            />
          } />
          <Route path="/stations/closure" element={
            <RailwayStation 
              title="Project Closure & Handover" 
              description="Comprehensive project closure with lessons learned, stakeholder sign-offs, and knowledge transfer."
              pmbok="PMBOK Closing"
            />
          } />
          
          <Route path="/" element={
            <div className="space-y-6">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-white mb-4">Railway Foundation Dashboard</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Welcome to the AI-Orchestrated Project Railway System. Navigate through PMBOK-compliant project management stations.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/stations/initiation" className="block hover:scale-105 transition-transform">
                  <RailwayStation 
                    title="Initiation Station" 
                    description="Start your project journey with charter creation and stakeholder identification."
                    pmbok="PMBOK Initiating"
                  />
                </Link>
                <Link to="/stations/planning" className="block hover:scale-105 transition-transform">
                  <RailwayStation 
                    title="Planning Station" 
                    description="Comprehensive project planning with resource allocation and RACI matrix."
                    pmbok="PMBOK Planning"
                  />
                </Link>
                <Link to="/stations/execution" className="block hover:scale-105 transition-transform">
                  <RailwayStation 
                    title="Execution Station" 
                    description="Kanban task management with policy enforcement and monitoring."
                    pmbok="PMBOK Executing"
                  />
                </Link>
                <Link to="/stations/closure" className="block hover:scale-105 transition-transform">
                  <RailwayStation 
                    title="Closure Station" 
                    description="Project closure with lessons learned and stakeholder sign-offs."
                    pmbok="PMBOK Closing"
                  />
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};
