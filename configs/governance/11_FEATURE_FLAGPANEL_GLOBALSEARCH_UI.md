```diff
# PR‑010: Feature‑Flag Panel + Global Search UI
# Goal: In‑app dev flags toggles (persisted override) and a command‑palette style search (⌘/Ctrl+K) powered by SearchService.
# Scope: new components, minimal wiring in App, docs.

*** Begin Patch
*** Add File: src/components/dev/FlagPanel.tsx
import React, { useEffect, useMemo, useState } from 'react'
import baseFlags from '../../../configs/feature-flags.json'

type AnyFlags = Record<string, any>

const LS_KEY = '__spark_flags_override'

function deepMerge<T extends AnyFlags>(a: T, b: Partial<T>): T {
  const out: AnyFlags = Array.isArray(a) ? [...a] : { ...a }
  for (const k of Object.keys(b || {})) {
    const av = (a as AnyFlags)[k]
    const bv = (b as AnyFlags)[k]
    if (av && typeof av === 'object' && !Array.isArray(av) && bv && typeof bv === 'object' && !Array.isArray(bv)) {
      out[k] = deepMerge(av, bv)
    } else {
      out[k] = bv
    }
  }
  return out as T
}

function useFlags() {
  const [override, setOverride] = useState<AnyFlags>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} }
  })
  const effective = useMemo(() => deepMerge(baseFlags as AnyFlags, override as AnyFlags), [override])
  const setFlag = (path: string, value: any) => {
    const parts = path.split('.')
    const next = { ...override }
    let cur: AnyFlags = next
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      if (i === parts.length - 1) cur[p] = value
      else cur = cur[p] = cur[p] ? { ...cur[p] } : {}
    }
    setOverride(next)
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)) } catch {}
  }
  const clear = () => { try { localStorage.removeItem(LS_KEY) } catch {}; setOverride({}) }
  return { effective, override, setFlag, clear }
}

export default function FlagPanel() {
  if (!(import.meta as any).env?.DEV) return null
  const { effective, override, setFlag, clear } = useFlags()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) { e.preventDefault(); setOpen(v => !v) }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* Tiny dev badge to open */}
      <button onClick={() => setOpen(true)} style={{ position: 'fixed', right: 10, bottom: 10, opacity: 0.6, fontSize: 12, padding: '6px 8px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', zIndex: 60 }}>Flags</button>
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 70 }} onClick={() => setOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 20, bottom: 20, width: 360, background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong>Dev Flags</strong>
              <span style={{ fontSize: 12, opacity: 0.7 }}>Ctrl/⌘+Shift+F</span>
            </div>
            <Toggle label="Auth: useRealService" checked={!!(effective as any)?.auth?.useRealService} onChange={v => setFlag('auth.useRealService', v)} />
            <Toggle label="Sync: remoteEnabled" checked={!!(effective as any)?.sync?.remoteEnabled} onChange={v => setFlag('sync.remoteEnabled', v)} />
            <Toggle label="Storage: encrypted" checked={!!(effective as any)?.storage?.encrypted} onChange={v => setFlag('storage.encrypted', v)} />
            <hr style={{ margin: '10px 0', borderColor: '#eee' }} />
            <Toggle label="Search: useSqliteFts" checked={!!(effective as any)?.search?.useSqliteFts} onChange={v => setFlag('search.useSqliteFts', v)} />
            <Toggle label="Search: liveIndex" checked={!!(effective as any)?.search?.liveIndex} onChange={v => setFlag('search.liveIndex', v)} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => { /* override is already persisted by setFlag */ location.reload() }} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#f5f5f5' }}>Apply & Reload</button>
              <button onClick={() => { clear(); location.reload() }} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}>Clear Overrides</button>
              <button onClick={() => setOpen(false)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}>Close</button>
            </div>
            <p style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>Most changes apply on reload (bootstrap reads overrides in dev).</p>
          </div>
        </div>
      )}
    </>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
      <span style={{ fontSize: 13 }}>{label}</span>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    </label>
  )
}

*** End Patch
```

```diff
*** Begin Patch
*** Add File: src/components/search/GlobalSearch.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import flags from '../../../configs/feature-flags.json'
import { SearchService } from '../../services/search'

type Hit = { id: string; score: number; snippet: string }

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<Hit[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const minLen = (flags as any)?.search?.minQueryLen ?? 2

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if ((e.metaKey || e.ctrlKey) && k === 'k') { e.preventDefault(); setOpen(true) }
      if (k === 'escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => {
      if (!q || q.length < minLen) { setHits([]); return }
      const res = SearchService.search(q)
      setHits(res as Hit[])
    }, 120)
    return () => clearTimeout(id)
  }, [q, open])

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 0) }, [open])

  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 80 }} onClick={() => setOpen(false)}>
      <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', left: '50%', top: '15%', transform: 'translateX(-50%)', width: 'min(800px, 92vw)', background: '#fff', borderRadius: 12, boxShadow: '0 16px 36px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 8 }}>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search… (⌘/Ctrl+K)" style={{ width: '100%', border: 'none', outline: 'none', fontSize: 16 }} />
        </div>
        <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
          {hits.length === 0 && <Empty q={q} />}
          {hits.map(h => (
            <div key={h.id} style={{ padding: '12px 14px', borderBottom: '1px solid #f3f3f3', cursor: 'pointer' }} onClick={() => setOpen(false)}>
              <div style={{ fontSize: 12, opacity: 0.6 }}>#{h.id}</div>
              <div style={{ fontSize: 14 }} dangerouslySetInnerHTML={{ __html: h.snippet }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Empty({ q }: { q: string }) {
  const hint = useMemo(() => (
    <ul style={{ margin: 0, paddingLeft: 18 }}>
      <li>Try a longer query</li>
      <li>Use quotes or terms like <code>design</code>, <code>status</code>, etc.</li>
      <li>Hit <b>Esc</b> to close</li>
    </ul>
  ), [])
  return (
    <div style={{ padding: '16px 14px', color: '#666' }}>
      {q ? <>No results for <b>{q}</b>. {hint}</> : <>Start typing to search. {hint}</>}
    </div>
  )
}

*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/App.tsx
@@
 import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens'
 import GlobalSearch from './components/search/GlobalSearch'
 import FlagPanel from './components/dev/FlagPanel'
@@
 export function App() {
   // existing app composition
   return (
     <>
       <RailwayConductor />
       <RailwayMap />
       <RailwayStation />
       {/* Global overlays */}
       <GlobalSearch />
       <FlagPanel />
     </>
   )
 }
*** End Patch
```

```diff
*** Begin Patch
*** Update File: README.md
@@
+### Dev Flag Panel
+- Open with **Ctrl/⌘+Shift+F** or click the **Flags** badge (bottom‑right).
+- Changes write to a dev‑only override stored in `localStorage.__spark_flags_override`.
+- Click **Apply & Reload** to re‑bootstrap with new flags.

+### Global Search (Command Palette)
+- Open with **⌘/Ctrl+K**.
+- Results are powered by `SearchService` and work with either **SQLite FTS5** or **memory** fallback (configurable in flags).
*** End Patch
```

---

## PR‑010 Checklist

* [x] Dev Flag Panel (Ctrl/⌘+Shift+F or floating button) that writes `__spark_flags_override`
* [x] Global Search overlay (⌘/Ctrl+K) querying `SearchService`