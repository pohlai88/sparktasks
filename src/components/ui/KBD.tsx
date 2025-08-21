import * as React from 'react';

import { combineTokens, DESIGN_TOKENS } from '@/design/tokens';

export interface KBDProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  variant?: 'default' | 'combo' | 'shortcut' | 'pressed';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  'aria-label'?: string;
  pressed?: boolean;
  separator?: React.ReactNode;
}

// Optional token shortcuts if you later add DESIGN_TOKENS.recipe.kbd
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TK = (DESIGN_TOKENS as any).recipe?.kbd ?? {};

// Type-safe access to variant classes
type VariantType = 'default' | 'combo' | 'shortcut' | 'pressed';
const getVariantFromTokens = (variant: VariantType): string => {
  if (typeof TK === 'object' && TK !== null && variant in TK) {
    return String(TK[variant as keyof typeof TK]);
  }
  return '';
};

const sizeText = {
  xs: DESIGN_TOKENS.typography.inline.textXs ?? 'text-[10px]',
  sm: DESIGN_TOKENS.typography.inline.textSm ?? 'text-xs',
  md: DESIGN_TOKENS.typography.inline.textSm ?? 'text-xs',
  lg: DESIGN_TOKENS.typography.inline.textBase ?? 'text-sm',
} as const;

// Minimal padding fallbacks (prefer to move to tokens later)
const sizePad = {
  xs: 'px-1 py-0.5',
  sm: 'px-1.5 py-0.5',
  md: 'px-2 py-1',
  lg: 'px-2.5 py-1.5',
} as const;

// Common keyboard shortcuts and their display names
export const KBDLabels = {
  // Modifier keys with symbols
  cmd: '⌘',
  command: '⌘',
  ctrl: 'Ctrl',
  control: 'Ctrl',
  alt: 'Alt',
  option: '⌥',
  shift: '⇧',
  meta: '⌘',

  // Arrow keys
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',

  // Special keys
  enter: '⏎',
  return: '⏎',
  backspace: '⌫',
  delete: '⌦',
  del: '⌦',
  tab: '⇥',
  space: 'Space',
  spacebar: 'Space',
  escape: 'Esc',
  esc: 'Esc',

  // Function keys
  f1: 'F1',
  f2: 'F2',
  f3: 'F3',
  f4: 'F4',
  f5: 'F5',
  f6: 'F6',
  f7: 'F7',
  f8: 'F8',
  f9: 'F9',
  f10: 'F10',
  f11: 'F11',
  f12: 'F12',

  // Common keys
  home: 'Home',
  end: 'End',
  pageup: 'PgUp',
  pagedown: 'PgDn',
  pgup: 'PgUp',
  pgdn: 'PgDn',
  insert: 'Ins',
  ins: 'Ins',
} as const;

/**
 * KBD: Enterprise-grade keyboard key display component
 *
 * Features:
 * - Multiple variants (default, combo, shortcut, pressed states)
 * - Responsive sizing (xs, sm, md, lg)
 * - Dark mode support with theme-aware styling
 * - Accessibility compliant with proper semantics
 * - Built-in key label mappings for common shortcuts
 * - DESIGN_TOKENS SSOT compliance
 * - Support for key combinations and separators
 * - Press state animations with proper visual feedback
 *
 * @example
 * <KBD>⌘</KBD>
 * <KBD variant="combo">Ctrl+C</KBD>
 * <KBD variant="shortcut" size="sm">Esc</KBD>
 * <KBD pressed>Enter</KBD>
 */
export const KBD = React.forwardRef<HTMLElement, KBDProps>(function KBD(
  {
    children,
    variant = 'default',
    size = 'md',
    className,
    pressed = false,
    separator,
    'aria-label': ariaLabel,
    ...props
  },
  ref
) {
  const effectiveVariant = pressed ? 'pressed' : variant;

  // Base comes from tokens; variants can be extended in tokens as recipe.kbd.*
  const baseClass = combineTokens(
    DESIGN_TOKENS.recipe.keyboardKey,
    TK.base // optional extension point
  );

  const variantClass =
    getVariantFromTokens(effectiveVariant) ||
    (effectiveVariant === 'combo'
      ? 'tracking-wide'
      : effectiveVariant === 'pressed'
        ? combineTokens(
            'translate-y-px shadow-inner',
            'motion-reduce:transition-none' // respect reduced motion
          )
        : '');

  const kbdClasses = combineTokens(
    'inline-flex items-center justify-center font-mono font-medium',
    'transition-all duration-150 ease-out motion-reduce:transition-none',
    'select-none', // keep selectable off
    'min-w-[1.5em] text-center',
    baseClass,
    sizeText[size],
    sizePad[size],
    variantClass,
    className
  );

  // Accessible label: only override if provided; otherwise let <kbd> read its content
  const computedAriaLabel = ariaLabel;

  // Render combo: "Ctrl+K" -> tokenized parts + visual separator
  const renderKeyContent = () => {
    if (
      typeof children === 'string' &&
      effectiveVariant === 'combo' &&
      children.includes('+')
    ) {
      const parts = children.split('+').map(k => k.trim());
      const defaultSep = (
        <span
          className={combineTokens(
            'mx-1',
            'text-slate-400',
            'dark:text-slate-500'
          )}
          aria-hidden='true'
        >
          +
        </span>
      );
      return parts.map((raw, i) => {
        const labelMap = KBDLabels;
        const key = raw.toLowerCase() as keyof typeof labelMap;
        const display = labelMap[key] ?? raw;
        return (
          <React.Fragment key={`${raw}-${i}`}>
            {i > 0 && (separator ?? defaultSep)}
            <span className={combineTokens('font-medium')}>{display}</span>
          </React.Fragment>
        );
      });
    }

    // Single key or custom node
    if (typeof children === 'string') {
      const key = children.toLowerCase() as keyof typeof KBDLabels;
      return KBDLabels[key] ?? children;
    }

    return children;
  };

  // For combos, provide a clean SR label like "Control plus K" if none was given
  const srLabel =
    !computedAriaLabel && typeof children === 'string' && children.includes('+')
      ? children.replaceAll('+', ' plus ')
      : undefined;

  return (
    <kbd
      ref={ref}
      className={kbdClasses}
      aria-label={computedAriaLabel}
      data-testid='kbd'
      data-variant={effectiveVariant}
      data-size={size}
      data-pressed={pressed ? 'true' : undefined}
      title={typeof children === 'string' ? children : undefined}
      {...props}
    >
      {renderKeyContent()}
      {srLabel && <span className={combineTokens('sr-only')}>{srLabel}</span>}
    </kbd>
  );
});

KBD.displayName = 'KBD';

export default KBD;
