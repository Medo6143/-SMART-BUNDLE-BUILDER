import { useState } from "react";
import { Toaster } from "sonner";
import { ShoppingCart } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "@/components/layout/Header";
import { BuilderPage } from "@/pages/BuilderPage";
import { useBuildActions } from "@/hooks/useBuildActions";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { totalPrice, selectedCount } = useBuildActions();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className={theme}>
      <div className="min-h-screen bg-background text-foreground">
        <TooltipProvider delayDuration={300}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
          >
            Skip to main content
          </a>

          <Header
            theme={theme}
            onToggleTheme={toggleTheme}
            totalPrice={totalPrice}
          />

          {/* Floating cart bubble */}
          <button
            onClick={() => setCartOpen((prev) => !prev)}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all duration-200"
            aria-label="Toggle cart panel"
          >
            <ShoppingCart className="h-6 w-6" aria-hidden="true" />
            {selectedCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-black text-white flex items-center justify-center border-2 border-background">
                {selectedCount}
              </span>
            )}
          </button>

          <BuilderPage
            isCartOpen={cartOpen}
            onCloseCart={() => setCartOpen(false)}
          />

          <Toaster
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{ duration: 3000 }}
          />
        </TooltipProvider>
      </div>
    </div>
  );
}

export default App;
