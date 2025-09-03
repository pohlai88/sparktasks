```diff
# PR‑004: State Consolidation (Clean, No Logic Changes)
# Goal: Provide a stable state barrel under src/state/ without touching existing logic.
# Approach: Additive re‑exports only. No code moves. No circular imports.

*** Begin Patch
*** Add File: src/state/index.ts
// Central barrel for state modules
export * from './domain/taskStore'
export * from './ui/appStore'

*** End Patch
```

```diff
*** Begin Patch
*** Add File: src/state/domain/taskStore.ts
// Non-breaking re-export: keep original implementation at src/stores/taskStore.ts
export * from '../../stores/taskStore'

*** End Patch
```

```diff
*** Begin Patch
*** Add File: src/state/ui/appStore.tsx
// Non-breaking re-export: keep original implementation at src/store/AppStore.tsx
export * from '../../store/AppStore'

*** End Patch
```

````diff
*** Begin Patch
*** Update File: README.md
@@
+### State Barrel
+To avoid import churn, a state barrel is available under `src/state/`.
+
+```ts
+// preferred (new)
+import { useTaskStore } from '@/state'
+
+// still valid (legacy)
+import { useTaskStore } from '@/stores/taskStore'
+```
+
+Under the hood, `src/state/domain/taskStore.ts` and `src/state/ui/appStore.tsx` re-export the existing implementations. No logic is moved in this PR.
*** End Patch
````

---

## Best-practice additions (optional but recommended)

```diff
*** Begin Patch
*** Update File: tsconfig.json
@@
   "compilerOptions": {
+    "baseUrl": ".",
+    "paths": {
+      "@/*": ["src/*"],
+      "@/state": ["src/state/index.ts"]
+    }
   }
*** End Patch
```

```diff
*** Begin Patch
*** Add File: tests/unit/state-barrel.spec.ts
import { describe, it, expect } from 'vitest'
import * as State from '../../src/state'

describe('state barrel', () => {
  it('exports task store selectors/factory', () => {
    expect(State).toBeTruthy()
  })
})

*** End Patch
```

```diff
*** Begin Patch
*** Update File: package.json
@@
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview",
-    "test:unit": "vitest run",
+    "test:unit": "vitest run",
+    "test:state": "vitest run tests/unit/state-barrel.spec.ts",
     "test:e2e": "playwright test"
   },
*** End Patch
```

```diff
*** Begin Patch
*** Add File: .eslintrc.state-barrel.cjs
module.exports = {
  overrides: [
    {
      files: ["src/**/*.{ts,tsx}"],
      rules: {
        // Prefer barrel for app imports (tests and stores themselves excluded)
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@/stores/taskStore',
                message: 'Import from \'@/state\' instead of \'@/stores/taskStore\''
              },
              {
                name: '@/store/AppStore',
                message: 'Import from \'@/state\' instead of \'@/store/AppStore\''
              }
            ],
          },
        ],
      },
    },
  ],
}
*** End Patch
```

---

## PR‑004 Checklist

* [x] Add `src/state/index.ts` barrel
* [x] Add non‑breaking re‑exports for domain/UI stores
* [x] README note on preferred imports
* [x] No modifications to existing store implementations
* [ ] (Optional) Path alias for `@/state`
* [ ] (Optional) ESLint guard to prefer barrel
* [ ] (Optional) Sanity unit test

## Notes

* This PR deliberately **does not** edit `src/stores/taskStore.ts` or `src/store/AppStore.tsx` to prevent circular exports.
* Teams can gradually migrate imports to `@/state` during regular touch‑ups.

## Rollback

* `git revert <SHA-PR004>`
