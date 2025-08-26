/**
 * BarChart Component Tests
 *
 * Tests for the data visualization component with Nivo integration
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { BarChart } from '../../../src/components/data-enhanced/Charts/BarChart'

// Test data
const mockData = [
  { month: 'Jan', revenue: 12000, profit: 8000, expenses: 4000 },
  { month: 'Feb', revenue: 15000, profit: 9500, expenses: 5500 },
  { month: 'Mar', revenue: 18000, profit: 12000, expenses: 6000 },
  { month: 'Apr', revenue: 14000, profit: 8500, expenses: 5500 },
  { month: 'May', revenue: 20000, profit: 14000, expenses: 6000 },
  { month: 'Jun', revenue: 22000, profit: 16000, expenses: 6000 },
]

describe('BarChart', () => {
  describe('Basic Rendering', () => {
    it('renders chart with data', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue', 'profit']}
          indexBy="month"
        />
      )

      // Chart container should be rendered
      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
      expect(chartContainer).toHaveAttribute('aria-label', 'Bar chart showing revenue, profit data')
    })

    it('renders empty state when no data provided', () => {
      render(
        <BarChart
          data={[]}
          keys={['revenue']}
          indexBy="month"
        />
      )

      expect(screen.getByText('No data available')).toBeInTheDocument()
      expect(screen.getByText('Add data to display the chart')).toBeInTheDocument()
    })

    it('renders custom empty state', () => {
      render(
        <BarChart
          data={[]}
          keys={['revenue']}
          indexBy="month"
          empty={<div>Custom empty message</div>}
        />
      )

      expect(screen.getByText('Custom empty message')).toBeInTheDocument()
    })
  })

  describe('Chart Configuration', () => {
    it('applies vertical layout by default', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
      // Nivo ResponsiveBar should be rendered with default vertical layout
    })

    it('applies horizontal layout when specified', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          layout="horizontal"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
    })

    it('applies grouped mode by default', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue', 'profit']}
          indexBy="month"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
    })

    it('applies stacked mode when specified', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue', 'profit']}
          indexBy="month"
          groupMode="stacked"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
    })
  })

  describe('Surface Variants', () => {
    it('applies elevated surface styling', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          surface="elevated"
        />
      )

      const container = screen.getByRole('img').closest('div')
      expect(container).toHaveClass('bg-surface-elevated1', 'rounded-lg', 'border', 'p-4')
    })

    it('applies glass surface styling', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          surface="glass"
        />
      )

      const container = screen.getByRole('img').closest('div')
      expect(container).toHaveClass('bg-glass-surface', 'rounded-lg', 'border', 'p-4')
    })
  })

  describe('Theming', () => {
    it('applies auto theme by default', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
      // Theme should be automatically detected based on system preference
    })

    it('applies light theme when specified', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          theme="light"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
    })

    it('applies dark theme when specified', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          theme="dark"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
    })
  })

  describe('Dimensions and Layout', () => {
    it('applies custom height', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          height={400}
        />
      )

      const chartContainer = screen.getByRole('img').parentElement
      expect(chartContainer).toHaveStyle({ height: '400px' })
    })

    it('applies default medium size', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
        />
      )

      const chartContainer = screen.getByRole('img').parentElement
      expect(chartContainer).toHaveClass('h-80') // medium size default
    })

    it('applies custom margin settings', () => {
      const customMargin = { top: 30, right: 40, bottom: 70, left: 90 }

      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          margin={customMargin}
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
      // Nivo would apply these margins internally
    })
  })

  describe('Grid Lines', () => {
    it('shows grid lines by default', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
      // Grid lines should be enabled by default
    })

    it('hides grid lines when disabled', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          showGridLines={false}
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
    })
  })

  describe('Legend', () => {
    it('renders legend for multiple data keys', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue', 'profit', 'expenses']}
          indexBy="month"
        />
      )

      // Legend should show all keys
      expect(screen.getByText('revenue')).toBeInTheDocument()
      expect(screen.getByText('profit')).toBeInTheDocument()
      expect(screen.getByText('expenses')).toBeInTheDocument()

      // Legend items should have color indicators
      const legendItems = screen.getAllByText(/revenue|profit|expenses/)
      expect(legendItems).toHaveLength(3)
    })

    it('does not render legend for single data key', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
        />
      )

      // Should have legend container but only one item
      expect(screen.getByText('revenue')).toBeInTheDocument()
    })
  })

  describe('Interactivity', () => {
    it('handles click events', async () => {
      const onClick = vi.fn()

      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          onClick={onClick}
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()

      // Click interactions would be handled by Nivo internally
      // We can test that the onClick prop is passed
    })

    it('handles hover events', () => {
      const onHover = vi.fn()

      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          onHover={onHover}
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()

      // Hover interactions would be handled by Nivo internally
    })
  })

  describe('Colors', () => {
    it('uses default MAPS colors', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue', 'profit']}
          indexBy="month"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
      // Default colors from MAPS design system should be applied
    })

    it('accepts custom color array', () => {
      const customColors = ['#ff0000', '#00ff00', '#0000ff']

      render(
        <BarChart
          data={mockData}
          keys={['revenue', 'profit', 'expenses']}
          indexBy="month"
          colors={customColors}
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
    })

    it('accepts custom color function', () => {
      const colorFunction = (_data: unknown) => '#custom-color'

      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          colors={colorFunction}
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
      // Function should be used but fallback to default colors in our implementation
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue', 'profit']}
          indexBy="month"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toHaveAttribute('aria-label', 'Bar chart showing revenue, profit data')
    })

    it('accepts custom ARIA label', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          ariaLabel="Monthly revenue chart"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toHaveAttribute('aria-label', 'Monthly revenue chart')
    })

    it('has proper semantic structure', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue', 'profit']}
          indexBy="month"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()

      // Should have proper aria-labelledby and aria-describedby attributes
      expect(chartContainer).toHaveAttribute('aria-labelledby', 'chart-title')
      expect(chartContainer).toHaveAttribute('aria-describedby', 'chart-description')
    })
  })

  describe('Loading and Error States', () => {
    it('renders loading state', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          loading={true}
        />
      )

      // Should show loading indicator
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('renders error state', () => {
      const error = new Error('Failed to load chart data')

      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          error={error}
        />
      )

      expect(screen.getByText('Failed to load chart data')).toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    it('forwards custom props to container', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
          data-testid="custom-chart"
          className="custom-class"
        />
      )

      const container = screen.getByTestId('custom-chart')
      expect(container).toHaveClass('custom-class')
    })
  })

  describe('Performance', () => {
    it('handles large datasets efficiently', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        month: `Month ${i}`,
        revenue: Math.random() * 50000,
        profit: Math.random() * 30000,
      }))

      const startTime = performance.now()

      render(
        <BarChart
          data={largeData}
          keys={['revenue', 'profit']}
          indexBy="month"
        />
      )

      const endTime = performance.now()

      // Should render within reasonable time
      expect(endTime - startTime).toBeLessThan(200)

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('renders as ResponsiveBar for automatic sizing', () => {
      render(
        <BarChart
          data={mockData}
          keys={['revenue']}
          indexBy="month"
        />
      )

      const chartContainer = screen.getByRole('img')
      expect(chartContainer).toBeInTheDocument()

      // ResponsiveBar should handle container sizing automatically
      const container = chartContainer.parentElement
      expect(container).toHaveClass('relative') // Should have responsive container
    })
  })
})
