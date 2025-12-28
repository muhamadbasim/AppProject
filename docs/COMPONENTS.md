# Component Documentation

## Core Layout Components

### `App.svelte`
The main application shell. It handles:
- **Navigation State**: Manages `activeTab` (gantt, tasks, dashboard, timeline).
- **Layout**: Renders `Header`, `TabBar`, `BottomSheet`, and the active view component.

### `Header.svelte`
Top navigation bar displaying the app title, current time/date, and utility icons.

### `TabBar.svelte`
Bottom navigation bar for switching views on mobile/desktop.
- **Props**:
    - `activeTab` (String): ID of the currently active tab.
    - `onTabChange` (Function): Callback when a tab is selected.

---

## Views

### 1. Dashboard View
**Files**: `Dashboard.svelte`, `MetricCard.svelte`, `ProjectList.svelte`
**Store**: `stores/dashboardStore.js`

- **Dashboard**: Fetches metrics and projects from API on mount. Shows loading skeletons and error states.
- **MetricCard**: Displays a single key performance indicator (KPI) with an icon.
- **ProjectList**: A clickable list of active projects with status indicators and hover effects.

#### Props (ProjectList)
| Prop | Type | Description |
|------|------|-------------|
| `projects` | Array | List of project objects `{id, name, status}` |
| `onProjectClick` | Function | Callback when a project row is clicked |

### 2. Task List View
**Files**: `TaskList.svelte`, `TaskCard.svelte` (legacy/optional)
- **TaskList**: A responsive table/list view of all tasks.
    - Features: Checkbox selection, priority tags, progress bars, hover states.
    - **Note**: Recent updates simplified this to use inline structure for better layout control, reducing reliance on `TaskCard`.

### 3. Gantt Chart View
**Files**: `GanttChart.svelte`
A horizontal timeline visualization of tasks.
- **Features**:
    - **Sticky Sidebar**: Task names stay visible while scrolling time.
    - **Time Grid**: Dynamically generated based on `days` data.
    - **Task Bars**: Positioned absolutely based on `startDay` and `duration`.
    - **Progress**: Visual fill inside task bars.

### 4. Timeline View
**Files**: `TimelineView.svelte`
A vertical timeline highlighting key project milestones.
- **Features**:
    - **Milestone Layout**: Vertical connector line with status-based overlapping prevention.
    - **Status Indicators**: "Active" (pulsing), "Done" (line-through), and normal states.
    - **Risks & Notes**: Summary section for potential blockers.

### 5. Task Detail View
**File**: `TaskDetail.svelte`

Displays detailed task info in CLI-style layout. Opens in BottomSheet when clicking tasks.

#### Trigger
- Click any task in TaskList → opens BottomSheet
- Click any task in GanttChart → opens BottomSheet
- **TaskDetail**: A CLI-terminal inspired view showing granular task data (logs, dependencies, exact budget).

---

## Shared Utilities

### `data.js`
Centralized mock data store for the prototype.
- Exports: `tasks` (Gantt/API), `days` (Calendar), `taskListData` (Task List View).
