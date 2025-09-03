# SparkTasks Codebase Reality Audit (v1)

> Honest, code-cited inventory of what actually exists and runs today. Includes a light-weight cleanup/restructuring proposal to unblock development.

## Executive summary

- Frontend-only SPA (React + Vite). No backend/server or real database present in the repo.
- Persistence: browser localStorage with event-sourced tasks; optional encryption wrapper; remote sync adapter scaffold without a concrete transport.
- Auth is simulated client-side; tokens and user stored in localStorage; no live auth endpoints.
- Networking is minimal; only ad-hoc `fetch` in a file upload component and e2e test mocks.
- Strong testing/build scaffolding and a formal feature-flag registry exist.

## Evidence (code citations)

### App entry and composition
```20:24:src/main.tsx
ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```
```12:16:src/App.tsx
import { CharterWizard } from '@/components/railway/CharterWizard'
import { RailwayConductor } from '@/components/railway/RailwayConductor'
import { RailwayMap } from '@/components/railway/RailwayMap'
import { RailwayStation } from '@/components/railway/RailwayStation'
import { ENHANCED_DESIGN_TOKENS } from '@/design/enhanced-tokens'
```

### State management (Zustand)
```1:1:src/stores/taskStore.ts
import { create } from 'zustand';
```

### Event-sourced task storage (localStorage)
```14:21:src/domain/task/eventlog.ts
const STORAGE_KEY = 'spark.events.v1';
const STORAGE_TMP = 'spark.events.v1.tmp';
const SNAPSHOT_KEY = 'spark.snapshot.v1';
const TEMP_SNAPSHOT_KEY = 'spark.snapshot.v1.tmp';

// Default storage namespace
let defaultStorage = createNamespace('spark', new SyncLocalStorageDriver());
```
```54:66:src/domain/task/eventlog.ts
export function appendEvent(event: TaskEvent): void {
  const existingData = defaultStorage.getItem(STORAGE_KEY);
  const newLine = JSON.stringify(event);
  const updatedData = existingData ? `${existingData}\n${newLine}` : newLine;

  // Enhanced atomic write: temp → primary → cleanup temp
  // This ensures atomicity across all storage backends
  try {
    defaultStorage.setItem(STORAGE_TMP, updatedData);
    defaultStorage.setItem(STORAGE_KEY, updatedData);
    defaultStorage.removeItem(STORAGE_TMP);
  } catch (error) {
```

### Optional encryption-at-rest
```7:13:src/storage/encrypted.ts
export class EncryptedDriver implements StorageDriver {
  constructor(
    private inner: StorageDriver,
    private ns: string,
    private keys: KeyProvider
  ) {}
```

### Remote sync adapter scaffold (no concrete transport here)
```12:20:src/storage/remote.ts
export class RemoteAdapter implements StorageDriver {
  private local: StorageDriver;
  private remote: RemoteTransport;
  private namespace: string;
  private queue: QueueItem[] = [];
  private syncState: SyncState = { sinceToken: null, lastSyncAt: null };
  private lastTokenTime = 0;
  private tokenBucket: number;
```
```185:208:src/storage/remote.ts
async sync(): Promise<{ pushed: number; pulled: number }> {
  let pushed = 0;
  let pulled = 0;
  try {
    pushed = await this.pushQueue();
    pulled = await this.pullUpdates();
    this.syncState.lastSyncAt = new Date().toISOString();
    await this.saveSyncState();
  } catch (error) {
    if (this.isRateLimited(error)) {
      await this.exponentialBackoff();
    }
    throw error;
  }
  return { pushed, pulled };
}
```

### Authentication is simulated client-side
```187:198:src/auth/AuthProvider.tsx
const login = useCallback(
  async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call - replace with actual endpoint
      const response = await simulateAuthAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
```

### Networking usage (ad-hoc fetch)
```469:475:src/components/features-enhanced/FileSystem/SimpleUpload.tsx
const response = await fetch(uploadEndpoint, {
  method: 'POST',
  ...(uploadHeaders && { headers: uploadHeaders }),
  body: formData,
});
```

### Feature flags registry
```1:8:configs/feature-flags.json
{
  "comment": "USER'S APPROACH ADOPTED - Authoritative feature flag registry",
  "metadata": {
    "version": "6.1.0",
    "last_updated": "2025-08-27",
    "change_control": "formal_approval_required"
  },
```

### Playwright test scaffolding
```7:15:playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e/tests',
  testMatch: '**/*.spec.ts',
  testIgnore: /.*\.quarantine\.spec\.ts/,
  snapshotDir: './tests/e2e/__screenshots__',
  outputDir: './test-results/playwright-artifacts',
  reportSlowTests: { max: 5, threshold: 15_000 },
  fullyParallel: true,
  timeout: 45_000,
```

## What’s implemented today

- React + Vite SPA with Railway UI components and design tokens.
- Task domain is event-sourced; events and snapshots persisted to namespaced localStorage; atomic write patterns are implemented.
- Optional encryption driver (AES-GCM envelope) is available; can be enabled at bootstrap.
- RemoteAdapter implements rate limiting, backoff, metadata, and LWW resolution, but needs an actual `RemoteTransport` implementation to sync with a server.
- Zustand store integrates event sourcing and in-memory search.
- Auth context simulates endpoints and stores token/user in localStorage.
- Feature flags JSON and comprehensive Playwright/Vitest scaffolding exist.

