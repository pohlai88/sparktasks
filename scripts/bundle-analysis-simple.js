/**
 * Simple Bundle Analysis - Container Optimization
 *
 * Analyzes the built bundle files to verify container optimization
 */

const fs = require('fs');
const path = require('path');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundleFiles() {
  const distPath = path.resolve(process.cwd(), 'dist');

  if (!fs.existsSync(distPath)) {
    console.error('❌ dist folder not found. Run "npm run build" first.');
    process.exit(1);
  }

  console.log('🚀 Analyzing bundle files...\n');

  // Find all JS files (excluding maps)
  const files = [];

  function scanDirectory(dirPath, relativePath = '') {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        scanDirectory(fullPath, path.join(relativePath, item));
      } else if (item.endsWith('.js') && !item.endsWith('.map')) {
        const folder = path.basename(path.dirname(fullPath));
        files.push({
          name: item,
          folder,
          size: stats.size,
          path: path.join(relativePath, item),
        });
      }
    }
  }

  scanDirectory(distPath);

  // Sort by size (largest first)
  files.sort((a, b) => b.size - a.size);

  // Calculate totals
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  // Display results
  console.log('📊 Bundle Analysis Results:');
  console.log(`Total JS Bundle Size: ${formatBytes(totalSize)}\n`);

  console.log('📦 Chunk Breakdown:');
  files.forEach(file => {
    const sizeFormatted = formatBytes(file.size);
    const folder = file.folder === 'dist' ? 'assets' : file.folder;
    console.log(`  ${folder}/${file.name}: ${sizeFormatted}`);
  });

  // Container optimization analysis
  console.log('\n🎯 Container Optimization Analysis:');

  const containerChunk = files.find(f => f.folder === 'containers');
  if (containerChunk) {
    console.log(
      `✅ Container Chunk Found: ${formatBytes(containerChunk.size)}`
    );
    console.log(`   File: ${containerChunk.folder}/${containerChunk.name}`);
  } else {
    console.log('❌ No dedicated container chunk found');
  }

  const radixChunks = files.filter(f => f.folder === 'primitives');
  console.log(`✅ Radix Primitive Chunks: ${radixChunks.length}`);
  radixChunks.forEach(chunk => {
    console.log(`   ${chunk.name}: ${formatBytes(chunk.size)}`);
  });

  const componentChunks = files.filter(f => f.folder === 'components');
  console.log(`✅ Component Chunks: ${componentChunks.length}`);
  componentChunks.forEach(chunk => {
    console.log(`   ${chunk.name}: ${formatBytes(chunk.size)}`);
  });

  const vendorChunk = files.find(f => f.name.includes('react-vendor'));
  if (vendorChunk) {
    console.log(`✅ React Vendor Chunk: ${formatBytes(vendorChunk.size)}`);
  }

  // Performance assessment
  console.log('\n🚀 Performance Assessment:');
  if (totalSize < 1024 * 1024) {
    // Less than 1MB
    console.log('✅ Excellent: Total bundle size under 1MB');
  } else if (totalSize < 2 * 1024 * 1024) {
    // Less than 2MB
    console.log('⚠️ Good: Total bundle size under 2MB');
  } else {
    console.log('❌ Large: Consider further optimization');
  }

  if (containerChunk && containerChunk.size < 50 * 1024) {
    // Less than 50KB
    console.log('✅ Excellent: Container chunk is optimally sized');
  }

  if (radixChunks.length >= 3) {
    console.log('✅ Excellent: Radix primitives properly chunked');
  }

  console.log('\n🎉 Container bundle optimization analysis complete!');
}

// Run analysis
analyzeBundleFiles();
