import { Button } from "@/components/ui/button";
import { CATEGORIES, MOCK_COMPONENTS, MAX_BUDGET } from "@/data/components";
import { cn } from "@/lib/utils";
import { Cpu, CircuitBoard, MemoryStick, Monitor, HardDrive, Zap } from "lucide-react";

interface CategorySidebarProps {
  selectedIds: Record<string, string>;
  totalPrice: number;
  selectedCount: number;
  onClearBuild: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  CPU: <Cpu className="h-3.5 w-3.5" />,
  Motherboard: <CircuitBoard className="h-3.5 w-3.5" />,
  RAM: <MemoryStick className="h-3.5 w-3.5" />,
  GPU: <Monitor className="h-3.5 w-3.5" />,
  Storage: <HardDrive className="h-3.5 w-3.5" />,
  PSU: <Zap className="h-3.5 w-3.5" />,
};

const CAT_LABELS: Record<string, string> = {
  CPU: "PROCESSORS",
  Motherboard: "MOTHERBOARDS",
  RAM: "RAM MODULES",
  GPU: "GRAPHICS CARDS",
  Storage: "STORAGE DRIVES",
  PSU: "POWER SUPPLY",
};

function scrollToCategory(category: string) {
  document
    .getElementById(`category-${category.toLowerCase()}`)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CategorySidebar({
  selectedIds,
  totalPrice,
  selectedCount,
  onClearBuild,
}: CategorySidebarProps) {
  const lastSelectedComp = Object.values(selectedIds)
    .map((id) => MOCK_COMPONENTS.find((c) => c.id === id)!)
    .filter(Boolean)
    .at(-1);

  return (
    <nav
      className="hidden md:flex flex-col w-44 border-r border-border shrink-0 bg-sidebar"
      aria-label="Component categories"
    >
      {/* Category nav links */}
      <ul role="list" className="flex flex-col gap-0.5 p-2 flex-1">
        {CATEGORIES.map((cat) => {
          const isActive = !!selectedIds[cat];
          return (
            <li key={cat}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2.5 text-[11px] font-bold h-9 rounded-sm cyber-text tracking-wider",
                  isActive
                    ? "bg-sidebar-primary text-white hover:bg-sidebar-primary/90"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                onClick={() => scrollToCategory(cat)}
                aria-label={`${CAT_LABELS[cat]}${isActive ? " — selected" : ""}`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className={isActive ? "text-white" : "text-sidebar-foreground/50"}>
                  {ICON_MAP[cat]}
                </span>
                {CAT_LABELS[cat]}
              </Button>
            </li>
          );
        })}
      </ul>

      {/* Bottom: thumbnail + total + clear */}
      <div className="border-t border-sidebar-border p-3 space-y-3">
        {lastSelectedComp?.image && (
          <div className="rounded-sm overflow-hidden h-16 relative">
            <img
              src={lastSelectedComp.image}
              alt={lastSelectedComp.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sidebar/80 to-transparent" />
          </div>
        )}

        <div>
          <p
            className={cn(
              "text-xl font-black cyber-text",
              totalPrice > MAX_BUDGET ? "text-red-400" : "text-primary"
            )}
            aria-label={`Total: $${totalPrice}`}
          >
            ${totalPrice.toFixed(0)}
          </p>
          <p className="text-[10px] text-sidebar-foreground/50 cyber-text">
            OF ${MAX_BUDGET} BUDGET
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full h-7 text-[10px] cyber-text font-bold tracking-widest rounded-sm border-border text-muted-foreground hover:text-destructive hover:border-destructive"
          onClick={onClearBuild}
          disabled={selectedCount === 0}
          aria-label="Clear all selected components"
        >
          CLEAR BUILD
        </Button>
      </div>
    </nav>
  );
}
