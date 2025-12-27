<script>
  import MetricCard from './MetricCard.svelte';
  import ProjectList from './ProjectList.svelte';

  const metrics = [
    { icon: "developer_mode", label: "PRJ_ACT", value: "12", description: "Active Projects" },
    { icon: "rate_review", label: "REQ_REV", value: "3", description: "Pending Review" },
    { icon: "task_alt", label: "TSK_CMPLT", value: "89", description: "Tasks Completed" },
    { icon: "cloud_sync", label: "SYS_LOAD", value: "42%", description: "System Load" },
  ];

  const projects = [
    { name: "WEB_REDESIGN_P1", status: "65%" },
    { name: "API_INTEGRATION_MA", status: "URGENT" },
    { name: "Q4_MKT_CAMPAIGN", status: "15%" },
    { name: "SERVER_MIGRATION_V3", status: "QA" },
    { name: "DOC_SYS_UPDATE_2.0", status: "CRIT" },
  ];
</script>

<div class="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-24 bg-background-dark">
  <!-- System Overview -->
  <h3 class="text-xs font-semibold text-primary uppercase tracking-widest mb-3">SYSTEM_OVERVIEW</h3>
  <div class="grid grid-cols-2 gap-3 mb-6">
    {#each metrics as metric}
      <MetricCard 
        icon={metric.icon} 
        label={metric.label} 
        value={metric.value} 
        description={metric.description} 
      />
    {/each}
  </div>

  <!-- Project Log -->
  <h3 class="text-xs font-semibold text-primary uppercase tracking-widest mb-3">PROJECT_LOG</h3>
  <ProjectList {projects} />
</div>

<!-- Floating Action Button -->
<button class="fixed bottom-24 right-6 z-40 flex size-14 items-center justify-center rounded-sm bg-primary shadow-[0_0_20px_rgba(255,215,0,0.4)] text-background-dark hover:scale-105 active:scale-95 transition-all">
  <span class="material-symbols-outlined text-2xl">terminal</span>
</button>
