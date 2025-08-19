/**
 * UI Components Integration Demo
 * Testing ButtonGroup with Button components
 */

import { render, screen } from '@testing-library/react';
import { Button } from '../../src/components/ui/Button';
import { ButtonGroup } from '../../src/components/ui/ButtonGroup';
import { Save, Edit, Trash } from 'lucide-react';

describe('UI Components Integration', () => {
  it('ButtonGroup works seamlessly with Button components', () => {
    render(
      <ButtonGroup variant="secondary" size="lg" aria-label="Document actions">
        <Button icon={<Save size={18} />}>Save</Button>
        <Button icon={<Edit size={18} />}>Edit</Button>
        <Button icon={<Trash size={18} />} variant="destructive">Delete</Button>
      </ButtonGroup>
    );

    const group = screen.getByRole('group', { name: /document actions/i });
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute('data-size', 'lg');

    // Verify buttons inherit group properties but allow overrides
    const saveBtn = screen.getByRole('button', { name: /save/i });
    const editBtn = screen.getByRole('button', { name: /edit/i });
    const deleteBtn = screen.getByRole('button', { name: /delete/i });

    expect(saveBtn).toHaveAttribute('data-variant', 'secondary');
    expect(editBtn).toHaveAttribute('data-variant', 'secondary');
    expect(deleteBtn).toHaveAttribute('data-variant', 'destructive'); // Override

    expect(saveBtn).toHaveAttribute('data-size', 'lg');
    expect(editBtn).toHaveAttribute('data-size', 'lg');
    expect(deleteBtn).toHaveAttribute('data-size', 'lg');
  });

  it('supports complex enterprise UI patterns', () => {
    render(
      <div>
        {/* Toolbar Actions */}
        <ButtonGroup size="sm" attached={true} aria-label="Toolbar">
          <Button icon={<Save size={14} />} aria-label="Save" />
          <Button icon={<Edit size={14} />} aria-label="Edit" />
          <Button icon={<Trash size={14} />} variant="destructive" aria-label="Delete" />
        </ButtonGroup>

        {/* Form Actions */}
        <ButtonGroup fullWidth attached={false} spacing="md" aria-label="Form actions">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Submit</Button>
        </ButtonGroup>

        {/* Vertical Navigation */}
        <ButtonGroup orientation="vertical" variant="ghost" aria-label="Navigation">
          <Button>Dashboard</Button>
          <Button>Analytics</Button>
          <Button>Settings</Button>
        </ButtonGroup>
      </div>
    );

    // Verify all groups are rendered
    expect(screen.getByRole('group', { name: /toolbar/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /form actions/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /navigation/i })).toBeInTheDocument();

    // Verify different configurations
    const toolbarGroup = screen.getByRole('group', { name: /toolbar/i });
    expect(toolbarGroup).toHaveAttribute('data-size', 'sm');
    expect(toolbarGroup).toHaveAttribute('data-attached', 'true');

    const formGroup = screen.getByRole('group', { name: /form actions/i });
    expect(formGroup).toHaveAttribute('data-attached', 'false');
    expect(formGroup).toHaveAttribute('data-spacing', 'md');
    expect(formGroup).toHaveClass('w-full');

    const navGroup = screen.getByRole('group', { name: /navigation/i });
    expect(navGroup).toHaveAttribute('data-orientation', 'vertical');
  });
});
