-- Reset Database Script for Functional Testing
-- Clears all user-generated data but keeps structural reference data (Projects)

-- Clear transactional tables
DELETE FROM tasks;
DELETE FROM milestones;
DELETE FROM risks;

-- Reset and re-seed projects to ensure clean state matchin UI
DELETE FROM projects;
(1, 'WEB_REDESIGN_P1', 'Pending', 65),
(2, 'API_INTEGRATION_MA', 'Pending', 25),
(3, 'Q4_MKT_CAMPAIGN', 'Pending', 15);

-- Reset Milestones
DELETE FROM milestones;
INSERT INTO milestones (project_id, name, date_range, is_completed, is_active, sub_task_name, sub_task_progress, sub_task_note) VALUES
(1, 'Phase 1: Research', 'Oct 1 - Oct 15', 1, 0, NULL, 0, NULL),
(1, 'Phase 2: Design', 'Oct 16 - Oct 30', 0, 1, 'UI Mockups', 60, 'Review pending'),
(1, 'Phase 3: Dev', 'Nov 1 - Nov 30', 0, 0, NULL, 0, NULL);

-- Reset Risks
DELETE FROM risks;
INSERT INTO risks (project_id, type, title, description, severity) VALUES
(1, 'warning', 'Resource Shortage', 'Backend dev unavailable next week', 'high'),
(1, 'info', 'Budget Review', 'Quarterly review upcoming', 'low');


-- Reset Resources
DELETE FROM resources;
INSERT INTO resources (id, name, role, hourly_rate) VALUES
(1, 'Alice Johnson', 'Frontend Dev', 120.00),
(2, 'Bob Smith', 'Backend Dev', 135.00),
(3, 'Charlie Brown', 'Designer', 95.00),
(4, 'Diana Prince', 'Project Manager', 150.00);

-- Reset Project Budgets
DELETE FROM project_budgets;
INSERT INTO project_budgets (project_id, total_budget) VALUES
(1, 50000.00), -- Web Redesign
(2, 30000.00), -- API Integration
(3, 15000.00); -- Marketing Campaign

-- Reset Task Allocations (requires tasks to exist, but tasks are deleted above)
-- We'll assume tasks will be created via UI or we should insert dummy tasks here if needed for testing?
-- For now, let's just clean the alloc table
DELETE FROM task_resources;

