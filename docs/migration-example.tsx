/**
 * Simple Migration Example - Badge Component Enhancement
 *
 * Demonstrates surgical migration of existing components to use Radix utilities.
 * This shows the before/after pattern for your Badge component.
 */

// BEFORE: Current Badge with manual accessibility patterns
const _BadgeBefore = () => (
  <span className='badge'>
    <svg aria-hidden='true' focusable='false'>
      <path d='...' />
    </svg>
    Badge Text
    <span className='sr-only'>Success</span>
  </span>
);

// AFTER: Enhanced Badge with Radix utilities
const _BadgeAfter = () => (
  <span className='badge'>
    <AccessibleIcon>
      <svg>
        <path d='...' />
      </svg>
    </AccessibleIcon>
    Badge Text
    <VisuallyHidden>Success</VisuallyHidden>
  </span>
);

// Benefits:
// ✅ More robust screen reader support
// ✅ Consistent accessibility patterns
// ✅ Better cross-browser compatibility
// ✅ Zero visual changes
// ✅ Zero breaking API changes
