# Git Setup and Push Commands
# Run these commands in PowerShell after installing Git

# Navigate to your project directory
cd "c:\Users\HomePC\Documents\AIBOS-MicroService\SlackTasks"

# Initialize git repository
git init

# Configure git (replace with your details)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add remote repository
git remote add origin https://github.com/aibos-app/sparktasks.git

# Add all files (respecting .gitignore)
git add .

# Create initial commit
git commit -m "Initial commit: SlackTasks SSOT implementation complete

✅ Features completed:
- 100% SSOT compliance achieved
- Professional UI component library (10+ components)
- Design token system (400+ tokens)
- Accessibility compliant (ARIA, keyboard nav)
- TypeScript + Tailwind CSS
- E2E testing with Playwright
- Professional audit report

🎯 Ready for production deployment"

# Push to GitHub
git push -u origin main

# Alternative if main branch doesn't exist, try:
# git push -u origin master
