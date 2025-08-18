import { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { cn } from '../utils/cn';
import { DESIGN_TOKENS } from '../design/tokens';

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: 'j / ↓', action: 'Navigate down to next task' },
    { keys: 'k / ↑', action: 'Navigate up to previous task' },
    { keys: 'Tab / Shift+Tab', action: 'Exit task list navigation' },
    { keys: 'm / ← / →', action: 'Open Move menu' },
    { keys: 'Space / Enter', action: 'Toggle task completion' },
    { keys: 's', action: 'Snooze task to Later' },
    { keys: 'e', action: 'Edit task' },
    { keys: 'Delete / Backspace', action: 'Delete task' },
    { keys: 'Ctrl + Z', action: 'Undo last action' },
    { keys: 'Ctrl + Y', action: 'Redo last action' },
    { keys: 'Esc', action: 'Cancel/Close dialogs' },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="size-4" />
      </Button>

      {isOpen && (
        <div className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          DESIGN_TOKENS.recipes.overlay
        )}>
          <Card className={cn('max-w-md w-full mx-4', DESIGN_TOKENS.recipes.modal)}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn(DESIGN_TOKENS.typography.heading.h2, DESIGN_TOKENS.colors.ui.text.primary)}>
                Keyboard Shortcuts
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close shortcuts"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className={DESIGN_TOKENS.spacing.stack}>
              <div className={cn(DESIGN_TOKENS.typography.body.small, DESIGN_TOKENS.colors.ui.text.secondary, 'mb-4')}>
                Focus any task to use these shortcuts:
              </div>
              
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className={cn(DESIGN_TOKENS.typography.body.small, DESIGN_TOKENS.colors.ui.text.primary)}>
                    {shortcut.action}
                  </span>
                  <kbd className={DESIGN_TOKENS.recipes.keyboardKey}>
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <p className={cn(DESIGN_TOKENS.typography.body.caption, DESIGN_TOKENS.colors.ui.text.secondary)}>
                💡 Click on any task to focus it, then use the shortcuts above.
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
