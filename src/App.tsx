import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ClasesPage from "./pages/ClasesPage";
import ProblemasPage from "./pages/ProblemasPage";
import CursosPage from "./pages/CursosPage";
import ProfesoresPage from "./pages/ProfesoresPage";
import PreciosPage from "./pages/PreciosPage";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import PGNPage from "./pages/PGNPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/clases" element={<ClasesPage />} />
          <Route path="/problemas" element={<ProblemasPage />} />
          <Route path="/cursos" element={<CursosPage />} />
          <Route path="/profesores" element={<ProfesoresPage />} />
          <Route path="/precios" element={<PreciosPage />} />
          <Route path="/visor" element={<PGNPage />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
