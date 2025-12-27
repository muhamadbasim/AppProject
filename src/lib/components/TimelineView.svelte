<script>
    import MilestoneItem from "./MilestoneItem.svelte";

    const milestones = [
        {
            name: "Design Phase Complete",
            dateRange: "Oct 1 - Oct 15",
            icon: "design_services",
            completed: true,
        },
        {
            name: "Development Sprint 1",
            dateRange: "Oct 16 - Oct 30",
            icon: "code",
            active: true,
            subTask: {
                name: "Frontend Implementation",
                progress: 75,
                note: "On track for completion by Oct 25.",
            },
        },
        {
            name: "Milestone: Alpha Release",
            dateRange: "October 31",
            icon: "flag",
        },
        {
            name: "QA Testing Phase",
            dateRange: "Nov 1 - Nov 14",
            icon: "bug_report",
        },
    ];

    const risks = [
        {
            type: "warning",
            title: "Dependency Delay",
            description:
                "Awaiting final API specifications from partner team. Estimated impact: 2 days.",
        },
        {
            type: "note",
            title: "Resource Allocation",
            description: "Reviewing Q1 allocation for upcoming features.",
        },
    ];
</script>

<div
    class="flex-1 overflow-y-auto no-scrollbar relative flex flex-col p-6 space-y-8 pb-24 bg-background-dark"
>
    <!-- Project Status -->
    <div
        class="bg-surface-dark p-6 rounded-xl border border-border-dark shadow-sm"
    >
        <h2 class="text-lg font-bold text-text-light mb-3">Project Status</h2>
        <p class="text-sm font-light leading-relaxed text-text-light/90 mb-4">
            The Alpha Launch project is progressing efficiently, with key
            development milestones on track. We are currently in the primary
            development sprint, focusing on core frontend functionalities.
        </p>
        <div class="flex items-center gap-2 text-primary">
            <span class="material-symbols-outlined text-base">info</span>
            <span class="text-xs font-medium">Updated: Dec 27, 2024</span>
        </div>
    </div>

    <!-- Key Milestones -->
    <div
        class="bg-surface-dark p-6 rounded-xl border border-border-dark shadow-sm"
    >
        <h2 class="text-lg font-bold text-text-light mb-4">Key Milestones</h2>
        <div class="grid grid-cols-[30px_1fr] gap-x-4">
            {#each milestones as milestone}
                <MilestoneItem
                    {milestone}
                    isActive={milestone.active || false}
                    isCompleted={milestone.completed || false}
                />
            {/each}
        </div>
    </div>

    <!-- Risks & Notes -->
    <div
        class="bg-surface-dark p-6 rounded-xl border border-border-dark shadow-sm"
    >
        <h2 class="text-lg font-bold text-text-light mb-4">Risks & Notes</h2>
        <ul class="space-y-3">
            {#each risks as risk}
                <li class="flex items-start gap-3">
                    <span
                        class="material-symbols-outlined {risk.type ===
                        'warning'
                            ? 'text-red-500'
                            : 'text-primary'} text-base flex-shrink-0 mt-0.5"
                    >
                        {risk.type === "warning" ? "warning" : "comment"}
                    </span>
                    <p class="text-sm font-light text-text-light/90">
                        <span class="font-medium text-text-light"
                            >{risk.title}:</span
                        >
                        {risk.description}
                    </p>
                </li>
            {/each}
        </ul>
    </div>
</div>
