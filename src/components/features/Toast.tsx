import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '@/utils/cn';

export interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className={cn(
        DESIGN_TOKENS.position.fixed.bottomRight,
        DESIGN_TOKENS.spacing.stackTight,
        DESIGN_TOKENS.layout.zIndex.toast
      )}
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const isSuccess = toast.type === 'success';
  const colorStyles = isSuccess
    ? DESIGN_TOKENS.colors.status.complete
    : DESIGN_TOKENS.colors.urgency.overdue;

  return (
    <Card
      className={cn(
        'flex max-w-sm items-center',
        colorStyles.bg,
        'border-current border-opacity-20'
      )}
    >
      {isSuccess ? (
        <CheckCircle
          className={cn(
            DESIGN_TOKENS.icons.withMargin.md,
            DESIGN_TOKENS.colors.ui.interactive.success
          )}
        />
      ) : (
        <AlertCircle
          className={cn(
            DESIGN_TOKENS.icons.withMargin.md,
            DESIGN_TOKENS.colors.ui.interactive.danger
          )}
        />
      )}

      <p
        className={cn(
          DESIGN_TOKENS.typography.body.primary,
          DESIGN_TOKENS.typography.body.medium,
          colorStyles.text
        )}
      >
        {toast.message}
      </p>

      <Button
        variant='ghost'
        size='sm'
        onClick={() => onDismiss(toast.id)}
        className={cn(
          DESIGN_TOKENS.icons.sizes.sm,
          isSuccess
            ? DESIGN_TOKENS.semantic.successText
            : DESIGN_TOKENS.semantic.errorText
        )}
        aria-label='Dismiss notification'
      >
        <X className={DESIGN_TOKENS.icons.sizes.sm} />
      </Button>
    </Card>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    dismissToast,
    clearAll,
  };
}

