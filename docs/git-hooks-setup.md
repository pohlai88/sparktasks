# Git Hooks Setup

When ready to add pre-commit hooks to enforce quality gates:

## Installation
```bash
npm install --save-dev husky lint-staged
npx husky install
npm pkg set scripts.prepare="husky install"
```

## Setup pre-commit hook
```bash
npx husky add .husky/pre-commit "npm run precommit"
```

## Setup commit-msg hook (for conventional commits)
```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

## Alternative: Simple Git Hooks
If you prefer not to use Husky, create `.git/hooks/pre-commit` manually:

```bash
#!/bin/sh
npm run precommit
```

Then make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

This ensures all commits pass linting, formatting, validation, and unit tests before they leave a developer's machine.
