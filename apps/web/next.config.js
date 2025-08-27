/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@sparktasks/ui'],
  experimental: {
    optimizePackageImports: ['@sparktasks/ui']
  },
  // NUCLEAR BABEL DESTRUCTION - Force SWC only
  swcMinify: true,
  compiler: {
    // Remove any Babel references
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Explicitly disable Babel
  webpack: (config, { dev, isServer }) => {
    // Ensure no Babel loaders are added
    config.module.rules = config.module.rules.filter(rule => {
      if (rule.test && rule.test.toString().includes('js|jsx|ts|tsx')) {
        return !rule.use || !rule.use.some(use =>
          use.loader && use.loader.includes('babel')
        );
      }
      return true;
    });
    return config;
  }
}

module.exports = nextConfig
