import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Clock, Check, Calendar } from 'lucide-react';
import type { TaskStatus } from '../domain/task/schema';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '../utils/cn';

interface TaskMoveMenuProps {
  isOpen: boolean;
  currentStatus: TaskStatus;
  onMove: (status: TaskStatus) => void;
  onClose: () => void;
  onFocusReturn?: () => void; // For focus restoration
  taskTitle: string;
}

export function TaskMoveMenu({
  isOpen,
  currentStatus,
  onMove,
  onClose,
  onFocusReturn,
  taskTitle,
}: TaskMoveMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const options = [
    {
      status: 'TODAY' as TaskStatus,
      label: 'Today',
      icon: Calendar,
      disabled: currentStatus === 'TODAY',
    },
    {
      status: 'LATER' as TaskStatus,
      label: 'Later',
      icon: Clock,
      disabled: currentStatus === 'LATER',
    },
    {
      status: 'DONE' as TaskStatus,
      label: 'Done',
      icon: Check,
      disabled: currentStatus === 'DONE',
    },
  ].filter(option => !option.disabled);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      // Focus the menu container for keyboard navigation
      setTimeout(() => menuRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    onFocusReturn?.();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % options.length);
          break;
        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          setSelectedIndex(
            prev => (prev - 1 + options.length) % options.length
          );
          break;
        case 'Enter':
          e.preventDefault();
          onMove(options[selectedIndex].status);
          handleClose();
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, options, onMove, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        DESIGN_TOKENS.recipes.overlay,
        DESIGN_TOKENS.layout.patterns.centeredContent,
        DESIGN_TOKENS.layout.zIndex.modal
      )}
    >
      <div
        ref={menuRef}
        tabIndex={-1}
        role='dialog'
        aria-labelledby='move-menu-title'
        aria-describedby='move-menu-description'
      >
        <Card className='min-w-[280px]'>
          <h3
            id='move-menu-title'
            className={cn(
              DESIGN_TOKENS.typography.heading.h2,
              '${DESIGN_TOKENS.spacing.stack.sm}'
            )}
          >
            Move Task
          </h3>
          <p
            id='move-menu-description'
            className={cn(
              DESIGN_TOKENS.typography.body.secondary,
              DESIGN_TOKENS.spacing.sectionMargin,
              'truncate'
            )}
          >
            "{taskTitle}"
          </p>

          <div
            className={DESIGN_TOKENS.spacing.stackTight}
            role='listbox'
            aria-label='Move to column'
          >
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.status}
                  variant={index === selectedIndex ? 'primary' : 'secondary'}
                  className={cn(
                    DESIGN_TOKENS.recipes.menuButton,
                    DESIGN_TOKENS.interaction.button,
                    index === selectedIndex
                      ? 'border-primary-200'
                      : 'border-transparent'
                  )}
                  onClick={() => {
                    onMove(option.status);
                    handleClose();
                  }}
                  role='option'
                  aria-selected={index === selectedIndex}
                >
                  <Icon className={DESIGN_TOKENS.icons.sizes.sm} />
                  <span className={`${flex - 1}`}>{option.label}</span>
                  <ArrowRight
                    className={cn(
                      DESIGN_TOKENS.icons.sizes.sm,
                      DESIGN_TOKENS.colors.ui.text.muted
                    )}
                  />
                </Button>
              );
            })}
          </div>

          <div
            className={cn(
              DESIGN_TOKENS.spacing.sectionMargin,
              DESIGN_TOKENS.colors.ui.border
            )}
          >
            <p className={DESIGN_TOKENS.typography.body.small}>
              Use ↑↓ or j/k to navigate, Enter to select, Esc to cancel
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

