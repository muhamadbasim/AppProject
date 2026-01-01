---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments:
  - PRD.md
  - docs/ARCHITECTURE.md
  - docs/USER_STORIES.md
  - docs/API.md
  - docs/COMPONENTS.md
---

# AppProject - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Project Control Center, decomposing the requirements from the PRD, Architecture, and User Stories into implementable stories.

## Requirements Inventory

### Functional Requirements

**From PRD & User Stories:**

FR1: System must support Progressive Web App (PWA) functionality for desktop and mobile
FR2: System must provide task creation with assignee, priority levels, and deadline fields
FR3: System must support task assignment to specific team members
FR4: System must provide deadline tracking and progress monitoring (0-100%)
FR5: System must display interactive Gantt chart with task dependencies visualization
FR6: System must show progress bars on tasks in Gantt chart view
FR7: System must support drag-and-drop rescheduling in Gantt chart
FR8: System must display timeline view with milestones and key dates
FR9: System must show project phases/stages in timeline
FR10: System must provide high-level dashboard with all active projects
FR11: System must display "Risks & Notes" section for proactive blocker management
FR12: System must support task filtering by priority (Critical, High, etc.)
FR13: System must allow developers to mark tasks as "Blocked" with reason
FR14: System must show task details including description and technical notes
FR15: System must display project health status (On Track, At Risk, etc.)
FR16: System must show milestones achieved vs remaining
FR17: System must support resource allocation and budget tracking
FR18: System must provide real-time collaboration between team members
FR19: System must send notifications for deadlines and status changes
FR20: System must support data export (PDF, Excel)
FR21: System must provide real-time data synchronization

### Non-Functional Requirements

**From PRD & Architecture:**

NFR1: Performance - Application must load within 3 seconds on 3G networks (PWA optimized)
NFR2: Responsiveness - UI must be fully responsive across mobile and desktop viewports
NFR3: Availability - Zero-downtime deployment via Cloudflare edge network
NFR4: Technology Stack - Must use Bun runtime, Hono backend, Svelte 5 frontend
NFR5: Deployment - Automated CI/CD via GitHub Actions to Cloudflare Pages/Workers
NFR6: Offline Support - PWA must function offline with cached data
NFR7: Security - API endpoints must be properly secured
NFR8: Scalability - Edge computing architecture for global performance

### Additional Requirements

**From Architecture Document:**

- Backend API runs as Cloudflare Worker using Hono framework
- Frontend deploys to Cloudflare Pages as static site
- Database uses Cloudflare D1 (SQLite) for persistence
- Existing schema includes: projects, tasks tables
- API endpoints already defined: `/api/tasks`, `/api/projects`, `/api/dashboard/metrics`
- GitHub Actions workflows already configured for deployment
- Design system uses "Regal Black & Gold" theme via Tailwind CSS

**Current Implementation Status (Brownfield):**
- ✅ Dashboard view with metrics and project list
- ✅ Task List view with CRUD operations
- ✅ Gantt Chart view (basic implementation)
- ✅ Timeline view with milestones
- ✅ API endpoints for tasks/projects/dashboard
- ⚠️ Resource allocation - NOT YET IMPLEMENTED
- ⚠️ Budget tracking - NOT YET IMPLEMENTED
- ⚠️ Real-time collaboration - NOT YET IMPLEMENTED
- ⚠️ Notifications - NOT YET IMPLEMENTED
- ⚠️ Export functionality - NOT YET IMPLEMENTED
- ⚠️ Drag-and-drop Gantt - NOT YET IMPLEMENTED

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | PWA foundation |
| FR2 | Epic 2 | Task creation with details |
| FR3 | Epic 2 | Task assignment |
| FR4 | Epic 2 | Progress monitoring |
| FR5 | Epic 3 | Gantt chart dependencies |
| FR6 | Epic 3 | Gantt progress bars |
| FR7 | Epic 3 | Drag-and-drop Gantt |
| FR8 | Epic 4 | Timeline milestones |
| FR9 | Epic 4 | Project phases |
| FR10 | Epic 1 | Dashboard overview |
| FR11 | Epic 4 | Risks & Notes |
| FR12 | Epic 2 | Priority filtering |
| FR13 | Epic 2 | Blocked status |
| FR14 | Epic 2 | Task details view |
| FR15 | Epic 1 | Project health status |
| FR16 | Epic 4 | Milestone tracking |
| FR17 | Epic 5 | Resource & budget |
| FR18 | Epic 6 | Real-time collaboration |
| FR19 | Epic 6 | Notifications |
| FR20 | Epic 7 | Export functionality |
| FR21 | Epic 6 | Real-time sync |

## Epic List

### Epic 1: Core Dashboard & Project Overview
**Goal:** Users can view a high-level dashboard showing all active projects, their health status, and key metrics at a glance.

