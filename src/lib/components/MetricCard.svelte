<script>
  export let icon = "developer_mode";
  export let label = "PRJ_ACT";
  export let value = "0";
  export let description = "Metric";
</script>

<div class="flex flex-col justify-between p-3 bg-surface-dark border border-border-dark rounded-sm hover:bg-surface-highlight/50 transition-colors">
  <div class="flex items-center justify-between">
    <span class="material-symbols-outlined text-primary text-xl">{icon}</span>
    <span class="text-xs text-text-muted">{label}</span>
  </div>
  <p class="text-3xl font-bold mt-2 text-primary">{value}</p>
  <p class="text-xs text-text-muted">{description}</p>
</div>
