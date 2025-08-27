/**
 * MotionLayout Component
 * 
 * Animation-enhanced layout system using framer-motion for sophisticated
 * layout transitions and interactive animations.
 * 
 * Architectural Features:
 * - Framer Motion integration for layout animations
 * - Layout transitions and orchestration
 * - Gesture support and touch interactions
 * - Advanced timing and easing functions
 * - Shared layout animations between components
 * 
 * Part of the MAPS v3.0 layout enhanced component system.
 */

import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// Import framer-motion components
import { 
  motion,
  AnimatePresence,
  type Variants,
  type Transition
} from 'framer-motion';

// Motion Layout Variants
const motionLayoutVariants = cva(
  [
    // Base styles
    'relative',
  ],
  {
    variants: {
      transition: {
        instant: '',
        fast: '',
        normal: '',
        slow: '',
        custom: '',
      },
      overflow: {
        visible: 'overflow-visible',
        hidden: 'overflow-hidden',
        auto: 'overflow-auto',
        scroll: 'overflow-scroll',
      },
    },
    defaultVariants: {
      transition: 'normal',
      overflow: 'visible',
    },
  }
);

// Predefined animation variants
const animationVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  stagger: {
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
};

// Predefined transitions
const motionTransitions: Record<string, Transition> = {
  instant: { duration: 0 },
  fast: { 
    type: 'spring',
    stiffness: 400,
    damping: 30,
  },
  normal: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  },
  slow: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  },
  smooth: {
    type: 'tween',
    duration: 0.3,
    ease: 'easeInOut',
  },
};

// Component Prop Types
export interface MotionLayoutProps {
  className?: string;
  asChild?: boolean;
  children?: React.ReactNode;
  
  // Animation props
  animationKey?: string;
  variants?: Variants;
  initial?: string | boolean;
  animate?: string;
  exit?: string;
  
  // Transition props
  transitionType?: keyof typeof motionTransitions;
  customTransition?: Transition;
  
  // Layout props
  layoutId?: string;
  enableLayout?: boolean;
  
  // Gesture props
  drag?: boolean | 'x' | 'y';
  
  // Advanced props
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

export interface AnimatePresenceWrapperProps {
  children: React.ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
  initial?: boolean;
  presenceAffectsLayout?: boolean;
}

// MotionLayout Component
export const MotionLayout = forwardRef<
  HTMLDivElement,
  MotionLayoutProps & VariantProps<typeof motionLayoutVariants>
>(({ 
  className,
  transition: transitionVariant,
  overflow,
  asChild = false,
  
  // Animation props
  animationKey,
  variants,
  initial = 'hidden',
  animate = 'visible',
  exit = 'exit',
  
  // Transition props
  transitionType = 'normal',
  customTransition,
  
  // Layout props
  layoutId,
  enableLayout,
  
  // Gesture props
  drag,
  
  // Advanced props
  onAnimationStart,
  onAnimationComplete,
  
  children,
  ...props 
}, ref) => {
  const motionClassName = cn(
    motionLayoutVariants({ 
      transition: transitionVariant,
      overflow,
    }),
    className
  );

  // Determine transition configuration
  const transitionConfig = customTransition || motionTransitions[transitionType];

  if (asChild) {
    return (
      <Slot
        className={motionClassName}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  const finalVariants: Variants = (variants ?? animationVariants.fadeIn) as Variants;

  return (
    <motion.div
      ref={ref}
      key={animationKey}
      className={motionClassName}
      variants={finalVariants}
      initial={initial}
      animate={animate}
      exit={exit}
      {...(transitionConfig && { transition: transitionConfig })}
      {...(enableLayout && { layout: true })}
      {...(layoutId && { layoutId })}
      {...(drag && { drag })}
      {...(onAnimationStart && { onAnimationStart })}
      {...(onAnimationComplete && { onAnimationComplete })}
      {...props}
    >
      {children}
    </motion.div>
  );
});

MotionLayout.displayName = 'MotionLayout';

// AnimatePresence Wrapper Component
export const AnimatePresenceWrapper: React.FC<AnimatePresenceWrapperProps> = ({
  children,
  mode = 'wait',
  initial = true,
  presenceAffectsLayout = true,
}) => {
  return (
    <AnimatePresence
      mode={mode}
      initial={initial}
      presenceAffectsLayout={presenceAffectsLayout}
    >
      {children}
    </AnimatePresence>
  );
};

// Stagger Container Component
export const StaggerContainer = forwardRef<
  HTMLDivElement,
  MotionLayoutProps & { staggerDelay?: number; delayChildren?: number }
>(({ 
  children,
  staggerDelay = 0.1,
  delayChildren = 0,
  ...props 
}) => {
  const staggerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <MotionLayout
      variants={staggerVariants as Variants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </MotionLayout>
  );
});

StaggerContainer.displayName = 'StaggerContainer';

// Stagger Item Component
export const StaggerItem = forwardRef<
  HTMLDivElement,
  MotionLayoutProps & { animationType?: string }
>(({ children, animationType = 'slideUp', ...props }) => {
  const itemVariants = animationVariants[animationType] || animationVariants.slideUp;

  return (
    <MotionLayout
      variants={itemVariants as Variants}
      {...props}
    >
      {children}
    </MotionLayout>
  );
});

StaggerItem.displayName = 'StaggerItem';

// Shared Layout Group Component
export const SharedLayoutGroup: React.FC<{
  children: React.ReactNode;
  type?: 'switch' | 'crossfade';
}> = ({ children, type = 'crossfade' }) => {
  return (
    <motion.div layout={type === 'switch'}>
      {children}
    </motion.div>
  );
};

// Export utility functions and constants
export { animationVariants as layoutAnimationVariants, motionTransitions as layoutTransitions };

// Export types
export type { Variants, Transition };
