import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('/*', cors());

// ============================================================
// FALLBACK DATA (used when D1 is not configured)
// ============================================================

const fallbackTasks = [
    { id: 1, name: "UX Research", status: "Done", progress: 100, project_id: 1, priority: "medium", assignee: "Sarah J.", due_days: 0 },
    { id: 2, name: "Design Phase", status: "In Progress", progress: 45, project_id: 1, priority: "high", assignee: "Mike D.", due_days: 3 },
    { id: 3, name: "API Dev", status: "Pending", progress: 0, project_id: 2, priority: "high", assignee: "David T.", due_days: 5 },
    { id: 4, name: "QA Testing", status: "Blocked", progress: 10, project_id: 2, priority: "critical", assignee: "Chloe Q.", due_days: -1 },
    { id: 5, name: "Deploy Staging", status: "Pending Review", progress: 80, project_id: 3, priority: "medium", assignee: "Adam O.", due_days: 2 },
    { id: 6, name: "Content Draft", status: "In Progress", progress: 30, project_id: 1, priority: "low", assignee: "You", due_days: 0 },
    { id: 7, name: "Database Schema", status: "Done", progress: 100, project_id: 2, priority: "high", assignee: "David T.", due_days: -2 },
    { id: 8, name: "Auth Implementation", status: "In Progress", progress: 60, project_id: 3, priority: "high", assignee: "Mike D.", due_days: 1 },
];

const fallbackProjects = [
    { id: 1, name: "WEB_REDESIGN_P1", status: "In Progress", progress: 65 },
    { id: 2, name: "API_INTEGRATION_MA", status: "Urgent", progress: 25 },
    { id: 3, name: "Q4_MKT_CAMPAIGN", status: "In Progress", progress: 15 },
    { id: 4, name: "SERVER_MIGRATION_V3", status: "QA", progress: 90 },
    { id: 5, name: "DOC_SYS_UPDATE_2.0", status: "Critical", progress: 40 },
];

// Helper to check if D1 is available
const hasD1 = (c) => c.env?.DB;

// ============================================================
// Health check / root endpoint
// ============================================================

app.get('/', (c) => {
    return c.json({
        status: 'ok',
        message: 'Project Control Center API',
        database: hasD1(c) ? 'D1 Connected' : 'Fallback Mode',
        endpoints: ['/api/tasks', '/api/projects', '/api/dashboard/metrics']
    });
});

// ============================================================
// TASKS ENDPOINTS
// ============================================================

app.get('/api/tasks', async (c) => {
    if (hasD1(c)) {
        try {
            const { results } = await c.env.DB.prepare('SELECT * FROM tasks ORDER BY id').all();
            return c.json(results);
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json(fallbackTasks);
        }
    }
    return c.json(fallbackTasks);
});

app.get('/api/tasks/:id', async (c) => {
    const id = parseInt(c.req.param('id'));

    if (hasD1(c)) {
        try {
            const task = await c.env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first();
            if (task) return c.json(task);
            return c.json({ error: 'Task not found' }, 404);
        } catch (e) {
            console.error('D1 Error:', e);
        }
    }

    const task = fallbackTasks.find(t => t.id === id);
    if (task) return c.json(task);
    return c.json({ error: 'Task not found' }, 404);
});

