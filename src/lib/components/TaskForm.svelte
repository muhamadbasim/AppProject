<script>
    import { tasksStore } from "../stores/tasksStore.js";
    import { showSuccess, showError } from "../stores/notificationStore.js";
    import { API_BASE } from "../config.js";

    let { onSubmit = null, onCancel = null } = $props();

    let name = $state("");
    let assignee = $state("");
    let priority = $state("medium");
    let status = $state("pending");
    let blockerReason = $state("");
    let dueDays = $state(7);
    let projectId = $state(1);
    let isSubmitting = $state(false);
    let error = $state(null);

    const priorities = ["low", "medium", "high", "critical"];
    const statuses = ["pending", "in_progress", "blocked", "done"];
    const projects = [
        { id: 1, name: "WEB_REDESIGN_P1" },
        { id: 2, name: "API_INTEGRATION_MA" },
        { id: 3, name: "Q4_MKT_CAMPAIGN" },
    ];

    async function handleSubmit() {
        if (!name.trim()) {
            error = "Task name is required";
            return;
        }

        if (!assignee.trim()) {
            error = "Assignee is required";
            return;
        }

        if (status === "blocked" && !blockerReason.trim()) {
            error = "Blocker reason is required when status is Blocked";
            return;
        }

        isSubmitting = true;
        error = null;

        const newTask = {
            name: name.trim(),
            assignee: assignee.trim(),
            priority,
            due_days: Number(dueDays),
            project_id: Number(projectId),
            status:
                status === "blocked"
                    ? "Blocked"
                    : status === "in_progress"
                      ? "In Progress"
                      : status === "done"
                        ? "Done"
                        : "Pending",
            progress: status === "done" ? 100 : 0,
            blocker_reason: status === "blocked" ? blockerReason.trim() : null,
        };

        try {
            const res = await fetch(`${API_BASE}/api/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });

            if (!res.ok) throw new Error("Failed to create task");

            const created = await res.json();

            // Show success notification
            showSuccess(
                "Task Created",
                `${created.name} has been added successfully.`,
            );

            // Refresh the tasks list
            tasksStore.fetch();

            if (onSubmit) onSubmit(created);

            // Reset form
            name = "";
            assignee = "";
            priority = "medium";
            status = "pending";
            blockerReason = "";
            dueDays = 7;
        } catch (err) {
            error = err.message;
            showError("Error", err.message);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="flex flex-col gap-4 font-mono text-text-light">
    <h2 class="text-lg font-bold text-primary uppercase tracking-wide">
        CMD: NEW_TASK
    </h2>

    {#if error}
        <div
            class="bg-red-500/20 border border-red-500/50 rounded p-2 text-red-400 text-sm"
        >
            <span class="material-symbols-outlined text-base mr-1 align-middle"
                >error</span
            >
            {error}
        </div>
    {/if}

    <!-- Task Name -->
    <div class="space-y-1">
        <label for="task-name" class="text-xs text-primary font-bold uppercase"
            >NAME:</label
        >
        <input
            id="task-name"
            type="text"
            bind:value={name}
            placeholder="Enter task name..."
            class="w-full bg-surface-dark border border-border-dark rounded px-3 py-2 text-sm text-text-light placeholder:text-text-muted focus:outline-none focus:border-primary"
        />
    </div>

    <!-- Assignee -->
    <div class="space-y-1">
        <label
            for="task-assignee"
            class="text-xs text-primary font-bold uppercase">ASSIGNEE:</label
        >
        <input
            id="task-assignee"
            type="text"
            bind:value={assignee}
            placeholder="Enter assignee name..."
            class="w-full bg-surface-dark border border-border-dark rounded px-3 py-2 text-sm text-text-light placeholder:text-text-muted focus:outline-none focus:border-primary"
        />
    </div>

    <div class="space-y-1">
        <span class="text-xs text-primary font-bold uppercase">PRIORITY:</span>
        <div class="flex gap-2" role="group" aria-label="Priority Selection">
            {#each priorities as p}
                <button
                    type="button"
                    onclick={() => (priority = p)}
                    class="flex-1 py-2 text-xs font-bold uppercase rounded border transition-colors
                    {priority === p
                        ? 'bg-primary text-background-dark border-primary'
                        : 'bg-surface-dark text-text-muted border-border-dark hover:border-primary/50'}"
                >
                    {p}
                </button>
            {/each}
        </div>
    </div>

    <div class="space-y-1">
        <span class="text-xs text-primary font-bold uppercase">STATUS:</span>
        <div class="flex gap-2" role="group" aria-label="Status Selection">
            {#each statuses as s}
                <button
                    type="button"
                    onclick={() => (status = s)}
                    class="flex-1 py-2 text-xs font-bold uppercase rounded border transition-colors
                    {status === s
                        ? s === 'blocked'
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-primary text-background-dark border-primary'
                        : 'bg-surface-dark text-text-muted border-border-dark hover:border-primary/50'}"
                >
                    {s.replace("_", " ")}
                </button>
            {/each}
        </div>
    </div>

    <!-- Blocker Reason (shown when status is blocked) -->
    {#if status === "blocked"}
        <div class="space-y-1">
            <label
                for="blocker-reason"
                class="text-xs text-red-500 font-bold uppercase"
                >BLOCKER REASON (required):</label
            >
            <textarea
                id="blocker-reason"
                bind:value={blockerReason}
                placeholder="Describe what is blocking this task..."
                rows="2"
                class="w-full bg-red-500/10 border border-red-500/50 rounded px-3 py-2 text-sm text-text-light placeholder:text-red-400/50 focus:outline-none focus:border-red-500"
            ></textarea>
        </div>
    {/if}

    <!-- Due Days -->
    <div class="space-y-1">
        <label for="task-due" class="text-xs text-primary font-bold uppercase"
            >DUE IN (DAYS):</label
        >
        <input
            id="task-due"
            type="number"
            bind:value={dueDays}
            min="1"
            max="365"
            class="w-full bg-surface-dark border border-border-dark rounded px-3 py-2 text-sm text-text-light focus:outline-none focus:border-primary"
        />
    </div>

    <!-- Project -->
    <div class="space-y-1">
        <label
            for="task-project"
            class="text-xs text-primary font-bold uppercase">PROJECT:</label
        >
        <select
            id="task-project"
            bind:value={projectId}
            class="w-full bg-surface-dark border border-border-dark rounded px-3 py-2 text-sm text-text-light focus:outline-none focus:border-primary"
        >
            {#each projects as proj}
                <option value={proj.id}>{proj.name}</option>
            {/each}
        </select>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 mt-2">
        <button
            type="button"
            onclick={onCancel}
            class="flex-1 py-3 text-sm font-bold uppercase bg-surface-dark border border-border-dark text-text-muted rounded hover:bg-surface-highlight transition-colors"
        >
            CANCEL
        </button>
        <button
            type="button"
            onclick={handleSubmit}
            disabled={isSubmitting}
            class="flex-1 py-3 text-sm font-bold uppercase bg-primary text-background-dark rounded hover:brightness-110 transition-all disabled:opacity-50"
        >
            {isSubmitting ? "CREATING..." : "CREATE_TASK"}
        </button>
    </div>
</div>
