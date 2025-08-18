// tools/ssot-codemod.cjs
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const EXTS = new Set(['.tsx', '.ts']);
const TARGET_DIRS = [path.join(ROOT, 'src')]; // your structure

// Map only patterns you've verified in the audit
const REPLACERS = [
  // Spacing
  [/\bml-2\b/g, '${DESIGN_TOKENS.spacing.iconLeft}'],
  [/\bml-1\b/g, '${DESIGN_TOKENS.spacing.iconSmall}'],
  [/\bmb-2\b/g, '${DESIGN_TOKENS.spacing.stack.sm}'],
  [/\bmb-3\b/g, '${DESIGN_TOKENS.spacing.stack.md}'],
  [/\bmt-3\b/g, '${DESIGN_TOKENS.spacing.stack.md}'],
  [/\bpt-3\b/g, '${DESIGN_TOKENS.spacing.insetTop.md}'],

  // Icon sizes
  [/\bw-6\s*h-6\b/g, '${DESIGN_TOKENS.icons.sizes.lg}'],
  [/\bsize-8\b/g, '${DESIGN_TOKENS.icons.sizes.xl}'],

  // Spinner
  [/\banimate-spin\s*(?:h-\d+\s*w-\d+|size-\d+)?\b/g, '${DESIGN_TOKENS.loading.spinner}'],

  // Layout pattern
  [/\bflex\s+items-center\s+justify-between\b/g, '${DESIGN_TOKENS.layout.patterns.spaceBetween}'],

  // Optional header pattern (only if you have this token)
  [/\bp-6\b(?=.*\bborder-b\b)/g, '${DESIGN_TOKENS.layout.patterns.sectionHeader}'],
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (EXTS.has(path.extname(p))) processFile(p);
  }
}

function processFile(file) {
  let src = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const [re, rep] of REPLACERS) {
    if (re.test(src)) {
      src = src.replace(re, rep);
      changed = true;
    }
  }

  if (!changed) return;

  // If a className literal now contains ${...}, convert to template
  src = src.replace(
    /className=(['"])([^'"]*)(['"])/g,
    (_all, quote1, val, quote2) => {
      if (val.includes('${DESIGN_TOKENS')) {
        return `className={\`${val}\`}`;
      }
      return _all;
    }
  );

  fs.writeFileSync(file, src, 'utf8');
  console.log('updated', file);
}

console.log('Running SSOT codemod...');
for (const dir of TARGET_DIRS) {
  if (fs.existsSync(dir)) {
    console.log(`Scanning ${dir}...`);
    walk(dir);
  }
}
console.log('SSOT codemod complete.');
