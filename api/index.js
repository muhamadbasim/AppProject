import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('/*', cors());

// Mock Data (Same as frontend for now)
const tasks = [
    { id: 1, name: "UX Research", status: "Done", progress: 100 },
    { id: 2, name: "Design Phase", status: "In Progress", progress: 45 },
    { id: 3, name: "API Dev", status: "Pending", progress: 0 },
    { id: 4, name: "QA Testing", status: "Blocked", progress: 10 },
];

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

export default app;
