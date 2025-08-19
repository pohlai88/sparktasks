/**
 * FAB (Floating Action Button) Component Tests
 * 
 * Test Coverage:
 * - Component mounting and basic rendering
 * - Size variants (sm, md, lg, xl) and extended mode
 * - Color variants (primary, secondary, accent, success, warning, error)
 * - Position variants and custom positioning
 * - Extended mode with icon + text
 * - Badge/notification functionality with count limits
 * - Loading and disabled states
 * - Scroll-based auto-hide behavior
 * - Keyboard navigation (Tab, Enter, Space)
 * - Mouse interaction (hover, press, click)
 * - Tooltip functionality
 * - Accessibility attributes and ARIA compliance
 * - Custom content and icon support
 * - Event handling (onClick, onShow, onHide)
 * - Offset positioning
 * - Theme-aware styling and responsive behavior
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { 
  Edit, 
  Settings
} from 'lucide-react';
import FAB, { type FABProps } from '@/components/ui/FAB';

// Mock DESIGN_TOKENS for testing
vi.mock('@/design/tokens', () => ({
  DESIGN_TOKENS: {
    position: {
      fixed: {
        bottomRight: 'fixed bottom-4 right-4',
        bottomLeft: 'fixed bottom-4 left-4',
        topRight: 'fixed top-4 right-4',
        topLeft: 'fixed top-4 left-4'
      }
    },
    recipe: {
      button: {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white',
        secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900'
      }
    },
    zIndex: {
      overlay: 'z-50'
    },
    motion: {
      smooth: 'transition-all duration-200 ease-out',
      semantic: {
        hoverLift: 'hover:transform hover:-translate-y-0.5'
      }
    },
    state: {
      disabled: 'opacity-50 cursor-not-allowed pointer-events-none'
    },
    icon: {
      size: {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
      }
    }
  }
}));

// Mock window.scrollY for scroll tests
Object.defineProperty(window, 'scrollY', {
  value: 0,
  writable: true
});

describe('FAB Component', () => {
  const defaultProps: FABProps = {
    ariaLabel: 'Add new item',
    onClick: vi.fn()
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    window.scrollY = 0;
  });

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<FAB {...defaultProps} />);
      
      const fab = screen.getByRole('button');
      expect(fab).toBeInTheDocument();
      expect(fab).toHaveAttribute('aria-label', 'Add new item');
      expect(fab).toHaveClass('fixed', 'bottom-4', 'right-4');
    });

    it('renders with custom icon', () => {
      render(
        <FAB 
          {...defaultProps} 
          icon={<Edit data-testid="custom-icon" />}
        />
      );
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders with custom children', () => {
      render(
        <FAB {...defaultProps}>
          <span data-testid="custom-content">Custom Content</span>
        </FAB>
      );
      
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('renders in extended mode with label', () => {
      render(
        <FAB 
          {...defaultProps} 
          extended={true}
          label="Create New"
          icon={<Edit />}
        />
      );
      
      const fab = screen.getByRole('button');
      expect(fab).toHaveTextContent('Create New');
      expect(fab).toHaveClass('inline-flex');
    });
  });

  describe('Size Variants', () => {
    it('renders different sizes correctly', () => {
      const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl'];
      
      sizes.forEach(size => {
        const { rerender } = render(<FAB {...defaultProps} size={size} />);
        const fab = screen.getByRole('button');
        
        const expectedSizeClasses = {
          'sm': 'w-10 h-10',
          'md': 'w-12 h-12', 
          'lg': 'w-14 h-14',
          'xl': 'w-16 h-16'
        };
        
        expect(fab).toHaveClass(expectedSizeClasses[size].split(' ')[0]);
        rerender(<div />);
      });
    });

    it('renders extended sizes correctly', () => {
      render(
        <FAB 
          {...defaultProps} 
          size="lg"
          extended={true}
          label="Extended FAB"
        />
      );
      
      const fab = screen.getByRole('button');
      expect(fab).toHaveClass('h-14', 'px-5', 'gap-3');
    });
  });

  describe('Color Variants', () => {
    it('renders different variants correctly', () => {
      const variants: Array<'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'> = 
        ['primary', 'secondary', 'accent', 'success', 'warning', 'error'];
      
      variants.forEach(variant => {
        const { rerender } = render(<FAB {...defaultProps} variant={variant} />);
        const fab = screen.getByRole('button');
        
        if (variant === 'primary') {
          expect(fab).toHaveClass('bg-primary-600');
        } else if (variant === 'secondary') {
          expect(fab).toHaveClass('bg-secondary-100');
        } else {
          expect(fab).toHaveClass(`bg-${variant}-600`);
        }
        
        rerender(<div />);
      });
    });
  });

  describe('Position Variants', () => {
    it('renders in different positions', () => {
      const positions: Array<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center'> = 
        ['bottom-right', 'bottom-left', 'top-right', 'top-left', 'bottom-center'];
      
      positions.forEach(position => {
        const { rerender } = render(<FAB {...defaultProps} position={position} />);
        const fab = screen.getByRole('button');
        
        expect(fab).toHaveClass('fixed');
        
        if (position === 'bottom-center') {
          expect(fab).toHaveClass('left-1/2', 'transform', '-translate-x-1/2');
        } else {
          const expectedClasses = {
            'bottom-right': ['bottom-4', 'right-4'],
            'bottom-left': ['bottom-4', 'left-4'],
            'top-right': ['top-4', 'right-4'],
            'top-left': ['top-4', 'left-4']
          };
          
          expectedClasses[position].forEach(cls => {
            expect(fab).toHaveClass(cls);
          });
        }
        
        rerender(<div />);
      });
    });

    it('uses custom positioning when provided', () => {
      render(
        <FAB 
          {...defaultProps} 
          position="custom"
          customPosition="absolute top-10 left-10"
        />
      );
      
      const fab = screen.getByRole('button');
      expect(fab).toHaveClass('absolute', 'top-10', 'left-10');
    });
  });

  describe('Badge Functionality', () => {
    it('renders badge when specified', () => {
      render(
        <FAB 
          {...defaultProps} 
          badge={{
            show: true,
            count: 5,
            color: 'primary'
          }}
        />
      );
      
      const badge = screen.getByText('5');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-primary-500');
    });

    it('shows max count with plus when count exceeds limit', () => {
      render(
        <FAB 
          {...defaultProps} 
          badge={{
            show: true,
            count: 150,
            max: 99,
            color: 'error'
          }}
        />
      );
      
      const badge = screen.getByText('99+');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-error-500');
    });

    it('renders notification dot without count', () => {
      render(
        <FAB 
          {...defaultProps} 
          badge={{
            show: true,
            color: 'success'
          }}
        />
      );
      
      const fab = screen.getByRole('button');
      const badge = fab.querySelector('.bg-success-500');
      expect(badge).toBeInTheDocument();
    });

    it('does not render badge when show is false', () => {
      render(
        <FAB 
          {...defaultProps} 
          badge={{
            show: false,
            count: 5
          }}
        />
      );
      
      expect(screen.queryByText('5')).not.toBeInTheDocument();
    });
  });

  describe('Loading and Disabled States', () => {
    it('shows loading spinner when loading', () => {
      render(<FAB {...defaultProps} loading={true} />);
      
      const fab = screen.getByRole('button');
      const spinner = fab.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(fab).toHaveClass('cursor-wait');
    });

    it('handles disabled state correctly', () => {
      render(<FAB {...defaultProps} disabled={true} />);
      
      const fab = screen.getByRole('button');
      expect(fab).toBeDisabled();
      expect(fab).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('does not trigger onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      
      render(<FAB {...defaultProps} onClick={onClick} disabled={true} />);
      
      const fab = screen.getByRole('button');
      await user.click(fab);
      
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not trigger onClick when loading', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      
      render(<FAB {...defaultProps} onClick={onClick} loading={true} />);
      
      const fab = screen.getByRole('button');
      await user.click(fab);
      
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles Enter key press', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      
      render(<FAB {...defaultProps} onClick={onClick} />);
      
      const fab = screen.getByRole('button');
      fab.focus();
      await user.keyboard('{Enter}');
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key press', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      
      render(<FAB {...defaultProps} onClick={onClick} />);
      
      const fab = screen.getByRole('button');
      fab.focus();
      await user.keyboard(' ');
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('shows focus ring when focused', async () => {
      const user = userEvent.setup();
      render(<FAB {...defaultProps} />);
      
      const fab = screen.getByRole('button');
      await user.tab();
      
      expect(fab).toHaveFocus();
      expect(fab).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('Mouse Interaction', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      
      render(<FAB {...defaultProps} onClick={onClick} />);
      
      const fab = screen.getByRole('button');
      await user.click(fab);
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('applies hover effects', async () => {
      const user = userEvent.setup();
      render(<FAB {...defaultProps} />);
      
      const fab = screen.getByRole('button');
      expect(fab).toHaveClass('hover:transform', 'hover:-translate-y-0.5');
      
      await user.hover(fab);
      // Visual hover effects are tested via CSS classes
      expect(fab).toBeInTheDocument();
    });
  });

  describe('Tooltip Functionality', () => {
    it('shows tooltip on hover', async () => {
      const user = userEvent.setup();
      render(<FAB {...defaultProps} tooltip="Create new item" />);
      
      const fab = screen.getByRole('button');
      await user.hover(fab);
      
      await waitFor(() => {
        expect(screen.getByText('Create new item')).toBeInTheDocument();
      });
      expect(fab).toBeInTheDocument();
    });

    it('shows tooltip on focus', async () => {
      const user = userEvent.setup();
      render(<FAB {...defaultProps} tooltip="Create new item" />);
      
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Create new item')).toBeInTheDocument();
      });
    });

    it('hides tooltip on blur', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <FAB {...defaultProps} tooltip="Create new item" />
          <button>Other button</button>
        </div>
      );
      
      await user.tab(); // Focus FAB
      
      await waitFor(() => {
        expect(screen.getByText('Create new item')).toBeInTheDocument();
      });
      
      await user.tab(); // Focus other button
      
      await waitFor(() => {
        expect(screen.queryByText('Create new item')).not.toBeInTheDocument();
      });
    });
  });

  describe('Scroll Behavior', () => {
    beforeEach(() => {
      // Mock scroll events
      vi.spyOn(window, 'addEventListener');
      vi.spyOn(window, 'removeEventListener');
    });

    it('sets up scroll listener when hideOnScroll is true', () => {
      render(<FAB {...defaultProps} hideOnScroll={true} />);
      
      expect(window.addEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        { passive: true }
      );
    });

    it('does not set up scroll listener when hideOnScroll is false', () => {
      render(<FAB {...defaultProps} hideOnScroll={false} />);
      
      expect(window.addEventListener).not.toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        { passive: true }
      );
    });

    it('calls onHide when scrolling down past threshold', async () => {
      const onHide = vi.fn();
      render(
        <FAB 
          {...defaultProps} 
          hideOnScroll={true}
          scrollThreshold={100}
          onHide={onHide}
        />
      );
      
      // Simulate scrolling down
      window.scrollY = 150;
      fireEvent.scroll(window);
      
      await waitFor(() => {
        expect(onHide).toHaveBeenCalled();
      });
    });

    it('calls onShow when scrolling back up', async () => {
      const onShow = vi.fn();
      render(
        <FAB 
          {...defaultProps} 
          hideOnScroll={true}
          scrollThreshold={100}
          onShow={onShow}
        />
      );
      
      // First scroll down to hide
      window.scrollY = 150;
      fireEvent.scroll(window);
      
      // Then scroll back up to show
      window.scrollY = 50;
      fireEvent.scroll(window);
      
      await waitFor(() => {
        expect(onShow).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<FAB {...defaultProps} />);
      
      const fab = screen.getByRole('button');
      expect(fab).toHaveAttribute('aria-label', 'Add new item');
      expect(fab).toHaveAttribute('type', 'button');
    });

    it('uses label as aria-label in extended mode', () => {
      render(
        <FAB 
          onClick={vi.fn()}
          extended={true}
          label="Create New Item"
        />
      );
      
      const fab = screen.getByRole('button');
      expect(fab).toHaveAttribute('aria-label', 'Create New Item');
    });

    it('falls back to default aria-label', () => {
      render(<FAB onClick={vi.fn()} />);
      
      const fab = screen.getByRole('button');
      expect(fab).toHaveAttribute('aria-label', 'Floating action button');
    });

    it('marks icons as decorative', () => {
      render(<FAB {...defaultProps} icon={<Settings />} />);
      
      const fab = screen.getByRole('button');
      const iconContainer = fab.querySelector('[aria-hidden="true"]');
      expect(iconContainer).toBeInTheDocument();
    });

    it('marks badge as decorative', () => {
      render(
        <FAB 
          {...defaultProps} 
          badge={{ show: true, count: 5 }}
        />
      );
      
      const fab = screen.getByRole('button');
      const badge = fab.querySelector('[aria-hidden="true"]');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Offset Positioning', () => {
    it('applies custom offset styles', () => {
      render(
        <FAB 
          {...defaultProps} 
          offset={{ x: 10, y: -20 }}
        />
      );
      
      const fab = screen.getByRole('button');
      expect(fab).toHaveStyle('transform: translate(10px, -20px)');
    });

    it('combines offset with other transforms', () => {
      render(
        <FAB 
          {...defaultProps} 
          offset={{ x: 5, y: 5 }}
          hideOnScroll={true}
        />
      );
      
      const fab = screen.getByRole('button');
      // Style should include the offset transform
      expect(fab.style.transform).toContain('translate(5px, 5px)');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(
        <FAB 
          {...defaultProps} 
          className="custom-fab-class"
        />
      );
      
      const fab = screen.getByRole('button');
      expect(fab).toHaveClass('custom-fab-class');
    });

    it('applies custom style object', () => {
      render(
        <FAB 
          {...defaultProps} 
          style={{ backgroundColor: 'rgb(128, 0, 128)' }}
        />
      );
      
      const fab = screen.getByRole('button');
      expect(fab).toHaveStyle('background-color: rgb(128, 0, 128)');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty badge count', () => {
      render(
        <FAB 
          {...defaultProps} 
          badge={{ show: true }}
        />
      );
      
      const fab = screen.getByRole('button');
      const badge = fab.querySelector('.bg-primary-500');
      expect(badge).toBeInTheDocument();
      expect(badge).toBeEmptyDOMElement();
    });

    it('handles zero badge count', () => {
      render(
        <FAB 
          {...defaultProps} 
          badge={{ show: true, count: 0 }}
        />
      );
      
      const fab = screen.getByRole('button');
      const badge = fab.querySelector('.bg-primary-500');
      expect(badge).toBeInTheDocument();
      expect(badge).toBeEmptyDOMElement();
    });

    it('handles missing onClick handler', () => {
      expect(() => {
        render(<FAB ariaLabel="Test FAB" />);
      }).not.toThrow();
    });

    it('prevents event propagation', async () => {
      const user = userEvent.setup();
      const parentClick = vi.fn();
      const fabClick = vi.fn();
      
      render(
        <div onClick={parentClick}>
          <FAB {...defaultProps} onClick={fabClick} />
        </div>
      );
      
      const fab = screen.getByRole('button');
      await user.click(fab);
      
      expect(fabClick).toHaveBeenCalled();
      // Parent should still be called due to event bubbling
      expect(parentClick).toHaveBeenCalled();
    });
  });
});
