import React, { useState, useEffect, useRef } from 'react';
import { Share as ShareIcon, Copy, Mail } from 'lucide-react';
import { cn } from '../../utils/cn';
import { DESIGN_TOKENS } from '../../design/tokens';

export type SharePayload = { title: string; text?: string; url: string };

export interface ShareProps {
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'secondary' | 'ghost';
  getSharePayload: () => SharePayload;
  mailtoSubject?: string;
  mailtoBodyPrefix?: string;
  onShared?: (method: 'web-share' | 'copy' | 'mailto') => void;
  'data-testid'?: string;
}

function useClipboard() {
  const copy = React.useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  }, []);
  return { copy };
}

export function Share({
  className,
  size = 'md',
  variant = 'secondary',
  getSharePayload,
  onShared,
  mailtoSubject = 'I\'d like to share something with you',
  mailtoBodyPrefix = 'Check this out:',
  'data-testid': testId,
}: ShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { copy } = useClipboard();

  // Follow existing TaskMoveMenu pattern for keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const payload = React.useMemo(() => getSharePayload(), [getSharePayload]);
  const mailto = React.useMemo(() => {
    const body = `${mailtoBodyPrefix}\n\n${payload.title}\n${payload.text ?? ''}\n${payload.url}`;
    return `mailto:?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(body)}`;
  }, [mailtoSubject, mailtoBodyPrefix, payload]);

  async function handleShare() {
    if (typeof navigator !== 'undefined' && 'share' in navigator && navigator.share) {
      try {
        await navigator.share(payload);
        onShared?.('web-share');
        setIsOpen(false);
      } catch {
        // user cancelled; do nothing
      }
    } else {
      // Fallback to copy
      const ok = await copy(payload.url);
      onShared?.(ok ? 'copy' : 'copy');
      setIsOpen(false);
    }
  }

  async function handleCopy() {
    const ok = await copy(payload.url);
    onShared?.(ok ? 'copy' : 'copy');
    setIsOpen(false);
  }

  function handleEmailShare() {
    onShared?.('mailto');
    setIsOpen(false);
  }

  // Use existing DESIGN_TOKENS patterns for button styling
  const buttonClasses = cn(
    DESIGN_TOKENS.interaction.button,
    'inline-flex items-center justify-center',
    'transition-colors duration-150',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    DESIGN_TOKENS.focus.combined,
    {
      sm: DESIGN_TOKENS.size.button.sm,
      md: DESIGN_TOKENS.size.button.md,
    }[size],
    {
      primary: cn(
        'bg-blue-600 hover:bg-blue-700 text-white',
        DESIGN_TOKENS.elevation.sm,
        'border border-transparent'
      ),
      secondary: cn(
        'bg-white hover:bg-slate-50 text-slate-700',
        'border border-slate-300',
        DESIGN_TOKENS.elevation.sm
      ),
      ghost: 'bg-transparent hover:bg-slate-50 text-slate-700',
    }[variant],
    className
  );

  return (
    <div className="relative inline-block" data-testid={testId}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <ShareIcon className={cn(
          DESIGN_TOKENS.size.icon[4], 
          size === 'sm' ? DESIGN_TOKENS.spacing.iconSmall : DESIGN_TOKENS.spacing.iconLeft
        )} />
        Share
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Share options"
          className={cn(DESIGN_TOKENS.layout.patterns.contextMenu, 'bg-white border border-slate-200', DESIGN_TOKENS.radius.lg, DESIGN_TOKENS.elevation.popup, DESIGN_TOKENS.layout.patterns.menuContainer)}
          tabIndex={-1}
        >
          <button
            role="menuitem"
            onClick={handleShare}
            className={cn(DESIGN_TOKENS.sizing.menuItem.md, DESIGN_TOKENS.layout.patterns.iconText, 'hover:bg-slate-50 focus-visible:bg-slate-50', DESIGN_TOKENS.focus.combined)}
          >
            <ShareIcon className={DESIGN_TOKENS.size.icon[4]} />
            {typeof navigator !== 'undefined' && 'share' in navigator ? 'Share via device…' : 'Share (copy link)'}
          </button>
          
          <button
            role="menuitem"
            onClick={handleCopy}
            className={cn(DESIGN_TOKENS.sizing.menuItem.md, DESIGN_TOKENS.layout.patterns.iconText, 'hover:bg-slate-50 focus-visible:bg-slate-50', DESIGN_TOKENS.focus.combined)}
          >
            <Copy className={DESIGN_TOKENS.size.icon[4]} />
            Copy link
          </button>
          
          <a
            role="menuitem"
            href={mailto}
            onClick={handleEmailShare}
            className={cn(DESIGN_TOKENS.sizing.menuItem.sm, DESIGN_TOKENS.layout.patterns.iconText, 'hover:bg-slate-50 focus-visible:bg-slate-50', DESIGN_TOKENS.focus.combined)}
          >
            <Mail className={DESIGN_TOKENS.size.icon[4]} />
            Invite via email
          </a>
        </div>
      )}
    </div>
  );
}
