# Policy Enforcement Integration Guide
*Safe deployment steps for production policy wiring*

## 🔍 Pre-Integration Checklist ✅

All items validated in `docs/POLICY_WIRING_VALIDATION.md`:

- [x] **8 Operation Entry Points Identified**
  - invite.create, invite.accept, membership.add, membership.change
  - membership.remove, override.create, override.accept, device.unlink

- [x] **Context Requirements Validated** 
  - All operations have access to: ns, actorId, actorRole, targetRole, operation
  - Membership state accessible via existing APIs
  - Storage driver available in all contexts

- [x] **Risk Assessment: LOW**
  - Non-breaking additive changes only
  - Observe mode provides safety net
  - Existing authorization flows preserved

- [x] **Policy Engine Ready**
  - 22/22 tests passing
  - Surgical enhancements complete
  - Production examples available

## 🚀 Phase 1: Safe Deployment (Observe Mode)

### Step 1: Wire Invite Operations (Highest Priority)

**File: `src/invite/create.ts`**
```typescript
// Around line 30, BEFORE existing authorization
import { enforcePolicy } from '../policy/engine';

// Add storage parameter to createInvite signature
export async function createInvite(args: InviteCreateArgs & { storage: StorageDriver }) {
  const { ns, signerPubB64u, role, storage } = args;
  
  // Get actor role context
  const membershipState = await membershipApi.getMembership();
  const actorRole = membershipState.users[signerPubB64u];
  
  // 🔌 POLICY ENFORCEMENT (Observe Mode)
  await enforcePolicy({
    op: "invite.create",
    ns,
    actorId: signerPubB64u,
    actorRole,
    targetRole: role,
    nowISO: new Date().toISOString()
  }, storage, { 
    observeMode: true,  // 🔍 Safe observation only
    audit: true         // Log all decisions
  });
  
  // Continue with existing logic...
  if (membershipApi) {
    await membershipApi.assertPermission(signerPubB64u, 'INVITE_CREATE', { targetRole: role });
  }
  // ... rest unchanged
}
```

**File: `src/invite/accept.ts`**
```typescript
// Around line 25, BEFORE existing validation
export async function acceptInvite(args: InviteAcceptArgs & { storage: StorageDriver }) {
  const { code, storage } = args;
  
  // Decode invite for context
  const invite = await decodeInviteCode(code);
  
  // 🔌 POLICY ENFORCEMENT (Observe Mode)
  await enforcePolicy({
    op: "invite.accept",
    ns: invite.ns,
    actorId: invite.actorId,
    actorRole: invite.targetRole, // Role being granted
    nowISO: new Date().toISOString()
  }, storage, { 
    observeMode: true,
    audit: true 
  });
  
  // Continue with existing validation...
}
```

### Step 2: Wire Membership Operations

**File: `src/membership/api.ts`**
```typescript
// In addMember function around line 125
export async function addMember(
  issuer: string, 
  user: string, 
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER',
  storage: StorageDriver // Add storage parameter
) {
  const state = await getMembership();
  
  // Handle initial owner case first
  if (state.owners.length === 0 && role === 'OWNER') {
    // Skip policy for bootstrap
    // ... existing initial owner logic
    return;
  }
  
  // 🔌 POLICY ENFORCEMENT (Observe Mode)
  await enforcePolicy({
    op: "membership.add",
    ns: namespace,
    actorId: issuer,
    actorRole: state.users[issuer],
    targetRole: role,
    nowISO: new Date().toISOString()
  }, storage, { 
    observeMode: true,
    audit: true
  });
  
  // Continue with existing authorization...
}

// Similar pattern for changeMember and removeMember functions
```

### Step 3: Monitor Observe Mode

**Add monitoring to track policy decisions:**
```typescript
// In policy engine, enhance audit logging
export async function enforcePolicy(context: PolicyContext, storage: StorageDriver, opts?: PolicyOptions) {
  // ... existing logic
  
  if (opts?.observeMode) {
    console.log(`🔍 POLICY OBSERVE: ${context.op} - ${decision} (${reason})`);
    
    // Track metrics
    await storage.putObject(`policy-metrics/${context.ns}/${context.op}`, JSON.stringify({
      decision,
      reason,
      context,
      timestamp: context.nowISO,
      mode: 'observe'
    }));
  }
  
  // ... rest of function
}
```

## 🎯 Phase 2: Gradual Enforcement

### Step 4: Environment-Based Enforcement

**Add environment controls:**
```typescript
// Update enforcement calls
await enforcePolicy(context, storage, { 
  observeMode: process.env.POLICY_ENFORCE !== '1',  // Conditional enforcement
  audit: true,
  commitCap: process.env.POLICY_ENFORCE === '1'
});
```

