# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with HMR
npm run build      # TypeScript check + Vite production build (tsc -b && vite build)
npm run preview    # Preview production build locally
npm run lint       # ESLint check
```

No test framework is configured — linting is the only automated quality check.

## Architecture

**OPTIRISK Plus** is a React 19 + TypeScript SPA implementing the EBIOS RM risk assessment methodology. It is frontend-only; it communicates with an external REST API.

### API layer

- Base Axios client: [src/services/apiservice.tsx](src/services/apiservice.tsx)
  - Hardcoded API base URL: `https://api-optirisk.paullence.link/api/v1`
  - Automatically attaches JWT from `localStorage` on every request
  - Intercepts 401 responses and redirects to `/login`
- Services are grouped by domain under [src/services/](src/services/): `authService`, `analysisService`, `adminService`, `profileService`

### Routing & guards

- All routes defined in [src/App.tsx](src/App.tsx) using React Router v7
- `AuthenticatedGuard` ([src/guards/](src/guards/)) wraps all protected routes
- `AdminGuard` wraps admin-only routes — checks `role === 'admin'` decoded from the JWT

### EBIOS RM workflow

The core feature is a 5-step risk assessment workflow ("Ateliers"):

| Atelier | Topic |
|---------|-------|
| 1 | Scope & assets |
| 2 | Risk sources |
| 3 | Strategic scenarios |
| 4 | Operational scenarios |
| 5 | Treatment & residual risk |

Components live in [src/components/Analysis/](src/components/Analysis/). Static reference data (standards, risk source categories) is in [src/data/](src/data/).

### State & notifications

- No global state manager — local `useState`/`useEffect` per component
- Notifications: `NotificationContext` ([src/context/](src/context/)) + `react-toastify`
- Theme (dark/light): `useTheme` hook in [src/hooks/](src/hooks/)

### TypeScript

- Strict mode enabled (`tsconfig.app.json`)
- Domain interfaces in [src/domains/interfaces/](src/domains/interfaces/)
- User roles typed as `'admin' | 'analyst'`

### Styling

- Tailwind CSS v4 (PostCSS plugin) with custom colors for each Atelier (`atelier1`–`atelier5`) defined in [tailwind.config.ts](tailwind.config.ts)
- PrimeReact component library + PrimeFlex grid system + PrimeIcons
