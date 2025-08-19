/**
 * Keyring lifecycle and encryption bootstrap helpers
 */

import { KeyringProvider } from '../../crypto/keyring';
import { StorageDriver } from '../../storage/types';

/**
 * Bootstrap keyring - init if absent or unlock if present
 */
export async function bootstrapKeyring(
  storage: StorageDriver,
  namespace: string,
  passphrase: string,
  iterations: number = 100000
): Promise<KeyringProvider> {
  const keyring = new KeyringProvider(storage, namespace);

  try {
    // Try to unlock existing keyring
    await keyring.unlock(passphrase);
  } catch {
    // No keyring exists, initialize new one
    await keyring.initNew(passphrase, iterations);
  }

  return keyring;
}

/**
 * Lock keyring (clear in-memory keys)
 */
export async function lockKeyring(keyring: KeyringProvider): Promise<void> {
  await keyring.lock();
}

/**
 * Unlock keyring with passphrase
 */
export async function unlockKeyring(
  keyring: KeyringProvider,
  passphrase: string
): Promise<void> {
  await keyring.unlock(passphrase);
}

/**
 * Change keyring passphrase (simplified - requires manual reimplementation)
 */
export async function changePassphrase(
  keyring: KeyringProvider,
  newPassphrase: string,
  iterations: number = 100000
): Promise<void> {
  // For now, we'll need to export/import backup to change passphrase
  // This is a simplified implementation
  const backup = await keyring.exportBackup();

  // Create new keyring with new passphrase
  await keyring.initNew(newPassphrase, iterations);

  // Import the backup (this will re-wrap with new passphrase)
  await keyring.importBackup(backup, newPassphrase);
}

/**
 * Rotate active DEK
 */
export async function rotateActiveDek(keyring: KeyringProvider): Promise<void> {
  await keyring.rotate();
}
