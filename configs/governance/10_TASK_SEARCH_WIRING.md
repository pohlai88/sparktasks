```diff
# PR‑009: Wire Task domain → SearchService (Seeding + Live Updates)
# Goal: Automatically index tasks into the local SearchService (SQLite FTS5 or memory fallback), with initial seeding and live updates.
# Scope: feature flag, SearchService delete support, wiring helper, boot hook, unit test, docs.

*** Begin Patch
*** Update File: configs/feature-flags.json
@@
   "search": {
-    "useSqliteFts": false,
-    "minQueryLen": 2,
-    "limit": 20
+    "useSqliteFts": false,
+    "minQueryLen": 2,
+    "limit": 20,
+    "liveIndex": false
   }
 }
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/search/sqlite-wasm.ts
@@
 export class SqliteFtsWasmIndex {
@@
   bulkUpsert(rows: Array<{ id: string; text: string }>) {
@@
   }

   search(query: string, limit = 20): SearchRow[] {
@@
   }

  remove(id: string) {
    if (!this.db) return
    this.db.exec({ sql: `DELETE FROM tasks_fts WHERE id = ?1`, bind: [id] })
  }
 }
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/search/memory.ts
@@
 export class MemoryIndex {
   private items: MemoryItem[] = []
@@
   }
   search(query: string, limit = 20): MemoryHit[] {
@@
   }
  remove(id: string) {
    this.items = this.items.filter(r => r.id !== id)
  }
 }
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/services/search.ts
@@
   bulkIndex(rows: IndexRow[]) {
@@
   }
   upsert(row: IndexRow) {
@@
   }
   search(query: string, limit = this.cfg.limit): SearchHit[] {
@@
   }
  remove(id: string) {
    if (this.useSqlite) this.sqlite.remove(id)
    else this.memory.remove(id)
  }
 }
@@
 export async function initSearchOnBoot(seed?: IndexRow[]) {
@@
 }
*** End Patch
```

```diff
*** Begin Patch
*** Add File: src/services/search-bridge.ts
import flags from '../../configs/feature-flags.json'
import { SearchService } from './search'
import { useTaskStore } from '../stores/taskStore'

type TaskAny = Record<string, any>

function projectTaskToText(t: TaskAny): string {
  const parts: string[] = []
  const push = (v: any) => {
    if (!v) return
    if (Array.isArray(v)) { for (const x of v) push(x) }
    else if (typeof v === 'object') { for (const k of Object.keys(v)) push(v[k]) }
    else parts.push(String(v))
  }
  push(t.title ?? t.name)
  push(t.description ?? t.notes)
  push(t.labels)
  push(t.status)
  push(t.comments?.map((c: any) => c.text ?? c.content))
  push(t.subtasks?.map((s: any) => s.title ?? s.name))
  return parts.join(' ').trim()
}

function pickTasksFromState(state: any): Array<{ id: string; text: string }> {
  const list: TaskAny[] = Array.isArray(state?.tasks) ? state.tasks : Array.isArray(state?.items) ? state.items : []
  return list
    .filter((t) => t && (t.id || t.uid || t.key))
    .map((t) => ({ id: String(t.id ?? t.uid ?? t.key), text: projectTaskToText(t) }))
}

/** Seed index once and subscribe to live changes if enabled by flags. */
export async function wireTaskSearch() {
  const cfg = (flags as any).search ?? {}
  if (!cfg.liveIndex) return // disabled by default

  // Initial seed (best-effort). We don't fail if store isn't ready yet.
  const seed = pickTasksFromState(useTaskStore.getState())
  if (seed.length) {
    queueMicrotask(() => SearchService.bulkIndex(seed))
  }

  // Live updates: subscribe to tasks array changes.
  let lastMap = new Map<string, string>()
  const computeMap = (rows: Array<{ id: string; text: string }>) => {
    const m = new Map<string, string>()
    for (const r of rows) m.set(r.id, r.text)
    return m
  }
  const applyDiff = (nextRows: Array<{ id: string; text: string }>) => {
    const nextMap = computeMap(nextRows)
    // removals
    for (const id of lastMap.keys()) {
      if (!nextMap.has(id)) SearchService.remove(id)
    }
    // upserts
    for (const [id, text] of nextMap.entries()) {
      if (lastMap.get(id) !== text) SearchService.upsert({ id, text })
    }
    lastMap = nextMap
  }
  lastMap = computeMap(seed)
  const unsubscribe = useTaskStore.subscribe((s: any) => pickTasksFromState(s), applyDiff)
  if (import.meta.env.DEV) (window as any).__spark_search_unsub = unsubscribe
}

*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/main.tsx
@@
 import { bootstrap } from './bootstrap'
 import { initSearchOnBoot } from './services/search'
 import { wireTaskSearch } from './services/search-bridge'
@@
 bootstrap()
 // Initialize search engine (non-blocking). Optionally pass a seed later.
 void initSearchOnBoot()
 // Wire task domain → search (seed + live), gated by flags
 void wireTaskSearch()
*** End Patch
```

```diff
*** Begin Patch
*** Add File: tests/unit/search.bridge.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock flags: enable live index
vi.mock('../../configs/feature-flags.json', () => ({ default: ({ search: { liveIndex: true } }) }))

// Spy on SearchService
const upsert = vi.fn()
const bulk = vi.fn()
const remove = vi.fn()
vi.mock('../../src/services/search', async (orig) => {
  const mod = await orig()
  return { ...mod, SearchService: { upsert, bulkIndex: bulk, remove } }
})

// Mock store with minimal subscribe/getState shape
const state = { tasks: [{ id: '1', title: 'Alpha' }] as any[] }
const subs: Array<(s: any) => void> = []
vi.mock('../../src/stores/taskStore', () => ({
  useTaskStore: {
    getState: () => state,
    subscribe: (sel: (s:any)=>any, cb: (v:any)=>void) => { subs.push(() => cb(sel(state))); return () => {} },
  },
}))

import { wireTaskSearch } from '../../src/services/search-bridge'

describe('wireTaskSearch', () => {
  beforeEach(() => { upsert.mockClear(); bulk.mockClear(); remove.mockClear() })
  afterEach(() => { subs.length = 0 })

  it('seeds and applies diffs on changes', async () => {
    await wireTaskSearch()
    expect(bulk).toHaveBeenCalledTimes(1)
    state.tasks = [{ id: '1', title: 'Beta' }, { id: '2', title: 'Gamma' }] as any
    subs.forEach((fn) => fn())
    expect(remove).toHaveBeenCalledTimes(0)
    expect(upsert).toHaveBeenCalledTimes(2)
  })
})

*** End Patch
```

````diff
*** Begin Patch
*** Update File: docs/SEARCH.md
@@
 ## Live Indexing from Tasks
 Enable flag `search.liveIndex=true` to automatically seed and live‑update the search index from the task store.
 
```ts
// Boot wiring (already called from main.tsx):
import { wireTaskSearch } from '@/services/search-bridge'
void wireTaskSearch()
```
 
Projection is generic and collects `title/name`, `description/notes`, `labels`, `status`, `comments[].text`, and `subtasks[].title`. Adjust `projectTaskToText` in `src/services/search-bridge.ts` if your schema differs.
*** End Patch
````

---

## PR‑009 Checklist
- [x] Added `search.liveIndex` flag (default **false**)
- [x] Delete support in SearchService + engines
- [x] `search-bridge.ts` to seed and live‑sync from Zustand task store
- [x] Boot hook in `main.tsx`
- [x] Unit test for wiring behavior
- [x] Docs updated

## Rollback
- `git revert <SHA-PR009>`
```