**User Outcome:** Project managers and stakeholders get immediate visibility into project status without drilling into details.

**FRs Covered:** FR1, FR10, FR15

**Implementation Notes:**
- Existing Dashboard.svelte already implements this ✅
- Enhance with better health status indicators
- PWA manifest and service worker setup

---

### Epic 2: Task Management & Details
**Goal:** Users can create, assign, track, and manage tasks with full details including priority, status, progress, and blockers.

**User Outcome:** Team members have clear ownership and visibility of their work. PMs can effectively manage task assignments and track progress.

**FRs Covered:** FR2, FR3, FR4, FR12, FR13, FR14

**Implementation Notes:**
- TaskList.svelte and TaskForm.svelte exist ✅
- Add priority filtering (partially done)
- Implement "Blocked" status with reason field
- Enhance TaskDetail.svelte with technical notes

---

### Epic 3: Interactive Gantt Chart
**Goal:** Users can visualize project schedule with task dependencies, progress indicators, and drag-and-drop rescheduling.

**User Outcome:** PMs can understand task dependencies, identify scheduling conflicts, and quickly adjust timelines.

**FRs Covered:** FR5, FR6, FR7

**Implementation Notes:**
- GanttChart.svelte exists (basic) ✅
- Add dependency arrows/lines
- Implement drag-and-drop for rescheduling
- Connect to API for persistence

---

### Epic 4: Timeline & Milestone Management
**Goal:** Users can view project phases, milestones, and track risks/notes in a timeline format.

**User Outcome:** Stakeholders can gauge release readiness and PMs can proactively manage blockers.

**FRs Covered:** FR8, FR9, FR11, FR16

**Implementation Notes:**
- TimelineView.svelte exists ✅
- MilestoneItem.svelte exists ✅
- Enhance with editable milestones
- Connect risks/notes to database

---

### Epic 5: Resource Allocation & Budget Tracking
**Goal:** Users can allocate resources to tasks and track project budgets with visualization.

**User Outcome:** PMs can optimize resource utilization and stakeholders can monitor budget health.

**FRs Covered:** FR17

**Implementation Notes:**
- NEW FEATURE - Not yet implemented ⚠️
- Requires new database schema (resources, budget tables)
- New API endpoints needed
- New UI components for resource/budget views

---

### Epic 6: Real-time Collaboration & Notifications
**Goal:** Users receive notifications for deadlines and status changes, with real-time sync across team members.

**User Outcome:** Team stays informed and synchronized without manual refresh or communication overhead.

**FRs Covered:** FR18, FR19, FR21

**Implementation Notes:**
- NEW FEATURE - Not yet implemented ⚠️
- Consider WebSocket or Server-Sent Events
- Toast notification system (Toast.svelte exists)
- Cloudflare Durable Objects for real-time state

---

### Epic 7: Data Export & Reporting
**Goal:** Users can export project data to PDF and Excel formats for reporting and archival.

**User Outcome:** Stakeholders can generate reports for management, and teams can archive project data.

**FRs Covered:** FR20

**Implementation Notes:**
- NEW FEATURE - Not yet implemented ⚠️
- Client-side PDF generation (jsPDF or similar)
- Excel export (SheetJS/xlsx library)
- Add export buttons to relevant views

---

## Detailed Stories

## Epic 1: Core Dashboard & Project Overview

### Story 1.1: PWA Setup & Manifest

As a **user**,
I want the application to be installable as a Progressive Web App,
So that I can access it from my home screen and use it offline.

**Acceptance Criteria:**

**Given** I am on the application homepage
**When** I view the browser's install prompt or use "Add to Home Screen"
**Then** the app installs with proper name, icons, and theme colors
**And** the app launches in standalone mode without browser UI

**Given** I have installed the PWA
**When** I open the app while offline
**Then** cached pages and data are displayed
**And** a clear offline indicator is shown

---

### Story 1.2: Dashboard Metrics Display

As a **Project Manager**,
I want to see key metrics on the dashboard,
So that I can quickly assess overall project health.

**Acceptance Criteria:**

**Given** I am on the Dashboard view
**When** the page loads
**Then** I see metrics for: Active Projects, Pending Review, Tasks Completed, System Load
**And** metrics are fetched from `/api/dashboard/metrics` endpoint
**And** loading skeletons are shown while data loads

**Given** the API returns an error
**When** the dashboard attempts to load metrics
**Then** an error message is displayed gracefully
**And** a retry option is available

---

### Story 1.3: Project Health Status Indicators

As a **Stakeholder**,
I want to see project health status (On Track, At Risk, Delayed),
So that I can report to management without asking the PM.

**Acceptance Criteria:**

