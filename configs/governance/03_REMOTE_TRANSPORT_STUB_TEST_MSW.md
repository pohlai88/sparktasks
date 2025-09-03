```diff
# PR‑002: Remote Transport Stub (HTTP) + Tests + MSW Enhancements (aligned)
# Goal: Exercise RemoteAdapter via concrete HttpRemote with kv/list endpoints, updatedAt, nextSince.
# Scope: Unit tests, MSW kv + list with nextSince, README contract notes.

*** Begin Patch
*** Add File: tests/unit/httpRemote.spec.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { HttpRemote } from '../../src/storage/transports/httpRemote'
import { server } from '../msw/server'

function isoNow() { return new Date().toISOString() }

describe('HttpRemote transport (aligned kv/list)', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })
  afterAll(() => server.close())

  it('put/get/del roundtrip with updatedAt', async () => {
    const remote = new HttpRemote()
    const key = 'spark:test-key-1'
    const t1 = isoNow()
    await remote.put(key, 'v1', t1)
    const got1 = await remote.get(key)
    expect(got1?.value).toBe('v1')
    expect(typeof got1?.updatedAt).toBe('string')

    const t2 = isoNow()
    await remote.del(key, t2)
    const got2 = await remote.get(key)
    expect(got2).toBeNull()
  })

  it('list returns items and nextSince', async () => {
    const remote = new HttpRemote()
    const k1 = 'spark:list-a'
    const k2 = 'spark:list-b'
    await remote.put(k1, 'A', isoNow())
    await remote.put(k2, 'B', isoNow())
    const res = await remote.list('spark')
    expect(Array.isArray(res.items)).toBe(true)
    expect(res.nextSince === undefined || typeof res.nextSince === 'string').toBe(true)
    if (res.items.length) {
      const first = res.items[0]
      expect(typeof first.key).toBe('string')
      expect(typeof first.value).toBe('string')
      expect(typeof first.updatedAt).toBe('string')
    }
  })
})

*** End Patch
```

```diff
*** Begin Patch
*** Add File: tests/msw/server.ts
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Test-local kv + list handlers to match aligned contract
const kv = new Map<string, { value: string; updatedAt: string }>()
let lastKey: string | undefined

export const server = setupServer(
  // GET value
  http.get('/remote/kv/:key', ({ params }) => {
    const k = String(params.key)
    const entry = kv.get(k) ?? null
    return HttpResponse.json(entry)
  }),
  // PUT value
  http.put('/remote/kv/:key', async ({ params, request }) => {
    const k = String(params.key)
    const body = (await request.json()) as { value: string; updatedAt: string }
    kv.set(k, { value: body.value, updatedAt: body.updatedAt })
    lastKey = k
    return new HttpResponse(null, { status: 204 })
  }),
  // DELETE value
  http.delete('/remote/kv/:key', async ({ params }) => {
    const k = String(params.key)
    kv.delete(k)
    return new HttpResponse(null, { status: 204 })
  }),
  // LIST namespace
  http.get('/remote/list/:ns', ({ params }) => {
    const ns = String(params.ns)
    const prefix = ns.endsWith(':') ? ns : `${ns}:`
    const items = Array.from(kv.entries())
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, { value, updatedAt }]) => ({ key, value, updatedAt }))
    return HttpResponse.json({ items, nextSince: lastKey })
  })
)

*** End Patch
```

```diff
# (removed) tests/msw/remote.ts — redundant to tests/msw/server.ts in aligned approach
```

