import { useBuildActions } from "@/hooks/useBuildActions";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { ComponentGrid } from "@/components/builder/ComponentGrid";
import { CartPanel } from "@/components/cart/CartPanel";
import { MobileCartSheet } from "@/components/layout/MobileCartSheet";
import { BudgetBar } from "@/components/builder/BudgetBar";

/**
 * BuilderPage — thin orchestrator.
 * Pulls shared state from useBuildActions and distributes it to each panel.
 * Contains zero business logic of its own.
 */
export function BuilderPage() {
  const {
    selectedIds,
    totalPrice,
    selectedCount,
    handleSelect,
    handleDeselect,
    handleClearBuild,
  } = useBuildActions();

  return (
    <div className="flex h-[calc(100vh-48px)]">
      {/* Left: category navigation */}
      <CategorySidebar
        selectedIds={selectedIds}
        totalPrice={totalPrice}
        selectedCount={selectedCount}
        onClearBuild={handleClearBuild}
      />

      {/* Center: scrollable component grid */}
      <ComponentGrid
        selectedIds={selectedIds}
        totalPrice={totalPrice}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
      />

      {/* Right: cart / summary (desktop) */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0">
        <CartPanel
          selectedIds={selectedIds}
          total={totalPrice}
          onClearBuild={handleClearBuild}
        />
      </aside>

      {/* Floating cart button + sheet (mobile) */}
      <MobileCartSheet
        selectedIds={selectedIds}
        total={totalPrice}
        selectedCount={selectedCount}
        onClearBuild={handleClearBuild}
      />

      {/* Full-width budget bar pinned to bottom on mobile */}
      <BudgetBar variant="mobile" total={totalPrice} />
    </div>
  );
}
