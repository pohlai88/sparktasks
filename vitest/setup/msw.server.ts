/**
 * MSW Server Setup - Fortune-500 Grade API Testing
 *
 * Mock Service Worker configuration for integration tests.
 * Provides realistic HTTP behavior for API components like:
 * - APIExplorer
 * - DataTable with realtime features
 * - Any component that makes HTTP requests
 */

import { setupServer } from 'msw/node';
import { apiExplorerHandlers } from '../handlers/apiExplorer.handlers';
import { dataTableHandlers } from '../handlers/dataTable.handlers';

// Create MSW server with all handlers
export const server = setupServer(...apiExplorerHandlers, ...dataTableHandlers);