**Given** I am viewing the project list
**When** I see a project entry
**Then** a color-coded health indicator is visible (green=On Track, yellow=At Risk, red=Delayed)
**And** hovering shows the reason for the status

**Given** a project has overdue tasks
**When** the health is calculated
**Then** the status automatically updates to "At Risk" or "Delayed"

---

## Epic 2: Task Management & Details

### Story 2.1: Task Creation with Full Details

As a **Project Manager**,
I want to create new tasks with assignee, priority, and deadline,
So that the team knows exactly what needs to be done.

**Acceptance Criteria:**

**Given** I am on the Task List view
**When** I click "Add Task" button
**Then** a form appears with fields: Name, Description, Assignee, Priority (Critical/High/Medium/Low), Deadline, Status

**Given** I fill out the task form and submit
**When** the API call succeeds
**Then** the new task appears in the task list
**And** a success toast notification is shown

---

### Story 2.2: Task Assignment & Ownership

As a **Project Manager**,
I want to assign tasks to specific team members,
So that there is clear ownership.

**Acceptance Criteria:**

**Given** I am viewing a task
**When** I select an assignee from the dropdown
**Then** the task is updated with the new assignee
**And** the assignee name is displayed on the task card

**Given** I am a Developer
**When** I view the task list
**Then** I can filter to see only tasks assigned to me

---

### Story 2.3: Task Progress Tracking

As a **Developer**,
I want to update the progress of my tasks (0-100%),
So that the PM and team are aware of my status.

**Acceptance Criteria:**

**Given** I am viewing my assigned task
**When** I update the progress slider or input
**Then** the progress percentage is saved to the database
**And** the progress bar updates visually in real-time

**Given** I set progress to 100%
**When** I save the task
**Then** the task status automatically changes to "Done"

---

### Story 2.4: Priority Filtering

As a **Project Manager**,
I want to filter tasks by priority (Critical, High, etc.),
So that I can focus on the most urgent items first.

**Acceptance Criteria:**

**Given** I am on the Task List view
**When** I click a priority filter button (e.g., "Critical")
**Then** only tasks matching that priority are shown
**And** a visual indicator shows the active filter

**Given** a filter is active
**When** I click "Clear Filter" or the same filter again
**Then** all tasks are shown again

---

### Story 2.5: Blocked Status with Reason

As a **Developer**,
I want to mark a task as "Blocked" and add a reason,
So that the team can help resolve the issue.

**Acceptance Criteria:**

**Given** I am viewing a task I own
**When** I change status to "Blocked"
**Then** a text field appears for entering the blocker reason
**And** I must enter a reason before saving

**Given** a task is marked as Blocked
**When** the task is displayed in any list
**Then** a red "Blocked" badge is visible
**And** hovering shows the blocker reason

---

### Story 2.6: Enhanced Task Details View

As a **Developer**,
I want to see task details including description and technical notes,
So that I have all the context needed to start working.

**Acceptance Criteria:**

**Given** I click on a task in any view
**When** the BottomSheet opens with TaskDetail
**Then** I see: Name, Description, Assignee, Priority, Status, Progress, Technical Notes, Dependencies

**Given** technical notes are empty
**When** I view the task detail
**Then** a placeholder text encourages adding notes
**And** I can edit and save notes inline

---

## Epic 3: Interactive Gantt Chart

### Story 3.1: Gantt Dependency Visualization

As a **Project Manager**,
I want to see task dependencies as arrows on the Gantt chart,
So that I can understand which tasks must complete before others.

**Acceptance Criteria:**

**Given** tasks have dependency relationships defined
**When** I view the Gantt chart
**Then** arrows/lines connect dependent tasks visually
**And** the arrow points from predecessor to successor

**Given** I hover over a dependency line
**When** the tooltip appears
**Then** it shows the dependency type (Finish-to-Start, etc.)

---

### Story 3.2: Gantt Progress Bars

As a **Project Manager**,
I want to see progress bars on tasks in the Gantt chart,
So that I know how much work is remaining.

**Acceptance Criteria:**

**Given** I am viewing the Gantt chart
**When** I look at a task bar
**Then** a filled portion represents the progress percentage
**And** the percentage is shown as text on the bar

---

### Story 3.3: Drag-and-Drop Rescheduling

As a **Project Manager**,
I want to drag tasks on the Gantt chart to reschedule them,
So that I can quickly adjust timelines.

**Acceptance Criteria:**

**Given** I am viewing the Gantt chart
**When** I drag a task bar horizontally
**Then** the task dates update in real-time visually
**And** when I drop, the new dates are saved to the database

**Given** I drag a task that has dependencies
**When** I release the task bar
**Then** I am warned if the new dates conflict with dependencies
**And** I can choose to proceed or cancel

---

## Epic 4: Timeline & Milestone Management

