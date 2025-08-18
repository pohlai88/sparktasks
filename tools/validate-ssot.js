const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const docs = path.join(root, 'docs', 'SSOT.md');
const short = path.join(root, 'SHORT_PROMPT.md');

function fail(msg) {
  console.error('❌ SSOT CHECK FAILED:', msg);
  process.exitCode = 2;
}

function warn(msg) {
  console.warn('⚠️  SSOT WARNING:', msg);
}

function normalizeWhitespace(s) {
  return s.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
}

function generateDiffSnippet(expected, actual, context = 50) {
  const expLines = expected.split('\n');
  const actLines = actual.split('\n');
  
  // Find first differing line
  let diffLineIndex = 0;
  while (diffLineIndex < Math.min(expLines.length, actLines.length)) {
    if (expLines[diffLineIndex] !== actLines[diffLineIndex]) {
      break;
    }
    diffLineIndex++;
  }
  
  if (diffLineIndex === Math.min(expLines.length, actLines.length) && expLines.length !== actLines.length) {
    // Files differ in length
    return {
      location: `Line ${diffLineIndex + 1} (length difference)`,
      expected: `Expected ${expLines.length} lines`,
      actual: `Got ${actLines.length} lines`
    };
  }
  
  const start = Math.max(0, diffLineIndex - 2);
  const end = Math.min(expLines.length, diffLineIndex + 3);
  
  return {
    location: `Line ${diffLineIndex + 1}`,
    expected: expLines.slice(start, end).map((line, i) => 
      `${start + i + 1}: ${line}`).join('\n'),
    actual: actLines.slice(start, Math.min(actLines.length, end)).map((line, i) => 
      `${start + i + 1}: ${line}`).join('\n')
  };
}

let ok = true;
let section1;

// Validate docs/SSOT.md
if (!fs.existsSync(docs)) {
  fail('docs/SSOT.md not found');
  console.error('   📝 Create docs/SSOT.md with the canonical meta-prompt');
  ok = false;
} else {
  const txt = fs.readFileSync(docs, 'utf8');
  
  if (!txt.includes('Short System Prompt')) {
    warn('docs/SSOT.md: expected "Short System Prompt" header');
  }

  // Enhanced header version/date check
  const headerMatch = txt.match(/v(\d+)\.(\d+)\.(\d+),\s*(\d{4})-(\d{2})-(\d{2})/);
  if (!headerMatch) {
    fail('docs/SSOT.md header missing version and date in format "vX.Y.Z, YYYY-MM-DD"');
    console.error('   📝 Example: v1.0.1, 2025-08-15');
    console.error('   🔍 Current header should be near the top of the file');
    ok = false;
  } else {
    const [, major, minor, patch, year, month, day] = headerMatch;
    console.log(`✅ Found version v${major}.${minor}.${patch} dated ${year}-${month}-${day}`);
  }

  // Extract Section 1 content with better error handling
  const sectionMatch = txt.match(/## 1\) Short System Prompt([\s\S]*?)(?:\n## |$)/);
  if (!sectionMatch) {
    fail('Could not extract Section 1 (Short System Prompt) from docs/SSOT.md');
    console.error('   📝 Expected format: ## 1) Short System Prompt');
    console.error('   🔍 Section should contain the text to sync with SHORT_PROMPT.md');
    ok = false;
  } else {
    section1 = sectionMatch[1].trim();
    console.log(`✅ Extracted Section 1 (${section1.length} characters)`);
  }
}

// Validate SHORT_PROMPT.md
if (!fs.existsSync(short)) {
  fail('SHORT_PROMPT.md not found');
  console.error('   📝 Create SHORT_PROMPT.md with Section 1 content from docs/SSOT.md');
  ok = false;
} else {
  const shortContent = fs.readFileSync(short, 'utf8');
  
  if (!shortContent.includes('You are building')) {
    warn('SHORT_PROMPT.md: does not contain expected "You are building" prompt');
  }

  // Enhanced drift detection with diff output
  if (section1) {
    const normDocs = normalizeWhitespace(section1);
    const normShort = normalizeWhitespace(shortContent);
    
    if (normDocs !== normShort) {
      fail('SHORT_PROMPT.md does not match Section 1 of docs/SSOT.md');
      console.error('\n📊 DETAILED MISMATCH ANALYSIS:');
      console.error('================================');
      
      // Character-level comparison
      const charDiff = Math.abs(normDocs.length - normShort.length);
      console.error(`📏 Length difference: ${charDiff} characters`);
      console.error(`   docs/SSOT.md Section 1: ${normDocs.length} chars`);
      console.error(`   SHORT_PROMPT.md: ${normShort.length} chars`);
      
      // Generate diff snippet
      const diff = generateDiffSnippet(section1, shortContent);
      console.error(`\n🔍 First difference at: ${diff.location}`);
      console.error('\n📄 Expected (docs/SSOT.md Section 1):');
      console.error(diff.expected);
      console.error('\n📄 Actual (SHORT_PROMPT.md):');
      console.error(diff.actual);
      
      console.error('\n🔧 TO FIX:');
      console.error('1. Copy Section 1 content from docs/SSOT.md');
      console.error('2. Replace entire contents of SHORT_PROMPT.md');
      console.error('3. Commit both files in the same PR');
      console.error('4. Ensure version header is incremented in docs/SSOT.md');
      
      ok = false;
    } else {
      console.log('✅ SHORT_PROMPT.md matches Section 1 of docs/SSOT.md');
    }
  }
}

if (!ok) {
  console.error('\n💡 SSOT SYNC REMINDER:');
  console.error('Any change in tone, phrasing, or structure requires sync.');
  console.error('See CONTRIBUTING.md for detailed sync requirements.');
  process.exit(2);
}

console.log('\n🎉 SSOT validation passed - files are in sync!');
