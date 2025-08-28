'use client'

import { EnhancedCards } from '@/enhanced/Card'
import { EnhancedBadge } from '@/enhanced/Badge'

export function KPICards() {
  const kpis = [
    { name: 'Active Projects', value: '24', trend: '+12%', status: 'success' },
    { name: 'Completion Rate', value: '87%', trend: '+5%', status: 'success' },
    { name: 'Budget Utilization', value: '76%', trend: '-2%', status: 'warning' },
    { name: 'Risk Score', value: 'Low', trend: 'stable', status: 'success' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <EnhancedCards.Card key={kpi.name}>
          <EnhancedCards.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.name}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
              <EnhancedBadge variant={kpi.status as any}>
                {kpi.trend}
              </EnhancedBadge>
            </div>
          </EnhancedCards.Content>
        </EnhancedCards.Card>
      ))}
    </div>
  )
}
