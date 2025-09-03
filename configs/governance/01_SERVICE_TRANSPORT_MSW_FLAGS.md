```diff
# Day‑1 Surgical Patches (Status + Follow‑ups)
# Scope: services/http, services/auth, storage/transports/httpRemote, MSW setup, feature flags update
# Notes: additive, flag‑gated, ≤220 LOC, no behavior change by default

diff --git a/src/services/http.ts b/src/services/http.ts
new file mode 100644
index 0000000..1111111
--- /dev/null
+++ b/src/services/http.ts
@@ -0,0 +1,86 @@
+// Minimal, typed JSON HTTP wrapper with normalized errors
+export type HttpOptions = {
+  method?: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
+  headers?: Record<string, string>;
+  body?: unknown; // JSON.stringify if not FormData
+  signal?: AbortSignal;
+};
+
+export class HttpError extends Error {
+  status: number;
+  data: unknown;
+  constructor(message: string, status: number, data: unknown) {
+    super(message);
+    this.name = 'HttpError';
+    this.status = status;
+    this.data = data;
+  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

function isFormData(x: unknown): x is FormData {
  return typeof FormData !== 'undefined' && x instanceof FormData;
}

function safeJson(text: string) {
  try { return JSON.parse(text); } catch { return text; }
}

export async function http<T>(path: string, opt: HttpOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string,string> = {
    Accept: 'application/json',
    ...(!isFormData(opt.body) ? { 'Content-Type': 'application/json' } : {}),
    ...(opt.headers ?? {}),
  };
  const res = await fetch(url, {
    method: opt.method ?? 'GET',
    headers,
    body: isFormData(opt.body)
      ? (opt.body as BodyInit)
      : opt.body !== undefined
        ? JSON.stringify(opt.body)
        : undefined,
    signal: opt.signal,
    credentials: 'include',
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) throw new HttpError(`HTTP ${res.status}`, res.status, data);
  return data as T;
}

export async function get<T>(path: string, opt?: Omit<HttpOptions,'method'|'body'>) {
  return http<T>(path, { ...opt, method: 'GET' });
}
export async function post<T>(path: string, body?: unknown, opt?: Omit<HttpOptions,'method'|'body'>) {
  return http<T>(path, { ...opt, method: 'POST', body });
}
export async function put<T>(path: string, body?: unknown, opt?: Omit<HttpOptions,'method'|'body'>) {
  return http<T>(path, { ...opt, method: 'PUT', body });
}
export async function del<T>(path: string, opt?: Omit<HttpOptions,'method'|'body'>) {
  return http<T>(path, { ...opt, method: 'DELETE' });
}

export type JsonValue = null | boolean | number | string | JsonValue[] | { [k: string]: JsonValue };
```

---

Status (current repo): DONE

- Implemented exactly as specified:
  - `src/services/http.ts` (typed client, normalized errors)
  - `src/services/auth.ts` (flag‑aware)
  - `src/storage/transports/httpRemote.ts` with `/remote/kv/:key`, `/remote/list/:ns`, `nextSince`
  - `src/mocks/handlers.ts` + dev‑only boot in `src/main.tsx`
  - `configs/feature-flags.json` contains `auth`, `sync`, `storage`, `search`
  - Flags are read via `bootstrap()` with a dev `__spark_flags_override` for smokes

Aligned updates (match actual repo contracts and exports)

```diff
diff --git a/src/storage/transports/httpRemote.ts b/src/storage/transports/httpRemote.ts
new file mode 100644
index 0000000..3333333
--- /dev/null
+++ b/src/storage/transports/httpRemote.ts
@@ -0,0 +1,82 @@
+// RemoteTransport aligned to RemoteAdapter usage (see src/storage/remote.ts)
+export interface RemoteTransport {
+  // Full namespaced key, e.g. "spark:foo" (RemoteAdapter passes nk(key))
+  put(key: string, value: string, updatedAt: string): Promise<void>;
+  get(key: string): Promise<{ value?: string; updatedAt: string } | null>;
+  del(key: string, updatedAt: string): Promise<void>;
+  list(namespace: string, sinceToken?: string): Promise<{
+    items: Array<{ key: string; value: string; updatedAt: string }>;
+    nextSince?: string;
+  }>;
+}

import { http } from '../../services/http';

function enc(x: string) { return encodeURIComponent(x); }

export class HttpRemote implements RemoteTransport {
  async put(key: string, value: string, updatedAt: string) {
    await http(`/remote/kv/${enc(key)}`, { method: 'PUT', body: { value, updatedAt } });
  }
  async get(key: string) {
    return http<{ value?: string; updatedAt: string } | null>(`/remote/kv/${enc(key)}`);
  }
  async del(key: string, updatedAt: string) {
    await http(`/remote/kv/${enc(key)}`, { method: 'DELETE', body: { updatedAt } });
  }
  async list(namespace: string, sinceToken?: string) {
    const q = sinceToken ? `?since=${enc(sinceToken)}` : '';
    return http<{ items: Array<{ key: string; value: string; updatedAt: string }>; nextSince?: string }>(
      `/remote/list/${enc(namespace)}${q}`
    );
  }
}
```

