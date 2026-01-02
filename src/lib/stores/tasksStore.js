import { writable } from 'svelte/store';

import { API_BASE } from '../config.js';

function createTasksStore() {
    const { subscribe, set, update } = writable({
        tasks: [],
        loading: true,
        error: null,
    });

    return {
        subscribe,
        fetch: async (projectId = null) => {
            update(s => ({ ...s, loading: true, error: null }));
            try {
                let url = `${API_BASE}/api/tasks`;
                if (projectId) url += `?projectId=${projectId}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to fetch tasks');
                const tasks = await res.json();
                set({ tasks, loading: false, error: null });
            } catch (err) {
                update(s => ({ ...s, loading: false, error: err.message }));
            }
        },
        add: async (task) => {
            try {
                const res = await fetch(`${API_BASE}/api/tasks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(task),
                });
                if (!res.ok) throw new Error('Failed to add task');
                const newTask = await res.json();
                update(s => ({ ...s, tasks: [...s.tasks, newTask] }));
                return newTask;
            } catch (err) {
                console.error(err);
                throw err;
            }
        }
    };
}

export const tasksStore = createTasksStore();
