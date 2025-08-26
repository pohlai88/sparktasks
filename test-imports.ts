// Test file to verify primitives imports work correctly
import {
  AccessibleIcon,
  VisuallyHidden,
  Slot,
  DirectionProvider,
  RadixSlot,
} from './src/components/primitives';

import type {
  AccessibleIconProps,
  VisuallyHiddenProps,
  SlotProps,
  DirectionProviderProps,
} from './src/components/primitives';

console.log('✅ All imports successful!');
console.log('Available components:', {
  AccessibleIcon: typeof AccessibleIcon,
  VisuallyHidden: typeof VisuallyHidden,
  Slot: typeof Slot,
  DirectionProvider: typeof DirectionProvider,
  RadixSlot: typeof RadixSlot,
});
