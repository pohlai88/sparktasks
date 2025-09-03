#!/usr/bin/env node
/**
 * Maintenance CLI - headless operations for CI/ops
 * Usage: node scripts/maintenance.js [options]
 */

import { KeyringProvider } from '../src/crypto/keyring';
import { planMaintenance } from '../src/maintenance/plan';
import { runMaintenance } from '../src/maintenance/run';
import { EncryptedDriver } from '../src/storage/encrypted';
import { LocalStorageDriver } from '../src/storage/local';

interface CliOptions {
  compact?: number;
  rekeyPrefix?: string;
  sweepPrefix?: string;
  sample?: number;
  fix?: boolean;
  resume?: string;
  help?: boolean;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg.startsWith('--compact=')) {
      options.compact = Number.parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--rekey-prefix=')) {
      options.rekeyPrefix = arg.split('=')[1];
    } else if (arg.startsWith('--sweep-prefix=')) {
      options.sweepPrefix = arg.split('=')[1];
    } else if (arg.startsWith('--sample=')) {
      options.sample = Number.parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--resume=')) {
      options.resume = arg.split('=')[1];
    } else if (arg === '--fix') {
      options.fix = true;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Maintenance CLI - AIBOS SlackTasks

Usage: node scripts/maintenance.js [options]

Options:
  --compact=N           Compact when events exceed N (default: skip)
  --rekey-prefix=PREFIX Re-encrypt keys under PREFIX with active kid
  --sweep-prefix=PREFIX Integrity sweep under PREFIX  
  --sample=N            Limit sweep to N keys for performance
  --resume=KEY          Resume from specific key (for interrupted ops)
  --fix                 Repair issues found during sweep
  --help, -h            Show this help

Examples:
  node scripts/maintenance.js --compact=2000
  node scripts/maintenance.js --rekey-prefix=app: --sweep-prefix=app: --fix
  node scripts/maintenance.js --sweep-prefix=data: --sample=1000

Exit codes:
  0 = Success
  1 = Failure (check JSON output for details)
`);
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  try {
    // Initialize storage stack
    const storage = new LocalStorageDriver();
    const keyring = new KeyringProvider(storage, 'app-keyring');
    const encrypted = new EncryptedDriver(storage, 'app', keyring);

    // Check if keyring is accessible for REKEY operations
    if (options.rekeyPrefix) {
      try {
        await keyring.getActiveKey();
      } catch (error) {
        console.error(
          JSON.stringify({
            error: 'REKEY_BLOCKED',
            message:
              'Keyring is locked or inaccessible. REKEY operations require unlocked keyring.',
            rekeyPrefix: options.rekeyPrefix,
            timestamp: new Date().toISOString(),
          })
        );
        process.exit(1);
      }
    }

    // Build maintenance plan
    const plan = await planMaintenance({
      maxEvents: options.compact,
      rekeyPrefix: options.rekeyPrefix,
      sweepPrefix: options.sweepPrefix,
      sample: options.sample,
      sweepFix: options.fix,
      batchSize: 100, // Reasonable default for CLI
    });

    if (plan.actions.length === 0) {
      console.log(
        JSON.stringify({
          status: 'NO_ACTION_NEEDED',
          message: 'No maintenance actions required based on current state',
          timestamp: new Date().toISOString(),
          options,
        })
      );
      process.exit(0);
    }

    // Execute maintenance
    const startTime = Date.now();
    const report = await runMaintenance(plan, {
      storage,
      encrypted,
      keyring,
      resumeToken: options.resume,
    });
    const duration = Date.now() - startTime;

    // Determine exit code based on failures
    let hasFailures = false;
    if (report.rekey?.failures && report.rekey.failures > 0) hasFailures = true;
    if (report.sweep?.failed && report.sweep.failed.length > 0)
      hasFailures = true;

    // Output JSON report
    const output = {
      status: hasFailures ? 'COMPLETED_WITH_FAILURES' : 'SUCCESS',
      timestamp: new Date().toISOString(),
      duration_ms: duration,
      plan: {
        actions: plan.actions.length,
        types: plan.actions.map(a => a.type),
      },
      report,
      options,
    };

    console.log(JSON.stringify(output, null, 2));
    process.exit(hasFailures ? 1 : 0);
  } catch (error) {
    console.error(
      JSON.stringify({
        status: 'FATAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        options,
      })
    );
    process.exit(1);
  }
}

// Handle process signals gracefully
process.on('SIGINT', () => {
  console.error(
    JSON.stringify({
      status: 'INTERRUPTED',
      message: 'Maintenance interrupted by user',
      timestamp: new Date().toISOString(),
    })
  );
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.error(
    JSON.stringify({
      status: 'TERMINATED',
      message: 'Maintenance terminated by system',
      timestamp: new Date().toISOString(),
    })
  );
  process.exit(1);
});

if (require.main === module) {
  main().catch(error => {
    console.error(
      JSON.stringify({
        status: 'UNCAUGHT_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      })
    );
    process.exit(1);
  });
}
