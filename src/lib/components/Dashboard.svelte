<script>
  import { onMount } from "svelte";
  import MetricCard from "./MetricCard.svelte";
  import BudgetCard from "./BudgetCard.svelte";
  import ProjectList from "./ProjectList.svelte";
  import ProjectForm from "./ProjectForm.svelte";
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

  // Edit State
  let editingProject = $state(null);

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

  // Fetch data on mount and poll every 30s
  onMount(() => {
    metricsStore.fetch();
    projectsStore.fetch();

    const intervalId = setInterval(() => {
      // Polling for near real-time updates
      metricsStore.fetch();
      projectsStore.fetch();
    }, 30000);

    return () => clearInterval(intervalId);
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
      // Keep original values for editing
      _raw: p,
    })),
  );

  function handleProjectClick(project) {
    console.log("[Dashboard] Project clicked:", project.name);
    // Future: Navigate to project detail or filter tasks
  }

  function handleEditProject(project) {
    // Use raw project data if available, otherwise fallback (won't happen with current logic)
    editingProject = project._raw || project;
  }
</script>

<div
  class="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-24 bg-background-dark relative"
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
      class="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-400 text-sm flex items-center justify-between"
    >
      <div class="flex items-center">
        <span class="material-symbols-outlined text-base mr-2">error</span>
        <span>Error: {metricsData.error}</span>
      </div>
      <button
        onclick={() => metricsStore.fetch()}
        class="px-3 py-1 bg-red-500/30 hover:bg-red-500/50 rounded text-xs font-medium transition-colors"
      >
        Retry
      </button>
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

  <!-- Financial Health (New Epic 5) -->
  {#if !projectsData.loading && !projectsData.error && projectsData.projects.length > 0}
    <h3
      class="text-xs font-semibold text-primary uppercase tracking-widest mb-3"
    >
      FINANCIAL_HEALTH
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
      {#each projectsData.projects.slice(0, 2) as project (project.id)}
        <BudgetCard projectId={project.id} />
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
      class="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm flex items-center justify-between"
    >
      <div class="flex items-center">
        <span class="material-symbols-outlined text-base mr-2">error</span>
        <span>Error: {projectsData.error}</span>
      </div>
      <button
        onclick={() => projectsStore.fetch()}
        class="px-3 py-1 bg-red-500/30 hover:bg-red-500/50 rounded text-xs font-medium transition-colors"
      >
        Retry
      </button>
    </div>
  {:else}
    <ProjectList
      projects={formattedProjects}
      onProjectClick={handleProjectClick}
      onEditClick={handleEditProject}
    />
  {/if}
</div>

<!-- Edit Overlay Modal -->
{#if editingProject}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
  >
    <div
      class="w-full max-w-md bg-surface-dark border border-border-dark rounded-lg p-6 shadow-2xl relative"
    >
      <ProjectForm
        project={editingProject}
        onSubmit={() => (editingProject = null)}
        onCancel={() => (editingProject = null)}
      />
    </div>
  </div>
{/if}

<!-- Floating Action Button -->
<button
  onclick={onFabClick}
  class="fixed bottom-24 right-6 z-40 flex size-14 items-center justify-center rounded-sm bg-primary shadow-[0_0_20px_rgba(255,215,0,0.4)] text-background-dark hover:scale-105 active:scale-95 transition-all"
>
  <span class="material-symbols-outlined text-2xl">add</span>
</button>
