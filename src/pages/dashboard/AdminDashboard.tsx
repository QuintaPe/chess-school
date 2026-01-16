import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  GraduationCap,
  Target,
  BookOpen,
  TrendingUp,
  CreditCard,
  Plus,
  Play,
  ArrowRight,
  MoreVertical,
  Calendar,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const AdminDashboard = () => {
  const { data: students, isLoading: loadingStudents } = useQuery<any[]>({
    queryKey: ["admin-students"],
    queryFn: () => api.users.list("student"),
  });

  const { data: classes, isLoading: loadingClasses } = useQuery<any[]>({
    queryKey: ["admin-classes"],
    queryFn: () => api.classes.list(),
  });

  const { data: puzzles, isLoading: loadingPuzzles } = useQuery<any[]>({
    queryKey: ["admin-puzzles"],
    queryFn: () => api.puzzles.list(),
  });

  const { data: courses, isLoading: loadingCourses } = useQuery<any[]>({
    queryKey: ["admin-courses"],
    queryFn: () => api.courses.list(),
  });

  const isLoading = loadingStudents || loadingClasses || loadingPuzzles || loadingCourses;

  const stats = [
    {
      label: "Total Alumnos",
      value: students?.length.toString() || "0",
      change: "+0%",
      icon: <Users className="w-6 h-6 text-primary" />,
      color: "primary",
    },
    {
      label: "Total Clases",
      value: classes?.length.toString() || "0",
      change: "+0",
      icon: <GraduationCap className="w-6 h-6 text-accent" />,
      color: "accent",
    },
    {
      label: "Problemas",
      value: puzzles?.length.toString() || "0",
      change: "+0",
      icon: <Target className="w-6 h-6 text-blue-500" />,
      color: "blue",
    },
    {
      label: "Cursos",
      value: courses?.length.toString() || "0",
      change: "+0",
      icon: <BookOpen className="w-6 h-6 text-green-500" />,
      color: "green",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: "Sistema",
      action: "Bienvenido al panel de administración",
      time: "Recién",
      initial: "S",
    },
  ];

  const upcomingClasses = classes?.filter(c => new Date(c.start_time) > new Date()).slice(0, 3) || [];

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Panel de Administración
            </h1>
            <p className="text-muted-foreground mt-1">
              Aquí tienes un resumen del estado actual de tu club
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Agenda
            </Button>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Contenido
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="p-6 bg-card border-border hover:border-primary/40 transition-colors group">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-foreground group-hover:scale-105 transition-transform origin-left">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-foreground">Actividad Reciente</h2>
              <Button variant="ghost" size="sm" className="text-primary">Ver todas</Button>
            </div>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
                    {activity.initial}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      <span className="font-bold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Tasks / Next Classes */}
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h2 className="text-lg font-serif font-bold text-foreground mb-4">Próximas Clases</h2>
              <div className="space-y-4">
                {upcomingClasses.length > 0 ? (
                  upcomingClasses.map((clase) => (
                    <div key={clase.id} className="p-4 rounded-xl bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors">
                      <h3 className="font-semibold text-foreground">{clase.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">
                            {new Date(clase.start_time).toLocaleString("es-ES", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-xs text-primary font-medium">{clase.level}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center py-4">No hay clases próximas.</p>
                )}
                <Button variant="outline" className="w-full text-xs h-9">Agenda Completa</Button>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h2 className="text-lg font-serif font-bold text-foreground mb-4">Estado del Sistema</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Backend API</span>
                  <span className="flex items-center text-green-500 font-medium">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    Operativo
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Storage</span>
                  <span className="text-foreground font-medium">12.4 / 50 GB</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '25%' }} />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-dashed hover:border-primary/50 hover:bg-primary/5 group" onClick={() => { }}>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-medium">Crear Problema</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-dashed hover:border-accent/50 hover:bg-accent/5 group" onClick={() => { }}>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4 text-accent" />
            </div>
            <span className="text-xs font-medium">Exportar Alumnos</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-dashed hover:border-blue-500/50 hover:bg-blue-500/5 group" onClick={() => { }}>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-xs font-medium">Ver Auditoría</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
