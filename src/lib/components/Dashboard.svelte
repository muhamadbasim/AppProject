<script>
  import { onMount } from "svelte";
  import MetricCard from "./MetricCard.svelte";
  import ProjectList from "./ProjectList.svelte";
  import { metricsStore, projectsStore } from "../stores/dashboardStore.js";

  let { onFabClick = null } = $props();

  // Reactive state from stores
  let metricsData = $state({
    activeProjects: 0,
    pendingReview: 0,
    tasksCompleted: 0,
    systemLoad: "0%",
    loading: true,
    error: null,
  });
  let projectsData = $state({
    projects: [],
    loading: true,
    error: null,
  });

  // Subscribe to stores
  $effect(() => {
    const unsubMetrics = metricsStore.subscribe(
      (value) => (metricsData = value),
    );
    const unsubProjects = projectsStore.subscribe(
      (value) => (projectsData = value),
    );
    return () => {
      unsubMetrics();
      unsubProjects();
    };
  });

  // Fetch data on mount
  onMount(() => {
    metricsStore.fetch();
    projectsStore.fetch();
  });

  // Computed metrics array for MetricCard render
  const metrics = $derived([
    {
      icon: "developer_mode",
      label: "PRJ_ACT",
      value: String(metricsData.activeProjects ?? "—"),
      description: "Active Projects",
    },
    {
      icon: "rate_review",
      label: "REQ_REV",
      value: String(metricsData.pendingReview ?? "—"),
      description: "Pending Review",
    },
    {
      icon: "task_alt",
      label: "TSK_CMPLT",
      value: String(metricsData.tasksCompleted ?? "—"),
      description: "Tasks Completed",
    },
    {
      icon: "cloud_sync",
      label: "SYS_LOAD",
      value: metricsData.systemLoad ?? "—",
      description: "System Load",
    },
  ]);

  // Format projects for ProjectList
  const formattedProjects = $derived(
    (projectsData.projects ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      status:
        p.status === "In Progress"
          ? `${p.progress}%`
          : p.status.toUpperCase().slice(0, 6),
    })),
  );

  function handleProjectClick(project) {
    console.log("[Dashboard] Project clicked:", project.name);
    // Future: Navigate to project detail or filter tasks
  }
</script>

<div
  class="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-24 bg-background-dark"
>
  <!-- System Overview -->
  <h3 class="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
    SYSTEM_OVERVIEW
  </h3>

  {#if metricsData.loading}
    <div class="grid grid-cols-2 gap-3 mb-6">
      {#each [1, 2, 3, 4] as _}
        <div
          class="bg-surface-dark border border-border-dark rounded-lg p-4 animate-pulse"
        >
          <div class="h-4 bg-surface-highlight rounded w-16 mb-2"></div>
          <div class="h-8 bg-surface-highlight rounded w-12"></div>
        </div>
      {/each}
    </div>
  {:else if metricsData.error}
    <div
      class="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-400 text-sm"
    >
      <span class="material-symbols-outlined text-base mr-2 align-middle"
        >error</span
      >
      Error: {metricsData.error}
    </div>
  {:else}
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
  {/if}

  <!-- Project Log -->
  <h3 class="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
    PROJECT_LOG
  </h3>

  {#if projectsData.loading}
    <div class="space-y-2">
      {#each [1, 2, 3] as _}
        <div
          class="bg-surface-dark border border-border-dark rounded p-3 animate-pulse flex justify-between"
        >
          <div class="h-4 bg-surface-highlight rounded w-32"></div>
          <div class="h-4 bg-surface-highlight rounded w-12"></div>
        </div>
      {/each}
    </div>
  {:else if projectsData.error}
    <div
      class="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm"
    >
      <span class="material-symbols-outlined text-base mr-2 align-middle"
        >error</span
      >
      Error: {projectsData.error}
    </div>
  {:else}
    <ProjectList
      projects={formattedProjects}
      onProjectClick={handleProjectClick}
    />
  {/if}
</div>

<!-- Floating Action Button -->
<button
  onclick={onFabClick}
  class="fixed bottom-24 right-6 z-40 flex size-14 items-center justify-center rounded-sm bg-primary shadow-[0_0_20px_rgba(255,215,0,0.4)] text-background-dark hover:scale-105 active:scale-95 transition-all"
>
  <span class="material-symbols-outlined text-2xl">add</span>
</button>
