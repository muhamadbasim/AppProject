-- Reset Database Script for Functional Testing
-- Clears all user-generated data but keeps structural reference data (Projects)

-- Clear transactional tables
DELETE FROM tasks;
DELETE FROM milestones;
DELETE FROM risks;

-- Reset and re-seed projects to ensure clean state matchin UI
DELETE FROM projects;
INSERT INTO projects (id, name, status, progress) VALUES
(1, 'WEB_REDESIGN_P1', 'Pending', 0),
(2, 'API_INTEGRATION_MA', 'Pending', 0),
(3, 'Q4_MKT_CAMPAIGN', 'Pending', 0);
