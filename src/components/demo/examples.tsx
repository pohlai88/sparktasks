/**
 * Comprehensive UI Component Showcase - SSOT
 * Single file for previewing all UI components and layout patterns
 * Add new components here for preview and testing purposes
 */

import { useState } from 'react';
import { Plus, Settings, Trash2, Edit3, Keyboard, X, Sparkles } from 'lucide-react';
import {
  AppShell,
  TopNav,
  Sidebar,
  MainContent,
  RightPanel,
  PageHeader,
  SplitPane,
  Container,
  Grid,
  Stack,
  Drawer,
} from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { Dialog } from '@/components/ui/Dialog';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { FieldGroup } from '@/components/ui/FieldGroup';
import { DESIGN_TOKENS } from '@/design/tokens';
import { cn } from '@/utils/cn';

// ===== COMPREHENSIVE UI SHOWCASE =====
// Main showcase component that demonstrates all available UI components
export function ComponentShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Container size="full">
      <div className="p-8 space-y-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Sparkles className="text-blue-600" />
            SparkTasks UI Library
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Comprehensive showcase of all UI components and patterns
          </p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Standard Buttons</h3>
            <div className="flex items-center gap-4 p-4 border rounded-lg flex-wrap">
              <Button onClick={simulateLoading}>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Icon Buttons</h3>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <IconButton icon={Plus} aria-label="Add item" />
              <IconButton icon={Settings} aria-label="Settings" variant="secondary" />
              <IconButton icon={Edit3} aria-label="Edit" variant="ghost" />
              <IconButton icon={Trash2} aria-label="Delete" variant="danger" />
              <IconButton icon={Plus} aria-label="Disabled" disabled />
            </div>
            <p className="text-sm text-slate-500">
              44px touch targets, theme aware, full accessibility
            </p>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Form Elements</h2>
          
          <div className="space-y-4 max-w-md">
            <FieldGroup
              label="Project Name"
              hint="Choose a unique name for your project"
              required
            >
              <Input placeholder="Enter project name..." />
            </FieldGroup>

            <FieldGroup
              label="Description"
              hint="Provide project details"
            >
              <textarea
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description..."
                rows={3}
              />
            </FieldGroup>

            <FieldGroup
              label="Priority"
              hint="Select project priority"
            >
              <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500">
                <option>High Priority</option>
                <option>Medium Priority</option>
                <option>Low Priority</option>
              </select>
            </FieldGroup>
          </div>
        </section>

        {/* Badges & Status */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Badges & Status</h2>
          <div className="flex items-center gap-4 p-4 border rounded-lg flex-wrap">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Cards</h2>
          <Grid cols={3} gap="lg">
            <Card>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Basic Card</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Simple card with basic content
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Action Card</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Card with interactive elements
                </p>
                <Button variant="secondary" size="sm">View Details</Button>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Status Card</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="success">Active</Badge>
                  <Badge variant="info">New</Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Card with status indicators
                </p>
              </div>
            </Card>
          </Grid>
        </section>

        {/* Modals & Dialogs */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Modals & Dialogs</h2>
          <div className="flex gap-4 p-4 border rounded-lg">
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          </div>

          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="Example Dialog"
          >
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                This is a professional dialog with focus trap and keyboard navigation.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setDialogOpen(false)}>
                  Confirm
                </Button>
              </div>
            </div>
          </Dialog>

          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Example Modal"
          >
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                This is a modal with overlay and smooth animations.
              </p>
              <FieldGroup label="Example Input">
                <Input placeholder="Enter some text..." />
              </FieldGroup>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>
                  Save
                </Button>
              </div>
            </div>
          </Modal>
        </section>

        {/* Loading States */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Loading States</h2>
          <div className="space-y-4">
            <Button onClick={simulateLoading} disabled={loading}>
              {loading ? 'Loading...' : 'Simulate Loading'}
            </Button>

            {loading ? (
              <div className="space-y-4">
                <Skeleton.Card />
                <div className="space-y-3">
                  <Skeleton.Text lines={3} />
                  <div className="flex items-center gap-3">
                    <Skeleton.Avatar />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            ) : (
              <Card>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">JD</span>
                    </div>
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-slate-500">2 hours ago</div>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    This is the actual content that appears after loading.
                    The skeleton system provides better perceived performance.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* Layout Patterns */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Layout Patterns</h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Grid System</h3>
            <Grid cols={4} gap="md">
              {[1, 2, 3, 4].map(i => (
                <Card key={i}>
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-slate-400">#{i}</div>
                  </div>
                </Card>
              ))}
            </Grid>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Stack Layout</h3>
            <Stack spacing="md">
              <Card>
                <div className="p-4">Stack Item 1</div>
              </Card>
              <Card>
                <div className="p-4">Stack Item 2</div>
              </Card>
              <Card>
                <div className="p-4">Stack Item 3</div>
              </Card>
            </Stack>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
          <h3 className="font-semibold mb-3">🎯 Component Library Complete</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>UI Components:</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>Buttons (standard & icon)</li>
                <li>Form elements & validation</li>
                <li>Cards & containers</li>
                <li>Modals & dialogs</li>
                <li>Badges & status indicators</li>
                <li>Loading states & skeletons</li>
              </ul>
            </div>
            <div>
              <strong>Layout System:</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>Responsive grid system</li>
                <li>Stack layouts</li>
                <li>Container management</li>
                <li>Professional spacing</li>
                <li>Theme consistency</li>
                <li>Accessibility compliance</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Container>
  );
}

