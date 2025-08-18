/**
 * Phase B - Task 25: Witness Co-Signed Checkpoints (Headless)
 */

// Export all types
export * from './compact-types';

// Export API functions
export { addWitness, listWitnesses, setWitnessStatus, buildWitnessPayload, ingestWitnessSig, verifyWitnessedCheckpoint, setAuditHook, setPolicyHook, setMetricsHook } from './compact-api';
