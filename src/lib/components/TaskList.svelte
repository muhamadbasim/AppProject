<script>
  import TaskCard from './TaskCard.svelte';
  import { taskListData } from '../data.js';
</script>

<div class="flex-1 overflow-y-auto no-scrollbar px-2 pt-1 pb-24 bg-background-dark">
  <!-- Table Header -->
  <div class="grid grid-cols-[16px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.7fr)] gap-x-2 py-2 px-2 border-b border-border-dark sticky top-0 bg-background-dark z-10 text-text-muted text-[10px] uppercase font-bold">
    <div class="flex items-center justify-center"><span class="material-symbols-outlined text-xs">check_box_outline_blank</span></div>
    <div class="flex items-center">Task Description</div>
    <div class="flex items-center">Assigned To</div>
    <div class="flex items-center justify-end">Due (Days)</div>
    <div class="flex items-center">Allocation</div>
    <div class="flex items-center">Progress</div>
  </div>
  <!-- Task List -->
  <div class="space-y-px">
    {#each taskListData as task (task.id)}
      <TaskCard {task} />
    {/each}
  </div>
</div>

<!-- Floating Add Button -->
<button class="fixed bottom-24 right-5 z-40 flex size-12 items-center justify-center rounded-sm bg-primary text-background-dark shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform duration-200">
  <span class="material-symbols-outlined text-2xl font-medium">add</span>
</button>
