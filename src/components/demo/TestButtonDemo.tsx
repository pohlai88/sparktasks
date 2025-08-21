import { TestButton } from '@/components/ui/TestButton';

export function TestButtonDemo() {
  return (
    <div className='space-y-4 p-4'>
      <h2 className='text-2xl font-bold'>TestButton Demo</h2>

      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Variants</h3>
        <div className='flex gap-4'>
          <TestButton variant='primary'>Primary</TestButton>
          <TestButton variant='secondary'>Secondary</TestButton>
          <TestButton variant='ghost'>Ghost</TestButton>
        </div>
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Sizes</h3>
        <div className='flex items-center gap-4'>
          <TestButton size='sm'>Small</TestButton>
          <TestButton size='md'>Medium</TestButton>
          <TestButton size='lg'>Large</TestButton>
        </div>
      </div>

      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>States</h3>
        <div className='flex gap-4'>
          <TestButton>Default</TestButton>
          <TestButton disabled>Disabled</TestButton>
        </div>
      </div>
    </div>
  );
}
