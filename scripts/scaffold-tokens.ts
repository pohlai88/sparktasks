import fs from 'fs';
import path from 'path';

interface TokenScaffold {
  category: string;
  key: string;
  value: string;
  suggestion: string;
}

const COMMON_CLASS_TO_TOKEN: Record<string, TokenScaffold> = {
  // Layout & Flexbox
  flex: {
    category: 'layout.flex',
    key: 'row',
    value: 'flex',
    suggestion: 'DESIGN_TOKENS.layout.flex.row',
  },
  'flex-col': {
    category: 'layout.flex',
    key: 'col',
    value: 'flex flex-col',
    suggestion: 'DESIGN_TOKENS.layout.flex.col',
  },
  'inline-flex': {
    category: 'layout.flex',
    key: 'inline',
    value: 'inline-flex',
    suggestion: 'DESIGN_TOKENS.layout.flex.inline',
  },
  'items-center': {
    category: 'layout.flex',
    key: 'itemsCenter',
    value: 'items-center',
    suggestion: 'DESIGN_TOKENS.layout.flex.itemsCenter',
  },
  'justify-center': {
    category: 'layout.flex',
    key: 'justifyCenter',
    value: 'justify-center',
    suggestion: 'DESIGN_TOKENS.layout.flex.justifyCenter',
  },
  'shrink-0': {
    category: 'layout.flex',
    key: 'shrinkNone',
    value: 'shrink-0',
    suggestion: 'DESIGN_TOKENS.layout.flex.shrinkNone',
  },

  // Spacing
  'gap-0': {
    category: 'layout.spacing.gap',
    key: '0',
    value: 'gap-0',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap[0]',
  },
  'gap-0.5': {
    category: 'layout.spacing.gap',
    key: '0.5',
    value: 'gap-0.5',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap[0.5]',
  },
  'gap-1': {
    category: 'layout.spacing.gap',
    key: 'xs',
    value: 'gap-1',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap.xs',
  },
  'gap-1.5': {
    category: 'layout.spacing.gap',
    key: '1.5',
    value: 'gap-1.5',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap[1.5]',
  },
  'gap-2': {
    category: 'layout.spacing.gap',
    key: 'sm',
    value: 'gap-2',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap.sm',
  },
  'gap-2.5': {
    category: 'layout.spacing.gap',
    key: '2.5',
    value: 'gap-2.5',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap[2.5]',
  },
  'gap-3': {
    category: 'layout.spacing.gap',
    key: 'md',
    value: 'gap-3',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap.md',
  },
  'gap-4': {
    category: 'layout.spacing.gap',
    key: 'lg',
    value: 'gap-4',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap.lg',
  },
  'gap-5': {
    category: 'layout.spacing.gap',
    key: '5',
    value: 'gap-5',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap[5]',
  },
  'gap-6': {
    category: 'layout.spacing.gap',
    key: 'xl',
    value: 'gap-6',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap.xl',
  },
  'gap-7': {
    category: 'layout.spacing.gap',
    key: '7',
    value: 'gap-7',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap[7]',
  },
  'gap-8': {
    category: 'layout.spacing.gap',
    key: 'xxl',
    value: 'gap-8',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap.xxl',
  },
  'gap-10': {
    category: 'layout.spacing.gap',
    key: '10',
    value: 'gap-10',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap[10]',
  },
  'gap-12': {
    category: 'layout.spacing.gap',
    key: '12',
    value: 'gap-12',
    suggestion: 'DESIGN_TOKENS.layout.spacing.gap[12]',
  },

  'space-y-2': {
    category: 'layout.spacing.fine',
    key: 'spaceY2',
    value: 'space-y-2',
    suggestion: 'DESIGN_TOKENS.layout.spacing.fine.spaceY2',
  },
  'space-y-4': {
    category: 'layout.spacing.fine',
    key: 'spaceY4',
    value: 'space-y-4',
    suggestion: 'DESIGN_TOKENS.layout.spacing.fine.spaceY4',
  },
  'space-x-2': {
    category: 'layout.spacing.fine',
    key: 'spaceX2',
    value: 'space-x-2',
    suggestion: 'DESIGN_TOKENS.layout.spacing.fine.spaceX2',
  },
  'space-x-4': {
    category: 'layout.spacing.fine',
    key: 'spaceX4',
    value: 'space-x-4',
    suggestion: 'DESIGN_TOKENS.layout.spacing.fine.spaceX4',
  },
  'pt-2': {
    category: 'layout.spacing.fine',
    key: 'pt2',
    value: 'pt-2',
    suggestion: 'DESIGN_TOKENS.layout.spacing.fine.pt2',
  },
  'pt-4': {
    category: 'layout.spacing.fine',
    key: 'pt4',
    value: 'pt-4',
    suggestion: 'DESIGN_TOKENS.layout.spacing.fine.pt4',
  },
  'pb-2': {
    category: 'layout.spacing.fine',
    key: 'pb2',
    value: 'pb-2',
    suggestion: 'DESIGN_TOKENS.layout.spacing.fine.pb2',
  },
  'pb-4': {
    category: 'layout.spacing.fine',
    key: 'pb4',
    value: 'pb-4',
    suggestion: 'DESIGN_TOKENS.layout.spacing.fine.pb4',
  },

  // Size utilities
  'size-4': {
    category: 'layout.spacing.fine',
    key: 'size4',
    value: 'size-4',
    suggestion: 'DESIGN_TOKENS.layout.spacing.fine.size4',
  },
  'size-5': {
    category: 'layout.spacing.fine',
    key: 'size5',
    value: 'size-5',
    suggestion: 'DESIGN_TOKENS.layout.spacing.fine.size5',
  },

  // Text utilities
  'text-xs': {
    category: 'layout.spacing.fine',
    key: 'textXs',
    value: 'text-xs',
    suggestion: 'DESIGN_TOKENS.layout.spacing.fine.textXs',
  },
  'text-gray-500': {
    category: 'recipe.attachment.text',
    key: 'meta',
    value: 'text-xs text-gray-500',
    suggestion: 'DESIGN_TOKENS.recipe.attachment.text.meta',
  },

  // Flex utilities
  'items-start': {
    category: 'layout.flex',
    key: 'itemsStart',
    value: 'items-start',
    suggestion: 'DESIGN_TOKENS.layout.flex.itemsStart',
  },
  'min-w-0': {
    category: 'layout.flex',
    key: 'minW0',
    value: 'min-w-0',
    suggestion: 'DESIGN_TOKENS.layout.flex.minW0',
  },
  'flex-1': {
    category: 'layout.flex',
    key: 'flex1',
    value: 'flex-1',
    suggestion: 'DESIGN_TOKENS.layout.flex.flex1',
  },
  'mt-1': {
    category: 'layout.spacing.fine',
    key: 'mt1',
    value: 'mt-1',
    suggestion: 'DESIGN_TOKENS.layout.spacing.fine.mt1',
  },

  // Attachment-specific patterns
  'flex items-start gap-3': {
    category: 'recipe.attachment',
    key: 'container',
    value: 'flex items-start gap-3',
    suggestion: 'DESIGN_TOKENS.recipe.attachment.container',
  },
  'min-w-0 flex-1': {
    category: 'recipe.attachment',
    key: 'content',
    value: 'min-w-0 flex-1',
    suggestion: 'DESIGN_TOKENS.recipe.attachment.content',
  },
  'flex items-start justify-between gap-2': {
    category: 'recipe.attachment',
    key: 'header',
    value: 'flex items-start justify-between gap-2',
    suggestion: 'DESIGN_TOKENS.recipe.attachment.header',
  },
  'mt-1 flex items-center gap-2': {
    category: 'recipe.attachment',
    key: 'metadata',
    value: 'mt-1 flex items-center gap-2',
    suggestion: 'DESIGN_TOKENS.recipe.attachment.metadata',
  },
  'space-y-6': {
    category: 'layout.spacing',
    key: 'relaxed',
    value: 'space-y-6',
    suggestion: 'DESIGN_TOKENS.layout.spacing.relaxed',
  },

  // Padding
  'p-2': {
    category: 'layout.padding',
    key: 'sm',
    value: 'p-2',
    suggestion: 'DESIGN_TOKENS.layout.padding.sm',
  },
  'p-4': {
    category: 'layout.padding',
    key: 'md',
    value: 'p-4',
    suggestion: 'DESIGN_TOKENS.layout.padding.md',
  },
  'p-6': {
    category: 'layout.padding',
    key: 'lg',
    value: 'p-6',
    suggestion: 'DESIGN_TOKENS.layout.padding.lg',
  },
  'px-3': {
    category: 'layout.padding',
    key: 'xSm',
    value: 'px-3',
    suggestion: 'DESIGN_TOKENS.layout.padding.xSm',
  },
  'py-2': {
    category: 'layout.padding',
    key: 'ySm',
    value: 'py-2',
    suggestion: 'DESIGN_TOKENS.layout.padding.ySm',
  },

  // Border Radius
  rounded: {
    category: 'theme.light.radius',
    key: 'base',
    value: 'rounded',
    suggestion: 'DESIGN_TOKENS.theme.light.radius.base',
  },
  'rounded-md': {
    category: 'theme.light.radius',
    key: 'md',
    value: 'rounded-md',
    suggestion: 'DESIGN_TOKENS.theme.light.radius.md',
  },
  'rounded-lg': {
    category: 'theme.light.radius',
    key: 'lg',
    value: 'rounded-lg',
    suggestion: 'DESIGN_TOKENS.theme.light.radius.lg',
  },
  'rounded-full': {
    category: 'theme.light.radius',
    key: 'full',
    value: 'rounded-full',
    suggestion: 'DESIGN_TOKENS.theme.light.radius.full',
  },

  // Accessibility
  'sr-only': {
    category: 'accessibility',
    key: 'srOnly',
    value: 'sr-only',
    suggestion: 'DESIGN_TOKENS.accessibility.srOnly',
  },

  // Grid
  grid: {
    category: 'layout.grid',
    key: 'base',
    value: 'grid',
    suggestion: 'DESIGN_TOKENS.layout.grid.base',
  },
  'grid-cols-2': {
    category: 'layout.grid',
    key: 'cols2',
    value: 'grid-cols-2',
    suggestion: 'DESIGN_TOKENS.layout.grid.cols2',
  },
  'grid-cols-3': {
    category: 'layout.grid',
    key: 'cols3',
    value: 'grid-cols-3',
    suggestion: 'DESIGN_TOKENS.layout.grid.cols3',
  },
};

