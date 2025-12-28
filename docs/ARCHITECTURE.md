# System Architecture

## Overview
Project Control Center is a Progressive Web App (PWA) designed for high-performance project management. It utilizes a modern tech stack centered around Bun, Hono, and Svelte to deliver a fast and responsive user experience.

## Technology Stack

| Layer | Technology | Description |
|-------|------------|-------------|
| **Runtime** | **Bun** | Ultra-fast JavaScript runtime, bundler, and package manager. |
| **Frontend** | **Svelte 5** | Reactive UI framework for building efficient components. |
| **Build Tool** | **Vite** | Fast build tool and development server, optimized for modern web dev. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework with a custom "Regal Black & Gold" theme. |
| **Backend** | **Hono** | Lightweight, edge-ready web framework for the API layer. |
| **Deployment** | **Cloudflare Pages** | Static site hosting with serverless function support (via Hono). |

## Directory Structure

```
project-control-center/
├── api/                    # Backend API Logic
│   └── index.js            # Main Hono application entry point
│
├── src/                    # Frontend Source Code
│   ├── lib/
│   │   ├── components/     # Reusable Svelte UI Components
│   │   │   ├── Dashboard/  # Dashboard specific components
│   │   │   ├── Gantt/      # Gantt chart logic
│   │   │   └── ...
│   │   └── data.js         # Mock data source (for prototype)
│   ├── App.svelte          # Main Application Shell (Routing/Layout)
│   ├── app.css             # Global Styles & Tailwind Directives
│   └── main.js             # Vite Entry Point
│
├── public/                 # Static Assets (favicon, icons)
├── dist/                   # Production Build Output (generated)
│
├── .github/workflows/      # CI/CD Configuration
│   └── deploy.yml          # Cloudflare Pages deployment workflow
│
├── wrangler.toml           # Cloudflare Pages & Workers Configuration
├── tailwind.config.js      # Tailwind Theme Configuration
└── package.json            # Project Dependencies & Scripts
```

## Data Flow

1.  **Frontend**: Svelte components request data via fetch API.
2.  **API Layer**: Hono handles requests matching `/api/*`.
3.  **Data Source**: Currently uses in-memory mock data (prototype phase), structured to easily be replaced by a database (e.g., SQLite/PostgreSQL) or external API.

## Deployment Pipeline

The project uses **GitHub Actions** for Continuous Deployment:
1.  Push to `main` branch triggers the workflow.
2.  Dependencies installed via `bun install`.
3.  Project built via `bun run build`.
4.  Wrangler deploys the `dist/` folder to Cloudflare Pages.
