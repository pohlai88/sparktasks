/**
 * App Providers - Context Composition
 *
 * Provides enterprise-grade context composition for the Railway System.
 * Implements Fortune 500 standards with comprehensive state management.
 *
 * Phase 1.1.1 Requirements:
 * - Context composition for Railway orchestration
 * - Policy governance context
 * - Performance optimization with proper provider hierarchy
 */

import React from 'react';

import { RailwayProvider } from './RailwayProvider';
import { PolicyProvider } from './PolicyProvider';

/**
 * App Providers Component Props
 */
interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * App Providers Component
 * 
 * Composes all application contexts in the correct hierarchy:
 * 1. PolicyProvider (governance layer)
 * 2. RailwayProvider (station orchestration)
 * 3. Children (application components)
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <PolicyProvider>
      <RailwayProvider>
        {children}
      </RailwayProvider>
    </PolicyProvider>
  );
};
