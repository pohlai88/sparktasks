/**
 * Phase B - Task 22: Federated Anchor Discovery Types
 * Auto-discover and ingest trust anchors from remote sources
 */

// Where to discover anchors from
export interface AnchorLocator {
  orgId: string; // candidate issuer
  ref: {
    // how to reach packs using existing transport
    transportId: string; // logical name; test uses Mock/Memory transport
    path: string; // remote namespace/key prefix or manifest ref
  };
  since?: string; // optional cursor for incremental discovery
  note?: string;
}

// Conflict resolution strategies for duplicate (orgId,kid) pairs
export type ConflictResolution =
  | 'REJECT' // Reject conflicting anchor, keep existing
  | 'PREFER_NEWER' // Use anchor from pack with higher sequence
  | 'PREFER_FIRST' // Keep first-seen anchor, ignore later conflicts
  | 'PREFER_SOURCE'; // Use anchor from higher-priority source

// Anchors discovered but not yet trusted
export interface PendingAnchor {
  orgId: string;
  kid: string;
  pubB64u: string;
  status: 'ACTIVE' | 'RETIRED' | 'REVOKED';
  seenAt: string; // first seen ISO
  expiresAt?: string; // optional TTL for stale cleanup
  src: {
    transportId: string;
    path: string;
    packSeq: number;
    priority?: number; // source priority for conflict resolution
  };
}

// Discovery planning and execution
export interface DiscPlan {
  pulls: Array<{
    orgId: string;
    ref: {
      transportId: string;
      path: string;
    };
    nextSince?: string;
  }>;
}

export interface DiscResult {
  pulled: number;
  pendingAdded: number;
  promoted: number;
  rejected: number;
  conflicts: number; // anchors rejected due to conflicts
  rewinds: number; // sequence rewind alerts
  expired: number; // TTL-expired anchors cleaned
  errors: string[];
}

// Discovery metrics for observability
export interface DiscoveryMetrics {
  totalPulls: number;
  totalPending: number;
  totalPromoted: number;
  totalRejected: number;
  totalConflicts: number;
  totalRewinds: number;
  totalExpired: number;
  lastPullAt?: string;
  lastPromotionAt?: string;
}
