<script>
  import Header from "./lib/components/Header.svelte";
  import BottomSheet from "./lib/components/BottomSheet.svelte";
  import GanttChart from "./lib/components/GanttChart.svelte";
  import TaskList from "./lib/components/TaskList.svelte";
  import TabBar from "./lib/components/TabBar.svelte";
  import Dashboard from "./lib/components/Dashboard.svelte";
  import TimelineView from "./lib/components/TimelineView.svelte";
  import TaskDetail from "./lib/components/TaskDetail.svelte";

  let activeTab = $state("gantt");
  let selectedTask = $state(null);
  let isBottomSheetOpen = $state(false);

  function handleTabChange(tab) {
    activeTab = tab;
  }

  function handleTaskClick(task) {
    selectedTask = task;
    isBottomSheetOpen = true;
  }

  function handleCloseBottomSheet() {
    isBottomSheetOpen = false;
    selectedTask = null;
  }
</script>

<div class="h-screen flex flex-col overflow-hidden font-display dark">
  <Header />

  <main class="flex-1 overflow-hidden relative flex flex-col">
    {#if activeTab === "gantt"}
      <GanttChart onTaskClick={handleTaskClick} />
    {:else if activeTab === "tasks"}
      <TaskList onTaskClick={handleTaskClick} />
    {:else if activeTab === "dashboard"}
      <Dashboard />
    {:else if activeTab === "timeline"}
      <TimelineView />
    {/if}
  </main>

  <BottomSheet isOpen={isBottomSheetOpen} onClose={handleCloseBottomSheet}>
    {#if selectedTask}
      <TaskDetail task={selectedTask} onClose={handleCloseBottomSheet} />
    {/if}
  </BottomSheet>

  <TabBar {activeTab} onTabChange={handleTabChange} />
</div>

<style>
  /* Global styles are in app.css, component specific styles here if needed */
</style>
