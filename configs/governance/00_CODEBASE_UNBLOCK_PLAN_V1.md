# SparkTasks — 72‑Hour Stabilization & Unblock Plan (v1)

> Purpose: **rectify critical gaps fast**, keep the demo intact, and re‑establish a clean path to either **backend**, **frontend**, or **feature logic** work without churn. All actions are **feature‑flagged**, **tokenized**, and **reversible**.

---

## 0) North Star

* **Stable local demo remains working** at every commit.
* **No breaking refactors**: only additive structure, behind flags.
* **Small PRs, fast review**: 3–6 PRs ≤ 300 LOC each.
* **SSOT alignment**: services → adapters → state → UI, documented in this page.

---

## Status (current repo) — implements 00 Day‑1, sets up Day‑2/3

Status: DONE for Day‑1 scope. Verified against SSOT (index.css, tailwind.config.js, enhanced‑tokens.ts, FOUNDATION_GOVERNANCE_SSOT.md) and runtime.

- Implemented:
  - `src/services/http.ts` (central client, normalized errors)
  - `src/services/auth.ts` (flag‑aware simulator/real)
  - `src/storage/transports/httpRemote.ts` (kv/list + nextSince)
  - `src/mocks/handlers.ts` and dev‑only boot in `src/main.tsx`
  - `configs/feature-flags.json` (auth/sync/storage/search)
  - `src/bootstrap.ts` minimal flags + dev override
  - `SimpleUpload` refactor to `http()`
  - E2E smokes for sim/remote kv/list

- Deferred to later steps (do not block 00):
  - 02: state barrel `src/state/*` and full bootstrap wiring (EncryptedDriver, RemoteAdapter on async driver)
  - 03: unit tests for `HttpRemote` (+ any http.ts behavior tests)
  - 07: docs polish/quickstart matrix
  - 08: optional BFF stub (MSW covers dev)
  - 09–11: SQLite WASM FTS5 + SearchService + GlobalSearch/FlagPanel
  - 12: attach Authorization via session/cookies; finalize route guards
  - 13: sync loop hardening + dev “Sync now”

Receipts (where to check):
- Transport paths and fields: `/remote/kv/:key`, `/remote/list/:ns`, `nextSince` in `httpRemote.ts` and MSW handlers
- Dev boot guarded by `import.meta.env.DEV` in `src/main.tsx`
- Flags resolved via `src/bootstrap.ts` (+ dev override)

---

## 1) Critical P0 Goals (do now)

1. **Central HTTP client** with normalized errors.
2. **Auth service** (flag‑swappable with the current simulator).
3. **Remote transport contract** + HTTP stub for the existing `RemoteAdapter`.
4. **State folder consolidation** (non‑breaking re‑exports).
5. **Bootstrap toggles** for encrypted storage & async hydration.
6. **MSW mocks** + **Playwright smoke flow** for both modes (sim + real service).

> Outcome: The app can switch between *local‑only* and *HTTP‑backed* flows by flags, unblocking backend or feature work in parallel.

---

## 2) Day‑by‑Day Plan (72 hours)

### Day 1 — Services & Contracts (additive only)

* `src/services/http.ts`: Typed `fetch` wrapper, baseURL, JSON helpers, error normalization.
* `src/services/auth.ts`: `login`, `logout`, `me` using `http` (feature‑flagged).
* `src/storage/transports/httpRemote.ts`: Implements `RemoteTransport` over REST (no server required yet; use MSW mocks).
* **Wire flags** in `configs/feature-flags.json`:

  * `auth.useRealService`: false
  * `sync.remoteEnabled`: false
  * `storage.encrypted`: false
* **MSW setup** for `/auth/*`, `/remote/kv/*`, and `/remote/list/*` routes.

### Day 2 — State & Bootstrap (safe moves)

* Consolidate to `src/state/` without breaking public imports:

  * `src/state/domain/taskStore.ts` (moved from `src/stores/taskStore.ts`)
  * `src/state/ui/appStore.tsx` (moved from `src/store/AppStore.tsx` if present)
  * `src/state/index.ts` re‑exports to keep existing imports working.
* `src/bootstrap.ts`: Feature‑flag switchboard for:

  * `EncryptedDriver` wrapping;
  * async hydration (`hydrateAsync`);
  * optional `RemoteAdapter` wiring.
* Refactor **only** `AuthProvider` and `SimpleUpload` to consume `services/*` behind flags.

### Day 3 — Confidence & Handoff

* Playwright **smoke spec** covering login (sim vs real), create/update task, optional file upload.
* Vitest unit tests for `http.ts` error shape & `httpRemote` token bucket/backoff stubs.
* Docs update: README Quickstart + Flags table + Dev matrix (local‑only vs remote).

---

## 3) File & Code Skeletons (copy‑ready)

