import { Moon, Sun, RotateCcw, RotateCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Theme } from "@/types";
import { MAX_BUDGET } from "@/data/components";
import { cn } from "@/lib/utils";
import { useBuildActions } from "@/hooks/useBuildActions";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  totalPrice: number;
}

export function Header({ theme, onToggleTheme, totalPrice }: HeaderProps) {
  const { canUndo, canRedo, handleUndo, handleRedo } = useBuildActions();

  const pct = Math.min((totalPrice / MAX_BUDGET) * 100, 100);
  const isOver = totalPrice > MAX_BUDGET;
  const isWarn = pct >= 80;

  const barColor = isOver ? "bg-red-500" : isWarn ? "bg-orange-400" : "bg-primary";
  const capColor = isOver
    ? "text-red-400"
    : isWarn
    ? "text-orange-400"
    : "text-primary";

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border"
      style={{
        background:
          theme === "dark"
            ? "linear-gradient(90deg, hsl(228 25% 5%) 0%, hsl(224 20% 8%) 100%)"
            : "hsl(var(--card))",
      }}
      role="banner"
    >
      <div className="flex h-12 items-center px-4 gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-black tracking-widest text-primary cyber-text hidden sm:block">
            PC BUILDER PRO
          </span>
          <div className="hidden sm:block h-5 w-px bg-border" />
          <h1 className="text-xs font-black tracking-[0.2em] text-foreground cyber-text">
            SMART BUNDLE BUILDER
          </h1>
        </div>

        {/* Budget bar */}
        <div className="flex-1 flex items-center justify-center gap-3 px-4">
          <span className="text-[10px] cyber-text text-muted-foreground whitespace-nowrap hidden md:block">
            POWER CONSUMPTION:
          </span>
          <div className="flex-1 max-w-xs">
            <div
              className="h-1.5 rounded-full bg-muted overflow-hidden"
              role="progressbar"
              aria-valuenow={totalPrice}
              aria-valuemin={0}
              aria-valuemax={MAX_BUDGET}
              aria-label={`Budget: $${totalPrice} of $${MAX_BUDGET}`}
            >
              <div
                className={cn("h-full rounded-full transition-all duration-500", barColor)}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <span
            className={cn("text-[10px] font-bold cyber-text whitespace-nowrap", capColor)}
            aria-live="polite"
          >
            ${totalPrice} / ${MAX_BUDGET}
          </span>
          <span
            className={cn(
              "text-[10px] font-black cyber-text px-1.5 py-0.5 rounded border hidden sm:block",
              isOver
                ? "text-red-400 border-red-500/50 bg-red-500/10"
                : isWarn
                ? "text-orange-400 border-orange-500/50 bg-orange-500/10"
                : "text-primary border-primary/30 bg-primary/10"
            )}
            aria-label={`${Math.round(pct)}% of budget used`}
          >
            {Math.round(pct)}% CAP
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0" role="group" aria-label="History controls">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUndo}
                disabled={!canUndo}
                aria-label="Undo"
                aria-disabled={!canUndo}
                className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRedo}
                disabled={!canRedo}
                aria-label="Redo"
                aria-disabled={!canRedo}
                className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                {theme === "dark" ? (
                  <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Moon className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                aria-label="Settings"
              >
                <Settings className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
