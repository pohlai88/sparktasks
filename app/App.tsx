/**
 * SparkTasks v6.1 Railway Foundation - Main Application
 * AI-Orchestrated Project Railway System - Enterprise-Grade Implementation
 *
 * COMPLIANCE:
 * - Fortune 500 Enterprise Standards
 * - MAPS v3.0 Design System Integration
 * - Dark-theme First Design
 * - WCAG AAA Accessibility
 * - Zero TypeScript Errors
 * - Anti-Drift Enforcement
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Layout } from './Layout';
import { AppProviders } from './providers/AppProviders';

// Utility function for class names (simplified version)
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Main Railway Application Component
 * 
 * Implements Phase 1.1.1 from SUPREME_DEV_PLAN_V6_1_FORTUNE_500.md:
 * - React Router foundation
 * - Railway routing structure
 * - Dark-theme first design
 * - Enterprise app shell
 * - Performance optimization
 */
const App: React.FC = () => {
  return (
    <div dir="ltr">
      <BrowserRouter>
        <AppProviders>
          <div 
            className={cn(
              // Dark-theme first background 
              'bg-slate-950 text-white',
              // Full viewport coverage
              'min-h-screen w-full',
              // Enterprise-grade foundation
              'antialiased font-sans',
              // Motion respect compliance
              'motion-reduce:transition-none'
            )}
          >
            <Layout />
          </div>
        </AppProviders>
      </BrowserRouter>
    </div>
  );
};

export default App;
