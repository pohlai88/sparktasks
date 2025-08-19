import React from 'react';
import { X } from 'lucide-react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '../../utils/cn';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        DESIGN_TOKENS.recipe.modal.overlay,
        'fixed inset-0 z-50 flex items-center justify-center p-4'
      )}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      <div
        className={cn(
          DESIGN_TOKENS.recipe.modal.content,
          sizeClasses[size],
          'relative w-full',
          DESIGN_TOKENS.theme.light.surface.raised,
          DESIGN_TOKENS.theme.light.border.subtle,
          DESIGN_TOKENS.transitions.smooth,
          className
        )}
        onClick={e => e.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className={cn(
            'flex items-center justify-between p-6 border-b',
            DESIGN_TOKENS.theme.light.border.subtle
          )}>
            <h2
              id='modal-title'
              className={cn(
                DESIGN_TOKENS.theme.light.ink.primary,
                'text-lg font-semibold'
              )}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-md transition-colors',
                DESIGN_TOKENS.interaction.button.hover,
                DESIGN_TOKENS.theme.light.ink.tertiary,
                'hover:text-slate-900'
              )}
              aria-label='Close modal'
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Quick confirmation modal
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size='sm'>
      <div className="space-y-4">
        <p className={cn(
          DESIGN_TOKENS.theme.light.ink.secondary,
          'text-sm'
        )}>
          {message}
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant='secondary' onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

