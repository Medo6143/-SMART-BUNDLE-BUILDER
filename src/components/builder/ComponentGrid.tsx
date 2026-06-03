import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORIES } from "@/data/components";
import { Component } from "@/types";
import { CategorySection } from "./CategorySection";

interface ComponentGridProps {
  selectedIds: Record<string, string>;
  totalPrice: number;
  onSelect: (component: Component) => void;
  onDeselect: (category: string) => void;
}

/**
 * Scrollable main area — renders one CategorySection per category.
 * Owns no state; receives all data and handlers from BuilderPage.
 */
export function ComponentGrid({
  selectedIds,
  totalPrice,
  onSelect,
  onDeselect,
}: ComponentGridProps) {
  return (
    <ScrollArea className="flex-1 min-w-0">
      {/* pb-20 reserves space for the fixed mobile budget bar */}
      <main
        className="p-4 max-w-2xl mx-auto pb-20 md:pb-4"
        id="main-content"
        aria-label="Component builder"
      >
        {CATEGORIES.map((cat) => (
          <CategorySection
            key={cat}
            category={cat}
            selectedIds={selectedIds}
            totalPrice={totalPrice}
            onSelect={onSelect}
            onDeselect={onDeselect}
          />
        ))}
      </main>
    </ScrollArea>
  );
}