**Environment variables:**
```bash
# Development: Observe only
POLICY_ENFORCE=0

# Staging: Gradual rollout
POLICY_ENFORCE=1

# Production: Full enforcement
POLICY_ENFORCE=1
POLICY_STRICT=1
```

### Step 5: Operations Coverage

**Deploy in this order for maximum safety:**

1. **invite.create** - Most isolated, clear business value
2. **invite.accept** - Paired with create for complete flow
3. **membership.add** - Critical but well-defined
4. **membership.change** - Role modifications
5. **override.create** - Recovery operations  
6. **override.accept** - Complete recovery flow
7. **membership.remove** - Permanent actions
8. **device.unlink** - Technical operations

## 🔧 Phase 3: Production Hardening

### Step 6: Error Handling

**Wrap all policy calls with proper error context:**
```typescript
try {
  await enforcePolicy(context, storage, { audit: true });
} catch (error) {
  if (error.message.includes('POLICY_DENIED')) {
    // Log denial with context
    console.error(`🚫 Policy denied ${context.op}:`, {
      actor: context.actorId,
      operation: context.op,
      reason: error.message,
      timestamp: context.nowISO
    });
    
    // Throw user-friendly error
    throw new Error(`Operation denied by organization policy: ${context.op}`);
  }
  throw error; // Re-throw non-policy errors
}
```

### Step 7: Performance Monitoring

**Add performance tracking:**
```typescript
export async function enforcePolicy(context: PolicyContext, storage: StorageDriver, opts?: PolicyOptions) {
  const startTime = Date.now();
  
  try {
    // ... policy logic
  } finally {
    const duration = Date.now() - startTime;
    if (duration > 100) { // Log slow policies
      console.warn(`⚠️ Slow policy evaluation: ${context.op} took ${duration}ms`);
    }
  }
}
```

## 📊 Phase 4: Validation & Metrics

### Step 8: Policy Decision Tracking

**Create dashboard for policy decisions:**
```typescript
// Track policy decision ratios
await storage.putObject(`policy-dashboard/${context.ns}/daily-summary`, JSON.stringify({
  date: new Date().toISOString().split('T')[0],
  operations: {
    [context.op]: {
      allow: decision === 'ALLOW' ? 1 : 0,
      deny: decision === 'DENY' ? 1 : 0,
      reasons: { [reason]: 1 }
    }
  }
}));
```

### Step 9: Policy Health Checks

**Validate policy system health:**
```typescript
export async function validatePolicyHealth(ns: string, storage: StorageDriver) {
  // Check policy data integrity
  const policies = await loadPolicies(ns, storage);
  
  // Validate schema version compatibility
  if (policies?.minEngine && !isVersionCompatible(policies.minEngine)) {
    throw new Error(`Policy requires engine ${policies.minEngine}, have ${ENGINE_VERSION}`);
  }
  
  // Check for policy conflicts
  const conflicts = detectPolicyConflicts(policies);
  if (conflicts.length > 0) {
    console.warn(`⚠️ Policy conflicts detected:`, conflicts);
  }
  
  return { healthy: true, version: policies?.rev || 0 };
}
```

## 🛡️ Rollback Strategy

### Emergency Rollback
```typescript
// Environment variable for emergency bypass
if (process.env.POLICY_EMERGENCY_BYPASS === '1') {
  console.warn('🚨 EMERGENCY: Policy enforcement bypassed');
  return; // Skip all policy enforcement
}
```

### Gradual Rollback
```typescript
// Per-operation disable
const DISABLED_OPERATIONS = (process.env.POLICY_DISABLED_OPS || '').split(',');
if (DISABLED_OPERATIONS.includes(context.op)) {
  console.warn(`⚠️ Policy disabled for operation: ${context.op}`);
  return;
}
```

## ✅ Deployment Checklist

- [ ] Phase 1: Observe mode deployed to all 8 operations
- [ ] Monitoring confirms policy decisions are logged
- [ ] No performance degradation observed (< 100ms per policy check)
- [ ] Phase 2: Environment-based enforcement enabled
- [ ] Policy decision ratios look reasonable (not blocking legitimate operations)
- [ ] Phase 3: Error handling tested with invalid policy scenarios  
- [ ] Phase 4: Metrics dashboard shows healthy policy evaluations
- [ ] Rollback procedures tested and documented
- [ ] Team trained on policy management and troubleshooting

## 🔍 Success Metrics

- **Policy Decision Latency**: < 100ms per enforcement call
- **Decision Accuracy**: > 99% appropriate allow/deny ratios
- **System Reliability**: No increase in error rates
- **Policy Coverage**: 8/8 operations successfully protected
- **Audit Compliance**: 100% policy decisions logged
- **Emergency Response**: < 5 minute rollback capability

---

*This integration approach ensures zero breaking changes while gradually deploying comprehensive policy enforcement across all critical operations. The observe mode provides a safety net, and phased rollout minimizes risk.*
