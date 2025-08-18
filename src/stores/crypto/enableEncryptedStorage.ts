import type { StorageDriver } from '../../storage/types';
import { EncryptedDriver } from '../../storage/encrypted';
import type { KeyProvider } from '../../crypto/types';
import { configureAsyncEventlogStorage } from '../taskStore';

/**
 * Compose EncryptedDriver over any StorageDriver and route eventlog async API through it.
 * Does not alter your legacy sync API—tests that need E2EE should use hydrateAsync().
 */
export function enableEncryptedStorage(
  inner: StorageDriver,
  keyring: KeyProvider,
  ns = 'spark'
) {
  const encrypted = new EncryptedDriver(inner, ns, keyring);
  configureAsyncEventlogStorage(encrypted);
  return encrypted;
}
