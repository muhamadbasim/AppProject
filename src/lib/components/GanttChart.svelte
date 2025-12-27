<script>
  import { tasks, days } from '../data.js';

  // Constants for layout
  const COL_WIDTH = 70;
  const SIDEBAR_WIDTH = 220;
</script>

<div class="flex overflow-x-auto no-scrollbar bg-background-dark border-b border-border-dark shrink-0 pl-[{SIDEBAR_WIDTH}px]">
  <div class="flex min-w-max">
    {#each days as day}
      <div 
        class="flex flex-col items-center justify-center w-[{COL_WIDTH}px] h-12 border-r border-dashed border-border-dark/50 {day.today ? 'bg-primary/10' : ''} {day.weekend ? 'bg-surface-dark opacity-70' : ''}"
      >
        <span class="text-[9px] font-medium uppercase" class:text-primary={day.today} class:text-text-muted={!day.today}>{day.day}</span>
        {#if day.today}
          <div class="size-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
            <span class="text-xs font-bold text-text-on-gold">{day.date}</span>
          </div>
        {:else}
          <span class="text-sm font-bold" class:text-text-light={!day.weekend} class:text-text-muted={day.weekend}>{day.date}</span>
        {/if}
      </div>
    {/each}
  </div>
</div>

<div class="flex-1 overflow-y-auto overflow-x-auto relative bg-background-dark" id="gantt-container">
  <!-- Current Time Indicator -->
  <div class="absolute top-0 bottom-0 left-[{SIDEBAR_WIDTH + COL_WIDTH * 1.5}px] w-px bg-primary shadow-[0_0_8px_rgba(255,215,0,0.4)] z-10 pointer-events-none"></div>

  <div class="min-w-max pb-24">
    {#each tasks as task}
      <div class="flex items-stretch h-20 group hover:bg-surface-highlight/50 transition-colors">
        <!-- Sticky Sidebar -->
        <div class="sticky left-0 w-[{SIDEBAR_WIDTH}px] bg-background-dark group-hover:bg-surface-highlight/50 border-r border-border-dark border-b z-10 flex flex-col justify-center px-3 py-1 gap-0.5 shadow-[4px_0_12px_rgba(0,0,0,0.5)]">
          <div class="flex items-center gap-2 mb-0.5">
            {#if task.avatar}
              <div class="size-7 rounded-full bg-cover bg-center shrink-0 border border-white/10" style="background-image: url('{task.avatar}');"></div>
            {:else}
              <div class="size-7 rounded-full bg-surface-highlight shrink-0 flex items-center justify-center text-xs font-bold text-text-light border border-white/10">{task.initials || '??'}</div>
            {/if}
            <div class="flex flex-col overflow-hidden leading-tight">
              <span class="text-xs font-bold truncate text-text-light">{task.name}</span>
              <span class="text-[10px]" class:text-secondary={task.status === 'Done'} class:text-primary={task.status === 'In Progress'}>{task.status}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-x-2 text-[9px] text-text-muted font-medium ml-9">
             <!-- Simplified details for now -->
             <div class="flex items-center gap-1"><span>{task.budget}</span></div>
          </div>
        </div>

        <!-- Timeline Bars -->
        <div class="flex relative border-b border-border-dark">
          <!-- Background Grid -->
          <div class="absolute inset-0 flex pointer-events-none">
            {#each days as _}
              <div class="w-[{COL_WIDTH}px] border-r border-dashed border-border-dark/30 h-full"></div>
            {/each}
          </div>

          <!-- Task Bar -->
          <div class="relative h-full flex items-center" style="padding-left: {task.startDay * COL_WIDTH}px;">
             <!-- Bar Width = duration * COL_WIDTH (minus some padding perhaps) -->
             <div 
               class="h-14 rounded-md flex flex-col justify-between relative overflow-hidden shadow-lg {task.color === 'secondary' ? 'bg-secondary/20' : ''} {task.color === 'primary' ? 'bg-primary/20' : ''} {task.color === 'surface-highlight' ? 'bg-surface-highlight' : ''} {task.color === 'danger' ? 'bg-danger/20' : ''}"
               style="width: {task.duration * COL_WIDTH - 20}px; margin-left: 10px;"
             >
                <div class="absolute inset-y-0 left-0 opacity-30 w-full" 
                  class:bg-secondary={task.color === 'secondary'}
                  class:bg-primary={task.color === 'primary'}
                  class:bg-danger={task.color === 'danger'}
                  style="width: {task.progress}%"
                ></div>
                
                <div class="p-2 text-[9px] font-bold z-10 truncate"
                   class:text-secondary={task.color === 'secondary'}
                   class:text-primary={task.color === 'primary'}
                   class:text-danger={task.color === 'danger'}
                >
                  {task.progress}% Complete
                </div>
             </div>
          </div>
        </div>
      </div>
    {/each}
    
    <!-- Add Task Button Row -->
    <div class="h-16 flex items-center justify-center border-b border-border-dark text-text-muted text-xs italic">
       + Initiate New Task
    </div>
  </div>
</div>
