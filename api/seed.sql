-- Seed data for Project Control Center
-- Run after schema.sql

-- Insert projects
INSERT INTO projects (id, name, status, progress) VALUES
(1, 'WEB_REDESIGN_P1', 'In Progress', 65),
(2, 'API_INTEGRATION_MA', 'Urgent', 25),
(3, 'Q4_MKT_CAMPAIGN', 'In Progress', 15),
(4, 'SERVER_MIGRATION_V3', 'QA', 90),
(5, 'DOC_SYS_UPDATE_2.0', 'Critical', 40);

-- Insert tasks
INSERT INTO tasks (id, name, status, progress, project_id, priority, assignee, due_days) VALUES
(1, 'UX Research', 'Done', 100, 1, 'medium', 'Sarah J.', 0),
(2, 'Design Phase', 'In Progress', 45, 1, 'high', 'Mike D.', 3),
(3, 'API Dev', 'Pending', 0, 2, 'high', 'David T.', 5),
(4, 'QA Testing', 'Blocked', 10, 2, 'critical', 'Chloe Q.', -1),
(5, 'Deploy Staging', 'Pending Review', 80, 3, 'medium', 'Adam O.', 2),
(6, 'Content Draft', 'In Progress', 30, 1, 'low', 'You', 0),
(7, 'Database Schema', 'Done', 100, 2, 'high', 'David T.', -2),
(8, 'Auth Implementation', 'In Progress', 60, 3, 'high', 'Mike D.', 1);
