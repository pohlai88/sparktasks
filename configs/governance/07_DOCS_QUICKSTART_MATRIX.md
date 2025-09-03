````diff
# PR‑006: Docs Polish + Quickstart Matrix
# Goal: Make onboarding, modes, and flags crystal clear. Extract contracts & troubleshooting into focused docs.
# Scope: README overhaul, Quickstart Matrix, Flags guide, Remote Contract, Troubleshooting, PR/Branching guide.

*** Begin Patch
*** Update File: README.md
@@
-## Development
+## Development
@@
-### Feature Flags (configs/feature-flags.json)
-```json
-{
-  "auth": { "useRealService": false },
-  "sync": { "remoteEnabled": false },
-  "storage": { "encrypted": false }
-}
-```
-Toggle these to switch between **simulated** and **HTTP-backed** flows.
-
-### MSW (Mock Service Worker)
-Dev server auto-starts MSW in `src/main.tsx` (dev only). Real HTTP can be wired later.
-
-### API Base URL
-Set `VITE_API_BASE_URL` in `.env.local` if your backend isn’t on the same origin.
+### Quickstart Matrix
+See **docs/QUICKSTART_MATRIX.md** for copy‑paste setup of each mode (Simulator, Remote via MSW, Remote via Real BFF, Encrypted Local).
+
+### Feature Flags
+Flags live in `configs/feature-flags.json`. Semantics and defaults are documented in **docs/FLAGS.md**.
+
+### MSW (Mock Service Worker)
+Dev server auto‑starts MSW in `src/main.tsx` (DEV only). Remote contract is documented in **docs/REMOTE_CONTRACT.md**.
+
+### API Base URL
+Set `VITE_API_BASE_URL` in `.env.local` if your backend isn’t on the same origin.
@@
 ### Playwright E2E
@@
 Smoke specs included:
@@
 Dev override key: `__spark_flags_override` (JSON). Consumed by `bootstrap()` in dev builds only.
+
+### Troubleshooting
+See **docs/TROUBLESHOOTING.md** for fixes to common issues (CORS, MSW not starting, env vars, E2E flakes).
+
+### Contributing & PR Size Discipline
+See **docs/PR_GUIDE.md** for branching, conventional commits, small‑PR policy, and DoD.
*** End Patch
````

