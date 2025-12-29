import { writable } from "svelte/store";

// Notification store
const createNotificationStore = () => {
    const { subscribe, update } = writable([]);

    let idCounter = 0;

    return {
        subscribe,
        add: (notification) => {
            const id = ++idCounter;
            const newNotification = {
                id,
                type: notification.type || "info",
                title: notification.title || "Notification",
                message: notification.message || "",
                duration: notification.duration ?? 5000,
            };

            update((n) => [...n, newNotification]);

            // Auto-dismiss after duration
            if (newNotification.duration > 0) {
                setTimeout(() => {
                    update((n) => n.filter((t) => t.id !== id));
                }, newNotification.duration);
            }

            return id;
        },
        dismiss: (id) => {
            update((n) => n.filter((t) => t.id !== id));
        },
        clear: () => {
            update(() => []);
        },
    };
};

export const notifications = createNotificationStore();

// Helper functions
export const showNotification = (title, message, type = "info", duration = 5000) => {
    return notifications.add({ title, message, type, duration });
};

export const showWarning = (title, message) => {
    return notifications.add({ title, message, type: "warning", duration: 6000 });
};

export const showError = (title, message) => {
    return notifications.add({ title, message, type: "error", duration: 8000 });
};

export const showSuccess = (title, message) => {
    return notifications.add({ title, message, type: "success", duration: 4000 });
};

export const dismissNotification = (id) => {
    notifications.dismiss(id);
};

// Deadline alert checker
export const checkDeadlineAlerts = (tasks) => {
    const now = new Date();
    const alerts = [];

    tasks.forEach((task) => {
        if (task.progress === 100) return; // Skip completed tasks

        const dueDays = task.dueDays;

        if (dueDays < 0) {
            alerts.push({
                type: "error",
                title: "OVERDUE",
                message: `"${task.name}" is ${Math.abs(dueDays)} day(s) overdue!`,
            });
        } else if (dueDays === 0) {
            alerts.push({
                type: "warning",
                title: "DUE TODAY",
                message: `"${task.name}" is due today!`,
            });
        } else if (dueDays <= 2) {
            alerts.push({
                type: "warning",
                title: "DUE SOON",
                message: `"${task.name}" is due in ${dueDays} day(s).`,
            });
        }
    });

    return alerts;
};
