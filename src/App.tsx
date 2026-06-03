import { useState } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "@/components/layout/Header";
import { FloatingCartBubble } from "@/components/layout/FloatingCartBubble";
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

          <FloatingCartBubble
            onClick={() => setCartOpen((prev) => !prev)}
            count={selectedCount}
          />

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
