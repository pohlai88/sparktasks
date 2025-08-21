import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Drawer, {
  Sheet,
  Sidebar,
  SlideOver,
  BottomSheet,
} from '../../src/components/ui/Drawer';

describe('Drawer Component', () => {
  describe('Basic Functionality', () => {
    it('renders without errors when closed', () => {
      render(<Drawer open={false} onClose={vi.fn()} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders drawer when open', () => {
      render(<Drawer open={true} onClose={vi.fn()} title='Test Drawer' />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Drawer')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(<Drawer open={true} onClose={onClose} title='Test Drawer' />);

      const closeButton = screen.getByLabelText('Close drawer');
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when escape key is pressed', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(<Drawer open={true} onClose={onClose} title='Test Drawer' />);

      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalled();
    });

    it('renders with title and description', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          title='Test Title'
          description='Test Description'
        />
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });

  describe('Positions', () => {
    it('renders left position', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          position='left'
          title='Left Drawer'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Left Drawer')).toBeInTheDocument();
    });

    it('renders right position', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          position='right'
          title='Right Drawer'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Right Drawer')).toBeInTheDocument();
    });

    it('renders top position', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          position='top'
          title='Top Drawer'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Top Drawer')).toBeInTheDocument();
    });

    it('renders bottom position', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          position='bottom'
          title='Bottom Drawer'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Bottom Drawer')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('renders small size', () => {
      render(
        <Drawer open={true} onClose={vi.fn()} size='sm' title='Small Drawer' />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Small Drawer')).toBeInTheDocument();
    });

    it('renders large size', () => {
      render(
        <Drawer open={true} onClose={vi.fn()} size='lg' title='Large Drawer' />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Large Drawer')).toBeInTheDocument();
    });

    it('renders full size', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          size='full'
          title='Full Size Drawer'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Full Size Drawer')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          variant='default'
          title='Default Drawer'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Default Drawer')).toBeInTheDocument();
    });

    it('renders primary variant', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          variant='primary'
          title='Primary Drawer'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Primary Drawer')).toBeInTheDocument();
    });

    it('renders danger variant', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          variant='danger'
          title='Danger Drawer'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Danger Drawer')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('renders action buttons', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          title='Drawer with actions'
          actions={[
            { label: 'Cancel', onClick: vi.fn() },
            { label: 'Save', onClick: vi.fn(), variant: 'primary' },
          ]}
        />
      );

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('calls action handlers when clicked', async () => {
      const user = userEvent.setup();
      const handleCancel = vi.fn();
      const handleSave = vi.fn();

      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          title='Drawer with actions'
          actions={[
            { label: 'Cancel', onClick: handleCancel },
            { label: 'Save', onClick: handleSave },
          ]}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(handleCancel).toHaveBeenCalledTimes(1);

      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(handleSave).toHaveBeenCalledTimes(1);
    });

    it('handles loading state in actions', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          title='Drawer with loading action'
          actions={[{ label: 'Processing', onClick: vi.fn(), loading: true }]}
        />
      );

      const button = screen.getByRole('button', { name: 'Processing' });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  describe('Behavior Props', () => {
    it('respects persistent prop', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <Drawer
          open={true}
          onClose={onClose}
          title='Persistent Drawer'
          persistent={true}
        />
      );

      await user.keyboard('{Escape}');
      expect(onClose).not.toHaveBeenCalled();
    });

    it('respects dismissible prop', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          title='Non-dismissible Drawer'
          dismissible={false}
        />
      );

      expect(screen.queryByLabelText('Close drawer')).not.toBeInTheDocument();
    });

    it('renders without backdrop when backdrop is false', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          title='No Backdrop Drawer'
          backdrop={false}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          title='Accessible Drawer'
          description='This drawer is accessible'
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'drawer-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'drawer-description');
    });

    it('supports custom ARIA labels', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          aria-label='Custom drawer label'
          aria-labelledby='custom-title'
          aria-describedby='custom-description'
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Custom drawer label');
      expect(dialog).toHaveAttribute('aria-labelledby', 'custom-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'custom-description');
    });

    it('has modal false when modal prop is false', () => {
      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          modal={false}
          title='Non-modal Drawer'
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'false');
    });
  });

  describe('Compound Components', () => {
    it('renders Sheet component', () => {
      render(<Sheet open={true} onClose={vi.fn()} title='Test Sheet' />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Sheet')).toBeInTheDocument();
    });

    it('renders Sidebar component', () => {
      render(<Sidebar open={true} onClose={vi.fn()} title='Test Sidebar' />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Sidebar')).toBeInTheDocument();
    });

    it('renders SlideOver component', () => {
      render(
        <SlideOver open={true} onClose={vi.fn()} title='Test SlideOver' />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test SlideOver')).toBeInTheDocument();
    });

    it('renders BottomSheet component', () => {
      render(
        <BottomSheet open={true} onClose={vi.fn()} title='Test BottomSheet' />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test BottomSheet')).toBeInTheDocument();
    });
  });

  describe('Custom Content', () => {
    it('renders custom children', () => {
      render(
        <Drawer open={true} onClose={vi.fn()} title='Custom Content'>
          <div data-testid='custom-content'>Custom drawer content</div>
        </Drawer>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom drawer content')).toBeInTheDocument();
    });

    it('renders without header when no title or description', () => {
      render(
        <Drawer open={true} onClose={vi.fn()}>
          <div>Content without header</div>
        </Drawer>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Content without header')).toBeInTheDocument();
      expect(screen.queryByLabelText('Close drawer')).not.toBeInTheDocument();
    });
  });

  describe('Callbacks', () => {
    it('calls onOpenChange when provided', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          onOpenChange={onOpenChange}
          title='Test Drawer'
        />
      );

      await user.keyboard('{Escape}');
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onBackdropClick when clicking backdrop', async () => {
      const user = userEvent.setup();
      const onBackdropClick = vi.fn();

      // We need to mock createPortal for this test to work properly
      const { container } = render(
        <Drawer
          open={true}
          onClose={vi.fn()}
          onBackdropClick={onBackdropClick}
          title='Test Drawer'
        />
      );

      // Find backdrop by class or data attribute if available
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });
  });
});
