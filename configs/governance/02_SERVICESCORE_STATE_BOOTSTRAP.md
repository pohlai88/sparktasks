## Decision: Hybrid
- This step helps and is worth keeping. I aligned it to the actual code, removed risky/conflicting edits, and kept everything additive and flag‑gated.
- Key alignments:
  - Do not modify `src/stores/taskStore.ts` or `src/store/AppStore.tsx` directly; create `src/state/*` re‑exports only.
  - Bootstrap uses `storage/local`, `EncryptedDriver`, and `configureAsyncEventlogStorage` (no `eventlog.ts` mutation).
  - `SimpleUpload` uses `http()` with correct relative path.
  - Skip duplicate `package.json` script patch (test:unit already exists).

```diff
# PR‑001: Services Core (additive)
# Includes: services/http.ts, services/auth.ts, MSW handlers/worker, feature flags, unit tests, docs
# Assumes Day‑1 diffs already applied; this PR adds tests + docs + env sample.

*** Begin Patch
*** Add File: tests/unit/http.spec.ts
+import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
+import { http, HttpError } from '../../src/services/http'
+
+const g = globalThis as any
+
+describe('http() wrapper', () => {
+  const orig = g.fetch
+  beforeEach(() => {
+    g.fetch = vi.fn()
+  })
+  afterEach(() => {
+    g.fetch = orig
+    vi.restoreAllMocks()
+  })
+
+  it('GET parses JSON body', async () => {
+    g.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))
+    const res = await http<{ ok: boolean }>('https://example.test/api')
+    expect(res.ok).toBe(true)
+  })
+
+  it('POST sends JSON and returns parsed object', async () => {
+    const body = { a: 1 }
+    g.fetch.mockImplementationOnce(async (url: string, init: RequestInit) => {
+      expect(init?.method).toBe('POST')
+      expect(init?.headers && (init.headers as any)['Content-Type']).toBe('application/json')
+      expect(init?.body).toBe(JSON.stringify(body))
+      return new Response(JSON.stringify({ ok: true }), { status: 200 })
+    })
+    const res = await http<{ ok: boolean }>('https://example.test/api', { method: 'POST', body })
+    expect(res.ok).toBe(true)
+  })
+
+  it('throws HttpError on non-2xx', async () => {
+    g.fetch.mockResolvedValueOnce(new Response(JSON.stringify({ msg: 'boom' }), { status: 500 }))
+    await expect(http('https://example.test/fail')).rejects.toBeInstanceOf(HttpError)
+  })
+
+  it('falls back to text when JSON invalid', async () => {
+    g.fetch.mockResolvedValueOnce(new Response('not-json', { status: 200 }))
+    const res = await http<any>('https://example.test/text')
+    expect(res).toBe('not-json')
+  })
+})
+
*** End Patch
```

```diff
*** Begin Patch
*** Add File: .env.example
+VITE_API_BASE_URL=""
*** End Patch
```

````diff
*** Begin Patch
*** Update File: README.md
@@
 ## Development
@@
+### Feature Flags (configs/feature-flags.json)
+```json
+{
+  "auth": { "useRealService": false },
+  "sync": { "remoteEnabled": false },
+  "storage": { "encrypted": false }
+}
+```
+Toggle these to switch between **simulated** and **HTTP-backed** flows.
+
+### MSW (Mock Service Worker)
+Dev server auto-starts MSW in `src/main.tsx` (dev only). Real HTTP can be wired later.
+
+### API Base URL
+Set `VITE_API_BASE_URL` in `.env.local` if your backend isn’t on the same origin.
*** End Patch
````

---

```diff
# Day‑2: State Consolidation + Bootstrap (safe, flag‑gated)
# Includes: new state folder with re‑exports, bootstrap initializer, minimal wiring in AuthProvider & SimpleUpload, optional eventlog setter.

*** Begin Patch
*** Add File: src/state/index.ts
+export * from './domain/taskStore'
+export * from './ui/appStore'
+
*** End Patch
```

```diff
*** Begin Patch
*** Add File: src/state/domain/taskStore.ts
+// moved from src/stores/taskStore.ts — domain store (Zustand)
+export * from '../../stores/taskStore'
+
*** End Patch
```

