import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Crown,
  LayoutDashboard,
  GraduationCap,
  Target,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const SidebarLink = ({ to, icon, label, collapsed }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "admin" | "student";
}

export const DashboardLayout = ({ children, role = "student" }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const studentLinks = [
    { to: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Inicio" },
    { to: "/dashboard/clases", icon: <GraduationCap className="w-5 h-5" />, label: "Mis Clases" },
    { to: "/dashboard/problemas", icon: <Target className="w-5 h-5" />, label: "Problemas" },
    { to: "/dashboard/cursos", icon: <BookOpen className="w-5 h-5" />, label: "Cursos" },
    { to: "/dashboard/progreso", icon: <BarChart3 className="w-5 h-5" />, label: "Mi Progreso" },
  ];

  const adminLinks = [
    { to: "/admin", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    { to: "/admin/alumnos", icon: <Users className="w-5 h-5" />, label: "Alumnos" },
    { to: "/admin/clases", icon: <GraduationCap className="w-5 h-5" />, label: "Clases" },
    { to: "/admin/problemas", icon: <Target className="w-5 h-5" />, label: "Problemas" },
    { to: "/admin/contenido", icon: <BookOpen className="w-5 h-5" />, label: "Contenido" },
    { to: "/admin/estadisticas", icon: <BarChart3 className="w-5 h-5" />, label: "Estadísticas" },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Club Reino Ajedrez"
              className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-primary/25 shrink-0"
            />
            {!collapsed && (
              <span className="text-lg font-serif font-bold text-sidebar-foreground">
                Club Reino Ajedrez
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <SidebarLink key={link.to} {...link} collapsed={collapsed} />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <SidebarLink
            to="/dashboard/configuracion"
            icon={<Settings className="w-5 h-5" />}
            label="Configuración"
            collapsed={collapsed}
          />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Cerrar Sesión</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
};
