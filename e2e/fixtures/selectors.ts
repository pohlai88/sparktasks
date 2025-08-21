/**
 * SSOT Selector Registry
 *
 * Enterprise-grade selector management to eliminate magic strings
 * and provide centralized UI element targeting governance.
 */

/**
 * Core Application Selectors
 */
export const SEL = {
  // Navigation & Layout
  nav: {
    main: '[data-testid="main-navigation"]',
    projectsLink: '[data-testid="nav-projects"]',
    tasksLink: '[data-testid="nav-tasks"]',
    settingsLink: '[data-testid="nav-settings"]',
    userMenu: '[data-testid="user-menu"]',
  },

  // Task Management (SaaS Core)
  task: {
    container: '[data-testid="task-container"]',
    row: (id: string) => `[data-testid="task-row"][data-task-id="${id}"]`,
    title: '[data-testid="task-title"]',
    status: '[data-testid="task-status"]',
    priority: '[data-testid="task-priority"]',
    assignee: '[data-testid="task-assignee"]',
    dueDate: '[data-testid="task-due-date"]',
    createButton: '[data-testid="create-task-button"]',
    editButton: '[data-testid="edit-task-button"]',
    deleteButton: '[data-testid="delete-task-button"]',
    quickAdd: {
      input: '[data-testid="quick-add-input"]',
      button: '[data-testid="quick-add-button"]',
      form: '[data-testid="quick-add-form"]',
    },
  },

  // Project Management (Competitive Feature)
  project: {
    container: '[data-testid="project-container"]',
    row: (key: string) => `[data-testid="project-row"][data-key="${key}"]`,
    name: '[data-testid="project-name"]',
    description: '[data-testid="project-description"]',
    kanbanBoard: '[data-testid="kanban-board"]',
    ganttChart: '[data-testid="gantt-chart"]',
    createButton: '[data-testid="create-project-button"]',
  },

  // Advanced Features (SaaS Differentiators)
  commandPalette: {
    trigger: '[data-testid="command-palette-trigger"]',
    overlay: '[data-testid="command-palette-overlay"]',
    input: '[data-testid="command-palette-input"]',
    results: '[data-testid="command-palette-results"]',
    resultItem: (index: number) => `[data-testid="command-result-${index}"]`,
  },

  dataTable: {
    container: '[data-testid="data-table"]',
    header: '[data-testid="table-header"]',
    row: (index: number) => `[data-testid="table-row-${index}"]`,
    cell: (row: number, col: number) =>
      `[data-testid="table-cell-${row}-${col}"]`,
    sortButton: (column: string) => `[data-testid="sort-${column}"]`,
    filterInput: '[data-testid="table-filter"]',
    pagination: '[data-testid="table-pagination"]',
  },

  // Workspace & Collaboration
  workspace: {
    shell: '[data-testid="workspace-shell"]',
    sidebar: '[data-testid="workspace-sidebar"]',
    mainContent: '[data-testid="workspace-main"]',
    teamList: '[data-testid="team-list"]',
    memberCard: (userId: string) =>
      `[data-testid="member-card"][data-user-id="${userId}"]`,
  },

  // Data Export/Migration (Competitive Advantage)
  export: {
    button: '[data-testid="export-button"]',
    modal: '[data-testid="export-modal"]',
    formatSelect: '[data-testid="export-format-select"]',
    downloadButton: '[data-testid="download-export"]',
    progressBar: '[data-testid="export-progress"]',
  },

  // Forms & Inputs
  forms: {
    input: (name: string) => `[data-testid="input-${name}"]`,
    select: (name: string) => `[data-testid="select-${name}"]`,
    checkbox: (name: string) => `[data-testid="checkbox-${name}"]`,
    submitButton: '[data-testid="form-submit"]',
    cancelButton: '[data-testid="form-cancel"]',
    errorMessage: '[data-testid="form-error"]',
  },

  // Modals & Overlays
  modal: {
    overlay: '[data-testid="modal-overlay"]',
    content: '[data-testid="modal-content"]',
    header: '[data-testid="modal-header"]',
    body: '[data-testid="modal-body"]',
    footer: '[data-testid="modal-footer"]',
    closeButton: '[data-testid="modal-close"]',
  },

  // Loading & States
  loading: {
    spinner: '[data-testid="loading-spinner"]',
    skeleton: '[data-testid="loading-skeleton"]',
    progressBar: '[data-testid="progress-bar"]',
  },

  // Notifications & Feedback
  notifications: {
    container: '[data-testid="notifications-container"]',
    toast: '[data-testid="toast-notification"]',
    errorBanner: '[data-testid="error-banner"]',
    successBanner: '[data-testid="success-banner"]',
  },

  // Performance Testing Hooks
  perf: {
    taskList: '[data-testid="perf-task-list"]',
    largeDataset: '[data-testid="perf-large-dataset"]',
    virtualizedList: '[data-testid="perf-virtualized-list"]',
  },
} as const;

/**
 * Accessibility Testing Selectors
 */
export const A11Y_SEL = {
  landmarks: {
    main: 'main',
    navigation: 'nav',
    banner: 'banner',
    contentinfo: 'contentinfo',
  },

  headings: {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
  },

  forms: {
    requiredFields: '[aria-required="true"]',
    invalidFields: '[aria-invalid="true"]',
    describedFields: '[aria-describedby]',
  },
} as const;

/**
 * Role-based selectors for different user types
 */
export const ROLE_SEL = {
  admin: {
    settingsPanel: '[data-testid="admin-settings-panel"]',
    userManagement: '[data-testid="admin-user-management"]',
    systemSettings: '[data-testid="admin-system-settings"]',
  },

  manager: {
    teamDashboard: '[data-testid="manager-team-dashboard"]',
    reportingTools: '[data-testid="manager-reporting"]',
  },

  member: {
    personalDashboard: '[data-testid="member-dashboard"]',
    taskView: '[data-testid="member-task-view"]',
  },
} as const;

/**
 * Helper functions for dynamic selectors
 */
export const selectorHelpers = {
  /**
   * Create selector for nth item in a list
   */
  nthItem: (baseSelector: string, index: number) =>
    `${baseSelector}:nth-child(${index + 1})`,

  /**
   * Create selector with text content
   */
  withText: (baseSelector: string, text: string) =>
    `${baseSelector}:has-text("${text}")`,

  /**
   * Create selector for visible elements only
   */
  visible: (baseSelector: string) => `${baseSelector}:visible`,

  /**
   * Create selector for enabled elements only
   */
  enabled: (baseSelector: string) => `${baseSelector}:enabled`,
} as const;
