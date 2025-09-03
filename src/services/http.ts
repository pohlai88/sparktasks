export class HttpError extends Error {
  constructor(public status: number, public data: any, message?: string) {
    super(message || `HTTP ${status}`)
  }
}

const BASE = (import.meta as any).env?.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

function isFormData(x: unknown): x is FormData {
  return typeof FormData !== 'undefined' && x instanceof FormData
}

export type HttpOptions = {
  method?: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'
  headers?: Record<string, string>
  body?: unknown
  signal?: AbortSignal
  bearerToken?: string | null
}

export async function http<T=any>(path: string, opt: HttpOptions = {}): Promise<T> {
  const url = `${BASE}${path}`
  const headers: Record<string,string> = {
    Accept: 'application/json',
    ...(!isFormData(opt.body) ? { 'Content-Type': 'application/json' } : {}),
    ...(opt.headers ?? {}),
  }
  if (opt.bearerToken) headers['Authorization'] = `Bearer ${opt.bearerToken}`
  const res = await fetch(url, {
    method: opt.method ?? 'GET',
    headers,
    body: isFormData(opt.body) ? (opt.body as FormData) : opt.body != null ? JSON.stringify(opt.body) : undefined,
    signal: opt.signal,
  })
  const text = await res.text()
  const data = (() => { try { return text ? JSON.parse(text) : null } catch { return text } })()
  if (!res.ok) throw new HttpError(res.status, data)
  return data as T
}