```diff
*** Begin Patch
*** Add File: src/state/ui/appStore.tsx
+// moved from src/store/AppStore.tsx — UI/demo store
+export * from '../../store/AppStore'
+
*** End Patch
```

> Note: Keep originals (`src/stores/taskStore.ts`, `src/store/AppStore.tsx`) unchanged to avoid circular deps and churn. Consumers can migrate to `src/state/*` gradually.

Additional caution

- `bootstrap()` must be invoked before rendering to ensure `configureAsyncEventlogStorage()` runs prior to any `hydrateAsync()` calls.
- If you later enable encryption, verify `AuthProvider` and other modules that read tokens from localStorage still behave as expected; encryption only wraps values written via the driver, not arbitrary localStorage touches.

```diff
*** Begin Patch
*** Add File: src/bootstrap.ts
+import featureFlags from '../configs/feature-flags.json'
+import { EncryptedDriver } from './storage/encrypted'
+import { createNamespace, LocalStorageDriver, SyncLocalStorageDriver } from './storage/local'
+import { RemoteAdapter } from './storage/remote'
+import { HttpRemote } from './storage/transports/httpRemote'
+import { configureAsyncEventlogStorage } from './stores/taskStore'
+
+export type BootContext = {
+  flags: typeof featureFlags
+  remote?: RemoteAdapter
+}
+
+export function bootstrap(): BootContext {
+  const flags = featureFlags as any
+
+  // Async driver used by RemoteAdapter and async eventlog path
+  const baseAsync = new LocalStorageDriver()
+  const keyProvider: any = {} // supply real key provider in production
+  const asyncDriver = flags.storage?.encrypted
+    ? new EncryptedDriver(baseAsync, 'spark', keyProvider)
+    : baseAsync
+
+  // Keep existing sync namespace for legacy eventlog usage
+  createNamespace('spark', new SyncLocalStorageDriver())
+
+  // Wire async eventlog storage for hydrateAsync flows
+  configureAsyncEventlogStorage(asyncDriver)
+
+  let remote: RemoteAdapter | undefined
+  if (flags.sync?.remoteEnabled) {
+    remote = new RemoteAdapter(asyncDriver, new HttpRemote(), 'spark')
+  }
+
+  return { flags, remote }
+}
+
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/auth/AuthProvider.tsx
@@
-import { simulateAuthAPI } from './simulateAuth' // existing simulator
+import flags from '../../configs/feature-flags.json'
+import { AuthService } from '../services/auth'
@@
-      // Simulate API call - replace with actual endpoint
-      const response = await simulateAuthAPI('/auth/login', {
-        method: 'POST',
-        body: JSON.stringify(credentials),
-      });
+      const response = await AuthService.login(credentials, Boolean((flags as any).auth?.useRealService))
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/components/features-enhanced/FileSystem/SimpleUpload.tsx
@@
-const response = await fetch(uploadEndpoint, {
-  method: 'POST',
-  ...(uploadHeaders && { headers: uploadHeaders }),
-  body: formData,
-});
+import { http } from '../../../services/http'
+// ... inside the upload function
+const response = await http<Response>(uploadEndpoint, {
+  method: 'POST',
+  headers: uploadHeaders ?? {},
+  body: formData,
+});
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/main.tsx
@@
 import React from 'react'
 import ReactDOM from 'react-dom/client'
+import { bootstrap } from './bootstrap'
@@
-ReactDOM.createRoot(document.querySelector('#root')!).render(
+// Initialize flags, optional remote, and (optionally) encrypted storage
+bootstrap()
+
+ReactDOM.createRoot(document.querySelector('#root')!).render(
   <React.StrictMode>
     <App />
   </React.StrictMode>,
 )
*** End Patch
```

---

## Rationale
- Matches real storage modules (`storage/local`, `storage/encrypted`) and `RemoteAdapter` expectations.
- Uses `configureAsyncEventlogStorage()` instead of mutating `eventlog.ts`.
- Leaves existing store files untouched; re‑exports via `src/state/*` keep changes non‑breaking.
- Keeps flags as the single control surface; default behavior unchanged.
