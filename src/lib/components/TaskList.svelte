<script>
  import TaskCard from "./TaskCard.svelte";
  import { taskListData } from "../data.js";

  export let onTaskClick = null;
  export let onFabClick = null;

  // Filter and search state
  let activeFilter = "all";
  let searchQuery = "";

  const filters = [
    { id: "all", label: "ALL" },
    { id: "active", label: "ACTIVE" },
    { id: "high", label: "HIGH" },
    { id: "completed", label: "DONE" },
  ];

  // Sort state
  let sortBy = "default"; // default, due, priority

  const priorityOrder = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
    null: 0,
  };

  // Filtered and Sorted tasks
  $: filteredTasks = taskListData
    .filter((task) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      let matchesFilter = true;
      switch (activeFilter) {
        case "active":
          matchesFilter = task.progress < 100 && task.progress > 0;
          break;
        case "high":
          matchesFilter =
            task.priority === "high" || task.priority === "critical";
          break;
        case "completed":
          matchesFilter = task.progress === 100;
          break;
        default:
          matchesFilter = true;
      }

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "due") {
        return a.dueDays - b.dueDays;
      } else if (sortBy === "priority") {
        const pA = priorityOrder[a.priority] || 0;
        const pB = priorityOrder[b.priority] || 0;
        return pB - pA; // Descending (Critical first)
      }
      return 0; // Default order
    });

  function handleTaskClick(task) {
    const detailedTask = {
      id: task.id,
      name: task.name.toUpperCase().replace(/\s+/g, "_"),
      status: task.status.toUpperCase().replace(/\s+/g, "_"),
      type: "TASK",
      progress: task.progress,
      assignee: task.assignee.toUpperCase().replace(/\s+/g, "_"),
      dueDate: `${task.dueDays}D`,
      priority: task.priority.toUpperCase(),
      description: `Task: ${task.name}. Assigned to ${task.assignee}. Status: ${task.status}.`,
      blockedBy: null,
      spent: 0,
      allocated: 1000,
      logs: [],
    };
    if (onTaskClick) {
      onTaskClick(detailedTask);
    }
  }
</script>

<div
  class="flex-1 overflow-y-auto no-scrollbar px-3 pt-2 pb-24 bg-background-dark"
