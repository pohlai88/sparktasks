import { describe, it, expect, beforeEach } from 'vitest'
import { HttpRemote } from '@/storage/transports/httpRemote'

// Minimal fetch shim to hit MSW in vitest environment if configured
// In this repo, unit tests run without a server; we can simulate via direct method expectations

describe('HttpRemote kv/list contract', () => {
  let remote: HttpRemote
  beforeEach(() => {
    remote = new HttpRemote()
  })

  it('builds URLs correctly for put/get/del', async () => {
    // We assert encoded paths without executing fetch by spying on global fetch
    const calls: Array<{ url: string; init?: RequestInit }> = []
    const original = globalThis.fetch
    // @ts-expect-error override for test
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), init })
      return new Response(JSON.stringify({ value: 'v', updatedAt: new Date().toISOString() }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    const key = 'spark:alpha'
    await remote.put(key, 'v', '2025-01-01T00:00:00.000Z')
    await remote.get(key)
    await remote.del(key, '2025-01-02T00:00:00.000Z')

    expect(calls[0].url.endsWith('/remote/kv/spark%3Aalpha')).toBe(true)
    expect(calls[1].url.endsWith('/remote/kv/spark%3Aalpha')).toBe(true)
    expect(calls[2].url.endsWith('/remote/kv/spark%3Aalpha')).toBe(true)

    // restore
    globalThis.fetch = original!
  })

  it('builds list URL with optional since', async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = []
    const original = globalThis.fetch
    // @ts-expect-error override for test
    globalThis.fetch = async (input: RequestInfo | URL) => {
      calls.push({ url: String(input) })
      return new Response(JSON.stringify({ items: [], nextSince: undefined }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    await remote.list('spark')
    await remote.list('spark', 'spark:alpha')

    expect(calls[0].url.endsWith('/remote/list/spark')).toBe(true)
    expect(calls[1].url.endsWith('/remote/list/spark?since=spark%3Aalpha')).toBe(true)

    globalThis.fetch = original!
  })
})


