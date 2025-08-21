const { execSync } = require('child_process');

function run(cmd) {
  console.log('> ' + cmd);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    console.error('Validator failed:', cmd);
    process.exit(1);
  }
}

// SSOT validation is now handled by the comprehensive scorecard
console.log(
  'ℹ️  SSOT compliance: Use `npm run ssot:scorecard` for comprehensive analysis'
);
run('node tools/check-tech-stack.js');
run('node tools/check-deps-doc.js');
run('node tools/check-workspace-structure.js');
run('node tools/check-env.js');
console.log('All validators passed locally');
