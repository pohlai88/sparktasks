#!/usr/bin/env node

/**
 * E2E Setup Validation Script
 * Validates that all components of the E2E infrastructure are working correctly
 */

import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

interface ValidationResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: string;
}

class E2EValidator {
  private results: ValidationResult[] = [];

  async validate(): Promise<void> {
    console.log('🔍 Validating Playwright E2E Setup...\n');

    await this.checkDependencies();
    await this.checkFileStructure();
    await this.checkConfigurations();
    await this.checkPlaywrightInstallation();
    await this.checkTestData();
    await this.validateScripts();

    this.printReport();
  }

  private async checkDependencies(): Promise<void> {
    console.log('📦 Checking dependencies...');

    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));

    const requiredDeps = ['@playwright/test', '@types/node'];

    for (const dep of requiredDeps) {
      if (
        packageJson.devDependencies?.[dep] ||
        packageJson.dependencies?.[dep]
      ) {
        this.addResult('pass', `Dependency ${dep}`, 'Found in package.json');
      } else {
        this.addResult(
          'fail',
          `Dependency ${dep}`,
          'Missing from package.json'
        );
      }
    }
  }

  private async checkFileStructure(): Promise<void> {
    console.log('📁 Checking file structure...');

    const requiredFiles = [
      'playwright.config.ts',
      'tests/e2e/tsconfig.json',
      'tests/e2e/helpers/fixtures/test-fixtures.ts',
      'tests/e2e/helpers/data/test-users.ts',
      'tests/e2e/helpers/data/seed-manager.ts',
      'tests/e2e/helpers/data/storage-state.json',
      'tests/e2e/helpers/auth-utils.ts',
      'tests/e2e/helpers/page-utils.ts',
      'tests/e2e/setup.ts',
      'tests/e2e/helpers/global-teardown.ts',
      'tests/e2e/tests/critical/homepage.test.ts',
    ];

    for (const file of requiredFiles) {
      if (existsSync(file)) {
        this.addResult('pass', `File ${file}`, 'Exists');
      } else {
        this.addResult('fail', `File ${file}`, 'Missing');
      }
    }
  }

  private async checkConfigurations(): Promise<void> {
    console.log('⚙️  Checking configurations...');

    // Check TypeScript config
    if (existsSync('tests/e2e/tsconfig.json')) {
      try {
        const tsConfig = JSON.parse(readFileSync('tests/e2e/tsconfig.json', 'utf-8'));
        if (tsConfig.compilerOptions?.types?.includes('@playwright/test')) {
          this.addResult(
            'pass',
            'TypeScript config',
            'Playwright types configured'
          );
        } else {
          this.addResult(
            'warn',
            'TypeScript config',
            'Playwright types might be missing'
          );
        }
      } catch {
        this.addResult('fail', 'TypeScript config', 'Invalid JSON');
      }
    }

    // Check Playwright config
    if (existsSync('playwright.config.ts')) {
      this.addResult('pass', 'Playwright config', 'Configuration file exists');
    } else {
      this.addResult(
        'fail',
        'Playwright config',
        'Missing playwright.config.ts'
      );
    }
  }

  private async checkPlaywrightInstallation(): Promise<void> {
    console.log('🎭 Checking Playwright installation...');

    try {
      const result = await this.runCommand('npx', ['playwright', '--version']);
      this.addResult('pass', 'Playwright CLI', `Version: ${result.trim()}`);
    } catch {
      this.addResult('fail', 'Playwright CLI', 'Not available');
    }

    // Check browsers
    try {
      await this.runCommand('npx', ['playwright', 'install', '--dry-run']);
      this.addResult(
        'pass',
        'Playwright browsers',
        'Installation check passed'
      );
    } catch {
      this.addResult('warn', 'Playwright browsers', 'May need installation');
    }
  }

  private async checkTestData(): Promise<void> {
    console.log('📊 Checking test data...');

    if (existsSync('tests/e2e/helpers/data/test-users.ts')) {
      try {
        // Basic syntax check by requiring the file
        const content = readFileSync('tests/e2e/helpers/data/test-users.ts', 'utf-8');
        if (content.includes('testUsers') && content.includes('testTasks')) {
          this.addResult('pass', 'Test data', 'Users and tasks data found');
        } else {
          this.addResult('warn', 'Test data', 'Some test data may be missing');
        }
      } catch {
        this.addResult('fail', 'Test data', 'Error reading test data file');
      }
    }

    if (existsSync('tests/e2e/helpers/data/storage-state.json')) {
      try {
        const storageState = JSON.parse(
          readFileSync('tests/e2e/helpers/data/storage-state.json', 'utf-8')
        );
        if (storageState.origins && storageState.origins.length > 0) {
          this.addResult('pass', 'Storage state', 'Valid authentication state');
        } else {
          this.addResult('warn', 'Storage state', 'No origins configured');
        }
      } catch {
        this.addResult('fail', 'Storage state', 'Invalid JSON format');
      }
    }
  }

  private async validateScripts(): Promise<void> {
    console.log('📜 Checking package.json scripts...');

    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    const requiredScripts = [
      'test:e2e',
      'test:e2e:ui',
      'test:e2e:critical',
      'test:e2e:debug',
    ];

    for (const script of requiredScripts) {
      if (packageJson.scripts?.[script]) {
        this.addResult('pass', `Script ${script}`, 'Configured');
      } else {
        this.addResult('warn', `Script ${script}`, 'Missing from package.json');
      }
    }
  }

  private addResult(
    status: 'pass' | 'fail' | 'warn',
    name: string,
    message: string,
    details?: string
  ): void {
    this.results.push({ name, status, message, details });

    const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
    console.log(`  ${icon} ${name}: ${message}`);
  }

  private printReport(): void {
    console.log('\n📋 Validation Report');
    console.log('='.repeat(50));

    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const warnings = this.results.filter(r => r.status === 'warn').length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warnings}`);

    if (failed > 0) {
      console.log('\n🚨 Critical Issues:');
      this.results
        .filter(r => r.status === 'fail')
        .forEach(r => console.log(`  • ${r.name}: ${r.message}`));
    }

    if (warnings > 0) {
      console.log('\n⚠️  Warnings:');
      this.results
        .filter(r => r.status === 'warn')
        .forEach(r => console.log(`  • ${r.name}: ${r.message}`));
    }

    console.log('\n🎯 Next Steps:');
    if (failed === 0 && warnings === 0) {
      console.log('  🎉 Setup is complete! Run: npm run test:e2e');
    } else if (failed === 0) {
      console.log('  ✨ Setup is mostly complete. Address warnings if needed.');
      console.log('  🎭 Install browsers: npx playwright install');
      console.log('  🧪 Run tests: npm run test:e2e');
    } else {
      console.log('  🔧 Fix critical issues before running tests');
      console.log('  📖 Check README.md for setup instructions');
    }
  }

  private runCommand(command: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { stdio: 'pipe' });
      let output = '';

      child.stdout.on('data', data => {
        output += data.toString();
      });

      child.on('close', code => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      child.on('error', reject);
    });
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new E2EValidator();
  validator.validate().catch(console.error);
}

export { E2EValidator };
