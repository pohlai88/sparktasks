```diff
# PR‑008: SQLite WASM FTS5 Local Index + Search Service
# Goal: Fast, offline search with FTS5; graceful fallback to in‑memory filter when WASM isn’t available.
# Scope: official SQLite WASM (FTS5 enabled) or fallback to memory, Search service (sqlite‑wasm + memory engines), bootstrap hook, docs, scripts, unit tests.

*** Begin Patch
*** Update File: package.json
@@
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview",
     "test:unit": "vitest run",
     "test:e2e": "playwright test",
     "test:smoke": "playwright test tests/e2e/tests/smoke.*.spec.ts",
     "test:remote": "vitest run tests/unit/httpRemote.spec.ts",
     "postinstall": "node scripts/copy-sqlite-wasm.mjs || true",
     "bff:dev": "pnpm -C bff dev",
     "test:bootstrap": "vitest run tests/unit/bootstrap.spec.ts"
   },
   "dependencies": {
     "@sqlite.org/sqlite-wasm": "^3.46.0"
   },
*** End Patch
```

```diff
*** Begin Patch
*** Add File: scripts/copy-sqlite-wasm.mjs
// Copies official SQLite wasm binary into Vite public dir so sqlite3InitModule can locate it.
import fs from 'node:fs'
import path from 'node:path'

const src = path.resolve('node_modules/@sqlite.org/sqlite-wasm/sqlite3.wasm')
const dstDir = path.resolve('public')
const dst = path.join(dstDir, 'sqlite3.wasm')

try {
  if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true })
  fs.copyFileSync(src, dst)
  console.log('[postinstall] Copied sqlite3.wasm → public/')
} catch (e) {
  console.warn('[postinstall] Could not copy sqlite3.wasm:', e?.message || e)
}
*** End Patch
```

```diff
*** Begin Patch
*** Add File: src/search/sqlite-wasm.ts
import sqlite3InitModule from '@sqlite.org/sqlite-wasm'

export type SearchRow = { id: string; score: number; snippet: string }

export class SqliteFtsWasmIndex {
  private sqlite3: any | null = null
  private db: any | null = null
  private initialized = false

  async init(): Promise<boolean> {
    try {
      this.sqlite3 = await sqlite3InitModule({ locateFile: (f: string) => `/${f}` })
      this.db = new this.sqlite3.oo1.DB()
      this.db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS tasks_fts USING fts5(id UNINDEXED, text, tokenize='porter');`)
      this.initialized = true
      return true
    } catch {
      this.initialized = false
      return false
    }
  }

  get ready() { return this.initialized }

  upsert(id: string, text: string) {
    if (!this.db) return
    this.db.exec({ sql: `DELETE FROM tasks_fts WHERE id = ?1`, bind: [id] })
    this.db.exec({ sql: `INSERT INTO tasks_fts(id, text) VALUES (?1, ?2)`, bind: [id, text] })
  }

  bulkUpsert(rows: Array<{ id: string; text: string }>) {
    if (!this.db) return
    this.db.exec('BEGIN')
    for (const r of rows) {
      this.db.exec({ sql: `DELETE FROM tasks_fts WHERE id = ?1`, bind: [r.id] })
      this.db.exec({ sql: `INSERT INTO tasks_fts(id, text) VALUES (?1, ?2)`, bind: [r.id, r.text] })
    }
    this.db.exec('COMMIT')
  }

  search(query: string, limit = 20): SearchRow[] {
    if (!this.db) return []
    const out: SearchRow[] = []
    this.db.exec({
      sql: `SELECT id, bm25(tasks_fts) AS score, snippet(tasks_fts, 0, '<b>', '</b>', '…', 12) AS snippet
            FROM tasks_fts WHERE tasks_fts MATCH ?1 ORDER BY score LIMIT ?2`,
      bind: [query, limit],
      rowMode: 'object',
      callback: (row: any) => out.push({ id: String(row.id), score: Number(row.score), snippet: String(row.snippet) })
    })
    return out
  }
}
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/services/search.ts
@@
import flags from '../../configs/feature-flags.json'
import { SqliteFtsWasmIndex } from '../search/sqlite-wasm'
import { MemoryIndex } from '../search/memory'

export type IndexRow = { id: string; text: string }
export type SearchHit = { id: string; score: number; snippet: string }

class SearchServiceImpl {
  private sqlite = new SqliteFtsWasmIndex()
  private memory = new MemoryIndex()
  private useSqlite = false
  private isInit = false
  private cfg = (flags as any).search ?? { useSqliteFts: false, minQueryLen: 2, limit: 20 }

  async init() {
    if (this.isInit) return
    if (this.cfg.useSqliteFts) {
      this.useSqlite = await this.sqlite.init()
    }
    this.isInit = true
  }

