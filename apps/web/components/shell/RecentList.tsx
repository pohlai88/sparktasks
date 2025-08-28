'use client'

import { EnhancedCards } from '@/enhanced/Card'
import { EnhancedBadge } from '@/enhanced/Badge'

export function RecentList() {
  const recentItems = [
    { id: 1, title: 'Q4 Product Launch', type: 'project', status: 'in_progress' },
    { id: 2, title: 'Security Audit Review', type: 'task', status: 'pending' },
    { id: 3, title: 'Budget Planning Session', type: 'meeting', status: 'completed' }
  ]

  return (
    <EnhancedCards.Card>
      <EnhancedCards.Header>
        <EnhancedCards.Title>Recent Activity</EnhancedCards.Title>
      </EnhancedCards.Header>
      <EnhancedCards.Content>
        <div className="space-y-3">
          {recentItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.type}</p>
              </div>
              <EnhancedBadge variant="outline">
                {item.status}
              </EnhancedBadge>
            </div>
          ))}
        </div>
      </EnhancedCards.Content>
    </EnhancedCards.Card>
  )
}
