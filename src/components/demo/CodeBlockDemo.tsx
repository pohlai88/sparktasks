import * as React from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

/**
 * CodeBlockDemo: Comprehensive showcase of the CodeBlock component
 * 
 * Demonstrates all variants, features, and use cases for the enterprise-grade
 * code syntax display component with DESIGN_TOKENS integration.
 */
export function CodeBlockDemo() {
  const [selectedTab, setSelectedTab] = React.useState<'basic' | 'advanced' | 'interactive'>('basic');

  // Sample code snippets for demonstrations
  const codeExamples = {
    typescript: `interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  ...props
}) => {
  const buttonClasses = combineTokens(
    DESIGN_TOKENS.recipe.button.base,
    DESIGN_TOKENS.recipe.button[variant],
    DESIGN_TOKENS.recipe.button[size],
    disabled && DESIGN_TOKENS.semantic.state.disabled
  );

  return (
    <button 
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};`,

    python: `def calculate_fibonacci(n: int) -> int:
    """Calculate the nth Fibonacci number using dynamic programming."""
    if n <= 1:
        return n
    
    # Use dynamic programming for efficiency
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]

# Example usage
result = calculate_fibonacci(10)
print(f"The 10th Fibonacci number is: {result}")`,

    bash: `#!/bin/bash

# Deploy application script
set -e

echo "Starting deployment process..."

# Build the application
npm run build

# Run tests
npm test

# Deploy to production
if [ "$NODE_ENV" = "production" ]; then
    echo "Deploying to production..."
    docker build -t my-app:latest .
    docker push registry.example.com/my-app:latest
    kubectl apply -f k8s/deployment.yaml
else
    echo "Deploying to staging..."
    docker-compose up -d
fi

echo "Deployment completed successfully!"`,

    json: `{
  "name": "@sparktasks/ui",
  "version": "1.0.0",
  "description": "Enterprise-grade UI component library",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "vite build",
    "test": "vitest",
    "lint": "eslint src --ext .ts,.tsx",
    "storybook": "storybook dev -p 6006"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^4.0.0"
  }
}`,

    diff: `- import { Button } from './old-button';
+ import { Button } from '@/components/ui/Button';

  function App() {
    return (
      <div className="app">
-       <Button type="submit" variant="primary">
+       <Button variant="primary" size="lg">
          Submit Form
        </Button>
      </div>
    );
  }`,
  };

  const TabButton = ({ 
    label, 
    isActive, 
    onClick 
  }: { 
    label: string; 
    isActive: boolean; 
    onClick: () => void; 
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={combineTokens(
        'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        isActive
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
      )}
    >
      {label}
    </button>
  );

  return (
    <div className={combineTokens('max-w-6xl mx-auto p-8', 'space-y-12')}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h1,
          'text-slate-900 dark:text-slate-100'
        )}>
          CodeBlock Component
        </h1>
        <p className={combineTokens(
          DESIGN_TOKENS.typography.body.large,
          'text-slate-600 dark:text-slate-400 max-w-3xl mx-auto'
        )}>
          Enterprise-grade code syntax display with copy functionality, line numbers, 
          collapsible sections, multiple variants, and full accessibility support.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        <TabButton
          label="Basic Examples"
          isActive={selectedTab === 'basic'}
          onClick={() => setSelectedTab('basic')}
        />
        <TabButton
          label="Advanced Features"
          isActive={selectedTab === 'advanced'}
          onClick={() => setSelectedTab('advanced')}
        />
        <TabButton
          label="Interactive Demo"
          isActive={selectedTab === 'interactive'}
          onClick={() => setSelectedTab('interactive')}
        />
      </div>

      {/* Basic Examples Tab */}
      {selectedTab === 'basic' && (
        <div className="space-y-8">
          <section>
            <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h2, 'mb-6')}>
              Language Support
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, 'mb-3')}>
                  TypeScript/React
                </h3>
                <CodeBlock
                  language="tsx"
                  filename="Button.tsx"
                  showLineNumbers
                  copyable
                  size="sm"
                >
                  {codeExamples.typescript}
                </CodeBlock>
              </div>

              <div>
                <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, 'mb-3')}>
                  Python
                </h3>
                <CodeBlock
                  language="py"
                  filename="fibonacci.py"
                  showLineNumbers
                  copyable
                  highlightLines={[8, 9, 10]}
                  size="sm"
                >
                  {codeExamples.python}
                </CodeBlock>
              </div>
            </div>
          </section>

          <section>
            <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h2, 'mb-6')}>
              Variants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, 'mb-3')}>
                  Default Theme
                </h3>
                <CodeBlock language="js" copyable>
                  {`const greeting = "Hello, World!";\nconsole.log(greeting);`}
                </CodeBlock>
              </div>

              <div>
                <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, 'mb-3')}>
                  Minimal Theme
                </h3>
                <CodeBlock variant="minimal" language="js" copyable>
                  {`const greeting = "Hello, World!";\nconsole.log(greeting);`}
                </CodeBlock>
              </div>

              <div>
                <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, 'mb-3')}>
                  Terminal Theme
                </h3>
                <CodeBlock variant="terminal" copyable>
                  npm install @sparktasks/ui
                </CodeBlock>
              </div>

              <div>
                <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, 'mb-3')}>
                  Diff View
                </h3>
                <CodeBlock variant="diff" language="tsx" copyable>
                  {codeExamples.diff}
                </CodeBlock>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Advanced Features Tab */}
      {selectedTab === 'advanced' && (
        <div className="space-y-8">
          <section>
            <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h2, 'mb-6')}>
              Line Numbers & Highlighting
            </h2>
            <CodeBlock
              language="bash"
              filename="deploy.sh"
              showLineNumbers
              startLineNumber={15}
              highlightLines={[18, 22, 27]}
              copyable
              maxHeight="400px"
            >
              {codeExamples.bash}
            </CodeBlock>
          </section>

          <section>
            <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h2, 'mb-6')}>
              Collapsible Content
            </h2>
            <div className="space-y-4">
              <CodeBlock
                language="json"
                filename="package.json"
                collapsible
                copyable
                size="sm"
              >
                {codeExamples.json}
              </CodeBlock>

              <CodeBlock
                language="tsx"
                filename="LargeComponent.tsx"
                collapsible
                collapsed
                copyable
                showLineNumbers
                size="sm"
              >
                {codeExamples.typescript}
              </CodeBlock>
            </div>
          </section>

          <section>
            <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h2, 'mb-6')}>
              Size Variations
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h4, 'mb-2')}>
                  Small (sm)
                </h3>
                <CodeBlock size="sm" language="js" copyable>
                  {`const small = "Compact code display";`}
                </CodeBlock>
              </div>

              <div>
                <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h4, 'mb-2')}>
                  Medium (md) - Default
                </h3>
                <CodeBlock size="md" language="js" copyable>
                  {`const medium = "Standard code display";`}
                </CodeBlock>
              </div>

              <div>
                <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h4, 'mb-2')}>
                  Large (lg)
                </h3>
                <CodeBlock size="lg" language="js" copyable>
                  {`const large = "Spacious code display";`}
                </CodeBlock>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Interactive Demo Tab */}
      {selectedTab === 'interactive' && (
        <div className="space-y-8">
          <section>
            <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h2, 'mb-6')}>
              Live Configuration Demo
            </h2>
            <InteractiveCodeBlockDemo />
          </section>

          <section>
            <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h2, 'mb-6')}>
              Accessibility Features
            </h2>
            <div className="space-y-6">
              <div className={combineTokens(
                'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700',
                'rounded-lg p-6'
              )}>
                <h3 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, 'mb-3')}>
                  Keyboard Navigation
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">Tab</kbd> - Navigate to interactive elements</li>
                  <li>• <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">Enter</kbd> or <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">Space</kbd> - Activate copy/collapse buttons</li>
                  <li>• Screen readers announce code language, line count, and available actions</li>
                  <li>• Motion-reduced animations respect prefers-reduced-motion</li>
                </ul>
              </div>

              <CodeBlock
                language="tsx"
                aria-label="Accessibility example showing WCAG 2.1 AA compliant code block"
                copyable
                collapsible
                showLineNumbers
              >
                {`// WCAG 2.1 AA Compliant Component
<CodeBlock
  language="tsx"
  aria-label="Custom accessible description"
  copyable
  collapsible
  showLineNumbers
  highlightLines={[3, 7]}
>
  {codeContent}
</CodeBlock>`}
              </CodeBlock>
            </div>
          </section>
        </div>
      )}

      {/* Usage Instructions */}
      <section className={combineTokens(
        'bg-slate-50 dark:bg-slate-800 rounded-lg p-6',
        'border border-slate-200 dark:border-slate-700'
      )}>
        <h2 className={combineTokens(DESIGN_TOKENS.typography.heading.h3, 'mb-4')}>
          Usage Examples
        </h2>
        <div className="space-y-4">
          <CodeBlock language="tsx" copyable size="sm">
            {`// Basic usage
<CodeBlock language="tsx">
  {\`const hello = "world";\`}
</CodeBlock>

// Advanced usage
<CodeBlock
  language="tsx"
  filename="Button.tsx"
  showLineNumbers
  highlightLines={[5, 10]}
  copyable
  collapsible
  maxHeight="300px"
  variant="minimal"
  size="sm"
>
  {componentCode}
</CodeBlock>`}
          </CodeBlock>
        </div>
      </section>
    </div>
  );
}

