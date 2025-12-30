<script>
    import { projectsStore } from "../stores/dashboardStore.js";
    import { showSuccess, showError } from "../stores/notificationStore.js";

    export let project = null; // Project to edit
    export let onSubmit = null;
    export let onCancel = null;

    let name = project?.name || "";
    let status = project?.status || "Pending";
    let progress = project?.progress || 0;
    let isSubmitting = false;
    let error = null;

    const statuses = [
        "Pending",
        "In Progress",
        "Blocked",
        "Done",
        "On Hold",
        "QA",
        "Critical",
        "Urgent",
    ];

    // Use local API during development
    const API_BASE = import.meta.env.DEV
        ? "http://127.0.0.1:8787"
        : "https://project-control-center-api.perfectmoney7.workers.dev";

    async function handleSubmit() {
        if (!name.trim()) {
            error = "Project name is required";
            return;
        }

        isSubmitting = true;
        error = null;

        try {
            const res = await fetch(`${API_BASE}/api/projects/${project.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    status,
                    progress: parseInt(progress),
                }),
            });

            if (!res.ok) throw new Error("Failed to update project");

            const updated = await res.json();

            showSuccess(
                "Project Updated",
                `${updated.name} updated successfully.`,
            );
            projectsStore.fetch(); // Refresh list

            if (onSubmit) onSubmit(updated);
        } catch (err) {
            console.error("Update error:", err);
            error = err.message;
            showError("Error", err.message);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="flex flex-col gap-4 font-mono text-text-light">
    <h2 class="text-lg font-bold text-primary uppercase tracking-wide">
        CMD: EDIT_PROJECT
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

    <!-- Name -->
    <div class="space-y-1">
        <label for="proj-name" class="text-xs text-primary font-bold uppercase"
            >NAME:</label
        >
        <input
            id="proj-name"
            type="text"
            bind:value={name}
            class="w-full bg-surface-dark border border-border-dark rounded px-3 py-2 text-sm text-text-light focus:border-primary focus:outline-none"
        />
    </div>

    <!-- Status -->
    <div class="space-y-1">
        <label
            for="proj-status"
            class="text-xs text-primary font-bold uppercase">STATUS:</label
        >
        <select
            id="proj-status"
            bind:value={status}
            class="w-full bg-surface-dark border border-border-dark rounded px-3 py-2 text-sm text-text-light focus:border-primary focus:outline-none"
        >
            {#each statuses as s}
                <option value={s}>{s}</option>
            {/each}
        </select>
    </div>

    <!-- Progress -->
    <div class="space-y-1">
        <label
            for="proj-progress"
            class="text-xs text-primary font-bold uppercase"
            >PROGRESS ({progress}%):</label
        >
        <input
            id="proj-progress"
            type="range"
            min="0"
            max="100"
            bind:value={progress}
            class="w-full accent-primary bg-surface-dark"
        />
    </div>

    <!-- Actions -->
    <div class="flex gap-3 mt-4">
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
            {isSubmitting ? "UPDATING..." : "UPDATE_PROJECT"}
        </button>
    </div>
</div>
