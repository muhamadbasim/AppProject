<script>
  import { tasks, days } from "../data.js";

  // View mode state
  let viewMode = "day"; // day, week, month
  const viewModes = [
    { id: "day", label: "DAY", colWidth: 60 },
    { id: "week", label: "WEEK", colWidth: 120 },
    { id: "month", label: "MONTH", colWidth: 200 },
  ];

  // Dynamic column width based on view mode
  $: currentView = viewModes.find((v) => v.id === viewMode);
  $: COL_WIDTH = currentView?.colWidth || 60;

  const SIDEBAR_WIDTH = 160;
  const ROW_HEIGHT = 80;
  const HEADER_HEIGHT = 48; // h-12 = 3rem = 48px

  export let onTaskClick = null;

  // Calculate dependency arrow positions
  function getDependencyArrows() {
    const arrows = [];
    tasks.forEach((task, index) => {
      if (task.dependsOn) {
        const fromTask = tasks.find((t) => t.id === task.dependsOn);
        if (fromTask) {
          const fromIndex = tasks.indexOf(fromTask);
          // Arrow starts from end of 'from' task bar (right edge)
          // Add SIDEBAR_WIDTH because SVG is absolute over the entire scroll width
          const fromX =
            SIDEBAR_WIDTH +
            (fromTask.startDay + fromTask.duration) * COL_WIDTH -
            10;
          // Add HEADER_HEIGHT offset because Date Header is now inside the scroll container
          const fromY = HEADER_HEIGHT + fromIndex * ROW_HEIGHT + ROW_HEIGHT / 2;

          // Arrow ends at start of 'to' task bar (left edge)
          const toX = SIDEBAR_WIDTH + task.startDay * COL_WIDTH + 10;
          const toY = HEADER_HEIGHT + index * ROW_HEIGHT + ROW_HEIGHT / 2;

          // Midpoint for right-angle connector
          // Go out 15px from the end of the first task
          const midX = fromX + 15;

          arrows.push({ fromX, fromY, toX, toY, midX, fromTask, toTask: task });
        }
      }
    });
    return arrows;
  }

  $: dependencyArrows = getDependencyArrows();

  function handleTaskClick(task) {
    const detailedTask = {
      id: `GANTT-${task.id}`,
      name: task.name.toUpperCase().replace(/\s+/g, "_"),
      status: task.status.toUpperCase().replace(/\s+/g, "_"),
      type: "PROJECT",
      progress: task.progress,
      assignee: "TEAM",
      dueDate: `${task.duration}D`,
      priority: task.onTrack ? "MEDIUM" : "HIGH",
      description: `Project: ${task.name}. Budget: $${task.budget}. Status: ${task.status}. ${task.onTrack ? "On track" : "Needs attention"}.`,
      blockedBy: task.dependsOn ? `GANTT-${task.dependsOn}` : null,
      spent: Math.round((task.progress / 100) * task.budget),
      allocated: task.budget,
      logs: [],
    };
    if (onTaskClick) {
      onTaskClick(detailedTask);
    }
  }
</script>

<!-- View Toggle Header -->
<div
  class="flex items-center justify-between px-4 py-2 bg-surface-dark border-b border-border-dark"
