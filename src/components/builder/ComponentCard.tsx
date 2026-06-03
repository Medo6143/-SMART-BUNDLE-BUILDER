import { Component } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ComponentCardProps {
  component: Component;
  isSelected: boolean;
  isDisabledByIncompatibility: boolean;
  isDisabledByBudget: boolean;
  onSelect: (component: Component) => void;
  onDeselect: (category: string) => void;
}

export function ComponentCard({
  component,
  isSelected,
  isDisabledByIncompatibility,
  isDisabledByBudget,
  onSelect,
  onDeselect,
}: ComponentCardProps) {
  const isDisabled = !isSelected && (isDisabledByIncompatibility || isDisabledByBudget);

  const disabledReason = isDisabledByIncompatibility
    ? "SOCKET / PLATFORM INCOMPATIBLE"
    : isDisabledByBudget
    ? "EXCEEDS BUDGET"
    : undefined;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isDisabled) return;
      if (isSelected) onDeselect(component.category);
      else onSelect(component);
    }
  }

  const cardLabel = [
    component.name,
    `$${component.price}`,
    isSelected ? "Selected" : "",
    isDisabledByIncompatibility ? "Incompatible" : "",
    isDisabledByBudget ? "Exceeds budget" : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      aria-label={cardLabel}
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (isDisabled) return;
        if (isSelected) onDeselect(component.category);
        else onSelect(component);
      }}
      className={cn(
        "relative flex overflow-hidden rounded-sm transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "cursor-pointer select-none",
        "h-[130px]",
        isSelected
          ? "border border-primary/60 bg-card glow-primary-sm"
          : "border border-border bg-card hover:border-primary/30",
        isDisabled && "cursor-not-allowed"
      )}
    >
      {/* Component image */}
      <div
        className={cn(
          "relative w-36 shrink-0 overflow-hidden",
          isDisabledByIncompatibility && "grayscale opacity-30",
          isDisabledByBudget && !isDisabledByIncompatibility && "opacity-50"
        )}
      >
        {component.image ? (
          <img
            src={component.image}
            alt={component.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-xs">No image</span>
          </div>
        )}

        {/* Dark gradient over image */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />

        {/* Disabled overlay */}
        {isDisabledByIncompatibility && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-[9px] font-black cyber-text text-red-400 text-center px-1 leading-tight">
              CRITICAL
              <br />
              MISMATCH
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex flex-col justify-between flex-1 px-4 py-3 min-w-0",
          (isDisabledByIncompatibility || (isDisabledByBudget && !isSelected)) && "opacity-40"
        )}
      >
        <div>
          <div className="flex items-start gap-2 mb-1">
            <h3
              className={cn(
                "font-bold text-sm leading-tight",
                isSelected ? "text-foreground" : "text-foreground/80"
              )}
            >
              {component.name}
            </h3>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {component.specs.map((spec) => (
              <span
                key={spec}
                className="text-[10px] cyber-text text-primary/80 leading-tight"
              >
                {spec}
              </span>
            ))}
          </div>

          {isDisabledByIncompatibility && !isSelected && (
            <p className="text-[10px] text-red-400 cyber-text mt-1">
              {disabledReason}
            </p>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between gap-2">
          <span
            className={cn(
              "text-base font-bold",
              isSelected ? "text-foreground" : "text-muted-foreground"
            )}
          >
            ${component.price.toFixed(2)}
          </span>

          {!isDisabledByIncompatibility && (
            <Button
              variant={isSelected ? "outline" : "default"}
              size="sm"
              disabled={isDisabled}
              className={cn(
                "h-7 text-xs font-bold cyber-text tracking-wider",
                isSelected
                  ? "border-primary/50 text-primary hover:bg-destructive hover:text-white hover:border-destructive"
                  : "bg-primary text-white hover:bg-primary/80"
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (isDisabled) return;
                if (isSelected) onDeselect(component.category);
                else onSelect(component);
              }}
              aria-label={
                isSelected
                  ? `Swap ${component.name}`
                  : `Equip ${component.name}`
              }
            >
              {isSelected ? "SWAP" : "EQUIP"}
            </Button>
          )}
        </div>
      </div>

      {/* Selected badge */}
      {isSelected && (
        <div
          className="absolute top-0 right-0 bg-primary px-2 py-0.5 text-[9px] font-black cyber-text text-white"
          aria-hidden="true"
        >
          SELECTED UNIT
        </div>
      )}

      {/* Left accent bar */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" aria-hidden="true" />
      )}
    </div>
  );
}
