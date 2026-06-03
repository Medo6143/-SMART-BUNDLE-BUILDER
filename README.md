# Smart Bundle Builder

A PC component configurator that lets you pick parts within a $1,000 budget, respecting compatibility constraints between components. Built with React, Redux Toolkit, Vite, and Tailwind CSS v4.

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check
npm run typecheck

# Production build
npm run build

# Preview production build locally
npm run serve
```

The dev server runs on `http://localhost:5173`.

## Undo/Redo Architecture

Undo/Redo is implemented as a **linear history stack** inside a single Redux slice (`buildSlice.ts`). The state shape follows a classic triple-buffer pattern:

```
{ past: BuildSnapshot[], present: BuildSnapshot, future: BuildSnapshot[] }
```

- **Every mutation** (`selectComponent`, `deselectComponent`, `clearBuild`) clones the current snapshot, appends it to `past` (capped at 50 entries), sets the new snapshot as `present`, and clears `future`.
- **Undo**: pops the last entry from `past`, pushes the current `present` onto `future`, and sets the popped entry as `present`.
- **Redo**: shifts the first entry from `future`, pushes the current `present` onto `past`, and sets the shifted entry as `present`.

Snapshots are shallow-cloned (`{ selectedIds: { ...prev.selectedIds } }`) to keep the cost of each push minimal. Because Redux Toolkit uses Immer internally, reducers appear to mutate state directly but are actually immutable.

The `useBuildActions` hook wraps dispatch calls and exposes derived state (budget calculations, compatibility checks) so UI components stay free of business logic.

## Special Notes

- **Vercel deployment**: the Vite build outputs to `dist/public/`. A `vercel.json` file tells Vercel where to find the built files.
- **Single-page app**: no client-side router — the entire UI lives on one page. No need for SPA fallback rewrites on Vercel.
- **Budget enforcement**: selecting a component that exceeds the $1,000 cap is prevented client-side, with a toast notification showing the overage.
- **Compatibility**: components can declare `incompatibleWith` IDs. Selection handlers can be extended to enforce these rules at the UI level.
- **PDF export**: uses `jsPDF` and `html2canvas` to generate a printable build summary with a budget usage bar.
- **Theme**: light/dark mode toggled via CSS class on `<html>`, persisted through a custom hook.
- **Shadcn/ui**: UI primitives (dialogs, tooltips, toasts, scroll areas) powered by Radix and styled with Tailwind.
