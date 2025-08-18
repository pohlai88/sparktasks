const MAP = require('../ssot-map.cjs');

/**
 * Normalize class string for mapping lookup
 */
function normalizeClasses(classString) {
  return classString.trim().replace(/\s+/g, ' ');
}

/**
 * Find token replacement for a class or class combination
 */
function findTokenReplacement(classString) {
  const normalized = normalizeClasses(classString);
  
  // Handle spinner special case first
  if (/animate-spin/.test(normalized) && /(h-\d+|w-\d+|size-\d+)/.test(normalized)) {
    return MAP['__spinner__'];
  }
  
  // Try exact match first
  if (MAP.hasOwnProperty(normalized)) {
    return MAP[normalized];
  }
  
  // Try individual classes
  const classes = normalized.split(/\s+/);
  for (const cls of classes) {
    if (MAP.hasOwnProperty(cls) && MAP[cls] !== null) {
      return { singleClass: cls, token: MAP[cls] };
    }
  }
  
  return null;
}

/**
 * Generate template literal replacement
 */
function generateReplacement(originalValue, classToReplace, tokenPath) {
  if (!tokenPath) return null;
  
  // If it's already a template literal, just replace the class
  if (originalValue.includes('${')) {
    return originalValue.replace(
      new RegExp(`\\b${classToReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'),
      `\${${tokenPath}}`
    );
  }
  
  // Convert string literal to template literal with token
  const replaced = originalValue.replace(
    new RegExp(`\\b${classToReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'),
    `\${${tokenPath}}`
  );
  
  return replaced;
}

module.exports = {
  rules: {
    'no-hardcoded-tailwind': {
      meta: {
        type: 'suggestion',
        fixable: 'code',
        docs: {
          description: 'Replace hardcoded Tailwind classes with design tokens',
          category: 'Best Practices',
        },
        messages: {
          replace: 'Replace hardcoded "{{class}}" with design token {{token}}',
          replacePattern: 'Replace hardcoded pattern "{{pattern}}" with design token {{token}}',
        },
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name?.name !== 'className') return;
            
            const val = node.value;
            if (!val || val.type !== 'Literal' || typeof val.value !== 'string') return;
            
            const classValue = val.value;
            
            // Skip if empty or just whitespace
            if (!classValue.trim()) return;
            
            // Check for multi-class patterns first (like button patterns)
            const multiClassPatterns = [
              'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg',
              'inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg',
              'flex items-center justify-between',
              'flex items-center gap-3',
              'flex justify-end space-x-3',
              'px-4 py-2',
              'px-3 py-1.5',
              'w-4 h-4',
              'w-5 h-5',
              'w-6 h-6',
              'w-8 h-8'
            ];
            
            for (const pattern of multiClassPatterns) {
              if (classValue.includes(pattern)) {
                const token = MAP[pattern];
                if (token) {
                  context.report({
                    node: val,
                    messageId: 'replacePattern',
                    data: { pattern, token },
                    fix(fixer) {
                      const newValue = generateReplacement(classValue, pattern, token);
                      if (newValue && newValue !== classValue) {
                        // Use template literal syntax
                        return fixer.replaceText(val, `{\`${newValue}\`}`);
                      }
                      return null;
                    },
                  });
                  return; // Only fix one pattern per attribute
                }
              }
            }
            
            // Check individual classes
            const classes = classValue.split(/\s+/);
            for (const cls of classes) {
              if (MAP.hasOwnProperty(cls) && MAP[cls] !== null) {
                const token = MAP[cls];
                context.report({
                  node: val,
                  messageId: 'replace',
                  data: { class: cls, token },
                  fix(fixer) {
                    const newValue = generateReplacement(classValue, cls, token);
                    if (newValue && newValue !== classValue) {
                      // Use template literal syntax
                      return fixer.replaceText(val, `{\`${newValue}\`}`);
                    }
                    return null;
                  },
                });
                return; // Only fix one class per attribute to avoid conflicts
              }
            }
            
            // Special case: spinner detection
            if (/animate-spin/.test(classValue) && /(h-\d+|w-\d+|size-\d+)/.test(classValue)) {
              const token = MAP['__spinner__'];
              if (token) {
                context.report({
                  node: val,
                  messageId: 'replacePattern',
                  data: { pattern: 'spinner', token },
                  fix(fixer) {
                    return fixer.replaceText(val, `{${token}}`);
                  },
                });
              }
            }
          },
        };
      },
    },
  },
};
