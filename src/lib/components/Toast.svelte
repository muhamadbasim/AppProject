<script>
    import { onMount } from "svelte";
    import {
        notifications,
        dismissNotification,
    } from "../stores/notificationStore.js";

    let toasts = $state([]);

    $effect(() => {
        const unsub = notifications.subscribe((value) => (toasts = value));
        return () => unsub();
    });
</script>

{#if toasts.length > 0}
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs">
        {#each toasts as toast (toast.id)}
            <div
                class="flex items-start gap-3 p-3 rounded-lg shadow-lg border backdrop-blur-sm animate-slide-in
          {toast.type === 'warning'
                    ? 'bg-orange-500/90 border-orange-400 text-white'
                    : toast.type === 'error'
                      ? 'bg-red-500/90 border-red-400 text-white'
                      : toast.type === 'success'
                        ? 'bg-green-500/90 border-green-400 text-white'
                        : 'bg-primary/90 border-primary text-background-dark'}"
            >
                <span class="material-symbols-outlined text-lg shrink-0">
                    {toast.type === "warning"
                        ? "warning"
                        : toast.type === "error"
                          ? "error"
                          : toast.type === "success"
                            ? "check_circle"
                            : "notifications"}
                </span>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold">{toast.title}</p>
                    {#if toast.message}
                        <p class="text-xs opacity-90 mt-0.5">{toast.message}</p>
                    {/if}
                </div>
                <button
                    onclick={() => dismissNotification(toast.id)}
                    class="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                >
                    <span class="material-symbols-outlined text-base"
                        >close</span
                    >
                </button>
            </div>
        {/each}
    </div>
{/if}

<style>
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    .animate-slide-in {
        animation: slide-in 0.3s ease-out;
    }
</style>
