import { http, HttpResponse } from 'msw'

// In‑memory stores
const kv = new Map<string, { value: string; updatedAt: string }>()

export const handlers = [
  // Auth (sim)
  http.post('/auth/login', async ({ request }) => {
    const body = (await request.json()) as any
    return HttpResponse.json({ token: 'msw-token', user: { id: 'u_demo', email: body.email, name: 'Demo' } })
  }),
  http.get('/auth/me', () => HttpResponse.json({ id: 'u_demo', email: 'mock@example.com', name: 'Mock User' })),
  http.post('/auth/logout', () => new HttpResponse(null, { status: 204 })),

  // Remote kv/list
  http.get('/remote/kv/:key', ({ params }) => {
    const k = String(params.key)
    const entry = kv.get(k) ?? null
    return HttpResponse.json(entry)
  }),
  http.put('/remote/kv/:key', async ({ params, request }) => {
    const { value, updatedAt } = (await request.json()) as { value: string; updatedAt?: string }
    const k = String(params.key)
    kv.set(k, { value, updatedAt: updatedAt ?? new Date().toISOString() })
    return new HttpResponse(null, { status: 204 })
  }),
  http.delete('/remote/kv/:key', async ({ params, request }) => {
    const k = String(params.key)
    // accept body for symmetry
    try { await request.json() } catch {}
    kv.delete(k)
    return new HttpResponse(null, { status: 204 })
  }),
  http.get('/remote/list/:ns', ({ params }) => {
    const ns = String(params.ns)
    const prefix = ns.endsWith(':') ? ns : `${ns}:`
    const items = Array.from(kv.entries())
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, { value, updatedAt }]) => ({ key, value, updatedAt }))
    const nextSince = items.length ? items[items.length - 1].key : undefined
    return HttpResponse.json({ items, nextSince })
  }),
]


