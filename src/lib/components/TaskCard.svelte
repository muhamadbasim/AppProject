<script>
  export let task = {};
  export let onToggle = () => {};

  $: priorityLabel = task.priority === 'high' ? '[HIGH]' : task.priority === 'medium' ? '[MED]' : task.priority === 'low' ? '[LOW]' : '';
  $: priorityClass = task.priority === 'high' || task.priority === 'critical' ? 'text-red-500' : task.priority === 'medium' ? 'text-orange-500' : 'text-text-muted';
  $: isCompleted = task.progress === 100;
</script>

<div class="grid grid-cols-[16px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.7fr)] gap-x-2 py-2 px-2 bg-surface-dark border border-border-dark rounded-sm hover:bg-surface-highlight/50 transition-colors active:scale-[0.99] duration-150 group {isCompleted ? 'opacity-60' : ''}">
  <div class="flex items-center justify-center">
    <input
      class="size-4 rounded border border-text-muted bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
      type="checkbox"
      checked={isCompleted}
      on:change={onToggle}
    />
  </div>
  <div class="flex flex-col min-w-0">
    <p class="text-text-light text-xs font-medium leading-tight truncate {isCompleted ? 'line-through text-text-muted' : ''}">
      {task.name}
      {#if priorityLabel}
        <span class="{priorityClass} font-bold ml-1 text-[10px]">{priorityLabel}</span>
      {/if}
    </p>
    <p class="text-text-muted text-[10px] mt-0.5 truncate">TASK ID: {task.id}</p>
  </div>
  <div class="flex items-center text-text-muted text-xs truncate">{task.assignee}</div>
  <div class="flex items-center justify-end text-xs font-bold tabular-nums {task.dueDays <= 0 ? 'text-red-500' : 'text-primary'}">
    {String(task.dueDays).padStart(2, '0')}
  </div>
  <div class="flex items-center text-text-muted text-xs">{task.allocation}</div>
  <div class="flex items-center text-text-muted text-xs relative">
    <div class="inline-block w-10 h-3 bg-transparent border border-text-muted/50 relative overflow-hidden rounded-sm mr-1">
      <div
        class="absolute bottom-0 left-0 h-full {isCompleted ? 'bg-green-500' : 'bg-primary'}"
        style="width: {task.progress}%"
      ></div>
    </div>
    <span class="text-text-light font-medium tabular-nums text-[10px]">{task.progress}%</span>
  </div>
</div>
