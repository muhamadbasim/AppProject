<script>
  export let projects = [];
  export let onProjectClick = null;

  function handleClick(project) {
    if (onProjectClick) {
      onProjectClick(project);
    }
  }
</script>

<div class="flex flex-col gap-2">
  {#each projects as project, i}
    <button
      onclick={() => handleClick(project)}
      class="group flex flex-col rounded-sm bg-surface-dark p-3 border border-border-dark active:scale-[0.99] transition-transform cursor-pointer hover:bg-surface-highlight/50 hover:border-primary/50 text-left w-full"
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
        <span
          class="material-symbols-outlined text-text-muted text-base ml-2 group-hover:text-primary transition-colors"
          >chevron_right</span
        >
      </div>
    </button>
  {/each}
</div>
