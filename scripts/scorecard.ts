import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface ComponentScore {
  name: string;
  hardcodedClasses: number;
  tokenCoverage: number;
  testCoverage: number;
  hasTests: boolean;
  status:
    | '✅ Complete'
    | '🔄 In Progress'
    | '❌ Not Started'
    | '⚠️ Needs Review';
  priority: 'High' | 'Medium' | 'Low';
  blockers: string[];
}

const COMPONENT_PRIORITIES = {
  // Immediate Priority (Week 1) - Core interaction components
  Button: 'High',
  Input: 'High',
  Card: 'High',
  IconButton: 'High',

  // High Priority (Week 2) - Complex interactions
  Dialog: 'High',
  Dropdown: 'High',
  Modal: 'High',
  Popover: 'High',
  Toast: 'High',

  // Medium Priority (Week 3) - Display & feedback
  Badge: 'Medium',
  Avatar: 'Medium',
  AvatarGroup: 'Medium',
  ProgressBar: 'Medium',
  Spinner: 'Medium',
  Skeleton: 'Medium',
  Callout: 'Medium',
  Banner: 'Medium',

  // Lower Priority - Specialized components
  default: 'Low',
} as const;

function getComponentFiles(): string[] {
  const uiDir = 'src/components/ui';
  return fs
    .readdirSync(uiDir)
    .filter(file => file.endsWith('.tsx') && !file.includes('.test.'))
    .map(file => file.replace('.tsx', ''));
}

