import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Command, applyCommand, invertCommand } from "@/commands";

interface BuildState {
  selectedIds: Record<string, string>;
  pastCommands: Command[];
  futureCommands: Command[];
}

const MAX_HISTORY = 50;

const initialState: BuildState = {
  selectedIds: {},
  pastCommands: [],
  futureCommands: [],
};

function pushCommand(state: BuildState, cmd: Command) {
  state.pastCommands = [...state.pastCommands, cmd].slice(-MAX_HISTORY);
  state.selectedIds = applyCommand(state.selectedIds, cmd);
  state.futureCommands = [];
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
      const prevId = state.selectedIds[category];
      const cmd: Command = {
        type: "SELECT_COMPONENT",
        category,
        componentId,
        prevId,
      };
      pushCommand(state, cmd);
    },

    deselectComponent(state, action: PayloadAction<{ category: string }>) {
      const { category } = action.payload;
      const prevId = state.selectedIds[category];
      if (!prevId) return;
      const cmd: Command = { type: "DESELECT_COMPONENT", category, prevId };
      pushCommand(state, cmd);
    },

    clearBuild(state) {
      const cmd: Command = {
        type: "CLEAR_BUILD",
        prevSelectedIds: state.selectedIds,
      };
      pushCommand(state, cmd);
    },

    undo(state) {
      if (state.pastCommands.length === 0) return;
      const cmd = state.pastCommands[state.pastCommands.length - 1];
      const inverse = invertCommand(cmd);
      state.selectedIds = applyCommand(state.selectedIds, inverse);
      state.futureCommands = [cmd, ...state.futureCommands];
      state.pastCommands = state.pastCommands.slice(0, -1);
    },

    redo(state) {
      if (state.futureCommands.length === 0) return;
      const cmd = state.futureCommands[0];
      state.selectedIds = applyCommand(state.selectedIds, cmd);
      state.pastCommands = [...state.pastCommands, cmd];
      state.futureCommands = state.futureCommands.slice(1);
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