### 3.1 `src/services/http.ts`

```ts
// Minimal, typed JSON HTTP wrapper with normalized errors
export type HttpOptions = {
  method?: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
  headers?: Record<string, string>;
  body?: unknown; // will JSON.stringify if not FormData
  signal?: AbortSignal;
};

export class HttpError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message); this.status = status; this.data = data;
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function http<T>(path: string, opt: HttpOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const isForm = typeof FormData !== 'undefined' && opt.body instanceof FormData;
  const headers: Record<string,string> = {
    'Accept': 'application/json',
    ...(isForm ? {} : {'Content-Type': 'application/json'}),
    ...(opt.headers ?? {}),
  };
  const res = await fetch(url, {
    method: opt.method ?? 'GET',
    headers,
    body: isForm ? (opt.body as BodyInit) : opt.body ? JSON.stringify(opt.body) : undefined,
    signal: opt.signal,
    credentials: 'include',
  });
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) throw new HttpError(`HTTP ${res.status}`, res.status, data);
  return data as T;
}

function safeJson(text: string) { try { return JSON.parse(text); } catch { return text; } }
```

### 3.2 `src/services/auth.ts`

```ts
import { http } from './http';

export type LoginCredentials = { email: string; password: string };
export type User = { id: string; email: string; name?: string };
export type AuthResponse = { token: string; user: User };

export const AuthService = {
  async login(creds: LoginCredentials, useReal: boolean): Promise<AuthResponse> {
    if (!useReal) {
      // current simulator kept intact
      return { token: 'sim-token', user: { id: 'sim', email: creds.email, name: 'Sim User' } };
    }
    return http<AuthResponse>('/auth/login', { method: 'POST', body: creds });
  },
  async me(useReal: boolean): Promise<User | null> {
    if (!useReal) return { id: 'sim', email: 'sim@example.com', name: 'Sim User' };
    return http<User>('/auth/me');
  },
  async logout(useReal: boolean): Promise<void> {
    if (!useReal) return; // noop for simulator
    await http('/auth/logout', { method: 'POST' });
  },
};
```

### 3.3 `src/storage/transports/httpRemote.ts`

