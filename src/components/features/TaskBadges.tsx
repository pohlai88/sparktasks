import { Badge } from './Badge';
import { DESIGN_TOKENS } from '@/design/tokens';

interface PriorityBadgeProps {
  priority: 'P0' | 'P1' | 'P2';
  className?: string;
}

export function PriorityBadge({
  priority,
  className = '',
}: PriorityBadgeProps) {
  const getIcon = (priority: 'P0' | 'P1' | 'P2') => {
    switch (priority) {
      case 'P0':
        return (
          <svg
            className={DESIGN_TOKENS.icons.badge}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
        );
      case 'P1':
        return (
          <svg
            className={DESIGN_TOKENS.icons.badge}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
              clipRule='evenodd'
            />
          </svg>
        );
      case 'P2':
        return (
          <svg
            className={DESIGN_TOKENS.icons.badge}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          </svg>
        );
    }
  };

  return (
    <Badge
      variant='priority'
      priority={priority}
      className={className}
      size='sm'
    >
      {getIcon(priority)}
      {priority}
    </Badge>
  );
}

interface StatusBadgeProps {
  status: 'TODAY' | 'LATER' | 'DONE';
  count?: number;
  className?: string;
}

export function StatusBadge({
  status,
  count,
  className = '',
}: StatusBadgeProps) {
  const getIcon = (status: 'TODAY' | 'LATER' | 'DONE') => {
    switch (status) {
      case 'TODAY':
        return (
          <svg
            className={DESIGN_TOKENS.icons.badge}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
              clipRule='evenodd'
            />
          </svg>
        );
      case 'LATER':
        return (
          <svg
            className={DESIGN_TOKENS.icons.badge}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6s.792.193 1.264.979c.56 1.06.982 2.72.982 4.521s-.421 3.46-.982 4.521C10.792 17.807 10.304 18 10 18s-.792-.193-1.264-.979C8.176 15.96 7.754 14.3 7.754 12.5s.421-3.46.982-4.521z'
              clipRule='evenodd'
            />
          </svg>
        );
      case 'DONE':
        return (
          <svg
            className={DESIGN_TOKENS.icons.badge}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          </svg>
        );
    }
  };

  return (
    <Badge variant='status' status={status} className={className} size='sm'>
      {getIcon(status)}
      {status}
      {count !== undefined && ` (${count})`}
    </Badge>
  );
}

interface DueDateBadgeProps {
  dueDate: string;
  className?: string;
}

export function DueDateBadge({ dueDate, className = '' }: DueDateBadgeProps) {
  const getUrgencyInfo = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        urgency: 'overdue' as const,
        label: `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`,
        variant: 'danger' as const,
        icon: (
          <svg
            className={DESIGN_TOKENS.icons.badge}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
        ),
      };
    } else if (diffDays === 0) {
      return {
        urgency: 'today' as const,
        label: 'Due today',
        variant: 'warning' as const,
        icon: (
          <svg
            className={DESIGN_TOKENS.icons.badge}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
              clipRule='evenodd'
            />
          </svg>
        ),
      };
    } else if (diffDays === 1) {
      return {
        urgency: 'tomorrow' as const,
        label: 'Due tomorrow',
        variant: 'info' as const,
        icon: (
          <svg
            className={DESIGN_TOKENS.icons.badge}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
              clipRule='evenodd'
            />
          </svg>
        ),
      };
    } else {
      return {
        urgency: 'future' as const,
        label: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
        variant: 'default' as const,
        icon: (
          <svg
            className={DESIGN_TOKENS.icons.badge}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
              clipRule='evenodd'
            />
          </svg>
        ),
      };
    }
  };

  const urgencyInfo = getUrgencyInfo(dueDate);

  return (
    <Badge variant={urgencyInfo.variant} className={className} size='sm'>
      {urgencyInfo.icon}
      {urgencyInfo.label}
    </Badge>
  );
}

