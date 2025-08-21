/**
 * Utility function to ensure exhaustive checking in switch statements
 * Use this in the default case to catch unhandled values at compile time
 *
 * @example
 * ```ts
 * type Status = 'idle' | 'loading' | 'success' | 'error';
 *
 * function getStatusColor(status: Status) {
 *   switch (status) {
 *     case 'idle':
 *       return 'gray';
 *     case 'loading':
 *       return 'blue';
 *     case 'success':
 *       return 'green';
 *     case 'error':
 *       return 'red';
 *     default:
 *       return assertNever(status); // TypeScript will error if a case is missing
 *   }
 * }
 * ```
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

/**
 * Alternative exhaustive check that returns undefined instead of throwing
 * Useful when you want to handle the unexpected case gracefully
 */
export function exhaustiveCheck(value: never): undefined {
  console.error(
    `Unexpected value in exhaustive check: ${JSON.stringify(value)}`
  );
  return undefined;
}
