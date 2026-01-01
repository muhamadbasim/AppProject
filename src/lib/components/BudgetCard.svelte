<script>
    import { onMount } from "svelte";
    import { resourcesStore } from "../stores/resourcesStore";

    export let projectId;

    let budgetData = null;

    // Use store subscription
    resourcesStore.subscribe((state) => {
        if (state.projectBudget && state.projectBudget.projectId == projectId) {
            budgetData = state.projectBudget;
        }
    });

    onMount(() => {
        if (projectId) {
            resourcesStore.fetchProjectBudget(projectId);
        }
    });

    // Color logic
    $: percent = budgetData
        ? (budgetData.actualSpend / budgetData.totalBudget) * 100
        : 0;
    $: barColor =
        percent > 100
            ? "bg-red-500"
            : percent > 80
              ? "bg-yellow-500"
              : "bg-primary";
    $: statusColor =
        percent > 100
            ? "text-red-400"
            : percent > 80
              ? "text-yellow-400"
              : "text-primary";
</script>

<div
    class="bg-surface-dark border border-border-dark rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
>
    <div class="flex items-center gap-3 mb-3">
        <div class="p-2 bg-background-dark rounded-lg">
            <span class="material-symbols-outlined text-primary text-xl"
                >attach_money</span
            >
        </div>
        <div>
            <h3 class="text-sm font-bold text-text-light">Budget Overview</h3>
            <p class="text-[10px] text-text-muted">Spent vs Total</p>
        </div>
    </div>

    {#if budgetData}
        <div class="space-y-4">
            <div class="flex items-end justify-between">
                <div>
                    <div class="text-[10px] text-text-muted mb-0.5">Spent</div>
                    <div class="text-lg font-bold text-text-light">
                        {budgetData.currency === "USD"
                            ? "$"
                            : ""}{budgetData.actualSpend.toLocaleString()}
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-[10px] text-text-muted mb-0.5">Total</div>
                    <div class="text-sm font-semibold {statusColor}">
                        / {budgetData.currency === "USD"
                            ? "$"
                            : ""}{budgetData.totalBudget.toLocaleString()}
                    </div>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="h-2 bg-background-dark rounded-full overflow-hidden">
                <div
                    class="h-full {barColor} transition-all duration-500 rounded-full"
                    style="width: {Math.min(percent, 100)}%"
                ></div>
            </div>

            <div class="flex justify-between text-[10px]">
                <span class={statusColor}>{percent.toFixed(1)}% Used</span>
                <span class="text-text-muted"
                    >Remaining: {budgetData.remaining.toLocaleString()}</span
                >
            </div>
        </div>
    {:else}
        <div class="animate-pulse space-y-3">
            <div class="h-8 bg-background-dark rounded w-full"></div>
            <div class="h-2 bg-background-dark rounded w-full"></div>
        </div>
    {/if}
</div>
