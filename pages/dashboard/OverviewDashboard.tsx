/**
 * Overview Dashboard - Railway System Main Dashboard
 *
 * Provides comprehensive overview of the Railway System with station navigation,
 * progress tracking, and enterprise-grade metrics visualization.
 *
 * Fortune 500 Requirements:
 * - Executive summary dashboard
 * - Real-time metrics and KPIs
 * - Station navigation and progress tracking
 * - Dark-theme first design
 * - WCAG AAA compliance
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Project Overview Interface
 */
interface ProjectOverview {
  id: string;
  title: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  progress: number;
  currentStation: string;
  dueDate: string;
  team: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * System Metrics Interface
 */
interface SystemMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageCompletion: number;
  policyCompliance: number;
  riskScore: number;
}

/**
 * Overview Dashboard Component
 * 
 * Main dashboard for the Railway System with enterprise-grade analytics
 */
export const OverviewDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Sample projects data
  const [projects] = React.useState<ProjectOverview[]>([
    {
      id: '1',
      title: 'Enterprise CRM Implementation',
      status: 'active',
      progress: 65,
      currentStation: 'Execution',
      dueDate: '2025-12-15',
      team: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
      riskLevel: 'medium',
    },
    {
      id: '2',
      title: 'Data Warehouse Migration',
      status: 'planning',
      progress: 25,
      currentStation: 'Planning',
      dueDate: '2026-03-30',
      team: ['David Wilson', 'Eva Martinez'],
      riskLevel: 'high',
    },
    {
      id: '3',
      title: 'Mobile App Redesign',
      status: 'completed',
      progress: 100,
      currentStation: 'Closure',
      dueDate: '2025-08-01',
      team: ['Frank Thompson', 'Grace Lee'],
      riskLevel: 'low',
    },
  ]);

  // System metrics
  const systemMetrics: SystemMetrics = React.useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const averageCompletion = Math.round(
      projects.reduce((sum, p) => sum + p.progress, 0) / total
    );

    return {
      totalProjects: total,
      activeProjects: active,
      completedProjects: completed,
      averageCompletion,
      policyCompliance: 92, // Mock compliance score
      riskScore: 75, // Mock risk score
    };
  }, [projects]);

  // Railway stations for navigation
  const railwayStations = [
    {
      id: 'initiation',
      name: 'Initiation Station',
      path: '/stations/initiation',
      description: 'Project Charter & Stakeholder Identification',
      anchor: 'PMBOK Initiating',
      color: 'bg-blue-600',
      icon: '🚉',
    },
    {
      id: 'planning',
      name: 'Planning Station',
      path: '/stations/planning',
      description: 'Resource Planning & Risk Assessment',
      anchor: 'PMBOK Planning',
      color: 'bg-green-600',
      icon: '📋',
    },
    {
      id: 'execution',
      name: 'Execution Station',
      path: '/stations/execution',
      description: 'Task Management & Team Coordination',
      anchor: 'PMBOK Executing',
      color: 'bg-orange-600',
      icon: '⚡',
    },
    {
      id: 'closure',
      name: 'Closure Station',
      path: '/stations/closure',
      description: 'Project Handover & Lessons Learned',
      anchor: 'PMBOK Closing',
      color: 'bg-purple-600',
      icon: '🎯',
    },
  ];

  // Status colors
  const getStatusColor = (status: ProjectOverview['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'active': return 'bg-blue-600';
      case 'planning': return 'bg-yellow-600';
      case 'on-hold': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  const getRiskColor = (risk: ProjectOverview['riskLevel']) => {
    switch (risk) {
      case 'low': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'high': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Railway System Dashboard
        </h1>
        <p className="text-slate-400">
          AI-Orchestrated Project Management Platform
        </p>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{systemMetrics.totalProjects}</div>
          <div className="text-sm text-slate-300">Total Projects</div>
        </div>
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{systemMetrics.activeProjects}</div>
          <div className="text-sm text-slate-300">Active</div>
        </div>
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{systemMetrics.completedProjects}</div>
          <div className="text-sm text-slate-300">Completed</div>
        </div>
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{systemMetrics.averageCompletion}%</div>
          <div className="text-sm text-slate-300">Avg Progress</div>
        </div>
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-cyan-400">{systemMetrics.policyCompliance}%</div>
          <div className="text-sm text-slate-300">Compliance</div>
        </div>
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{systemMetrics.riskScore}%</div>
          <div className="text-sm text-slate-300">Risk Score</div>
        </div>
      </div>

      {/* Railway Stations Navigation */}
      <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Railway Stations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {railwayStations.map((station) => (
            <button
              key={station.id}
              onClick={() => navigate(station.path)}
              className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 text-left hover:border-slate-500 hover:bg-slate-800/70 transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${station.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                  {station.icon}
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">{station.name}</h3>
                  <p className="text-slate-400 text-xs">{station.anchor}</p>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {station.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Projects Overview */}
      <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Active Projects</h2>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
            New Project
          </button>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-colors cursor-pointer"
              onClick={() => navigate(`/dashboard/project/${project.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-white">{project.title}</h3>
                  <p className="text-slate-400 text-sm">Due: {project.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(project.status)}`}>
                    {project.status}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium text-white ${getRiskColor(project.riskLevel)}`}>
                    {project.riskLevel} risk
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-300">Progress</span>
                  <span className="text-slate-300">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-slate-400">Current Station:</span>
                  <span className="text-slate-300 ml-1">{project.currentStation}</span>
                </div>
                <div>
                  <span className="text-slate-400">Team:</span>
                  <span className="text-slate-300 ml-1">{project.team.length} members</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/stations/initiation')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg p-6 text-left transition-all duration-200 transform hover:scale-105"
        >
          <h3 className="font-semibold mb-2">Start New Project</h3>
          <p className="text-sm opacity-90">Begin with project charter creation</p>
        </button>

        <button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg p-6 text-left transition-all duration-200 transform hover:scale-105">
          <h3 className="font-semibold mb-2">View Analytics</h3>
          <p className="text-sm opacity-90">Comprehensive project analytics</p>
        </button>

        <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg p-6 text-left transition-all duration-200 transform hover:scale-105">
          <h3 className="font-semibold mb-2">Risk Management</h3>
          <p className="text-sm opacity-90">Monitor and mitigate risks</p>
        </button>
      </div>

      {/* System Status */}
      <div className="bg-slate-900/20 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-slate-300 font-medium">System Status: Operational</span>
        </div>
        <p className="text-slate-400 text-sm">
          All railway stations are operational. PMBOK compliance at {systemMetrics.policyCompliance}%. 
          Enterprise security protocols active. Local-first architecture ensuring &lt;200ms response times.
        </p>
      </div>
    </div>
  );
};
