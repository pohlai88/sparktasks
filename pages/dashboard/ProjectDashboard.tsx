/**
 * Project Dashboard - Individual Project Management
 *
 * Provides detailed project view with station progress, task management,
 * and PMBOK compliance tracking for individual projects.
 *
 * Fortune 500 Requirements:
 * - Detailed project analytics
 * - Station-based progress tracking
 * - Risk and compliance monitoring
 * - Dark-theme first design
 * - WCAG AAA compliance
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * Project Detail Interface
 */
interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  dueDate: string;
  budget: {
    allocated: number;
    spent: number;
    currency: string;
  };
  team: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  currentStation: string;
  stationProgress: {
    stationId: string;
    stationName: string;
    progress: number;
    isActive: boolean;
    completedTasks: number;
    totalTasks: number;
  }[];
  risks: {
    id: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
    status: 'open' | 'mitigated' | 'closed';
  }[];
  compliance: {
    score: number;
    violations: number;
    lastAudit: string;
  };
}

/**
 * Project Dashboard Component
 *
 * Detailed project management dashboard with PMBOK compliance
 */
export const ProjectDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock project data - in real implementation, this would fetch from API
  const [project] = React.useState<ProjectDetail>({
    id: id || '1',
    title: 'Enterprise CRM Implementation',
    description:
      'Comprehensive customer relationship management system implementation with enterprise integration and mobile capabilities.',
    status: 'active',
    progress: 65,
    startDate: '2025-06-01',
    dueDate: '2025-12-15',
    budget: {
      allocated: 500000,
      spent: 325000,
      currency: 'USD',
    },
    team: [
      { id: '1', name: 'Alice Johnson', role: 'Project Manager' },
      { id: '2', name: 'Bob Smith', role: 'Technical Lead' },
      { id: '3', name: 'Carol Davis', role: 'Business Analyst' },
      { id: '4', name: 'David Wilson', role: 'UI/UX Designer' },
      { id: '5', name: 'Eva Martinez', role: 'Backend Developer' },
    ],
    currentStation: 'Execution',
    stationProgress: [
      {
        stationId: 'initiation',
        stationName: 'Initiation',
        progress: 100,
        isActive: false,
        completedTasks: 5,
        totalTasks: 5,
      },
      {
        stationId: 'planning',
        stationName: 'Planning',
        progress: 100,
        isActive: false,
        completedTasks: 8,
        totalTasks: 8,
      },
      {
        stationId: 'execution',
        stationName: 'Execution',
        progress: 65,
        isActive: true,
        completedTasks: 13,
        totalTasks: 20,
      },
      {
        stationId: 'closure',
        stationName: 'Closure',
        progress: 0,
        isActive: false,
        completedTasks: 0,
        totalTasks: 4,
      },
    ],
    risks: [
      {
        id: '1',
        description:
          'Third-party API integration complexity higher than estimated',
        severity: 'medium',
        mitigation:
          'Allocated additional development time and engaged API vendor support',
        status: 'mitigated',
      },
      {
        id: '2',
        description: 'Key stakeholder availability limited during UAT phase',
        severity: 'high',
        mitigation:
          'Schedule UAT sessions in advance with backup stakeholders identified',
        status: 'open',
      },
    ],
    compliance: {
      score: 92,
      violations: 2,
      lastAudit: '2025-08-25',
    },
  });

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'active':
        return 'bg-blue-600';
      case 'planning':
        return 'bg-yellow-600';
      case 'on-hold':
        return 'bg-red-600';
      default:
        return 'bg-slate-600';
    }
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'high':
        return 'bg-red-600';
      default:
        return 'bg-slate-600';
    }
  };

  const getRiskStatusColor = (status: string) => {
    switch (status) {
      case 'closed':
        return 'bg-green-600';
      case 'mitigated':
        return 'bg-blue-600';
      case 'open':
        return 'bg-red-600';
      default:
        return 'bg-slate-600';
    }
  };

  return (
    <div className='mx-auto max-w-7xl space-y-8'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <button
            onClick={() => navigate('/dashboard/overview')}
            className='mb-2 text-sm text-slate-400 hover:text-white'
          >
            ← Back to Dashboard
          </button>
          <h1 className='mb-2 text-3xl font-bold text-white'>
            {project.title}
          </h1>
          <p className='max-w-2xl text-slate-400'>{project.description}</p>
        </div>
        <div
          className={`rounded px-3 py-1 font-medium text-white ${getStatusColor(project.status)}`}
        >
          {project.status.toUpperCase()}
        </div>
      </div>

      {/* Project Overview Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-4'>
          <div className='text-2xl font-bold text-blue-400'>
            {project.progress}%
          </div>
          <div className='text-sm text-slate-300'>Overall Progress</div>
          <div className='mt-2 h-2 w-full rounded-full bg-slate-700'>
            <div
              className='h-2 rounded-full bg-blue-500 transition-all duration-300'
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-4'>
          <div className='text-2xl font-bold text-green-400'>
            {formatCurrency(project.budget.spent, project.budget.currency)}
          </div>
          <div className='text-sm text-slate-300'>Budget Spent</div>
          <div className='mt-1 text-xs text-slate-400'>
            of{' '}
            {formatCurrency(project.budget.allocated, project.budget.currency)}
          </div>
        </div>

        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-4'>
          <div className='text-2xl font-bold text-purple-400'>
            {project.team.length}
          </div>
          <div className='text-sm text-slate-300'>Team Members</div>
        </div>

        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-4'>
          <div className='text-2xl font-bold text-yellow-400'>
            {project.compliance.score}%
          </div>
          <div className='text-sm text-slate-300'>PMBOK Compliance</div>
        </div>
      </div>

      {/* Railway Station Progress */}
      <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-6'>
        <h2 className='mb-4 text-xl font-semibold text-white'>
          Railway Station Progress
        </h2>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {project.stationProgress.map(station => (
            <div
              key={station.stationId}
              className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:scale-105 ${
                station.isActive
                  ? 'border-blue-500 bg-blue-900/20'
                  : station.progress === 100
                    ? 'border-green-500 bg-green-900/20'
                    : 'border-slate-600 bg-slate-800/30'
              }`}
              onClick={() => navigate(`/stations/${station.stationId}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/stations/${station.stationId}`);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className='mb-3 flex items-center justify-between'>
                <h3 className='text-sm font-medium text-white'>
                  {station.stationName}
                </h3>
                <div
                  className={`h-3 w-3 rounded-full ${
                    station.isActive
                      ? 'bg-blue-500'
                      : station.progress === 100
                        ? 'bg-green-500'
                        : 'bg-slate-500'
                  }`}
                />
              </div>

              <div className='mb-3'>
                <div className='mb-1 flex items-center justify-between text-xs'>
                  <span className='text-slate-300'>Progress</span>
                  <span className='text-slate-300'>{station.progress}%</span>
                </div>
                <div className='h-2 w-full rounded-full bg-slate-700'>
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      station.isActive
                        ? 'bg-blue-500'
                        : station.progress === 100
                          ? 'bg-green-500'
                          : 'bg-slate-500'
                    }`}
                    style={{ width: `${station.progress}%` }}
                  />
                </div>
              </div>

              <div className='text-xs text-slate-400'>
                Tasks: {station.completedTasks}/{station.totalTasks} completed
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column layout for Team and Risks */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Team Members */}
        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-6'>
          <h2 className='mb-4 text-xl font-semibold text-white'>
            Team Members
          </h2>

          <div className='space-y-3'>
            {project.team.map(member => (
              <div
                key={member.id}
                className='flex items-center gap-3 rounded-lg border border-slate-600 bg-slate-800/50 p-3'
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 font-medium text-white'>
                  {member.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </div>
                <div>
                  <div className='text-sm font-medium text-white'>
                    {member.name}
                  </div>
                  <div className='text-xs text-slate-400'>{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Management */}
        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-6'>
          <h2 className='mb-4 text-xl font-semibold text-white'>
            Risk Management
          </h2>

          <div className='space-y-3'>
            {project.risks.map(risk => (
              <div
                key={risk.id}
                className='rounded-lg border border-slate-600 bg-slate-800/50 p-3'
              >
                <div className='mb-2 flex items-start justify-between'>
                  <p className='text-sm font-medium text-white'>
                    {risk.description}
                  </p>
                  <div className='flex gap-2'>
                    <div
                      className={`rounded px-2 py-1 text-xs font-medium text-white ${getRiskColor(risk.severity)}`}
                    >
                      {risk.severity}
                    </div>
                    <div
                      className={`rounded px-2 py-1 text-xs font-medium text-white ${getRiskStatusColor(risk.status)}`}
                    >
                      {risk.status}
                    </div>
                  </div>
                </div>
                <p className='text-xs italic text-slate-400'>
                  <strong>Mitigation:</strong> {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance and Actions */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {/* PMBOK Compliance */}
        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-6'>
          <h3 className='mb-4 text-lg font-medium text-white'>
            PMBOK Compliance
          </h3>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-slate-300'>Compliance Score</span>
              <span className='text-xl font-bold text-green-400'>
                {project.compliance.score}%
              </span>
            </div>

            <div className='h-3 w-full rounded-full bg-slate-700'>
              <div
                className='h-3 rounded-full bg-green-500 transition-all duration-300'
                style={{ width: `${project.compliance.score}%` }}
              />
            </div>

            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-slate-400'>Violations:</span>
                <span className='ml-1 font-medium text-red-400'>
                  {project.compliance.violations}
                </span>
              </div>
              <div>
                <span className='text-slate-400'>Last Audit:</span>
                <span className='ml-1 text-slate-300'>
                  {project.compliance.lastAudit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-6'>
          <h3 className='mb-4 text-lg font-medium text-white'>Quick Actions</h3>

          <div className='space-y-3'>
            <button
              onClick={() =>
                navigate(`/stations/${project.currentStation.toLowerCase()}`)
              }
              className='w-full rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700'
            >
              Go to Current Station
            </button>

            <button className='w-full rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700'>
              Generate Report
            </button>

            <button className='w-full rounded-lg bg-yellow-600 px-4 py-2 text-sm text-white transition-colors hover:bg-yellow-700'>
              Schedule Review
            </button>

            <button className='w-full rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700'>
              Escalate Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
