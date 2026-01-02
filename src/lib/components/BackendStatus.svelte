<script>
    import { onMount, onDestroy } from "svelte";
    import { API_BASE } from "../config.js";

    let isConnected = false;
    let interval;

    async function checkHealth() {
        try {
            const res = await fetch(`${API_BASE}/`, { method: "GET" });
            isConnected = res.ok;
        } catch (e) {
            isConnected = false;
        }
    }

    onMount(() => {
        checkHealth();
        interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });
</script>

<div
    class="fixed top-4 right-4 z-50 flex items-center gap-2 bg-surface-dark/80 backdrop-blur px-3 py-1.5 rounded-full border border-border-dark shadow-sm"
>
    <div
        class="w-2.5 h-2.5 rounded-full transition-colors duration-300 shadow-[0_0_8px_rgba(0,0,0,0.5)] {isConnected
            ? 'bg-green-500 shadow-green-500/50'
            : 'bg-red-500 shadow-red-500/50'}"
    ></div>
    <span class="text-xs font-mono font-medium text-text-muted">
        {isConnected ? "API ONLINE" : "API OFFLINE"}
    </span>
</div>
