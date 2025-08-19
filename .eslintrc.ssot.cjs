/**
 * ESLint Configuration for SSOT Governance  
 * Production-ready version with working AST rules
 */

const baseConfig = require('./.eslintrc.cjs');

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    
    // Remove problematic rules
    'prettier/prettier': 'off',
    
    // SSOT governance via AST pattern matching - PRODUCTION READY
    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXAttribute[name.name="className"] Literal[value=/\\bml?-[0-9]+\\b/]',
        message: 'Use DESIGN_TOKENS.spacing.margin.* instead of hardcoded margin-left utilities like "ml-4". See tools/ssot-map.js for mappings.'
      },
      {
        selector: 'JSXAttribute[name.name="className"] Literal[value=/\\bmr?-[0-9]+\\b/]',
        message: 'Use DESIGN_TOKENS.spacing.margin.* instead of hardcoded margin-right utilities like "mr-4". See tools/ssot-map.js for mappings.'
      },
      {
        selector: 'JSXAttribute[name.name="className"] Literal[value=/\\bmt?-[0-9]+\\b/]',
        message: 'Use DESIGN_TOKENS.spacing.margin.* instead of hardcoded margin-top utilities like "mt-4". See tools/ssot-map.js for mappings.'
      },
      {
        selector: 'JSXAttribute[name.name="className"] Literal[value=/\\bmb?-[0-9]+\\b/]',
        message: 'Use DESIGN_TOKENS.spacing.margin.* instead of hardcoded margin-bottom utilities like "mb-4". See tools/ssot-map.js for mappings.'
      },
      {
        selector: 'JSXAttribute[name.name="className"] Literal[value=/\\bgap-[0-9]+\\b/]',
        message: 'Use DESIGN_TOKENS.spacing.gap.* instead of hardcoded gap utilities like "gap-4".'
      },
      {
        selector: 'JSXAttribute[name.name="className"] Literal[value=/\\bw-[0-9]+\\b/]',
        message: 'Use DESIGN_TOKENS.sizing.* instead of hardcoded width utilities. Check tools/ssot-map.js for icon patterns.'
      },
      {
        selector: 'JSXAttribute[name.name="className"] Literal[value=/\\bh-[0-9]+\\b/]',
        message: 'Use DESIGN_TOKENS.sizing.* instead of hardcoded height utilities. Check tools/ssot-map.js for icon patterns.'
      },
      {
        selector: 'JSXAttribute[name.name="className"] Literal[value=/\\bsize-[0-9]+\\b/]',
        message: 'Use DESIGN_TOKENS.sizing.* instead of hardcoded size utilities. Check tools/ssot-map.js for icon patterns.'
      },
      {
        selector: 'JSXAttribute[name.name="className"] Literal[value=/\\bflex\\s+items-center\\b/]',
        message: 'Use DESIGN_TOKENS.layout.flexCenter instead of "flex items-center".'
      },
      {
        selector: 'JSXAttribute[name.name="className"] Literal[value=/\\bfont-(bold|semibold|medium)\\b/]',
        message: 'Use DESIGN_TOKENS.typography.weight.* instead of hardcoded font weight utilities.'
      }
    ],
    
    // Disable conflicting rules during SSOT migration
    'tailwindcss/no-custom-classname': 'off',
  },
  
  settings: {
    ...baseConfig.settings,
    'ssot': {
      tokensPath: './src/design/tokens.ts',
      mappingPath: './tools/ssot-map.js',
      strict: true
    }
  }
};
