import { Download, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Component } from "@/types";
import { MOCK_COMPONENTS, MAX_BUDGET } from "@/data/components";
import { exportBuildToPDF } from "@/services/pdfExport";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CartPanelProps {
  selectedIds: Record<string, string>;
  total: number;
  onClearBuild: () => void;
}

export function CartPanel({ selectedIds, total, onClearBuild }: CartPanelProps) {
  const selectedComponents: Component[] = Object.values(selectedIds)
    .map((id) => MOCK_COMPONENTS.find((c) => c.id === id)!)
    .filter(Boolean);

  const isOverBudget = total > MAX_BUDGET;
  const isEmpty = selectedComponents.length === 0;

  function handleExportPDF() {
    if (isEmpty) {
      toast.error("Nothing to export — add some components first!");
      return;
    }
    try {
      exportBuildToPDF({
        selectedComponents,
        total,
        buildDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      toast.success("Build summary exported as PDF!");
    } catch {
      toast.error("Failed to export PDF. Please try again.");
    }
  }

  function handleClearBuild() {
    if (isEmpty) return;
    onClearBuild();
    toast.info("Build cleared.");
  }

  return (
    <aside
      className="flex flex-col h-full border-l border-border bg-sidebar"
      aria-label="Build summary"
      role="complementary"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black cyber-text tracking-widest text-foreground">
            SYSTEM CONFIG
          </span>
        </div>
      </div>

      {/* Item list */}
      <ScrollArea className="flex-1 px-4 py-3">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <p className="text-xs cyber-text text-muted-foreground">
              NO COMPONENTS
              <br />
              SELECTED
            </p>
          </div>
        ) : (
          <ul role="list" aria-label="Selected components" className="space-y-3">
            {selectedComponents.map((comp) => (
              <li
                key={comp.id}
                className="flex items-start justify-between gap-2"
                aria-label={`${comp.name}, ${comp.category}, $${comp.price}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate text-foreground leading-tight">
                    {comp.name.toUpperCase()}
                  </p>
                  <p className="text-[10px] cyber-text text-muted-foreground mt-0.5 tracking-wide">
                    {comp.category.toUpperCase()}
                  </p>
                </div>
                <span className="text-xs font-bold text-primary shrink-0">
                  ${comp.price.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>

      {/* Bottom section */}
      <div className="border-t border-border p-4 space-y-3">
        {/* Grand total */}
        <div
          className="flex items-baseline justify-between"
          aria-label={`Grand total: $${total}`}
        >
          <span className="text-[11px] font-black cyber-text tracking-widest text-muted-foreground">
            GRAND TOTAL
          </span>
          <span
            className={cn(
              "text-xl font-black cyber-text",
              isOverBudget ? "text-red-400" : "text-primary"
            )}
            aria-live="polite"
          >
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Main action button */}
        <Button
          className="w-full h-10 text-xs font-black cyber-text tracking-widest bg-primary hover:bg-primary/90 rounded-sm"
          disabled={isEmpty}
          aria-label="Export build summary as PDF"
        >
          CHECKOUT
        </Button>

        {/* Secondary buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-[10px] cyber-text font-bold tracking-wider rounded-sm border-border text-muted-foreground hover:text-destructive hover:border-destructive"
            onClick={handleClearBuild}
            disabled={isEmpty}
            aria-label="Clear all components"
          >
            <Trash2 className="h-3 w-3 mr-1.5" aria-hidden="true" />
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-[10px] cyber-text font-bold tracking-wider rounded-sm border-border text-muted-foreground hover:text-primary hover:border-primary"
            onClick={handleExportPDF}
            disabled={isEmpty}
            aria-label="Save build log as PDF"
          >
            <Download className="h-3 w-3 mr-1.5" aria-hidden="true" />
            Save PDF
          </Button>
        </div>
      </div>
    </aside>
  );
}
