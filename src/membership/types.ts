/**
 * Workspace Membership & Roles - Phase B Task 14
 * Headless role-based membership with E2EE compatibility
 */

export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
export type MOp = 'ADD' | 'REMOVE' | 'ROLE';

export interface MRecord {
  v: 1;
  id: string;
  ts: string;
  op: MOp;
  user: string;
  role?: Role;
  workspaceId: string; // Org boundary enforcement
  issuer: { pubB64u: string; sigB64u: string };
}

export interface MState {
  users: Record<string, Role>;
  owners: string[];
  ts?: string;
  lastOwnerTransition?: string; // Track concurrent OWNER changes
}

export interface MTransport {
  list(
    ns: string,
    since?: string
  ): Promise<{ keys: string[]; nextSince?: string }>;
  get(key: string): Promise<string | null>;
  put(key: string, data: string, ts?: string): Promise<void>;
}

export interface MPlan {
  pullKeys: string[];
  since?: string;
}

export interface MResult {
  applied: number;
  pushed: number;
  errors: string[];
  completed: boolean;
}
