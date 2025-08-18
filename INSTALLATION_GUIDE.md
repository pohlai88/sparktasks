# SparkTasks Full Stack Installation Guide

## Prerequisites Installation

### 1. Install Node.js 18.16.0

**Method A: Direct Download (Recommended)**
1. Visit: https://nodejs.org/download/release/v18.16.0/
2. Download: `node-v18.16.0-x64.msi` (Windows 64-bit)
3. Run installer with default settings
4. Restart PowerShell/VS Code after installation

**Method B: Using Node Version Manager (nvm-windows)**
1. Download nvm-windows: https://github.com/coreybutler/nvm-windows/releases
2. Install nvm-setup.exe
3. Restart PowerShell as Administrator
4. Run: `nvm install 18.16.0`
5. Run: `nvm use 18.16.0`

**Verification:**
```powershell
node --version   # Should output: v18.16.0
npm --version    # Should output: 9.x.x
```

### 2. Configure npm for Project

Create `.npmrc` file in project root:
```powershell
echo "engine-strict=true" > .npmrc
```

Create `.nvmrc` file in project root:
```powershell
echo "18.16.0" > .nvmrc
```

## Environment Setup

### 3. Install All Dependencies

**Core Installation:**
```powershell
# Install all project dependencies
npm install

# Verify installation
npm ls --depth=0
```

**Verify Key Dependencies:**
```powershell
# Check React installation
npm ls react react-dom

# Check development tools
npm ls vite typescript tailwindcss

# Check testing tools
npm ls vitest playwright @testing-library/react
```

### 4. Environment Validation

**Run all validation checks:**
```powershell
# Validate tech stack compliance
node tools/run-validators.js

# Check workspace structure
node tools/check-workspace-structure.js

# Verify dependencies documentation
node tools/check-deps-doc.js
```

### 5. Development Server Setup

**Start development environment:**
```powershell
# Start Vite dev server (http://localhost:3000)
npm run dev

# In separate terminal - run tests in watch mode
npm run test:watch

# In separate terminal - run Playwright tests
npm run test:e2e
```

## Installation Commands Summary

```powershell
# 1. Change to project directory
cd c:\Users\HomePC\Documents\AIBOS-MicroService\SlackTasks

# 2. Install dependencies
npm install

# 3. Validate setup
node tools/run-validators.js

# 4. Start development
npm run dev
```

## Troubleshooting

### Node.js Not Found
- Ensure Node.js 18.16.0 is installed
- Restart PowerShell/VS Code after installation
- Check PATH environment variable includes Node.js

### npm install Fails
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### Version Mismatch
```powershell
# Check current versions
node --version
npm --version

# If wrong version, reinstall Node.js 18.16.0
```

### Permission Issues
```powershell
# Run PowerShell as Administrator
# Or configure npm global directory:
npm config set prefix "%APPDATA%\npm"
```

## Post-Installation Verification

### Development Environment Check
```powershell
# Start dev server (should open http://localhost:3000)
npm run dev

# Run unit tests (should pass all tests)
npm run test:unit

# Run integration tests
npm run test:integration

# Build production bundle
npm run build

# Preview production build
npm run preview
```

### Expected Output
- **Dev server**: Vite server starts on port 3000
- **Tests**: All unit/integration tests pass
- **Build**: Creates `dist/` folder with optimized bundle
- **Bundle size**: Main bundle < 500KB, vendor chunks < 300KB

## Next Steps

After successful installation:

1. **Review codebase**: Start with `src/App.tsx` and `src/main.tsx`
2. **Understand architecture**: Read `docs/SSOT.md` for project philosophy
3. **Start development**: Implement MVP features using existing components
4. **Run tests**: Use `npm run test:watch` during development
5. **Follow SSOT**: Check `DEPENDENCIES.md` before adding new packages

## Development Workflow

```powershell
# Daily workflow
npm run dev           # Start development server
npm run test:watch    # Run tests in watch mode
npm run build         # Build for production
npm run preview       # Test production build locally
```

## Enterprise Features (Future)

After MVP validation:
- Add backend API (Node.js + Fastify)
- Database integration (Prisma + PostgreSQL)
- Complex UI components (Radix UI + shadcn/ui)
- CI/CD pipeline setup
- Performance monitoring
