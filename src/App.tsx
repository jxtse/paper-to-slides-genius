
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner"; // Corrected import name from Toaster to Sonner
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ProtectedPage from "./pages/ProtectedPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth"; // Import AuthProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider> {/* Wrap with AuthProvider */}
      <TooltipProvider>
        <Toaster />
        <Sonner /> {/* If you're using next-themes, ensure it's configured, or remove if not used */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/protected" element={<ProtectedPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
