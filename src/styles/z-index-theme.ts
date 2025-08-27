/**
 * Tailwind Theme Extension for Z-Index Orchestrator
 *
 * Provides tokenic z-index classes that align with enhanced-tokens
 * Prevents arbitrary value violations (z-[1234])
 */

export const zIndexThemeExtension = {
  zIndex: {
    // Fortune-500 corrected hierarchy
    surface: '0',
    overlay: '100',
    popover: '1100', // Popover below modal (contextual only)
    modal: '1300', // Modal above popover (blocking interactions)
    toast: '1400', // Toast above modal (system notifications)
    tooltip: '1500', // Tooltip highest (informational overlay)
  },
};

/**
 * Usage in tailwind.config.js:
 *
 * module.exports = {
 *   theme: {
 *     extend: {
 *       ...zIndexThemeExtension
 *     }
 *   }
 * }
 *
 * Then use: z-modal, z-popover, z-toast, etc.
 * Instead of: z-[1300], z-[1100], z-[1400]
 */
