/**
 * Test Setup for Railway Components
 * 
 * PURPOSE: Configure testing environment for Railway component tests
 * - Mock necessary dependencies
 * - Set up testing utilities
 * - Configure component testing environment
 */

import { vi } from 'vitest';
import '@testing-library/jest-dom';

// ===== MOCK ENHANCED DESIGN TOKENS =====

// Mock the enhanced design tokens to avoid complex CSS-in-JS issues
vi.mock('@/design/enhanced-tokens', () => ({
  ENHANCED_DESIGN_TOKENS: {
    foundation: {
      color: {
        surface: {
          canvas: 'bg-background text-foreground',
          elevated: 'bg-card text-card-foreground',
          panel: 'bg-muted text-muted-foreground'
        },
        content: {
          primary: 'text-foreground',
          secondary: 'text-muted-foreground'
        }
      },
      zIndex: {
        surface: 0,
        overlay: 100,
        popover: 200,
        modal: 300,
        toast: 400,
        tooltip: 500
      }
    },
    recipes: {
      button: {
        variant: {
          primary: 'bg-primary text-primary-foreground hover:bg-primary-hover'
        }
      }
    }
  }
}));

// ===== MOCK UTILITIES =====

// Mock the cn utility function
vi.mock('@/utils/cn', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => 
    classes.filter(Boolean).join(' ')
}));

// ===== TEST ENVIRONMENT SETUP =====

// Set up global test environment
beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks();
  
  // Set up DOM environment for component testing
  document.body.innerHTML = '';
});

afterEach(() => {
  // Clean up after each test
  vi.restoreAllMocks();
});

// ===== CUSTOM TEST UTILITIES =====

// Helper to create mock Railway station data
export const createMockStation = (overrides: Partial<any> = {}) => ({
  id: 'test-station',
  name: 'Test Station',
  pmbokPhase: 'initiating' as const,
  progress: 0.5,
  status: 'available' as const,
  academicAnchor: 'Test Academic Anchor',
  description: 'Test station description',
  estimatedDuration: '1 week',
  dependencies: [],
  ...overrides
});

// Helper to create mock Railway map props
export const createMockRailwayMapProps = (overrides: Partial<any> = {}) => ({
  projectId: 'test-project',
  stations: [createMockStation()],
  ...overrides
});
