 Smart Bundle Builder — PC Configuration Platform

A modern PC configuration platform with a **gaming-inspired design** that allows users to build a compatible custom PC bundle within a fixed **$1,000 budget**.

---

# Preview

<p align="center">
  <img src="./public/IMAG.jpg" alt="App Screenshot" width="45%" />
  <img src="./public/image.png" alt="App Screenshot 2" width="45%" />
</p>

## Core Capabilities

- Component selection system
- Budget validation
- Compatibility checks
- Undo / Redo support
- PDF export
- Theme persistence
- Responsive design
- Toast notifications
- Accessible UI primitives

---

# Project Structure

```
bundle-builder/
├── public/              # Static assets (images, favicon)
├── src/
│   ├── components/      # UI components (builder, cart, layout, ui)
│   ├── config/          # App configuration
│   ├── data/            # Mock data (components, categories, budget)
│   ├── hooks/           # Custom React hooks (useBuildActions, useTheme)
│   ├── lib/             # Utility functions (cn, tailwind-merge)
│   ├── pages/           # Page-level components
│   ├── services/        # External services (PDF export)
│   ├── store/           # Redux store, slices, typed hooks
│   ├── types/           # TypeScript interfaces and types
│   ├── utils/           # Helper functions
│   ├── App.tsx          # Root component
│   ├── index.css        # Global styles
│   └── main.tsx         # Entry point
├── index.html           # HTML shell
├── vite.config.ts       # Vite configuration
├── vercel.json          # Vercel deployment settings
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

---

# Tech Stack

| Technology | Purpose |
|---|---|
| React | UI rendering |
| TypeScript | Static typing |
| Redux Toolkit | Global state management |
| Vite | Development/build tooling |
| Tailwind CSS v4 | Styling |
| Shadcn/ui | UI components |
| Radix UI | Accessible primitives |
| jsPDF | PDF export |
| html2canvas | DOM capture |

---

# How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run typecheck

# Production build
npm run build

# Preview production build
npm run serve
```

Development server:

```txt
http://localhost:5173
```

---

# Undo/Redo Architecture

Undo/Redo is implemented using the **Command pattern** inside a single Redux slice (`buildSlice.ts`).

Instead of storing full snapshots of the entire state on every mutation, each action is
captured as a self-describing **Command object** that stores only the delta. Undo and redo
work by inverting or re-applying individual commands rather than swapping whole snapshots.

---

# Command Types

Every command is a plain serializable discriminated union:

```ts
type Command =
  | { type: "SELECT_COMPONENT"; category: string; componentId: string; prevId?: string }
  | { type: "DESELECT_COMPONENT"; category: string; prevId: string }
  | { type: "CLEAR_BUILD"; prevSelectedIds: Record<string, string> };
```

- `prevId` / `prevSelectedIds` capture the **previous value** so the command can be undone.
- Commands live in `src/commands/index.ts` with two pure functions:
  - `applyCommand(state, cmd)` — produces the next state by executing a command.
  - `invertCommand(cmd)` — returns the inverse command needed for undo.

---

# State Shape

```ts
interface BuildState {
  selectedIds: Record<string, string>;
  pastCommands: Command[];
  futureCommands: Command[];
}
```

- `selectedIds` is the **current live state** (not wrapped in a snapshot).
- `pastCommands` is the ordered list of executed commands (for undo).
- `futureCommands` is the ordered list of undone commands (for redo).

---

# How It Works

## Executing an Action

Each mutation reducer constructs a command, applies it to the current state, appends it to
`pastCommands`, and clears `futureCommands` (invalidating redo history):

```
cmd = { type: "SELECT_COMPONENT", category, componentId, prevId }
state.selectedIds    = applyCommand(state.selectedIds, cmd)
state.pastCommands   = [...pastCommands, cmd]
state.futureCommands = []
```

---

## Undo

Pops the last command, inverts it, applies the inverse, and pushes the original onto
`futureCommands`:

```
cmd            = pastCommands.pop()
inverse        = invertCommand(cmd)
state.selectedIds = applyCommand(state.selectedIds, inverse)
futureCommands = [cmd, ...futureCommands]
```

---

## Redo

Shifts the next command from `futureCommands`, applies it, and pushes it back onto
`pastCommands`:

```
cmd            = futureCommands.shift()
state.selectedIds = applyCommand(state.selectedIds, cmd)
pastCommands   = [...pastCommands, cmd]
```

---



## Special Notes

- **Vercel deployment**: the Vite build outputs to `dist/public/`. A `vercel.json` file tells Vercel where to find the built files.
- **Single-page app**: no client-side router — the entire UI lives on one page. No need for SPA fallback rewrites on Vercel.
- **Budget enforcement**: selecting a component that exceeds the $1,000 cap is prevented client-side, with a toast notification showing the overage.
- **Compatibility**: components can declare `incompatibleWith` IDs. Selection handlers can be extended to enforce these rules at the UI level.
- **PDF export**: uses `jsPDF` and `html2canvas` to generate a printable build summary with a budget usage bar.
- **Theme**: light/dark mode toggled via CSS class on `<html>`, persisted through a custom hook.
- **Shadcn/ui**: UI primitives (dialogs, tooltips, toasts, scroll areas) powered by Radix and styled with Tailwind.
