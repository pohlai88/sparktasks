#!/usr/bin/env tsx
/**
 * Bundle Analysis Script - Container Optimization
 *
 * Analyzes bundle size, chunk splitting, and container optimization
 * for the SparkTasks component library.
 *
 * Features:
 * - Bundle size analysis with detailed component breakdown
 * - Container component optimization detection
 * - Tree-shaking validation
 * - Radix UI primitive usage analysis
 * - Performance recommendations
 */

import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { execSync } from 'node:child_process'

interface BundleAnalysis {
  totalSize: number
  gzippedSize: number
  chunks: Array<{
    name: string
    size: number
    modules: string[]
  }>
  components: Array<{
    name: string
    size: number
    dependencies: string[]
    isContainer: boolean
  }>
  radixPrimitives: Array<{
    primitive: string
    usage: number
    components: string[]
  }>
  recommendations: string[]
}

async function analyzeBundleSize(): Promise<BundleAnalysis> {
  console.log('🔍 Building production bundle for analysis...')
  
  try {
    // Build production bundle
    execSync('npm run build', { stdio: 'inherit' })
    
    // Read build manifest or analyze dist folder
    const distPath = path.resolve(process.cwd(), 'dist')
    const buildFiles = await fs.readdir(distPath, { recursive: true })
    
    // Analyze JavaScript bundles
    const jsBundles = buildFiles.filter(file => 
      typeof file === 'string' && file.endsWith('.js') && !file.includes('.map')
    )
    
    console.log(`📦 Found ${jsBundles.length} JavaScript bundles`)
    
    const analysis: BundleAnalysis = {
      totalSize: 0,
      gzippedSize: 0,
      chunks: [],
      components: [],
      radixPrimitives: [],
      recommendations: []
    }
    
    // Analyze each bundle
    for (const bundle of jsBundles) {
      const bundlePath = path.join(distPath, bundle as string)
      const stats = await fs.stat(bundlePath)
      const content = await fs.readFile(bundlePath, 'utf-8')
      
      analysis.totalSize += stats.size
      
      // Extract module information
      const modules = extractModulesFromBundle(content)
      
      analysis.chunks.push({
        name: bundle as string,
        size: stats.size,
        modules
      })
    }
    
    // Analyze component usage
    analysis.components = await analyzeComponentUsage()
    
    // Analyze Radix primitive usage
    analysis.radixPrimitives = await analyzeRadixUsage()
    
    // Generate recommendations
    analysis.recommendations = generateRecommendations(analysis)
    
    return analysis
    
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error)
    throw error
  }
}

function extractModulesFromBundle(content: string): string[] {
  // Extract module references from the bundle
  const moduleRegex = /["'](@\/|@radix-ui\/|react|lucide-react)[^"']*["']/g
  const matches = content.match(moduleRegex) || []
  return Array.from(new Set(matches.map(m => m.slice(1, -1))))
}

async function analyzeComponentUsage(): Promise<Array<{
  name: string
  size: number
  dependencies: string[]
  isContainer: boolean
}>> {
  const componentsPath = path.resolve(process.cwd(), 'src/components/ui-enhanced')
  const componentFiles = await fs.readdir(componentsPath)
  
  const components: Array<{
    name: string
    size: number
    dependencies: string[]
    isContainer: boolean
  }> = []
  
  for (const file of componentFiles) {
    if (!file.endsWith('.tsx')) continue
    
    const filePath = path.join(componentsPath, file)
    const content = await fs.readFile(filePath, 'utf-8')
    const stats = await fs.stat(filePath)
    
    // Extract dependencies
    const importRegex = /import.*?from\s+["']([^"']+)["']/g
    const dependencies: string[] = []
    let match
    while ((match = importRegex.exec(content)) !== null) {
      if (match[1]) {
        dependencies.push(match[1])
      }
    }
    
    // Check if it's a container component
    const isContainer = content.includes('container') || 
                       content.includes('Container') ||
                       file.toLowerCase().includes('container')
    
    components.push({
      name: file.replace('.tsx', ''),
      size: stats.size,
      dependencies,
      isContainer
    })
  }
  
  return components
}

async function analyzeRadixUsage(): Promise<Array<{
  primitive: string
  usage: number
  components: string[]
}>> {
  const componentsPath = path.resolve(process.cwd(), 'src/components/ui-enhanced')
  const componentFiles = await fs.readdir(componentsPath)
  
  const radixUsage = new Map<string, string[]>()
  
  for (const file of componentFiles) {
    if (!file.endsWith('.tsx')) continue
    
    const filePath = path.join(componentsPath, file)
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Find Radix imports
    const radixImportRegex = /import.*?from\s+["'](@radix-ui\/[^"']+)["']/g
    let match
    while ((match = radixImportRegex.exec(content)) !== null) {
      const primitive = match[1]
      if (primitive) {
        if (!radixUsage.has(primitive)) {
          radixUsage.set(primitive, [])
        }
        radixUsage.get(primitive)!.push(file.replace('.tsx', ''))
      }
    }
  }
  
  return Array.from(radixUsage.entries()).map(([primitive, components]) => ({
    primitive,
    usage: components.length,
    components
  }))
}

