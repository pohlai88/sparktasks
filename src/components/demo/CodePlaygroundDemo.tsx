/**
 * @fileoverview Interactive demo showcase for CodePlayground component
 * Demonstrates all features and capabilities with live examples
 * and comprehensive configuration options.
 */

import { useState, useCallback } from 'react';
import { CodePlayground, type CodePlaygroundProps, type ExecutionResult } from './CodePlayground';

// Demo templates for different languages and use cases
const DEMO_TEMPLATES = [
  {
    id: 'js-hello',
    name: 'JavaScript Hello World',
    language: 'javascript' as const,
    code: `// Welcome to the CodePlayground!
console.log('Hello, World!');

// Try interactive features:
// - Edit this code
// - Click Run to execute
// - View console output
// - Use Undo/Redo
// - Copy or share your code

const greeting = 'CodePlayground';
console.log(\`Welcome to \${greeting}!\`);

// Math example
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log(\`Sum: \${sum}\`);`
  },
  {
    id: 'ts-advanced',
    name: 'TypeScript Advanced',
    language: 'typescript' as const,
    code: `// TypeScript with advanced features
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

class UserManager {
  private users: User[] = [];
  
  addUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: this.users.length + 1
    };
    this.users.push(newUser);
    console.log('User added:', newUser);
    return newUser;
  }
  
  getUsersByRole(role: User['role']): User[] {
    return this.users.filter(user => user.role === role);
  }
}

// Usage example
const manager = new UserManager();
manager.addUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
});

console.log('Admin users:', manager.getUsersByRole('admin'));`
  },
  {
    id: 'react-component',
    name: 'React Component',
    language: 'jsx' as const,
    code: `// Interactive React Component
function TodoApp() {
  const [todos, setTodos] = React.useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build awesome apps', completed: false }
  ]);
  const [newTodo, setNewTodo] = React.useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Todo App</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo..."
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px' }}>
          Add Todo
        </button>
      </div>
      <ul style={{ marginTop: '20px' }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              cursor: 'pointer',
              textDecoration: todo.completed ? 'line-through' : 'none',
              margin: '8px 0'
            }}
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Render the component
ReactDOM.render(<TodoApp />, document.getElementById('root'));`
  },
  {
    id: 'html-interactive',
    name: 'Interactive HTML/CSS',
    language: 'html' as const,
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Demo</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      text-align: center;
      transform: scale(1);
      transition: transform 0.3s ease;
    }
    
    .card:hover {
      transform: scale(1.05);
    }
    
    .button {
      background: #4F46E5;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      margin: 10px;
      transition: background 0.3s ease;
    }
    
    .button:hover {
      background: #3730A3;
    }
    
    .counter {
      font-size: 2rem;
      font-weight: bold;
      color: #374151;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Interactive Counter</h1>
    <div class="counter" id="counter">0</div>
    <button class="button" onclick="increment()">+</button>
    <button class="button" onclick="decrement()">-</button>
    <button class="button" onclick="reset()">Reset</button>
  </div>

  <script>
    let count = 0;
    const counterElement = document.getElementById('counter');
    
    function updateDisplay() {
      counterElement.textContent = count;
      counterElement.style.color = count > 0 ? '#059669' : count < 0 ? '#DC2626' : '#374151';
    }
    
    function increment() {
      count++;
      updateDisplay();
    }
    
    function decrement() {
      count--;
      updateDisplay();
    }
    
    function reset() {
      count = 0;
      updateDisplay();
    }
  </script>
</body>
</html>`
  },
  {
    id: 'css-animations',
    name: 'CSS Animations',
    language: 'css' as const,
    code: `/* Modern CSS with animations */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --background: #0f172a;
  --surface: #1e293b;
  --text: #f1f5f9;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--background);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.container {
  text-align: center;
  position: relative;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  animation: fadeInUp 1s ease-out;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.card {
  background: var(--surface);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: slideIn 0.8s ease-out var(--delay, 0s) both;
}

.card:nth-child(1) { --delay: 0.1s; }
.card:nth-child(2) { --delay: 0.2s; }
.card:nth-child(3) { --delay: 0.3s; }

.card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
  border-color: var(--primary);
}

.card-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  border-radius: 12px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  animation: pulse 2s infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.floating-element {
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--primary);
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s infinite linear;
}

