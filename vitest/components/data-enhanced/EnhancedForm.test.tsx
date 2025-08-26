/**
 * EnhancedForm Component Tests
 *
 * Tests for the universal form system with React Hook Form + Zod integration
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'

import { EnhancedForm } from '../../../src/components/data-enhanced/EnhancedForm/EnhancedForm'
import type { FormFieldConfig } from '../../../src/components/data-enhanced/types'

// Test schema
const testSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
  role: z.enum(['admin', 'user', 'editor']),
  subscribe: z.boolean(),
  bio: z.string().optional(),
})

type TestFormData = z.infer<typeof testSchema>

const testFields: FormFieldConfig<TestFormData>[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true,
  },
  {
    name: 'age',
    type: 'number',
    label: 'Age',
    placeholder: 'Enter your age',
    required: true,
    min: 18,
    max: 100,
  },
  {
    name: 'role',
    type: 'select',
    label: 'Role',
    required: true,
    options: [
      { label: 'Administrator', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Editor', value: 'editor' },
    ],
  },
  {
    name: 'subscribe',
    type: 'checkbox',
    label: 'Subscribe to newsletter',
    required: false,
  },
  {
    name: 'bio',
    type: 'textarea',
    label: 'Biography',
    placeholder: 'Tell us about yourself',
    required: false,
  },
]

describe('EnhancedForm', () => {
  describe('Basic Rendering', () => {
    it('renders form with all fields', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          onSubmit={vi.fn()}
        />
      )

      // Check if form is rendered
      expect(screen.getByRole('form')).toBeInTheDocument()

      // Check if all fields are rendered
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/age/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/role/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/subscribe to newsletter/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/biography/i)).toBeInTheDocument()

      // Check submit button
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    })

    it('applies default values correctly', () => {
      const defaultValues = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        role: 'user' as const,
        subscribe: true,
      }

      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          defaultValues={defaultValues}
          onSubmit={vi.fn()}
        />
      )

      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('25')).toBeInTheDocument()
      expect(screen.getByDisplayValue('User')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('shows required indicators for required fields', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          onSubmit={vi.fn()}
        />
      )

      // Required fields should have asterisk
      const nameLabel = screen.getByText('Full Name')
      expect(nameLabel).toHaveClass('after:content-[\'*\']')

      const emailLabel = screen.getByText('Email Address')
      expect(emailLabel).toHaveClass('after:content-[\'*\']')
    })
  })

  describe('Layout Variants', () => {
    it('applies vertical layout correctly', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          layout="vertical"
          onSubmit={vi.fn()}
        />
      )

      const form = screen.getByRole('form')
      expect(form).toHaveClass('space-y-6') // vertical layout spacing
    })

    it('applies horizontal layout correctly', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          layout="horizontal"
          onSubmit={vi.fn()}
        />
      )

      const form = screen.getByRole('form')
      expect(form).toHaveClass('space-y-4') // horizontal layout spacing
    })

    it('applies inline layout correctly', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          layout="inline"
          onSubmit={vi.fn()}
        />
      )

      const form = screen.getByRole('form')
      expect(form).toHaveClass('flex', 'flex-wrap', 'gap-4', 'space-y-0') // inline layout
    })
  })

  describe('Density Variants', () => {
    it('applies compact density correctly', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          density="compact"
          onSubmit={vi.fn()}
        />
      )

      const form = screen.getByRole('form')
      expect(form).toHaveClass('space-y-3') // compact spacing
    })

    it('applies spacious density correctly', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          density="spacious"
          onSubmit={vi.fn()}
        />
      )

      const form = screen.getByRole('form')
      expect(form).toHaveClass('space-y-8') // spacious spacing
    })
  })

  describe('Surface Variants', () => {
    it('applies elevated surface correctly', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          surface="elevated"
          onSubmit={vi.fn()}
        />
      )

      const form = screen.getByRole('form')
      expect(form).toHaveClass('bg-surface-elevated1', 'rounded-lg', 'border', 'p-6')
    })

    it('applies glass surface correctly', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          surface="glass"
          onSubmit={vi.fn()}
        />
      )

      const form = screen.getByRole('form')
      expect(form).toHaveClass('bg-glass-surface', 'rounded-lg', 'border', 'p-6')
    })
  })

  describe('Form Validation', () => {
    it('validates required fields on submit', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()

      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          onSubmit={onSubmit}
        />
      )

      // Try to submit without filling required fields
      await user.click(screen.getByRole('button', { name: /submit/i }))

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument()
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })

      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('validates email format', async () => {
      const user = userEvent.setup()

      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          onSubmit={vi.fn()}
        />
      )

      const emailField = screen.getByLabelText(/email address/i)
      await user.type(emailField, 'invalid-email')
      await user.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    it('validates number fields with min/max', async () => {
      const user = userEvent.setup()

      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          onSubmit={vi.fn()}
        />
      )

      const ageField = screen.getByLabelText(/age/i)
      await user.type(ageField, '15') // Below minimum
      await user.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(screen.getByText('Must be at least 18 years old')).toBeInTheDocument()
      })
    })

    it('submits valid form data', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()

      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          onSubmit={onSubmit}
        />
      )

      // Fill out valid form data
      await user.type(screen.getByLabelText(/full name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.type(screen.getByLabelText(/age/i), '25')
      await user.selectOptions(screen.getByLabelText(/role/i), 'user')
      await user.click(screen.getByLabelText(/subscribe to newsletter/i))
      await user.type(screen.getByLabelText(/biography/i), 'Software developer')

      await user.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          age: 25,
          role: 'user',
          subscribe: true,
          bio: 'Software developer',
        })
      })
    })
  })

  describe('Field Types', () => {
    it('renders text input correctly', () => {
      const fields: FormFieldConfig<TestFormData>[] = [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          placeholder: 'Enter name',
        },
      ]

      render(
        <EnhancedForm
          schema={testSchema}
          fields={fields}
          onSubmit={vi.fn()}
        />
      )

      const input = screen.getByLabelText('Name')
      expect(input).toHaveAttribute('type', 'text')
      expect(input).toHaveAttribute('placeholder', 'Enter name')
    })

    it('renders email input correctly', () => {
      const fields: FormFieldConfig<TestFormData>[] = [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
      ]

      render(
        <EnhancedForm
          schema={testSchema}
          fields={fields}
          onSubmit={vi.fn()}
        />
      )

      const input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('renders number input correctly', () => {
      const fields: FormFieldConfig<TestFormData>[] = [
        {
          name: 'age',
          type: 'number',
          label: 'Age',
          min: 18,
          max: 100,
        },
      ]

      render(
        <EnhancedForm
          schema={testSchema}
          fields={fields}
          onSubmit={vi.fn()}
        />
      )

      const input = screen.getByLabelText('Age')
      expect(input).toHaveAttribute('type', 'number')
      expect(input).toHaveAttribute('min', '18')
      expect(input).toHaveAttribute('max', '100')
    })

    it('renders select field correctly', () => {
      const fields: FormFieldConfig<TestFormData>[] = [
        {
          name: 'role',
          type: 'select',
          label: 'Role',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' },
          ],
        },
      ]

      render(
        <EnhancedForm
          schema={testSchema}
          fields={fields}
          onSubmit={vi.fn()}
        />
      )

      const select = screen.getByLabelText('Role')
      expect(select).toBeInTheDocument()
      expect(screen.getByText('Admin')).toBeInTheDocument()
      expect(screen.getByText('User')).toBeInTheDocument()
    })

    it('renders checkbox correctly', () => {
      const fields: FormFieldConfig<TestFormData>[] = [
        {
          name: 'subscribe',
          type: 'checkbox',
          label: 'Subscribe',
        },
      ]

      render(
        <EnhancedForm
          schema={testSchema}
          fields={fields}
          onSubmit={vi.fn()}
        />
      )

      const checkbox = screen.getByLabelText('Subscribe')
      expect(checkbox).toHaveAttribute('type', 'checkbox')
    })

    it('renders textarea correctly', () => {
      const fields: FormFieldConfig<TestFormData>[] = [
        {
          name: 'bio',
          type: 'textarea',
          label: 'Bio',
          placeholder: 'Enter bio',
        },
      ]

      render(
        <EnhancedForm
          schema={testSchema}
          fields={fields}
          onSubmit={vi.fn()}
        />
      )

      const textarea = screen.getByLabelText('Bio')
      expect(textarea.tagName).toBe('TEXTAREA')
      expect(textarea).toHaveAttribute('placeholder', 'Enter bio')
    })
  })

  describe('Form States', () => {
    it('disables form when disabled prop is true', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          disabled={true}
          onSubmit={vi.fn()}
        />
      )

      // All form fields should be disabled
      const nameField = screen.getByLabelText(/full name/i)
      const emailField = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /submit/i })

      expect(nameField).toBeDisabled()
      expect(emailField).toBeDisabled()
      expect(submitButton).toBeDisabled()
    })

    it('shows loading state', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          loading={true}
          onSubmit={vi.fn()}
        />
      )

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent(/loading|submitting/i)
    })

    it('handles readonly mode', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          readOnly={true}
          onSubmit={vi.fn()}
        />
      )

      const nameField = screen.getByLabelText(/full name/i)
      expect(nameField).toHaveAttribute('readonly')
    })
  })

  describe('Custom Actions', () => {
    it('renders custom submit label', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          submitLabel="Save Changes"
          onSubmit={vi.fn()}
        />
      )

      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
    })

    it('renders cancel button when onCancel is provided', () => {
      const onCancel = vi.fn()

      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          onCancel={onCancel}
          cancelLabel="Cancel"
          onSubmit={vi.fn()}
        />
      )

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      expect(cancelButton).toBeInTheDocument()
    })

    it('calls onCancel when cancel button is clicked', async () => {
      const onCancel = vi.fn()
      const user = userEvent.setup()

      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          onCancel={onCancel}
          onSubmit={vi.fn()}
        />
      )

      await user.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onCancel).toHaveBeenCalled()
    })

    it('renders reset button when showReset is true', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          showReset={true}
          onSubmit={vi.fn()}
        />
      )

      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper form accessibility attributes', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          onSubmit={vi.fn()}
        />
      )

      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
    })

    it('associates labels with form controls', () => {
      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          onSubmit={vi.fn()}
        />
      )

      const nameField = screen.getByLabelText(/full name/i)
      const emailField = screen.getByLabelText(/email address/i)

      expect(nameField).toBeInTheDocument()
      expect(emailField).toBeInTheDocument()
    })

    it('provides error announcements for screen readers', async () => {
      const user = userEvent.setup()

      render(
        <EnhancedForm
          schema={testSchema}
          fields={testFields}
          onSubmit={vi.fn()}
        />
      )

      await user.click(screen.getByRole('button', { name: /submit/i }))

      await waitFor(() => {
        const errorMessage = screen.getByText('Name must be at least 2 characters')
        expect(errorMessage).toHaveAttribute('role', 'alert')
      })
    })
  })
})