### Story 4.1: Milestone Display on Timeline

As a **PM**,
I want to view key milestones on the timeline,
So that I can ensure the project is on track for delivery.

**Acceptance Criteria:**

**Given** I am on the Timeline view
**When** milestones are defined for the project
**Then** they appear as distinct markers on the timeline
**And** each milestone shows its name and target date

---

### Story 4.2: Project Phases Visualization

As a **Stakeholder**,
I want to see project phases on the timeline,
So that I can understand the project's overall structure.

**Acceptance Criteria:**

**Given** I am viewing the Timeline
**When** phases are defined (e.g., "Planning", "Development", "Testing")
**Then** they appear as colored bands spanning their date ranges
**And** the current phase is highlighted

---

### Story 4.3: Risks & Notes Management

As a **PM**,
I want to add and view risks/notes for proactive blocker management,
So that potential issues are tracked and visible.

**Acceptance Criteria:**

**Given** I am on the Timeline view
**When** I click "Add Risk/Note"
**Then** a form appears to enter the risk description and severity
**And** the risk is saved and displayed in the Risks section

**Given** risks exist
**When** I view the Timeline
**Then** a summary shows high/medium/low risk counts
**And** I can click to see full details

---

### Story 4.4: Milestone Progress Tracking

As a **Stakeholder**,
I want to see milestones achieved vs remaining,
So that I can gauge release readiness.

**Acceptance Criteria:**

**Given** I am viewing the project
**When** milestones have completion status
**Then** I see a count: "3 of 5 milestones complete"
**And** completed milestones are visually distinguished (checkmark/strikethrough)

---

## Epic 5: Resource Allocation & Budget Tracking

### Story 5.1: Resource Database Setup

As a **System**,
I need resource and budget tables created,
So that resource allocation features can be implemented.

**Acceptance Criteria:**

**Given** the database needs new tables
**When** the migration runs
**Then** `resources` table is created with: id, name, type, hourly_rate
**And** `task_resources` table links tasks to resources with hours
**And** `project_budgets` table tracks budget per project

---

### Story 5.2: Resource Allocation to Tasks

As a **PM**,
I want to allocate team members/resources to tasks,
So that I can track who is working on what.

**Acceptance Criteria:**

**Given** I am editing a task
**When** I click "Assign Resources"
**Then** I can select from available team members/resources
**And** I can specify hours allocated per resource

**Given** resources are assigned
**When** I view the task
**Then** assigned resources and their hours are displayed

---

### Story 5.3: Budget Tracking Dashboard

As a **PM**,
I want to track project budget vs actual spend,
So that I can monitor budget health.

**Acceptance Criteria:**

**Given** I am on the Dashboard or Project view
**When** budget data exists
**Then** I see: Total Budget, Spent, Remaining
**And** a progress bar shows budget utilization percentage

**Given** spending exceeds 80% of budget
**When** the budget is displayed
**Then** a warning indicator is shown

---

## Epic 6: Real-time Collaboration & Notifications

### Story 6.1: Toast Notification System

As a **Team Member**,
I want to receive in-app notifications for important events,
So that I stay informed without checking constantly.

**Acceptance Criteria:**

**Given** I am using the application
**When** a notification event occurs (deadline, status change)
**Then** a toast notification appears in the corner
**And** the notification auto-dismisses after 5 seconds
**And** I can click to see more details

---

### Story 6.2: Deadline Reminder Notifications

As a **Developer**,
I want to be notified when my task deadlines are approaching,
So that I don't miss important dates.

**Acceptance Criteria:**

**Given** I have a task due within 24 hours
**When** I open the application
**Then** I see a notification about the upcoming deadline
**And** the task is highlighted in my task list

---

### Story 6.3: Real-time Data Sync

As a **Team Member**,
I want changes made by others to appear instantly,
So that we're all seeing the same data.

**Acceptance Criteria:**

**Given** I am viewing a project
**When** another user updates a task
**Then** the change appears on my screen within 2 seconds
**And** a subtle animation indicates the update

---

## Epic 7: Data Export & Reporting

### Story 7.1: Export to PDF

As a **Stakeholder**,
I want to export project data to PDF,
So that I can share reports with management.

**Acceptance Criteria:**

**Given** I am on the Dashboard or Project view
**When** I click "Export PDF"
**Then** a PDF is generated with project metrics, task list, and timeline
**And** the PDF downloads automatically

---

### Story 7.2: Export to Excel

As a **PM**,
I want to export task data to Excel,
So that I can analyze data in spreadsheets.

**Acceptance Criteria:**

**Given** I am on the Task List view
**When** I click "Export Excel"
**Then** an XLSX file is generated with all task data
**And** columns include: Name, Assignee, Priority, Status, Progress, Deadline
**And** the file downloads automatically
