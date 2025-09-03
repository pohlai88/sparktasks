import { test, expect } from '@playwright/test'

test.describe('Smoke (remote kv/list) @smoke', () => {
  test('kv put → list returns items and nextSince', async ({ page }) => {
    await page.addInitScript(() => {
      // Enable remote mode via dev override flags
      try {
        localStorage.setItem('__spark_flags_override', JSON.stringify({
          sync: { remoteEnabled: true },
        }))
      } catch {}
    })

    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const putOk = await page.evaluate(async () => {
      const key = encodeURIComponent('spark:e1')
      const res = await fetch(`/remote/kv/${key}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: 'v1' }) })
      return res.status
    })
    expect(putOk).toBe(204)

    const list = await page.evaluate(async () => {
      const res = await fetch('/remote/list/spark')
      return res.ok ? await res.json() : null
    })
    expect(Array.isArray(list.items)).toBeTruthy()
    expect(list.items.length).toBeGreaterThan(0)
    expect(list.nextSince === null || typeof list.nextSince === 'string').toBeTruthy()
  })
})