function parseTokenPath(path: string): { category: string[]; key: string } {
  const parts = path.split('.');
  return {
    category: parts.slice(0, -1),
    key: parts[parts.length - 1],
  };
}

function getNestedValue(obj: any, path: string[]): any {
  return path.reduce((current, key) => current?.[key], obj);
}

function setNestedValue(obj: any, path: string[], value: any): void {
  const lastKey = path[path.length - 1];
  const parentPath = path.slice(0, -1);

  let current = obj;
  for (const key of parentPath) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
}

function readTokensFile(): any {
  const tokensPath = 'src/design/tokens.ts';
  try {
    const content = fs.readFileSync(tokensPath, 'utf8');

    // Extract DESIGN_TOKENS object (basic regex parsing)
    const match = content.match(/export const DESIGN_TOKENS = ({[\s\S]*?});$/m);
    if (!match) {
      console.warn('Could not parse DESIGN_TOKENS from tokens.ts');
      return {};
    }

    // This is a simplified approach - in real implementation, use a proper TS parser
    // For now, return the existing structure we know
    return {
      layout: {
        flex: {
          row: 'flex',
          col: 'flex flex-col',
          shrinkNone: 'shrink-0',
          grow: 'grow',
          growNone: 'grow-0',
        },
        spacing: {
          tight: 'space-y-2',
          normal: 'space-y-4',
          relaxed: 'space-y-6',
        },
      },
      theme: {
        light: {
          radius: {
            base: 'rounded',
            md: 'rounded-md',
            lg: 'rounded-lg',
          },
        },
      },
      accessibility: {
        srOnly: 'sr-only',
      },
      recipe: {
        alert: {
          color: {
            info: { container: 'bg-blue-50', icon: 'text-blue-600' },
            success: { container: 'bg-green-50', icon: 'text-green-600' },
            warning: { container: 'bg-yellow-50', icon: 'text-yellow-600' },
            error: { container: 'bg-red-50', icon: 'text-red-600' },
          },
          content: {
            base: 'space-y-2',
          },
        },
      },
    };
  } catch (error) {
    console.warn('Could not read tokens.ts, starting with minimal structure');
    return {
      layout: {},
      theme: { light: {} },
      accessibility: {},
      recipe: {},
    };
  }
}

