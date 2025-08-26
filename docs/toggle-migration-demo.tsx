/**
 * MIGRATION DEMO: Toggle.tsx Enhancement
 *
 * This shows exactly how to migrate your Toggle component with Radix utilities.
 * BEFORE vs AFTER comparison with your actual current code.
 */

// STEP 1: Add imports at the top of Toggle.tsx
import { AccessibleIcon, VisuallyHidden } from '@/components/primitives';

// STEP 2: Replace the LoadingSpinner component (lines 279-300)

// BEFORE:
const LoadingSpinnerBefore = () => (
  <svg
    className='h-4 w-4 animate-spin text-current'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    aria-hidden='true' // ← Manual accessibility
  >
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
    />
    <path
      className='opacity-75'
      fill='currentColor'
      d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    />
  </svg>
);

// AFTER:
const LoadingSpinnerAfter = () => (
  <AccessibleIcon>
    <svg
      className='h-4 w-4 animate-spin text-current'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      // aria-hidden removed - handled by AccessibleIcon
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      />
      <path
        className='opacity-75'
        fill='currentColor'
        d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      />
    </svg>
  </AccessibleIcon>
);

// STEP 3: Replace the screen reader announcement (lines 351-354)

// BEFORE:
const ScreenReaderBefore = ({ isPressed, pressedLabel, unpressedLabel }) => (
  <span className='sr-only' aria-live='polite'>
    {isPressed ? pressedLabel : unpressedLabel}
  </span>
);

// AFTER:
const ScreenReaderAfter = ({ isPressed, pressedLabel, unpressedLabel }) => (
  <VisuallyHidden aria-live='polite'>
    {isPressed ? pressedLabel : unpressedLabel}
  </VisuallyHidden>
);

// STEP 4: Apply to all ToggleIcons (6 more instances at lines 471-561)

// Example for Play/Pause icon:
// BEFORE:
const PlayPauseIconBefore = () => (
  <svg
    className='h-4 w-4'
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden='true' // ← Manual pattern repeated 6 times
  >
    <path d='M8 5v14l11-7z' />
  </svg>
);

// AFTER:
const PlayPauseIconAfter = () => (
  <AccessibleIcon>
    <svg
      className='h-4 w-4'
      viewBox='0 0 24 24'
      fill='currentColor'
      // aria-hidden removed
    >
      <path d='M8 5v14l11-7z' />
    </svg>
  </AccessibleIcon>
);

/**
 * MIGRATION IMPACT FOR TOGGLE.tsx:
 *
 * ✅ 8 accessibility improvements
 * ✅ More robust screen reader support
 * ✅ Consistent icon handling patterns
 * ✅ Zero visual changes
 * ✅ Zero breaking API changes
 * ✅ Better cross-browser compatibility
 *
 * TIME ESTIMATE: 15-20 minutes
 * RISK LEVEL: Very Low
 * IMPACT LEVEL: High
 */
