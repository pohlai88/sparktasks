'use client'

import { EnhancedInput } from '@/enhanced/Input'
import { EnhancedButton } from '@/enhanced/Button'

export function QuickSearch() {
  return (
    <div className="flex gap-2">
      <EnhancedInput
        placeholder="Search projects, tasks, or documents..."
        className="flex-1"
      />
      <EnhancedButton>Search</EnhancedButton>
    </div>
  )
}
