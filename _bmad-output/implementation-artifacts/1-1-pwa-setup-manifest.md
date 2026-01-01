# Story 1.1: PWA Setup & Manifest

Status: done

## Story

As a **user**,
I want the application to be installable as a Progressive Web App,
so that I can access it from my home screen and use it offline.

## Acceptance Criteria

1. Application can be installed via browser's "Add to Home Screen" prompt
2. App launches in standalone mode without browser UI
3. Proper name, icons (192x192, 512x512), and theme colors are configured
4. App works offline with cached pages and data
5. Clear offline indicator is shown when network is unavailable

## Tasks / Subtasks

- [ ] Task 1: Create PWA Manifest (AC: 1, 3)
  - [ ] 1.1 Create `public/manifest.json` with app name, icons, theme colors
  - [ ] 1.2 Generate app icons (192x192, 512x512) using existing assets
  - [ ] 1.3 Link manifest in `index.html` head section
  - [ ] 1.4 Add meta tags for theme-color and apple-touch-icon

- [ ] Task 2: Implement Service Worker (AC: 2, 4)
  - [ ] 2.1 Create `public/sw.js` with cache-first strategy
  - [ ] 2.2 Define cache list: app shell, CSS, JS bundles
  - [ ] 2.3 Register service worker in `src/main.js`
  - [ ] 2.4 Handle install and activate events with cache versioning

- [ ] Task 3: Add Offline Detection (AC: 5)
  - [ ] 3.1 Create offline state store (`src/lib/stores/offlineStore.js`)
  - [ ] 3.2 Add `OfflineIndicator.svelte` component
  - [ ] 3.3 Integrate indicator into `App.svelte` layout
  - [ ] 3.4 Test offline mode by disabling network in DevTools

- [ ] Task 4: Verify Installation Flow (AC: 1, 2)
  - [ ] 4.1 Test "Add to Home Screen" prompt in Chrome
  - [ ] 4.2 Verify standalone mode launches correctly
  - [ ] 4.3 Test on mobile device (Android/iOS)

## Dev Notes

### Existing Codebase Context
- **Entry point**: `src/main.js` - register service worker here
- **Index file**: `index.html` - add manifest link and meta tags
- **Public folder**: `public/` - place manifest.json, sw.js, icons
- **Styling**: Tailwind CSS with "Regal Black & Gold" theme (use `#1a1a2e` dark, `#d4af37` gold)

### Architecture Patterns
- Svelte 5 + Vite build system
- Static deployment to Cloudflare Pages
- No SSR - pure client-side PWA

### Testing Standards
- Manual testing of install flow
- Chrome DevTools > Application > Service Workers
- Lighthouse PWA audit for validation

### Project Structure Notes
```
public/
├── manifest.json     [NEW]
├── sw.js            [NEW]
├── icon-192.png     [NEW]
├── icon-512.png     [NEW]
└── favicon.svg      [EXISTS]

src/
├── main.js          [MODIFY - add SW registration]
├── lib/
│   ├── stores/
│   │   └── offlineStore.js   [NEW]
│   └── components/
│       └── OfflineIndicator.svelte  [NEW]
└── App.svelte       [MODIFY - add offline indicator]

index.html           [MODIFY - add manifest link, meta tags]
```

### References
- [Source: docs/ARCHITECTURE.md#Technology-Stack] - Vite, Svelte, Cloudflare
- [Source: epics.md#Story-1.1] - Original acceptance criteria
- [Source: tailwind.config.js] - Theme colors for manifest

## Dev Agent Record

### Agent Model Used
<!-- To be filled by dev agent -->

### Debug Log References
<!-- To be filled during implementation -->

### Completion Notes List
<!-- To be filled after each task completion -->

### File List
<!-- Auto-populated as files are created/modified -->
