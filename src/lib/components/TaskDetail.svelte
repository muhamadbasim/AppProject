<script>
    export let task = {
        id: "PROJ-123",
        name: "USER_AUTH_API",
        status: "IN_PROGRESS",
        type: "BACKEND",
        progress: 65,
        assignee: "JANE_DOE",
        dueDate: "OCT_24 (2D)",
        priority: "HIGH",
        description:
            "REWRITE AUTHENTICATION MIDDLEWARE TO SUPPORT JWT_TOKENS. INCLUDES UPDATING USER_SCHEMA, IMPLEMENTING TOKEN_REFRESH_LOGIC, AND ENSURING BACKWARD_COMPATIBILITY WITH LEGACY SESSION-BASED_AUTH_SYSTEM.",
        blockedBy: { id: "PROJ-40", name: "DATABASE SCHEMA UPDATE" },
        spent: 2500,
        allocated: 5000,
        logs: [
            {
                user: "ALEX_M",
                message: "CHECK NEW ENDPOINT_SPECS BEFORE STARTING.",
                time: "2H_AGO",
            },
        ],
    };
    export let onClose = () => {};
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
                >TYPE: {task.type}</span
            >
        </div>
    </div>

    <!-- Progress -->
    <div class="border-b border-border-dark py-2">
        <div class="flex justify-between">
            <span class="text-primary font-bold uppercase mr-4">PROG</span>
            <span class="text-primary">{task.progress}% [ON_TRACK]</span>
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

    <!-- Assignee, Due, Priority -->
    <div class="border-b border-border-dark py-2 space-y-1">
        <div class="flex justify-between">
            <span class="text-primary font-bold uppercase">ASSG</span>
            <span>{task.assignee}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-primary font-bold uppercase">DUE</span>
            <span>{task.dueDate}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-primary font-bold uppercase">PRIO</span>
            <span class="text-orange-500 font-bold">{task.priority}</span>
        </div>
    </div>

    <!-- Description -->
    <div class="border-b border-border-dark py-2">
        <div class="flex justify-between mb-1">
            <span class="text-primary font-bold uppercase">DESC</span>
        </div>
        <div class="pl-4 text-xs overflow-auto max-h-24">
            <p>{task.description}</p>
            <button class="text-xs text-primary mt-1 hover:underline"
                >CMD:MORE_INFO</button
            >
        </div>
    </div>

    <!-- Dependencies -->
    {#if task.blockedBy}
        <div class="border-b border-border-dark py-2">
            <div class="flex justify-between mb-1">
                <span class="text-primary font-bold uppercase">DEPS</span>
            </div>
            <div class="pl-4 border-l border-primary pt-1 pb-1">
                <span class="text-xs text-primary font-bold block"
                    >BLOCKED_BY: {task.blockedBy.id}</span
                >
                <span class="text-xs block">{task.blockedBy.name}</span>
                <button class="text-xs text-primary mt-1 hover:underline"
                    >CMD:VIEW_DEP</button
                >
            </div>
        </div>
    {/if}

    <!-- Budget -->
    <div class="border-b border-border-dark py-2">
        <div class="flex justify-between">
            <span class="text-primary font-bold uppercase">SPNT</span>
            <span>${task.spent}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-primary font-bold uppercase">ALLOC</span>
            <span>${task.allocated}</span>
        </div>
        <div
            class="h-2 w-full bg-surface-highlight flex items-center justify-start overflow-hidden my-1"
        >
            <div
                class="h-full bg-primary"
                style="width: {(task.spent / task.allocated) * 100}%;"
            ></div>
        </div>
        <div class="flex justify-between text-xs text-text-muted">
            <span>{Math.round((task.spent / task.allocated) * 100)}% USED</span>
            <span>100% CAP</span>
        </div>
    </div>

    <!-- Logs -->
    <div class="py-2">
        <div class="flex justify-between mb-1">
            <span class="text-primary font-bold uppercase">LOGS</span>
        </div>
        <div class="pl-4 pt-1 pb-1">
            {#each task.logs as log}
                <p class="text-xs">
                    <span class="text-primary font-bold">{log.user}:</span>
                    "{log.message}"
                </p>
                <span class="text-xs text-text-muted">{log.time}</span>
            {/each}
            <button class="text-xs text-primary mt-1 hover:underline block"
                >CMD:VIEW_ALL_LOGS</button
            >
        </div>
    </div>
</div>

<!-- Fixed Bottom Button -->
<div
    class="fixed bottom-0 left-0 right-0 z-40 bg-background-dark/80 px-2 pt-2 pb-4 backdrop-blur-lg border-t border-border-dark"
>
    <button
        class="flex h-10 w-full items-center justify-center gap-2 bg-primary px-6 font-bold text-background-dark text-sm uppercase"
    >
        CMD:TASK_COMPLETE
    </button>
</div>
