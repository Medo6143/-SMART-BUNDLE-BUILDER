import { ShoppingCart } from "lucide-react";

interface FloatingCartBubbleProps {
  onClick: () => void;
  count: number;
}

export function FloatingCartBubble({ onClick, count }: FloatingCartBubbleProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all duration-200"
      aria-label="Toggle cart panel"
    >
      <ShoppingCart className="h-6 w-6" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-black text-white flex items-center justify-center border-2 border-background">
          {count}
        </span>
      )}
    </button>
  );
}
