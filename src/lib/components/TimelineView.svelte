<script>
    import { onMount } from "svelte";
    import {
        milestonesStore,
        risksStore,
    } from "../stores/milestonesRisksStore.js";

    let milestonesData = $state({ milestones: [], loading: true });
    let risksData = $state({ risks: [], loading: true });

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

    const risks = $derived(risksData.risks);
</script>

<div
    class="flex-1 overflow-y-auto no-scrollbar p-4 pb-24 space-y-6 bg-background-dark"
>
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

    <!-- Key Milestones -->
    <div class="bg-surface-dark p-4 rounded-lg border border-border-dark">
        <h2 class="text-base font-bold text-text-light mb-4">Key Milestones</h2>

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

    <!-- Risks & Notes -->
    <div class="bg-surface-dark p-4 rounded-lg border border-border-dark">
        <h2 class="text-base font-bold text-text-light mb-3">Risks & Notes</h2>
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
