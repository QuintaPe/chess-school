import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  GraduationCap,
  Target,
  TrendingUp,
  Plus,
  Calendar,
  Clock,
  MoreVertical,
  Play,
} from "lucide-react";

const AdminDashboard = () => {
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
              Vista general de tu escuela de ajedrez
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Programar Clase
            </Button>
            <Button variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Problema
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alumnos Activos</p>
                <p className="text-3xl font-bold text-foreground mt-1">48</p>
                <p className="text-xs text-accent mt-1">+5 este mes</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clases Este Mes</p>
                <p className="text-3xl font-bold text-foreground mt-1">12</p>
                <p className="text-xs text-muted-foreground mt-1">3 programadas</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Problemas Creados</p>
                <p className="text-3xl font-bold text-foreground mt-1">342</p>
                <p className="text-xs text-muted-foreground mt-1">24 esta semana</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border-border hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Éxito</p>
                <p className="text-3xl font-bold text-foreground mt-1">72%</p>
                <p className="text-xs text-accent mt-1">+3% vs. mes anterior</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Próximas clases */}
          <Card className="p-6 bg-card border-border lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-semibold text-foreground">
                Próximas Clases
              </h2>
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Finales de Torre",
                  date: "Hoy, 18:00",
                  students: 8,
                  level: "Intermedio",
                  status: "live",
                },
                {
                  title: "Táctica: Clavadas y Descubiertas",
                  date: "Mañana, 17:00",
                  students: 12,
                  level: "Avanzado",
                  status: "scheduled",
                },
                {
                  title: "Introducción a las Aperturas",
                  date: "Viernes, 18:00",
                  students: 15,
                  level: "Principiante",
                  status: "scheduled",
                },
              ].map((clase, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        clase.status === "live"
                          ? "bg-accent/20"
                          : "bg-primary/10"
                      }`}
                    >
                      {clase.status === "live" ? (
                        <Play className="w-5 h-5 text-accent" />
                      ) : (
                        <Calendar className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{clase.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {clase.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {clase.students} alumnos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        clase.status === "live"
                          ? "bg-accent/20 text-accent"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {clase.status === "live" ? "En vivo" : clase.level}
                    </span>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actividad de alumnos */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
              Alumnos Destacados
            </h2>
            <div className="space-y-4">
              {[
                { name: "Carlos García", problems: 45, streak: 15, progress: 92 },
                { name: "María López", problems: 38, streak: 12, progress: 85 },
                { name: "Juan Martínez", problems: 32, streak: 8, progress: 78 },
                { name: "Ana Fernández", problems: 28, streak: 6, progress: 71 },
              ].map((student, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[hsl(35_90%_45%)] flex items-center justify-center text-primary-foreground font-semibold">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {student.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {student.problems} problemas
                      </span>
                      <span className="text-xs text-primary">
                        🔥 {student.streak} días
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-accent">
                      {student.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              Ver todos los alumnos
            </Button>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-card border-border hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Crear Problema</p>
                <p className="text-sm text-muted-foreground">
                  Añade un nuevo ejercicio
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-accent/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Play className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Iniciar Clase</p>
                <p className="text-sm text-muted-foreground">
                  Comienza una sesión en vivo
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-blue-500/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <GraduationCap className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Nueva Lección</p>
                <p className="text-sm text-muted-foreground">
                  Sube contenido educativo
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
