# Smart Bundle Builder

A responsive PC component configurator built with **React + TypeScript + Vite**. Users pick parts across six categories (CPU, Motherboard, RAM, GPU, Storage, PSU), stay within a $1,000 budget, and avoid hardware incompatibilities — all in real time, with no backend required.

---

## Tech Stack

| Tool | Role |
|---|---|
| **Vite** | Dev server and bundler (lightning-fast HMR) |
| **React 18 + TypeScript** | UI framework + type safety |
| **Tailwind CSS v4** | Utility-first styling |
| **Shadcn UI** | Accessible component primitives (Radix UI) |
| **Zustand** | Global state + undo/redo history stack |
| **jsPDF** | Client-side PDF export |
| **Sonner** | Toast notifications |

---

## How to Run

```bash
# Install dependencies
pnpm install

# Start the dev server (Vite)
pnpm --filter @workspace/bundle-builder run dev

# Type-check only
pnpm --filter @workspace/bundle-builder run typecheck
```

The app is served at `http://localhost:<PORT>`.

---

## Features

- **Budget tracker** — $1,000 limit with a live progress bar; blocks selections that would overshoot
- **Incompatibility engine** — selecting a CPU immediately disables incompatible motherboards (and vice versa) via an `incompatibleWith` array on each component
- **Undo / Redo** — full history stack (up to 50 states) managed in Zustand
- **PDF export** — generates a styled A4 build summary via jsPDF, no server needed
- **Dark / Light mode** — toggled in the header, persisted to `localStorage`
- **Responsive layout** — two-column grid on desktop; single-column + fixed bottom budget bar + floating cart sheet on mobile
- **Accessibility** — keyboard navigation (Tab / Enter / Space), ARIA roles (`listbox`, `option`, `progressbar`, `region`), `aria-live` budget announcements, skip-to-content link

---

## Undo / Redo Architecture

State is managed in a single Zustand store (`useBuildStore`) using a **three-stack model**:

```
past[]  →  present  →  future[]
```

Every mutating action (select, deselect, clear) pushes the current `present` onto `past` and clears `future`. Undo pops from `past`, pushes `present` to `future`, and sets the popped state as `present`. Redo is the mirror operation.

Each entry stores a snapshot of `selectedIds` (a plain `Record<string, string>`) so clones are O(n) where n = number of categories (always ≤ 6). The stack is capped at 50 entries to keep memory bounded.

```ts
// Simplified
selectComponent: (category, id) => {
  const entry = { state: cloneState(present) };
  set({ present: newState, past: [...past, entry], future: [] });
},
undo: () => {
  const prev = past.at(-1);
  set({ present: prev.state, past: past.slice(0,-1), future: [current, ...future] });
},
```

---

## Project Structure

```
src/
├── data/
│   └── components.ts          # Mock component data (no backend)
├── hooks/
│   ├── useBuildActions.ts     # Handlers + derived state (totalPrice, selectedCount)
│   └── useTheme.ts            # Dark/light toggle + localStorage persistence
├── services/
│   └── pdfExport.ts           # jsPDF build summary generator
├── store/
│   └── useBuildStore.ts       # Zustand store with undo/redo history
├── types/
│   └── index.ts               # Shared TypeScript interfaces
├── components/
│   ├── builder/
│   │   ├── ComponentCard.tsx  # Single part card (image, specs, equip button)
│   │   ├── ComponentGrid.tsx  # Scrollable area — maps categories → CategorySection
│   │   └── CategorySection.tsx# One category header + 2-col card grid
│   ├── cart/
│   │   └── CartPanel.tsx      # Right sidebar: item list, total, PDF export, clear
│   └── layout/
│       ├── Header.tsx          # Top bar: logo, budget indicator, undo/redo, theme
│       ├── CategorySidebar.tsx # Left nav: category links + thumbnail + total
│       ├── ComponentGrid.tsx   # Main scrollable content
│       ├── MobileCartSheet.tsx # Floating FAB + slide-in cart (mobile)
│       └── MobileBudgetBar.tsx # Full-width bottom bar (mobile)
└── pages/
    └── BuilderPage.tsx         # Thin orchestrator — composes all panels
```

---

## SOLID Principles Applied

| Principle | How |
|---|---|
| **S**ingle Responsibility | Each file does exactly one thing (data, store, service, UI) |
| **O**pen/Closed | New categories added to `MOCK_COMPONENTS` with no changes to rendering logic |
| **L**iskov | All `ComponentCard` variants behave the same way via consistent props interface |
| **I**nterface Segregation | Each component receives only the props it needs |
| **D**ependency Inversion | UI reads from `useBuildActions` (abstraction), not `useBuildStore` (implementation) directly |

---

## Notes

- All data is local (mock) — no network requests. To add real data, replace `MOCK_COMPONENTS` in `src/data/components.ts` with an API fetch.
- PDF export uses jsPDF entirely client-side — no server, no file upload.
- The `incompatibleWith` array is bidirectional in the data but the engine only needs to read from the selected side; both entries are kept in sync for clarity.
