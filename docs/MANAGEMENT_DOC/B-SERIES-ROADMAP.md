# B-Series UX Enhancement Roadmap
*Advanced features requiring parser/engine/dependency changes*

---

## 🚦 Handoff from A-Series

The A-Series UI hotfixes address immediate UX gaps within existing constraints. B-Series work involves features that require:
- Parser/engine modifications
- New dependencies
- Store schema changes
- Backend integration

---

## 🎯 B-Series Scope (Requires Explicit Approval)

### 1. Natural Language Date/Time Parser Enhancement

**Current Limitation**: Parser rejects `tomorrow 5pm`, `in 2 hours`, `next Friday at 2:30pm`

**Required Changes**:
```typescript
// src/domain/quickadd/parse.ts - MAJOR CHANGES NEEDED
function resolveDateToken(token: string): Date | null {
  // Current: Only handles "today", "tomorrow", ISO dates
  // Needed: Time parsing, relative expressions, complex formats
  
  // Add time parsing
  if (token.includes('pm') || token.includes('am')) {
    return parseTimeExpression(token);
  }
  
  // Add relative time
  if (token.includes('in ')) {
    return parseRelativeTime(token);
  }
  
  // Add named days with times
  if (token.includes(' at ')) {
    return parseNamedDayWithTime(token);
  }
}
```

**Dependencies Needed**:
- Date parsing library (date-fns, dayjs, or chrono-node)
- Natural language processing utilities
- Timezone handling

**Impact**:
- Parser logic complexity increases significantly
- New edge cases and error handling required
- Potential breaking changes to existing parsing

**User Value**: ⭐⭐⭐⭐⭐ (High - Core feature expectation)

---

### 2. Drag & Drop with React DnD Kit

**Current State**: Keyboard/menu-based task movement only

**Required Changes**:
```bash
# New dependency
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

```typescript
// New component architecture needed
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

// Major TaskCard refactor for drag handles
// New DroppableColumn components  
// Accessibility integration (keyboard announcements)
// Touch device gesture handling
```

**Complexity**:
- Accessibility compliance (screen reader announcements)
- Touch device support
- Keyboard fallbacks (must not break existing)
- Visual feedback during drag
- Conflict resolution with existing interactions

**User Value**: ⭐⭐⭐⭐ (High - Modern UX expectation)

---

### 3. Rich Text Editing

**Current State**: Plain text notes only

**Options**:
1. **TipTap** (Vue-based, React adapter)
2. **Slate.js** (React-native)
3. **Lexical** (Facebook's new editor)
4. **EditorJS** (Block-based)

**Required Changes**:
```typescript
// Store schema change
interface Task {
  notes?: string; // Current: plain text
  notes?: RichTextDocument; // New: structured content
}

// New component
import { Editor } from '@tiptap/react';
// Or similar for chosen library
```

**Implications**:
- Store migration for existing tasks
- Export/import format changes
- Mobile editing complexity
- Performance impact
- Bundle size increase

**User Value**: ⭐⭐⭐ (Medium - Nice to have for advanced users)

---

### 4. File Attachments

**Current State**: No file support

**Required Changes**:
```typescript
// Store schema
interface Task {
  attachments?: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string; // Storage location
  }[];
}

// Storage backend needed
// File upload/download API
// Thumbnail generation
// File type validation
```

**Dependencies**:
- File storage service (AWS S3, local, etc.)
- Upload progress tracking
- File preview components
- Drag & drop file handling

**User Value**: ⭐⭐⭐ (Medium - Useful but not core)

---

### 5. Advanced Search & Filtering

**Current State**: Basic text search in A4

**Required Engine Changes**:
```typescript
// New search interface
interface SearchEngine {
  search(query: string, filters: SearchFilters): Task[];
  addFilters(filters: FilterConfig[]): void;
  buildIndex(tasks: Task[]): void;
}

interface SearchFilters {
  status?: TaskStatus[];
  priority?: Priority[];
  tags?: string[];
  dateRange?: { start: Date; end: Date };
  hasAttachments?: boolean;
  createdBy?: string;
}
```

**Features Needed**:
- Fuzzy text search (Fuse.js or similar)
- Boolean query operators (AND, OR, NOT)
- Saved search presets
- Search result highlighting
- Advanced filter UI

**Dependencies**:
- Search library (Fuse.js, Lunr.js, or MiniSearch)
- Query parser for complex expressions
- UI components for filter builders

**User Value**: ⭐⭐⭐⭐ (High - Scalability requirement)

---

### 6. Subtasks & Hierarchical Structure

**Current State**: Flat task list

**Required Changes**:
```typescript
// Major store restructure
interface Task {
  parentId?: string; // New field
  children?: string[]; // Task IDs
  depth?: number; // Nesting level
}

