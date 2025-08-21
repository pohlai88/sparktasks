# WORKSPACE_RULES.md

## Allowed Top-Level Directories

| Folder         | Purpose                                                |
| -------------- | ------------------------------------------------------ |
| `docs`         | Developer & user documentation, guides, specifications |
| `src`          | Application source code (frontend, backend, shared)    |
| `test`         | Automated test suites (unit, integration, e2e)         |
| `tools`        | Build/maintenance scripts, scaffolding utilities       |
| `.github`      | GitHub Actions, workflows, issue templates             |
| `.vscode`      | Workspace/editor configuration (settings, extensions)  |
| `node_modules` | Installed npm dependencies (auto-generated)            |
| `.git`         | Version control data (auto-generated)                  |

## Naming Conventions

### Code Files

- **Scripts and utilities**: kebab-case (e.g., `sync-short-prompt.js`, `check-deps-doc.js`)
- **React components**: PascalCase (e.g., `TaskCard.tsx`, `HealthIndicator.tsx`)
- **TypeScript modules**: camelCase (e.g., `apiClient.ts`, `taskHelpers.ts`)
- **Test files**: `*.test.ts` or `*.spec.ts` (e.g., `tasks.test.ts`, `health.spec.ts`)

### Asset Files

- **CSS/SCSS**: kebab-case (e.g., `task-card.scss`, `app-layout.css`)
- **JSON configs**: kebab-case unless package standard (e.g., `api-contracts.json`, but `package.json`)
- **Markdown docs**: kebab-case (e.g., `api-contracts.md`, `workspace-rules.md`)

### Directory Names

- **Source directories**: camelCase (e.g., `src/shared`, `src/components`)
- **Documentation**: kebab-case (e.g., `docs/api-guide`, `docs/deployment-notes`)

## Prohibited

### Repository Content

- **Vendored libraries**: No `lib/` or `vendor/` directories without explicit approval and documentation
- **Large binary assets**: Files >1MB should be stored externally (CDN, releases, LFS) or compressed
- **Embedded third-party code**: Allowed in `src/` only if:
  - License-compatible with project license
  - Documented in `docs/DEPENDENCIES.md` with source attribution
  - Cannot be installed via package manager

### Gray Area Guidelines

- **Media assets**: Compress images/videos before committing; prefer external hosting for >500KB files
- **Generated files**: Exclude build artifacts, compiled output, and auto-generated code
- **Temporary files**: No `.tmp`, `.cache`, or personal workspace files

## Automation Enforcement

### Pre-commit Checks

The following are automatically validated before commits:

- **File size limits**: Reject files >1MB (configurable exceptions in `.gitlfs`)
- **Naming validation**: Verify kebab-case for scripts, PascalCase for components
- **Directory structure**: Ensure no prohibited top-level directories
- **Binary detection**: Flag unexpected binary files for review

### CI Pipeline Validation

- **Workspace structure**: Validate against allowed directory list
- **Dependency compliance**: Check for vendored libraries or oversized assets
- **Naming consistency**: Automated casing verification across file types

## Change Process

### Updating Rules

1. **Propose changes via PR** with rationale and impact assessment
2. **Check for conflicts** with:
   - `.gitignore` patterns
   - CI script assumptions
   - Documentation references
   - Build tool configurations
3. **Update enforcement scripts** in `tools/` to reflect new rules
4. **Document migration path** for existing files that violate new rules

### Rule Exceptions

- **Request approval** for exceptions via GitHub issue with justification
- **Document exceptions** in this file with expiration dates where applicable
- **Review exceptions** quarterly to ensure they're still necessary

## Current Exceptions

- None currently documented

## Enforcement Tools

- `tools/check-workspace-structure.js` - Validates directory structure and naming
- `.github/workflows/workspace-lint.yml` - CI enforcement pipeline
- `.gitignore` - Prevents common violations from being committed