```diff
diff --git a/src/mocks/handlers.ts b/src/mocks/handlers.ts
new file mode 100644
index 0000000..4444444
--- /dev/null
+++ b/src/mocks/handlers.ts
@@ -0,0 +1,104 @@
+import { http, HttpResponse } from 'msw';
+
+// In-memory mock store with updatedAt per key
+const remoteKV = new Map<string, { value: string; updatedAt: string }>();
+
+function nowIso() { return new Date().toISOString(); }
+
+export const handlers = [
+  // Auth
+  http.post('/auth/login', async ({ request }) => {
+    const body = await request.json().catch(() => ({} as any));
+    const email = (body as any)?.email ?? 'sim@example.com';
+    return HttpResponse.json({ token: 'mock-token', user: { id: 'u1', email, name: 'Mock User' } });
+  }),
+  http.get('/auth/me', () => HttpResponse.json({ id: 'u1', email: 'mock@example.com', name: 'Mock User' })),
+  http.post('/auth/logout', () => new HttpResponse(null, { status: 204 })),

+  // Remote list by namespace prefix
+  http.get('/remote/list/:ns', ({ params, request }) => {
+    const ns = String(params.ns);
+    const prefix = ns.endsWith(':') ? ns : `${ns}:`;
+    // (Optional) parse since token, not used in mock
+    const items = Array.from(remoteKV.entries())
+      .filter(([k]) => k.startsWith(prefix))
+      .map(([key, { value, updatedAt }]) => ({ key, value, updatedAt }));
+    return HttpResponse.json({ items, nextSince: undefined });
+  }),

+  // Remote get/put/del for full namespaced key
+  http.get('/remote/kv/:key', ({ params }) => {
+    const key = String(params.key);
+    const entry = remoteKV.get(key) ?? null;
+    return HttpResponse.json(entry);
+  }),

+  http.put('/remote/kv/:key', async ({ params, request }) => {
+    const key = String(params.key);
+    const { value, updatedAt } = (await request.json()) as { value: string; updatedAt?: string };
+    remoteKV.set(key, { value, updatedAt: updatedAt ?? nowIso() });
+    return new HttpResponse(null, { status: 204 });
+  }),

+  http.delete('/remote/kv/:key', async ({ params, request }) => {
+    const key = String(params.key);
+    // Accept updatedAt in body for symmetry; ignore in mock
+    try { await request.json(); } catch {}
+    remoteKV.delete(key);
+    return new HttpResponse(null, { status: 204 });
+  }),
+];
```

```diff
diff --git a/src/main.tsx b/src/main.tsx
index 1234567..89abcde 100644
--- a/src/main.tsx
+++ b/src/main.tsx
@@ -1,5 +1,17 @@
 import React from 'react'
 import ReactDOM from 'react-dom/client'
+// Dev-only MSW boot (no-op in production builds)
+if (import.meta.env.DEV) {
+  // eslint-disable-next-line no-void
+  void (async () => {
+    try {
+      const { worker } = await import('./mocks/browser');
+      await worker.start({ onUnhandledRequest: 'bypass' });
+    } catch {}
+  })();
+}
-import App from './App'
+import { App } from './App.tsx'

 ReactDOM.createRoot(document.querySelector('#root')!).render(
   <React.StrictMode>
     <App />
   </React.StrictMode>,
 )
```

