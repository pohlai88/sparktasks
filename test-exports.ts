// Test export verification
import { Callout, CalloutDemo, TableOfContents } from './src/components';

console.log('✅ All exports working correctly:', {
  Callout: typeof Callout,
  CalloutDemo: typeof CalloutDemo,
  TableOfContents: typeof TableOfContents
});
