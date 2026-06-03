import { useState } from "react";
import { Menu } from "lucide-react";
import { useBuildActions } from "@/hooks/useBuildActions";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { ComponentGrid } from "@/components/builder/ComponentGrid";
import { CartPanel } from "@/components/cart/CartPanel";
import { BudgetBar } from "@/components/builder/BudgetBar";
import { cn } from "@/lib/utils";

interface BuilderPageProps {
  isCartOpen?: boolean;
  onCloseCart?: () => void;
}

export function BuilderPage({ isCartOpen, onCloseCart }: BuilderPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        isSidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* Mobile menu toggle */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="fixed top-16 left-3 z-30 md:hidden flex items-center justify-center h-9 w-9 rounded-md bg-sidebar border border-border text-sidebar-foreground shadow-sm hover:bg-sidebar-accent transition-colors"
        aria-label="Toggle category menu"
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Center: scrollable component grid */}
      <ComponentGrid
        selectedIds={selectedIds}
        totalPrice={totalPrice}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
      />

      {/* Cart backdrop (mobile) */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseCart}
          aria-hidden="true"
        />
      )}

      {/* Right: cart / summary (desktop + mobile overlay) */}
      <aside
        className={cn(
          "flex-col w-60 shrink-0 bg-sidebar",
          "max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-50",
          "max-lg:transition-transform max-lg:duration-300 max-lg:ease-in-out",
          isCartOpen ? "max-lg:translate-x-0 flex" : "max-lg:translate-x-full hidden",
          "lg:flex"
        )}
      >
        <CartPanel
          selectedIds={selectedIds}
          total={totalPrice}
          onClearBuild={handleClearBuild}
        />
      </aside>

      {/* Full-width budget bar pinned to bottom on mobile */}
      <BudgetBar variant="mobile" total={totalPrice} />
    </div>
  );
}
