<script>
  export let projects = [];
  export let onProjectClick = null;
  export let onEditClick = null;

  function handleClick(project) {
    if (onProjectClick) {
      onProjectClick(project);
    }
  }
</script>

<div class="flex flex-col gap-2">
  {#each projects as project, i}
    <div
      class="group flex flex-col rounded-sm bg-surface-dark p-3 border border-border-dark active:scale-[0.99] transition-transform cursor-pointer hover:bg-surface-highlight/50 hover:border-primary/50 text-left w-full relative pr-10"
      onclick={() => handleClick(project)}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === "Enter" && handleClick(project)}
    >
      <div class="flex items-center justify-between text-sm">
        <span class="text-primary">[{String(i + 1).padStart(3, "0")}]</span>
        <span class="flex-1 ml-2 text-text-light font-medium"
          >{project.name}</span
        >
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
