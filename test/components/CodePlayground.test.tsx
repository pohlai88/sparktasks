/**
 * @fileoverview Comprehensive test suite for CodePlayground component
 * Tests all functionality including code editing, execution, console output,
 * templates, sharing, accessibility, and enterprise-grade features.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodePlayground } from '../../src/components/ui/CodePlayground';

// Mock clipboard API
const mockWriteText = vi.fn().mockResolvedValue(undefined);

// More complete clipboard mock
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
  configurable: true,
});

// Mock postMessage for iframe communication
const mockPostMessage = vi.fn();
Object.defineProperty(window, 'postMessage', {
  value: mockPostMessage,
  writable: true,
});

describe('CodePlayground', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
    mockWriteText.mockClear();
    
    // Ensure clipboard API is properly available
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<CodePlayground />);
      
      expect(screen.getByRole('region', { name: /interactive code playground/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with initial code', () => {
      const initialCode = 'console.log("Hello World");';
      render(<CodePlayground initialCode={initialCode} />);
      
      expect(screen.getByDisplayValue(initialCode)).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<CodePlayground className="custom-class" />);
      
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders with custom aria-label', () => {
      render(<CodePlayground aria-label="Custom code editor" />);
      
      expect(screen.getByRole('region', { name: 'Custom code editor' })).toBeInTheDocument();
    });
  });

  describe('Layout Options', () => {
    it('renders horizontal layout by default', () => {
      render(<CodePlayground />);
      
      const container = screen.getByRole('region');
      expect(container).toHaveClass('flex-row');
    });

    it('renders vertical layout when specified', () => {
      render(<CodePlayground layout="vertical" />);
      
      const container = screen.getByRole('region');
      expect(container).toHaveClass('flex-col');
    });

    it('renders editor-only layout', () => {
      render(<CodePlayground layout="editor-only" />);
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.queryByText('Preview')).not.toBeInTheDocument();
    });

    it('renders preview-only layout', () => {
      render(<CodePlayground layout="preview-only" enablePreview />);
      
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('renders tabs layout for mobile', () => {
      render(<CodePlayground layout="tabs" />);
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /editor/i })).toBeInTheDocument();
    });
  });

  describe('Language Support', () => {
    it('renders with javascript language by default', () => {
      render(<CodePlayground />);
      
      // Find the language selector using test id since combobox role detection might be inconsistent
      const languageSelect = screen.getByTestId('language-selector');
      expect(languageSelect).toBeInTheDocument();
      expect(languageSelect).toHaveValue('javascript');
    });

    it('changes language when selected', async () => {
      const onCodeChange = vi.fn();
      render(<CodePlayground onCodeChange={onCodeChange} />);
      
      // Find the language selector using test id
      const languageSelect = screen.getByTestId('language-selector');
      
      await act(async () => {
        await user.selectOptions(languageSelect, 'typescript');
      });
      
      expect(languageSelect).toHaveValue('typescript');
    });

    it('shows syntax highlighting for different languages', () => {
      render(<CodePlayground language="html" initialCode="<div>Hello</div>" />);
      
      const editor = screen.getByRole('textbox');
      expect(editor).toHaveValue('<div>Hello</div>');
    });

    const languages = ['javascript', 'typescript', 'html', 'css', 'json', 'jsx', 'tsx', 'markdown'];
    
    languages.forEach(lang => {
      it(`supports ${lang} language`, () => {
        render(<CodePlayground language={lang as 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'jsx' | 'tsx' | 'markdown'} />);
        
        // Find the language selector using test id
        const languageSelect = screen.getByTestId('language-selector');
        expect(languageSelect).toBeInTheDocument();
        expect(languageSelect).toHaveValue(lang);
      });
    });
  });

  describe('Code Editing', () => {
    it('allows typing in the editor', async () => {
      const onCodeChange = vi.fn();
      render(<CodePlayground onCodeChange={onCodeChange} />);
      
      const editor = screen.getByRole('textbox');
      
      await act(async () => {
        await user.type(editor, 'console.log("test");');
      });
      
      expect(editor).toHaveValue('console.log("test");');
      expect(onCodeChange).toHaveBeenCalled();
    });

    it('respects readOnly prop', () => {
      render(<CodePlayground readOnly initialCode="const x = 1;" />);
      
      const editor = screen.getByRole('textbox');
      expect(editor).toHaveAttribute('readOnly');
    });

    it('shows line numbers when enabled', () => {
      render(<CodePlayground showLineNumbers />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('hides line numbers when disabled', () => {
      render(<CodePlayground showLineNumbers={false} />);
      
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  describe('Code Execution', () => {
    it('shows run button when not running', () => {
      render(<CodePlayground />);
      
      expect(screen.getByRole('button', { name: /run code/i })).toBeInTheDocument();
    });

    it('executes code when run button is clicked', async () => {
      const onExecute = vi.fn();
      render(<CodePlayground onExecute={onExecute} initialCode="console.log('test');" />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      await user.click(runButton);
      
      await waitFor(() => {
        expect(onExecute).toHaveBeenCalled();
      });
    });

    it('shows loading state while running', async () => {
      render(<CodePlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      fireEvent.click(runButton);
      
      expect(screen.getByText(/running/i)).toBeInTheDocument();
    });

    it('auto-runs code when autoRun is enabled', async () => {
      const onExecute = vi.fn();
      render(<CodePlayground autoRun onExecute={onExecute} autoRunDelay={100} />);
      
      const editor = screen.getByRole('textbox');
      
      await act(async () => {
        await user.type(editor, 'console.log("auto");');
      });
      
      await waitFor(() => {
        expect(onExecute).toHaveBeenCalled();
      }, { timeout: 200 });
    });

    it('respects autoRunDelay', async () => {
      const onExecute = vi.fn();
      render(<CodePlayground autoRun onExecute={onExecute} autoRunDelay={500} />);
      
      const editor = screen.getByRole('textbox');
      
      await act(async () => {
        await user.type(editor, 'test');
      });
      
      // Should not execute immediately
      expect(onExecute).not.toHaveBeenCalled();
      
      // Should execute after delay
      await waitFor(() => {
        expect(onExecute).toHaveBeenCalled();
      }, { timeout: 600 });
    });
  });

  describe('Console Output', () => {
    it('shows console when enabled', () => {
      render(<CodePlayground showConsole />);
      
      expect(screen.getByText('Console')).toBeInTheDocument();
    });

    it('hides console when disabled', () => {
      render(<CodePlayground showConsole={false} />);
      
      expect(screen.queryByText('Console')).not.toBeInTheDocument();
    });

    it('displays console output', async () => {
      render(<CodePlayground showConsole />);
      
      // Simulate console message from iframe
      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: { type: 'console', data: 'Hello from console' }
        });
        
        window.dispatchEvent(messageEvent);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Hello from console')).toBeInTheDocument();
      });
    });

    it('displays error messages', async () => {
      render(<CodePlayground showConsole />);
      
      // Simulate error message from iframe
      await act(async () => {
        const errorEvent = new MessageEvent('message', {
          data: { type: 'error', data: 'Syntax error' }
        });
        
        window.dispatchEvent(errorEvent);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Syntax error')).toBeInTheDocument();
      });
    });

    it('clears console when clear button is clicked', async () => {
      render(<CodePlayground showConsole />);
      
      // Add some console output first
      await act(async () => {
        const messageEvent = new MessageEvent('message', {
          data: { type: 'console', data: 'Test message' }
        });
        window.dispatchEvent(messageEvent);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Test message')).toBeInTheDocument();
      });
      
      const clearButton = screen.getByRole('button', { name: /clear console/i });
      await act(async () => {
        await user.click(clearButton);
      });
      
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
  });

  describe('Templates', () => {
    it('shows template selector when templates are provided', () => {
      const templates = [
        { id: 'hello', name: 'Hello World', code: 'console.log("Hello");', language: 'javascript' as const }
      ];
      render(<CodePlayground templates={templates} />);
      
      expect(screen.getByRole('combobox', { name: /template/i })).toBeInTheDocument();
    });

    it('loads template when selected', async () => {
      const templates = [
        { id: 'hello', name: 'Hello World', code: 'console.log("Hello World");', language: 'javascript' as const }
      ];
      render(<CodePlayground templates={templates} />);
      
      const templateSelect = screen.getByRole('combobox', { name: /template/i });
      
      await act(async () => {
        await user.selectOptions(templateSelect, 'hello');
      });
      
      const editor = screen.getByRole('textbox');
      expect(editor).toHaveValue('console.log("Hello World");');
    });

    it('shows default templates for supported languages', () => {
      render(<CodePlayground language="javascript" />);
      
      const templateSelect = screen.getByRole('combobox', { name: /template/i });
      expect(templateSelect).toBeInTheDocument();
    });
  });

  describe('History and Undo/Redo', () => {
    it('shows undo button', () => {
      render(<CodePlayground />);
      
      expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
    });

    it('shows redo button', () => {
      render(<CodePlayground />);
      
      expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument();
    });

    it('enables undo after making changes', async () => {
      render(<CodePlayground />);
      
      const editor = screen.getByRole('textbox');
      const undoButton = screen.getByRole('button', { name: /undo/i });
      
      // Initially disabled
      expect(undoButton).toBeDisabled();
      
      // Make a change
      await act(async () => {
        await user.type(editor, 'test');
      });
      
      // Should be enabled now
      expect(undoButton).toBeEnabled();
    });

    it('performs undo operation', async () => {
      render(<CodePlayground initialCode="original" />);
      
      const editor = screen.getByRole('textbox');
      const undoButton = screen.getByRole('button', { name: /undo/i });
      
      // Add some text
      await act(async () => {
        await user.type(editor, ' modified');
      });
      expect(editor).toHaveValue('original modified');
      
      // Undo
      await act(async () => {
        await user.click(undoButton);
      });
      expect(editor).toHaveValue('original');
    });

    it('performs redo operation', async () => {
      render(<CodePlayground initialCode="original" />);
      
      const editor = screen.getByRole('textbox');
      const undoButton = screen.getByRole('button', { name: /undo/i });
      const redoButton = screen.getByRole('button', { name: /redo/i });
      
      // Make change and undo
      await act(async () => {
        await user.type(editor, ' modified');
        await user.click(undoButton);
      });
      
      // Redo should be enabled
      expect(redoButton).toBeEnabled();
      
      // Perform redo
      await act(async () => {
        await user.click(redoButton);
      });
      expect(editor).toHaveValue('original modified');
    });
  });

  describe('Sharing', () => {
    it('shows share button when sharing is enabled', () => {
      render(<CodePlayground enableSharing />);
      
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });

    it('hides share button when sharing is disabled', () => {
      render(<CodePlayground enableSharing={false} />);
      
      expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument();
    });

    it('calls onShare when share button is clicked', async () => {
      const onShare = vi.fn();
      render(<CodePlayground enableSharing onShare={onShare} />);
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      await user.click(shareButton);
      
      expect(onShare).toHaveBeenCalled();
    });

    it('shows copy button', () => {
      render(<CodePlayground />);
      
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    });

    it('copies code to clipboard', async () => {
      render(<CodePlayground initialCode="test code" />);
      
      const copyButton = screen.getByRole('button', { name: /copy/i });
      await user.click(copyButton);
      
      // Wait for the async clipboard operation
      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith('test code');
      });
    });

    it('shows copied confirmation', async () => {
      render(<CodePlayground initialCode="test code" />);
      
      const copyButton = screen.getByRole('button', { name: /copy/i });
      await user.click(copyButton);
      
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });
  });

  describe('Fullscreen Mode', () => {
    it('shows fullscreen button when enabled', () => {
      render(<CodePlayground enableFullscreen />);
      
      expect(screen.getByRole('button', { name: /enter fullscreen/i })).toBeInTheDocument();
    });

    it('hides fullscreen button when disabled', () => {
      render(<CodePlayground enableFullscreen={false} />);
      
      expect(screen.queryByRole('button', { name: /fullscreen/i })).not.toBeInTheDocument();
    });

    it('toggles fullscreen mode', async () => {
      render(<CodePlayground enableFullscreen />);
      
      const fullscreenButton = screen.getByRole('button', { name: /enter fullscreen/i });
      
      await act(async () => {
        await user.click(fullscreenButton);
      });
      
      expect(screen.getByRole('button', { name: /exit fullscreen/i })).toBeInTheDocument();
    });

    it('applies fullscreen styles when active', async () => {
      const { container } = render(<CodePlayground enableFullscreen />);
      
      const fullscreenButton = screen.getByRole('button', { name: /enter fullscreen/i });
      
      await act(async () => {
        await user.click(fullscreenButton);
      });
      
      expect(container.firstChild).toHaveClass('fixed', 'inset-0', 'z-50');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA roles', () => {
      render(<CodePlayground />);
      
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('has proper ARIA labels', () => {
      render(<CodePlayground />);
      
      expect(screen.getByRole('textbox')).toHaveAccessibleName(/code editor/i);
      expect(screen.getByRole('button', { name: /run code/i })).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      render(<CodePlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      
      await act(async () => {
        runButton.focus();
      });
      
      expect(runButton).toHaveFocus();
      
      // Tab to next control
      await act(async () => {
        await user.tab();
      });
      expect(screen.getByRole('button', { name: /copy/i })).toHaveFocus();
    });

    it('has proper tab indices', () => {
      render(<CodePlayground />);
      
      const editor = screen.getByRole('textbox');
      expect(editor).toHaveAttribute('tabIndex', '0');
    });

    it('announces state changes to screen readers', async () => {
      render(<CodePlayground />);
      
      const runButton = screen.getByRole('button', { name: /run code/i });
      
      await act(async () => {
        fireEvent.click(runButton);
      });
      
      // Should have loading state announced
      expect(screen.getByText(/running/i)).toBeInTheDocument();
    });
  });

  describe('Preview Functionality', () => {
    it('shows preview when enabled', () => {
      render(<CodePlayground enablePreview />);
      
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('hides preview when disabled', () => {
      render(<CodePlayground enablePreview={false} />);
      
      expect(screen.queryByText('Preview')).not.toBeInTheDocument();
    });

    it('renders iframe for preview', () => {
      render(<CodePlayground enablePreview />);
      
      const iframe = screen.getByTitle(/code preview/i);
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('sandbox');
    });

    it('applies custom preview styles', () => {
      const customStyles = 'body { background: red; }';
      render(<CodePlayground enablePreview previewStyles={customStyles} />);
      
      const iframe = screen.getByTitle(/code preview/i);
      expect(iframe).toBeInTheDocument();
    });

    it('includes external libraries in preview', () => {
      const libraries = ['https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'];
      render(<CodePlayground enablePreview externalLibraries={libraries} />);
      
      const iframe = screen.getByTitle(/code preview/i);
      expect(iframe).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays syntax errors', async () => {
      const onError = vi.fn();
      render(<CodePlayground onError={onError} />);
      
      // Simulate syntax error
      await act(async () => {
        const errorEvent = new MessageEvent('message', {
          data: { type: 'error', data: 'Unexpected token' }
        });
        
        window.dispatchEvent(errorEvent);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Unexpected token')).toBeInTheDocument();
      });
    });

    it('calls onError callback', async () => {
      const onError = vi.fn();
      render(<CodePlayground onError={onError} />);
      
      // Simulate error during execution
      await act(async () => {
        const errorEvent = new MessageEvent('message', {
          data: { type: 'error', data: 'Runtime error' }
        });
        
        window.dispatchEvent(errorEvent);
      });
      
      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });

    it('handles clipboard copy failures gracefully', async () => {
      // Mock clipboard failure
      navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
      
      render(<CodePlayground />);
      
      const copyButton = screen.getByRole('button', { name: /copy/i });
      await user.click(copyButton);
      
      // Should not throw or show error to user
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('switches to tabs layout on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640,
      });
      
      render(<CodePlayground layout="tabs" />);
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('shows mobile-specific controls', () => {
      render(<CodePlayground layout="tabs" />);
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('debounces auto-run execution', async () => {
      const onExecute = vi.fn();
      render(<CodePlayground autoRun onExecute={onExecute} autoRunDelay={100} />);
      
      const editor = screen.getByRole('textbox');
      
      // Type multiple characters quickly
      await act(async () => {
        await user.type(editor, 'abc');
      });
      
      // Should only execute once after delay
      await waitFor(() => {
        expect(onExecute).toHaveBeenCalledTimes(1);
      }, { timeout: 200 });
    });

    it('cancels previous auto-run when typing continues', async () => {
      const onExecute = vi.fn();
      render(<CodePlayground autoRun onExecute={onExecute} autoRunDelay={150} />);
      
      const editor = screen.getByRole('textbox');
      
      // Start typing 'a' and immediately continue with 'b'
      await act(async () => {
        await user.type(editor, 'ab'); // Type both characters quickly
      });
      
      // Wait for the auto-run delay to complete
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Should only execute once for the final state 'ab'
      expect(onExecute).toHaveBeenCalledTimes(1);
      // The onExecute receives an ExecutionResult with output and logs
      expect(onExecute).toHaveBeenCalledWith(
        expect.objectContaining({
          output: expect.any(String),
          logs: expect.any(Array)
        })
      );
    });
  });

  describe('Toolbar Visibility', () => {
    it('shows toolbar by default', () => {
      render(<CodePlayground />);
      
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('hides toolbar when disabled', () => {
      render(<CodePlayground showToolbar={false} />);
      
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    });

    it('shows all toolbar controls when enabled', () => {
      render(<CodePlayground showToolbar />);
      
      expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument();
    });
  });
});

/**
 * Integration tests for complex scenarios
 */
