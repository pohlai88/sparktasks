import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { DESIGN_TOKENS } from '../design/tokens';
import { cn } from '../utils/cn';

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
    <div className={cn(
      'fixed bottom-4 right-4',
      DESIGN_TOKENS.spacing.stackTight,
      DESIGN_TOKENS.layout.zIndex.toast
    )}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
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
        'flex items-center max-w-sm',
        colorStyles.bg,
        'border-current border-opacity-20'
      )}
    >
      {isSuccess ? (
        <CheckCircle className={cn('size-5 mr-3 flex-shrink-0', DESIGN_TOKENS.colors.ui.interactive.success)} />
      ) : (
        <AlertCircle className={cn('size-5 mr-3 flex-shrink-0', DESIGN_TOKENS.colors.ui.interactive.danger)} />
      )}
      
      <p className={cn(
        DESIGN_TOKENS.typography.body.primary,
        'font-medium',
        colorStyles.text
      )}>
        {toast.message}
      </p>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDismiss(toast.id)}
        className={cn(
          'ml-auto pl-3',
          isSuccess 
            ? 'text-green-600 hover:text-green-800'
            : 'text-red-600 hover:text-red-800'
        )}
        aria-label="Dismiss notification"
      >
        <X className="size-4" />
      </Button>
    </Card>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
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
