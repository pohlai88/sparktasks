import * as React from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';
import { combineTokens } from '@/design/tokens';

// ===== TOAST TYPES & INTERFACES =====

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface ToastProps {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration?: number | null; // null = persist until dismissed
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: (id: string) => void;
  position?: ToastPosition;
  // Enterprise features
  priority?: 'low' | 'normal' | 'high';
  metadata?: Record<string, unknown>;
  timestamp?: Date;
}

export interface ToastContextValue {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => string;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
  clearExpired: () => void;
}

// ===== TOAST ICONS =====

const ToastIcons = {
  success: (
    <svg
      className={DESIGN_TOKENS.layout.spacing.fine.size5}
      fill='currentColor'
      viewBox='0 0 20 20'
      aria-hidden='true'
      focusable='false'
    >
      <path
        fillRule='evenodd'
        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z'
        clipRule='evenodd'
      />
    </svg>
  ),
  error: (
    <svg
      className={DESIGN_TOKENS.layout.spacing.fine.size5}
      fill='currentColor'
      viewBox='0 0 20 20'
      aria-hidden='true'
      focusable='false'
    >
      <path
        fillRule='evenodd'
        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
        clipRule='evenodd'
      />
    </svg>
  ),
  warning: (
    <svg
      className={DESIGN_TOKENS.layout.spacing.fine.size5}
      fill='currentColor'
      viewBox='0 0 20 20'
      aria-hidden='true'
      focusable='false'
    >
      <path
        fillRule='evenodd'
        d='M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z'
        clipRule='evenodd'
      />
    </svg>
  ),
  info: (
    <svg
      className={DESIGN_TOKENS.layout.spacing.fine.size5}
      fill='currentColor'
      viewBox='0 0 20 20'
      aria-hidden='true'
      focusable='false'
    >
      <path
        fillRule='evenodd'
        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z'
        clipRule='evenodd'
      />
    </svg>
  ),
};

// Close icon
const CloseIcon = (
  <svg
    className={DESIGN_TOKENS.layout.spacing.fine.size4}
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    aria-hidden='true'
    focusable='false'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M6 18L18 6M6 6l12 12'
    />
  </svg>
);

// ===== TOAST VARIANT STYLES =====

const toastVariantStyles = {
  success: {
    container: combineTokens(
      DESIGN_TOKENS.recipe.toast.success,
      'border-green-200 dark:border-green-800',
      'bg-green-50 dark:bg-green-950/30',
      'text-green-900 dark:text-green-100'
    ),
    icon: 'text-green-600 dark:text-green-400',
    action:
      'text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200',
  },
  error: {
    container: combineTokens(
      DESIGN_TOKENS.recipe.toast.error,
      'border-red-200 dark:border-red-800',
      'bg-red-50 dark:bg-red-950/30',
      'text-red-900 dark:text-red-100'
    ),
    icon: 'text-red-600 dark:text-red-400',
    action:
      'text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200',
  },
  warning: {
    container: combineTokens(
      DESIGN_TOKENS.recipe.toast.warning,
      'border-amber-200 dark:border-amber-800',
      'bg-amber-50 dark:bg-amber-950/30',
      'text-amber-900 dark:text-amber-100'
    ),
    icon: 'text-amber-600 dark:text-amber-400',
    action:
      'text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200',
  },
  info: {
    container: combineTokens(
      DESIGN_TOKENS.recipe.toast.info,
      'border-blue-200 dark:border-blue-800',
      'bg-blue-50 dark:bg-blue-950/30',
      'text-blue-900 dark:text-blue-100'
    ),
    icon: 'text-blue-600 dark:text-blue-400',
    action:
      'text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200',
  },
} as const;

// ===== TOAST POSITION STYLES =====

const toastPositions = {
  'top-right': 'fixed top-4 right-4 flex flex-col gap-2 z-[60] max-w-sm',
  'top-left': 'fixed top-4 left-4 flex flex-col gap-2 z-[60] max-w-sm',
  'bottom-right':
    'fixed bottom-4 right-4 flex flex-col-reverse gap-2 z-[60] max-w-sm',
  'bottom-left':
    'fixed bottom-4 left-4 flex flex-col-reverse gap-2 z-[60] max-w-sm',
  'top-center':
    'fixed top-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[60] max-w-sm',
  'bottom-center':
    'fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-2 z-[60] max-w-sm',
} as const;

