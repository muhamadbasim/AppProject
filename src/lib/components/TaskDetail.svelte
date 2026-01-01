<script>
    import { onMount } from "svelte";
    import { tasksStore } from "../stores/tasksStore.js";
    import { resourcesStore } from "../stores/resourcesStore.js";
    import { showSuccess, showError } from "../stores/notificationStore.js";

    let {
        task = {
            id: "PROJ-123",
            name: "USER_AUTH_API",
            status: "IN_PROGRESS",
            type: "BACKEND",
            progress: 65,
            assignee: "JANE_DOE",
            dueDate: "OCT_24 (2D)",
            priority: "HIGH",
            description: "Task description placeholder...",
            spent: 0, // Fallback
            allocated: 0, // Fallback
            logs: [],
        },
        onClose = () => {},
    } = $props();

    let isCompleting = $state(false);
    let isEditingNotes = $state(false);
    let technicalNotes = $state("");

    // Resource Allocation State
    let selectedResource = $state("");
    let allocationHours = $state(1);
    let isAllocating = $state(false);

    // Derived State
    let taskId = $derived(
        typeof task.id === "string" ? task.id.replace(/\D/g, "") : task.id,
    );

    // Subscribe to resources store
    let resources = $state([]);
    let allocations = $state([]);

    $effect(() => {
        const unsub = resourcesStore.subscribe((state) => {
            resources = state.resources;
            allocations = state.taskAllocations[taskId] || [];
        });
        return unsub;
    });

    onMount(() => {
        resourcesStore.fetchResources();
        if (taskId) {
            resourcesStore.fetchTaskAllocations(taskId);
        }
    });

    // Calculate dynamic financials
    let totalSpent = $derived(
        allocations.reduce(
            (sum, a) => sum + a.allocated_hours * a.hourly_rate,
            0,
        ),
    );
    let budgetLimit = $derived(
        task.budget ? parseFloat(task.budget.replace(/[^0-9.]/g, "")) : 0,
    );

    async function handleAllocate() {
        if (!selectedResource || allocationHours <= 0) return;
        isAllocating = true;

        const res = await resourcesStore.allocateResource(
            taskId,
            selectedResource,
            allocationHours,
        );

        isAllocating = false;
        if (res.success) {
            showSuccess("Resource Allocated", "Hours added successfully.");
            selectedResource = "";
            allocationHours = 1;
        } else {
            showError("Allocation Failed", res.error);
        }
    }

    async function handleComplete() {
        if (isCompleting) return;
        isCompleting = true;

        const API_BASE = import.meta.env.DEV
            ? "http://127.0.0.1:8787"
            : "https://project-control-center-api.perfectmoney7.workers.dev";

        const updateData = {
            name: task.name?.replace(/_/g, " ") || "Task",
            status: "Done",
            progress: 100,
            priority: task.priority?.toLowerCase() || "medium",
            assignee: task.assignee?.replace(/_/g, " ") || "Unassigned",
            due_days: 0,
            budget: task.allocated ? `$${task.allocated}` : null,
            depends_on: null,
        };

        try {
            const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });

            if (!res.ok) throw new Error("Failed to complete task");

            showSuccess("Task Completed", `${task.name} marked as complete.`);
            tasksStore.fetch();
            onClose();
        } catch (err) {
            console.error("Complete error:", err);
            showError("Error", err.message);
        } finally {
            isCompleting = false;
        }
    }
</script>

<div
    class="flex-1 overflow-y-auto no-scrollbar bg-background-dark p-2 pt-0 pb-24 font-mono text-text-light"