.floating-element:nth-child(1) { left: 10%; animation-delay: 0s; }
.floating-element:nth-child(2) { left: 20%; animation-delay: 1s; }
.floating-element:nth-child(3) { left: 30%; animation-delay: 2s; }
.floating-element:nth-child(4) { left: 40%; animation-delay: 3s; }
.floating-element:nth-child(5) { left: 50%; animation-delay: 4s; }

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
  }
  100% {
    transform: translateY(-20px) rotate(360deg);
  }
}`
  },
  {
    id: 'json-data',
    name: 'JSON Data Structure',
    language: 'json' as const,
    code: `{
  "project": {
    "name": "CodePlayground Demo",
    "version": "1.0.0",
    "description": "Interactive code editor with live preview",
    "features": [
      "Syntax highlighting",
      "Live code execution",
      "Multiple language support",
      "Console output",
      "Code sharing",
      "Template system",
      "Undo/Redo functionality",
      "Fullscreen mode"
    ],
    "languages": {
      "supported": [
        "JavaScript",
        "TypeScript", 
        "React JSX",
        "HTML",
        "CSS",
        "JSON",
        "Markdown"
      ],
      "execution": [
        "javascript",
        "typescript",
        "jsx",
        "html",
        "css"
      ]
    },
    "configuration": {
      "themes": ["light", "dark", "auto"],
      "layouts": ["horizontal", "vertical", "tabs", "editor-only", "preview-only"],
      "autoRun": {
        "enabled": true,
        "delayMs": 1000
      },
      "accessibility": {
        "wcag": "2.1 AA",
        "screenReader": true,
        "keyboardNavigation": true,
        "highContrast": true
      }
    },
    "examples": {
      "basicUsage": "Simple code editing and execution",
      "reactComponents": "Interactive React component development",
      "htmlPages": "Complete HTML page with styling",
      "dataVisualization": "Dynamic charts and graphs",
      "algorithms": "Algorithm implementation and testing"
    },
    "integration": {
      "frameworks": ["React", "Vue", "Angular", "Svelte"],
      "bundlers": ["Vite", "Webpack", "Rollup"],
      "testing": ["Vitest", "Jest", "Cypress"]
    }
  },
  "metadata": {
    "created": "2024-01-15T10:30:00Z",
    "lastModified": "2024-01-15T15:45:00Z",
    "tags": ["editor", "playground", "interactive", "education"],
    "license": "MIT"
  }
}`
  }
];

interface DemoConfig {
  layout: CodePlaygroundProps['layout'];
  theme: 'light' | 'dark' | 'auto';
  showToolbar: boolean;
  showLineNumbers: boolean;
  enablePreview: boolean;
  showConsole: boolean;
  autoRun: boolean;
  autoRunDelay: number;
  enableSharing: boolean;
  enableFullscreen: boolean;
}

/**
 * CodePlaygroundDemo: Interactive showcase component
 * Demonstrates all CodePlayground features with live configuration
 */
export function CodePlaygroundDemo() {
  const [selectedTemplate, setSelectedTemplate] = useState(DEMO_TEMPLATES[0]);
  const [code, setCode] = useState(selectedTemplate.code);
  const [language, setLanguage] = useState(selectedTemplate.language);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [shareData, setShareData] = useState<object | null>(null);
  
  const [config, setConfig] = useState<DemoConfig>({
    layout: 'horizontal',
    theme: 'auto',
    showToolbar: true,
    showLineNumbers: true,
    enablePreview: true,
    showConsole: true,
    autoRun: false,
    autoRunDelay: 1000,
    enableSharing: true,
    enableFullscreen: true
  });

  // Handle template selection
  const handleTemplateChange = useCallback((templateId: string) => {
    const template = DEMO_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCode(template.code);
      setLanguage(template.language);
    }
  }, []);

  // Handle code changes
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  // Handle code execution
  const handleExecute = useCallback((result: ExecutionResult) => {
    setExecutionResult(result);
  }, []);

  // Handle code sharing
  const handleShare = useCallback((code: string, language: string) => {
    const shareData = { code, language, timestamp: Date.now() };
    setShareData(shareData);
    // In a real app, this would open a share dialog or copy URL
  }, []);

  // Handle configuration changes
  const updateConfig = useCallback((key: keyof DemoConfig, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div 
      className="flex min-h-screen flex-col bg-slate-50 p-6"
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          CodePlayground Demo
        </h1>
        <p className="text-lg text-slate-600">
          Interactive code editor with live preview and execution
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Configuration
        </h2>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Template Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Template
            </label>
            <select
              value={selectedTemplate.id}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
            >
              {DEMO_TEMPLATES.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Layout */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Layout
            </label>
            <select
              value={config.layout}
              onChange={(e) => updateConfig('layout', e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="tabs">Tabs</option>
              <option value="editor-only">Editor Only</option>
              <option value="preview-only">Preview Only</option>
            </select>
          </div>

          {/* Auto Run Delay */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Auto Run Delay (ms)
            </label>
            <input
              type="number"
              value={config.autoRunDelay}
              onChange={(e) => updateConfig('autoRunDelay', parseInt(e.target.value))}
              min="100"
              max="5000"
              step="100"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
            />
          </div>

          {/* Feature Toggles */}
          <div className="space-y-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Features
            </label>
            
            {Object.entries({
              showToolbar: 'Show Toolbar',
              showLineNumbers: 'Line Numbers',
              enablePreview: 'Enable Preview',
              showConsole: 'Show Console',
              autoRun: 'Auto Run',
              enableSharing: 'Enable Sharing',
              enableFullscreen: 'Enable Fullscreen'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={config[key as keyof DemoConfig] as boolean}
                  onChange={(e) => updateConfig(key as keyof DemoConfig, e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-slate-600">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main CodePlayground */}
      <div className="flex-1">
        <CodePlayground
          initialCode={code}
          language={language}
          layout={config.layout || 'horizontal'}
          showToolbar={config.showToolbar}
          showLineNumbers={config.showLineNumbers}
          enablePreview={config.enablePreview}
          showConsole={config.showConsole}
          autoRun={config.autoRun}
          autoRunDelay={config.autoRunDelay}
          enableSharing={config.enableSharing}
          enableFullscreen={config.enableFullscreen}
          templates={DEMO_TEMPLATES}
          onCodeChange={handleCodeChange}
          onExecute={handleExecute}
          onShare={handleShare}
          className="h-96"
        />
      </div>

      {/* Execution Result Display */}
      {executionResult && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-lg font-semibold text-slate-900">
            Last Execution Result
          </h3>
          
          <div className="space-y-2">
            <div>
              <strong>Timestamp:</strong> {new Date(executionResult.timestamp).toLocaleTimeString()}
            </div>
            
            {executionResult.output && (
              <div>
                <strong>Output:</strong> 
                <pre className="mt-1 rounded bg-slate-100 p-2 font-mono">
                  {executionResult.output}
                </pre>
              </div>
            )}
            
            {executionResult.error && (
              <div>
                <strong className="text-red-600">Error:</strong> 
                <pre className="mt-1 rounded bg-red-50 p-2 font-mono text-red-700">
                  {executionResult.error}
                </pre>
              </div>
            )}
            
            {executionResult.logs && executionResult.logs.length > 0 && (
              <div>
                <strong>Console Logs:</strong>
                <ul className="mt-1 rounded bg-slate-100 p-2">
                  {executionResult.logs.map((log, index) => (
                    <li key={index} className="font-mono text-sm">
                      {log}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Data Display */}
      {shareData && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-slate-900">
            Share Data
          </h3>
          <pre className="overflow-auto rounded bg-white p-2 font-mono text-sm">
            {JSON.stringify(shareData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default CodePlaygroundDemo;
