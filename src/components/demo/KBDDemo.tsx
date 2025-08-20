import * as React from 'react';
import { KBD, KBDLabels } from '@/components/ui/KBD';

/**
 * KBD Component Demo
 * 
 * Demonstrates the enterprise-grade keyboard key display component
 * with all variants, sizes, and use cases.
 */
export default function KBDDemo() {
  const [pressedKeys, setPressedKeys] = React.useState<Set<string>>(new Set());

  // Simulate key press for demo
  const simulateKeyPress = (key: string) => {
    setPressedKeys(prev => new Set([...prev, key]));
    setTimeout(() => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          KBD Component Demo
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Enterprise-grade keyboard key display with multiple variants and complete theming support
        </p>
      </div>

      {/* Basic Usage */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Basic Usage
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <KBD>A</KBD>
            <p className="text-sm text-slate-600 dark:text-slate-400">Letter Key</p>
          </div>
          <div className="text-center space-y-2">
            <KBD>Enter</KBD>
            <p className="text-sm text-slate-600 dark:text-slate-400">Special Key</p>
          </div>
          <div className="text-center space-y-2">
            <KBD>⌘</KBD>
            <p className="text-sm text-slate-600 dark:text-slate-400">Symbol</p>
          </div>
          <div className="text-center space-y-2">
            <KBD>F1</KBD>
            <p className="text-sm text-slate-600 dark:text-slate-400">Function Key</p>
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Variants
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <span className="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">Default:</span>
            <KBD variant="default">Ctrl</KBD>
            <span className="text-sm text-slate-600 dark:text-slate-400">Standard key appearance with depth</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">Combo:</span>
            <KBD variant="combo">Ctrl+Shift+N</KBD>
            <span className="text-sm text-slate-600 dark:text-slate-400">Key combinations with separators</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">Shortcut:</span>
            <KBD variant="shortcut">⌘K</KBD>
            <span className="text-sm text-slate-600 dark:text-slate-400">Compact shortcut display</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">Pressed:</span>
            <KBD variant="pressed">Space</KBD>
            <span className="text-sm text-slate-600 dark:text-slate-400">Active/pressed state</span>
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Sizes
        </h2>
        <div className="flex items-center gap-6">
          <KBD size="xs">XS</KBD>
          <KBD size="sm">SM</KBD>
          <KBD size="md">MD</KBD>
          <KBD size="lg">LG</KBD>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Interactive Demo
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Click the keys below to see the pressed state animation:
        </p>
        <div className="flex flex-wrap gap-2">
          {['Q', 'W', 'E', 'R', 'T', 'Y'].map(key => (
            <button
              key={key}
              onClick={() => simulateKeyPress(key)}
              className="focus:outline-none"
            >
              <KBD pressed={pressedKeys.has(key)}>{key}</KBD>
            </button>
          ))}
        </div>
      </section>

      {/* Common Shortcuts */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Common Shortcuts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Copy</span>
              <KBD variant="combo">Ctrl+C</KBD>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Paste</span>
              <KBD variant="combo">Ctrl+V</KBD>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Undo</span>
              <KBD variant="combo">Ctrl+Z</KBD>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Select All</span>
              <KBD variant="combo">Ctrl+A</KBD>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Command Palette</span>
              <KBD variant="shortcut">⌘K</KBD>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Quick Search</span>
              <KBD variant="shortcut">⌘P</KBD>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Toggle Theme</span>
              <KBD variant="shortcut">⌘D</KBD>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Close Tab</span>
              <KBD variant="shortcut">⌘W</KBD>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Keys */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Navigation & Special Keys
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">Arrow Keys</h3>
            <div className="flex gap-2">
              <KBD>↑</KBD>
              <KBD>↓</KBD>
              <KBD>←</KBD>
              <KBD>→</KBD>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">Modifier Keys</h3>
            <div className="flex gap-2">
              <KBD>⌘</KBD>
              <KBD>⌥</KBD>
              <KBD>⇧</KBD>
              <KBD>Ctrl</KBD>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3">Special Keys</h3>
            <div className="flex flex-wrap gap-2">
              <KBD>⏎</KBD>
              <KBD>⌫</KBD>
              <KBD>⌦</KBD>
              <KBD>⇥</KBD>
              <KBD>Esc</KBD>
              <KBD>Space</KBD>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Separators */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Custom Separators
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-700 dark:text-slate-300">Default (+):</span>
            <KBD variant="combo">Ctrl+Shift+P</KBD>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-700 dark:text-slate-300">Custom (•):</span>
            <KBD 
              variant="combo" 
              separator={<span className="mx-1 text-slate-400">•</span>}
            >
              Ctrl+Shift+P
            </KBD>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-700 dark:text-slate-300">Custom (→):</span>
            <KBD 
              variant="combo" 
              separator={<span className="mx-1 text-blue-500">→</span>}
            >
              Ctrl+Shift+P
            </KBD>
          </div>
        </div>
      </section>

      {/* Available Key Labels */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Available Key Labels
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          The component includes a comprehensive set of key label mappings:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Modifiers</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <code className="text-slate-600">cmd</code>
                <KBD size="sm">{KBDLabels.cmd}</KBD>
              </div>
              <div className="flex justify-between">
                <code className="text-slate-600">ctrl</code>
                <KBD size="sm">{KBDLabels.ctrl}</KBD>
              </div>
              <div className="flex justify-between">
                <code className="text-slate-600">option</code>
                <KBD size="sm">{KBDLabels.option}</KBD>
              </div>
              <div className="flex justify-between">
                <code className="text-slate-600">shift</code>
                <KBD size="sm">{KBDLabels.shift}</KBD>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Arrows</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <code className="text-slate-600">up</code>
                <KBD size="sm">{KBDLabels.up}</KBD>
              </div>
              <div className="flex justify-between">
                <code className="text-slate-600">down</code>
                <KBD size="sm">{KBDLabels.down}</KBD>
              </div>
              <div className="flex justify-between">
                <code className="text-slate-600">left</code>
                <KBD size="sm">{KBDLabels.left}</KBD>
              </div>
              <div className="flex justify-between">
                <code className="text-slate-600">right</code>
                <KBD size="sm">{KBDLabels.right}</KBD>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Special</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <code className="text-slate-600">enter</code>
                <KBD size="sm">{KBDLabels.enter}</KBD>
              </div>
              <div className="flex justify-between">
                <code className="text-slate-600">backspace</code>
                <KBD size="sm">{KBDLabels.backspace}</KBD>
              </div>
              <div className="flex justify-between">
                <code className="text-slate-600">delete</code>
                <KBD size="sm">{KBDLabels.delete}</KBD>
              </div>
              <div className="flex justify-between">
                <code className="text-slate-600">tab</code>
                <KBD size="sm">{KBDLabels.tab}</KBD>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Function</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <code className="text-slate-600">f1</code>
                <KBD size="sm">{KBDLabels.f1}</KBD>
              </div>
              <div className="flex justify-between">
                <code className="text-slate-600">f5</code>
                <KBD size="sm">{KBDLabels.f5}</KBD>
              </div>
              <div className="flex justify-between">
                <code className="text-slate-600">f10</code>
                <KBD size="sm">{KBDLabels.f10}</KBD>
              </div>
              <div className="flex justify-between">
                <code className="text-slate-600">f12</code>
                <KBD size="sm">{KBDLabels.f12}</KBD>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
          Implementation Examples
        </h2>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Basic Key</h4>
            <code className="block text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded">
              {`<KBD>Enter</KBD>`}
            </code>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Key Combination</h4>
            <code className="block text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded">
              {`<KBD variant="combo">Ctrl+Shift+P</KBD>`}
            </code>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Pressed State</h4>
            <code className="block text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded">
              {`<KBD pressed={isPressed}>Space</KBD>`}
            </code>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Custom Separator</h4>
            <code className="block text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded">
              {`<KBD variant="combo" separator={<span>•</span>}>Cmd+K</KBD>`}
            </code>
          </div>
        </div>
      </section>
    </div>
  );
}
