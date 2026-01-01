<script>
    import { isOffline } from "../stores/offlineStore.js";
    import { fade } from "svelte/transition";
</script>

{#if $isOffline}
    <div
        class="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-surface-dark to-surface-highlight border border-primary rounded-full text-primary text-sm font-medium shadow-lg shadow-primary/20 z-[9999]"
        transition:fade={{ duration: 200 }}
        role="alert"
        aria-live="polite"
    >
        <span class="material-symbols-outlined text-xl">wifi_off</span>
        <span>You're offline</span>
    </div>
{/if}