>
  <span class="text-xs font-bold text-text-muted uppercase">View Mode:</span>
  <div class="flex gap-1">
    {#each viewModes as mode}
      <button
        onclick={() => (viewMode = mode.id)}
        class="px-3 py-1 text-[10px] font-bold uppercase rounded border transition-colors
          {viewMode === mode.id
          ? 'bg-primary text-background-dark border-primary'
          : 'bg-background-dark text-text-muted border-border-dark hover:border-primary/50'}"
      >
        {mode.label}
      </button>
    {/each}
    <button
      onclick={() => window.print()}
      class="ml-2 px-3 py-1 text-[10px] font-bold uppercase rounded border bg-background-dark text-text-muted border-border-dark hover:border-primary/50 hover:text-primary transition-colors flex items-center gap-1"
    >
      <span class="material-symbols-outlined text-[12px]">print</span>
      PRINT
    </button>
  </div>
</div>

<!-- Gantt Body -->
<div
  class="flex-1 overflow-y-auto overflow-x-auto relative bg-background-dark"
  id="gantt-container"
>
  <!-- Day Headers (Now Sticky inside Body) -->
  <div
    class="sticky top-0 z-30 flex min-w-max bg-background-dark border-b border-border-dark h-12 shadow-sm"
  >
    <!-- Sticky Corner for Sidebar Header -->
    <div
      class="sticky left-0 z-40 shrink-0 bg-surface-dark border-r border-border-dark flex items-center justify-center"
      style="width: {SIDEBAR_WIDTH}px;"
    >
      <span
        class="text-[10px] font-bold text-text-muted uppercase tracking-wider"
        >Project Timeline</span
      >
    </div>

    <!-- Days Grid -->
    <div class="flex">
      {#each days as day}
        <div
          class="flex flex-col items-center justify-center h-full border-r border-dashed border-border-dark/50 {day.today
            ? 'bg-primary/10'
            : ''} {day.weekend ? 'bg-surface-dark opacity-70' : ''}"
          style="width: {COL_WIDTH}px;"
        >
          <span
            class="text-[9px] font-medium uppercase"
            class:text-primary={day.today}
            class:text-text-muted={!day.today}>{day.day}</span
          >
          {#if day.today}
            <div
              class="size-5 bg-primary rounded-full flex items-center justify-center mt-0.5"
            >
              <span class="text-xs font-bold text-text-on-gold">{day.date}</span
              >
            </div>
          {:else}
            <span
              class="text-sm font-bold"
              class:text-text-light={!day.weekend}
              class:text-text-muted={day.weekend}>{day.date}</span
            >
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- SVG Layer for Dependency Arrows -->
  <svg
    class="absolute inset-0 w-full h-full pointer-events-none z-20"
    style="min-width: {SIDEBAR_WIDTH +
      days.length * COL_WIDTH}px; min-height: {tasks.length * ROW_HEIGHT +
      100}px;"
  >
    <defs>
      <marker
        id="arrowhead"
        markerWidth="8"
        markerHeight="6"
        refX="8"
        refY="3"
        orient="auto"
      >
        <polygon points="0 0, 8 3, 0 6" fill="#FFD700" />
      </marker>
    </defs>
    {#each dependencyArrows as arrow}
      <path
        d="M {arrow.fromX} {arrow.fromY} 
           L {arrow.midX} {arrow.fromY}
           L {arrow.midX} {arrow.toY}
           L {arrow.toX} {arrow.toY}"
        fill="none"
        stroke="#FFD700"
        stroke-width="2"
        stroke-opacity="0.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        marker-end="url(#arrowhead)"
      />
    {/each}
  </svg>

  <!-- Current Time Indicator -->
  <div
    class="absolute top-0 bottom-0 left-[{SIDEBAR_WIDTH +
      COL_WIDTH *
        1.5}px] w-px bg-primary shadow-[0_0_8px_rgba(255,215,0,0.4)] z-10 pointer-events-none"
  ></div>

  <div class="min-w-max pb-24">
    {#each tasks as task}
      <div
        class="flex items-stretch h-20 group hover:bg-surface-highlight/50 transition-colors cursor-pointer"
        onclick={() => handleTaskClick(task)}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === "Enter" && handleTaskClick(task)}
      >
        <!-- Sticky Sidebar -->
        <div
          class="sticky left-0 bg-background-dark group-hover:bg-surface-highlight/50 border-r border-border-dark border-b z-10 flex flex-col justify-center px-3 py-1 gap-0.5 shadow-[4px_0_12px_rgba(0,0,0,0.5)]"
          style="width: {SIDEBAR_WIDTH}px;"
        >
          <div class="flex items-center gap-2 mb-0.5">
            {#if task.avatar}
              <div
                class="size-7 rounded-full bg-cover bg-center shrink-0 border border-white/10"
                style="background-image: url('{task.avatar}');"
              ></div>
            {:else}
              <div
                class="size-7 rounded-full bg-surface-highlight shrink-0 flex items-center justify-center text-xs font-bold text-text-light border border-white/10"
              >
                {task.initials || "??"}
              </div>
            {/if}
            <div class="flex flex-col overflow-hidden leading-tight">
              <span class="text-xs font-bold truncate text-text-light"
                >{task.name}</span
              >
              <span
                class="text-[10px]"
                class:text-secondary={task.status === "Done"}
                class:text-primary={task.status === "In Progress"}
                >{task.status}</span
              >
            </div>
          </div>
          <div
            class="grid grid-cols-2 gap-x-2 text-[9px] text-text-muted font-medium ml-9"
          >
            <div class="flex items-center gap-1">
              <span>{task.budget}</span>
            </div>
            {#if task.dependsOn}
              <div class="flex items-center gap-1 text-primary">
                <span class="material-symbols-outlined text-[10px]">link</span>
                <span>#{task.dependsOn}</span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Timeline Bars -->
        <div class="flex relative border-b border-border-dark">
          <!-- Background Grid -->
          <div class="absolute inset-0 flex pointer-events-none">
            {#each days as _}
              <div
                class="border-r border-dashed border-border-dark/30 h-full"
                style="width: {COL_WIDTH}px;"
              ></div>
            {/each}
          </div>

          <!-- Task Bar -->
          <div
            class="relative h-full flex items-center"
            style="padding-left: {task.startDay * COL_WIDTH}px;"
          >
            <div
              class="h-14 rounded-md flex flex-col justify-between relative overflow-hidden shadow-lg {task.color ===
              'secondary'
                ? 'bg-secondary/20'
                : ''} {task.color === 'primary'
                ? 'bg-primary/20'
                : ''} {task.color === 'surface-highlight'
                ? 'bg-surface-highlight'
                : ''} {task.color === 'danger' ? 'bg-danger/20' : ''}"
              style="width: {task.duration * COL_WIDTH -
                20}px; margin-left: 10px;"
            >
              <div
                class="absolute inset-y-0 left-0 opacity-30 w-full"
                class:bg-secondary={task.color === "secondary"}
                class:bg-primary={task.color === "primary"}
                class:bg-danger={task.color === "danger"}
                style="width: {task.progress}%"
              ></div>

              <div
                class="p-2 text-[9px] font-bold z-10 truncate"
                class:text-secondary={task.color === "secondary"}
                class:text-primary={task.color === "primary"}
                class:text-danger={task.color === "danger"}
              >
                {task.progress}% Complete
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}

    <!-- Add Task Button Row -->
    <div
      class="h-16 flex items-center justify-center border-b border-border-dark text-text-muted text-xs italic"
    >
      + Initiate New Task
    </div>
  </div>
</div>
