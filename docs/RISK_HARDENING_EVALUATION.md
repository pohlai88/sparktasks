# Risk-Hardening Enhancements: Evaluation & Implementation Plan

## 🎯 Executive Summary

After comprehensive analysis of the current **Phase B - Task 21 & 22** federated discovery implementation, I've evaluated five strategic risk-hardening enhancements. Based on effort/impact analysis, **4 out of 5 should be implemented immediately** for production readiness.

---

## 📊 Current Architecture Assessment

### **Discovery System Status** ✅

- **Components**: 11/11 tests passing across discovery registry, engine, and promotion
- **Security**: Signature verification, policy gates, no resurrection of REVOKED anchors
- **Storage**: E2EE compatible with full audit trails
- **LOC Budget**: ~210 lines (under 220 target)

### **Missing Risk Controls** ⚠️

- No TTL for stale pending anchors → accumulation risk
- No conflict resolution for `(orgId,kid)` collisions → trust ambiguity
- No observability counters → operational blindness
- No sequence rewind alerting → security incident detection gaps
- No rate limiting → potential abuse vector

---

## 🔍 Enhancement Evaluation Matrix

| Enhancement                  | Effort    | Impact    | Strategic Value | Risk Mitigation | Recommendation       | Rating          |
| ---------------------------- | --------- | --------- | --------------- | --------------- | -------------------- | --------------- |
| **Pending TTL**              | 🟢 Low    | 🟡 Medium | 🟡 Medium       | 🟡 Medium       | ✅ **Implement Now** | ⭐️⭐️⭐️⭐️    |
| **Conflict Policy**          | 🟡 Medium | 🔴 High   | 🔴 High         | 🔴 High         | ✅ **Implement Now** | ⭐️⭐️⭐️⭐️⭐️ |
| **Observability Counters**   | 🟢 Low    | 🟡 Medium | 🟡 Medium       | 🟡 Medium       | ✅ **Implement Now** | ⭐️⭐️⭐️⭐️    |
| **Sequence Rewind Alerting** | 🟢 Low    | 🟡 Medium | 🟡 Medium       | 🔴 High         | ✅ **Implement Now** | ⭐️⭐️⭐️⭐️    |
| **Rate Caps**                | 🟡 Medium | 🟡 Medium | 🔴 High         | 🟡 Medium       | ⏳ **Defer**         | ⭐️⭐️⭐️       |

---

## 🛠️ Detailed Implementation Analysis

### ✅ 1. **Pending TTL** (Auto-expire stale anchors)

**Validation**: Current `PendingAnchor` has `seenAt` timestamp but no expiry logic

```typescript
// Current: No cleanup mechanism
export interface PendingAnchor {
  seenAt: string; // ✅ Timestamp available
  // ❌ No TTL field or cleanup logic
}
```

**Implementation Scope**:

- Add `expiresAt` field to `PendingAnchor` (5 lines)
- TTL cleanup in `autoPromotePendingAnchors` (10 lines)
- Configuration via policy engine (5 lines)
- **Total**: ~20 lines

**Impact**: Prevents pending pool bloat, reduces false positives in discovery sync

---

### ✅ 2. **Conflict Policy** (`orgId,kid` collisions)

**Validation**: Current implementation has basic deduplication but no policy-driven conflict resolution

```typescript
// Current: Simple map-based deduplication
const map: Record<string, PendingAnchor> = {};
for (const anchor of anchors) {
  map[anchor.kid] = anchor; // ❌ Last-write-wins, no policy
}
```

**Implementation Scope**:

- Define `ConflictResolution` enum: `REJECT`, `PREFER_NEWER`, `PREFER_FIRST` (5 lines)
- Policy integration for conflict resolution (15 lines)
- Enhanced deduplication logic with source priority (25 lines)
- **Total**: ~45 lines

**Impact**: **Critical** - prevents trust ambiguity in multi-source discovery scenarios

---

### ✅ 3. **Observability Counters**

**Validation**: Current audit events exist but no aggregate metrics

```typescript
// Current: Individual audit events ✅
-FED_DISC_PULL - FED_DISC_PENDING - FED_DISC_PROMOTE - FED_DISC_REJECT;

// Missing: Aggregate counters ❌
```

**Implementation Scope**:

- Counter types: `DiscoveryMetrics` interface (5 lines)
- Increment logic in discovery engine (10 lines)
- Metric retrieval API (10 lines)
- **Total**: ~25 lines

**Impact**: Enables monitoring, capacity planning, and anomaly detection

---

### ✅ 4. **Sequence Rewind Alerting**

**Validation**: Current monotonic validation exists but no severity escalation

```typescript
// Current: Basic sequence checking ✅
if (pack.seq > current.src.packSeq) {
  // Update with newer pack
}

// Missing: Rewind detection alerts ❌
```

**Implementation Scope**:

- Rewind detection logic (10 lines)
- Audit severity escalation (`FED_DISC_REWIND_ALERT`) (5 lines)
- Policy integration for rewind thresholds (5 lines)
- **Total**: ~20 lines

**Impact**: **High security value** - sequence rewinds indicate potential replay attacks

---

### ⏳ 5. **Rate Caps for Discovery Pull**

**Validation**: No rate limiting currently implemented

```typescript
// Current: Unlimited pull frequency ❌
export async function runAnchorDiscovery(
  ns: string,
  plan: DiscPlan,
  // No rate limiting parameters
) { ... }
```

**Implementation Scope**:

- Rate limiter state tracking (20 lines)
- Policy-driven rate cap configuration (15 lines)
- Per-locator and global rate enforcement (25 lines)
- **Total**: ~60 lines

**Recommendation**: **Defer** - implement only if abuse patterns emerge in production

---

## 🚀 Implementation Roadmap

### **Phase 1: Critical Security (Immediate)**

1. **Conflict Policy** - Prevents trust ambiguity ⚠️ **Security Critical**
2. **Sequence Rewind Alerting** - Detects replay attacks 🔒 **Security Monitoring**

### **Phase 2: Operational Excellence (Short-term)**

3. **Pending TTL** - Prevents resource bloat 🧹 **Hygiene**
4. **Observability Counters** - Enables monitoring 📊 **Operations**

### **Phase 3: Scale Protection (Conditional)**

5. **Rate Caps** - Only if abuse observed 🚦 **Anti-abuse**

---

## 💡 Strategic Value Assessment

### **Why These Enhancements Matter**

- **Security**: Conflict resolution + rewind detection prevent federation attacks
- **Reliability**: TTL + observability prevent operational blind spots
- **Future-proofing**: Foundation for advanced federation features
- **Compliance**: Enhanced audit trails for security reviews

### **Production Readiness Impact**

- **Before**: Basic discovery with security gaps
- **After**: Hardened discovery with comprehensive monitoring

### **LOC Budget Impact**

- **Total additions**: ~110 lines across all 4 immediate enhancements
- **Within budget**: Current ~210 + 110 = 320 lines (manageable scope)
- **Modular**: Each enhancement is independent and testable

---

## ✅ **Recommendation: Implement Top 4 Now**

The **small effort, great impact** profile of these enhancements makes them ideal for immediate implementation. They transform the federation system from "functional" to "production-hardened" with minimal development overhead.

**Next Step**: Would you like me to implement any of these enhancements, starting with the highest-priority **Conflict Policy** for security-critical trust disambiguation?
