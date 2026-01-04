<script>
    import { onMount } from "svelte";
    import {
        milestonesStore,
        risksStore,
    } from "../stores/milestonesRisksStore.js";
    import { API_BASE } from "../config.js";
    import { showSuccess, showError } from "../stores/notificationStore.js";

    let milestonesData = $state({ milestones: [], loading: true });
    let risksData = $state({ risks: [], loading: true });

    // Add Risk form state
    let showAddRiskForm = $state(false);
    let newRisk = $state({ title: "", description: "", severity: "medium" });

    // Project phases (static for now, could come from API)
    const phases = [
        {
            name: "Planning",
            start: 0,
            end: 20,
            color: "bg-blue-500",
            current: false,
        },
        {
            name: "Development",
            start: 20,
            end: 70,
            color: "bg-primary",
            current: true,
        },
        {
            name: "Testing",
            start: 70,
            end: 90,
            color: "bg-purple-500",
            current: false,
        },
        {
            name: "Launch",
            start: 90,
            end: 100,
            color: "bg-secondary",
            current: false,
        },
    ];

    onMount(() => {
        milestonesStore.fetch();
        risksStore.fetch();
    });

    $effect(() => {
        const unsubM = milestonesStore.subscribe((v) => (milestonesData = v));
        const unsubR = risksStore.subscribe((v) => (risksData = v));
        return () => {
            unsubM();
            unsubR();
        };
    });

    const milestones = $derived(
        milestonesData.milestones.map((m) => ({
            ...m,
            completed: !!m.is_completed,
            active: !!m.is_active,
            subTask: m.sub_task_name
                ? {
                      name: m.sub_task_name,
                      progress: m.sub_task_progress,
                      note: m.sub_task_note,
                  }
                : null,
        })),
    );

    // Milestone counter
    const completedCount = $derived(
        milestones.filter((m) => m.completed).length,
    );
    const totalCount = $derived(milestones.length);

    // Risk severity counts
    const risks = $derived(risksData.risks);
    const highRisks = $derived(
        risks.filter((r) => r.severity === "high" || r.type === "warning")
            .length,
    );
    const mediumRisks = $derived(
        risks.filter((r) => r.severity === "medium").length,
    );
    const lowRisks = $derived(risks.filter((r) => r.severity === "low").length);

    // Add Risk handler
    async function handleAddRisk() {
        if (!newRisk.title.trim()) return;
        try {
            const res = await fetch(`${API_BASE}/api/risks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newRisk.title,
                    description: newRisk.description,
                    severity: newRisk.severity,
                    type: newRisk.severity === "high" ? "warning" : "note",
                }),
            });
            if (!res.ok) throw new Error("Failed to add risk");
            showSuccess("Risk Added", "New risk has been logged.");
            risksStore.fetch();
            newRisk = { title: "", description: "", severity: "medium" };
            showAddRiskForm = false;
        } catch (err) {
            showError("Error", err.message);
        }
    }
</script>

<div
    class="flex-1 overflow-y-auto no-scrollbar p-4 pb-24 space-y-6 bg-background-dark"
>
    <!-- Project Phases (Story 4.2) -->
    <div class="bg-surface-dark p-4 rounded-lg border border-border-dark">
        <h2 class="text-base font-bold text-text-light mb-3">Project Phases</h2>
        <div
            class="relative h-8 bg-background-dark rounded-full overflow-hidden border border-border-dark"
        >
            {#each phases as phase}
                <div
                    class="absolute top-0 bottom-0 {phase.color} {phase.current
                        ? 'opacity-100'
                        : 'opacity-40'} transition-opacity"
                    style="left: {phase.start}%; width: {phase.end -
                        phase.start}%;"
                    title={phase.name}
                >
                    <span
                        class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md"
                    >
                        {phase.name}
                    </span>
                </div>
            {/each}
            <!-- Current marker -->
            <div
                class="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                style="left: 45%;"
            ></div>
        </div>
        <div class="flex justify-between mt-2 text-[10px] text-text-muted">
            <span>Start</span>
            <span class="text-primary font-bold">Current: 45%</span>
            <span>Launch</span>
        </div>
    </div>

    <!-- Project Status -->
    <div class="bg-surface-dark p-4 rounded-lg border border-border-dark">
        <h2 class="text-base font-bold text-text-light mb-2">Project Status</h2>
        <p class="text-sm font-light leading-relaxed text-text-light/90 mb-3">
            The Alpha Launch project is progressing efficiently, with key
            development milestones on track.
        </p>
        <div class="flex items-center gap-2 text-primary">
            <span class="material-symbols-outlined text-sm">info</span>
            <span class="text-xs font-medium">Updated: Dec 27, 2024</span>
        </div>
    </div>

    <!-- Key Milestones (Story 4.4: Counter) -->
    <div class="bg-surface-dark p-4 rounded-lg border border-border-dark">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-bold text-text-light">Key Milestones</h2>
            {#if !milestonesData.loading}
                <span
                    class="text-xs font-bold px-2 py-1 rounded-full bg-primary/20 text-primary"
                >
                    ✅ {completedCount} of {totalCount} Complete
                </span>
            {/if}
        </div>

        <div class="relative">
            <!-- Vertical Line -->
            <div
                class="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border-dark"
            ></div>

            <!-- Milestones List -->
            <div class="space-y-4">
                {#if milestonesData.loading}
                    <div class="text-xs text-text-muted animate-pulse">
                        Loading milestones...
                    </div>
                {:else}
                    {#each milestones as milestone, i}
                        <div class="flex gap-4 relative">
                            <!-- Icon -->
                            <div
                                class="relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center {milestone.active
                                    ? 'bg-primary text-background-dark shadow-lg shadow-primary/30'
                                    : milestone.completed
                                      ? 'bg-surface-highlight text-text-muted border border-text-muted/30'
                                      : 'bg-surface-dark text-text-muted border border-dashed border-text-muted/40'}"
                            >
                                <span
                                    class="material-symbols-outlined text-[14px]"
                                    >{milestone.icon}</span
                                >
                            </div>

                            <!-- Content -->
                            <div
                                class="flex-1 min-w-0 {milestone.completed
                                    ? 'opacity-60'
                                    : ''}"
                            >
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span
                                        class="text-sm font-medium {milestone.completed
                                            ? 'line-through text-text-muted'
                                            : 'text-text-light'} {milestone.active
                                            ? 'font-bold'
                                            : ''}"
                                    >
                                        {milestone.name}
                                    </span>
                                    {#if milestone.completed}
                                        <span
                                            class="text-[10px] bg-surface-highlight text-text-muted px-2 py-0.5 rounded-full"
                                            >Done</span
                                        >
                                    {:else if milestone.active}
                                        <span
                                            class="text-[10px] bg-primary text-background-dark px-2 py-0.5 rounded-full font-bold"
                                            >Active</span
                                        >
                                    {/if}
                                </div>
                                <p
                                    class="text-xs {milestone.active
                                        ? 'text-primary'
                                        : 'text-text-muted'} mt-0.5"
                                >
                                    {milestone.dateRange ||
                                        milestone.date_range}
                                </p>

                                {#if milestone.active && milestone.subTask}
                                    <div
                                        class="mt-3 bg-background-dark p-3 rounded border border-border-dark"
                                    >
                                        <div
                                            class="flex items-center justify-between"
                                        >
                                            <span
                                                class="text-xs font-semibold text-text-light"
                                                >{milestone.subTask.name}</span
                                            >
                                            <span
                                                class="text-xs font-bold text-primary"
                                                >{milestone.subTask
                                                    .progress}%</span
                                            >
                                        </div>
                                        <p
                                            class="text-[10px] text-text-muted mt-1"
                                        >
                                            {milestone.subTask.note}
                                        </p>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    </div>

    <!-- Risks & Notes (Story 4.3: Add form + summary) -->
    <div class="bg-surface-dark p-4 rounded-lg border border-border-dark">
        <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-bold text-text-light">Risks & Notes</h2>
            <button
                onclick={() => (showAddRiskForm = !showAddRiskForm)}
                class="text-xs font-bold uppercase px-3 py-1 rounded border border-primary text-primary hover:bg-primary hover:text-background-dark transition-colors"
            >
                {showAddRiskForm ? "✕ Cancel" : "+ Add Risk"}
            </button>
        </div>

        <!-- Risk Summary -->
        {#if risks.length > 0}
            <div class="flex gap-3 mb-3 text-[10px] font-bold">
                {#if highRisks > 0}
                    <span class="px-2 py-0.5 rounded bg-red-500/20 text-red-400"
                        >🔴 {highRisks} High</span
                    >
                {/if}
                {#if mediumRisks > 0}
                    <span
                        class="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400"
                        >🟡 {mediumRisks} Medium</span
                    >
                {/if}
                {#if lowRisks > 0}
                    <span
                        class="px-2 py-0.5 rounded bg-green-500/20 text-green-400"
                        >🟢 {lowRisks} Low</span
                    >
                {/if}
            </div>
        {/if}

        <!-- Add Risk Form -->
        {#if showAddRiskForm}
            <div
                class="bg-background-dark p-3 rounded border border-border-dark mb-3 space-y-3"
            >
                <input
                    type="text"
                    bind:value={newRisk.title}
                    placeholder="Risk title..."
                    class="w-full bg-surface-dark border border-border-dark rounded px-3 py-2 text-sm text-text-light placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
                <textarea
                    bind:value={newRisk.description}
                    placeholder="Description..."
                    rows="2"
                    class="w-full bg-surface-dark border border-border-dark rounded px-3 py-2 text-sm text-text-light placeholder:text-text-muted focus:border-primary focus:outline-none resize-none"
                ></textarea>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-text-muted">Severity:</span>
                    {#each ["high", "medium", "low"] as sev}
                        <button
                            onclick={() => (newRisk.severity = sev)}
                            class="px-2 py-1 text-[10px] font-bold uppercase rounded border transition-colors
                                {newRisk.severity === sev
                                ? sev === 'high'
                                    ? 'bg-red-500 text-white border-red-500'
                                    : sev === 'medium'
                                      ? 'bg-yellow-500 text-background-dark border-yellow-500'
                                      : 'bg-green-500 text-white border-green-500'
                                : 'bg-surface-dark text-text-muted border-border-dark hover:border-primary'}"
                        >
                            {sev}
                        </button>
                    {/each}
                </div>
                <button
                    onclick={handleAddRisk}
                    class="w-full py-2 text-sm font-bold uppercase bg-primary text-background-dark rounded hover:brightness-110 transition-all"
                >
                    Save Risk
                </button>
            </div>
        {/if}
        <ul class="space-y-3">
            {#if risksData.loading}
                <li class="text-xs text-text-muted animate-pulse">
                    Loading risks...
                </li>
            {:else}
                {#each risks as risk}
                    <li class="flex items-start gap-2">
                        <span
                            class="material-symbols-outlined text-sm flex-shrink-0 mt-0.5 {risk.type ===
                            'warning'
                                ? 'text-red-500'
                                : 'text-primary'}"
                        >
                            {risk.type === "warning" ? "warning" : "comment"}
                        </span>
                        <p class="text-xs text-text-light/90">
                            <span class="font-medium text-text-light"
                                >{risk.title}:</span
                            >
                            {risk.description}
                        </p>
                    </li>
                {/each}
            {/if}
        </ul>
    </div>
</div>
