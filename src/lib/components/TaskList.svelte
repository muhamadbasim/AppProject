<script>
  import TaskCard from "./TaskCard.svelte";
  import { taskListData } from "../data.js";
</script>

<div
  class="flex-1 overflow-y-auto no-scrollbar px-3 pt-2 pb-24 bg-background-dark"
>
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
    {#each taskListData as task (task.id)}
      <div
        class="flex items-center gap-2 py-2 px-1 bg-surface-dark border border-border-dark rounded hover:bg-surface-highlight/50 transition-colors {task.progress ===
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
      </div>
    {/each}
  </div>
</div>

<!-- Floating Add Button -->
<button
  class="fixed bottom-24 right-4 z-40 flex size-12 items-center justify-center rounded-full bg-primary text-background-dark shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform"
>
  <span class="material-symbols-outlined text-xl">add</span>
</button>