function countHardcodedClasses(componentName: string): number {
  try {
    const filePath = `src/components/ui/${componentName}.tsx`;
    const content = fs.readFileSync(filePath, 'utf8');

    // More accurate detection: look for className patterns that are NOT wrapped in combineTokens
    const classNameLines = content.split('\n').filter(
      line =>
        line.includes('className=') &&
        !line.includes('combineTokens(') &&
        !line.includes('DESIGN_TOKENS.') &&
        !line.includes('recipe.') &&
        !line.includes('${') && // Skip template literals
        !line.includes('//') && // Skip comments
        !line.includes('/*') && // Skip comments
        !line.includes('* ') && // Skip comments
        !line.includes('className={className}') && // Skip prop forwarding
        !line.includes('className={props.className}') // Skip prop forwarding
    );

    let violations = 0;

    for (const line of classNameLines) {
      // Look for hardcoded Tailwind patterns in className, but exclude certain cases
      const cleanLine = line.trim();

      // Skip lines that are clearly not violations
      if (
        cleanLine.includes('cn(') ||
        cleanLine.includes('clsx(') ||
        cleanLine.includes('classNames(') ||
        cleanLine.includes('twMerge(')
      ) {
        continue;
      }

      const hardcodedPatterns = [
        /className\s*=\s*["'][^"']*\b(flex|grid|inline-flex|hidden|block)\b/,
        /className\s*=\s*["'][^"']*\b(w-\d+|h-\d+|size-\d+)\b/,
        /className\s*=\s*["'][^"']*\b(p-\d+|px-\d+|py-\d+|m-\d+|mx-\d+|my-\d+)\b/,
        /className\s*=\s*["'][^"']*\b(text-\w+|font-\w+|leading-\w+)\b/,
        /className\s*=\s*["'][^"']*\b(bg-\w+|border-\w+|rounded-\w+)\b/,
        /className\s*=\s*["'][^"']*\b(space-[xy]-\d+|gap-\d+)\b/,
        /className\s*=\s*["'][^"']*\b(absolute|relative|fixed|sticky)\b/,
        /className\s*=\s*["'][^"']*\b(top-\d+|right-\d+|bottom-\d+|left-\d+)\b/,
        /className\s*=\s*["'][^"']*\b(z-\d+|opacity-\d+)\b/,
        /className\s*=\s*["'][^"']*\b(min-w-\d+|max-w-\d+|min-h-\d+|max-h-\d+)\b/,
        /className\s*=\s*["'][^"']*\b(flex-\d+|flex-\w+|shrink-\d+|grow-\d+)\b/,
      ];

      if (hardcodedPatterns.some(pattern => pattern.test(line))) {
        violations++;
      }
    }

    return violations;
  } catch (error) {
    console.warn(`Warning: Could not analyze ${componentName}:`, error);
    return 0;
  }
}

function calculateTokenCoverage(componentName: string): number {
  try {
    const filePath = `src/components/ui/${componentName}.tsx`;
    const content = fs.readFileSync(filePath, 'utf8');

    // Count different types of SSOT compliance indicators
    const combineTokensUsages = (content.match(/combineTokens\(/g) || [])
      .length;
    const designTokensUsages = (content.match(/DESIGN_TOKENS\./g) || []).length;
    const recipeUsages = (content.match(/\.recipe\./g) || []).length;

    // Count total styling points
    const classNameOccurrences = (content.match(/className/g) || []).length;

    if (classNameOccurrences === 0) return 100; // No styling = 100% compliant

    // Calculate coverage based on SSOT usage vs total styling
    const ssotUsages = combineTokensUsages + designTokensUsages + recipeUsages;
    const coverage = Math.round((ssotUsages / classNameOccurrences) * 100);

    // Cap at reasonable maximum
    return Math.min(coverage, 300);
  } catch {
    return 0;
  }
}

function hasTestFile(componentName: string): boolean {
  // Check multiple possible test locations
  const possiblePaths = [
    `test/components/${componentName}.test.tsx`,
    `src/components/ui/${componentName}.test.tsx`,
    `__tests__/${componentName}.test.tsx`,
    `test/${componentName}.test.ts`,
    `test/${componentName}.test.tsx`,
  ];

  return possiblePaths.some(path => fs.existsSync(path));
}

function getTestCoverage(componentName: string): number {
  const possiblePaths = [
    `test/components/${componentName}.test.tsx`,
    `src/components/ui/${componentName}.test.tsx`,
    `__tests__/${componentName}.test.tsx`,
    `test/${componentName}.test.ts`,
    `test/${componentName}.test.tsx`,
  ];

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      try {
        const testContent = fs.readFileSync(testPath, 'utf8');
        const testCount = (testContent.match(/(?:it|test)\(/g) || []).length;
        const describeCount = (testContent.match(/describe\(/g) || []).length;

        // Better coverage estimation
        const totalTests = testCount + describeCount;
        if (totalTests >= 5) return 100;
        if (totalTests >= 3) return 80;
        if (totalTests >= 1) return 60;
        return 30;
      } catch {
        return 0;
      }
    }
  }

  return 0;
}

function determineStatus(score: ComponentScore): ComponentScore['status'] {
  // Complete: No hardcoded classes and reasonable token coverage
  if (score.hardcodedClasses === 0 && score.tokenCoverage >= 80) {
    return '✅ Complete';
  }

  // In Progress: Some progress on tokens, maybe few violations remaining
  if (score.hardcodedClasses <= 5 && score.tokenCoverage >= 50) {
    return '🔄 In Progress';
  }

  // Needs Review: Has tokens but still violations or very low coverage
  if (score.tokenCoverage >= 30 || score.hardcodedClasses <= 10) {
    return '⚠️ Needs Review';
  }

  // Not Started: Many violations and low token coverage
  return '❌ Not Started';
}

function getBlockers(score: ComponentScore): string[] {
  const blockers: string[] = [];

  if (score.hardcodedClasses > 10) blockers.push('Many hardcoded classes');
  if (score.hardcodedClasses > 5 && score.hardcodedClasses <= 10)
    blockers.push('Some hardcoded classes');
  if (score.tokenCoverage < 20) blockers.push('Very low token usage');
  if (score.tokenCoverage >= 20 && score.tokenCoverage < 50)
    blockers.push('Low token usage');
  if (!score.hasTests) blockers.push('No tests');
  if (score.testCoverage < 30) blockers.push('Insufficient test coverage');

  return blockers;
}

function generateScorecard(): ComponentScore[] {
  const components = getComponentFiles();
  console.log(`📊 Generating scorecard for ${components.length} components...`);

  return components
    .map(name => {
      console.log(`  🔍 Analyzing ${name}...`);

      const hardcodedClasses = countHardcodedClasses(name);
      const tokenCoverage = calculateTokenCoverage(name);
      const hasTests = hasTestFile(name);
      const testCoverage = getTestCoverage(name);
      const priority =
        (COMPONENT_PRIORITIES as any)[name] || COMPONENT_PRIORITIES.default;

      const score: ComponentScore = {
        name,
        hardcodedClasses,
        tokenCoverage,
        testCoverage,
        hasTests,
        status: '❌ Not Started', // Will be determined
        priority,
        blockers: [],
      };

      score.status = determineStatus(score);
      score.blockers = getBlockers(score);

      return score;
    })
    .sort((a, b) => {
      // Sort by priority, then by status
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      const statusOrder = {
        '✅ Complete': 0,
        '🔄 In Progress': 1,
        '⚠️ Needs Review': 2,
        '❌ Not Started': 3,
      };

      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return statusOrder[a.status] - statusOrder[b.status];
    });
}

function generateMarkdownReport(scores: ComponentScore[]): string {
  const complete = scores.filter(s => s.status === '✅ Complete').length;
  const inProgress = scores.filter(s => s.status === '🔄 In Progress').length;
  const notStarted = scores.filter(s => s.status === '❌ Not Started').length;

  const highPriorityIncomplete = scores.filter(
    s => s.priority === 'High' && s.status !== '✅ Complete'
  ).length;

  return `# SSOT Component Compliance Scorecard

## 📊 Overview
- **Total Components**: ${scores.length}
- **✅ Complete**: ${complete} (${Math.round((complete / scores.length) * 100)}%)
- **🔄 In Progress**: ${inProgress}
- **❌ Not Started**: ${notStarted}
- **🚨 High Priority Incomplete**: ${highPriorityIncomplete}

## 🎯 Priority Queue (Next 10)
${scores
  .filter(s => s.status !== '✅ Complete')
  .slice(0, 10)
  .map(
    s => `1. **${s.name}** (${s.priority}) - ${s.status}
   - Hardcoded classes: ${s.hardcodedClasses}
   - Token coverage: ${s.tokenCoverage}%
   - Test coverage: ${s.testCoverage}%
   - Blockers: ${s.blockers.length > 0 ? s.blockers.join(', ') : 'None'}`
  )
  .join('\n')}

## 📋 Full Component Status

| Component | Priority | Status | Raw Classes | Token % | Test % | Blockers |
|-----------|----------|--------|-------------|---------|--------|----------|
${scores
  .map(
    s =>
      `| ${s.name} | ${s.priority} | ${s.status} | ${s.hardcodedClasses} | ${s.tokenCoverage}% | ${s.testCoverage}% | ${s.blockers.length > 0 ? s.blockers.join(', ') : '-'} |`
  )
  .join('\n')}

## 🚀 Quick Actions
1. **Immediate**: Fix high-priority components with >5 hardcoded classes
2. **This Week**: Complete Button, Input, Card components (core interactions)
3. **Next Week**: Focus on Dialog, Dropdown, Modal (complex patterns)

---
*Generated on ${new Date().toISOString()}*
*Run \`npm run ssot:scorecard\` to refresh*
`;
}

async function main() {
  try {
    console.log('🚀 Starting SSOT Component Scorecard Generation...');
    console.log('📂 Checking workspace structure...');

    const scores = generateScorecard();

    // Write JSON data
    fs.writeFileSync(
      'docs/ssot-scorecard.json',
      JSON.stringify(scores, null, 2)
    );
    console.log('📄 JSON scorecard written to docs/ssot-scorecard.json');

    // Write Markdown report
    const markdown = generateMarkdownReport(scores);
    fs.writeFileSync('docs/SSOT_SCORECARD.md', markdown);
    console.log('📝 Markdown report written to docs/SSOT_SCORECARD.md');

    // Console summary
    const complete = scores.filter(s => s.status === '✅ Complete').length;
    const highPriorityIncomplete = scores.filter(
      s => s.priority === 'High' && s.status !== '✅ Complete'
    ).length;

    console.log(`\n✅ Scorecard complete!`);
    console.log(`📊 ${complete}/${scores.length} components SSOT compliant`);
    console.log(
      `🚨 ${highPriorityIncomplete} high-priority components need attention`
    );

    if (highPriorityIncomplete > 0) {
      console.log('\n🎯 Next priorities:');
      scores
        .filter(s => s.priority === 'High' && s.status !== '✅ Complete')
        .slice(0, 3)
        .forEach(s => {
          console.log(
            `  • ${s.name}: ${s.hardcodedClasses} hardcoded classes, ${s.tokenCoverage}% token coverage`
          );
        });
    }
  } catch (error) {
    console.error('❌ Error generating scorecard:', error);
    process.exit(1);
  }
}

// Main execution
console.log('Script starting...');
main();

export { generateScorecard, type ComponentScore };
