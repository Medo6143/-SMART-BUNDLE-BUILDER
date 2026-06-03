import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** Snapshot of which component is selected per category. */
export interface BuildSnapshot {
  selectedIds: Record<string, string>;
}

interface BuildState {
  present: BuildSnapshot;
  past: BuildSnapshot[];
  future: BuildSnapshot[];
}

const MAX_HISTORY = 50;

const EMPTY_SNAPSHOT: BuildSnapshot = { selectedIds: {} };

function cloneSnapshot(s: BuildSnapshot): BuildSnapshot {
  return { selectedIds: { ...s.selectedIds } };
}

const initialState: BuildState = {
  present: EMPTY_SNAPSHOT,
  past: [],
  future: [],
};

function pushHistory(state: BuildState, next: BuildSnapshot) {
  const entry = cloneSnapshot(state.present);
  state.past = [...state.past, entry].slice(-MAX_HISTORY);
  state.present = next;
  state.future = [];
}

export const buildSlice = createSlice({
  name: "build",
  initialState,
  reducers: {
    selectComponent(
      state,
      action: PayloadAction<{ category: string; componentId: string }>
    ) {
      const { category, componentId } = action.payload;
      const next = cloneSnapshot(state.present);
      next.selectedIds[category] = componentId;
      pushHistory(state, next);
    },

    deselectComponent(state, action: PayloadAction<{ category: string }>) {
      const { category } = action.payload;
      const next = cloneSnapshot(state.present);
      delete next.selectedIds[category];
      pushHistory(state, next);
    },

    clearBuild(state) {
      pushHistory(state, EMPTY_SNAPSHOT);
    },

    undo(state) {
      if (state.past.length === 0) return;
      const previous = state.past[state.past.length - 1];
      state.future = [cloneSnapshot(state.present), ...state.future];
      state.present = previous;
      state.past = state.past.slice(0, -1);
    },

    redo(state) {
      if (state.future.length === 0) return;
      const next = state.future[0];
      state.past = [...state.past, cloneSnapshot(state.present)];
      state.present = next;
      state.future = state.future.slice(1);
    },
  },
});

export const {
  selectComponent,
  deselectComponent,
  clearBuild,
  undo,
  redo,
} = buildSlice.actions;

export default buildSlice.reducer;
