import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectComponent,
  deselectComponent,
  clearBuild,
  undo,
  redo,
} from "@/store/buildSlice";
import { MOCK_COMPONENTS, MAX_BUDGET } from "@/data/components";
import { Component } from "@/types";

/**
 * Encapsulates all derived state and user-action handlers for the builder.
 * Reads from Redux; keeps UI components free of business logic.
 */
export function useBuildActions() {
  const dispatch = useAppDispatch();

  const selectedIds = useAppSelector((s) => s.build.selectedIds);
  const canUndo = useAppSelector((s) => s.build.pastCommands.length > 0);
  const canRedo = useAppSelector((s) => s.build.futureCommands.length > 0);

  const totalPrice = Object.values(selectedIds).reduce((sum, id) => {
    const comp = MOCK_COMPONENTS.find((c) => c.id === id);
    return sum + (comp?.price ?? 0);
  }, 0);

  const selectedCount = Object.keys(selectedIds).length;
  const isOverBudget = totalPrice > MAX_BUDGET;

  function handleSelect(component: Component) {
    const currentSelectedId = selectedIds[component.category];
    const currentPrice = currentSelectedId
      ? (MOCK_COMPONENTS.find((c) => c.id === currentSelectedId)?.price ?? 0)
      : 0;
    const projectedTotal = totalPrice - currentPrice + component.price;

    if (projectedTotal > MAX_BUDGET) {
      toast.error(`Over budget by $${(projectedTotal - MAX_BUDGET).toFixed(0)}!`, {
        description: `${component.name} would bring total to $${projectedTotal}.`,
      });
      return;
    }

    dispatch(selectComponent({ category: component.category, componentId: component.id }));
    toast.success(`${component.name} equipped!`, {
      description: `$${component.price} · ${component.category}`,
    });
  }

  function handleDeselect(category: string) {
    const comp = MOCK_COMPONENTS.find((c) => c.id === selectedIds[category]);
    dispatch(deselectComponent({ category }));
    toast.info(`${comp?.name ?? "Component"} removed.`);
  }

  function handleClearBuild() {
    dispatch(clearBuild());
    toast.info("Build cleared.");
  }

  function handleUndo() {
    dispatch(undo());
  }

  function handleRedo() {
    dispatch(redo());
  }

  return {
    selectedIds,
    totalPrice,
    selectedCount,
    isOverBudget,
    canUndo,
    canRedo,
    handleSelect,
    handleDeselect,
    handleClearBuild,
    handleUndo,
    handleRedo,
  };
}