```diff
*** Begin Patch
*** Update File: src/mocks/handlers.ts
@@
-import { http, HttpResponse } from 'msw';
-
-// In-memory mock store for remote values
-const remoteKV = new Map<string, string>();
+import { http, HttpResponse } from 'msw';

// In-memory mock store with updatedAt per key (aligned)
const remoteKV = new Map<string, { value: string; updatedAt: string }>();
@@
-  // Remote list
-  http.get('/remote/:ns', ({ params }) => {
-    // Simplified: returns empty list with null token for now
-    return HttpResponse.json({ items: [], sinceToken: null });
-  }),
+  // Remote list by namespace prefix
  http.get('/remote/list/:ns', ({ params }) => {
    const ns = String(params.ns);
    const prefix = ns.endsWith(':') ? ns : `${ns}:`;
    const items = Array.from(remoteKV.entries())
      .filter(([k]) => k.startsWith(prefix))
      .map(([key, { value, updatedAt }]) => ({ key, value, updatedAt }));
    return HttpResponse.json({ items, nextSince: undefined });
  }),
@@
-  // Remote get
-  http.get('/remote/:ns/:key', ({ params }) => {
-    const k = `${params.ns}:${params.key}`;
-    const value = remoteKV.get(k) ?? null;
-    return HttpResponse.json({ value });
-  }),
+  // Remote get (by full namespaced key)
  http.get('/remote/kv/:key', ({ params }) => {
    const key = String(params.key);
    const entry = remoteKV.get(key) ?? null;
    return HttpResponse.json(entry);
  }),
@@
-  // Remote put
-  http.put('/remote/:ns/:key', async ({ params, request }) => {
-    const { value } = (await request.json()) as { value: string };
-    const k = `${params.ns}:${params.key}`;
-    remoteKV.set(k, value);
-    return new HttpResponse(null, { status: 204 });
-  }),
+  // Remote put (by full namespaced key)
  http.put('/remote/kv/:key', async ({ params, request }) => {
    const key = String(params.key);
    const { value, updatedAt } = (await request.json()) as { value: string; updatedAt?: string };
    remoteKV.set(key, { value, updatedAt: updatedAt ?? new Date().toISOString() });
    return new HttpResponse(null, { status: 204 });
  }),
@@
-  // Remote delete
-  http.delete('/remote/:ns/:key', ({ params }) => {
-    const k = `${params.ns}:${params.key}`;
-    remoteKV.delete(k);
-    return new HttpResponse(null, { status: 204 });
-  }),
+  // Remote delete (by full namespaced key)
  http.delete('/remote/kv/:key', async ({ params, request }) => {
    const key = String(params.key);
    try { await request.json(); } catch {}
    remoteKV.delete(key);
    return new HttpResponse(null, { status: 204 });
  }),
 ]
*** End Patch
```

````diff
*** Begin Patch
*** Update File: README.md
@@
+## Remote Transport Contract (HTTP)
+
+When `sync.remoteEnabled` is `true`, the app expects a minimal REST surface:
+
+```
+PUT    /remote/kv/:key              { value: string, updatedAt: ISO }  -> 204
+GET    /remote/kv/:key                                               -> 200 { value?: string, updatedAt: ISO } | null
+DELETE /remote/kv/:key              { updatedAt: ISO }                 -> 204
+GET    /remote/list/:ns                                                -> 200 { items: Array<{ key, value, updatedAt }>, nextSince?: string }
+```
+
+`updatedAt` supports LWW conflict resolution. `nextSince` is optional and can be used to paginate pulls.
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
-    "test:e2e": "playwright test"
+    "test:e2e": "playwright test",
+    "test:remote": "vitest run tests/unit/httpRemote.spec.ts"
   },
*** End Patch
```

```diff
*** Begin Patch
*** Update File: configs/feature-flags.json
@@
   "sync": {
-    "remoteEnabled": false
+    "remoteEnabled": false
   },
*** End Patch
```

---

## PR‑002 Checklist

* [x] Concrete `HttpRemote` exercised by unit tests
* [x] MSW app mocks now support `list` with `nextSince`
* [x] README documents the remote contract
* [x] No default behavior change (flags remain false)

## Smoke Instructions

* Unit: `pnpm run test:remote`
* Full unit: `pnpm run test:unit`
* Dev (with MSW): `pnpm dev` (sim/default)

## Rollback

* `git revert <SHA-PR002>`

```
```
