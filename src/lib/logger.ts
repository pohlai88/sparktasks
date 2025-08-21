/**
 * Application logger with dev/prod environment awareness
 * Replaces console.log with environment-appropriate logging
 */
export const logger = {
  /**
   * Debug logging - only shows in development
   */
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  },

  /**
   * Info logging - only shows in development
   */
  info: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },

  /**
   * Warning logging - always shows
   */
  warn: console.warn,

  /**
   * Error logging - always shows
   */
  error: console.error,
};
