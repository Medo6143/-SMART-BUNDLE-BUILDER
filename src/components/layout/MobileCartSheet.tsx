import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartPanel } from "@/components/cart/CartPanel";

interface MobileCartSheetProps {
  selectedIds: Record<string, string>;
  total: number;
  selectedCount: number;
  onClearBuild: () => void;
}


 // Floating action button + slide-in sheet used only on mobile (hidden on lg+).

export function MobileCartSheet({
  selectedIds,
  total,
  selectedCount,
  onClearBuild,
}: MobileCartSheetProps) {
  return (
    <div className="fixed bottom-4 right-4 lg:hidden z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 relative"
            aria-label={`Cart — ${selectedCount} selected`}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {selectedCount > 0 && (
              <span
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-black cyber-text flex items-center justify-center"
                aria-hidden="true"
              >
                {selectedCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-72 p-0 flex flex-col bg-sidebar border-l border-border"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Build Summary</SheetTitle>
          </SheetHeader>
          <CartPanel
            selectedIds={selectedIds}
            total={total}
            onClearBuild={onClearBuild}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
