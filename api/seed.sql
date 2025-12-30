-- Seed data for Project Control Center

-- Create Tables (if not exists)
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    progress INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    progress INTEGER DEFAULT 0,
    project_id INTEGER,
    priority TEXT DEFAULT 'medium',
    assignee TEXT,
    due_days INTEGER DEFAULT 7,
    depends_on INTEGER,
    budget TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (depends_on) REFERENCES tasks(id)
);

CREATE TABLE IF NOT EXISTS milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    name TEXT NOT NULL,
    date_range TEXT,
    icon TEXT,
    is_completed BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 0,
    sub_task_name TEXT,
    sub_task_progress INTEGER,
    sub_task_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS risks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    type TEXT, -- warning, note
    title TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Reset and Insert projects
DELETE FROM projects;
INSERT INTO projects (id, name, status, progress) VALUES
(1, 'WEB_REDESIGN_P1', 'In Progress', 65),
(2, 'API_INTEGRATION_MA', 'Urgent', 25),
(3, 'Q4_MKT_CAMPAIGN', 'In Progress', 15),
(4, 'SERVER_MIGRATION_V3', 'QA', 90),
(5, 'DOC_SYS_UPDATE_2.0', 'Critical', 40);

-- Reset and Insert tasks
DELETE FROM tasks;
INSERT INTO tasks (id, name, status, progress, project_id, priority, assignee, due_days, budget, depends_on) VALUES
(1, 'UX Research', 'Done', 100, 1, 'medium', 'Sarah J.', 0, '$1.2K', NULL),
(2, 'Design Phase', 'In Progress', 45, 1, 'high', 'Mike D.', 3, '$2.5K', 1),
(3, 'API Dev', 'Pending', 0, 2, 'high', 'David T.', 5, '$3.0K', 2),
(4, 'QA Testing', 'Blocked', 10, 2, 'critical', 'Chloe Q.', -1, '$1.5K', 3),
(5, 'Deploy Staging', 'Pending Review', 80, 3, 'medium', 'Adam O.', 2, '$500', 4),
(6, 'Content Draft', 'In Progress', 30, 1, 'low', 'You', 0, '$300', NULL),
(7, 'Database Schema', 'Done', 100, 2, 'high', 'David T.', -2, '$800', NULL),
(8, 'Auth Implementation', 'In Progress', 60, 3, 'high', 'Mike D.', 1, '$2.0K', 7);

-- Reset and Insert milestones
DELETE FROM milestones;
INSERT INTO milestones (project_id, name, date_range, icon, is_completed, is_active, sub_task_name, sub_task_progress, sub_task_note) VALUES
(1, 'Design Phase Complete', 'Oct 1 - Oct 15', 'design_services', 1, 0, NULL, NULL, NULL),
(1, 'Development Sprint 1', 'Oct 16 - Oct 30', 'code', 0, 1, 'Frontend Implementation', 75, 'On track for completion by Oct 25.'),
(1, 'Milestone: Alpha Release', 'October 31', 'flag', 0, 0, NULL, NULL, NULL),
(1, 'QA Testing Phase', 'Nov 1 - Nov 14', 'bug_report', 0, 0, NULL, NULL, NULL);

-- Reset and Insert risks
DELETE FROM risks;
INSERT INTO risks (project_id, type, title, description) VALUES
(1, 'warning', 'Dependency Delay', 'Awaiting final API specifications from partner team. Estimated impact: 2 days.'),
(1, 'note', 'Resource Allocation', 'Reviewing Q1 allocation for upcoming features.');
