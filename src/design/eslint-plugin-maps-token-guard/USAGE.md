# ESLint Plugin MAPS Token Guard - Test Usage

## Testing the Plugin Locally

To test the plugin in the main SparkTasks project:

1. **Build the plugin** (already done):
   ```bash
   cd src/design/eslint-plugin-maps-token-guard
   npm run build
   ```

2. **Add to main project .eslintrc.cjs**:
   ```javascript
   module.exports = {
     plugins: ['./src/design/eslint-plugin-maps-token-guard'],
     extends: ['plugin:maps-token-guard/recommended'],
     // ... existing config
   }
   ```

3. **Test with sample violations**:
   ```tsx
   // This should trigger warnings:
   <div className="bg-red-500 p-[16px]" style={{ zIndex: 999 }} />
   <span className="sr-only">Hidden text</span>
   ```

## Distribution

When ready for external distribution:

1. **Publish to NPM**:
   ```bash
   cd src/design/eslint-plugin-maps-token-guard
   npm publish
   ```

2. **External projects can use**:
   ```bash
   npm install eslint-plugin-maps-token-guard
   ```

   ```javascript
   // .eslintrc.js
   module.exports = {
     plugins: ['maps-token-guard'],
     extends: ['plugin:maps-token-guard/recommended'],
   }
   ```

## Architecture Benefits

✅ **SSOT Compliance**: Plugin lives in `src/design/` with all design system code
✅ **Reusable**: Can be distributed independently 
✅ **Maintainable**: Single source of truth for governance rules
✅ **Industry Standard**: Proper ESLint plugin structure
