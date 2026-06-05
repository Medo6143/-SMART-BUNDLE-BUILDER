export type Command =
  | { type: "SELECT_COMPONENT"; category: string; componentId: string; prevId?: string }
  | { type: "DESELECT_COMPONENT"; category: string; prevId: string }
  | { type: "CLEAR_BUILD"; prevSelectedIds: Record<string, string> }
  | { type: "RESTORE_BUILD"; selectedIds: Record<string, string> };

export function applyCommand(
  state: Record<string, string>,
  cmd: Command
): Record<string, string> {
  switch (cmd.type) {
    case "SELECT_COMPONENT":
      return { ...state, [cmd.category]: cmd.componentId };
    case "DESELECT_COMPONENT": {
      const next = { ...state };
      delete next[cmd.category];
      return next;
    }
    case "CLEAR_BUILD":
      return {};
    case "RESTORE_BUILD":
      return { ...cmd.selectedIds };
  }
}

export function invertCommand(cmd: Command): Command {
  switch (cmd.type) {
    case "SELECT_COMPONENT":
      return cmd.prevId
        ? { type: "SELECT_COMPONENT", category: cmd.category, componentId: cmd.prevId, prevId: cmd.componentId }
        : { type: "DESELECT_COMPONENT", category: cmd.category, prevId: cmd.componentId };
    case "DESELECT_COMPONENT":
      return { type: "SELECT_COMPONENT", category: cmd.category, componentId: cmd.prevId };
    case "CLEAR_BUILD":
      return { type: "RESTORE_BUILD", selectedIds: cmd.prevSelectedIds };
    case "RESTORE_BUILD":
      return { type: "CLEAR_BUILD", prevSelectedIds: cmd.selectedIds };
  }
}
