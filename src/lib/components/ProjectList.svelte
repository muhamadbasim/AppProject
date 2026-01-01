<script>
  export let projects = [];
  export let onProjectClick = null;
  export let onEditClick = null;

  function handleClick(project) {
    if (onProjectClick) {
      onProjectClick(project);
    }
  }

  // Calculate health status based on project data
  function getHealthStatus(project) {
    const raw = project._raw || project;
    const progress = parseInt(raw.progress) || 0;
    const status = raw.status?.toLowerCase() || "";

    // Determine health based on status and progress
    if (status === "completed" || status === "done") {
      return {
        color: "bg-green-500",
        label: "Completed",
        reason: "Project completed successfully",
      };
    }
    if (status === "on hold" || status === "blocked") {
      return {
        color: "bg-red-500",
        label: "Blocked",
        reason: "Project is blocked or on hold",
      };
    }
    if (progress >= 70) {
      return {
        color: "bg-green-500",
        label: "On Track",
        reason: `${progress}% complete - Good progress`,
      };
    }
    if (progress >= 40) {
      return {
        color: "bg-yellow-500",
        label: "At Risk",
        reason: `${progress}% complete - May need attention`,
      };
    }
    if (progress < 40 && progress > 0) {
      return {
        color: "bg-red-500",
        label: "Delayed",
        reason: `Only ${progress}% complete - Requires action`,
      };
    }
    return {
      color: "bg-gray-500",
      label: "Not Started",
      reason: "Project has not been started",
    };
  }
</script>

<div class="flex flex-col gap-2">
  {#each projects as project, i}
    {@const health = getHealthStatus(project)}
    <div
      class="group flex flex-col rounded-sm bg-surface-dark p-3 border border-border-dark active:scale-[0.99] transition-transform cursor-pointer hover:bg-surface-highlight/50 hover:border-primary/50 text-left w-full relative pr-10"
      onclick={() => handleClick(project)}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === "Enter" && handleClick(project)}
    >
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-2">
          <!-- Health Status Indicator -->
          <span
            class="size-2.5 rounded-full {health.color} shrink-0"
            title="{health.label}: {health.reason}"
          ></span>
          <span class="text-primary">[{String(i + 1).padStart(3, "0")}]</span>
          <span class="text-text-light font-medium">{project.name}</span>
        </div>
        <span
          class="text-xs {project.status === 'URGENT' ||
          project.status === 'CRIT'
            ? 'text-red-500'
            : 'text-text-muted'}"
        >
          STAT: {project.status}
        </span>
      </div>

      <!-- Edit Button -->
      <button
        class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-primary transition-colors z-10"
        onclick={(e) => {
          e.stopPropagation();
          if (onEditClick) onEditClick(project);
        }}
        title="Edit Project"
      >
        <span class="material-symbols-outlined text-sm">edit</span>
      </button>
    </div>
  {/each}
</div>
