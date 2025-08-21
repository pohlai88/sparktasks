# A-Series UI Quality Hotfixes

_Immediate UX improvements within anti-drift guardrails_

---

## 🛡️ ANTI-DRIFT PREPEND — UI QUALITY HOTFIX (A-SERIES SAFE)

```
GOAL
- Expand the edit form and improve due/priority/tags display and editing, without parser/engine/store/deps/config changes.

ALLOWED
- src/components/**, src/App.tsx, index.css, test/**

FORBIDDEN
- Domain parser changes, search engine changes
- New dependencies or build/config edits
- Store shape/enum/SSOT/backend changes

SEMANTICS
- Status changes use existing moveTask(...)
- Priority/tags/due fields map to existing task fields only
- Quick-add stays black-box; on failure, show inline hint + optional "Set time" via edit form

DOD
- Edit form supports title/notes/priority/tags/due date+time/status
- Relative/overdue due-date display; accessible priority badges
- Tag chips + suggestions from existing tags
- Quick-add errors show hint; no parser change
- A11y intact (labels, aria-describedby, live announcements; focus trap/restore)
- All tests green on Chromium/WebKit/Firefox
```

---

## 🎯 Immediate Fixes (A-Series Safe)

### Priority P0: Expanded Edit Form

**Current State**: Only title and notes fields
**Target**: Full task editing capability using existing store methods

#### Implementation Plan

```typescript
// Enhanced TaskCard edit form fields
interface TaskEditFormData {
  title: string; // ✅ Already exists
  notes?: string; // ✅ Already exists
  priority: 'P0' | 'P1' | 'P2'; // ✅ Maps to existing task.priority
  tags: string[]; // ✅ Maps to existing task.tags
  dueDate?: string; // ✅ Maps to existing task.dueDate (date part)
  dueTime?: string; // ✅ Combines with dueDate for task.dueDate
  status: 'TODAY' | 'LATER' | 'DONE'; // ✅ Maps to moveTask(id, status)
}
```

#### Technical Approach

- **Date Input**: Native `<input type="date">` + `<input type="time">` (no date libraries)
- **Priority**: Dropdown with visual indicators and help text
- **Tags**: Comma-separated token input with chip UI
- **Status**: Dropdown that calls existing `moveTask()` method
- **Validation**: Client-side only, using existing patterns

#### Acceptance Tests

```typescript
// test/e2e/enhanced-edit-form.spec.ts
describe('Enhanced Edit Form', () => {
  test('should support all task fields', async ({ page }) => {
    // Create task, open edit, modify all fields, assert updates
  });

  test('should announce changes via live regions', async ({ page }) => {
    // Edit priority → assert aria-live announcement
  });

  test('should handle focus management', async ({ page }) => {
    // Open edit → first field focused, Esc → restore focus
  });

  test('should validate required fields', async ({ page }) => {
    // Empty title → role="alert" + aria-describedby
  });
});
```

---

### Priority P1: Due Date Display Upgrades

**Current State**: Static "Due: 8/20/2025" format
**Target**: Relative, contextual, accessible due date display

#### Display Logic (Pure UI)