app.post('/api/tasks', async (c) => {
    const body = await c.req.json();

    console.log('POST /api/tasks - Received body:', JSON.stringify(body));

    if (hasD1(c)) {
        try {
            // Ensure all values are defined (D1 doesn't like undefined)
            const name = body.name || 'New Task';
            const status = body.status || 'Pending';
            const progress = body.progress ?? 0;
            const projectId = body.project_id ?? body.projectId ?? 1;
            const priority = body.priority || 'medium';
            const assignee = body.assignee || 'Unassigned';
            const dueDays = body.due_days ?? body.dueDays ?? 7;
            const budget = body.budget || null;
            const dependsOn = body.depends_on ?? body.dependsOn ?? null;

            console.log('POST /api/tasks - Binding values:', { name, status, progress, projectId, priority, assignee, dueDays, budget, dependsOn });

            const result = await c.env.DB.prepare(`
                INSERT INTO tasks (name, status, progress, project_id, priority, assignee, due_days, budget, depends_on)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
                name,
                status,
                progress,
                projectId,
                priority,
                assignee,
                dueDays,
                budget,
                dependsOn
            ).run();

            const newTask = await c.env.DB.prepare('SELECT * FROM tasks WHERE id = ?')
                .bind(result.meta.last_row_id).first();
            return c.json(newTask, 201);
        } catch (e) {
            console.error('D1 Error:', e.message, e.stack);
            return c.json({ error: 'Failed to create task', details: e.message }, 500);
        }
    }

    // Fallback: in-memory (non-persistent)
    const newTask = { id: fallbackTasks.length + 1, ...body };
    fallbackTasks.push(newTask);
    return c.json(newTask, 201);
});

app.put('/api/tasks/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();

    console.log('PUT /api/tasks/:id - Received body:', JSON.stringify(body));

    if (hasD1(c)) {
        try {
            // Ensure all values are defined (D1 doesn't like undefined)
            const name = body.name || 'Unnamed Task';
            const status = body.status || 'Pending';
            const progress = body.progress ?? 0;
            const priority = body.priority || 'medium';
            const assignee = body.assignee || 'Unassigned';
            const dueDays = body.due_days ?? body.dueDays ?? 7;
            const budget = body.budget || null;
            const dependsOn = body.depends_on ?? body.dependsOn ?? null;

            console.log('PUT /api/tasks/:id - Binding values:', { name, status, progress, priority, assignee, dueDays, budget, dependsOn, id });

            await c.env.DB.prepare(`
                UPDATE tasks 
                SET name = ?, status = ?, progress = ?, priority = ?, assignee = ?, due_days = ?, budget = ?, depends_on = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).bind(
                name,
                status,
                progress,
                priority,
                assignee,
                dueDays,
                budget,
                dependsOn,
                id
            ).run();

            const updated = await c.env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first();
            if (updated) return c.json(updated);
            return c.json({ error: 'Task not found' }, 404);
        } catch (e) {
            console.error('D1 Error:', e.message, e.stack);
            return c.json({ error: 'Failed to update task', details: e.message }, 500);
        }
    }

    return c.json({ error: 'Database not configured' }, 500);
});

app.delete('/api/tasks/:id', async (c) => {
    const id = parseInt(c.req.param('id'));

    if (hasD1(c)) {
        try {
            await c.env.DB.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();
            return c.json({ success: true, deleted: id });
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json({ error: 'Failed to delete task' }, 500);
        }
    }

    return c.json({ error: 'Database not configured' }, 500);
});

// ============================================================
// PROJECTS ENDPOINTS
// ============================================================

app.get('/api/projects', async (c) => {
    if (hasD1(c)) {
        try {
            const { results } = await c.env.DB.prepare('SELECT * FROM projects ORDER BY id').all();
            return c.json(results);
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json(fallbackProjects);
        }
    }
    return c.json(fallbackProjects);
});

app.get('/api/projects/:id', async (c) => {
    const id = parseInt(c.req.param('id'));

    if (hasD1(c)) {
        try {
            const project = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
            if (project) {
                const { results: tasks } = await c.env.DB.prepare('SELECT * FROM tasks WHERE project_id = ?').bind(id).all();
                return c.json({ ...project, tasks });
            }
            return c.json({ error: 'Project not found' }, 404);
        } catch (e) {
            console.error('D1 Error:', e);
        }
    }

    const project = fallbackProjects.find(p => p.id === id);
    if (project) {
        const projectTasks = fallbackTasks.filter(t => t.project_id === id);
        return c.json({ ...project, tasks: projectTasks });
    }
    return c.json({ error: 'Project not found' }, 404);
});

