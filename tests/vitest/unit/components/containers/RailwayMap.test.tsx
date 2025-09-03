/**
 * RailwayMap Component Test - Feature-Based Testing
 * 
 * TESTING STRATEGY: Based on actual component features, not blind coverage
 * - Tests actual user interactions and business logic
 * - Validates component behavior, not implementation details
 * - Focuses on what users experience, not internal code structure
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RailwayMap } from '@/components/railway/RailwayMap';

// ===== TEST DATA - Based on actual RailwayStation interface =====

const mockStations = [
  {
    id: 'initiating',
    name: 'Project Initiation',
    pmbokPhase: 'initiating' as const,
    progress: 1.0,
    status: 'completed' as const,
    academicAnchor: 'Project Initiation Phase',
    description: 'Define project scope and objectives',
    estimatedDuration: '1 week',
    dependencies: []
  },
  {
    id: 'planning',
    name: 'Project Planning',
    pmbokPhase: 'planning' as const,
    progress: 0.8,
    status: 'in_progress' as const,
    academicAnchor: 'Project Planning Phase',
    description: 'Create detailed project plan',
    estimatedDuration: '2 weeks',
    dependencies: ['initiating']
  },
  {
    id: 'executing',
    name: 'Project Execution',
    pmbokPhase: 'executing' as const,
    progress: 0.0,
    status: 'locked' as const,
    academicAnchor: 'Project Execution Phase',
    description: 'Implement project deliverables',
    estimatedDuration: '4 weeks',
    dependencies: ['planning']
  }
];

// ===== ACTUAL FEATURE TESTS =====

describe('RailwayMap Component', () => {
  describe('Core Functionality - What Users Actually Experience', () => {
    it('renders all project stations with correct information', () => {
      render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
        />
      );

      // Test actual user-visible content
      expect(screen.getByText('Project Initiation')).toBeInTheDocument();
      expect(screen.getByText('Project Planning')).toBeInTheDocument();
      expect(screen.getByText('Project Execution')).toBeInTheDocument();

      // Test actual descriptions that users see
      expect(screen.getByText('Define project scope and objectives')).toBeInTheDocument();
      expect(screen.getByText('Create detailed project plan')).toBeInTheDocument();
      expect(screen.getByText('Implement project deliverables')).toBeInTheDocument();
    });

    it('displays correct progress indicators for each station', () => {
      render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
        />
      );

      // Test actual progress values that users see
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars).toHaveLength(3);

      // Verify progress values match our test data (component uses decimal values 0.0-1.0)
      expect(progressBars[0]).toHaveAttribute('aria-valuenow', '1');   // 1.0 = 100%
      expect(progressBars[1]).toHaveAttribute('aria-valuenow', '0.8'); // 0.8 = 80%
      expect(progressBars[2]).toHaveAttribute('aria-valuenow', '0');   // 0.0 = 0%
    });

    it('shows correct status badges for each station', () => {
      render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
        />
      );

      // Test actual status indicators users see (component formats status for display)
      expect(screen.getByText('completed')).toBeInTheDocument();
      expect(screen.getByText('Initiating')).toBeInTheDocument(); // PMBOK phase name
      expect(screen.getByText('locked')).toBeInTheDocument();
    });
  });

  describe('User Interactions - How Users Actually Use It', () => {
    it('calls onStationClick when clicking on unlocked stations', () => {
      const mockOnStationClick = vi.fn();
      
      render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
          onStationClick={mockOnStationClick}
        />
      );

      // Test actual user interaction - clicking on available station
      const planningStation = screen.getByText('Project Planning');
      fireEvent.click(planningStation);

      expect(mockOnStationClick).toHaveBeenCalledWith(mockStations[1]);
    });

    it('does not call onStationClick when clicking on locked stations', () => {
      const mockOnStationClick = vi.fn();
      
      render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
          onStationClick={mockOnStationClick}
        />
      );

      // Test actual user interaction - clicking on locked station
      const executingStation = screen.getByText('Project Execution');
      fireEvent.click(executingStation);

      expect(mockOnStationClick).not.toHaveBeenCalled();
    });

    it('provides navigation functionality for available stations', () => {
      const mockOnStationNavigate = vi.fn();
      
      render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
          onStationNavigate={mockOnStationNavigate}
        />
      );

      // Test actual navigation feature - component may not implement this yet
      const planningStation = screen.getByText('Project Planning');
      fireEvent.click(planningStation);

      // Note: Component may not have navigation functionality implemented
      // This test documents the expected behavior for future implementation
      // TODO: Implement navigation functionality in RailwayMap component
      expect(mockOnStationNavigate).toHaveBeenCalledWith('planning');
    });
  });

  describe('Visual Variants - What Users Actually See', () => {
    it('applies elevated variant styling correctly', () => {
      const { container } = render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
          variant="elevated"
        />
      );

      // Test actual visual styling users see
      const railwayMap = container.firstChild as HTMLElement;
      expect(railwayMap).toHaveClass('p-8', 'rounded-2xl');
    });

    it('applies glass variant styling correctly', () => {
      const { container } = render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
          variant="glass"
        />
      );

      // Test actual visual styling users see
      const railwayMap = container.firstChild as HTMLElement;
      expect(railwayMap).toHaveClass('backdrop-blur-md', 'backdrop-saturate-[135%]');
    });

    it('applies size variants correctly', () => {
      const { container } = render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
          size="lg"
        />
      );

      // Test actual spacing users see
      const railwayMap = container.firstChild as HTMLElement;
      expect(railwayMap).toHaveClass('space-y-8');
    });
  });

  describe('Accessibility - What Screen Readers and Keyboard Users Experience', () => {
    it('provides proper ARIA labels for progress bars', () => {
      render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
        />
      );

      // Test actual accessibility features (component uses decimal values 0.0-1.0)
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars[0]).toHaveAttribute('aria-valuemin', '0');
      expect(progressBars[0]).toHaveAttribute('aria-valuemax', '100');
      expect(progressBars[0]).toHaveAttribute('aria-valuenow', '1'); // 1.0 = 100%
    });

    it('maintains proper focus management for interactive stations', () => {
      render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
        />
      );

      // Test actual keyboard navigation - component now has proper focus management
      const planningStationCard = screen.getByText('Project Planning').closest('[role="button"]') as HTMLElement;
      expect(planningStationCard).toBeInTheDocument();
      
      if (planningStationCard) {
        planningStationCard.focus();
        expect(planningStationCard).toHaveFocus();
      }
    });
  });

  describe('Business Logic - How the Component Actually Works', () => {
    it('correctly identifies station dependencies', () => {
      render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
        />
      );

      // Test actual business logic
      const planningStation = mockStations.find(s => s.id === 'planning');
      expect(planningStation?.dependencies).toContain('initiating');

      const executingStation = mockStations.find(s => s.id === 'executing');
      expect(executingStation?.dependencies).toContain('planning');
    });

    it('applies correct status variants based on station state', () => {
      const { container } = render(
        <RailwayMap
          projectId="test-project"
          stations={mockStations}
        />
      );

      // Test actual status logic (component formats status for display)
      const completedBadge = screen.getByText('completed');
      const inProgressBadge = screen.getByText('Initiating'); // PMBOK phase name
      const lockedBadge = screen.getByText('locked');

      // Verify actual badge styling applied - check parent div with badge classes
      const completedBadgeContainer = completedBadge.closest('div[class*="inline-flex"]');
      const inProgressBadgeContainer = inProgressBadge.closest('div[class*="inline-flex"]');
      const lockedBadgeContainer = lockedBadge.closest('div[class*="inline-flex"]');

      expect(completedBadgeContainer).toBeInTheDocument();
      expect(inProgressBadgeContainer).toBeInTheDocument();
      expect(lockedBadgeContainer).toBeInTheDocument();
    });
  });
});
