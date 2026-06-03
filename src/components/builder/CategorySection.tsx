import { Component } from "@/types";
import { ComponentCard } from "./ComponentCard";
import { MOCK_COMPONENTS } from "@/data/components";
import { Cpu, CircuitBoard, MemoryStick, Monitor, HardDrive, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  category: string;
  selectedIds: Record<string, string>;
  totalPrice: number;
  onSelect: (component: Component) => void;
  onDeselect: (category: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  CPU: <Cpu className="h-3.5 w-3.5" />,
  Motherboard: <CircuitBoard className="h-3.5 w-3.5" />,
  RAM: <MemoryStick className="h-3.5 w-3.5" />,
  GPU: <Monitor className="h-3.5 w-3.5" />,
  Storage: <HardDrive className="h-3.5 w-3.5" />,
  PSU: <Zap className="h-3.5 w-3.5" />,
};

export function CategorySection({
  category,
  selectedIds,
  totalPrice,
  onSelect,
  onDeselect,
}: CategorySectionProps) {
  const components = MOCK_COMPONENTS.filter((c) => c.category === category);
  const selectedId = selectedIds[category];

  const incompatibleIds = new Set<string>();
  Object.values(selectedIds).forEach((selId) => {
    const selComp = MOCK_COMPONENTS.find((c) => c.id === selId);
    selComp?.incompatibleWith.forEach((id) => incompatibleIds.add(id));
  });

  return (
    <section
      aria-label={`${category} category`}
      id={`category-${category.toLowerCase()}`}
      className="mb-6"
    >
      {/* Category header */}
      <div className="flex items-center gap-2 mb-2 px-1 py-2">
        <span
          className={cn(
            "flex items-center gap-1.5 text-[11px] font-black cyber-text tracking-widest",
            selectedId ? "text-primary" : "text-muted-foreground"
          )}
        >
          {ICON_MAP[category]}
          {category.toUpperCase()}
        </span>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--border)) 0%, transparent 100%)" }} />
        {selectedId && (
          <span className="text-[9px] cyber-text text-primary font-bold">
            UNIT SELECTED
          </span>
        )}
      </div>

      {/* Card list */}
      <div
        role="listbox"
        aria-label={`Select ${category}`}
        aria-multiselectable="false"
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        {components.map((comp) => {
          const isSelected = selectedId === comp.id;
          const isDisabledByIncompatibility = !isSelected && incompatibleIds.has(comp.id);
          const currentCategoryPrice = selectedId
            ? MOCK_COMPONENTS.find((c) => c.id === selectedId)?.price ?? 0
            : 0;
          const projectedTotal = totalPrice - currentCategoryPrice + comp.price;
          const isDisabledByBudget = !isSelected && projectedTotal > 1000;

          return (
            <ComponentCard
              key={comp.id}
              component={comp}
              isSelected={isSelected}
              isDisabledByIncompatibility={isDisabledByIncompatibility}
              isDisabledByBudget={isDisabledByBudget}
              onSelect={onSelect}
              onDeselect={onDeselect}
            />
          );
        })}
      </div>
    </section>
  );
}
