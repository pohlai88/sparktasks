const fs = require('fs');

function read(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}
const schema = read('.env.schema.json')
  ? JSON.parse(read('.env.schema.json'))
  : {};
const example = read('.env.example') || '';

const required = new Set(schema.required || []);
const exampleKeys = new Set(
  example
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => l.split('=')[0])
);

const missing = [...required].filter(k => !exampleKeys.has(k));
if (missing.length) {
  console.error(
    'Missing required env keys in .env.example:\n- ' + missing.join('\n- ')
  );
  process.exit(1);
}
console.log('Env schema check OK');