## What’s not implemented yet (gaps)

Remaining (post-PR-001…PR-012):
- Web Worker offloading for search (perf guardrail for very large indexes)
- Cookie-based auth on BFF (HttpOnly/Strict cookies) and server-side session rotation
- CI/CD hardening (Lighthouse budget, Dependabot/Renovate, CODEOWNERS, PR template)

## Risks/limitations

- All data is local to the browser; refresh and device changes lose state unless we add remote sync.
- Simulated auth does not enforce server-side authorization.
- In-memory search scales only moderately compared to a true index (e.g., SQLite WASM FTS5).

## Implemented since v1 (Sept 2025)

Central platform pieces are now in the repo and flag-gated:

- Centralized HTTP client (`services/http.ts`) with normalized `HttpError`, JSON/text fallback, and tests.
- Auth service & guards: simulator mode preserved; “real service” mode routes via the HTTP client; route guard for protected areas.
- Remote transport over HTTP: `HttpRemote` implements `/remote/kv/:key` (PUT/GET/DELETE) and `/remote/list/:ns` (GET) with `updatedAt` + `nextSince`; MSW + BFF stub have parity.
- Bootstrap + flags: `bootstrap()` wires optional encryption, `RemoteAdapter`, and dev flag overrides; README/Quickstart document exact toggles.
- State consolidation: non-breaking re-exports under `src/state/*`.
- Local search: SQLite WASM FTS5 engine with graceful memory fallback; postinstall script copies `sqlite3.wasm`.
- Task → Search wiring: initial seeding + live updates behind `search.liveIndex`.
- Docs & smokes: Quickstart Matrix, Remote Contract, and smoke/E2E specs cover simulator/MSW/BFF modes.

## Known limitations (v1 → v2)

- Clock skew & LWW: Sync conflict policy is last-write-wins on `updatedAt`. If skew appears in real deployments, prefer server timestamps on write.
- Search in main thread: Search service runs on the UI thread; move to a Web Worker when the index grows large.
- Token storage: Simulator + “real service” flow currently rely on client-side token storage; production deployments should migrate to HttpOnly cookies on the BFF.
- Ops & governance: CI performance budgets, dependency update bots, and CODEOWNERS/PR template are recommended but not yet wired.

## Light cleanup and restructuring proposal

1) Resolve state module duplication
- Merge `src/store/AppStore.tsx` (demo reducer) and `src/stores/taskStore.ts` (real domain store) under a single `src/state/` namespace to reduce confusion:
  - `src/state/domain/taskStore.ts` (Zustand, event-sourced)
  - `src/state/ui/appStore.tsx` (UI/demo-only)
- Keep exports stable by re-exporting from `src/state/index.ts`.

2) Bootstrap encryption + async storage (optional but low-cost)
- At app startup, call the provided enablement utilities to wrap storage with `EncryptedDriver` and wire the async eventlog storage used by `hydrateAsync`.
- This can be gated by a feature flag to keep dev flows simple.

3) Introduce a centralized HTTP client and service layer
- Add `src/services/http.ts` (thin `fetch` wrapper: baseURL, JSON, error normalization).
- Add `src/services/auth.ts` and `src/services/eventlog.ts` (facades to real endpoints once backend is ready).
- Refactor `AuthProvider` to call `services/auth` instead of `simulateAuthAPI` behind a feature flag.

4) Prepare RemoteTransport contract and stub
- Define `src/storage/transports/httpRemote.ts` implementing `RemoteTransport` (put/get/del/list) over REST.
- Wire `RemoteAdapter` in an opt-in bootstrap so we can test push/pull sync with a mock server or MSW.

5) Folder hygiene (no breaking moves yet)
- Keep `src/components/railway` as-is; consider grouping shared primitives under `src/components/railway/_shared` when refactoring individual stations.
- Avoid deleting any docs (per governance); instead, link this audit from existing reports.

6) Optional package hygiene
- Either adopt `axios` project-wide via the new `http` wrapper or remove it from dependencies if unused; currently not used in code.

## Suggested near-term sequencing (1–2 days)

- Day 1
  - Create `services/http.ts`, `services/auth.ts`, `storage/transports/httpRemote.ts` (stubs + types).
  - Gate `AuthProvider` behind a feature flag to swap between `simulateAuthAPI` and real service.
  - Add bootstrap toggles for encrypted storage and async hydration.
- Day 2
  - Consolidate state under `src/state/` with re-exports; update imports in limited entry points only.
  - Introduce basic RemoteAdapter + HttpRemote wiring behind a flag and an MSW mock for local testing.

## Open decisions for you

- Target backend stack for RemoteTransport (simple REST, serverless, or full service). This repo currently contains no server code.
- Whether to integrate SQLite WASM FTS now or later; current in-memory search is functional but limited at scale.

---

If you want, I can execute the Day 1 tasks behind feature flags so the current demo remains intact, and produce a small PR diff to review before any broader moves.
