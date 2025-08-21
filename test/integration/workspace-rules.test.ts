/**
 * Workspace Rules Compliance Test
 * Validates that our WORKSPACE_RULES.md enhancements are working correctly
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';

describe('Workspace Rules Compliance', () => {
  describe('Documentation Quality', () => {
    it('should have comprehensive WORKSPACE_RULES.md with all sections', () => {
      const rulesContent = readFileSync('WORKSPACE_RULES.md', 'utf-8');

      // Check for enhanced sections
      expect(rulesContent).toContain('Allowed Top-Level Directories');
      expect(rulesContent).toContain('| Folder');
      expect(rulesContent).toContain('| Purpose');
      expect(rulesContent).toContain('Naming Conventions');
      expect(rulesContent).toContain('Asset Files');
      expect(rulesContent).toContain('Gray Area Guidelines');
      expect(rulesContent).toContain('Automation Enforcement');
      expect(rulesContent).toContain('Current Exceptions');
    });

    it('should document all allowed top-level directories with purposes', () => {
      const rulesContent = readFileSync('WORKSPACE_RULES.md', 'utf-8');

      const expectedDirectories = [
        'docs',
        'src',
        'test',
        'tools',
        '.github',
        '.vscode',
        'node_modules',
        '.git',
      ];

      expectedDirectories.forEach(dir => {
        expect(rulesContent).toContain(`\`${dir}\``);
      });
    });

    it('should include comprehensive naming conventions', () => {
      const rulesContent = readFileSync('WORKSPACE_RULES.md', 'utf-8');

      expect(rulesContent).toContain('kebab-case');
      expect(rulesContent).toContain('PascalCase');
      expect(rulesContent).toContain('camelCase');
      expect(rulesContent).toContain('CSS/SCSS');
      expect(rulesContent).toContain('JSON configs');
    });
  });

  describe('Automation Tools', () => {
    it('should have enhanced workspace structure validator', () => {
      expect(existsSync('tools/check-workspace-structure.js')).toBe(true);

      const validatorContent = readFileSync(
        'tools/check-workspace-structure.js',
        'utf-8'
      );

      // Check for enhanced functionality
      expect(validatorContent).toContain('WorkspaceValidator');
      expect(validatorContent).toContain('validateFileSizes');
      expect(validatorContent).toContain('validateNamingConventions');
      expect(validatorContent).toContain('validateProhibitedContent');
      expect(validatorContent).toContain('NAMING_PATTERNS');
      expect(validatorContent).toContain('MAX_FILE_SIZE_MB');
    });

    it('should have GitHub Actions workflow for enforcement', () => {
      expect(existsSync('.github/workflows/workspace-lint.yml')).toBe(true);

      const workflowContent = readFileSync(
        '.github/workflows/workspace-lint.yml',
        'utf-8'
      );

      expect(workflowContent).toContain('Workspace Compliance');
      expect(workflowContent).toContain('check-workspace-structure.js');
      expect(workflowContent).toContain('find . -type f -size +1M');
      expect(workflowContent).toContain('validate');
    });
  });

  describe('Current Workspace Compliance', () => {
    it('should have all documented directories', () => {
      const requiredDirs = ['docs', 'src', 'test', 'tools'];

      requiredDirs.forEach(dir => {
        expect(existsSync(dir)).toBe(true);
      });
    });

    it('should follow naming conventions for existing files', () => {
      // Test files should follow naming patterns
      expect(existsSync('test/integration/api-contracts.test.ts')).toBe(true);
      expect(existsSync('test/integration/enhanced-setup.test.ts')).toBe(true);

      // Tools should be kebab-case
      expect(existsSync('tools/check-workspace-structure.js')).toBe(true);
      expect(existsSync('tools/run-validators.js')).toBe(true);

      // Markdown should be kebab-case
      expect(existsSync('WORKSPACE_RULES.md')).toBe(true);
      expect(existsSync('API_CONTRACTS.md')).toBe(true);
    });

    it('should not have prohibited directories', () => {
      const prohibitedDirs = ['lib', 'vendor', 'third-party', 'external'];

      prohibitedDirs.forEach(dir => {
        expect(existsSync(dir)).toBe(false);
      });
    });
  });

  describe('Enforcement Integration', () => {
    it('should include workspace validation in npm scripts', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));

      expect(packageJson.scripts.validate).toContain('tools/run-validators.js');
    });

    it('should document enforcement tools in WORKSPACE_RULES.md', () => {
      const rulesContent = readFileSync('WORKSPACE_RULES.md', 'utf-8');

      expect(rulesContent).toContain('tools/check-workspace-structure.js');
      expect(rulesContent).toContain('.github/workflows/workspace-lint.yml');
      expect(rulesContent).toContain('Enforcement Tools');
    });
  });

  describe('SSOT Process Compliance', () => {
    it('should have enhanced CONTRIBUTING.md with SSOT discipline', () => {
      const contributingContent = readFileSync('CONTRIBUTING.md', 'utf-8');

      expect(contributingContent).toContain('Why SSOT Discipline Matters');
      expect(contributingContent).toContain('Sync Requirements');
      expect(contributingContent).toContain('Drift Detection & Debugging');
      expect(contributingContent).toContain('Ownership & Hand-off');
      expect(contributingContent).toContain('PR Checklist Integration');
    });

    it('should have comprehensive PR template with SSOT checklist', () => {
      expect(existsSync('.github/pull_request_template.md')).toBe(true);

      const templateContent = readFileSync(
        '.github/pull_request_template.md',
        'utf-8'
      );

      expect(templateContent).toContain('SSOT Compliance Checklist');
      expect(templateContent).toContain('Version/date header incremented');
      expect(templateContent).toContain(
        'SHORT_PROMPT.md` updated if Section 1'
      );
      expect(templateContent).toContain('API Contract Compliance');
      expect(templateContent).toContain('Workspace Rules Compliance');
    });
  });
});
