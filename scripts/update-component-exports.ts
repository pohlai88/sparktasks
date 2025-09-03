#!/usr/bin/env tsx

/**
 * Auto-generate barrel exports for component directories
 * Maintains alphabetical order and clean formatting
 */

import { readdir, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function updateComponentExports(componentDir: string): void {
  if (!existsSync(componentDir)) {
    console.error(`Directory not found: ${componentDir}`);
    return;
  }

  // Get all .tsx files except index.tsx
  readdir(componentDir, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`);
      return;
    }

    const components = files
      .filter(file => file.endsWith('.tsx') && file !== 'index.tsx')
      .map(file => basename(file, '.tsx'))
      .sort(); // Alphabetical order

    if (components.length === 0) {
      console.log(`No component files found in ${componentDir}`);
      return;
    }

    // Generate export statements
    const exports = components
      .map(
        component => `export { default as ${component} } from './${component}';`
      )
      .join('\n');

    const indexPath = join(componentDir, 'index.tsx');

    // Write the new index file
    writeFileSync(indexPath, exports + '\n', 'utf8');

    console.log(`✅ Updated ${indexPath} with ${components.length} exports:`);
    for (const file of components) {
      console.log(`   - ${file}`);
    }
  });
}

// Main execution
const componentsDir = resolve(__dirname, '../src/components/ui-enhanced');
updateComponentExports(componentsDir);

// You can add more directories here if needed
// updateComponentExports(resolve(__dirname, '../src/components/features-enhanced'));
