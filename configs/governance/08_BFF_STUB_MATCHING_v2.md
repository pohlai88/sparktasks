# PR‑007: BFF Stub (Express) matching /auth/* and /remote/* contract — v2
# Goal: Provide a minimal, real backend that the SPA can talk to today.
# Scope: standalone TypeScript Express app under /bff with in‑memory stores, CORS, and the exact REST surface used by the SPA.

*** Begin Patch
*** Add File: bff/package.json
+{
+  "name": "@spark/bff",
+  "private": true,
+  "type": "module",
+  "scripts": {
+    "dev": "tsx src/server.ts"
+  },
+  "dependencies": {
+    "cors": "^2.8.5",
+    "dotenv": "^16.4.5",
+    "express": "^4.19.2",
+    "uuid": "^9.0.1",
+    "zod": "^3.23.8"
+  },
+  "devDependencies": {
+    "@types/cors": "^2.8.17",
+    "@types/express": "^4.17.21",
+    "@types/node": "^20.11.30",
+    "tsx": "^4.16.2",
+    "typescript": "^5.4.5"
+  }
+}
*** End Patch
```

```diff
*** Begin Patch
*** Add File: bff/tsconfig.json
+{
+  "compilerOptions": {
+    "target": "ES2020",
+    "module": "NodeNext",
+    "moduleResolution": "NodeNext",
+    "strict": true,
+    "esModuleInterop": true,
+    "skipLibCheck": true,
+    "forceConsistentCasingInFileNames": true,
+    "types": ["node"],
+    "outDir": "dist"
+  },
+  "include": ["src"]
+}
*** End Patch
```

```diff
*** Begin Patch
*** Add File: bff/.env.example
+PORT=3000
+# Comma‑separated list; defaults to dev origin if unset
+CORS_ORIGIN=http://localhost:5173
*** End Patch
```

```diff
*** Begin Patch
*** Add File: bff/src/server.ts
+import 'dotenv/config'
+import express from 'express'
+import cors from 'cors'
+import { randomUUID } from 'node:crypto'
+import { z } from 'zod'

+const app = express()

+// --- CORS ---
+const corsOrigin = process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || true
+app.use(cors({ origin: corsOrigin, credentials: true }))

+// --- JSON body ---
+app.use(express.json({ limit: '1mb' }))

+// --- In‑memory state ---
+type User = { id: string; email: string; name?: string }
+type KvEntry = { value: string; updatedAt: string }

+const sessions = new Map<string, User>()               // token → user
+const kvStore = new Map<string, KvEntry>()             // full key → entry (e.g., spark:foo)

+// --- Helpers ---
+function authUser(req: express.Request): User | null {
+  const h = req.headers['authorization']
+  if (!h || !h.startsWith('Bearer ')) return null
+  const token = h.substring('Bearer '.length)
+  return sessions.get(token) || null
+}

+function err(res: express.Response, status: number, code: string, message: string) {
+  return res.status(status).json({ error: { code, message } })
+}

+// --- Auth routes ---
+const LoginBody = z.object({ email: z.string().email(), password: z.string().min(1) })
+app.post('/auth/login', (req, res) => {
+  const parsed = LoginBody.safeParse(req.body)
+  if (!parsed.success) return err(res, 400, 'BAD_REQUEST', 'Invalid credentials payload')
+  const { email } = parsed.data
+  const token = randomUUID()
+  const user: User = { id: 'u_' + token.slice(0, 8), email, name: email.split('@')[0] }
+  sessions.set(token, user)
+  return res.json({ token, user })
+})

+app.get('/auth/me', (req, res) => {
+  const user = authUser(req)
+  if (!user) return err(res, 401, 'UNAUTHORIZED', 'Missing or invalid token')
+  return res.json(user)
+})

+app.post('/auth/logout', (req, res) => {
+  const h = req.headers['authorization']
+  if (h?.startsWith('Bearer ')) sessions.delete(h.substring('Bearer '.length))
+  return res.status(204).end()
+})

+// --- Remote contract (kv/list) ---
+const PutBody = z.object({ value: z.string(), updatedAt: z.string() })
+const DelBody = z.object({ updatedAt: z.string() }).partial()

+// GET by full namespaced key
+app.get('/remote/kv/:key', (req, res) => {
+  const key = String(req.params.key)
+  const entry = kvStore.get(key) || null
+  return res.json(entry)
+})

+// PUT by full namespaced key
+app.put('/remote/kv/:key', (req, res) => {
+  const key = String(req.params.key)
+  const parsed = PutBody.safeParse(req.body)
+  if (!parsed.success) return err(res, 400, 'BAD_REQUEST', 'Expected { value, updatedAt }')
+  const { value, updatedAt } = parsed.data
+  kvStore.set(key, { value, updatedAt })
+  return res.status(204).end()
+})

+// DELETE by full namespaced key
+app.delete('/remote/kv/:key', (req, res) => {
+  const key = String(req.params.key)
+  // Accept body for symmetry; ignore content
+  const _ = DelBody.safeParse(req.body)
+  kvStore.delete(key)
+  return res.status(204).end()
+})

