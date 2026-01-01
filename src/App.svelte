<script>
  import { onMount } from "svelte";
  import Header from "./lib/components/Header.svelte";
  import BottomSheet from "./lib/components/BottomSheet.svelte";
  import GanttChart from "./lib/components/GanttChart.svelte";
  import TaskList from "./lib/components/TaskList.svelte";
  import TabBar from "./lib/components/TabBar.svelte";
  import Dashboard from "./lib/components/Dashboard.svelte";
  import TimelineView from "./lib/components/TimelineView.svelte";
  import TaskDetail from "./lib/components/TaskDetail.svelte";
  import TaskForm from "./lib/components/TaskForm.svelte";
  import Toast from "./lib/components/Toast.svelte";
  import OfflineIndicator from "./lib/components/OfflineIndicator.svelte";
  import { tasksStore } from "./lib/stores/tasksStore.js";
  import {
    checkDeadlineAlerts,
    showWarning,
    showError,
  } from "./lib/stores/notificationStore.js";

  let activeTab = $state("gantt");
  let selectedTask = $state(null);
  let showTaskForm = $state(false);
  let isBottomSheetOpen = $state(false);

  // Check for deadline alerts on mount
  onMount(() => {
    tasksStore.fetch();
    const unsub = tasksStore.subscribe((state) => {
      if (!state.loading && state.tasks.length > 0) {
        const alerts = checkDeadlineAlerts(state.tasks);
        alerts.forEach((alert, i) => {
          setTimeout(() => {
            if (alert.type === "error") {
              showError(alert.title, alert.message);
            } else {
              showWarning(alert.title, alert.message);
            }
          }, i * 800);
        });
        unsub(); // Only run once
      }
    });
  });

  function handleTabChange(tab) {
    activeTab = tab;
  }

  function handleTaskClick(task) {
    showTaskForm = false;
    selectedTask = task;
    isBottomSheetOpen = true;
  }

  function handleCloseBottomSheet() {
    isBottomSheetOpen = false;
    selectedTask = null;
    showTaskForm = false;
  }

  function handleFabClick() {
    selectedTask = null;
    showTaskForm = true;
    isBottomSheetOpen = true;
  }

  function handleTaskCreated(task) {
    console.log("[App] Task created:", task);
    handleCloseBottomSheet();
    // Could refresh task list here
  }
</script>

<div class="h-screen flex flex-col overflow-hidden font-display dark">
  <!-- Global Toast Notifications -->
  <Toast />
  <OfflineIndicator />

  <Header />

  <main class="flex-1 overflow-hidden relative flex flex-col">
    {#if activeTab === "gantt"}
      <GanttChart onTaskClick={handleTaskClick} />
    {:else if activeTab === "tasks"}
      <TaskList onTaskClick={handleTaskClick} onFabClick={handleFabClick} />
    {:else if activeTab === "dashboard"}
      <Dashboard onFabClick={handleFabClick} />
    {:else if activeTab === "timeline"}
      <TimelineView />
    {/if}
  </main>

  <!-- Global FAB for views without their own -->
  {#if activeTab === "gantt" || activeTab === "timeline"}
    <button
      onclick={handleFabClick}
      class="fixed bottom-24 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-background-dark shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform"
    >
      <span class="material-symbols-outlined text-2xl">add</span>
    </button>
  {/if}

  <BottomSheet isOpen={isBottomSheetOpen} onClose={handleCloseBottomSheet}>
    {#if showTaskForm}
      <TaskForm
        onSubmit={handleTaskCreated}
        onCancel={handleCloseBottomSheet}
      />
    {:else if selectedTask}
      <TaskDetail task={selectedTask} onClose={handleCloseBottomSheet} />
    {/if}
  </BottomSheet>

  <TabBar {activeTab} onTabChange={handleTabChange} />
</div>

<style>
  /* Global styles are in app.css, component specific styles here if needed */
</style>
