import React, { useState, useRef, useEffect } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '../../utils/cn';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const placementClasses = {
  top: 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  bottom: 'absolute top-full left-1/2 transform -translate-x-1/2 mt-2',
  left: 'absolute right-full top-1/2 transform -translate-y-1/2 mr-2',
  right: 'absolute left-full top-1/2 transform -translate-y-1/2 ml-2',
};

const arrowClasses = {
  top: 'top-full left-1/2 transform -translate-x-1/2',
  bottom: 'bottom-full left-1/2 transform -translate-x-1/2', 
  left: 'left-full top-1/2 transform -translate-y-1/2',
  right: 'right-full top-1/2 transform -translate-y-1/2',
};

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 500,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsVisible(true);
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setShowTooltip(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleFocus = () => {
    setIsVisible(true);
    setShowTooltip(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
    setShowTooltip(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}

      {/* Tooltip */}
      {showTooltip && (
        <div
          role='tooltip'
          className={cn(
            DESIGN_TOKENS.theme.light.surface.base,
            DESIGN_TOKENS.theme.light.ink.primary,
            DESIGN_TOKENS.theme.light.elevation.card,
            'absolute z-10 px-3 py-2 text-sm font-medium rounded-lg pointer-events-none transition-opacity duration-200',
            placementClasses[placement],
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden={!isVisible}
        >
          {content}

          {/* Arrow */}
          <div
            className={cn(
              'absolute w-0 h-0',
              arrowClasses[placement]
            )}
          />
        </div>
      )}
    </div>
  );
}

