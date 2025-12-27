<script>
  export let title = "Project Control Center";
  export let subtitle = "Real-time Project Overview";
</script>

<header class="flex items-center justify-between p-4 bg-background-dark z-20 shadow-lg shadow-black/40 shrink-0">
  <button class="text-text-light flex size-10 shrink-0 items-center justify-center rounded-full active:bg-surface-highlight transition-colors">
    <span class="material-symbols-outlined">arrow_back</span>
  </button>
  <div class="text-center flex-1 px-2">
    <h1 class="text-lg font-bold leading-tight text-primary">{title}</h1>
    <p class="text-[10px] text-text-muted uppercase tracking-widest">{subtitle}</p>
  </div>
  <div class="flex w-10 items-center justify-end">
    <button class="flex size-10 items-center justify-center rounded-full active:bg-surface-highlight transition-colors text-text-light">
      <span class="material-symbols-outlined">more_horiz</span>
    </button>
  </div>
</header>
