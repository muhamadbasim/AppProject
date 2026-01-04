import { writable } from 'svelte/store';

// Use local API during development, deployed API in production
import { API_BASE } from '../config.js';

// Dashboard Metrics Store
function createMetricsStore() {
    const { subscribe, set, update } = writable({
        activeProjects: 0,
        pendingReview: 0,
        tasksCompleted: 0,
        systemLoad: '0%',
        loading: true,
        error: null,
    });

    return {
        subscribe,
        fetch: async () => {
            update(s => ({ ...s, loading: true, error: null }));
            try {
                const res = await fetch(`${API_BASE}/api/dashboard/metrics`);
                if (!res.ok) throw new Error('Failed to fetch metrics');
                const data = await res.json();
                set({ ...data, loading: false, error: null });
            } catch (err) {
                update(s => ({ ...s, loading: false, error: err.message }));
            }
        },
        reset: () => set({ activeProjects: 0, pendingReview: 0, tasksCompleted: 0, systemLoad: '0%', loading: true, error: null }),
    };
}

// Projects Store
function createProjectsStore() {
    const { subscribe, set, update } = writable({
        projects: [],
        loading: true,
        error: null,
    });

    return {
        subscribe,
        fetch: async () => {
            update(s => ({ ...s, loading: true, error: null }));
            try {
                const res = await fetch(`${API_BASE}/api/projects`);
                if (!res.ok) throw new Error('Failed to fetch projects');
                const projects = await res.json();
                set({ projects, loading: false, error: null });
            } catch (err) {
                update(s => ({ ...s, loading: false, error: err.message }));
            }
        },
        reset: () => set({ projects: [], loading: true, error: null }),
    };
}

export const metricsStore = createMetricsStore();
export const projectsStore = createProjectsStore();