  /** Call once on app boot (non-blocking). */
  async initOnBoot() { try { await this.init() } catch {} }

  bulkIndex(rows: IndexRow[]) {
    if (this.useSqlite) this.sqlite.bulkUpsert(rows)
    else this.memory.bulkUpsert(rows)
  }
  upsert(row: IndexRow) {
    if (this.useSqlite) this.sqlite.upsert(row.id, row.text)
    else this.memory.upsert(row.id, row.text)
  }
  search(query: string, limit = this.cfg.limit): SearchHit[] {
    if (!query || query.length < (this.cfg.minQueryLen ?? 2)) return []
    return this.useSqlite ? this.sqlite.search(query, limit) : this.memory.search(query, limit)
  }
}

export const SearchService = new SearchServiceImpl()

/**
 * Optional boot helper: initialize engine and seed with a naive projection from your domain.
 * Adjust as needed to pull actual tasks.
 */
export async function initSearchOnBoot(seed?: IndexRow[]) {
  await SearchService.initOnBoot()
  if (seed?.length) SearchService.bulkIndex(seed)
}
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/main.tsx
@@
 import React from 'react'
 import ReactDOM from 'react-dom/client'
 import { bootstrap } from './bootstrap'
 import { initSearchOnBoot } from './services/search'
@@
 // Initialize flags, optional encrypted storage, and optional remote
 bootstrap()
 // Initialize search engine (non-blocking). Optionally pass a seed later.
 void initSearchOnBoot()
*** End Patch
```

```diff
*** Begin Patch
*** Add File: tests/unit/search.memory.spec.ts
import { describe, it, expect } from 'vitest'
import { MemoryIndex } from '../../src/search/memory'

describe('MemoryIndex', () => {
  it('indexes and finds text', () => {
    const mem = new MemoryIndex()
    mem.bulkUpsert([
      { id: '1', text: 'Write unit tests for search service' },
      { id: '2', text: 'Fix bootstrap bug and add docs' },
    ])
    const hits = mem.search('search')
    expect(hits.length).toBe(1)
    expect(hits[0].id).toBe('1')
  })
})
*** End Patch
```

```diff
*** Begin Patch
*** Update File: README.md
### Local Search (FTS5)
The app supports **SQLite WASM FTS5** search via the official `@sqlite.org/sqlite-wasm` build (FTS5 enabled), with a graceful fallback. Configure in `configs/feature-flags.json`:

```json
"search": { "useSqliteFts": true, "minQueryLen": 2, "limit": 20 }
```

On `postinstall`, the `sqlite3.wasm` binary is copied into `public/`. The engine initializes on app load. Seed the index by calling `initSearchOnBoot(seed)` or `SearchService.bulkIndex(rows)` with your domain projection.
*** End Patch
```

```diff
*** Begin Patch
*** Update File: docs/QUICKSTART_MATRIX.md
 | **Encrypted Local** | Local encryption at rest | `storage.encrypted=true` | (none) | `pnpm dev` | Tasks still load after refresh; storage blobs look encrypted |
 | **Local FTS5 Search** | Fast offline search | `search.useSqliteFts=true` | (none) | `pnpm i` (copies sqlite3.wasm) → `pnpm dev` | Search returns ranked/snippeted hits even offline |
*** End Patch
```

```diff
*** Begin Patch
*** Update File: docs/SEARCH.md
# Local Search Service

## Engines
- **SQLite FTS5 (preferred):** uses the official `@sqlite.org/sqlite-wasm` with an FTS5 virtual table (`tasks_fts`). Requires the wasm binary available at `/sqlite3.wasm` (copied on postinstall).
- **Memory fallback:** simple case‑insensitive substring match with snippet assembly.

## API
```ts
import { SearchService, initSearchOnBoot } from '@/services/search'

await initSearchOnBoot() // non-blocking; picks engine from flags
SearchService.bulkIndex([{ id: 't1', text: 'Design: add BFF stub' }])
const hits = SearchService.search('BFF') // → [{ id, score, snippet }]
```

## Notes

* FTS5 queries support operators (e.g., `design NEAR/5 bff`). See SQLite FTS5 docs.
* For large datasets, consider moving index ops to a Web Worker.
  \*\*\* End Patch

```

---

## PR‑008 Checklist (updated)
- [x] Official `@sqlite.org/sqlite-wasm` integrated; wasm auto‑copied to `public/`
- [x] `SqliteFtsWasmIndex` + `MemoryIndex` engines
- [x] `SearchService` with boot helper and flags
- [x] Non‑blocking init hook in `main.tsx`
- [x] Unit test for memory engine; docs + quickstart entry
- [x] No breaking changes; fully optional by flags
```