```ts
// RemoteTransport aligned to RemoteAdapter usage (pushQueue/pullUpdates)
// See src/storage/remote.ts where calls expect updatedAt and namespaced keys

export interface RemoteTransport {
  // Store/overwrite a value for the full namespaced key (e.g. "spark:foo")
  put(key: string, value: string, updatedAt: string): Promise<void>;
  // Read current value and its updatedAt; null if not present
  get(key: string): Promise<{ value?: string; updatedAt: string } | null>;
  // Delete a key with a timestamp for LWW resolution
  del(key: string, updatedAt: string): Promise<void>;
  // List all items in a namespace; items must include full namespaced keys
  list(namespace: string, sinceToken?: string): Promise<{
    items: Array<{ key: string; value: string; updatedAt: string }>;
    nextSince?: string;
  }>;
}

import { http } from '../../services/http';

export class HttpRemote implements RemoteTransport {
  async put(key: string, value: string, updatedAt: string): Promise<void> {
    await http(`/remote/kv/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: { value, updatedAt },
    });
  }

  async get(key: string): Promise<{ value?: string; updatedAt: string } | null> {
    const res = await http<{ value?: string; updatedAt: string } | null>(
      `/remote/kv/${encodeURIComponent(key)}`
    );
    return res;
  }

  async del(key: string, updatedAt: string): Promise<void> {
    await http(`/remote/kv/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      body: { updatedAt },
    });
  }

  async list(namespace: string, sinceToken?: string) {
    const q = sinceToken ? `?since=${encodeURIComponent(sinceToken)}` : '';
    return http<{ items: Array<{ key: string; value: string; updatedAt: string }>; nextSince?: string }>(
      `/remote/list/${encodeURIComponent(namespace)}${q}`
    );
  }
}
```

### 3.4 `src/bootstrap.ts`

```ts
import featureFlags from '../configs/feature-flags.json';
import { EncryptedDriver } from './storage/encrypted';
import { createNamespace, LocalStorageDriver, SyncLocalStorageDriver } from './storage/local';
import { RemoteAdapter } from './storage/remote';
import { HttpRemote } from './storage/transports/httpRemote';

export type BootContext = {
  // Sync namespaced wrapper for legacy eventlog (appendEvent, etc.)
  nsSync: ReturnType<typeof createNamespace>;
  // Remote adapter (optional, flag-gated)
  remote?: RemoteAdapter;
  flags: typeof featureFlags;
};

export function bootstrap(): BootContext {
  const flags = featureFlags as any;

  // Async driver used by RemoteAdapter and optional encryption
  const baseAsync = new LocalStorageDriver();
  const keyProvider /*: KeyProvider*/ = {} as any; // supply real key provider for production
  const asyncDriver = flags.storage?.encrypted
    ? new EncryptedDriver(baseAsync, 'spark', keyProvider)
    : baseAsync;

  // Sync namespaced wrapper for existing eventlog usage
  const nsSync = createNamespace('spark', new SyncLocalStorageDriver());

  let remote: RemoteAdapter | undefined;
  if (flags.sync?.remoteEnabled) {
    remote = new RemoteAdapter(asyncDriver, new HttpRemote(), 'spark');
  }

  return { nsSync, remote, flags };
}
```

### 3.5 Patch points (non‑breaking)

* **AuthProvider**: route through `AuthService` based on `featureFlags.auth.useRealService`.
* **SimpleUpload**: replace ad‑hoc `fetch` with `http()` to inherit retries & error shape.
* **Entry** (`main.tsx` or `App.tsx`): call `bootstrap()` early and inject context via provider if needed.

---

## 4) State Consolidation (safe moves)

* New structure:

```
src/state/
  domain/taskStore.ts     // moved from src/stores/taskStore.ts
  ui/appStore.tsx         // moved from src/store/AppStore.tsx (if exists)
  index.ts                // re-exports to keep old imports valid
```

* **Do not delete** originals immediately; commit move + re‑export in one PR to avoid breakage.

`src/state/index.ts`

```ts
export * from './domain/taskStore';
export * from './ui/appStore';
```

---

## 5) Testing & Mocks

### 5.1 MSW (Mock Service Worker)

* Handlers: 
  * `/auth/login`, `/auth/me`, `/auth/logout`
  * `/remote/kv/:key` (GET/PUT/DELETE)
  * `/remote/list/:ns` (GET)
* Scenarios: `simulator` vs `real` via flags.

### 5.2 Playwright Smoke (minimal, high signal)

* `tests/e2e/smoke.spec.ts`

  * login (sim mode), create task, edit task, page reload (state persists), logout.
  * flip `auth.useRealService=true` and re‑run using MSW mocked success.

---

## 6) Definition of Done (each PR)

* ✅ Type‑check clean (no new TS errors)
* ✅ Unit tests added where applicable
* ✅ E2E smoke passes locally
* ✅ Flags default keep current demo behavior
* ✅ README diff: **What changed** + **How to toggle**

---

## 7) PR Plan (small, reviewable)

1. **PR‑001 Services Core**: `http.ts`, `auth.ts`, MSW wiring, flags updates. *(\~200 LOC)*
2. **PR‑002 Remote Transport Stub**: `httpRemote.ts`, RemoteAdapter wiring behind flag + unit tests. *(\~180 LOC)*
3. **PR‑003 Bootstrap & Upload**: `bootstrap.ts`, refactor `SimpleUpload` to `http()`. *(\~150 LOC)*
4. **PR‑004 State Consolidation**: move to `src/state/` + re‑exports, no logic changes. *(\~80 LOC)*
5. **PR‑005 Smoke Tests**: Playwright scenarios for sim vs real. *(\~120 LOC)*

> Ship order is flexible; keep PRs independent where possible.

---

## 8) Success Metrics (exit criteria)

* **Switchable modes**: local‑only ↔ HTTP‑backed via flags without code edits.
* **Green pipeline**: typecheck, unit, e2e smoke all pass from a clean clone.
* **No regressions**: current demo UX untouched by default.
* **Future‑ready**: `RemoteAdapter` usable the moment a backend endpoint exists.

---

## 9) Risk Controls & Rollback

* All changes are **additive** + **flag‑gated**.
* Each PR includes a one‑line `rollback:` instruction (git revert SHA) in the description.
* MSW ensures UI flows keep working even if a backend is not ready.

---

## 10) Handoff Options (choose path next)

* **Backend focus**: Stand up a Next.js App Router BFF with `/auth/*`, `/remote/kv/*`, and `/remote/list/*` matching the transport contract.
* **Frontend focus**: Ship SQLite WASM FTS5 and richer task views; RemoteAdapter remains mocked.
* **Feature focus**: Implement business logic atop event store; persistence & auth already abstracted.

> This plan restores **predictability** and lets us pick a lane (backend, frontend, or features) with minimal rework.

---

## Notes (optional hardening)

- Feature flags runtime validation: add a small zod schema when loading `configs/feature-flags.json` to catch missing keys early.

```ts
// flags.ts (optional)
import raw from '../configs/feature-flags.json';
import { z } from 'zod';

const Flags = z.object({
  auth: z.object({ useRealService: z.boolean() }).default({ useRealService: false }),
  sync: z.object({ remoteEnabled: z.boolean() }).default({ remoteEnabled: false }),
  storage: z.object({ encrypted: z.boolean() }).default({ encrypted: false }),
});

export const flags = Flags.parse(raw);
```

