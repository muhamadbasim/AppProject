<script>
    let { milestone = {}, isActive = false, isCompleted = false } = $props();
</script>

<div class="flex gap-x-4">
    <!-- Icon Column -->
    <div class="flex flex-col items-center gap-2 {isCompleted ? 'pt-1' : ''}">
        {#if !isCompleted && !isActive}
            <div class="w-px bg-border-dark h-2 rounded-full"></div>
        {:else if isActive}
            <div class="w-px bg-primary h-2 rounded-full"></div>
        {/if}

        <div
            class="p-2 rounded-full {isActive
                ? 'text-background-dark bg-primary shadow-lg shadow-primary/20'
                : isCompleted
                  ? 'text-text-muted bg-surface-dark border border-text-muted/30'
                  : 'text-text-muted bg-surface-dark border border-dashed border-text-muted/40'}"
        >
            <span class="material-symbols-outlined text-[16px]"
                >{milestone.icon || "flag"}</span
            >
        </div>

        <div
            class="w-px h-full grow rounded-full {isActive
                ? 'bg-primary'
                : 'bg-border-dark'}"
        ></div>
    </div>

    <!-- Content Column -->
    <div
        class="flex flex-1 flex-col py-1 pb-6 {isCompleted
            ? 'opacity-80'
            : ''} {!isActive && !isCompleted ? 'opacity-70' : ''}"
    >
        <div class="flex justify-between items-start mb-1">
            <p
                class="text-base font-medium leading-normal {isCompleted
                    ? 'line-through text-text-muted'
                    : 'text-text-light'} {isActive ? 'font-bold' : ''}"
            >
                {milestone.name}
            </p>
            {#if isCompleted}
                <span
                    class="text-xs bg-surface-dark text-text-muted px-2 py-0.5 rounded-full"
                    >Done</span
                >
            {:else if isActive}
                <span
                    class="text-xs bg-primary text-background-dark px-2 py-0.5 rounded-full font-bold animate-pulse"
                    >Active</span
                >
            {/if}
        </div>
        <p
            class="text-sm font-light leading-normal {isActive
                ? 'text-primary font-medium'
                : 'text-text-muted'}"
        >
            {milestone.dateRange}
        </p>

        {#if isActive && milestone.subTask}
            <div
                class="mt-4 bg-background-dark p-4 rounded-lg border border-border-dark shadow-sm"
            >
                <div class="flex items-center justify-between">
                    <p
                        class="text-sm font-semibold leading-tight text-text-light"
                    >
                        {milestone.subTask.name}
                    </p>
                    <span class="text-xs font-bold text-primary"
                        >{milestone.subTask.progress}% Complete</span
                    >
                </div>
                <p
                    class="text-xs font-light leading-normal text-text-muted mt-1"
                >
                    {milestone.subTask.note}
                </p>
            </div>
        {/if}
    </div>
</div>
