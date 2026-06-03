import { MAX_BUDGET } from "@/data/components";
import { cn } from "@/lib/utils";

interface BudgetBarProps {
  total: number;
  variant?: "default" | "mobile";
}

/**
 * Unified BudgetBar component that handles both desktop and mobile layouts
 * Uses Tailwind's responsive design instead of creating separate components
 */
export function BudgetBar({ total, variant = "default" }: BudgetBarProps) {
  const pct = Math.min((total / MAX_BUDGET) * 100, 100);
  const remaining = MAX_BUDGET - total;
  const isOver = total > MAX_BUDGET;
  const isWarn = pct >= 80;

  const fillColor = isOver
    ? "bg-red-500"
    : isWarn
    ? "bg-orange-400"
    : "bg-primary";

  const textColor = isOver
    ? "text-red-400"
    : isWarn
    ? "text-orange-400"
    : "text-primary";

  // Mobile variant - fixed at bottom
  if (variant === "mobile") {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-sidebar/95 backdrop-blur"
        role="region"
        aria-label="Budget tracker"
      >
        {/* Progress fill bar */}
        <div className="h-1 w-full bg-muted overflow-hidden">
          <div
            className={cn("h-full transition-all duration-500", fillColor)}
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={total}
            aria-valuemin={0}
            aria-valuemax={MAX_BUDGET}
            aria-label={`Budget ${Math.round(pct)}% used`}
          />
        </div>

        {/* Info row */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] cyber-text text-muted-foreground tracking-wider">
              BUDGET
            </span>
            <span className={cn("text-xs font-black cyber-text", textColor)} aria-live="polite">
              ${total.toFixed(0)}
              <span className="text-muted-foreground font-normal"> / ${MAX_BUDGET}</span>
            </span>
          </div>

          <span
            className={cn(
              "text-[10px] font-bold cyber-text tracking-wider px-2 py-0.5 rounded-sm border",
              isOver
                ? "text-red-400 border-red-500/40 bg-red-500/10"
                : isWarn
                ? "text-orange-400 border-orange-500/40 bg-orange-500/10"
                : "text-primary border-primary/30 bg-primary/10"
            )}
            aria-live="polite"
          >
            {isOver
              ? `+$${Math.abs(remaining).toFixed(0)} OVER`
              : `$${remaining.toFixed(0)} LEFT`}
          </span>
        </div>
      </div>
    );
  }

  // Default variant - desktop
  return (
    <div
      className="px-4 py-3 border-b border-border bg-muted/30"
      role="region"
      aria-label="Budget tracker"
    >
      <div className="flex justify-between items-center mb-1.5 text-xs font-medium">
        <span className="text-muted-foreground">Budget Used</span>
        <span className={cn("font-bold", textColor)}>
          {isOver ? (
            <span role="alert" aria-live="polite">
              Over by ${Math.abs(remaining).toFixed(0)}!
            </span>
          ) : (
            <span aria-live="polite">${remaining.toFixed(0)} remaining</span>
          )}
        </span>
      </div>

      <div
        className="w-full h-2.5 rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuenow={total}
        aria-valuemin={0}
        aria-valuemax={MAX_BUDGET}
        aria-label={`Budget: $${total} of $${MAX_BUDGET}`}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", fillColor)}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>${total.toFixed(0)}</span>
        <span>{Math.round(pct)}%</span>
        <span>${MAX_BUDGET}</span>
      </div>

      {isOver && (
        <p
          role="alert"
          className="mt-2 text-xs text-destructive bg-destructive/10 rounded px-2 py-1 font-medium"
        >
          ⚠ Budget exceeded! Remove some components to continue.
        </p>
      )}
    </div>
  );
}