describe('CodePlayground Integration', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  it('complete workflow: edit, run, share', async () => {
    const onExecute = vi.fn();
    const onShare = vi.fn();
    
    render(
      <CodePlayground 
        onExecute={onExecute}
        onShare={onShare}
        enableSharing
        showConsole
      />
    );
    
    // 1. Edit code
    const editor = screen.getByRole('textbox');
    
    await act(async () => {
      await user.type(editor, 'console.log("Hello World");');
    });
    
    // 2. Run code
    const runButton = screen.getByRole('button', { name: /run/i });
    
    await act(async () => {
      await user.click(runButton);
    });
    
    await waitFor(() => {
      expect(onExecute).toHaveBeenCalled();
    });
    
    // 3. Share code
    const shareButton = screen.getByRole('button', { name: /share/i });
    
    await act(async () => {
      await user.click(shareButton);
    });
    
    expect(onShare).toHaveBeenCalledWith(expect.objectContaining({
      code: 'console.log("Hello World");',
      language: 'javascript'
    }));
  });

  it('template selection and execution', async () => {
    const templates = [
      { 
        id: 'react', 
        name: 'React Component', 
        code: 'function App() { return <div>Hello React</div>; }',
        language: 'jsx' as const
      }
    ];
    
    const onExecute = vi.fn();
    
    render(
      <CodePlayground 
        templates={templates}
        language="jsx"
        onExecute={onExecute}
        autoRun
        autoRunDelay={50}
      />
    );
    
    // Select template
    const templateSelect = screen.getByRole('combobox', { name: /template/i });
    
    await act(async () => {
      await user.selectOptions(templateSelect, 'react');
    });
    
    // Should auto-run
    await waitFor(() => {
      expect(onExecute).toHaveBeenCalled();
    }, { timeout: 100 });
    
    // Check code was loaded
    const editor = screen.getByRole('textbox');
    expect(editor).toHaveValue('function App() { return <div>Hello React</div>; }');
  });

  it('fullscreen mode with execution', async () => {
    render(<CodePlayground enableFullscreen />);
    
    // Enter fullscreen
    const fullscreenButton = screen.getByRole('button', { name: /enter fullscreen/i });
    
    await act(async () => {
      await user.click(fullscreenButton);
    });
    
    // Verify fullscreen state
    expect(screen.getByRole('button', { name: /exit fullscreen/i })).toBeInTheDocument();
    
    // Can still execute code in fullscreen
    const editor = screen.getByRole('textbox');
    
    await act(async () => {
      await user.type(editor, 'console.log("fullscreen");');
    });
    
    const runButton = screen.getByRole('button', { name: /run/i });
    
    await act(async () => {
      await user.click(runButton);
    });
    
    // Should show running state
    expect(screen.getByText(/running/i)).toBeInTheDocument();
  });

  it('handles language switching with code preservation', async () => {
    render(<CodePlayground />);
    
    // Add some code
    const editor = screen.getByRole('textbox');
    
    await act(async () => {
      await user.type(editor, 'const x = 1;');
    });
    
    // Switch language
    const languageSelect = screen.getByRole('combobox', { name: /language/i });
    
    await act(async () => {
      await user.selectOptions(languageSelect, 'typescript');
    });
    
    // Code should be preserved
    expect(editor).toHaveValue('const x = 1;');
    expect(languageSelect).toHaveValue('typescript');
  });
});
