import { writable } from 'svelte/store';

import { API_BASE } from '../config.js';

function createResourcesStore() {
    const { subscribe, set, update } = writable({
        resources: [],
        taskAllocations: {}, // Map of taskId -> allocation[]
        projectBudget: null,
        loading: false,
        error: null
    });

    return {
        subscribe,

        // Fetch all resources
        fetchResources: async () => {
            update(s => ({ ...s, loading: true }));
            try {
                const res = await fetch(`${API_BASE}/api/resources`);
                const data = await res.json();
                update(s => ({ ...s, resources: data, loading: false }));
            } catch (err) {
                console.error("Failed to fetch resources:", err);
                update(s => ({ ...s, error: err.message, loading: false }));
            }
        },

        // Fetch allocations for a task
        fetchTaskAllocations: async (taskId) => {
            if (!taskId) return;
            try {
                const res = await fetch(`${API_BASE}/api/tasks/${taskId}/resources`);
                const data = await res.json();
                update(s => ({
                    ...s,
                    taskAllocations: { ...s.taskAllocations, [taskId]: data }
                }));
            } catch (err) {
                console.error(`Failed to fetch allocations for task ${taskId}:`, err);
            }
        },

        // Allocate resource to task
        allocateResource: async (taskId, resourceId, hours) => {
            try {
                const res = await fetch(`${API_BASE}/api/tasks/${taskId}/resources`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resource_id: resourceId, allocated_hours: hours })
                });

                if (res.ok) {
                    // Refetch allocations to update UI
                    await this.fetchTaskAllocations(taskId);
                    return { success: true };
                }
                return { success: false, error: 'Failed' };
            } catch (err) {
                return { success: false, error: err.message };
            }
        },

        // Fetch project budget
        fetchProjectBudget: async (projectId) => {
            if (!projectId) return;
            try {
                const res = await fetch(`${API_BASE}/api/projects/${projectId}/budget`);
                const data = await res.json();
                update(s => ({ ...s, projectBudget: data }));
            } catch (err) {
                console.error("Failed to fetch budget:", err);
            }
        }
    };
}

export const resourcesStore = createResourcesStore();
