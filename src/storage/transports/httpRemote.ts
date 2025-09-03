import { http } from '../../services/http'

// Transport that talks to /remote/kv/:key and /remote/list/:ns
// Uses full namespaced keys (e.g., spark:foo)

export class HttpRemote {
  async get(key: string): Promise<{ value: string; updatedAt: string } | null> {
    const res = await http<{ value?: string; updatedAt?: string } | null>(`/remote/kv/${encodeURIComponent(key)}`)
    if (!res) return null
    return { value: res.value ?? '', updatedAt: res.updatedAt ?? new Date().toISOString() }
  }

  async put(key: string, value: string, updatedAt: string): Promise<void> {
    await http(`/remote/kv/${encodeURIComponent(key)}`, { method: 'PUT', body: { value, updatedAt } })
  }

  async del(key: string, updatedAt: string): Promise<void> {
    await http(`/remote/kv/${encodeURIComponent(key)}`, { method: 'DELETE', body: { updatedAt } })
  }

  async list(prefix: string, since?: string): Promise<{
    items: Array<{ key: string; value: string; updatedAt: string }>
    nextSince?: string
  }> {
    const q = since ? `?since=${encodeURIComponent(since)}` : ''
    const res = await http<{ items: Array<{ key: string; value: string; updatedAt: string }>; nextSince?: string }>(
      `/remote/list/${encodeURIComponent(prefix)}${q}`
    )
    return { items: res.items ?? [], nextSince: res.nextSince }
  }
}


