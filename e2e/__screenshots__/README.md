# Screenshots Directory

This directory contains baseline images for visual regression testing.

## Structure

- `__screenshots__/`: Contains all baseline screenshots
- Organized by test file and browser
- Format: `{test-name}-{browser}.png`

## Usage

- Initial run generates baseline images
- Subsequent runs compare against baselines
- Update baselines with: `npm run test:visual:update`

## Guidelines

1. Screenshots should be deterministic (hide dynamic content like timestamps)
2. Use consistent viewport sizes across tests
3. Disable animations for stable comparisons
4. Include both desktop and mobile viewports

## Maintenance

- Review screenshot changes in PRs carefully
- Update baselines only when UI changes are intentional
- Keep screenshot files in version control for team consistency
