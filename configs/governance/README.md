# 🏛️ **SparkTasks Governance Documentation**

**Last Updated:** January 27, 2025  
**Status:** ✅ Current and Active  

---

## 📚 **Current Governance Documents**

### **🚂 Railway System Governance**
- **`RAILWAY_APP_SHELL_SSOT.md`** - **SINGLE SOURCE OF TRUTH** for all Railway components
  - ✅ **CONSOLIDATED** - Replaces all previous Railway governance documents
  - 🎯 **Covers all 10 Railway stations** + supporting components
  - 🚀 **MAPS4 compliance** with enhanced tokens and primitive utilities

### **🎨 UI-Enhanced System Governance**
- **`UI_ENHANCED_APP_SHELL_SSOT.md`** - Single source of truth for UI-Enhanced components
  - 🎯 Defines consumer contracts and development patterns
  - 🔗 Wrapper over foundation SSOT (no new design values)
  - 🚀 MAPS4 compliance with enhanced tokens and primitive utilities

### **🏗️ Architecture & Implementation**
- (Archived) See `configs/audit/UI_ARCHITECTURE_VALIDATION_REPORT_v7.md`

### **🛡️ Core Governance**
- (Archived) See `configs/audit/ANTI_DRIFT_GOVERNANCE_FINAL_v7.md`

---

## 🔗 Foundation SSOT (source of truth for names/values/helpers)
- `configs/governance/FOUNDATION_GOVERNANCE_SSOT.md` — Truth layers, prohibited patterns, drift audits, category baselines
- `tailwind.config.js` — Origin of names and scales
- `src/index.css` — Concrete CSS custom property values and directives
- `src/design/enhanced-tokens.ts` — Class-returning helpers (no values)

---

## 🔄 **Recent Consolidation**

**`RAILWAYSTATION_INTERFACE_SSOT.md`** has been **CONSOLIDATED** into **`RAILWAY_APP_SHELL_SSOT.md`** to eliminate confusion and provide a single source of truth for all Railway development.

**Benefits:**
- 🚫 **No more duplicate documents**
- 🎯 **Single authoritative source**
- 🔄 **Easier maintenance**
- 📚 **Comprehensive coverage**

---

## 📋 **Document Usage Guidelines**

1. **For Railway Development:** Use `RAILWAY_APP_SHELL_SSOT.md`
2. **For UI-Enhanced Development:** Use `UI_ENHANCED_APP_SHELL_SSOT.md`
3. **For Architecture Decisions:** Reference the appropriate master plan documents
4. **For Compliance:** Follow anti-drift governance rules

---

Legacy/overlap removed: `COMPONENT_UI_INTERFACE_SSOT.md`, `CODEBASE_OPTIMISE.md`, `MAPS3_TO_MAPS4_UPGRADE_SSOT.md`, `RAILWAY_IMPLEMENTATION_MASTER_PLAN_v7.md`, `SUPERIOR_STATE_OF_THE_ART_DEVELOPMENT_MASTERPLAN.md`.

**This governance structure ensures clarity, consistency, and compliance across SparkTasks with a single SSOT spine.**
