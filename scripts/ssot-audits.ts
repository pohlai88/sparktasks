/* SSOT Drift Audits – aligns with FOUNDATION_GOVERNANCE_SSOT.md Section 5
 * Runs four checks:
 * 1) No bracketed numeric design utilities in JSX className (z|opacity|translate|scale|rotate)-[
 * 2) No @media usage in TS/TSX/JSX (must live in CSS)
 * 3) No TS imports in tailwind.config.*
 * 4) Only src/index.css contains @tailwind base/components/utilities
 */
import fg from 'fast-glob'
import { readFileSync } from 'fs'
import { relative } from 'path'

type Finding = { file: string; line: number; excerpt: string; rule: string }

function stripComments(text: string): string {
  // Remove block and line comments (rough but sufficient for audits)
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/.*$/gm, '')
}

function scanFileForRegex(file: string, regex: RegExp, rule: string, findings: Finding[], { strip = false }: { strip?: boolean } = {}) {
  let text = readFileSync(file, 'utf8')
  if (strip) text = stripComments(text)
  const lines = text.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) {
      findings.push({ file, line: i + 1, excerpt: lines[i].trim(), rule })
    }
  }
}

async function main() {
  const root = process.cwd()
  const findings: Finding[] = []

  // 1) No bracketed numeric design utilities in JSX className
  const files1 = await fg(['src/**/*.{ts,tsx,js,jsx}'], { ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**'] })
  const pattern1 = /\bclassName\s*=\s*[^\n]*\b(?:z|opacity|translate|scale|rotate)-\[/
  for (const f of files1) scanFileForRegex(f, pattern1, 'No bracketed numeric design utilities in JSX', findings)

  // 2) No @media in TS/TSX/JS/JSX (CSS only)
  const files2 = await fg(['src/**/*.{ts,tsx,js,jsx}'], { ignore: ['**/*.css', '**/*.test.*', '**/*.spec.*', '**/node_modules/**'] })
  const pattern2 = /@media\b/
  for (const f of files2) scanFileForRegex(f, pattern2, 'No @media in TS/TSX/JSX; use CSS', findings, { strip: true })

  // 3) No TS imports in tailwind.config.*
  const files3 = await fg(['tailwind.config.*'])
  const pattern3 = /^(\s*import\s+.+?from\s+['"].+['"]|\brequire\s*\(\s*['"].+['"]\s*\))/m
  for (const f of files3) scanFileForRegex(f, pattern3, 'No TS/JS imports in tailwind.config.*', findings, { strip: true })

  // 4) Only src/index.css contains @tailwind directives
  const files4 = await fg(['src/**/*.css'], { ignore: ['**/node_modules/**', '**/dist/**'] })
  const pattern4 = /@tailwind\s+(base|components|utilities)/
  for (const f of files4) {
    const text = readFileSync(f, 'utf8')
    if (pattern4.test(text)) {
      if (f.replace(/\\/g, '/') !== 'src/index.css') {
        scanFileForRegex(f, pattern4, 'Only src/index.css may contain @tailwind directives', findings)
      }
    }
  }

  if (findings.length > 0) {
    console.error('\nSSOT drift audit failed:')
    for (const x of findings) {
      console.error(`- [${x.rule}] ${relative(root, x.file)}:${x.line} → ${x.excerpt}`)
    }
    process.exit(1)
  } else {
    console.log('SSOT drift audit: OK')
  }
}

main().catch(err => {
  console.error('Audit error:', err)
  process.exit(1)
})


