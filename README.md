# Project Control Center

A high-performance Project Management PWA built with **Bun**, **Hono**, and **Svelte**.

## Features

- **Gantt Chart**: Interactive timeline visualization with task dependencies.
- **Task List**: Sortable and filterable task management.
- **Dashboard**: High-level project metrics and logs.
- **Timeline View**: Milestone and phase visualization with risk tracking.

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- [**System Architecture**](docs/ARCHITECTURE.md) - Tech stack, directory structure, and data flow.
- [**Component Reference**](docs/COMPONENTS.md) - Details on Svelte components and views.
- [**API Documentation**](docs/API.md) - API endpoints and usage.
- [**User Stories**](docs/USER_STORIES.md) - Personas, requirements, and acceptance criteria.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Frontend**: [Svelte 5](https://svelte.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Hono](https://hono.dev/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.3+)

### Installation

```bash
bun install
```

### Development

```bash
# Start frontend dev server
bun dev

# Start API server (separate terminal)
bun run api:dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
bun run build
```

The output will be in `dist/`.

## Deployment

This project is configured for automatic deployment to Cloudflare Pages via GitHub Actions.

### Setup

1.  **Create a Cloudflare Pages project** named `project-control-center`.
2.  **Add GitHub Secrets**:
    - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages edit permissions.
    - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID.
3.  **Push to `main` branch** to trigger deployment.

## Project Structure

```
.
├── api/                # Hono API server
│   └── index.js
├── src/
│   ├── lib/
│   │   ├── components/ # Svelte components
│   │   │   ├── BottomSheet.svelte
│   │   │   ├── GanttChart.svelte
│   │   │   ├── Header.svelte
│   │   │   ├── TabBar.svelte
│   │   │   ├── TaskCard.svelte
│   │   │   └── TaskList.svelte
│   │   └── data.js     # Mock data
│   ├── App.svelte      # Main application
│   ├── app.css         # Global styles
│   └── main.js         # Entry point
├── .github/workflows/
│   └── deploy.yml      # CI/CD pipeline
├── tailwind.config.js
├── wrangler.toml       # Cloudflare config
└── package.json
```

## License

MIT
