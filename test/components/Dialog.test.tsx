import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Dialog, {
  ConfirmDialog,
  DangerDialog,
  AlertDialog,
} from '../../src/components/ui/Dialog';

describe('Dialog Component', () => {
  describe('Basic Functionality', () => {
    it('renders without errors when closed', () => {
      render(<Dialog open={false} onClose={vi.fn()} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders dialog when open', () => {
      render(<Dialog open={true} onClose={vi.fn()} title='Test Dialog' />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(<Dialog open={true} onClose={onClose} title='Test Dialog' />);

      const closeButton = screen.getByLabelText('Close dialog');
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when escape key is pressed', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(<Dialog open={true} onClose={onClose} title='Test Dialog' />);

      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalled();
    });

    it('renders with title and description', () => {
      render(
        <Dialog
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

  describe('Variants', () => {
    it('renders default variant', () => {
      render(
        <Dialog
          open={true}
          onClose={vi.fn()}
          variant='default'
          title='Default Dialog'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Default Dialog')).toBeInTheDocument();
    });

    it('renders danger variant', () => {
      render(
        <Dialog
          open={true}
          onClose={vi.fn()}
          variant='danger'
          title='Danger Dialog'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Danger Dialog')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('renders small size', () => {
      render(
        <Dialog open={true} onClose={vi.fn()} size='sm' title='Small Dialog' />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Small Dialog')).toBeInTheDocument();
    });

    it('renders large size', () => {
      render(
        <Dialog open={true} onClose={vi.fn()} size='lg' title='Large Dialog' />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Large Dialog')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('renders action buttons', () => {
      render(
        <Dialog
          open={true}
          onClose={vi.fn()}
          title='Dialog with actions'
          actions={[
            { label: 'Cancel', onClick: vi.fn() },
            { label: 'Confirm', onClick: vi.fn(), variant: 'primary' },
          ]}
        />
      );

      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Confirm' })
      ).toBeInTheDocument();
    });

    it('calls action handlers when clicked', async () => {
      const user = userEvent.setup();
      const handleCancel = vi.fn();
      const handleConfirm = vi.fn();

      render(
        <Dialog
          open={true}
          onClose={vi.fn()}
          title='Dialog with actions'
          actions={[
            { label: 'Cancel', onClick: handleCancel },
            { label: 'Confirm', onClick: handleConfirm },
          ]}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(handleCancel).toHaveBeenCalledTimes(1);

      await user.click(screen.getByRole('button', { name: 'Confirm' }));
      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <Dialog
          open={true}
          onClose={vi.fn()}
          title='Accessible Dialog'
          description='This dialog is accessible'
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'dialog-description');
    });

    it('supports custom ARIA labels', () => {
      render(
        <Dialog
          open={true}
          onClose={vi.fn()}
          aria-label='Custom dialog label'
          aria-labelledby='custom-title'
          aria-describedby='custom-description'
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Custom dialog label');
      expect(dialog).toHaveAttribute('aria-labelledby', 'custom-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'custom-description');
    });
  });

  describe('Compound Components', () => {
    it('renders ConfirmDialog', () => {
      render(
        <ConfirmDialog
          open={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title='Confirm Action'
          message='Are you sure?'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cancel' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Confirm' })
      ).toBeInTheDocument();
    });

    it('renders DangerDialog', () => {
      render(
        <DangerDialog
          open={true}
          onClose={vi.fn()}
          onConfirm={vi.fn()}
          title='Delete Item'
          message='This action cannot be undone.'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(
        screen.getByText('This action cannot be undone.')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Delete' })
      ).toBeInTheDocument();
    });

    it('renders AlertDialog', () => {
      render(
        <AlertDialog
          open={true}
          onClose={vi.fn()}
          title='Information'
          message='Operation completed successfully.'
          alertVariant='success'
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Information')).toBeInTheDocument();
      expect(
        screen.getByText('Operation completed successfully.')
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });
  });

  describe('Custom Content', () => {
    it('renders custom children', () => {
      render(
        <Dialog open={true} onClose={vi.fn()} title='Custom Content'>
          <div data-testid='custom-content'>Custom dialog content</div>
        </Dialog>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom dialog content')).toBeInTheDocument();
    });
  });
});
