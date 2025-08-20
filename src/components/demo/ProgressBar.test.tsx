import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar, useProgressBar } from '@/components/ui/ProgressBar';
import { renderHook, act } from '@testing-library/react';

// ===== PROGRESS BAR COMPONENT TESTS =====

describe('ProgressBar Component', () => {
  it('renders basic progress bar', () => {
    render(<ProgressBar value={50} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders with label and description', () => {
    render(
      <ProgressBar
        value={75}
        label="Upload Progress"
        description="Uploading files..."
        showPercentage
      />
    );
    
    expect(screen.getByText('Upload Progress')).toBeInTheDocument();
    expect(screen.getByText('Uploading files...')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('handles different variants', () => {
    render(<ProgressBar value={60} variant="success" />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('data-variant', 'success');
  });

  it('handles different sizes', () => {
    render(<ProgressBar value={40} size="lg" />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('data-size', 'lg');
  });

  it('renders indeterminate state correctly', () => {
    render(<ProgressBar indeterminate label="Loading..." />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('data-indeterminate', 'true');
    expect(progressBar).not.toHaveAttribute('aria-valuenow');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows custom formatted values', () => {
    render(
      <ProgressBar
        value={1250}
        max={2000}
        showValue
        formatValue={(value, max) => `${value}MB / ${max}MB`}
      />
    );
    
    expect(screen.getByText('1250MB / 2000MB')).toBeInTheDocument();
  });

  it('handles edge cases', () => {
    // Test negative value (should be normalized to 0)
    render(<ProgressBar value={-10} showPercentage />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    
    // Test value exceeding max (should be normalized to max)
    render(<ProgressBar value={150} max={100} showPercentage />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders with metadata', () => {
    const metadata = { taskId: 'task-123', userId: 'user-456' };
    render(<ProgressBar value={30} metadata={metadata} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('data-metadata', JSON.stringify(metadata));
  });
});

// ===== PROGRESS BAR HOOK TESTS =====

describe('useProgressBar Hook', () => {
  it('initializes with correct values', () => {
    const { result } = renderHook(() => 
      useProgressBar({ initialValue: 25, max: 100 })
    );
    
    expect(result.current.value).toBe(25);
    expect(result.current.percentage).toBe(25);
    expect(result.current.isComplete).toBe(false);
  });

  it('increments and decrements correctly', () => {
    const { result } = renderHook(() => 
      useProgressBar({ initialValue: 50, step: 10 })
    );
    
    act(() => {
      result.current.increment();
    });
    expect(result.current.value).toBe(60);
    
    act(() => {
      result.current.decrement();
    });
    expect(result.current.value).toBe(50);
  });

  it('handles completion', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => 
      useProgressBar({ initialValue: 95, onComplete })
    );
    
    act(() => {
      result.current.increment(10);
    });
    
    expect(result.current.value).toBe(100);
    expect(result.current.isComplete).toBe(true);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('resets correctly', () => {
    const { result } = renderHook(() => 
      useProgressBar({ initialValue: 20 })
    );
    
    act(() => {
      result.current.setProgress(80);
    });
    expect(result.current.value).toBe(80);
    
    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toBe(20);
  });

  it('handles auto-increment', async () => {
    vi.useFakeTimers();
    
    const { result } = renderHook(() => 
      useProgressBar({ 
        initialValue: 0, 
        autoIncrement: 100, 
        step: 10,
        max: 50
      })
    );
    
    expect(result.current.value).toBe(0);
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(result.current.value).toBe(30);
    
    vi.useRealTimers();
  });

  it('calls onChange callback', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => 
      useProgressBar({ initialValue: 0, onChange })
    );
    
    act(() => {
      result.current.setProgress(75);
    });
    
    expect(onChange).toHaveBeenCalledWith(75, 75);
  });

  it('respects max value constraints', () => {
    const { result } = renderHook(() => 
      useProgressBar({ initialValue: 0, max: 50 })
    );
    
    act(() => {
      result.current.setProgress(100);
    });
    
    expect(result.current.value).toBe(50);
    expect(result.current.percentage).toBe(100);
  });
});

// ===== ACCESSIBILITY TESTS =====

describe('ProgressBar Accessibility', () => {
  it('has proper ARIA attributes', () => {
    render(
      <ProgressBar
        value={60}
        label="File Upload"
        description="Uploading your files"
        aria-label="Upload progress indicator"
      />
    );
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '60');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(progressBar).toHaveAttribute('aria-label', 'Upload progress indicator');
  });

  it('associates labels correctly', () => {
    render(
      <ProgressBar
        value={45}
        label="Download Progress"
        description="Files are being downloaded"
      />
    );
    
    const progressBar = screen.getByRole('progressbar');
    const label = screen.getByText('Download Progress');
    const description = screen.getByText('Files are being downloaded');
    
    expect(progressBar).toHaveAttribute('aria-labelledby', label.id);
    expect(progressBar).toHaveAttribute('aria-describedby', description.id);
  });

  it('handles indeterminate state accessibility', () => {
    render(<ProgressBar indeterminate label="Processing..." />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).not.toHaveAttribute('aria-valuenow');
    expect(progressBar).toHaveAttribute('data-indeterminate', 'true');
  });
});

// ===== INTEGRATION TESTS =====

describe('ProgressBar Integration', () => {
  it('works with all variants and sizes', () => {
    const variants = ['primary', 'success', 'warning', 'error', 'info'] as const;
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    
    variants.forEach(variant => {
      sizes.forEach(size => {
        const { unmount } = render(
          <ProgressBar
            value={50}
            variant={variant}
            size={size}
            label={`${variant} ${size} progress`}
          />
        );
        
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('data-variant', variant);
        expect(progressBar).toHaveAttribute('data-size', size);
        
        // Clean up for next iteration
        unmount();
      });
    });
  });

  it('handles real-world usage patterns', () => {
    // Simulate file upload scenario
    render(
      <ProgressBar
        value={67}
        variant="primary"
        size="md"
        label="Uploading document.pdf"
        description="2.3 MB of 3.4 MB uploaded"
        showPercentage
        announceProgress
        priority="normal"
        formatValue={(value) => `${(value * 34 / 100).toFixed(1)} MB`}
        metadata={{
          fileId: 'file-123',
          uploadSession: 'session-456',
          startTime: Date.now()
        }}
      />
    );
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
    expect(screen.getByText('Uploading document.pdf')).toBeInTheDocument();
    expect(screen.getByText('2.3 MB of 3.4 MB uploaded')).toBeInTheDocument();
  });
});