// ===== INDIVIDUAL TOAST COMPONENT =====

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      id,
      variant,
      title,
      message,
      duration = 5000,
      action,
      onDismiss,
      priority = 'normal',
      timestamp,
      ...props
    },
    ref
  ) => {
    const [isExiting, setIsExiting] = React.useState(false);
    const [timeRemaining, setTimeRemaining] = React.useState(duration);
    const [isPaused, setIsPaused] = React.useState(false);
    const timerRef = React.useRef<NodeJS.Timeout>();
    const intervalRef = React.useRef<NodeJS.Timeout>();

    const variantStyles = toastVariantStyles[variant];

    const handleDismiss = React.useCallback(() => {
      setIsExiting(true);
      setTimeout(() => {
        onDismiss?.(id);
      }, 200); // Match exit animation duration
    }, [id, onDismiss]);

    // Auto-dismiss functionality with pause on hover
    React.useEffect(() => {
      if (duration === null) return; // Persist until manually dismissed

      const startTimer = () => {
        timerRef.current = setTimeout(() => {
          handleDismiss();
        }, timeRemaining || duration);
      };

      if (!isPaused) {
        startTimer();

        // Update countdown every 100ms for progress indication
        intervalRef.current = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev && prev > 100) {
              return prev - 100;
            }
            return prev;
          });
        }, 100);
      }

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [isPaused, timeRemaining, duration, handleDismiss]);

    const handleMouseEnter = () => {
      if (duration !== null) {
        setIsPaused(true);
      }
    };

    const handleMouseLeave = () => {
      if (duration !== null) {
        setIsPaused(false);
      }
    };

    const handleAction = () => {
      action?.onClick();
      handleDismiss(); // Dismiss after action
    };

    const progressPercentage =
      duration && timeRemaining ? (timeRemaining / duration) * 100 : 0;

    return (
      <div
        ref={ref}
        className={combineTokens(
          DESIGN_TOKENS.recipe.toast.base,
          variantStyles.container,
          isExiting
            ? DESIGN_TOKENS.motion.semantic.toastExit
            : DESIGN_TOKENS.motion.semantic.toastEnter,
          'motion-reduce:transition-none'
        )}
        role='alert'
        aria-live={priority === 'high' ? 'assertive' : 'polite'}
        aria-atomic='true'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Progress indicator for timed toasts */}
        {duration !== null && (
          <div
            className={combineTokens(
              'absolute bottom-0 left-0 h-1 rounded-b-md bg-current opacity-20 transition-all duration-100'
            )}
          >
            <div
              className={combineTokens(
                'h-full rounded-b-md bg-current transition-all duration-100 ease-linear'
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        {/* Toast icon */}
        <div className={combineTokens('flex-shrink-0', variantStyles.icon)}>
          {ToastIcons[variant]}
        </div>

        {/* Toast content */}
        <div
          className={combineTokens(
            DESIGN_TOKENS.layout.flex.minW0,
            DESIGN_TOKENS.layout.flex.flex1
          )}
        >
          {title && (
            <div
              className={combineTokens('mb-1 text-sm font-semibold')}
              id={`toast-title-${id}`}
            >
              {title}
            </div>
          )}
          <div
            className={combineTokens('break-words text-sm')}
            id={`toast-message-${id}`}
            aria-describedby={title ? `toast-title-${id}` : undefined}
          >
            {message}
          </div>

          {/* Timestamp for enterprise logging */}
          {timestamp && (
            <div className={combineTokens('mt-1 text-xs opacity-70')}>
              {timestamp.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Action button */}
        {action && (
          <div className={combineTokens('ml-3 shrink-0')}>
            <button
              type='button'
              className={combineTokens(
                'text-sm font-medium underline decoration-2 underline-offset-2',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 hover:no-underline',
                'transition-colors duration-150 motion-reduce:transition-none',
                variantStyles.action
              )}
              onClick={handleAction}
            >
              {action.label}
            </button>
          </div>
        )}

        {/* Dismiss button */}
        <div className={combineTokens('ml-3 shrink-0')}>
          <button
            type='button'
            className={combineTokens(
              'inline-flex rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/5',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'transition-colors duration-150 motion-reduce:transition-none',
              variantStyles.icon
            )}
            onClick={handleDismiss}
            aria-label='Dismiss notification'
          >
            {CloseIcon}
          </button>
        </div>
      </div>
    );
  }
);

Toast.displayName = 'Toast';

// ===== TOAST CONTAINER =====

export interface ToastContainerProps {
  toasts: ToastProps[];
  position?: ToastPosition;
  onDismiss: (id: string) => void;
  maxToasts?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  onDismiss,
  maxToasts = 5,
}) => {
  // Limit number of visible toasts
  const visibleToasts = toasts.slice(0, maxToasts);

  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <div className={toastPositions[position]} aria-label='Notifications'>
      {visibleToasts.map(toast => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

// ===== TOAST CONTEXT & PROVIDER =====

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

export interface ToastProviderProps {
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  defaultPosition = 'top-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback(
    (toast: Omit<ToastProps, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastProps = {
        ...toast,
        id,
        position: toast.position || defaultPosition,
        timestamp: toast.timestamp || new Date(),
      };

      setToasts(prev => {
        const next = [...prev, newToast];
        // Keep the first-created toasts visible; drop newest beyond the cap
        return next.length > maxToasts ? next.slice(0, maxToasts) : next;
      });
      return id;
    },
    [defaultPosition, maxToasts]
  );

  const dismissToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  const clearExpired = React.useCallback(() => {
    const now = Date.now();
    setToasts(prev =>
      prev.filter(toast => {
        if (toast.duration === null) return true; // Persist toasts
        const age = now - (toast.timestamp?.getTime() || 0);
        return age < (toast.duration || 5000);
      })
    );
  }, []);

  // Wire up the global imperative API
  React.useEffect(() => {
    toastManager._setHandler({
      addToast,
      dismissToast,
      dismissAll,
    });

    return () => {
      toastManager._setHandler(null);
    };
  }, [addToast, dismissToast, dismissAll]);

  // Group toasts by position
  const toastsByPosition = React.useMemo(() => {
    const groups: Record<ToastPosition, ToastProps[]> = {
      'top-right': [],
      'top-left': [],
      'bottom-right': [],
      'bottom-left': [],
      'top-center': [],
      'bottom-center': [],
    };

    toasts.forEach(toast => {
      const position = toast.position || defaultPosition;
      groups[position].push(toast);
    });

    return groups;
  }, [toasts, defaultPosition]);

  const contextValue: ToastContextValue = {
    toasts,
    addToast,
    dismissToast,
    dismissAll,
    clearExpired,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Render toast containers for each position */}
      {Object.entries(toastsByPosition).map(([position, positionToasts]) =>
        positionToasts.length > 0 ? (
          <ToastContainer
            key={position}
            toasts={positionToasts}
            position={position as ToastPosition}
            onDismiss={dismissToast}
            maxToasts={maxToasts}
          />
        ) : null
      )}
    </ToastContext.Provider>
  );
};

// ===== TOAST HOOK =====

export const useToast = (): ToastContextValue => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ===== TOAST MANAGER SINGLETON =====

// ===== GLOBAL TOAST MANAGER =====

type ToastHandler = {
  addToast: (toast: Omit<ToastProps, 'id'>) => string;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
};

// Global toast manager for imperative API (outside React components)
class ToastManager {
  private static instance: ToastManager;
  private listeners: Set<(toasts: ToastProps[]) => void> = new Set();
  private toasts: ToastProps[] = [];
  private handler: ToastHandler | null = null;

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  _setHandler(handler: ToastHandler | null) {
    this.handler = handler;
  }

  // Reset method for testing
  _reset() {
    this.handler = null;
    this.toasts = [];
    this.listeners.clear();
  }

  subscribe(listener: (toasts: ToastProps[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  addToast(toast: Omit<ToastProps, 'id'>): string {
    // If we have a handler (ToastProvider), use it
    if (this.handler) {
      return this.handler.addToast(toast);
    }

    // Fallback to internal state
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastProps = {
      ...toast,
      id,
      timestamp: toast.timestamp || new Date(),
    };

    this.toasts = [newToast, ...this.toasts];
    this.notify();
    return id;
  }

  dismissToast(id: string) {
    if (this.handler) {
      return this.handler.dismissToast(id);
    }

    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }

  dismissAll() {
    if (this.handler) {
      return this.handler.dismissAll();
    }

    this.toasts = [];
    this.notify();
  }
}

// Global toast manager instance
const toastManager = ToastManager.getInstance();

// Export for testing
export const _resetToastManager = () => toastManager._reset();

// ===== IMPERATIVE TOAST API =====

export const toast = {
  success: (
    message: string,
    options?: Partial<Omit<ToastProps, 'id' | 'variant' | 'message'>>
  ) => {
    return toastManager.addToast({ ...options, variant: 'success', message });
  },
  error: (
    message: string,
    options?: Partial<Omit<ToastProps, 'id' | 'variant' | 'message'>>
  ) => {
    return toastManager.addToast({ ...options, variant: 'error', message });
  },
  warning: (
    message: string,
    options?: Partial<Omit<ToastProps, 'id' | 'variant' | 'message'>>
  ) => {
    return toastManager.addToast({ ...options, variant: 'warning', message });
  },
  info: (
    message: string,
    options?: Partial<Omit<ToastProps, 'id' | 'variant' | 'message'>>
  ) => {
    return toastManager.addToast({ ...options, variant: 'info', message });
  },
  dismiss: (id: string) => {
    toastManager.dismissToast(id);
  },
  dismissAll: () => {
    toastManager.dismissAll();
  },
};
