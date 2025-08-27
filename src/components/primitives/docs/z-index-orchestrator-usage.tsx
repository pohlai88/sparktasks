/**
 * Z-Index Orchestrator Usage Examples - Fortune-500 Edition
 *
 * Demonstrates the surgical improvements made for enterprise-grade z-index governance:
 * ✅ Corrected token hierarchy: modal (1300) > popover (1100)
 * ✅ Provider pattern instead of global singleton
 * ✅ Tokenic z-index classes (no arbitrary values)
 * ✅ TokenGuard integration for governance
 */

import { ZIndexProvider, useZIndex, useZIndexMonitor } from '../index';
import type { ZIndexViolation } from '../types';

// ===== BASIC USAGE WITH PROVIDER PATTERN =====

function YourComponents() {
  return (
    <div>
      <Modal />
      <Popover />
      <Toast />
      <Tooltip />
    </div>
  );
}

export function App() {
  return (
    <ZIndexProvider config={{ maxLayers: 10, detectConflicts: true }}>
      <YourComponents />
    </ZIndexProvider>
  );
}

// ===== COMPONENT USAGE EXAMPLES =====

function Modal() {
  const { zIndexClass } = useZIndex('modal-dialog', 'modal', {
    justification: 'User action required for checkout flow',
  });

  return (
    <div className={`fixed inset-0 ${zIndexClass}`}>
      {/* modal: z-modal → z-index: 1300 */}
      <div className='modal-content'>Modal content here</div>
    </div>
  );
}

function Popover() {
  const { zIndexClass } = useZIndex('user-menu-popover', 'popover');

  return (
    <div className={`absolute ${zIndexClass}`}>
      {/* popover: z-popover → z-index: 1100 */}
      <div className='popover-content'>Popover content here</div>
    </div>
  );
}

function Toast() {
  const { zIndexClass } = useZIndex('success-notification', 'toast');

  return (
    <div className={`fixed right-4 top-4 ${zIndexClass}`}>
      {/* toast: z-toast → z-index: 1400 */}
      <div className='toast-content'>Toast notification</div>
    </div>
  );
}

function Tooltip() {
  const { zIndexClass } = useZIndex('help-tooltip', 'tooltip');

  return (
    <div className={`absolute ${zIndexClass}`}>
      {/* tooltip: z-tooltip → z-index: 1500 */}
      <div className='tooltip-content'>Helpful information</div>
    </div>
  );
}

// ===== CORRECTED STACKING ORDER =====

/*
Fortune-500 Corrected Hierarchy (z-index values):

1. tooltip (1500)  ← Highest: Informational overlay
2. toast   (1400)  ← System notifications
3. modal   (1300)  ← Blocking interactions
4. popover (1100)  ← Contextual only
5. overlay (100)   ← General overlays
6. surface (0)     ← Default layer

BEFORE (Wrong): modal (20) < popover (30) ❌
AFTER (Correct): modal (1300) > popover (1100) ✅

This ensures modals properly block popovers, as they should.
*/

// ===== TAILWIND THEME INTEGRATION =====

/*
Added to tailwind.config.js:

theme: {
  extend: {
    zIndex: {
      surface: '0',
      overlay: '100',
      popover: '1100',    // Below modal
      modal: '1300',      // Above popover
      toast: '1400',      // Above modal
      tooltip: '1500',    // Highest
    }
  }
}

Now use: z-modal, z-popover, z-toast, z-tooltip
Instead of: z-[1300], z-[1100], z-[1400], z-[1500]
*/

// ===== MONITORING AND DEBUGGING =====

function ZIndexDebugger() {
  const report = useZIndexMonitor();

  return (
    <div className='debug-panel'>
      <h3>Z-Index Usage Report</h3>
      <p>Total Layers: {report.totalLayers}</p>
      <p>Performance: {report.performance.recommendation}</p>

      <h4>Layer Distribution:</h4>
      <ul>
        {Object.entries(report.layerDistribution).map(([layer, count]) => (
          <li key={layer}>
            {layer}: {String(count)} components
          </li>
        ))}
      </ul>

      {report.conflicts.length > 0 && (
        <div className='conflicts'>
          <h4>Conflicts Detected:</h4>
          {report.conflicts.map((conflict: ZIndexViolation, i: number) => (
            <p key={i} className='text-error'>
              {conflict.resolution}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== TOKENGUARD INTEGRATION =====

/*
TokenGuard will now detect z-index violations:

❌ Bad: className="z-[9999]"           // Arbitrary value
❌ Bad: className="z-50"               // Non-tokenic class
✅ Good: className="z-modal"           // Tokenic class
✅ Good: const { zIndexClass } = useZIndex('id', 'modal')

The orchestrator automatically provides tokenic classes,
preventing arbitrary value violations.
*/

export default {
  Modal,
  Popover,
  Toast,
  Tooltip,
  ZIndexDebugger,
};