```diff
*** Begin Patch
*** Add File: docs/QUICKSTART_MATRIX.md
+# Quickstart Matrix

> Choose a mode and copy‑paste the exact steps. All modes keep the demo intact by default.

| Mode | Purpose | Flags (`configs/feature-flags.json`) | Env | Commands | Verify |
|---|---|---|---|---|---|
| **Simulator (Local‑only)** | Fastest dev without backend | `auth.useRealService=false`<br>`sync.remoteEnabled=false`<br>`storage.encrypted=false` | `VITE_API_BASE_URL` empty | `pnpm i` → `pnpm dev` | App boots; `GET /auth/me` returns mock user; tasks persist in localStorage |
| **Remote via MSW (Dev)** | Exercise RemoteAdapter contract | `sync.remoteEnabled=true` *(set via dev override or flags)* | `VITE_API_BASE_URL` empty | Dev override: open DevTools → `localStorage.setItem('__spark_flags_override', '{"sync":{"remoteEnabled":true}}')` → refresh | `PUT /remote/kv/:key` 204; `GET /remote/list/:ns` returns `{ items, nextSince? }` |
| **Remote via Real BFF** | Use real endpoints | `sync.remoteEnabled=true`<br>`auth.useRealService=true` | `.env.local` → `VITE_API_BASE_URL="http://localhost:3000"` | Start BFF → `pnpm dev` | App auth hits BFF `/auth/*`; RemoteAdapter pulls from `/remote/kv/*` and `/remote/list/*` |
| **Encrypted Local** | Local encryption at rest | `storage.encrypted=true` | (none) | `pnpm dev` | Tasks still load after refresh; storage blobs look encrypted |

## Commands Cheat‑Sheet
- Install: `pnpm i`
- Dev: `pnpm dev`
- Unit tests: `pnpm test:unit`
- Remote unit: `pnpm test:remote`
- Bootstrap unit: `pnpm test:bootstrap`
- Smoke E2E: `pnpm test:smoke`
- All E2E: `pnpm test:e2e`

## Notes
- Dev‑only flag override key: `__spark_flags_override` (JSON), consumed by `bootstrap()` when `import.meta.env.DEV`.
- The **Remote Contract** is minimal: see `docs/REMOTE_CONTRACT.md`.
*** End Patch
```

````diff
*** Begin Patch
*** Add File: docs/FLAGS.md
+# Feature Flags — Semantics & Defaults

Flags live in `configs/feature-flags.json`. They are read at runtime by `bootstrap()` and certain services.

```json
{
  "auth": { "useRealService": false },
  "sync": { "remoteEnabled": false },
  "storage": { "encrypted": false }
}
```

* `auth.useRealService`: when `true`, `AuthService` calls `/auth/*` via `services/http`. When `false`, the simulator returns a local fake token & user.
* `sync.remoteEnabled`: when `true`, `bootstrap()` wires `RemoteAdapter(HttpRemote)` so event logs can push/pull. When `false`, app is local‑only.
* `storage.encrypted`: when `true`, wraps the storage driver with `EncryptedDriver` (AES‑GCM envelope in dev). Replace key provider for production.

## Dev Override

In `DEV` builds only, `bootstrap()` merges `localStorage.__spark_flags_override` (JSON) into the in‑memory flags to enable E2E scenarios.
*** End Patch
````

```diff
*** Begin Patch
*** Add File: docs/REMOTE_CONTRACT.md
+# Remote Transport Contract (HTTP)

The app expects a minimal REST surface when `sync.remoteEnabled=true`:

```
PUT    /remote/kv/:key              { value: string, updatedAt: ISO }  -> 204
GET    /remote/kv/:key                                               -> 200 { value?: string, updatedAt: ISO } | null
DELETE /remote/kv/:key              { updatedAt: ISO }                 -> 204
GET    /remote/list/:ns                                                -> 200 { items: Array<{ key, value, updatedAt }>, nextSince?: string }
```

- `updatedAt` supports LWW and drift avoidance.
- `nextSince` is optional and can be used to paginate pulls.
- Namespacing: `:ns` should scope tenant/app (we use `spark`).
- Security: If deploying a real backend, protect endpoints and validate inputs server‑side.
*** End Patch
```

```diff
*** Begin Patch
*** Add File: docs/TROUBLESHOOTING.md
+# Troubleshooting

## MSW not starting
- Ensure you are in **dev** (`pnpm dev`). `src/main.tsx` starts MSW only when `import.meta.env.DEV` is true.
- Hard refresh the page. Check Network tab for `mockServiceWorker.js`.

## CORS / network failures
- If using a real BFF, set `VITE_API_BASE_URL` in `.env.local` and configure CORS on the server to allow the Vite origin.

## `HttpError` surfaced from `http()`
- Inspect `.status` and `.data`. The wrapper returns text when JSON parsing fails.

## E2E flakes
- Use `pnpm test:smoke` for minimal coverage. Ensure dev server is running and stable.

## Encrypted storage appears empty
- Encryption changes the visible payload. Verify by toggling the flag back to `false`; data written under encryption will be in a different namespace unless you migrate.
*** End Patch
```

```diff
*** Begin Patch
*** Add File: docs/PR_GUIDE.md
+# PR Guide — Small, Reversible, Flag‑Gated

## Branching & Commits
- Branch naming: `feat/<area>-<short>` or `chore/<area>-<short>` or `test/<area>-<short>`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`

## Size Discipline
- Target ≤ **300 LOC** per PR.
- Prefer **additive** changes behind feature flags; avoid breaking refactors.

## Definition of Done
- Type‑check clean
- Unit/E2E updated when relevant
- README/docs updated if behavior changes
- Rollback note in PR description: `git revert <SHA>`
*** End Patch
```

---

## PR‑006 Checklist

* [x] README polished with pointers to focused docs
* [x] Added Quickstart Matrix with copy‑paste commands
* [x] Added Flags guide, Remote Contract, Troubleshooting, PR Guide
* [x] No code behavior changes; docs only

## Rollback

* `git revert <SHA-PR006>`
```