```diff
diff --git a/configs/feature-flags.json b/configs/feature-flags.json
index 2468ace..3579bdf 100644
--- a/configs/feature-flags.json
+++ b/configs/feature-flags.json
@@ -1,8 +1,20 @@
  {
    "comment": "USER'S APPROACH ADOPTED - Authoritative feature flag registry",
    "metadata": {
      "version": "6.1.0",
      "last_updated": "2025-08-27",
      "change_control": "formal_approval_required"
    },
+    "auth": { "useRealService": false },
+    "sync": { "remoteEnabled": false },
+    "storage": { "encrypted": false },
    ...
  }
```

Note: `msw` already exists in devDependencies at a newer version; no package.json change required.

---

Follow‑ups (tracked in later steps)

- 02: Wire `EncryptedDriver` and ensure `RemoteAdapter` uses async driver from bootstrap
- 03: Add unit tests for `HttpRemote` happy/error paths (kv/list, since → nextSince)
- 12: Attach `Authorization` header automatically in `http()` when real auth is enabled
- 08: Optional Express BFF for staging; keep MSW for dev parity

Implementation tips

- Ensure routes align with the `HttpRemote` paths:
  - GET/PUT/DELETE `/remote/kv/:key` (full namespaced keys)
  - GET `/remote/list/:ns` (namespace prefix)
- Keep MSW dev-only boot in `main.tsx` guarded by `import.meta.env.DEV`.
- Add a simple `flags.ts` parser (zod) if you adopt the optional hardening from 00.

```diff
diff --git a/src/services/auth.ts b/src/services/auth.ts
new file mode 100644
index 0000000..2222222
--- /dev/null
+++ b/src/services/auth.ts
@@ -0,0 +1,62 @@
+import { http } from './http';
+
+export type LoginCredentials = { email: string; password: string };
+export type User = { id: string; email: string; name?: string };
+export type AuthResponse = { token: string; user: User };
+
+/**
+ * Feature-flag aware Auth Service.
+ * `useReal` should be read from configs/feature-flags.json at call sites.
+ */
+export const AuthService = {
+  async login(creds: LoginCredentials, useReal: boolean): Promise<AuthResponse> {
+    if (!useReal) {
+      // Simulator path preserved
+      return { token: 'sim-token', user: { id: 'sim', email: creds.email, name: 'Sim User' } };
+    }
+    return http<AuthResponse>('/auth/login', { method: 'POST', body: creds });
+  },
+  async me(useReal: boolean): Promise<User | null> {
+    if (!useReal) return { id: 'sim', email: 'sim@example.com', name: 'Sim User' };
+    return http<User>('/auth/me');
+  },
+  async logout(useReal: boolean): Promise<void> {
+    if (!useReal) return; // noop for simulator
+    await http('/auth/logout', { method: 'POST' });
+  },
+};
```

```diff
diff --git a/src/storage/transports/httpRemote.ts b/src/storage/transports/httpRemote.ts
new file mode 100644
index 0000000..3333333
--- /dev/null
+++ b/src/storage/transports/httpRemote.ts
@@ -0,0 +1,69 @@
+// Minimal REST RemoteTransport so RemoteAdapter can push/pull
+export type RemoteEvent = { id: string; ts: string; type: string; payload: unknown };
+export type PullResponse = { items: RemoteEvent[]; sinceToken: string | null };
+
+export interface RemoteTransport {
+  put(ns: string, key: string, value: string): Promise<void>;
+  get(ns: string, key: string): Promise<string | null>;
+  del(ns: string, key: string): Promise<void>;
+  list(ns: string, sinceToken?: string | null): Promise<PullResponse>;
+}

import { http } from '../../services/http';

function enc(x: string) { return encodeURIComponent(x); }

export class HttpRemote implements RemoteTransport {
  async put(ns: string, key: string, value: string) {
    await http(`/remote/${enc(ns)}/${enc(key)}`, { method: 'PUT', body: { value } });
  }
  async get(ns: string, key: string) {
    const res = await http<{ value: string | null }>(`/remote/${enc(ns)}/${enc(key)}`);
    return res?.value ?? null;
  }
  async del(ns: string, key: string) {
    await http(`/remote/${enc(ns)}/${enc(key)}`, { method: 'DELETE' });
  }
  async list(ns: string, sinceToken: string | null = null) {
    const q = sinceToken ? `?since=${enc(sinceToken)}` : '';
    return http<PullResponse>(`/remote/${enc(ns)}${q}`);
  }
}
```

