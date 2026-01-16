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

// Student Dashboard Pages
import StudentClasses from "./pages/dashboard/student/StudentClasses";
import StudentPuzzles from "./pages/dashboard/student/StudentPuzzles";
import StudentCourses from "./pages/dashboard/student/StudentCourses";
import StudentCourseDetail from "./pages/dashboard/student/StudentCourseDetail";
import StudentProgress from "./pages/dashboard/student/StudentProgress";
import StudentSettings from "./pages/dashboard/student/StudentSettings";

// Admin Dashboard Pages
import AdminStudents from "./pages/dashboard/admin/AdminStudents";
import AdminClasses from "./pages/dashboard/admin/AdminClasses";
import AdminPuzzles from "./pages/dashboard/admin/AdminPuzzles";
import AdminContent from "./pages/dashboard/admin/AdminContent";
import AdminCourseDetail from "./pages/dashboard/admin/AdminCourseDetail";
import AdminStats from "./pages/dashboard/admin/AdminStats";

const queryClient = new QueryClient();

import { AuthProvider } from "./context/AuthContext";

import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { PublicRoute } from "./components/layout/PublicRoute";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/clases" element={<ClasesPage />} />
            <Route path="/problemas" element={<ProblemasPage />} />
            <Route path="/cursos" element={<CursosPage />} />
            <Route path="/profesores" element={<ProfesoresPage />} />
            <Route path="/precios" element={<PreciosPage />} />
            <Route path="/visor" element={<PGNPage />} />

            {/* Public Only Route (Login/Register) */}
            <Route element={<PublicRoute />}>
              <Route path="/auth" element={<AuthPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/dashboard/clases" element={<StudentClasses />} />
              <Route path="/dashboard/problemas" element={<StudentPuzzles />} />
              <Route path="/dashboard/cursos" element={<StudentCourses />} />
              <Route path="/dashboard/cursos/:id" element={<StudentCourseDetail />} />
              <Route path="/dashboard/progreso" element={<StudentProgress />} />
              <Route path="/dashboard/configuracion" element={<StudentSettings />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/alumnos" element={<AdminStudents />} />
              <Route path="/admin/clases" element={<AdminClasses />} />
              <Route path="/admin/problemas" element={<AdminPuzzles />} />
              <Route path="/admin/contenido" element={<AdminContent />} />
              <Route path="/admin/contenido/:id" element={<AdminCourseDetail />} />
              <Route path="/admin/estadisticas" element={<AdminStats />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
