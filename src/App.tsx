import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { BottomNav } from "@/components/BottomNav";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import { TicTacToeGame } from "./games/TicTacToe";
import { MemoryGame } from "./games/MemoryGame";
import { NumberGuessGame } from "./games/NumberGuessGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/games/tictactoe" element={<TicTacToeGame />} />
              <Route path="/games/memory" element={<MemoryGame />} />
              <Route path="/games/number" element={<NumberGuessGame />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <BottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
