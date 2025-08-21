import { DESIGN_TOKENS } from '@/design/tokens';
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface TestButtonProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual variant of the component
   */
  variant?: 'primary' | 'secondary' | 'ghost';

  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Children content
   */
  children?: React.ReactNode;
}

/**
 * TestButton component
 *
 * @example
 * <TestButton variant="primary" size="md">
 *   Content
 * </TestButton>
 */
export const TestButton = forwardRef<HTMLElement, TestButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles from DESIGN_TOKENS
          DESIGN_TOKENS.recipe.card.base,

          // Variant styles
          {
            primary: DESIGN_TOKENS.theme.light.surface.base,
            secondary: DESIGN_TOKENS.theme.light.surface.muted,
            ghost: DESIGN_TOKENS.theme.light.surface.transparent,
          }[variant],

          // Size styles
          {
            sm: DESIGN_TOKENS.sizing.button.sm,
            md: DESIGN_TOKENS.sizing.button.md,
            lg: DESIGN_TOKENS.sizing.button.lg,
          }[size],

          // State styles
          disabled && DESIGN_TOKENS.state.interaction.disabled,

          className
        )}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TestButton.displayName = 'TestButton';
