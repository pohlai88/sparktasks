/**
 * Component Scaffolding - Zero Overhead Compliance
 * Creates new components with built-in SSOT compliance
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');
const TEST_DIR = path.join(ROOT, 'test', 'components');

const componentName = process.argv[2];
const folderType = process.argv[3] || 'ui'; // ui, features, layout, data

if (!componentName) {
  console.error('❌ Usage: npm run new <ComponentName> [folder]');
  console.error('   Example: npm run new Button ui');
  console.error('   Example: npm run new CommandPalette features');
  process.exit(1);
}

// Validate folder type
const validFolders = ['ui', 'features', 'layout', 'data', 'demo'];
if (!validFolders.includes(folderType)) {
  console.error(`❌ Invalid folder type. Use: ${validFolders.join(', ')}`);
  process.exit(1);
}

function createComponentFile(name, folder) {
  const componentPath = path.join(COMPONENTS_DIR, folder, `${name}.tsx`);

  if (fs.existsSync(componentPath)) {
    console.error(`❌ Component ${name} already exists in ${folder}/`);
    process.exit(1);
  }

  const template = `import { DESIGN_TOKENS } from '@/design/tokens';
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface ${name}Props extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual variant of the component
   */
  variant?: 'primary' | 'secondary' | 'ghost';
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Children content
   */
  children?: React.ReactNode;
}

/**
 * ${name} component
 * 
 * @example
 * <${name} variant="primary" size="md">
 *   Content
 * </${name}>
 */
export const ${name} = forwardRef<HTMLElement, ${name}Props>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    disabled = false,
    className, 
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles from DESIGN_TOKENS
          DESIGN_TOKENS.recipe.${folder === 'ui' ? 'card' : 'button'}.base,
          
          // Variant styles
          {
            'primary': DESIGN_TOKENS.theme.light.surface.base,
            'secondary': DESIGN_TOKENS.theme.light.surface.muted,
            'ghost': DESIGN_TOKENS.theme.light.surface.transparent,
          }[variant],
          
          // Size styles  
          {
            'sm': DESIGN_TOKENS.sizing.button.sm,
            'md': DESIGN_TOKENS.sizing.button.md,
            'lg': DESIGN_TOKENS.sizing.button.lg,
          }[size],
          
          // State styles
          disabled && DESIGN_TOKENS.state.interaction.disabled,
          
          className
        )}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    );
  }
);

${name}.displayName = '${name}';
`;

  // Ensure directory exists
  const dir = path.dirname(componentPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(componentPath, template);
  return componentPath;
}

function createTestFile(name) {
  const testPath = path.join(TEST_DIR, `${name}.test.tsx`);

  const template = `import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ${name} } from '@/components';

expect.extend(toHaveNoViolations);

describe('${name}', () => {
  it('renders without errors', () => {
    render(<${name}>Test content</${name}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('supports all variants', () => {
    const variants = ['primary', 'secondary', 'ghost'] as const;
    
    variants.forEach(variant => {
      const { rerender } = render(<${name} variant={variant}>Test</${name}>);
      expect(screen.getByText('Test')).toBeInTheDocument();
      rerender(<></>);
    });
  });

  it('supports all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    
    sizes.forEach(size => {
      const { rerender } = render(<${name} size={size}>Test</${name}>);
      expect(screen.getByText('Test')).toBeInTheDocument();
      rerender(<></>);
    });
  });

  it('handles disabled state', () => {
    render(<${name} disabled>Disabled</${name}>);
    const element = screen.getByText('Disabled');
    expect(element).toHaveAttribute('aria-disabled', 'true');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<${name} ref={ref}>Test</${name}>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('meets accessibility requirements', async () => {
    const { container } = render(<${name}>Accessible content</${name}>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles keyboard navigation', () => {
    render(<${name}>Keyboard test</${name}>);
    const element = screen.getByText('Keyboard test');
    
    // Test focus behavior
    element.focus();
    expect(element).toHaveFocus();
  });

  it('supports custom className', () => {
    const customClass = 'custom-test-class';
    render(<${name} className={customClass}>Test</${name}>);
    expect(screen.getByText('Test')).toHaveClass(customClass);
  });

  it('supports dark mode theming', () => {
    // Test with dark mode context/provider if implemented
    render(<${name}>Dark mode test</${name}>);
    expect(screen.getByText('Dark mode test')).toBeInTheDocument();
  });
});
`;

  // Ensure directory exists
  const dir = path.dirname(testPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(testPath, template);
  return testPath;
}

function createDemoFile(name, folder) {
  const demoPath = path.join(COMPONENTS_DIR, 'demo', `${name}Demo.tsx`);

  const template = `import { ${name} } from '@/components/${folder}/${name}';

export function ${name}Demo() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">${name} Demo</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Variants</h3>
        <div className="flex gap-4">
          <${name} variant="primary">Primary</${name}>
          <${name} variant="secondary">Secondary</${name}>
          <${name} variant="ghost">Ghost</${name}>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Sizes</h3>
        <div className="flex items-center gap-4">
          <${name} size="sm">Small</${name}>
          <${name} size="md">Medium</${name}>
          <${name} size="lg">Large</${name}>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">States</h3>
        <div className="flex gap-4">
          <${name}>Default</${name}>
          <${name} disabled>Disabled</${name}>
        </div>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(demoPath, template);
  return demoPath;
}

function updateIndexExports(name, folder) {
  const indexPath = path.join(COMPONENTS_DIR, 'index.ts');
  const exportLine = `export { ${name} } from './${folder}/${name}';`;

  let indexContent = '';
  if (fs.existsSync(indexPath)) {
    indexContent = fs.readFileSync(indexPath, 'utf8');
  }

  // Add export if not already present
  if (!indexContent.includes(exportLine)) {
    indexContent += `\n${exportLine}`;
    fs.writeFileSync(indexPath, indexContent);
  }

  return indexPath;
}

async function main() {
  console.log(`🏗️ Creating ${componentName} component in ${folderType}/...`);

  try {
    // Create component file
    const componentPath = createComponentFile(componentName, folderType);
    console.log(`✅ Component: ${componentPath}`);

    // Create test file
    const testPath = createTestFile(componentName);
    console.log(`✅ Test: ${testPath}`);

    // Create demo file
    const demoPath = createDemoFile(componentName, folderType);
    console.log(`✅ Demo: ${demoPath}`);

    // Update index exports
    const indexPath = updateIndexExports(componentName, folderType);
    console.log(`✅ Export: ${indexPath}`);

    console.log(`\n🎯 ${componentName} created successfully!`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Customize the component implementation`);
    console.log(`   2. Run tests: npm test -- ${componentName}`);
    console.log(`   3. Check SSOT: npm run ssot:check`);
    console.log(
      `   4. View demo: import { ${componentName}Demo } from '@/components'`
    );
  } catch (error) {
    console.error('❌ Component creation failed:', error.message);
    process.exit(1);
  }
}

main();
