# PR‑003: Bootstrap & Upload (aligned v2)
# Goal: Initialize storage/remote via a single bootstrap, and route file uploads through the shared HTTP client.
# Scope: add src/bootstrap.ts, wire it in main.tsx, refactor SimpleUpload → http(), unit tests, docs.

*** Begin Patch
*** Add File: src/bootstrap.ts
import featureFlags from '../configs/feature-flags.json'
import { EncryptedDriver } from './storage/encrypted'
import { createNamespace, LocalStorageDriver, SyncLocalStorageDriver } from './storage/local'
import { RemoteAdapter } from './storage/remote'
import { HttpRemote } from './storage/transports/httpRemote'
import { configureAsyncEventlogStorage } from './stores/taskStore'

export type BootContext = {
  flags: typeof featureFlags
  remote?: RemoteAdapter
}

export function bootstrap(): BootContext {
  const flags = featureFlags as any

  // Async driver for RemoteAdapter and async eventlog path
  const baseAsync = new LocalStorageDriver()
  const keyProvider: any = {} // supply real key provider in production
  const asyncDriver = flags.storage?.encrypted
    ? new EncryptedDriver(baseAsync, 'spark', keyProvider)
    : baseAsync

  // Preserve legacy sync namespace for existing eventlog sync APIs
  createNamespace('spark', new SyncLocalStorageDriver())

  // Wire async eventlog storage for hydrateAsync flows
  configureAsyncEventlogStorage(asyncDriver)

  let remote: RemoteAdapter | undefined
  if (flags.sync?.remoteEnabled) {
    remote = new RemoteAdapter(asyncDriver, new HttpRemote(), 'spark')
  }

  return { flags, remote }
}

*** End Patch
```

```diff
# (intentionally no eventlog.ts mutation) — use configureAsyncEventlogStorage() from task store.
```

```diff
*** Begin Patch
*** Update File: src/components/features-enhanced/FileSystem/SimpleUpload.tsx
@@
-import { http, HttpError } from '../../../../services/http'
+import { http, HttpError } from '../../../services/http'
@@
-let response: Response | undefined
-try {
-  response = await http<Response>(uploadEndpoint, {
-    method: 'POST',
-    headers: uploadHeaders ?? {},
-    body: formData,
-  })
-} catch (e) {
-  const msg = e instanceof HttpError ? `Upload failed: ${e.status}` : 'Upload failed'
-  // surface to UI (toast/log as appropriate in your component)
-  throw new Error(msg)
-}
+let response: Response | undefined
+try {
+  response = await http<Response>(uploadEndpoint, {
+    method: 'POST',
+    headers: uploadHeaders ?? {},
+    body: formData,
+  })
+} catch (e) {
+  const msg = e instanceof HttpError ? `Upload failed: ${e.status}` : 'Upload failed'
+  throw new Error(msg)
+}
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
+// Initialize flags, optional encrypted storage, and optional remote
+bootstrap()
*** End Patch
```

```diff
*** Begin Patch
*** Add File: tests/unit/bootstrap.spec.ts
+import { describe, it, expect, vi, beforeEach } from 'vitest'
+
+// Mock flags per test
+vi.mock('../../configs/feature-flags.json', () => ({ default: ({
+  auth: { useRealService: false },
+  sync: { remoteEnabled: false },
+  storage: { encrypted: false },
+}) }))
+
+// Spy on async storage wiring
+const wireSpy = vi.fn()
+vi.mock('../../src/stores/taskStore', async (orig) => {
+  const mod = await orig()
+  return { ...mod, configureAsyncEventlogStorage: (driver: unknown) => wireSpy(driver) }
+})
+
+import { bootstrap } from '../../src/bootstrap'
+
+describe('bootstrap()', () => {
+  beforeEach(() => wireSpy.mockClear())
+
+  it('wires async storage and returns context', () => {
+    const ctx = bootstrap()
+    expect(ctx.flags).toBeTruthy()
+    expect(wireSpy).toHaveBeenCalledTimes(1)
+    expect(ctx.remote).toBeUndefined()
+  })
+})
+
*** End Patch
```

````diff
*** Begin Patch
*** Update File: README.md
@@
+### Bootstrap
+The app initializes storage/remote via `bootstrap()` (see `src/bootstrap.ts`). It honors flags in `configs/feature-flags.json`:
+
+```json
+{
+  "auth": { "useRealService": false },
+  "sync": { "remoteEnabled": false },
+  "storage": { "encrypted": false }
+}
+```
+
+- Turn on encryption: set `storage.encrypted = true` (replace dev key in production).
+- Enable remote sync: set `sync.remoteEnabled = true` and provide the REST endpoints described in the Remote Transport contract.
+
+### File Uploads
+All uploads use the shared HTTP client (`services/http.ts`) for consistent error shapes. See `SimpleUpload.tsx`.
*** End Patch
````

```diff
*** Begin Patch
*** Update File: package.json
@@
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview",
     "test:unit": "vitest run",
+    "test:bootstrap": "vitest run tests/unit/bootstrap.spec.ts",
     "test:e2e": "playwright test"
   },
*** End Patch
```

---

## PR‑003 Checklist (v2)

* [x] Add `src/bootstrap.ts` and wire in `main.tsx`
* [x] Route `SimpleUpload` via `http()` and handle `HttpError`
* [x] Unit test for bootstrap with mocked flags + async wiring spy
* [x] README updates and script

## Rollback

* `git revert <SHA-PR003>`
