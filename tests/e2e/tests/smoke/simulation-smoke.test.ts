import { test, expect } from '@playwright/test'

test.describe('Smoke (sim mode) @smoke', () => {
  test('app boots and /auth/me returns mock user', async ({ page }) => {
    // Ensure no dev override flags for this test
    await page.addInitScript(() => {
      try { localStorage.removeItem('__spark_flags_override') } catch {}
    })

    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const user = await page.evaluate(async () => {
      const res = await fetch('/auth/me')
      return res.ok ? await res.json() : null
    })

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.email).toContain('@')
  })
})