+// LIST by namespace prefix
+app.get('/remote/list/:ns', (req, res) => {
+  const ns = String(req.params.ns)
+  const prefix = ns.endsWith(':') ? ns : `${ns}:`
+  const items = Array.from(kvStore.entries())
+    .filter(([k]) => k.startsWith(prefix))
+    .map(([key, { value, updatedAt }]) => ({ key, value, updatedAt }))
+  const nextSince = items.length ? items[items.length - 1].key : undefined
+  return res.json({ items, nextSince })
+})

+// --- Health ---
+app.get('/health', (_req, res) => res.json({ ok: true }))

+// --- Start ---
+const port = Number(process.env.PORT || 3000)
+app.listen(port, () => {
+  // eslint-disable-next-line no-console
+  console.log(`[BFF] listening on http://localhost:${port}`)
+})

*** End Patch
```

```diff
*** Begin Patch
*** Update File: README.md
@@
 ### API Base URL
-Set `VITE_API_BASE_URL` in `.env.local` if your backend isn’t on the same origin.
+Set `VITE_API_BASE_URL` in `.env.local` if your backend isn’t on the same origin. For the built‑in BFF stub, use `http://localhost:3000`.
*** End Patch
```

```diff
*** Begin Patch
*** Update File: docs/QUICKSTART_MATRIX.md
@@
-| **Remote via Real BFF** | Use real endpoints | `sync.remoteEnabled=true`<br>`auth.useRealService=true` | `.env.local` → `VITE_API_BASE_URL="http://localhost:3000"` | **Terminal A**: `pnpm -C bff i && pnpm -C bff dev`<br>**Terminal B**: `pnpm dev` | App auth hits BFF `/auth/*`; RemoteAdapter pulls from `/remote/*` |
+| **Remote via Real BFF** | Use real endpoints | `sync.remoteEnabled=true`<br>`auth.useRealService=true` | `.env.local` → `VITE_API_BASE_URL="http://localhost:3000"` | **Terminal A**: `pnpm -C bff i && pnpm -C bff dev`<br>**Terminal B**: `pnpm dev` | App auth hits BFF `/auth/*`; RemoteAdapter pulls from `/remote/kv/*` and `/remote/list/*` |
*** End Patch
```

```diff
*** Begin Patch
*** Update File: docs/REMOTE_CONTRACT.md
@@
-The app expects a minimal REST surface when `sync.remoteEnabled=true`:
-
-```
-PUT    /remote/\:ns/\:key            { value: string }        -> 204
-GET    /remote/\:ns/\:key                                     -> 200 { value: string | null }
-DELETE /remote/\:ns/\:key                                     -> 204
-GET    /remote/\:ns?since=<token>                            -> 200 { items: Array<{id, ts, type, payload}>, sinceToken: string | null }
-
-```
-
-- `sinceToken` is opaque and returned by the server. The client performs push‑then‑pull with exponential backoff on rate‑limit errors.
-- Namespacing: `:ns` should scope tenant/app (we use `spark`).
-- Security: If deploying a real backend, protect endpoints and validate inputs server‑side.
+The app expects a minimal REST surface when `sync.remoteEnabled=true`:
+
+```
+PUT    /remote/kv/:key              { value: string, updatedAt: ISO }  -> 204
+GET    /remote/kv/:key                                               -> 200 { value?: string, updatedAt: ISO } | null
+DELETE /remote/kv/:key              { updatedAt: ISO }                 -> 204
+GET    /remote/list/:ns                                                -> 200 { items: Array<{ key, value, updatedAt }>, nextSince?: string }
+```
+
+- `updatedAt` supports LWW and drift avoidance.
+- `nextSince` is optional and can be used to paginate pulls.
+- Namespacing: `:ns` should scope tenant/app (we use `spark`).
+- Security: If deploying a real backend, protect endpoints and validate inputs server‑side. The provided **BFF stub** under `/bff` implements this contract in‑memory for development.
*** End Patch
```

```diff
*** Begin Patch
*** Update File: .env.example
@@
-VITE_API_BASE_URL=""
+VITE_API_BASE_URL="http://localhost:3000"
*** End Patch
```

```diff
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
+    "bff:dev": "pnpm -C bff dev",
     "test:bootstrap": "vitest run tests/unit/bootstrap.spec.ts"
   },
*** End Patch
```

---

## PR‑007 Checklist (v2)

* [x] Standalone **TypeScript Express BFF** under `/bff`
* [x] Implements `/auth/login`, `/auth/me`, `/auth/logout`
* [x] Implements `/remote/kv/:key` (PUT/GET/DELETE) and `/remote/list/:ns` (LIST)
* [x] CORS enabled; `.env.example` included
* [x] README & Quickstart updated; root script `bff:dev`
* [x] No SPA code changes required beyond setting `VITE_API_BASE_URL`

## How to run

1. **Terminal A:** `pnpm -C bff i && pnpm -C bff dev`
2. **Terminal B:** `pnpm dev`
3. Ensure flags: `auth.useRealService=true`, `sync.remoteEnabled=true`.

## Rollback

* `git revert <SHA-PR007>`
