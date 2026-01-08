<script>
  let { activeTab = "gantt", onTabChange = (tab) => {} } = $props();
</script>

<nav
  class="fixed bottom-0 w-full z-30 bg-surface-dark/95 backdrop-blur-md border-t border-border-dark pb-safe"
>
  <div class="flex items-center justify-around h-[56px] pb-1">
    <button
      class="flex flex-col items-center justify-center w-full h-full gap-1 {activeTab ===
      'dashboard'
        ? 'text-primary'
        : 'text-text-muted'} hover:text-text-light transition-colors"
      onclick={() => onTabChange("dashboard")}
    >
      <span class="material-symbols-outlined text-xl">grid_on</span>
      <span class="text-[10px] font-medium uppercase">Dashboard</span>
    </button>
    <button
      class="flex flex-col items-center justify-center w-full h-full gap-1 {activeTab ===
      'tasks'
        ? 'text-primary'
        : 'text-text-muted'} hover:text-text-light transition-colors"
      onclick={() => onTabChange("tasks")}
    >
      <span class="material-symbols-outlined text-xl">checklist</span>
      <span class="text-[10px] font-medium uppercase">Tasks</span>
    </button>
    <button
      class="flex flex-col items-center justify-center w-full h-full gap-1 {activeTab ===
      'gantt'
        ? 'text-primary'
        : 'text-text-muted'} hover:text-text-light transition-colors"
      onclick={() => onTabChange("gantt")}
    >
      <span class="material-symbols-outlined text-xl">view_timeline</span>
      <span class="text-[10px] font-medium uppercase">Gantt</span>
    </button>
    <button
      class="flex flex-col items-center justify-center w-full h-full gap-1 {activeTab ===
      'timeline'
        ? 'text-primary'
        : 'text-text-muted'} hover:text-text-light transition-colors"
      onclick={() => onTabChange("timeline")}
    >
      <span class="material-symbols-outlined text-xl">timeline</span>
      <span class="text-[10px] font-medium uppercase">Timeline</span>
    </button>
  </div>
</nav>
