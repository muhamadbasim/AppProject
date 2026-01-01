// Offline Store - Tracks network connectivity status
import { writable } from 'svelte/store';

function createOfflineStore() {
    const { subscribe, set } = writable(false);

    let onlineHandler = null;
    let offlineHandler = null;

    // Initialize with current status
    if (typeof window !== 'undefined') {
        set(!navigator.onLine);

        // Create handlers for cleanup
        onlineHandler = () => set(false);
        offlineHandler = () => set(true);

        // Listen for online/offline events
        window.addEventListener('online', onlineHandler);
        window.addEventListener('offline', offlineHandler);
    }

    return {
        subscribe,
        // Cleanup method for proper teardown
        destroy: () => {
            if (onlineHandler) window.removeEventListener('online', onlineHandler);
            if (offlineHandler) window.removeEventListener('offline', offlineHandler);
        }
    };
}

export const isOffline = createOfflineStore();
