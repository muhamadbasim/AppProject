<script>
    import { risksStore } from "../stores/milestonesRisksStore.js";
    import { tasksStore } from "../stores/tasksStore.js";
    import { onMount, onDestroy } from "svelte";

    let isOpen = $state(false);
    let notifications = $state([]);

    // Subscribe to stores
    let currentRisks = $state([]);
    let currentTasks = $state([]);

    $effect(() => {
        const unsubR = risksStore.subscribe((s) => (currentRisks = s.risks));
        const unsubT = tasksStore.subscribe((s) => (currentTasks = s.tasks));
        return () => {
            unsubR();
            unsubT();
        };
    });

    // Derive high-priority notifications
    $effect(() => {
        const hRisks = currentRisks
            .filter((r) => r.severity === "high")
            .map((r) => ({
                id: `risk-${r.id}`,
                type: "RISK",
                text: r.title,
                color: "text-red-400",
            }));

        const hTasks = currentTasks
            .filter((t) => t.priority === "high" && t.progress < 100)
            .map((t) => ({
                id: `task-${t.id}`,
                type: "TASK",
                text: t.name,
                color: "text-primary",
            }));

        notifications = [...hRisks, ...hTasks].slice(0, 5);
    });

    const hasNew = $derived(notifications.length > 0);
</script>

<div class="relative">
    <button
        onclick={() => (isOpen = !isOpen)}
        aria-label="View Notifications"
        class="flex size-10 items-center justify-center rounded-full active:bg-surface-highlight transition-colors text-text-light relative"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            class="stroke-current"
        >
            <path
                d="M4 19C4.37258 19.4657 5.05929 20.0827 6.13076 20.5415C7.39952 21.0847 8.76104 21.3651 10.1442 21.3651H13.8558C15.239 21.3651 16.6005 21.0847 17.8692 20.5415C18.9407 20.0827 19.6274 19.4657 20 19"
                stroke-width="1.5"
                stroke-linecap="round"
            />
            <path
                d="M21 15.1111C21 16.1543 20.1543 17 19.1111 17H4.88889C3.84568 17 3 16.1543 3 15.1111V14.1206C3 13.0645 3.42857 12.0535 4.16129 11.2952L4.6129 10.8277C5.53177 9.87679 6.04839 8.5878 6.04839 7.23438C6.04839 4.89582 7.82888 3 10.0242 3H13.9758C16.1711 3 17.9516 4.89582 17.9516 7.23438C17.9516 8.5878 18.4682 9.87679 19.3871 10.8277L19.8387 11.2952C20.5714 12.0535 21 13.0645 21 14.1206V15.1111Z"
                stroke-width="1.5"
                stroke-linecap="round"
            />
        </svg>

        {#if hasNew}
            <span
                class="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-background-dark animate-pulse"
            ></span>
        {/if}
    </button>

    {#if isOpen}
        <!-- Backdrop -->
        <button
            type="button"
            class="fixed inset-0 z-40 cursor-default outline-none"
            aria-hidden="true"
            onclick={() => (isOpen = false)}
        ></button>

        <div
            class="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-surface-dark border border-border-dark shadow-2xl z-50 overflow-hidden"
        >
            <div
                class="p-3 border-b border-border-dark flex justify-between items-center bg-background-dark/50"
            >
                <span
                    class="text-[10px] font-bold text-text-light uppercase tracking-widest"
                    >Alerts & Nudges</span
                >
                <span class="text-[9px] text-text-muted"
                    >{notifications.length} active</span
                >
            </div>
            <div class="max-h-64 overflow-y-auto py-1">
                {#if notifications.length === 0}
                    <div class="p-8 text-center">
                        <span class="text-[10px] text-text-muted italic"
                            >System Nominal. No alerts.</span
                        >
                    </div>
                {:else}
                    {#each notifications as note}
                        <div
                            class="px-4 py-3 border-b border-border-dark/50 last:border-0 hover:bg-surface-highlight/30 transition-colors"
                        >
                            <div class="flex items-center gap-2 mb-1">
                                <span
                                    class="text-[8px] px-1 py-0.5 rounded bg-background-dark font-bold {note.color}"
                                    >{note.type}</span
                                >
                            </div>
                            <p class="text-xs text-text-light/90 leading-tight">
                                {note.text}
                            </p>
                        </div>
                    {/each}
                {/if}
            </div>
            {#if notifications.length > 0}
                <div
                    class="p-2 bg-background-dark/30 border-t border-border-dark text-center"
                >
                    <button
                        class="text-[9px] font-bold text-primary hover:underline uppercase"
                        onclick={() => (isOpen = false)}>Dismiss All</button
                    >
                </div>
            {/if}
        </div>
    {/if}
</div>
