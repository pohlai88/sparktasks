/**
 * Layout Examples for AI-BOS SlackTasks
 * Demonstrates best practices using our layout system
 */

import { useState } from 'react';
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
  Drawer 
} from './index';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { DESIGN_TOKENS } from '../../design/tokens';
import { cn } from '../../utils/cn';

// Dashboard Layout - Three-column layout with navigation
export function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <AppShell>
      <TopNav 
        logo={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
              AI
            </div>
            <span className={cn('font-semibold', DESIGN_TOKENS.colors.ui.text.primary)}>SlackTasks</span>
          </div>
        }
        search={
          <Input 
            placeholder="Search tasks..." 
            className="w-full"
          />
        }
        actions={
          <>
            <Button variant="secondary" size="sm">
              Notifications
            </Button>
            <Button size="sm">
              Create Task
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={DESIGN_TOKENS.layout.responsive.mobileNav}
              onClick={() => setMobileNavOpen(true)}
            >
              Menu
            </Button>
          </>
        }
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar>
          <Stack spacing="sm">
            <Button variant="ghost" className="w-full justify-start">
              📋 All Tasks
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              🚀 Active Sprint
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              ⏰ Due Today
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              ✅ Completed
            </Button>
          </Stack>
        </Sidebar>

        <MainContent 
          header={
            <PageHeader
              title="Dashboard"
              description="Overview of your AI-BOS tasks and projects"
              actions={
                <Button>Create Task</Button>
              }
            />
          }
        >
          <Grid cols={3} gap="lg">
            <Card className="p-6">
              <h3 className="font-medium mb-2">Active Tasks</h3>
              <div className="text-2xl font-bold text-blue-600">12</div>
            </Card>
            <Card className="p-6">
              <h3 className="font-medium mb-2">Due Today</h3>
              <div className="text-2xl font-bold text-amber-600">3</div>
            </Card>
            <Card className="p-6">
              <h3 className="font-medium mb-2">Completed</h3>
              <div className="text-2xl font-bold text-green-600">28</div>
            </Card>
          </Grid>

          <Card>
            <div className="p-6 border-b">
              <h3 className="font-medium">Recent Tasks</h3>
            </div>
            <div className="p-6">
              <Stack spacing="sm">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={DESIGN_TOKENS.layout.patterns.spaceBetween}>
                    <div>
                      <div className="font-medium">Task {i}</div>
                      <div className={cn('text-sm', DESIGN_TOKENS.colors.ui.text.secondary)}>Due tomorrow</div>
                    </div>
                    <Button size="sm" variant="secondary">View</Button>
                  </div>
                ))}
              </Stack>
            </div>
          </Card>
        </MainContent>

        <RightPanel title="Activity">
          <Stack spacing="sm">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-sm">
                <div className="font-medium">Task {i} updated</div>
                <div className={DESIGN_TOKENS.colors.ui.text.secondary}>2 minutes ago</div>
              </div>
            ))}
          </Stack>
        </RightPanel>
      </div>

      <Drawer 
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        title="Navigation"
      >
        <Stack spacing="sm">
          <Button variant="ghost" className="w-full justify-start">
            📋 All Tasks
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            🚀 Active Sprint
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            ⏰ Due Today
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            ✅ Completed
          </Button>
        </Stack>
      </Drawer>
    </AppShell>
  );
}