// New operations
interface TaskStore {
  addSubtask(parentId: string, task: Partial<Task>): void;
  moveSubtask(taskId: string, newParentId?: string): void;
  getSubtasks(parentId: string): Task[];
  getTaskHierarchy(rootId: string): TaskTree;
}
```

**Complexity**:
- Recursive rendering
- Drag & drop between levels
- Collapse/expand state
- Progress aggregation (parent completion based on children)
- Search/filter across hierarchy

**User Value**: ⭐⭐⭐⭐ (High - Essential for complex projects)

---

### 7. Bulk Operations

**Current State**: Single task operations only

**Required Changes**:
```typescript
// Multi-select state management
interface AppState {
  selectedTasks: Set<string>;
  bulkOperationMode: boolean;
}

// Bulk operation APIs
interface BulkOperations {
  selectAll(column?: TaskStatus): void;
  deselectAll(): void;
  bulkMove(taskIds: string[], newStatus: TaskStatus): void;
  bulkDelete(taskIds: string[]): void;
  bulkEdit(taskIds: string[], changes: Partial<Task>): void;
  bulkExport(taskIds: string[], format: 'json' | 'csv'): void;
}
```

**UI Changes**:
- Checkbox selection mode
- Bulk action toolbar
- Progress indicators for bulk operations
- Undo for bulk changes
- Confirmation dialogs

**User Value**: ⭐⭐⭐ (Medium - Power user feature)

---

### 8. Slash Commands & Quick Actions

**Current State**: QuickAdd with limited syntax

**Required Changes**:
```typescript
// Command parser (separate from date parser)
interface SlashCommand {
  trigger: string;
  description: string;
  execute(args: string[], context: AppContext): Promise<void>;
}

// Built-in commands
const commands: SlashCommand[] = [
  { trigger: '/create', description: 'Create new task', execute: createTask },
  { trigger: '/move', description: 'Move task to column', execute: moveTask },
  { trigger: '/tag', description: 'Add tags to task', execute: addTags },
  { trigger: '/due', description: 'Set due date', execute: setDueDate },
  { trigger: '/search', description: 'Search tasks', execute: searchTasks },
];
```

**Features**:
- Command autocomplete
- Parameter suggestions
- Command history
- Custom command registration
- Keyboard shortcut integration

**User Value**: ⭐⭐⭐⭐ (High - Power user efficiency)

---

## 📋 B-Series Implementation Sequence

### Phase B1: Foundation (2-3 weeks)
1. **Natural Language Parser** - Core UX gap
2. **Advanced Search Engine** - Scalability requirement
3. **Store Schema Migrations** - Enable future features

### Phase B2: Interactions (2-3 weeks)  
4. **Drag & Drop System** - Modern UX expectation
5. **Bulk Operations** - Power user efficiency
6. **Slash Commands** - Advanced workflows

### Phase B3: Content (3-4 weeks)
7. **Rich Text Editing** - Content richness
8. **File Attachments** - Complete task context
9. **Subtask Hierarchy** - Complex project support

---

## 🔍 Decision Framework

### When to Approve B-Series Work

**Criteria for Parser Enhancement (B1)**:
- [ ] A-Series UI hotfixes proven successful
- [ ] User feedback confirms natural language parsing is blocking adoption
- [ ] Willing to accept parser complexity increase
- [ ] Timeline allows for thorough testing of edge cases

**Criteria for Dependency Addition**:
- [ ] Feature provides significant competitive advantage
- [ ] Bundle size impact acceptable (measure before/after)
- [ ] Team comfortable maintaining additional dependency
- [ ] Accessibility requirements can be met

**Criteria for Store Changes**:
- [ ] Migration path planned for existing data
- [ ] Breaking changes minimized or versioned
- [ ] Performance impact measured and acceptable
- [ ] Backup/rollback strategy in place

---

## ⚖️ Risk Assessment

### High Risk Items
- **Parser Changes**: Could break existing QuickAdd functionality
- **Store Schema**: Data migration complexity, backward compatibility
- **Rich Text**: Large bundle size, mobile performance impact

### Medium Risk Items  
- **Drag & Drop**: Accessibility compliance, touch device support
- **File Attachments**: Storage backend, security considerations
- **Bulk Operations**: Performance with large datasets

### Low Risk Items
- **Slash Commands**: Additive feature, easy to disable
- **Advanced Search**: Can be implemented as enhancement layer
- **UI Polish**: Iterative improvements

---

## 🎯 Success Metrics (B-Series)

### User Adoption
- Natural language parsing success rate > 90%
- Advanced search usage > 30% of active users
- Drag & drop vs keyboard usage ratio
- Power feature adoption (bulk ops, slash commands)

### Technical Health
- Bundle size increase < 100KB compressed
- Performance regression < 10% on key interactions
- Accessibility compliance maintained (WCAG 2.1 AA)
- Test coverage > 85% for new features

### Business Value
- User retention improvement
- Time-to-value for complex workflows
- Competitive feature parity achieved
- Enterprise customer requirements met

---

## 🔄 Integration with A-Series

B-Series work must:
1. **Preserve A-Series gains** - No regression in UI quality improvements
2. **Maintain fallbacks** - Advanced features degrade gracefully
3. **Respect accessibility** - New features fully keyboard/screen reader accessible
4. **Keep performance** - No significant impact on core task operations

---

*This document serves as the handoff point from A-Series constraints to B-Series expansion. Each item requires explicit approval and planning before implementation.*
