import React, { useState, useRef, useEffect } from 'react';
import { DESIGN_TOKENS } from '../../design/tokens';
import { cn } from '../../utils/cn';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const placementClasses = {
  top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
};

const arrowClasses = {
  top: 'top-full left-1/2 transform -translate-x-1/2 border-t-slate-900 border-t-4 border-x-transparent border-x-4',
  bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-slate-900 border-b-4 border-x-transparent border-x-4',
  left: 'left-full top-1/2 transform -translate-y-1/2 border-l-slate-900 border-l-4 border-y-transparent border-y-4',
  right: 'right-full top-1/2 transform -translate-y-1/2 border-r-slate-900 border-r-4 border-y-transparent border-y-4'
};

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 500,
  className = ''
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
          role="tooltip"
          className={cn(
            'absolute z-50 px-2 py-1 text-xs text-white bg-slate-900 rounded whitespace-nowrap',
            'pointer-events-none transition-opacity duration-200',
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
