import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('/*', cors());

// Health check / root endpoint
app.get('/', (c) => {
    return c.json({
        status: 'ok',
        message: 'Project Control Center API',
        endpoints: ['/api/tasks', '/api/projects', '/api/dashboard/metrics']
    });
});

// ============================================================
// MOCK DATA
// ============================================================

const tasks = [
    { id: 1, name: "UX Research", status: "Done", progress: 100, projectId: 1, priority: "medium", assignee: "Sarah J." },
    { id: 2, name: "Design Phase", status: "In Progress", progress: 45, projectId: 1, priority: "high", assignee: "Mike D." },
    { id: 3, name: "API Dev", status: "Pending", progress: 0, projectId: 2, priority: "high", assignee: "David T." },
    { id: 4, name: "QA Testing", status: "Blocked", progress: 10, projectId: 2, priority: "critical", assignee: "Chloe Q." },
    { id: 5, name: "Deploy Staging", status: "Pending Review", progress: 80, projectId: 3, priority: "medium", assignee: "Adam O." },
    { id: 6, name: "Content Draft", status: "In Progress", progress: 30, projectId: 1, priority: "low", assignee: "You" },
    { id: 7, name: "Database Schema", status: "Done", progress: 100, projectId: 2, priority: "high", assignee: "David T." },
    { id: 8, name: "Auth Implementation", status: "In Progress", progress: 60, projectId: 3, priority: "high", assignee: "Mike D." },
];

const projects = [
    { id: 1, name: "WEB_REDESIGN_P1", status: "In Progress", progress: 65 },
    { id: 2, name: "API_INTEGRATION_MA", status: "Urgent", progress: 25 },
    { id: 3, name: "Q4_MKT_CAMPAIGN", status: "In Progress", progress: 15 },
    { id: 4, name: "SERVER_MIGRATION_V3", status: "QA", progress: 90 },
    { id: 5, name: "DOC_SYS_UPDATE_2.0", status: "Critical", progress: 40 },
];

// ============================================================
// TASKS ENDPOINTS
// ============================================================

app.get('/api/tasks', (c) => {
    return c.json(tasks);
});

app.get('/api/tasks/:id', (c) => {
    const id = parseInt(c.req.param('id'));
    const task = tasks.find(t => t.id === id);
    if (task) {
        return c.json(task);
    }
    return c.json({ error: 'Task not found' }, 404);
});

app.post('/api/tasks', async (c) => {
    const body = await c.req.json();
    const newTask = { id: tasks.length + 1, ...body };
    tasks.push(newTask);
    return c.json(newTask, 201);
});

// ============================================================
// PROJECTS ENDPOINTS
// ============================================================

app.get('/api/projects', (c) => {
    return c.json(projects);
});

app.get('/api/projects/:id', (c) => {
    const id = parseInt(c.req.param('id'));
    const project = projects.find(p => p.id === id);
    if (project) {
        // Include related tasks
        const projectTasks = tasks.filter(t => t.projectId === id);
        return c.json({ ...project, tasks: projectTasks });
    }
    return c.json({ error: 'Project not found' }, 404);
});

// ============================================================
// DASHBOARD METRICS ENDPOINT
// ============================================================

app.get('/api/dashboard/metrics', (c) => {
    const activeProjects = projects.filter(p => p.status !== 'Done').length;
    const pendingReview = tasks.filter(t => t.status === 'Pending Review').length;
    const tasksCompleted = tasks.filter(t => t.progress === 100).length;

    // Calculate system load from task progress (simplified)
    const totalProgress = tasks.reduce((sum, t) => sum + t.progress, 0);
    const avgProgress = Math.round(totalProgress / tasks.length);
    const systemLoad = `${avgProgress}%`;

    return c.json({
        activeProjects,
        pendingReview,
        tasksCompleted,
        systemLoad,
        totalTasks: tasks.length,
        totalProjects: projects.length,
    });
});

export default app;
