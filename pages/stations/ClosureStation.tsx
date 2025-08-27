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
      description:
        'Daily standup meetings improved team communication significantly',
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
      recommendation:
        'Allocate 25% more time for requirements phase in similar projects',
      author: 'Business Analyst',
      date: '2025-08-27',
    },
  ]);

  // Stakeholder sign-offs
  const [stakeholderSignoffs, setStakeholderSignoffs] = React.useState<
    StakeholderSignoff[]
  >([
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
  const updateHandoverStatus = (
    itemId: string,
    newStatus: HandoverItem['status']
  ) => {
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
    const completedItems = handoverItems.filter(
      item => item.status === 'completed'
    ).length;
    return Math.round((completedItems / handoverItems.length) * 100);
  }, [handoverItems]);

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-600';
      case 'in-progress':
        return 'bg-yellow-600';
      case 'pending':
        return 'bg-slate-600';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-slate-600';
    }
  };

  const getCategoryColor = (category: LessonLearned['category']) => {
    switch (category) {
      case 'what-went-well':
        return 'bg-green-600';
      case 'what-could-improve':
        return 'bg-yellow-600';
      case 'what-to-avoid':
        return 'bg-red-600';
      default:
        return 'bg-slate-600';
    }
  };

  return (
    <div className='mx-auto max-w-6xl space-y-8'>
      {/* Academic Anchor Header */}
      <div className='rounded-lg border border-slate-700 bg-slate-900/50 p-6 backdrop-blur-sm'>
        <div className='mb-3 flex items-center gap-3'>
          <div className='rounded-full bg-purple-600 px-3 py-1 text-sm font-medium text-white'>
            PMBOK Closing
          </div>
          <h2 className='text-xl font-semibold text-white'>
            Project Closure & Handover
          </h2>
        </div>
        <p className='text-sm leading-relaxed text-slate-300'>
          <strong>Academic Anchor:</strong> PMBOK 7th Edition - Closing Process
          Group
          <br />
          <strong>Purpose:</strong> Formal project closure with comprehensive
          handover, lessons learned documentation, and stakeholder sign-off for
          organizational learning.
        </p>
      </div>

      {/* Closure Progress Overview */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-4 text-center'>
          <div className='text-2xl font-bold text-purple-400'>
            {completionPercentage}%
          </div>
          <div className='text-sm text-slate-300'>Closure Complete</div>
        </div>
        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-4 text-center'>
          <div className='text-2xl font-bold text-green-400'>
            {handoverItems.filter(item => item.status === 'completed').length}
          </div>
          <div className='text-sm text-slate-300'>Items Completed</div>
        </div>
        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-4 text-center'>
          <div className='text-2xl font-bold text-blue-400'>
            {lessonsLearned.length}
          </div>
          <div className='text-sm text-slate-300'>Lessons Captured</div>
        </div>
        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-4 text-center'>
          <div className='text-2xl font-bold text-yellow-400'>
            {stakeholderSignoffs.filter(s => s.status === 'approved').length}
          </div>
          <div className='text-sm text-slate-300'>Sign-offs Complete</div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Handover Checklist */}
        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-6'>
          <h3 className='mb-4 text-lg font-medium text-white'>
            Handover Checklist
          </h3>

          <div className='space-y-4'>
            {handoverItems.map(item => (
              <div
                key={item.id}
                className='rounded-lg border border-slate-600 bg-slate-800/50 p-4'
              >
                <div className='mb-2 flex items-start justify-between'>
                  <div>
                    <h4 className='text-sm font-medium text-white'>
                      {item.item}
                    </h4>
                    <p className='text-xs text-slate-400'>{item.category}</p>
                  </div>
                  <select
                    value={item.status}
                    onChange={e =>
                      updateHandoverStatus(
                        item.id,
                        e.target.value as HandoverItem['status']
                      )
                    }
                    className={`rounded px-2 py-1 text-xs font-medium text-white ${getStatusColor(item.status)}`}
                  >
                    <option value='pending'>Pending</option>
                    <option value='in-progress'>In Progress</option>
                    <option value='completed'>Completed</option>
                  </select>
                </div>

                <div className='grid grid-cols-1 gap-2 text-xs md:grid-cols-2'>
                  <div>
                    <span className='text-slate-400'>Responsible:</span>
                    <span className='ml-1 text-slate-300'>
                      {item.responsible}
                    </span>
                  </div>
                  <div>
                    <span className='text-slate-400'>Due:</span>
                    <span className='ml-1 text-slate-300'>{item.dueDate}</span>
                  </div>
                </div>

                {item.notes && (
                  <p className='mt-2 text-xs italic text-slate-400'>
                    {item.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stakeholder Sign-offs */}
        <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-6'>
          <h3 className='mb-4 text-lg font-medium text-white'>
            Stakeholder Sign-offs
          </h3>

          <div className='space-y-4'>
            {stakeholderSignoffs.map(signoff => (
              <div
                key={signoff.id}
                className='rounded-lg border border-slate-600 bg-slate-800/50 p-4'
              >
                <div className='mb-2 flex items-start justify-between'>
                  <div>
                    <h4 className='text-sm font-medium text-white'>
                      {signoff.name}
                    </h4>
                    <p className='text-xs text-slate-400'>{signoff.role}</p>
                  </div>
                  <div
                    className={`rounded px-2 py-1 text-xs font-medium text-white ${getStatusColor(signoff.status)}`}
                  >
                    {signoff.status}
                  </div>
                </div>

                {signoff.signoffDate && (
                  <div className='text-xs'>
                    <span className='text-slate-400'>Approved on:</span>
                    <span className='ml-1 text-slate-300'>
                      {signoff.signoffDate}
                    </span>
                  </div>
                )}

                {signoff.comments && (
                  <p className='mt-2 text-xs italic text-slate-400'>
                    &ldquo;{signoff.comments}&rdquo;
                  </p>
                )}

                {signoff.status === 'pending' && (
                  <div className='mt-3 flex gap-2'>
                    <button
                      onClick={() => {
                        setStakeholderSignoffs(prev =>
                          prev.map(s =>
                            s.id === signoff.id
                              ? {
                                  ...s,
                                  status: 'approved' as const,
                                  signoffDate: new Date()
                                    .toISOString()
                                    .split('T')[0] as string,
                                }
                              : s
                          )
                        );
                      }}
                      className='rounded bg-green-600 px-3 py-1 text-xs text-white transition-colors hover:bg-green-700'
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
                      className='rounded bg-red-600 px-3 py-1 text-xs text-white transition-colors hover:bg-red-700'
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
      <div className='rounded-lg border border-slate-700 bg-slate-900/30 p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-medium text-white'>Lessons Learned</h3>
          <button
            onClick={addLessonLearned}
            className='rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700'
          >
            Add Lesson
          </button>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {['what-went-well', 'what-could-improve', 'what-to-avoid'].map(
            category => (
              <div key={category} className='space-y-3'>
                <h4
                  className={`rounded px-3 py-1 text-sm font-medium text-white ${getCategoryColor(category as LessonLearned['category'])}`}
                >
                  {category
                    .replaceAll('-', ' ')
                    .replaceAll(/\b\w/g, l => l.toUpperCase())}
                </h4>

                {lessonsLearned
                  .filter(lesson => lesson.category === category)
                  .map(lesson => (
                    <div
                      key={lesson.id}
                      className='rounded-lg border border-slate-600 bg-slate-800/50 p-3'
                    >
                      <p className='mb-2 text-sm text-slate-300'>
                        {lesson.description}
                      </p>

                      <div className='mb-2 text-xs text-slate-400'>
                        <span>Impact: </span>
                        <span
                          className={`rounded px-1 py-0.5 ${
                            lesson.impact === 'high'
                              ? 'bg-red-600'
                              : lesson.impact === 'medium'
                                ? 'bg-yellow-600'
                                : 'bg-green-600'
                          } text-white`}
                        >
                          {lesson.impact}
                        </span>
                      </div>

                      <p className='mb-2 text-xs italic text-slate-400'>
                        Recommendation: {lesson.recommendation}
                      </p>

                      <div className='text-xs text-slate-500'>
                        {lesson.author} • {lesson.date}
                      </div>
                    </div>
                  ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* PMBOK Compliance Note */}
      <div className='rounded-lg border border-slate-700 bg-slate-900/20 p-4'>
        <p className='text-sm text-slate-400'>
          <strong>PMBOK Compliance:</strong> This station implements the Closing
          Process Group requirements including formal project closure, handover
          procedures, lessons learned documentation, and stakeholder acceptance
          as specified in the Project Management Body of Knowledge 7th Edition.
        </p>
      </div>
    </div>
  );
};