```diff
diff --git a/src/mocks/handlers.ts b/src/mocks/handlers.ts
new file mode 100644
index 0000000..4444444
--- /dev/null
+++ b/src/mocks/handlers.ts
@@ -0,0 +1,74 @@
+import { http, HttpResponse } from 'msw';
+
+// In-memory mock store for remote values
+const remoteKV = new Map<string, string>();
+
+export const handlers = [
+  // Auth
+  http.post('/auth/login', async ({ request }) => {
+    const body = await request.json().catch(() => ({} as any));
+    const email = (body as any)?.email ?? 'sim@example.com';
+    return HttpResponse.json({ token: 'mock-token', user: { id: 'u1', email, name: 'Mock User' } });
+  }),
+  http.get('/auth/me', () => HttpResponse.json({ id: 'u1', email: 'mock@example.com', name: 'Mock User' })),
+  http.post('/auth/logout', () => new HttpResponse(null, { status: 204 })),

+  // Remote list
+  http.get('/remote/:ns', ({ params }) => {
+    // Simplified: returns empty list with null token for now
+    return HttpResponse.json({ items: [], sinceToken: null });
+  }),

+  // Remote get
+  http.get('/remote/:ns/:key', ({ params }) => {
+    const k = `${params.ns}:${params.key}`;
+    const value = remoteKV.get(k) ?? null;
+    return HttpResponse.json({ value });
+  }),

+  // Remote put
+  http.put('/remote/:ns/:key', async ({ params, request }) => {
+    const { value } = (await request.json()) as { value: string };
+    const k = `${params.ns}:${params.key}`;
+    remoteKV.set(k, value);
+    return new HttpResponse(null, { status: 204 });
+  }),

+  // Remote delete
+  http.delete('/remote/:ns/:key', ({ params }) => {
+    const k = `${params.ns}:${params.key}`;
+    remoteKV.delete(k);
+    return new HttpResponse(null, { status: 204 });
+  }),
+];
```

```diff
diff --git a/src/mocks/browser.ts b/src/mocks/browser.ts
new file mode 100644
index 0000000..5555555
--- /dev/null
+++ b/src/mocks/browser.ts
@@ -0,0 +1,14 @@
+import { setupWorker } from 'msw/browser';
+import { handlers } from './handlers';
+
+export const worker = setupWorker(...handlers);
```

```diff
diff --git a/src/main.tsx b/src/main.tsx
index 1234567..89abcde 100644
--- a/src/main.tsx
+++ b/src/main.tsx
@@ -1,5 +1,17 @@
 import React from 'react'
 import ReactDOM from 'react-dom/client'
+// Dev-only MSW boot (no-op in production builds)
+if (import.meta.env.DEV) {
+  // Top-level await is supported in Vite
+  // eslint-disable-next-line no-void
+  void (async () => {
+    try {
+      const { worker } = await import('./mocks/browser');
+      await worker.start({ onUnhandledRequest: 'bypass' });
+    } catch {}
+  })();
+}
 import App from './App'

 ReactDOM.createRoot(document.querySelector('#root')!).render(
   <React.StrictMode>
     <App />
   </React.StrictMode>,
 )
```

```diff
diff --git a/configs/feature-flags.json b/configs/feature-flags.json
index 2468ace..3579bdf 100644
--- a/configs/feature-flags.json
+++ b/configs/feature-flags.json
@@ -1,8 +1,20 @@
 {
   "comment": "USER'S APPROACH ADOPTED - Authoritative feature flag registry",
   "metadata": {
     "version": "6.1.0",
     "last_updated": "2025-08-27",
     "change_control": "formal_approval_required"
   },
+  "auth": {
+    "useRealService": false
+  },
+  "sync": {
+    "remoteEnabled": false
+  },
+  "storage": {
+    "encrypted": false
+  }
 }
```

```diff
diff --git a/package.json b/package.json
index 13579bd..24680ce 100644
--- a/package.json
+++ b/package.json
@@ -10,6 +10,7 @@
   "devDependencies": {
     "@types/node": "*",
     "@types/react": "*",
     "@types/react-dom": "*",
+    "msw": "^2.6.6",
     "typescript": "*",
     "vite": "*"
   }
 }
```

```
```