app.put('/api/projects/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();

    console.log('PUT /api/projects/:id - Received body:', JSON.stringify(body));

    if (hasD1(c)) {
        try {
            const name = body.name || 'Unnamed Project';
            const status = body.status || 'Pending';
            const progress = body.progress ?? 0;

            console.log('PUT /api/projects/:id - Binding values:', { name, status, progress, id });

            await c.env.DB.prepare(`
                UPDATE projects 
                SET name = ?, status = ?, progress = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).bind(
                name,
                status,
                progress,
                id
            ).run();

            const updated = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
            if (updated) return c.json(updated);
            return c.json({ error: 'Project not found' }, 404);
        } catch (e) {
            console.error('D1 Error:', e.message, e.stack);
            return c.json({ error: 'Failed to update project', details: e.message }, 500);
        }
    }

    // Fallback in-memory
    const projectIndex = fallbackProjects.findIndex(p => p.id === id);
    if (projectIndex !== -1) {
        fallbackProjects[projectIndex] = { ...fallbackProjects[projectIndex], ...body };
        return c.json(fallbackProjects[projectIndex]);
    }

    return c.json({ error: 'Project not found' }, 404);
});

app.post('/api/projects', async (c) => {
    const body = await c.req.json();

    if (hasD1(c)) {
        try {
            const result = await c.env.DB.prepare(`
                INSERT INTO projects (name, status, progress)
                VALUES (?, ?, ?)
            `).bind(
                body.name || 'New Project',
                body.status || 'Pending',
                body.progress || 0
            ).run();

            const newProject = await c.env.DB.prepare('SELECT * FROM projects WHERE id = ?')
                .bind(result.meta.last_row_id).first();
            return c.json(newProject, 201);
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json({ error: 'Failed to create project' }, 500);
        }
    }

    return c.json({ error: 'Database not configured' }, 500);
});

// ============================================================
// MILESTONES ENDPOINTS
// ============================================================

app.get('/api/milestones', async (c) => {
    const projectId = c.req.query('projectId');
    if (hasD1(c)) {
        try {
            let query = 'SELECT * FROM milestones';
            if (projectId) {
                const { results } = await c.env.DB.prepare(query + ' WHERE project_id = ? ORDER BY id').bind(projectId).all();
                return c.json(results);
            }
            const { results } = await c.env.DB.prepare(query + ' ORDER BY id').all();
            return c.json(results);
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json({ error: 'Failed to fetch milestones' }, 500);
        }
    }
    return c.json([]);
});

app.post('/api/milestones', async (c) => {
    const body = await c.req.json();
    if (hasD1(c)) {
        try {
            const result = await c.env.DB.prepare(`
                INSERT INTO milestones (project_id, name, date_range, icon, is_completed, is_active, sub_task_name, sub_task_progress, sub_task_note)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
                body.project_id,
                body.name,
                body.date_range,
                body.icon,
                body.is_completed ? 1 : 0,
                body.is_active ? 1 : 0,
                body.sub_task_name,
                body.sub_task_progress,
                body.sub_task_note
            ).run();
            return c.json({ success: true, id: result.meta.last_row_id }, 201);
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json({ error: 'Failed to create milestone' }, 500);
        }
    }
    return c.json({ error: 'D1 not available' }, 500);
});

// ============================================================
// RISKS ENDPOINTS
// ============================================================

app.get('/api/risks', async (c) => {
    const projectId = c.req.query('projectId');
    if (hasD1(c)) {
        try {
            let query = 'SELECT * FROM risks';
            if (projectId) {
                const { results } = await c.env.DB.prepare(query + ' WHERE project_id = ? ORDER BY id').bind(projectId).all();
                return c.json(results);
            }
            const { results } = await c.env.DB.prepare(query + ' ORDER BY id').all();
            return c.json(results);
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json({ error: 'Failed to fetch risks' }, 500);
        }
    }
    return c.json([]);
});

app.post('/api/risks', async (c) => {
    const body = await c.req.json();
    if (hasD1(c)) {
        try {
            const result = await c.env.DB.prepare(`
                INSERT INTO risks (project_id, type, title, description)
                VALUES (?, ?, ?, ?)
            `).bind(
                body.project_id,
                body.type,
                body.title,
                body.description
            ).run();
            return c.json({ success: true, id: result.meta.last_row_id }, 201);
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json({ error: 'Failed to create risk' }, 500);
        }
    }
    return c.json({ error: 'D1 not available' }, 500);
});


// ============================================================
// RESOURCES & BUDGET ENDPOINTS (Epic 5)
// ============================================================

// Story 5.1: Resources
app.get('/api/resources', async (c) => {
    if (hasD1(c)) {
        try {
            const { results } = await c.env.DB.prepare('SELECT * FROM resources ORDER BY name').all();
            return c.json(results);
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json({ error: 'Failed to fetch resources' }, 500);
        }
    }
    // Mock data for fallback testing
    return c.json([
        { id: 1, name: 'Alice Johnson', role: 'Frontend Dev', hourly_rate: 120 },
        { id: 2, name: 'Bob Smith', role: 'Backend Dev', hourly_rate: 135 },
        { id: 3, name: 'Charlie Brown', role: 'Designer', hourly_rate: 95 }
    ]);
});

