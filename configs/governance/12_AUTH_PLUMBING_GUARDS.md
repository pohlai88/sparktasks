```diff
# PR‑011: Auth Plumbing & Guards
# Goal: Persist token, attach Authorization header, add login/logout flows, and guard /app when `auth.useRealService=true`.
# Scope: session util, http header attach, AuthService tweaks, router guard, login page, logout button, App routing, E2E smoke for guard.

*** Begin Patch
// No dependency changes required: `react-router-dom` is already present and search uses official `@sqlite.org/sqlite-wasm` from prior steps.
*** End Patch

```diff
*** Begin Patch
*** Update File: src/services/http.ts
@@
-export type HttpOptions = {
+export type HttpOptions = {
   method?: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
   headers?: Record<string, string>;
   body?: unknown; // JSON.stringify if not FormData
   signal?: AbortSignal;
   /** attach Authorization header if a token exists (default: true) */
   auth?: boolean;
 };
@@
-export async function http<T>(path: string, opt: HttpOptions = {}): Promise<T> {
+import { authHeader } from './session';

-export async function http<T>(path: string, opt: HttpOptions = {}): Promise<T> {
+export async function http<T>(path: string, opt: HttpOptions = {}): Promise<T> {
   const url = `${BASE_URL}${path}`;
   const headers: Record<string,string> = {
     Accept: 'application/json',
     ...(!isFormData(opt.body) ? { 'Content-Type': 'application/json' } : {}),
     ...(opt.headers ?? {}),
   };
   // Attach Authorization unless explicitly disabled or already present
   if (opt.auth !== false && !('Authorization' in headers)) {
     const h = authHeader();
     if (h) headers['Authorization'] = h;
   }
   const res = await fetch(url, {
     method: opt.method ?? 'GET',
     headers,
@@
 }
*** End Patch
```

```diff
*** Begin Patch
*** Add File: src/services/session.ts
@@
+const TOKEN_KEY = '__spark_auth_token'
+
+export function getToken(): string | null {
+  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
+}
+export function setToken(token: string) {
+  try { localStorage.setItem(TOKEN_KEY, token) } catch {}
+}
+export function clearToken() {
+  try { localStorage.removeItem(TOKEN_KEY) } catch {}
+}
+export function authHeader(): string | null {
+  const t = getToken();
+  return t ? `Bearer ${t}` : null;
+}
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/services/auth.ts
@@
 import { http } from './http';
 import { setToken, clearToken } from './session';
@@
 export const AuthService = {
   async login(creds: LoginCredentials, useReal: boolean): Promise<AuthResponse> {
     if (!useReal) {
       // Simulator path preserved
       const res = { token: 'sim-token', user: { id: 'sim', email: creds.email, name: 'Sim User' } };
       setToken(res.token);
       return res;
     }
     const res = await http<AuthResponse>('/auth/login', { method: 'POST', body: creds, auth: false });
     setToken(res.token);
     return res;
   },
   async me(useReal: boolean): Promise<User | null> {
     if (!useReal) return { id: 'sim', email: 'sim@example.com', name: 'Sim User' };
     return http<User>('/auth/me');
   },
   async logout(useReal: boolean): Promise<void> {
     if (useReal) {
       await http('/auth/logout', { method: 'POST' });
     }
     clearToken();
   },
 };
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/auth/AuthProvider.tsx
@@
-import flags from '../../configs/feature-flags.json'
-import { AuthService } from '../services/auth'
+import flags from '../../configs/feature-flags.json'
+import { AuthService } from '../services/auth'
+import { getToken } from '../services/session'
@@
-      const response = await AuthService.login(credentials, Boolean((flags as any).auth?.useRealService))
+      const response = await AuthService.login(credentials, Boolean((flags as any).auth?.useRealService))
@@
   }, [setLoading, setError])
@@
  // Restore session on mount (useRealService only)
  useEffect(() => {
    const useReal = Boolean((flags as any).auth?.useRealService)
    if (!useReal) return
    const t = getToken()
    if (!t) return
    setLoading(true)
    AuthService.me(true).then(u => setUser(u)).finally(() => setLoading(false))
  }, [])
*** End Patch
```

```diff
*** Begin Patch
*** Add File: src/routes/RequireAuth.tsx
@@
+import React from 'react'
+import { Navigate, useLocation } from 'react-router-dom'
+import flags from '../../configs/feature-flags.json'
+import { getToken } from '../services/session'

+export default function RequireAuth({ children }: { children: React.ReactNode }) {
+  const loc = useLocation()
+  const useReal = Boolean((flags as any).auth?.useRealService)
+  if (!useReal) return <>{children}</>
+  const token = getToken()
+  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />
+  return <>{children}</>
+}
*** End Patch
```

```diff
*** Begin Patch
*** Add File: src/pages/LoginPage.tsx
@@
+import React, { useState } from 'react'
+import { useNavigate, useLocation } from 'react-router-dom'
+import { AuthService } from '../services/auth'
+import flags from '../../configs/feature-flags.json'

+export default function LoginPage() {
+  const [email, setEmail] = useState('demo@example.com')
+  const [password, setPassword] = useState('password')
+  const [err, setErr] = useState<string | null>(null)
+  const nav = useNavigate()
+  const loc = useLocation() as any
+  const from = loc.state?.from?.pathname || '/app'

+  const onSubmit = async (e: React.FormEvent) => {
+    e.preventDefault()
+    setErr(null)
+    try {
+      await AuthService.login({ email, password }, Boolean((flags as any).auth?.useRealService))
+      nav(from, { replace: true })
+    } catch (e: any) {
+      setErr('Login failed')
+    }
+  }

+  return (
+    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
+      <form onSubmit={onSubmit} style={{ width: 340, background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
+        <h3 style={{ margin: '4px 0 12px' }}>Sign in</h3>
+        <label style={{ fontSize: 12 }}>Email</label>
+        <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ddd', marginBottom: 8 }} />
+        <label style={{ fontSize: 12 }}>Password</label>
+        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ddd', marginBottom: 12 }} />
+        {err && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{err}</div>}
+        <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', background: '#111', color: '#fff' }}>Continue</button>
+      </form>
+    </div>
+  )
+}
*** End Patch
```

```diff
*** Begin Patch
*** Add File: src/components/auth/LogoutButton.tsx
@@
+import React from 'react'
+import { useNavigate } from 'react-router-dom'
+import flags from '../../../configs/feature-flags.json'
+import { AuthService } from '../../services/auth'

+export default function LogoutButton() {
+  const nav = useNavigate()
+  const useReal = Boolean((flags as any).auth?.useRealService)
+  if (!useReal) return null
+  return (
+    <button
+      onClick={async () => { await AuthService.logout(true); nav('/login', { replace: true }) }}
+      style={{ position: 'fixed', top: 10, right: 10, padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', zIndex: 50 }}
+    >Logout</button>
+  )
+}
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/App.tsx
@@
 import GlobalSearch from './components/search/GlobalSearch'
 import FlagPanel from './components/dev/FlagPanel'
 import LogoutButton from './components/auth/LogoutButton'
 import RequireAuth from './routes/RequireAuth'
 import LoginPage from './pages/LoginPage'
 import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
@@
 export function App() {
   // existing app composition
   return (
-    <>
-      <RailwayConductor />
-      <RailwayMap />
-      <RailwayStation />
-      {/* Global overlays */}
-      <GlobalSearch />
-      <FlagPanel />
-    </>
+    <BrowserRouter>
+      <Routes>
+        <Route path="/" element={<Navigate to="/app" replace />} />
+        <Route path="/login" element={<LoginPage />} />
+        <Route
+          path="/app"
+          element={
+            <RequireAuth>
+              <>
+                <RailwayConductor />
+                <RailwayMap />
+                <RailwayStation />
+                <LogoutButton />
+              </>
+            </RequireAuth>
+          }
+        />
+      </Routes>
+      {/* Global overlays */}
+      <GlobalSearch />
+      <FlagPanel />
+    </BrowserRouter>
   )
 }
*** End Patch
```

```diff
*** Begin Patch
*** Add File: tests/e2e/tests/auth.guard.spec.ts
@@
+import { test, expect } from '@playwright/test'
+
+test.describe('Auth Guard (useRealService=true)', () => {
+  test.beforeEach(async ({ context }) => {
+    await context.addInitScript(() => {
+      try {
+        localStorage.setItem('__spark_flags_override', JSON.stringify({ auth: { useRealService: true } }))
+        localStorage.removeItem('__spark_auth_token')
+      } catch {}
+    })
+  })

+  test('redirects to /login, logs in, sees /app, then logs out', async ({ page }) => {
+    await page.goto('/app')
+    await expect(page).toHaveURL(/\/login$/)

+    await page.getByLabel('Email').fill('dev@example.com')
+    await page.getByLabel('Password').fill('pw')
+    await page.getByRole('button', { name: /continue/i }).click()

+    await expect(page).toHaveURL(/\/app$/)

+    // logout
+    await page.getByRole('button', { name: /logout/i }).click()
+    await expect(page).toHaveURL(/\/login$/)
+  })
+})
*** End Patch
```

```diff
*** Begin Patch
*** Update File: README.md
@@
 ### Auth (BFF or MSW)
 - When `auth.useRealService=false` (default), login is simulated and no routes are protected.
 - When `auth.useRealService=true`, the app:
   - Persists a session token (localStorage)
   - Attaches `Authorization: Bearer <token>` on requests (via `http()`)
   - Protects `/app` behind a login page
   - Provides a **Logout** button (top‑right) in auth mode
@@
 ### Playwright E2E
 - `pnpm test:smoke` for basic smokes.
+- `pnpm test:e2e` includes `auth.guard.spec.ts` which verifies redirect → login → protected route → logout. Works with MSW or a real BFF.
*** End Patch
```

---

## PR‑011 Checklist

* [x] Persist token and attach `Authorization` via `http()`
* [x] `AuthService.login/logout` manage token lifecycle
* [x] Route guard `RequireAuth` + `/login` page + `LogoutButton`
* [x] App routed with React Router; simulator mode unchanged
* [x] New E2E spec `auth.guard.spec.ts`

## Rollback

* `git revert <SHA-PR011>`
