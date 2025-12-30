// data.js - Static data for UI components that don't depend on API
// Task and project data are now fetched from the API via Svelte stores.

// Days configuration for Gantt chart grid (kept for UI layout)
export const days = [
    { day: "Mon", date: 16 },
    { day: "Tue", date: 17, today: true },
    { day: "Wed", date: 18 },
    { day: "Thu", date: 19 },
    { day: "Fri", date: 20 },
    { day: "Sat", date: 21, weekend: true },
    { day: "Sun", date: 22, weekend: true },
    { day: "Mon", date: 23 },
    { day: "Tue", date: 24 },
    { day: "Wed", date: 25 },
    { day: "Thu", date: 26 },
    { day: "Fri", date: 27 },
    { day: "Sat", date: 28, weekend: true },
];