// List/Detail Layout - Split pane for task management
export function TaskManagementLayout() {
  const [selectedTask, setSelectedTask] = useState<number | null>(1);

  return (
    <AppShell>
      <TopNav 
        logo={<span className="font-semibold">Task Manager</span>}
        actions={<Button>New Task</Button>}
      />
      
      <SplitPane
        leftTitle="Tasks"
        rightTitle={selectedTask ? `Task #${selectedTask}` : 'Select a task'}
        left={
          <Stack spacing="sm">
            {[1, 2, 3, 4, 5].map(taskId => (
              <Card 
                key={taskId}
                className={`cursor-pointer transition-colors ${
                  selectedTask === taskId ? 'bg-blue-50 border-blue-200' : DESIGN_TOKENS.colors.states.default.hover
                }`}
                onClick={() => setSelectedTask(taskId)}
              >
                <div className="p-4">
                  <div className="font-medium">AI-BOS Task #{taskId}</div>
                  <div className={cn('text-sm mt-1', DESIGN_TOKENS.colors.ui.text.secondary)}>
                    Implement microservice architecture
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      P1
                    </span>
                    <span className={cn('text-xs', DESIGN_TOKENS.colors.ui.text.muted)}>Due tomorrow</span>
                  </div>
                </div>
              </Card>
            ))}
          </Stack>
        }
        right={
          selectedTask ? (
            <Stack spacing="lg">
              <div>
                <h1 className="text-xl font-semibold mb-2">AI-BOS Task #{selectedTask}</h1>
                <p className={DESIGN_TOKENS.colors.ui.text.secondary}>
                  Implement microservice architecture for the AI-BOS Slack integration system.
                </p>
              </div>
              
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-medium">Details</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className={DESIGN_TOKENS.layout.patterns.spaceBetween}>
                    <span className={DESIGN_TOKENS.colors.ui.text.secondary}>Priority:</span>
                    <span className="font-medium">P1 - Important</span>
                  </div>
                  <div className={DESIGN_TOKENS.layout.patterns.spaceBetween}>
                    <span className={DESIGN_TOKENS.colors.ui.text.secondary}>Status:</span>
                    <span className="font-medium">In Progress</span>
                  </div>
                  <div className={DESIGN_TOKENS.layout.patterns.spaceBetween}>
                    <span className={DESIGN_TOKENS.colors.ui.text.secondary}>Due Date:</span>
                    <span className="font-medium">Tomorrow</span>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-medium">Description</h3>
                </div>
                <div className="p-4">
                  <p className={cn(DESIGN_TOKENS.colors.ui.text.primary, 'leading-relaxed')}>
                    Create a scalable microservice architecture that can handle multiple 
                    Slack workspace integrations simultaneously. Include proper error 
                    handling, logging, and monitoring capabilities.
                  </p>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button>Edit Task</Button>
                <Button variant="secondary">Mark Complete</Button>
                <Button variant="ghost">Delete</Button>
              </div>
            </Stack>
          ) : (
            <div className={DESIGN_TOKENS.layout.patterns.verticalCenter}>
              <div className="text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium mb-2">Select a task</h3>
                <p className={DESIGN_TOKENS.colors.ui.text.secondary}>Choose a task from the list to view details</p>
              </div>
            </div>
          )
        }
      />
    </AppShell>
  );
}

// Form Layout - Centered content for task creation
export function TaskCreationLayout() {
  return (
    <AppShell>
      <TopNav 
        logo={<span className="font-semibold">Create Task</span>}
        actions={<Button variant="secondary">Cancel</Button>}
      />
      
      <MainContent>
        <Container size="md">
          <div className={DESIGN_TOKENS.layout.patterns.verticalCenter} style={{ minHeight: '60vh' }}>
            <Card className="w-full max-w-2xl">
              <div className="p-6 border-b">
                <h1 className="text-xl font-semibold">Create New Task</h1>
                <p className={cn(DESIGN_TOKENS.colors.ui.text.secondary, 'mt-1')}>Add a new task to your AI-BOS project</p>
              </div>
              
              <div className="p-6">
                <Stack spacing="lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">Task Title</label>
                    <Input placeholder="Enter task title..." />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea 
                      className="w-full p-3 border rounded-lg resize-none"
                      rows={4}
                      placeholder="Describe the task..."
                    />
                  </div>
                  
                  <Grid cols={2} gap="md">
                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <select className="w-full p-3 border rounded-lg">
                        <option>P0 - Critical</option>
                        <option>P1 - Important</option>
                        <option>P2 - Normal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Due Date</label>
                      <Input type="date" />
                    </div>
                  </Grid>
                  
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1">Create Task</Button>
                    <Button variant="secondary" className="flex-1">Save Draft</Button>
                  </div>
                </Stack>
              </div>
            </Card>
          </div>
        </Container>
      </MainContent>
    </AppShell>
  );
}
