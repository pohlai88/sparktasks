/**
 * Closure Station - PMBOK Closing Process Group
 *
 * Implements project handover, lessons learned, and formal closure
 * according to PMBOK 7th Edition standards with comprehensive documentation.
 *
 * Phase 1.2 Requirements:
 * - Project handover checklist
 * - Lessons learned documentation
 * - Stakeholder sign-off
 * - Dark-theme first design
 * - WCAG AAA compliance
 */

import React from 'react';

/**
 * Handover Item Interface
 */
interface HandoverItem {
  id: string;
  category: string;
  item: string;
  status: 'pending' | 'in-progress' | 'completed';
  responsible: string;
  dueDate: string;
  notes: string;
}

/**
 * Lesson Learned Interface
 */
interface LessonLearned {
  id: string;
  category: 'what-went-well' | 'what-could-improve' | 'what-to-avoid';
  description: string;
  impact: 'low' | 'medium' | 'high';
  recommendation: string;
  author: string;
  date: string;
}

/**
 * Stakeholder Sign-off Interface
 */
interface StakeholderSignoff {
  id: string;
  name: string;
  role: string;
  signoffDate: string | null;
  comments: string;
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * Closure Station Component
 * 
 * Provides comprehensive project closure with PMBOK compliance
 */
export const ClosureStation: React.FC = () => {
  // Handover checklist
  const [handoverItems, setHandoverItems] = React.useState<HandoverItem[]>([
    {
      id: '1',
      category: 'Documentation',
      item: 'Project Charter Archive',
      status: 'completed',
      responsible: 'Project Manager',
      dueDate: '2025-08-30',
      notes: 'All charter documents archived in project repository',
    },
    {
      id: '2',
      category: 'Documentation',
      item: 'Technical Documentation',
      status: 'in-progress',
      responsible: 'Technical Lead',
      dueDate: '2025-09-01',
      notes: 'API documentation and system architecture diagrams',
    },
    {
      id: '3',
      category: 'Knowledge Transfer',
      item: 'Operations Handover',
      status: 'pending',
      responsible: 'DevOps Engineer',
      dueDate: '2025-09-03',
      notes: 'Transfer operational procedures to support team',
    },
    {
      id: '4',
      category: 'Legal & Compliance',
      item: 'Contract Closure',
      status: 'pending',
      responsible: 'Legal Team',
      dueDate: '2025-09-05',
      notes: 'Finalize all vendor contracts and legal obligations',
    },
  ]);

  // Lessons learned
  const [lessonsLearned, setLessonsLearned] = React.useState<LessonLearned[]>([
    {
      id: '1',
      category: 'what-went-well',
      description: 'Daily standup meetings improved team communication significantly',
      impact: 'high',
      recommendation: 'Continue daily standups for future projects',
      author: 'Scrum Master',
      date: '2025-08-27',
    },
    {
      id: '2',
      category: 'what-could-improve',
      description: 'Requirements gathering phase took longer than expected',
      impact: 'medium',
      recommendation: 'Allocate 25% more time for requirements phase in similar projects',
      author: 'Business Analyst',
      date: '2025-08-27',
    },
  ]);

  // Stakeholder sign-offs
  const [stakeholderSignoffs, setStakeholderSignoffs] = React.useState<StakeholderSignoff[]>([
    {
      id: '1',
      name: 'John Smith',
      role: 'Project Sponsor',
      signoffDate: '2025-08-27',
      comments: 'Project delivered successfully within scope and timeline',
      status: 'approved',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Business Owner',
      signoffDate: null,
      comments: '',
      status: 'pending',
    },
    {
      id: '3',
      name: 'Mike Chen',
      role: 'Technical Stakeholder',
      signoffDate: null,
      comments: '',
      status: 'pending',
    },
  ]);

  // Update handover item status
  const updateHandoverStatus = (itemId: string, newStatus: HandoverItem['status']) => {
    setHandoverItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  // Add new lesson learned
  const addLessonLearned = () => {
    const newLesson: LessonLearned = {
      id: Date.now().toString(),
      category: 'what-went-well',
      description: '',
      impact: 'medium',
      recommendation: '',
      author: 'Team Member',
      date: new Date().toISOString().split('T')[0] as string,
    };
    setLessonsLearned(prev => [...prev, newLesson]);
  };

  // Calculate completion percentage
  const completionPercentage = React.useMemo(() => {
    const completedItems = handoverItems.filter(item => item.status === 'completed').length;
    return Math.round((completedItems / handoverItems.length) * 100);
  }, [handoverItems]);

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'approved': return 'bg-green-600';
      case 'in-progress': return 'bg-yellow-600';
      case 'pending': return 'bg-slate-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  const getCategoryColor = (category: LessonLearned['category']) => {
    switch (category) {
      case 'what-went-well': return 'bg-green-600';
      case 'what-could-improve': return 'bg-yellow-600';
      case 'what-to-avoid': return 'bg-red-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Academic Anchor Header */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded-full">
            PMBOK Closing
          </div>
          <h2 className="text-xl font-semibold text-white">Project Closure & Handover</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          <strong>Academic Anchor:</strong> PMBOK 7th Edition - Closing Process Group
          <br />
          <strong>Purpose:</strong> Formal project closure with comprehensive handover, 
          lessons learned documentation, and stakeholder sign-off for organizational learning.
        </p>
      </div>

      {/* Closure Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{completionPercentage}%</div>
          <div className="text-sm text-slate-300">Closure Complete</div>
        </div>
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {handoverItems.filter(item => item.status === 'completed').length}
          </div>
          <div className="text-sm text-slate-300">Items Completed</div>
        </div>
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{lessonsLearned.length}</div>
          <div className="text-sm text-slate-300">Lessons Captured</div>
        </div>
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {stakeholderSignoffs.filter(s => s.status === 'approved').length}
          </div>
          <div className="text-sm text-slate-300">Sign-offs Complete</div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Handover Checklist */}
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Handover Checklist</h3>
          
          <div className="space-y-4">
            {handoverItems.map((item) => (
              <div key={item.id} className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-white text-sm">{item.item}</h4>
                    <p className="text-slate-400 text-xs">{item.category}</p>
                  </div>
                  <select
                    value={item.status}
                    onChange={(e) => updateHandoverStatus(item.id, e.target.value as HandoverItem['status'])}
                    className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(item.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Responsible:</span>
                    <span className="text-slate-300 ml-1">{item.responsible}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Due:</span>
                    <span className="text-slate-300 ml-1">{item.dueDate}</span>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-slate-400 text-xs mt-2 italic">{item.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stakeholder Sign-offs */}
        <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">Stakeholder Sign-offs</h3>
          
          <div className="space-y-4">
            {stakeholderSignoffs.map((signoff) => (
              <div key={signoff.id} className="bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-white text-sm">{signoff.name}</h4>
                    <p className="text-slate-400 text-xs">{signoff.role}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(signoff.status)}`}>
                    {signoff.status}
                  </div>
                </div>

                {signoff.signoffDate && (
                  <div className="text-xs">
                    <span className="text-slate-400">Approved on:</span>
                    <span className="text-slate-300 ml-1">{signoff.signoffDate}</span>
                  </div>
                )}

                {signoff.comments && (
                  <p className="text-slate-400 text-xs mt-2 italic">"{signoff.comments}"</p>
                )}

                {signoff.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setStakeholderSignoffs(prev =>
                          prev.map(s =>
                            s.id === signoff.id
                              ? { ...s, status: 'approved' as const, signoffDate: new Date().toISOString().split('T')[0] as string }
                              : s
                          )
                        );
                      }}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setStakeholderSignoffs(prev =>
                          prev.map(s =>
                            s.id === signoff.id
                              ? { ...s, status: 'rejected' as const }
                              : s
                          )
                        );
                      }}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lessons Learned */}
      <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Lessons Learned</h3>
          <button
            onClick={addLessonLearned}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
          >
            Add Lesson
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['what-went-well', 'what-could-improve', 'what-to-avoid'].map((category) => (
            <div key={category} className="space-y-3">
              <h4 className={`text-sm font-medium text-white px-3 py-1 rounded ${getCategoryColor(category as LessonLearned['category'])}`}>
                {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h4>
              
              {lessonsLearned
                .filter(lesson => lesson.category === category)
                .map(lesson => (
                  <div key={lesson.id} className="bg-slate-800/50 border border-slate-600 rounded-lg p-3">
                    <p className="text-slate-300 text-sm mb-2">{lesson.description}</p>
                    
                    <div className="text-xs text-slate-400 mb-2">
                      <span>Impact: </span>
                      <span className={`px-1 py-0.5 rounded ${
                        lesson.impact === 'high' ? 'bg-red-600' :
                        lesson.impact === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                      } text-white`}>
                        {lesson.impact}
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs italic mb-2">
                      Recommendation: {lesson.recommendation}
                    </p>

                    <div className="text-xs text-slate-500">
                      {lesson.author} • {lesson.date}
                    </div>
                  </div>
                ))
              }
            </div>
          ))}
        </div>
      </div>

      {/* PMBOK Compliance Note */}
      <div className="bg-slate-900/20 border border-slate-700 rounded-lg p-4">
        <p className="text-slate-400 text-sm">
          <strong>PMBOK Compliance:</strong> This station implements the Closing Process Group 
          requirements including formal project closure, handover procedures, lessons learned 
          documentation, and stakeholder acceptance as specified in the Project Management Body of Knowledge 7th Edition.
        </p>
      </div>
    </div>
  );
};