>
  <!-- Search Bar -->
  <div class="relative mb-3">
    <span
      class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg"
      >search</span
    >
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search tasks..."
      class="w-full bg-surface-dark border border-border-dark rounded-lg pl-10 pr-4 py-2 text-sm text-text-light placeholder:text-text-muted focus:outline-none focus:border-primary"
    />
  </div>

  <!-- Filter Buttons -->
  <div class="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
    {#each filters as filter}
      <button
        onclick={() => (activeFilter = filter.id)}
        class="px-3 py-1.5 text-[10px] font-bold uppercase rounded-full border whitespace-nowrap transition-colors
          {activeFilter === filter.id
          ? 'bg-primary text-background-dark border-primary'
          : 'bg-surface-dark text-text-muted border-border-dark hover:border-primary/50'}"
      >
        {filter.label}
      </button>
    {/each}
  </div>

  <!-- Results Count & Sort -->
  <div class="flex items-center justify-between mb-2 px-1">
    <div class="text-[10px] text-text-muted uppercase">
      {filteredTasks.length} / {taskListData.length} TASKS
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <!-- Sort Toggle -->
      <button
        class="flex items-center gap-1 text-[10px] font-bold text-primary uppercase hover:bg-surface-highlight px-2 py-0.5 rounded transition-colors border border-transparent hover:border-border-dark"
        onclick={() => {
          if (sortBy === "default") sortBy = "due";
          else if (sortBy === "due") sortBy = "priority";
          else sortBy = "default";
        }}
      >
        <span class="material-symbols-outlined text-[14px]">sort</span>
        SORT: {sortBy === "default"
          ? "DEFAULT"
          : sortBy === "due"
            ? "DUE DATE"
            : "PRIORITY"}
      </button>

      <!-- Export CSV -->
      <button
        class="flex items-center gap-1 text-[10px] font-bold text-text-muted hover:text-primary uppercase hover:bg-surface-highlight px-2 py-0.5 rounded transition-colors border border-transparent hover:border-border-dark"
        onclick={() => {
          const headers = [
            "ID",
            "Task",
            "Assignee",
            "Status",
            "Priority",
            "Due Days",
            "Progress",
          ];
          const csvContent = [
            headers.join(","),
            ...filteredTasks.map((t) =>
              [
                t.id,
                `"${t.name}"`,
                t.assignee,
                t.progress === 100 ? "Done" : "Active",
                t.priority || "None",
                t.dueDays,
                `${t.progress}%`,
              ].join(","),
            ),
          ].join("\n");

          const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `tasks_export_${new Date().toISOString().slice(0, 10)}.csv`;
          link.click();
        }}
      >
        <span class="material-symbols-outlined text-[14px]">download</span>
        CSV
      </button>
    </div>
  </div>

  <!-- Table Header -->
  <div
    class="flex items-center gap-2 py-2 px-1 border-b border-border-dark sticky top-0 bg-background-dark z-10 text-text-muted text-[10px] uppercase font-bold"
  >
    <div class="w-5 flex justify-center">
      <span class="material-symbols-outlined text-xs">check</span>
    </div>
    <div class="flex-1 min-w-0">Task</div>
    <div class="w-16 text-center">Assignee</div>
    <div class="w-10 text-center">Due</div>
    <div class="w-14 text-center">Progress</div>
  </div>

  <!-- Task List -->
  <div class="space-y-1 mt-1">
    {#each filteredTasks as task (task.id)}
      <button
        onclick={() => handleTaskClick(task)}
        class="flex items-center gap-2 py-2 px-1 bg-surface-dark border border-border-dark rounded hover:bg-surface-highlight/50 hover:border-primary/50 transition-colors cursor-pointer w-full text-left {task.progress ===
        100
          ? 'opacity-60'
          : ''}"
      >
        <!-- Checkbox -->
        <div class="w-5 flex justify-center">
          <input
            type="checkbox"
            checked={task.progress === 100}
            class="size-4 rounded border-text-muted bg-transparent checked:bg-primary checked:border-primary"
          />
        </div>

        <!-- Task Name -->
        <div class="flex-1 min-w-0">
          <p
            class="text-xs font-medium text-text-light truncate {task.progress ===
            100
              ? 'line-through text-text-muted'
              : ''}"
          >
            {task.name}
            {#if task.priority === "high" || task.priority === "critical"}
              <span class="text-red-500 text-[10px] ml-1"
                >[{task.priority === "critical" ? "CRIT" : "HIGH"}]</span
              >
            {:else if task.priority === "medium"}
              <span class="text-orange-500 text-[10px] ml-1">[MED]</span>
            {/if}
          </p>
          <p class="text-[10px] text-text-muted">{task.id}</p>
        </div>

        <!-- Assignee -->
        <div class="w-16 text-center">
          <p class="text-[10px] text-text-muted truncate">
            {task.assignee.split(" ")[0]}
          </p>
        </div>

        <!-- Due Days -->
        <div class="w-10 text-center">
          <span
            class="text-xs font-bold tabular-nums {task.dueDays <= 0
              ? 'text-red-500'
              : 'text-primary'}">{task.dueDays}</span
          >
        </div>

        <!-- Progress -->
        <div class="w-14 flex items-center gap-1">
          <div class="flex-1 h-2 bg-surface-highlight rounded overflow-hidden">
            <div
              class="h-full {task.progress === 100
                ? 'bg-green-500'
                : 'bg-primary'}"
              style="width: {task.progress}%"
            ></div>
          </div>
          <span class="text-[10px] text-text-muted w-6 text-right"
            >{task.progress}%</span
          >
        </div>
      </button>
    {:else}
      <div class="text-center py-8 text-text-muted text-sm">
        <span class="material-symbols-outlined text-3xl mb-2 block opacity-50"
          >search_off</span
        >
        No tasks found
      </div>
    {/each}
  </div>
</div>

<!-- Floating Add Button -->
<button
  onclick={onFabClick}
  class="fixed bottom-24 right-4 z-40 flex size-12 items-center justify-center rounded-full bg-primary text-background-dark shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform"
>
  <span class="material-symbols-outlined text-xl">add</span>
</button>
