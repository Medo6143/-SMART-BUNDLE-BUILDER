
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  selectComponent,
  deselectComponent,
  clearBuild,
  undo,
  redo,
} from "./buildSlice";

export function useBuildStore() {
  const dispatch = useAppDispatch();

  const selectedIds = useAppSelector((s) => s.build.selectedIds);
  const canUndoValue = useAppSelector((s) => s.build.pastCommands.length > 0);
  const canRedoValue = useAppSelector((s) => s.build.futureCommands.length > 0);

  return {
    selectedIds,

    selectComponent: (category: string, componentId: string) =>
      dispatch(selectComponent({ category, componentId })),

    deselectComponent: (category: string) =>
      dispatch(deselectComponent({ category })),

    clearBuild: () => dispatch(clearBuild()),

    undo: () => dispatch(undo()),
    redo: () => dispatch(redo()),

    canUndo: () => canUndoValue,
    canRedo: () => canRedoValue,
  };
}
