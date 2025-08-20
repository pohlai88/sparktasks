/**
 * Callout Demo Component
 * 
 * Comprehensive demonstration of the Callout component showcasing
 * all variants, sizes, and features in an enterprise-grade layout.
 */

import React, { useState } from 'react';
import Callout from '@/components/ui/Callout';
import { DESIGN_TOKENS, combineTokens } from '@/design/tokens';

const CalloutDemo: React.FC = () => {
  const [showDismissible, setShowDismissible] = useState(true);
  const [customIconDemo, setCustomIconDemo] = useState(true);

  const resetDismissible = () => setShowDismissible(true);
  const resetCustomIcon = () => setCustomIconDemo(true);

  const customIcon = (
    <svg className="size-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  return (
    <div className={combineTokens(
      DESIGN_TOKENS.spacing.sectionLarge,
      'max-w-4xl mx-auto'
    )}>
      {/* Header */}
      <div className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h1 className={DESIGN_TOKENS.typography.heading.h1}>
          Callout Component Demo
        </h1>
        <p className={DESIGN_TOKENS.typography.body.secondary}>
          Enterprise-grade highlighted information blocks with comprehensive accessibility and theming support.
        </p>
      </div>

      {/* Variants Section */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h2 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h3,
          DESIGN_TOKENS.spacing.workspace.subtitleMargin
        )}>
          Semantic Variants
        </h2>
        <div className="space-y-4">
          <Callout variant="info" title="Information">
            This is an informational callout used to provide helpful context or additional details.
          </Callout>
          
          <Callout variant="success" title="Success">
            Operation completed successfully! Your changes have been saved and are now active.
          </Callout>
          
          <Callout variant="warning" title="Warning">
            Please review the following items before proceeding. Some configurations may need attention.
          </Callout>
          
          <Callout variant="error" title="Error">
            An error occurred while processing your request. Please check the details below and try again.
          </Callout>
          
          <Callout variant="note" title="Note">
            This is a general note callout for neutral information that doesn't fit other semantic categories.
          </Callout>
        </div>
      </section>

      {/* Sizes Section */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h2 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h3,
          DESIGN_TOKENS.spacing.workspace.subtitleMargin
        )}>
          Size Variants
        </h2>
        <div className="space-y-4">
          <Callout variant="info" size="sm" title="Small Size">
            Compact callout perfect for inline notices or space-constrained layouts.
          </Callout>
          
          <Callout variant="success" size="md" title="Medium Size (Default)">
            Standard callout size that works well for most use cases and content lengths.
          </Callout>
          
          <Callout variant="warning" size="lg" title="Large Size">
            Spacious callout ideal for important announcements or detailed explanations that need more visual prominence.
          </Callout>
        </div>
      </section>

      {/* Icon Features */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h2 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h3,
          DESIGN_TOKENS.spacing.workspace.subtitleMargin
        )}>
          Icon Features
        </h2>
        <div className="space-y-4">
          <Callout variant="info" showIcon={false} title="Without Icon">
            Callout with semantic icon disabled for minimal design approaches.
          </Callout>
          
          {customIconDemo && (
            <Callout 
              variant="warning" 
              icon={customIcon} 
              title="Custom Icon" 
              dismissible
              onDismiss={() => setCustomIconDemo(false)}
            >
              Callout with a custom lightning bolt icon instead of the default warning icon.
            </Callout>
          )}
          
          {!customIconDemo && (
            <div className="flex items-center gap-3">
              <span className={DESIGN_TOKENS.typography.body.secondary}>
                Custom icon demo dismissed.
              </span>
              <button
                onClick={resetCustomIcon}
                className={combineTokens(
                  DESIGN_TOKENS.semantic.text.info,
                  'underline hover:no-underline'
                )}
              >
                Reset Demo
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Dismissible Feature */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h2 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h3,
          DESIGN_TOKENS.spacing.workspace.subtitleMargin
        )}>
          Dismissible Feature
        </h2>
        <div className="space-y-4">
          {showDismissible && (
            <Callout 
              variant="success" 
              title="Dismissible Callout" 
              dismissible
              onDismiss={() => setShowDismissible(false)}
            >
              This callout can be dismissed by clicking the × button. Perfect for temporary notifications or announcements.
            </Callout>
          )}
          
          {!showDismissible && (
            <div className="flex items-center gap-3">
              <span className={DESIGN_TOKENS.typography.body.secondary}>
                Dismissible callout has been dismissed.
              </span>
              <button
                onClick={resetDismissible}
                className={combineTokens(
                  DESIGN_TOKENS.semantic.text.info,
                  'underline hover:no-underline'
                )}
              >
                Reset Demo
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Rich Content */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h2 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h3,
          DESIGN_TOKENS.spacing.workspace.subtitleMargin
        )}>
          Rich Content Support
        </h2>
        <div className="space-y-4">
          <Callout variant="info" title="Multiple Paragraphs">
            <p className={DESIGN_TOKENS.spacing.workspace.paragraphMargin}>
              Callouts support rich content including multiple paragraphs, lists, and other elements.
            </p>
            <p className={DESIGN_TOKENS.spacing.workspace.paragraphMargin}>
              This flexibility makes them perfect for complex announcements or detailed instructions.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Feature announcements</li>
              <li>Step-by-step instructions</li>
              <li>Important policy updates</li>
              <li>System maintenance notices</li>
            </ul>
          </Callout>
          
          <Callout variant="warning" title="Code Examples">
            <p className={DESIGN_TOKENS.spacing.workspace.paragraphMargin}>
              You can include code snippets and technical documentation:
            </p>
            <pre className={combineTokens(
              DESIGN_TOKENS.recipe.text.codeBlock,
              DESIGN_TOKENS.spacing.workspace.paragraphMargin
            )}>
{`<Callout variant="error" dismissible>
  Error message content
</Callout>`}
            </pre>
            <p>Perfect for documentation and developer resources.</p>
          </Callout>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h2 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h3,
          DESIGN_TOKENS.spacing.workspace.subtitleMargin
        )}>
          Accessibility Features
        </h2>
        <div className="space-y-4">
          <Callout variant="info" title="WCAG 2.1 AA Compliance">
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Semantic ARIA roles:</strong> Error/warning use 'alert', success uses 'status', info/note use 'note'</li>
              <li><strong>Live regions:</strong> Error/warning are 'assertive', others are 'polite'</li>
              <li><strong>Keyboard navigation:</strong> Dismiss button is fully keyboard accessible</li>
              <li><strong>Screen reader support:</strong> Icons are properly hidden with aria-hidden</li>
              <li><strong>Color contrast:</strong> All variants meet WCAG AA contrast requirements</li>
            </ul>
          </Callout>
        </div>
      </section>

      {/* Implementation Notes */}
      <section className={DESIGN_TOKENS.spacing.sectionMargin}>
        <h2 className={combineTokens(
          DESIGN_TOKENS.typography.heading.h3,
          DESIGN_TOKENS.spacing.workspace.subtitleMargin
        )}>
          Implementation Notes
        </h2>
        <Callout variant="note" title="Enterprise Features">
          <ul className="list-disc list-inside space-y-1">
            <li>Built with React forwardRef for imperative access</li>
            <li>Fully SSOT compliant using DESIGN_TOKENS system</li>
            <li>TypeScript-first with comprehensive type safety</li>
            <li>Dark mode support through design tokens</li>
            <li>Responsive design with mobile-first approach</li>
            <li>Zero hardcoded Tailwind classes (ESLint enforced)</li>
            <li>Comprehensive test coverage (28 tests)</li>
          </ul>
        </Callout>
      </section>
    </div>
  );
};

export default CalloutDemo;
