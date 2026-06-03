/**
 * useBuildStore — Redux-backed hook that preserves the same API surface
 * previously provided by Zustand, so all consumers continue to work unchanged.
 */
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

  const present = useAppSelector((s) => s.build.present);
  const canUndoValue = useAppSelector((s) => s.build.past.length > 0);
  const canRedoValue = useAppSelector((s) => s.build.future.length > 0);

  return {
    present,

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
