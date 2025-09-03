import flags from '../configs/feature-flags.json'
import { LocalStorageDriver, SyncLocalStorageDriver, createNamespace } from './storage/local'
import { EncryptedDriver } from './storage/encrypted'
import { RemoteAdapter } from './storage/remote'
import { HttpRemote } from './storage/transports/httpRemote'

export type BootContext = { flags: typeof flags }

export function bootstrap(): BootContext {
  try {
    if (typeof window !== 'undefined' && (import.meta as any).env?.DEV) {
      const raw = window.localStorage.getItem('__spark_flags_override')
      if (raw) Object.assign(flags as any, JSON.parse(raw))
    }
  } catch {}
  // Prepare storage based on flags (non-breaking; returns flags for now)
  const baseAsync = new LocalStorageDriver()
  const keyProvider: any = {
    getActiveKey: async () => ({
      kid: 'k_dev',
      key: await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt','decrypt'])
    }),
    getByKid: async (_kid: string) => null,
  }
  const asyncDriver = flags.storage?.encrypted ? new EncryptedDriver(baseAsync, 'spark', keyProvider) : baseAsync

  // Sync legacy namespace (for existing eventlog calls)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nsSync = createNamespace('spark', new SyncLocalStorageDriver())

  if (flags.sync?.remoteEnabled) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const remoteAdapter = new RemoteAdapter(asyncDriver, new HttpRemote() as any, 'spark')
  }

  return { flags }
}


export function getFlags(): typeof flags {
  return flags
}


