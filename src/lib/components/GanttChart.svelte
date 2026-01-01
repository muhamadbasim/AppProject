<script>
  import { onMount } from "svelte";
  import { tasksStore } from "../stores/tasksStore.js";
  import { showSuccess, showError } from "../stores/notificationStore.js";
  import { days as staticDays } from "../data.js";

  let { onTaskClick = null } = $props();

  let tasksData = $state({ tasks: [], loading: true, error: null });
  let viewMode = $state("day"); // day, week, month

  // Drag-and-drop state
  let dragState = $state({
    isDragging: false,
    taskId: null,
    startX: 0,
    originalStartDay: 0,
    currentOffset: 0,
  });
  let showConflictModal = $state(false);
  let conflictInfo = $state({ task: null, newStartDay: 0 });

  const API_BASE = import.meta.env.DEV
    ? "http://127.0.0.1:8787"
    : "https://project-control-center-api.perfectmoney7.workers.dev";

  onMount(() => {
    tasksStore.fetch();
    // Add global mouse handlers for drag
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  });

  $effect(() => {
    const unsub = tasksStore.subscribe((v) => (tasksData = v));
    return unsub;
  });

  const viewModes = [
    { id: "day", label: "DAY", colWidth: 60 },
    { id: "week", label: "WEEK", colWidth: 120 },
    { id: "month", label: "MONTH", colWidth: 200 },
  ];

  // Dynamic column width based on view mode
  const currentView = $derived(viewModes.find((v) => v.id === viewMode));
  const COL_WIDTH = $derived(currentView?.colWidth || 60);

  const SIDEBAR_WIDTH = 160;
  const ROW_HEIGHT = 80;
  const HEADER_HEIGHT = 48; // h-12 = 3rem = 48px

  // Map backend tasks to Gantt-friendly format
  const ganttTasks = $derived(
    (tasksData.tasks || []).map((t, i) => ({
      ...t,
      startDay: t.startDay ?? i * 2, // Fallback logic if startDay missing
      duration: t.duration ?? 4,
      color: t.color || "primary",
    })),
  );

  // Calculate dependency arrow positions
  const dependencyArrows = $derived.by(() => {
    const arrows = [];
    ganttTasks.forEach((task, index) => {
      const dependsOnId = task.depends_on || task.dependsOn;
      if (dependsOnId) {
        const fromTask = ganttTasks.find((t) => t.id === dependsOnId);
        if (fromTask) {
          const fromIndex = ganttTasks.indexOf(fromTask);
          const fromX =
            SIDEBAR_WIDTH +
            (fromTask.startDay + fromTask.duration) * COL_WIDTH -
            10;
          const fromY = HEADER_HEIGHT + fromIndex * ROW_HEIGHT + ROW_HEIGHT / 2;
          const toX = SIDEBAR_WIDTH + task.startDay * COL_WIDTH + 10;
          const toY = HEADER_HEIGHT + index * ROW_HEIGHT + ROW_HEIGHT / 2;
          const midX = fromX + 15;
          arrows.push({ fromX, fromY, toX, toY, midX, fromTask, toTask: task });
        }
      }
    });
    return arrows;
  });

  function handleTaskClick(task) {
    if (dragState.isDragging) return; // Don't open detail if dragging
    const detailedTask = {
      id: `GANTT-${task.id}`,
      name: task.name.toUpperCase().replace(/\s+/g, "_"),
      status: (task.status || "PENDING").toUpperCase().replace(/\s+/g, "_"),
      type: "PROJECT",
      progress: task.progress || 0,
      assignee: (task.assignee || "TEAM").toUpperCase().replace(/\s+/g, "_"),
      dueDate: `${task.duration}D`,
      priority: task.priority || "MEDIUM",
      description: `Project Task: ${task.name}. Budget: ${task.budget || "N/A"}. Status: ${task.status}.`,
      blockedBy: task.depends_on || task.dependsOn || null,
      spent: 0,
      allocated: 0,
      logs: [],
    };
    if (onTaskClick) {
      onTaskClick(detailedTask);
    }
  }

  // Drag handlers
  function handleDragStart(e, task) {
    e.stopPropagation();
    e.preventDefault();
    dragState = {
      isDragging: true,
      taskId: task.id,
      startX: e.clientX,
      originalStartDay: task.startDay ?? 0,
      currentOffset: 0,
    };
  }

  function handleDragMove(e) {
    if (!dragState.isDragging) return;
    const deltaX = e.clientX - dragState.startX;
    const daysDelta = Math.round(deltaX / COL_WIDTH);
    dragState.currentOffset = daysDelta;
  }

  function handleDragEnd(e) {
    if (!dragState.isDragging) return;

    const newStartDay = Math.max(
      0,
      dragState.originalStartDay + dragState.currentOffset,
    );
    const task = ganttTasks.find((t) => t.id === dragState.taskId);

    if (task && dragState.currentOffset !== 0) {
      // Check for dependency conflicts
      const dependsOnId = task.depends_on || task.dependsOn;
      if (dependsOnId) {
        const predecessor = ganttTasks.find((t) => t.id === dependsOnId);
        if (predecessor) {
          const predecessorEnd =
            (predecessor.startDay ?? 0) + (predecessor.duration ?? 1);
          if (newStartDay < predecessorEnd) {
            // Conflict detected!
            conflictInfo = { task, newStartDay };
            showConflictModal = true;
            dragState = {
              isDragging: false,
              taskId: null,
              startX: 0,
              originalStartDay: 0,
              currentOffset: 0,
            };
            return;
          }
        }
      }
      // No conflict, save immediately
      saveTaskDates(task.id, newStartDay);
    }

    dragState = {
      isDragging: false,
      taskId: null,
      startX: 0,
      originalStartDay: 0,
      currentOffset: 0,
    };
  }

  async function saveTaskDates(taskId, newStartDay) {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDay: newStartDay }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      showSuccess("Task Rescheduled", "Timeline updated successfully.");
      tasksStore.fetch(); // Refresh
    } catch (err) {
      showError("Error", err.message);
    }
  }

  function confirmConflict() {
    if (conflictInfo.task) {
      saveTaskDates(conflictInfo.task.id, conflictInfo.newStartDay);
    }
    showConflictModal = false;
    conflictInfo = { task: null, newStartDay: 0 };
  }

  function cancelConflict() {
    showConflictModal = false;
    conflictInfo = { task: null, newStartDay: 0 };
  }

  // Calculate visual offset for dragging task
  function getDragOffset(taskId) {
    if (dragState.isDragging && dragState.taskId === taskId) {
      return dragState.currentOffset * COL_WIDTH;
    }
    return 0;
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
      {#each staticDays as day}
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
      staticDays.length * COL_WIDTH}px; min-height: {ganttTasks.length *
      ROW_HEIGHT +
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
    {#if tasksData.loading}
      <div class="text-center py-10 text-text-muted">Loading timeline...</div>
    {:else}
      {#each ganttTasks as task}
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
                  {task.initials ||
                    (task.assignee
                      ? task.assignee.slice(0, 2).toUpperCase()
                      : "??")}
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
                <span>{task.budget || "—"}</span>
              </div>
              {#if task.depends_on || task.dependsOn}
                <div class="flex items-center gap-1 text-primary">
                  <span class="material-symbols-outlined text-[10px]">link</span
                  >
                  <span>#{task.depends_on || task.dependsOn}</span>
                </div>
              {/if}
            </div>
          </div>

          <!-- Timeline Bars -->
          <div class="flex relative border-b border-border-dark">
            <!-- Background Grid -->
            <div class="absolute inset-0 flex pointer-events-none">
              {#each staticDays as _}
                <div
                  class="border-r border-dashed border-border-dark/30 h-full"
                  style="width: {COL_WIDTH}px;"
                ></div>
              {/each}
            </div>

            <!-- Task Bar (Draggable) -->
            <div
              class="relative h-full flex items-center"
              style="padding-left: {(task.startDay || 0) * COL_WIDTH +
                getDragOffset(task.id)}px; transition: {dragState.isDragging &&
              dragState.taskId === task.id
                ? 'none'
                : 'padding-left 0.2s ease'};"
            >
              <div
                class="h-14 rounded-md flex flex-col justify-between relative overflow-hidden shadow-lg cursor-grab active:cursor-grabbing select-none {task.color ===
                'secondary'
                  ? 'bg-secondary/20'
                  : ''} {task.color === 'primary'
                  ? 'bg-primary/20'
                  : ''} {task.color === 'surface-highlight'
                  ? 'bg-surface-highlight'
                  : ''} {task.color === 'danger'
                  ? 'bg-danger/20'
                  : ''} {dragState.isDragging && dragState.taskId === task.id
                  ? 'ring-2 ring-primary scale-105'
                  : ''}"
                style="width: {(task.duration || 1) * COL_WIDTH -
                  20}px; margin-left: 10px;"
                onmousedown={(e) => handleDragStart(e, task)}
                role="button"
                aria-label="Drag to reschedule {task.name}"
                tabindex="0"
              >
                <div
                  class="absolute inset-y-0 left-0 opacity-30 w-full"
                  class:bg-secondary={task.color === "secondary"}
                  class:bg-primary={task.color === "primary"}
                  class:bg-danger={task.color === "danger"}
                  style="width: {task.progress || 0}%"
                ></div>

                <div
                  class="p-2 text-[9px] font-bold z-10 truncate"
                  class:text-secondary={task.color === "secondary"}
                  class:text-primary={task.color === "primary"}
                  class:text-danger={task.color === "danger"}
                >
                  {task.progress || 0}% Complete
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}

    <!-- Add Task Button Row -->
    <div
      class="h-16 flex items-center justify-center border-b border-border-dark text-text-muted text-xs italic"
    >
      + Initiate New Task
    </div>
  </div>
</div>

<!-- Dependency Conflict Modal -->
{#if showConflictModal}
  <div
    class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
  >
    <div
      class="bg-surface-dark border border-border-dark rounded-lg p-6 max-w-md w-full shadow-2xl"
    >
      <div class="flex items-center gap-3 mb-4">
        <span class="material-symbols-outlined text-3xl text-danger"
          >warning</span
        >
        <h3 class="text-lg font-bold text-text-light uppercase">
          Dependency Conflict
        </h3>
      </div>
      <p class="text-sm text-text-muted mb-4">
        Moving <span class="text-primary font-bold"
          >{conflictInfo.task?.name}</span
        >
        to day {conflictInfo.newStartDay}
        would place it before its dependency completes. This may cause scheduling
        issues.
      </p>
      <div class="flex gap-3">
        <button
          onclick={cancelConflict}
          class="flex-1 py-2 px-4 text-sm font-bold uppercase bg-surface-highlight border border-border-dark text-text-muted rounded hover:bg-surface-dark transition-colors"
        >
          Cancel
        </button>
        <button
          onclick={confirmConflict}
          class="flex-1 py-2 px-4 text-sm font-bold uppercase bg-danger text-white rounded hover:brightness-110 transition-all"
        >
          Move Anyway
        </button>
      </div>
    </div>
  </div>
{/if}
