# UI Quality Issues and Improvement Recommendations

## Current State Analysis (Manual Testing Results)

### ✅ What Works Well

1. **Basic Edit Functionality**: Task title and notes editing works correctly
2. **Priority Display**: P0, P1, P2 priorities are shown with badges
3. **Tag Display**: Tags are correctly parsed and displayed (#urgent, #test)
4. **Due Date Display**: When properly formatted, shows "Due: 8/20/2025"
5. **Task Creation**: QuickAdd functionality works with complex syntax
6. **Success Feedback**: Toast notifications appear on successful operations

### ❌ Critical UI Quality Issues

## 1. Edit Form is Severely Limited (Major Issue)

**Current State:**

- Only has `Task Title` and `Notes` fields
- Missing: Priority editing, Tags editing, Due date picker, Status/column selection

**User Impact:**

- Cannot change priority after creation
- Cannot modify tags without recreating task
- Cannot set/change due dates in edit mode
- Very poor user experience compared to modern task managers

**Recommendation:**
Create a comprehensive edit form with:

```typescript
interface TaskEditForm {
  title: string;
  notes?: string;
  priority: 'P0' | 'P1' | 'P2';
  tags: string[];
  dueDate?: Date;
  status: 'TODAY' | 'LATER' | 'DONE';
}
```

## 2. Natural Language Date Parsing is Broken

**Current Issue:**

- Input: `@due:tomorrow 5pm` → Error: "Invalid datetime"
- Only accepts ISO format: `@due:2025-08-19T17:00:00.000Z`

**Root Cause:**
The `resolveDateToken` function only handles:

- `today`, `tomorrow`
- ISO dates (`YYYY-MM-DD`)
- `next monday`, `in 3d`, `in 2w`
- But NOT time specifications like "5pm", "4:30pm"

**User Impact:**

- Examples in UI show `tomorrow 4pm #ops` but this fails
- Users expect natural language like Todoist/Things but get errors
- Very poor user experience for a "competitive" task manager

## 3. Priority System Issues

**Current State:**

- ✅ Default priority: `P1` (hardcoded in `src/domain/quickadd/parse.ts`)
- ✅ System supports: P0 (high), P1 (medium), P2 (low)
- ✅ Parsing works: `!p0`, `!p1`, `!p2`

**Issues:**

- No visual priority indicators (colors are basic)
- No easy way to change priority after creation
- Priority meanings not clear to users (what does P0 vs P1 mean?)

## 4. Due Date Display Issues

**Current State:**

- ✅ Shows "Due: 8/20/2025" when present
- ❌ No overdue highlighting
- ❌ No relative time display ("Due tomorrow", "Overdue 2 days")
- ❌ No time of day shown (only date)

## 5. Missing Modern UI Features

Compared to Trello/Todoist/Things, missing:

- ❌ Drag & drop between columns
- ❌ Task thumbnails/previews
- ❌ Rich text editing
- ❌ File attachments
- ❌ Subtasks/checklists
- ❌ Task templates
- ❌ Bulk operations
- ❌ Advanced filtering/search UI
- ❌ Keyboard shortcuts help overlay

## Implementation Strategy: A-Series vs B-Series

Based on anti-drift analysis, improvements are split into **A-Series (safe now)** and **B-Series (requires approval)** work:

### ✅ A-Series: Immediate Fixes (Safe within current constraints)

**See: `docs/MANAGEMENT_DOC/A-SERIES-UI-HOTFIXES.md`**

1. **Enhanced Edit Form** - Uses existing store methods only
   - Priority dropdown (P0/P1/P2)
   - Tags input with chips and autocomplete from existing tags
   - Due date + time fields (native inputs, no libs)
   - Status selector (maps to existing moveTask())

2. **Due Date Display Upgrades** - Pure UI formatting
   - Relative display: "Due tomorrow", "Overdue 2 days"
   - Time inclusion: "Due today 17:00"
   - Accessible overdue highlighting

3. **Priority System Clarity** - Visual design only
   - Color coding: P0=red, P1=amber, P2=gray
   - Accessible tooltips with meanings
   - Priority legend/help

4. **Quick-Add Error Affordance** - No parser changes
   - Helpful error hints for time parsing failures
   - "Set time in edit form" fallback button
   - Better user guidance without changing engine

### ⛔ B-Series: Advanced Features (Requires explicit approval)

**See: `docs/MANAGEMENT_DOC/B-SERIES-ROADMAP.md`**

1. **Natural Language Parser Enhancement** - Domain logic changes
   - Time parsing: "5pm", "tomorrow 4:30pm"
   - Relative expressions: "in 2 hours", "next Friday"
   - Requires new dependency or major parser rewrite

2. **Drag & Drop** - New dependency (React DnD Kit)
   - Visual drag between columns
   - Touch device support
   - Accessibility complexity

3. **Rich Features** - Store/schema changes
   - Rich text editing (TipTap/Slate)
   - File attachments + storage backend
   - Subtasks (hierarchical store structure)
   - Bulk operations (multi-select state)

4. **Advanced Search** - Engine changes
   - Fuzzy search library
   - Boolean operators
   - Advanced filter UI

## Quality Comparison: Current vs A-Series Target vs B-Series Vision

| Feature         | Current | A-Series Target      | B-Series Vision         |
| --------------- | ------- | -------------------- | ----------------------- |
| Edit Form       | 2/10    | 8/10                 | 9/10                    |
| Date Parsing    | 3/10    | 4/10 (better errors) | 9/10 (natural language) |
| Date Display    | 4/10    | 8/10                 | 9/10                    |
| Visual Design   | 4/10    | 7/10                 | 8/10                    |
| Priority System | 5/10    | 8/10                 | 9/10                    |
| Tag Management  | 2/10    | 7/10                 | 9/10                    |
| Keyboard UX     | 6/10    | 7/10                 | 9/10                    |
| Drag & Drop     | 0/10    | 0/10 (deferred)      | 9/10                    |
| Modern Features | 2/10    | 3/10                 | 8/10                    |

## Development Priority (Respecting Anti-Drift)

**P0 (A-Series - Now):** Enhanced edit form + date display + priority clarity
**P1 (A-Series - Now):** Tag token input + quick-add error hints  
**P2 (B-Series - Later):** Parser enhancements, drag & drop, rich features

## Current Status

✅ **A-Series plan created** - Ready for immediate implementation within existing constraints
⏳ **B-Series roadmap documented** - Requires explicit approval for parser/dependency/store changes

The A-Series improvements will bring the UI from "basic prototype" to "competitive task manager" quality without breaking any anti-drift constraints. B-Series work can then layer advanced features on top of this solid foundation.
