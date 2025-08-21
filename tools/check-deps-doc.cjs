const fs = require('fs');

// Configuration constants
const PACKAGE_JSON_PATH = 'package.json';
const DEPENDENCIES_DOC_PATH = 'docs/DEPENDENCIES.md';
const LOCKFILE_PATH = 'package-lock.json';

// Meta-packages to ignore (don't require documentation)
const IGNORE_PATTERNS = [
  /^@types\//, // TypeScript type definitions
  /^eslint-/, // ESLint plugins/configs
];

function read(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

function safeJsonParse(content, filePath) {
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Invalid JSON in ${filePath}: ${error.message}`);
    process.exit(1);
  }
}

// Load and parse package.json safely
const packageContent = read(PACKAGE_JSON_PATH);
if (!packageContent) {
  console.error(`❌ ${PACKAGE_JSON_PATH} not found`);
  process.exit(1);
}

const pkg = safeJsonParse(packageContent, PACKAGE_JSON_PATH);

// Collect all dependency types
const allDeps = {
  ...(pkg.dependencies || {}),
  ...(pkg.devDependencies || {}),
  ...(pkg.peerDependencies || {}),
  ...(pkg.optionalDependencies || {}),
};

// Filter out ignored packages and sort
const deps = Object.keys(allDeps)
  .filter(dep => !IGNORE_PATTERNS.some(pattern => pattern.test(dep)))
  .sort();

// Load dependencies documentation
const doc = read(DEPENDENCIES_DOC_PATH) || '';

// Check for missing documentation entries (case-insensitive)
const missing = deps.filter(dep => {
  const escapedDep = dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^-\\s*${escapedDep}\\b`, 'mi');
  return !regex.test(doc);
});

// Report missing dependencies
if (missing.length) {
  console.error('❌ Dependencies missing from docs/DEPENDENCIES.md:');

  // Human-readable output
  console.error('Missing entries:\n- ' + missing.join('\n- '));

  // CI-friendly JSON output
  if (process.env.CI) {
    console.error('\n📋 CI Data:');
    console.error(
      JSON.stringify(
        {
          type: 'missing_dependency_docs',
          missing_dependencies: missing,
          documentation_file: DEPENDENCIES_DOC_PATH,
          total_missing: missing.length,
        },
        null,
        2
      )
    );
  }

  process.exit(1);
}

// Check for lockfile presence
if (!fs.existsSync(LOCKFILE_PATH)) {
  console.error(
    `❌ ${LOCKFILE_PATH} missing. Commit your lockfile for reproducible installs.`
  );
  process.exit(1);
}

// Success message
console.log(
  `✅ Dependencies doc check OK (${deps.length} dependencies documented)`
);

// Optional: Warn about documented dependencies that no longer exist
const documentedDeps = (doc.match(/^-\s*([a-z0-9@/_-]+)/gim) || [])
  .map(line => line.replace(/^-\s*/, '').split(/\s/)[0])
  .filter(Boolean);

const obsolete = documentedDeps.filter(dep => !allDeps[dep]);
if (obsolete.length) {
  console.warn(`⚠️  Potentially obsolete docs entries: ${obsolete.join(', ')}`);
}
