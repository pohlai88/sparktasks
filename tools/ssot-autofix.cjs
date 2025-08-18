#!/usr/bin/env node

/**
 * SSOT Auto-Fixer - Direct file manipulation approach
 * Replaces hardcoded Tailwind classes with design tokens
 */

const fs = require('fs');
const path = require('path');
const MAP = require('./ssot-map.cjs');

// File patterns to process
const SRC_DIR = path.join(__dirname, '..', 'src');
const FILE_EXTENSIONS = /\.(tsx?|jsx?)$/;

/**
 * Get all source files recursively
 */
function getAllFiles(dir, result = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllFiles(fullPath, result);
    } else if (FILE_EXTENSIONS.test(file)) {
      result.push(fullPath);
    }
  }
  
  return result;
}

/**
 * Apply SSOT replacements to a file content
 */
function applySSOTReplacements(content, filePath) {
  let modified = content;
  let changeCount = 0;
  
  // Track className attribute patterns
  const classNameRegex = /className=["']([^"']+)["']/g;
  const templateLiteralRegex = /className=\{`([^`]+)`\}/g;
  const cnCallRegex = /className=\{cn\(([^)]+)\)\}/g;
  
  // Process regular className attributes
  modified = modified.replace(classNameRegex, (match, classes) => {
    let newClasses = classes;
    let hasChanges = false;
    
    // Check for exact multi-class patterns first (highest priority)
    const exactMatches = Object.keys(MAP).filter(pattern => 
      pattern.includes(' ') && classes.trim() === pattern.trim()
    );
    
    for (const pattern of exactMatches) {
      if (MAP[pattern] && MAP[pattern] !== null) {
        return `className={\`\${${MAP[pattern]}}\`}`;
      }
    }
    
    // Check for partial multi-class patterns
    const multiPatterns = Object.keys(MAP).filter(pattern => 
      pattern.includes(' ') && classes.includes(pattern)
    ).sort((a, b) => b.length - a.length); // Sort by length (longest first)
    
    for (const pattern of multiPatterns) {
      if (MAP[pattern] && MAP[pattern] !== null) {
        newClasses = newClasses.replace(pattern, `\${${MAP[pattern]}}`);
        hasChanges = true;
        changeCount++;
        break; // Only apply one pattern per className
      }
    }
    
    // If no multi-pattern matched, check individual classes
    if (!hasChanges) {
      const classList = newClasses.split(/\s+/);
      for (const cls of classList) {
        if (MAP[cls] && MAP[cls] !== null) {
          newClasses = newClasses.replace(new RegExp(`\\b${cls}\\b`, 'g'), `\${${MAP[cls]}}`);
          hasChanges = true;
          changeCount++;
          break; // Only fix one class per className to avoid conflicts
        }
      }
    }
    
    // Convert to template literal if we made changes
    if (hasChanges) {
      return `className={\`${newClasses}\`}`;
    }
    
    return match;
  });
  
  // Process existing template literals
  modified = modified.replace(templateLiteralRegex, (match, classes) => {
    let newClasses = classes;
    let hasChanges = false;
    
    // Check individual classes in template literals
    const classList = classes.split(/\s+/);
    for (const cls of classList) {
      // Skip if it's already a token reference
      if (cls.includes('${')) continue;
      
      if (MAP[cls] && MAP[cls] !== null) {
        newClasses = newClasses.replace(new RegExp(`\\b${cls}\\b`, 'g'), `\${${MAP[cls]}}`);
        hasChanges = true;
        changeCount++;
        break; // Only fix one class per template literal
      }
    }
    
    if (hasChanges) {
      return `className={\`${newClasses}\`}`;
    }
    
    return match;
  });
  
  // Fix malformed template literals like ${flex-1} to ${'flex-1'} or proper tokens
  modified = modified.replace(/\$\{([^}]+)\}/g, (match, content) => {
    // If it looks like a CSS class (contains hyphens, no dots), wrap in quotes
    if (content.includes('-') && !content.includes('.') && !content.includes('DESIGN_TOKENS')) {
      // Check if we have a mapping for this class
      if (MAP[content] && MAP[content] !== null) {
        changeCount++;
        return `\${${MAP[content]}}`;
      }
      // For fundamental utilities, wrap in quotes to fix syntax
      if (['flex-1', 'min-w-0', 'sticky', 'fixed', 'absolute'].includes(content)) {
        return `\${'${content}'}`;
      }
      return `\${'${content}'}`;
    }
    return match;
  });
  
  // Fix specific template literal patterns in cn() calls
  modified = modified.replace(/(cn\([^)]*)'([^']*\$\{[^}]+\}[^']*)'/g, (match, prefix, content) => {
    // If the content has malformed template literals, try to fix them
    let fixed = content.replace(/\$\{([^}]+)\}/g, (tmplMatch, tmplContent) => {
      if (MAP[tmplContent] && MAP[tmplContent] !== null) {
        changeCount++;
        return `\${${MAP[tmplContent]}}`;
      }
      if (tmplContent.includes('-') && !tmplContent.includes('.')) {
        return `\${'${tmplContent}'}`;
      }
      return tmplMatch;
    });
    
    return `${prefix}'${fixed}'`;
  });
  
  // Fix cn() calls with malformed syntax
  modified = modified.replace(cnCallRegex, (match, args) => {
    let newArgs = args;
    let hasChanges = false;
    
    // Look for standalone classes in cn() that should be tokens
    const parts = args.split(',').map(part => part.trim());
    const newParts = parts.map(part => {
      // Remove quotes to check the content
      const cleanPart = part.replace(/^['"`]|['"`]$/g, '');
      
      if (MAP[cleanPart] && MAP[cleanPart] !== null) {
        hasChanges = true;
        changeCount++;
        return MAP[cleanPart];
      }
      return part;
    });
    
    if (hasChanges) {
      return `className={cn(${newParts.join(', ')})}`;
    }
    
    return match;
  });
  
  return { content: modified, changeCount };
}

/**
 * Process all files
 */
function processFiles() {
  const files = getAllFiles(SRC_DIR);
  let totalChanges = 0;
  let filesModified = 0;
  
  console.log(`🔍 Processing ${files.length} files...`);
  
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const result = applySSOTReplacements(content, filePath);
      
      if (result.changeCount > 0) {
        fs.writeFileSync(filePath, result.content, 'utf8');
        filesModified++;
        totalChanges += result.changeCount;
        
        const relativePath = path.relative(process.cwd(), filePath);
        console.log(`✅ ${relativePath}: ${result.changeCount} replacements`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
  
  console.log(`\n🎉 SSOT Auto-Fix Complete!`);
  console.log(`📁 Files modified: ${filesModified}`);
  console.log(`🔄 Total replacements: ${totalChanges}`);
  
  if (totalChanges > 0) {
    console.log(`\n💡 Next steps:`);
    console.log(`   1. npm run validate:ssot  # Check remaining violations`);
    console.log(`   2. npm run lint:fix       # Fix any formatting issues`);
    console.log(`   3. npm test               # Verify functionality`);
  }
}

// Run the processor
if (require.main === module) {
  processFiles();
}

module.exports = { applySSOTReplacements, getAllFiles };