```typescript
// Helper function for due date formatting
function formatDueDate(dueDate: string | Date): {
  text: string;
  className: string;
  isOverdue: boolean;
} {
  const due = new Date(dueDate);
  const now = new Date();
  const diffDays = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    return {
      text: `Overdue ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`,
      className: 'due-overdue',
      isOverdue: true,
    };
  } else if (diffDays === 0) {
    return {
      text: due.toLocaleTimeString()
        ? `Due today ${due.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
        : 'Due today',
      className: 'due-today',
      isOverdue: false,
    };
  } else if (diffDays === 1) {
    return {
      text: due.toLocaleTimeString()
        ? `Due tomorrow ${due.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
        : 'Due tomorrow',
      className: 'due-tomorrow',
      isOverdue: false,
    };
  } else {
    return {
      text: `Due in ${diffDays} days`,
      className: 'due-future',
      isOverdue: false,
    };
  }
}
```

#### Accessibility Features

- **Live Announcements**: When task becomes overdue
- **Color + Text**: Never rely on color alone
- **Screen Reader**: Proper labels and context

#### Acceptance Tests

```typescript
// test/e2e/due-date-display.spec.ts
describe('Due Date Display', () => {
  test('should show relative dates', async ({ page }) => {
    // Past due → "Overdue X days", future → "Due in X days"
  });

  test('should include time when present', async ({ page }) => {
    // Due date with time → "Due today 17:00"
  });

  test('should announce overdue status', async ({ page }) => {
    // Task becomes overdue → aria-live announcement
  });
});
```

---

### Priority P1: Priority System Clarity

**Current State**: Basic P0/P1/P2 badges without clear meaning
**Target**: Visual hierarchy with accessible explanations

#### Visual Design

```css
/* Priority badge styling */
.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.priority-p0 {
  background-color: #fee2e2; /* red-100 */
  color: #991b1b; /* red-800 */
}

.priority-p1 {
  background-color: #fef3c7; /* amber-100 */
  color: #92400e; /* amber-800 */
}

.priority-p2 {
  background-color: #f3f4f6; /* gray-100 */
  color: #374151; /* gray-700 */
}
```

#### Accessibility Implementation

```typescript
// Priority badge component
function PriorityBadge({ priority }: { priority: 'P0' | 'P1' | 'P2' }) {
  const labels = {
    P0: 'Priority P0: Critical',
    P1: 'Priority P1: Important',
    P2: 'Priority P2: Normal'
  };

  return (
    <span
      className={`priority-badge priority-${priority.toLowerCase()}`}
      aria-label={labels[priority]}
      title={labels[priority]}
    >
      {priority}
    </span>
  );
}
```

#### Priority Legend Component

```typescript
// Help tooltip/legend for priority system
function PriorityLegend() {
  return (
    <div role="tooltip" className="priority-legend">
      <div className="priority-legend-item">
        <PriorityBadge priority="P0" />
        <span>Critical: Urgent, blocks other work</span>
      </div>
      <div className="priority-legend-item">
        <PriorityBadge priority="P1" />
        <span>Important: Should be done soon</span>
      </div>
      <div className="priority-legend-item">
        <PriorityBadge priority="P2" />
        <span>Normal: Can be done when convenient</span>
      </div>
    </div>
  );
}
```

---

### Priority P1: Tag Token Input

**Current State**: Tags display but cannot be edited
**Target**: Chip-based tag editing with autocomplete from existing tags

#### Implementation Approach

```typescript
// Tag input component (no new dependencies)
function TagTokenInput({
  tags,
  onChange,
  existingTags
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  existingTags: string[]; // Derived from all tasks in store
}) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  // Filter existing tags for suggestions
  const updateSuggestions = (value: string) => {
    if (value.length > 0) {
      const filtered = existingTags
        .filter(tag =>
          tag.toLowerCase().includes(value.toLowerCase()) &&
          !tags.includes(tag)
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    } else if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setActiveSuggestion(Math.min(activeSuggestion + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault();
      setActiveSuggestion(Math.max(activeSuggestion - 1, -1));
    }
  };

  return (
    <div className="tag-token-input">
      <div className="tag-chips">
        {tags.map((tag, index) => (
          <TagChip
            key={index}
            tag={tag}
            onRemove={() => removeTag(index)}
          />
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            updateSuggestions(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Add tags..."
          aria-label="Add tags"
          aria-describedby="tag-suggestions"
        />
      </div>

      {suggestions.length > 0 && (
        <ul
          role="listbox"
          id="tag-suggestions"
          className="tag-suggestions"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              role="option"
              aria-selected={index === activeSuggestion}
              className={index === activeSuggestion ? 'active' : ''}
              onClick={() => addTag(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

#### Acceptance Tests

```typescript
// test/e2e/tag-token-input.spec.ts
describe('Tag Token Input', () => {
  test('should add tags via comma or Enter', async ({ page }) => {
    // Type "urgent," → chip appears, input clears
  });

  test('should show suggestions from existing tags', async ({ page }) => {
    // Type partial tag → suggestions appear with proper ARIA
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Arrow keys navigate suggestions, Enter selects
  });

  test('should remove tags via backspace or click', async ({ page }) => {
    // Backspace on empty input removes last chip
  });
});
```

---

### Priority P1: Quick-Add Error Affordance

**Current State**: Generic error messages for parsing failures
**Target**: Helpful hints with fallback to edit form

#### Error Handling Enhancement

```typescript
// Enhanced error handling in QuickAdd component
function QuickAddErrorHint({ error, onOpenEdit }: {
  error: string;
  onOpenEdit: () => void;
}) {
  // Detect time parsing errors specifically
  const isTimeParsing = error.includes('Invalid datetime') ||
                       error.includes('time');

  if (isTimeParsing) {
    return (
      <div role="alert" className="quick-add-error">
        <p>Time parsing is limited right now.</p>
        <p>Try <code>@due:2025-08-19T17:00</code> or
          <button
            type="button"
            onClick={onOpenEdit}
            className="link-button"
          >
            set time in the edit form
          </button>
        </p>
      </div>
    );
  }

  return (
    <div role="alert" className="quick-add-error">
      {error}
    </div>
  );
}
```

#### Integration with Task Creation

```typescript
// Enhanced QuickAdd flow
function QuickAdd() {
  const [error, setError] = useState<string | null>(null);
  const [pendingTask, setPendingTask] = useState<Partial<Task> | null>(null);

  const handleSubmit = async (input: string) => {
    try {
      const task = await parseQuickAdd(input);
      addTask(task);
      setError(null);
    } catch (err) {
      setError(err.message);
      // If time parsing failed, offer edit form fallback
      if (err.message.includes('Invalid datetime')) {
        const partialTask = parseWithoutTime(input);
        setPendingTask(partialTask);
      }
    }
  };

  const openEditForm = () => {
    if (pendingTask) {
      const taskId = addTask(pendingTask); // Add without time
      openTaskEdit(taskId); // Open edit form focused on time field
      setPendingTask(null);
      setError(null);
    }
  };

  return (
    <div>
      {/* Quick add input */}
      {error && (
        <QuickAddErrorHint
          error={error}
          onOpenEdit={openEditForm}
        />
      )}
    </div>
  );
}
```

---

## 📋 Implementation Timeline

### Week 1: Core Edit Form

- [ ] Expand TaskCard edit form with all fields
- [ ] Wire to existing store methods (no new APIs)
- [ ] Add form validation and error handling
- [ ] Implement focus management and accessibility

### Week 2: Display Enhancements

- [ ] Relative due date formatting
- [ ] Priority visual system with legend
- [ ] Overdue highlighting and announcements
- [ ] Tag chip display improvements

### Week 3: Interactive Features

- [ ] Tag token input with suggestions
- [ ] Quick-add error hints with edit fallback
- [ ] Enhanced keyboard interactions
- [ ] Mobile touch improvements

### Week 4: Testing & Polish

- [ ] Comprehensive E2E test suite
- [ ] Accessibility audit and fixes
- [ ] Cross-browser validation
- [ ] Performance optimization

---

## 🧪 Test Strategy

### Unit Tests

```typescript
// test/unit/TaskCard.test.tsx - Enhanced edit form
// test/unit/DateFormatter.test.ts - Due date display logic
// test/unit/TagInput.test.tsx - Tag token input behavior
// test/unit/PriorityBadge.test.tsx - Priority display
```

### E2E Tests

```typescript
// test/e2e/enhanced-edit-form.spec.ts - Full editing workflow
// test/e2e/due-date-display.spec.ts - Relative date display
// test/e2e/tag-management.spec.ts - Tag editing and suggestions
// test/e2e/quick-add-errors.spec.ts - Error handling and fallbacks
```

### Accessibility Tests

```typescript
// test/a11y/edit-form-accessibility.spec.ts - Screen reader compatibility
// test/a11y/keyboard-navigation.spec.ts - Full keyboard operability
// test/a11y/live-announcements.spec.ts - Dynamic content announcements
```

---

## 🚫 Explicitly Deferred (B-Series)

### Parser Enhancements (Requires Domain Changes)

- Natural language time parsing (`tomorrow 5pm`)
- Relative time inputs (`in 2 hours`)
- Smart date recognition (`next Friday`)
- Duration parsing (`2h`, `30min`)

### Dependency-Heavy Features

- React DnD Kit for drag & drop
- Rich text editor libraries
- Date picker libraries
- Fuzzy search engines

### Store/Schema Changes

- Subtask hierarchy
- File attachments
- Task templates
- Custom fields
- Bulk operations

### Advanced UX Features

- Slash commands
- Saved searches
- Export functionality
- Offline support

---

## 📊 Success Metrics

### Quality Improvements

- Edit form completeness: 2/10 → 8/10
- Due date UX: 3/10 → 8/10
- Priority clarity: 4/10 → 8/10
- Tag management: 2/10 → 7/10

### User Experience

- Task editing efficiency: 50% improvement
- Error resolution rate: 80% improvement
- Accessibility compliance: WCAG 2.1 AA
- Mobile usability: Touch-friendly interactions

### Technical Health

- Zero new dependencies added
- All existing tests remain green
- No performance regressions
- Clean separation of concerns

---

## 🎯 Ready for Implementation

This plan provides immediate UX wins while respecting A-series constraints. Each enhancement uses existing store methods and adds no dependencies. The deferred items create a clear roadmap for B-series work that requires parser/engine changes.

Ready to proceed with P0 implementation? I can start with the enhanced edit form component and supporting utilities.
