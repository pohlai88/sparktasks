const fs = require('fs');

function read(p){ return fs.existsSync(p) ? fs.readFileSync(p,'utf8') : null; }
function exists(p){ return fs.existsSync(p); }

const tech = read('TECH_STACK.md');
const nvm = read('.nvmrc') ? read('.nvmrc').trim() : null;
const npmrc = read('.npmrc') ? read('.npmrc').trim() : null;
let pkg = null;
try { pkg = JSON.parse(read('package.json') || '{}'); } catch(e) { pkg = null; }
const engines = (pkg && pkg.engines && pkg.engines.node) || '';

function get(val, re){ const m = re.exec(val); return m && m[1]; }

const mdNode = tech ? get(tech, /Node:\s*([0-9.]+)/i) : null;

const errors = [];

// Version alignment checks
if (!mdNode) errors.push('TECH_STACK.md missing "Node: x.y.z".');
if (!nvm) errors.push('.nvmrc missing.');
if (!npmrc || !npmrc.includes('engine-strict=true')) errors.push('.npmrc missing or lacks "engine-strict=true".');
if (mdNode && nvm && mdNode !== nvm) errors.push(`Mismatch: TECH_STACK.md Node (${mdNode}) != .nvmrc (${nvm}).`);
if (mdNode && !engines) errors.push('package.json "engines.node" missing.');
if (mdNode && engines && !engines.includes(mdNode.split('.').slice(0,2).join('.')))
  errors.push(`package.json engines.node (${engines}) does not align with ${mdNode}.`);

// Project structure checks
if (!exists('src/shared')) errors.push('src/shared directory missing (required by TECH_STACK.md).');
if (!exists('test/integration')) errors.push('test/integration directory missing.');
if (!exists('test/e2e')) errors.push('test/e2e directory missing.');
if (!exists('tsconfig.json')) errors.push('tsconfig.json missing.');
if (!exists('vite.config.ts')) errors.push('vite.config.ts missing.');

if (errors.length){ console.error('Stack drift:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log('Stack check OK');
