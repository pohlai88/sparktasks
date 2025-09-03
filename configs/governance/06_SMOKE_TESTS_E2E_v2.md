# PR‑005: Smoke Tests (E2E) — aligned v2
# Goal: High-signal, low-flake E2E checks that the app boots, MSW is active, and remote mocks work.
# Scope: two Playwright specs + tiny dev-only flag override in bootstrap + scripts + README notes.

*** Begin Patch
*** Add File: tests/e2e/tests/smoke.sim.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Smoke (Simulator mode)', () => {
  test('app boots without console errors and MSW responds', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (['error'].includes(msg.type())) errors.push(msg.text())
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect.soft(errors, `Console errors: \n${errors.join('\n')}`).toHaveLength(0)

    // Verify MSW handlers are live in dev: /auth/me returns mock user
    const res = await page.evaluate(async () => {
      const r = await fetch('/auth/me')
      return r.ok ? r.json() : null
    })
    expect(res).toBeTruthy()
    expect(res.email).toBe('mock@example.com')
  })
})

*** End Patch
```diff
*** Begin Patch
*** Add File: tests/e2e/tests/smoke.remote.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Smoke (Remote transport via MSW)', () => {
  test.beforeEach(async ({ context }) => {
    // Dev-only flag override consumed by bootstrap()
    await context.addInitScript(() => {
      try {
        localStorage.setItem('__spark_flags_override', JSON.stringify({
          sync: { remoteEnabled: true },
        }))
      } catch {}
    })
  })

  test('remote KV and LIST endpoints respond', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const statusPut = await page.evaluate(async () => {
      const now = new Date().toISOString()
      const r = await fetch('/remote/kv/spark:e1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 'A', updatedAt: now }),
      })
      return r.status
    })
    expect(statusPut).toBe(204)

    const got = await page.evaluate(async () => {
      const r = await fetch('/remote/kv/spark:e1')
      return r.ok ? r.json() : null
    })
    expect(got).toBeTruthy()
    expect(got.value).toBe('A')
    expect(typeof got.updatedAt).toBe('string')

    const listed = await page.evaluate(async () => {
      const r = await fetch('/remote/list/spark')
      return r.ok ? r.json() : null
    })
    expect(listed).toBeTruthy()
    expect(Array.isArray(listed.items)).toBe(true)
    // nextSince is optional; presence is not required
  })
})

*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/bootstrap.ts
@@
 export function bootstrap(): BootContext {
   const flags = featureFlags as any
+  // DEV-only: allow tests/dev to override flags via localStorage
+  try {
+    if (typeof window !== 'undefined' && (import.meta as any).env?.DEV) {
+      const raw = window.localStorage.getItem('__spark_flags_override')
+      if (raw) Object.assign(flags, JSON.parse(raw))
+    }
+  } catch {}
*** End Patch
```

```diff
*** Begin Patch
*** Update File: README.md
@@
 ### Playwright E2E
 Run with `pnpm test:e2e`. Ensure the dev server is running (e.g., `pnpm dev`).
+
+Smoke specs included:
+
+- `smoke.sim.spec.ts` — App boots, no console errors, MSW `/auth/me` returns mock user.
+- `smoke.remote.spec.ts` — Enables `sync.remoteEnabled` via a **dev-only** localStorage override and exercises `/remote/kv/:key` and `/remote/list/:ns` endpoints.
+
+Dev override key: `__spark_flags_override` (JSON). Consumed by `bootstrap()` in dev builds only.
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
-    "test:e2e": "playwright test",
+    "test:e2e": "playwright test",
     "test:smoke": "playwright test tests/e2e/tests/smoke.*.spec.ts",
     "test:remote": "vitest run tests/unit/httpRemote.spec.ts"
   },
*** End Patch
```

---

## PR‑005 Checklist (v2)

* [x] Add two Playwright smoke specs (sim + remote)
* [x] Dev-only flag override in `bootstrap()` for testability
* [x] README notes and convenience script
* [x] No behavior change for production builds
