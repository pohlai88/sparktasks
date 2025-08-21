const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const docsPath = path.join(root, 'docs', 'SSOT.md');
const shortPath = path.join(root, 'SHORT_PROMPT.md');

function normalizeWhitespace(s) {
  return s.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
}

if (!fs.existsSync(docsPath)) {
  console.error('docs/SSOT.md not found');
  console.log('CHANGED=false');
  process.exit(0);
}

const txt = fs.readFileSync(docsPath, 'utf8');
const m = txt.match(/## 1\) Short System Prompt([\s\S]*?)(?:\n## |$)/);
if (!m) {
  console.error('Could not extract Section 1 from docs/SSOT.md');
  console.log('CHANGED=false');
  process.exit(0);
}

const section1 = m[1].trim();
let shortExists = fs.existsSync(shortPath);
let shortTxt = shortExists ? fs.readFileSync(shortPath, 'utf8') : '';

const normDocs = normalizeWhitespace(section1);
const normShort = normalizeWhitespace(shortTxt);

if (normDocs === normShort) {
  console.log('No change needed: SHORT_PROMPT.md matches docs Section 1');
  console.log('CHANGED=false');
  process.exit(0);
}

// Overwrite SHORT_PROMPT.md with the Section 1 content (keep minimal formatting)
fs.writeFileSync(shortPath, section1 + '\n', 'utf8');
console.log('Updated SHORT_PROMPT.md to match docs/SSOT.md Section 1');
console.log('CHANGED=true');
process.exit(0);
