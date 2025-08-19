/**
 * Phase B - Task 24: Transparency Log Exports
 * Public API for Merkle accumulator with signed checkpoints
 */

export * from './types';
export {
  appendLeaf,
  genProof,
  verifyProof,
  emitCheckpoint,
  verifyCheckpoint,
  setAuditHook,
  setPolicyHook,
} from './api';