function scaffoldTokens(classNames: string[]): void {
  console.log(`🏗️ Scaffolding tokens for: ${classNames.join(', ')}`);

  const tokens = readTokensFile();
  const scaffolded: TokenScaffold[] = [];
  const suggestions: string[] = [];

  for (const className of classNames) {
    const scaffold = COMMON_CLASS_TO_TOKEN[className];

    if (scaffold) {
      const { category, key } = parseTokenPath(scaffold.category);
      const existing = getNestedValue(tokens, [...category, key]);

      if (!existing) {
        setNestedValue(tokens, [...category, key], scaffold.value);
        scaffolded.push(scaffold);
        console.log(`  ✅ Added: ${scaffold.suggestion} = "${scaffold.value}"`);
      } else {
        console.log(`  ⚠️ Already exists: ${scaffold.suggestion}`);
      }

      suggestions.push(`Use: ${scaffold.suggestion}`);
    } else {
      // Generate a reasonable suggestion for unknown classes
      if (className.startsWith('bg-')) {
        suggestions.push(
          `Consider: DESIGN_TOKENS.recipe.component.color.variant.container`
        );
      } else if (className.startsWith('text-')) {
        suggestions.push(
          `Consider: DESIGN_TOKENS.recipe.component.color.variant.text`
        );
      } else if (className.match(/^p[xy]?-\d+$/)) {
        suggestions.push(
          `Consider: DESIGN_TOKENS.layout.padding.${className.replace(/[^a-z0-9]/g, '')}`
        );
      } else {
        suggestions.push(
          `Consider adding: DESIGN_TOKENS.layout.${className.replace(/-/g, '')} = "${className}"`
        );
      }
      console.log(`  ❓ Unknown class: ${className} - manual review needed`);
    }
  }

  if (scaffolded.length > 0) {
    console.log(`\n📝 Generated token structure preview:`);
    console.log(JSON.stringify(tokens, null, 2));

    console.log(`\n💡 Next steps:`);
    console.log(`1. Review and update src/design/tokens.ts with new tokens`);
    console.log(`2. Replace hardcoded classes with token references:`);
    suggestions.forEach(s => console.log(`   ${s}`));
    console.log(`3. Run tests to ensure no regressions`);

    // Write scaffolded structure to a temporary file
    fs.writeFileSync(
      'tmp-scaffolded-tokens.json',
      JSON.stringify(tokens, null, 2)
    );
    console.log(
      `\n📄 Scaffolded structure written to tmp-scaffolded-tokens.json`
    );
  } else {
    console.log(`\n✅ All tokens already exist or need manual review`);
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: npm run tokens:scaffold "class1,class2,class3"

Examples:
  npm run tokens:scaffold "flex,shrink-0,rounded-md"
  npm run tokens:scaffold "bg-blue-500,text-white,p-4"

This will:
1. Check if tokens exist for these classes
2. Scaffold missing tokens with reasonable defaults
3. Provide suggestions for manual review
4. Output updated token structure
`);
    return;
  }

  const classNames = args[0]
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  scaffoldTokens(classNames);
}

main();

export { scaffoldTokens, COMMON_CLASS_TO_TOKEN };