/**
 * Interactive demo component with live configuration
 */
function InteractiveCodeBlockDemo() {
  const [config, setConfig] = React.useState({
    variant: 'default' as const,
    size: 'md' as const,
    language: 'tsx' as const,
    showLineNumbers: true,
    copyable: true,
    collapsible: false,
    collapsed: false,
  });

  const sampleCode = `function ExampleComponent({ title, items }) {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div className="example-component">
      <h2>{title}</h2>
      {isVisible && (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'} Items
      </button>
    </div>
  );
}`;

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className={combineTokens(
        'grid grid-cols-2 md:grid-cols-4 gap-4 p-4',
        'bg-slate-100 dark:bg-slate-800 rounded-lg'
      )}>
        <div>
          <label className="block text-sm font-medium mb-2">Variant</label>
          <select
            value={config.variant}
            onChange={(e) => setConfig({ ...config, variant: e.target.value as any })}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="default">Default</option>
            <option value="minimal">Minimal</option>
            <option value="terminal">Terminal</option>
            <option value="diff">Diff</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <select
            value={config.size}
            onChange={(e) => setConfig({ ...config, size: e.target.value as any })}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={config.language}
            onChange={(e) => setConfig({ ...config, language: e.target.value as any })}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="tsx">TypeScript React</option>
            <option value="js">JavaScript</option>
            <option value="py">Python</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.showLineNumbers}
              onChange={(e) => setConfig({ ...config, showLineNumbers: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Line Numbers</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.copyable}
              onChange={(e) => setConfig({ ...config, copyable: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Copyable</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.collapsible}
              onChange={(e) => setConfig({ ...config, collapsible: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Collapsible</span>
          </label>
        </div>
      </div>

      {/* Live Preview */}
      <CodeBlock
        variant={config.variant}
        size={config.size}
        language={config.language}
        filename="ExampleComponent.tsx"
        showLineNumbers={config.showLineNumbers}
        copyable={config.copyable}
        collapsible={config.collapsible}
        collapsed={config.collapsed}
        highlightLines={[2, 6, 11]}
      >
        {sampleCode}
      </CodeBlock>
    </div>
  );
}

export default CodeBlockDemo;
