# Story 1.3: Project Health Status Indicators

Status: done

## Story

As a **Stakeholder**,
I want to see project health status (On Track, At Risk, Delayed),
So that I can report to management without asking the PM.

## Acceptance Criteria

1. Color-coded health indicator visible (green=On Track, yellow=At Risk, red=Delayed)
2. Hovering shows the reason for the status
3. Status automatically updates based on overdue tasks

## Tasks / Subtasks

- [x] Task 1: Review existing ProjectList.svelte
- [ ] Task 2: Add health status indicator with colors
- [ ] Task 3: Add tooltip on hover for status reason
- [ ] Task 4: Calculate health based on project data

## Dev Notes

### Implementation Approach
- Add health indicator dot/badge before project name
- Use title attribute for simple tooltip
- Color mapping: green=#22c55e, yellow=#eab308, red=#ef4444
- Calculate health from progress % and status

### References
- [Source: epics.md#Story-1.3] - Original acceptance criteria
