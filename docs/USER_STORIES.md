# User Stories

This document outlines the core user stories for the Project Control Center, categorized by user roles using the standard format:
> "As a **[role]**, I want to **[feature/action]** so that **[benefit/value]**."

## 👨‍💼 Project Manager (PM)

### Dashboard & Overview
- **As a PM**, I want to see a high-level dashboard of all active projects, so that I can quickly identify which ones need attention.
- **As a PM**, I want to view a timeline of key milestones, so that I can ensure the project is on track for delivery.
- **As a PM**, I want to see a "Risks & Notes" section, so that I can proactively manage potential blockers.

### Task Management
- **As a PM**, I want to create new tasks with details like assignee, priority, and deadline, so that the team knows exactly what needs to be done.
- **As a PM**, I want to assign tasks to specific team members, so that there is clear ownership.
- **As a PM**, I want to filter tasks by "Critical" or "High" priority, so that I can focus on the most urgent items first.

### Gantt Chart
- **As a PM**, I want a visual Gantt chart of the project schedule, so that I can understand task dependencies and overlapping timelines.
- **As a PM**, I want to see progress bars on tasks in the Gantt chart, so I know how much work is remaining.

---

## 👩‍💻 Developer / Team Member

### Task Tracking
- **As a Developer**, I want to see a list of tasks assigned specifically to me, so that I know what to work on today.
- **As a Developer**, I want to update the progress of my tasks (e.g., from 0% to 50%), so that the PM and team are aware of my status.
- **As a Developer**, I want to mark a task as "Blocked" and add a reason, so that the team can help resolve the issue.

### Collaboration
- **As a Developer**, I want to see task details including description and technical notes, so that I have all the context needed to start working.

---

## 🤝 Stakeholder / Executive

### Visibility
- **As a Stakeholder**, I want to view the project health status (e.g., "On Track", "At Risk"), so that I can report to upper management without asking the PM constantly.
- **As a Stakeholder**, I want to see the key milestones achieved vs. remaining, so that I can gauge the release readiness.

---

##  Acceptance Criteria (Example)

### Feature: Task List - Priority Filtering
- [ ] User can click a "Priority" filter button.
- [ ] List updates to show only tasks matching the selected priority (e.g., High).
- [ ] A visual indicator shows the active filter.
- [ ] Users can clear the filter to see all tasks again.