app.post('/api/resources', async (c) => {
    const body = await c.req.json();
    if (hasD1(c)) {
        try {
            const result = await c.env.DB.prepare(`
                INSERT INTO resources (name, role, hourly_rate)
                VALUES (?, ?, ?)
            `).bind(body.name, body.role, body.hourly_rate).run();
            return c.json({ success: true, id: result.meta.last_row_id }, 201);
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json({ error: 'Failed to create resource' }, 500);
        }
    }
    return c.json({ error: 'D1 not available' }, 500);
});

// Story 5.2: Resource Allocation
app.get('/api/tasks/:id/resources', async (c) => {
    const taskId = c.req.param('id');
    if (hasD1(c)) {
        try {
            const { results } = await c.env.DB.prepare(`
                SELECT tr.*, r.name, r.role, r.hourly_rate 
                FROM task_resources tr
                JOIN resources r ON tr.resource_id = r.id
                WHERE tr.task_id = ?
            `).bind(taskId).all();
            return c.json(results);
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json({ error: 'Failed to fetch task resources' }, 500);
        }
    }
    return c.json([]);
});

app.post('/api/tasks/:id/resources', async (c) => {
    const taskId = c.req.param('id');
    const body = await c.req.json();
    if (hasD1(c)) {
        try {
            const result = await c.env.DB.prepare(`
                INSERT INTO task_resources (task_id, resource_id, allocated_hours)
                VALUES (?, ?, ?)
            `).bind(taskId, body.resource_id, body.allocated_hours).run();
            return c.json({ success: true, id: result.meta.last_row_id }, 201);
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json({ error: 'Failed to allocate resource' }, 500);
        }
    }
    return c.json({ error: 'D1 not available' }, 500);
});

// Story 5.3: Budget Tracking
app.get('/api/projects/:id/budget', async (c) => {
    const projectId = c.req.param('id');
    if (hasD1(c)) {
        try {
            // Get Total Budget
            const budget = await c.env.DB.prepare('SELECT * FROM project_budgets WHERE project_id = ?').bind(projectId).first();

            // Calculate Actual Spend (Sum of allocated hours * hourly rate for all tasks in project)
            const spendResult = await c.env.DB.prepare(`
                SELECT SUM(tr.allocated_hours * r.hourly_rate) as total_spend
                FROM task_resources tr
                JOIN tasks t ON tr.task_id = t.id
                JOIN resources r ON tr.resource_id = r.id
                WHERE t.project_id = ?
            `).bind(projectId).first();

            const totalBudget = budget ? budget.total_budget : 0;
            const actualSpend = spendResult ? (spendResult.total_spend || 0) : 0;

            return c.json({
                projectId,
                totalBudget,
                actualSpend,
                remaining: totalBudget - actualSpend,
                currency: budget ? budget.currency : 'USD'
            });
        } catch (e) {
            console.error('D1 Error:', e);
            return c.json({ error: 'Failed to fetch budget' }, 500);
        }
    }
    // Fallback mock
    return c.json({ projectId, totalBudget: 50000, actualSpend: 12500, remaining: 37500, currency: 'USD' });
});


app.get('/api/dashboard/metrics', async (c) => {
    let tasks = fallbackTasks;
    let projects = fallbackProjects;

    if (hasD1(c)) {
        try {
            const tasksResult = await c.env.DB.prepare('SELECT * FROM tasks').all();
            const projectsResult = await c.env.DB.prepare('SELECT * FROM projects').all();
            tasks = tasksResult.results;
            projects = projectsResult.results;
        } catch (e) {
            console.error('D1 Error:', e);
        }
    }

    const activeProjects = projects.filter(p => p.status !== 'Done').length;
    const pendingReview = tasks.filter(t => t.status === 'Pending Review').length;
    const tasksCompleted = tasks.filter(t => t.progress === 100).length;

    const totalProgress = tasks.reduce((sum, t) => sum + (t.progress || 0), 0);
    const avgProgress = tasks.length > 0 ? Math.round(totalProgress / tasks.length) : 0;
    const systemLoad = `${avgProgress}%`;

    return c.json({
        activeProjects,
        pendingReview,
        tasksCompleted,
        systemLoad,
        totalTasks: tasks.length,
        totalProjects: projects.length,
        databaseMode: hasD1(c) ? 'D1' : 'Fallback'
    });
});

export default app;