function generateRecommendations(analysis: BundleAnalysis): string[] {
  const recommendations: string[] = []
  
  // Bundle size recommendations
  if (analysis.totalSize > 500_000) { // 500KB
    recommendations.push('⚠️ Bundle size is large (>500KB). Consider code splitting.')
  }
  
  // Container optimization
  const containerComponents = analysis.components.filter(c => c.isContainer)
  if (containerComponents.length > 0) {
    recommendations.push(`📦 Found ${containerComponents.length} container components that could benefit from lazy loading.`)
  }
  
  // Radix optimization
  const radixCount = analysis.radixPrimitives.length
  if (radixCount > 10) {
    recommendations.push(`🎯 High Radix usage (${radixCount} primitives). Ensure tree-shaking is working properly.`)
  }
  
  // Component size analysis
  const largeComponents = analysis.components.filter(c => c.size > 10_000) // 10KB
  if (largeComponents.length > 0) {
    recommendations.push(`📏 Large components detected: ${largeComponents.map(c => c.name).join(', ')}`)
  }
  
  return recommendations
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

async function generateReport(analysis: BundleAnalysis): Promise<void> {
  const report = `# Bundle Analysis Report

**Generated**: ${new Date().toISOString()}
**Total Bundle Size**: ${formatBytes(analysis.totalSize)}

## 📊 Bundle Chunks

${analysis.chunks.map(chunk => `
### ${chunk.name}
- **Size**: ${formatBytes(chunk.size)}
- **Modules**: ${chunk.modules.length}

**Key Modules**:
${chunk.modules.slice(0, 10).map(mod => `- ${mod}`).join('\n')}
${chunk.modules.length > 10 ? `... and ${chunk.modules.length - 10} more` : ''}
`).join('\n')}

## 🧩 Component Analysis

### Container Components
${analysis.components
  .filter(c => c.isContainer)
  .map(c => `- **${c.name}**: ${formatBytes(c.size)} (${c.dependencies.length} deps)`)
  .join('\n') || 'No container components detected'}

### Largest Components
${analysis.components
  .sort((a, b) => b.size - a.size)
  .slice(0, 10)
  .map(c => `- **${c.name}**: ${formatBytes(c.size)}`)
  .join('\n')}

## 🎯 Radix Primitive Usage

${analysis.radixPrimitives
  .sort((a, b) => b.usage - a.usage)
  .map(p => `- **${p.primitive}**: Used in ${p.usage} components (${p.components.join(', ')})`)
  .join('\n')}

## 🚀 Optimization Recommendations

${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

## 🔧 Optimization Strategies

### Immediate Actions
1. **Code Splitting**: Split large components into separate chunks
2. **Tree Shaking**: Ensure unused Radix primitives are eliminated
3. **Container Lazy Loading**: Implement dynamic imports for container components
4. **Bundle Analysis**: Regular monitoring with this script

### Advanced Optimizations
1. **Micro Bundles**: Split components by usage frequency
2. **Preloading**: Strategic preloading of critical container components
3. **Runtime Optimization**: Dynamic component loading based on viewport
4. **CDN Strategy**: Host Radix primitives via CDN for better caching

---

*Generated by SparkTasks Bundle Analyzer v1.0*
`

  await fs.writeFile('bundle-analysis-report.md', report)
  console.log('📄 Report saved to bundle-analysis-report.md')
}

async function main() {
  try {
    console.log('🚀 Starting bundle analysis...')
    
    const analysis = await analyzeBundleSize()
    
    console.log('\n📊 Analysis Results:')
    console.log(`Total Size: ${formatBytes(analysis.totalSize)}`)
    console.log(`Chunks: ${analysis.chunks.length}`)
    console.log(`Components: ${analysis.components.length}`)
    console.log(`Container Components: ${analysis.components.filter(c => c.isContainer).length}`)
    console.log(`Radix Primitives: ${analysis.radixPrimitives.length}`)
    
    if (analysis.recommendations.length > 0) {
      console.log('\n⚠️ Recommendations:')
      analysis.recommendations.forEach(rec => console.log(`  ${rec}`))
    }
    
    await generateReport(analysis)
    
    console.log('\n✅ Bundle analysis complete!')
    
  } catch (error) {
    console.error('❌ Analysis failed:', error)
    process.exit(1)
  }
}

// Run the main function if this file is executed directly
if (typeof process !== 'undefined' && process.argv && process.argv.length > 1) {
  const scriptPath = process.argv[1]
  const currentFile = __filename || ''
  if (scriptPath && currentFile && path.resolve(scriptPath) === path.resolve(currentFile)) {
    main()
  }
}

export { analyzeBundleSize, type BundleAnalysis }
