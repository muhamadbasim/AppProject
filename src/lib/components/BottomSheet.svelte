<script>
  let { isOpen = false, onClose = () => {}, children } = $props();
</script>

<div
  class="absolute inset-x-0 bottom-0 z-40 transform transition-transform duration-300 ease-out shadow-[0_-8px_30px_rgba(0,0,0,0.5)] bg-surface-dark rounded-t-3xl border-t border-border-dark max-h-[55vh] overflow-y-auto"
  class:translate-y-full={!isOpen}
  class:translate-y-0={isOpen}
>
  <div
    class="sticky top-0 bg-surface-dark py-3 flex justify-center z-10 outline-none"
    role="button"
    tabindex="0"
    onclick={onClose}
    onkeydown={(e) => e.key === "Enter" && onClose()}
  >
    <div class="w-12 h-1.5 rounded-full bg-text-muted/30"></div>
  </div>
  <div class="px-6 pb-8">
    {@render children()}
  </div>
</div>
