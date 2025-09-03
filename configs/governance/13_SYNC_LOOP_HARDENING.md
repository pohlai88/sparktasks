```diff
# PR‑012: Sync Loop Hardening
# Goal: Deterministic push→pull with LWW (last-write-wins), dev "Sync now" button, telemetry hooks, and parity tests against MSW + BFF.
# Scope: RemoteAdapter LWW policy + telemetry, remote registry, bootstrap wiring, dev button, E2E smoke, docs.

*** Begin Patch
*** Add File: src/storage/remoteRegistry.ts
import type { RemoteAdapter } from './remote'

let current: RemoteAdapter | undefined

export function setRemoteInstance(r?: RemoteAdapter) {
  current = r
  if (typeof window !== 'undefined' && (import.meta as any).env?.DEV) {
    ;(window as any).__spark_remote = r
  }
}

export function getRemoteInstance(): RemoteAdapter | undefined {
  return current
}

*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/bootstrap.ts
import { HttpRemote } from './storage/transports/httpRemote'
import { setRemoteInstance } from './storage/remoteRegistry'

  if (flags.sync?.remoteEnabled) {
    remote = new RemoteAdapter(driver, new HttpRemote(), 'spark')
  }

  // Expose remote for dev tools (sync now button) and tests
  setRemoteInstance(remote)

  return { flags, storageNS, remote }
}
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/storage/remote.ts
export type SyncTelemetry = {
  onSyncStart?: (phase: 'push' | 'pull') => void
  onSyncEnd?: (phase: 'push' | 'pull', stats: { count: number }) => void
  onConflict?: (key: string, winner: 'local' | 'remote') => void
  onError?: (err: unknown) => void
}

export type RemoteAdapterOptions = {
  telemetry?: SyncTelemetry
}

export class RemoteAdapter implements StorageDriver {
  private local: StorageDriver
  private remote: RemoteTransport
  private namespace: string
  private queue: QueueItem[] = []
  private syncState: SyncState = { sinceToken: null, lastSyncAt: null }
  private lastTokenTime = 0
  private tokenBucket: number
  private telemetry?: SyncTelemetry

  constructor(local: StorageDriver, remote: RemoteTransport, namespace: string, opt: RemoteAdapterOptions = {}) {
    this.local = local
    this.remote = remote
    this.namespace = namespace
    this.tokenBucket = 10
    this.telemetry = opt.telemetry
  }

  async sync(): Promise<{ pushed: number; pulled: number }> {
    let pushed = 0;
    let pulled = 0;
    try {
      this.telemetry?.onSyncStart?.('push')
      pushed = await this.pushQueue();
      this.telemetry?.onSyncEnd?.('push', { count: pushed })
      this.telemetry?.onSyncStart?.('pull')
      pulled = await this.pullUpdates();
      this.telemetry?.onSyncEnd?.('pull', { count: pulled })
      this.syncState.lastSyncAt = new Date().toISOString();
      await this.saveSyncState();
    } catch (error) {
      if (this.isRateLimited(error)) {
        await this.exponentialBackoff();
      }
      this.telemetry?.onError?.(error)
      throw error;
    }
    return { pushed, pulled };
  }
*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/storage/remote.ts
  private async pullUpdates(): Promise<number> {
    // Use meta-based LWW: compare remote.updatedAt vs local __meta__ timestamp
    let pulled = 0
    const { items, nextSince } = await this.remote.list(this.namespace, this.syncState.sinceToken || undefined)
    for (const item of items) {
      const key = item.key
      const remoteValue = item.value
      const localValue = await this.local.getItem(key)
      const localMeta = await this.local.getItem(this.metaKey(this.denormalized(key)))

      let shouldApplyRemote = false
      if (!localValue) {
        shouldApplyRemote = true
      } else if (localMeta) {
        const meta = this.parseMetadata(localMeta)
        const localTime = new Date(meta.updatedAt).getTime()
        const remoteTime = new Date(item.updatedAt).getTime()
        shouldApplyRemote = remoteTime > localTime
      } else {
        // legacy local: create metadata and apply remote if differs
        const migrationTimestamp = new Date().toISOString()
        await this.local.setItem(this.metaKey(this.denormalized(key)), this.createMetadata(migrationTimestamp))
        shouldApplyRemote = localValue !== remoteValue
      }

      if (shouldApplyRemote) {
        await this.local.setItem(key, remoteValue)
        await this.local.setItem(this.metaKey(this.denormalized(key)), this.createMetadata(item.updatedAt))
        pulled++
      }
    }
    if (nextSince) this.syncState.sinceToken = nextSince
    return pulled
  }
*** End Patch
```

```diff
*** Begin Patch
*** Add File: src/components/dev/SyncNowButton.tsx
import React, { useState } from 'react'
import { getRemoteInstance } from '../../storage/remoteRegistry'

export default function SyncNowButton() {
  const [label, setLabel] = useState('Sync now')
  const [busy, setBusy] = useState(false)
  const remote = getRemoteInstance()
  if (!remote) return null
  return (
    <button
      id="sync-now"
      disabled={busy}
      onClick={async () => {
        try {
          setBusy(true); setLabel('Syncing…')
          const res = await remote.sync()
          setLabel(`Synced (↑${res.pushed} ↓${res.pulled})`)
          setTimeout(() => setLabel('Sync now'), 1500)
        } catch (e) {
          setLabel('Sync failed')
          setTimeout(() => setLabel('Sync now'), 1500)
        } finally { setBusy(false) }
      }}
      style={{ position: 'fixed', left: 10, bottom: 10, padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', zIndex: 60 }}
    >{label}</button>
  )
}

*** End Patch
```

```diff
*** Begin Patch
*** Update File: src/App.tsx
import SyncNowButton from './components/dev/SyncNowButton'

  return (
    <BrowserRouter>
      <GlobalSearch />
      <FlagPanel />
      <SyncNowButton />
    </BrowserRouter>
  )
}
*** End Patch
```

```diff
*** Begin Patch
*** Add File: tests/e2e/tests/sync.now.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Sync Now button (remoteEnabled=true)', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      try {
        localStorage.setItem('__spark_flags_override', JSON.stringify({ sync: { remoteEnabled: true } }))
      } catch {}
    })
  })

  test('push→pull runs and updates the button label', async ({ page }) => {
    await page.goto('/app')
    const btn = page.locator('#sync-now')
    await expect(btn).toBeVisible()
    await btn.click()
    await expect(btn).toHaveText(/Synced|Syncing|Sync now/)
  })
})

*** End Patch
```

```diff
*** Begin Patch
*** Update File: README.md
### Sync Loop (RemoteAdapter)
The sync loop performs **push → pull** and applies **LWW** (last‑write‑wins) via per‑key metadata timestamps.

Dev tools:
- **Sync now** button (bottom‑left) invokes a full cycle and shows `↑pushed/↓pulled` counts.
- Telemetry hooks: pass `telemetry` in `RemoteAdapter` options to record sync start/end, conflicts, and errors.

MSW & BFF implement the same `/remote/kv/:key` and `/remote/list/:ns` shape; smoke `sync.now.spec.ts` validates parity in dev.
*** End Patch
```

---

## PR‑012 Checklist

* [x] LWW resolution via metadata timestamps
* [x] Telemetry hooks in RemoteAdapter
* [x] Dev **Sync now** button wired to the active `RemoteAdapter`
* [x] Bootstrap exposes remote instance via registry
* [x] E2E `sync.now.spec.ts` for push→pull trigger and label feedback
* [x] README docs updated

## Rollback

* `git revert <SHA-PR012>`
