# SparkTasks

[![Build](https://img.shields.io/badge/build-pending-lightgrey)](https://github.com/your/repo/actions)
[![All Drift Checks](https://github.com/your/repo/actions/workflows/drift-check.yml/badge.svg)](https://github.com/your/repo/actions)
[![Deps](https://img.shields.io/badge/dependencies-up--to--date-brightgreen)](https://github.com/your/repo/pulls)

**Storage-neutral, local-first task platform** with BYOS architecture, offline-first collaboration, and accountable automations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run code quality checks
npm run lint          # Check for linting issues
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting

# Run tests
npm test

# Build for production
npm run build
```

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **State**: Zustand (local-first, lightweight)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Code Quality**: ESLint 8.57.1 + Prettier + pre-commit hooks
- **Testing**: Vitest + Playwright + Testing Library
- **Build**: Vite (ES modules, fast HMR)
- **Development**: VS Code + Tailwind CSS IntelliSense

## 📋 Code Quality

This project enforces enterprise-grade code quality standards:

- **ESLint**: TypeScript-aware linting with React 18 and accessibility rules
- **Prettier**: Automated code formatting with Tailwind class sorting
- **Zero warnings**: `--max-warnings 0` policy prevents warning accumulation
- **Pre-commit hooks**: Automatic validation before commits
- **VS Code integration**: Enhanced IntelliSense and autocomplete for Tailwind CSS

### Quality Commands

```bash
npm run lint          # Check for linting issues
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format all code with Prettier
npm run format:check  # Verify code formatting
```

## Governance & Drift Control

This repository is intentionally designed to resist _drift_ — unplanned, silent changes that erode stability.  
Every high‑risk domain has a **Single Source of Truth (SSOT)**, with automated checks in CI to keep reality aligned.

| Domain           | SSOT Artifact                                                                | Enforcement                                                                           | Owner           |
| ---------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------- |
| Prompt Rules     | [`docs/SSOT.md`](docs/SSOT.md) & [`SHORT_PROMPT.md`](SHORT_PROMPT.md)        | [`validate-ssot.js`](tools/validate-ssot.js) + auto‑PR sync                           | Product Lead    |
| Tech Stack       | [`TECH_STACK.md`](TECH_STACK.md), [`.nvmrc`](.nvmrc), package.json `engines` | [`check-tech-stack.js`](tools/check-tech-stack.js) in CI                              | Lead Engineer   |
| Dependencies     | [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md), `package-lock.json`          | [`check-deps-doc.js`](tools/check-deps-doc.js) in CI                                  | Build/DevOps    |
| Workspace Layout | [`WORKSPACE_RULES.md`](WORKSPACE_RULES.md)                                   | [`check-workspace-structure.js`](tools/check-workspace-structure.js) in CI            | Repo Maintainer |
| Environment Vars | [`.env.schema.json`](.env.schema.json), `.env.example`                       | [`check-env.js`](tools/check-env.js) in CI                                            | Infra Lead      |
| API Contracts    | [`API_CONTRACTS.md`](API_CONTRACTS.md)                                       | [`api-contracts.test.ts`](test/integration/api-contracts.test.ts) + schema validation | API Lead        |

### 🔍 How it works

- **SSOTs** are the single, authoritative definition for each domain.
- **Validators** in [`/tools/`](tools/) compare the SSOT to the current state and fail CI if they diverge.
- **Drift‑check workflow** runs on every PR and weekly on `main` to catch silent drift.
- **Dependabot** raises weekly update PRs for dependencies, keeping change cadence deliberate.

### ⚠️ Drift Response Playbook

If a drift check fails on your PR:

1. Review the validator output for specific mismatches
2. Update either the SSOT _or_ the real-world artifact to match (whichever is correct)
3. Commit all related changes in the same branch
4. Re-run checks — CI will block merges until drift is resolved

### ✏️ Changing an SSOT

1. Edit the SSOT artifact.
2. Update any linked artifacts or metadata (e.g., SHORT_PROMPT.md for prompt rules).
3. Commit all related changes together so CI passes.
4. Merge via PR — automation will block drift and/or open a sync PR if needed.

### ⏳ Audit Cadence

- **Automated**: Drift checks run on every PR and weekly on `main`
- **Manual**: Once per quarter, run `npm run validate:all` locally to validate CI coverage
- **Review**: Quarterly assessment of whether SSOTs themselves remain authoritative for their domains

### 🧩 Extensibility

When a new high‑risk domain emerges (e.g., security policy, licensing compliance):

1. Create an SSOT artifact documenting the authoritative state
2. Build a validator in [`/tools/`](tools/) to detect drift
3. Register the validator in CI and add to the table above
4. Assign domain ownership for approval authority

---

Badge notes

- Replace badge URLs with your repository's actual GitHub Actions and Dependabot URLs once the repo is hosted.

Ready-to-paste badge markdown (replace OWNER/REPO):

```
[![All Drift Checks](https://github.com/OWNER/REPO/actions/workflows/drift-check.yml/badge.svg)](https://github.com/OWNER/REPO/actions)
```
