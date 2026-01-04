<script>
    import { exportTasksToCSV, exportToJSON } from "../utils/exportUtils.js";
    import { tasksStore } from "../stores/tasksStore.js";
    import { showSuccess } from "../stores/notificationStore.js";

    let { data = null, label = "EXPORT", type = "tasks" } = $props();
    let isOpen = $state(false);

    let currentTasks = $state([]);
    $effect(() => {
        const unsub = tasksStore.subscribe((state) => {
            currentTasks = state.tasks;
        });
        return unsub;
    });

    function handleExportCSV() {
        const exportData = data || currentTasks;
        exportTasksToCSV(exportData);
        showSuccess(
            "Export Complete",
            `CSV generated for ${exportData.length} items`,
        );
        isOpen = false;
    }

    function handleExportJSON() {
        const exportData = data || currentTasks;
        exportToJSON(exportData, type);
        showSuccess(
            "Export Complete",
            `JSON generated for ${exportData.length || 1} items`,
        );
        isOpen = false;
    }
</script>

<div class="relative inline-block text-left">
    <button
        onclick={() => (isOpen = !isOpen)}
        aria-label="Toggle Export Options"
        class="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase rounded border border-border-dark bg-background-dark text-text-muted hover:border-primary hover:text-primary transition-all group"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            class="stroke-current transition-transform group-hover:scale-110"
        >
            <path
                d="M11 15L11 2M11 2L8 4.5M11 2L14 4.5"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M4 11V16C4 18.8284 4 20.2426 4.87868 21.1213C5.75736 22 7.17157 22 10 22H14C16.8284 22 18.2426 22 19.1213 21.1213C20 20.2426 20 18.8284 20 16V11"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
        {label}
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
            class="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-surface-dark border border-border-dark ring-1 ring-black ring-opacity-5 z-50 overflow-hidden shadow-2xl"
        >
            <div class="py-1">
                <button
                    onclick={handleExportCSV}
                    class="flex items-center w-full px-4 py-2 text-[10px] font-bold text-text-light hover:bg-primary/10 hover:text-primary transition-colors text-left uppercase"
                >
                    CSV Format
                </button>
                <button
                    onclick={handleExportJSON}
                    class="flex items-center w-full px-4 py-2 text-[10px] font-bold text-text-light hover:bg-primary/10 hover:text-primary transition-colors text-left uppercase border-t border-border-dark"
                >
                    JSON Format
                </button>
            </div>
        </div>
    {/if}
</div>
