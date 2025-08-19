// 🛡 DRIFT-SAFE CODING INSTRUCTION — SparkTasks
// * Apply only the explicit change. If completion requires leaving allowed paths or >~220 diff lines, stop and return ONE clarifying question.
// * Output: unified git diff only (no prose/logs).
// * Rules: surgical patch; preserve unaffected lines; don't change public APIs/flags/error codes/schema/budgets/deps; never touch CI or security/E2EE without explicit approval; no new deps/lockfile churn.
// * DoD (ALL): type-check/test/build pass; eslint+prettier clean (touched files); perf budgets respected; UI tasks must validate focus/ARIA/keyboard.

import { useEffect, useState } from 'react';
import { DESIGN_TOKENS } from '@/design/tokens';

interface LiveAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

export function LiveAnnouncer({
  message,
  priority = 'polite',
}: LiveAnnouncerProps) {
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (message) {
      // Clear message first to ensure re-announcement of the same message
      setCurrentMessage('');
      // Use setTimeout to ensure screen readers pick up the change
      const timer = setTimeout(() => {
        setCurrentMessage(message);
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      aria-live={priority}
      aria-atomic='true'
      className={DESIGN_TOKENS.accessibility.srOnly}
      data-testid='live-announcer'
    >
      {currentMessage}
    </div>
  );
}

// Hook for managing live announcements
export function useLiveAnnouncer() {
  const [announcement, setAnnouncement] = useState('');

  const announce = (message: string) => {
    setAnnouncement(message);
    // Clear message after announcement to allow re-announcing the same message
    setTimeout(() => setAnnouncement(''), 1000);
  };

  return {
    announcement,
    announce,
  };
}
