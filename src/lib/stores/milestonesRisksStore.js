import { writable } from 'svelte/store';

import { API_BASE } from '../config.js';

function createMilestonesStore() {
    const { subscribe, set, update } = writable({
        milestones: [],
        loading: true,
        error: null,
    });

    return {
        subscribe,
        fetch: async (projectId = null) => {
            update(s => ({ ...s, loading: true, error: null }));
            try {
                let url = `${API_BASE}/api/milestones`;
                if (projectId) url += `?projectId=${projectId}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to fetch milestones');
                const milestones = await res.json();
                set({ milestones, loading: false, error: null });
            } catch (err) {
                update(s => ({ ...s, loading: false, error: err.message }));
            }
        }
    };
}

function createRisksStore() {
    const { subscribe, set, update } = writable({
        risks: [],
        loading: true,
        error: null,
    });

    return {
        subscribe,
        fetch: async (projectId = null) => {
            update(s => ({ ...s, loading: true, error: null }));
            try {
                let url = `${API_BASE}/api/risks`;
                if (projectId) url += `?projectId=${projectId}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to fetch risks');
                const risks = await res.json();
                set({ risks, loading: false, error: null });
            } catch (err) {
                update(s => ({ ...s, loading: false, error: err.message }));
            }
        }
    };
}

export const milestonesStore = createMilestonesStore();
export const risksStore = createRisksStore();
