#!/usr/bin/env node

/**
 * Workspace Structure Validator
 * Enforces WORKSPACE_RULES.md compliance automatically
 * 
 * Usage: node tools/check-workspace-structure.js
 * Exit codes: 0 = compliant, 1 = violations found
 */

const fs = require('fs');
const path = require('path');

// Configuration based on WORKSPACE_RULES.md
const ALLOWED_TOP_LEVEL = new Set([
  'docs', 'src', 'test', 'tools', '.github', '.vscode', 
  'node_modules', '.git', '.gitignore', '.nvmrc', '.npmrc',
  'package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.node.json',
  'vite.config.ts', 'vitest.config.ts', 'playwright.config.ts',
  'README.md', 'API_CONTRACTS.md', 'CONTRIBUTING.md', 'SHORT_PROMPT.md',
  'TECH_STACK.md', 'WORKSPACE_RULES.md'
]);

const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const NAMING_PATTERNS = {
  scripts: /^[a-z]+(-[a-z]+)*\.(js|ts)$/,           // kebab-case
  components: /^[A-Z][a-zA-Z]*\.(tsx|jsx)$/,       // PascalCase  
  tests: /^.*\.(test|spec)\.(ts|js|tsx|jsx)$/,      // *.test.* or *.spec.*
  styles: /^[a-z]+(-[a-z]+)*\.(css|scss)$/,        // kebab-case
  configs: /^[a-z]+(-[a-z]+)*\.json$/,              // kebab-case (with exceptions)
  markdown: /^[a-z]+(-[a-z]+)*\.md$/i               // kebab-case (case insensitive)
};

const CONFIG_EXCEPTIONS = ['package.json', 'tsconfig.json', 'tsconfig.node.json'];

class WorkspaceValidator {
  constructor() {
    this.violations = [];
    this.warnings = [];
  }

  validateTopLevelStructure() {
    console.log('🔍 Validating top-level directory structure...');
    
    const items = fs.readdirSync('.', { withFileTypes: true });
    
    for (const item of items) {
      if (!ALLOWED_TOP_LEVEL.has(item.name)) {
        this.violations.push(`Unauthorized top-level item: ${item.name}`);
      }
    }
  }

  validateFileSizes() {
    console.log('📏 Checking file sizes...');
    
    this.walkDirectory('.', (filePath, stats) => {
      if (stats.size > MAX_FILE_SIZE_BYTES) {
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        this.violations.push(`File too large: ${filePath} (${sizeMB}MB > ${MAX_FILE_SIZE_MB}MB)`);
      }
    });
  }

  validateNamingConventions() {
    console.log('📝 Validating naming conventions...');
    
    this.walkDirectory('.', (filePath) => {
      const fileName = path.basename(filePath);
      const ext = path.extname(fileName);
      const dir = path.dirname(filePath);
      
      // Skip node_modules, .git, and other ignored directories
      if (this.shouldSkipPath(filePath)) return;
      
      // Validate based on file type and location
      if (dir.includes('tools') && (ext === '.js' || ext === '.ts')) {
        if (!NAMING_PATTERNS.scripts.test(fileName)) {
          this.violations.push(`Script naming violation: ${filePath} (should be kebab-case)`);
        }
      }
      
      if (ext === '.tsx' || ext === '.jsx') {
        if (!NAMING_PATTERNS.components.test(fileName)) {
          this.violations.push(`Component naming violation: ${filePath} (should be PascalCase)`);
        }
      }
      
      if (fileName.includes('.test.') || fileName.includes('.spec.')) {
        if (!NAMING_PATTERNS.tests.test(fileName)) {
          this.violations.push(`Test naming violation: ${filePath} (should be *.test.* or *.spec.*)`);
        }
      }
      
      if (ext === '.css' || ext === '.scss') {
        if (!NAMING_PATTERNS.styles.test(fileName)) {
          this.violations.push(`Style naming violation: ${filePath} (should be kebab-case)`);
        }
      }
      
      if (ext === '.json' && !CONFIG_EXCEPTIONS.includes(fileName)) {
        if (!NAMING_PATTERNS.configs.test(fileName)) {
          this.warnings.push(`Config naming suggestion: ${filePath} (consider kebab-case)`);
        }
      }
      
      if (ext === '.md') {
        if (!NAMING_PATTERNS.markdown.test(fileName)) {
          this.warnings.push(`Markdown naming suggestion: ${filePath} (consider kebab-case)`);
        }
      }
    });
  }

  validateProhibitedContent() {
    console.log('🚫 Checking for prohibited content...');
    
    // Check for common vendored library patterns
    const prohibitedDirs = ['lib', 'vendor', 'third-party', 'external'];
    
    for (const dir of prohibitedDirs) {
      if (fs.existsSync(dir)) {
        this.violations.push(`Prohibited directory found: ${dir} (use package manager instead)`);
      }
    }
    
    // Check for common temporary/cache directories
    const tempDirs = ['.tmp', '.cache', 'temp', 'tmp'];
    
    for (const dir of tempDirs) {
      if (fs.existsSync(dir)) {
        this.warnings.push(`Temporary directory found: ${dir} (consider adding to .gitignore)`);
      }
    }
  }

  walkDirectory(dirPath, callback) {
    if (this.shouldSkipPath(dirPath)) return;
    
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory()) {
        this.walkDirectory(fullPath, callback);
      } else if (item.isFile()) {
        const stats = fs.statSync(fullPath);
        callback(fullPath, stats);
      }
    }
  }

  shouldSkipPath(filePath) {
    const skipPatterns = [
      'node_modules',
      '.git', 
      '.vscode',
      'dist',
      'build',
      'coverage'
    ];
    
    return skipPatterns.some(pattern => filePath.includes(pattern));
  }

  run() {
    console.log('🔧 Workspace Structure Validator');
    console.log('================================\n');
    
    this.validateTopLevelStructure();
    this.validateFileSizes();
    this.validateNamingConventions();
    this.validateProhibitedContent();
    
    console.log('\n📊 Validation Results:');
    console.log('======================');
    
    if (this.violations.length === 0 && this.warnings.length === 0) {
      console.log('✅ All workspace rules validated successfully!');
      return 0;
    }
    
    if (this.violations.length > 0) {
      console.log(`\n❌ ${this.violations.length} violation(s) found:`);
      this.violations.forEach(violation => console.log(`  • ${violation}`));
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  ${this.warnings.length} warning(s):`);
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
    
    console.log('\n📖 See WORKSPACE_RULES.md for detailed guidelines.');
    
    return this.violations.length > 0 ? 1 : 0;
  }
}

// Run validator if called directly
if (require.main === module) {
  const validator = new WorkspaceValidator();
  const exitCode = validator.run();
  process.exit(exitCode);
}

module.exports = WorkspaceValidator;