>
    <!-- Title -->
    <div class="border-b border-border-dark py-2">
        <h1
            class="text-lg font-bold leading-tight tracking-tight text-primary mt-2 mb-2"
        >
            REF: {task.name}
        </h1>
    </div>

    <!-- Status Tags -->
    <div class="border-b border-border-dark py-2">
        <div class="flex flex-wrap items-center gap-4">
            <span
                class="text-background-dark bg-primary px-1 py-0 text-xs font-bold uppercase"
                >STATUS: {task.status}</span
            >
            <span
                class="text-text-light bg-surface-highlight px-1 py-0 text-xs font-bold uppercase"
                >TYPE: {task.type || "TASK"}</span
            >
        </div>
    </div>

    <!-- Progress -->
    <div class="border-b border-border-dark py-2">
        <div class="flex justify-between">
            <span class="text-primary font-bold uppercase mr-4">PROG</span>
            <span class="text-primary"
                >{task.progress}% [{task.progress === 100
                    ? "COMPLETE"
                    : "ON_TRACK"}]</span
            >
        </div>
        <div
            class="h-2 w-full bg-surface-highlight flex items-center justify-start overflow-hidden my-1"
        >
            <div
                class="h-full bg-primary"
                style="width: {task.progress}%;"
            ></div>
        </div>
    </div>

    <!-- Resources & Allocation (New Section) -->
    <div class="border-b border-border-dark py-2">
        <div class="flex justify-between mb-2">
            <span class="text-primary font-bold uppercase"
                >RESOURCES & COSTS</span
            >
            <span class="text-[10px] text-text-muted"
                >BUDGET: ${budgetLimit.toLocaleString()}</span
            >
        </div>

        <!-- Existing Allocations List -->
        {#if allocations.length > 0}
            <div class="space-y-1 mb-3">
                {#each allocations as alloc}
                    <div
                        class="flex justify-between text-xs bg-surface-highlight/50 px-2 py-1 rounded"
                    >
                        <span>{alloc.name} ({alloc.role})</span>
                        <div class="text-right">
                            <span class="text-primary font-mono"
                                >{alloc.allocated_hours}h</span
                            >
                            <span class="text-text-muted ml-1"
                                >@ ${alloc.hourly_rate}/h</span
                            >
                        </div>
                    </div>
                {/each}
            </div>
        {/if}

        <!-- Add Allocation Form -->
        <div class="bg-surface-highlight p-2 rounded">
            <div class="text-[10px] font-bold text-text-muted mb-1 uppercase">
                Allocate Resource
            </div>
            <div class="flex gap-2">
                <select
                    bind:value={selectedResource}
                    class="flex-1 bg-background-dark text-xs text-text-light border border-border-dark rounded px-1 py-1 focus:border-primary outline-none"
                >
                    <option value="" disabled selected
                        >Select Resource...</option
                    >
                    {#each resources as r}
                        <option value={r.id}
                            >{r.name} (${r.hourly_rate}/h)</option
                        >
                    {/each}
                </select>
                <input
                    type="number"
                    bind:value={allocationHours}
                    min="0.5"
                    step="0.5"
                    class="w-16 bg-background-dark text-xs text-text-light border border-border-dark rounded px-1 py-1 focus:border-primary outline-none text-center"
                />
                <button
                    onclick={handleAllocate}
                    disabled={isAllocating || !selectedResource}
                    class="bg-primary text-background-dark px-2 rounded font-bold text-xs hover:brightness-110 disabled:opacity-50"
                >
                    {isAllocating ? "..." : "+"}
                </button>
            </div>
        </div>

        <!-- Cost Summary -->
        <div class="flex justify-between mt-3 text-xs">
            <span class="text-text-muted">TOTAL SPENT:</span>
            <span class="font-bold text-primary"
                >${totalSpent.toLocaleString()}</span
            >
        </div>
        <div class="flex justify-between text-[10px] text-text-muted">
            <span
                >REMAINING: ${(budgetLimit - totalSpent).toLocaleString()}</span
            >
            <span
                >{(budgetLimit > 0
                    ? (totalSpent / budgetLimit) * 100
                    : 0
                ).toFixed(1)}% of Budget</span
            >
        </div>
    </div>

    <!-- Description -->
    <div class="border-b border-border-dark py-2">
        <div class="flex justify-between mb-1">
            <span class="text-primary font-bold uppercase">DESC</span>
        </div>
        <div class="pl-4 text-xs overflow-auto max-h-24">
            <p>{task.description}</p>
        </div>
    </div>

    <!-- Logs -->
    <div class="py-2">
        <div class="flex justify-between mb-1">
            <span class="text-primary font-bold uppercase">LOGS</span>
        </div>
        <div class="pl-4 pt-1 pb-1">
            {#each task.logs || [] as log}
                <p class="text-xs">
                    <span class="text-primary font-bold">{log.user}:</span>
                    "{log.message}"
                </p>
                <span class="text-xs text-text-muted">{log.time}</span>
            {/each}
        </div>
    </div>
</div>

<!-- Fixed Bottom Button -->
<div
    class="fixed bottom-0 left-0 right-0 z-40 bg-background-dark/80 px-2 pt-2 pb-4 backdrop-blur-lg border-t border-border-dark"
>
    <button
        onclick={handleComplete}
        disabled={isCompleting}
        class="flex h-10 w-full items-center justify-center gap-2 bg-primary px-6 font-bold text-background-dark text-sm uppercase hover:brightness-110 transition-all disabled:opacity-50"
    >
        {isCompleting ? "COMPLETING..." : "CMD:TASK_COMPLETE"}
    </button>
</div>
