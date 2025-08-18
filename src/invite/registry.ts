/**
 * Invite registry for tracking usage state
 */

interface InviteStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

let storage: InviteStorage | null = null;

export function setInviteStorage(inviteStorage: InviteStorage): void {
  storage = inviteStorage;
}

export async function isUsed(inviteId: string): Promise<boolean> {
  if (!storage) throw new Error('Invite storage not configured');
  const key = `invite:${inviteId}:used`;
  const value = await storage.getItem(key);
  return value === 'true';
}

export async function markUsed(inviteId: string): Promise<void> {
  if (!storage) throw new Error('Invite storage not configured');
  const key = `invite:${inviteId}:used`;
  await storage.setItem(key, 'true');
}
