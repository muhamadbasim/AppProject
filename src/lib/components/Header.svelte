<script>
  import NotificationBell from "./NotificationBell.svelte";
  import ExportButton from "./ExportButton.svelte";

  export let title = "Project Control Center";
  export let subtitle = "Real-time Project Overview";
</script>

<header
  class="flex items-center justify-between p-4 bg-background-dark z-20 shadow-lg shadow-black/40 shrink-0"
>
  <button
    class="text-text-light flex size-10 shrink-0 items-center justify-center rounded-full active:bg-surface-highlight transition-colors"
    aria-label="Back"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      class="stroke-current"
    >
      <path
        d="M15 6L9 12L15 18"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>

  <div class="text-center flex-1 px-2">
    <h1 class="text-lg font-bold leading-tight text-primary drop-shadow-sm">
      {title}
    </h1>
    <p
      class="text-[10px] text-text-muted uppercase tracking-widest font-medium opacity-80"
    >
      {subtitle}
    </p>
  </div>

  <div class="flex items-center gap-1">
    <ExportButton label="" />
    <NotificationBell />
  </div>
</header>
