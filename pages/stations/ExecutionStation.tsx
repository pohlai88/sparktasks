/**
 * Execution Station - PMBOK Executing Process Group
 *
 * Implements task execution, team coordination, and real-time monitoring
 * according to PMBOK 7th Edition standards with Kanban workflow and WIP enforcement.
 *
 * Phase 1.2.4 Requirements:
 * - Kanban task board
 * - WIP limits enforcement
 * - Real-time policy violation alerts
 * - Dark-theme first design
 * - WCAG AAA compliance
 */

import React from 'react';

/**
 * Task Interface
 */
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours: number;
  actualHours: number;
  dueDate: string;
  tags: string[];
}

/**
 * Policy Violation Interface
 */
interface PolicyViolation {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  taskId?: string;
  timestamp: Date;
}

/**
 * Column Configuration
 */
interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
  wipLimit: number;
  color: string;
}

/**
 * Execution Station Component
 * 
 * Provides Kanban task management with WIP enforcement and policy monitoring
 */
export const ExecutionStation: React.FC = () => {
  // Kanban columns configuration
  const columns: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', status: 'todo', wipLimit: 5, color: 'slate' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress', wipLimit: 3, color: 'blue' },
    { id: 'review', title: 'Review', status: 'review', wipLimit: 2, color: 'yellow' },
    { id: 'done', title: 'Done', status: 'done', wipLimit: 999, color: 'green' },
  ];

  // Sample tasks
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: '1',
      title: 'Requirements Analysis',
      description: 'Analyze and document business requirements',
      status: 'in-progress',
      assignee: 'Business Analyst',
      priority: 'high',
      estimatedHours: 16,
      actualHours: 8,
      dueDate: '2025-09-01',
      tags: ['analysis', 'requirements'],
    },
    {
      id: '2',
      title: 'Database Design',
      description: 'Design database schema and relationships',
      status: 'todo',
      assignee: 'Database Architect',
      priority: 'medium',
      estimatedHours: 24,
      actualHours: 0,
      dueDate: '2025-09-05',
      tags: ['database', 'design'],
    },
    {
      id: '3',
      title: 'API Development',
      description: 'Develop REST API endpoints',
      status: 'todo',
      assignee: 'Backend Developer',
      priority: 'high',
      estimatedHours: 40,
      actualHours: 0,
      dueDate: '2025-09-10',
      tags: ['backend', 'api'],
    },
  ]);

  // Policy violations
  const [violations, setViolations] = React.useState<PolicyViolation[]>([
    {
      id: '1',
      message: 'Task "Requirements Analysis" is approaching WIP limit in In Progress column',
      severity: 'warning',
      taskId: '1',
      timestamp: new Date(),
    },
  ]);

  // Get tasks by status
  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  // Check WIP violations
  const checkWipViolation = (status: Task['status']) => {
    const column = columns.find(col => col.status === status);
    const taskCount = getTasksByStatus(status).length;
    return column && taskCount >= column.wipLimit;
  };

  // Move task to different status
  const moveTask = (taskId: string, newStatus: Task['status']) => {
    const column = columns.find(col => col.status === newStatus);
    const currentTasks = getTasksByStatus(newStatus);
    
    // Check WIP limit
    if (column && currentTasks.length >= column.wipLimit && newStatus !== 'done') {
      const violation: PolicyViolation = {
        id: Date.now().toString(),
        message: `Cannot move task: WIP limit (${column.wipLimit}) reached for ${column.title} column`,
        severity: 'error',
        taskId,
        timestamp: new Date(),
      };
      setViolations(prev => [...prev, violation]);
      return;
    }

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Dismiss violation
  const dismissViolation = (violationId: string) => {
    setViolations(prev => prev.filter(v => v.id !== violationId));
  };

  // Priority color mapping
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Academic Anchor Header */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="px-3 py-1 bg-orange-600 text-white text-sm font-medium rounded-full">
            PMBOK Executing
          </div>
          <h2 className="text-xl font-semibold text-white">Project Execution & Task Management</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          <strong>Academic Anchor:</strong> PMBOK 7th Edition - Executing Process Group + Kanban Methodology
          <br />
          <strong>Purpose:</strong> Execute project work with WIP limits, visual workflow management, 
          and real-time policy enforcement to ensure optimal flow and quality delivery.
        </p>
      </div>

      {/* Policy Violation Alerts */}
      {violations.length > 0 && (
        <div className="space-y-3">
          {violations.map((violation) => (
            <div
              key={violation.id}
              className={`p-4 rounded-lg border flex items-center justify-between ${
                violation.severity === 'error'
                  ? 'bg-red-900/30 border-red-600 text-red-200'
                  : violation.severity === 'warning'
                  ? 'bg-yellow-900/30 border-yellow-600 text-yellow-200'
                  : 'bg-blue-900/30 border-blue-600 text-blue-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  violation.severity === 'error' ? 'bg-red-500' :
                  violation.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <span className="font-medium">
                  {violation.severity.toUpperCase()}:
                </span>
                <span>{violation.message}</span>
              </div>
              <button
                onClick={() => dismissViolation(violation.id)}
                className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded transition-colors"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          const isWipViolation = checkWipViolation(column.status);
          
          return (
            <div key={column.id} className="bg-slate-900/30 border border-slate-700 rounded-lg">
              {/* Column Header */}
              <div className={`p-4 border-b border-slate-700 ${isWipViolation ? 'bg-red-900/20' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{column.title}</h3>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    isWipViolation
                      ? 'bg-red-600 text-white'
                      : columnTasks.length === column.wipLimit && column.status !== 'done'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-slate-600 text-slate-200'
                  }`}>
                    {columnTasks.length}
                    {column.status !== 'done' && `/${column.wipLimit}`}
                  </div>
                </div>
                
                {column.status !== 'done' && (
                  <div className="text-xs text-slate-400">
                    WIP Limit: {column.wipLimit}
                  </div>
                )}
              </div>

              {/* Column Tasks */}
              <div className="p-4 space-y-3 min-h-[400px]">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 hover:border-slate-500 transition-colors cursor-pointer"
                    onClick={() => {
                      // Simple status progression
                      const currentIndex = columns.findIndex(col => col.status === task.status);
                      if (currentIndex >= 0 && currentIndex < columns.length - 1) {
                        const nextColumn = columns[currentIndex + 1];
                        if (nextColumn) {
                          moveTask(task.id, nextColumn.status);
                        }
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white text-sm">{task.title}</h4>
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                    </div>
                    
                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Assignee:</span>
                        <span className="text-slate-300">{task.assignee}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Progress:</span>
                        <span className="text-slate-300">
                          {task.actualHours}h / {task.estimatedHours}h
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Due:</span>
                        <span className="text-slate-300">{task.dueDate}</span>
                      </div>

                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{tasks.length}</div>
          <div className="text-sm text-slate-300">Total Tasks</div>
        </div>
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {getTasksByStatus('in-progress').length}
          </div>
          <div className="text-sm text-slate-300">In Progress</div>
        </div>
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {getTasksByStatus('done').length}
          </div>
          <div className="text-sm text-slate-300">Completed</div>
        </div>
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Math.round((getTasksByStatus('done').length / tasks.length) * 100)}%
          </div>
          <div className="text-sm text-slate-300">Progress</div>
        </div>
      </div>

      {/* PMBOK Compliance Note */}
      <div className="bg-slate-900/20 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-400 text-sm">
          <strong>PMBOK Compliance:</strong> This station implements the Executing Process Group 
          with Kanban methodology for visual workflow management, WIP limits for flow optimization, 
          and real-time policy enforcement as specified in the Project Management Body of Knowledge 7th Edition.
        </p>
      </div>
    </div>
  );
};
